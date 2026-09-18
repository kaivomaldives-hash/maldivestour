import type { Metadata } from "next";
import Link from "next/link";

import { ActivityCard } from "@/components/activity/activity-card";
import { Breadcrumbs } from "@/components/location/breadcrumbs";
import { getActivities, searchActivities } from "@/lib/activities/repository";
import { activityDirectorySegment, hasDedicatedRoute, type ActivityCategory, type ActivityDifficulty } from "@/lib/activities/types";
import { getAtollBySlug, getIslandBySlug } from "@/lib/locations/repository";
import { canonicalUrl } from "@/lib/seo/site";

const CATEGORY_LABEL: Record<ActivityCategory, string> = {
  general: "General",
  fishing: "Fishing",
  diving: "Diving",
  surfing: "Surfing",
  watersports: "Watersports",
  excursion: "Excursion",
  island_hopping: "Island Hopping",
  spa: "Spa",
  culture: "Culture",
};

// Categories with their own dedicated vertical (fishing, as of Task 7) get
// a direct link to that vertical's landing page below, not a `?category=`
// filter chip here — that dedicated page is their real home.
const CATEGORIES = (Object.keys(CATEGORY_LABEL) as ActivityCategory[]).filter((c) => !hasDedicatedRoute(c));
const DEDICATED_CATEGORIES = (Object.keys(CATEGORY_LABEL) as ActivityCategory[]).filter((c) => hasDedicatedRoute(c));
const PAGE_SIZE = 24;

export interface ActivityDirectorySearchParams {
  q?: string;
  page?: string;
  category?: string;
  atoll?: string;
  island?: string;
  difficulty?: string;
}

function hasAnyFilter(sp: ActivityDirectorySearchParams): boolean {
  return Boolean(sp.q || sp.category || sp.atoll || sp.island || sp.difficulty);
}

export async function activityDirectoryMetadata(searchParams: Promise<ActivityDirectorySearchParams>): Promise<Metadata> {
  const sp = await searchParams;
  const title = "Maldives Activities | MTG";
  const description = "Bookable activities and excursions in the Maldives, by category, atoll, and island.";
  const url = canonicalUrl("/maldives/activities");

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
    // A category/atoll/island/search filter is a discovery view, not a
    // canonical page — the same rule applied to accommodations (Task 5)
    // and islands (Task 4).
    robots: hasAnyFilter(sp) ? { index: false, follow: true } : undefined,
  };
}

export async function ActivityDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<ActivityDirectorySearchParams>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const query = sp.q?.trim() ?? "";
  const isSearching = query.length > 0;
  const category = CATEGORIES.includes(sp.category as ActivityCategory) ? (sp.category as ActivityCategory) : undefined;

  const [atoll, island] = await Promise.all([
    sp.atoll ? getAtollBySlug(sp.atoll) : Promise.resolve(null),
    sp.island ? getIslandBySlug(sp.island) : Promise.resolve(null),
  ]);

  const results = isSearching
    ? {
        items: (await searchActivities(query, { limit: 100 })).filter((a) => !category || a.activityCategory === category),
        total: 0,
        page: 1,
        pageSize: 100,
      }
    : await getActivities({
        category,
        page,
        pageSize: PAGE_SIZE,
        atollId: island ? undefined : atoll?.id,
        locationId: island?.id,
        difficulty: sp.difficulty as ActivityDifficulty | undefined,
      });

  const totalPages = isSearching ? 1 : Math.max(1, Math.ceil(results.total / PAGE_SIZE));

  const baseParams = new URLSearchParams();
  if (category) baseParams.set("category", category);
  if (sp.atoll) baseParams.set("atoll", sp.atoll);
  if (sp.island) baseParams.set("island", sp.island);
  const baseQuery = baseParams.toString();

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Breadcrumbs items={[{ label: "Maldives", href: "/maldives/" }, { label: "Activities" }]} />
      <h1 className="mt-4 text-3xl font-semibold">Activities in the Maldives</h1>
      {(atoll || island) && (
        <p className="mt-1 text-sm text-neutral-600">
          Filtered to {island ? island.title : atoll?.title}.{" "}
          <Link href="/maldives/activities/" className="underline">
            Clear
          </Link>
        </p>
      )}

      <nav aria-label="Filter by category" className="mt-6 flex flex-wrap gap-2 text-sm">
        <Link
          href="/maldives/activities/"
          className={`rounded-full border px-3 py-1 ${!category ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-300"}`}
        >
          All
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c}
            href={`/maldives/activities/?category=${c}`}
            className={`rounded-full border px-3 py-1 ${category === c ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-300"}`}
          >
            {CATEGORY_LABEL[c]}
          </Link>
        ))}
        {DEDICATED_CATEGORIES.map((c) => (
          <Link
            key={c}
            href={`/maldives/${activityDirectorySegment(c)}/`}
            className="rounded-full border border-dashed border-neutral-400 px-3 py-1 text-neutral-700"
          >
            {CATEGORY_LABEL[c]} →
          </Link>
        ))}
      </nav>

      <form method="get" className="mt-4 flex gap-2">
        {category && <input type="hidden" name="category" value={category} />}
        <label htmlFor="activity-search" className="sr-only">
          Search activities
        </label>
        <input
          id="activity-search"
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Search activities…"
          className="w-full max-w-sm rounded border border-neutral-300 px-3 py-2 text-sm"
        />
        <button type="submit" className="rounded bg-neutral-900 px-4 py-2 text-sm text-white">
          Search
        </button>
      </form>

      {results.items.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-600">No activities recorded for this filter yet.</p>
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
            <Link href={`/maldives/activities/?${baseQuery ? baseQuery + "&" : ""}page=${page - 1}`} className="hover:underline">
              ← Previous
            </Link>
          )}
          <span className="text-neutral-500">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/maldives/activities/?${baseQuery ? baseQuery + "&" : ""}page=${page + 1}`} className="hover:underline">
              Next →
            </Link>
          )}
        </nav>
      )}
    </main>
  );
}
