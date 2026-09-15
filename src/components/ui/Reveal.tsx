"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Scroll-reveal wrapper (2026-09-14, per Vignesh: "visual effects of the
// contents and things appearing from top to its current position as i
// scroll"). Two variants:
//   - "up" (default): fade in + settle down from a small offset above its
//     final position — for headings, cards, text blocks.
//   - "image": the same fade/settle, plus a slight scale-in, so photos and
//     illustrations read as a distinct "image reveal" rather than just
//     text sliding — this is the "image based visual effects" half of the
//     request.
// Deliberately kept subtle and quick (small offset, ~400ms) per Vignesh's
// choice of "subtle & quick" over a more dramatic animation — the goal is
// a bit of life as you scroll, not something that slows down reading the
// page. Animates once per element (disconnects after the first reveal)
// rather than re-triggering every time it scrolls in and out of view,
// which reads as flickery on a page you're scrolling up and down while
// reading. Respects prefers-reduced-motion — content just appears, no
// motion, for anyone who's asked their system to minimise it.
export default function Reveal({
  children,
  className = "",
  delay = 0,
  variant = "up",
}: {
  children: ReactNode;
  className?: string;
  /** Stagger delay in ms — pass index * 60 (capped) for grids/lists so items settle in sequence rather than all at once. */
  delay?: number;
  variant?: "up" | "image";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hidden =
    variant === "image"
      ? "opacity-0 -translate-y-5 scale-[0.97]"
      : "opacity-0 -translate-y-4";

  return (
    <div
      ref={ref}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
      className={`transition-all duration-[420ms] ease-out ${
        visible ? "opacity-100 translate-y-0 scale-100" : hidden
      } ${className}`}
    >
      {children}
    </div>
  );
}
