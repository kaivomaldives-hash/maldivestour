import type { Metadata } from "next";
import Link from "next/link";

import { ActivityCard } from "@/components/activity/activity-card";
import { Breadcrumbs } from "@/components/location/breadcrumbs";
import {
  getFishingActivities,
  getFishingActivitiesByType,
  getFishingTypesInUse,
  searchFishingActivities,
} from "@/lib/fishing/repository";
import { getAtollBySlug, getIslandBySlug } from "@/lib/locations/repository";
import { canonicalUrl } from "@/lib/seo/site";

const PAGE_SIZE = 24;

export interface FishingDirectorySearchParams {
  q?: string;
  page?: string;
  type?: string;
  atoll?: string;
  island?: string;
}

function hasAnyFilter(sp: FishingDirectorySearchParams): boolean {
  return Boolean(sp.q || sp.type || sp.atoll || sp.island);
}

export async function fishingDirectoryMetadata(searchParams: Promise<FishingDirectorySearchParams>): Promise<Metadata> {
  const sp = await searchParams;
  const title = "Fishing in the Maldives | MTG";
  const description = "Real, source-verified fishing trips and operators in the Maldives, by type, atoll, and island.";
  const url = canonicalUrl("/maldives/fishing");

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
    // A type/atoll/island/search filter is a discovery view, not a
    // canonical page — same rule applied throughout (islands, activities,
    // accommodations).
    robots: hasAnyFilter(sp) ? { index: false, follow: true } : undefined,
  };
}

export async function FishingDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<FishingDirectorySearchParams>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const query = sp.q?.trim() ?? "";
  const isSearching = query.length > 0;

  const [atoll, island, fishingTypes] = await Promise.all([
    sp.atoll ? getAtollBySlug(sp.atoll) : Promise.resolve(null),
    sp.island ? getIslandBySlug(sp.island) : Promise.resolve(null),
    getFishingTypesInUse(),
  ]);

  const activeType = sp.type ? fishingTypes.find((t) => t.slug === sp.type) : undefined;
  const locationOptions = { atollId: island ? undefined : atoll?.id, locationId: island?.id };

  const results = isSearching
    ? {
        items: (await searchFishingActivities(query, { limit: 100 })),
        total: 0,
        page: 1,
        pageSize: 100,
      }
    : activeType
      ? await getFishingActivitiesByType(activeType.slug, { page, pageSize: PAGE_SIZE, ...locationOptions })
      : await getFishingActivities({ page, pageSize: PAGE_SIZE, ...locationOptions });

  const totalPages = isSearching ? 1 : Math.max(1, Math.ceil(results.total / PAGE_SIZE));

  const baseParams = new URLSearchParams();
  if (sp.type) baseParams.set("type", sp.type);
  if (sp.atoll) baseParams.set("atoll", sp.atoll);
  if (sp.island) baseParams.set("island", sp.island);
  const baseQuery = baseParams.toString();

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Breadcrumbs items={[{ label: "Maldives", href: "/maldives/" }, { label: "Fishing" }]} />
      <h1 className="mt-4 text-3xl font-semibold">Fishing in the Maldives</h1>
      <p className="mt-3 text-neutral-700">
        Real, individually verified fishing trips and operators — sourced from official operator and resort
        information rather than a generic directory. See{" "}
        <Link href="/maldives/activities/" className="underline">
          all activities
        </Link>{" "}
        for other things to do.
      </p>

      {(atoll || island) && (
        <p className="mt-3 text-sm text-neutral-600">
          Filtered to {island ? island.title : atoll?.title}.{" "}
          <Link href="/maldives/fishing/" className="underline">
            Clear
          </Link>
        </p>
      )}

      {fishingTypes.length > 0 && (
        <nav aria-label="Filter by fishing type" className="mt-6 flex flex-wrap gap-2 text-sm">
          <Link
            href="/maldives/fishing/"
            className={`rounded-full border px-3 py-1 ${!activeType ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-300"}`}
          >
            All types
          </Link>
          {fishingTypes.map((type) => (
            <Link
              key={type.id}
              href={`/maldives/fishing/?type=${type.slug}`}
              className={`rounded-full border px-3 py-1 ${activeType?.id === type.id ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-300"}`}
            >
              {type.title}
            </Link>
          ))}
        </nav>
      )}

      <form method="get" className="mt-4 flex gap-2">
        <label htmlFor="fishing-search" className="sr-only">
          Search fishing activities
        </label>
        <input
          id="fishing-search"
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Search fishing trips…"
          className="w-full max-w-sm rounded border border-neutral-300 px-3 py-2 text-sm"
        />
        <button type="submit" className="rounded bg-neutral-900 px-4 py-2 text-sm text-white">
          Search
        </button>
      </form>

      {results.items.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-600">No fishing activities recorded for this filter yet.</p>
      ) : (
        <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {results.items.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </ul>
      )}

      {!isSearching && totalPages > 1 && (
        <nav aria-label="Pagination" className="mt-8 flex items-center gap-4 text-sm">
          {page > 1 && (
            <Link href={`/maldives/fishing/?${baseQuery ? baseQuery + "&" : ""}page=${page - 1}`} className="hover:underline">
              ← Previous
            </Link>
          )}
          <span className="text-neutral-500">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/maldives/fishing/?${baseQuery ? baseQuery + "&" : ""}page=${page + 1}`} className="hover:underline">
              Next →
            </Link>
          )}
        </nav>
      )}
    </main>
  );
}
