import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ActivityQuickFacts } from "@/components/activity/activity-quick-facts";
import { PackageCard } from "@/components/packages/package-card";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { MediaImage } from "@/components/ui/media-image";
import { PageHero } from "@/components/ui/page-hero";
import { WhereToStaySection } from "@/components/accommodation/where-to-stay-section";
import { NodeInquiryToggle } from "@/components/bookings/node-inquiry-toggle";
import { LocationMap } from "@/components/locations/location-map";
import { bookingCta } from "@/lib/bookings/copy";
import { getNearbyAccommodations } from "@/lib/accommodations/repository";
import { getActivityBySlug } from "@/lib/activities/repository";
import { activityServiceJsonLd, hasDedicatedRoute } from "@/lib/activities/types";
import { getPackageViewsByActivity } from "@/lib/packages/view-repository";
import { breadcrumbJsonLd, canonicalUrl, safeJsonLdStringify } from "@/lib/seo/site";

function formatDuration(minutes: number | null): string | null {
  if (!minutes) return null;
  if (minutes < 60) return `${minutes} minutes`;
  const hours = minutes / 60;
  return Number.isInteger(hours) ? `${hours} hour${hours === 1 ? "" : "s"}` : `${hours.toFixed(1)} hours`;
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

export async function ActivityDetailPage({ slug }: { slug: string }) {
  const activity = await loadGenericActivity(slug);
  if (!activity) notFound();

  const { primaryLocation, atoll } = activity;
  const duration = formatDuration(activity.durationMinutes);
  const [packages, nearbyStays] = await Promise.all([
    getPackageViewsByActivity(activity.id),
    getNearbyAccommodations({ islandId: primaryLocation?.id ?? null, atollId: atoll?.id ?? null }),
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
      {activity.gallery.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {activity.gallery.map((asset) => (
            <MediaImage key={asset.id} asset={asset} alt={activity.title} aspectClassName="aspect-[4/3]" />
          ))}
        </div>
      )}
      <ActivityQuickFacts activity={activity} duration={duration} showCategory difficultyLabel="Difficulty" />

      <LocationMap title={activity.title} lat={primaryLocation?.lat ?? null} lng={primaryLocation?.lng ?? null} />

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

      <WhereToStaySection nearby={nearbyStays} islandTitle={primaryLocation?.title ?? null} atollTitle={atoll?.title ?? null} />

      {activity.isBookable && (
        <section className="mt-10 rounded-2xl border border-neutral-200 p-6">
          <h2 className="text-xl font-semibold text-ocean-900">{bookingCta("activity").toggleLabel}</h2>
          <p className="mt-1 text-sm text-neutral-600">Tell us your dates and group size and we&rsquo;ll follow up on availability.</p>
          <div className="mt-4">
            <NodeInquiryToggle
              productNodeId={activity.id}
              productTitle={activity.title}
              source="activity"
              toggleLabel={bookingCta("activity").toggleLabel}
              submitLabel={bookingCta("activity").submitLabel}
            />
          </div>
        </section>
      )}
      </div>
    </main>
  );
}
