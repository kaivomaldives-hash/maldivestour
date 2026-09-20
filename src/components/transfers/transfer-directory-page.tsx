import type { Metadata } from "next";
import Link from "next/link";

import { TransferRouteCard } from "@/components/transfers/transfer-route-card";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHero } from "@/components/ui/page-hero";
import { Pagination } from "@/components/ui/pagination";
import { getAtollBySlug, getLocationBySlug } from "@/lib/locations/repository";
import { breadcrumbJsonLd, canonicalUrl } from "@/lib/seo/site";
import {
  getSharedOrPrivateOptionsInUse,
  getTransferRoutes,
  getTransferRoutesByOrigin,
  getTransferTypesInUse,
  searchTransferRoutes,
} from "@/lib/transfers/repository";
import type { SharedOrPrivate, TransferType } from "@/lib/transfers/types";

const TRANSFER_CATEGORY_LINKS = [
  { href: "/maldives/airport-transfers/", label: "Airport Transfers", description: "Velana International Airport to anywhere in the Maldives" },
  { href: "/maldives/speedboat-transfers/", label: "Speedboat Transfers", description: "Fast sea transfers by speedboat" },
  { href: "/maldives/resort-transfers/", label: "Resort Transfers", description: "Private resort islands" },
  { href: "/maldives/hotel-transfers/", label: "Hotel Transfers", description: "Local-island hotels and guesthouses" },
  { href: "/maldives/island-transfers/", label: "Island Transfers", description: "Local Maldivian islands" },
];

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
  const title = "Maldives Transfers | Airport, Speedboat & Island Transfers";
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

  const [atoll, origin, destination, transferTypes, modes, velanaAirport] = await Promise.all([
    sp.atoll ? getAtollBySlug(sp.atoll) : Promise.resolve(null),
    sp.from ? getLocationBySlug(sp.from) : Promise.resolve(null),
    sp.to ? getLocationBySlug(sp.to) : Promise.resolve(null),
    getTransferTypesInUse(),
    getSharedOrPrivateOptionsInUse(),
    getLocationBySlug("velana-international-airport"),
  ]);

  const airportRoutes = velanaAirport ? await getTransferRoutesByOrigin(velanaAirport.id) : [];
  const resortRoutes = airportRoutes.filter((r) => r.destination?.isInhabited === false);
  const islandRoutes = airportRoutes.filter((r) => r.destination?.isInhabited === true);
  const featuredResorts = resortRoutes.slice(0, 4);
  const featuredIslands = islandRoutes.slice(0, 4);

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
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ label: "Maldives", href: "/maldives/" }, { label: "Transfers" }], "/maldives/transfers")) }}
      />
      <PageHero
        breadcrumbs={[{ label: "Maldives", href: "/maldives/" }, { label: "Transfers" }]}
        eyebrow="Getting around"
        title="Maldives Transfers"
        description="Find a transfer from Velana International Airport to your resort, hotel, or local island — real speedboat, ferry, and seaplane routes and prices, not a generic directory."
      />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
        {/* Route finder — a plain GET form (no client JS needed) that
            reuses this same page's existing from/to filters (Task 18). */}
        {velanaAirport && airportRoutes.length > 0 && (
          <form method="get" action="/maldives/transfers/" className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Find your transfer</h2>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto]">
              <div>
                <label htmlFor="tf-from" className="mb-1 block text-xs font-medium text-neutral-600">
                  From
                </label>
                <input id="tf-from" type="text" value={velanaAirport.title} disabled className="min-touch-target w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2 text-sm text-neutral-700" />
                <input type="hidden" name="from" value={velanaAirport.slug} />
              </div>
              <div>
                <label htmlFor="tf-to" className="mb-1 block text-xs font-medium text-neutral-600">
                  To
                </label>
                <select id="tf-to" name="to" defaultValue={sp.to ?? ""} className="min-touch-target w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none">
                  <option value="">Choose a destination…</option>
                  {airportRoutes
                    .filter((r) => r.destination)
                    .sort((a, b) => (a.destination?.title ?? "").localeCompare(b.destination?.title ?? ""))
                    .map((r) => (
                      <option key={r.destination!.slug} value={r.destination!.slug}>
                        {r.destination!.title}
                      </option>
                    ))}
                </select>
              </div>
              <button type="submit" className="min-touch-target self-end rounded-full bg-maldives-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-ocean-800">
                Search
              </button>
            </div>
          </form>
        )}

        <nav aria-label="Browse transfers by category" className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {TRANSFER_CATEGORY_LINKS.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="rounded-xl border border-neutral-200 p-4 text-center transition-colors hover:border-maldives-500 hover:bg-lagoon-50"
            >
              <span className="block text-sm font-semibold text-ocean-900">{cat.label}</span>
              <span className="mt-1 block text-xs text-neutral-500">{cat.description}</span>
            </Link>
          ))}
        </nav>

        {featuredResorts.length > 0 && (
          <section className="mt-10">
            <div className="flex items-baseline justify-between">
              <h2 className="text-xl font-semibold text-ocean-900">Resort transfers</h2>
              <Link href="/maldives/resort-transfers/" className="text-sm font-medium text-maldives-600 hover:underline">
                View all {resortRoutes.length} →
              </Link>
            </div>
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {featuredResorts.map((r) => (
                <TransferRouteCard key={r.id} route={r} />
              ))}
            </ul>
          </section>
        )}

        {featuredIslands.length > 0 && (
          <section className="mt-10">
            <div className="flex items-baseline justify-between">
              <h2 className="text-xl font-semibold text-ocean-900">Island transfers</h2>
              <Link href="/maldives/island-transfers/" className="text-sm font-medium text-maldives-600 hover:underline">
                View all {islandRoutes.length} →
              </Link>
            </div>
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {featuredIslands.map((r) => (
                <TransferRouteCard key={r.id} route={r} />
              ))}
            </ul>
          </section>
        )}

        <div className="mt-14 border-t border-neutral-200 pt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Browse the complete transfer directory</h2>
          <p className="mt-1 text-sm text-neutral-600">Every migrated route — filter, search, or browse the full inventory below.</p>
        </div>

        {(atoll || origin || destination) && (
          <p className="text-sm text-neutral-600">
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
              className={`rounded-full border px-3 py-1 ${!activeType ? "border-maldives-600 bg-maldives-600 text-white" : "border-neutral-300 text-neutral-700"}`}
            >
              All types
            </Link>
            {transferTypes.map((type) => (
              <Link
                key={type}
                href={`/maldives/transfers/?type=${type}`}
                className={`rounded-full border px-3 py-1 ${activeType === type ? "border-maldives-600 bg-maldives-600 text-white" : "border-neutral-300 text-neutral-700"}`}
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
                className={`rounded-full border px-3 py-1 ${activeMode === mode ? "border-maldives-600 bg-maldives-600 text-white" : "border-neutral-300 text-neutral-700"}`}
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
            className="w-full max-w-sm rounded-full border border-neutral-300 px-4 py-2 text-sm focus:border-maldives-500 focus:outline-none"
          />
          <button type="submit" className="rounded-full bg-maldives-600 px-4 py-2 text-sm font-medium text-white hover:bg-ocean-800">
            Search
          </button>
        </form>

        {results.items.length === 0 ? (
          <EmptyState title="No transfer routes recorded for this filter yet" />
        ) : (
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {results.items.map((route) => (
              <TransferRouteCard key={route.id} route={route} />
            ))}
          </ul>
        )}

        {!isSearching && <Pagination page={page} totalPages={totalPages} basePath="/maldives/transfers/" baseQuery={baseQuery} />}
      </div>
    </main>
  );
}
