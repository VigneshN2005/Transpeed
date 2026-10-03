"use client";

import { useEffect, useRef } from "react";

// `accent` is opt-in (default off) so every other page using this component
// renders exactly as before — added 2026-09-21 for the Company page's
// heading pass only (per Vignesh: "highlight the heading properly for each
// content... make the content look better, don't change alignment"). It
// adds one small gradient rule between the eyebrow and the title — no
// change to spacing/structure otherwise, so nothing shifts.
//
// Motion + depth (2026-10-02, per Vignesh: premium, not cheesy): the title
// gets the soft heading shadow (.tp-heading), and when the heading scrolls
// into view the red label slides in first, then the title and description
// fade up a beat later (.tp-sh rules in globals.css). The title's words rise
// one after another from behind an invisible line (same as page titles). Plays once. Nothing
// is hidden until this script arms it, so with JS off or reduced motion the
// heading simply shows.
export default function SectionHeading({
  eyebrow,
  title,
  description,
  accent = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  accent?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const h2 = el.querySelector("h2");
    el.setAttribute("data-armed", "");
    h2?.setAttribute("data-tpa", "");
    const play = () => {
      el.setAttribute("data-in", "");
      // title words start rising just after the red label slides in
      window.setTimeout(() => h2?.setAttribute("data-tpin", ""), 300);
    };
    // Already on screen at load: wait for the banner intro, then play
    // (2026-10-02, per Vignesh: "Our Locations" etc. weren't animating).
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.9 && r.bottom > 0) {
      const t = window.setTimeout(play, 1500);
      return () => window.clearTimeout(t);
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        requestAnimationFrame(play);
      },
      { threshold: 0.3, rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="tp-sh max-w-2xl">
      {eyebrow && (
        <p className="tp-sh-eb mb-2 text-sm font-semibold uppercase tracking-wide text-brand">
          {eyebrow}
        </p>
      )}
      {accent && (
        <span
          className="tp-sh-eb mb-3 block h-1 w-14 rounded-full bg-gradient-to-r from-brand to-brand/20"
          aria-hidden="true"
        />
      )}
      <h2 className="tp-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
        {title.split(" ").map((w, i, arr) => (
          <span key={i}>
            <span className="tp-m" style={{ ["--d" as string]: `${i * 150}ms` }}>
              <span className="tp-w" style={{ ["--d" as string]: `${i * 150}ms` }}>
                {w}
              </span>
            </span>
            {i < arr.length - 1 ? " " : null}
          </span>
        ))}
      </h2>
      {description && <p className="tp-sh-d mt-4 text-base text-white/70">{description}</p>}
    </div>
  );
}
