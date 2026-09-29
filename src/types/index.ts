export interface Service {
  slug: string;
  name: string;
  tagline: string;
  shortDescription: string;
  description: string;
  // `icon` added per-step (2026-09-25, per Vignesh: the "See the full
  // 6-step process" diagram was plain black-and-white line art baked into
  // one flattened image he couldn't restyle — replaced with 6 separate
  // colorful brand-palette icons, one per step, laid out with real arrow
  // connectors in code instead.
  steps?: { title: string; text: string; icon?: string }[];
  /** DSV-style line-art icon representing the service (public/images/services/) */
  icon?: string;
  /** Optional wider process/flow image (currently only Sourcing & Procurement has one) */
  diagram?: string;
  /** Hero photo for the service card on the Services page (2026-09-14, per
   * Vignesh: "in the second page they wanted image for each services") —
   * separate from `icon`, which stays the small line-art tile. */
  photo?: string;
  /** Top-banner photo for the home page's "Our Services" punch-card grid
   * only (2026-09-21, per Vignesh, after the home grid's `photo` reuse
   * accidentally also changed the Services page: "why did u change in the
   * service page too? i wanted u to change only in the home page service
   * punch card"). Deliberately separate from `photo` so the two pages can
   * carry entirely different images. Falls back to `photo` on the home
   * grid until every service has its own dedicated one. */
  cardPhoto?: string;
  /** Optional second photo shown alongside `photo` on the Services page
   * (2026-09-21, per Vignesh, for Warehousing and Distribution: "along
   * with the image that is already there ... can u add the image asked
   * too"). Only services with a second photo render the two-up layout —
   * everyone else keeps the single-image layout. */
  secondPhoto?: string;
}

export interface ExperienceEntry {
  org: string;
  period: string;
  detail: string;
}

export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  bio: string;
  experience?: ExperienceEntry[];
  leadershipNote?: string;
  photo: string;
}

export interface Location {
  city: string;
  address: string;
  isHeadquarters?: boolean;
  isBranch?: boolean;
}

export interface Certification {
  name: string;
  logo?: string;
}

export interface ClientLogo {
  name: string;
  logo?: string;
}

export interface ContactChannel {
  label: string;
  value: string;
  href: string;
}

export interface Announcement {
  id: string;
  /** Picking one of these 5 sets `title` to the matching label automatically —
   * there's no separate free-typed title. */
  type: "news" | "update" | "image" | "video" | "success-story";
  title: string;
  date: string;
  description: string;
  /** At most one of each — pasted link or uploaded file, either way just a URL. */
  image_url?: string | null;
  video_url?: string | null;
  file_url?: string | null;
  created_at: string;
}

export interface FAQEntry {
  id: string;
  category?: string;
  question: string;
  keywords: string[];
  answer: string;
}

export interface ChatbotNode {
  id: string;
  /** null = root node (a pipeline's starting overview + trigger phrases) */
  parent_id: string | null;
  label: string;
  /** Only meaningful on a root node — phrases that route a top-level question into this tree. */
  trigger_keywords: string[];
  answer: string;
  sort_order: number;
}

// A real page on the site the chatbot can redirect a visitor straight to
// (2026-09-29, per Vignesh: navigation-type questions — "terms and
// conditions", "where's your privacy policy" — must redirect immediately,
// not just answer with a link). See src/lib/chatbot/sitePages.ts.
export interface SitePage {
  label: string;
  path: string;
  keywords: string[];
}
