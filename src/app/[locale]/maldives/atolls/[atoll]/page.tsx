import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RegisterEntityLocaleLinks } from "@/components/i18n/entity-locale-links-context";
import { LocalizedLinkPills, LocalizedPlaceGrid } from "@/components/i18n/localized-place-grid";
import { LocationMap } from "@/components/locations/location-map";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { getAttractionsByAtoll } from "@/lib/attractions/repository";
import { getDiveSitesByAtoll } from "@/lib/diving/repository";
import { fill, getDestinationStrings, labelFor } from "@/lib/i18n/destination-strings";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { localizeHubPath } from "@/lib/i18n/hub-paths";
import { entityHreflangLanguages, getEntityLocalePaths, localizeCards } from "@/lib/i18n/repository";
import { getUiStrings } from "@/lib/i18n/ui-strings";
import { getIslandsByAtollId, getTranslatedAtollBySlug } from "@/lib/locations/repository";
import { breadcrumbJsonLd, canonicalUrl, safeJsonLdStringify } from "@/lib/seo/site";

// Staggered (not a round 3600) so ISR regenerations don't cluster with
// every other route's -- see src/app/page.tsx for why.
export const revalidate = 4060;

interface Params {
  locale: string;
  atoll: string;
}

/**
 * Localized equivalent of src/components/locations/atoll-detail-page.tsx,
 * in simplified form -- same convention as the localized diving/fishing
 * detail pages: only title/summary translated, structural facts kept as
 * real data, and the listings limited to the destination entities that
 * have translated routes of their own (islands, dive sites, attractions),
 * each linking to its translated page. The English page's long-form
 * "About" guide, stays/activities/transfers grids and the photo/place
 * submission forms stay English-only (linked below).
 */
async function loadOrNotFound(locale: string, slug: string) {
  if (!isLocale(locale) || locale === "en") notFound();
  const atoll = await getTranslatedAtollBySlug(locale, slug);
  if (!atoll) notFound();
  return { locale: locale as Locale, atoll };
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, atoll: slug } = await params;
  if (!isLocale(locale) || locale === "en") return {};
  const atoll = await getTranslatedAtollBySlug(locale, slug);
  if (!atoll) return {};

  const title = atoll.metaTitle ?? atoll.title;
  const description = atoll.metaDescription ?? atoll.summary ?? undefined;
  const url = canonicalUrl(localizeHubPath(locale, `/maldives/atolls/${atoll.slug}/`));
  const languages = await entityHreflangLanguages(atoll.id, atoll.englishSlug, "/maldives/atolls/");

  return {
    title,
    description,
    alternates: { canonical: url, languages },
    openGraph: { title, description, url },
  };
}

export default async function LocaleAtollPage({ params }: { params: Promise<Params> }) {
  const { locale: rawLocale, atoll: slug } = await params;
  const { locale, atoll } = await loadOrNotFound(rawLocale, slug);
  const ui = getUiStrings(locale);
  const s = getDestinationStrings(locale);
  const d = s.detail;

  const [allIslands, diveSites, attractions, localePaths] = await Promise.all([
    getIslandsByAtollId(atoll.id),
    getDiveSitesByAtoll(atoll.id),
    getAttractionsByAtoll(atoll.id),
    getEntityLocalePaths(atoll.id, atoll.englishSlug, "/maldives/atolls/"),
  ]);
  // Same inhabited-only split as the English page: resort islands are
  // listed through their resorts, not as "islands of this atoll".
  const islands = allIslands.filter((island) => island.isInhabited !== false);
  const [islandCards, diveSiteCards, attractionCards] = await Promise.all([
    localizeCards(locale, islands, "/maldives/islands/"),
    localizeCards(locale, diveSites, "/maldives/dive-sites/"),
    localizeCards(locale, attractions, "/maldives/attractions/"),
  ]);
  const siteTypeById = new Map(diveSites.map((site) => [site.id, labelFor(s.siteTypes, site.siteType)]));
  const attractionTypeById = new Map(attractions.map((a) => [a.id, labelFor(s.attractionTypes, a.attractionType)]));

  const breadcrumbs = [
    { label: ui.nav.maldives, href: localizeHubPath(locale, "/maldives/") },
    { label: s.nav.atolls, href: localizeHubPath(locale, "/maldives/atolls/") },
    { label: atoll.title },
  ];

  return (
    <main>
      <RegisterEntityLocaleLinks paths={localePaths} fallbackHubPath="/maldives/atolls/" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(breadcrumbJsonLd(breadcrumbs, localizeHubPath(locale, `/maldives/atolls/${atoll.slug}`))) }}
      />

      <PageHero
        breadcrumbs={breadcrumbs}
        eyebrow={atoll.englishSlug === "male-city" ? d.capitalCityEyebrow : d.atollEyebrow}
        title={atoll.title}
        description={atoll.summary ?? undefined}
        image={atoll.heroImage}
      />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
        <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
          {atoll.administrativeCode && (
            <div>
              <dt className="text-neutral-500">{d.administrativeCode}</dt>
              <dd className="font-medium">{atoll.administrativeCode}</dd>
            </div>
          )}
          <div>
            <dt className="text-neutral-500">{d.inhabitedIslands}</dt>
            <dd className="font-medium">{islands.length}</dd>
          </div>
        </dl>

        <LocationMap title={atoll.title} lat={atoll.lat} lng={atoll.lng} heading={fill(d.mapHeading, atoll.title)} intro={d.mapIntro} />

        <LocalizedPlaceGrid title={fill(d.islandsIn, atoll.title)} items={islands} cards={islandCards} />
        <LocalizedPlaceGrid
          title={fill(d.attractionsIn, atoll.title)}
          items={attractions}
          cards={attractionCards}
          subtitleFor={(id) => attractionTypeById.get(id) ?? null}
          showSummary
        />
        <LocalizedPlaceGrid title={fill(d.diveSitesIn, atoll.title)} items={diveSites} cards={diveSiteCards} subtitleFor={(id) => siteTypeById.get(id) ?? null} />

        <LocalizedLinkPills
          title={d.exploreMoreTitle}
          links={[
            { href: localizeHubPath(locale, "/maldives/atolls/"), label: s.nav.atolls },
            { href: localizeHubPath(locale, "/maldives/islands/"), label: s.nav.islands },
            { href: localizeHubPath(locale, "/maldives/diving/"), label: ui.nav.diving },
            { href: localizeHubPath(locale, "/maldives/packages/"), label: ui.nav.packages },
            { href: `/maldives/atolls/${atoll.englishSlug}/`, label: d.englishVersionLink },
          ]}
        />
      </div>
    </main>
  );
}
