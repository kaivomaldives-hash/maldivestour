import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PackageCard } from "@/components/packages/package-card";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { getAccommodationBySlug } from "@/lib/accommodations/repository";
import { ACCOMMODATION_TYPE_SEGMENT, type AccommodationType } from "@/lib/accommodations/types";
import { getPackagesByAccommodation } from "@/lib/packages/repository";
import { canonicalUrl } from "@/lib/seo/site";

const TYPE_LABEL: Record<AccommodationType, string> = {
  hotel: "Hotel",
  resort: "Resort",
  guesthouse: "Guesthouse",
  villa: "Villa",
  other: "Accommodation",
};

const PRICE_TIER_LABEL: Record<string, string> = {
  budget: "Budget",
  mid: "Mid-range",
  luxury: "Luxury",
  ultra_luxury: "Ultra-luxury",
};

/**
 * Shared by every accommodation type's [slug] route. `type` must match the
 * requested URL segment — a hotel is only reachable at /maldives/hotels/,
 * never at /maldives/resorts/, even though slugs are globally unique
 * across accommodation types. This is what keeps the canonical URL for a
 * given accommodation to exactly one path.
 */
async function loadAndVerify(type: AccommodationType, slug: string) {
  const accommodation = await getAccommodationBySlug(slug);
  if (!accommodation || accommodation.accommodationType !== type) return null;
  return accommodation;
}

export async function accommodationDetailMetadata(type: AccommodationType, slug: string): Promise<Metadata> {
  const accommodation = await loadAndVerify(type, slug);
  if (!accommodation) return {};

  const title = accommodation.metaTitle ?? `${accommodation.title} | Maldives ${TYPE_LABEL[type]}s | MTG`;
  const description = accommodation.metaDescription ?? accommodation.summary ?? undefined;
  const url = canonicalUrl(`/maldives/${ACCOMMODATION_TYPE_SEGMENT[type]}/${accommodation.slug}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  };
}

export async function AccommodationDetailPage({ type, slug }: { type: AccommodationType; slug: string }) {
  const accommodation = await loadAndVerify(type, slug);
  if (!accommodation) notFound();

  const segment = ACCOMMODATION_TYPE_SEGMENT[type];
  const { primaryLocation, atoll } = accommodation;
  const packages = await getPackagesByAccommodation(accommodation.id);

  return (
    <main>
      <PageHero
        breadcrumbs={[
          { label: "Maldives", href: "/maldives/" },
          { label: `${TYPE_LABEL[type]}s`, href: `/maldives/${segment}/` },
          { label: accommodation.title },
        ]}
        eyebrow={TYPE_LABEL[type]}
        title={accommodation.title}
        description={accommodation.summary ?? undefined}
        image={accommodation.heroImage}
      />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
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
        {accommodation.provider && (
          <div>
            <dt className="text-neutral-500">Operated by</dt>
            <dd className="font-medium">
              <Link href={`/maldives/providers/${accommodation.provider.slug}/`} className="hover:underline">
                {accommodation.provider.title}
              </Link>
            </dd>
          </div>
        )}
      </dl>

      {packages.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Packages featuring {accommodation.title}</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </ul>
        </section>
      )}

      {/* Booking/inquiry UI is not built yet — Task 5 only establishes the
          bookable_products relationship (see accommodation.isBookable). */}
      </div>
    </main>
  );
}
