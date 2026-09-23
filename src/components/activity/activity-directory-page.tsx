import type { Metadata } from "next";
import Link from "next/link";

import { ActivitiesVideo, activitiesVideoJsonLd } from "@/components/activity/activities-video";
import { ActivityCard } from "@/components/activity/activity-card";
import { ActivityFilterBar } from "@/components/activity/activity-filter-bar";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { PageHero } from "@/components/ui/page-hero";
import { getActivities, searchActivities } from "@/lib/activities/repository";
import { hasDedicatedRoute, type ActivityCategory, type ActivityDifficulty } from "@/lib/activities/types";
import { getAtollBySlug, getAtolls, getIslandBySlug } from "@/lib/locations/repository";
import { asset } from "@/lib/packages/category-images";
import { breadcrumbJsonLd, canonicalUrl } from "@/lib/seo/site";

// A real legacy island-hopping photo (already verified against
// data/maldives/migration/full-legacy-image-library-manifest.json and used
// elsewhere in this project — see src/lib/packages/package-images.ts) —
// there's no dedicated "general activities" category fallback image yet,
// so this is the closest genuinely on-topic hero available.
const ACTIVITIES_HERO = asset(
  "1169d556-fa59-fd56-3eb2-660d07d28e40",
  "legacy/images/activities/island-hopping/island-hopping-tour.webp",
  "Island hopping tour, Maldives",
);

const FAQS = [
  {
    question: "What's the difference between an activity and a package?",
    answer: "An activity is a single experience or trip — a few hours to a day. A package bundles activities with accommodation, meals and transfers into a multi-night holiday — see Maldives Packages for those.",
  },
  {
    question: "Do I need to book activities in advance?",
    answer: "It depends on the operator — enquire on any activity's own page and we'll confirm real availability before you book.",
  },
  {
    question: "Are fishing, diving and surfing activities listed here too?",
    answer: "They have their own dedicated pages — see Fishing, Diving and Surfing — since each has enough real activities to warrant its own hub. Every other category (excursions, watersports, island hopping, spa, culture) is listed directly here.",
  },
];

function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
  };
}

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
const PAGE_SIZE = 24;

export interface ActivityDirectorySearchParams {
  q?: string;
  page?: string;
  category?: string;
  atoll?: string;
  island?: string;
  difficulty?: string;
  maxPrice?: string;
}

function hasAnyFilter(sp: ActivityDirectorySearchParams): boolean {
  return Boolean(sp.q || sp.category || sp.atoll || sp.island || sp.difficulty || sp.maxPrice);
}

export async function activityDirectoryMetadata(searchParams: Promise<ActivityDirectorySearchParams>): Promise<Metadata> {
  const sp = await searchParams;
  const title = "Maldives Activities | Things to Do, Tours & Experiences";
  const description = "Real, bookable Maldives activities and excursions — island hopping, watersports, dolphin cruises and more — by category, atoll and island.";
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
  const difficulty = (["beginner", "intermediate", "advanced", "all_levels"] as ActivityDifficulty[]).includes(sp.difficulty as ActivityDifficulty)
    ? (sp.difficulty as ActivityDifficulty)
    : undefined;
  const maxPrice = sp.maxPrice ? Number(sp.maxPrice) : undefined;

  const [atoll, island, atolls] = await Promise.all([
    sp.atoll ? getAtollBySlug(sp.atoll) : Promise.resolve(null),
    sp.island ? getIslandBySlug(sp.island) : Promise.resolve(null),
    getAtolls(),
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
        difficulty,
        maxPriceFrom: maxPrice,
      });

  const totalPages = isSearching ? 1 : Math.max(1, Math.ceil(results.total / PAGE_SIZE));

  const baseParams = new URLSearchParams();
  if (category) baseParams.set("category", category);
  if (sp.atoll) baseParams.set("atoll", sp.atoll);
  if (sp.island) baseParams.set("island", sp.island);
  if (difficulty) baseParams.set("difficulty", difficulty);
  if (maxPrice !== undefined) baseParams.set("maxPrice", String(maxPrice));
  const baseQuery = baseParams.toString();

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ label: "Maldives", href: "/maldives/" }, { label: "Activities" }], "/maldives/activities")) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(activitiesVideoJsonLd()) }} />

      <PageHero
        breadcrumbs={[{ label: "Maldives", href: "/maldives/" }, { label: "Activities" }]}
        eyebrow="Things to do"
        title="Maldives Activities"
        description={
          (atoll || island) ? undefined : "Real, individually verified things to do in the Maldives — excursions, watersports, island hopping and more, sourced from official operator and resort information."
        }
        image={(atoll || island) ? undefined : ACTIVITIES_HERO}
      />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
        {!(atoll || island) && !isSearching && !category && (
          <section className="prose-sm max-w-none text-sm text-neutral-700">
            <p>
              Beyond diving, fishing and surfing (each with their own dedicated page), the Maldives offers a real range of things to
              do — sandbank picnics, dolphin cruises, snorkeling trips, island hopping tours, spa treatments and guided cultural visits to
              Malé. Every activity below is a real, individually sourced experience from a resort or independent operator, not a generic
              stock listing.
            </p>
          </section>
        )}

        {(atoll || island) && (
          <p className="text-sm text-neutral-600">
            Filtered to {island ? island.title : atoll?.title}.{" "}
            <Link href="/maldives/activities/" className="underline">
              Clear
            </Link>
          </p>
        )}

        <div className="mt-4">
          <ActivityFilterBar
            basePath="/maldives/activities/"
            currentParams={baseParams}
            activeCategory={category}
            atolls={atolls}
            activeAtoll={sp.atoll}
            activeDifficulty={difficulty}
            maxPrice={sp.maxPrice ?? ""}
            query={query}
            resultCount={isSearching ? results.items.length : results.total}
          />
        </div>

        {results.items.length === 0 ? (
          <EmptyState title="No activities recorded for this filter yet" />
        ) : (
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {results.items.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </ul>
        )}

        {!isSearching && <Pagination page={page} totalPages={totalPages} basePath="/maldives/activities/" baseQuery={baseQuery} />}

        <ActivitiesVideo />

        <section className="mt-12 border-t border-neutral-200 pt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Explore More Maldives</h2>
          <nav aria-label="Related Maldives links" className="mt-4 flex flex-wrap gap-2">
            {[
              { href: "/maldives/fishing/", label: "Fishing" },
              { href: "/maldives/diving/", label: "Diving" },
              { href: "/maldives/surfing/", label: "Surfing" },
              { href: "/maldives/packages/", label: "Packages" },
              { href: "/maldives/resorts/", label: "Resorts" },
              { href: "/maldives/transfers/", label: "Transfers" },
              { href: "/maldives/travel-guide/", label: "Travel Guide" },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:border-maldives-500 hover:text-maldives-600">
                {link.label}
              </Link>
            ))}
          </nav>
        </section>

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
