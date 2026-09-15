"use client";

import type { ReactNode } from "react";
import { contactChannels } from "@/data/contact";

// Every contact channel shown up front — no click-to-reveal gate. Each card
// is a real link (tel:, mailto:, wa.me) except Chatbot, whose href is
// intercepted to open the on-page widget instead.
//
// Visual pass (2026-09-14, per Vignesh: "the image shown like boxes are too
// plane, make them look better"). Same channels/links as before — each card
// now gets its own accent colour (WhatsApp green, Chatbot brand red, Email
// sky, Phone amber) driving a gradient icon tile and a top accent bar
// instead of one flat brand-tinted circle repeated four times, plus a soft
// corner glow and an arrow that slides in on hover so the cards read as
// actionable rather than decorative.
const ICONS: Record<string, ReactNode> = {
  WhatsApp: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.5 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3.5 20.5l1.4-4.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.3a8.48 8.48 0 0 1 8 8v.3z" />
      <path d="M8.8 9.2c0 3.5 3 6 5.9 6" />
      <path d="M8.8 9.2c-.2-.5.4-1.3.9-1.3s.6 1 .8 1.4c.2.4-.4.8-.4 1.1 0 .4.7 1.1 1.1 1.4.3.3 1 1 1.4.4.3-.4 1.2-.6 1.4-.4.4.2 1.5.5 1.5 1 0 .8-.9 1.3-1.5 1.3" />
    </svg>
  ),
  Chatbot: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v7A2.5 2.5 0 0 1 17.5 15H9l-4.5 4.5V15h-.5A2.5 2.5 0 0 1 4 12.5v-7z" />
      <circle cx="9" cy="9.5" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="12" cy="9.5" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="15" cy="9.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  ),
  Email: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 6.5 8 6.5 8-6.5" />
    </svg>
  ),
  Phone: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.6 10.8a15.6 15.6 0 0 0 6.6 6.6l2.2-2.2a1.3 1.3 0 0 1 1.3-.3c1.1.4 2.4.6 3.6.6a1.3 1.3 0 0 1 1.3 1.3v3.4a1.3 1.3 0 0 1-1.3 1.3C10.3 21.5 2.5 13.7 2.5 3.9A1.3 1.3 0 0 1 3.8 2.6h3.4A1.3 1.3 0 0 1 8.5 3.9c0 1.2.2 2.5.6 3.6.1.4 0 1-.3 1.3l-2.2 2.2z" />
    </svg>
  ),
};

// Per-channel accent — icon tile gradient, top accent bar, and the glow
// tint behind the card, keyed off each channel's own recognisable colour
// rather than one repeated brand tint.
const ACCENTS: Record<string, { grad: string; bar: string; glow: string }> = {
  WhatsApp: { grad: "from-emerald-400 to-emerald-600", bar: "bg-emerald-500", glow: "bg-emerald-400/20" },
  Chatbot: { grad: "from-brand to-[#c81616]", bar: "bg-brand", glow: "bg-brand/20" },
  Email: { grad: "from-sky-400 to-sky-600", bar: "bg-sky-500", glow: "bg-sky-400/20" },
  Phone: { grad: "from-amber-400 to-amber-600", bar: "bg-amber-500", glow: "bg-amber-400/20" },
};

const DEFAULT_ACCENT = { grad: "from-brand to-brand-dark", bar: "bg-brand", glow: "bg-brand/20" };

export default function ContactReveal() {
  return (
    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {contactChannels.map((channel) => {
        const accent = ACCENTS[channel.label] ?? DEFAULT_ACCENT;
        return (
          <a
            key={channel.label}
            href={channel.href}
            target={channel.href.startsWith("http") ? "_blank" : undefined}
            rel={channel.href.startsWith("http") ? "noopener noreferrer" : undefined}
            onClick={(e) => {
              if (channel.href === "#chatbot") {
                e.preventDefault();
                window.dispatchEvent(new Event("open-chatbot"));
              }
            }}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] p-7 text-center backdrop-blur-sm transition-all hover:-translate-y-1 hover:bg-white/10 hover:shadow-2xl"
          >
            {/* Soft corner glow, tinted per channel, that blooms in on
                hover — replaces the previously flat white box. */}
            <span
              className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full ${accent.glow} blur-2xl transition-opacity`}
              aria-hidden="true"
            />
            <span className={`absolute inset-x-0 top-0 h-1 ${accent.bar} opacity-70`} aria-hidden="true" />

            <span
              className={`relative mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${accent.grad} text-white shadow-lg ring-1 ring-white/20 transition-transform group-hover:scale-105`}
            >
              <span className="h-9 w-9">{ICONS[channel.label]}</span>
            </span>

            <p className="relative mt-5 text-base font-bold uppercase tracking-wide text-white">
              {channel.label}
            </p>
            <p className="relative mt-2 break-words text-sm text-white/60">
              {channel.value.includes("@") ? (
                <>
                  {channel.value.split("@")[0]}@<wbr />
                  {channel.value.split("@")[1]}
                </>
              ) : (
                channel.value
              )}
            </p>

            <span className="relative mt-4 inline-flex items-center gap-1 text-xs font-semibold text-white/40 transition-colors group-hover:text-white">
              Connect
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-3.5 w-3.5 -translate-x-0.5 transition-transform group-hover:translate-x-0.5"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </a>
        );
      })}
    </div>
  );
}
