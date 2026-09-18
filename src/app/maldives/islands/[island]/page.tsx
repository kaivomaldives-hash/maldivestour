import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AccommodationCard } from "@/components/accommodation/accommodation-card";
import { ActivityCard } from "@/components/activity/activity-card";
import { Breadcrumbs } from "@/components/location/breadcrumbs";
import { getAccommodationsByLocation } from "@/lib/accommodations/repository";
import { getActivitiesByLocation } from "@/lib/activities/repository";
import { getChildLocations, getIslandBySlug } from "@/lib/locations/repository";
import { canonicalUrl } from "@/lib/seo/site";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 3600;

interface Params {
  island: string;
}

async function getAtollSummary(atollId: string | null) {
  if (!atollId) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("nodes")
    .select("slug, title")
    .eq("id", atollId)
    .eq("node_type", "location")
    .maybeSingle<{ slug: string; title: string }>();
  return data;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { island: slug } = await params;
  const island = await getIslandBySlug(slug);
  if (!island) return {};

  const title = island.metaTitle ?? `${island.title} | Maldives Islands | MTG`;
  const description = island.metaDescription ?? island.summary ?? undefined;
  const url = canonicalUrl(`/maldives/islands/${island.slug}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  };
}

export default async function IslandPage({ params }: { params: Promise<Params> }) {
  const { island: slug } = await params;
  const island = await getIslandBySlug(slug);
  if (!island) notFound();

  const [atoll, children, accommodations, activities] = await Promise.all([
    getAtollSummary(island.parentId),
    getChildLocations(island.id),
    getAccommodationsByLocation(island.id),
    getActivitiesByLocation(island.id),
  ]);
  // Fishing has its own dedicated vertical/section as of Task 7 (and, per
  // ACTIVITY_CATEGORY_SEGMENT, its own canonical URL) — split it out of
  // the generic activity list rather than showing it twice.
  const fishingActivities = activities.filter((a) => a.activityCategory === "fishing");
  const otherActivities = activities.filter((a) => a.activityCategory !== "fishing");

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Breadcrumbs
        items={[
          { label: "Maldives", href: "/maldives/" },
          { label: "Atolls", href: "/maldives/atolls/" },
          ...(atoll ? [{ label: atoll.title, href: `/maldives/atolls/${atoll.slug}/` }] : []),
          { label: island.title },
        ]}
      />
      <h1 className="mt-4 text-3xl font-semibold">{island.title}</h1>
      {island.summary && <p className="mt-3 text-neutral-700">{island.summary}</p>}

      <dl className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-neutral-500">Location type</dt>
          <dd className="font-medium capitalize">{island.locationType}</dd>
        </div>
        {island.isInhabited !== null && (
          <div>
            <dt className="text-neutral-500">Inhabited</dt>
            <dd className="font-medium">{island.isInhabited ? "Yes" : "No"}</dd>
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
      </dl>

      {children.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">On this island</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
            {children.map((child) => (
              <li key={child.id} className="capitalize">
                {child.title}
                <span className="ml-1 text-xs text-neutral-500">({child.locationType.replace("_", " ")})</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {accommodations.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Accommodation on {island.title}</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {accommodations.map((accommodation) => (
              <AccommodationCard key={accommodation.id} accommodation={accommodation} />
            ))}
          </ul>
        </section>
      )}

      {fishingActivities.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Fishing on {island.title}</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {fishingActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </ul>
        </section>
      )}

      {otherActivities.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Activities on {island.title}</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {otherActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </ul>
        </section>
      )}

      {/* Future content sections (transfers, packages) attach to this island
          via node_locations once those entity types exist. */}
    </main>
  );
}
