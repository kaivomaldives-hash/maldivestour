import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ActivityItinerarySection } from "@/components/activity/activity-itinerary-section";
import { ActivityQuickFacts } from "@/components/activity/activity-quick-facts";
import { ActivityRatesSection } from "@/components/activity/activity-rates-section";
import { ActivityVideoSection } from "@/components/activity/activity-video-section";
import { PackageCard } from "@/components/packages/package-card";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { MediaImage } from "@/components/ui/media-image";
import { PageHero } from "@/components/ui/page-hero";
import { WhereToStaySection } from "@/components/accommodation/where-to-stay-section";
import { NodeInquiryToggle } from "@/components/bookings/node-inquiry-toggle";
import { LocationMap } from "@/components/locations/location-map";
import { ReviewsSection } from "@/components/reviews/reviews-section";
import { bookingCta } from "@/lib/bookings/copy";
import { getNearbyAccommodations } from "@/lib/accommodations/repository";
import { getActivityBySlug } from "@/lib/activities/repository";
import { activityServiceJsonLd, hasDedicatedRoute } from "@/lib/activities/types";
import { getPackageViewsByActivity } from "@/lib/packages/view-repository";
import { getReviewsForNode } from "@/lib/reviews/repository";
import { breadcrumbJsonLd, canonicalUrl, safeJsonLdStringify } from "@/lib/seo/site";

function formatDuration(minutes: number | null): string | null {
  if (!minutes) return null;
  if (minutes < 60) return `${minutes} minutes`;
  const hours = minutes / 60;
  return Number.isInteger(hours) ? `${hours} hour${hours === 1 ? "" : "s"}` : `${hours.toFixed(1)} hours`;
}

/** Splits a plain-text description on blank lines into paragraphs — the
 * field is deliberately plain text (not HTML, unlike articles.body), so
 * this is the one bit of formatting it needs. */
function descriptionParagraphs(description: string): string[] {
  return description
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/**
 * The generic /maldives/activities/[slug]/ route only serves categories
 * without their own dedicated vertical (see ACTIVITY_CATEGORY_SEGMENT in
 * lib/activities/types.ts). A fishing activity's one canonical URL is
 * /maldives/fishing/[slug]/ (Task 7) — reachable, unambiguous, and
 * matching the architecture's original per-category URL segments — so it
 * 404s here rather than being reachable (and indexable) at two paths.
 */
async function loadGenericActivity(slug: string) {
  const activity = await getActivityBySlug(slug);
  if (!activity || hasDedicatedRoute(activity.activityCategory)) return null;
  return activity;
}

export async function activityDetailMetadata(slug: string): Promise<Metadata> {
  const activity = await loadGenericActivity(slug);
  if (!activity) return {};

  const title = activity.metaTitle ?? `${activity.title} | Maldives Activities | MTG`;
  const description = activity.metaDescription ?? activity.summary ?? undefined;
  const url = canonicalUrl(`/maldives/activities/${activity.slug}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  };
}

/**
 * Standard section order for every generic-route activity (snorkeling,
 * dolphin/sandbank trips, city tours, island hopping, watersports, etc.
 * — anything without its own dedicated vertical): hero -> description ->
 * video -> gallery -> quick facts -> pickup locations -> map ->
 * itinerary -> rates -> book now -> reviews -> featuring/suggestions.
 * Each section is independently optional — the activity's real data
 * decides what shows, nothing is ever a placeholder.
 */
export async function ActivityDetailPage({ slug }: { slug: string }) {
  const activity = await loadGenericActivity(slug);
  if (!activity) notFound();

  const { primaryLocation, atoll } = activity;
  const duration = formatDuration(activity.durationMinutes);
  const [packages, nearbyStays, reviews] = await Promise.all([
    getPackageViewsByActivity(activity.id),
    getNearbyAccommodations({ islandId: primaryLocation?.id ?? null, atollId: atoll?.id ?? null }),
    getReviewsForNode(activity.id),
  ]);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLdStringify(
            breadcrumbJsonLd(
              [{ label: "Maldives", href: "/maldives/" }, { label: "Activities", href: "/maldives/activities/" }, { label: activity.title }],
              `/maldives/activities/${activity.slug}`,
            ),
          ),
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(activityServiceJsonLd(activity)) }} />

      <PageHero
        breadcrumbs={[
          { label: "Maldives", href: "/maldives/" },
          { label: "Activities", href: "/maldives/activities/" },
          { label: activity.title },
        ]}
        eyebrow="Activity"
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

      <ActivityVideoSection youtubeId={activity.videoYoutubeId} activityTitle={activity.title} />

      {activity.gallery.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {activity.gallery.map((asset) => (
            <MediaImage key={asset.id} asset={asset} alt={activity.title} aspectClassName="aspect-[4/3]" />
          ))}
        </div>
      )}

      <ActivityQuickFacts activity={activity} duration={duration} showCategory difficultyLabel="Difficulty" />

      {activity.locations.length > 1 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Available with pickup from</h2>
          <p className="mt-1 text-sm text-neutral-600">This trip offers pickup from any of these resorts and islands.</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {activity.locations.map((location) => (
              <li key={location.id}>
                <a
                  href={location.locationType === "atoll" ? `/maldives/atolls/${location.slug}/` : `/maldives/islands/${location.slug}/`}
                  className="inline-block rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-sm text-neutral-700 hover:border-maldives-300 hover:bg-maldives-50 hover:text-maldives-700"
                >
                  {location.title}
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
          <p className="mt-1 text-sm text-neutral-600">
            {activity.locations.length > 1
              ? "Tell us your pickup location, dates, and group size and we’ll follow up on availability."
              : "Tell us your dates and group size and we’ll follow up on availability."}
          </p>
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
          <h2 className="text-xl font-semibold text-ocean-900">Packages featuring {activity.title}</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </ul>
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ocean-900">Browse Packages by Style</h2>
        <nav aria-label="Package categories" className="mt-4 flex flex-wrap gap-2">
          {[
            { href: "/maldives/packages/luxury/", label: "Luxury" },
            { href: "/maldives/packages/honeymoon/", label: "Honeymoon" },
            { href: "/maldives/packages/family/", label: "Family" },
            { href: "/maldives/packages/diving/", label: "Diving" },
            { href: "/maldives/packages/liveaboard/", label: "Liveaboard" },
            { href: "/maldives/packages/fishing/", label: "Fishing" },
            { href: "/maldives/packages/surfing/", label: "Surfing" },
            { href: "/maldives/packages/", label: "All Packages" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:border-maldives-500 hover:text-maldives-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </section>

      <WhereToStaySection nearby={nearbyStays} islandTitle={primaryLocation?.title ?? null} atollTitle={atoll?.title ?? null} />
      </div>
    </main>
  );
}
