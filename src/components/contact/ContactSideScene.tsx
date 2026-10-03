"use client";

// Contact Us side-strip animation (2026-10-02, per Vignesh: picked ideas 2
// and 3 from the live preview, "add 2 and 3 with proper nice aesthetic
// animation to the contact us"). Chat bubbles + office pins and routes,
// combined into one scene in the gutters beside the content:
//
//   - Office pins: outline map pins (a few in brand red) drop in with a
//     small bounce as they rise into view, each with a soft ground ripple.
//   - Routes: dotted red routes curve from pin to pin and draw themselves
//     as you scroll; a small light travels along each finished route.
//   - Messages: every so often a pin "sends a message": a chat bubble pops
//     up above it (with typing dots, then text lines), drifts up and fades.
//   - A few faint chat bubbles also float slowly up the gutters.
// Pins and routes move with scroll at a slower, parallax rate; everything is
// eased so wheel notches never cause jumps. It lives on a canvas fixed to
// the viewport (pointer-events: none), fades in after the hero and out
// before the footer, and switches off when the gutters are too narrow.
// prefers-reduced-motion: no popping, floating or travelling lights; pins
// and routes still follow scroll.

import { useEffect, useRef } from "react";

const CONTENT_MAX = 1152; // Container max-w-6xl
const CONTENT_PAD = 24; // Container px-6
const CANVAS_BG = "#4A4D52"; // page canvas, fills outline shapes
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeBack = (x: number) => {
  const c = 1.7;
  return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2);
};

type Pin = { x: number; y: number; red: boolean; ph: number };
type Bubble = { side: 0 | 1; lane: number; y: number; depth: number; speed: number; ph: number; red: boolean; dots: boolean; mine: boolean };

export default function ContactSideScene({ targetId }: { targetId: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0, H = 0, gw = 0, dpr = 1, raf = 0, idle = 0, last = 0;
    let scrollS = window.scrollY, lastS = window.scrollY, vel = 0, vis = 0;
    let pins: Pin[][] = [];
    let bubbles: Bubble[] = [];

    let seed = 4;
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
      if (!pins.length) {
        seed = 4;
        const xs = [0.3, 0.68, 0.4, 0.72, 0.28, 0.6];
        pins = [0, 1].map((side) =>
          xs.map((x, i) => ({ x: side ? 1 - x : x, y: (i + 0.35 + rnd() * 0.3) / xs.length, red: i % 3 === 1, ph: rnd() })),
        );
        bubbles = Array.from({ length: 8 }, (_, i) => ({
          side: (i % 2) as 0 | 1,
          lane: [0.5, 0.35, 0.65, 0.45][Math.floor(i / 2) % 4],
          y: (Math.floor(i / 2) + 0.5 + rnd() * 0.4) / 4,
          depth: 0.55 + rnd() * 0.45,
          speed: 0.6 + rnd() * 0.5,
          ph: rnd() * 6.28,
          red: i === 5,
          dots: i % 2 === 0,
          mine: i % 3 === 0,
        }));
      }
    };

    const white = (a: number) => `rgba(255,255,255,${clamp01(a).toFixed(3)})`;
    const red = (a: number) => `rgba(255,49,49,${clamp01(a).toFixed(3)})`;
    const fadeY = (y: number) => smooth(-20, H * 0.14, y) * smooth(H + 20, H * 0.86, y);

    // Rounded chat bubble with a tail, centred on 0,0.
    function bubble(w: number, color: string, mine: boolean, content: "dots" | "lines", t: number) {
      const c = ctx!, h = w * 0.62, r = h * 0.42;
      c.strokeStyle = color; c.fillStyle = CANVAS_BG; c.lineWidth = 1.2; c.lineJoin = "round";
      c.beginPath();
      c.moveTo(-w / 2 + r, -h / 2); c.lineTo(w / 2 - r, -h / 2);
      c.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r); c.lineTo(w / 2, h / 2 - r);
      c.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
      if (mine) { c.lineTo(w * 0.3, h / 2); c.lineTo(w * 0.4, h / 2 + 7); c.lineTo(w * 0.12, h / 2); }
      else { c.lineTo(-w * 0.12, h / 2); c.lineTo(-w * 0.4, h / 2 + 7); c.lineTo(-w * 0.3, h / 2); }
      c.lineTo(-w / 2 + r, h / 2); c.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
      c.lineTo(-w / 2, -h / 2 + r); c.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
      c.closePath(); c.fill(); c.stroke();
      if (content === "dots") {
        c.fillStyle = color;
        for (let k = 0; k < 3; k++) {
          const b = reduced ? 0 : Math.max(0, Math.sin(t * 0.008 - k * 0.9)) * 2.4;
          c.beginPath(); c.arc((k - 1) * w * 0.18, -b, 1.9, 0, 7); c.fill();
        }
      } else {
        c.save(); c.globalAlpha *= 0.75; c.lineWidth = 1;
        c.beginPath(); c.moveTo(-w * 0.3, -h * 0.13); c.lineTo(w * 0.3, -h * 0.13); c.moveTo(-w * 0.3, h * 0.15); c.lineTo(w * 0.08, h * 0.15); c.stroke();
        c.restore();
      }
    }

    function pin(x: number, y: number, drop: number, color: string, a: number, ring: number) {
      const c = ctx!, r = 8, py = y - drop - r * 1.7;
      // ground ripple
      c.lineWidth = 1;
      c.strokeStyle = white(a * (1 - ring) * 0.55);
      c.beginPath(); c.ellipse(x, y, 4 + ring * 20, (4 + ring * 20) * 0.35, 0, 0, 7); c.stroke();
      c.fillStyle = "rgba(0,0,0,.12)";
      c.beginPath(); c.ellipse(x, y, 5, 1.8, 0, 0, 7); c.fill();
      // pin
      c.strokeStyle = color; c.fillStyle = CANVAS_BG; c.lineWidth = 1.4;
      c.beginPath(); c.arc(x, py, r, Math.PI * 0.8, Math.PI * 2.2); c.lineTo(x, y - drop); c.closePath(); c.fill(); c.stroke();
      c.beginPath(); c.arc(x, py, r * 0.38, 0, 7); c.stroke();
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
        const rect = el.getBoundingClientRect();
        const target = smooth(H * 0.55, H * 0.15, rect.top) * smooth(H * 0.45, H * 0.85, rect.bottom);
        vis += (target - vis) * (reduced ? 1 : 1 - Math.exp(-dt / 220));
        if (vis > 0.01) {
          ctx.save();
          // Clip to the content block: nothing paints over the hero banner above it or the footer below (2026-10-02, per Vignesh: "make sure the animations don't show up in hero banner").
          ctx.beginPath(); ctx.rect(0, Math.max(0, rect.top), W, Math.max(0, rect.bottom - Math.max(0, rect.top))); ctx.clip();
          const sc = Math.max(0.95, Math.min(1.25, gw / 150));

          // ---- pins + routes ----
          pins.forEach((ps, side) => {
            const span = H * 1.6;
            const pts = ps.map((p) => {
              const along = 22 + Math.max(0, gw - 44) * p.x;
              return {
                p,
                x: side ? W - along : along,
                y: (((p.y * span - scrollS * 0.35) % span) + span) % span - H * 0.3,
              };
            }).sort((a, b) => a.y - b.y);

            // routes between consecutive pins
            for (let i = 0; i < pts.length - 1; i++) {
              const A = pts[i], B = pts[i + 1];
              if (B.y - A.y > H * 0.6) continue; // skip the wrap-around gap
              const a = 0.6 * vis * Math.min(fadeY(A.y), fadeY(B.y));
              if (a < 0.01) continue;
              const reveal = reduced ? 1 : clamp01((H * 0.9 - B.y) / (H * 0.3));
              if (reveal <= 0) continue;
              const mx = (A.x + B.x) / 2 + (side ? -1 : 1) * 22 * sc, my = (A.y + B.y) / 2;
              const at = (u: number): [number, number] => [
                (1 - u) * (1 - u) * A.x + 2 * (1 - u) * u * mx + u * u * B.x,
                (1 - u) * (1 - u) * A.y + 2 * (1 - u) * u * my + u * u * B.y,
              ];
              ctx.setLineDash([3, 5]); ctx.lineDashOffset = reduced ? 0 : -t * 0.01;
              ctx.strokeStyle = red(a); ctx.lineWidth = 1.2;
              ctx.beginPath(); ctx.moveTo(A.x, A.y);
              const N = 28;
              for (let j = 1; j <= N * reveal; j++) { const [x, y] = at(j / N); ctx.lineTo(x, y); }
              ctx.stroke(); ctx.setLineDash([]);
              // travelling light once the route is drawn
              if (reveal >= 1 && !reduced) {
                const u = (t * 0.00018 + A.p.ph) % 1;
                const [lx, ly] = at(u);
                const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, 9);
                g.addColorStop(0, red(a * 1.6)); g.addColorStop(1, red(0));
                ctx.fillStyle = g; ctx.beginPath(); ctx.arc(lx, ly, 9, 0, 7); ctx.fill();
                ctx.fillStyle = red(Math.min(1, a * 2)); ctx.beginPath(); ctx.arc(lx, ly, 1.8, 0, 7); ctx.fill();
              }
            }

            // pins (+ message pop-ups)
            pts.forEach(({ p, x, y }) => {
              const fa = fadeY(y) * vis;
              if (fa < 0.01) return;
              const enter = clamp01((H * 0.98 - y) / (H * 0.22));
              const drop = reduced ? 0 : (1 - easeBack(enter)) * 28;
              const ring = reduced ? 0.5 : (t * 0.0004 + p.ph) % 1;
              const a = fa * 0.75 * enter;
              ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.translate(-x, -y);
              pin(x, y, drop, p.red ? red(a * 1.3) : white(a), a, ring);
              ctx.restore();

              // a message pops up above the pin now and then
              if (!reduced && enter >= 1) {
                const cyc = (t * 0.00011 + p.ph * 3.7) % 1; // ~9s loop per pin
                if (cyc < 0.42) {
                  const u = cyc / 0.42;
                  const grow = easeBack(clamp01(u / 0.18));
                  const alpha = smooth(0, 0.08, u) * (1 - smooth(0.72, 1, u));
                  const lift = u * 26;
                  const bw = 34 * sc;
                  const bx = x + (side ? -1 : 1) * 10 * sc, by = y - 34 * sc - lift;
                  ctx.save(); ctx.translate(bx, by); ctx.scale(grow, grow);
                  bubble(bw, p.red ? red(fa * alpha * 1.3) : white(fa * alpha * 0.85), side === 1, u < 0.45 ? "dots" : "lines", t);
                  ctx.restore();
                }
              }
            });
          });

          // ---- ambient floating chat bubbles ----
          bubbles.forEach((b) => {
            if (!reduced) b.y += b.speed * 0.000018 * (1 + Math.min(2, Math.abs(vel)));
            const span = H * 1.4, raw = b.y * span - scrollS * 0.2 * b.depth;
            const yy = H * 1.2 - ((((raw % span) + span) % span) - H * 0.2);
            const w = (26 + b.depth * 14) * sc;
            const along = w * 0.6 + 10 + Math.max(0, gw - w * 1.2 - 20) * b.lane;
            const x = (b.side ? W - along : along) + (reduced ? 0 : Math.sin(t * 0.0005 + b.ph) * 6);
            const a = fadeY(yy) * vis * (0.22 + b.depth * 0.2);
            if (a < 0.01) return;
            ctx.save(); ctx.translate(x, yy);
            ctx.rotate(reduced ? 0 : Math.sin(t * 0.0006 + b.ph) * 0.05);
            bubble(w, b.red ? red(a * 1.6) : white(a), b.mine, b.dots ? "dots" : "lines", t);
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
