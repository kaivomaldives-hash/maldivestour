import type { ContentSection } from "@/lib/content/content-section";
import type { MediaAsset } from "@/lib/media/types";
import { asset } from "@/lib/packages/category-images";
import { mfhPackageRow } from "@/lib/packages/mfh-price-rows";

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
  /** Overrides the generic fishing hero photo. */
  heroImage?: MediaAsset;
  /** Longer-form sections rendered after "Target Species". */
  extraSections?: ContentSection[];
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
  "big-game-fishing": {
    pageSlug: "big-game-fishing",
    metaTitle: "Deep Sea Fishing Maldives | Big Game Fishing Charters",
    metaDescription:
      "Deep sea and big game fishing in the Maldives: trolling for yellowfin tuna, wahoo, sailfish and marlin, best season, prices and private charters.",
    h1: "Deep Sea and Big Game Fishing in the Maldives",
    heroDescription: "Trolling offshore for yellowfin tuna, wahoo, mahi-mahi, sailfish and marlin in the deep blue water beyond the atolls.",
    heroImage: asset(
      "dbd93db3-e064-94a9-5883-96ea6c3aebf1",
      "opt/uploads/assets/uploads/fishing/images/gallery/blue-marlin.webp",
      "Three people holding a blue marlin on a fishing boat in the Maldives",
    ),
    extraSections: [
      {
        heading: "Deep Sea Fishing in the Maldives",
        paragraphs: [
          "Deep sea fishing, also called big game or offshore fishing, means heading out beyond the atoll rim into the deep blue water of the Indian Ocean to fish for large pelagic species. In the Maldives the deep water starts just outside the reef of every atoll, so a deep sea fishing trip doesn't need a long run offshore: the boat can be trolling along the drop-off within minutes of leaving the island.",
          "The main targets are yellowfin tuna, wahoo and mahi-mahi, with sailfish and marlin further out. Skipjack tuna are often found in large schools, and dogtooth tuna and giant trevally live along the reef walls, so many deep sea trips in the Maldives mix offshore trolling with a session of popping or jigging on the reef.",
        ],
        image: asset(
          "6007f61c-90c0-de64-6c2b-70c47da0c911",
          "opt/legacy/fishing/images/trolling-fishing.webp",
          "Trolling rods set in the stern of a sport-fishing boat with a white wake behind it in the Maldives",
        ),
      },
      {
        heading: "Deep Sea Fishing Species in the Maldives",
        paragraphs: [
          "These are the main fish on a Maldives deep sea fishing trip, with the seasons from our species records. Seasons vary by atoll and year, so treat them as a guide.",
        ],
        table: {
          headers: ["Species", "Where", "Season", "Main technique"],
          rows: [
            [{ text: "Yellowfin tuna", href: "/maldives/fishing/tuna-fishing/" }, { text: "Offshore, under birds, around FADs" }, { text: "December to March" }, { text: "Trolling, casting to schools" }],
            [{ text: "Wahoo", href: "/maldives/fishing/wahoo-fishing/" }, { text: "Outer reef edges and offshore" }, { text: "December to March" }, { text: "Fast trolling" }],
            [{ text: "Mahi-mahi", href: "/maldives/fishing/mahi-mahi-fishing/" }, { text: "Floating debris, FADs" }, { text: "December to April" }, { text: "Trolling, casting" }],
            [{ text: "Skipjack tuna" }, { text: "Offshore schools" }, { text: "All year" }, { text: "Trolling small lures" }],
            [{ text: "Sailfish", href: "/maldives/fishing/sailfish-fishing/" }, { text: "Deep water, often near the reef" }, { text: "Ask about recent catches" }, { text: "Trolling, live bait" }],
            [{ text: "Marlin", href: "/maldives/fishing/marlin-fishing/" }, { text: "Deep blue water offshore" }, { text: "Ask about recent catches" }, { text: "Trolling" }],
          ],
        },
      },
      {
        heading: "Deep Sea Fishing or Reef Fishing?",
        paragraphs: [
          "Deep sea fishing is about covering water offshore and waiting for a strike from a fast pelagic fish: long runs, big spreads of lures, and the chance of a tuna, wahoo or billfish. Reef fishing, popping and jigging are about working the reef edges, channels and walls for giant trevally, dogtooth tuna, groupers and snappers. In the Maldives you don't have to choose: the deep water is right outside the reef, so a full day on Emperor can include a few hours trolling offshore and a session of popping or jigging on the way back.",
        ],
        links: [
          { label: "GT fishing", href: "/maldives/fishing/gt-fishing/" },
          { label: "Popping and jigging guide", href: "/maldives/travel-guide/gt-popping-and-jigging-guide/" },
        ],
      },
      {
        heading: "Deep Sea Fishing Techniques",
        paragraphs: [
          "Trolling is the main technique. The crew sets several rods with skirted lures, diving plugs or rigged baits at different distances behind the boat, and runs at trolling speed along the outer reef edge for wahoo or offshore for tuna, mahi-mahi and billfish, watching for diving birds, floating debris and fish breaking the surface. When a fish strikes, an angler takes the rod and fights it from the boat.",
          "When yellowfin tuna are feeding on the surface, anglers can also cast poppers and stickbaits into the school, and live bait is used for sailfish and marlin that come up behind the boat. Trolling tackle is supplied on the boat.",
        ],
        image: asset(
          "e5ffdf3e-f374-906a-92b3-61c4c7190d3c",
          "opt/uploads/assets/uploads/fishing/images/gallery/wahoo-in-maldives.webp",
          "Angler holding a long wahoo on a fishing boat in the Maldives",
        ),
        links: [
          { label: "Trolling in the Maldives", href: "/maldives/fishing/trolling/" },
          { label: "Big game fishing in the Indian Ocean", href: "/maldives/travel-guide/big-game-fishing-indian-ocean/" },
        ],
      },
      {
        heading: "Best Time for Deep Sea Fishing in the Maldives",
        paragraphs: [
          "The calmer northeast monsoon, from December to April, is the best time for deep sea fishing in the Maldives. The sea is flatter, which makes long trolling runs more comfortable, and it is peak season for yellowfin tuna and wahoo (December to March) and mahi-mahi (December to April). Sailfish and marlin are caught offshore at different times of the year; ask us about recent catches when you plan.",
          "Trips still run through the southwest monsoon, from May to November, choosing calmer days, and it is the most commonly reported season for giant trevally on the reef.",
        ],
        image: asset(
          "65ce543b-f8cb-5760-a0ed-e49aefe7280d",
          "opt/uploads/assets/uploads/fishing/images/gallery/giant-yellowfin-tuna.webp",
          "Several yellowfin tuna laid out on the deck of a fishing boat with three anglers in the Maldives",
        ),
        links: [{ label: "Best time to fish in the Maldives", href: "/maldives/travel-guide/maldives-fishing-seasons-month-by-month-guide/" }],
      },
      {
        heading: "Deep Sea Fishing Trip Prices",
        paragraphs: [
          "Our private boat, Emperor, is a 32-foot fishing boat with twin 200 HP engines for up to 5 anglers, based on Maamendhoo in Gaafu Alifu Atoll, where deep ocean lies just beyond the long outer reef. For offshore fishing we recommend a full day: USD 1,380 per boat, or USD 276 each with five anglers. A half day costs USD 980 per boat. Both include a professional captain and crew, fuel, soft drinks and snacks, and basic fishing gear.",
          "Near Malé, the site also lists big game trips run by resorts and independent operators; see the charters below. For several days of fishing, our packages at the Maldives Fishing and Holidays Lodge include the lodge, meals, the domestic flight, the transfer and a private charter on every fishing day.",
        ],
        image: asset(
          "e520e856-d8be-505a-1e39-bc1a61f726e0",
          "opt/uploads/assets/uploads/fishing/images/charters/emperor.webp",
          "Emperor, a 32 ft white-and-black fishing boat with twin outboards, anchored off a Maldives island",
        ),
        table: {
          headers: ["Package (full-day tuna fishing)", "Fishing days", "Per person, 2 anglers", "Per person, 5 anglers"],
          rows: [3, 5, 7].map((nights) => mfhPackageRow(nights, "fullTuna", [2, 5])),
        },
        links: [
          { label: "Emperor private fishing charter", href: "/maldives/fishing/emperor/" },
          { label: "All fishing packages", href: "/maldives/packages/fishing/" },
          { label: "Maldives fishing trip cost", href: "/maldives/travel-guide/maldives-fishing-trip-cost/" },
        ],
      },
      {
        heading: "Marlin and Sailfish Fishing",
        paragraphs: [
          "Billfish are the ultimate deep sea fishing targets. Sailfish, with their huge dorsal fin and acrobatic jumps, are often caught closer to the reef than marlin; marlin are a longer-range target in deep blue water, so a full-day charter gives the best chance. Billfish are normally released: keep the fish in the water, hold it alongside facing into the current and let it swim away.",
        ],
        image: asset(
          "2193250b-9c16-35ad-5cff-27dd8bee233d",
          "opt/uploads/assets/uploads/fishing/images/gallery/big-game-fishing-in-maldives.webp",
          "Angler holding a sailfish across his lap on a fishing boat in the Maldives",
        ),
        links: [
          { label: "Marlin fishing", href: "/maldives/fishing/marlin-fishing/" },
          { label: "Sailfish fishing", href: "/maldives/fishing/sailfish-fishing/" },
        ],
      },
      {
        heading: "Tips for Your Deep Sea Fishing Trip",
        paragraphs: [
          "Book a full day for offshore species, since they take time to find. Take seasickness precautions if you need them, because offshore water can be lumpy. Bring a hat, polarised sunglasses, a long-sleeved shirt and reef-safe sunscreen. Agree with the crew which fish you'd like to keep for the table and which to release, and let the crew rig the trolling tackle.",
        ],
        links: [{ label: "Fishing holiday packing list", href: "/maldives/travel-guide/fishing-holiday-packing-list/" }],
      },
    ],
    howItWorks: [
      'Big game fishing means trolling lures at speed for large pelagic species — tuna, wahoo, sailfish and marlin — usually a half-day or full-day trip further offshore, closer to the open ocean beyond the atoll rim.',
      "Several resort-run and independent trips on record are tagged big game fishing, alongside our own Emperor charters, which run the same technique for yellowfin tuna and wahoo from Gaafu Atoll.",
    ],
    targetSpecies: [
      { label: "Yellowfin Tuna", href: "/maldives/fishing/tuna-fishing/" },
      { label: "Wahoo", href: "/maldives/fishing/wahoo-fishing/" },
      { label: "Mahi-Mahi", href: "/maldives/fishing/mahi-mahi-fishing/" },
      { label: "Marlin", href: "/maldives/fishing/marlin-fishing/" },
      { label: "Sailfish", href: "/maldives/fishing/sailfish-fishing/" },
    ],
    // Emperor's own charters, plus the 3 real third-party activities
    // already tagged with the "big-game-fishing" category (see
    // supabase/migrations/20250105000100_seed_fishing.sql) — not
    // Emperor-only, since real independent/resort operators run this too.
    charterSlugs: [
      "private-full-day-fishing-charter",
      "private-half-day-fishing-charter",
      "marlin-big-game-fishing-charter",
      "big-game-fishing-trip",
      "big-game-fishing-trip-lankanfushi",
    ],
    faqs: [
      {
        question: "What fish can I catch big game fishing in the Maldives?",
        answer: "Tuna, wahoo, sailfish and marlin are the usual targets, further offshore beyond the atoll rim — see Target Species above.",
      },
      {
        question: "What is the difference between deep sea fishing and big game fishing?",
        answer: "They mean much the same thing: fishing offshore in deep water for large pelagic fish such as tuna, wahoo, sailfish and marlin, mainly by trolling.",
      },
      {
        question: "How much does deep sea fishing in the Maldives cost?",
        answer:
          "A private full-day charter on Emperor costs USD 1,380 per boat for up to 5 anglers, or USD 980 for a half day, including the crew, fuel, drinks, snacks and basic gear.",
      },
      {
        question: "When is the best time for deep sea fishing in the Maldives?",
        answer: "December to April, during the calmer northeast monsoon, when yellowfin tuna, wahoo and mahi-mahi are in season.",
      },
      {
        question: "Can beginners go deep sea fishing?",
        answer: "Yes. The crew sets the lures and watches the rods, hands you the rod when a fish strikes, and talks you through the fight.",
      },
      {
        question: "Is big game fishing only available with Emperor?",
        answer:
          "No — several real resort-run and independent operators also run big game fishing trips, alongside our own Emperor charters. See Available Charters below for what's currently on record.",
      },
    ],
  },
  trolling: {
    pageSlug: "trolling",
    metaTitle: "Trolling Fishing Maldives | Trolling Charters",
    metaDescription:
      "Trolling in the Maldives — pulling lures behind a moving boat across open water for tuna, wahoo and mahi-mahi, aboard Emperor, our private Gaafu Atoll fishing charter.",
    h1: "Trolling in the Maldives",
    heroDescription: "Pulling lures behind a moving boat across open water — a steady, productive technique for covering ground and finding feeding fish.",
    howItWorks: [
      "Trolling pulls a set of lures through the water behind a moving boat, covering open water until a feeding fish strikes. It's the underlying technique behind most big game fishing trips here, rather than a separate product of its own.",
      "On our own Gaafu Atoll charters, trolling runs along reef edges and over open water further offshore, the same grounds used for our general big game fishing trips.",
    ],
    targetSpecies: [
      { label: "Yellowfin Tuna", href: "/maldives/fishing/tuna-fishing/" },
      { label: "Wahoo", href: "/maldives/fishing/wahoo-fishing/" },
      { label: "Mahi-Mahi", href: "/maldives/fishing/mahi-mahi-fishing/" },
    ],
    charterSlugs: ["private-full-day-fishing-charter", "private-half-day-fishing-charter"],
    faqs: [
      {
        question: "Is trolling the same as big game fishing?",
        answer:
          "Trolling is the technique used on most big game fishing trips — pulling lures behind the boat across open water — rather than a separate product. See Big Game Fishing for the full target species list and available charters.",
      },
      {
        question: "What fish can I catch trolling in the Maldives?",
        answer: "Yellowfin tuna, wahoo and mahi-mahi are the usual targets trolling open water and reef edges — see Target Species above.",
      },
      {
        question: "Do I need my own trolling gear?",
        answer: "No — basic fishing gear, including trolling lures, is included on our charters.",
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
        answer: "Yes — our fly fishing holidays run from 3 to 8 nights with full-day or half-day fly fishing, and bundle the lodge, full-board meals, the domestic flight, the boat transfer and the fly fishing charter together.",
      },
    ],
  },
};
