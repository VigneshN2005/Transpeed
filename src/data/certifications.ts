import type { Certification } from "@/types";

// Certification list is real (from Gokul's requirements doc: retain + add,
// with X2 Elite/URS/UKAS removed). AEO, PCA (Premier Cargo Alliance), and
// Indo American Chamber of Commerce logos were pulled directly from the
// current live transpeedlogistics.com site. Indo French Chamber of Commerce's
// logo hasn't been found or sent yet, so it still renders as a text-only
// badge. If Gokul later sends official/updated logo files for any of these,
// swap the file in place.
//
// "IFFCO" (removed 2026-09-13): was in this list with no doc backing —
// not in the doc's retain, add, or remove instructions for certifications,
// and confirmed (via a live fetch of transpeedlogistics.com) not to be on
// the current site either, so per Vignesh's rule ("previous site items stay,
// anything else goes") it had no basis to be here.
//
// "IATA" (added 2026-09-13): the live transpeedlogistics.com site does show
// an IATA membership badge that isn't mentioned anywhere in the doc — per
// the same "previous site items stay" rule, added back as text-only (no
// logo file yet).
export const certifications: Certification[] = [
  { name: "AEO", logo: "/images/certifications/aeo.png" },
  { name: "PCA", logo: "/images/certifications/pca.png" },
  { name: "Indo American Chamber of Commerce", logo: "/images/certifications/indo-american-chamber.png" },
  { name: "IATA" },
  { name: "ISO 9001:2015", logo: "/images/certifications/iso-9001.jpg" },
  { name: "Indo French Chamber of Commerce" },
  { name: "Indo German Chamber of Commerce", logo: "/images/certifications/indo-german-chamber.png" },
  { name: "JC Trans", logo: "/images/certifications/jc-trans.png" },
  { name: "GLA Member", logo: "/images/certifications/gla.png" },
  { name: "MSME", logo: "/images/certifications/msme.webp" },
  { name: "MTO", logo: "/images/certifications/mto.webp" },
  { name: "FSSAI", logo: "/images/certifications/fssai.png" },
];
