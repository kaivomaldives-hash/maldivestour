import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/location/breadcrumbs";
import { TransferRouteCard } from "@/components/transfers/transfer-route-card";
import { getAtollBySlug, getLocationBySlug } from "@/lib/locations/repository";
import {
  getSharedOrPrivateOptionsInUse,
  getTransferRoutes,
  getTransferTypesInUse,
  searchTransferRoutes,
} from "@/lib/transfers/repository";
import type { SharedOrPrivate, TransferType } from "@/lib/transfers/types";
import { canonicalUrl } from "@/lib/seo/site";

const TRANSFER_TYPE_LABEL: Record<TransferType, string> = {
  speedboat: "Speedboat",
  seaplane: "Seaplane",
  domestic_flight: "Domestic Flight",
  ferry: "Ferry",
  private_yacht: "Private Yacht",
  land_transfer: "Land Transfer",
};

const MODE_LABEL: Record<SharedOrPrivate, string> = {
  shared: "Shared",
  private: "Private",
};

const PAGE_SIZE = 24;

export interface TransferDirectorySearchParams {
  q?: string;
  page?: string;
  type?: string;
  mode?: string;
  from?: string;
  to?: string;
  atoll?: string;
}

function hasAnyFilter(sp: TransferDirectorySearchParams): boolean {
  return Boolean(sp.q || sp.type || sp.mode || sp.from || sp.to || sp.atoll);
}

export async function transferDirectoryMetadata(searchParams: Promise<TransferDirectorySearchParams>): Promise<Metadata> {
  const sp = await searchParams;
  const title = "Maldives Transfers | MTG";
  const description = "Real, source-verified airport, ferry, speedboat, and resort transfers in the Maldives, by route and operator.";
  const url = canonicalUrl("/maldives/transfers");

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
    robots: hasAnyFilter(sp) ? { index: false, follow: true } : undefined,
  };
}

export async function TransferDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<TransferDirectorySearchParams>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const query = sp.q?.trim() ?? "";
  const isSearching = query.length > 0;

  const [atoll, origin, destination, transferTypes, modes] = await Promise.all([
    sp.atoll ? getAtollBySlug(sp.atoll) : Promise.resolve(null),
    sp.from ? getLocationBySlug(sp.from) : Promise.resolve(null),
    sp.to ? getLocationBySlug(sp.to) : Promise.resolve(null),
    getTransferTypesInUse(),
    getSharedOrPrivateOptionsInUse(),
  ]);

  const activeType = sp.type && transferTypes.includes(sp.type as TransferType) ? (sp.type as TransferType) : undefined;
  const activeMode = sp.mode && modes.includes(sp.mode as SharedOrPrivate) ? (sp.mode as SharedOrPrivate) : undefined;

  const results = isSearching
    ? { items: await searchTransferRoutes(query, { limit: 100 }), total: 0, page: 1, pageSize: 100 }
    : await getTransferRoutes({
        page,
        pageSize: PAGE_SIZE,
        atollId: sp.atoll ? atoll?.id : undefined,
        originLocationId: origin?.id,
        destinationLocationId: destination?.id,
        transferType: activeType,
        sharedOrPrivate: activeMode,
      });

  const totalPages = isSearching ? 1 : Math.max(1, Math.ceil(results.total / PAGE_SIZE));

  const baseParams = new URLSearchParams();
  if (sp.type) baseParams.set("type", sp.type);
  if (sp.mode) baseParams.set("mode", sp.mode);
  if (sp.from) baseParams.set("from", sp.from);
  if (sp.to) baseParams.set("to", sp.to);
  if (sp.atoll) baseParams.set("atoll", sp.atoll);
  const baseQuery = baseParams.toString();

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Breadcrumbs items={[{ label: "Maldives", href: "/maldives/" }, { label: "Transfers" }]} />
      <h1 className="mt-4 text-3xl font-semibold">Transfers in the Maldives</h1>
      <p className="mt-3 text-neutral-700">
        Real, individually verified airport, ferry, speedboat, and resort transfer services — sourced from operator and
        resort information rather than a generic directory.
      </p>

      {(atoll || origin || destination) && (
        <p className="mt-3 text-sm text-neutral-600">
          Filtered to{" "}
          {[origin?.title, destination?.title ? `→ ${destination.title}` : null, !origin && !destination ? atoll?.title : null]
            .filter(Boolean)
            .join(" ")}
          .{" "}
          <Link href="/maldives/transfers/" className="underline">
            Clear
          </Link>
        </p>
      )}

      {transferTypes.length > 0 && (
        <nav aria-label="Filter by transfer type" className="mt-6 flex flex-wrap gap-2 text-sm">
          <Link
            href="/maldives/transfers/"
            className={`rounded-full border px-3 py-1 ${!activeType ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-300"}`}
          >
            All types
          </Link>
          {transferTypes.map((type) => (
            <Link
              key={type}
              href={`/maldives/transfers/?type=${type}`}
              className={`rounded-full border px-3 py-1 ${activeType === type ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-300"}`}
            >
              {TRANSFER_TYPE_LABEL[type]}
            </Link>
          ))}
        </nav>
      )}

      {modes.length > 1 && (
        <nav aria-label="Filter by shared or private" className="mt-3 flex flex-wrap gap-2 text-sm">
          {modes.map((mode) => (
            <Link
              key={mode}
              href={`/maldives/transfers/?mode=${mode}`}
              className={`rounded-full border px-3 py-1 ${activeMode === mode ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-300"}`}
            >
              {MODE_LABEL[mode]}
            </Link>
          ))}
        </nav>
      )}

      <form method="get" className="mt-4 flex gap-2">
        <label htmlFor="transfer-search" className="sr-only">
          Search transfer routes
        </label>
        <input
          id="transfer-search"
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Search by island or airport…"
          className="w-full max-w-sm rounded border border-neutral-300 px-3 py-2 text-sm"
        />
        <button type="submit" className="rounded bg-neutral-900 px-4 py-2 text-sm text-white">
          Search
        </button>
      </form>

      {results.items.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-600">No transfer routes recorded for this filter yet.</p>
      ) : (
        <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {results.items.map((route) => (
            <TransferRouteCard key={route.id} route={route} />
          ))}
        </ul>
      )}

      {!isSearching && totalPages > 1 && (
        <nav aria-label="Pagination" className="mt-8 flex items-center gap-4 text-sm">
          {page > 1 && (
            <Link href={`/maldives/transfers/?${baseQuery ? baseQuery + "&" : ""}page=${page - 1}`} className="hover:underline">
              ← Previous
            </Link>
          )}
          <span className="text-neutral-500">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/maldives/transfers/?${baseQuery ? baseQuery + "&" : ""}page=${page + 1}`} className="hover:underline">
              Next →
            </Link>
          )}
        </nav>
      )}
    </main>
  );
}
