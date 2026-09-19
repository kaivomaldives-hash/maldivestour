import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ActivityCard } from "@/components/activity/activity-card";
import { Breadcrumbs } from "@/components/location/breadcrumbs";
import { getDiveSiteBySlug, getDivingActivitiesAtSite } from "@/lib/diving/repository";
import { canonicalUrl } from "@/lib/seo/site";

const SITE_TYPE_LABEL: Record<string, string> = {
  reef: "Reef",
  thila: "Thila",
  channel: "Channel",
  wreck: "Wreck",
  pinnacle: "Pinnacle",
  wall: "Wall",
  cave: "Cave",
};

export async function diveSiteDetailMetadata(slug: string): Promise<Metadata> {
  const site = await getDiveSiteBySlug(slug);
  if (!site) return {};

  const title = `${site.title} | Maldives Dive Sites | MTG`;
  const description = site.summary ?? `${site.title}, a Maldives dive site.`;
  const url = canonicalUrl(`/maldives/dive-sites/${site.slug}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  };
}

export async function DiveSiteDetailPage({ slug }: { slug: string }) {
  const site = await getDiveSiteBySlug(slug);
  if (!site) notFound();

  const activities = await getDivingActivitiesAtSite(site.id);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Breadcrumbs
        items={[
          { label: "Maldives", href: "/maldives/" },
          { label: "Dive Sites", href: "/maldives/dive-sites/" },
          { label: site.title },
        ]}
      />
      <h1 className="mt-4 text-3xl font-semibold">{site.title}</h1>
      {site.summary && <p className="mt-3 text-neutral-700">{site.summary}</p>}

      <p className="mt-2 text-xs uppercase tracking-wide text-neutral-500">
        A physical dive site — not a bookable product. See diving activities below for operators running trips here.
      </p>

      <dl className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
        {site.siteType && (
          <div>
            <dt className="text-neutral-500">Site type</dt>
            <dd className="font-medium">{SITE_TYPE_LABEL[site.siteType] ?? site.siteType}</dd>
          </div>
        )}
        {(site.depthMinMeters !== null || site.depthMaxMeters !== null) && (
          <div>
            <dt className="text-neutral-500">Depth</dt>
            <dd className="font-medium">
              {site.depthMinMeters !== null && site.depthMaxMeters !== null
                ? `${site.depthMinMeters}–${site.depthMaxMeters} m`
                : `${site.depthMinMeters ?? site.depthMaxMeters} m`}
            </dd>
          </div>
        )}
        {site.experienceLevel && (
          <div>
            <dt className="text-neutral-500">Experience level</dt>
            <dd className="font-medium capitalize">{site.experienceLevel}</dd>
          </div>
        )}
        {site.atoll && (
          <div>
            <dt className="text-neutral-500">Atoll</dt>
            <dd className="font-medium">
              <Link href={`/maldives/atolls/${site.atoll.slug}/`} className="hover:underline">
                {site.atoll.title}
              </Link>
            </dd>
          </div>
        )}
        {site.nearbyIsland && (
          <div>
            <dt className="text-neutral-500">Nearby island</dt>
            <dd className="font-medium">
              <Link href={`/maldives/islands/${site.nearbyIsland.slug}/`} className="hover:underline">
                {site.nearbyIsland.title}
              </Link>
            </dd>
          </div>
        )}
      </dl>

      {(site.currentNotes || site.marineLifeNotes) && (
        <dl className="mt-6 space-y-4 text-sm">
          {site.currentNotes && (
            <div>
              <dt className="text-neutral-500">Conditions</dt>
              <dd className="mt-1">{site.currentNotes}</dd>
            </div>
          )}
          {site.marineLifeNotes && (
            <div>
              <dt className="text-neutral-500">Marine life</dt>
              <dd className="mt-1">{site.marineLifeNotes}</dd>
            </div>
          )}
        </dl>
      )}

      {activities.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Diving activities at {site.title}</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
