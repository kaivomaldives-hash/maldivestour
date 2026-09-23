import type { Metadata } from "next";
import Link from "next/link";

import { ActivityCard } from "@/components/activity/activity-card";
import { FishingVideo, fishingVideoJsonLd } from "@/components/fishing/fishing-video";
import { PackageCard } from "@/components/packages/package-card";
import { CARD_CLASS, CARD_IMAGE_BLEED_CLASS } from "@/components/ui/card";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { MediaImage } from "@/components/ui/media-image";
import { PageHero } from "@/components/ui/page-hero";
import { Pagination } from "@/components/ui/pagination";
import { activityHref } from "@/lib/activities/types";
import {
  getFishingActivities,
  getFishingActivitiesByType,
  getFishingActivityBySlug,
  getFishingTypesInUse,
  searchFishingActivities,
} from "@/lib/fishing/repository";
import { getAtollBySlug, getIslandBySlug } from "@/lib/locations/repository";
import { PACKAGE_CATEGORY_FALLBACK_IMAGES } from "@/lib/packages/category-images";
import { filterPackageViews, getAllPackageViews } from "@/lib/packages/view-repository";
import { getProviderBySlug } from "@/lib/providers/repository";
import { breadcrumbJsonLd, canonicalUrl, itemListJsonLd } from "@/lib/seo/site";

const PAGE_SIZE = 24;

const CHARTER_SLUGS = ["private-full-day-fishing-charter", "private-half-day-fishing-charter"];

// Real providers already on record for fishing trips in this dataset
// (data/maldives/fishing/SOURCES.md + SOURCES-mfh.md) — never invented.
const OPERATOR_SLUGS = [
  "maldives-fishing-and-holiday",
  "active-watersports-maafushi",
  "kaani-hotels",
  "icom-tours",
  "knight-at-sea",
  "universal-resorts",
  "soneva-management-bvi-limited",
];

const FISHING_TYPE_CONTENT: Record<string, { title: string; body: string }> = {
  "big-game-fishing": {
    title: "Big Game Fishing",
    body: "Trolling lures at speed for large pelagic species — tuna, wahoo, sailfish, marlin — usually a half-day or full-day trip further offshore. Several resort-run and independent trips on record are tagged big game fishing below.",
  },
  "sport-fishing": {
    title: "Sport Fishing",
    body: "A broader private-charter style trip, often targeting whatever's running that day rather than one specific technique — closest in spirit to MFH's own full-day and half-day private charters.",
  },
  "reef-fishing": {
    title: "Reef Fishing",
    body: "Bottom and light-tackle fishing over the reef itself, usually calmer and closer to shore than a big-game run — a good option for a shorter trip or less experienced anglers.",
  },
  "handline-fishing": {
    title: "Handline (Traditional) Fishing",
    body: "The traditional Maldivian method — reel, line, hook and bait, no rod required — taught to guests with no experience needed. Usually the base technique on a sunset fishing trip.",
  },
  "night-fishing": {
    title: "Night Fishing",
    body: "After-dark trips targeting different species than daytime fishing, often paired with a sunset departure. A genuinely different experience from a standard sunset trip, not just the same thing later.",
  },
  "traditional-fishing": {
    title: "Traditional Fishing",
    body: "Multi-technique trips run by local fishermen or resort dhonis, sometimes spanning several traditional methods in one outing rather than one specific style.",
  },
};

export interface FishingDirectorySearchParams {
  q?: string;
  page?: string;
  type?: string;
  atoll?: string;
  island?: string;
}

function hasAnyFilter(sp: FishingDirectorySearchParams): boolean {
  return Boolean(sp.q || sp.type || sp.atoll || sp.island);
}

export async function fishingDirectoryMetadata(searchParams: Promise<FishingDirectorySearchParams>): Promise<Metadata> {
  const sp = await searchParams;
  const title = "Maldives Fishing | Fishing Charters, Trips & Packages";
  const description =
    "Real Maldives fishing charters, trips and packages — private full-day and half-day charters, big game, reef and traditional fishing, sourced from real operators and a verified rate sheet, not a generic directory.";
  const url = canonicalUrl("/maldives/fishing");

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
    robots: hasAnyFilter(sp) ? { index: false, follow: true } : undefined,
  };
}

const FAQS = [
  {
    question: "What does a private fishing charter in the Maldives cost?",
    answer: "Maldives Fishing and Holiday's own 32-foot private charter starts from USD 980 for a half day or USD 1,380 for a full day, per boat (up to 5 passengers) — see Fishing Charters below for the exact, currently-verified rate.",
  },
  {
    question: "What's the difference between a fishing charter and a fishing package?",
    answer: "A charter is the boat trip itself, for a half or full day. A package bundles a charter with accommodation, meals and transfers for a multi-night stay — see Fishing Packages below.",
  },
  {
    question: "Do I need fishing experience?",
    answer: "No — basic fishing gear and a professional captain and crew are included on every charter on this page, and traditional handline fishing needs no prior experience.",
  },
  {
    question: "What fish can I catch in the Maldives?",
    answer: "It depends on the technique and season — big game trips target tuna, wahoo, sailfish and marlin further offshore; reef and handline trips catch a wider range of reef species closer to shore. See Fishing by Technique below.",
  },
  {
    question: "Can I combine fishing with a resort stay?",
    answer: "Yes — many resorts on this site (see Fishing by Technique and the activities below) run their own fishing trips alongside a normal resort stay, separate from the dedicated Maldives Fishing and Holiday packages.",
  },
  {
    question: "Are prices on this page fixed?",
    answer: "Prices shown are the operator's current verified rate, subject to their own booking conditions — availability, fuel surcharges and operational costs can change rates without notice. Enquire to confirm before booking.",
  },
];

function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
  };
}

export async function FishingDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<FishingDirectorySearchParams>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const query = sp.q?.trim() ?? "";
  const isSearching = query.length > 0;

  const [atoll, island, fishingTypes, charters, allPackages, operators] = await Promise.all([
    sp.atoll ? getAtollBySlug(sp.atoll) : Promise.resolve(null),
    sp.island ? getIslandBySlug(sp.island) : Promise.resolve(null),
    getFishingTypesInUse(),
    Promise.all(CHARTER_SLUGS.map((slug) => getFishingActivityBySlug(slug))),
    getAllPackageViews(),
    Promise.all(OPERATOR_SLUGS.map((slug) => getProviderBySlug(slug))),
  ]);

  const realCharters = charters.filter((c): c is NonNullable<typeof c> => c !== null);
  const fishingPackages = filterPackageViews(allPackages, { category: "fishing" });
  const realOperators = operators.filter((p): p is NonNullable<typeof p> => p !== null);

  const activeType = sp.type ? fishingTypes.find((t) => t.slug === sp.type) : undefined;
  const locationOptions = { atollId: island ? undefined : atoll?.id, locationId: island?.id };

  const results = isSearching
    ? {
        items: (await searchFishingActivities(query, { limit: 100 })),
        total: 0,
        page: 1,
        pageSize: 100,
      }
    : activeType
      ? await getFishingActivitiesByType(activeType.slug, { page, pageSize: PAGE_SIZE, ...locationOptions })
      : await getFishingActivities({ page, pageSize: PAGE_SIZE, ...locationOptions });

  const totalPages = isSearching ? 1 : Math.max(1, Math.ceil(results.total / PAGE_SIZE));

  const baseParams = new URLSearchParams();
  if (sp.type) baseParams.set("type", sp.type);
  if (sp.atoll) baseParams.set("atoll", sp.atoll);
  if (sp.island) baseParams.set("island", sp.island);
  const baseQuery = baseParams.toString();

  // Group already-tagged real fishing activities by technique for the
  // "Fishing by Technique" section — never a new/fabricated taxonomy page,
  // just descriptive content over real, already-existing tagged activities.
  const typesWithActivities = await Promise.all(
    fishingTypes
      .filter((t) => FISHING_TYPE_CONTENT[t.slug])
      .map(async (t) => ({
        type: t,
        content: FISHING_TYPE_CONTENT[t.slug],
        activities: (await getFishingActivitiesByType(t.slug, { pageSize: 3 })).items,
      })),
  );

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ label: "Maldives", href: "/maldives/" }, { label: "Fishing" }], "/maldives/fishing")) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(fishingVideoJsonLd()) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            itemListJsonLd(
              results.items.map((a) => ({ title: a.title, href: activityHref(a), summary: a.summary })),
              "Service",
            ),
          ),
        }}
      />

      <PageHero
        breadcrumbs={[{ label: "Maldives", href: "/maldives/" }, { label: "Fishing" }]}
        eyebrow="Maldives fishing"
        title="Maldives Fishing"
        description="Real fishing charters, trips and packages — private full-day and half-day charters from a verified operator, plus big game, reef, handline, night and traditional fishing trips from real resort and independent operators across the Maldives."
        image={PACKAGE_CATEGORY_FALLBACK_IMAGES.fishing}
        action={
          <div className="flex flex-wrap gap-3">
            <a href="#fishing-charters" className="rounded-full bg-maldives-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-ocean-800">
              Explore Fishing Charters
            </a>
            <a href="#fishing-packages" className="rounded-full border border-white/60 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10">
              Explore Fishing Packages
            </a>
          </div>
        }
      />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
        {/* Intro / SEO content */}
        <section className="prose-sm max-w-none text-sm text-neutral-700">
          <p>
            Fishing has always been part of everyday life in the Maldives, long before tourism — and today it&rsquo;s one of the country&rsquo;s
            most genuine, least commercialized activities. Whether that means a traditional handline sunset trip taught by a local crew, a
            private full-day charter chasing tuna and wahoo further offshore, or a multi-night fishing holiday built entirely around the boat,
            real operators across the Maldives run real, bookable trips — not a generic &ldquo;fishing excursion&rdquo; add-on.
          </p>
          <p>
            This page covers two distinct things travelers search for. A <strong>fishing charter</strong> is the boat trip itself — a half day
            or full day, usually priced per boat rather than per person. A <strong>fishing package</strong> bundles a charter with
            accommodation, meals and transfers into a complete multi-night holiday. Both are represented here with real, currently-verified
            pricing from Maldives Fishing and Holiday Pvt Ltd&rsquo;s own rate sheet (valid until 31 December 2027), alongside individually
            sourced trips from resort dive/watersports centres and independent Maafushi and Malé-area operators.
          </p>
        </section>

        {/* Fishing Charter Listings */}
        {realCharters.length > 0 && (
          <section id="fishing-charters" className="mt-12 scroll-mt-20 border-t border-neutral-200 pt-10">
            <h2 className="text-xl font-semibold text-ocean-900">Maldives Fishing Charters</h2>
            <p className="mt-2 text-sm text-neutral-700">
              Maldives Fishing and Holiday Pvt Ltd&rsquo;s own private charter, aboard &ldquo;Emperor&rdquo;, a 32-foot fishing boat with twin
              200&nbsp;HP engines (max 5 passengers) — departing from Maamendhoo, Gaafu Alifu Atoll.
            </p>
            <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {realCharters.map((charter) => (
                <li key={charter.id} className={CARD_CLASS}>
                  {charter.heroImage && (
                    <div className={CARD_IMAGE_BLEED_CLASS}>
                      <MediaImage asset={charter.heroImage} alt={charter.title} aspectClassName="aspect-[4/3]" />
                    </div>
                  )}
                  <Link href={`/maldives/fishing/${charter.slug}/`} className="text-lg font-medium text-ocean-900 hover:text-maldives-600">
                    {charter.title}
                  </Link>
                  <p className="mt-1 text-sm text-neutral-600">{charter.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-700">
                    {charter.maxParticipants && <span>Up to {charter.maxParticipants} passengers</span>}
                    {charter.primaryLocation && <span>{charter.primaryLocation.title}</span>}
                    {charter.provider && <span>Operated by {charter.provider.title}</span>}
                  </div>
                  {charter.priceFrom !== null && (
                    <p className="mt-2 text-lg font-semibold text-ocean-900">
                      From {charter.currency ?? "USD"} {charter.priceFrom}
                      <span className="ml-2 text-sm font-normal text-neutral-500">per boat</span>
                    </p>
                  )}
                  <Link
                    href={`/maldives/fishing/${charter.slug}/`}
                    className="mt-3 inline-flex items-center justify-center rounded-full bg-maldives-600 px-4 py-2 text-sm font-medium text-white hover:bg-ocean-800"
                  >
                    View Charter
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Fishing Packages */}
        {fishingPackages.length > 0 && (
          <section id="fishing-packages" className="mt-12 scroll-mt-20 border-t border-neutral-200 pt-10">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-xl font-semibold text-ocean-900">Maldives Fishing Packages</h2>
              <Link href="/maldives/packages/fishing/" className="text-sm font-medium text-maldives-600 hover:underline">
                See all fishing packages ({fishingPackages.length}) →
              </Link>
            </div>
            <p className="mt-2 text-sm text-neutral-700">
              Multi-night fishing holidays combining accommodation, full-board meals, transfers and a private charter — from 2 to 8 nights, verified
              against Maldives Fishing and Holiday&rsquo;s own packages rate sheet.
            </p>
            <ul className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {fishingPackages.slice(0, 6).map((pkg) => (
                <PackageCard key={pkg.slug} pkg={pkg} />
              ))}
            </ul>
          </section>
        )}

        {/* Fishing by Technique */}
        {typesWithActivities.length > 0 && (
          <section className="mt-12 border-t border-neutral-200 pt-10">
            <h2 className="text-xl font-semibold text-ocean-900">Fishing by Technique</h2>
            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {typesWithActivities.map(({ type, content, activities }) => (
                <div key={type.id}>
                  <h3 className="font-medium text-ocean-900">{content.title}</h3>
                  <p className="mt-1 text-sm text-neutral-700">{content.body}</p>
                  {activities.length > 0 && (
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {activities.map((a) => (
                        <li key={a.id}>
                          <Link href={`/maldives/fishing/${a.slug}/`} className="rounded-full border border-neutral-300 px-3 py-1 text-xs text-neutral-700 hover:border-maldives-500 hover:text-maldives-600">
                            {a.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Operators */}
        {realOperators.length > 0 && (
          <section className="mt-12 border-t border-neutral-200 pt-10">
            <h2 className="text-xl font-semibold text-ocean-900">Fishing Operators</h2>
            <p className="mt-2 text-sm text-neutral-700">Real operators running fishing trips on record in this directory.</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {realOperators.map((p) => (
                <li key={p.id}>
                  <Link href={`/maldives/providers/${p.slug}/`} className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:border-maldives-500 hover:text-maldives-600">
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <FishingVideo />

        {/* Guides */}
        <section className="mt-12 border-t border-neutral-200 pt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Fishing Guides</h2>
          <p className="mt-2 text-sm text-neutral-700">
            We don&rsquo;t yet have a dedicated Maldives fishing guide article — browse our{" "}
            <Link href="/maldives/travel-guide/" className="text-maldives-600 hover:underline">
              Travel Guide
            </Link>{" "}
            for more Maldives planning content in the meantime.
          </p>
        </section>

        {/* Directory / search */}
        <section className="mt-12 border-t border-neutral-200 pt-10">
          <h2 className="text-xl font-semibold text-ocean-900">All Fishing Activities</h2>
          <p className="mt-2 text-sm text-neutral-600">
            See{" "}
            <Link href="/maldives/activities/" className="underline">
              all activities
            </Link>{" "}
            for other things to do.
          </p>

          {(atoll || island) && (
            <p className="mt-3 text-sm text-neutral-600">
              Filtered to {island ? island.title : atoll?.title}.{" "}
              <Link href="/maldives/fishing/" className="underline">
                Clear
              </Link>
            </p>
          )}

          {fishingTypes.length > 0 && (
            <nav aria-label="Filter by fishing type" className="mt-6 flex flex-wrap gap-2 text-sm">
              <Link
                href="/maldives/fishing/"
                className={`rounded-full border px-3 py-1 ${!activeType ? "border-maldives-600 bg-maldives-600 text-white" : "border-neutral-300 text-neutral-700"}`}
              >
                All types
              </Link>
              {fishingTypes.map((type) => (
                <Link
                  key={type.id}
                  href={`/maldives/fishing/?type=${type.slug}`}
                  className={`rounded-full border px-3 py-1 ${activeType?.id === type.id ? "border-maldives-600 bg-maldives-600 text-white" : "border-neutral-300 text-neutral-700"}`}
                >
                  {type.title}
                </Link>
              ))}
            </nav>
          )}

          <form method="get" className="mt-4 flex gap-2">
            <label htmlFor="fishing-search" className="sr-only">
              Search fishing activities
            </label>
            <input
              id="fishing-search"
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Search fishing trips…"
              className="w-full max-w-sm rounded-full border border-neutral-300 px-4 py-2 text-sm focus:border-maldives-500 focus:outline-none"
            />
            <button type="submit" className="rounded-full bg-maldives-600 px-4 py-2 text-sm font-medium text-white hover:bg-ocean-800">
              Search
            </button>
          </form>

          {results.items.length === 0 ? (
            <EmptyState title="No fishing activities recorded for this filter yet" />
          ) : (
            <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {results.items.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </ul>
          )}

          {!isSearching && <Pagination page={page} totalPages={totalPages} basePath="/maldives/fishing/" baseQuery={baseQuery} />}
        </section>

        {/* Related content */}
        <section className="mt-12 border-t border-neutral-200 pt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Explore More Maldives</h2>
          <nav aria-label="Related Maldives links" className="mt-4 flex flex-wrap gap-2">
            {[
              { href: "/maldives/diving/", label: "Diving" },
              { href: "/maldives/surfing/", label: "Surfing" },
              { href: "/maldives/activities/", label: "All Activities" },
              { href: "/maldives/packages/", label: "All Packages" },
              { href: "/maldives/packages/fishing/", label: "Fishing Packages" },
              { href: "/maldives/transfers/", label: "Maldives Transfers" },
              { href: "/maldives/resorts/", label: "Resorts" },
              { href: "/maldives/travel-guide/", label: "Travel Guide" },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:border-maldives-500 hover:text-maldives-600">
                {link.label}
              </Link>
            ))}
          </nav>
        </section>

        {/* FAQs */}
        <section className="mt-12 border-t border-neutral-200 pt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Frequently Asked Questions</h2>
          <dl className="mt-4 space-y-6">
            {FAQS.map((faq) => (
              <div key={faq.question}>
                <dt className="font-medium text-ocean-900">{faq.question}</dt>
                <dd className="mt-1 text-sm text-neutral-700">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </main>
  );
}
