"use client";

// "Get a Quote" pop-up, available on every page (2026-10-03, per Vignesh
// relaying Sharanya: clear calls to action so a customer can go from
// reading about a service straight to contacting Transpeed).
//
// Any button calls useQuote().open("Service name") to open the form with
// that service pre-selected. On submit the enquiry is emailed to the team
// and saved for the admin dashboard (/api/enquiry); the success screen then
// offers to send the same details on WhatsApp (a pre-filled message to the
// enquiry number), which the visitor sends with one tap.

import { createContext, useCallback, useContext, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { services } from "@/data/services";
import { whatsappLink } from "@/data/enquiry";

type QuoteCtx = { open: (service?: string) => void };
const Ctx = createContext<QuoteCtx>({ open: () => {} });
export const useQuote = () => useContext(Ctx);

const GENERAL = "Not sure yet / General enquiry";
type Form = {
  service: string; name: string; phone: string; email: string;
  company: string; origin: string; destination: string; message: string; website: string;
};
const empty = (service = GENERAL): Form => ({
  service, name: "", phone: "", email: "", company: "", origin: "", destination: "", message: "", website: "",
});

function waMessage(f: Form) {
  return [
    `Hi Transpeed, I'd like a quote for ${f.service}.`,
    "",
    `Name: ${f.name}`,
    `Phone: ${f.phone}`,
    `Email: ${f.email}`,
    f.company && `Company: ${f.company}`,
    (f.origin || f.destination) && `Route: ${f.origin || "?"} → ${f.destination || "?"}`,
    f.message && `Details: ${f.message}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export default function QuoteProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<Form>(empty());
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const openedAt = useRef(0);
  const firstField = useRef<HTMLInputElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const open = useCallback((service?: string) => {
    lastFocus.current = document.activeElement as HTMLElement | null;
    setForm((f) => ({ ...(status === "sent" ? empty() : f), service: service || f.service || GENERAL }));
    setStatus((s) => (s === "sent" ? "idle" : s));
    setError("");
    openedAt.current = Date.now();
    setIsOpen(true);
  }, [status]);

  const close = useCallback(() => {
    setIsOpen(false);
    lastFocus.current?.focus?.();
  }, []);

  // Esc closes, page behind doesn't scroll, focus starts in the form.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => firstField.current?.focus(), 80);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      window.clearTimeout(t);
    };
  }, [isOpen, close]);

  const set = (k: keyof Form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, openedAt: openedAt.current }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  const field =
    "mt-1.5 w-full rounded-xl border border-white/12 bg-white/[0.05] px-3.5 py-2.5 text-sm text-white placeholder:text-white/35 transition-colors focus:border-brand/70 focus:bg-white/[0.08] focus:outline-none";
  const label = "block text-xs font-semibold uppercase tracking-wide text-white/60";

  return (
    <Ctx.Provider value={{ open }}>
      {children}
      {isOpen && (
        <div className="tp-quote-backdrop fixed inset-0 z-[60] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-6" onMouseDown={(e) => e.target === e.currentTarget && close()}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="quote-title"
            className="tp-quote-panel relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-3xl border border-white/15 bg-[#1f1f21]/95 p-6 text-white shadow-[0_40px_90px_-20px_rgba(0,0,0,0.7),0_10px_40px_-10px_rgba(255,49,49,0.25)] sm:rounded-3xl sm:p-8"
          >
            <span aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand/15 blur-3xl" />
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
            </button>

            {status === "sent" ? (
              <div className="relative py-4 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand/15 text-brand ring-1 ring-brand/40">
                  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
                </span>
                <h2 id="quote-title" className="tp-heading mt-5 text-2xl font-bold">Thank you, {form.name.split(" ")[0]}.</h2>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-white/70">
                  Your request for <span className="font-semibold text-white">{form.service}</span> has reached our team. We&apos;ll get back to you shortly.
                </p>
                <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-white/50">Want a faster reply?</p>
                <a
                  href={whatsappLink(waMessage(form))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-glint mt-3 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_30px_-8px_rgba(255,49,49,0.5)] transition-transform hover:-translate-y-0.5"
                >
                  <WhatsAppIcon className="h-4 w-4" /> Send these details on WhatsApp
                </a>
                <div>
                  <button type="button" onClick={close} className="mt-4 text-sm text-white/60 underline-offset-4 hover:text-white hover:underline">
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="relative" noValidate={false}>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Get a Quote</p>
                <h2 id="quote-title" className="tp-heading mt-2 text-2xl font-bold sm:text-3xl">Tell us what you&apos;re moving</h2>
                <p className="mt-2 text-sm text-white/60">Share a few details and our team will come back to you with a quote.</p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <label className={`${label} sm:col-span-2`}>
                    Service
                    <select value={form.service} onChange={set("service")} className={`${field} appearance-none`}>
                      {services.map((s) => (
                        <option key={s.slug} value={s.name} className="bg-[#1f1f21]">{s.name}</option>
                      ))}
                      <option value={GENERAL} className="bg-[#1f1f21]">{GENERAL}</option>
                    </select>
                  </label>
                  <label className={label}>
                    Name *
                    <input ref={firstField} required value={form.name} onChange={set("name")} autoComplete="name" className={field} placeholder="Your full name" />
                  </label>
                  <label className={label}>
                    Phone *
                    <input required type="tel" value={form.phone} onChange={set("phone")} autoComplete="tel" className={field} placeholder="+91 …" />
                  </label>
                  <label className={label}>
                    Email *
                    <input required type="email" value={form.email} onChange={set("email")} autoComplete="email" className={field} placeholder="you@company.com" />
                  </label>
                  <label className={label}>
                    Company
                    <input value={form.company} onChange={set("company")} autoComplete="organization" className={field} placeholder="Optional" />
                  </label>
                  <label className={label}>
                    From
                    <input value={form.origin} onChange={set("origin")} className={field} placeholder="City / port of origin" />
                  </label>
                  <label className={label}>
                    To
                    <input value={form.destination} onChange={set("destination")} className={field} placeholder="City / port of delivery" />
                  </label>
                  <label className={`${label} sm:col-span-2`}>
                    Cargo details
                    <textarea value={form.message} onChange={set("message")} rows={3} className={`${field} resize-none`} placeholder="What you're shipping, approximate weight or volume, timeline…" />
                  </label>
                  {/* hidden from people; only bots fill this in */}
                  <input type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={set("website")} className="hidden" aria-hidden="true" />
                </div>

                {status === "error" && (
                  <p className="mt-4 rounded-xl border border-brand/30 bg-brand/10 px-4 py-3 text-sm text-white/85">
                    {error}{" "}
                    <a href={whatsappLink(waMessage(form))} target="_blank" rel="noopener noreferrer" className="font-semibold text-white underline underline-offset-4">
                      Send on WhatsApp
                    </a>
                  </p>
                )}

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="btn-glint inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3 text-sm font-semibold text-white shadow-[0_8px_30px_-8px_rgba(255,49,49,0.5)] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
                  >
                    {status === "sending" ? "Sending…" : <>Request a Quote <span aria-hidden="true" className="tp-arrow">→</span></>}
                  </button>
                  <a
                    href={whatsappLink(`Hi Transpeed, I'd like a quote for ${form.service}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-white/60 transition-colors hover:text-white"
                  >
                    <WhatsAppIcon className="h-4 w-4" /> or chat on WhatsApp
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}

export function WhatsAppIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3c.2-.4.2-.8.2-.9-.1-.1-.3-.2-.5-.3Z" />
    </svg>
  );
}
