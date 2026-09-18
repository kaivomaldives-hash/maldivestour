import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/location/breadcrumbs";
import { getIslands, searchLocations } from "@/lib/locations/repository";
import { canonicalUrl } from "@/lib/seo/site";

const PAGE_SIZE = 48;

interface SearchParams {
  q?: string;
  page?: string;
}

export function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  return searchParams.then(({ q }) => {
    const title = "Maldives Islands | MTG";
    const description = "Every inhabited island in the Maldives, by atoll.";
    return {
      title,
      description,
      alternates: { canonical: canonicalUrl("/maldives/islands") },
      openGraph: { title, description, url: canonicalUrl("/maldives/islands") },
      // A search query narrows results to an arbitrary, non-canonical view —
      // keep it out of the index; the plain directory (and its pagination)
      // stays indexable.
      robots: q ? { index: false, follow: true } : undefined,
    };
  });
}

export default async function IslandsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { q, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const query = q?.trim() ?? "";
  const isSearching = query.length > 0;

  const results = isSearching
    ? { items: await searchLocations(query, { locationType: "island", limit: 100 }), total: 0, page: 1, pageSize: 100 }
    : await getIslands({ page, pageSize: PAGE_SIZE });

  const totalPages = isSearching ? 1 : Math.max(1, Math.ceil(results.total / PAGE_SIZE));

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Breadcrumbs
        items={[
          { label: "Maldives", href: "/maldives/" },
          { label: "Islands" },
        ]}
      />
      <h1 className="mt-4 text-3xl font-semibold">Islands of the Maldives</h1>

      <form method="get" className="mt-6 flex gap-2">
        <label htmlFor="island-search" className="sr-only">
          Search islands
        </label>
        <input
          id="island-search"
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Search islands…"
          className="w-full max-w-sm rounded border border-neutral-300 px-3 py-2 text-sm"
        />
        <button type="submit" className="rounded bg-neutral-900 px-4 py-2 text-sm text-white">
          Search
        </button>
      </form>

      {isSearching && (
        <p className="mt-4 text-sm text-neutral-600">
          {results.items.length} result{results.items.length === 1 ? "" : "s"} for &ldquo;{query}&rdquo; —{" "}
          <Link href="/maldives/islands/" className="underline">
            clear search
          </Link>
        </p>
      )}

      <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
        {results.items.map((island) => (
          <li key={island.id}>
            <Link href={`/maldives/islands/${island.slug}/`} className="hover:underline">
              {island.title}
            </Link>
          </li>
        ))}
      </ul>

      {!isSearching && totalPages > 1 && (
        <nav aria-label="Pagination" className="mt-8 flex items-center gap-4 text-sm">
          {page > 1 && (
            <Link href={`/maldives/islands/?page=${page - 1}`} className="hover:underline">
              ← Previous
            </Link>
          )}
          <span className="text-neutral-500">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/maldives/islands/?page=${page + 1}`} className="hover:underline">
              Next →
            </Link>
          )}
        </nav>
      )}
    </main>
  );
}
