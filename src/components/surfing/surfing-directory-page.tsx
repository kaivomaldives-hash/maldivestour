import type { Metadata } from "next";
import Link from "next/link";

import { ActivityCard } from "@/components/activity/activity-card";
import { Breadcrumbs } from "@/components/location/breadcrumbs";
import { SurfBreakCard } from "@/components/surfing/surf-break-card";
import {
  getSurfBreaks,
  getSurfingActivities,
  getSurfingActivitiesByType,
  getSurfingTypesInUse,
  searchSurfingActivities,
} from "@/lib/surfing/repository";
import { getAtollBySlug, getIslandBySlug } from "@/lib/locations/repository";
import { canonicalUrl } from "@/lib/seo/site";

const PAGE_SIZE = 24;

export interface SurfingDirectorySearchParams {
  q?: string;
  page?: string;
  type?: string;
  atoll?: string;
  island?: string;
}

function hasAnyFilter(sp: SurfingDirectorySearchParams): boolean {
  return Boolean(sp.q || sp.type || sp.atoll || sp.island);
}

export async function surfingDirectoryMetadata(searchParams: Promise<SurfingDirectorySearchParams>): Promise<Metadata> {
  const sp = await searchParams;
  const title = "Surfing in the Maldives | MTG";
  const description = "Real, source-verified surf lessons, camps, and surf breaks in the Maldives.";
  const url = canonicalUrl("/maldives/surfing");

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
    robots: hasAnyFilter(sp) ? { index: false, follow: true } : undefined,
  };
}

export async function SurfingDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<SurfingDirectorySearchParams>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const query = sp.q?.trim() ?? "";
  const isSearching = query.length > 0;

  const [atoll, island, surfingTypes, surfBreaks] = await Promise.all([
    sp.atoll ? getAtollBySlug(sp.atoll) : Promise.resolve(null),
    sp.island ? getIslandBySlug(sp.island) : Promise.resolve(null),
    getSurfingTypesInUse(),
    getSurfBreaks({ pageSize: 6 }),
  ]);

  const activeType = sp.type ? surfingTypes.find((t) => t.slug === sp.type) : undefined;
  const locationOptions = { atollId: island ? undefined : atoll?.id, locationId: island?.id };

  const results = isSearching
    ? { items: await searchSurfingActivities(query, { limit: 100 }), total: 0, page: 1, pageSize: 100 }
    : activeType
      ? await getSurfingActivitiesByType(activeType.slug, { page, pageSize: PAGE_SIZE, ...locationOptions })
      : await getSurfingActivities({ page, pageSize: PAGE_SIZE, ...locationOptions });

  const totalPages = isSearching ? 1 : Math.max(1, Math.ceil(results.total / PAGE_SIZE));

  const baseParams = new URLSearchParams();
  if (sp.type) baseParams.set("type", sp.type);
  if (sp.atoll) baseParams.set("atoll", sp.atoll);
  if (sp.island) baseParams.set("island", sp.island);
  const baseQuery = baseParams.toString();

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Breadcrumbs items={[{ label: "Maldives", href: "/maldives/" }, { label: "Surfing" }]} />
      <h1 className="mt-4 text-3xl font-semibold">Surfing in the Maldives</h1>
      <p className="mt-3 text-neutral-700">
        Real, individually verified surf lessons, camps, and operators — sourced from official operator and resort
        information rather than a generic directory. See{" "}
        <Link href="/maldives/activities/" className="underline">
          all activities
        </Link>{" "}
        for other things to do.
      </p>

      {(atoll || island) && (
        <p className="mt-3 text-sm text-neutral-600">
          Filtered to {island ? island.title : atoll?.title}.{" "}
          <Link href="/maldives/surfing/" className="underline">
            Clear
          </Link>
        </p>
      )}

      {surfingTypes.length > 0 && (
        <nav aria-label="Filter by surf type" className="mt-6 flex flex-wrap gap-2 text-sm">
          <Link
            href="/maldives/surfing/"
            className={`rounded-full border px-3 py-1 ${!activeType ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-300"}`}
          >
            All types
          </Link>
          {surfingTypes.map((type) => (
            <Link
              key={type.id}
              href={`/maldives/surfing/?type=${type.slug}`}
              className={`rounded-full border px-3 py-1 ${activeType?.id === type.id ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-300"}`}
            >
              {type.title}
            </Link>
          ))}
        </nav>
      )}

      <form method="get" className="mt-4 flex gap-2">
        <label htmlFor="surfing-search" className="sr-only">
          Search surfing activities
        </label>
        <input
          id="surfing-search"
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Search surfing activities…"
          className="w-full max-w-sm rounded border border-neutral-300 px-3 py-2 text-sm"
        />
        <button type="submit" className="rounded bg-neutral-900 px-4 py-2 text-sm text-white">
          Search
        </button>
      </form>

      {results.items.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-600">No surfing activities recorded for this filter yet.</p>
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
            <Link href={`/maldives/surfing/?${baseQuery ? baseQuery + "&" : ""}page=${page - 1}`} className="hover:underline">
              ← Previous
            </Link>
          )}
          <span className="text-neutral-500">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/maldives/surfing/?${baseQuery ? baseQuery + "&" : ""}page=${page + 1}`} className="hover:underline">
              Next →
            </Link>
          )}
        </nav>
      )}

      {surfBreaks.items.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold">Surf breaks</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Physical surf breaks — not bookable themselves; see the operators above for lessons and trips that visit them.
          </p>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {surfBreaks.items.map((surfBreak) => (
              <SurfBreakCard key={surfBreak.id} surfBreak={surfBreak} />
            ))}
          </ul>
          <Link href="/maldives/surf-breaks/" className="mt-4 inline-block text-sm font-medium hover:underline">
            View all surf breaks →
          </Link>
        </section>
      )}
    </main>
  );
}
