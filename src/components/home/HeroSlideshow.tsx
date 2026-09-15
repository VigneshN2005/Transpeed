"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// Real photography (commissioned per the brand brief, reviewed and approved)
// replacing the earlier gradient-panel placeholders.
const slides = [
  { image: "/images/hero/hero-ocean-freight.jpg", caption: "Freight moving across air, sea, and road" },
  { image: "/images/hero/hero-customs.jpg", caption: "AEO-certified customs clearance" },
  { image: "/images/hero/hero-warehousing.jpg", caption: "Warehousing and distribution, nationwide" },
  { image: "/images/hero/hero-trucking.jpg", caption: "The last mile, handled like it's the only mile that matters" },
  { image: "/images/hero/hero-air-freight.jpg", caption: "Project logistics for cargo that doesn't fit a box" },
];

export default function HeroSlideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative h-64 w-full overflow-hidden rounded-2xl sm:h-80 lg:h-full lg:min-h-[22rem]">
      {slides.map((slide, i) => (
        <div
          key={slide.image}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.caption}
            fill
            priority={i === 0}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
          <div className="absolute inset-0 flex items-end p-6">
            <p className="text-sm font-medium text-white/90">{slide.caption}</p>
          </div>
        </div>
      ))}
      <div className="absolute bottom-3 right-4 flex gap-1.5">
        {slides.map((slide, i) => (
          <span
            key={slide.image}
            className={`h-1.5 w-1.5 rounded-full ${i === index ? "bg-white" : "bg-white/40"}`}
          />
        ))}
      </div>
    </div>
  );
}
