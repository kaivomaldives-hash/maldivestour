import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { WhereToStaySection } from "@/components/accommodation/where-to-stay-section";
import { ActivityItinerarySection } from "@/components/activity/activity-itinerary-section";
import { ActivityQuickFacts } from "@/components/activity/activity-quick-facts";
import { ActivityRatesSection } from "@/components/activity/activity-rates-section";
import { NodeInquiryToggle } from "@/components/bookings/node-inquiry-toggle";
import { RegisterEntityLocaleLinks } from "@/components/i18n/entity-locale-links-context";
import { LocationMap } from "@/components/locations/location-map";
import { PackageCard } from "@/components/packages/package-card";
import { ReviewsSection } from "@/components/reviews/reviews-section";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { MediaImage } from "@/components/ui/media-image";
import { PageHero } from "@/components/ui/page-hero";
import { getNearbyAccommodations } from "@/lib/accommodations/repository";
import { getTranslatedActivityViewBySlug } from "@/lib/activities/repository";
import { hasDedicatedRoute } from "@/lib/activities/types";
import { bookingCta } from "@/lib/bookings/copy";
import { getChromeStrings } from "@/lib/i18n/chrome-strings";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { localizeHubPath } from "@/lib/i18n/hub-paths";
import { getEntityLocalePaths } from "@/lib/i18n/repository";
import { getUiStrings } from "@/lib/i18n/ui-strings";
import { getLinkLocalizer } from "@/lib/i18n/link-localizer";
import { getPackageViewsByActivity } from "@/lib/packages/view-repository";
import { getReviewsForNode } from "@/lib/reviews/repository";
import { breadcrumbJsonLd, canonicalUrl, safeJsonLdStringify } from "@/lib/seo/site";
import { createClient } from "@/lib/supabase/public";

// Staggered (not a round 3600) so ISR regenerations don't cluster with
// every other route's -- see src/app/page.tsx for why.
export const revalidate = 4350;

interface Params {
  locale: string;
  activity: string;
}

/**
 * Localized equivalent of src/app/maldives/activities/[activity]/page.tsx
 * (and activity-detail-page.tsx) -- same convention as the fishing/
 * diving detail locale pages. 404s if the resolved entity has its own
 * dedicated vertical (fishing/diving/surfing), mirroring the English
 * loadGenericActivity's own check -- a fishing activity's one
 * canonical URL stays /{locale}/maldives/fishing/[slug]/, never
 * reachable at two translated paths.
 */
function formatDuration(minutes: number | null, locale: Locale): string | null {
  if (!minutes) return null;
  const units = getChromeStrings(locale);
  if (minutes < 60) return units.minutes.replace("{n}", String(minutes));
  const hours = minutes / 60;
  return units.hours.replace("{n}", Number.isInteger(hours) ? String(hours) : hours.toFixed(1));
}

function descriptionParagraphs(description: string): string[] {
  return description
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

async function getEnglishSlug(entityId: string): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("nodes").select("slug").eq("id", entityId).maybeSingle<{ slug: string }>();
  return data?.slug ?? null;
}

async function loadOrNotFound(locale: string, slug: string) {
  if (!isLocale(locale) || locale === "en") notFound();
  const activity = await getTranslatedActivityViewBySlug(locale, slug);
  if (!activity || hasDedicatedRoute(activity.activityCategory)) notFound();
  return { locale: locale as Locale, activity };
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, activity: slug } = await params;
  if (!isLocale(locale) || locale === "en") return {};
  const activity = await getTranslatedActivityViewBySlug(locale, slug);
  if (!activity || hasDedicatedRoute(activity.activityCategory)) return {};

  const title = activity.title;
  const description = activity.summary ?? undefined;
  const url = localizeHubPath(locale, `/maldives/activities/${activity.slug}/`);
  const englishSlug = (await getEnglishSlug(activity.id)) ?? activity.slug;
  const paths = await getEntityLocalePaths(activity.id, englishSlug, "/maldives/activities/");
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

export default async function LocaleActivityDetailPage({ params }: { params: Promise<Params> }) {
  const { locale: rawLocale, activity: slug } = await params;
  const { locale, activity } = await loadOrNotFound(rawLocale, slug);
  const ui = getUiStrings(locale);
  const d = ui.activityDetail;

  const { primaryLocation, atoll } = activity;
  const duration = formatDuration(activity.durationMinutes, locale);

  const [packages, nearbyStays, reviews, englishSlug, localePaths] = await Promise.all([
    getPackageViewsByActivity(activity.id),
    getNearbyAccommodations({ islandId: primaryLocation?.id ?? null, atollId: atoll?.id ?? null }),
    getReviewsForNode(activity.id),
    getEnglishSlug(activity.id),
    getEntityLocalePaths(activity.id, activity.slug, "/maldives/activities/"),
  ]);

  const breadcrumb = breadcrumbJsonLd(
    [
      { label: ui.nav.maldives, href: localizeHubPath(locale, "/maldives/") },
      { label: ui.nav.activities, href: localizeHubPath(locale, "/maldives/activities/") },
      { label: activity.title },
    ],
    localizeHubPath(locale, `/maldives/activities/${activity.slug}`),
  );

  const L = await getLinkLocalizer(locale);

  return (
    <main>
      <RegisterEntityLocaleLinks paths={localePaths} fallbackHubPath="/maldives/activities/" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(breadcrumb) }} />

      <PageHero
        breadcrumbs={[
          { label: ui.nav.maldives, href: localizeHubPath(locale, "/maldives/") },
          { label: ui.nav.activities, href: localizeHubPath(locale, "/maldives/activities/") },
          { label: activity.title },
        ]}
        eyebrow={ui.nav.activities}
        title={activity.title}
        description={activity.summary ?? undefined}
        image={activity.heroImage}
      />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
        {activity.description && (
          <div className="space-y-4 text-neutral-800">
            {descriptionParagraphs(activity.description).map((paragraph, i) => (
              <p key={i} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        )}

        {activity.gallery.length > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {activity.gallery.map((asset) => (
              <MediaImage key={asset.id} asset={asset} alt={activity.title} aspectClassName="aspect-[4/3]" />
            ))}
          </div>
        )}

        <ActivityQuickFacts activity={activity} duration={duration} localize={L} showCategory difficultyLabel="Difficulty" />

        {activity.locations.length > 1 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold text-ocean-900">{d.pickupLocationsTitle}</h2>
            <p className="mt-1 text-sm text-neutral-600">{d.pickupLocationsIntro}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {activity.locations.map((location) => (
                <li key={location.id}>
                  <a
                    href={L.href(location.locationType === "atoll" ? `/maldives/atolls/${location.slug}/` : `/maldives/islands/${location.slug}/`)}
                    className="inline-block rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-sm text-neutral-700 hover:border-maldives-300 hover:bg-maldives-50 hover:text-maldives-700"
                  >
                    {L.title(location.locationType === "atoll" ? `/maldives/atolls/${location.slug}/` : `/maldives/islands/${location.slug}/`, location.title)}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <LocationMap title={activity.title} lat={primaryLocation?.lat ?? null} lng={primaryLocation?.lng ?? null} />

        <ActivityItinerarySection steps={activity.itinerary} />

        <ActivityRatesSection rates={activity.rates} />

        {activity.isBookable && (
          <section className="mt-10 rounded-2xl border border-neutral-200 p-6">
            <h2 className="text-xl font-semibold text-ocean-900">{bookingCta("activity").toggleLabel}</h2>
            <p className="mt-1 text-sm text-neutral-600">{d.bookingIntro}</p>
            <div className="mt-4">
              <NodeInquiryToggle
                productNodeId={activity.id}
                productTitle={activity.title}
                source="activity"
                toggleLabel={bookingCta("activity").toggleLabel}
                submitLabel={bookingCta("activity").submitLabel}
                requireDestination={activity.locations.length > 1}
              />
            </div>
          </section>
        )}

        <ReviewsSection nodeId={activity.id} reviews={reviews} subjectLabel="activity" />

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
              href={localizeHubPath(locale, "/maldives/activities/")}
              className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:border-maldives-500 hover:text-maldives-600"
            >
              {d.allActivitiesLink}
            </Link>
            {englishSlug && (
              <Link
                href={`/maldives/activities/${englishSlug}/`}
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
