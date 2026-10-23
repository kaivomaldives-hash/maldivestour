import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { WhereToStaySection } from "@/components/accommodation/where-to-stay-section";
import { NodeInquiryToggle } from "@/components/bookings/node-inquiry-toggle";
import { ActivityQuickFacts } from "@/components/activity/activity-quick-facts";
import { RegisterEntityLocaleLinks } from "@/components/i18n/entity-locale-links-context";
import { LocalizedEmperorPage, localizedEmperorMetadata } from "@/components/i18n/localized-emperor-page";
import {
  LocalizedFishingSpeciesPage,
  localizedFishingSpeciesMetadata,
  LocalizedFishingTechniquePage,
  localizedFishingTechniqueMetadata,
} from "@/components/i18n/localized-fishing-landing-page";
import { PackageCard } from "@/components/packages/package-card";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { MediaImage } from "@/components/ui/media-image";
import { PageHero } from "@/components/ui/page-hero";
import { getNearbyAccommodations } from "@/lib/accommodations/repository";
import { bookingCta } from "@/lib/bookings/copy";
import { getTranslatedActivityViewBySlug } from "@/lib/activities/repository";
import { getFishingActivitiesByLocation } from "@/lib/fishing/repository";
import { getFishingPagesStrings, isFishingSpeciesPageSlug, isFishingTechniquePageSlug } from "@/lib/i18n/fishing-pages";
import { getChromeStrings } from "@/lib/i18n/chrome-strings";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { localizeHubPath } from "@/lib/i18n/hub-paths";
import { getEntityLocalePaths, localizedEntityHref } from "@/lib/i18n/repository";
import { getUiStrings } from "@/lib/i18n/ui-strings";
import { getLinkLocalizer } from "@/lib/i18n/link-localizer";
import { getPackageViewsByActivity } from "@/lib/packages/view-repository";
import { breadcrumbJsonLd, canonicalUrl, safeJsonLdStringify } from "@/lib/seo/site";
import { createClient } from "@/lib/supabase/public";

// Staggered (not a round 3600) so ISR regenerations don't cluster with
// every other route's -- see src/app/page.tsx for why.
export const revalidate = 4330;

interface Params {
  locale: string;
  activity: string;
}

/**
 * Localized equivalent of src/app/maldives/fishing/[activity]/page.tsx
 * (and fishing-detail-page.tsx). `activity` here is the *translated*
 * slug (translations.slug), resolved via getTranslatedActivityViewBySlug
 * -- never the canonical English slug. Deliberately simpler than the
 * English page: only title/summary are translated, so the quick facts,
 * booking CTA labels, and "other trips"/"packages featuring" lists
 * stay as real English data/labels, same convention as every other
 * partially-translated vertical. 404s if the resolved entity isn't
 * actually a fishing-category activity (mirrors the English
 * getFishingActivityBySlug's own category check).
 */
function formatDuration(minutes: number | null, locale: Locale): string | null {
  if (!minutes) return null;
  const units = getChromeStrings(locale);
  if (minutes < 60) return units.minutes.replace("{n}", String(minutes));
  const hours = minutes / 60;
  return units.hours.replace("{n}", Number.isInteger(hours) ? String(hours) : hours.toFixed(1));
}

async function getEnglishSlug(entityId: string): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("nodes").select("slug").eq("id", entityId).maybeSingle<{ slug: string }>();
  return data?.slug ?? null;
}

async function loadOrNotFound(locale: string, slug: string) {
  if (!isLocale(locale) || locale === "en") notFound();
  const activity = await getTranslatedActivityViewBySlug(locale, slug);
  if (!activity || activity.activityCategory !== "fishing") notFound();
  return { locale: locale as Locale, activity };
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, activity: slug } = await params;
  if (!isLocale(locale) || locale === "en") return {};
  if (slug === "emperor") return localizedEmperorMetadata(locale);
  if (isFishingSpeciesPageSlug(slug)) return localizedFishingSpeciesMetadata(locale, slug);
  if (isFishingTechniquePageSlug(slug)) return localizedFishingTechniqueMetadata(locale, slug);
  const activity = await getTranslatedActivityViewBySlug(locale, slug);
  if (!activity || activity.activityCategory !== "fishing") return {};

  const title = activity.title;
  const description = activity.summary ?? undefined;
  const url = localizeHubPath(locale, `/maldives/fishing/${activity.slug}/`);
  const englishSlug = (await getEnglishSlug(activity.id)) ?? activity.slug;
  const paths = await getEntityLocalePaths(activity.id, englishSlug, "/maldives/fishing/");
  const languages: Record<string, string> = {};
  for (const [loc, path] of Object.entries(paths)) languages[loc] = canonicalUrl(path);
  languages["x-default"] = languages.en;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl(url), languages },
    openGraph: { title, description, url: canonicalUrl(url) },
  };
}

export default async function LocaleFishingDetailPage({ params }: { params: Promise<Params> }) {
  const { locale: rawLocale, activity: slug } = await params;
  // Species/technique pages share this URL space: next.config.ts rewrites
  // their translated URLs (e.g. /de/malediven/angeln/gt-angeln/) to the
  // English page slug here -- see src/lib/i18n/localized-leaf-pages.json.
  if (isLocale(rawLocale) && rawLocale !== "en" && getFishingPagesStrings(rawLocale)) {
    if (slug === "emperor") return <LocalizedEmperorPage locale={rawLocale} />;
    if (isFishingSpeciesPageSlug(slug)) return <LocalizedFishingSpeciesPage locale={rawLocale} slug={slug} />;
    if (isFishingTechniquePageSlug(slug)) return <LocalizedFishingTechniquePage locale={rawLocale} slug={slug} />;
  }
  const { locale, activity } = await loadOrNotFound(rawLocale, slug);
  const ui = getUiStrings(locale);
  const d = ui.activityDetail;

  const { primaryLocation, atoll } = activity;
  const duration = formatDuration(activity.durationMinutes, locale);

  const [sameIslandTrips, packages, nearbyStays, englishSlug, localePaths] = await Promise.all([
    primaryLocation ? getFishingActivitiesByLocation(primaryLocation.id) : Promise.resolve([]),
    getPackageViewsByActivity(activity.id),
    getNearbyAccommodations({ islandId: primaryLocation?.id ?? null, atollId: atoll?.id ?? null }),
    getEnglishSlug(activity.id),
    getEntityLocalePaths(activity.id, activity.slug, "/maldives/fishing/"),
  ]);
  const relatedTrips = sameIslandTrips.filter((t) => t.id !== activity.id).slice(0, 4);
  const relatedHrefs = await Promise.all(relatedTrips.map((t) => localizedEntityHref(locale, t.id, t.slug, "/maldives/fishing/")));

  const breadcrumb = breadcrumbJsonLd(
    [
      { label: ui.nav.maldives, href: localizeHubPath(locale, "/maldives/") },
      { label: ui.nav.fishing, href: localizeHubPath(locale, "/maldives/fishing/") },
      { label: activity.title },
    ],
    localizeHubPath(locale, `/maldives/fishing/${activity.slug}`),
  );

  const L = await getLinkLocalizer(locale);

  return (
    <main>
      <RegisterEntityLocaleLinks paths={localePaths} fallbackHubPath="/maldives/fishing/" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(breadcrumb) }} />

      <PageHero
        breadcrumbs={[
          { label: ui.nav.maldives, href: localizeHubPath(locale, "/maldives/") },
          { label: ui.nav.fishing, href: localizeHubPath(locale, "/maldives/fishing/") },
          { label: activity.title },
        ]}
        eyebrow={ui.nav.fishing}
        title={activity.title}
        description={activity.summary ?? undefined}
        image={activity.heroImage}
      />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
        {activity.gallery.length > 0 && (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {activity.gallery.map((asset) => (
              <MediaImage key={asset.id} asset={asset} alt={activity.title} aspectClassName="aspect-[4/3]" />
            ))}
          </div>
        )}

        <ActivityQuickFacts activity={activity} duration={duration} localize={L} showDifficulty={false} showMinAge={false} />

        {activity.isBookable && (
          <section className="mt-6 rounded-2xl border border-neutral-200 p-6">
            <h2 className="text-xl font-semibold text-ocean-900">{bookingCta("fishing").toggleLabel}</h2>
            <p className="mt-1 text-sm text-neutral-600">{d.bookingIntro}</p>
            <div className="mt-4">
              <NodeInquiryToggle
                productNodeId={activity.id}
                productTitle={activity.title}
                source="fishing"
                toggleLabel={bookingCta("fishing").toggleLabel}
                submitLabel={bookingCta("fishing").submitLabel}
                showNumberOfDays
              />
            </div>
          </section>
        )}

        {relatedTrips.length > 0 && primaryLocation && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold text-ocean-900">
              {d.otherTripsTitle} {primaryLocation.title}
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              {relatedTrips.map((trip, i) => (
                <li key={trip.id}>
                  <Link href={relatedHrefs[i]} className="text-maldives-600 hover:text-ocean-800 hover:underline">
                    {trip.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {packages.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold text-ocean-900">
              {d.packagesFeaturingTitle} {activity.title}
            </h2>
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {packages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} localize={L} />
              ))}
            </ul>
          </section>
        )}

        <WhereToStaySection nearby={nearbyStays} islandTitle={primaryLocation?.title ?? null} atollTitle={atoll?.title ?? null} localize={L} />

        <section className="mt-12 border-t border-neutral-200 pt-10">
          <h2 className="text-xl font-semibold text-ocean-900">{d.exploreMoreTitle}</h2>
          <nav aria-label="Related Maldives links" className="mt-4 flex flex-wrap gap-2">
            <Link
              href={localizeHubPath(locale, "/maldives/fishing/")}
              className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:border-maldives-500 hover:text-maldives-600"
            >
              {d.allFishingLink}
            </Link>
            {englishSlug && (
              <Link
                href={`/maldives/fishing/${englishSlug}/`}
                className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:border-maldives-500 hover:text-maldives-600"
              >
                {d.englishVersionLink}
              </Link>
            )}
          </nav>
        </section>
      </div>
    </main>
  );
}
