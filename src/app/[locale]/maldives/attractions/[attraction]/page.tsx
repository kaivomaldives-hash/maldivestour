import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { RegisterEntityLocaleLinks } from "@/components/i18n/entity-locale-links-context";
import { LocalizedLinkPills, LocalizedPlaceGrid } from "@/components/i18n/localized-place-grid";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { MediaImage } from "@/components/ui/media-image";
import { PageHero } from "@/components/ui/page-hero";
import { getActivitiesByAtoll, getActivitiesByLocation } from "@/lib/activities/repository";
import { getTranslatedAttractionBySlug } from "@/lib/attractions/repository";
import { getDestinationStrings, labelFor } from "@/lib/i18n/destination-strings";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { localizeHubPath } from "@/lib/i18n/hub-paths";
import { entityHreflangLanguages, getEntityLocalePaths, localizeCards } from "@/lib/i18n/repository";
import { getUiStrings } from "@/lib/i18n/ui-strings";
import { getMediaForNode } from "@/lib/media/repository";
import { breadcrumbJsonLd, canonicalUrl, safeJsonLdStringify } from "@/lib/seo/site";

// Staggered (not a round 3600) so ISR regenerations don't cluster with
// every other route's -- see src/app/page.tsx for why.
export const revalidate = 4220;

const ACTIVITY_SEGMENT: Record<string, string> = { fishing: "/maldives/fishing/", diving: "/maldives/diving/" };

interface Params {
  locale: string;
  attraction: string;
}

/**
 * Localized equivalent of src/components/attractions/attraction-detail-page.tsx
 * -- translated title, summary AND body (attractions are the one
 * destination type whose prose is translated in full, see
 * getTranslatedAttractionBySlug), localized fact labels, and nearby
 * activities linked to their own translated pages. Surfing trips have no
 * translated route yet, so they're left out rather than linked in English.
 */
async function loadOrNotFound(locale: string, slug: string) {
  if (!isLocale(locale) || locale === "en") notFound();
  const attraction = await getTranslatedAttractionBySlug(locale, slug);
  if (!attraction) notFound();
  return { locale: locale as Locale, attraction };
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, attraction: slug } = await params;
  if (!isLocale(locale) || locale === "en") return {};
  const attraction = await getTranslatedAttractionBySlug(locale, slug);
  if (!attraction) return {};

  const title = `${attraction.title} | ${getDestinationStrings(locale).attractionsHub.title} | MTG`;
  const description = attraction.summary ?? undefined;
  const url = canonicalUrl(localizeHubPath(locale, `/maldives/attractions/${attraction.slug}/`));
  const languages = await entityHreflangLanguages(attraction.id, attraction.englishSlug, "/maldives/attractions/");

  return {
    title,
    description,
    alternates: { canonical: url, languages },
    openGraph: { title, description, url },
  };
}

export default async function LocaleAttractionPage({ params }: { params: Promise<Params> }) {
  const { locale: rawLocale, attraction: slug } = await params;
  const { locale, attraction } = await loadOrNotFound(rawLocale, slug);
  const ui = getUiStrings(locale);
  const s = getDestinationStrings(locale);
  const d = s.detail;

  const [activities, mediaItems, localePaths] = await Promise.all([
    attraction.island ? getActivitiesByLocation(attraction.island.id) : attraction.atoll ? getActivitiesByAtoll(attraction.atoll.id) : Promise.resolve([]),
    getMediaForNode(attraction.id),
    getEntityLocalePaths(attraction.id, attraction.englishSlug, "/maldives/attractions/"),
  ]);
  const galleryImages = mediaItems.filter((m) => m.role === "gallery").map((m) => m.asset);
  const nearbyActivities = activities.filter((a) => a.activityCategory !== "surfing").slice(0, 6);
  const [islandCards, atollCards, activityCardMaps] = await Promise.all([
    attraction.island ? localizeCards(locale, [attraction.island], "/maldives/islands/") : Promise.resolve(new Map()),
    attraction.atoll ? localizeCards(locale, [attraction.atoll], "/maldives/atolls/") : Promise.resolve(new Map()),
    Promise.all(nearbyActivities.map((a) => localizeCards(locale, [a], ACTIVITY_SEGMENT[a.activityCategory ?? ""] ?? "/maldives/activities/"))),
  ]);
  const activityCards = new Map(activityCardMaps.flatMap((m) => Array.from(m.entries())));
  const islandCard = attraction.island ? islandCards.get(attraction.island.id) : undefined;
  const atollCard = attraction.atoll ? atollCards.get(attraction.atoll.id) : undefined;

  const breadcrumbs = [
    { label: ui.nav.maldives, href: localizeHubPath(locale, "/maldives/") },
    { label: s.nav.attractions, href: localizeHubPath(locale, "/maldives/attractions/") },
    { label: attraction.title },
  ];

  return (
    <main>
      <RegisterEntityLocaleLinks paths={localePaths} fallbackHubPath="/maldives/attractions/" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(breadcrumbJsonLd(breadcrumbs, localizeHubPath(locale, `/maldives/attractions/${attraction.slug}`))) }}
      />

      <PageHero breadcrumbs={breadcrumbs} eyebrow={d.attractionEyebrow} title={attraction.title} description={attraction.summary ?? undefined} image={attraction.heroImage} />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
        <p className="text-xs uppercase tracking-wide text-neutral-500">{d.attractionNote}</p>

        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
          {attraction.attractionType && (
            <div>
              <dt className="text-neutral-500">{d.type}</dt>
              <dd className="font-medium">{labelFor(s.attractionTypes, attraction.attractionType)}</dd>
            </div>
          )}
          {islandCard && (
            <div>
              <dt className="text-neutral-500">{d.island}</dt>
              <dd className="font-medium">
                <Link href={islandCard.href} className="hover:underline">
                  {islandCard.title}
                </Link>
              </dd>
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

        {attraction.body && (
          <section className="mt-6 max-w-none text-sm leading-relaxed text-neutral-700" lang={attraction.bodyIsTranslated ? undefined : "en"}>
            <p>{attraction.body}</p>
            {!attraction.bodyIsTranslated && <p className="mt-2 text-xs text-neutral-500">{d.englishOnlyNote}</p>}
          </section>
        )}

        {galleryImages.length > 0 && (
          <div className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {galleryImages.map((asset) => (
              <MediaImage key={asset.id} asset={asset} alt={attraction.title} aspectClassName="aspect-[4/3]" />
            ))}
          </div>
        )}

        <LocalizedPlaceGrid title={ui.nav.activities} items={nearbyActivities} cards={activityCards} />

        <LocalizedLinkPills
          title={d.exploreMoreTitle}
          links={[
            { href: localizeHubPath(locale, "/maldives/attractions/"), label: s.nav.attractions },
            ...(islandCard ? [{ href: islandCard.href, label: islandCard.title }] : []),
            { href: localizeHubPath(locale, "/maldives/activities/"), label: ui.nav.activities },
            { href: localizeHubPath(locale, "/maldives/transfers/"), label: ui.nav.transfers },
            { href: `/maldives/attractions/${attraction.englishSlug}/`, label: d.englishVersionLink },
          ]}
        />
      </div>
    </main>
  );
}
