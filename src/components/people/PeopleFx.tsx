"use client";

// Light motion for the People page (2026-10-02, per Vignesh — trial: "add and
// show first, lets see later if i like we keep or revert back"). Three
// subtle effects, all driven by data-pfx attributes in people/page.tsx so the
// whole thing can be removed by deleting this component + those attributes:
//
//   data-pfx="portrait" — photo unveils with a soft upward wipe and settles
//                          from a slight zoom when it scrolls into view.
//   data-pfx="divider"  — the separator's red diamond pops in, then both
//                          hairlines draw outward from it.
//   data-pfx="spot"     — a soft warm glow follows the cursor across the
//                          profile card (child [data-pfx-glow] is the light).
//
// Nothing is hidden unless this script has run (it adds .pfx-wait itself),
// so with JS off everything simply shows. prefers-reduced-motion: no wipe,
// no draw, no glow.
import { useEffect } from "react";

const CSS = `
[data-pfx="portrait"].pfx-wait { clip-path: inset(100% 0 0 0 round 1.5rem); }
[data-pfx="portrait"].pfx-wait img { transform: scale(1.12); }
[data-pfx="portrait"].pfx-in { clip-path: inset(0 0 0 0 round 1.5rem); transition: clip-path 1.15s cubic-bezier(.65,0,.25,1); }
[data-pfx="portrait"] img { transition: transform 1.8s cubic-bezier(.2,.7,.2,1); }
[data-pfx="portrait"].pfx-in img { transform: scale(1); }

[data-pfx="divider"] .pfx-diamond { transform: rotate(45deg); }
[data-pfx="divider"] .pfx-line-l { transform-origin: right center; }
[data-pfx="divider"] .pfx-line-r { transform-origin: left center; }
[data-pfx="divider"].pfx-wait .pfx-line-l, [data-pfx="divider"].pfx-wait .pfx-line-r { transform: scaleX(0); }
[data-pfx="divider"].pfx-wait .pfx-diamond { transform: rotate(45deg) scale(0); opacity: 0; }
[data-pfx="divider"].pfx-in .pfx-line-l, [data-pfx="divider"].pfx-in .pfx-line-r { transform: scaleX(1); transition: transform 1.1s cubic-bezier(.2,.75,.2,1) .25s; }
[data-pfx="divider"].pfx-in .pfx-diamond { transform: rotate(45deg) scale(1); opacity: 1; transition: transform .5s cubic-bezier(.3,1.6,.5,1), opacity .3s; }

[data-pfx-glow] { opacity: 0; transition: opacity .45s ease;
  background: radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,.075), rgba(255,49,49,.05) 35%, transparent 65%); }
[data-pfx="spot"]:hover [data-pfx-glow] { opacity: 1; }

@media (prefers-reduced-motion: reduce) {
  [data-pfx="portrait"].pfx-wait, [data-pfx="portrait"].pfx-in { clip-path: none; transition: none; }
  [data-pfx="portrait"] img, [data-pfx="portrait"].pfx-wait img { transform: none; transition: none; }
  [data-pfx="divider"] .pfx-line-l, [data-pfx="divider"] .pfx-line-r { transform: none !important; transition: none !important; }
  [data-pfx="divider"] .pfx-diamond { transform: rotate(45deg) !important; opacity: 1 !important; transition: none !important; }
  [data-pfx-glow] { display: none; }
}
`;

export default function PeopleFx() {
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-pfx="portrait"], [data-pfx="divider"]'));
    targets.forEach((el) => el.classList.add("pfx-wait"));
    // Watch an unclipped stand-in: a clip-path that hides the portrait also
    // hides it from IntersectionObserver, so portraits are observed via their
    // parent frame instead.
    const watchFor = new Map<Element, HTMLElement>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = watchFor.get(e.target) ?? (e.target as HTMLElement);
          // next frame so the hidden state is painted first and the transition runs
          requestAnimationFrame(() => {
            el.classList.add("pfx-in");
            el.classList.remove("pfx-wait");
          });
          io.unobserve(e.target);
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    );
    targets.forEach((el) => {
      const watch = el.dataset.pfx === "portrait" && el.parentElement ? el.parentElement : el;
      watchFor.set(watch, el);
      io.observe(watch);
    });

    const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-pfx="spot"]'));
    const onMove = (ev: PointerEvent) => {
      const el = ev.currentTarget as HTMLElement;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${ev.clientX - r.left}px`);
      el.style.setProperty("--my", `${ev.clientY - r.top}px`);
    };
    cards.forEach((c) => c.addEventListener("pointermove", onMove));

    return () => {
      io.disconnect();
      cards.forEach((c) => c.removeEventListener("pointermove", onMove));
    };
  }, []);

  return <style>{CSS}</style>;
}
