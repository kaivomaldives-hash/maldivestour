import type { AccommodationType, PriceTier } from "@/lib/accommodations/types";

/**
 * Curated, keyword-driven SEO landing pages for hotel/resort filters —
 * deliberately a short, hand-picked whitelist rather than making every
 * filter combination indexable. Each entry becomes a clean static route
 * (e.g. /maldives/resorts/luxury/), reusing the same getAccommodations()
 * filters as the query-string directory filters, but as its own canonical
 * URL with real intro copy and an FAQ — never a thin "same grid, new
 * title" page.
 *
 * Query-string filter combinations on /maldives/resorts/ and
 * /maldives/hotels/ (atoll, island, priceTier, starRating, allInclusive,
 * overwater, and any combination of them) stay noindex,follow exactly as
 * they already were (see accommodation-directory-page.tsx's hasAnyFilter)
 * — this whitelist does NOT flip that. Atoll-specific search intent
 * ("luxury resorts in Kaafu Atoll") is already served by the existing
 * indexable /maldives/atolls/[atoll]/ page, which lists that atoll's real
 * resorts and guesthouses/hotels directly — a second, near-duplicate
 * "/maldives/resorts/kaafu-atoll/" page is deliberately NOT created here.
 *
 * Only filters this site's schema actually supports are listed — no
 * landing page for e.g. "diving resorts" or "snorkeling resorts" exists
 * yet because accommodations aren't currently joined to activity
 * categories; adding that is a separate, larger change.
 */

export type AccommodationSeoLandingSlug = "luxury" | "all-inclusive" | "overwater-villas" | "budget";

export interface AccommodationSeoLandingSpec {
  slug: AccommodationSeoLandingSlug;
  accommodationType: AccommodationType;
  /** Filters passed straight into getAccommodations(). */
  filters: {
    priceTier?: PriceTier;
    priceTiers?: PriceTier[];
    allInclusive?: boolean;
    overwaterVillas?: boolean;
  };
  /** A page is only ever indexed/sitemapped when its live result count is
   * at least this many — an empty or near-empty "landing page" is worse
   * for SEO than not having one. Configurable per entry, reviewed against
   * real inventory rather than assumed. */
  minResults: number;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  faqs: Array<{ question: string; answer: string }>;
}

const RESORT_SPECS: AccommodationSeoLandingSpec[] = [
  {
    slug: "luxury",
    accommodationType: "resort",
    filters: { priceTiers: ["luxury", "ultra_luxury"] },
    minResults: 3,
    metaTitle: "Luxury Resorts in the Maldives | MTG",
    metaDescription: "Real luxury and 5-star Maldives resorts — overwater villas, private islands, and premium all-inclusive stays. Search, compare, and enquire.",
    h1: "Luxury Resorts in the Maldives",
    intro:
      "A luxury Maldives resort usually means an overwater villa, a private island with a limited number of guests, and a premium or all-inclusive dining structure. Every resort below is real and already in our catalogue — browse by atoll using the atoll guides linked below for a more local view of any specific destination.",
    faqs: [
      { question: "What counts as a luxury resort here?", answer: "Resorts priced in our luxury or ultra-luxury tier — see each resort's own page for its real star rating, villa types and inclusions." },
      { question: "Do luxury resorts include overwater villas?", answer: "Many do, but not all — use the Overwater Villas filter on this page, or see our dedicated Overwater Villa Resorts page." },
      { question: "Can I find luxury resorts in a specific atoll?", answer: "Yes — see our atoll guides (linked below) for resorts in Kaafu, Baa, Alif Dhaalu and other atolls specifically." },
    ],
  },
  {
    slug: "all-inclusive",
    accommodationType: "resort",
    filters: { allInclusive: true },
    minResults: 3,
    metaTitle: "All-Inclusive Resorts in the Maldives | MTG",
    metaDescription: "Real all-inclusive Maldives resorts with meals, drinks and activities bundled in. Search, compare, and enquire.",
    h1: "All-Inclusive Resorts in the Maldives",
    intro:
      "An all-inclusive Maldives resort bundles meals (and usually drinks and some activities) into the room rate — useful for predictable budgeting on an island where off-resort dining options are limited. Every resort below is marked all-inclusive on its own real listing, not inferred.",
    faqs: [
      { question: "What's included in an all-inclusive Maldives resort?", answer: "It varies by resort — check each resort's own page for exactly what's bundled (meals, drinks, activities) before booking." },
      { question: "Are all-inclusive resorts more expensive?", answer: "The room rate is usually higher than a bed-and-breakfast equivalent, but can work out cheaper overall once meals and activities are factored in." },
      { question: "Can I find a luxury all-inclusive resort?", answer: "Yes — combine this page with our Luxury Resorts page, or use the price filter on this page directly." },
    ],
  },
  {
    slug: "overwater-villas",
    accommodationType: "resort",
    filters: { overwaterVillas: true },
    minResults: 3,
    metaTitle: "Resorts with Overwater Villas in the Maldives | MTG",
    metaDescription: "Real Maldives resorts with overwater villas and water bungalows. Search, compare, and enquire.",
    h1: "Resorts with Overwater Villas in the Maldives",
    intro:
      "Overwater villas (also called water bungalows) are one of the Maldives' signature experiences — direct lagoon access, often with a private deck or plunge pool. Every resort below genuinely offers overwater villas on record, not just a beach villa marketed loosely as one.",
    faqs: [
      { question: "What's the difference between an overwater villa and a water bungalow?", answer: "They're generally the same thing, marketed under different names by different resorts — check each resort's own room types for specifics." },
      { question: "Do overwater villas have private pools?", answer: "Some do, some don't — this varies by resort and room category, see each resort's own listing." },
      { question: "Are overwater villas more expensive than beach villas?", answer: "Usually yes, though it varies by resort — compare room rates directly on each resort's own page." },
    ],
  },
];

const HOTEL_SPECS: AccommodationSeoLandingSpec[] = [
  {
    slug: "budget",
    accommodationType: "hotel",
    filters: { priceTier: "budget" },
    minResults: 3,
    metaTitle: "Budget Hotels in the Maldives | MTG",
    metaDescription: "Real budget and affordable hotels in the Maldives, mostly on local islands. Search, compare, and enquire.",
    h1: "Budget Hotels in the Maldives",
    intro:
      "Budget hotels in the Maldives are almost always on local, inhabited islands rather than private resort islands — a genuinely affordable way to visit without resort-island prices, usually reached by public ferry or speedboat. Every hotel below is real and already in our catalogue.",
    faqs: [
      { question: "Are budget hotels on local islands or resort islands?", answer: "Local islands, almost always — that's what keeps the price down compared to a private resort island." },
      { question: "How do I get to a local island?", answer: "Usually public ferry or speedboat from Male — see each hotel's own page, or our Maldives Transfers section, for specifics." },
      { question: "Are budget hotels good for first-time visitors?", answer: "Yes — local islands like Maafushi are a common, well-established starting point for budget travelers." },
    ],
  },
];

export const ACCOMMODATION_SEO_LANDING_SPECS: Record<AccommodationType, AccommodationSeoLandingSpec[]> = {
  resort: RESORT_SPECS,
  hotel: HOTEL_SPECS,
  guesthouse: [],
  villa: [],
  liveaboard: [],
  other: [],
};

export function getAccommodationSeoLandingSpec(type: AccommodationType, slug: string): AccommodationSeoLandingSpec | null {
  return ACCOMMODATION_SEO_LANDING_SPECS[type].find((s) => s.slug === slug) ?? null;
}

export function getAllAccommodationSeoLandingSpecs(): Array<{ type: AccommodationType; spec: AccommodationSeoLandingSpec }> {
  const all: Array<{ type: AccommodationType; spec: AccommodationSeoLandingSpec }> = [];
  for (const [type, specs] of Object.entries(ACCOMMODATION_SEO_LANDING_SPECS) as Array<[AccommodationType, AccommodationSeoLandingSpec[]]>) {
    for (const spec of specs) all.push({ type, spec });
  }
  return all;
}
