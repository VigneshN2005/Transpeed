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
//
//   2026-09-21 — 9 more overseas points added (Far East, Central Asia,
//     South Asia, South West Asia, Africa, Norway, Sweden, Denmark,
//     Austria), coordinates marked by Vignesh via a rebuilt version of the
//     same click-to-get-coordinates tool. Label offsets for these 9 came
//     from the same collision-search approach as the original 6 (candidate
//     offsets on rings 38-68 viewBox units out, greedy-picking whichever
//     clears every arc, dot, and already-placed label by the widest
//     margin), then checked against an actual render before writing this
//     file. Two notes: "South Asia"'s marked point sits only ~22 units from
//     the India hub dot itself (India being in South Asia, that's
//     geographically expected, not a misclick) — its arc is correspondingly
//     tiny but still reads cleanly in the render. "Middle East" was on the
//     original list of additions but no coordinate was given for it, so
//     it's not in POINTS below yet — add it the same way once marked.
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
  { name: "USA", x: 181.5, y: 161.8, labelDx: -26.3, labelDy: 9.6 },
  { name: "Germany", x: 461.3, y: 125.7, labelDx: -41.8, labelDy: 49.8 },
  { name: "Europe", x: 479.9, y: 112.2, labelDx: 0, labelDy: -65 },
  { name: "Italy", x: 489.5, y: 148.3, labelDx: 22.2, labelDy: 61.1 },
  { name: "Singapore", x: 770.6, y: 284.7, labelDx: -21.4, labelDy: 18.0 },
  { name: "Far East", x: 825.4, y: 195.7, labelDx: 0, labelDy: -68 },
  { name: "Central Asia", x: 633.9, y: 154.3, labelDx: 43.7, labelDy: -52.1 },
  { name: "South Asia", x: 680.7, y: 216.4, labelDx: 34.0, labelDy: -58.9 },
  { name: "South West Asia", x: 591.2, y: 205.3, labelDx: -58.9, labelDy: 34.0 },
  { name: "Africa", x: 560.9, y: 307.3, labelDx: -24.2, labelDy: -14.0 },
  { name: "Norway", x: 479.5, y: 85.4, labelDx: -67.0, labelDy: -11.8 },
  { name: "Sweden", x: 498.8, y: 71.7, labelDx: 58.9, labelDy: -34.0 },
  { name: "Denmark", x: 479.5, y: 99.2, labelDx: -45.0, labelDy: 0 },
  { name: "Austria", x: 471.3, y: 136.4, labelDx: 15.4, labelDy: 42.3 },

  // 2026-10-03 — 16 more points added (15 new overseas entries plus the
  // long-outstanding "Middle East", which was on the list since 2026-09-21
  // but never got a coordinate — see the note above). Coordinates marked
  // by Vignesh via the same click-to-get-coordinates tool, rebuilt as a
  // chip-select page so he picks a name then clicks its spot, instead of
  // typing it each time.
  //
  // Label offsets here are deliberately tight — per Vignesh's feedback on
  // the first pass ("names near the coordinates, like completely"), these
  // sit close to their dot (roughly 15-26 viewBox units out) rather than
  // pushed further away for breathing room, which is what the Germany/
  // Europe/Italy hub cluster and the original 2026-09-21 batch do. Found
  // via the same greedy ring-search as before, but biased hard toward the
  // smallest radius that still clears every arc, dot, and other label —
  // only escalating to a wider ring for the handful (Iran, Iraq, Saudi
  // Arabia, Middle East, Sri Lanka, China) that truly had no clear option
  // at the tightest radii, since they sit right on top of the existing
  // South West Asia/Central Asia/South Asia cluster or, for Sri Lanka,
  // right next to the hub dot itself (~30 viewBox units from HUB — it
  // really is that close to India on this image). Checked against an
  // actual Playwright render of this exact image before writing these
  // numbers, not eyeballed, specifically re-checked for the Austria/
  // Middle East and Sri Lanka/HQ collisions the first attempt had. One
  // more round after that (2026-10-03), triggered by Vignesh flagging the
  // live render still showing "Mexico" reading above "USA": the actual
  // bug wasn't Mexico's offset at all -- it was USA's own PRE-EXISTING
  // offset (labelDx: 0, labelDy: 65, from before this batch existed),
  // which drops its label 65 units straight down from its dot. That was
  // harmless in isolation, but once Mexico's dot landed only ~47 units
  // south of USA's, USA's label ended up sitting lower on screen than
  // Mexico's dot -- so no matter where Mexico's own label pointed, the
  // two could read out of order. Fixed by re-optimizing USA's and
  // Mexico's offsets together under an explicit constraint (USA's label
  // must sit above Mexico's, with a real gap) instead of treating USA's
  // old offset as fixed: USA now sits close in at (-26.3, 9.6), Mexico
  // points down at (0, 38). Re-rendered and confirmed Canada/USA/Mexico
  // read top-to-bottom correctly now, matching the dots.
  //
  // Vignesh also asked to re-check every other label while at it. Two
  // more real collisions turned up under a render (not just the numeric
  // clearance score, which can look fine while the actual glyph --
  // rendered on an SVG text baseline, not a vertically-centered box --
  // still overlaps a neighbor): Sri Lanka's label was pointing toward
  // the HUB dot and clipping it, moved from (-9.9, -9.9) to (22.0, 4.0);
  // and Middle East/Saudi Arabia's labels were touching each other in
  // the crowded Iran/Iraq cluster, pulled apart to (-2.0, -32.0) and
  // (24.0, 22.0) respectively.
  //
  // That USA/Mexico root cause -- a pre-existing point's old offset
  // breaking once a new point landed close by -- turned out not to be
  // a one-off. Systematically checked every existing point against
  // every new point near it for the same "label order doesn't match
  // dot order" problem and found two more real ones: Singapore's old
  // (0, 65) offset put its label below South East Asia's even though
  // Singapore's own dot sits north of it; and Africa's old (0, 68)
  // offset put its label below South Africa's even though Africa's
  // dot sits north of that one too. Fixed the same way -- re-optimized
  // each pair jointly under an explicit "north dot's label must sit
  // above south dot's label" constraint: Singapore -> (-21.4, 18.0),
  // South East Asia -> (-5.9, 33.5), Africa -> (-24.2, -14.0), South
  // Africa -> (5.9, 33.5). Re-rendered and confirmed both read
  // correctly now.
  { name: "Australia", x: 859.8, y: 364.5, labelDx: 23.6, labelDy: 11.0 },
  { name: "New Zealand", x: 969.6, y: 420.1, labelDx: -26.0, labelDy: 0.0 },
  { name: "South Africa", x: 514.8, y: 373.4, labelDx: 5.9, labelDy: 33.5 },
  { name: "Japan", x: 877.7, y: 175.7, labelDx: 19.9, labelDy: -16.7 },
  { name: "Korea", x: 842.2, y: 172.9, labelDx: 11.0, labelDy: 23.6 },
  { name: "Sri Lanka", x: 696.4, y: 262.3, labelDx: 22.0, labelDy: 4.0 },
  { name: "Canada", x: 169.9, y: 102.2, labelDx: 11.0, labelDy: 23.6 },
  { name: "Mexico", x: 168.7, y: 208.8, labelDx: 0.0, labelDy: 38.0 },
  { name: "Russia", x: 748.2, y: 67.3, labelDx: 23.6, labelDy: 11.0 },
  { name: "China", x: 739.8, y: 165.4, labelDx: -18.4, labelDy: 18.4 },
  { name: "Philippines", x: 836.2, y: 252.2, labelDx: 23.6, labelDy: -11.0 },
  { name: "Iran", x: 621.8, y: 182.8, labelDx: 6.3, labelDy: -35.5 },
  { name: "Iraq", x: 577.2, y: 184.5, labelDx: -25.1, labelDy: -6.7 },
  { name: "Saudi Arabia", x: 589.1, y: 207.6, labelDx: 24.0, labelDy: 22.0 },
  { name: "South East Asia", x: 780.7, y: 311.5, labelDx: -5.9, labelDy: 33.5 },
  { name: "Middle East", x: 555.8, y: 188.1, labelDx: -2.0, labelDy: -32.0 },
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
