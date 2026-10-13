import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { AccommodationCard } from "@/components/accommodation/accommodation-card";
import { ActivityCard } from "@/components/activity/activity-card";
import { ArticleCard } from "@/components/articles/article-card";
import { DiveSiteCard } from "@/components/diving/dive-site-card";
import { IslandCard } from "@/components/locations/island-card";
import { LocationMap } from "@/components/locations/location-map";
import { PackageCard } from "@/components/packages/package-card";
import { SurfBreakCard } from "@/components/surfing/surf-break-card";
import { TransferRouteCard } from "@/components/transfers/transfer-route-card";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { getAccommodationsByAtoll } from "@/lib/accommodations/repository";
import { getActivitiesByAtoll } from "@/lib/activities/repository";
import { getArticlesRelatedToNodes } from "@/lib/articles/repository";
import { getDiveSitesByAtoll } from "@/lib/diving/repository";
import { applyContextualLinks, escapeHtml } from "@/lib/linking/contextual-links";
import { buildEntityLinkMap } from "@/lib/linking/entity-link-map";
import { getAtollBySlug, getAtollContent, getIslandsByAtoll } from "@/lib/locations/repository";
import { LocationGallerySection } from "@/components/locations/location-gallery-section";
import { getHeroMediaByNodeIds, getMediaForNode } from "@/lib/media/repository";
import { getPackageViewsByAtoll } from "@/lib/packages/view-repository";
import { breadcrumbJsonLd, canonicalUrl, safeJsonLdStringify } from "@/lib/seo/site";
import { getSurfBreaksByAtoll } from "@/lib/surfing/repository";
import { getTransferRoutesByAtoll } from "@/lib/transfers/repository";

/** Every "<Thing> in {atoll.title}" section below (resorts, fishing, diving,
 * dive sites, surfing, surf breaks, other activities, transfers, packages,
 * related guides) is this same card-grid shape — hidden entirely when its
 * list is empty. `description` covers the few sections that add a line of
 * copy (or a conditional link) above the grid. */
function AtollCardSection<T>({
  title,
  items,
  renderItem,
  description,
  sectionClassName = "mt-10",
}: {
  title: string;
  items: T[];
  renderItem: (item: T) => ReactNode;
  description?: ReactNode;
  sectionClassName?: string;
}) {
  if (items.length === 0) return null;
  return (
    <section className={sectionClassName}>
      <h2 className="text-xl font-semibold text-ocean-900">{title}</h2>
      {description}
      <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">{items.map(renderItem)}</ul>
    </section>
  );
}

function touristDestinationJsonLd(atoll: NonNullable<Awaited<ReturnType<typeof getAtollBySlug>>>) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: atoll.title,
    description: atoll.summary ?? undefined,
    address: { "@type": "PostalAddress", addressCountry: "MV" },
    url: canonicalUrl(`/maldives/atolls/${atoll.slug}`),
  };
}

export async function AtollDetailPage({ slug }: { slug: string }) {
  const atoll = await getAtollBySlug(slug);
  if (!atoll) notFound();

  const [heroById, allIslands, content, accommodations, activities, diveSites, surfBreaks, transferRoutes, packages, relatedGuides, entityMap, mediaItems] =
    await Promise.all([
      getHeroMediaByNodeIds([atoll.id]),
      getIslandsByAtoll(slug),
      getAtollContent(atoll.id),
      getAccommodationsByAtoll(atoll.id),
      getActivitiesByAtoll(atoll.id),
      getDiveSitesByAtoll(atoll.id),
      getSurfBreaksByAtoll(atoll.id),
      getTransferRoutesByAtoll(atoll.id),
      getPackageViewsByAtoll(atoll.id),
      getArticlesRelatedToNodes([atoll.id]),
      buildEntityLinkMap(),
      getMediaForNode(atoll.id),
    ]);
  const galleryImages = mediaItems.filter((m) => m.role === "gallery").map((m) => m.asset);

  // Contextual entity linking (Task 23 §67-68) over the atoll's own "About"
  // prose, same engine and rules as article bodies — never links the atoll's
  // own page.
  const aboutHtml =
    content && content.sections.length > 0
      ? applyContextualLinks(
          content.sections
            .map((s) => `<h3>${escapeHtml(s.heading)}</h3>${s.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("")}`)
            .join(""),
          entityMap,
          { excludeHref: `/maldives/atolls/${atoll.slug}/` },
        )
      : null;
  const heroImage = heroById.get(atoll.id) ?? null;
  // getIslandsByAtoll returns every location_type="island" row under this
  // atoll, which now includes uninhabited resort islands (added in Task 5
  // to give resorts a real location to attach to) alongside the inhabited
  // islands Task 4 seeded — split them rather than mislabel the count.
  const islands = allIslands.filter((island) => island.isInhabited !== false);
  // Visit Maldives' own atoll pages consistently separate local-island
  // guesthouses/hotels from private-island resorts rather than listing
  // every stay together — real, verifiable structural pattern (checked
  // against their site), applied here with our own real accommodationType
  // data, not copied content.
  const resortAccommodations = accommodations.filter((a) => a.accommodationType === "resort");
  const localStayAccommodations = accommodations.filter((a) => a.accommodationType !== "resort");

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLdStringify(
            breadcrumbJsonLd(
              [{ label: "Maldives", href: "/maldives/" }, { label: "Atolls", href: "/maldives/atolls/" }, { label: atoll.title }],
              `/maldives/atolls/${atoll.slug}`,
            ),
          ),
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(touristDestinationJsonLd(atoll)) }} />

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

      <LocationMap title={atoll.title} lat={atoll.lat} lng={atoll.lng} />

      {aboutHtml && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-ocean-900">About {atoll.title}</h2>
          <div
            className="[&_h3]:mt-5 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-ocean-900 [&_p]:mt-2 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-neutral-700 [&_a]:text-maldives-600 [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: aboutHtml }}
          />
        </section>
      )}

      <LocationGallerySection title={atoll.title} images={galleryImages} />

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ocean-900">Islands in {atoll.title}</h2>
        {islands.length === 0 ? (
          <p className="mt-2 text-sm text-neutral-600">No islands recorded for this atoll yet.</p>
        ) : (
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {islands.map((island) => (
              <IslandCard key={island.id} island={island} />
            ))}
          </ul>
        )}
      </section>

      <AtollCardSection
        title={`Resorts in ${atoll.title}`}
        items={resortAccommodations}
        description={<p className="mt-1 text-sm text-neutral-600">Private island resorts, each its own destination.</p>}
        renderItem={(accommodation) => <AccommodationCard key={accommodation.id} accommodation={accommodation} />}
      />

      <AtollCardSection
        title={`Guesthouses & Hotels in ${atoll.title}`}
        items={localStayAccommodations}
        description={<p className="mt-1 text-sm text-neutral-600">Stays on real local islands, inside their communities.</p>}
        renderItem={(accommodation) => <AccommodationCard key={accommodation.id} accommodation={accommodation} />}
      />

      <AtollCardSection
        title={`Fishing in ${atoll.title}`}
        items={fishingActivities}
        description={
          // Gaafu Alifu is Emperor's real home base (see
          // src/components/fishing/emperor-page.tsx) — same reinforcing
          // link as the Maamendhoo island page, no duplicated content.
          atoll.slug === "gaafu-alifu" ? (
            <p className="mt-2 text-sm text-neutral-700">
              Home base of{" "}
              <Link href="/maldives/fishing/emperor/" className="text-maldives-600 hover:underline">
                Emperor, our private fishing charter
              </Link>
              .
            </p>
          ) : undefined
        }
        renderItem={(activity) => <ActivityCard key={activity.id} activity={activity} />}
      />

      <AtollCardSection title={`Diving in ${atoll.title}`} items={divingActivities} renderItem={(activity) => <ActivityCard key={activity.id} activity={activity} />} />

      <AtollCardSection title={`Dive sites in ${atoll.title}`} items={diveSites} renderItem={(site) => <DiveSiteCard key={site.id} site={site} />} />

      <AtollCardSection title={`Surfing in ${atoll.title}`} items={surfingActivities} renderItem={(activity) => <ActivityCard key={activity.id} activity={activity} />} />

      <AtollCardSection title={`Surf breaks in ${atoll.title}`} items={surfBreaks} renderItem={(surfBreak) => <SurfBreakCard key={surfBreak.id} surfBreak={surfBreak} />} />

      <AtollCardSection title={`Activities in ${atoll.title}`} items={otherActivities} renderItem={(activity) => <ActivityCard key={activity.id} activity={activity} />} />

      <AtollCardSection title={`Transfers in ${atoll.title}`} items={transferRoutes} renderItem={(route) => <TransferRouteCard key={route.id} route={route} />} />

      <AtollCardSection title={`Packages featuring ${atoll.title}`} items={packages} renderItem={(pkg) => <PackageCard key={pkg.id} pkg={pkg} />} />

      <AtollCardSection
        title={`${atoll.title} Travel Guides`}
        items={relatedGuides}
        sectionClassName="mt-12 border-t border-neutral-200 pt-10"
        renderItem={(article) => <ArticleCard key={article.id} article={article} />}
      />

      <p className="mt-10 text-sm text-neutral-600">
        <Link href="/maldives/atolls/" className="font-medium text-maldives-600 hover:underline">
          Explore other Maldives atolls →
        </Link>
      </p>

      {content && (
        <p className="mt-4 text-xs text-neutral-500">
          Destination content on this page is drawn from MTG&rsquo;s own previously published Maldives guide.
        </p>
      )}
      </div>
    </main>
  );
}
