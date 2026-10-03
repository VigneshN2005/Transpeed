// "Brand Ember Glass" page background (2026-10-01, per Vignesh). History:
// the dark-theme pass ("do it like spotify?") was rejected live as "not
// matching" → pivoted to a glass, colourful, aesthetic background instead,
// trialled on the home page alone first ("first do for 1 page, lets test
// and change"), then rolled out site-wide once approved ("apply to entire
// website"). Shared here as one component rather than duplicated per page,
// since the canvas colour itself went through several rounds of live
// feedback and any future tweak should only need changing in one place:
// near-black #0a0808 ("i want light background color") -> light blush
// #fbeeec ("what bg color makes it look aesthetic, in black itself lighter
// shades") -> Graphite Charcoal #232323 ("try once") -> #303030 ("a bit
// more lighter which matches contrast").
//
// Fixed (not part of page flow), so it covers the full scroll height of
// whatever page renders it uniformly — this is what actually fixed the
// recurring "background looks fine at the top but goes flat further down
// the page" complaint from the earlier light-theme attempts, since a
// per-section top-anchored glow fades out long before the bottom of a long
// page but a viewport-fixed layer never does. Brand red is the only hue
// used in the glow blobs, so every page reads as unmistakably Transpeed's
// own rather than a generic dark-UI theme.
//
// Each page using this is expected to render its own content with light
// text (text-white / text-white/NN) on top, since this is a dark canvas.
//
// Side accents added (2026-10-01, per Vignesh: "add some designs in the
// sides its plane" — on a wide viewport the gutters outside the centered
// `Container` had nothing in them but flat canvas). Two extra edge-anchored
// glow blobs plus a faint vertical "route line" with waypoint dots down
// each far edge — a small nod to the shipping-route motif already used
// elsewhere (the dotted/animated lines on the Global Network map) rather
// than a generic decorative flourish. Hidden below lg: since on a phone or
// tablet viewport the content runs edge-to-edge and there is no gutter for
// these to live in.
//
// Logistics watermark silhouettes added (2026-10-01, per Vignesh: he
// validated the idea of "background images of the logistics like ship,
// plane and cargo, which blends along with the background colour... very
// very light" and then said "u decide what images should we put, 2 huge
// images per page, which cover center and sides"). Same technique as the
// existing logo watermark tile (globals.css) — bake it in as a near-
// invisible textural layer rather than a loud illustration: solid filled
// silhouettes (not thin strokes, which wash out to nothing at this
// opacity), huge scale, parked at ~3-4% opacity and anchored off each side
// edge so they bleed in toward the center — literally "cover center and
// sides" rather than sitting fully inside either zone. Every page gets a
// different pair out of the same 4-icon vocabulary (ship / plane / truck /
// stacked cargo) so the motif stays consistent site-wide while each page
// still feels distinct, loosely themed to that page's content (Services
// leans trucking/warehousing, Company leans global network, etc.). `page`
// is optional and defaults to the original icon-free look, so nothing
// breaks if this component is ever reused somewhere new without picking a
// pair first.
import type { ReactNode } from "react";

type Page = "home" | "services" | "company" | "contact" | "people" | "announcements";

function ShipGlyph() {
  return (
    <svg viewBox="0 0 240 120" fill="currentColor" aria-hidden="true">
      <path d="M8 78 L28 58 H214 L232 78 Q180 102 120 102 Q60 102 8 78 Z" />
      <rect x="46" y="38" width="28" height="24" />
      <rect x="82" y="30" width="28" height="32" />
      <rect x="118" y="24" width="26" height="38" />
      <rect x="168" y="14" width="18" height="48" />
      <rect x="163" y="8" width="28" height="8" />
    </svg>
  );
}

function PlaneGlyph() {
  return (
    <svg viewBox="0 0 240 120" fill="currentColor" aria-hidden="true">
      <ellipse cx="118" cy="60" rx="98" ry="11" />
      <path d="M86 56 L132 8 L144 8 L120 56 Z" />
      <path d="M86 64 L132 112 L144 112 L120 64 Z" />
      <path d="M198 52 L232 18 L238 20 L214 56 Z" />
      <path d="M22 60 L2 48 L2 72 Z" />
    </svg>
  );
}

function TruckGlyph() {
  return (
    <svg viewBox="0 0 240 120" fill="currentColor" aria-hidden="true">
      <rect x="10" y="32" width="140" height="52" rx="4" />
      <path d="M150 48 H192 L222 76 V84 H150 Z" />
      <circle cx="54" cy="94" r="15" />
      <circle cx="118" cy="94" r="15" />
      <circle cx="196" cy="94" r="15" />
    </svg>
  );
}

function CargoGlyph() {
  return (
    <svg viewBox="0 0 240 120" fill="currentColor" aria-hidden="true">
      <rect x="12" y="52" width="78" height="54" />
      <rect x="98" y="24" width="78" height="82" />
      <rect x="184" y="44" width="52" height="62" />
      <rect x="20" y="52" width="78" height="6" opacity="0.5" />
      <rect x="106" y="24" width="78" height="6" opacity="0.5" />
    </svg>
  );
}

const ICONS = {
  ship: ShipGlyph,
  plane: PlaneGlyph,
  truck: TruckGlyph,
  cargo: CargoGlyph,
};

// Page -> [left icon, right icon], drawn from the shared 4-glyph vocabulary
// above and loosely matched to each page's subject matter.
const PAGE_ICONS: Record<Page, [keyof typeof ICONS, keyof typeof ICONS]> = {
  home: ["ship", "plane"],
  services: ["cargo", "truck"],
  company: ["plane", "ship"],
  contact: ["truck", "plane"],
  people: ["cargo", "ship"],
  announcements: ["plane", "truck"],
};

function BigGlyph({
  children,
  side,
  rotate,
}: {
  children: ReactNode;
  side: "left" | "right";
  rotate: number;
}) {
  const sidePos =
    side === "left" ? "-left-[18rem] lg:-left-[22rem]" : "-right-[18rem] lg:-right-[22rem]";
  return (
    <div
      className={`pointer-events-none absolute top-1/2 ${sidePos} h-[36rem] w-[60rem] -translate-y-1/2 text-white opacity-[0.045] blur-[0.5px] md:opacity-[0.04]`}
      style={{ transform: `translateY(-50%) rotate(${rotate}deg)` }}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}

// Silhouettes REMOVED site-wide (2026-10-01, Vignesh: "remove those shapes
// completely from the entire website"). Once the real BgPhoto plane/ship
// photos went in behind the content, these duplicated them — every page
// showed two ships and two planes. The glyph components and PAGE_ICONS map
// above are kept (unrendered) so they can be restored in one line if ever
// wanted; `page` is still accepted so no page needs changing.
// Optional per-page canvas override (2026-10-02, Vignesh: trialling a
// lighter #3a3a3a on the Services page only, so the glass content boxes —
// near-black at 40% — contrast more clearly against the page). Defaults to
// the site-wide #303030 so every other page is unchanged.
export default function GlassBackground({ page, canvas = "#303030" }: { page?: Page; canvas?: string } = {}) {
  void page;
  void PAGE_ICONS;
  void ICONS;
  void BigGlyph;

  return (
    <div className="tp-glassbg fixed inset-0 -z-10 overflow-hidden" style={{ backgroundColor: canvas }} aria-hidden="true">
      {/* Ambient red cut to 70% site-wide (2026-10-02, Vignesh: "slightly
          reduce the redness in the entire website") -- every page-glow,
          box-glow and red-tinted shadow alpha scaled x0.7 in one pass; brand
          red on buttons, pills, accent rules and text left untouched. */}
      <div className="absolute -top-32 -left-32 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(255,49,49,0.18),transparent_70%)] blur-3xl" />
      <div className="absolute top-1/4 -right-40 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(220,38,38,0.15),transparent_70%)] blur-3xl" />
      <div className="absolute bottom-[-10rem] left-1/4 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(255,49,49,0.14),transparent_70%)] blur-3xl" />
      <div className="absolute bottom-0 right-1/4 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(220,38,38,0.1),transparent_70%)] blur-3xl" />

      {/* Extra edge glows, only relevant once there's a gutter to fill */}
      <div className="absolute left-[4%] top-[55%] hidden h-80 w-80 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,49,49,0.1),transparent_70%)] blur-3xl lg:block" />
      <div className="absolute right-[4%] top-[20%] hidden h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(220,38,38,0.1),transparent_70%)] blur-3xl lg:block" />

      {/* Left route line */}
      <div className="absolute left-10 top-[8%] hidden h-[84%] w-px bg-gradient-to-b from-transparent via-brand/25 to-transparent lg:block" />
      <span className="absolute left-10 top-[22%] hidden h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-brand/50 lg:block" />
      <span className="absolute left-10 top-[48%] hidden h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-brand/40 lg:block" />
      <span className="absolute left-10 top-[74%] hidden h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-brand/30 lg:block" />

      {/* Right route line */}
      <div className="absolute right-10 top-[12%] hidden h-[80%] w-px bg-gradient-to-b from-transparent via-brand/25 to-transparent lg:block" />
      <span className="absolute right-10 top-[28%] hidden h-1.5 w-1.5 translate-x-1/2 rounded-full bg-brand/50 lg:block" />
      <span className="absolute right-10 top-[54%] hidden h-1.5 w-1.5 translate-x-1/2 rounded-full bg-brand/40 lg:block" />
      <span className="absolute right-10 top-[80%] hidden h-1.5 w-1.5 translate-x-1/2 rounded-full bg-brand/30 lg:block" />
    </div>
  );
}
