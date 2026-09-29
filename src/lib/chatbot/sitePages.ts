import type { SitePage } from "@/types";

// Hardcoded site-navigation directory for the chatbot (2026-09-29, per
// Vignesh: typing "terms and conditions", or asking where any real page on
// the site lives, must redirect straight there — not just show a clickable
// link, and not depend on an Admin-created FAQ entry existing first).
// Checked before tree/FAQ matching in /api/chatbot, so a clear navigation
// intent always wins immediately, for any page here, with zero Admin setup
// required. `keywords` are plain substrings checked against the lowercased
// query — deliberately simple/literal rather than fuzzy-scored, since a
// false-positive here means silently redirecting someone away from what
// they actually asked, which is worse than a missed match.
export const SITE_PAGES: SitePage[] = [
  {
    label: "Terms and Conditions",
    path: "/terms-conditions",
    keywords: ["terms and condition", "terms & condition", "terms of service", "t&c", "t & c"],
  },
  {
    label: "Privacy Policy",
    path: "/privacy-policy",
    keywords: ["privacy policy", "privacy page", "data protection policy"],
  },
  {
    label: "Cookies Policy",
    path: "/cookies-policy",
    keywords: ["cookies policy", "cookie policy", "cookies page"],
  },
  {
    label: "Contact Us",
    path: "/contact",
    keywords: [
      "contact us", "contact page", "contact you", "your contact",
      "get in touch", "reach you", "your phone number", "your email",
      "your address", "office location", "office address", "your offices",
    ],
  },
  {
    label: "Our Services",
    path: "/services",
    keywords: ["services page", "your services", "what services", "list of services"],
  },
  {
    label: "Company",
    path: "/company",
    keywords: ["company page", "about us", "about page", "about the company", "company info"],
  },
  {
    label: "Our People",
    path: "/people",
    keywords: ["people page", "our team", "team page", "leadership team", "management team"],
  },
  {
    label: "Client Announcements",
    path: "/announcements",
    keywords: ["client announcements", "announcements page", "news page", "updates page"],
  },
  {
    label: "Home",
    path: "/",
    keywords: ["home page", "homepage", "main page", "landing page"],
  },
];

export function matchSitePage(query: string): SitePage | null {
  const q = query.toLowerCase();
  for (const page of SITE_PAGES) {
    if (page.keywords.some((kw) => q.includes(kw))) return page;
  }
  return null;
}
