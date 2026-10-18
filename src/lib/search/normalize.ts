// Query normalization and relevance scoring for site-wide search (Task 13
// §8-9). Deliberately simple and deterministic — no fuzzy-matching
// library, no external search index. Handles the normal variation a real
// visitor types (case, extra whitespace, basic punctuation) without
// producing unrelated results.

const MAX_QUERY_LENGTH = 100;

/** Collapses whitespace, strips characters that can't meaningfully match
 * a title anyway (keeps letters/numbers/spaces and a few common
 * punctuation marks used in real titles, e.g. "7-Night"), and caps
 * length so a pathological input can't drive an expensive query. */
export function normalizeQuery(raw: string): string {
  return raw
    .normalize("NFC")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^\p{L}\p{N}\s'’\-]/gu, "")
    .slice(0, MAX_QUERY_LENGTH);
}

export function tokenize(query: string): string[] {
  return normalizeQuery(query)
    .toLowerCase()
    .split(" ")
    .filter((token) => token.length > 0);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Scores how well `title` matches `query`, following the priority order
 * in Task 13 §9: exact > prefix > whole-word > substring > multi-token >
 * unrelated-by-title (only reachable via a location/category match).
 * Deterministic — equal inputs always produce equal scores, so ties fall
 * back to the caller's stable secondary sort (title, then id).
 */
export function scoreTitleMatch(title: string, query: string): number {
  const t = title.toLowerCase();
  const q = query.toLowerCase().trim();
  if (!q) return 0;

  if (t === q) return 100;
  if (t.startsWith(q)) return 85;
  if (new RegExp(`\\b${escapeRegExp(q)}`, "i").test(title)) return 65;
  if (t.includes(q)) return 45;

  const tokens = tokenize(q);
  if (tokens.length > 1) {
    const hits = tokens.filter((token) => t.includes(token)).length;
    if (hits === tokens.length) return 35;
    if (hits > 0) return 20;
  }

  return 0;
}

/** Base score for a result that was only surfaced through a targeted
 * location/category/type expansion (e.g. "resort dhaalu" resolving to
 * accommodations of type=resort in Dhaalu Atoll) rather than a direct
 * title match — still relevant, ranked below anything that matched the
 * title text itself. */
export const EXPANSION_MATCH_SCORE = 15;

/** Strips diacritics for comparison only (never for display) — titles are
 * plain ASCII spellings now (Male, not Malé), but this stays as a general
 * safety net for any other accented title a query might be typed against.
 * Postgres ILIKE can't fold accents itself without the `unaccent`
 * extension, which this task doesn't add, so anywhere the underlying data
 * is compared in application code (the multi-token AND filter below)
 * folds first. */
export function foldDiacritics(value: string): string {
  return value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

/** True when every token appears in `title` as a substring, accent- and
 * case-insensitively — the fallback relevance test for multi-word queries
 * whose words don't appear contiguously in that order in the real title
 * (e.g. "airport maafushi" against "Velana International Airport to
 * Maafushi"). */
export function tokensAllPresent(title: string, tokens: string[]): boolean {
  const folded = foldDiacritics(title);
  return tokens.every((token) => folded.includes(foldDiacritics(token)));
}

// Place names like Malé/Hulhumalé/Villimalé are now stored and titled
// without their accent (Male/Hulhumale/Villimale), so a visitor typing
// the plain, unaccented spelling already matches the real title directly
// — no query rewriting needed here any more (see git history for the
// previous KNOWN_PLACE_NAME_VARIANTS table, removed when those titles
// were de-accented).
