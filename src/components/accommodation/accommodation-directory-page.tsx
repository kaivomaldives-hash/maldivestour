import type { Metadata } from "next";
import Link from "next/link";

import { AccommodationCard } from "@/components/accommodation/accommodation-card";
import { Breadcrumbs } from "@/components/location/breadcrumbs";
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
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Breadcrumbs items={[{ label: "Maldives", href: "/maldives/" }, { label }]} />
      <h1 className="mt-4 text-3xl font-semibold">{label} in the Maldives</h1>
      {(atoll || island) && (
        <p className="mt-1 text-sm text-neutral-600">
          Filtered to {island ? island.title : atoll?.title}.{" "}
          <Link href={`/maldives/${segment}/`} className="underline">
            Clear
          </Link>
        </p>
      )}

      <form method="get" className="mt-6 flex gap-2">
        <label htmlFor={`${segment}-search`} className="sr-only">
          Search {label.toLowerCase()}
        </label>
        <input
          id={`${segment}-search`}
          type="search"
          name="q"
          defaultValue={query}
          placeholder={`Search ${label.toLowerCase()}…`}
          className="w-full max-w-sm rounded border border-neutral-300 px-3 py-2 text-sm"
        />
        <button type="submit" className="rounded bg-neutral-900 px-4 py-2 text-sm text-white">
          Search
        </button>
      </form>

      {results.items.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-600">
          No {label.toLowerCase()} recorded {island || atoll ? "for this location " : ""}yet.
        </p>
      ) : (
        <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {results.items.map((accommodation) => (
            <AccommodationCard key={accommodation.id} accommodation={accommodation} />
          ))}
        </ul>
      )}

      {!isSearching && totalPages > 1 && (
        <nav aria-label="Pagination" className="mt-8 flex items-center gap-4 text-sm">
          {page > 1 && (
            <Link href={`/maldives/${segment}/?page=${page - 1}`} className="hover:underline">
              ← Previous
            </Link>
          )}
          <span className="text-neutral-500">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/maldives/${segment}/?page=${page + 1}`} className="hover:underline">
              Next →
            </Link>
          )}
        </nav>
      )}
    </main>
  );
}
