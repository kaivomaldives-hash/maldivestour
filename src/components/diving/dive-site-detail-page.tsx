import Link from "next/link";
import { notFound } from "next/navigation";

import { ActivityCard } from "@/components/activity/activity-card";
import { LocationCommentsSection } from "@/components/locations/location-comments-section";
import { LocationGallerySection } from "@/components/locations/location-gallery-section";
import { LocationMediaUploadForm } from "@/components/locations/location-media-upload-form";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { getDiveSiteBySlug, getDivingActivitiesAtSite } from "@/lib/diving/repository";
import { getPublishedLocationComments } from "@/lib/locations/comments/repository";
import { getMediaForNode } from "@/lib/media/repository";
import { breadcrumbJsonLd, safeJsonLdStringify } from "@/lib/seo/site";

const SITE_TYPE_LABEL: Record<string, string> = {
  reef: "Reef",
  thila: "Thila",
  channel: "Channel",
  wreck: "Wreck",
  pinnacle: "Pinnacle",
  wall: "Wall",
  cave: "Cave",
};

export async function DiveSiteDetailPage({ slug }: { slug: string }) {
  const site = await getDiveSiteBySlug(slug);
  if (!site) notFound();

  const [activities, comments, mediaItems] = await Promise.all([
    getDivingActivitiesAtSite(site.id),
    getPublishedLocationComments(site.id),
    getMediaForNode(site.id),
  ]);
  const galleryImages = mediaItems.filter((m) => m.role === "gallery").map((m) => m.asset);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLdStringify(
            breadcrumbJsonLd(
              [{ label: "Maldives", href: "/maldives/" }, { label: "Dive Sites", href: "/maldives/dive-sites/" }, { label: site.title }],
              `/maldives/dive-sites/${site.slug}`,
            ),
          ),
        }}
      />

      <PageHero
        breadcrumbs={[
          { label: "Maldives", href: "/maldives/" },
          { label: "Dive Sites", href: "/maldives/dive-sites/" },
          { label: site.title },
        ]}
        eyebrow="Dive site"
        title={site.title}
        description={site.summary ?? undefined}
        image={site.heroImage}
      />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
      <p className="text-xs uppercase tracking-wide text-neutral-500">
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

      <LocationGallerySection title={site.title} images={galleryImages} />

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ocean-900">Share Your Photos</h2>
        <p className="mt-2 text-sm text-neutral-600">Dived {site.title}? Share a few photos — approved submissions are added to the gallery above.</p>
        <div className="mt-4">
          <LocationMediaUploadForm locationId={site.id} />
        </div>
      </section>

      {activities.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Diving activities at {site.title}</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </ul>
        </section>
      )}

      <LocationCommentsSection locationId={site.id} comments={comments} />

      <p className="mt-10 text-sm text-neutral-600">
        Planning a trip?{" "}
        <Link href="/maldives/diving/" className="font-medium text-maldives-600 hover:underline">
          See all Maldives diving activities, packages and dive sites
        </Link>
        .
      </p>
      </div>
    </main>
  );
}
