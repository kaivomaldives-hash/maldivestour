import type { MetadataRoute } from "next";

import { getAccommodations } from "@/lib/accommodations/repository";
import { ACCOMMODATION_TYPE_SEGMENT } from "@/lib/accommodations/types";
import { getAllAccommodationSeoLandingSpecs } from "@/lib/accommodations/seo-landing-content";
import { getAccommodationSeoLandingResults } from "@/lib/accommodations/seo-landing-repository";
import { getActivities } from "@/lib/activities/repository";
import { activityHref } from "@/lib/activities/types";
import { getArticles } from "@/lib/articles/repository";
import { getAttractions } from "@/lib/attractions/repository";
import { getDiveSites } from "@/lib/diving/repository";
import type { Locale } from "@/lib/i18n/locales";
import { localizeHubPath } from "@/lib/i18n/hub-paths";
import { getEntityLocaleSlugsByIds, getPublishedLocalesForPage } from "@/lib/i18n/repository";
import { DESTINATION_STRINGS_LOCALES } from "@/lib/i18n/destination-strings";
import { UI_STRINGS_LOCALES } from "@/lib/i18n/ui-strings";
import { getAtolls, getIslands } from "@/lib/locations/repository";
import { getPackages } from "@/lib/packages/repository";
import { getProviders } from "@/lib/providers/repository";
import { getSiteUrl, hreflangAlternates, localizedCanonicalUrl } from "@/lib/seo/site";
import { getSpeedboats } from "@/lib/speedboats/repository";
import { getSurfBreaks } from "@/lib/surfing/repository";
import { getTransferRoutes } from "@/lib/transfers/repository";

/**
 * Task 16 §30: the sitemap must contain only real, currently-live
 * canonical URLs — never an old redirected `.html` path, never a
 * duplicate. Every URL here is built from the exact same repository
 * functions the pages themselves use, so this can never list a page that
 * doesn't actually exist.
 *
 * Without an explicit `revalidate`, Next.js treats this metadata route as
 * static and bakes it once at build time — new DB rows (new activities,
 * packages, articles, etc.) would then only reach the sitemap on the next
 * deploy. Matching the same hourly window the rest of the site's dynamic
 * pages use (e.g. src/app/maldives/stays/page.tsx) keeps it current
 * without needing a redeploy every time new content is published.
 *
 * Deliberately not a round 3600: this route alone touches the entire
 * catalog (every accommodation, activity, package, transfer route,
 * island, etc. via fetchAllPages below), so if its regeneration ever
 * landed in the same instant as the many per-entity detail routes'
 * regenerations (all also on round hourly windows), that's a lot of
 * simultaneous load on Supabase at once. Staggered along with every
 * other revalidate in src/app -- see src/app/page.tsx for why.
 */
export const revalidate = 3840;

const PAGE_SIZE = 100; // matches every repository's own pageSize cap

async function fetchAllPages<T>(fetchPage: (page: number) => Promise<{ items: T[]; total: number }>): Promise<T[]> {
  const all: T[] = [];
  let page = 1;
  for (;;) {
    const result = await fetchPage(page);
    all.push(...result.items);
    if (all.length >= result.total || result.items.length === 0) break;
    page += 1;
  }
  return all;
}

const STATIC_PATHS = [
  "/",
  "/terms-and-conditions/",
  "/terms-and-conditions/transfers/",
  "/privacy-policy/",
  "/become-a-partner/",
  "/become-a-travel-agent/",
  "/become-an-affiliate/",
  "/maldives/",
  "/maldives/activities/",
  "/maldives/snorkeling/",
  "/maldives/excursions/",
  "/maldives/sandbank-tours/",
  "/maldives/water-sports/",
  "/maldives/island-hopping/",
  "/maldives/dolphin-whale-watching/",
  "/maldives/sightseeing/",
  "/maldives/attractions/",
  "/maldives/restaurants/",
  "/maldives/shops/",
  "/maldives/hospitals/",
  "/maldives/schools/",
  "/maldives/gyms/",
  "/maldives/atolls/",
  "/maldives/dive-sites/",
  "/maldives/diving/",
  "/maldives/fishing/",
  "/maldives/fishing/emperor/",
  "/maldives/fishing/gt-fishing/",
  "/maldives/fishing/tuna-fishing/",
  "/maldives/fishing/wahoo-fishing/",
  "/maldives/fishing/dogtooth-tuna/",
  "/maldives/fishing/mahi-mahi-fishing/",
  "/maldives/fishing/marlin-fishing/",
  "/maldives/fishing/sailfish-fishing/",
  "/maldives/fishing/popping/",
  "/maldives/fishing/jigging/",
  "/maldives/fishing/trolling/",
  "/maldives/fishing/fly-fishing/",
  "/maldives/fishing/big-game-fishing/",
  "/maldives/guesthouses/",
  "/maldives/hotels/",
  "/maldives/islands/",
  "/maldives/male-city-tour/",
  "/maldives/packages/",
  "/maldives/packages/luxury/",
  "/maldives/packages/family/",
  "/maldives/packages/adults-only/",
  "/maldives/packages/long-stay/",
  "/maldives/packages/budget/",
  "/maldives/packages/honeymoon/",
  "/maldives/packages/solo/",
  "/maldives/packages/diving/",
  "/maldives/packages/fishing/",
  "/maldives/packages/surfing/",
  "/maldives/packages/liveaboard/",
  "/maldives/providers/",
  "/maldives/resorts/",
  "/maldives/stays/",
  "/maldives/surf-breaks/",
  "/maldives/surfing/",
  "/maldives/transfers/",
  "/maldives/airport-transfers/",
  "/maldives/resort-transfers/",
  "/maldives/hotel-transfers/",
  "/maldives/island-transfers/",
  "/maldives/speedboat-transfers/",
  "/maldives-speedboats-charter/",
  "/maldives-ferry-schedule/",
  "/maldives/travel-guide/",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const url = (path: string) => `${siteUrl}${path}`;

  const [
    atolls,
    islands,
    accommodations,
    activities,
    attractions,
    diveSites,
    surfBreaks,
    packages,
    transferRoutes,
    articles,
    providers,
    speedboats,
    homepageLocales,
    maldivesHubLocales,
    packagesHubLocales,
    transfersHubLocales,
    fishingHubLocales,
    divingHubLocales,
    activitiesHubLocales,
  ] = await Promise.all([
    getAtolls(),
    fetchAllPages((page) => getIslands({ page, pageSize: PAGE_SIZE })),
    fetchAllPages((page) => getAccommodations({ page, pageSize: PAGE_SIZE })),
    fetchAllPages((page) => getActivities({ page, pageSize: PAGE_SIZE })),
    fetchAllPages((page) => getAttractions({ page, pageSize: PAGE_SIZE })),
    fetchAllPages((page) => getDiveSites({ page, pageSize: PAGE_SIZE })),
    fetchAllPages((page) => getSurfBreaks({ page, pageSize: PAGE_SIZE })),
    fetchAllPages((page) => getPackages({ page, pageSize: PAGE_SIZE })),
    fetchAllPages((page) => getTransferRoutes({ page, pageSize: PAGE_SIZE })),
    fetchAllPages((page) => getArticles({ page, pageSize: PAGE_SIZE })),
    fetchAllPages((page) => getProviders({ page, pageSize: PAGE_SIZE })),
    getSpeedboats(),
    // Task 19 follow-up: these three page_keys have published
    // translations today (the [locale] route tree 404s everything
    // else), so this is the entire locale-aware surface for now -- not
    // a placeholder for pages that don't exist yet.
    getPublishedLocalesForPage("homepage"),
    getPublishedLocalesForPage("maldives-hub"),
    getPublishedLocalesForPage("packages-hub"),
    getPublishedLocalesForPage("transfers-hub"),
    getPublishedLocalesForPage("fishing-hub"),
    getPublishedLocalesForPage("diving-hub"),
    getPublishedLocalesForPage("activities-hub"),
  ]);
  // Travel Guide hub is UI-strings-only (no page_translations row, see
  // src/app/[locale]/maldives/travel-guide/page.tsx) -- its "published"
  // set is simply every locale with real UI-strings copy, same as that
  // page's own generateMetadata. Missing from this sitemap entirely
  // until now (Task 22 follow-up).
  const travelGuideHubLocales: Locale[] = UI_STRINGS_LOCALES;

  const HUB_LOCALES_BY_PATH: Record<string, Locale[]> = {
    "/maldives/": maldivesHubLocales,
    "/maldives/packages/": packagesHubLocales,
    "/maldives/transfers/": transfersHubLocales,
    "/maldives/travel-guide/": travelGuideHubLocales,
    "/maldives/fishing/": fishingHubLocales,
    "/maldives/diving/": divingHubLocales,
    "/maldives/activities/": activitiesHubLocales,
    // UI-strings-only destination hubs, same "published = has real copy"
    // rule as the Travel Guide hub above.
    "/maldives/atolls/": DESTINATION_STRINGS_LOCALES,
    "/maldives/islands/": DESTINATION_STRINGS_LOCALES,
    "/maldives/dive-sites/": DESTINATION_STRINGS_LOCALES,
    "/maldives/attractions/": DESTINATION_STRINGS_LOCALES,
  };

  const entries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => {
    const isHomepage = path === "/";
    const isMaldivesHub = path === "/maldives/";
    const publishedLocales = isHomepage ? homepageLocales : HUB_LOCALES_BY_PATH[path] ?? [];
    return {
      url: url(path),
      changeFrequency: "weekly",
      priority: isHomepage || isMaldivesHub ? 1 : 0.6,
      ...(publishedLocales.length > 0 ? { alternates: { languages: hreflangAlternates(path, publishedLocales) } } : {}),
    };
  });

  // Reciprocal locale entries -- each published /{locale}/... page gets
  // its own sitemap row with the same hreflang set pointed back at it
  // (Task 19 §41/§48: alternates must be reciprocal, never one-directional).
  for (const locale of homepageLocales) {
    entries.push({ url: localizedCanonicalUrl(locale, "/"), changeFrequency: "weekly", priority: 0.9, alternates: { languages: hreflangAlternates("/", homepageLocales) } });
  }
  for (const locale of maldivesHubLocales) {
    entries.push({
      url: localizedCanonicalUrl(locale, "/maldives/"),
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: { languages: hreflangAlternates("/maldives/", maldivesHubLocales) },
    });
  }
  for (const [path, locales] of Object.entries(HUB_LOCALES_BY_PATH)) {
    if (path === "/maldives/") continue; // handled above at a higher priority
    for (const locale of locales) {
      entries.push({
        url: localizedCanonicalUrl(locale, path),
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: { languages: hreflangAlternates(path, locales) },
      });
    }
  }

  for (const a of accommodations) entries.push({ url: url(`/maldives/${ACCOMMODATION_TYPE_SEGMENT[a.accommodationType]}/${a.slug}/`), changeFrequency: "weekly", priority: 0.7 });
  // Only surfing activities are pushed here as plain entries -- fishing,
  // diving, and every other category (Task 22) are now translated and get
  // both their English entry AND reciprocal hreflang alternates from
  // pushLocalizedEntityEntries below instead; pushing them again here
  // would duplicate the English URL (Task 16 §30: never a duplicate).
  // Surfing has no translated route yet, so it stays exactly as before.
  for (const a of activities) if (a.activityCategory === "surfing") entries.push({ url: url(activityHref(a)), changeFrequency: "monthly", priority: 0.6 });
  for (const s of surfBreaks) entries.push({ url: url(`/maldives/surf-breaks/${s.slug}/`), changeFrequency: "monthly", priority: 0.5 });
  // Packages and transfer routes are NOT pushed here as plain entries --
  // pushLocalizedEntityEntries below already pushes the English entry
  // for every one of them (translated or not), plus reciprocal hreflang
  // alternates for the translated ones. Pushing them again here would
  // duplicate the English URL (Task 16 §30: never a duplicate). Demo
  // packages stay excluded from that call (getPackages() only ever
  // returns real DB packages — Task 21's demo package inventory is
  // `noindex,follow` and never presented as real commercial inventory).
  for (const b of speedboats) entries.push({ url: url(`/maldives-speedboats-charter/${b.slug}/`), changeFrequency: "monthly", priority: 0.5 });
  // Translated entities (Task 19 follow-up): each published translations
  // row gets its own sitemap entry at its real per-locale slug, with a
  // reciprocal hreflang set back to English and every other translated
  // locale -- mirrors the per-entity alternates already emitted by each
  // vertical's own detail-metadata.ts and [locale] route. Never a
  // shared-path pattern like hreflangAlternates() assumes, since each
  // locale's slug is genuinely different per entity. Shared across every
  // translated entity type (articles, packages, ...) so the hreflang-set
  // construction logic lives in exactly one place.
  function pushLocalizedEntityEntries(
    items: Array<{ id: string; slug: string; lastModified?: string | null }>,
    localeSlugsByEntityId: Map<string, Array<{ locale: Locale; slug: string }>>,
    pathPrefix: string,
    priority: number,
  ): void {
    for (const item of items) {
      const translations = localeSlugsByEntityId.get(item.id) ?? [];
      const englishPath = `${pathPrefix}${item.slug}/`;
      const languages: Record<string, string> | undefined =
        translations.length > 0
          ? (() => {
              const map: Record<string, string> = { en: url(englishPath) };
              for (const t of translations) map[t.locale] = url(localizeHubPath(t.locale, `${pathPrefix}${t.slug}/`));
              map["x-default"] = map.en;
              return map;
            })()
          : undefined;

      entries.push({
        url: url(englishPath),
        changeFrequency: "monthly",
        priority,
        lastModified: item.lastModified ?? undefined,
        ...(languages ? { alternates: { languages } } : {}),
      });
      for (const t of translations) {
        entries.push({
          url: url(localizeHubPath(t.locale, `${pathPrefix}${t.slug}/`)),
          changeFrequency: "monthly",
          priority,
          ...(languages ? { alternates: { languages } } : {}),
        });
      }
    }
  }

  const articleLocaleSlugs = await getEntityLocaleSlugsByIds(articles.map((a) => a.id));
  pushLocalizedEntityEntries(
    articles.map((a) => ({ id: a.id, slug: a.slug, lastModified: a.publishedAt })),
    articleLocaleSlugs,
    "/maldives/travel-guide/",
    0.6,
  );

  // Translated packages (demo packages excluded -- see the comment above
  // the plain packages loop; only real packages are ever translated).
  const packageLocaleSlugs = await getEntityLocaleSlugsByIds(packages.map((p) => p.id));
  pushLocalizedEntityEntries(packages, packageLocaleSlugs, "/maldives/packages/", 0.7);

  const transferRouteLocaleSlugs = await getEntityLocaleSlugsByIds(transferRoutes.map((t) => t.id));
  pushLocalizedEntityEntries(transferRoutes, transferRouteLocaleSlugs, "/maldives/transfers/", 0.6);

  // Activities: fishing and diving each keep their own dedicated URL
  // segment (same as the real English routes), everything except
  // surfing (not translated yet, still pushed as a plain entry above)
  // falls back to the shared /maldives/activities/ prefix -- mirrors
  // activityHref()'s own category routing in src/lib/activities/types.ts.
  const fishingActivities = activities.filter((a) => a.activityCategory === "fishing");
  const divingActivities = activities.filter((a) => a.activityCategory === "diving");
  const genericActivities = activities.filter((a) => a.activityCategory !== "fishing" && a.activityCategory !== "diving" && a.activityCategory !== "surfing");
  const activityLocaleSlugs = await getEntityLocaleSlugsByIds([...fishingActivities, ...divingActivities, ...genericActivities].map((a) => a.id));
  pushLocalizedEntityEntries(fishingActivities, activityLocaleSlugs, "/maldives/fishing/", 0.6);
  pushLocalizedEntityEntries(divingActivities, activityLocaleSlugs, "/maldives/diving/", 0.6);
  pushLocalizedEntityEntries(genericActivities, activityLocaleSlugs, "/maldives/activities/", 0.5);

  // Destinations (atolls, islands, dive sites, attractions) are all
  // translated too -- English entry plus reciprocal hreflang from the same
  // helper, so (as with activities above) they're no longer pushed as
  // plain entries earlier in this function.
  const destinationLocaleSlugs = await getEntityLocaleSlugsByIds([...atolls, ...islands, ...diveSites, ...attractions].map((d) => d.id));
  pushLocalizedEntityEntries(atolls, destinationLocaleSlugs, "/maldives/atolls/", 0.7);
  pushLocalizedEntityEntries(islands, destinationLocaleSlugs, "/maldives/islands/", 0.6);
  pushLocalizedEntityEntries(diveSites, destinationLocaleSlugs, "/maldives/dive-sites/", 0.5);
  pushLocalizedEntityEntries(attractions, destinationLocaleSlugs, "/maldives/attractions/", 0.5);

  for (const p of providers) entries.push({ url: url(`/maldives/providers/${p.slug}/`), changeFrequency: "monthly", priority: 0.4 });

  // Curated accommodation SEO landing pages (e.g. /maldives/resorts/luxury/)
  // — included only when their own live result count still clears the
  // spec's minResults bar, the exact same check accommodationSeoLandingMetadata()
  // uses for robots/index, so the sitemap and the page's own noindex can
  // never disagree (see src/lib/accommodations/seo-landing-content.ts).
  const landingSpecs = getAllAccommodationSeoLandingSpecs();
  const landingResults = await Promise.all(landingSpecs.map(({ spec }) => getAccommodationSeoLandingResults(spec)));
  landingSpecs.forEach(({ type, spec }, i) => {
    if (!landingResults[i].meetsThreshold) return;
    entries.push({ url: url(`/maldives/${ACCOMMODATION_TYPE_SEGMENT[type]}/${spec.slug}/`), changeFrequency: "weekly", priority: 0.7 });
  });

  return entries;
}
