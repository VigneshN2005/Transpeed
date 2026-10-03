"use client";

// Company page side-strip animation (2026-10-02, per Vignesh: picked three
// ideas from a live preview — "turning globe", "moving words" and "growing
// since 2005 container" — then: "combine and add the animations, and make it
// aesthetic and look nice").
//
// Lives in the empty gutters either side of the page's centred content, on a
// canvas fixed to the viewport (so it stays in view while the content
// scrolls past) and fades in only once the visitor is past the page hero and
// out again before the footer.
//
//   LEFT strip  — "moving words": giant outlined words (values + facts)
//                 run vertically and glide with scroll; the word passing the
//                 middle of the screen fills brand red.
//   RIGHT strip — a two-part story tied to page progress:
//                 first half: a dotted wireframe globe turning slowly, with
//                 routes + travelling pulses from the Bangalore HQ;
//                 second half: cross-fades into "growing since 2005" — the
//                 year rolls 2005 -> current year while a crane stacks
//                 containers into a tower.
//
// Desktop only: it needs real gutter space, so it switches itself off when
// the gutters are narrower than ~100px (phones, tablets, small laptops).
// prefers-reduced-motion keeps the scroll-linked parts but drops the
// time-based motion (no idle drift, no spinning pulses).

import { useEffect, useRef } from "react";
import { locations } from "@/data/contact";

const CONTENT_MAX = 1152; // Container: max-w-6xl
const CONTENT_PAD = 24; // Container: px-6
const RED = "255,49,49";
const FONT_DISPLAY = (px: number, w = 800) => `${w} ${px}px "Oswald", "Barlow Condensed", "Arial Narrow", Arial, sans-serif`;
const FONT_BODY = (px: number, w = 600) => `${w} ${px}px "Segoe UI", Arial, sans-serif`;

const FOUNDED = 2005;

const CITIES = [
  { lat: 12.97, lon: 77.59, hub: true },
  { lat: 39, lon: -98 }, // USA
  { lat: 51, lon: 10 }, // Germany
  { lat: 48, lon: 2 }, // Europe
  { lat: 1.35, lon: 103.8 }, // Singapore
  { lat: -1.3, lon: 36.8 }, // Africa
  { lat: 35, lon: 135 }, // Far East
];

const COLORS = ["#FF3131", "#8c8c8c", "#d6d6d6", "#B91C1C", "#6a6a6a", "#a8a8a8"];

type V3 = [number, number, number];
const toV = (lat: number, lon: number): V3 => {
  const a = (lat * Math.PI) / 180;
  const b = (lon * Math.PI) / 180;
  return [Math.cos(a) * Math.sin(b), Math.sin(a), Math.cos(a) * Math.cos(b)];
};
function project(v: V3, rot: number, tilt: number): V3 {
  let [x, y, z] = v;
  const cr = Math.cos(rot), sr = Math.sin(rot);
  [x, z] = [x * cr - z * sr, x * sr + z * cr];
  const ct = Math.cos(tilt), st = Math.sin(tilt);
  [y, z] = [y * ct - z * st, y * st + z * ct];
  return [x, y, z];
}
function slerp(a: V3, b: V3, s: number): V3 {
  const d = Math.acos(Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2])));
  if (d < 1e-6) return a;
  const k1 = Math.sin((1 - s) * d) / Math.sin(d), k2 = Math.sin(s * d) / Math.sin(d);
  return [a[0] * k1 + b[0] * k2, a[1] * k1 + b[1] * k2, a[2] * k1 + b[2] * k2];
}
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);

export default function CompanySideScene({
  targetId,
  globeUntilId,
  growthFromId,
}: {
  targetId: string;
  /** Globe stays until this section has scrolled past, then fades out. */
  globeUntilId: string;
  /** "Growing since 2005" fades in as this section arrives, then runs to the end. */
  growthFromId: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const thisYear = new Date().getFullYear();
    const WORDS = [
      "RELIABILITY", `SINCE ${FOUNDED}`, "SUSTAINABILITY", `${locations.length} OFFICES`,
      "PEOPLE", "AEO CERTIFIED", "INNOVATION", "GLOBAL NETWORK",
    ];

    let W = 0, H = 0, gw = 0, dpr = 1, raf = 0;
    let wordCache: { font: string; items: { w: string; at: number; tw: number }[]; total: number } | null = null;

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
      wordCache = null;
    };

    // Page progress across the target content block (0 at its start, 1 at its end)
    // plus an overall visibility that fades in after the hero and out before the footer.
    const progress = () => {
      const el = document.getElementById(targetId);
      if (!el) return { p: 0, vis: 0 };
      const r = el.getBoundingClientRect();
      const start = r.top - H * 0.35;
      const span = Math.max(1, r.height - H * 0.65);
      const p = clamp01(-start / span);
      const vis = smooth(H * 0.7, H * 0.25, r.top) * smooth(H * 0.7, H * 0.95, r.bottom);
      return { p, vis };
    };

    function drawWords(t: number, p: number, alpha: number) {
      const fs = Math.max(34, Math.min(gw * 0.62, 118));
      const font = FONT_DISPLAY(fs, 700);
      ctx!.font = font;
      if (!wordCache || wordCache.font !== font) {
        const sep = ctx!.measureText("   ·   ").width;
        const items: { w: string; at: number; tw: number }[] = [];
        let total = 0;
        WORDS.forEach((w) => {
          const tw = ctx!.measureText(w).width;
          items.push({ w, at: total, tw });
          total += tw + sep;
        });
        wordCache = { font, items, total };
      }
      const { items, total } = wordCache;
      const shift = (p * 2200 + (reduced ? 0 : t * 0.016)) % total;
      ctx!.save();
      ctx!.translate(gw / 2, H / 2);
      ctx!.rotate(-Math.PI / 2);
      ctx!.textBaseline = "middle";
      ctx!.textAlign = "left";
      for (let rep = -2; rep <= 2; rep++) {
        items.forEach((it) => {
          const pos = it.at + rep * total - shift - H / 2;
          if (pos > H || pos + it.tw < -H) return;
          const center = pos + it.tw / 2;
          const near = Math.max(0, 1 - Math.abs(center) / (H * 0.3));
          ctx!.lineWidth = 1.2;
          ctx!.strokeStyle = `rgba(255,255,255,${((0.12 + near * 0.14) * alpha).toFixed(3)})`;
          ctx!.strokeText(it.w, pos, 0);
          if (near > 0) {
            ctx!.fillStyle = `rgba(${RED},${(near * 0.6 * alpha).toFixed(3)})`;
            ctx!.fillText(it.w, pos, 0);
          }
        });
      }
      ctx!.restore();
    }

    function drawGlobe(t: number, p: number, alpha: number, scale: number) {
      const cx = W - gw / 2, cy = H * 0.5;
      const r = Math.max(36, Math.min(gw * 0.4, H * 0.27)) * scale;
      const rot = (77.6 * Math.PI) / 180 + (reduced ? 0 : Math.sin(t * 0.00015) * 0.55) + (p - 0.25) * 2.2;
      const tilt = 0.38;
      const g = ctx!.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.1, cx, cy, r * 1.3);
      g.addColorStop(0, `rgba(255,255,255,${(0.08 * alpha).toFixed(3)})`);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx!.fillStyle = g;
      ctx!.beginPath(); ctx!.arc(cx, cy, r * 1.3, 0, 7); ctx!.fill();
      ctx!.strokeStyle = `rgba(255,255,255,${(0.28 * alpha).toFixed(3)})`;
      ctx!.lineWidth = 1.2;
      ctx!.beginPath(); ctx!.arc(cx, cy, r, 0, 7); ctx!.stroke();
      const dot = (lat: number, lon: number) => {
        const [x, y, z] = project(toV(lat, lon), rot, tilt);
        if (z <= 0) return;
        ctx!.fillStyle = `rgba(255,255,255,${((0.1 + z * 0.4) * alpha).toFixed(3)})`;
        ctx!.fillRect(cx + x * r - 0.8, cy - y * r - 0.8, 1.6, 1.6);
      };
      for (let lat = -75; lat <= 75; lat += 15) for (let lon = -180; lon < 180; lon += 6) dot(lat, lon);
      for (let lon = -180; lon < 180; lon += 20) for (let lat = -84; lat <= 84; lat += 4) dot(lat, lon);
      const hub = toV(CITIES[0].lat, CITIES[0].lon);
      CITIES.slice(1).forEach((c, i) => {
        const v = toV(c.lat, c.lon);
        ctx!.beginPath();
        let on = false;
        for (let s = 0; s <= 1.0001; s += 0.02) {
          const q = slerp(hub, v, s), lift = 1 + 0.14 * Math.sin(Math.PI * s);
          const [x, y, z] = project([q[0] * lift, q[1] * lift, q[2] * lift], rot, tilt);
          if (z < -0.05) { on = false; continue; }
          const X = cx + x * r, Y = cy - y * r;
          if (!on) { ctx!.moveTo(X, Y); on = true; } else ctx!.lineTo(X, Y);
        }
        ctx!.strokeStyle = `rgba(${RED},${(0.55 * alpha).toFixed(3)})`;
        ctx!.lineWidth = 1.4;
        ctx!.stroke();
        if (!reduced) {
          const ph = (t * 0.00025 + i * 0.17) % 1;
          const q = slerp(hub, v, ph), lift = 1 + 0.14 * Math.sin(Math.PI * ph);
          const [x, y, z] = project([q[0] * lift, q[1] * lift, q[2] * lift], rot, tilt);
          if (z > 0) {
            ctx!.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
            ctx!.beginPath(); ctx!.arc(cx + x * r, cy - y * r, 2.2, 0, 7); ctx!.fill();
          }
        }
      });
      CITIES.forEach((c) => {
        const [x, y, z] = project(toV(c.lat, c.lon), rot, tilt);
        if (z <= 0) return;
        const X = cx + x * r, Y = cy - y * r;
        ctx!.fillStyle = c.hub ? `rgba(${RED},${alpha})` : `rgba(255,255,255,${alpha})`;
        ctx!.beginPath(); ctx!.arc(X, Y, c.hub ? 4 : 2.6, 0, 7); ctx!.fill();
        if (c.hub) {
          const k = reduced ? 0.5 : (t * 0.0012) % 1;
          ctx!.strokeStyle = `rgba(${RED},${((1 - k) * alpha).toFixed(3)})`;
          ctx!.lineWidth = 1.5;
          ctx!.beginPath(); ctx!.arc(X, Y, 4 + k * 14, 0, 7); ctx!.stroke();
        }
      });
      // caption
      ctx!.textAlign = "center"; ctx!.textBaseline = "alphabetic";
      ctx!.font = FONT_BODY(11);
      ctx!.fillStyle = `rgba(255,255,255,${(0.5 * alpha).toFixed(3)})`;
      ctx!.fillText("BANGALORE HQ · WORLDWIDE", cx, cy + r + 30);
    }

    // ---- smoothing + container queue state ----
    // Everything scroll-linked eases toward its target instead of jumping
    // with each wheel notch (2026-10-02, Vignesh: "make the animations a bit
    // smooth and appear nicely ... look aesthetic").
    const sm = { p: 0, vis: 0, globeA: 1, growA: 0, sp: 0, init: false };
    let lastT = 0;

    function drawGrowth(t: number, sp: number, alpha: number) {
      const cx = W - gw / 2;
      const yearNow = FOUNDED + sp * (thisYear - FOUNDED);
      const fs = Math.max(28, Math.min(gw * 0.34, 74));
      // staged entrance: label -> year -> tower, each sliding up into place
      const aLabel = smooth(0, 0.45, alpha), aYear = smooth(0.15, 0.7, alpha), aTower = smooth(0.35, 1, alpha);
      const topY = H * 0.2;
      ctx!.textAlign = "center"; ctx!.textBaseline = "middle";
      ctx!.font = FONT_BODY(11);
      ctx!.fillStyle = `rgba(255,255,255,${(0.55 * aLabel).toFixed(3)})`;
      ctx!.fillText("GROWING SINCE", cx, topY - fs * 0.9 + (1 - aLabel) * 12);
      ctx!.font = FONT_DISPLAY(fs, 700);
      const yOff = (1 - aYear) * 18;
      const n = Math.floor(yearNow), f = yearNow - n;
      const roll = f < 0.7 ? 0 : easeOut((f - 0.7) / 0.3); // digits hold, then roll over quickly like an odometer
      ctx!.save();
      ctx!.beginPath(); ctx!.rect(cx - gw / 2, topY - fs * 0.5 + yOff, gw, fs * 1.0); ctx!.clip();
      ([[n, -roll], [n + 1, 1 - roll]] as [number, number][]).forEach(([yr, off]) => {
        if (yr > thisYear) return;
        const y = topY + yOff + off * fs;
        const str = String(yr);
        const tail = ctx!.measureText(str.slice(2)).width;
        const fade = aYear * (1 - Math.min(1, Math.abs(off) * 1.4)); // fade each number as it rolls out / in
        ctx!.lineWidth = 1.4;
        ctx!.strokeStyle = `rgba(255,255,255,${(0.7 * fade).toFixed(3)})`;
        ctx!.strokeText(str, cx, y);
        ctx!.fillStyle = `rgba(${RED},${(0.92 * fade).toFixed(3)})`;
        ctx!.fillText(str.slice(0, 2), cx - tail / 2, y);
      });
      ctx!.restore();
      ctx!.font = FONT_BODY(11);
      ctx!.fillStyle = `rgba(255,255,255,${(0.42 * aYear).toFixed(3)})`;
      const yrs = Math.floor(yearNow) - FOUNDED; // same rounding as the year shown above
      ctx!.fillText(`${yrs} ${yrs === 1 ? "YEAR" : "YEARS"}`, cx, topY + fs * 0.9 + yOff);

      // Container tower — SCRUBBED by scroll (2026-10-02, per Vignesh: "it
      // should be scroll time animation, like when i move down the container
      // drop and when i move up it should be removed"). No timers: the
      // smoothed scroll progress `sp` maps straight to a continuous container
      // count, so the container being lowered sits exactly as far down its
      // cable as you have scrolled — stop scrolling and it stops mid-air,
      // scroll up and it is lifted back off. (Replaces the earlier timed
      // drop queue, which kept dropping after the scroll had stopped.)
      const wC = Math.max(34, Math.min(gw * 0.56, 116)), hC = wC * 0.36;
      const baseY = H * 0.9 + (1 - aTower) * 24, ceil = topY + fs * 1.5;
      const maxN = Math.max(1, Math.floor((baseY - ceil) / hC) - 1);
      const jibY = ceil - hC * 1.4;
      const count = sp * maxN; // continuous: whole part = landed, fraction = the one on the cable
      ctx!.strokeStyle = `rgba(255,255,255,${(0.3 * aTower).toFixed(3)})`;
      ctx!.lineWidth = 2;
      ctx!.beginPath(); ctx!.moveTo(cx - wC * 0.85, baseY); ctx!.lineTo(cx + wC * 0.85, baseY); ctx!.stroke();
      const shown = Math.min(maxN, Math.ceil(count));
      for (let i = 0; i < shown; i++) {
        const k = clamp01(count - i); // 0 = just picked up at the jib, 1 = landed
        const targetY = baseY - (i + 1) * hC;
        const startY = jibY + 10;
        const y = startY + (targetY - startY) * (reduced ? 1 : smooth(0, 1, k));
        const a = aTower * smooth(0, 0.18, k);
        const x = cx - wC / 2 + (i % 2 ? wC * 0.05 : -wC * 0.04);
        if (k > 0.9) {
          ctx!.fillStyle = `rgba(0,0,0,${(0.18 * a).toFixed(3)})`;
          ctx!.fillRect(x + 3, y + hC - 2, wC - 6, 3);
        }
        ctx!.globalAlpha = a;
        ctx!.fillStyle = COLORS[i % COLORS.length];
        ctx!.fillRect(x, y, wC, hC - 2);
        ctx!.fillStyle = "rgba(255,255,255,.12)";
        ctx!.fillRect(x, y, wC, 2);
        ctx!.strokeStyle = "rgba(0,0,0,.26)";
        ctx!.lineWidth = 1;
        for (let sx = x + 7; sx < x + wC - 3; sx += 7) {
          ctx!.beginPath(); ctx!.moveTo(sx, y + 3); ctx!.lineTo(sx, y + hC - 5); ctx!.stroke();
        }
        ctx!.globalAlpha = 1;
        // crane cable on the container that's still being lowered
        const cableA = (1 - smooth(0.92, 1, k)) * aTower;
        if (cableA > 0.01) {
          ctx!.strokeStyle = `rgba(255,255,255,${(0.55 * cableA).toFixed(3)})`;
          ctx!.lineWidth = 1.2;
          ctx!.beginPath();
          ctx!.moveTo(x + wC / 2, jibY); ctx!.lineTo(x + wC / 2, y - 6);
          ctx!.moveTo(x + wC / 2, y - 6); ctx!.lineTo(x + 4, y);
          ctx!.moveTo(x + wC / 2, y - 6); ctx!.lineTo(x + wC - 4, y);
          ctx!.stroke();
        }
      }
    }

    const loop = (t: number) => {
      const dt = lastT ? Math.min(64, t - lastT) : 16;
      lastT = t;
      ctx.clearRect(0, 0, W, H);
      if (gw >= 100) {
        const { p, vis } = progress();
        // targets for the section-anchored handover (see note below)
        let globeT = 1 - p, growT = p, spT = p;
        const gEl = document.getElementById(globeUntilId);
        const fEl = document.getElementById(growthFromId);
        const cEl = document.getElementById(targetId);
        if (gEl && fEl && cEl) {
          // Globe fades out as #globeUntilId finishes scrolling past; growth
          // takes over as #growthFromId arrives (2026-10-02, per Vignesh: "make
          // the globe disappear once the global network presence is finished,
          // and by the time i arrive at our philosophy the next animation
          // should come"). Clean hand-off, never both at full strength.
          const gb = gEl.getBoundingClientRect().bottom;
          const ft = fEl.getBoundingClientRect().top;
          const cb = cEl.getBoundingClientRect().bottom;
          globeT = smooth(H * 0.45, H * 0.75, gb);
          growT = Math.min(smooth(H * 0.75, H * 0.45, ft), 1 - globeT);
          spT = clamp01((H * 0.45 - ft) / Math.max(1, cb - ft - H * 0.55));
        }
        // exponential smoothing toward targets (~frame-rate independent)
        const k = reduced || !sm.init ? 1 : 1 - Math.exp(-dt / 170);
        const kSlow = reduced || !sm.init ? 1 : 1 - Math.exp(-dt / 260);
        sm.p += (p - sm.p) * k;
        sm.vis += (vis - sm.vis) * k;
        sm.globeA += (globeT - sm.globeA) * kSlow;
        sm.growA += (growT - sm.growA) * kSlow;
        sm.sp += (spT - sm.sp) * kSlow;
        sm.init = true;
        if (sm.vis > 0.01 && cEl) {
          // Clip to the content block: nothing paints over the hero banner above it or the footer below (2026-10-02, per Vignesh: "make sure the animations don't show up in hero banner").
          const cr = cEl.getBoundingClientRect();
          const top = Math.max(0, cr.top), bot = Math.min(H, cr.bottom);
          ctx.save();
          ctx.beginPath(); ctx.rect(0, top, W, Math.max(0, bot - top)); ctx.clip();
          drawWords(t, sm.p, sm.vis);
          const ga = sm.globeA * sm.vis;
          if (ga > 0.01) drawGlobe(t, sm.p, ga, 0.86 + 0.14 * easeOut(sm.globeA));
          const fa = sm.growA * sm.vis;
          if (fa > 0.01) drawGrowth(t, sm.sp, fa);
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
      window.removeEventListener("resize", resize);
    };
  }, [targetId, globeUntilId, growthFromId]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 hidden lg:block"
      style={{ position: "fixed", left: 0, top: 0, pointerEvents: "none" }}
    />
  );
}
