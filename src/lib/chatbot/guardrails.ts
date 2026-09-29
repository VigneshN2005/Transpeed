// Lightweight, keyword-based guardrails for the no-LLM chatbot. There's no
// model here to reason about intent, so these are honest heuristics, not a
// real moderation system — a determined user can phrase around them, and
// legitimate questions containing a trigger word in an unrelated sense
// could get caught. If this ever handles meaningful public traffic, swap
// this for a proper moderation API (e.g. a hosted moderation endpoint)
// rather than growing this list forever.
//
// Three outcomes a query can hit, checked in this order by /api/chatbot:
//   1. Harmful/abusive topic  -> hard refusal, no FAQ search attempted at all
//   2. Not in Transpeed's logistics domain at all -> "can't answer that"
//   3. In-domain but no FAQ match -> existing human-handoff fallback flow

const HARMFUL_PATTERNS: RegExp[] = [
  // Violence / weapons
  /\b(kill|murder|assassinat\w*)\s+(someone|him|her|them|a person|people)\b/i,
  /\bhow to (make|build)\s+(a\s+)?(bomb|explosive|weapon|gun)\b/i,
  /\b(buy|sell|make)\s+(illegal\s+)?(guns?|firearms?|explosives?)\b/i,
  // Self-harm / suicide
  /\bsuicide\b/i,
  /\bself[\s-]?harm\b/i,
  /\bkill(ing)?\s+myself\b/i,
  // Illegal drugs
  /\b(buy|sell|make|cook)\s+(cocaine|heroin|meth|drugs)\b/i,
  /\bdrug\s+dealer\b/i,
  // Hacking / cybercrime
  /\bhack(ing)?\s+(into|a|someone'?s)\b/i,
  /\b(ddos|phishing|malware|ransomware)\s+(attack|someone|a company)\b/i,
  // Child exploitation (refuse outright, never engage)
  /\bchild\s+(abuse|exploitation|porn\w*)\b/i,
  /\bcsam\b/i,
  // Explicit sexual content
  /\b(porn\w*|sex\s?tape|explicit\s+images?)\b/i,
  // Hate / harassment
  /\bhate\s+speech\b/i,
  /\bracial\s+slur\w*\b/i,
];

export function isHarmfulQuery(query: string): boolean {
  return HARMFUL_PATTERNS.some((pattern) => pattern.test(query));
}

// Broad logistics/freight-forwarding vocabulary. A query matching none of
// these (and scoring no FAQ match at all) is treated as outside the bot's
// domain rather than routed into the human-handoff fallback — no point
// collecting someone's name and email over "what's the weather today."
const DOMAIN_VOCAB: string[] = [
  "freight", "shipping", "shipment", "ship", "cargo", "container", "logistics",
  "customs", "clearance", "warehouse", "warehousing", "transport", "transportation",
  "trucking", "truck", "delivery", "deliver", "quote", "quotation", "book", "booking",
  "invoice", "export", "import", "incoterm", "fob", "cif", "exw", "ddp",
  "bill of lading", "airway bill", "awb", "hs code", "iec", "aeo", "cha",
  "fcl", "lcl", "port", "vessel", "air freight", "ocean freight", "sea freight",
  "road freight", "project cargo", "vendor", "agent", "supply chain",
  "distribution", "tracking", "track", "transit", "consignee", "consignor",
  "shipper", "pod", "proof of delivery", "demurrage", "detention",
  "packing list", "commercial invoice", "duty", "tariff", "gst", "insurance",
  "inventory", "milk run", "empanelment", "procurement", "sourcing", "trade",
  "freight forwarder", "3pl", "multimodal", "break bulk", "reefer",
  "dangerous goods", "hazardous", "transpeed", "bangalore", "office", "branch",
  "contact", "onboarding", "certificate", "certification", "license", "iso",
  "iata", "fiata", "mto", "service", "company", "business", "partner",
  // Operational/company-process terms — not logistics jargon, but a
  // legitimate question a real customer would ask Transpeed. Without these,
  // a question like "what are your working days" or "can I cancel my
  // booking" was wrongly refused as out-of-domain instead of being treated
  // as a genuine knowledge-base gap (contact the team + log for Admin).
  "hours", "working days", "business hours", "timing", "schedule", "open",
  "closing", "holiday", "payment", "refund", "cancel", "cancellation",
  "discount", "policy", "minimum order", "bulk shipment",
  // Site-navigation / legal-page terms (2026-09-29, per Vignesh: asking
  // for "terms and conditions" or where a page lives was wrongly hitting
  // the out-of-domain refusal instead of a real answer). These don't share
  // logistics vocabulary but are still legitimate questions about
  // Transpeed's own site.
  "terms and conditions", "terms of service", "terms", "t&c",
  "privacy policy", "privacy", "cookies policy", "cookie policy", "cookies",
  "sitemap", "site map", "careers", "vacancy", "vacancies", "team", "people",
  "website", "webpage", "page",
];

export function isInDomainQuery(query: string): boolean {
  const lower = query.toLowerCase();
  return DOMAIN_VOCAB.some((term) => lower.includes(term));
}

// Greetings and small talk are common sense to handle, not an out-of-domain
// rejection — checked before domain/FAQ matching so "hi" never gets treated
// as a failed search. Kept to short, unambiguous patterns anchored at the
// start of the message so a real question that happens to start politely
// ("hey, how do I get a quote?") still isn't swallowed here — the caller
// only shows this canned reply and stops, so it must not fire on anything
// with a real question buried in it.
const GREETING_PATTERNS: RegExp[] = [
  /^(hi+|hello+|hey+|hola|yo|sup)[\s!.,]*$/i,
  /^good (morning|afternoon|evening)[\s!.,]*$/i,
  /^greetings[\s!.,]*$/i,
];
const THANKS_PATTERNS: RegExp[] = [/^(thanks?|thank you|thx|cheers)[\s!.,]*$/i];
const BYE_PATTERNS: RegExp[] = [/^(bye|goodbye|see you|take care)[\s!.,]*$/i];

const GREETING_REPLY =
  "Hi there! How can I help — ask me about our services, getting a quote, or anything logistics-related.";
const THANKS_REPLY = "You're welcome! Let me know if there's anything else I can help with.";
const BYE_REPLY = "Take care! Reach out anytime you need help with a shipment or quote.";

export function matchSmallTalk(query: string): string | null {
  const trimmed = query.trim();
  if (!trimmed) return null;
  if (GREETING_PATTERNS.some((p) => p.test(trimmed))) return GREETING_REPLY;
  if (THANKS_PATTERNS.some((p) => p.test(trimmed))) return THANKS_REPLY;
  if (BYE_PATTERNS.some((p) => p.test(trimmed))) return BYE_REPLY;
  return null;
}
