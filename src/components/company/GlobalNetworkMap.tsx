import Image from "next/image";

// Rebuilt 2026-09-15, per Vignesh. Full history, shortest version: two
// hand-coded SVG continent attempts never read as geographically accurate
// (and this workspace has no route to real coastline data — every geo CDN
// is blocked). Switched to generated photos instead, four generations:
//   v1/v2 — too dark / baked-in arcs doubled with the code-drawn ones.
//   v3 — arc-free photo with baked-in glow dots, arcs+labels drawn in code
//     on top, dots positioned by connected-component pixel detection. This
//     worked, but then Vignesh asked to go the other way entirely: bake
//     the names AND connections into the image too, so there's nothing left
//     for code to misalign. Two generations of that were tried and both had
//     a real structural bug: the arc meant to run USA→India instead
//     terminated at the Europe dot partway there — a relay chain instead of
//     independent spokes. Abandoned; the image generator rendered a photo
//     reliably but not arc *topology*.
//   v4 (1774x887) — a plain photo with no pins/labels/lines baked in at
//     all, back to drawing every dot/arc/label in code, same as v3. The
//     FIRST set of v4 coordinates (shipped, then immediately reported wrong
//     by Vignesh) came from an earlier pixel-reading pass off a grid-overlay
//     crop of the image, and it was wrong by a lot — India's dot landed up near
//     Bangladesh, Singapore's over northern Australia, USA's over Hudson
//     Bay, Germany's out past the Urals. Reading a low-detail night-lights
//     photo by eye is exactly the kind of thing that goes wrong silently.
//   v4-final (this one) — Vignesh placed every point himself: a
//     click-to-get-coordinates HTML tool was built (a plain img tag,
//     click handler converts click position to this file's 1000x500
//     viewBox space) and Vignesh used it to mark all six spots directly on
//     the real image, in his browser, at whatever zoom he needed for
//     precision. Those marks are POINTS/HUB below, unedited. Only the
//     label *offsets* come from a script that samples every arc's
//     bezier curve and greedy-searches each label's (dx,dy) for the
//     position clearing every arc and every other label by the widest
//     margin, then a rendered preview was checked against this exact image
//     before writing this file (not eyeballed). The India/Germany/Europe/
//     Italy area is a genuinely tight cluster on a world map — Central
//     Europe is small — so a couple of labels sit noticeably off their dot
//     (Germany, the hub) to clear the traffic converging on Bangalore;
//     that's intentional, verified against the render, not a leftover bug.
const WIDTH = 1000;
const HEIGHT = 500;

// Marked by Vignesh directly on the image via the point-picker tool — not
// read off a grid from a screenshot. See file header.
const HUB = { name: "India", sub: "HQ", x: 679.3, y: 238.1 };

// Hub label sits below-left of the dot rather than straight above it —
// straight-above is exactly where the Germany/Europe/Italy arcs sweep on
// their way out of the hub (verified: 0 clearance there). This offset
// clears all five arcs by 24+ viewBox units (collision-search + rendered
// preview, 2026-09-15).
const HUB_LABEL_DX = -13.0;
const HUB_LABEL_DY = 35.7;

const POINTS: {
  name: string;
  x: number;
  y: number;
  labelDx: number;
  labelDy: number;
}[] = [
  { name: "USA", x: 181.5, y: 161.8, labelDx: 0, labelDy: 65 },
  { name: "Germany", x: 461.3, y: 125.7, labelDx: -41.8, labelDy: 49.8 },
  { name: "Europe", x: 479.9, y: 112.2, labelDx: 0, labelDy: -65 },
  { name: "Italy", x: 489.5, y: 148.3, labelDx: 22.2, labelDy: 61.1 },
  { name: "Singapore", x: 770.6, y: 284.7, labelDx: 0, labelDy: 65 },
];

// Quadratic arc bowed upward between two points — the "gold flight path"
// look from the reference image. Bow height scales with distance so short
// hops (Europe cluster) don't arc as dramatically as the India–USA span.
// This is the ONLY arc-drawing in the component — see file header on why
// that matters this time.
function arcPath(x1: number, y1: number, x2: number, y2: number) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dist = Math.hypot(x2 - x1, y2 - y1);
  const controlY = my - dist * 0.32;
  return `M ${x1},${y1} Q ${mx},${controlY} ${x2},${y2}`;
}

export default function GlobalNetworkMap() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-[#0a1128] shadow-[0_25px_60px_-20px_rgba(0,0,0,0.5)]">
      <Image
        src="/images/company/global-network-map-v4.jpg"
        alt=""
        fill
        priority={false}
        className="object-cover"
      />

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="relative h-full w-full"
        role="img"
        aria-label="Map of Transpeed Logistics' global network, showing overseas sourcing and procurement offices connected to the Bangalore headquarters in India"
      >
        {/* Arcs — static gradient stroke plus a small animated "shipment"
            dot travelling along each one, staggered so they don't all move
            in lockstep. The backing image has no arcs of its own this time,
            so this is the only line drawn per route. */}
        <defs>
          <linearGradient id="arc-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        <g fill="none" strokeLinecap="round">
          {POINTS.map((p, i) => {
            const d = arcPath(HUB.x, HUB.y, p.x, p.y);
            return (
              <g key={p.name}>
                <path
                  d={d}
                  stroke="url(#arc-gradient)"
                  strokeWidth={2}
                  className="[filter:drop-shadow(0_0_3px_rgba(251,191,36,0.6))]"
                />
                <circle r="3.2" fill="#fde68a" className="[filter:drop-shadow(0_0_4px_rgba(253,230,138,0.9))]">
                  <animateMotion
                    dur={`${3.5 + i * 0.4}s`}
                    begin={`${i * 0.5}s`}
                    repeatCount="indefinite"
                    path={d}
                  />
                </circle>
              </g>
            );
          })}
        </g>

        {/* Overseas location dots + name labels — coordinates marked by
            Vignesh directly on the image (see file header), not read off a
            grid from a screenshot. */}
        <g>
          {POINTS.map((p) => (
            <g key={p.name}>
              <circle cx={p.x} cy={p.y} r={4} className="map-ping" fill="#38bdf8" opacity={0.5} />
              <circle cx={p.x} cy={p.y} r={3.5} fill="#e0f2fe" stroke="#38bdf8" strokeWidth={1.5} />
              <text
                x={p.x + p.labelDx}
                y={p.y + p.labelDy}
                textAnchor="middle"
                className="font-sans text-[13px] font-semibold"
                fill="#ffffff"
                style={{ paintOrder: "stroke", stroke: "#0a1128", strokeWidth: 4 }}
              >
                {p.name}
              </text>
            </g>
          ))}

          {/* Hub — India, drawn larger/brighter and last so it sits above
              every arc converging on it. */}
          <circle cx={HUB.x} cy={HUB.y} r={7} className="map-ping" fill="#ff3131" opacity={0.55} />
          <circle cx={HUB.x} cy={HUB.y} r={5.5} fill="#ff3131" stroke="#fff" strokeWidth={1.5} />
          <text
            x={HUB.x + HUB_LABEL_DX}
            y={HUB.y + HUB_LABEL_DY}
            textAnchor="middle"
            className="font-display text-[15px] font-bold"
            fill="#ffffff"
            style={{ paintOrder: "stroke", stroke: "#0a1128", strokeWidth: 4 }}
          >
            India · HQ
          </text>
        </g>
      </svg>
    </div>
  );
}
