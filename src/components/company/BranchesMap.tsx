"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { locations } from "@/data/contact";

// City-centre coordinates — the real addresses in data/contact.ts are full
// street addresses, but for a "where we are" map, pinning each office to
// its city centre reads just as well and needs no geocoding API/key.
const COORDS: Record<string, [number, number]> = {
  Bangalore: [12.9716, 77.5946],
  Delhi: [28.6139, 77.209],
  Kolkata: [22.5726, 88.3639],
  Chennai: [13.0827, 80.2707],
  Trivandrum: [8.5241, 76.9366],
  Mumbai: [19.076, 72.8777],
  Mysore: [12.2958, 76.6394],
  Pune: [18.5204, 73.8567],
  Kanpur: [26.4499, 80.3319],
};

declare global {
  interface Window {
    L: any;
  }
}

// Leaflet + OpenStreetMap, loaded from a CDN — no API key, no billing
// account, nothing to configure. Renders a pin per branch with a popup
// (city, HQ/Branch badge, address, a "Get directions" link to Google
// Maps).
export default function BranchesMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [leafletReady, setLeafletReady] = useState(false);

  // Next.js only fires next/script's `onLoad` the very first time the
  // script is ever loaded on the page — not on every remount of this
  // component (e.g. navigating away from /company and back). Without this,
  // leafletReady stays stuck at false on a second visit and the map never
  // appears until a hard refresh gives it a fresh mount. Checking for the
  // already-loaded global here covers that case; `onReady` below (which
  // Next.js *does* re-fire on every mount) covers the rest.
  useEffect(() => {
    if (window.L) setLeafletReady(true);
  }, []);

  useEffect(() => {
    const el = mapRef.current;
    if (!leafletReady || !el || el.dataset.initialized) return;
    const L = window.L;
    if (!L) return;
    el.dataset.initialized = "true";

    const map = L.map(el, { scrollWheelZoom: false }).setView([20.9, 78.5], 5);

    // Clean street-map base — Esri's free, keyless ArcGIS Online tiles (the
    // same no-signup service already used for the earlier satellite view,
    // just pointed at their street-map style instead of imagery). CARTO's
    // basemaps now require a registered API key, which is why that attempt
    // showed a watermark instead of a map.
    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
      {
        attribution: "Tiles &copy; Esri — Source: Esri, HERE, Garmin, OpenStreetMap contributors",
        maxZoom: 19,
      }
    ).addTo(map);

    // A classic teardrop pin in the brand colour (via currentColor) rather
    // than a plain dot — reads better against a light map.
    const pinIcon = L.divIcon({
      className: "",
      html: `<div class="text-brand drop-shadow-md" style="width:30px;height:42px;">
               <svg viewBox="0 0 30 42" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                 <path d="M15 0C6.7 0 0 6.7 0 15c0 11 15 27 15 27s15-16 15-27C30 6.7 23.3 0 15 0z" />
                 <circle cx="15" cy="15" r="6" fill="white" />
               </svg>
             </div>`,
      iconSize: [30, 42],
      iconAnchor: [15, 42],
      popupAnchor: [0, -38],
    });

    locations.forEach((loc) => {
      const coords = COORDS[loc.city];
      if (!coords) return;

      const badge = loc.isHeadquarters
        ? '<span class="ml-2 rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-medium text-brand">HQ</span>'
        : loc.isBranch
          ? '<span class="ml-2 rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-500">Branch</span>'
          : "";

      L.marker(coords, { icon: pinIcon })
        .addTo(map)
        .bindPopup(`
          <div class="text-sm">
            <p class="font-semibold text-brand-dark">${loc.city}${badge}</p>
            <p class="mt-1 max-w-[220px] text-xs leading-relaxed text-zinc-500">${loc.address}</p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.address)}"
              target="_blank" rel="noopener noreferrer"
              class="mt-2 inline-block text-xs font-semibold text-brand hover:underline"
            >Get directions →</a>
          </div>
        `);
    });

    return () => {
      map.remove();
      delete el.dataset.initialized;
    };
  }, [leafletReady]);

  return (
    <>
      {/* jsDelivr rather than unpkg — faster, more consistent edge caching,
          so the first (uncached) load has less of a wait. The preconnect
          hint opens the connection to the CDN as soon as this page starts
          loading, instead of only once the script tag itself is reached. */}
      <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
      <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css" crossOrigin="" />
      <Script
        src="https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js"
        crossOrigin=""
        strategy="afterInteractive"
        onReady={() => setLeafletReady(true)}
      />
      {/* Shorter on phones (h-72) so the map doesn't eat the whole first
          screen of scroll — full h-[420px] from sm (640px) up, where there's
          room to spare. Per Vignesh's 2026-09-14 mobile/desktop-fit pass. */}
      <div className="relative h-72 w-full overflow-hidden rounded-3xl shadow-[0_25px_50px_-20px_rgba(0,0,0,0.25)] ring-1 ring-black/5 sm:h-[420px]">
        <div ref={mapRef} className="h-full w-full" />
        {!leafletReady && (
          <div className="absolute inset-0 flex items-center justify-center gap-2.5 bg-zinc-50 text-sm text-zinc-500">
            <span
              aria-hidden="true"
              className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-brand"
            />
            Loading map…
          </div>
        )}
      </div>
    </>
  );
}
