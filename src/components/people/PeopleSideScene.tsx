"use client";

// People page side-strip animation: "paper planes" (2026-10-02, per
// Vignesh: picked from the light preview set, "apply paper plane but not
// directing upwards but it should look sideways").
//
// Thin outline paper planes, most of them white and a few in brand red, glide sideways
// through the empty gutters beside the profiles. Left-side planes fly to the
// right and right-side planes fly to the left (both toward the content),
// each trailing a faint dashed line, and they fade out before they reach the
// content column.
//
// Motion, all smoothed:
//   - Idle: each plane glides at its own pace with a gentle bob and tilt.
//   - Scroll-linked parallax: planes shift vertically with your scroll at
//     different depths (nearer = larger, brighter, faster), eased so wheel
//     notches never cause jumps. Scrolling also gives them a little push.
// Fades in once past the page hero and out before the footer. It lives on a
// canvas fixed to the viewport (pointer-events: none) and switches itself
// off when the gutters are too narrow.
// prefers-reduced-motion: the planes hold still (parallax only).

import { useEffect, useRef } from "react";

const CONTENT_MAX = 1152; // Container max-w-6xl
const CONTENT_PAD = 24; // Container px-6
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

type Plane = { side: 0 | 1; x: number; y: number; depth: number; speed: number; ph: number; red: boolean };

export default function PeopleSideScene({ targetId }: { targetId: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0, H = 0, gw = 0, dpr = 1, raf = 0, last = 0;
    let scrollS = window.scrollY, lastS = window.scrollY, vel = 0, vis = 0;
    let planes: Plane[] = [];

    // deterministic layout so every visit looks the same
    let seed = 7;
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
      if (!planes.length) {
        seed = 7;
        planes = Array.from({ length: 10 }, (_, i) => ({
          side: (i % 2) as 0 | 1,
          x: rnd(),
          y: rnd(),
          depth: 0.5 + rnd() * 0.5,
          speed: 0.6 + rnd() * 0.6,
          ph: rnd() * 6.28,
          red: i % 5 === 2,
        }));
      }
    };

    const visibility = () => {
      const el = document.getElementById(targetId);
      if (!el) return 0;
      const r = el.getBoundingClientRect();
      return smooth(H * 0.55, H * 0.15, r.top) * smooth(H * 0.6, H * 0.95, r.bottom);
    };

    // Outline paper plane, nose pointing +x.
    function drawPlane(x: number, y: number, sz: number, tilt: number, dir: number, color: string, t: number, ph: number) {
      const c = ctx!;
      c.save();
      c.translate(x, y);
      c.scale(dir, 1);
      c.rotate(tilt);
      c.strokeStyle = color;
      c.lineWidth = 1.3;
      c.lineJoin = "round";
      // top-down-ish side view: upper wing, lower wing, centre fold
      c.beginPath();
      c.moveTo(sz * 1.4, 0);
      c.lineTo(-sz, -sz * 0.7);
      c.lineTo(-sz * 0.35, 0);
      c.lineTo(-sz, sz * 0.45);
      c.closePath();
      c.moveTo(sz * 1.4, 0);
      c.lineTo(-sz * 0.35, 0);
      c.moveTo(sz * 1.4, 0);
      c.lineTo(-sz * 0.55, sz * 0.18);
      c.stroke();
      // faint dashed trail behind
      c.globalAlpha = 0.5;
      c.setLineDash([2, 5]);
      c.lineDashOffset = reduced ? 0 : (t * 0.02) % 7;
      c.beginPath();
      c.moveTo(-sz * 0.6, sz * 0.1);
      for (let k = 1; k <= 12; k++) c.lineTo(-sz * 0.6 - k * 8, sz * 0.1 + Math.sin(k * 0.5 - (reduced ? 0 : t * 0.002) + ph) * k * 0.35);
      c.stroke();
      c.restore();
    }

    const loop = (t: number) => {
      const dt = last ? Math.min(64, t - last) : 16;
      last = t;
      const k = reduced ? 1 : 1 - Math.exp(-dt / 180);
      scrollS += (window.scrollY - scrollS) * k;
      vel += ((scrollS - lastS) / Math.max(1, dt) - vel) * (reduced ? 1 : 0.15);
      lastS = scrollS;
      vis += (visibility() - vis) * (reduced ? 1 : 1 - Math.exp(-dt / 220));

      ctx.clearRect(0, 0, W, H);
      const host = document.getElementById(targetId);
      if (gw >= 100 && vis > 0.01 && host) {
        // Clip to the content block: nothing paints over the hero banner above it or the footer below (2026-10-02, per Vignesh: "make sure the animations don't show up in hero banner").
        const hr = host.getBoundingClientRect();
        const top = Math.max(0, hr.top), bot = Math.min(H, hr.bottom);
        ctx.save();
        ctx.beginPath(); ctx.rect(0, top, W, Math.max(0, bot - top)); ctx.clip();
        const sBase = Math.max(0.85, Math.min(1.25, gw / 150));
        const span = H * 1.3;
        planes.forEach((p) => {
          // sideways glide across the gutter; wraps and fades at both ends
          if (!reduced) p.x += ((p.speed * p.depth * dt) / 14000) * (1 + Math.min(2, Math.abs(vel)) * 0.6);
          if (p.x > 1) p.x -= 1;
          const sz = (13 + p.depth * 9) * sBase; // enlarged 2026-10-02 per Vignesh: "make the paper plane bigger"
          const pad = sz * 1.6 + 6;
          const run = Math.max(1, gw - pad * 2 - 10);
          const along = pad + run * p.x; // distance from the outer edge
          const x = p.side ? W - along : along;
          const raw = p.y * span - scrollS * 0.3 * p.depth;
          const bob = reduced ? 0 : Math.sin(t * 0.0012 * p.speed + p.ph) * 4;
          const yy = (((raw % span) + span) % span) - H * 0.15 + bob;
          const tilt = reduced ? 0 : Math.cos(t * 0.0012 * p.speed + p.ph) * 0.07 - 0.04;
          const edgeX = smooth(0, 0.15, p.x) * smooth(1, 0.8, p.x);
          const edgeY = smooth(-20, H * 0.12, yy) * smooth(H + 20, H * 0.88, yy);
          const a = vis * edgeX * edgeY * (0.3 + p.depth * 0.3);
          if (a <= 0.01) return;
          const color = p.red ? `rgba(255,49,49,${Math.min(1, a * 1.5).toFixed(3)})` : `rgba(255,255,255,${a.toFixed(3)})`;
          drawPlane(x, yy, sz, tilt, p.side ? -1 : 1, color, t, p.ph);
        });
        ctx.restore();
      }
      raf = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
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
