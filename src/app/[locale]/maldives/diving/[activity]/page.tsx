import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { WhereToStaySection } from "@/components/accommodation/where-to-stay-section";
import { ActivityQuickFacts } from "@/components/activity/activity-quick-facts";
import { NodeInquiryToggle } from "@/components/bookings/node-inquiry-toggle";
import { DiveSiteCard } from "@/components/diving/dive-site-card";
import { RegisterEntityLocaleLinks } from "@/components/i18n/entity-locale-links-context";
import { PackageCard } from "@/components/packages/package-card";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { MediaImage } from "@/components/ui/media-image";
import { PageHero } from "@/components/ui/page-hero";
import { getNearbyAccommodations } from "@/lib/accommodations/repository";
import { getTranslatedActivityViewBySlug } from "@/lib/activities/repository";
import { bookingCta } from "@/lib/bookings/copy";
import { getDiveSitesForActivity, getDivingActivitiesByLocation } from "@/lib/diving/repository";
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
export const revalidate = 4340;

interface Params {
  locale: string;
  activity: string;
}

/**
 * Localized equivalent of src/app/maldives/diving/[activity]/page.tsx
 * (and diving-detail-page.tsx) -- same convention as the fishing
 * detail locale page: only title/summary translated, everything else
 * (quick facts, booking labels, dive-site list) stays real English
 * data. Dive sites themselves have no translated route yet, so
 * DiveSiteCard's own links stay plain English (same "fallback to
 * English for an un-translated vertical" convention as everywhere
 * else). 404s if the resolved entity isn't a diving-category activity.
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
  if (!activity || activity.activityCategory !== "diving") notFound();
  return { locale: locale as Locale, activity };
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, activity: slug } = await params;
  if (!isLocale(locale) || locale === "en") return {};
  const activity = await getTranslatedActivityViewBySlug(locale, slug);
  if (!activity || activity.activityCategory !== "diving") return {};

  const title = activity.title;
  const description = activity.summary ?? undefined;
  const url = localizeHubPath(locale, `/maldives/diving/${activity.slug}/`);
  const englishSlug = (await getEnglishSlug(activity.id)) ?? activity.slug;
  const paths = await getEntityLocalePaths(activity.id, englishSlug, "/maldives/diving/");
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

export default async function LocaleDivingDetailPage({ params }: { params: Promise<Params> }) {
  const { locale: rawLocale, activity: slug } = await params;
  const { locale, activity } = await loadOrNotFound(rawLocale, slug);
  const ui = getUiStrings(locale);
  const d = ui.activityDetail;

  const { primaryLocation, atoll } = activity;
  const duration = formatDuration(activity.durationMinutes, locale);

  const [diveSites, sameIslandActivities, packages, nearbyStays, englishSlug, localePaths] = await Promise.all([
    getDiveSitesForActivity(activity.id),
    primaryLocation ? getDivingActivitiesByLocation(primaryLocation.id) : Promise.resolve([]),
    getPackageViewsByActivity(activity.id),
    getNearbyAccommodations({ islandId: primaryLocation?.id ?? null, atollId: atoll?.id ?? null }),
    getEnglishSlug(activity.id),
    getEntityLocalePaths(activity.id, activity.slug, "/maldives/diving/"),
  ]);
  const relatedActivities = sameIslandActivities.filter((a) => a.id !== activity.id).slice(0, 4);
  const relatedHrefs = await Promise.all(relatedActivities.map((a) => localizedEntityHref(locale, a.id, a.slug, "/maldives/diving/")));

  const breadcrumb = breadcrumbJsonLd(
    [
      { label: ui.nav.maldives, href: localizeHubPath(locale, "/maldives/") },
      { label: ui.nav.diving, href: localizeHubPath(locale, "/maldives/diving/") },
      { label: activity.title },
    ],
    localizeHubPath(locale, `/maldives/diving/${activity.slug}`),
  );

  const L = await getLinkLocalizer(locale);

  return (
    <main>
      <RegisterEntityLocaleLinks paths={localePaths} fallbackHubPath="/maldives/diving/" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(breadcrumb) }} />

      <PageHero
        breadcrumbs={[
          { label: ui.nav.maldives, href: localizeHubPath(locale, "/maldives/") },
          { label: ui.nav.diving, href: localizeHubPath(locale, "/maldives/diving/") },
          { label: activity.title },
        ]}
        eyebrow={ui.nav.diving}
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

        <ActivityQuickFacts activity={activity} duration={duration} localize={L} />

        {diveSites.length > 0 && (
          <section className="mt-10">
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {diveSites.map((site) => (
                <DiveSiteCard key={site.id} site={site} localize={L} />
              ))}
            </ul>
          </section>
        )}

        {relatedActivities.length > 0 && primaryLocation && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold text-ocean-900">
              {d.otherTripsTitle} {primaryLocation.title}
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              {relatedActivities.map((a, i) => (
                <li key={a.id}>
                  <Link href={relatedHrefs[i]} className="text-maldives-600 hover:text-ocean-800 hover:underline">
                    {a.title}
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

        {activity.isBookable && (
          <section className="mt-10 rounded-2xl border border-neutral-200 p-6">
            <h2 className="text-xl font-semibold text-ocean-900">{bookingCta("diving").toggleLabel}</h2>
            <p className="mt-1 text-sm text-neutral-600">{d.bookingIntro}</p>
            <div className="mt-4">
              <NodeInquiryToggle
                productNodeId={activity.id}
                productTitle={activity.title}
                source="diving"
                toggleLabel={bookingCta("diving").toggleLabel}
                submitLabel={bookingCta("diving").submitLabel}
              />
            </div>
          </section>
        )}

        <WhereToStaySection nearby={nearbyStays} islandTitle={primaryLocation?.title ?? null} atollTitle={atoll?.title ?? null} localize={L} />

        <section className="mt-12 border-t border-neutral-200 pt-10">
          <h2 className="text-xl font-semibold text-ocean-900">{d.exploreMoreTitle}</h2>
          <nav aria-label="Related Maldives links" className="mt-4 flex flex-wrap gap-2">
            <Link
              href={localizeHubPath(locale, "/maldives/diving/")}
              className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:border-maldives-500 hover:text-maldives-600"
            >
              {d.allDivingLink}
            </Link>
            {englishSlug && (
              <Link
                href={`/maldives/diving/${englishSlug}/`}
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
