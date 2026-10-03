"use client";

// Number that counts up to its value the first time it scrolls into view
// (2026-10-02, per Vignesh — Company page "credibility" motion pass: numbers
// ticking up reinforce "established, everywhere you need us"). Renders the
// final value on the server / with JS off / for reduced-motion users, so the
// real number is always in the HTML and nothing ever shows a wrong figure
// for long.
import { useEffect, useRef, useState } from "react";

export default function CountUp({
  to,
  from = 0,
  duration = 1400,
  delay = 0,
}: {
  to: number;
  from?: number;
  duration?: number;
  /** ms to wait after coming into view, e.g. to start once a fade-in has finished. */
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(to);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let started = false;
    setVal(from);
    const io = new IntersectionObserver(
      (entries) => {
        if (started || !entries.some((e) => e.isIntersecting)) return;
        started = true;
        io.disconnect();
        const t0 = performance.now() + delay;
        const step = (t: number) => {
          const p = Math.max(0, Math.min(1, (t - t0) / duration));
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(from + (to - from) * eased));
          if (p < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, from, duration, delay]);

  return (
    <span ref={ref} className="tabular-nums">
      {val}
    </span>
  );
}
