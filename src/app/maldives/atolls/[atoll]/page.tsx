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
import { getAccommodationsByAtoll } from "@/lib/accommodations/repository";
import { getActivitiesByAtoll } from "@/lib/activities/repository";
import { getDiveSitesByAtoll } from "@/lib/diving/repository";
import { getAtollBySlug, getIslandsByAtoll } from "@/lib/locations/repository";
import { getHeroMediaByNodeIds } from "@/lib/media/repository";
import { getPackageViewsByAtoll } from "@/lib/packages/view-repository";
import { canonicalUrl } from "@/lib/seo/site";
import { getSurfBreaksByAtoll } from "@/lib/surfing/repository";
import { getTransferRoutesByAtoll } from "@/lib/transfers/repository";

export const revalidate = 3600;

interface Params {
  atoll: string;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { atoll: slug } = await params;
  const atoll = await getAtollBySlug(slug);
  if (!atoll) return {};

  const title = atoll.metaTitle ?? `${atoll.title} | Maldives Atolls | MTG`;
  const description = atoll.metaDescription ?? atoll.summary ?? undefined;
  const url = canonicalUrl(`/maldives/atolls/${atoll.slug}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  };
}

export default async function AtollPage({ params }: { params: Promise<Params> }) {
  const { atoll: slug } = await params;
  const atoll = await getAtollBySlug(slug);
  if (!atoll) notFound();

  const heroImage = (await getHeroMediaByNodeIds([atoll.id])).get(atoll.id) ?? null;
  const allIslands = await getIslandsByAtoll(slug);
  // getIslandsByAtoll returns every location_type="island" row under this
  // atoll, which now includes uninhabited resort islands (added in Task 5
  // to give resorts a real location to attach to) alongside the inhabited
  // islands Task 4 seeded — split them rather than mislabel the count.
  const islands = allIslands.filter((island) => island.isInhabited !== false);
  const [accommodations, activities, diveSites, surfBreaks, transferRoutes, packages] = await Promise.all([
    getAccommodationsByAtoll(atoll.id),
    getActivitiesByAtoll(atoll.id),
    getDiveSitesByAtoll(atoll.id),
    getSurfBreaksByAtoll(atoll.id),
    getTransferRoutesByAtoll(atoll.id),
    getPackageViewsByAtoll(atoll.id),
  ]);
  // See the identical split on the island page (Task 7, Task 8, Task 9):
  // fishing, diving, and surfing each have their own dedicated
  // vertical/section and canonical URL now.
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
          { label: atoll.title },
        ]}
        eyebrow="Atoll"
        title={atoll.title}
        description={atoll.summary ?? undefined}
        image={heroImage}
      />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
      <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
        {atoll.administrativeCode && (
          <div>
            <dt className="text-neutral-500">Administrative code</dt>
            <dd className="font-medium">{atoll.administrativeCode}</dd>
          </div>
        )}
        <div>
          <dt className="text-neutral-500">Inhabited islands</dt>
          <dd className="font-medium">{islands.length}</dd>
        </div>
      </dl>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ocean-900">Islands in {atoll.title}</h2>
        {islands.length === 0 ? (
          <p className="mt-2 text-sm text-neutral-600">No islands recorded for this atoll yet.</p>
        ) : (
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
            {islands.map((island) => (
              <li key={island.id}>
                <Link href={`/maldives/islands/${island.slug}/`} className="hover:underline">
                  {island.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {accommodations.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Accommodation in {atoll.title}</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {accommodations.map((accommodation) => (
              <AccommodationCard key={accommodation.id} accommodation={accommodation} />
            ))}
          </ul>
        </section>
      )}

      {fishingActivities.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Fishing in {atoll.title}</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {fishingActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </ul>
        </section>
      )}

      {divingActivities.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Diving in {atoll.title}</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {divingActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </ul>
        </section>
      )}

      {diveSites.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Dive sites in {atoll.title}</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {diveSites.map((site) => (
              <DiveSiteCard key={site.id} site={site} />
            ))}
          </ul>
        </section>
      )}

      {surfingActivities.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Surfing in {atoll.title}</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {surfingActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </ul>
        </section>
      )}

      {surfBreaks.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Surf breaks in {atoll.title}</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {surfBreaks.map((surfBreak) => (
              <SurfBreakCard key={surfBreak.id} surfBreak={surfBreak} />
            ))}
          </ul>
        </section>
      )}

      {otherActivities.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Activities in {atoll.title}</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {otherActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </ul>
        </section>
      )}

      {transferRoutes.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Transfers in {atoll.title}</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {transferRoutes.map((route) => (
              <TransferRouteCard key={route.id} route={route} />
            ))}
          </ul>
        </section>
      )}

      {packages.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Packages featuring {atoll.title}</h2>
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
