import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/location/breadcrumbs";
import { PackageCard } from "@/components/packages/package-card";
import { getActivityBySlug } from "@/lib/activities/repository";
import { hasDedicatedRoute } from "@/lib/activities/types";
import { getPackagesByActivity } from "@/lib/packages/repository";
import { canonicalUrl } from "@/lib/seo/site";

const CATEGORY_LABEL: Record<string, string> = {
  general: "General",
  fishing: "Fishing",
  diving: "Diving",
  surfing: "Surfing",
  watersports: "Watersports",
  excursion: "Excursion",
  island_hopping: "Island Hopping",
  spa: "Spa",
  culture: "Culture",
};

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
  const packages = await getPackagesByActivity(activity.id);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Breadcrumbs
        items={[
          { label: "Maldives", href: "/maldives/" },
          { label: "Activities", href: "/maldives/activities/" },
          { label: activity.title },
        ]}
      />
      <h1 className="mt-4 text-3xl font-semibold">{activity.title}</h1>
      {activity.summary && <p className="mt-3 text-neutral-700">{activity.summary}</p>}

      <dl className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-neutral-500">Category</dt>
          <dd className="font-medium">{CATEGORY_LABEL[activity.activityCategory] ?? activity.activityCategory}</dd>
        </div>
        {duration && (
          <div>
            <dt className="text-neutral-500">Duration</dt>
            <dd className="font-medium">{duration}</dd>
          </div>
        )}
        {activity.difficulty && (
          <div>
            <dt className="text-neutral-500">Difficulty</dt>
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

      {packages.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Packages featuring {activity.title}</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </ul>
        </section>
      )}

      {/* Booking/inquiry UI is not built yet — Task 6 only establishes the
          bookable_products relationship (see activity.isBookable). */}
    </main>
  );
}
