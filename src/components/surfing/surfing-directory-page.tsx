import { unstable_cache } from "next/cache";
import Link from "next/link";

import { ActivityCard } from "@/components/activity/activity-card";
import { AccommodationCard } from "@/components/accommodation/accommodation-card";
import { PackageCard } from "@/components/packages/package-card";
import { SurfBreakCard } from "@/components/surfing/surf-break-card";
import type { SurfingDirectorySearchParams } from "@/components/surfing/surfing-directory-metadata";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { FaqSection } from "@/components/ui/faq-section";
import { PageHero } from "@/components/ui/page-hero";
import { Pagination } from "@/components/ui/pagination";
import { getAccommodationsByNodeIds } from "@/lib/accommodations/repository";
import {
  getSurfBreaks,
  getSurfingActivities,
  getSurfingActivitiesByType,
  getSurfingTypesInUse,
  searchSurfingActivities,
} from "@/lib/surfing/repository";
import { activityHref } from "@/lib/activities/types";
import { getCategoryBySlug, getNodeIdsByCategory } from "@/lib/categories/repository";
import { getAtollBySlug, getIslandBySlug } from "@/lib/locations/repository";
import { PACKAGE_CATEGORY_FALLBACK_IMAGES } from "@/lib/packages/category-images";
import { filterPackageViews, getAllPackageViews } from "@/lib/packages/view-repository";
import { breadcrumbJsonLd, itemListJsonLd, safeJsonLdStringify } from "@/lib/seo/site";

const PAGE_SIZE = 24;

const FAQS = [
  {
    question: "When is the best time to surf in the Maldives?",
    answer:
      "It varies by region — North Male Atoll's season typically runs March to October, peaking June to September, while the southern Gaafu Dhaalu (Huvadhoo) atoll breaks are usually best in the shoulder windows of early March–April and October–November. See Surf Season below, and each surf break's own page for what's documented about it specifically.",
  },
  {
    question: "Do I need surf experience to book a lesson?",
    answer: "No — several listed activities are beginner lessons with no prior experience needed; check the specific listing's difficulty rating.",
  },
  {
    question: "What's the difference between a surf break and a surfing activity?",
    answer: "A surf break is a physical wave location — a reef or point break. A surfing activity is a bookable lesson, guided session, or camp, which may run at one or more breaks — see the activities above, and Surf Breaks below for the locations themselves.",
  },
  {
    question: "Can I combine surfing with a package holiday?",
    answer: "Yes — see Surfing Packages below for multi-night holidays that include surfing, or enquire on any package to ask about adding surf sessions.",
  },
  {
    question: "Which resorts are close to good surf breaks?",
    answer: "See Surf Resorts & Hotels below for resorts confirmed to sit directly on, or run their own program at, a named break — not every resort near a surf region necessarily has direct access, so check the specific property.",
  },
];

function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
  };
}

/** Filter-independent data — same unstable_cache fix already applied to
 * the fishing/diving hubs (this route has no ISR since it reads
 * searchParams, so without this every request re-pays for the surf break
 * preview, every package view, and the surf-tagged resorts). */
const getSurfingDirectorySupportingContent = unstable_cache(
  async () => {
    const [surfBreaks, allPackages, surfingAmenity] = await Promise.all([
      getSurfBreaks({ pageSize: 12 }),
      getAllPackageViews(),
      getCategoryBySlug("surfing", "amenity"),
    ]);
    const surfResortIds = surfingAmenity ? await getNodeIdsByCategory(surfingAmenity.id) : [];
    const surfResorts = await getAccommodationsByNodeIds(surfResortIds);
    return {
      surfBreaks,
      surfingPackages: filterPackageViews(allPackages, { category: "surfing" }),
      surfResorts,
    };
  },
  ["surfing-directory-supporting-content"],
  { revalidate: 3600 },
);

export async function SurfingDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<SurfingDirectorySearchParams>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const query = sp.q?.trim() ?? "";
  const isSearching = query.length > 0;

  const [atoll, island, surfingTypes, supporting] = await Promise.all([
    sp.atoll ? getAtollBySlug(sp.atoll) : Promise.resolve(null),
    sp.island ? getIslandBySlug(sp.island) : Promise.resolve(null),
    getSurfingTypesInUse(),
    getSurfingDirectorySupportingContent(),
  ]);
  const { surfBreaks, surfingPackages, surfResorts } = supporting;

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
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(breadcrumbJsonLd([{ label: "Maldives", href: "/maldives/" }, { label: "Surfing" }], "/maldives/surfing")) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(faqJsonLd()) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLdStringify(
            itemListJsonLd(
              results.items.map((a) => ({ title: a.title, href: activityHref(a), summary: a.summary })),
              "Service",
            ),
          ),
        }}
      />

      <PageHero
        breadcrumbs={[{ label: "Maldives", href: "/maldives/" }, { label: "Surfing" }]}
        eyebrow="Maldives surfing"
        title="Surfing in the Maldives"
        description="Real, individually verified surf lessons, camps, surf breaks and surfing packages — sourced from official operator and resort information rather than a generic directory."
        image={PACKAGE_CATEGORY_FALLBACK_IMAGES.surfing}
      />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
        <section className="prose-sm max-w-none text-sm text-neutral-700">
          <p>
            The Maldives is one of the world&rsquo;s classic boat-trip surf destinations — a scattered chain of reef passes and point breaks
            across several atolls, most reached by a short boat ride rather than paddling out from the beach. North Male Atoll (the
            Thulusdhoo/Himmafushi/Thanburudhoo cluster) is the most accessible and well-known region, with Laamu and the southern Gaafu
            Dhaalu (Huvadhoo) atoll offering less crowded alternatives further out. The lessons, camps and guided trips below are real,
            individually sourced listings — not a generic stock directory.
          </p>
        </section>

        <section className="mt-8 rounded-2xl border border-neutral-200 bg-sand-50 p-6">
          <h2 className="text-lg font-semibold text-ocean-900">Surf Season in the Maldives</h2>
          <dl className="mt-4 grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
            <div>
              <dt className="font-medium text-ocean-900">North Male Atoll</dt>
              <dd className="mt-1 text-neutral-700">
                General season March&ndash;October, with the most consistent swells June&ndash;September. Individual breaks (Cokes,
                Chickens, Sultans, Honky&rsquo;s, Jailbreak, Pasta Point) vary within this window — see each break&rsquo;s own page.
              </dd>
            </div>
            <div>
              <dt className="font-medium text-ocean-900">Laamu Atoll</dt>
              <dd className="mt-1 text-neutral-700">
                Breaks here (Yin-Yang, Isdoo Corner) are generally described as working best on a strong south-to-southeast swell rather
                than a fixed calendar window.
              </dd>
            </div>
            <div>
              <dt className="font-medium text-ocean-900">Gaafu Dhaalu (Huvadhoo) Atoll</dt>
              <dd className="mt-1 text-neutral-700">
                Southern-atoll breaks (Tiger Stripes, Beacons, Castaways) are typically best in the shoulder windows of early
                March&ndash;April and October&ndash;November.
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-neutral-500">
            Treat every window above as a general pattern, not a guarantee — conditions vary year to year. See{" "}
            <Link href="/maldives/surf-breaks/" className="text-maldives-600 hover:underline">
              individual surf break pages
            </Link>{" "}
            for source-specific season notes where available.
          </p>
        </section>

        <p className="mt-6 text-sm text-neutral-600">
          See{" "}
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
              className={`rounded-full border px-3 py-1 ${!activeType ? "border-maldives-600 bg-maldives-600 text-white" : "border-neutral-300 text-neutral-700"}`}
            >
              All types
            </Link>
            {surfingTypes.map((type) => (
              <Link
                key={type.id}
                href={`/maldives/surfing/?type=${type.slug}`}
                className={`rounded-full border px-3 py-1 ${activeType?.id === type.id ? "border-maldives-600 bg-maldives-600 text-white" : "border-neutral-300 text-neutral-700"}`}
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
            className="w-full max-w-sm rounded-full border border-neutral-300 px-4 py-2 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1"
          />
          <button type="submit" className="rounded-full bg-maldives-600 px-4 py-2 text-sm font-medium text-white hover:bg-ocean-800">
            Search
          </button>
        </form>

        {results.items.length === 0 ? (
          <EmptyState title="No surfing activities recorded for this filter yet" />
        ) : (
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {results.items.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </ul>
        )}

        {!isSearching && <Pagination page={page} totalPages={totalPages} basePath="/maldives/surfing/" baseQuery={baseQuery} />}

        {surfBreaks.items.length > 0 && (
          <section className="mt-12 border-t border-neutral-200 pt-10">
            <h2 className="text-xl font-semibold text-ocean-900">Surf Locations</h2>
            <p className="mt-1 text-sm text-neutral-600">
              Physical surf breaks — not bookable themselves; see the operators above for lessons and trips that visit them.
            </p>
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {surfBreaks.items.map((surfBreak) => (
                <SurfBreakCard key={surfBreak.id} surfBreak={surfBreak} />
              ))}
            </ul>
            <Link href="/maldives/surf-breaks/" className="mt-4 inline-block text-sm font-medium text-maldives-600 hover:text-ocean-800 hover:underline">
              View all surf breaks →
            </Link>
          </section>
        )}

        {surfResorts.length > 0 && (
          <section className="mt-12 border-t border-neutral-200 pt-10">
            <h2 className="text-xl font-semibold text-ocean-900">Surf Resorts &amp; Hotels</h2>
            <p className="mt-1 text-sm text-neutral-600">
              Resorts confirmed to sit directly on, or run their own program at, a named surf break.
            </p>
            <ul className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {surfResorts.map((resort) => (
                <AccommodationCard key={resort.id} accommodation={resort} />
              ))}
            </ul>
          </section>
        )}

        {surfingPackages.length > 0 && (
          <section className="mt-12 border-t border-neutral-200 pt-10">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-xl font-semibold text-ocean-900">Maldives Surfing Packages</h2>
              <Link href="/maldives/packages/surfing/" className="text-sm font-medium text-maldives-600 hover:underline">
                See all surfing packages ({surfingPackages.length}) →
              </Link>
            </div>
            <ul className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {surfingPackages.slice(0, 6).map((pkg) => (
                <PackageCard key={pkg.slug} pkg={pkg} />
              ))}
            </ul>
          </section>
        )}

        <FaqSection faqs={FAQS} className="mt-14 border-t border-neutral-200 pt-10" />

        <section className="mt-12 border-t border-neutral-200 pt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Explore More Maldives</h2>
          <nav aria-label="Related Maldives links" className="mt-4 flex flex-wrap gap-2">
            {[
              { href: "/maldives/diving/", label: "Diving" },
              { href: "/maldives/fishing/", label: "Fishing" },
              { href: "/maldives/activities/", label: "All Activities" },
              { href: "/maldives/surf-breaks/", label: "Surf Breaks" },
              { href: "/maldives/packages/surfing/", label: "Surfing Packages" },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:border-maldives-500 hover:text-maldives-600">
                {link.label}
              </Link>
            ))}
          </nav>
        </section>
      </div>
    </main>
  );
}
