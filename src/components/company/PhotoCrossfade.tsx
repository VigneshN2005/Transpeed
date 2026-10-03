"use client";

// Crossfading photo frame (2026-10-03, per Vignesh: "1 photo stays for few
// sec and the other appears than again previous appears"). Used in "Our
// Philosophy" on the Company page. Each photo holds for ~5s with a very slow
// zoom, then crossfades into the next, looping automatically, always: no
// pause on hover or off screen (per Vignesh: "the images must take turns
// automatically"). The dots show which photo is on and can jump to one.
// prefers-reduced-motion: still takes turns, just without the zoom.

import Image from "next/image";
import { useEffect, useState } from "react";

type Photo = { src: string; alt: string; position?: string };

const HOLD_MS = 5000;
const FADE_MS = 1200;

export default function PhotoCrossfade({ photos, className = "" }: { photos: Photo[]; className?: string }) {
  const [active, setActive] = useState(0);
  const [cycle, setCycle] = useState(0); // restarts the zoom each time a photo comes in
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Auto-advance. Re-arms after every change (including a dot click), so
  // each photo always gets its full turn.
  useEffect(() => {
    if (photos.length < 2) return;
    const t = window.setTimeout(() => {
      setActive((a) => (a + 1) % photos.length);
      setCycle((c) => c + 1);
    }, HOLD_MS + FADE_MS);
    return () => window.clearTimeout(t);
  }, [active, photos.length]);

  return (
    <div className={className}>
      <div className="relative aspect-[3/2] overflow-hidden rounded-2xl shadow-[0_18px_40px_-18px_rgba(0,0,0,0.6)] ring-1 ring-white/10">
        {photos.map((p, i) => (
          <div
            key={p.src}
            aria-hidden={i !== active}
            className="absolute inset-0"
            style={{
              opacity: i === active ? 1 : 0,
              transition: `opacity ${FADE_MS}ms ease-in-out`,
              zIndex: i === active ? 1 : 0,
            }}
          >
            <Image
              // re-key on each new turn so the slow zoom starts fresh
              key={i === active ? `${p.src}-${cycle}` : p.src}
              src={p.src}
              alt={p.alt}
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              className={`object-cover ${i === active && !reduced ? "tp-kenburns" : ""}`}
              style={{ objectPosition: p.position ?? "50% 50%" }}
              priority={i === 0}
            />
          </div>
        ))}
        <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-black/25 via-transparent to-transparent" />
      </div>
      {photos.length > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {photos.map((p, i) => (
            <button
              key={p.src}
              type="button"
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === active}
              onClick={() => {
                setActive(i);
                setCycle((c) => c + 1);
              }}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === active ? "w-8 bg-brand" : "w-3 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
