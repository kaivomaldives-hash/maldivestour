import type { Metadata } from "next";
import Link from "next/link";

import { AttractionCard } from "@/components/attractions/attraction-card";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHero } from "@/components/ui/page-hero";
import { Pagination } from "@/components/ui/pagination";
import { getAttractions } from "@/lib/attractions/repository";
import type { AttractionType } from "@/lib/attractions/types";
import { getAtollBySlug } from "@/lib/locations/repository";
import { breadcrumbJsonLd, canonicalUrl } from "@/lib/seo/site";

const ATTRACTION_TYPE_LABEL: Record<AttractionType, string> = {
  religious: "Religious sites",
  museum: "Museums",
  monument: "Monuments",
  park: "Parks",
  beach: "Beaches",
  market: "Markets",
  landmark: "Landmarks",
  infrastructure: "Landmarks",
};

const ATTRACTION_TYPES = Object.keys(ATTRACTION_TYPE_LABEL) as AttractionType[];
const PAGE_SIZE = 48;

export interface AttractionDirectorySearchParams {
  page?: string;
  type?: string;
  atoll?: string;
}

function hasAnyFilter(sp: AttractionDirectorySearchParams): boolean {
  return Boolean(sp.type || sp.atoll);
}

export async function attractionDirectoryMetadata(searchParams: Promise<AttractionDirectorySearchParams>): Promise<Metadata> {
  const sp = await searchParams;
  const title = "Maldives Attractions | Landmarks, Museums & Places to Visit";
  const description = "Real, individually documented Maldives attractions — mosques, museums, monuments, beaches and markets — starting with Malé's must-see landmarks.";
  const url = canonicalUrl("/maldives/attractions");

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
    robots: hasAnyFilter(sp) ? { index: false, follow: true } : undefined,
  };
}

function attractionListJsonLd(items: { title: string; slug: string; summary: string | null }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "TouristAttraction",
        name: item.title,
        description: item.summary ?? undefined,
        url: canonicalUrl(`/maldives/attractions/${item.slug}`),
      },
    })),
  };
}

export async function AttractionDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<AttractionDirectorySearchParams>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const attractionType = ATTRACTION_TYPES.includes(sp.type as AttractionType) ? (sp.type as AttractionType) : undefined;

  const atoll = sp.atoll ? await getAtollBySlug(sp.atoll) : null;
  const results = await getAttractions({ page, pageSize: PAGE_SIZE, atollId: atoll?.id, attractionType });
  const totalPages = Math.max(1, Math.ceil(results.total / PAGE_SIZE));

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ label: "Maldives", href: "/maldives/" }, { label: "Attractions" }], "/maldives/attractions")) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(attractionListJsonLd(results.items)) }} />

      <PageHero
        breadcrumbs={[{ label: "Maldives", href: "/maldives/" }, { label: "Attractions" }]}
        eyebrow="Places to visit"
        title="Maldives Attractions"
        description="Real, individually documented landmarks, museums, monuments and public beaches — starting with Malé's must-see sights."
      />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
        <p className="text-sm text-neutral-600">
          See{" "}
          <Link href="/maldives/activities/" className="underline">
            all activities
          </Link>{" "}
          for bookable trips and experiences.
        </p>

        {atoll && (
          <p className="mt-3 text-sm text-neutral-600">
            Filtered to {atoll.title}.{" "}
            <Link href="/maldives/attractions/" className="underline">
              Clear
            </Link>
          </p>
        )}

        <nav aria-label="Filter by attraction type" className="mt-6 flex flex-wrap gap-2 text-sm">
          <Link
            href="/maldives/attractions/"
            className={`rounded-full border px-3 py-1 ${!attractionType ? "border-maldives-600 bg-maldives-600 text-white" : "border-neutral-300 text-neutral-700"}`}
          >
            All types
          </Link>
          {ATTRACTION_TYPES.map((type) => (
            <Link
              key={type}
              href={`/maldives/attractions/?type=${type}`}
              className={`rounded-full border px-3 py-1 ${attractionType === type ? "border-maldives-600 bg-maldives-600 text-white" : "border-neutral-300 text-neutral-700"}`}
            >
              {ATTRACTION_TYPE_LABEL[type]}
            </Link>
          ))}
        </nav>

        {results.items.length === 0 ? (
          <EmptyState title="No attractions recorded for this filter yet" />
        ) : (
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {results.items.map((attraction) => (
              <AttractionCard key={attraction.id} attraction={attraction} />
            ))}
          </ul>
        )}

        <Pagination page={page} totalPages={totalPages} basePath="/maldives/attractions/" />
      </div>
    </main>
  );
}
