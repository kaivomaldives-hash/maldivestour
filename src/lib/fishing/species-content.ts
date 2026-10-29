import { asset } from "@/lib/packages/category-images";
import type { ContentSection } from "@/lib/content/content-section";
import type { MediaAsset } from "@/lib/media/types";
import { mfhPackageRow } from "@/lib/packages/mfh-price-rows";

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
  extraSections?: ContentSection[];
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
          "For a dedicated GT fishing holiday, our packages at the lodge on Maamendhoo bundle full-board accommodation, the return domestic flight, the boat transfer and a private Emperor charter on every fishing day. The price is per person and falls as more anglers share the boat. These are the full-day reef fishing packages:",
        ],
        table: {
          headers: ["Package", "Fishing days", "Per person, 2 anglers", "Per person, 5 anglers"],
          rows: [3, 4, 5, 6, 7, 8].map((nights) => mfhPackageRow(nights, "full-day", [2, 5])),
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
    metaTitle: "Yellowfin Tuna Fishing Maldives | Tuna Fishing Charters",
    metaDescription:
      "Yellowfin tuna fishing in the Maldives: where and how to catch yellowfin, best season, tackle and prices for a private tuna fishing charter in Gaafu Alifu.",
    h1: "Yellowfin Tuna Fishing in the Maldives",
    heroImage: asset(
      "8dc28836-323e-85d9-d5ad-4d4ddd294c13",
      "opt/uploads/assets/uploads/fishing/images/gallery/fishing-tours-maldives.webp",
      "Two anglers holding tuna on a fishing boat at sunset in the Maldives",
    ),
    extraSections: [
      {
        heading: "Yellowfin Tuna in the Maldives",
        paragraphs: [
          "Yellowfin tuna are one of the most sought-after sport fish in the Maldives. They are built for speed, with a torpedo-shaped body, a dark blue back, a yellow stripe along the side and long, bright yellow second dorsal and anal fins. They grow up to about 200 cm and 200 kg, and even a medium-sized yellowfin will run hard and deep and fight all the way to the boat.",
          "Yellowfin hunt in schools in the open ocean, feeding on flying fish, squid and smaller tuna. They are often found with feeding seabirds, around floating debris and fish aggregating devices (FADs), and alongside dolphins. In the Maldives they are also caught by local fishermen with handlines and poles, and they are a staple of Maldivian cooking.",
        ],
        image: asset(
          "a8ba6833-886f-504b-136f-7cb31111c497",
          "opt/uploads/assets/uploads/fishing/images/gallery/yellowfin-tuna-fishing-maldives.webp",
          "Angler holding a large yellowfin tuna upright on the deck of a fishing boat in the Maldives",
        ),
      },
      {
        heading: "Where to Catch Yellowfin Tuna in the Maldives",
        paragraphs: [
          "Yellowfin tuna live in the deep blue water beyond the atolls, so yellowfin fishing means heading offshore past the reef. The crew looks for birds diving on bait, tuna breaking the surface, floating logs and the FADs moored offshore, which gather baitfish and the tuna that feed on them.",
          "In the Maldives the deep ocean is close to every atoll. In Gaafu Alifu, in the far south, the long outer reef drops straight into deep water, so Emperor can be trolling for yellowfin soon after leaving Maamendhoo and can switch to the reef for giant trevally or dogtooth tuna later in the day.",
        ],
        image: asset(
          "6007f61c-90c0-de64-6c2b-70c47da0c911",
          "opt/legacy/fishing/images/trolling-fishing.webp",
          "Trolling rods set in the stern of a sport-fishing boat with a white wake behind it in the Maldives",
        ),
      },
      {
        heading: "How to Catch Yellowfin Tuna",
        paragraphs: [
          "Trolling is the main method. The boat tows a spread of skirted lures, diving plugs or rigged baits offshore, and when a yellowfin strikes, the reel screams and the angler takes the rod. Trolling also catches wahoo, mahi-mahi and skipjack tuna, and occasionally sailfish and marlin.",
          "When a school of yellowfin is feeding on the surface, casting poppers and stickbaits into the action is one of the most exciting ways to catch them, and needs heavy spinning tackle. Trolling tackle is supplied on the boat; basic gear is included and a professional popping rod and reel setup is USD 80 per setup.",
        ],
        image: asset(
          "10ffc1ca-8306-20b4-2a70-f4239de861d2",
          "opt/legacy/images/fishing/tuna-fishing-in-maldives.webp",
          "Four anglers holding yellowfin tuna on a fishing boat in the Maldives",
        ),
        links: [
          { label: "Trolling in the Maldives", href: "/maldives/fishing/trolling/" },
          { label: "Deep sea and big game fishing", href: "/maldives/fishing/big-game-fishing/" },
        ],
      },
      {
        heading: "Yellowfin Tuna Fishing Charters and Prices",
        paragraphs: [
          "Emperor, our private fishing boat, is a 32-foot boat with twin 200 HP engines for up to 5 anglers, based on Maamendhoo in Gaafu Alifu Atoll. For yellowfin we recommend a full day, which gives time to run offshore and find the schools: USD 1,380 per boat, or USD 276 each with five anglers. A half day costs USD 980 per boat. Both include the captain and crew, fuel, soft drinks and snacks, and basic gear.",
          "For several days of tuna fishing, our tuna fishing packages at the Maldives Fishing and Holidays Lodge include the lodge, full-board meals, the domestic flight, the boat transfer and a private boat offshore on every fishing day:",
        ],
        table: {
          headers: ["Package (full-day tuna fishing)", "Fishing days", "Per person, 2 anglers", "Per person, 5 anglers"],
          rows: [3, 5, 7].map((nights) => mfhPackageRow(nights, "fullTuna", [2, 5])),
        },
        image: asset(
          "65ce543b-f8cb-5760-a0ed-e49aefe7280d",
          "opt/uploads/assets/uploads/fishing/images/gallery/giant-yellowfin-tuna.webp",
          "Several yellowfin tuna laid out on the deck of a fishing boat with three anglers in the Maldives",
        ),
        links: [
          { label: "Emperor private fishing charter", href: "/maldives/fishing/emperor/" },
          { label: "All fishing packages", href: "/maldives/packages/fishing/" },
          { label: "Tuna fishing in the Maldives: all species", href: "/maldives/travel-guide/tuna-fishing-in-the-maldives/" },
        ],
      },
      {
        heading: "Yellowfin Tuna and Other Maldives Tuna",
        paragraphs: [
          "Yellowfin are one of three tuna anglers catch in the Maldives. Skipjack tuna are smaller, striped-bellied fish that travel in huge schools all year and are the backbone of the traditional pole-and-line fishery. Dogtooth tuna are reef predators that live along the deep reef walls and are caught by jigging, mainly from November to April. A full day on Emperor can target all three: trolling offshore for yellowfin and skipjack, then jigging the reef wall for dogtooth.",
        ],
        links: [
          { label: "Dogtooth tuna fishing", href: "/maldives/fishing/dogtooth-tuna/" },
          { label: "Traditional Maldivian fishing", href: "/maldives/travel-guide/traditional-maldivian-fishing/" },
        ],
      },
      {
        heading: "Yellowfin Tuna Fishing Tips",
        paragraphs: [
          "Go out early, when tuna often feed hardest. Watch for diving birds, the best sign of tuna below. Book a full day in the December to March season. Keep only the tuna you'll eat and release the rest: a fresh yellowfin is one of the best meals in the Maldives, whether as sashimi, grilled steaks or a Maldivian tuna curry.",
        ],
        image: asset(
          "0b224be8-cf15-e001-f9b4-7d32c3b664ea",
          "opt/uploads/assets/uploads/fishing/images/gallery/maldives-fishing-packages.webp",
          "Smiling angler in a white shirt holding a tuna on a fishing boat in the Maldives",
        ),
      },
    ],
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
      {
        question: "How big do yellowfin tuna get in the Maldives?",
        answer: "Yellowfin tuna grow up to about 200 cm and 200 kg, though most caught on a day trip are much smaller and still fight hard.",
      },
      {
        question: "How much does a tuna fishing trip in the Maldives cost?",
        answer: "A private full-day charter on Emperor costs USD 1,380 per boat for up to 5 anglers, including the crew, fuel, drinks, snacks and basic gear. A half day costs USD 980.",
      },
      {
        question: "Can I keep the tuna I catch?",
        answer: "Ask the crew. Tuna kept for the table is often prepared fresh; release what you won't eat.",
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
      "Dogtooth tuna fishing in the Maldives: where they live, how to jig for them, tackle, best season and prices for a private jigging charter in Gaafu Alifu.",
    h1: "Dogtooth Tuna Fishing in the Maldives",
    heroImage: asset(
      "a3212df8-100d-d0b6-5f03-22333dae40c6",
      "opt/legacy/images/fishing/half-day-trip-deep-jigging.webp",
      "Two anglers jigging over the side of a fishing boat on open water in the Maldives",
    ),
    extraSections: [
      {
        heading: "Dogtooth Tuna: the Reef's Toughest Fighter",
        paragraphs: [
          "Dogtooth tuna (Gymnosarda unicolor) are named for their sharp, conical teeth, unusual among tunas. Unlike yellowfin and skipjack, which roam the open ocean in schools, dogtooth tuna are reef predators that live along deep reef walls and drop-offs, usually alone or in small groups. They grow up to about 130 cm and 70 kg.",
          "Dogtooth are famous for their strength. When hooked, a dogtooth turns and dives straight for the reef, and if it gets there, the line is usually cut on the coral. Landing one takes heavy tackle, a tight drag and quick, determined winding in the first seconds of the fight, which is exactly why jigging anglers travel to catch them.",
        ],
        image: asset(
          "7e90fcd5-499f-8989-6783-c3ff27ee5bb1",
          "opt/uploads/assets/uploads/fishing/images/charters/maldives-fishing-boat-emperor.webp",
          "Top-down aerial view of Emperor, a white center-console fishing boat, in deep blue water",
        ),
      },
      {
        heading: "Where to Find Dogtooth Tuna in the Maldives",
        paragraphs: [
          "Dogtooth tuna hold on the steep outer reef walls where the coral falls away into deep water, at the drop-offs at channel mouths, and around deep pinnacles. They feed where current pushes bait along the wall, so the best spots are on the up-current side of the reef while the tide is running.",
          "The remote southern atolls are among the best places in the Maldives for dogtooth tuna, because their outer walls see very little fishing pressure. Gaafu Alifu, where our boat Emperor is based, has a long outer reef with deep walls and channel drop-offs close to the island of Maamendhoo.",
        ],
        image: asset(
          "231eed3c-1bc0-71fb-4187-ca095c8d7630",
          "opt/uploads/assets/uploads/fishing/images/charters/emperor-fishing-boat.webp",
          "Aerial view of the Emperor fishing boat over a shallow turquoise reef",
        ),
        links: [{ label: "Best fishing spots in the Maldives", href: "/maldives/travel-guide/best-fishing-spots-in-the-maldives/" }],
      },
      {
        heading: "How to Catch Dogtooth Tuna: Jigging",
        paragraphs: [
          "Jigging is the main way to catch dogtooth tuna. A heavy metal jig is dropped down the reef wall to the depth where the fish are holding, then worked back up with sharp lifts of the rod and fast turns of the reel. The strike often comes as the jig falls or on the first lifts off the bottom, so stay ready from the moment the jig hits the depth.",
          "Speed jigging, with fast, aggressive lifts and long slim jigs, is the classic dogtooth technique. Slow-pitch jigging, with shorter lifts and flatter jigs that flutter as they fall, also catches dogtooth and brings groupers, snappers and amberjack too. Dogtooth tuna occasionally take poppers when they come up to the surface, and are sometimes caught on live bait.",
        ],
        image: asset(
          "437c760e-0079-e191-b056-ebe871a06643",
          "opt/uploads/assets/uploads/fishing/images/gallery/maldives-fishing-trips.webp",
          "Angler holding a large reef fish caught jigging on a boat in the Maldives",
        ),
        links: [
          { label: "Jigging in the Maldives", href: "/maldives/fishing/jigging/" },
          { label: "GT popping and jigging guide", href: "/maldives/travel-guide/gt-popping-and-jigging-guide/" },
        ],
      },
      {
        heading: "Dogtooth Tuna Jigging Tackle",
        paragraphs: [
          "Dogtooth tackle has to stop a powerful fish within a few metres of the reef. Anglers use a strong jigging rod and a high-capacity spinning or overhead jigging reel with a powerful drag, braided main line for direct contact with the jig, and a thick fluorocarbon leader to resist the teeth and the coral. Jigs range from around 100 g to 300 g or more, depending on the depth and current, rigged with strong assist hooks.",
          "On Emperor, basic fishing gear is included on every charter, and you can add a professional jigging rod and reel setup for USD 80 per setup if you don't bring your own.",
        ],
        image: asset(
          "720ed678-f61d-74c4-00d3-13879c709508",
          "opt/uploads/assets/uploads/fishing/images/gallery/maldives-fishing.webp",
          "Angler in a sun mask holding a spotted grouper on a boat over turquoise water in the Maldives",
        ),
      },
      {
        heading: "How to Fight a Dogtooth Tuna",
        paragraphs: [
          "Set your drag tight before you drop the jig. When a dogtooth hits, don't give it line: lock the rod against your body, lift and wind hard to pull the fish up and away from the reef in the first few seconds. Once it is clear of the wall, keep steady pressure and pump and wind to the surface. Fighting from a moving boat helps: the captain will often motor away from the reef to drag the fish into open water.",
        ],
      },
      {
        heading: "Dogtooth Tuna Fishing Charters and Prices",
        paragraphs: [
          "Emperor is a 32-foot boat with twin 200 HP engines for up to 5 anglers. A full-day charter costs USD 1,380 per boat and a half day USD 980, including the captain and crew, fuel, soft drinks and snacks, and basic gear. The crew plans jigging sessions on the reef walls around the tide, and can mix in popping for giant trevally and trolling for tuna and wahoo.",
          "For several days of jigging, our packages at the Maldives Fishing and Holidays Lodge on Maamendhoo include the lodge, full-board meals, the domestic flight, the boat transfer and a private charter on every fishing day:",
        ],
        table: {
          headers: ["Package (full-day reef fishing)", "Fishing days", "Per person, 2 anglers", "Per person, 5 anglers"],
          rows: [3, 5, 7].map((nights) => mfhPackageRow(nights, "full-day", [2, 5])),
        },
        image: asset(
          "6a568121-cf94-c905-4b2d-bba7ceff1137",
          "opt/uploads/assets/uploads/fishing/images/gallery/redsnappers-in-maldives.webp",
          "Angler in sunglasses holding a red snapper caught on a fishing boat in the Maldives",
        ),
        links: [
          { label: "Emperor private fishing charter", href: "/maldives/fishing/emperor/" },
          { label: "All fishing packages", href: "/maldives/packages/fishing/" },
          { label: "Tuna fishing in the Maldives", href: "/maldives/travel-guide/tuna-fishing-in-the-maldives/" },
        ],
      },
      {
        heading: "Other Fish You Catch Jigging for Dogtooth Tuna",
        paragraphs: [
          "Jigging the deep reef walls rarely produces only dogtooth tuna. The same jigs catch giant trevally holding deep, amberjack, groupers such as the spotted and coral groupers, red snappers, jobfish and other reef fish, many of them excellent to eat. Slow-pitch jigging in particular brings a wide mix of bottom species, which makes a jigging session productive even on days when the dogtooth aren't biting.",
          "Because the reef walls sit right beside the channel mouths, the crew can also switch to popping for giant trevally when the tide runs, or head offshore to troll for yellowfin tuna and wahoo.",
        ],
        links: [
          { label: "GT fishing in the Maldives", href: "/maldives/fishing/gt-fishing/" },
          { label: "Best popping and jigging destinations", href: "/maldives/travel-guide/best-popping-and-jigging-destinations/" },
        ],
      },
      {
        heading: "Dogtooth Tuna Catch and Release",
        paragraphs: [
          "Dogtooth tuna are slow-growing reef predators, and many anglers release them. Keep the fight short with strong tackle, handle the fish carefully away from its teeth, support its weight for a quick photo, and revive it in the water before letting go. If you keep one for the table, dogtooth makes excellent eating.",
        ],
      },
    ],
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
      {
        question: "How big do dogtooth tuna get?",
        answer: "Dogtooth tuna grow up to about 130 cm and 70 kg. Even medium-sized fish are very strong and head straight for the reef when hooked.",
      },
      {
        question: "What weight jig is best for dogtooth tuna?",
        answer: "It depends on the depth and current; many anglers carry jigs from around 100 g to 300 g or more, using heavier jigs in deep water and strong current.",
      },
      {
        question: "Where is the best dogtooth tuna fishing in the Maldives?",
        answer: "The steep outer reef walls and channel drop-offs of the remote southern atolls, such as Gaafu Alifu, where our boat Emperor is based.",
      },
      {
        question: "How much does a dogtooth tuna fishing trip cost?",
        answer: "A private full-day charter on Emperor costs USD 1,380 per boat for up to 5 anglers, or USD 980 for a half day. A professional jigging setup is USD 80 per setup.",
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
