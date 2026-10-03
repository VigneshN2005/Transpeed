"use client";

import { useState } from "react";
import Image from "next/image";

type Step = { title: string; text: string; icon?: string };

// Collapsed by default so this service's card starts at the same height as
// the other five (which have no steps/diagram) — the full six-step
// breakdown and process diagram are still all there, one click away,
// rather than being cut or shrunk to fit.
export default function ServiceProcess({
  steps,
  serviceName,
}: {
  steps: Step[];
  serviceName: string;
}) {
  const [open, setOpen] = useState(false);
  const hasIcons = steps.some((s) => s.icon);

  return (
    <div className="mt-6 border-t border-white/10 pt-5">
      {/* Toggle restyle (2026-09-25, per Vignesh).
          Round 1: "make the see the full 6 process look like proper
          clickable glass effect button" — was plain text with a thin
          outlined "+" circle. Tried a light/white glass pill first, but
          against this section's already-light pink page background a
          translucent white panel has nothing visually busy behind it to
          blur, so the "glass" read as just a flat white box.
          Round 2: "make the ... button have a black background glass
          effect white font" — switched to the same dark-glass recipe as
          the diagram box and step cards below (near-black translucent
          fill, blurred backdrop, white text), which actually reads as
          glass because it contrasts against the light page instead of
          blending into it, and matches the rest of this section. */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`group relative flex w-full items-center justify-between gap-3 overflow-hidden rounded-xl border px-5 py-3.5 text-left backdrop-blur-md backdrop-saturate-150 transition-all duration-300 ${
          open
            ? "border-brand/40 bg-brand-dark/90 shadow-[0_14px_32px_-10px_rgba(255,49,49,0.21),0_6px_16px_-4px_rgba(0,0,0,0.35)]"
            : "border-white/10 bg-brand-dark/80 shadow-[0_8px_22px_-8px_rgba(0,0,0,0.3)] hover:border-brand/30 hover:bg-brand-dark/90 hover:shadow-[0_14px_30px_-10px_rgba(255,49,49,0.2),0_6px_16px_-4px_rgba(0,0,0,0.35)]"
        }`}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-brand/21 blur-2xl transition-opacity duration-300 group-hover:bg-brand/28"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
        />
        <span className="relative text-sm font-bold tracking-wide text-brand">
          See the full {steps.length}-step process
        </span>
        <span
          className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#FF3131,#B91C1C)] text-base font-bold text-white shadow-[0_4px_12px_-2px_rgba(255,49,49,0.35)] transition-transform duration-300 ${
            open ? "rotate-45" : ""
          }`}
          aria-hidden="true"
        >
          +
        </span>
      </button>

      {/* Step cards + diagram redesign (2026-09-25, per Vignesh).
          Round 1: "make this also look better i mean its very plane" —
          swapped flat grey cards for elevated white ones with a numbered
          red-gradient badge.
          Round 2: "noo i meant its plane and boring, white ... modern
          aesthic professional and advanced" — cards moved to the same
          dark-glass recipe as the home page cards / hero license card.
          Round 3: "what about this?" (the diagram) — swapped the single
          flattened black-and-white diagram image for 6 separate colorful
          step icons laid out with real arrow connectors in code.
          Round 4 (this pass): three more issues with that flow box —
          (a) "add background color its white" — the box interior was
          still plain white; it now matches the dark-glass cards instead
          of being the odd light element in an otherwise dark-glass
          section; (b) "make the logos bigger" — icon badges grow from
          80px/96px to a clearly bigger size, with the icons inside them
          bigger too, not just their frame; (c) "give the arrows properly
          and alignment is not correct" — the old flex-wrap let icons wrap
          to a lonely second row (e.g. "Delivered" stranded alone,
          re-centered under the wrong spot) whenever this box was narrow
          (it shares row width with the service photo above lg), and the
          arrows were faint. Fixed by never wrapping: the row scrolls
          horizontally instead when it doesn't fit, so all 6 icons +
          arrows always stay in one correctly-ordered line, and the
          arrows are now bold solid brand-red at a larger size. */}
      {open && (
        <div className="mt-5 space-y-6">
          {hasIcons && (
            <div className="relative rounded-2xl bg-[linear-gradient(135deg,#FF3131,#B91C1C)] p-[2px] shadow-[0_16px_36px_-12px_rgba(255,49,49,0.24),0_6px_18px_-6px_rgba(0,0,0,0.18)]">
              <div className="relative overflow-hidden rounded-[14px] bg-brand-dark/[0.96] px-2 py-8 sm:px-6">
                <span aria-hidden="true" className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-brand/14 blur-3xl" />
                <span aria-hidden="true" className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-brand/14 blur-3xl" />
                <div
                  // justify-start, not justify-center (2026-09-25, per
                  // Vignesh: "sourced is being cut" — and DELIVERED was
                  // cut on the other end too). justify-center on a
                  // horizontally-scrolling row that's WIDER than its box
                  // centers the overflow by hiding equal amounts off both
                  // ends, and the default scroll position can't reach
                  // that hidden start/end — so the first and last labels
                  // were clipped no matter how far you scrolled. Plain
                  // left alignment (the default) means scrollLeft=0 always
                  // shows Sourced in full, with Delivered reachable by
                  // scrolling right. Generous side padding (px-6) keeps
                  // both end labels clear of the box's own rounded edge.
                  className="relative flex flex-nowrap items-start gap-x-1 overflow-x-auto px-6 pb-2 [-ms-overflow-style:none] [scrollbar-width:thin] sm:gap-x-4 sm:px-10 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/20"
                  role="list"
                  aria-label={`${serviceName} process flow`}
                >
                  {steps.map((step, i) => (
                    <div key={step.title} className="flex shrink-0 items-start" role="listitem">
                      <div className="flex w-28 flex-col items-center gap-2 sm:w-36">
                        <span className="flex h-24 w-24 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-[0_10px_24px_-8px_rgba(0,0,0,0.4)] transition-transform duration-300 hover:scale-105 sm:h-32 sm:w-32">
                          {step.icon && (
                            <Image
                              src={step.icon}
                              alt={step.title}
                              width={128}
                              height={128}
                              className="h-[4rem] w-[4rem] object-contain sm:h-24 sm:w-24"
                            />
                          )}
                        </span>
                        <span className="text-center text-xs font-bold uppercase tracking-wide text-white sm:text-sm">
                          {step.title}
                        </span>
                      </div>
                      {i < steps.length - 1 && (
                        <span
                          aria-hidden="true"
                          className="mt-11 flex shrink-0 items-center px-1 text-2xl font-bold text-brand sm:mt-16 sm:px-2 sm:text-3xl"
                        >
                          &rarr;
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-brand-dark/[0.94] p-5 shadow-[0_16px_36px_-12px_rgba(0,0,0,0.5),0_6px_16px_-4px_rgba(255,49,49,0.15),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md backdrop-saturate-150 transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:bg-brand-dark hover:shadow-[0_22px_46px_-14px_rgba(0,0,0,0.55),0_8px_20px_-4px_rgba(255,49,49,0.25),inset_0_1px_0_rgba(255,255,255,0.08)]"
              >
                <span aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-brand/21 blur-2xl transition-all duration-300 group-hover:bg-brand/28" />
                <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                <div className="relative flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#FF3131,#B91C1C)] text-sm font-bold text-white shadow-[0_4px_12px_-2px_rgba(255,49,49,0.35)] transition-transform duration-300 group-hover:scale-110">
                    {i + 1}
                  </span>
                  <p className="text-xs font-semibold uppercase tracking-wide text-white">
                    {step.title}
                  </p>
                </div>
                <p className="relative mt-3 text-sm text-white/65">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
