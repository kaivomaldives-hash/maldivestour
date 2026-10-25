import type { ContentSection } from "@/lib/content/content-section";
import { asset } from "@/lib/packages/category-images";
import { mfhPackageRow } from "@/lib/packages/mfh-price-rows";
import type { PackageCategorySlug } from "@/lib/packages/view-types";

export interface PackageCategoryContent {
  metaTitle: string;
  metaDescription: string;
  intro: string;
  faqs: Array<{ question: string; answer: string }>;
  relatedLinks: Array<{ href: string; label: string }>;
  /** Optional long-form sections shown below the package grid. */
  sections?: ContentSection[];
}

/**
 * Task 21 §25/§26: genuinely different content per category page — not a
 * heading + paragraph + package grid. Every claim here is general,
 * verifiable travel-planning information (how transfers/booking work on
 * this site, real Maldives geography/seasons), never a specific
 * fabricated statistic about any resort or package.
 */
export const PACKAGE_CATEGORY_CONTENT: Record<PackageCategorySlug, PackageCategoryContent> = {
  luxury: {
    metaTitle: "Maldives Luxury Packages | Luxury Maldives Holidays",
    metaDescription: "Real Maldives luxury holiday packages — overwater villas, private-island resorts, and genuine 5-star experiences. Search, compare, and enquire.",
    intro:
      "A luxury Maldives holiday usually means an overwater villa, a private-island resort with its own dive centre and restaurants, and a level of privacy that's hard to find elsewhere. The packages below are built around real resorts already in our catalogue — never an invented property or star rating.",
    faqs: [
      { question: "What makes a Maldives resort 'luxury'?", answer: "Typically an overwater villa, a private island with limited guest numbers, and an all-inclusive or premium dining structure — see each package's own Included section for specifics." },
      { question: "Do luxury packages include transfers?", answer: "Most do — check each package's Included section; longer transfers (domestic flight, seaplane) are common for the more remote luxury resorts." },
      { question: "Are luxury packages good for honeymoons?", answer: "Yes — see our Honeymoon Packages for luxury options specifically curated around couples." },
    ],
    relatedLinks: [
      { href: "/maldives/resorts/", label: "Maldives Resorts" },
      { href: "/maldives/packages/honeymoon/", label: "Honeymoon Packages" },
      { href: "/maldives-speedboats-charter/", label: "Private Speedboat Charter" },
    ],
  },
  family: {
    metaTitle: "Maldives Family Packages | Family Holidays & Vacations",
    metaDescription: "Real Maldives family holiday packages — resorts and local islands with genuine family-friendly activities on record. Search, compare, and enquire.",
    intro:
      "Family trips to the Maldives work best with a resort close to the airport (shorter transfer with kids) and enough real activities on-site to fill the days. Every package below references activities and accommodation actually in our catalogue.",
    faqs: [
      { question: "Which resorts are good for families?", answer: "Look for a shorter airport transfer and a real range of family activities — each package below lists exactly what's included." },
      { question: "Are transfers included for families with children?", answer: "Check each package's own Included section — most resort packages include the transfer as standard." },
      { question: "Can we combine a resort stay with a local island?", answer: "Yes — enquire on any package and mention you'd like to combine destinations; we'll check what's actually possible." },
    ],
    relatedLinks: [
      { href: "/maldives/resort-transfers/", label: "Resort Transfers" },
      { href: "/maldives/activities/", label: "Maldives Activities" },
      { href: "/maldives/travel-guide/", label: "Travel Guide" },
    ],
  },
  "adults-only": {
    metaTitle: "Maldives Adults Only Packages | Quiet, Couples-Focused Holidays",
    metaDescription: "Maldives packages curated for adult travelers wanting a quieter, no-schedule stay. Search, compare, and enquire.",
    intro:
      "Not every trip needs a kids' club. These packages are curated around free time, spa, and quiet — always check a resort's own current policy directly before booking if a formal adults-only rule matters to your trip.",
    faqs: [
      { question: "Do these resorts have a formal adults-only policy?", answer: "Policies can change — always confirm directly with us or the resort before booking if this is a firm requirement." },
      { question: "Are these packages good for honeymoons?", answer: "Yes — many overlap with our Honeymoon Packages; see that category for more romantic-focused options." },
      { question: "Can I add spa treatments?", answer: "Enquire on the specific package — we'll check what's genuinely available at that resort." },
    ],
    relatedLinks: [
      { href: "/maldives/packages/honeymoon/", label: "Honeymoon Packages" },
      { href: "/maldives/packages/luxury/", label: "Luxury Packages" },
      { href: "/maldives/resorts/", label: "Maldives Resorts" },
    ],
  },
  "long-stay": {
    metaTitle: "Maldives Long Stay Packages | Extended Maldives Holidays",
    metaDescription: "Real Maldives long-stay packages — 10+ nights on a resort or local island. Search, compare, and enquire.",
    intro:
      "A longer Maldives stay changes the trip entirely — less checking things off a list, more actually settling in. These packages run 10 nights or more, on either a resort island or a genuinely affordable local island base.",
    faqs: [
      { question: "Is a long stay cheaper per night than a short trip?", answer: "Often, yes, especially on local islands — check each package's own per-night rate against a shorter equivalent." },
      { question: "Can I split a long stay across two islands?", answer: "Enquire and mention it — combining a resort stay with a local island is often possible." },
      { question: "Do long-stay packages include all meals?", answer: "Varies — check each package's own Included section." },
    ],
    relatedLinks: [
      { href: "/maldives/packages/budget/", label: "Budget Packages" },
      { href: "/maldives/islands/", label: "Maldives Islands" },
      { href: "/maldives/travel-guide/", label: "Travel Guide" },
    ],
  },
  budget: {
    metaTitle: "Maldives Budget Packages | Affordable Maldives Holidays",
    metaDescription: "Real Maldives budget holiday packages — local island guesthouses and hotels at a fraction of resort-island prices. Search, compare, and enquire.",
    intro:
      "The Maldives doesn't have to mean an expensive private-island resort. Local, inhabited islands like Maafushi and Ukulhas have real guesthouses and hotels, their own beaches, and genuine local dive/fishing operators — usually at a fraction of resort prices.",
    faqs: [
      { question: "How do I get to a local island?", answer: "Public ferry (cheapest) or a private speedboat — see our Island Transfers page for real routes and schedules." },
      { question: "Is a local island as nice as a resort?", answer: "It's a different experience — a real Maldivian community rather than a private island, with its own beach access (often a designated 'bikini beach' area)." },
      { question: "Can I do activities like diving on a budget trip?", answer: "Yes — local dive and fishing operators run real trips from these islands; see each package's own Included section." },
    ],
    relatedLinks: [
      { href: "/maldives/island-transfers/", label: "Island Transfers" },
      { href: "/maldives/guesthouses/", label: "Maldives Guesthouses" },
      { href: "/maldives-ferry-schedule/", label: "Ferry Schedule" },
    ],
  },
  honeymoon: {
    metaTitle: "Maldives Honeymoon Packages | Romantic Maldives Holidays",
    metaDescription: "Real Maldives honeymoon packages — overwater villas, private dining, and romantic resort experiences. Search, compare, and enquire.",
    intro:
      "Honeymoon packages here center on overwater villas, private dining set-ups, and resorts with a genuinely romantic, adult-focused feel — every one anchored to a real resort already in our catalogue, never an invented property.",
    faqs: [
      { question: "What's typically included in a honeymoon package?", answer: "Check each package's own Included section — many include breakfast, and some offer a private dinner as an add-on you can enquire about." },
      { question: "Are these resorts adults-only?", answer: "See our Adults Only Packages category, or ask us directly for that specific resort's current policy." },
      { question: "Can we add a diving experience?", answer: "Several honeymoon packages already include a Discover Scuba Diving session — check each one's Included list, or enquire to add one." },
    ],
    relatedLinks: [
      { href: "/maldives/packages/luxury/", label: "Luxury Packages" },
      { href: "/maldives/packages/adults-only/", label: "Adults Only Packages" },
      { href: "/maldives/resorts/", label: "Maldives Resorts" },
    ],
  },
  solo: {
    metaTitle: "Maldives Solo Packages | Solo Travel in the Maldives",
    metaDescription: "Real Maldives solo travel packages — local island guesthouses and budget-friendly bases genuinely suited to traveling alone. Search, compare, and enquire.",
    intro:
      "Traveling solo in the Maldives works best on local islands, where guesthouses are genuinely set up for independent travelers rather than couples-only resort packages. These packages are built around real guesthouses already in our catalogue.",
    faqs: [
      { question: "Is the Maldives safe for solo travelers?", answer: "Local islands are genuinely welcoming to solo travelers — guesthouses are used to independent guests, and island communities are small and easy to navigate." },
      { question: "Will I pay a single supplement?", answer: "Check each package's own price basis (per-person vs. per-couple) — local-island guesthouse packages are usually priced per person already." },
      { question: "Can I meet other travelers?", answer: "Local islands like Maafushi and Ukulhas have a real backpacker/traveler community — guesthouse common areas and group activities are a natural way to meet people." },
    ],
    relatedLinks: [
      { href: "/maldives/packages/budget/", label: "Budget Packages" },
      { href: "/maldives/guesthouses/", label: "Maldives Guesthouses" },
      { href: "/maldives/surfing/", label: "Surfing" },
    ],
  },
  diving: {
    metaTitle: "Maldives Diving Packages | Maldives Dive Holidays",
    metaDescription: "Real Maldives diving holiday packages — resort dive centres and local island operators, real courses and guided dives. Search, compare, and enquire.",
    intro:
      "The Maldives is one of the world's best-known diving destinations — real reef drop-offs, channels, and pelagic life across its atolls. These packages reference real diving activities and operators already in our catalogue, from resort dive centres to local-island courses.",
    faqs: [
      { question: "Do I need to be certified to dive here?", answer: "No — Discover Scuba Diving sessions are a supervised introduction for first-timers; several packages include one." },
      { question: "Can I get PADI certified on a package?", answer: "Yes — several packages include a full PADI Open Water or Advanced course; check each package's Included section." },
      { question: "What's the difference between a resort dive package and a liveaboard?", answer: "A resort package dives from a single island base each day; a liveaboard (see our Liveaboard Packages) covers multiple sites across an atoll over one continuous trip." },
    ],
    relatedLinks: [
      { href: "/maldives/diving/", label: "Diving" },
      { href: "/maldives/dive-sites/", label: "Dive Sites" },
      { href: "/maldives/packages/liveaboard/", label: "Liveaboard Packages" },
    ],
  },
  fishing: {
    metaTitle: "Maldives Fishing Packages & Fishing Holidays | MTG",
    metaDescription:
      "Maldives fishing holiday packages in Gaafu Alifu Atoll: 2 to 8 nights with lodge, meals, domestic flight, transfer and a private fishing charter every day.",
    intro:
      "Fishing holiday packages at the Maldives Fishing and Holidays Lodge on Maamendhoo, Gaafu Alifu Atoll: full-board accommodation, the return domestic flight, the boat transfer and a private charter on our boat Emperor on every fishing day. 2 to 8 nights, full-day or half-day fishing, priced per person.",
    faqs: [
      {
        question: "What is included in a Maldives fishing package?",
        answer:
          "Full-board accommodation at the Maldives Fishing and Holidays Lodge on Maamendhoo, the return domestic flight from Malé, the boat transfer to the island, and a private charter on Emperor on every fishing day (captain and crew, fuel, soft drinks and snacks, basic fishing gear).",
      },
      {
        question: "How many fishing days do I get?",
        answer: "One fewer than the number of nights: a 3-night package has 2 fishing days, a 5-night package 4, and an 8-night package 7.",
      },
      {
        question: "Why does the price depend on the number of guests?",
        answer:
          "The boat costs the same however many anglers are on it, so the more people share it, the lower the price per person. 5 guests sharing is the best-value rate.",
      },
      {
        question: "What is the difference between full-day and half-day packages?",
        answer: "Full-day packages include about 8 hours on the boat each fishing day; half-day packages about 4 hours, which is cheaper and leaves afternoons free.",
      },
      {
        question: "Are international flights included?",
        answer: "No. Packages include the return domestic flight from Malé and the boat transfer; you book your own international flight to Malé.",
      },
      {
        question: "Do I need my own fishing gear?",
        answer:
          "No. Basic fishing gear is included on every fishing day. A professional popping or jigging rod and reel setup is available for USD 80 per setup, or bring your own.",
      },
      {
        question: "Can non-anglers come on a fishing package?",
        answer: "Ask us when you enquire. The lodge is on a local island, so non-anglers can relax, swim and snorkel while others fish.",
      },
    ],
    relatedLinks: [
      { href: "/maldives/fishing/", label: "Maldives Fishing" },
      { href: "/maldives/fishing/emperor/", label: "Emperor Private Fishing Charter" },
      { href: "/maldives/guesthouses/maldives-fishing-and-holidays-lodge/", label: "Maldives Fishing and Holidays Lodge" },
      { href: "/maldives/travel-guide/maldives-fishing-trip-cost/", label: "Maldives Fishing Trip Cost" },
      { href: "/maldives/travel-guide/maldives-fishing-trip-itinerary/", label: "Fishing Trip Itinerary" },
    ],
    sections: [
      {
        heading: "Maldives Fishing Holidays in Gaafu Alifu Atoll",
        paragraphs: [
          "Our fishing packages are built around one of the quietest fishing grounds in the Maldives. Gaafu Alifu is the northern half of Huvadhu Atoll, in the deep south of the country, one of the largest atolls in the world. Its long outer reef is broken by many channels and drops straight into deep ocean, and very few fishing boats work it. That makes it an ideal base for GT popping and jigging, dogtooth tuna on the reef walls, and trolling offshore for yellowfin tuna, wahoo and mahi-mahi.",
          "You stay at the Maldives Fishing and Holidays Lodge on Maamendhoo, a local island in Gaafu Alifu, run by the same company as our fishing boat, Emperor. Your room, meals, transfers and fishing are arranged by one operator, and the fishing grounds are close to the island, so you spend your days fishing rather than travelling.",
        ],
        image: asset(
          "8c2e8baf-376e-b0b6-a222-a8450b073a09",
          "opt/uploads/assets/uploads/fishing/images/gallery/maldives-atoll-aerial-view.webp",
          "Aerial view of a Maldives island ringed by reef in deep blue ocean",
        ),
        links: [
          { label: "Gaafu Atoll fishing guide", href: "/maldives/travel-guide/gaafu-atoll-fishing-guide-mfh-maamendhoo/" },
          { label: "Best fishing spots in the Maldives", href: "/maldives/travel-guide/best-fishing-spots-in-the-maldives/" },
        ],
      },
      {
        heading: "What's Included in Every Fishing Package",
        paragraphs: [
          "Every package includes full-board accommodation at the lodge, the return domestic flight from Malé, the boat transfer to Maamendhoo, and a private charter on Emperor on every fishing day. Emperor is a 32-foot fishing boat with twin 200 HP engines for up to 5 anglers, and each charter includes a professional captain and crew, fuel, soft drinks and snacks, and basic fishing gear.",
          "Not included: your international flight to Malé, and a professional popping or jigging rod and reel setup if you want one (USD 80 per setup). The number of fishing days is one fewer than the number of nights, so arrival and departure days are for travel.",
        ],
        image: asset(
          "78a6c490-6263-2e47-c74b-59f312afd4e9",
          "opt/uploads/assets/uploads/gotrip/lodge/mfh-lodge-hotel.webp",
          "Twin bedroom with white linen and an en-suite bathroom at the Maldives Fishing and Holidays Lodge",
        ),
      },
      {
        heading: "Full-Day Fishing Package Prices",
        paragraphs: [
          "Full-day packages include about 8 hours on the boat on every fishing day, the best choice for GT popping and jigging and for offshore trolling. Prices are per person and depend on how many guests share the boat; 5 guests sharing is the best-value rate.",
        ],
        table: {
          headers: ["Package", "Fishing days", "1 guest", "2 guests", "3 guests", "4 guests", "5 guests"],
          rows: [2, 3, 4, 5, 6, 7, 8].map((nights) => mfhPackageRow(nights, "full-day", [1, 2, 3, 4, 5])),
        },
      },
      {
        heading: "Half-Day Fishing Package Prices",
        paragraphs: [
          "Half-day packages include about 4 hours on the boat on every fishing day, leaving afternoons free to rest, swim or snorkel. They cost less than full-day packages and suit mixed groups, families and anglers who want a more relaxed pace.",
        ],
        table: {
          headers: ["Package", "Fishing days", "1 guest", "2 guests", "3 guests", "4 guests", "5 guests"],
          rows: [2, 3, 4, 5, 6, 7, 8].map((nights) => mfhPackageRow(nights, "half-day", [1, 2, 3, 4, 5])),
        },
      },
      {
        heading: "How to Choose a Fishing Package",
        paragraphs: [
          "How many nights? A 3-night package (2 fishing days) is a good short break. A 5-night package (4 fishing days) is the most popular length: enough to try popping, jigging and trolling and to ride out a windy day. Dedicated anglers choose 7 or 8 nights.",
          "Full or half days? Choose full days for serious GT fishing and offshore trips; half days if you want afternoons off or are travelling with non-anglers.",
          "How many anglers? Because the boat costs the same however many people are on board, the price per person falls sharply as your group grows. On packages of 4 nights or more, 5 anglers each pay less than a third of the solo price.",
        ],
        image: asset(
          "c1e3ca08-0e43-1f98-3061-c6d9951c6834",
          "opt/uploads/assets/uploads/fishing/images/gallery/giant-trevally.webp",
          "Angler in a blue cap holding a large giant trevally on a fishing boat in the Maldives",
        ),
        links: [
          { label: "Sample fishing trip itinerary", href: "/maldives/travel-guide/maldives-fishing-trip-itinerary/" },
          { label: "Maldives fishing trip cost", href: "/maldives/travel-guide/maldives-fishing-trip-cost/" },
        ],
      },
      {
        heading: "What You Can Catch on a Maldives Fishing Holiday",
        paragraphs: [
          "The crew plans each fishing day around the tide, the weather and the season. Popping and jigging along the reef edges and channels target giant trevally, bluefin trevally, dogtooth tuna, groupers and snappers. Trolling offshore targets yellowfin tuna, wahoo and mahi-mahi, with a chance of sailfish and marlin.",
          "The season most commonly reported for GT is April to October, while December to April brings calmer seas and the peak season for yellowfin tuna, wahoo and mahi-mahi. Fishing runs all year.",
        ],
        image: asset(
          "65ce543b-f8cb-5760-a0ed-e49aefe7280d",
          "opt/uploads/assets/uploads/fishing/images/gallery/giant-yellowfin-tuna.webp",
          "Several yellowfin tuna laid out on the deck of a fishing boat with three anglers in the Maldives",
        ),
        links: [
          { label: "GT fishing in the Maldives", href: "/maldives/fishing/gt-fishing/" },
          { label: "Best time to fish in the Maldives", href: "/maldives/travel-guide/maldives-fishing-seasons-month-by-month-guide/" },
          { label: "Tuna fishing in the Maldives", href: "/maldives/travel-guide/tuna-fishing-in-the-maldives/" },
        ],
      },
      {
        heading: "Getting to Your Fishing Holiday",
        paragraphs: [
          "Fly into Malé on your international flight. From there, the domestic flight south and the boat transfer to Maamendhoo are included in every package. Leave enough time between your international and domestic flights, and check the baggage allowance on the domestic flight if you are bringing rod tubes.",
          "Only want a day or two of fishing? You can also book Emperor by the day: USD 1,380 per boat for a full day or USD 980 for a half day, for up to 5 anglers.",
        ],
        image: asset(
          "e520e856-d8be-505a-1e39-bc1a61f726e0",
          "opt/uploads/assets/uploads/fishing/images/charters/emperor.webp",
          "Emperor, a 32 ft white-and-black fishing boat with twin outboards, anchored off a Maldives island",
        ),
        links: [
          { label: "Emperor private fishing charter", href: "/maldives/fishing/emperor/" },
          { label: "Fishing holiday packing list", href: "/maldives/travel-guide/fishing-holiday-packing-list/" },
        ],
      },
    ],
  },
  surfing: {
    metaTitle: "Maldives Surfing Packages | Maldives Surf Holidays",
    metaDescription: "Real Maldives surfing holiday packages — genuine surf islands like Thulusdhoo with real lessons and boat trips. Search, compare, and enquire.",
    intro:
      "Thulusdhoo and a handful of other islands are genuinely known surf bases in the Maldives, close to well-regarded breaks. These packages reference real surf lessons, boat trips and camps already in our catalogue.",
    faqs: [
      { question: "Do I need surfing experience?", answer: "No — beginner lessons are available; check each package's Included section for what's actually offered." },
      { question: "When is the surf season?", answer: "Generally the Southwest monsoon months (roughly May–October) bring the most consistent swell, though this varies year to year — confirm current conditions when you enquire." },
      { question: "Can I rent a board without a lesson?", answer: "Yes — see the package's Included section; several offer standalone board rental." },
    ],
    relatedLinks: [
      { href: "/maldives/surfing/", label: "Surfing" },
      { href: "/maldives/surf-breaks/", label: "Surf Breaks" },
      { href: "/maldives/packages/solo/", label: "Solo Packages" },
    ],
  },
  liveaboard: {
    metaTitle: "Maldives Liveaboard Packages | Liveaboard Diving Expeditions",
    metaDescription: "Maldives liveaboard diving packages — a multi-day trip aboard a dive vessel covering several atolls' dive sites. Search, compare, and enquire.",
    intro:
      "A liveaboard trades a single-island base for a boat that moves between dive sites across an atoll or more, typically reaching sites a shore-based operator can't. We don't yet have a confirmed real liveaboard operator on record — enquire and we'll help arrange real vessel and schedule details.",
    faqs: [
      { question: "How is a liveaboard different from a resort dive package?", answer: "You live aboard the vessel itself rather than a single island, reaching more dive sites across a wider area in one trip — see our Diving Packages for the resort/local-island alternative." },
      { question: "Do I need to be certified?", answer: "Most liveaboards require at least an Open Water certification — confirm with us when you enquire." },
      { question: "How many dives per day?", answer: "Typically up to 3 on a diving-focused liveaboard, though this depends on the specific vessel and itinerary." },
    ],
    relatedLinks: [
      { href: "/maldives/diving/", label: "Diving" },
      { href: "/maldives/dive-sites/", label: "Dive Sites" },
      { href: "/maldives/atolls/alif-alif/", label: "Alif Alif Atoll" },
    ],
  },
};
