import "server-only";

import { ACCOMMODATION_TYPE_SEGMENT, type AccommodationType } from "@/lib/accommodations/types";
import { cachedRead } from "@/lib/cache/cached-read";
import { localizedSiteHref, localizeHubPath } from "@/lib/i18n/hub-paths";
import type { Locale } from "@/lib/i18n/locales";
import { createClient } from "@/lib/supabase/public";

/**
 * Turns any English site href into the same page in `locale` -- a
 * translated hub, a translated detail page (article, package, transfer
 * route, activity, atoll/island/dive site/attraction, resort/hotel/
 * guesthouse), or, when that page has no translation, the unchanged
 * English href. Never guesses a localized URL: hubs come from
 * LOCALIZED_HUB_PREFIXES, detail pages from real published
 * translations rows. This is what keeps a translated page's internal
 * links (cards, cross-links, breadcrumbs) inside its own language.
 */
export interface LinkLocalizer {
  locale: Locale;
  /** Same page in `locale`, or the unchanged English href when it has no translation. */
  href(englishHref: string): string;
  /** That page's translated title, or `fallback` (its real English title) when untranslated. */
  title(englishHref: string, fallback: string): string;
}

const PAGE = 1000;
const ID_CHUNK = 100;

type TranslationRow = { entity_id: string; entity_type: string; slug: string; title: string };
type PathEntry = { href: string; title: string };

async function fetchAll<T>(build: (from: number, to: number) => PromiseLike<{ data: T[] | null }>): Promise<T[]> {
  const rows: T[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data } = await build(from, from + PAGE - 1);
    if (!data) return rows;
    rows.push(...data);
    if (data.length < PAGE) return rows;
  }
}

async function byIdChunks<T>(ids: string[], query: (chunk: string[]) => PromiseLike<{ data: T[] | null }>): Promise<T[]> {
  const chunks: string[][] = [];
  for (let i = 0; i < ids.length; i += ID_CHUNK) chunks.push(ids.slice(i, i + ID_CHUNK));
  const results = await Promise.all(chunks.map((chunk) => query(chunk)));
  return results.flatMap((r) => r.data ?? []);
}

const LOCATION_SEGMENT: Record<string, string> = { atoll: "atolls", island: "islands", dive_site: "dive-sites", poi: "attractions" };
const STATIC_SEGMENT: Record<string, string> = { article: "travel-guide", package: "packages", transfer_route: "transfers" };

/** englishPath -> {localized path, translated title} for every published translation in this
 * locale. A few thousand short strings at most, cached like every other
 * i18n read. */
async function getTranslatedPathMapUncached(locale: Locale): Promise<Record<string, PathEntry>> {
  const map: Record<string, PathEntry> = {};
  if (locale === "en") return map;
  const supabase = await createClient();

  const translations = await fetchAll<TranslationRow>((from, to) =>
    supabase.from("translations").select("entity_id, entity_type, slug, title").eq("locale", locale).order("id").range(from, to).returns<TranslationRow[]>(),
  );
  const ids = translations.map((t) => t.entity_id);
  const idsOf = (type: string) => translations.filter((t) => t.entity_type === type).map((t) => t.entity_id);

  const [nodes, locations, activities, accommodations] = await Promise.all([
    byIdChunks(ids, (chunk) => supabase.from("nodes").select("id, slug").in("id", chunk).returns<Array<{ id: string; slug: string }>>()),
    byIdChunks(idsOf("location"), (chunk) =>
      supabase.from("locations").select("id, location_type").in("id", chunk).returns<Array<{ id: string; location_type: string }>>(),
    ),
    byIdChunks(idsOf("activity"), (chunk) =>
      supabase.from("activities").select("id, activity_category").in("id", chunk).returns<Array<{ id: string; activity_category: string }>>(),
    ),
    byIdChunks(idsOf("accommodation"), (chunk) =>
      supabase.from("accommodations").select("id, accommodation_type").in("id", chunk).returns<Array<{ id: string; accommodation_type: AccommodationType }>>(),
    ),
  ]);
  const englishSlug = new Map(nodes.map((n) => [n.id, n.slug]));
  const segment = new Map<string, string>();
  for (const l of locations) if (LOCATION_SEGMENT[l.location_type]) segment.set(l.id, LOCATION_SEGMENT[l.location_type]);
  // Surfing has no translated route (see src/app/[locale]/maldives/), so
  // a surfing activity's translation row -- if one exists -- is skipped.
  for (const a of activities) {
    if (a.activity_category === "surfing") continue;
    segment.set(a.id, a.activity_category === "fishing" || a.activity_category === "diving" ? a.activity_category : "activities");
  }
  for (const a of accommodations) segment.set(a.id, ACCOMMODATION_TYPE_SEGMENT[a.accommodation_type]);

  for (const t of translations) {
    const seg = STATIC_SEGMENT[t.entity_type] ?? segment.get(t.entity_id);
    const slug = englishSlug.get(t.entity_id);
    if (!seg || !slug) continue;
    map[`/maldives/${seg}/${slug}/`] = { href: localizeHubPath(locale, `/maldives/${seg}/${t.slug}/`), title: t.title };
  }
  return map;
}

const getTranslatedPathMap = cachedRead(getTranslatedPathMapUncached, ["i18n:translated-path-map"], 900);

function normalize(englishHref: string): [path: string, suffix: string] {
  const [pathPart, suffix = ""] = englishHref.split(/(?=[?#])/);
  return [pathPart.endsWith("/") ? pathPart : `${pathPart}/`, suffix];
}

export async function getLinkLocalizer(locale: Locale): Promise<LinkLocalizer> {
  const map = await getTranslatedPathMap(locale);
  return {
    locale,
    href(englishHref) {
      if (locale === "en" || !englishHref.startsWith("/")) return englishHref;
      const [path, suffix] = normalize(englishHref);
      const localized = map[path]?.href ?? localizedSiteHref(locale, path);
      // Only keep a query/fragment on a page that actually changed language.
      return localized === path ? englishHref : `${localized}${suffix}`;
    },
    title(englishHref, fallback) {
      if (locale === "en" || !englishHref.startsWith("/")) return fallback;
      return map[normalize(englishHref)[0]]?.title ?? fallback;
    },
  };
}
