import type { FAQEntry, ChatbotNode } from "@/types";

// FAQ matching engine. Fuse.js was tried first and dropped: Fuse scores a
// query as ONE literal fuzzy string searched inside each field, so a natural
// sentence ("how do i get a quote") only matches a field that contains that
// near-exact wording. A short keyword like "quote" is too short to hold the
// whole pattern, and averaging in the long `answer` text as a third weighted
// key made things worse (it almost never contains the user's literal
// phrasing, dragging good matches over threshold and out of the results).
// Real behaviour observed live: "how do i get a quote" failed to match the
// get-quote FAQ entry outright.
//
// This engine instead:
//   1. Compares the WHOLE query against the WHOLE question, and separately
//      against each individual keyword phrase, using character-bigram Dice
//      similarity — tolerant of extra/missing filler words and typos, but
//      (because it's whole-string, not per-word) still respects phrasing,
//      so "get a quote" doesn't collide with "quote turnaround" just because
//      both entries mention "get" and "quote" somewhere.
//   2. Falls back to loose bag-of-words keyword overlap only as a weaker
//      secondary signal, used for surfacing "did you mean" suggestions —
//      never to trigger a confident direct answer on its own.
// Verified against the live faq_entries dataset in a standalone test before
// shipping (see chat history) — tune the constants below if real usage
// still turns up bad matches.

const STOPWORDS = new Set([
  "a", "an", "the", "is", "are", "do", "does", "did", "i", "you", "we", "they",
  "it", "he", "she", "to", "of", "in", "on", "for", "and", "or", "my", "your",
  "our", "their", "what", "how", "can", "could", "would", "should", "please",
  "me", "us", "that", "this", "these", "those", "with", "about",
  // "where"/"who"/"when"/"why" were missing alongside "what"/"how" — found
  // live: "can you tell me where my cargo is" was outranking the correct
  // shipment-status FAQ with unrelated nav-page entries ("Where can I meet
  // your team?", "Where is your head office?") purely because they all
  // share the word "where". These wh-words carry no topic content on their
  // own and shouldn't count as a "real" shared word between a query and an
  // FAQ entry.
  "where", "who", "when", "why",
]);

function normalize(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function tokenize(str: string): string[] {
  return normalize(str).split(" ").filter(Boolean);
}

function significantTokens(str: string): string[] {
  return tokenize(str).filter((t) => t.length >= 2 && !STOPWORDS.has(t));
}

function bigrams(str: string): string[] {
  const s = normalize(str);
  const grams: string[] = [];
  for (let i = 0; i < s.length - 1; i++) grams.push(s.slice(i, i + 2));
  return grams;
}

function diceCoefficient(a: string, b: string): number {
  const ga = bigrams(a);
  const gb = bigrams(b);
  if (ga.length === 0 || gb.length === 0) return ga.length === gb.length ? 1 : 0;
  const counts = new Map<string, number>();
  for (const g of ga) counts.set(g, (counts.get(g) ?? 0) + 1);
  let intersection = 0;
  for (const g of gb) {
    const c = counts.get(g) ?? 0;
    if (c > 0) {
      intersection++;
      counts.set(g, c - 1);
    }
  }
  return (2 * intersection) / (ga.length + gb.length);
}

function keywordOverlapScoreTokens(queryTokens: string[], hayTokenList: string[]): number {
  if (queryTokens.length === 0) return 0;
  const hayTokenSet = new Set(hayTokenList);
  let sum = 0;
  for (const qt of queryTokens) {
    if (hayTokenSet.has(qt)) {
      sum += 1;
      continue;
    }
    let best = 0;
    for (const h of hayTokenList) {
      if ((h.startsWith(qt) || qt.startsWith(h)) && Math.min(h.length, qt.length) >= 3) {
        best = Math.max(best, 0.85);
      }
    }
    sum += best;
  }
  return sum / queryTokens.length;
}

function keywordOverlapScore(queryTokens: string[], entry: FAQEntry): number {
  return keywordOverlapScoreTokens(queryTokens, tokenize(entry.keywords.join(" ")));
}

// Character-bigram Dice similarity on two full English sentences is noisy:
// any two ordinary sentences of similar length share a fair number of
// bigrams from common filler words alone ("the", "are", "you", " a", "ing"),
// which was enough to drag completely unrelated queries — even nonsense
// like "what's the weather today" — over SUGGESTION_THRESHOLD against some
// entry, purely from that shared filler structure. Requiring at least one
// REAL shared significant word (or a genuine prefix match on one) before an
// entry is even eligible closes that gap without weakening genuine matches
// (verified against the live dataset — see chat history for the before/
// after comparison this was tuned against).
function hasRealOverlap(queryTokens: string[], entry: FAQEntry): boolean {
  const hayTokens = [
    ...significantTokens(entry.question),
    ...entry.keywords.flatMap((k) => significantTokens(k)),
  ];
  for (const qt of queryTokens) {
    for (const h of hayTokens) {
      if (h === qt) return true;
      if ((h.startsWith(qt) || qt.startsWith(h)) && Math.min(h.length, qt.length) >= 4) return true;
    }
  }
  return false;
}

interface Scored {
  entry: FAQEntry;
  primary: number; // whole-phrase similarity — gates a confident direct answer
  final: number; // primary, or the looser keyword-bag overlap if higher — for suggestions only
}

function scoreEntry(query: string, queryTokens: string[], entry: FAQEntry): Scored {
  const questionSim = diceCoefficient(query, entry.question);
  let bestPhrase = 0;
  for (const kw of entry.keywords) bestPhrase = Math.max(bestPhrase, diceCoefficient(query, kw));
  const primary = Math.max(questionSim, bestPhrase);
  const kwSim = keywordOverlapScore(queryTokens, entry);
  return { entry, primary, final: Math.max(primary, kwSim) };
}

const CONFIDENT_THRESHOLD = 0.55;
const CONFIDENT_GAP = 0.12; // winner must clear the runner-up by this much
// Raised from 0.35 after live testing: with the fuller keyword set now in
// faq_entries, genuinely unanswerable in-domain questions ("do you offer
// free packaging for my shipment", "do you charge extra for weekend
// delivery") were still clearing 0.35 on a single loosely-shared word
// (e.g. "shipment", "delivery") against an unrelated entry, so they got
// weak "did you mean" suggestions instead of ever reaching the genuine-gap
// / admin-notification path — the one behavior corrected most this
// session. 0.52 (just above the 0.5 a single shared word like "days"
// alone produces) verified against real live queries to still surface
// suggestions for questions that actually share solid overlap.
const SUGGESTION_THRESHOLD = 0.52;
export const MAX_SUGGESTIONS = 3;

export type MatchResult =
  | { type: "best"; entry: FAQEntry; score: number }
  | { type: "suggestions"; matches: { entry: FAQEntry; score: number }[] }
  | { type: "none" };

export function matchFaq(query: string, entries: FAQEntry[]): MatchResult {
  const queryTokens = significantTokens(query);
  const eligible = entries.filter((e) => hasRealOverlap(queryTokens, e));
  const scored = eligible.map((e) => scoreEntry(query, queryTokens, e));

  const byPrimary = [...scored].sort((a, b) => b.primary - a.primary);
  const top = byPrimary[0];
  const second = byPrimary[1];
  if (top && top.primary >= CONFIDENT_THRESHOLD && (!second || top.primary - second.primary >= CONFIDENT_GAP)) {
    return { type: "best", entry: top.entry, score: top.primary };
  }

  const suggestions = [...scored]
    .sort((a, b) => b.final - a.final)
    .filter((s) => s.final >= SUGGESTION_THRESHOLD)
    .slice(0, MAX_SUGGESTIONS)
    .map((s) => ({ entry: s.entry, score: s.final }));

  if (suggestions.length > 0) {
    return { type: "suggestions", matches: suggestions };
  }
  return { type: "none" };
}

// --- Decision-tree matching (chatbot_nodes) -------------------------------
// Same scoring approach as the flat FAQ matcher above (whole-phrase Dice
// similarity, with a looser keyword-bag overlap folded in), reused for two
// different jobs:
//   - matchTreeRoot: does this fresh top-level question start one of the
//     admin-defined pipelines (Quotation, Booking, etc.)? Checked against
//     each root's own label plus its admin-editable trigger_keywords.
//   - matchTreeChild: within an active branch, does the follow-up match one
//     of the current node's next-question options? If nothing matches, the
//     caller resets state and re-evaluates the query fresh (root match, then
//     flat FAQ) — "cutting the tree", per the agreed design.
// Both require the same confidence bar as FAQ matching (a clear winner, not
// just the closest of several weak scores) since a wrong tree/branch guess
// is more disruptive to the conversation than a missed FAQ match.

export interface TreeMatchResult {
  node: ChatbotNode;
  score: number;
}

function bestOfTopTwo(scored: TreeMatchResult[]): TreeMatchResult | null {
  const sorted = [...scored].sort((a, b) => b.score - a.score);
  const top = sorted[0];
  const second = sorted[1];
  if (top && top.score >= CONFIDENT_THRESHOLD && (!second || top.score - second.score >= CONFIDENT_GAP)) {
    return top;
  }
  return null;
}

export function matchTreeRoot(query: string, roots: ChatbotNode[]): TreeMatchResult | null {
  const queryTokens = significantTokens(query);
  const scored: TreeMatchResult[] = roots.map((node) => {
    const labelSim = diceCoefficient(query, node.label);
    let bestKw = 0;
    for (const kw of node.trigger_keywords) bestKw = Math.max(bestKw, diceCoefficient(query, kw));
    const overlap = keywordOverlapScoreTokens(queryTokens, tokenize(node.trigger_keywords.join(" ")));
    return { node, score: Math.max(labelSim, bestKw, overlap) };
  });
  return bestOfTopTwo(scored);
}

export function matchTreeChild(query: string, children: ChatbotNode[]): TreeMatchResult | null {
  const queryTokens = significantTokens(query);
  const scored: TreeMatchResult[] = children.map((node) => {
    const labelSim = diceCoefficient(query, node.label);
    const overlap = keywordOverlapScoreTokens(queryTokens, tokenize(node.label));
    return { node, score: Math.max(labelSim, overlap) };
  });
  return bestOfTopTwo(scored);
}
