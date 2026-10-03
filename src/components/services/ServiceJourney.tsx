"use client";

// "Shipment journey" storytelling watermark for the Services page
// (2026-10-02, per Vignesh: "story type water mark in a zig zag form, where
// the truck takes the goods, and u draw lines of travel mark ... make it
// animated ... make a truck too moving").
//
// A dotted travel route zig-zags down the page through the empty gutters
// beside the service boxes: it runs down one side next to a service, then
// crosses the gap to the other side before the next one. Each service gets a
// "stop" badge on the route (pickup -> customs -> heavy cargo -> warehouse ->
// out for delivery -> delivered). A small red truck drives the route in sync
// with scrolling, the travelled part of the route fills in red behind it, and
// each stop lights up once the truck has passed it.
//
// The route is MEASURED from the real service boxes (not hard-coded), and
// re-measured whenever the section changes size — so expanding a service's
// "6-step process" panel, resizing the window, or late-loading images all
// keep the route hugging the boxes. Hidden below lg / when the side gutters
// are too narrow to hold it (phones, small laptops), since there is no
// empty space beside the content there. Honours prefers-reduced-motion
// (truck jumps straight to position instead of easing).

import { useCallback, useEffect, useRef, useState } from "react";

type Stop = { x: number; y: number; len: number };
type Geo = { w: number; h: number; d: string; stops: Stop[]; scale: number; end: { x: number; y: number } };

// One line icon per service, in data/services.ts order (24x24, stroked).
const STOP_ICONS = [
  // Freight forwarding — ship
  "M3 16h18l-2.5 4.5h-13z M5.5 16v-5h13v5 M9 11V7.5h6V11 M12 7.5V4",
  // Customs clearance — shield with check
  "M12 3l8 3v6c0 4.8-3.4 8-8 9-4.6-1-8-4.2-8-9V6z M8.5 12l2.5 2.5 4.5-4.5",
  // Project logistics — crane
  "M4 21h9 M7 21V4 M7 4h13 M7 8l4-4 M18 4v6 M16 10h4v3.5h-4z",
  // Warehousing — warehouse
  "M3 21V9l9-6 9 6v12 M7 21v-8h10v8 M7 17h10",
  // Trucking — truck
  "M2.5 16.5V7h12v9.5 M14.5 10h4l3 3.5v3h-7 M6.5 19.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M17.5 19.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  // Sourcing & procurement — package
  "M3 7.5l9-4.5 9 4.5-9 4.5z M3 7.5v9l9 4.5 9-4.5v-9 M12 12v9",
];
const STOP_LABELS = ["Pickup", "Customs cleared", "Heavy cargo", "Warehoused", "On the road", "Delivered"];

const LERP = 0.12;

export default function ServiceJourney() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const travelRef = useRef<SVGPathElement>(null);
  const truckRef = useRef<SVGGElement>(null);
  const [geo, setGeo] = useState<Geo | null>(null);
  const [passed, setPassed] = useState(-1);

  // Lookup table of points along the path, rebuilt whenever the geometry changes.
  const lut = useRef<{ len: number; x: number; y: number }[]>([]);
  const total = useRef(0);
  const current = useRef(0);
  const target = useRef(0);
  const facing = useRef(1);
  const raf = useRef<number | null>(null);
  const reduced = useRef(false);

  const measure = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const section = wrap.parentElement;
    if (!section) return;
    const sr = section.getBoundingClientRect();
    const boxes = Array.from(section.querySelectorAll<HTMLElement>("article[id]")).map(
      (a) => (a.querySelector(":scope > div") as HTMLElement | null) ?? a,
    );
    if (boxes.length < 2 || window.innerWidth < 1024) {
      setGeo(null);
      return;
    }
    const rects = boxes.map((b) => b.getBoundingClientRect());
    const left = rects[0].left - sr.left;
    const right = rects[0].right - sr.left;
    const gutter = Math.min(left, sr.width - right);
    if (gutter < 72) {
      setGeo(null);
      return;
    }
    const scale = Math.max(0.75, Math.min(1.1, gutter / 125));
    const off = Math.min(gutter / 2, 70);
    const xL = left - off;
    const xR = right + off;
    const r = 28; // corner radius of the route's turns

    let d = "";
    const stops: Stop[] = [];
    let endPt = { x: xL, y: 0 };
    rects.forEach((rc, i) => {
      const top = rc.top - sr.top;
      const bot = rc.bottom - sr.top;
      const x = i % 2 === 0 ? xL : xR;
      if (i === 0) d += `M ${x} ${top - 56} `;
      stops.push({ x, y: top + Math.min(140, (bot - top) / 2), len: 0 });
      if (i < rects.length - 1) {
        const nTop = rects[i + 1].top - sr.top;
        const gy = (bot + nTop) / 2;
        const nx = i % 2 === 0 ? xR : xL;
        const dir = nx > x ? 1 : -1;
        d += `L ${x} ${gy - r} Q ${x} ${gy} ${x + dir * r} ${gy} `;
        d += `L ${nx - dir * r} ${gy} Q ${nx} ${gy} ${nx} ${gy + r} `;
      } else {
        d += `L ${x} ${bot + 40}`;
        endPt = { x, y: bot + 40 };
      }
    });
    setGeo({ w: sr.width, h: sr.height, d, stops, scale, end: endPt });
  }, []);

  // Place the truck at length L along the route.
  const place = useCallback((L: number) => {
    const path = pathRef.current;
    const truck = truckRef.current;
    if (!path || !truck || !total.current) return;
    const len = Math.max(0, Math.min(total.current, L));
    const p = path.getPointAtLength(len);
    const a = path.getPointAtLength(Math.max(0, len - 2));
    const b = path.getPointAtLength(Math.min(total.current, len + 2));
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 0.5) facing.current = dx > 0 ? 1 : -1;
    // Rotate to follow the route; mirror when heading left so it's never upside down.
    let ang = (Math.atan2(dy, dx * facing.current) * 180) / Math.PI;
    if (!isFinite(ang)) ang = 0;
    const s = geo?.scale ?? 1;
    truck.setAttribute(
      "transform",
      `translate(${p.x} ${p.y}) scale(${facing.current * s} ${s}) rotate(${ang})`,
    );
    travelRef.current?.setAttribute("stroke-dashoffset", String(total.current - len));
    truck.classList.toggle("tj-moving", Math.abs(target.current - current.current) > 1.5);
    if (geo) {
      let idx = -1;
      geo.stops.forEach((st, i) => {
        if (len >= st.len - 4) idx = i;
      });
      setPassed((prev) => (prev === idx ? prev : idx));
    }
  }, [geo]);

  // Scroll -> target length: the point on the route level with ~55% down the viewport.
  const computeTarget = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap || !lut.current.length) return;
    const sr = wrap.getBoundingClientRect();
    const y = window.innerHeight * 0.55 - sr.top;
    const pts = lut.current;
    let found = pts[pts.length - 1].len;
    if (y <= pts[0].y) found = 0;
    else {
      for (let i = 0; i < pts.length; i++) {
        if (pts[i].y >= y) {
          found = pts[i].len;
          break;
        }
      }
    }
    target.current = found;
  }, []);

  const tick = useCallback(() => {
    const diff = target.current - current.current;
    if (reduced.current || Math.abs(diff) < 0.5) current.current = target.current;
    else current.current += diff * LERP;
    place(current.current);
    if (current.current !== target.current) raf.current = requestAnimationFrame(tick);
    else {
      truckRef.current?.classList.remove("tj-moving");
      raf.current = null;
    }
  }, [place]);

  const kick = useCallback(() => {
    computeTarget();
    if (raf.current == null) raf.current = requestAnimationFrame(tick);
  }, [computeTarget, tick]);

  // Measure on mount + whenever the section resizes (expanding a service's
  // step panel, window resize, images loading in).
  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    measure();
    const section = wrapRef.current?.parentElement;
    const ro = new ResizeObserver(() => measure());
    if (section) ro.observe(section);
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
    };
  }, [measure]);

  // Rebuild the lookup table + stop positions whenever the geometry changes.
  useEffect(() => {
    const path = pathRef.current;
    if (!geo || !path) return;
    total.current = path.getTotalLength();
    const pts: { len: number; x: number; y: number }[] = [];
    for (let l = 0; l <= total.current; l += 4) {
      const p = path.getPointAtLength(l);
      pts.push({ len: l, x: p.x, y: p.y });
    }
    lut.current = pts;
    geo.stops.forEach((st) => {
      const hit = pts.find((p) => Math.abs(p.x - st.x) < 1 && p.y >= st.y);
      st.len = hit ? hit.len : 0;
    });
    travelRef.current?.setAttribute("stroke-dasharray", `${total.current} ${total.current}`);
    computeTarget();
    current.current = target.current;
    place(current.current);
  }, [geo, computeTarget, place]);

  useEffect(() => {
    window.addEventListener("scroll", kick, { passive: true });
    return () => {
      window.removeEventListener("scroll", kick);
      if (raf.current != null) cancelAnimationFrame(raf.current);
    };
  }, [kick]);

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none absolute inset-0 hidden lg:block"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      aria-hidden="true"
    >
      {geo && (
        <svg
          width={geo.w}
          height={geo.h}
          className="absolute left-0 top-0 overflow-visible"
          style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
        >
          <style>{`
            .tj-beam { opacity: 0; transition: opacity 0.35s; }
            .tj-moving .tj-beam { opacity: 1; }
            .tj-stop circle.tj-ring { transition: stroke 0.4s, fill 0.4s; }
          `}</style>

          <defs>
            <linearGradient id="tj-beam" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#FFE2A8" stopOpacity="0.55" />
              <stop offset="1" stopColor="#FFE2A8" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Full route — faint dotted line */}
          <path
            ref={pathRef}
            d={geo.d}
            fill="none"
            stroke="rgba(255,255,255,0.28)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray="1 11"
          />
          {/* Travelled part — fills in red behind the truck */}
          <path
            ref={travelRef}
            d={geo.d}
            fill="none"
            stroke="#FF3131"
            strokeOpacity={0.75}
            strokeWidth={2.5}
            strokeLinecap="round"
          />

          {/* Stops */}
          {geo.stops.map((st, i) => {
            const on = i <= passed;
            const s = geo.scale;
            return (
              <g key={i} className="tj-stop" transform={`translate(${st.x} ${st.y}) scale(${s})`}>
                <circle
                  className="tj-ring"
                  r={24}
                  fill={on ? "#3a1d1d" : "#2a2a2a"}
                  stroke={on ? "#FF3131" : "rgba(255,255,255,0.22)"}
                  strokeWidth={1.5}
                />
                <g transform="translate(-12 -12)">
                  <path
                    d={STOP_ICONS[i % STOP_ICONS.length]}
                    fill="none"
                    stroke={on ? "#FF6b6b" : "rgba(255,255,255,0.55)"}
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <text
                  y={42}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={600}
                  letterSpacing="0.08em"
                  fill={on ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.45)"}
                  style={{ textTransform: "uppercase" }}
                >
                  {STOP_LABELS[i] ?? ""}
                </text>
              </g>
            );
          })}

          {/* Destination pin at the end of the route */}
          <g transform={`translate(${geo.end.x} ${geo.end.y}) scale(${geo.scale})`}>
            <path
              d="M0 0 C -9 -12 -12 -18 -12 -24 A 12 12 0 1 1 12 -24 C 12 -18 9 -12 0 0 Z"
              fill={passed >= geo.stops.length - 1 ? "#FF3131" : "rgba(255,255,255,0.25)"}
            />
            <circle cy={-24} r={4.5} fill="#2a2a2a" />
          </g>

          {/* The truck — TOP-DOWN view (red cab + container), drawn facing
              right at (0,0). Top-down so it rotates naturally round every
              turn of the route, like a vehicle on a map; a side view turned
              90deg on the vertical stretches looked like it was lying down. */}
          <g ref={truckRef} style={{ filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.5))" }}>
            {/* headlight beams, only while moving */}
            <path className="tj-beam" d="M36 -8 L78 -20 L78 -2 Z M36 8 L78 2 L78 20 Z" fill="url(#tj-beam)" />
            {/* container */}
            <rect x={-44} y={-12.5} width={52} height={25} rx={2.5} fill="#2a2a2a" stroke="rgba(255,255,255,0.75)" strokeWidth={1.3} />
            <path
              d="M-37 -10v20 M-30 -10v20 M-23 -10v20 M-16 -10v20 M-9 -10v20 M-2 -10v20 M5 -10v20"
              stroke="rgba(255,255,255,0.22)"
              strokeWidth={1}
            />
            <rect x={-44} y={-12.5} width={4} height={25} rx={1.5} fill="#FF3131" />
            {/* coupling */}
            <rect x={8} y={-3} width={5} height={6} fill="#151515" />
            {/* cab */}
            <path d="M13 -11.5h15c4 0 8 3 8 7v9c0 4-4 7-8 7H13z" fill="#FF3131" />
            {/* windscreen */}
            <path d="M28.5 -9c3 0.5 5 2.5 5 5v8c0 2.5-2 4.5-5 5z" fill="rgba(255,255,255,0.85)" />
            {/* roof light bar + mirrors */}
            <rect x={17} y={-7} width={3} height={14} rx={1} fill="rgba(0,0,0,0.25)" />
            <rect x={25} y={-15} width={3} height={4} rx={1} fill="#1a1a1a" />
            <rect x={25} y={11} width={3} height={4} rx={1} fill="#1a1a1a" />
          </g>
        </svg>
      )}
    </div>
  );
}
