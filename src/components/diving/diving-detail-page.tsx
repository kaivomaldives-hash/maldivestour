import Link from "next/link";
import { notFound } from "next/navigation";

import { WhereToStaySection } from "@/components/accommodation/where-to-stay-section";
import { ActivityQuickFacts } from "@/components/activity/activity-quick-facts";
import { NodeInquiryToggle } from "@/components/bookings/node-inquiry-toggle";
import { DiveSiteCard } from "@/components/diving/dive-site-card";
import { PackageCard } from "@/components/packages/package-card";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { MediaImage } from "@/components/ui/media-image";
import { PageHero } from "@/components/ui/page-hero";
import { getNearbyAccommodations } from "@/lib/accommodations/repository";
import { activityServiceJsonLd } from "@/lib/activities/types";
import { bookingCta } from "@/lib/bookings/copy";
import {
  getDivingActivitiesByLocation,
  getDivingActivityBySlug,
  getDiveSitesForActivity,
  getDivingTypesForActivity,
} from "@/lib/diving/repository";
import { getPackageViewsByActivity } from "@/lib/packages/view-repository";
import { breadcrumbJsonLd, safeJsonLdStringify } from "@/lib/seo/site";

function formatDuration(minutes: number | null): string | null {
  if (!minutes) return null;
  if (minutes < 60) return `${minutes} minutes`;
  const hours = minutes / 60;
  return Number.isInteger(hours) ? `${hours} hour${hours === 1 ? "" : "s"}` : `${hours.toFixed(1)} hours`;
}

export async function DivingDetailPage({ slug }: { slug: string }) {
  const activity = await getDivingActivityBySlug(slug);
  if (!activity) notFound();

  const { primaryLocation, atoll } = activity;
  const duration = formatDuration(activity.durationMinutes);

  const [divingTypes, diveSites, sameIslandActivities, packages, nearbyStays] = await Promise.all([
    getDivingTypesForActivity(activity.id),
    getDiveSitesForActivity(activity.id),
    primaryLocation ? getDivingActivitiesByLocation(primaryLocation.id) : Promise.resolve([]),
    getPackageViewsByActivity(activity.id),
    getNearbyAccommodations({ islandId: primaryLocation?.id ?? null, atollId: atoll?.id ?? null }),
  ]);
  const relatedActivities = sameIslandActivities.filter((a) => a.id !== activity.id).slice(0, 4);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLdStringify(
            breadcrumbJsonLd(
              [{ label: "Maldives", href: "/maldives/" }, { label: "Diving", href: "/maldives/diving/" }, { label: activity.title }],
              `/maldives/diving/${activity.slug}`,
            ),
          ),
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(activityServiceJsonLd(activity)) }} />

      <PageHero
        breadcrumbs={[
          { label: "Maldives", href: "/maldives/" },
          { label: "Diving", href: "/maldives/diving/" },
          { label: activity.title },
        ]}
        eyebrow="Diving"
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
      {divingTypes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {divingTypes.map((type) => (
            <Link
              key={type.id}
              href={`/maldives/diving/?type=${type.slug}`}
              className="rounded-full border border-neutral-300 px-3 py-1 text-xs text-neutral-700"
            >
              {type.title}
            </Link>
          ))}
        </div>
      )}

      <ActivityQuickFacts activity={activity} duration={duration} />

      {diveSites.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Dive sites visited</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {diveSites.map((site) => (
              <DiveSiteCard key={site.id} site={site} />
            ))}
          </ul>
        </section>
      )}

      {relatedActivities.length > 0 && primaryLocation && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Other diving on {primaryLocation.title}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {relatedActivities.map((a) => (
              <li key={a.id}>
                <Link href={`/maldives/diving/${a.slug}/`} className="text-maldives-600 hover:text-ocean-800 hover:underline">
                  {a.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

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
          <h2 className="text-xl font-semibold text-ocean-900">{bookingCta("diving").toggleLabel}</h2>
          <p className="mt-1 text-sm text-neutral-600">Tell us your preferred date and group size and we&rsquo;ll follow up on availability.</p>
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
      </div>
    </main>
  );
}
