"use client";

// Phone/tablet banner animations (2026-10-03, per Vignesh: "apply what's
// possible on the mobile view, but make it look proper ... aesthetic,
// professional and premium"). The desktop side-strip scenes need the empty
// margins beside the content, which phones don't have, so below laptop
// width (lg) each page gets a light version of its scene inside its dark
// top banner instead:
//   home     - a small truck drives along a dotted road at the banner's foot;
//              a plane glides across the top with a dashed trail
//   services - a truck travels a dotted route between three stops
//   company  - a wireframe globe turns with red route arcs and pulses
//   people   - three outline paper planes glide across
//   news     - envelopes float up and fold into newspapers, then back
//   contact  - map pins drop in, a dotted route links them, a light travels
//              it, and a chat bubble pops up now and then
// Kept faint and mostly to the right, so titles stay easy to read. Never
// takes taps (pointer-events: none). Pauses when off screen or the tab is
// hidden. prefers-reduced-motion: one still frame. Hidden from lg upward,
// where the desktop scenes take over.

import { useEffect, useRef } from "react";

export type MobileSceneKind = "home" | "services" | "company" | "people" | "news" | "contact";

const RED = "255,49,49";
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => x * x * (3 - 2 * x);

export default function MobileBannerScene({
  kind,
  className = "absolute inset-0",
  fill = "#1A1A1A",
}: {
  kind: MobileSceneKind;
  className?: string;
  /** Background colour behind the scene, used to fill the outline shapes. */
  fill?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cv = ref.current;
    const box = boxRef.current;
    if (!cv || !box) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const BG = fill;
    // Home only: positions of page elements the plane/ship are placed around
    // (the AEO pill above which the plane flies, the buttons row the ship
    // sits below), measured relative to this box.
    let planeY = -1, shipX = -1, shipY = -1;
    const measureAnchors = () => {
      if (kind !== "home") return;
      const host = box.parentElement;
      const b = box.getBoundingClientRect();
      const pill = host?.querySelector("[data-mb-plane-anchor]")?.getBoundingClientRect();
      const btns = host?.querySelector("[data-mb-ship-anchor]")?.getBoundingClientRect();
      planeY = pill ? Math.max(28, (pill.top - b.top) / 2) : -1;
      if (btns) {
        const btnRight = Math.max(...Array.from(host!.querySelectorAll("[data-mb-ship-anchor] > *")).map((el) => el.getBoundingClientRect().right - b.left));
        shipX = Math.min(b.width - 52, Math.max(btnRight - 20, b.width * 0.72));
        shipY = btns.bottom - b.top + 28;
      }
    };
    let W = 0, H = 0, raf = 0, visible = true, t0 = performance.now();

    // Size from the wrapper box (a fixed CSS size), never from the canvas
    // itself: measuring the canvas fed its own pixel size back into its
    // layout size, so it grew on every resize until the phone ran out of
    // graphics memory (2026-10-03 fix). Pixel budget capped as well.
    const resize = () => {
      W = box.clientWidth; H = box.clientHeight;
      measureAnchors();
      let dpr = Math.min(2, window.devicePixelRatio || 1);
      const MAX_PX = 1_600_000;
      if (W * H * dpr * dpr > MAX_PX) dpr = Math.max(1, Math.sqrt(MAX_PX / Math.max(1, W * H)));
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduced) draw(4000);
    };
    const w = (a: number) => `rgba(255,255,255,${clamp01(a).toFixed(3)})`;
    const r = (a: number) => `rgba(${RED},${clamp01(a).toFixed(3)})`;

    // ---------- shapes ----------
    function truck(x: number, y: number, s: number, dir: 1 | -1, t: number, lights: boolean) {
      ctx!.save(); ctx!.translate(x, y); ctx!.scale(s * dir, s);
      ctx!.lineWidth = 1.3 / s; ctx!.strokeStyle = w(0.55); ctx!.fillStyle = BG;
      ctx!.beginPath(); ctx!.roundRect(-34, -22, 40, 20, 2); ctx!.fill(); ctx!.stroke(); // trailer
      ctx!.strokeStyle = r(0.85);
      ctx!.beginPath(); ctx!.moveTo(8, -2); ctx!.lineTo(8, -18); ctx!.lineTo(19, -18); ctx!.lineTo(25, -9); ctx!.lineTo(25, -2); ctx!.closePath(); ctx!.fill(); ctx!.stroke(); // cab
      ctx!.beginPath(); ctx!.moveTo(12, -15); ctx!.lineTo(18, -15); ctx!.lineTo(22, -9); ctx!.lineTo(12, -9); ctx!.closePath(); ctx!.stroke();
      ctx!.strokeStyle = w(0.6);
      for (const wx of [-26, -14, 18]) {
        ctx!.beginPath(); ctx!.arc(wx, 0, 3.6, 0, 7); ctx!.fill(); ctx!.stroke();
        const a = reduced ? 0 : t * 0.012;
        ctx!.beginPath(); ctx!.moveTo(wx + Math.cos(a) * 2.2, Math.sin(a) * 2.2); ctx!.lineTo(wx - Math.cos(a) * 2.2, -Math.sin(a) * 2.2); ctx!.stroke();
      }
      ctx!.font = `700 ${6}px Arial`; ctx!.fillStyle = w(0.5); ctx!.textAlign = "center";
      ctx!.save(); if (dir < 0) ctx!.scale(-1, 1); ctx!.fillText("TRANSPEED", dir < 0 ? 14 : -14, -10); ctx!.restore();
      if (lights) {
        const g = ctx!.createLinearGradient(25, 0, 70, 0); g.addColorStop(0, "rgba(255,230,170,.35)"); g.addColorStop(1, "rgba(255,230,170,0)");
        ctx!.fillStyle = g; ctx!.beginPath(); ctx!.moveTo(25, -6); ctx!.lineTo(70, -14); ctx!.lineTo(70, 4); ctx!.closePath(); ctx!.fill();
      }
      ctx!.restore();
    }
    // Small container ship riding gentle waves (home banner on phones).
    function ship(x: number, y: number, s: number, t: number) {
      const c = ctx!;
      const bob = reduced ? 0 : Math.sin(t * 0.0021) * 1.6;
      const roll = reduced ? 0 : Math.sin(t * 0.0017) * 0.025;
      // waves (drawn under and around the hull)
      c.save(); c.lineWidth = 1.2;
      for (let k = 0; k < 2; k++) {
        c.strokeStyle = w(0.32 - k * 0.12); c.beginPath();
        for (let i = -46; i <= 46; i += 2) {
          const yy = y + 6 * s + k * 6 * s + Math.sin(i * 0.17 + (reduced ? 0 : t * 0.003) + k * 1.4) * 1.6 * s;
          i === -46 ? c.moveTo(x + i * s, yy) : c.lineTo(x + i * s, yy);
        }
        c.stroke();
      }
      c.restore();
      c.save(); c.translate(x, y + bob); c.rotate(roll); c.scale(s, s);
      c.lineWidth = 1.2 / s; c.lineJoin = "round"; c.fillStyle = BG;
      // containers (behind the hull top)
      const cols = ["r", "w", "w", "r", "w", "r"];
      cols.forEach((col, i) => {
        const cx = -22 + (i % 3) * 9, cy = i < 3 ? -9 : -15;
        if (i >= 3 && i === 5) return;
        c.strokeStyle = col === "r" ? r(0.85) : w(0.55);
        c.fillRect(cx, cy, 8, 6); c.strokeRect(cx, cy, 8, 6);
      });
      // bridge + funnel at the stern (right side, ship faces left)
      c.strokeStyle = w(0.6);
      c.fillRect(10, -16, 10, 13); c.strokeRect(10, -16, 10, 13);
      c.beginPath(); c.moveTo(12, -12); c.lineTo(18, -12); c.stroke();
      c.strokeStyle = r(0.85); c.fillRect(14, -23, 5, 7); c.strokeRect(14, -23, 5, 7);
      // hull
      c.strokeStyle = w(0.65);
      c.beginPath(); c.moveTo(-34, -3); c.lineTo(26, -3); c.lineTo(22, 6); c.lineTo(-28, 6); c.closePath(); c.fill(); c.stroke();
      c.strokeStyle = r(0.7); c.beginPath(); c.moveTo(-31, 2); c.lineTo(23.5, 2); c.stroke();
      c.restore();
      // smoke drifting back from the funnel
      if (!reduced) {
        for (let k = 0; k < 3; k++) {
          const u = ((t * 0.0005) + k / 3) % 1;
          c.fillStyle = w(0.18 * (1 - u));
          c.beginPath(); c.arc(x + (16.5 + u * 22) * s, y + bob + (-25 - u * 12) * s, (2 + u * 4) * s, 0, 7); c.fill();
        }
      }
    }

    function plane(x: number, y: number, s: number, tilt: number, a: number, trail: number) {
      ctx!.save(); ctx!.translate(x, y); ctx!.rotate(tilt); ctx!.scale(s, s);
      ctx!.lineWidth = 1.2 / s; ctx!.strokeStyle = w(a); ctx!.fillStyle = BG;
      ctx!.beginPath(); // airliner silhouette facing +x
      ctx!.moveTo(22, 0); ctx!.quadraticCurveTo(18, -3, 8, -3); ctx!.lineTo(-16, -2.5); ctx!.lineTo(-22, -9); ctx!.lineTo(-25, -9); ctx!.lineTo(-21, -1.5);
      ctx!.lineTo(-21, 1.5); ctx!.lineTo(-25, 3); ctx!.lineTo(-16, 2.5); ctx!.lineTo(8, 3); ctx!.quadraticCurveTo(18, 3, 22, 0); ctx!.closePath(); ctx!.fill(); ctx!.stroke();
      ctx!.beginPath(); ctx!.moveTo(4, -2.5); ctx!.lineTo(-8, -15); ctx!.lineTo(-12, -15); ctx!.lineTo(-5, -2.5); ctx!.moveTo(4, 2.5); ctx!.lineTo(-6, 9); ctx!.lineTo(-10, 9); ctx!.lineTo(-5, 2.5); ctx!.stroke();
      ctx!.restore();
      if (trail > 0) {
        ctx!.save(); ctx!.setLineDash([3, 6]); ctx!.strokeStyle = w(a * 0.45); ctx!.lineWidth = 1;
        ctx!.beginPath(); ctx!.moveTo(x - Math.cos(tilt) * 26 * s, y - Math.sin(tilt) * 26 * s);
        ctx!.lineTo(x - Math.cos(tilt) * (26 * s + trail), y - Math.sin(tilt) * (26 * s + trail)); ctx!.stroke(); ctx!.restore();
      }
    }
    function paperPlane(x: number, y: number, sz: number, tilt: number, color: string) {
      ctx!.save(); ctx!.translate(x, y); ctx!.rotate(tilt); ctx!.strokeStyle = color; ctx!.lineWidth = 1.2; ctx!.lineJoin = "round";
      ctx!.beginPath(); ctx!.moveTo(sz * 1.4, 0); ctx!.lineTo(-sz, -sz * 0.7); ctx!.lineTo(-sz * 0.35, 0); ctx!.lineTo(-sz, sz * 0.45); ctx!.closePath();
      ctx!.moveTo(sz * 1.4, 0); ctx!.lineTo(-sz * 0.35, 0); ctx!.moveTo(sz * 1.4, 0); ctx!.lineTo(-sz * 0.55, sz * 0.18); ctx!.stroke();
      ctx!.globalAlpha = 0.5; ctx!.setLineDash([2, 5]); ctx!.beginPath(); ctx!.moveTo(-sz * 0.6, sz * 0.1); ctx!.lineTo(-sz * 0.6 - 60, sz * 0.1 + 4); ctx!.stroke();
      ctx!.restore();
    }
    function envelope(wd: number, color: string, open: number) {
      const h = wd * 0.66; ctx!.strokeStyle = color; ctx!.fillStyle = BG; ctx!.lineWidth = 1.1;
      if (open > 0.02) {
        const cy = -h / 2 - h * 0.55 * open;
        ctx!.fillRect(-wd * 0.38, cy, wd * 0.76, h * 0.7); ctx!.strokeRect(-wd * 0.38, cy, wd * 0.76, h * 0.7);
      }
      ctx!.fillRect(-wd / 2, -h / 2, wd, h); ctx!.strokeRect(-wd / 2, -h / 2, wd, h);
      ctx!.beginPath(); ctx!.moveTo(-wd / 2, -h / 2); ctx!.lineTo(0, -h / 2 + h * 0.55 * (1 - 2 * open)); ctx!.lineTo(wd / 2, -h / 2); ctx!.stroke();
    }
    function newspaper(wd: number, color: string, u: number) {
      const h = wd * 0.72, half = (wd / 2) * u; ctx!.strokeStyle = color; ctx!.fillStyle = BG; ctx!.lineWidth = 1.1;
      ctx!.beginPath(); ctx!.moveTo(-half, -h / 2 + 3); ctx!.lineTo(0, -h / 2); ctx!.lineTo(half, -h / 2 + 3); ctx!.lineTo(half, h / 2); ctx!.lineTo(0, h / 2 - 3); ctx!.lineTo(-half, h / 2); ctx!.closePath(); ctx!.fill(); ctx!.stroke();
      ctx!.beginPath(); ctx!.moveTo(0, -h / 2); ctx!.lineTo(0, h / 2 - 3); ctx!.stroke();
      ctx!.save(); ctx!.globalAlpha *= 0.7; ctx!.lineWidth = 0.8; ctx!.beginPath();
      for (let k = 0; k < 4; k++) { ctx!.moveTo(-wd * 0.42 * u, -h * 0.2 + k * h * 0.14); ctx!.lineTo(-wd * 0.08 * u, -h * 0.2 + k * h * 0.14); ctx!.moveTo(wd * 0.08 * u, -h * 0.2 + k * h * 0.14); ctx!.lineTo(wd * 0.42 * u, -h * 0.2 + k * h * 0.14); }
      ctx!.stroke(); ctx!.restore();
    }
    function pin(x: number, y: number, color: string) {
      const rr = 7, py = y - rr * 1.7; ctx!.strokeStyle = color; ctx!.fillStyle = BG; ctx!.lineWidth = 1.3;
      ctx!.beginPath(); ctx!.arc(x, py, rr, Math.PI * 0.8, Math.PI * 2.2); ctx!.lineTo(x, y); ctx!.closePath(); ctx!.fill(); ctx!.stroke();
      ctx!.beginPath(); ctx!.arc(x, py, rr * 0.38, 0, 7); ctx!.stroke();
    }
    function bubble(wd: number, color: string, t: number) {
      const h = wd * 0.6, rr = h * 0.42; ctx!.strokeStyle = color; ctx!.fillStyle = BG; ctx!.lineWidth = 1.1;
      ctx!.beginPath(); ctx!.roundRect(-wd / 2, -h / 2, wd, h, rr); ctx!.fill(); ctx!.stroke();
      ctx!.beginPath(); ctx!.moveTo(-wd * 0.15, h / 2 - 0.5); ctx!.lineTo(-wd * 0.32, h / 2 + 6); ctx!.lineTo(-wd * 0.02, h / 2 - 0.5); ctx!.fill(); ctx!.stroke();
      ctx!.fillStyle = color;
      for (let k = 0; k < 3; k++) { const b = reduced ? 0 : Math.max(0, Math.sin(t * 0.008 - k * 0.9)) * 2; ctx!.beginPath(); ctx!.arc((k - 1) * wd * 0.18, -b, 1.7, 0, 7); ctx!.fill(); }
    }

    // ---------- scenes ----------
    function draw(t: number) {
      ctx!.clearRect(0, 0, W, H);
      if (W < 10 || H < 10) return;
      const S = Math.max(0.8, Math.min(1.15, W / 420));

      if (kind === "home") {
        const roadY = H - 18;
        ctx!.save(); ctx!.setLineDash([10, 9]); ctx!.lineDashOffset = reduced ? 0 : t * 0.06; ctx!.strokeStyle = w(0.18); ctx!.lineWidth = 1.5;
        ctx!.beginPath(); ctx!.moveTo(0, roadY + 6); ctx!.lineTo(W, roadY + 6); ctx!.stroke(); ctx!.restore();
        const cyc = reduced ? 0.55 : (t * 0.00006) % 1;
        const tx = -60 + (W + 120) * cyc;
        truck(tx, roadY + 2, 0.95 * S, 1, t, cyc > 0.45);
        const pc = reduced ? 0.5 : ((t * 0.00005) + 0.3) % 1;
        // plane: bigger, flying in the empty band above the AEO pill (2026-10-03, per Vignesh)
        const ps = 1.55 * S;
        const px = W + 60 * ps - (W + 120 * ps) * pc;
        const py = (planeY > 0 ? planeY : H * 0.06) + Math.sin(pc * Math.PI) * -6;
        ctx!.save(); ctx!.translate(px, py); ctx!.scale(-1, 1); ctx!.translate(-px, -py);
        plane(px, py, ps, -0.04, 0.5, 90); ctx!.restore();
        // small ship sailing in place below "About Us", on the right (2026-10-03, per Vignesh)
        if (shipX > 0 && shipY > 0 && shipY < H - 40) {
          const drift = reduced ? 0 : Math.sin(t * 0.00035) * 10;
          ship(shipX + drift, shipY, 1.05 * S, t);
        }
      }

      if (kind === "services") {
        // a gentle dotted route along the lower part, three stops, truck stays level
        const route = [[-50, H * 0.9], [W * 0.38, H * 0.9], [W * 0.62, H * 0.78], [W * 0.86, H * 0.88], [W + 60, H * 0.8]];
        ctx!.save(); ctx!.setLineDash([4, 6]); ctx!.strokeStyle = w(0.2); ctx!.lineWidth = 1.4;
        ctx!.beginPath(); route.forEach(([x, y], k) => (k ? ctx!.lineTo(x, y) : ctx!.moveTo(x, y))); ctx!.stroke(); ctx!.restore();
        const seg = route.length - 1, cyc = reduced ? 0.55 : (t * 0.00006) % 1, f = cyc * seg, i = Math.min(seg - 1, Math.floor(f)), u = f - i;
        const [x1, y1] = route[i], [x2, y2] = route[i + 1];
        const x = x1 + (x2 - x1) * u, y = y1 + (y2 - y1) * u;
        [1, 2, 3].forEach((k) => {
          const [sx, sy] = route[k], passed = f > k;
          ctx!.fillStyle = passed ? r(0.8) : w(0.25); ctx!.beginPath(); ctx!.arc(sx, sy, 3.5, 0, 7); ctx!.fill();
          ctx!.strokeStyle = passed ? r(0.35) : w(0.14); ctx!.beginPath(); ctx!.arc(sx, sy, 8, 0, 7); ctx!.stroke();
        });
        truck(x, y - 3, 0.75 * S, 1, t, false);
      }

      if (kind === "company") {
        const R = Math.min(H * 0.48, W * 0.36), cx = W - R * 0.45, cy = H * 0.6;
        const rot = reduced ? 0.6 : t * 0.00018, tilt = 0.38;
        ctx!.save(); ctx!.translate(cx, cy);
        const g = ctx!.createRadialGradient(0, 0, R * 0.2, 0, 0, R * 1.2); g.addColorStop(0, "rgba(255,49,49,.08)"); g.addColorStop(1, "rgba(255,49,49,0)");
        ctx!.fillStyle = g; ctx!.beginPath(); ctx!.arc(0, 0, R * 1.2, 0, 7); ctx!.fill();
        ctx!.strokeStyle = w(0.16); ctx!.lineWidth = 1; ctx!.beginPath(); ctx!.arc(0, 0, R, 0, 7); ctx!.stroke();
        const proj = (lat: number, lon: number) => {
          const x = Math.cos(lat) * Math.sin(lon + rot), y0 = Math.sin(lat), z0 = Math.cos(lat) * Math.cos(lon + rot);
          const y = y0 * Math.cos(tilt) - z0 * Math.sin(tilt), z = y0 * Math.sin(tilt) + z0 * Math.cos(tilt);
          return [x * R, -y * R, z] as const;
        };
        for (let k = -2; k <= 2; k++) { const lat = (k * Math.PI) / 6; ctx!.beginPath(); let first = true;
          for (let a = 0; a <= 64; a++) { const [x, y, z] = proj(lat, (a / 64) * Math.PI * 2); if (z < 0) { first = true; continue; } first ? ctx!.moveTo(x, y) : ctx!.lineTo(x, y); first = false; }
          ctx!.strokeStyle = w(0.09); ctx!.stroke(); }
        for (let k = 0; k < 8; k++) { const lon = (k * Math.PI) / 4; ctx!.beginPath(); let first = true;
          for (let a = 0; a <= 48; a++) { const [x, y, z] = proj(-Math.PI / 2 + (a / 48) * Math.PI, lon); if (z < 0) { first = true; continue; } first ? ctx!.moveTo(x, y) : ctx!.lineTo(x, y); first = false; }
          ctx!.strokeStyle = w(0.07); ctx!.stroke(); }
        const routes = [[0.22, 1.35, 0.6, 2.4], [0.22, 1.35, -0.2, 0.3], [0.22, 1.35, 0.9, -0.9], [0.22, 1.35, 0.1, 2.0]];
        routes.forEach(([la1, lo1, la2, lo2], k) => {
          ctx!.beginPath(); let first = true; const pts: (readonly [number, number, number])[] = [];
          for (let a = 0; a <= 30; a++) { const u = a / 30; const lift = Math.sin(u * Math.PI) * 0.12;
            const p = proj(la1 + (la2 - la1) * u, lo1 + (lo2 - lo1) * u); const P = [p[0] * (1 + lift), p[1] * (1 + lift), p[2]] as const; pts.push(P);
            if (P[2] < 0) { first = true; continue; } first ? ctx!.moveTo(P[0], P[1]) : ctx!.lineTo(P[0], P[1]); first = false; }
          ctx!.strokeStyle = r(0.32); ctx!.lineWidth = 1; ctx!.stroke();
          const u = reduced ? 0.5 : ((t * 0.00025) + k * 0.27) % 1, P = pts[Math.floor(u * 30)];
          if (P && P[2] >= 0) { ctx!.fillStyle = r(0.9); ctx!.beginPath(); ctx!.arc(P[0], P[1], 2, 0, 7); ctx!.fill(); }
        });
        const [hx, hy, hz] = proj(0.22, 1.35);
        if (hz >= 0) { ctx!.fillStyle = r(0.95); ctx!.beginPath(); ctx!.arc(hx, hy, 3, 0, 7); ctx!.fill(); ctx!.strokeStyle = r(0.4); ctx!.beginPath(); ctx!.arc(hx, hy, 7 + (reduced ? 0 : (t * 0.01) % 8), 0, 7); ctx!.stroke(); }
        ctx!.restore();
      }

      if (kind === "people") {
        [[0.2, 0.0, 1.0, false], [0.48, 0.38, 0.8, true], [0.78, 0.7, 0.9, false]].forEach(([fy, ph, sp, red]) => {
          const cyc = reduced ? 0.6 + (fy as number) * 0.3 : ((t * 0.00006 * (sp as number)) + (ph as number)) % 1;
          const x = -40 + (W + 80) * cyc, y = H * (fy as number) + Math.sin(t * 0.0012 + (ph as number) * 6) * 5;
          const a = Math.min(clamp01(cyc / 0.12), clamp01((1 - cyc) / 0.12)) * 0.42;
          paperPlane(x, y, 11 * S, -0.04 + Math.cos(t * 0.0012 + (ph as number) * 6) * 0.06, red ? r(a * 1.6) : w(a));
        });
      }

      if (kind === "news") {
        const items = [[0.66, 0.0], [0.86, 0.35], [0.76, 0.62], [0.94, 0.85]];
        items.forEach(([fx, ph], k) => {
          const cyc = reduced ? (ph + 0.3) % 1 : ((t * 0.00005) + ph) % 1;
          const y = H + 30 - (H + 60) * cyc, x = W * fx + Math.sin(t * 0.0006 + k) * 6;
          const a = Math.min(clamp01(cyc / 0.15), clamp01((1 - cyc) / 0.2)) * 0.45;
          const m = ease(clamp01((cyc - 0.35) / 0.3)); // folds into a newspaper as it rises
          const col = k === 1 ? r(a * 1.5) : w(a);
          ctx!.save(); ctx!.translate(x, y); ctx!.rotate(Math.sin(t * 0.0005 + k) * (0.08 + m * 0.2));
          if (m < 0.98) { ctx!.save(); ctx!.globalAlpha = 1 - m; envelope(26 * S, col, 0); ctx!.restore(); }
          if (m > 0.02) { ctx!.save(); ctx!.globalAlpha = m; newspaper(30 * S, col, 0.2 + 0.8 * m); ctx!.restore(); }
          ctx!.restore();
        });
      }

      if (kind === "contact") {
        const P = [[0.58, 0.9], [0.72, 0.66], [0.86, 0.84], [0.95, 0.6]].map(([fx, fy]) => [W * fx, H * fy]);
        const cyc = reduced ? 0.99 : (t * 0.00008) % 1.4;
        ctx!.save(); ctx!.setLineDash([3, 5]); ctx!.lineDashOffset = reduced ? 0 : -t * 0.01; ctx!.strokeStyle = r(0.45); ctx!.lineWidth = 1.2;
        for (let i = 0; i < P.length - 1; i++) {
          const u = clamp01(cyc * 3.2 - i - 0.4); if (u <= 0) continue;
          const [x1, y1] = P[i], [x2, y2] = P[i + 1], mx = (x1 + x2) / 2 + 14, my = (y1 + y2) / 2 - 8;
          ctx!.beginPath(); ctx!.moveTo(x1, y1);
          for (let j = 1; j <= 20 * u; j++) { const s = j / 20; ctx!.lineTo((1 - s) ** 2 * x1 + 2 * (1 - s) * s * mx + s * s * x2, (1 - s) ** 2 * y1 + 2 * (1 - s) * s * my + s * s * y2); }
          ctx!.stroke();
        }
        ctx!.restore();
        P.forEach(([x, y], i) => {
          const enter = clamp01(cyc * 3.2 - i * 0.8 + 0.5); if (enter <= 0) return;
          const drop = (1 - ease(enter)) * 18;
          ctx!.strokeStyle = w(0.25 * enter); ctx!.lineWidth = 1; const ring = reduced ? 0.4 : (t * 0.0005 + i * 0.3) % 1;
          ctx!.beginPath(); ctx!.ellipse(x, y, 3 + ring * 14, (3 + ring * 14) * 0.35, 0, 0, 7); ctx!.globalAlpha = 1 - ring; ctx!.stroke(); ctx!.globalAlpha = 1;
          pin(x, y - drop, i === 1 ? r(0.85 * enter) : w(0.55 * enter));
        });
        const bc = reduced ? 0.3 : (t * 0.00022) % 1;
        if (bc < 0.45) {
          const u = bc / 0.45, a = Math.min(clamp01(u / 0.12), clamp01((1 - u) / 0.25)) * 0.6;
          const [bx, by] = P[1]; ctx!.save(); ctx!.translate(bx + 16, by - 30 - u * 10); bubble(30 * S, w(a), t); ctx!.restore();
        }
      }
    }

    const loop = (now: number) => {
      if (visible && !document.hidden) draw(Math.max(0, now - t0));
      raf = requestAnimationFrame(loop);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(box);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(cv);
    resize();
    const remeasure = window.setTimeout(() => { measureAnchors(); if (reduced) draw(4000); }, 3400); // after the hero intro has settled
    window.addEventListener("load", measureAnchors);
    if (!reduced) raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      window.clearTimeout(remeasure); window.removeEventListener("load", measureAnchors);
    };
  }, [kind, fill]);

  return (
    <div ref={boxRef} aria-hidden="true" className={`pointer-events-none overflow-hidden lg:hidden ${className}`}>
      <canvas ref={ref} className="block h-full w-full" />
    </div>
  );
}
