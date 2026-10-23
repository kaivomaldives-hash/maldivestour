import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { RegisterEntityLocaleLinks } from "@/components/i18n/entity-locale-links-context";
import { LocalizedLinkPills, LocalizedPlaceGrid } from "@/components/i18n/localized-place-grid";
import { LocationMap } from "@/components/locations/location-map";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { getAttractionsByIsland } from "@/lib/attractions/repository";
import { getDiveSitesByLocation } from "@/lib/diving/repository";
import { fill, getDestinationStrings, labelFor } from "@/lib/i18n/destination-strings";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { localizeHubPath } from "@/lib/i18n/hub-paths";
import { entityHreflangLanguages, getEntityLocalePaths, localizeCards } from "@/lib/i18n/repository";
import { getUiStrings } from "@/lib/i18n/ui-strings";
import { getNearbyIslands } from "@/lib/locations/nearby-islands";
import { getIslandContent, getLocationSummaryById, getTranslatedIslandBySlug } from "@/lib/locations/repository";
import { breadcrumbJsonLd, canonicalUrl, safeJsonLdStringify } from "@/lib/seo/site";

// Staggered (not a round 3600) so ISR regenerations don't cluster with
// every other route's -- see src/app/page.tsx for why.
export const revalidate = 4180;

const NEARBY_ISLANDS_LIMIT = 6;

interface Params {
  locale: string;
  island: string;
}

/**
 * Localized equivalent of src/components/locations/island-detail-page.tsx,
 * in simplified form -- same convention as the localized atoll page (see
 * src/app/[locale]/maldives/atolls/[atoll]/page.tsx): translated
 * title/summary, real structural facts, and only the destination
 * listings that have translated routes of their own (attractions, dive
 * sites, nearby islands). The English guide prose, stays/activities/
 * transfers and submission forms stay on the English page (linked).
 */
async function loadOrNotFound(locale: string, slug: string) {
  if (!isLocale(locale) || locale === "en") notFound();
  const island = await getTranslatedIslandBySlug(locale, slug);
  if (!island) notFound();
  return { locale: locale as Locale, island };
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, island: slug } = await params;
  if (!isLocale(locale) || locale === "en") return {};
  const island = await getTranslatedIslandBySlug(locale, slug);
  if (!island) return {};

  const title = island.metaTitle ?? island.title;
  const description = island.metaDescription ?? island.summary ?? undefined;
  const url = canonicalUrl(localizeHubPath(locale, `/maldives/islands/${island.slug}/`));
  const languages = await entityHreflangLanguages(island.id, island.englishSlug, "/maldives/islands/");

  return {
    title,
    description,
    alternates: { canonical: url, languages },
    openGraph: { title, description, url },
  };
}

export default async function LocaleIslandPage({ params }: { params: Promise<Params> }) {
  const { locale: rawLocale, island: slug } = await params;
  const { locale, island } = await loadOrNotFound(rawLocale, slug);
  const ui = getUiStrings(locale);
  const s = getDestinationStrings(locale);
  const d = s.detail;

  const [atoll, attractions, diveSites, content, localePaths] = await Promise.all([
    island.parentId ? getLocationSummaryById(island.parentId) : Promise.resolve(null),
    getAttractionsByIsland(island.id),
    getDiveSitesByLocation(island.id),
    getIslandContent(island.id),
    getEntityLocalePaths(island.id, island.englishSlug, "/maldives/islands/"),
  ]);
  const nearbyIslands = await getNearbyIslands({ id: island.id, parentId: island.parentId }, content?.nearbyIslandSlugs ?? [], NEARBY_ISLANDS_LIMIT);
  const [atollCards, attractionCards, diveSiteCards, nearbyCards] = await Promise.all([
    atoll ? localizeCards(locale, [atoll], "/maldives/atolls/") : Promise.resolve(new Map()),
    localizeCards(locale, attractions, "/maldives/attractions/"),
    localizeCards(locale, diveSites, "/maldives/dive-sites/"),
    localizeCards(locale, nearbyIslands, "/maldives/islands/"),
  ]);
  const atollCard = atoll ? atollCards.get(atoll.id) : undefined;
  const siteTypeById = new Map(diveSites.map((site) => [site.id, labelFor(s.siteTypes, site.siteType)]));
  const attractionTypeById = new Map(attractions.map((a) => [a.id, labelFor(s.attractionTypes, a.attractionType)]));

  const breadcrumbs = [
    { label: ui.nav.maldives, href: localizeHubPath(locale, "/maldives/") },
    { label: s.nav.islands, href: localizeHubPath(locale, "/maldives/islands/") },
    ...(atollCard ? [{ label: atollCard.title, href: atollCard.href }] : []),
    { label: island.title },
  ];

  return (
    <main>
      <RegisterEntityLocaleLinks paths={localePaths} fallbackHubPath="/maldives/islands/" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(breadcrumbJsonLd(breadcrumbs, localizeHubPath(locale, `/maldives/islands/${island.slug}`))) }}
      />

      <PageHero breadcrumbs={breadcrumbs} eyebrow={d.islandEyebrow} title={island.title} description={island.summary ?? undefined} image={island.heroImage} />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
        <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
          {island.isInhabited !== null && (
            <div>
              <dt className="text-neutral-500">{d.inhabited}</dt>
              <dd className="font-medium">{island.isInhabited ? d.yes : d.no}</dd>
            </div>
          )}
          {atollCard && (
            <div>
              <dt className="text-neutral-500">{d.atoll}</dt>
              <dd className="font-medium">
                <Link href={atollCard.href} className="hover:underline">
                  {atollCard.title}
                </Link>
              </dd>
            </div>
          )}
        </dl>

        <LocationMap title={island.title} lat={island.lat} lng={island.lng} heading={fill(d.mapHeading, island.title)} intro={d.mapIntro} />

        <LocalizedPlaceGrid
          title={fill(d.attractionsOn, island.title)}
          items={attractions}
          cards={attractionCards}
          subtitleFor={(id) => attractionTypeById.get(id) ?? null}
          showSummary
        />
        <LocalizedPlaceGrid title={fill(d.diveSitesNear, island.title)} items={diveSites} cards={diveSiteCards} subtitleFor={(id) => siteTypeById.get(id) ?? null} />
        <LocalizedPlaceGrid title={d.nearbyIslands} items={nearbyIslands} cards={nearbyCards} showSummary className="mt-12 border-t border-neutral-200 pt-10" />

        {atollCard && (
          <p className="mt-10 text-sm text-neutral-600">
            <Link href={atollCard.href} className="font-medium text-maldives-600 hover:underline">
              {fill(d.exploreAllOf, atollCard.title)}
            </Link>
          </p>
        )}

        <LocalizedLinkPills
          title={d.exploreMoreTitle}
          links={[
            { href: localizeHubPath(locale, "/maldives/islands/"), label: s.nav.islands },
            { href: localizeHubPath(locale, "/maldives/atolls/"), label: s.nav.atolls },
            { href: localizeHubPath(locale, "/maldives/activities/"), label: ui.nav.activities },
            { href: localizeHubPath(locale, "/maldives/transfers/"), label: ui.nav.transfers },
            { href: `/maldives/islands/${island.englishSlug}/`, label: d.englishVersionLink },
          ]}
        />
      </div>
    </main>
  );
}
