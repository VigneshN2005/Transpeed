export interface Service {
  slug: string;
  name: string;
  tagline: string;
  shortDescription: string;
  description: string;
  steps?: { title: string; text: string }[];
  /** DSV-style line-art icon representing the service (public/images/services/) */
  icon?: string;
  /** Optional wider process/flow image (currently only Sourcing & Procurement has one) */
  diagram?: string;
  /** Hero photo for the service card on the Services page (2026-09-14, per
   * Vignesh: "in the second page they wanted image for each services") —
   * separate from `icon`, which stays the small line-art tile. */
  photo?: string;
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
