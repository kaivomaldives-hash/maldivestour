import { asset } from "@/lib/packages/category-images";
import type { MediaAsset } from "@/lib/media/types";

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
}

export const SPECIES_PAGES: Record<string, SpeciesPageContent> = {
  "gt-fishing": {
    displayName: "Giant Trevally (GT)",
    speciesSlug: "giant-trevally",
    pageSlug: "gt-fishing",
    metaTitle: "GT Fishing Maldives | Giant Trevally Fishing Charters",
    metaDescription:
      "Giant trevally fishing in the Maldives — popping and jigging over outer reef and channel edges aboard Emperor, our private Gaafu Atoll charter. Real charter, real rates.",
    h1: "GT Fishing in the Maldives",
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
      "uploads/assets/uploads/fishing/images/gallery/blue-marlin.avif",
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
      "A real marlin-tagged charter, Marlin & Big Game Fishing Charter, already operates from Hulhumalé with Knight At Sea — see Available Charters below alongside our own Emperor full-day charter.",
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
          "Marlin & Big Game Fishing Charter, operated by Knight At Sea out of Hulhumalé, is a real charter already on record tagged for big game/marlin fishing. Our own Emperor full-day charter also runs trolling trips that can target marlin further offshore.",
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
      "uploads/assets/uploads/fishing/images/gallery/sailfish-maldives.webp",
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
