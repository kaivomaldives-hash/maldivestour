import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/location/breadcrumbs";
import { DiveSiteCard } from "@/components/diving/dive-site-card";
import { getDiveSites } from "@/lib/diving/repository";
import type { DiveSiteType } from "@/lib/diving/types";
import { getAtollBySlug } from "@/lib/locations/repository";
import { canonicalUrl } from "@/lib/seo/site";

const SITE_TYPE_LABEL: Record<DiveSiteType, string> = {
  reef: "Reef",
  thila: "Thila",
  channel: "Channel",
  wreck: "Wreck",
  pinnacle: "Pinnacle",
  wall: "Wall",
  cave: "Cave",
};

const SITE_TYPES = Object.keys(SITE_TYPE_LABEL) as DiveSiteType[];
const PAGE_SIZE = 48;

export interface DiveSiteDirectorySearchParams {
  page?: string;
  type?: string;
  atoll?: string;
}

function hasAnyFilter(sp: DiveSiteDirectorySearchParams): boolean {
  return Boolean(sp.type || sp.atoll);
}

export async function diveSiteDirectoryMetadata(searchParams: Promise<DiveSiteDirectorySearchParams>): Promise<Metadata> {
  const sp = await searchParams;
  const title = "Maldives Dive Sites | MTG";
  const description = "Real, documented Maldives dive sites — reefs, thilas, channels, and wrecks — by atoll and type.";
  const url = canonicalUrl("/maldives/dive-sites");

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
    robots: hasAnyFilter(sp) ? { index: false, follow: true } : undefined,
  };
}

export async function DiveSiteDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<DiveSiteDirectorySearchParams>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const siteType = SITE_TYPES.includes(sp.type as DiveSiteType) ? (sp.type as DiveSiteType) : undefined;

  const atoll = sp.atoll ? await getAtollBySlug(sp.atoll) : null;
  const results = await getDiveSites({ page, pageSize: PAGE_SIZE, atollId: atoll?.id, siteType });
  const totalPages = Math.max(1, Math.ceil(results.total / PAGE_SIZE));

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Breadcrumbs items={[{ label: "Maldives", href: "/maldives/" }, { label: "Dive Sites" }]} />
      <h1 className="mt-4 text-3xl font-semibold">Maldives Dive Sites</h1>
      <p className="mt-3 text-neutral-700">
        Physical dive sites, not bookable products — see{" "}
        <Link href="/maldives/diving/" className="underline">
          diving activities
        </Link>{" "}
        for operators running trips to them.
      </p>

      {atoll && (
        <p className="mt-3 text-sm text-neutral-600">
          Filtered to {atoll.title}.{" "}
          <Link href="/maldives/dive-sites/" className="underline">
            Clear
          </Link>
        </p>
      )}

      <nav aria-label="Filter by site type" className="mt-6 flex flex-wrap gap-2 text-sm">
        <Link
          href="/maldives/dive-sites/"
          className={`rounded-full border px-3 py-1 ${!siteType ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-300"}`}
        >
          All types
        </Link>
        {SITE_TYPES.map((type) => (
          <Link
            key={type}
            href={`/maldives/dive-sites/?type=${type}`}
            className={`rounded-full border px-3 py-1 ${siteType === type ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-300"}`}
          >
            {SITE_TYPE_LABEL[type]}
          </Link>
        ))}
      </nav>

      {results.items.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-600">No dive sites recorded for this filter yet.</p>
      ) : (
        <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {results.items.map((site) => (
            <DiveSiteCard key={site.id} site={site} />
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <nav aria-label="Pagination" className="mt-8 flex items-center gap-4 text-sm">
          {page > 1 && (
            <Link href={`/maldives/dive-sites/?page=${page - 1}`} className="hover:underline">
              ← Previous
            </Link>
          )}
          <span className="text-neutral-500">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/maldives/dive-sites/?page=${page + 1}`} className="hover:underline">
              Next →
            </Link>
          )}
        </nav>
      )}
    </main>
  );
}
