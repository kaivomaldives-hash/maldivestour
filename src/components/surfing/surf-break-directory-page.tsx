import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/location/breadcrumbs";
import { SurfBreakCard } from "@/components/surfing/surf-break-card";
import { getSurfBreaks } from "@/lib/surfing/repository";
import type { SurfBreakType } from "@/lib/surfing/types";
import { getAtollBySlug } from "@/lib/locations/repository";
import { canonicalUrl } from "@/lib/seo/site";

const BREAK_TYPE_LABEL: Record<SurfBreakType, string> = {
  reef_break: "Reef break",
  point_break: "Point break",
  beach_break: "Beach break",
  channel: "Channel",
};

const BREAK_TYPES = Object.keys(BREAK_TYPE_LABEL) as SurfBreakType[];
const PAGE_SIZE = 48;

export interface SurfBreakDirectorySearchParams {
  page?: string;
  type?: string;
  atoll?: string;
}

function hasAnyFilter(sp: SurfBreakDirectorySearchParams): boolean {
  return Boolean(sp.type || sp.atoll);
}

export async function surfBreakDirectoryMetadata(searchParams: Promise<SurfBreakDirectorySearchParams>): Promise<Metadata> {
  const sp = await searchParams;
  const title = "Maldives Surf Breaks | MTG";
  const description = "Real, documented Maldives surf breaks — reef, point, and beach breaks, and channels — by atoll and type.";
  const url = canonicalUrl("/maldives/surf-breaks");

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
    robots: hasAnyFilter(sp) ? { index: false, follow: true } : undefined,
  };
}

export async function SurfBreakDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<SurfBreakDirectorySearchParams>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const breakType = BREAK_TYPES.includes(sp.type as SurfBreakType) ? (sp.type as SurfBreakType) : undefined;

  const atoll = sp.atoll ? await getAtollBySlug(sp.atoll) : null;
  const results = await getSurfBreaks({ page, pageSize: PAGE_SIZE, atollId: atoll?.id, breakType });
  const totalPages = Math.max(1, Math.ceil(results.total / PAGE_SIZE));

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Breadcrumbs items={[{ label: "Maldives", href: "/maldives/" }, { label: "Surf Breaks" }]} />
      <h1 className="mt-4 text-3xl font-semibold">Maldives Surf Breaks</h1>
      <p className="mt-3 text-neutral-700">
        Physical surf breaks, not bookable products — see{" "}
        <Link href="/maldives/surfing/" className="underline">
          surfing activities
        </Link>{" "}
        for lessons and trips that visit them.
      </p>

      {atoll && (
        <p className="mt-3 text-sm text-neutral-600">
          Filtered to {atoll.title}.{" "}
          <Link href="/maldives/surf-breaks/" className="underline">
            Clear
          </Link>
        </p>
      )}

      <nav aria-label="Filter by break type" className="mt-6 flex flex-wrap gap-2 text-sm">
        <Link
          href="/maldives/surf-breaks/"
          className={`rounded-full border px-3 py-1 ${!breakType ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-300"}`}
        >
          All types
        </Link>
        {BREAK_TYPES.map((type) => (
          <Link
            key={type}
            href={`/maldives/surf-breaks/?type=${type}`}
            className={`rounded-full border px-3 py-1 ${breakType === type ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-300"}`}
          >
            {BREAK_TYPE_LABEL[type]}
          </Link>
        ))}
      </nav>

      {results.items.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-600">No surf breaks recorded for this filter yet.</p>
      ) : (
        <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {results.items.map((surfBreak) => (
            <SurfBreakCard key={surfBreak.id} surfBreak={surfBreak} />
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <nav aria-label="Pagination" className="mt-8 flex items-center gap-4 text-sm">
          {page > 1 && (
            <Link href={`/maldives/surf-breaks/?page=${page - 1}`} className="hover:underline">
              ← Previous
            </Link>
          )}
          <span className="text-neutral-500">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/maldives/surf-breaks/?page=${page + 1}`} className="hover:underline">
              Next →
            </Link>
          )}
        </nav>
      )}
    </main>
  );
}
