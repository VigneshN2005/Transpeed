"use client";

// Real-photo cinematic backgrounds (2026-10-01, per Vignesh). History:
// rejected near-invisible SVG silhouettes -> rejected a small corner-bleed
// treatment -> rejected a literal top-half/bottom-half split on long
// single-section pages (Services/Company), since a static photo forced to
// stretch across several thousand px either lost its subject to cropping
// or, when height-capped to stay sane, left most of a long page on plain
// canvas ("still its not covering half pages"). Resolved by dropping the
// "exactly 2 halves per page" idea entirely: a page is now split into as
// many content groups as its actual length calls for (decided per page,
// not forced to 2), and each group gets ONE of these behind it, sized to
// that group's own natural height via a plain `relative overflow-hidden`
// wrapper — exactly the technique that already worked cleanly on the Home
// page, just applied as many times as a given page's length needs instead
// of always twice. No stretching, no fixed-attachment trick, no per-page
// special-casing — one consistent mechanism everywhere.
//
// Wash cut back three times now (20% -> 10% -> 4% -> removed) per
// Vignesh's repeated opacity notes ("i want it to be more") — cards on
// top already carry their own (also now lighter) fill for legibility, so
// this layer was only ever meant to settle the open gaps, not mute the
// photo, and even 4% was still visibly muting it.
//
// Still uses the site's existing `Reveal` component (variant="image") for
// the scroll-in entrance — same fade/settle/scale-in as every other
// reveal on the site, not a bespoke animation.
//
// Usage: wrap the one content group this should sit behind in
// `<div className="relative overflow-hidden">`, and render this as the
// FIRST child of that wrapper — it fills the wrapper via absolute inset-0
// and sits behind the wrapper's own normal-flow content via -z-10, exactly
// like GlassBackground's technique but scrolling with the page instead of
// being fixed to the viewport.
import Image from "next/image";
import Reveal from "@/components/ui/Reveal";

export default function BgPhoto({
  src,
  alt,
  position,
  focus = "center",
  blend = false,
}: {
  src: string;
  alt: string;
  /** Only controls which edge the thin blend gradient favours (top of the
      group vs. bottom of it) — doesn't affect sizing. */
  position: "top" | "bottom";
  /** CSS object-position value, for nudging the crop's focal point when the
      subject sits off-centre in the source photo (e.g. "78% center"). */
  focus?: string;
  /** Canvas-blend mode (2026-10-01, Vignesh — home page first: "increase
      the image opacity, the background image must blend with background").
      The night photos' skies are near-black (~#0a0a0a), darker than the
      #303030 canvas, so they read as a dark slab rather than part of the
      page, and their subject looked dim. With this on: the photo is lifted
      (brightness 1.3, saturate 1.1; whole layer at 45% opacity -- after a same-day overshoot to brightness 2, Vignesh clarified he wants it LESS visible, "just as background") so the plane/ship read clearly, then a
      #303030 layer is SCREEN-blended over it, which maps pure black to
      exactly the canvas colour while keeping all hull/wing/cloud detail
      (a `lighten` blend was tried in preview first and flattened the
      ship's hull into flat grey). Top AND bottom edges then feather 18%
      into the canvas so there is no seam on either side. Opt-in so the
      Services/Company pages are unchanged until approved there. */
  blend?: boolean;
}) {
  return (
    <Reveal variant="image" className="pointer-events-none absolute inset-0 -z-10 h-full w-full">
      <div className="relative h-full w-full" style={blend ? { opacity: 0.45 } : undefined}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes="100vw"
          className="object-cover"
          style={{
            objectPosition: focus,
            ...(blend ? { filter: "brightness(1.3) saturate(1.1)" } : {}),
          }}
          priority={false}
        />
        {blend && (
          <>
            <div className="absolute inset-0" style={{ background: "#303030", mixBlendMode: "screen" }} />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, #303030 0%, transparent 18%, transparent 82%, #303030 100%)",
              }}
            />
          </>
        )}
        {/* Wash removed entirely — the edge-blend gradient below already
            settles the seam with the section above/below; nothing here
            was doing anything but dimming the photo. */}
        {/* Thin edge blend (6%) so this meets the section above/below
            cleanly instead of ending in a hard line. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              position === "top"
                ? "linear-gradient(to bottom, #303030 0%, transparent 6%)"
                : "linear-gradient(to top, #303030 0%, transparent 6%)",
          }}
        />
      </div>
    </Reveal>
  );
}
