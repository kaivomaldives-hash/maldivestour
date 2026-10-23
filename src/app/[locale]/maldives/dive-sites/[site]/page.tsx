import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { RegisterEntityLocaleLinks } from "@/components/i18n/entity-locale-links-context";
import { LocalizedLinkPills, LocalizedPlaceGrid } from "@/components/i18n/localized-place-grid";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { MediaImage } from "@/components/ui/media-image";
import { PageHero } from "@/components/ui/page-hero";
import { getDiveSitesByAtoll, getDivingActivitiesAtSite, getTranslatedDiveSiteBySlug } from "@/lib/diving/repository";
import { fill, getDestinationStrings, labelFor } from "@/lib/i18n/destination-strings";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { localizeHubPath } from "@/lib/i18n/hub-paths";
import { entityHreflangLanguages, getEntityLocalePaths, localizeCards } from "@/lib/i18n/repository";
import { getUiStrings } from "@/lib/i18n/ui-strings";
import { getMediaForNode } from "@/lib/media/repository";
import { breadcrumbJsonLd, canonicalUrl, safeJsonLdStringify } from "@/lib/seo/site";

// Staggered (not a round 3600) so ISR regenerations don't cluster with
// every other route's -- see src/app/page.tsx for why.
export const revalidate = 4260;

interface Params {
  locale: string;
  site: string;
}

/**
 * Localized equivalent of src/components/diving/dive-site-detail-page.tsx
 * -- translated title/summary and localized fact labels; the free-text
 * conditions/marine-life notes have no translated field yet, so they are
 * shown as the real English text, marked lang="en" (never machine-faked
 * into the page language). Diving trips at this site link to their own
 * translated /diving/ pages.
 */
async function loadOrNotFound(locale: string, slug: string) {
  if (!isLocale(locale) || locale === "en") notFound();
  const site = await getTranslatedDiveSiteBySlug(locale, slug);
  if (!site) notFound();
  return { locale: locale as Locale, site };
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, site: slug } = await params;
  if (!isLocale(locale) || locale === "en") return {};
  const site = await getTranslatedDiveSiteBySlug(locale, slug);
  if (!site) return {};

  const title = `${site.title} | ${getDestinationStrings(locale).diveSitesHub.title} | MTG`;
  const description = site.summary ?? undefined;
  const url = canonicalUrl(localizeHubPath(locale, `/maldives/dive-sites/${site.slug}/`));
  const languages = await entityHreflangLanguages(site.id, site.englishSlug, "/maldives/dive-sites/");

  return {
    title,
    description,
    alternates: { canonical: url, languages },
    openGraph: { title, description, url },
  };
}

export default async function LocaleDiveSitePage({ params }: { params: Promise<Params> }) {
  const { locale: rawLocale, site: slug } = await params;
  const { locale, site } = await loadOrNotFound(rawLocale, slug);
  const ui = getUiStrings(locale);
  const s = getDestinationStrings(locale);
  const d = s.detail;

  const [activities, mediaItems, sitesInAtoll, localePaths] = await Promise.all([
    getDivingActivitiesAtSite(site.id),
    getMediaForNode(site.id),
    site.atoll ? getDiveSitesByAtoll(site.atoll.id) : Promise.resolve([]),
    getEntityLocalePaths(site.id, site.englishSlug, "/maldives/dive-sites/"),
  ]);
  const galleryImages = mediaItems.filter((m) => m.role === "gallery").map((m) => m.asset);
  const nearbySites = sitesInAtoll.filter((other) => other.id !== site.id).slice(0, 3);
  const [atollCards, islandCards, activityCards, nearbyCards] = await Promise.all([
    site.atoll ? localizeCards(locale, [site.atoll], "/maldives/atolls/") : Promise.resolve(new Map()),
    site.nearbyIsland ? localizeCards(locale, [site.nearbyIsland], "/maldives/islands/") : Promise.resolve(new Map()),
    localizeCards(locale, activities, "/maldives/diving/"),
    localizeCards(locale, nearbySites, "/maldives/dive-sites/"),
  ]);
  const atollCard = site.atoll ? atollCards.get(site.atoll.id) : undefined;
  const islandCard = site.nearbyIsland ? islandCards.get(site.nearbyIsland.id) : undefined;
  const siteTypeById = new Map(nearbySites.map((other) => [other.id, labelFor(s.siteTypes, other.siteType)]));

  const breadcrumbs = [
    { label: ui.nav.maldives, href: localizeHubPath(locale, "/maldives/") },
    { label: s.nav.diveSites, href: localizeHubPath(locale, "/maldives/dive-sites/") },
    { label: site.title },
  ];
  const depth =
    site.depthMinMeters !== null && site.depthMaxMeters !== null
      ? `${site.depthMinMeters}–${site.depthMaxMeters} m`
      : site.depthMinMeters !== null || site.depthMaxMeters !== null
        ? `${site.depthMinMeters ?? site.depthMaxMeters} m`
        : null;

  return (
    <main>
      <RegisterEntityLocaleLinks paths={localePaths} fallbackHubPath="/maldives/dive-sites/" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(breadcrumbJsonLd(breadcrumbs, localizeHubPath(locale, `/maldives/dive-sites/${site.slug}`))) }}
      />

      <PageHero breadcrumbs={breadcrumbs} eyebrow={d.diveSiteEyebrow} title={site.title} description={site.summary ?? undefined} image={site.heroImage} />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
        <p className="text-xs uppercase tracking-wide text-neutral-500">{d.diveSiteNote}</p>

        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
          {site.siteType && (
            <div>
              <dt className="text-neutral-500">{d.siteType}</dt>
              <dd className="font-medium">{labelFor(s.siteTypes, site.siteType)}</dd>
            </div>
          )}
          {depth && (
            <div>
              <dt className="text-neutral-500">{d.depth}</dt>
              <dd className="font-medium">{depth}</dd>
            </div>
          )}
          {site.experienceLevel && (
            <div>
              <dt className="text-neutral-500">{d.experienceLevel}</dt>
              <dd className="font-medium">{labelFor(s.experienceLevels, site.experienceLevel)}</dd>
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
          {islandCard && (
            <div>
              <dt className="text-neutral-500">{d.nearbyIsland}</dt>
              <dd className="font-medium">
                <Link href={islandCard.href} className="hover:underline">
                  {islandCard.title}
                </Link>
              </dd>
            </div>
          )}
        </dl>

        {(site.currentNotes || site.marineLifeNotes) && (
          <dl className="mt-6 space-y-4 text-sm">
            {site.currentNotes && (
              <div>
                <dt className="text-neutral-500">{d.conditions}</dt>
                <dd className="mt-1" lang="en">
                  {site.currentNotes}
                </dd>
              </div>
            )}
            {site.marineLifeNotes && (
              <div>
                <dt className="text-neutral-500">{d.marineLife}</dt>
                <dd className="mt-1" lang="en">
                  {site.marineLifeNotes}
                </dd>
              </div>
            )}
            <p className="text-xs text-neutral-500">{d.englishOnlyNote}</p>
          </dl>
        )}

        {galleryImages.length > 0 && (
          <div className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {galleryImages.map((asset) => (
              <MediaImage key={asset.id} asset={asset} alt={site.title} aspectClassName="aspect-[4/3]" />
            ))}
          </div>
        )}

        <LocalizedPlaceGrid title={ui.nav.diving} items={activities} cards={activityCards} />
        <LocalizedPlaceGrid
          title={fill(d.moreDiveSitesIn, atollCard?.title ?? s.nav.diveSites)}
          items={nearbySites}
          cards={nearbyCards}
          subtitleFor={(id) => siteTypeById.get(id) ?? null}
        />

        <LocalizedLinkPills
          title={d.exploreMoreTitle}
          links={[
            { href: localizeHubPath(locale, "/maldives/dive-sites/"), label: s.nav.diveSites },
            { href: localizeHubPath(locale, "/maldives/diving/"), label: ui.nav.diving },
            ...(atollCard ? [{ href: atollCard.href, label: atollCard.title }] : []),
            { href: localizeHubPath(locale, "/maldives/packages/"), label: ui.nav.packages },
            { href: `/maldives/dive-sites/${site.englishSlug}/`, label: d.englishVersionLink },
          ]}
        />
      </div>
    </main>
  );
}
