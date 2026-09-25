"use client";

import { useEffect, useRef, useState } from "react";
import type { FAQEntry } from "@/types";

// No-LLM FAQ chatbot widget. All matching happens server-side in
// /api/chatbot (Fuse.js over the faq_entries Supabase table) — this
// component just drives the conversation UI and talks to that route.
// Listens for a global "open-chatbot" event so other parts of the site
// (e.g. the Contact page's "Chatbot" option) can open it directly.
//
// Visual pass (2026-09-14, per Vignesh: "change chatbot look... make it
// modern, advanced and professional and aesthetic"). Same state machine and
// API calls as before — only the shell changed: a gradient header with a
// bot avatar and live-status dot, avatar-led message bubbles instead of
// bare text blocks, an animated "typing" indicator while a request is in
// flight, icon-led quick-reply chips, and a pill-shaped composer with a
// circular send button. The launcher morphs between a chat icon and a
// close icon instead of being two separate buttons, with a soft pulse ring
// behind it while closed so it doesn't get lost against the page.

type ChatMessage =
  | { role: "bot"; kind: "text"; text: string }
  | { role: "bot"; kind: "branch"; text: string; options: { id: string; label: string }[] }
  | { role: "bot"; kind: "suggestions"; text: string; suggestions: { id: string; question: string }[] }
  | { role: "user"; text: string };

const QUICK_REPLIES: { label: string; query: string; icon: string }[] = [
  { label: "Get a Quote", query: "How do I get a shipping quote?", icon: "M4 7h16M4 12h10M4 17h7" },
  {
    label: "Track a Shipment",
    query: "I'm an existing customer, how can I check my shipment status?",
    icon: "M3 12h4l3 8 4-16 3 8h4",
  },
  {
    label: "Customs & Documents",
    query: "What documents are needed for customs clearance?",
    icon: "M7 3h10a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM9 8h6M9 12h6M9 16h3",
  },
  {
    label: "Become a Vendor/Agent",
    query: "How do I become a vendor or agent partner with Transpeed?",
    icon: "M12 4l7 4v8l-7 4-7-4V8l7-4z",
  },
  { label: "Talk to a Person", query: "Can I talk to a real person?", icon: "M8 12a4 4 0 1 0 8 0 4 4 0 1 0-8 0zM4 20c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5" },
];

const GREETING =
  "Hi! I'm the Transpeed assistant. Ask about services, quotes, shipments, or tap a quick option below.";

async function callChatbotApi(payload: Record<string, unknown>) {
  const res = await fetch("/api/chatbot", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

// The header avatar and each bot bubble's avatar — the real Transpeed logo
// mark on a white badge (2026-09-25, per Vignesh: "add some logo for the
// bot" — the previous generic robot-glyph icon read as a stock chat-widget
// icon, not the company's own brand). `ring` size is separate from the
// badge size so the same component works both large (header) and small
// (per-message).
function BotAvatar({ size = "h-10 w-10", ring = "ring-2 ring-brand/40" }: { size?: string; ring?: string }) {
  return (
    <span className={`flex ${size} shrink-0 items-center justify-center rounded-full bg-white p-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.15)] ${ring}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/logo/transpeed-logo.png" alt="" className="h-full w-full object-contain" />
    </span>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v7A2.5 2.5 0 0 1 17.5 15H9l-4.5 4.5V15h-.5A2.5 2.5 0 0 1 4 12.5v-7z" />
    </svg>
  );
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: "bot", kind: "text", text: GREETING }]);
  // Which decision-tree node (if any) the last answer left us inside —
  // sent back with the next question so a follow-up can descend that
  // branch. A fresh top-level question that doesn't match the active
  // branch's next-question options resets this to null ("cuts the tree")
  // and gets re-evaluated from scratch, per activeNodeId returned by the API.
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-chatbot", handler);
    return () => window.removeEventListener("open-chatbot", handler);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  async function askQuestion(question: string) {
    const trimmed = question.trim();
    if (!trimmed || sending) return;

    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setSending(true);

    try {
      const data = await callChatbotApi({ action: "search", query: trimmed, activeNodeId });
      setActiveNodeId(typeof data.activeNodeId === "string" ? data.activeNodeId : null);

      if (data.refusal) {
        // Either a harmful/abusive topic (blocked before any FAQ search
        // ran) or a question genuinely outside Transpeed's logistics
        // domain — either way, no FAQ answer and no human-handoff message.
        setMessages((prev) => [...prev, { role: "bot", kind: "text", text: data.refusal.message }]);
        return;
      }

      if (data.smallTalk) {
        setMessages((prev) => [...prev, { role: "bot", kind: "text", text: data.text }]);
        return;
      }

      if (data.tree) {
        const options = (data.tree.options ?? []) as { id: string; label: string }[];
        if (options.length > 0) {
          setMessages((prev) => [
            ...prev,
            { role: "bot", kind: "branch", text: data.tree.answer, options },
          ]);
        } else {
          setMessages((prev) => [...prev, { role: "bot", kind: "text", text: data.tree.answer }]);
        }
        return;
      }

      if (data.best) {
        const entry = data.best.entry as FAQEntry;
        setMessages((prev) => [...prev, { role: "bot", kind: "text", text: entry.answer }]);
        return;
      }

      if (data.suggestions?.length) {
        const suggestions = (data.suggestions as { entry: FAQEntry }[]).map((s) => ({
          id: s.entry.id,
          question: s.entry.question,
        }));
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            kind: "suggestions",
            text: "Did you mean one of these?",
            suggestions,
          },
        ]);
        return;
      }

      // No confident match and no close suggestions — a genuine gap in the
      // knowledge base. Logged quietly in the background (fire-and-forget:
      // the visitor's message doesn't wait on it) so it reaches Admin's New
      // Questions list, where staff can answer it and grow the knowledge
      // base for next time. No contact-details capture here — the message
      // tells the visitor to contact the team directly themselves, since
      // that's the fastest guaranteed path, and it's a plainer, more honest
      // flow than a form that implies someone will call them back.
      callChatbotApi({ action: "log-unanswered", question: trimmed }).catch(() => {
        // Best-effort — even if logging fails, the visitor still gets the
        // "contact us directly" message below.
      });
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          kind: "text",
          text: "That's outside what I currently know — please contact our team directly at +91 63607 51645 or info@transpeedlogistics.com and they can help you right away.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          kind: "text",
          text: "Something went wrong reaching our assistant, please call +91 63607 51645 or email info@transpeedlogistics.com directly.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-5 sm:right-5">
      {open && (
        // w-80 capped with max-w so the panel never runs off a narrow phone
        // screen (e.g. 340px-ish devices, where a bare 320px panel plus the
        // 2*1rem side offset would overflow); max-h keeps it from
        // outgrowing short mobile viewports the same way. Per Vignesh's
        // 2026-09-14 mobile/desktop-fit pass.
        <div className="flex h-[30rem] w-[22rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl border-2 border-brand/30 bg-white shadow-[0_30px_70px_-25px_rgba(0,0,0,0.45),0_14px_34px_-18px_rgba(255,49,49,0.3)] max-h-[calc(100vh-7rem)]">
          {/* Header — brand gradient with a bot avatar + live-status dot,
              replacing the plain white/text-only header. */}
          <div className="relative overflow-hidden bg-gradient-to-br from-brand-dark via-[#241414] to-brand-dark px-4 py-4">
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
                backgroundSize: "22px 22px",
              }}
              aria-hidden="true"
            />
            <div className="relative flex items-center gap-3">
              <BotAvatar size="h-11 w-11" ring="ring-2 ring-white/30" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-white">Transpeed Assistant</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-white/60">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </span>
                  Online now
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="shrink-0 rounded-full p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
              >
                <CloseIcon />
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-zinc-50/60 p-4">
            {messages.map((m, i) => {
              if (m.role === "user") {
                return (
                  <div key={i} className="flex justify-end">
                    <p className="max-w-[85%] rounded-2xl rounded-br-md bg-gradient-to-br from-brand to-[#e0201e] px-3.5 py-2 text-sm text-white shadow-sm">
                      {m.text}
                    </p>
                  </div>
                );
              }

              return (
                <div key={i} className="flex items-start gap-2">
                  <BotAvatar size="h-8 w-8" />
                  <div className="flex min-w-0 flex-col gap-2">
                    <p className="max-w-[15rem] rounded-2xl rounded-tl-md border-2 border-zinc-200 bg-white px-3.5 py-2 text-sm leading-relaxed text-zinc-700 shadow-sm">
                      {m.text}
                    </p>
                    {m.kind === "suggestions" && (
                      <div className="flex flex-wrap gap-1.5">
                        {m.suggestions.map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => askQuestion(s.question)}
                            className="rounded-full border-2 border-brand bg-brand/5 px-2.5 py-1 text-xs font-semibold text-brand-dark shadow-sm transition-colors hover:bg-brand hover:text-white"
                          >
                            {s.question}
                          </button>
                        ))}
                      </div>
                    )}
                    {m.kind === "branch" && (
                      <div className="flex flex-wrap gap-1.5">
                        {m.options.map((o) => (
                          <button
                            key={o.id}
                            type="button"
                            onClick={() => askQuestion(o.label)}
                            className="rounded-full border-2 border-brand bg-brand/5 px-2.5 py-1 text-xs font-semibold text-brand-dark shadow-sm transition-colors hover:bg-brand hover:text-white"
                          >
                            {o.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Typing indicator — shown only while a request is in flight,
                not stored as a real message. Gives the wait somewhere to
                land instead of a static panel. */}
            {sending && (
              <div className="flex items-start gap-2">
                <BotAvatar size="h-8 w-8" />
                <span className="flex items-center gap-1 rounded-2xl rounded-tl-md border-2 border-zinc-200 bg-white px-3.5 py-2.5 shadow-sm">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400" />
                </span>
              </div>
            )}
          </div>

          <div className="border-t border-zinc-100 bg-white p-3">
            <div className="relative">
              <div className="mb-2.5 flex gap-1.5 overflow-x-auto pb-0.5 [scrollbar-width:none]">
                {QUICK_REPLIES.map((q) => (
                  <button
                    key={q.label}
                    type="button"
                    onClick={() => askQuestion(q.query)}
                    disabled={sending}
                    className="flex shrink-0 items-center gap-1.5 rounded-full border-2 border-brand/40 bg-white px-2.5 py-1.5 text-xs font-semibold text-brand-dark shadow-sm transition-colors hover:border-brand hover:bg-brand hover:text-white disabled:opacity-60"
                  >
                    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d={q.icon} />
                    </svg>
                    {q.label}
                  </button>
                ))}
              </div>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-0 mb-2.5 w-8 bg-gradient-to-l from-white to-transparent"
              />
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                askQuestion(input);
              }}
              className="flex items-center gap-2 rounded-full border-2 border-zinc-300 bg-white p-1 pl-4 shadow-sm transition-all focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question..."
                className="flex-1 bg-transparent py-1.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                aria-label="Send"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-[#e0201e] text-white shadow-sm transition-transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
              >
                <SendIcon />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Launcher — a single button that morphs between the chat glyph and
          a close (X) glyph, with a soft pulse ring behind it while closed
          so it doesn't disappear against a busy page background. */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="group relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-[#c81616] text-white shadow-[0_12px_30px_-8px_rgba(255,49,49,0.55)] transition-transform hover:scale-105"
      >
        {!open && (
          <span className="absolute inset-0 rounded-full bg-brand/50 [animation:ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite]" />
        )}
        <span className="relative">{open ? <CloseIcon /> : <ChatIcon />}</span>
      </button>
    </div>
  );
}
