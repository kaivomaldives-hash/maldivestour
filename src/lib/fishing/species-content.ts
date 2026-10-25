import { asset } from "@/lib/packages/category-images";
import type { MediaAsset } from "@/lib/media/types";
import { MFH_PRICE_TABLES } from "@/lib/packages/mfh-price-tables";

/**
 * Per-page content for the species SEO landing pages (/maldives/fishing/
 * gt-fishing/, /maldives/fishing/tuna-fishing/) — Phase 4 of the Maldives
 * Fishing growth plan. Each entry wraps the real, legacy-sourced bio data
 * already in fish-species.ts (size/habitat/season/description) with the
 * extra page-level context the growth plan asks for: why the Maldives
 * suits the species, which real techniques/charters target it, and which
 * atolls are already documented as good ground for it.
 *
 * Marlin and Sailfish have no real bio entry in fish-species.ts (no legacy
 * size/habitat/season data exists for them anywhere in this codebase), so
 * those two entries use fallbackImage/fallbackDescription instead of
 * speciesSlug — see SpeciesPageContent below.
 */

export interface SpeciesPageContent {
  /** The species' common name, used in prose/headings independent of
   * whether a fish-species.ts bio entry exists (e.g. "Marlin"). */
  displayName: string;
  /** fish-species.ts slug this page wraps (e.g. "giant-trevally") — left
   * undefined for a species with no real bio entry there (no legacy size/
   * habitat/season data exists for it anywhere in this codebase). When
   * undefined, the page skips the stats table and season section rather
   * than inventing those facts, using fallbackImage/fallbackDescription
   * for the hero instead. */
  speciesSlug?: string;
  fallbackImage?: MediaAsset;
  fallbackDescription?: string;
  /** This page's own URL slug under /maldives/fishing/ (e.g. "gt-fishing"). */
  pageSlug: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  /** Why the Maldives specifically suits this species — real, sourced
   * reasoning, not invented statistics. */
  whyMaldives: string[];
  techniques: Array<{ label: string; href: string | null }>;
  /** Real charter activity slugs (from fishing/repository.ts) that target
   * this species — never an invented species-specific SKU. */
  charterSlugs: string[];
  faqs: Array<{ question: string; answer: string }>;
  /** Overrides the species bio photo as the page hero (e.g. a real catch
   * photo instead of a stock fish shot). */
  heroImage?: MediaAsset;
  /** Longer-form sections rendered after "Why the Maldives", each with an
   * optional photo and related links. */
  extraSections?: Array<{
    heading: string;
    paragraphs: string[];
    image?: MediaAsset;
    links?: Array<{ label: string; href: string | null }>;
    table?: { headers: string[]; rows: Array<Array<{ text: string; href?: string }>> };
  }>;
}

/** Per-person website price for an MFH package and group size, from the
 * same generated table the package pages render (never hand-typed). */
function mfhPrice(slug: string, guests: number): string {
  const tier = MFH_PRICE_TABLES[slug]?.find((g) => g.guests === guests);
  return tier ? `USD ${tier.websitePrice.toLocaleString("en-US")}` : "On request";
}

function fullDayPackageRow(nights: number) {
  const slug = `${nights}-night-maldives-fishing-package-full-day-fishing`;
  return [
    { text: `${nights} nights`, href: `/maldives/packages/${slug}/` },
    { text: String(nights - 1) },
    { text: mfhPrice(slug, 2) },
    { text: mfhPrice(slug, 5) },
  ];
}

export const SPECIES_PAGES: Record<string, SpeciesPageContent> = {
  "gt-fishing": {
    displayName: "Giant Trevally (GT)",
    speciesSlug: "giant-trevally",
    pageSlug: "gt-fishing",
    metaTitle: "GT Fishing Maldives | Giant Trevally Fishing Charters",
    metaDescription:
      "GT fishing in the Maldives: popping and jigging for giant trevally on outer reefs and channels aboard Emperor, a private charter from USD 980 per boat.",
    h1: "GT Fishing in the Maldives",
    heroImage: asset(
      "c1e3ca08-0e43-1f98-3061-c6d9951c6834",
      "opt/uploads/assets/uploads/fishing/images/gallery/giant-trevally.webp",
      "Angler in a blue cap holding a large giant trevally on a fishing boat in the Maldives",
    ),
    extraSections: [
      {
        heading: "Where to Go GT Fishing in the Maldives",
        paragraphs: [
          "Giant trevally hunt where reef meets moving water. In the Maldives that means the outer reef edges, where the coral drops away into deep blue water, and the channels (kandu) that cut through the atoll rim. On a running tide, baitfish are pushed through these channels between the lagoon and the open ocean, and GT gather at the channel mouths and along the edges to ambush them.",
          "The less a reef is fished, the better the chances, which is why GT anglers head for the remote atolls of the far south rather than the busy resort atolls around Malé. Emperor, our private charter boat, can be arranged in other atolls at the same rate depending on your dates and where the boat is, but its home is Gaafu Alifu Atoll.",
        ],
        image: asset(
          "ead2e1da-00ff-1554-b001-6bdc3d5885fe",
          "opt/uploads/assets/uploads/fishing/images/packages/reef-baa.webp",
          "Top-down aerial view of a white fishing boat over a coral reef edge in the Maldives",
        ),
      },
      {
        heading: "GT Fishing in Gaafu Alifu Atoll",
        paragraphs: [
          "Gaafu Alifu is the northern half of Huvadhu Atoll in the deep south of the Maldives, one of the largest atolls in the world. Its long outer reef is broken by many channels, and with few resorts and few fishing boats working it, the reefs see far less fishing pressure than the central atolls. That combination of channels, deep drop-offs and quiet water is exactly what GT fishing needs.",
          "Emperor and its crew are based on Maamendhoo, a local island in Gaafu Alifu, at the Maldives Fishing and Holidays Lodge. Staying at the lodge keeps you close to the fishing grounds, so you can be on the reef when the tide starts to run. Getting there is a domestic flight from Malé (USD 365 per person) and a short boat transfer, both included in our fishing packages.",
          "Gaafu Alifu also suits a mixed fishing trip. When the GT are quiet, the same boat can troll offshore for yellowfin tuna, wahoo and mahi-mahi, or jig the deep reef slopes for dogtooth tuna and groupers, so every day on the water has a target, whatever the tide and season.",
        ],
        image: asset(
          "8c2e8baf-376e-b0b6-a222-a8450b073a09",
          "opt/uploads/assets/uploads/fishing/images/gallery/maldives-atoll-aerial-view.webp",
          "Aerial view of a Maldives island ringed by reef in deep blue ocean",
        ),
        links: [
          { label: "Maldives Fishing and Holidays Lodge", href: "/maldives/guesthouses/maldives-fishing-and-holidays-lodge/" },
          { label: "Maamendhoo, Gaafu Alifu", href: "/maldives/islands/maamendhoo-gaafu-alifu/" },
          { label: "Gaafu Atoll fishing guide", href: "/maldives/travel-guide/gaafu-atoll-fishing-guide-mfh-maamendhoo/" },
        ],
      },
      {
        heading: "GT Popping and Jigging in the Maldives",
        paragraphs: [
          "Popping is the classic way to catch GT. You cast a large surface lure, a popper or stickbait, towards the reef edge or across a channel and work it back with sharp sweeps of the rod so it splashes and throws water. A GT that takes it usually hits hard and close to the surface, and then heads straight for the reef, so the first few seconds decide whether the fish is landed. Popping is physical: expect to cast a heavy rod many times over a session.",
          "Jigging works deeper water. A heavy metal jig is dropped down the reef slope and worked back up with the rod and reel. It is less tiring than popping, catches GT that aren't feeding at the surface, and also brings dogtooth tuna, groupers and other reef fish. Many anglers mix the two in a day: popping when the tide is running and fish are active near the surface, jigging when they are holding deeper.",
        ],
        image: asset(
          "a3212df8-100d-d0b6-5f03-22333dae40c6",
          "opt/legacy/images/fishing/half-day-trip-deep-jigging.webp",
          "Two anglers jigging over the side of a fishing boat on open water in the Maldives",
        ),
        links: [
          { label: "GT popping in the Maldives", href: "/maldives/fishing/popping/" },
          { label: "Jigging in the Maldives", href: "/maldives/fishing/jigging/" },
        ],
      },
      {
        heading: "GT Popping Tackle and Fishing Equipment",
        paragraphs: [
          "GT tackle has to stop a powerful fish from reaching the coral in the first few seconds of the fight. That means a heavy spinning rod built for casting big lures, a large saltwater spinning reel with a strong drag, heavy braided main line and a thick monofilament or fluorocarbon leader to survive the reef. Poppers and stickbaits are fitted with strong single hooks or heavy-duty trebles and split rings.",
          "Basic fishing gear is included on every Emperor charter. If you don't bring your own popping and jigging outfit, you can add a professional rod and reel setup for USD 80 per setup. Bring polarised sunglasses, a hat, gloves for handling leader and fish, and reef-safe sunscreen.",
        ],
        image: asset(
          "6df03edc-e48a-1f54-4ba0-9bd8f587046d",
          "opt/legacy/images/fishing/popping-fishing.webp",
          "Angler in sunglasses holding a giant trevally caught popping from a boat in the Maldives",
        ),
      },
      {
        heading: "GT Fishing Charters: What to Expect and What It Costs",
        paragraphs: [
          "A half-day charter is about 4 hours on the water and a full-day charter about 8 hours. The crew plans the day around the tide, because moving water is what switches GT on: the boat works the channel mouths and reef edges while the tide runs, and slack water is a good time to jig deeper or move to the next spot.",
          "Emperor takes up to 5 anglers, and the price is per boat: USD 980 for a half day or USD 1,380 for a full day, including captain and crew, fuel, soft drinks and snacks, and basic gear. Shared between five anglers, a full day of GT fishing comes to USD 276 each. A full day gives you more tides and more spots.",
        ],
        image: asset(
          "a0396492-c61d-9a26-f750-712a914f5b22",
          "opt/legacy/images/fishing/maldives-fishing-trip.webp",
          "Angler holding a large giant trevally (GT) on a boat in the Maldives",
        ),
        links: [
          { label: "Emperor private fishing charter", href: "/maldives/fishing/emperor/" },
          { label: "Maldives fishing trip cost", href: "/maldives/travel-guide/maldives-fishing-trip-cost/" },
          { label: "Best GT fishing destinations", href: "/maldives/travel-guide/best-gt-fishing-destinations/" },
        ],
      },
      {
        heading: "GT Fishing Holidays and Packages in the Maldives",
        paragraphs: [
          "For a dedicated GT fishing holiday, our packages at the lodge on Maamendhoo bundle full-board accommodation, the return domestic flight, the boat transfer and a private Emperor charter on every fishing day. The price is per person and falls as more anglers share the boat. These are the full-day fishing packages:",
        ],
        table: {
          headers: ["Package", "Fishing days", "Per person, 2 anglers", "Per person, 5 anglers"],
          rows: [3, 4, 5, 6, 7, 8].map(fullDayPackageRow),
        },
        image: asset(
          "d82258a7-f7ae-f6ea-c603-5c18159eff68",
          "opt/uploads/assets/uploads/fishing/images/gallery/maldives-fishing-charters.webp",
          "Smiling angler holding a large giant trevally on a fishing boat in the Maldives",
        ),
        links: [
          { label: "All Maldives fishing packages", href: "/maldives/packages/fishing/" },
          { label: "Half-day fishing packages", href: "/maldives/packages/3-night-maldives-fishing-package-half-day-fishing/" },
        ],
      },
      {
        heading: "How Big Do Giant Trevally Get?",
        paragraphs: [
          "Giant trevally (Caranx ignobilis) are the largest of the trevally family and grow up to about 170 cm and 80 kg. Whatever its size, a GT pulls harder than almost anything else on the reef. Smaller GT often hunt in groups, while the biggest fish tend to patrol alone along the reef edge.",
        ],
      },
      {
        heading: "Giant Trevally Catch and Release",
        paragraphs: [
          "Giant trevally grow slowly, and most GT anglers release their fish. Good practice keeps the fish's chances high: use single or barbless hooks, keep the fight short, support the fish horizontally under its belly for a quick photo rather than holding it up by the jaw, and keep it out of the water for as little time as possible. Before letting go, hold it in the water facing into the current until it kicks away on its own.",
        ],
      },
    ],
    whyMaldives: [
      "The Maldives is one of the best destinations worldwide for targeting trophy-sized giant trevally (GT). These powerful, aggressive predators patrol reef edges, channels and open water across the atoll chain, and remote, lower-pressure atolls — like Gaafu Atoll in the far south — are a particular draw for anglers chasing them.",
      "GT are the usual target on popping and jigging trips over outer reef and channel edges, where the tide pushes baitfish between the lagoon and open ocean.",
    ],
    techniques: [
      { label: "Popping", href: "/maldives/fishing/popping/" },
      { label: "Jigging", href: "/maldives/fishing/jigging/" },
    ],
    charterSlugs: ["private-full-day-fishing-charter", "private-half-day-fishing-charter"],
    faqs: [
      {
        question: "Can I catch giant trevally in the Maldives?",
        answer:
          "Yes — GT are a common target for popping and jigging trips over channel edges and outer reef, including our own Gaafu Atoll charters. As with any wild fish, a catch isn't guaranteed on a given day.",
      },
      {
        question: "What's the best season for GT fishing?",
        answer:
          "Our own species records show April to October as a commonly reported window for GT activity, but this varies by atoll, tide and year — treat it as general guidance, not a guarantee. See our Maldives fishing seasons guide for more.",
      },
      {
        question: "What technique is used for GT?",
        answer: "Mainly popping and jigging over reef edges and channel mouths — see those technique pages for how each works.",
      },
      {
        question: "How much does a GT fishing trip cost?",
        answer:
          "A private charter on Emperor costs USD 980 for a half day or USD 1,380 for a full day, per boat for up to 5 anglers. A professional rod and reel setup for heavier GT tackle is USD 80 per setup.",
      },
      {
        question: "Where is the best GT fishing in the Maldives?",
        answer:
          "The remote southern atolls, where channels and outer reef edges see little fishing pressure. Our boat, Emperor, is based in Gaafu Alifu Atoll, in the deep south, for exactly that reason.",
      },
      {
        question: "Do I need experience to go GT popping?",
        answer:
          "No, but it helps to be reasonably fit: popping means casting a heavy rod many times. Jigging is an easier way to start, and you can ask the crew for help with casting and working the lure.",
      },
      {
        question: "Can I book a GT fishing holiday package?",
        answer:
          "Yes. Our packages at the Maldives Fishing and Holidays Lodge on Maamendhoo, Gaafu Alifu, run from 2 to 8 nights and include the lodge, meals, the domestic flight, the boat transfer and a private charter on every fishing day.",
      },
      {
        question: "Is GT fishing catch and release?",
        answer:
          "Most GT anglers release their fish. Single or barbless hooks, a short fight and a quick photo with the fish supported horizontally give it the best chance after release.",
      },
    ],
  },
  "tuna-fishing": {
    displayName: "Yellowfin Tuna",
    speciesSlug: "yellowfin-tuna",
    pageSlug: "tuna-fishing",
    metaTitle: "Tuna Fishing Maldives | Yellowfin Tuna Fishing Charters",
    metaDescription:
      "Yellowfin tuna fishing in the Maldives — trolling further offshore aboard Emperor, our private Gaafu Atoll charter. Real charter, real rates, no invented catch claims.",
    h1: "Tuna Fishing in the Maldives",
    whyMaldives: [
      "Yellowfin tuna are powerful, fast-swimming predators and a primary target for sport fishermen in the Maldives, found around the edges of atolls and in open water, often hunting in schools.",
      "Trolling further offshore from a charter like Emperor is the usual way to target yellowfin tuna, alongside wahoo and other pelagic species on the same run.",
    ],
    techniques: [{ label: "Trolling / Big Game Fishing", href: "/maldives/fishing/big-game-fishing/" }],
    charterSlugs: ["private-full-day-fishing-charter", "private-half-day-fishing-charter"],
    faqs: [
      {
        question: "What's the best season for tuna fishing?",
        answer:
          "Our own species records show December to March as a commonly reported window for yellowfin tuna, but conditions vary by atoll and year — see our Maldives fishing seasons guide for general, non-prescriptive guidance.",
      },
      {
        question: "What technique is used for tuna?",
        answer: "Trolling lures at speed further offshore is the usual technique — see Big Game Fishing on the main fishing hub.",
      },
      {
        question: "Can I catch tuna on the same trip as GT?",
        answer: "It depends on the day's plan — our team can discuss targeting both on a full-day charter when you enquire.",
      },
    ],
  },
  "wahoo-fishing": {
    displayName: "Wahoo",
    speciesSlug: "wahoo",
    pageSlug: "wahoo-fishing",
    metaTitle: "Wahoo Fishing Maldives | Wahoo Fishing Charters",
    metaDescription:
      "Wahoo fishing in the Maldives — trolling at speed near atoll edges aboard Emperor, our private Gaafu Atoll charter. Real charter, real rates, no invented catch claims.",
    h1: "Wahoo Fishing in the Maldives",
    whyMaldives: [
      "Wahoo are among the fastest fish in the ocean, prized by anglers for their fighting ability as much as their speed. In the Maldives they're often found near the edges of atolls, where trolling at speed is the most effective way to target them.",
      "Wahoo are a regular feature of the same trolling runs that target yellowfin tuna, so a trip booked for one often produces a shot at the other.",
    ],
    techniques: [{ label: "Trolling / Big Game Fishing", href: "/maldives/fishing/big-game-fishing/" }],
    charterSlugs: ["private-full-day-fishing-charter", "private-half-day-fishing-charter"],
    faqs: [
      {
        question: "What's the best season for wahoo fishing?",
        answer:
          "Our own species records show December to March as a commonly reported window for wahoo, but conditions vary by atoll and year — see our Maldives fishing seasons guide for general, non-prescriptive guidance.",
      },
      {
        question: "What technique is used for wahoo?",
        answer: "Trolling lures at speed near atoll edges is the usual technique — see Big Game Fishing on the main fishing hub.",
      },
    ],
  },
  "dogtooth-tuna": {
    displayName: "Dogtooth Tuna",
    speciesSlug: "dogtooth-tuna",
    pageSlug: "dogtooth-tuna",
    metaTitle: "Dogtooth Tuna Fishing Maldives | Jigging Charters",
    metaDescription:
      "Dogtooth tuna fishing in the Maldives — jigging over deep reef slopes and drop-offs aboard Emperor, our private Gaafu Atoll charter. Real charter, real rates.",
    h1: "Dogtooth Tuna Fishing in the Maldives",
    whyMaldives: [
      "Dogtooth tuna inhabit the deeper reef slopes and drop-offs around Maldivian atolls — exactly the kind of structure found along Gaafu Atoll's outer reef, where Emperor's jigging trips run.",
      "These solitary hunters are known for their incredible fighting ability and tendency to dive deep when hooked, making them a prized catch for experienced anglers using jigging techniques.",
    ],
    techniques: [{ label: "Jigging", href: "/maldives/fishing/jigging/" }],
    charterSlugs: ["private-full-day-fishing-charter", "private-half-day-fishing-charter"],
    faqs: [
      {
        question: "What's the best season for dogtooth tuna?",
        answer:
          "Our own species records show November to April as a commonly reported window for dogtooth tuna, but conditions vary by atoll and year — see our Maldives fishing seasons guide for general, non-prescriptive guidance.",
      },
      {
        question: "What technique is used for dogtooth tuna?",
        answer: "Jigging over deep reef slopes and drop-offs is the usual technique — see our Jigging page for how it works.",
      },
    ],
  },
  "mahi-mahi-fishing": {
    displayName: "Mahi-Mahi",
    speciesSlug: "mahi-mahi",
    pageSlug: "mahi-mahi-fishing",
    metaTitle: "Mahi Mahi Fishing Maldives | Mahi Mahi Fishing Charters",
    metaDescription:
      "Mahi-mahi fishing in the Maldives — trolling near floating debris aboard Emperor, our private Gaafu Atoll charter. Real charter, real rates, no invented catch claims.",
    h1: "Mahi-Mahi Fishing in the Maldives",
    whyMaldives: [
      "Mahi-mahi (dolphinfish) are fast-growing, acrobatic fighters often found near floating debris or FADs (Fish Aggregating Devices) in open water — a common incidental and targeted catch on trolling runs further offshore.",
      "Their vibrant colors and aerial jumps when hooked make them one of the more memorable catches on a big game trip, alongside tuna and wahoo.",
    ],
    techniques: [{ label: "Trolling / Big Game Fishing", href: "/maldives/fishing/big-game-fishing/" }],
    charterSlugs: ["private-full-day-fishing-charter", "private-half-day-fishing-charter"],
    faqs: [
      {
        question: "What's the best season for mahi-mahi?",
        answer:
          "Our own species records show December to April as a commonly reported window for mahi-mahi, but conditions vary by atoll and year — see our Maldives fishing seasons guide for general, non-prescriptive guidance.",
      },
      {
        question: "What technique is used for mahi-mahi?",
        answer: "Trolling near floating debris or open water is the usual technique — see Big Game Fishing on the main fishing hub.",
      },
    ],
  },
  "marlin-fishing": {
    displayName: "Marlin",
    // No real bio entry exists in fish-species.ts for marlin (no legacy
    // size/habitat/season data anywhere in this codebase) — using a real
    // gallery photo + factual prose instead of inventing those stats.
    fallbackImage: asset(
      "dbd93db3-e064-94a9-5883-96ea6c3aebf1",
      "opt/uploads/assets/uploads/fishing/images/gallery/blue-marlin.webp",
      "Blue marlin caught fishing in the Maldives",
    ),
    fallbackDescription:
      "Marlin are among the largest big-game species targeted in Maldivian waters, caught trolling further offshore beyond the atoll rim alongside tuna, wahoo and sailfish.",
    pageSlug: "marlin-fishing",
    metaTitle: "Marlin Fishing Maldives | Marlin Fishing Charters",
    metaDescription:
      "Marlin fishing in the Maldives — trolling further offshore on a full-day charter. Real charters, real rates, no invented catch claims.",
    h1: "Marlin Fishing in the Maldives",
    whyMaldives: [
      "Marlin are caught trolling further offshore, beyond the atoll rim, on the same big game runs that target tuna and wahoo — a longer-range trip, which is why it's best suited to a full-day charter rather than a half-day.",
      "A real marlin-tagged charter, Marlin & Big Game Fishing Charter, already operates from Hulhumale with Knight At Sea — see Available Charters below alongside our own Emperor full-day charter.",
    ],
    techniques: [{ label: "Trolling / Big Game Fishing", href: "/maldives/fishing/big-game-fishing/" }],
    // Full-day only, per the site owner's instruction — marlin is a
    // longer-range target better suited to the full-day charter than the
    // half-day one. Plus the real third-party marlin charter on record.
    charterSlugs: ["private-full-day-fishing-charter", "marlin-big-game-fishing-charter"],
    faqs: [
      {
        question: "Is there a dedicated marlin charter?",
        answer:
          "Marlin & Big Game Fishing Charter, operated by Knight At Sea out of Hulhumale, is a real charter already on record tagged for big game/marlin fishing. Our own Emperor full-day charter also runs trolling trips that can target marlin further offshore.",
      },
      {
        question: "What technique is used for marlin?",
        answer: "Trolling lures at speed further offshore is the usual technique — see Big Game Fishing on the main fishing hub.",
      },
    ],
  },
  "sailfish-fishing": {
    displayName: "Sailfish",
    // Same gap as marlin — no real bio entry exists for sailfish either.
    fallbackImage: asset(
      "d647a2a4-2099-8667-168f-88c292b6de0d",
      "opt/uploads/assets/uploads/fishing/images/gallery/sailfish-maldives.webp",
      "Sailfish caught fishing in the Maldives",
    ),
    fallbackDescription:
      "Sailfish are one of the fastest fish in the ocean and a prized big-game target, caught trolling further offshore alongside tuna, wahoo and marlin.",
    pageSlug: "sailfish-fishing",
    metaTitle: "Sailfish Fishing Maldives | Sailfish Fishing Charters",
    metaDescription:
      "Sailfish fishing in the Maldives — trolling further offshore on a full-day charter. Real charters, real rates, no invented catch claims.",
    h1: "Sailfish Fishing in the Maldives",
    whyMaldives: [
      "Sailfish are caught trolling further offshore on the same big game runs that target tuna, wahoo and marlin — a longer-range trip, best suited to a full-day charter.",
      "No dedicated sailfish-only charter is on record yet, but our own Emperor full-day charter and the other real big game operators on this site run the same trolling technique that can produce one.",
    ],
    techniques: [{ label: "Trolling / Big Game Fishing", href: "/maldives/fishing/big-game-fishing/" }],
    // Full-day only, per the site owner's instruction.
    charterSlugs: ["private-full-day-fishing-charter"],
    faqs: [
      {
        question: "Is there a dedicated sailfish charter?",
        answer:
          "Not yet on record — sailfish are caught on the same big game trolling trips that target tuna, wahoo and marlin. See Big Game Fishing for the real charters currently available.",
      },
      {
        question: "What technique is used for sailfish?",
        answer: "Trolling lures at speed further offshore is the usual technique — see Big Game Fishing on the main fishing hub.",
      },
    ],
  },
};
