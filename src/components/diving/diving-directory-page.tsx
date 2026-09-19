import type { Metadata } from "next";
import Link from "next/link";

import { ActivityCard } from "@/components/activity/activity-card";
import { Breadcrumbs } from "@/components/location/breadcrumbs";
import { DiveSiteCard } from "@/components/diving/dive-site-card";
import {
  getDiveSites,
  getDivingActivities,
  getDivingActivitiesByType,
  getDivingTypesInUse,
  searchDivingActivities,
} from "@/lib/diving/repository";
import { getAtollBySlug, getIslandBySlug } from "@/lib/locations/repository";
import { canonicalUrl } from "@/lib/seo/site";

const PAGE_SIZE = 24;

export interface DivingDirectorySearchParams {
  q?: string;
  page?: string;
  type?: string;
  atoll?: string;
  island?: string;
}

function hasAnyFilter(sp: DivingDirectorySearchParams): boolean {
  return Boolean(sp.q || sp.type || sp.atoll || sp.island);
}

export async function divingDirectoryMetadata(searchParams: Promise<DivingDirectorySearchParams>): Promise<Metadata> {
  const sp = await searchParams;
  const title = "Diving in the Maldives | MTG";
  const description = "Real, source-verified diving activities, dive centers, and dive sites in the Maldives.";
  const url = canonicalUrl("/maldives/diving");

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
    robots: hasAnyFilter(sp) ? { index: false, follow: true } : undefined,
  };
}

export async function DivingDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<DivingDirectorySearchParams>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const query = sp.q?.trim() ?? "";
  const isSearching = query.length > 0;

  const [atoll, island, divingTypes, diveSites] = await Promise.all([
    sp.atoll ? getAtollBySlug(sp.atoll) : Promise.resolve(null),
    sp.island ? getIslandBySlug(sp.island) : Promise.resolve(null),
    getDivingTypesInUse(),
    getDiveSites({ pageSize: 6 }),
  ]);

  const activeType = sp.type ? divingTypes.find((t) => t.slug === sp.type) : undefined;
  const locationOptions = { atollId: island ? undefined : atoll?.id, locationId: island?.id };

  const results = isSearching
    ? { items: await searchDivingActivities(query, { limit: 100 }), total: 0, page: 1, pageSize: 100 }
    : activeType
      ? await getDivingActivitiesByType(activeType.slug, { page, pageSize: PAGE_SIZE, ...locationOptions })
      : await getDivingActivities({ page, pageSize: PAGE_SIZE, ...locationOptions });

  const totalPages = isSearching ? 1 : Math.max(1, Math.ceil(results.total / PAGE_SIZE));

  const baseParams = new URLSearchParams();
  if (sp.type) baseParams.set("type", sp.type);
  if (sp.atoll) baseParams.set("atoll", sp.atoll);
  if (sp.island) baseParams.set("island", sp.island);
  const baseQuery = baseParams.toString();

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Breadcrumbs items={[{ label: "Maldives", href: "/maldives/" }, { label: "Diving" }]} />
      <h1 className="mt-4 text-3xl font-semibold">Diving in the Maldives</h1>
      <p className="mt-3 text-neutral-700">
        Real, individually verified diving activities and dive centers — sourced from official operator and resort
        information rather than a generic directory. See{" "}
        <Link href="/maldives/activities/" className="underline">
          all activities
        </Link>{" "}
        for other things to do.
      </p>

      {(atoll || island) && (
        <p className="mt-3 text-sm text-neutral-600">
          Filtered to {island ? island.title : atoll?.title}.{" "}
          <Link href="/maldives/diving/" className="underline">
            Clear
          </Link>
        </p>
      )}

      {divingTypes.length > 0 && (
        <nav aria-label="Filter by diving type" className="mt-6 flex flex-wrap gap-2 text-sm">
          <Link
            href="/maldives/diving/"
            className={`rounded-full border px-3 py-1 ${!activeType ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-300"}`}
          >
            All types
          </Link>
          {divingTypes.map((type) => (
            <Link
              key={type.id}
              href={`/maldives/diving/?type=${type.slug}`}
              className={`rounded-full border px-3 py-1 ${activeType?.id === type.id ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-300"}`}
            >
              {type.title}
            </Link>
          ))}
        </nav>
      )}

      <form method="get" className="mt-4 flex gap-2">
        <label htmlFor="diving-search" className="sr-only">
          Search diving activities
        </label>
        <input
          id="diving-search"
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Search diving activities…"
          className="w-full max-w-sm rounded border border-neutral-300 px-3 py-2 text-sm"
        />
        <button type="submit" className="rounded bg-neutral-900 px-4 py-2 text-sm text-white">
          Search
        </button>
      </form>

      {results.items.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-600">No diving activities recorded for this filter yet.</p>
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
            <Link href={`/maldives/diving/?${baseQuery ? baseQuery + "&" : ""}page=${page - 1}`} className="hover:underline">
              ← Previous
            </Link>
          )}
          <span className="text-neutral-500">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/maldives/diving/?${baseQuery ? baseQuery + "&" : ""}page=${page + 1}`} className="hover:underline">
              Next →
            </Link>
          )}
        </nav>
      )}

      {diveSites.items.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold">Dive sites</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Physical dive sites — not bookable themselves; see the operators above for trips that visit them.
          </p>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {diveSites.items.map((site) => (
              <DiveSiteCard key={site.id} site={site} />
            ))}
          </ul>
          <Link href="/maldives/dive-sites/" className="mt-4 inline-block text-sm font-medium hover:underline">
            View all dive sites →
          </Link>
        </section>
      )}
    </main>
  );
}
