import Link from "next/link";
import { notFound } from "next/navigation";

import { loadAndVerify, TYPE_LABEL } from "@/components/accommodation/accommodation-detail-metadata";
import { NearbyActivitiesSection } from "@/components/activity/nearby-activities-section";
import { GallerySection } from "@/components/accommodation/gallery-section";
import { RoomsSection } from "@/components/accommodation/rooms-section";
import { TypicalAmenitiesSection } from "@/components/accommodation/typical-amenities-section";
import { accommodationVideoJsonLd } from "@/components/accommodation/accommodation-video-jsonld";
import { VideoSection } from "@/components/accommodation/video-section";
import { ArticleCard } from "@/components/articles/article-card";
import { AttractionCard } from "@/components/attractions/attraction-card";
import { NodeInquiryForm } from "@/components/bookings/node-inquiry-form";
import { RegisterEntityLocaleLinks } from "@/components/i18n/entity-locale-links-context";
import { LocationMap } from "@/components/locations/location-map";
import { PackageCard } from "@/components/packages/package-card";
import { ReviewsSection } from "@/components/reviews/reviews-section";
import { TransferRouteCard } from "@/components/transfers/transfer-route-card";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { ACCOMMODATION_TYPE_SEGMENT, type AccommodationType } from "@/lib/accommodations/types";
import { getNearbyActivities } from "@/lib/activities/repository";
import { getArticlesRelatedToNodes } from "@/lib/articles/repository";
import { getNearbyAttractions } from "@/lib/attractions/repository";
import { bookingCta } from "@/lib/bookings/copy";
import { getEntityLocalePaths } from "@/lib/i18n/repository";
import { getPackageViewsByAccommodation } from "@/lib/packages/view-repository";
import { getReviewsForNode } from "@/lib/reviews/repository";
import { breadcrumbJsonLd, safeJsonLdStringify } from "@/lib/seo/site";
import { getTransferRoutesByLocation } from "@/lib/transfers/repository";

const PRICE_TIER_LABEL: Record<string, string> = {
  budget: "Budget",
  mid: "Mid-range",
  luxury: "Luxury",
  ultra_luxury: "Ultra-luxury",
};

export async function AccommodationDetailPage({ type, slug }: { type: AccommodationType; slug: string }) {
  const accommodation = await loadAndVerify(type, slug);
  if (!accommodation) notFound();

  const segment = ACCOMMODATION_TYPE_SEGMENT[type];
  const { primaryLocation, atoll } = accommodation;
  const locationFilter = { islandId: primaryLocation?.id ?? null, atollId: atoll?.id ?? null };
  const [packages, nearbyActivities, nearbyAttractions, transferRoutes, relatedGuides, reviews, localePaths] = await Promise.all([
    getPackageViewsByAccommodation(accommodation.id),
    getNearbyActivities(locationFilter),
    getNearbyAttractions(locationFilter),
    primaryLocation ? getTransferRoutesByLocation(primaryLocation.id) : Promise.resolve([]),
    getArticlesRelatedToNodes([accommodation.id, primaryLocation?.id, atoll?.id].filter((id): id is string => Boolean(id))),
    getReviewsForNode(accommodation.id),
    getEntityLocalePaths(accommodation.id, accommodation.slug, `/maldives/${segment}/`),
  ]);

  const videoJsonLd = accommodationVideoJsonLd(accommodation.videoYoutubeId, accommodation.title, accommodation.summary, accommodation.publishedAt);
  const breadcrumbs = [
    { label: "Maldives", href: "/maldives/" },
    { label: `${TYPE_LABEL[type]}s`, href: `/maldives/${segment}/` },
    { label: accommodation.title },
  ];

  return (
    <main>
      <RegisterEntityLocaleLinks paths={localePaths} fallbackHubPath={`/maldives/${segment}/`} />
      {/* Task 17 audit: every other detail-page type already emits this;
          accommodation had the visual breadcrumb via PageHero below but no
          matching structured data. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(breadcrumbJsonLd(breadcrumbs, `/maldives/${segment}/${accommodation.slug}`)) }}
      />
      {videoJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(videoJsonLd) }} />
      )}
      <PageHero
        breadcrumbs={breadcrumbs}
        eyebrow={TYPE_LABEL[type]}
        title={accommodation.title}
        description={accommodation.summary ?? undefined}
        image={accommodation.heroImage}
      />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
      {/* Fixed order below per the site owner's spec, same for every
          hotel/guesthouse/resort: quick facts → overview → video
          (admin-added only) → gallery → map → rooms → nearby activities
          (add-ons) → transfer options → reviews. Everything else keeps
          its previous relative order, after this block. */}
      <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-neutral-500">Type</dt>
          <dd className="font-medium">{TYPE_LABEL[type]}</dd>
        </div>
        {accommodation.starRating && (
          <div>
            <dt className="text-neutral-500">Star rating</dt>
            <dd className="font-medium">{accommodation.starRating}★</dd>
          </div>
        )}
        {accommodation.priceTier && (
          <div>
            <dt className="text-neutral-500">Price tier</dt>
            <dd className="font-medium">{PRICE_TIER_LABEL[accommodation.priceTier] ?? accommodation.priceTier}</dd>
          </div>
        )}
        {accommodation.roomCount && (
          <div>
            <dt className="text-neutral-500">Rooms</dt>
            <dd className="font-medium">{accommodation.roomCount}</dd>
          </div>
        )}
        {accommodation.allInclusive !== null && (
          <div>
            <dt className="text-neutral-500">All-inclusive</dt>
            <dd className="font-medium">{accommodation.allInclusive ? "Yes" : "No"}</dd>
          </div>
        )}
        {accommodation.overwaterVillas !== null && (
          <div>
            <dt className="text-neutral-500">Overwater villas</dt>
            <dd className="font-medium">{accommodation.overwaterVillas ? "Yes" : "No"}</dd>
          </div>
        )}
        {primaryLocation && (
          <div>
            <dt className="text-neutral-500">Island</dt>
            <dd className="font-medium">
              <Link href={`/maldives/islands/${primaryLocation.slug}/`} className="hover:underline">
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
      </dl>

      {accommodation.overviewParagraphs.length > 0 && (
        <section className="mt-8 max-w-3xl space-y-4 text-neutral-700">
          {accommodation.overviewParagraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </section>
      )}

      <VideoSection youtubeId={accommodation.videoYoutubeId} accommodationTitle={accommodation.title} />

      <GallerySection images={accommodation.galleryImages} accommodationTitle={accommodation.title} />

      <LocationMap title={accommodation.title} lat={primaryLocation?.lat ?? null} lng={primaryLocation?.lng ?? null} />

      <RoomsSection rooms={accommodation.rooms} accommodationTitle={accommodation.title} />

      <NearbyActivitiesSection
        nearby={nearbyActivities}
        heading={`Things to Do in ${accommodation.title}`}
        islandTitle={primaryLocation?.title ?? null}
        atollTitle={atoll?.title ?? null}
        viewAllHref="/maldives/activities/"
      />

      {transferRoutes.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Getting Here</h2>
          <p className="mt-1 text-sm text-neutral-600">Real, source-verified transfer routes to and from {primaryLocation?.title ?? accommodation.title}.</p>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {transferRoutes.slice(0, 6).map((route) => (
              <TransferRouteCard key={route.id} route={route} />
            ))}
          </ul>
          <Link href="/maldives/transfers/" className="mt-4 inline-block text-sm font-medium text-maldives-600 hover:text-ocean-800 hover:underline">
            View all transfers →
          </Link>
        </section>
      )}

      <ReviewsSection nodeId={accommodation.id} reviews={reviews} subjectLabel={TYPE_LABEL[type].toLowerCase()} />

      {accommodation.isBookable && (
        <section className="mt-10 rounded-2xl border border-neutral-200 p-6">
          <h2 className="text-xl font-semibold text-ocean-900">Request an Offer</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Prices change with season and availability — tell us your dates and we&rsquo;ll send current rates for {accommodation.title}.
          </p>
          <div className="mt-4">
            <NodeInquiryForm
              productNodeId={accommodation.id}
              productTitle={accommodation.title}
              source="accommodation"
              submitLabel={bookingCta("accommodation").submitLabel}
              showAccommodationFields
              roomOptions={accommodation.rooms.map((room) => room.name)}
            />
          </div>
        </section>
      )}

      <TypicalAmenitiesSection accommodationType={accommodation.accommodationType} />

      {(nearbyAttractions.islandAttractions.length > 0 || nearbyAttractions.atollAttractions.length > 0) && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Nearby Attractions</h2>
          <p className="mt-1 text-sm text-neutral-600">Real places to visit in the area — not bookable, just worth knowing about during your stay.</p>
          {nearbyAttractions.islandAttractions.length > 0 && (
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {nearbyAttractions.islandAttractions.map((attraction) => (
                <AttractionCard key={attraction.id} attraction={attraction} />
              ))}
            </ul>
          )}
          {nearbyAttractions.atollAttractions.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">More Attractions in {atoll?.title ?? "the Area"}</h3>
              <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {nearbyAttractions.atollAttractions.map((attraction) => (
                  <AttractionCard key={attraction.id} attraction={attraction} />
                ))}
              </ul>
            </div>
          )}
          <Link href="/maldives/attractions/" className="mt-4 inline-block text-sm font-medium text-maldives-600 hover:text-ocean-800 hover:underline">
            View all attractions →
          </Link>
        </section>
      )}

      {packages.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Packages featuring {accommodation.title}</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </ul>
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ocean-900">Browse Packages by Style</h2>
        <nav aria-label="Package categories" className="mt-4 flex flex-wrap gap-2">
          {[
            { href: "/maldives/packages/luxury/", label: "Luxury" },
            { href: "/maldives/packages/honeymoon/", label: "Honeymoon" },
            { href: "/maldives/packages/family/", label: "Family" },
            { href: "/maldives/packages/adults-only/", label: "Adults-Only" },
            { href: "/maldives/packages/diving/", label: "Diving" },
            { href: "/maldives/packages/liveaboard/", label: "Liveaboard" },
            { href: "/maldives/packages/", label: "All Packages" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:border-maldives-500 hover:text-maldives-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </section>

      {relatedGuides.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-ocean-900">{accommodation.title} Travel Guides</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {relatedGuides.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </ul>
        </section>
      )}

      </div>
    </main>
  );
}
