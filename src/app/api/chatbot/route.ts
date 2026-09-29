import { NextRequest, NextResponse } from "next/server";
import { createRouteClient } from "@/lib/supabase/route-client";
import { isHarmfulQuery, isInDomainQuery, matchSmallTalk } from "@/lib/chatbot/guardrails";
import { matchFaq, matchTreeRoot, matchTreeChild } from "@/lib/chatbot/match";
import { matchSitePage } from "@/lib/chatbot/sitePages";
import type { FAQEntry, ChatbotNode } from "@/types";

// No-LLM chatbot brain. Every question is handled by one of, in order:
//   1. Harmful/abusive topic         -> hard refusal, nothing else runs
//   2. Greeting/small talk           -> canned reply, common sense only
//   3. Site-navigation intent (matchSitePage) -> immediate redirect to the
//      real page, before any tree/FAQ matching runs.
//   4. An active decision-tree branch (activeNodeId sent by the client) ->
//      does the follow-up match one of THIS node's next-question options?
//      If yes, descend the tree (give that node's answer + its own
//      children as new options). If no, the branch is "cut" and the query
//      falls through to a fresh top-level evaluation below — it may start
//      a different tree, land as a flat FAQ, or reach the same
//      no-match/out-of-domain outcomes as any other fresh question.
//   5. A fresh top-level match against a pipeline's root trigger (Quotation,
//      Booking, Customs Clearance, Vendor/Agent Onboarding, Warehousing &
//      Distribution, Sourcing & Procurement) -> give that pipeline's
//      overview answer plus its first-level next-question options.
//   6. A confident flat FAQ match (company info, individual service facts,
//      site navigation, contact) via matchFaq -> direct answer.
//   7. Not in Transpeed's logistics domain at all -> refusal, no handoff
//      offered. Checked here — after a confident match, before
//      suggestions — because a handful of loosely-related "did you mean"
//      suggestions almost always exist somewhere in the FAQ table even for
//      a genuinely off-topic question; the in-domain check is what stops
//      those weak suggestions from being shown for something like "what's
//      the weather today."
//   8. In-domain, no confident match:
//      a. a few plausible "did you mean" suggestions -> shown as options
//      b. nothing close enough at all -> a genuine knowledge-base gap. The
//         widget logs it (POST { action: "log-unanswered" }) so it reaches
//         Admin's "New Questions" list, where staff can answer it and grow
//         the FAQ knowledge base for next time, and shows Transpeed's
//         contact details so the visitor can reach out directly right away.
//         No contact-details capture on the visitor's side — that path was
//         tried and retired (Supabase's public API silently no-op'd updates
//         made with this project's key for this table, traced end to end),
//         and logging + "contact us directly" already covers the need.
//
// Trees and FAQ entries are both stored in Supabase (chatbot_nodes /
// faq_entries) and editable from Admin > Chatbot, without a code deploy.

const HARMFUL_REFUSAL =
  "I'm not able to help with that kind of question. If there's something about our logistics services I can help with, I'm happy to.";
const OUT_OF_DOMAIN_REFUSAL =
  "That's outside what I can help with. I'm built to answer questions about Transpeed's freight, customs, warehousing, and logistics services. Try asking about shipping, quotes, or our services instead.";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.action !== "string") {
    return NextResponse.json({ error: "Missing action" }, { status: 400 });
  }

  const supabase = createRouteClient();

  if (body.action === "search") {
    const query = typeof body.query === "string" ? body.query.trim() : "";
    const activeNodeId = typeof body.activeNodeId === "string" ? body.activeNodeId : null;

    if (!query) {
      return NextResponse.json({ best: null, suggestions: [], activeNodeId: null });
    }

    if (isHarmfulQuery(query)) {
      return NextResponse.json({ refusal: { type: "harmful", message: HARMFUL_REFUSAL }, activeNodeId: null });
    }

    const smallTalk = matchSmallTalk(query);
    if (smallTalk) {
      return NextResponse.json({ smallTalk: true, text: smallTalk, activeNodeId: null });
    }

    // Site-navigation intent ("terms and conditions", "where's your
    // privacy policy") wins immediately, before any tree/FAQ matching —
    // the visitor gets redirected straight to the real page instead of
    // being told about it (2026-09-29, per Vignesh).
    const sitePage = matchSitePage(query);
    if (sitePage) {
      return NextResponse.json({ redirect: sitePage, activeNodeId: null });
    }

    const { data: nodeRows, error: nodeError } = await supabase
      .from("chatbot_nodes")
      .select("id, parent_id, label, trigger_keywords, answer, sort_order")
      .order("sort_order", { ascending: true });

    if (nodeError) {
      return NextResponse.json({ error: nodeError.message }, { status: 500 });
    }

    const nodes = (nodeRows as ChatbotNode[]) ?? [];
    const childrenOf = (parentId: string) => nodes.filter((n) => n.parent_id === parentId);

    function treeResponse(node: ChatbotNode) {
      const children = childrenOf(node.id);
      return NextResponse.json({
        tree: {
          nodeId: node.id,
          answer: node.answer,
          options: children.map((c) => ({ id: c.id, label: c.label })),
        },
        activeNodeId: children.length > 0 ? node.id : null,
      });
    }

    if (activeNodeId) {
      const childMatch = matchTreeChild(query, childrenOf(activeNodeId));
      if (childMatch) {
        return treeResponse(childMatch.node);
      }
      // Follow-up doesn't belong to the active branch — cut the tree and
      // fall through to a completely fresh evaluation of this query.
    }

    const roots = nodes.filter((n) => n.parent_id === null);
    const rootMatch = matchTreeRoot(query, roots);
    if (rootMatch) {
      return treeResponse(rootMatch.node);
    }

    const { data: faqRows, error: faqError } = await supabase
      .from("faq_entries")
      .select("id, category, question, keywords, answer");

    if (faqError) {
      return NextResponse.json({ error: faqError.message }, { status: 500 });
    }

    const result = matchFaq(query, (faqRows as FAQEntry[]) ?? []);

    if (result.type === "best") {
      return NextResponse.json({ best: { entry: result.entry, score: result.score }, suggestions: [], activeNodeId: null });
    }

    // No confident FAQ match — before offering "did you mean" suggestions
    // (which can surface even for an off-topic query, since something in a
    // 40+ row FAQ table usually shares a stray word with almost anything),
    // check whether this is even in Transpeed's domain at all.
    if (!isInDomainQuery(query)) {
      return NextResponse.json({ refusal: { type: "out-of-domain", message: OUT_OF_DOMAIN_REFUSAL }, activeNodeId: null });
    }

    if (result.type === "suggestions") {
      return NextResponse.json({ best: null, suggestions: result.matches, activeNodeId: null });
    }

    // In-domain, nothing close enough at all — a genuine knowledge-base gap.
    return NextResponse.json({ best: null, suggestions: [], activeNodeId: null });
  }

  if (body.action === "log-unanswered") {
    // Always a fresh insert — the moment the widget can't answer something,
    // it logs the bare question here so it always reaches Admin's New
    // Questions list, no contact details involved yet.
    const question = typeof body.question === "string" ? body.question.trim().slice(0, 2000) : "";

    if (!question) {
      return NextResponse.json({ error: "Missing question" }, { status: 400 });
    }

    // Generate the id ourselves and insert it explicitly, rather than
    // relying on the table's default + reading it back with
    // .select().single(). This table deliberately has no SELECT policy
    // for anonymous visitors (see chatbot_schema.sql — a visitor can log a
    // question but never browse others' submissions), and Postgres
    // requires a freshly-inserted row to satisfy the table's SELECT
    // policy before it can come back via RETURNING — even for the row you
    // just inserted yourself. With no SELECT policy at all, that
    // RETURNING probe fails RLS every time, regardless of whether the
    // INSERT policy itself is correct. Supplying our own id and skipping
    // .select() avoids RETURNING entirely, so this never triggers that
    // check.
    const newId = crypto.randomUUID();
    const { error } = await supabase
      .from("chatbot_unanswered_questions")
      .insert({ id: newId, question });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, id: newId });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
