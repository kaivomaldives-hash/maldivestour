import type { Metadata } from "next";
import Link from "next/link";

import { PackageCard } from "@/components/packages/package-card";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHero } from "@/components/ui/page-hero";
import { Pagination } from "@/components/ui/pagination";
import { getAtollBySlug } from "@/lib/locations/repository";
import {
  getPackageDurationBandsInUse,
  getPackageInclusionsInUse,
  getPackageStylesInUse,
  getPackageThemesInUse,
  getPackageTravelerTypesInUse,
  getPackages,
  searchPackages,
} from "@/lib/packages/repository";
import { canonicalUrl } from "@/lib/seo/site";

const PAGE_SIZE = 24;

export interface PackageDirectorySearchParams {
  q?: string;
  page?: string;
  travelerType?: string;
  style?: string;
  theme?: string;
  duration?: string;
  inclusion?: string;
  atoll?: string;
}

function hasAnyFilter(sp: PackageDirectorySearchParams): boolean {
  return Boolean(sp.q || sp.travelerType || sp.style || sp.theme || sp.duration || sp.inclusion || sp.atoll);
}

export async function packageDirectoryMetadata(searchParams: Promise<PackageDirectorySearchParams>): Promise<Metadata> {
  const sp = await searchParams;
  const title = "Maldives Packages | MTG";
  const description =
    "Multi-day Maldives itineraries combining real, individually verified accommodation, activities, and transfers — by traveler type, style, and theme.";
  const url = canonicalUrl("/maldives/packages");

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
    robots: hasAnyFilter(sp) ? { index: false, follow: true } : undefined,
  };
}

export async function PackageDirectoryPage({ searchParams }: { searchParams: Promise<PackageDirectorySearchParams> }) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const query = sp.q?.trim() ?? "";
  const isSearching = query.length > 0;

  const [atoll, travelerTypes, styles, themes, durationBands, inclusions] = await Promise.all([
    sp.atoll ? getAtollBySlug(sp.atoll) : Promise.resolve(null),
    getPackageTravelerTypesInUse(),
    getPackageStylesInUse(),
    getPackageThemesInUse(),
    getPackageDurationBandsInUse(),
    getPackageInclusionsInUse(),
  ]);

  const activeTravelerType = sp.travelerType && travelerTypes.some((c) => c.slug === sp.travelerType) ? sp.travelerType : undefined;
  const activeStyle = sp.style && styles.some((c) => c.slug === sp.style) ? sp.style : undefined;
  const activeTheme = sp.theme && themes.some((c) => c.slug === sp.theme) ? sp.theme : undefined;
  const activeDuration = sp.duration && durationBands.some((c) => c.slug === sp.duration) ? sp.duration : undefined;
  const activeInclusion = sp.inclusion && inclusions.some((c) => c.slug === sp.inclusion) ? sp.inclusion : undefined;

  const results = isSearching
    ? { items: await searchPackages(query, { limit: 100 }), total: 0, page: 1, pageSize: 100 }
    : await getPackages({
        page,
        pageSize: PAGE_SIZE,
        atollId: sp.atoll ? atoll?.id : undefined,
        travelerType: activeTravelerType,
        style: activeStyle,
        theme: activeTheme,
        durationBand: activeDuration,
        inclusion: activeInclusion,
      });

  const totalPages = isSearching ? 1 : Math.max(1, Math.ceil(results.total / PAGE_SIZE));

  const baseParams = new URLSearchParams();
  if (sp.travelerType) baseParams.set("travelerType", sp.travelerType);
  if (sp.style) baseParams.set("style", sp.style);
  if (sp.theme) baseParams.set("theme", sp.theme);
  if (sp.duration) baseParams.set("duration", sp.duration);
  if (sp.inclusion) baseParams.set("inclusion", sp.inclusion);
  if (sp.atoll) baseParams.set("atoll", sp.atoll);
  const baseQuery = baseParams.toString();

  function chipRow(
    label: string,
    paramName: "travelerType" | "style" | "theme" | "duration" | "inclusion",
    options: Array<{ slug: string; title: string }>,
    active: string | undefined,
  ) {
    if (options.length === 0) return null;
    const otherParams = new URLSearchParams(baseParams);
    otherParams.delete(paramName);
    const otherQuery = otherParams.toString();

    return (
      <nav aria-label={`Filter by ${label}`} className="mt-3 flex flex-wrap gap-2 text-sm">
        <Link
          href={`/maldives/packages/${otherQuery ? `?${otherQuery}` : ""}`}
          className={`rounded-full border px-3 py-1 ${!active ? "border-maldives-600 bg-maldives-600 text-white" : "border-neutral-300 text-neutral-700"}`}
        >
          All {label}
        </Link>
        {options.map((option) => {
          const params = new URLSearchParams(otherParams);
          params.set(paramName, option.slug);
          return (
            <Link
              key={option.slug}
              href={`/maldives/packages/?${params.toString()}`}
              className={`rounded-full border px-3 py-1 ${active === option.slug ? "border-maldives-600 bg-maldives-600 text-white" : "border-neutral-300 text-neutral-700"}`}
            >
              {option.title}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <main>
      <PageHero
        breadcrumbs={[{ label: "Maldives", href: "/maldives/" }, { label: "Packages" }]}
        eyebrow="Packages"
        title="Maldives Packages"
        description="Multi-day itineraries built entirely from real, individually verified accommodation, activities, and transfers — never a generic package template."
      />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
        {atoll && (
          <p className="text-sm text-neutral-600">
            Filtered to {atoll.title}.{" "}
            <Link href="/maldives/packages/" className="underline">
              Clear
            </Link>
          </p>
        )}

        {chipRow("traveler types", "travelerType", travelerTypes, activeTravelerType)}
        {chipRow("styles", "style", styles, activeStyle)}
        {chipRow("themes", "theme", themes, activeTheme)}
        {chipRow("durations", "duration", durationBands, activeDuration)}
        {chipRow("inclusions", "inclusion", inclusions, activeInclusion)}

        <form method="get" className="mt-4 flex gap-2">
          <label htmlFor="package-search" className="sr-only">
            Search packages
          </label>
          <input
            id="package-search"
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search by package name…"
            className="w-full max-w-sm rounded-full border border-neutral-300 px-4 py-2 text-sm focus:border-maldives-500 focus:outline-none"
          />
          <button type="submit" className="rounded-full bg-maldives-600 px-4 py-2 text-sm font-medium text-white hover:bg-ocean-800">
            Search
          </button>
        </form>

        {results.items.length === 0 ? (
          <EmptyState title="No packages match this filter yet" />
        ) : (
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {results.items.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </ul>
        )}

        {!isSearching && <Pagination page={page} totalPages={totalPages} basePath="/maldives/packages/" baseQuery={baseQuery} />}
      </div>
    </main>
  );
}
