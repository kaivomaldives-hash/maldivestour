import type { Metadata } from "next";
import Link from "next/link";

import { ActivityCard } from "@/components/activity/activity-card";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHero } from "@/components/ui/page-hero";
import { Pagination } from "@/components/ui/pagination";
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
    <main>
      <PageHero
        breadcrumbs={[{ label: "Maldives", href: "/maldives/" }, { label: "Fishing" }]}
        eyebrow="Things to do"
        title="Fishing in the Maldives"
        description="Real, individually verified fishing trips and operators — sourced from official operator and resort information rather than a generic directory."
      />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
        <p className="text-sm text-neutral-600">
          See{" "}
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
              className={`rounded-full border px-3 py-1 ${!activeType ? "border-maldives-600 bg-maldives-600 text-white" : "border-neutral-300 text-neutral-700"}`}
            >
              All types
            </Link>
            {fishingTypes.map((type) => (
              <Link
                key={type.id}
                href={`/maldives/fishing/?type=${type.slug}`}
                className={`rounded-full border px-3 py-1 ${activeType?.id === type.id ? "border-maldives-600 bg-maldives-600 text-white" : "border-neutral-300 text-neutral-700"}`}
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
            className="w-full max-w-sm rounded-full border border-neutral-300 px-4 py-2 text-sm focus:border-maldives-500 focus:outline-none"
          />
          <button type="submit" className="rounded-full bg-maldives-600 px-4 py-2 text-sm font-medium text-white hover:bg-ocean-800">
            Search
          </button>
        </form>

        {results.items.length === 0 ? (
          <EmptyState title="No fishing activities recorded for this filter yet" />
        ) : (
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {results.items.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </ul>
        )}

        {!isSearching && <Pagination page={page} totalPages={totalPages} basePath="/maldives/fishing/" baseQuery={baseQuery} />}
      </div>
    </main>
  );
}
