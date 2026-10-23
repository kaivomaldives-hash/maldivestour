import { DEFAULT_LOCALE, localizedPath, type Locale } from "@/lib/i18n/locales";

/**
 * Single source of truth for every [locale] route segment beyond the
 * bare `/{locale}` prefix -- next.config.ts's rewrites/redirects,
 * canonical/hreflang generation (src/lib/seo/site.ts), per-entity
 * locale paths (src/lib/i18n/repository.ts's getEntityLocalePaths), and
 * every internal nav/breadcrumb link all read from this one map, so
 * there is exactly one place that knows "pakety" means
 * "/maldives/packages/" in Russian.
 *
 * Keys are the real English path prefix (always starting and ending in
 * "/"). Values are the FULLY COMPOSED localized prefix per locale
 * (including its own parent segment already localized, e.g. the
 * "packages" entry's Russian value is "/maldivy/pakety/", not just
 * "/pakety/") -- this avoids any recursive segment-substitution logic,
 * at the cost of listing each locale's words out in full. A prefix with
 * no entry for a given locale falls back to the plain English segment
 * (never a fabricated word), exactly like every other "not translated
 * yet" fallback in this codebase.
 *
 * These words must stay in sync with the page_translations.slug column
 * for the matching page_key (see the migration that seeded them) --
 * this map is the one actually read for routing; the DB column is kept
 * for documentation/consistency, same as it already was before this
 * was wired up.
 */
export const LOCALIZED_HUB_PREFIXES: Record<string, Partial<Record<Locale, string>>> = {
  "/maldives/": {
    de: "/malediven/",
    es: "/maldivas/",
    it: "/maldive/",
    ru: "/maldivy/",
    ja: "/morudibu/",
    zh: "/maerdaifu/",
  },
  "/maldives/packages/": {
    de: "/malediven/pakete/",
    es: "/maldivas/paquetes/",
    it: "/maldive/pacchetti/",
    ru: "/maldivy/pakety/",
    ja: "/morudibu/pakeji/",
    zh: "/maerdaifu/taocan/",
  },
  "/maldives/transfers/": {
    de: "/malediven/transfer/",
    es: "/maldivas/traslados/",
    it: "/maldive/trasferimenti/",
    ru: "/maldivy/transfery/",
    ja: "/morudibu/sogei/",
    zh: "/maerdaifu/jiesong/",
  },
  "/maldives/travel-guide/": {
    de: "/malediven/reisefuehrer/",
    es: "/maldivas/guia-de-viaje/",
    it: "/maldive/guida-di-viaggio/",
    ru: "/maldivy/putevoditel/",
    ja: "/morudibu/ryokou-gaido/",
    zh: "/maerdaifu/lvyou-zhinan/",
  },
  "/maldives/fishing/": {
    de: "/malediven/angeln/",
    es: "/maldivas/pesca/",
    it: "/maldive/pesca/",
    ru: "/maldivy/rybalka/",
    ja: "/morudibu/tsuri/",
    zh: "/maerdaifu/diaoyu/",
  },
  "/maldives/diving/": {
    de: "/malediven/tauchen/",
    es: "/maldivas/buceo/",
    it: "/maldive/immersioni/",
    ru: "/maldivy/dayving/",
    ja: "/morudibu/daibingu/",
    zh: "/maerdaifu/qianshui/",
  },
  "/maldives/activities/": {
    de: "/malediven/aktivitaeten/",
    es: "/maldivas/actividades/",
    it: "/maldive/attivita/",
    ru: "/maldivy/aktivnosti/",
    ja: "/morudibu/akutibiti/",
    zh: "/maerdaifu/huodong/",
  },
};

// Longest (most specific) prefix first, so "/maldives/packages/" is
// tried before the more general "/maldives/" -- otherwise the shorter
// prefix would always win and nested segments would never localize.
const ORDERED_PREFIXES = Object.keys(LOCALIZED_HUB_PREFIXES).sort((a, b) => b.length - a.length);

/**
 * Translates a real English path (built from one of the prefixes
 * above, e.g. "/maldives/packages/some-slug/") into its fully localized
 * form for one locale. Falls back to `localizedPath` (plain
 * `/{locale}{englishPath}`, keeping every segment in English) when the
 * path doesn't start with any registered hub prefix, or when this
 * specific locale has no chosen word for the matching prefix yet --
 * never fabricates a translated segment.
 */
export function localizeHubPath(locale: Locale, englishPath: string): string {
  if (locale === DEFAULT_LOCALE) return englishPath;

  for (const prefix of ORDERED_PREFIXES) {
    if (!englishPath.startsWith(prefix)) continue;
    const localizedPrefix = LOCALIZED_HUB_PREFIXES[prefix][locale];
    if (!localizedPrefix) break; // no word chosen yet for this locale -- keep English segment
    return `/${locale}${localizedPrefix}${englishPath.slice(prefix.length)}`;
  }

  return localizedPath(locale, englishPath);
}

/**
 * Reverse of `localizeHubPath`, for exactly one use: the language
 * switcher (Task 22). Given the CURRENT full pathname and the locale
 * it's actually in, returns the English hub prefix (e.g.
 * "/maldives/packages/") when `pathname` is one of these hub pages
 * ITSELF -- not a detail sub-page below it (those are handled via
 * EntityLocaleLinksContext instead, since their slug differs per
 * locale and can't be derived from the hub prefix). Returns null for
 * every other page, including a hub's own detail sub-pages.
 *
 * Tried against every registered prefix (not just the longest match --
 * these are exact-equality checks against a fully composed path, so
 * "/maldives/packages/" can never accidentally match the "/maldives/"
 * entry too). Tolerates a missing trailing slash since Next.js can
 * hand back a pathname either way depending on how the link was built.
 */
export function hubPrefixForPath(locale: Locale, pathname: string): string | null {
  for (const prefix of Object.keys(LOCALIZED_HUB_PREFIXES)) {
    const localized = localizeHubPath(locale, prefix);
    if (pathname === localized || pathname === localized.slice(0, -1)) return prefix;
  }
  return null;
}
