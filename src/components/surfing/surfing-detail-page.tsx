import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SurfBreakCard } from "@/components/surfing/surf-break-card";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import {
  getSurfingActivitiesByLocation,
  getSurfingActivityBySlug,
  getSurfBreaksForActivity,
  getSurfingTypesForActivity,
} from "@/lib/surfing/repository";
import { canonicalUrl } from "@/lib/seo/site";

function formatDuration(minutes: number | null): string | null {
  if (!minutes) return null;
  if (minutes < 60) return `${minutes} minutes`;
  const hours = minutes / 60;
  return Number.isInteger(hours) ? `${hours} hour${hours === 1 ? "" : "s"}` : `${hours.toFixed(1)} hours`;
}

export async function surfingDetailMetadata(slug: string): Promise<Metadata> {
  const activity = await getSurfingActivityBySlug(slug);
  if (!activity) return {};

  const title = activity.metaTitle ?? `${activity.title} | Maldives Surfing | MTG`;
  const description = activity.metaDescription ?? activity.summary ?? undefined;
  const url = canonicalUrl(`/maldives/surfing/${activity.slug}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  };
}

export async function SurfingDetailPage({ slug }: { slug: string }) {
  const activity = await getSurfingActivityBySlug(slug);
  if (!activity) notFound();

  const { primaryLocation, atoll } = activity;
  const duration = formatDuration(activity.durationMinutes);

  const [surfingTypes, surfBreaks, sameIslandActivities] = await Promise.all([
    getSurfingTypesForActivity(activity.id),
    getSurfBreaksForActivity(activity.id),
    primaryLocation ? getSurfingActivitiesByLocation(primaryLocation.id) : Promise.resolve([]),
  ]);
  const relatedActivities = sameIslandActivities.filter((a) => a.id !== activity.id).slice(0, 4);

  return (
    <main>
      <PageHero
        breadcrumbs={[
          { label: "Maldives", href: "/maldives/" },
          { label: "Surfing", href: "/maldives/surfing/" },
          { label: activity.title },
        ]}
        eyebrow="Surfing"
        title={activity.title}
        description={activity.summary ?? undefined}
      />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
      {surfingTypes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {surfingTypes.map((type) => (
            <Link
              key={type.id}
              href={`/maldives/surfing/?type=${type.slug}`}
              className="rounded-full border border-neutral-300 px-3 py-1 text-xs text-neutral-700"
            >
              {type.title}
            </Link>
          ))}
        </div>
      )}

      <dl className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
        {duration && (
          <div>
            <dt className="text-neutral-500">Duration</dt>
            <dd className="font-medium">{duration}</dd>
          </div>
        )}
        {activity.difficulty && (
          <div>
            <dt className="text-neutral-500">Level</dt>
            <dd className="font-medium capitalize">{activity.difficulty.replace("_", " ")}</dd>
          </div>
        )}
        {activity.minAge !== null && (
          <div>
            <dt className="text-neutral-500">Minimum age</dt>
            <dd className="font-medium">{activity.minAge}</dd>
          </div>
        )}
        {activity.maxParticipants !== null && (
          <div>
            <dt className="text-neutral-500">Max participants</dt>
            <dd className="font-medium">{activity.maxParticipants}</dd>
          </div>
        )}
        {activity.priceFrom !== null && (
          <div>
            <dt className="text-neutral-500">Price from</dt>
            <dd className="font-medium">
              {activity.currency ?? "USD"} {activity.priceFrom}
            </dd>
          </div>
        )}
        {primaryLocation && (
          <div>
            <dt className="text-neutral-500">Location</dt>
            <dd className="font-medium">
              <Link
                href={
                  primaryLocation.locationType === "island"
                    ? `/maldives/islands/${primaryLocation.slug}/`
                    : `/maldives/atolls/${primaryLocation.slug}/`
                }
                className="hover:underline"
              >
                {primaryLocation.title}
              </Link>
            </dd>
          </div>
        )}
        {atoll && (
          <div>
            <dt className="text-neutral-500">Atoll</dt>
            <dd className="font-medium">
              <Link href={`/maldives/atolls/${atoll.slug}/`} className="hover:underline">
                {atoll.title}
              </Link>
            </dd>
          </div>
        )}
        {activity.provider && (
          <div>
            <dt className="text-neutral-500">Operated by</dt>
            <dd className="font-medium">
              <Link href={`/maldives/providers/${activity.provider.slug}/`} className="hover:underline">
                {activity.provider.title}
              </Link>
            </dd>
          </div>
        )}
      </dl>

      {surfBreaks.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Surf breaks visited</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {surfBreaks.map((surfBreak) => (
              <SurfBreakCard key={surfBreak.id} surfBreak={surfBreak} />
            ))}
          </ul>
        </section>
      )}

      {relatedActivities.length > 0 && primaryLocation && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Other surfing on {primaryLocation.title}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {relatedActivities.map((a) => (
              <li key={a.id}>
                <Link href={`/maldives/surfing/${a.slug}/`} className="text-maldives-600 hover:text-ocean-800 hover:underline">
                  {a.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Booking/inquiry UI is not built yet — Task 9 only establishes the
          bookable_products relationship (see activity.isBookable). */}
      </div>
    </main>
  );
}
