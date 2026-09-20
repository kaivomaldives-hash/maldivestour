import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AccommodationCard } from "@/components/accommodation/accommodation-card";
import { ActivityCard } from "@/components/activity/activity-card";
import { DiveSiteCard } from "@/components/diving/dive-site-card";
import { PackageCard } from "@/components/packages/package-card";
import { SurfBreakCard } from "@/components/surfing/surf-break-card";
import { TransferRouteCard } from "@/components/transfers/transfer-route-card";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { getAccommodationsByLocation } from "@/lib/accommodations/repository";
import { getActivitiesByLocation } from "@/lib/activities/repository";
import { getDiveSitesByLocation } from "@/lib/diving/repository";
import { getChildLocations, getIslandBySlug } from "@/lib/locations/repository";
import { getPackagesByLocation } from "@/lib/packages/repository";
import { canonicalUrl } from "@/lib/seo/site";
import { getSurfBreaksByLocation } from "@/lib/surfing/repository";
import { createClient } from "@/lib/supabase/server";
import { getTransferRoutesByLocation } from "@/lib/transfers/repository";

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

  const [atoll, children, accommodations, activities, diveSites, surfBreaks, transferRoutes, packages] = await Promise.all([
    getAtollSummary(island.parentId),
    getChildLocations(island.id),
    getAccommodationsByLocation(island.id),
    getActivitiesByLocation(island.id),
    getDiveSitesByLocation(island.id),
    getSurfBreaksByLocation(island.id),
    getTransferRoutesByLocation(island.id),
    getPackagesByLocation(island.id),
  ]);
  // Fishing, diving, and surfing each have their own dedicated
  // vertical/section (Task 7, Task 8, Task 9) and, per
  // ACTIVITY_CATEGORY_SEGMENT, their own canonical URL — split them out of
  // the generic activity list rather than showing them twice.
  const fishingActivities = activities.filter((a) => a.activityCategory === "fishing");
  const divingActivities = activities.filter((a) => a.activityCategory === "diving");
  const surfingActivities = activities.filter((a) => a.activityCategory === "surfing");
  const otherActivities = activities.filter(
    (a) => a.activityCategory !== "fishing" && a.activityCategory !== "diving" && a.activityCategory !== "surfing",
  );

  return (
    <main>
      <PageHero
        breadcrumbs={[
          { label: "Maldives", href: "/maldives/" },
          { label: "Atolls", href: "/maldives/atolls/" },
          ...(atoll ? [{ label: atoll.title, href: `/maldives/atolls/${atoll.slug}/` }] : []),
          { label: island.title },
        ]}
        eyebrow="Island"
        title={island.title}
        description={island.summary ?? undefined}
      />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
      <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
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
          <h2 className="text-xl font-semibold text-ocean-900">On this island</h2>
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
          <h2 className="text-xl font-semibold text-ocean-900">Accommodation on {island.title}</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {accommodations.map((accommodation) => (
              <AccommodationCard key={accommodation.id} accommodation={accommodation} />
            ))}
          </ul>
        </section>
      )}

      {fishingActivities.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Fishing on {island.title}</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {fishingActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </ul>
        </section>
      )}

      {divingActivities.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Diving on {island.title}</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {divingActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </ul>
        </section>
      )}

      {diveSites.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Dive sites near {island.title}</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {diveSites.map((site) => (
              <DiveSiteCard key={site.id} site={site} />
            ))}
          </ul>
        </section>
      )}

      {surfingActivities.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Surfing on {island.title}</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {surfingActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </ul>
        </section>
      )}

      {surfBreaks.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Surf breaks near {island.title}</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {surfBreaks.map((surfBreak) => (
              <SurfBreakCard key={surfBreak.id} surfBreak={surfBreak} />
            ))}
          </ul>
        </section>
      )}

      {otherActivities.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Activities on {island.title}</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {otherActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </ul>
        </section>
      )}

      {transferRoutes.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Transfers to/from {island.title}</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {transferRoutes.map((route) => (
              <TransferRouteCard key={route.id} route={route} />
            ))}
          </ul>
        </section>
      )}

      {packages.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Packages featuring {island.title}</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </ul>
        </section>
      )}
      </div>
    </main>
  );
}
