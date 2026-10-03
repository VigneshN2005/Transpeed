"use client";

// News & Updates side-strip animation (2026-10-02, per Vignesh: picked from
// the live preview, "add 2 signal waves at the top sides, and below some
// floating envelopes with smooth transition to folded news papers").
//
// Two layers in the empty gutters beside the content:
//   - Top: a small broadcast antenna on each side, level with the page
//     heading, sending soft rings outward. They scroll away with the page.
//   - Below: outline envelopes float gently upward. As you scroll down the
//     page each one morphs smoothly into a folded newspaper (the envelope
//     shrinks and fades while the paper unfolds in its place), and back
//     again when you scroll up. The morph is scroll-scrubbed and eased.
// It lives on a canvas fixed to the viewport (pointer-events: none), fades
// out before the footer and switches itself off when the gutters are too
// narrow.
// prefers-reduced-motion: rings and floating hold still, and the morph
// still follows your scroll position.

import { useEffect, useRef } from "react";

const CONTENT_MAX = 1152; // Container max-w-6xl
const CONTENT_PAD = 24; // Container px-6
const CANVAS_BG = "#4A4D52"; // page canvas, used to fill outline shapes
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

type Item = { side: 0 | 1; lane: number; y: number; depth: number; speed: number; ph: number; red: boolean; lag: number };

export default function NewsSideScene({ targetId }: { targetId: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0, H = 0, gw = 0, dpr = 1, raf = 0, idle = 0, last = 0;
    let scrollS = window.scrollY, lastS = window.scrollY, vel = 0, vis = 0, morph = 0;
    let topS = 0, topInit = false;
    let items: Item[] = [];

    let seed = 9;
    const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = window.innerWidth;
      H = window.innerHeight;
      gw = (W - Math.min(W, CONTENT_MAX)) / 2 + CONTENT_PAD - 12;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      cv.style.width = `${W}px`;
      cv.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!items.length) {
        seed = 9;
        const N = 14; // enlarged + more items 2026-10-02 per Vignesh: "make the animations bigger and add some more envelopes and papers"
        items = Array.from({ length: N }, (_, i) => ({
          side: (i % 2) as 0 | 1,
          lane: [0.15, 0.85, 0.5, 0.3, 0.7, 0.45, 0.6][Math.floor(i / 2) % 7],
          y: (Math.floor(i / 2) + 0.2 + rnd() * 0.6) / (N / 2),
          depth: 0.5 + rnd() * 0.5,
          speed: 0.6 + rnd() * 0.6,
          ph: rnd() * 6.28,
          red: i % 5 === 2,
          lag: rnd() * 0.25, // staggers the morph so items don't all switch at once
        }));
      }
    };

    const white = (a: number) => `rgba(255,255,255,${clamp01(a).toFixed(3)})`;
    const red = (a: number) => `rgba(255,49,49,${clamp01(a).toFixed(3)})`;

    function antenna(x: number, y: number, t: number, phase: number, a: number) {
      const c = ctx!;
      const S = 1.5;
      c.save(); c.translate(x, y); c.scale(S, S); x = 0; y = 0;
      c.lineWidth = 1.2;
      c.strokeStyle = white(0.45 * a);
      c.beginPath();
      c.moveTo(x - 13, y + 32); c.lineTo(x, y); c.lineTo(x + 13, y + 32);
      c.moveTo(x - 7, y + 17); c.lineTo(x + 7, y + 17);
      c.moveTo(x - 10, y + 25); c.lineTo(x + 10, y + 25);
      c.stroke();
      c.fillStyle = red(0.85 * a);
      c.beginPath(); c.arc(x, y - 2, 2.6, 0, 7); c.fill();
      const maxR = Math.min((gw * 0.46) / S, 85);
      for (let r = 0; r < 3; r++) {
        const p = reduced ? (r + 1) / 4 : (t * 0.00035 + r / 3 + phase) % 1;
        const rad = 8 + p * maxR;
        c.lineWidth = 1;
        c.strokeStyle = (r === 0 ? red : white)((1 - p) * 0.4 * a);
        c.beginPath(); c.arc(x, y - 2, rad, -Math.PI * 0.85, -Math.PI * 0.15); c.stroke();
        c.strokeStyle = (r === 0 ? red : white)((1 - p) * 0.16 * a);
        c.beginPath(); c.arc(x, y - 2, rad, Math.PI * 0.15, Math.PI * 0.85); c.stroke();
      }
      c.restore();
    }

    function envelope(w: number, color: string, open: number) {
      const c = ctx!, h = w * 0.66;
      c.strokeStyle = color; c.lineWidth = 1; c.fillStyle = CANVAS_BG;
      if (open > 0.02) {
        const cy = -h / 2 - h * 0.55 * open;
        c.fillRect(-w * 0.38, cy, w * 0.76, h * 0.7); c.strokeRect(-w * 0.38, cy, w * 0.76, h * 0.7);
        c.beginPath();
        c.moveTo(-w * 0.25, cy + 4); c.lineTo(w * 0.2, cy + 4);
        c.moveTo(-w * 0.25, cy + 8); c.lineTo(w * 0.05, cy + 8);
        c.stroke();
      }
      c.fillRect(-w / 2, -h / 2, w, h); c.strokeRect(-w / 2, -h / 2, w, h);
      c.beginPath(); c.moveTo(-w / 2, -h / 2); c.lineTo(0, -h / 2 + h * 0.55 * (1 - 2 * open)); c.lineTo(w / 2, -h / 2); c.stroke();
      c.save(); c.globalAlpha *= 0.6;
      c.beginPath(); c.moveTo(-w / 2, h / 2); c.lineTo(-w * 0.1, h * 0.02); c.moveTo(w / 2, h / 2); c.lineTo(w * 0.1, h * 0.02); c.stroke();
      c.restore();
    }

    function newspaper(w: number, color: string, unfold: number) {
      const c = ctx!, h = w * 0.72, half = (w / 2) * unfold;
      c.strokeStyle = color; c.lineWidth = 1; c.fillStyle = CANVAS_BG;
      c.beginPath();
      c.moveTo(-half, -h / 2 + 3); c.lineTo(0, -h / 2); c.lineTo(half, -h / 2 + 3);
      c.lineTo(half, h / 2); c.lineTo(0, h / 2 - 3); c.lineTo(-half, h / 2); c.closePath();
      c.fill(); c.stroke();
      c.beginPath(); c.moveTo(0, -h / 2); c.lineTo(0, h / 2 - 3); c.stroke();
      const sx = unfold;
      c.lineWidth = 1.6;
      c.beginPath(); c.moveTo(-w * 0.42 * sx, -h * 0.3); c.lineTo(-w * 0.08 * sx, -h * 0.3); c.stroke();
      c.save(); c.globalAlpha *= 0.7; c.lineWidth = 0.8;
      c.beginPath();
      for (let k = 0; k < 4; k++) {
        c.moveTo(-w * 0.42 * sx, -h * 0.12 + k * h * 0.14); c.lineTo(-w * 0.08 * sx, -h * 0.12 + k * h * 0.14);
        c.moveTo(w * 0.08 * sx, -h * 0.3 + k * h * 0.16); c.lineTo(w * 0.42 * sx, -h * 0.3 + k * h * 0.16);
      }
      c.stroke();
      c.strokeRect(w * 0.08 * sx, h * 0.22, w * 0.34 * sx, h * 0.14);
      c.restore();
    }

    const loop = (t: number) => {
      // Desktop-only scene: on phones/tablets (below lg) the canvas is hidden,
      // so don't run the per-frame work at all; just check back now and then
      // in case the window is widened (2026-10-03 mobile performance fix).
      if (window.innerWidth < 1024) {
        idle = window.setTimeout(() => (raf = requestAnimationFrame(loop)), 1000);
        return;
      }
      const dt = last ? Math.min(64, t - last) : 16;
      last = t;
      const k = reduced ? 1 : 1 - Math.exp(-dt / 180);
      scrollS += (window.scrollY - scrollS) * k;
      vel += ((scrollS - lastS) / Math.max(1, dt) - vel) * (reduced ? 1 : 0.15);
      lastS = scrollS;

      const el = document.getElementById(targetId);
      ctx.clearRect(0, 0, W, H);
      if (el && gw >= 100) {
        const r = el.getBoundingClientRect();
        // smoothed top of the content, so the antennas glide rather than jump
        if (!topInit) { topS = r.top; topInit = true; }
        topS += (r.top - topS) * k;
        // visible from the top of the page, fades out before the footer
        const target = smooth(H * 0.45, H * 0.85, r.bottom);
        vis += (target - vis) * (reduced ? 1 : 1 - Math.exp(-dt / 220));
        // morph progress: envelopes → newspapers through the middle of the page
        const prog = clamp01((H * 0.5 - r.top) / Math.max(1, r.height - H * 0.4));
        morph += (prog - morph) * (reduced ? 1 : 1 - Math.exp(-dt / 260));

        if (vis > 0.01) {
          // never paint over the footer
          ctx.save();
          // Clip to the content block: nothing paints over the hero banner above it or the footer below (2026-10-02, per Vignesh: "make sure the animations don't show up in hero banner").
          ctx.beginPath(); ctx.rect(0, Math.max(0, r.top), W, Math.max(0, r.bottom - Math.max(0, r.top))); ctx.clip();
          // 1) antennas beside the heading
          const ay = topS + 120;
          if (ay > -160 && ay < H + 60) {
            const a = vis * smooth(-160, 40, ay);
            antenna(gw * 0.5, ay, t, 0, a);
            antenna(W - gw * 0.5, ay, t, 0.17, a);
          }

          // 2) envelopes / newspapers, only below the antenna zone
          const span = H * 1.4;
          const startY = ay + 260; // floaters begin below the antennas
          const sBase = Math.max(0.9, Math.min(1.25, gw / 150));
          items.forEach((it) => {
            if (!reduced) it.y += it.speed * 0.00002 * (1 + Math.min(2, Math.abs(vel)));
            const raw = it.y * span - scrollS * 0.25 * it.depth;
            const yy = H * 1.15 - ((((raw % span) + span) % span) - H * 0.15);
            const w = (28 + it.depth * 16) * sBase;
            const pad = w * 0.75 + 10;
            const lo = pad, hi = Math.max(lo, gw - pad - 10);
            const along = lo + (hi - lo) * it.lane + (reduced ? 0 : Math.sin(t * 0.0005 + it.ph) * 8);
            const x = it.side ? W - along : along;
            const edge = smooth(-30, H * 0.12, yy) * smooth(H + 30, H * 0.88, yy) * smooth(startY - 40, startY + 80, yy);
            const a = vis * edge * (0.35 + it.depth * 0.3);
            if (a <= 0.01) return;
            const color = it.red ? red(a * 1.5) : white(a);
            // per-item morph with a little stagger, eased
            const m = smooth(it.lag, it.lag + 0.5, morph);
            const tilt = reduced ? 0 : Math.sin(t * 0.0004 * it.speed + it.ph) * (0.1 + m * 0.25);
            ctx.save();
            ctx.translate(x, yy);
            ctx.rotate(tilt + m * scrollS * 0.0006 * (it.side ? -1 : 1));
            if (m < 0.98) {
              ctx.save();
              ctx.globalAlpha = 1 - smooth(0.2, 0.75, m);
              const sc = 1 - 0.35 * m;
              ctx.scale(sc, sc);
              const cyc = reduced ? 0 : (t * 0.00012 * it.speed + it.ph / 6.28) % 1;
              const open = cyc < 0.3 ? Math.sin((cyc / 0.3) * Math.PI) * (1 - m) : 0;
              envelope(w, color, open);
              ctx.restore();
            }
            if (m > 0.02) {
              ctx.save();
              ctx.globalAlpha = smooth(0.25, 0.8, m);
              const sc = 0.7 + 0.3 * m;
              ctx.scale(sc, sc);
              newspaper(w * 1.15, color, 0.15 + 0.85 * smooth(0.3, 1, m));
              ctx.restore();
            }
            ctx.restore();
          });
          ctx.restore();
        }
      }
      raf = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(idle);
      window.removeEventListener("resize", resize);
    };
  }, [targetId]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 hidden lg:block"
      style={{ position: "fixed", left: 0, top: 0, pointerEvents: "none" }}
    />
  );
}
