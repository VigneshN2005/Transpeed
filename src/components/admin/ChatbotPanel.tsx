"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import type { FAQEntry, ChatbotNode } from "@/types";

// Three sub-sections per the finalized Admin > Chatbot scope: a
// notifications list of questions the bot couldn't answer
// (chatbot_unanswered_questions), a full CRUD editor for the flat FAQ
// knowledge base (faq_entries), and a tree editor for the admin-controlled
// pipeline branches (chatbot_nodes) that drive the bot's guided,
// overview-then-next-question conversations. All three need the
// authenticated read/write policies from admin_schema.sql to work.

type UnansweredQuestion = {
  id: string;
  name: string | null;
  email: string | null;
  question: string;
  resolved: boolean;
  created_at: string;
};

const EMPTY_FAQ_FORM = { category: "", question: "", keywords: "", answer: "" };
const EMPTY_NODE_FORM = { label: "", triggerKeywords: "", answer: "" };
const EMPTY_ANSWER_FORM = { category: "", keywords: "", answer: "" };

const ANSWER_STOPWORDS = new Set([
  "what", "how", "can", "could", "would", "should", "the", "a", "an", "is",
  "are", "do", "does", "did", "i", "you", "we", "they", "it", "to", "of",
  "in", "on", "for", "and", "or", "my", "your", "our", "their", "that",
  "this", "these", "those", "with", "about", "please", "me", "us",
]);

// A starting point for the keywords field when answering a logged
// question — the admin edits it, this just saves typing out the obvious
// terms already sitting in the question itself.
function suggestKeywords(question: string): string {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const w of question.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/)) {
    if (w.length < 3 || ANSWER_STOPWORDS.has(w) || seen.has(w)) continue;
    seen.add(w);
    out.push(w);
  }
  return out.join(", ");
}

export default function ChatbotPanel() {
  const [subTab, setSubTab] = useState<"notifications" | "knowledge-base" | "process-trees">(
    "notifications"
  );

  // --- Notifications ---
  const [questions, setQuestions] = useState<UnansweredQuestion[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [questionsError, setQuestionsError] = useState<string | null>(null);

  async function loadQuestions() {
    setLoadingQuestions(true);
    setQuestionsError(null);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("chatbot_unanswered_questions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setQuestionsError(error.message);
    } else {
      setQuestions((data ?? []) as UnansweredQuestion[]);
    }
    setLoadingQuestions(false);
  }

  useEffect(() => {
    loadQuestions();
  }, []);

  async function markResolved(id: string, resolved: boolean) {
    const supabase = createClient();
    const { error } = await supabase
      .from("chatbot_unanswered_questions")
      .update({ resolved })
      .eq("id", id);
    if (!error) await loadQuestions();
  }

  async function deleteQuestion(id: string) {
    if (!confirm("Delete this entry?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("chatbot_unanswered_questions").delete().eq("id", id);
    if (!error) await loadQuestions();
  }

  // Answering a logged question here is what teaches the chatbot — it adds
  // a real FAQ entry (so matchFaq can find it next time someone asks
  // something similar) and marks this notification resolved in the same
  // step, rather than just clearing the notification with nothing learned.
  const [answeringId, setAnsweringId] = useState<string | null>(null);
  const [answerForm, setAnswerForm] = useState(EMPTY_ANSWER_FORM);
  const [savingAnswer, setSavingAnswer] = useState(false);
  const [answerError, setAnswerError] = useState<string | null>(null);

  function startAnswer(q: UnansweredQuestion) {
    setAnsweringId(q.id);
    setAnswerForm({ category: "", keywords: suggestKeywords(q.question), answer: "" });
    setAnswerError(null);
  }

  function cancelAnswer() {
    setAnsweringId(null);
    setAnswerForm(EMPTY_ANSWER_FORM);
    setAnswerError(null);
  }

  async function submitAnswer(q: UnansweredQuestion) {
    setSavingAnswer(true);
    setAnswerError(null);

    try {
      const supabase = createClient();
      const { error: faqInsertError } = await supabase.from("faq_entries").insert({
        id: q.question
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
          .slice(0, 60),
        category: answerForm.category.trim() || null,
        question: q.question,
        keywords: answerForm.keywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean),
        answer: answerForm.answer.trim(),
      });
      if (faqInsertError) throw faqInsertError;

      const { error: resolveError } = await supabase
        .from("chatbot_unanswered_questions")
        .update({ resolved: true })
        .eq("id", q.id);
      if (resolveError) throw resolveError;

      cancelAnswer();
      await Promise.all([loadQuestions(), loadFaqs()]);
    } catch (err) {
      setAnswerError(err instanceof Error ? err.message : "Something went wrong saving this.");
    } finally {
      setSavingAnswer(false);
    }
  }

  // --- Knowledge base ---
  const [faqs, setFaqs] = useState<FAQEntry[]>([]);
  const [loadingFaqs, setLoadingFaqs] = useState(true);
  const [faqsLoadError, setFaqsLoadError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [faqForm, setFaqForm] = useState(EMPTY_FAQ_FORM);
  const [savingFaq, setSavingFaq] = useState(false);
  const [faqError, setFaqError] = useState<string | null>(null);

  async function loadFaqs() {
    setLoadingFaqs(true);
    setFaqsLoadError(null);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("faq_entries")
      .select("*")
      .order("category", { ascending: true });

    if (error) {
      setFaqsLoadError(error.message);
    } else {
      setFaqs((data ?? []) as FAQEntry[]);
    }
    setLoadingFaqs(false);
  }

  useEffect(() => {
    loadFaqs();
  }, []);

  function startEditFaq(faq: FAQEntry) {
    setEditingId(faq.id);
    setFaqForm({
      category: faq.category ?? "",
      question: faq.question,
      keywords: faq.keywords.join(", "),
      answer: faq.answer,
    });
    setFaqError(null);
  }

  function resetFaqForm() {
    setEditingId(null);
    setFaqForm(EMPTY_FAQ_FORM);
    setFaqError(null);
  }

  async function handleFaqSubmit(e: FormEvent) {
    e.preventDefault();
    setSavingFaq(true);
    setFaqError(null);

    try {
      const supabase = createClient();
      const payload = {
        category: faqForm.category.trim() || null,
        question: faqForm.question.trim(),
        keywords: faqForm.keywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean),
        answer: faqForm.answer.trim(),
      };

      const { error: saveError } = editingId
        ? await supabase.from("faq_entries").update(payload).eq("id", editingId)
        : await supabase.from("faq_entries").insert({
            id: faqForm.question
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "")
              .slice(0, 60),
            ...payload,
          });

      if (saveError) throw saveError;

      resetFaqForm();
      await loadFaqs();
    } catch (err) {
      setFaqError(err instanceof Error ? err.message : "Something went wrong saving this.");
    } finally {
      setSavingFaq(false);
    }
  }

  async function deleteFaq(id: string) {
    if (!confirm("Delete this FAQ entry? The chatbot will no longer be able to answer it.")) return;
    const supabase = createClient();
    const { error } = await supabase.from("faq_entries").delete().eq("id", id);
    if (!error) await loadFaqs();
  }

  // --- Process trees (chatbot_nodes) ---
  const [nodes, setNodes] = useState<ChatbotNode[]>([]);
  const [loadingNodes, setLoadingNodes] = useState(true);
  const [nodesLoadError, setNodesLoadError] = useState<string | null>(null);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  // null = adding a new root pipeline; a node id = adding a child under that
  // node. Ignored while editingNodeId is set (parent never changes on edit).
  const [nodeFormParentId, setNodeFormParentId] = useState<string | null>(null);
  const [showNodeForm, setShowNodeForm] = useState(false);
  const [nodeForm, setNodeForm] = useState(EMPTY_NODE_FORM);
  const [savingNode, setSavingNode] = useState(false);
  const [nodeError, setNodeError] = useState<string | null>(null);

  async function loadNodes() {
    setLoadingNodes(true);
    setNodesLoadError(null);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("chatbot_nodes")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      setNodesLoadError(error.message);
    } else {
      setNodes((data ?? []) as ChatbotNode[]);
    }
    setLoadingNodes(false);
  }

  useEffect(() => {
    loadNodes();
  }, []);

  const roots = nodes.filter((n) => n.parent_id === null);
  const childrenOf = (parentId: string) => nodes.filter((n) => n.parent_id === parentId);

  function startAddRoot() {
    setEditingNodeId(null);
    setNodeFormParentId(null);
    setNodeForm(EMPTY_NODE_FORM);
    setNodeError(null);
    setShowNodeForm(true);
  }

  function startAddChild(parentId: string) {
    setEditingNodeId(null);
    setNodeFormParentId(parentId);
    setNodeForm(EMPTY_NODE_FORM);
    setNodeError(null);
    setShowNodeForm(true);
  }

  function startEditNode(node: ChatbotNode) {
    setEditingNodeId(node.id);
    setNodeFormParentId(node.parent_id);
    setNodeForm({
      label: node.label,
      triggerKeywords: node.trigger_keywords.join(", "),
      answer: node.answer,
    });
    setNodeError(null);
    setShowNodeForm(true);
  }

  function cancelNodeForm() {
    setShowNodeForm(false);
    setEditingNodeId(null);
    setNodeFormParentId(null);
    setNodeForm(EMPTY_NODE_FORM);
    setNodeError(null);
  }

  async function handleNodeSubmit(e: FormEvent) {
    e.preventDefault();
    setSavingNode(true);
    setNodeError(null);

    try {
      const supabase = createClient();
      const payload = {
        label: nodeForm.label.trim(),
        trigger_keywords: nodeForm.triggerKeywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean),
        answer: nodeForm.answer.trim(),
      };

      if (editingNodeId) {
        const { error: saveError } = await supabase
          .from("chatbot_nodes")
          .update(payload)
          .eq("id", editingNodeId);
        if (saveError) throw saveError;
      } else {
        const siblings = nodeFormParentId ? childrenOf(nodeFormParentId) : roots;
        const nextSortOrder =
          siblings.length > 0 ? Math.max(...siblings.map((s) => s.sort_order)) + 1 : 0;
        const { error: saveError } = await supabase.from("chatbot_nodes").insert({
          parent_id: nodeFormParentId,
          sort_order: nextSortOrder,
          ...payload,
        });
        if (saveError) throw saveError;
      }

      cancelNodeForm();
      await loadNodes();
    } catch (err) {
      setNodeError(err instanceof Error ? err.message : "Something went wrong saving this.");
    } finally {
      setSavingNode(false);
    }
  }

  async function deleteNode(node: ChatbotNode) {
    const hasChildren = childrenOf(node.id).length > 0;
    const warning = hasChildren
      ? `Delete "${node.label}"? This also deletes every branch under it — that can't be undone.`
      : `Delete "${node.label}"?`;
    if (!confirm(warning)) return;
    const supabase = createClient();
    const { error } = await supabase.from("chatbot_nodes").delete().eq("id", node.id);
    if (!error) await loadNodes();
  }

  async function moveNode(node: ChatbotNode, direction: "up" | "down") {
    const siblings = (node.parent_id ? childrenOf(node.parent_id) : roots).slice().sort(
      (a, b) => a.sort_order - b.sort_order
    );
    const index = siblings.findIndex((s) => s.id === node.id);
    const swapWith = direction === "up" ? siblings[index - 1] : siblings[index + 1];
    if (!swapWith) return;

    const supabase = createClient();
    const [a, b] = await Promise.all([
      supabase.from("chatbot_nodes").update({ sort_order: swapWith.sort_order }).eq("id", node.id),
      supabase.from("chatbot_nodes").update({ sort_order: node.sort_order }).eq("id", swapWith.id),
    ]);
    if (!a.error && !b.error) await loadNodes();
  }

  const unresolvedCount = questions.filter((q) => !q.resolved).length;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSubTab("notifications")}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide ${
            subTab === "notifications"
              ? "bg-brand text-white"
              : "border border-zinc-300 text-zinc-500 hover:border-brand hover:text-brand-dark"
          }`}
        >
          New Questions{unresolvedCount > 0 && ` (${unresolvedCount})`}
        </button>
        <button
          type="button"
          onClick={() => setSubTab("knowledge-base")}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide ${
            subTab === "knowledge-base"
              ? "bg-brand text-white"
              : "border border-zinc-300 text-zinc-500 hover:border-brand hover:text-brand-dark"
          }`}
        >
          Knowledge Base
        </button>
        <button
          type="button"
          onClick={() => setSubTab("process-trees")}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide ${
            subTab === "process-trees"
              ? "bg-brand text-white"
              : "border border-zinc-300 text-zinc-500 hover:border-brand hover:text-brand-dark"
          }`}
        >
          Process Trees
        </button>
      </div>

      {subTab === "notifications" && (
        <div className="mt-6 space-y-3">
          {questionsError && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
              Couldn&apos;t load questions: {questionsError}
            </p>
          )}
          {loadingQuestions && <p className="text-sm text-zinc-400">Loading...</p>}
          {!loadingQuestions && !questionsError && questions.length === 0 && (
            <p className="text-sm text-zinc-400">
              No unanswered questions yet, this fills up whenever the chatbot can&apos;t find a
              match.
            </p>
          )}
          {questions.map((q) => (
            <div
              key={q.id}
              className={`rounded-lg border p-4 ${
                q.resolved ? "border-zinc-200 opacity-60" : "border-brand/40 bg-brand/5"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-brand-dark">{q.question}</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {[q.name, q.email].filter(Boolean).join(" · ") || "No contact details left"}
                    {" · "}
                    {new Date(q.created_at).toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  {!q.resolved && (
                    <button
                      type="button"
                      onClick={() => startAnswer(q)}
                      className="text-xs font-semibold text-brand hover:text-brand-dark"
                    >
                      Answer
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => markResolved(q.id, !q.resolved)}
                    className="text-xs font-semibold text-zinc-500 hover:text-brand-dark"
                  >
                    {q.resolved ? "Mark unresolved" : "Mark resolved"}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteQuestion(q.id)}
                    className="text-xs font-semibold text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {answeringId === q.id && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    submitAnswer(q);
                  }}
                  className="mt-3 space-y-2 rounded-md border border-zinc-200 bg-white p-3"
                >
                  <p className="text-xs text-zinc-500">
                    Saving this adds it to the Knowledge Base and marks the question resolved —
                    the chatbot will be able to answer it (and similar questions) from now on.
                  </p>
                  {answerError && (
                    <p className="rounded-md bg-red-50 px-2 py-1.5 text-xs text-red-600">{answerError}</p>
                  )}
                  <label className="block text-xs font-medium text-zinc-600">
                    Category (optional)
                    <input
                      value={answerForm.category}
                      onChange={(e) => setAnswerForm((f) => ({ ...f, category: e.target.value }))}
                      className="mt-1 w-full rounded-md border border-zinc-300 p-1.5 text-sm focus:border-brand focus:outline-none"
                    />
                  </label>
                  <label className="block text-xs font-medium text-zinc-600">
                    Keywords (comma-separated)
                    <input
                      value={answerForm.keywords}
                      onChange={(e) => setAnswerForm((f) => ({ ...f, keywords: e.target.value }))}
                      className="mt-1 w-full rounded-md border border-zinc-300 p-1.5 text-sm focus:border-brand focus:outline-none"
                    />
                  </label>
                  <label className="block text-xs font-medium text-zinc-600">
                    Answer
                    <textarea
                      required
                      rows={3}
                      value={answerForm.answer}
                      onChange={(e) => setAnswerForm((f) => ({ ...f, answer: e.target.value }))}
                      className="mt-1 w-full rounded-md border border-zinc-300 p-1.5 text-sm focus:border-brand focus:outline-none"
                    />
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={savingAnswer}
                      className="rounded-md bg-brand px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand/90 disabled:opacity-60"
                    >
                      {savingAnswer ? "Saving..." : "Add to Knowledge Base"}
                    </button>
                    <button
                      type="button"
                      onClick={cancelAnswer}
                      className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:border-brand hover:text-brand-dark"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          ))}
        </div>
      )}

      {subTab === "knowledge-base" && (
        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-3">
            {faqsLoadError && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                Couldn&apos;t load the knowledge base: {faqsLoadError}
              </p>
            )}
            {loadingFaqs && <p className="text-sm text-zinc-400">Loading...</p>}
            {faqs.map((faq) => (
              <div key={faq.id} className="rounded-lg border border-zinc-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    {faq.category && (
                      <p className="text-xs font-semibold uppercase tracking-wide text-brand">
                        {faq.category}
                      </p>
                    )}
                    <p className="mt-1 text-sm font-semibold text-brand-dark">{faq.question}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-zinc-500">{faq.answer}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => startEditFaq(faq)}
                      className="text-xs font-semibold text-zinc-500 hover:text-brand-dark"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteFaq(faq.id)}
                      className="text-xs font-semibold text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleFaqSubmit} className="rounded-xl border border-zinc-200 p-6">
            <h2 className="text-sm font-semibold text-brand-dark">
              {editingId ? "Edit FAQ Entry" : "New FAQ Entry"}
            </h2>

            {faqError && (
              <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                {faqError}
              </p>
            )}

            <label className="mt-4 block text-sm font-medium text-zinc-700">
              Category (optional)
              <input
                value={faqForm.category}
                onChange={(e) => setFaqForm((f) => ({ ...f, category: e.target.value }))}
                className="mt-1 w-full rounded-md border border-zinc-300 p-2 text-sm focus:border-brand focus:outline-none"
              />
            </label>

            <label className="mt-4 block text-sm font-medium text-zinc-700">
              Question
              <input
                required
                value={faqForm.question}
                onChange={(e) => setFaqForm((f) => ({ ...f, question: e.target.value }))}
                className="mt-1 w-full rounded-md border border-zinc-300 p-2 text-sm focus:border-brand focus:outline-none"
              />
            </label>

            <label className="mt-4 block text-sm font-medium text-zinc-700">
              Keywords (comma-separated)
              <input
                value={faqForm.keywords}
                onChange={(e) => setFaqForm((f) => ({ ...f, keywords: e.target.value }))}
                placeholder="quote, pricing, cost estimate"
                className="mt-1 w-full rounded-md border border-zinc-300 p-2 text-sm focus:border-brand focus:outline-none"
              />
            </label>

            <label className="mt-4 block text-sm font-medium text-zinc-700">
              Answer
              <textarea
                required
                rows={4}
                value={faqForm.answer}
                onChange={(e) => setFaqForm((f) => ({ ...f, answer: e.target.value }))}
                className="mt-1 w-full rounded-md border border-zinc-300 p-2 text-sm focus:border-brand focus:outline-none"
              />
            </label>

            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                disabled={savingFaq}
                className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90 disabled:opacity-60"
              >
                {savingFaq ? "Saving..." : editingId ? "Save Changes" : "Add Entry"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetFaqForm}
                  className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-600 hover:border-brand hover:text-brand-dark"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {subTab === "process-trees" && (
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-zinc-500">
                Each pipeline starts with an overview answer and branches into
                next-question options — deleting a node removes everything
                under it too.
              </p>
              <button
                type="button"
                onClick={startAddRoot}
                className="shrink-0 rounded-md bg-brand px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand/90"
              >
                + Add Pipeline
              </button>
            </div>

            {nodesLoadError && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                Couldn&apos;t load process trees: {nodesLoadError}
              </p>
            )}
            {loadingNodes && <p className="text-sm text-zinc-400">Loading...</p>}
            {!loadingNodes && !nodesLoadError && roots.length === 0 && (
              <p className="text-sm text-zinc-400">
                No pipelines yet — add one to give the chatbot a guided,
                step-by-step conversation for a process like Quotation or
                Booking.
              </p>
            )}

            <div className="space-y-3">
              {roots
                .slice()
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((root, i, arr) => (
                  <NodeCard
                    key={root.id}
                    node={root}
                    depth={0}
                    allNodes={nodes}
                    isFirst={i === 0}
                    isLast={i === arr.length - 1}
                    onEdit={startEditNode}
                    onDelete={deleteNode}
                    onAddChild={startAddChild}
                    onMove={moveNode}
                  />
                ))}
            </div>
          </div>

          {showNodeForm && (
            <form onSubmit={handleNodeSubmit} className="h-fit rounded-xl border border-zinc-200 p-6">
              <h2 className="text-sm font-semibold text-brand-dark">
                {editingNodeId
                  ? "Edit Node"
                  : nodeFormParentId
                    ? "New Branch (next-question option)"
                    : "New Pipeline (root)"}
              </h2>

              {nodeError && (
                <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                  {nodeError}
                </p>
              )}

              <label className="mt-4 block text-sm font-medium text-zinc-700">
                {nodeFormParentId || editingNodeId ? "Question / label" : "Pipeline name"}
                <input
                  required
                  value={nodeForm.label}
                  onChange={(e) => setNodeForm((f) => ({ ...f, label: e.target.value }))}
                  placeholder={nodeFormParentId ? "e.g. What documents are needed?" : "e.g. Quotation"}
                  className="mt-1 w-full rounded-md border border-zinc-300 p-2 text-sm focus:border-brand focus:outline-none"
                />
              </label>

              {!nodeFormParentId && (
                <label className="mt-4 block text-sm font-medium text-zinc-700">
                  Trigger keywords (comma-separated)
                  <input
                    value={nodeForm.triggerKeywords}
                    onChange={(e) => setNodeForm((f) => ({ ...f, triggerKeywords: e.target.value }))}
                    placeholder="quote, quotation, pricing, get a quote"
                    className="mt-1 w-full rounded-md border border-zinc-300 p-2 text-sm focus:border-brand focus:outline-none"
                  />
                  <span className="mt-1 block text-xs font-normal text-zinc-400">
                    Phrases that route a fresh question into this pipeline.
                  </span>
                </label>
              )}

              <label className="mt-4 block text-sm font-medium text-zinc-700">
                Answer
                <textarea
                  required
                  rows={4}
                  value={nodeForm.answer}
                  onChange={(e) => setNodeForm((f) => ({ ...f, answer: e.target.value }))}
                  className="mt-1 w-full rounded-md border border-zinc-300 p-2 text-sm focus:border-brand focus:outline-none"
                />
              </label>

              <div className="mt-6 flex gap-3">
                <button
                  type="submit"
                  disabled={savingNode}
                  className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90 disabled:opacity-60"
                >
                  {savingNode ? "Saving..." : editingNodeId ? "Save Changes" : "Add Node"}
                </button>
                <button
                  type="button"
                  onClick={cancelNodeForm}
                  className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-600 hover:border-brand hover:text-brand-dark"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

function NodeCard({
  node,
  depth,
  allNodes,
  isFirst,
  isLast,
  onEdit,
  onDelete,
  onAddChild,
  onMove,
}: {
  node: ChatbotNode;
  depth: number;
  allNodes: ChatbotNode[];
  isFirst: boolean;
  isLast: boolean;
  onEdit: (node: ChatbotNode) => void;
  onDelete: (node: ChatbotNode) => void;
  onAddChild: (parentId: string) => void;
  onMove: (node: ChatbotNode, direction: "up" | "down") => void;
}) {
  const children = allNodes
    .filter((n) => n.parent_id === node.id)
    .sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div style={{ marginLeft: depth * 20 }}>
      <div className="rounded-lg border border-zinc-200 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            {depth === 0 && (
              <p className="text-xs font-semibold uppercase tracking-wide text-brand">Pipeline</p>
            )}
            <p className="mt-1 text-sm font-semibold text-brand-dark">{node.label}</p>
            {depth === 0 && node.trigger_keywords.length > 0 && (
              <p className="mt-1 text-xs text-zinc-400">
                Triggers: {node.trigger_keywords.join(", ")}
              </p>
            )}
            <p className="mt-1 line-clamp-2 text-xs text-zinc-500">{node.answer}</p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onMove(node, "up")}
                disabled={isFirst}
                className="text-xs font-semibold text-zinc-400 hover:text-brand-dark disabled:opacity-30"
                aria-label="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => onMove(node, "down")}
                disabled={isLast}
                className="text-xs font-semibold text-zinc-400 hover:text-brand-dark disabled:opacity-30"
                aria-label="Move down"
              >
                ↓
              </button>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onAddChild(node.id)}
                className="text-xs font-semibold text-zinc-500 hover:text-brand-dark"
              >
                + Branch
              </button>
              <button
                type="button"
                onClick={() => onEdit(node)}
                className="text-xs font-semibold text-zinc-500 hover:text-brand-dark"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(node)}
                className="text-xs font-semibold text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {children.length > 0 && (
        <div className="mt-3 space-y-3">
          {children.map((child, i) => (
            <NodeCard
              key={child.id}
              node={child}
              depth={depth + 1}
              allNodes={allNodes}
              isFirst={i === 0}
              isLast={i === children.length - 1}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
              onMove={onMove}
            />
          ))}
        </div>
      )}
    </div>
  );
}
