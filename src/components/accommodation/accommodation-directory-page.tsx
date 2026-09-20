import type { Metadata } from "next";
import Link from "next/link";

import { AccommodationCard } from "@/components/accommodation/accommodation-card";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHero } from "@/components/ui/page-hero";
import { Pagination } from "@/components/ui/pagination";
import { getAccommodations, searchAccommodations } from "@/lib/accommodations/repository";
import { ACCOMMODATION_TYPE_SEGMENT, type AccommodationType, type PriceTier } from "@/lib/accommodations/types";
import { getAtollBySlug, getIslandBySlug } from "@/lib/locations/repository";
import { canonicalUrl } from "@/lib/seo/site";

const TYPE_LABEL: Record<AccommodationType, string> = {
  hotel: "Hotels",
  resort: "Resorts",
  guesthouse: "Guesthouses",
  villa: "Villas",
  other: "Accommodation",
};

const PAGE_SIZE = 24;

export interface AccommodationDirectorySearchParams {
  q?: string;
  page?: string;
  atoll?: string;
  island?: string;
  priceTier?: string;
  starRating?: string;
  allInclusive?: string;
  overwater?: string;
}

function hasAnyFilter(sp: AccommodationDirectorySearchParams): boolean {
  return Boolean(sp.q || sp.atoll || sp.island || sp.priceTier || sp.starRating || sp.allInclusive || sp.overwater);
}

export async function accommodationDirectoryMetadata(
  type: AccommodationType,
  searchParams: Promise<AccommodationDirectorySearchParams>,
): Promise<Metadata> {
  const sp = await searchParams;
  const segment = ACCOMMODATION_TYPE_SEGMENT[type];
  const label = TYPE_LABEL[type];
  const title = `Maldives ${label} | MTG`;
  const description = `${label} in the Maldives, by atoll and island.`;
  const url = canonicalUrl(`/maldives/${segment}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
    // Any filter/search state is a discovery view, not a canonical page —
    // keep it out of the index (matches the /maldives/islands/ pattern).
    robots: hasAnyFilter(sp) ? { index: false, follow: true } : undefined,
  };
}

export async function AccommodationDirectoryPage({
  type,
  searchParams,
}: {
  type: AccommodationType;
  searchParams: Promise<AccommodationDirectorySearchParams>;
}) {
  const sp = await searchParams;
  const segment = ACCOMMODATION_TYPE_SEGMENT[type];
  const label = TYPE_LABEL[type];
  const page = Math.max(1, Number(sp.page) || 1);
  const query = sp.q?.trim() ?? "";
  const isSearching = query.length > 0;

  const [atoll, island] = await Promise.all([
    sp.atoll ? getAtollBySlug(sp.atoll) : Promise.resolve(null),
    sp.island ? getIslandBySlug(sp.island) : Promise.resolve(null),
  ]);

  const results = isSearching
    ? { items: (await searchAccommodations(query, { limit: 100 })).filter((a) => a.accommodationType === type), total: 0, page: 1, pageSize: 100 }
    : await getAccommodations({
        type,
        page,
        pageSize: PAGE_SIZE,
        atollId: island ? undefined : atoll?.id,
        locationId: island?.id,
        priceTier: sp.priceTier as PriceTier | undefined,
        starRating: sp.starRating ? Number(sp.starRating) : undefined,
        allInclusive: sp.allInclusive === "true" ? true : undefined,
        overwaterVillas: sp.overwater === "true" ? true : undefined,
      });

  const totalPages = isSearching ? 1 : Math.max(1, Math.ceil(results.total / PAGE_SIZE));

  return (
    <main>
      <PageHero
        breadcrumbs={[{ label: "Maldives", href: "/maldives/" }, { label }]}
        eyebrow="Places to stay"
        title={`${label} in the Maldives`}
        description={(atoll || island) ? undefined : `Real, individually verified ${label.toLowerCase()} across the Maldives.`}
      />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
        {(atoll || island) && (
          <p className="text-sm text-neutral-600">
            Filtered to {island ? island.title : atoll?.title}.{" "}
            <Link href={`/maldives/${segment}/`} className="underline">
              Clear
            </Link>
          </p>
        )}

        <form method="get" className="mt-2 flex gap-2">
          <label htmlFor={`${segment}-search`} className="sr-only">
            Search {label.toLowerCase()}
          </label>
          <input
            id={`${segment}-search`}
            type="search"
            name="q"
            defaultValue={query}
            placeholder={`Search ${label.toLowerCase()}…`}
            className="w-full max-w-sm rounded-full border border-neutral-300 px-4 py-2 text-sm focus:border-maldives-500 focus:outline-none"
          />
          <button type="submit" className="rounded-full bg-maldives-600 px-4 py-2 text-sm font-medium text-white hover:bg-ocean-800">
            Search
          </button>
        </form>

        {results.items.length === 0 ? (
          <EmptyState
            title={`No ${label.toLowerCase()} recorded ${island || atoll ? "for this location " : ""}yet`}
          />
        ) : (
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {results.items.map((accommodation) => (
              <AccommodationCard key={accommodation.id} accommodation={accommodation} />
            ))}
          </ul>
        )}

        {!isSearching && <Pagination page={page} totalPages={totalPages} basePath={`/maldives/${segment}/`} />}
      </div>
    </main>
  );
}
