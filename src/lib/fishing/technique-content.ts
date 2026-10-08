/**
 * Per-page content for the fishing-technique SEO landing pages
 * (/maldives/fishing/popping/, /jigging/, /fly-fishing/) — Phase 5 of the
 * Maldives Fishing growth plan. Technique descriptions here are generic,
 * factual how-it-works explanations (the same kind of non-invented
 * content already used in FISHING_TYPE_CONTENT on the fishing hub), never
 * fabricated catch rates or statistics.
 *
 * Only 3 of the plan's 9 technique pages for now (Popping, Jigging, Fly
 * Fishing) — the rest need a scoped decision on what to build next, same
 * caveat as species-content.ts.
 */

export interface TechniquePageContent {
  pageSlug: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroDescription: string;
  howItWorks: string[];
  targetSpecies: Array<{ label: string; href: string | null }>;
  /** Real charter activity slugs that offer this technique — never an
   * invented technique-specific SKU unless a real one exists (fly fishing
   * genuinely has its own 2 charter products; popping/jigging don't — they
   * run on the same general private charters). */
  charterSlugs: string[];
  /** A real package slug to feature, if one exists for this technique
   * (fly fishing has a real 3-night holiday package). */
  packageSlug?: string;
  faqs: Array<{ question: string; answer: string }>;
}

export const TECHNIQUE_PAGES: Record<string, TechniquePageContent> = {
  popping: {
    pageSlug: "popping",
    metaTitle: "Popping Fishing Maldives | GT Popping Charters",
    metaDescription:
      "GT popping in the Maldives — working surface poppers over reef edges and channels aboard Emperor, our private Gaafu Atoll fishing charter.",
    h1: "Popping in the Maldives",
    heroDescription: "A surface technique that triggers explosive strikes from giant trevally over reef edges and channel mouths.",
    howItWorks: [
      "Popping uses a hollow, cupped-face surface lure (a \"popper\") worked across the water in short, aggressive pulls, pushing water and creating a commotion that imitates a fleeing baitfish. It's a visual, physical technique — you see the strike happen on the surface.",
      "On our own Gaafu Atoll charters, popping is run over outer reef edges and channel mouths, where the tide concentrates baitfish and the predators that hunt them.",
    ],
    targetSpecies: [{ label: "Giant Trevally (GT)", href: "/maldives/fishing/gt-fishing/" }],
    charterSlugs: ["private-full-day-fishing-charter", "private-half-day-fishing-charter"],
    faqs: [
      {
        question: "What fish can I catch popping in the Maldives?",
        answer: "Giant trevally (GT) is the main target for popping over reef edges and channels — see our GT fishing page for more.",
      },
      {
        question: "Do I need my own popping gear?",
        answer: "No — basic fishing gear is included on our charters. If you have your own preferred popping setup, you're welcome to bring it.",
      },
      {
        question: "Where does popping happen?",
        answer: "Mainly outer reef edges and channel mouths, where tidal current concentrates baitfish — our Gaafu Atoll charters run this regularly.",
      },
    ],
  },
  jigging: {
    pageSlug: "jigging",
    metaTitle: "Jigging Maldives | GT & Dogtooth Tuna Jigging Charters",
    metaDescription:
      "Jigging in the Maldives — working a metal jig through the water column for GT and dogtooth tuna aboard Emperor, our private Gaafu Atoll fishing charter.",
    h1: "Jigging in the Maldives",
    heroDescription: "A vertical technique for working deeper water and drop-offs — the usual method for dogtooth tuna.",
    howItWorks: [
      "Jigging works a weighted metal lure vertically through the water column, usually dropped to depth then retrieved in sharp, rhythmic sweeps. It reaches fish holding deeper than a surface lure can — particularly effective over reef slopes and drop-offs.",
      "On our own Gaafu Atoll charters, jigging targets giant trevally over reef edges and dogtooth tuna over deeper reef slopes and drop-offs, where these solitary hunters are known to hold.",
    ],
    targetSpecies: [
      { label: "Giant Trevally (GT)", href: "/maldives/fishing/gt-fishing/" },
      { label: "Dogtooth Tuna", href: null },
    ],
    charterSlugs: ["private-full-day-fishing-charter", "private-half-day-fishing-charter"],
    faqs: [
      {
        question: "What fish can I catch jigging in the Maldives?",
        answer:
          "Dogtooth tuna, known for their fighting ability and tendency to dive deep when hooked, are a prized jigging target — giant trevally are also caught jigging over reef edges.",
      },
      {
        question: "Do I need my own jigging gear?",
        answer: "No — basic fishing gear is included on our charters. If you have your own preferred jigging setup, you're welcome to bring it.",
      },
    ],
  },
  "fly-fishing": {
    pageSlug: "fly-fishing",
    metaTitle: "Fly Fishing Maldives | Maldives Fly Fishing Charters",
    metaDescription:
      "Fly fishing in the Maldives — sight-casting on the flats and reef edges aboard our dedicated fly fishing charters, full-day, half-day or a multi-night fly fishing holiday.",
    h1: "Fly Fishing in the Maldives",
    heroDescription: "Sight-casting a fly to fish on the flats and reef edges — a specialist technique rewarding accurate casting over shallow, clear water.",
    howItWorks: [
      "Fly fishing here means sight-casting a fly to fish on the flats and reef edges, rather than trolling or bait fishing — a technique that rewards accurate casting and reading the water over shallow, clear ground.",
      "Our own full-day and half-day fly fishing charters run from the same private Gaafu Atoll operation as our general charters. Bring your own fly rod and gear.",
    ],
    targetSpecies: [
      { label: "Giant Trevally (GT)", href: "/maldives/fishing/gt-fishing/" },
      { label: "Reef species", href: null },
    ],
    charterSlugs: ["fly-fishing-full-day-charter", "fly-fishing-half-day-charter"],
    packageSlug: "3-night-maldives-fly-fishing-holiday",
    faqs: [
      {
        question: "Is fly fishing different from our general private charter?",
        answer: "Yes — fly fishing has its own dedicated full-day and half-day charter products, run from the same Gaafu Atoll operation.",
      },
      {
        question: "Do I need to bring my own fly fishing gear?",
        answer: "Yes — bring your own fly rod and gear for our fly fishing charters.",
      },
      {
        question: "Is there a fly fishing holiday package?",
        answer: "Yes — see our 3-night Maldives fly fishing holiday package, which bundles accommodation, meals and the charter together.",
      },
    ],
  },
};
