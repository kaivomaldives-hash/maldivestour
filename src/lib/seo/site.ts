import { DEFAULT_LOCALE, SUPPORTED_LOCALES, localizedPath, type Locale } from "@/lib/i18n/locales";

const DEFAULT_SITE_URL = "https://maldivestour.guide";

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL).replace(/\/+$/, "");
}

/** Builds an absolute, trailing-slash canonical URL for a site-relative path. */
export function canonicalUrl(path: string): string {
  const normalized = `/${path.replace(/^\/+/, "").replace(/\/+$/, "")}/`;
  return `${getSiteUrl()}${normalized === "//" ? "/" : normalized}`;
}

/** Locale-aware canonical: English is identical to canonicalUrl() (no
 * prefix, unchanged behavior for every existing caller); other locales
 * get their `/xx/...` prefix. Every localized page canonicalizes to
 * *itself*, never to the English URL (Task 19 §15) — this is the only
 * function that should ever be used to build a canonical for a page
 * under src/app/[locale]/. */
export function localizedCanonicalUrl(locale: Locale, englishPath: string): string {
  return canonicalUrl(localizedPath(locale, englishPath));
}

/** hreflang alternates for a page, built ONLY from locales that actually
 * have a published translation (never a fabricated URL for an
 * unpublished/draft locale — Task 19 §14). Always reciprocal by
 * construction: every locale in `publishedLocales` gets an entry
 * pointing at every other locale's real URL, English included, plus an
 * x-default pointing at English. `englishPath` is the canonical
 * (unprefixed) path this whole page family shares, e.g. "/maldives/". */
export function hreflangAlternates(englishPath: string, publishedLocales: Locale[]): Record<string, string> {
  const locales: Locale[] = [DEFAULT_LOCALE, ...publishedLocales.filter((l) => l !== DEFAULT_LOCALE)];
  const alternates: Record<string, string> = {};
  for (const locale of locales) {
    alternates[locale] = localizedCanonicalUrl(locale, englishPath);
  }
  alternates["x-default"] = localizedCanonicalUrl(DEFAULT_LOCALE, englishPath);
  return alternates;
}

/** All supported locale codes — re-exported here so page-level
 * generateStaticParams/generateMetadata call sites don't need a second
 * import from src/lib/i18n/locales just for the list. */
export { SUPPORTED_LOCALES };

/** BreadcrumbList structured data from the same {label, href} pairs a
 * page already passes to <PageHero breadcrumbs=.../> — real, visible
 * navigation only, never a fabricated hierarchy (Task 18 §"structured
 * data"). The final crumb (the current page, usually href-less) is
 * pointed at the page's own canonical URL. */
export function breadcrumbJsonLd(items: Array<{ label: string; href?: string }>, currentPath: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href ? canonicalUrl(item.href) : canonicalUrl(currentPath),
    })),
  };
}

// Real, verified MTG profiles only — the same list src/components/
// site-footer.tsx renders (Task 12 brief: never add an account not
// explicitly supplied). Duplicated here rather than imported from the
// footer component to avoid a client-component -> lib import; both lists
// must be kept in sync if a profile is ever added/removed.
const SOCIAL_PROFILE_URLS = [
  "https://www.linkedin.com/company/maldivestourguide/",
  "https://www.youtube.com/@Maldives-Holiday",
  "https://web.facebook.com/maldivestourguide",
  "https://x.com/maldivestourg",
  "https://www.pinterest.com/themaldivesholidays/",
  "https://www.tiktok.com/@maldivestourguides",
  "https://www.instagram.com/themaldivesholiday/",
];

/** Sitewide Organization entity — rendered once, in the root layout, not
 * per-page. Every field is a real, already-established value (site name/
 * URL used everywhere else via getSiteUrl(), the real logo at /logo.png,
 * the same verified social links the footer renders) — no statistics,
 * ratings, or awards, which this project has never had real data for. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Maldives Tour Guide (MTG)",
    url: getSiteUrl(),
    logo: `${getSiteUrl()}/logo.png`,
    sameAs: SOCIAL_PROFILE_URLS,
  };
}

/** Sitewide WebSite entity with a real SearchAction — /maldives/search/
 * already accepts ?q= and returns real results (src/components/search/
 * search-page.tsx), so this isn't a fabricated capability. */
export function websiteJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Maldives Tour Guide (MTG)",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/maldives/search/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

/** ItemList structured data for any real, currently-listed set of
 * entities on a directory/hub page (activities, dive sites, attractions,
 * ...) — one shared implementation instead of a bespoke one per page.
 * `itemType` is the schema.org type of each listed entity (e.g.
 * "Service" for a bookable activity, "TouristAttraction" for a place). */
export function itemListJsonLd(
  items: Array<{ title: string; href: string; summary: string | null }>,
  itemType: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": itemType,
        name: item.title,
        description: item.summary ?? undefined,
        url: canonicalUrl(item.href),
      },
    })),
  };
}
