import Link from "next/link";

import { PlaceCard } from "@/components/places/place-card";
import { placesItemListJsonLd } from "@/components/places/place-schema";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHero } from "@/components/ui/page-hero";
import { Pagination } from "@/components/ui/pagination";
import { getAtollBySlug } from "@/lib/locations/repository";
import { getPlaces } from "@/lib/places/repository";
import { PLACE_CATEGORY_LABEL, type PlaceCategory } from "@/lib/places/types";
import { breadcrumbJsonLd, safeJsonLdStringify } from "@/lib/seo/site";

const PAGE_SIZE = 48;

export interface PlaceDirectorySearchParams {
  atoll?: string;
  page?: string;
}

const CATEGORY_COPY: Record<PlaceCategory, { eyebrow: string; title: string; description: string; basePath: string }> = {
  restaurant: {
    eyebrow: "Eat and drink",
    title: "Maldives Restaurants",
    description: "Community-submitted restaurants and places to eat across the Maldives, checked by our team before they're listed.",
    basePath: "/maldives/restaurants/",
  },
  shop: {
    eyebrow: "Shopping",
    title: "Maldives Shops",
    description: "Community-submitted shops across the Maldives, checked by our team before they're listed.",
    basePath: "/maldives/shops/",
  },
  hospital: {
    eyebrow: "Practical info",
    title: "Maldives Hospitals",
    description: "Community-submitted hospitals and clinics across the Maldives, checked by our team before they're listed.",
    basePath: "/maldives/hospitals/",
  },
  school: {
    eyebrow: "Practical info",
    title: "Maldives Schools",
    description: "Community-submitted schools across the Maldives, checked by our team before they're listed.",
    basePath: "/maldives/schools/",
  },
  gym: {
    eyebrow: "Fitness",
    title: "Maldives Gyms",
    description: "Community-submitted gyms across the Maldives, checked by our team before they're listed.",
    basePath: "/maldives/gyms/",
  },
};

/** Shared by the Restaurants/Shops/Hospitals/Schools/Gyms directory
 * pages — every item here only ever exists because a community "Add a
 * Place" submission (src/components/locations/add-place-form.tsx) was
 * approved by staff; there's no admin-curated seed content for these
 * five categories the way Attractions has. */
export async function PlaceDirectoryPage({
  category,
  searchParams,
}: {
  category: PlaceCategory;
  searchParams: Promise<PlaceDirectorySearchParams>;
}) {
  const copy = CATEGORY_COPY[category];
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);

  const atoll = sp.atoll ? await getAtollBySlug(sp.atoll) : null;
  const results = await getPlaces(category, { page, pageSize: PAGE_SIZE, atollId: atoll?.id });
  const totalPages = Math.max(1, Math.ceil(results.total / PAGE_SIZE));
  const isUnfiltered = !atoll;

  const allForAtollNav = isUnfiltered ? results.items : (await getPlaces(category, { pageSize: PAGE_SIZE })).items;
  const atollsInUse = Array.from(new Map(allForAtollNav.filter((p) => p.atoll).map((p) => [p.atoll!.id, p.atoll!])).values()).sort((a, b) =>
    a.title.localeCompare(b.title),
  );

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(breadcrumbJsonLd([{ label: "Maldives", href: "/maldives/" }, { label: copy.title.replace("Maldives ", "") }], copy.basePath)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(placesItemListJsonLd(category, results.items, copy.basePath)) }}
      />

      <PageHero
        breadcrumbs={[{ label: "Maldives", href: "/maldives/" }, { label: copy.title.replace("Maldives ", "") }]}
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
      />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
        {atoll && (
          <p className="text-sm text-neutral-600">
            Filtered to {atoll.title}.{" "}
            <Link href={copy.basePath} className="underline">
              Clear
            </Link>
          </p>
        )}

        {atollsInUse.length > 1 && (
          <nav aria-label="Filter by atoll" className="mt-3 flex flex-wrap gap-2 text-sm">
            {atollsInUse.map((a) => (
              <Link
                key={a.id}
                href={`${copy.basePath}?atoll=${a.slug}`}
                className={`rounded-full border px-3 py-1 ${atoll?.id === a.id ? "border-maldives-600 bg-maldives-600 text-white" : "border-neutral-300 text-neutral-700"}`}
              >
                {PLACE_CATEGORY_LABEL[category]}s in {a.title}
              </Link>
            ))}
          </nav>
        )}

        {results.items.length === 0 ? (
          <EmptyState title={`No ${PLACE_CATEGORY_LABEL[category].toLowerCase()}s recorded for this filter yet`} />
        ) : (
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {results.items.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </ul>
        )}

        <Pagination page={page} totalPages={totalPages} basePath={copy.basePath} />

        <section className="mt-12 border-t border-neutral-200 pt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Explore More Maldives</h2>
          <nav aria-label="Related Maldives links" className="mt-4 flex flex-wrap gap-2">
            {[
              { href: "/maldives/restaurants/", label: "Restaurants" },
              { href: "/maldives/shops/", label: "Shops" },
              { href: "/maldives/hospitals/", label: "Hospitals" },
              { href: "/maldives/schools/", label: "Schools" },
              { href: "/maldives/gyms/", label: "Gyms" },
              { href: "/maldives/islands/", label: "Islands" },
              { href: "/maldives/attractions/", label: "Attractions" },
              { href: "/maldives/guesthouses/", label: "Guesthouses" },
            ]
              .filter((link) => link.label.toLowerCase() !== `${PLACE_CATEGORY_LABEL[category].toLowerCase()}s`)
              .map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:border-maldives-500 hover:text-maldives-600"
                >
                  {link.label}
                </Link>
              ))}
          </nav>
        </section>
      </div>
    </main>
  );
}
