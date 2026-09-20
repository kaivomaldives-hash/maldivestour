import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { CARD_CLASS } from "@/components/ui/card";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { ACCOMMODATION_TYPE_SEGMENT } from "@/lib/accommodations/types";
import { activityHref } from "@/lib/activities/types";
import { getPackageBySlug } from "@/lib/packages/repository";
import type { PackageItineraryItem } from "@/lib/packages/types";
import { canonicalUrl } from "@/lib/seo/site";

function accommodationHref(accommodation: { accommodationType: keyof typeof ACCOMMODATION_TYPE_SEGMENT; slug: string }): string {
  return `/maldives/${ACCOMMODATION_TYPE_SEGMENT[accommodation.accommodationType]}/${accommodation.slug}/`;
}

const ROLE_LABEL: Record<PackageItineraryItem["componentRole"], string> = {
  accommodation: "Stay",
  activity: "Activity",
  transfer: "Transfer",
  meal: "Meal",
  free_time: "Free time",
  excursion: "Excursion",
  other: "Other",
};

export async function packageDetailMetadata(slug: string): Promise<Metadata> {
  const pkg = await getPackageBySlug(slug);
  if (!pkg) return {};

  const title = pkg.metaTitle ?? `${pkg.title} | Maldives Packages | MTG`;
  const description = pkg.metaDescription ?? pkg.summary ?? undefined;
  const url = canonicalUrl(`/maldives/packages/${pkg.slug}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  };
}

function ItineraryItemRow({ item }: { item: PackageItineraryItem }) {
  return (
    <li className="border-t border-neutral-100 pt-2 first:border-t-0 first:pt-0">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-neutral-500">{ROLE_LABEL[item.componentRole]}</span>
      </div>

      {item.accommodation && (
        <Link href={accommodationHref(item.accommodation)} className="font-medium hover:underline">
          {item.accommodation.title}
        </Link>
      )}

      {item.activity && (
        <Link href={activityHref(item.activity)} className="font-medium hover:underline">
          {item.activity.title}
        </Link>
      )}

      {item.transferService && (
        <div className="font-medium">
          {item.transferRoute ? (
            <Link href={`/maldives/transfers/${item.transferRoute.slug}/`} className="hover:underline">
              {item.transferRoute.title}
            </Link>
          ) : (
            "Transfer"
          )}
          {item.transferService.provider && <span className="ml-1 font-normal text-neutral-600">— {item.transferService.provider.title}</span>}
        </div>
      )}

      {!item.accommodation && !item.activity && !item.transferService && <p className="font-medium text-neutral-700">{ROLE_LABEL[item.componentRole]}</p>}

      {item.notes && <p className="mt-0.5 text-sm text-neutral-600">{item.notes}</p>}
    </li>
  );
}

export async function PackageDetailPage({ slug }: { slug: string }) {
  const pkg = await getPackageBySlug(slug);
  if (!pkg) notFound();

  const allTags = [...pkg.travelerTypes, ...pkg.styles, ...(pkg.durationBand ? [pkg.durationBand] : []), ...pkg.themes, ...pkg.inclusions];

  return (
    <main>
      <PageHero
        breadcrumbs={[
          { label: "Maldives", href: "/maldives/" },
          { label: "Packages", href: "/maldives/packages/" },
          { label: pkg.title },
        ]}
        eyebrow="Package"
        title={pkg.title}
        description={pkg.summary ?? undefined}
        meta={
          pkg.isMtgCurated ? (
            <Badge tone="aqua">MTG-curated itinerary</Badge>
          ) : pkg.provider ? (
            <span className="text-neutral-600">
              Operated by{" "}
              <Link href={`/maldives/providers/${pkg.provider.slug}/`} className="text-maldives-600 underline">
                {pkg.provider.title}
              </Link>
            </span>
          ) : undefined
        }
      />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 text-sm">
          {allTags.map((tag) => (
            <span key={tag.id} className="rounded-full border border-neutral-300 px-3 py-1 text-neutral-700">
              {tag.title}
            </span>
          ))}
        </div>
      )}

      <dl className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
        {pkg.durationNights !== null && (
          <div>
            <dt className="text-neutral-500">Duration</dt>
            <dd className="font-medium">
              {pkg.durationNights} night{pkg.durationNights === 1 ? "" : "s"}
            </dd>
          </div>
        )}
        <div>
          <dt className="text-neutral-500">Price</dt>
          <dd className="font-medium">
            {pkg.priceFrom !== null ? `From ${pkg.currency ?? "USD"} ${pkg.priceFrom}` : "Quote on request"}
          </dd>
        </div>
        {pkg.destinations.length > 0 && (
          <div>
            <dt className="text-neutral-500">Destinations</dt>
            <dd className="font-medium">
              {pkg.destinations.map((destination, index) => (
                <span key={destination.id}>
                  {index > 0 && ", "}
                  <Link href={`/maldives/islands/${destination.slug}/`} className="hover:underline">
                    {destination.title}
                  </Link>
                </span>
              ))}
            </dd>
          </div>
        )}
      </dl>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ocean-900">Itinerary</h2>
        {pkg.stages.length === 0 ? (
          <p className="mt-2 text-sm text-neutral-600">No itinerary recorded for this package yet.</p>
        ) : (
          <ol className="mt-4 space-y-6">
            {pkg.stages.map((stage) => (
              <li key={stage.id} className={CARD_CLASS}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg font-medium text-ocean-900">
                    {stage.title ?? `Days ${stage.dayStart}–${stage.dayEnd}`}
                  </h3>
                  <span className="text-sm text-neutral-500">
                    {stage.dayStart === stage.dayEnd ? `Day ${stage.dayStart}` : `Days ${stage.dayStart}–${stage.dayEnd}`}
                    {stage.nightCount > 0 && ` · ${stage.nightCount} night${stage.nightCount === 1 ? "" : "s"}`}
                  </span>
                </div>
                {stage.description && <p className="mt-2 text-sm text-neutral-700">{stage.description}</p>}
                {stage.items.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {stage.items.map((item) => (
                      <ItineraryItemRow key={item.id} item={item} />
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        )}
      </section>

      {/* Booking/inquiry UI is not built yet — Task 11 only establishes the
          bookable_products relationship (see pkg.isBookable). */}
      </div>
    </main>
  );
}
