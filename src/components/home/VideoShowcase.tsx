"use client";

import { useState } from "react";

// Home-page video showcase (2026-09-29, per Vignesh: the corporate overview
// video should sit at the bottom of the home page — NOT as a hero — styled
// as its own advanced/modern/professional moment. Placed after "Our
// Clients" as the closing section of the page.
//
// Source file: originally only had Vignesh's WhatsApp-forwarded copy
// (960x544, heavily compressed). Traced the same footage back to its real
// source — it's already hosted at full quality on the live
// transpeedlogistics.com site (Wix-hosted, video.wixstatic.com) — and
// pulled the genuine 1920x1080 original from there instead (same 167s
// runtime, confirmed byte-for-byte a real, un-recompressed export, not an
// upscale). Remuxed with faststart so it streams progressively rather than
// needing a full download first; picture quality itself is untouched, it's
// simply the real file now instead of the WhatsApp copy.
//
// UX: click-to-play rather than autoplay — nothing about a 36MB file
// downloads until the visitor actually asks for it (poster image only,
// <video preload="none">, the <video> element itself isn't even mounted
// until the first click). Dark-glass card treatment (border-white/10 +
// bg-brand-dark + backdrop-blur + brand-red glow) matches the site's
// established "dark glass on light section" language used elsewhere on
// this page (see the services card treatment above).
export default function VideoShowcase() {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative isolate overflow-hidden rounded-3xl border border-white/10 bg-brand-dark shadow-[0_30px_70px_-20px_rgba(0,0,0,0.5),0_10px_30px_-6px_rgba(255,49,49,0.18)] ring-1 ring-white/[0.06]">
      {/* Thin two-tone top accent — same device used on the Mission/Vision
          card — so the card frame itself reads as a deliberate, finished
          piece rather than a plain rounded box (2026-09-29, per Vignesh:
          the video section background/card read as too plain). */}
      <div className="absolute inset-x-0 top-0 z-10 h-1 bg-gradient-to-r from-brand-dark via-white/70 to-brand" aria-hidden="true" />

      {/* Ambient glow corners, same recipe as the card-glass treatment used
          elsewhere on this page, so this reads as part of the same system
          rather than a bolted-on media embed. */}
      <div className="pointer-events-none absolute inset-0 z-10" aria-hidden>
      {/* Same mobile glow-scaling fix as the hero/video section
          (2026-09-29, per Vignesh: redness/proportion was off on
          mobile) — shrunk below sm:, desktop untouched. */}
        <div className="absolute -top-10 left-[-3rem] h-40 w-40 rounded-full bg-brand/10 blur-[50px] sm:-top-24 sm:left-[-6rem] sm:h-72 sm:w-72 sm:bg-brand/20 sm:blur-[100px]" />
        <div className="absolute -bottom-10 right-[-3rem] h-40 w-40 rounded-full bg-brand/10 blur-[50px] sm:-bottom-24 sm:right-[-6rem] sm:h-72 sm:w-72 sm:bg-brand/15 sm:blur-[110px]" />
      </div>

      <div className="relative aspect-video w-full">
        {playing ? (
          <video
            className="h-full w-full object-cover"
            src="/videos/transpeed-overview.mp4"
            poster="/videos/transpeed-poster.jpg"
            controls
            autoPlay
            playsInline
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label="Play the Transpeed Logistics overview video"
            className="group absolute inset-0 h-full w-full cursor-pointer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/videos/transpeed-poster.jpg"
              alt="Transpeed Logistics team on site — corporate overview video"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-brand-dark/10 to-brand-dark/40" />

            {/* Play control */}
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:border-brand/60 group-hover:bg-brand/90 sm:h-24 sm:w-24">
                <span className="absolute h-full w-full rounded-full bg-brand/40 opacity-0 animate-ping [animation-duration:2.2s] group-hover:opacity-100" />
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="relative ml-1 text-white"
                  aria-hidden="true"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </span>

            {/* Caption strip */}
            <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-5 sm:p-7">
              <span className="text-left">
                <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-brand">
                  Watch
                </span>
                <span className="mt-1 block font-display text-lg font-bold text-white sm:text-xl">
                  Transpeed Logistics — Corporate Overview
                </span>
              </span>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 3" strokeLinecap="round" />
                </svg>
                2:47
              </span>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
