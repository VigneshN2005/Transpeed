import type { Certification } from "@/types";

// Certification list is real (from Gokul's requirements doc: retain + add,
// with X2 Elite/URS/UKAS removed). AEO, PCA (Premier Cargo Alliance), and
// Indo American Chamber of Commerce logos were pulled directly from the
// current live transpeedlogistics.com site. If Gokul later sends
// official/updated logo files for any of these, swap the file in place.
//
// "IFFCO" (removed 2026-09-13): was in this list with no doc backing —
// not in the doc's retain, add, or remove instructions for certifications,
// and confirmed (via a live fetch of transpeedlogistics.com) not to be on
// the current site either, so per Vignesh's rule ("previous site items stay,
// anything else goes") it had no basis to be here.
//
// "IATA" (added 2026-09-13, text-only; logo added 2026-09-21): the live
// transpeedlogistics.com site does show an IATA membership badge that isn't
// mentioned anywhere in the doc — per the same "previous site items stay"
// rule, added back; the real logo file arrived from Vignesh on 2026-09-21.
//
// "Indo French Chamber of Commerce" logo added 2026-09-21 (was text-only
// since it hadn't been found or sent). "FIATA" is a new entry added the same
// day, per Vignesh sending its logo directly — not previously mentioned in
// Gokul's doc or found on the live site.
export const certifications: Certification[] = [
  // C6 Logistic Networks (moved 2026-09-29, per Vignesh: it's a logistics
  // network/alliance membership, not a client, so it belongs here instead
  // of the "Our Clients" carousel).
  { name: "C6 Logistic Networks", logo: "/images/certifications/c6-logistic-networks.jpg" },
  { name: "AEO", logo: "/images/certifications/aeo.png" },
  { name: "PCA", logo: "/images/certifications/pca.png" },
  { name: "Indo American Chamber of Commerce", logo: "/images/certifications/indo-american-chamber.png" },
  { name: "IATA", logo: "/images/certifications/iata.png" },
  { name: "ISO 9001:2015", logo: "/images/certifications/iso-9001.jpg" },
  { name: "Indo French Chamber of Commerce", logo: "/images/certifications/indo-french-chamber.png" },
  { name: "Indo German Chamber of Commerce", logo: "/images/certifications/indo-german-chamber.png" },
  { name: "JC Trans", logo: "/images/certifications/jc-trans.png" },
  { name: "GLA Member", logo: "/images/certifications/gla.png" },
  { name: "MSME", logo: "/images/certifications/msme.webp" },
  { name: "MTO", logo: "/images/certifications/mto.webp" },
  { name: "FSSAI", logo: "/images/certifications/fssai.png" },
  { name: "FIATA", logo: "/images/certifications/fiata.png" },
];
