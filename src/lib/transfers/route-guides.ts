/**
 * Hand-written planning guides for the most-booked resort transfer routes on
 * maldivestour.guide, keyed by the transfer route's slug.
 *
 * Kept separate from the database on purpose: prices and journey times still
 * come from the route's services (so they always match the booking form), and
 * the text here never repeats them. The wording is unique to Maldives Tour
 * Guide (the sister site maldives-transfers.com has its own, different text).
 */
export interface RouteGuideSection {
  heading: string;
  paragraphs: string[];
}

export interface RouteGuide {
  /** Resort name as guests search for it. */
  resort: string;
  sections: RouteGuideSection[];
  /** "Before you travel" checklist. */
  checklist: string[];
  faqs: Array<{ question: string; answer: string }>;
}

const ARRIVAL_SECTION = (resort: string): RouteGuideSection => ({
  heading: "What happens when you land",
  paragraphs: [
    `After immigration and baggage claim at Velana International Airport, walk out into the arrivals hall. A Maldives Tour Guide representative meets you with your name on a board, checks your booking and walks with you to the boat jetties a few steps outside the terminal.`,
    `Your luggage is loaded for you and the speedboat leaves for ${resort}. On arrival the resort team meets you at the jetty, so there is nothing to organise after you step off the plane.`,
  ],
});

export const ROUTE_GUIDES: Record<string, RouteGuide> = {
  "velana-international-airport-to-club-med-kani-maldives": {
    resort: "Club Med Kani",
    sections: [
      {
        heading: "Getting to Club Med Kani",
        paragraphs: [
          "Club Med Kani is one of the resorts closest to Malé, in North Malé Atoll, so guests reach it by speedboat rather than seaplane. That matters after a long-haul flight: there is no seaplane lounge, no daylight-only timetable and no extra domestic flight, which makes it especially easy for families arriving with children.",
          "Booking your speedboat in advance means the boat is ready when you clear arrivals. Tell us your flight number and we follow the arrival time, so an early or late landing does not leave you waiting at the jetty.",
        ],
      },
      ARRIVAL_SECTION("Club Med Kani"),
      {
        heading: "Shared or private boat?",
        paragraphs: [
          "A shared seat is the best value for couples and small families. Larger families or groups of friends often prefer a private boat: you leave as soon as everyone is ready and have the boat to yourselves. If some of your group are staying at Club Med Finolhu Villas next door, one boat can take everyone.",
        ],
      },
    ],
    checklist: [
      "Your flight number and landing time",
      "Number of adults and children (with ages)",
      "Number of large bags, plus any surf or dive gear",
      "Your departure date and flight, if you want the return booked too",
    ],
    faqs: [
      {
        question: "Do I need a seaplane to reach Club Med Kani?",
        answer: "No. Club Med Kani is in North Malé Atoll, close to the airport, and is reached by speedboat.",
      },
      {
        question: "Can one boat take guests to both Club Med Kani and Club Med Finolhu?",
        answer: "Yes. The two resorts are neighbours, so a group split between them can travel on one boat.",
      },
    ],
  },

  "velana-international-airport-to-club-med-finolhu-villas-maldives": {
    resort: "Club Med Finolhu Villas",
    sections: [
      {
        heading: "Getting to Club Med Finolhu Villas",
        paragraphs: [
          "Club Med Finolhu Villas is in North Malé Atoll, beside Club Med Kani, and is reached by speedboat from Velana International Airport. Because no seaplane is involved, you can arrive at any time of day without waiting for a daylight flight slot.",
          "Send us your flight details when you book and we time the boat to your arrival, adjusting if your flight lands early or late.",
        ],
      },
      ARRIVAL_SECTION("Club Med Finolhu Villas"),
      {
        heading: "Travelling with friends at Club Med Kani?",
        paragraphs: [
          "Finolhu and Kani are neighbours, so mixed groups can share one boat. For a honeymoon or special occasion, a private boat gives you a quiet start to the holiday and leaves on your schedule.",
        ],
      },
    ],
    checklist: [
      "Your flight number and landing time",
      "How many guests and bags",
      "Whether anyone in your group is staying at Club Med Kani",
      "Your departure flight, to book the return together",
    ],
    faqs: [
      {
        question: "Is Club Med Finolhu reached by speedboat?",
        answer: "Yes. It is in North Malé Atoll, next to Club Med Kani, and is reached by speedboat from Velana International Airport.",
      },
      {
        question: "Can I book a private boat to Club Med Finolhu?",
        answer: "Yes. Choose the private transfer option on this page and the boat leaves when your group is ready.",
      },
    ],
  },

  "velana-international-airport-to-centara-mirage-and-grand-island-resort-maldives": {
    resort: "Centara Mirage Lagoon & Centara Grand Lagoon",
    sections: [
      {
        heading: "Getting to Centara Mirage Lagoon and Centara Grand Lagoon",
        paragraphs: [
          "Centara Mirage Lagoon Maldives and Centara Grand Lagoon Maldives are sister resorts reached by a short speedboat ride from Velana International Airport. It is one of the quickest resort journeys in the Maldives, so you can start your holiday soon after landing.",
          "Both resorts use the same transfer. Let us know which one you are staying at and we arrange the drop-off at the right jetty.",
        ],
      },
      ARRIVAL_SECTION("Centara"),
      {
        heading: "Not the same as Centara Grand Island",
        paragraphs: [
          "Centara also has a resort called Centara Grand Island in Ari Atoll, which is much further away. Check your booking confirmation: if it says Mirage Lagoon or Grand Lagoon, this is the right transfer.",
        ],
      },
    ],
    checklist: [
      "Which Centara resort you booked (Mirage Lagoon or Grand Lagoon)",
      "Your flight number and landing time",
      "Number of guests and bags",
      "Your departure flight, to book the return as well",
    ],
    faqs: [
      {
        question: "Is the transfer the same for Centara Mirage Lagoon and Centara Grand Lagoon?",
        answer: "Yes, one speedboat transfer serves both sister resorts. Just tell us which one you are staying at.",
      },
      {
        question: "Is this transfer for Centara Grand Island?",
        answer: "No. Centara Grand Island is a different resort in Ari Atoll. This route is for Centara Mirage Lagoon and Centara Grand Lagoon.",
      },
    ],
  },

  "velana-international-airport-to-hard-rock-hotel-maldives": {
    resort: "Hard Rock Hotel Maldives",
    sections: [
      {
        heading: "Getting to Hard Rock Hotel Maldives",
        paragraphs: [
          "Hard Rock Hotel Maldives is at CROSSROADS Maldives in the Emboodhoo Lagoon, South Malé Atoll, one of the closest resort areas to the airport. The speedboat ride is short, which makes this an easy resort to reach even after a late arrival.",
          "CROSSROADS is a lagoon development shared with SAii Lagoon Maldives, so friends staying at either resort can travel together.",
        ],
      },
      ARRIVAL_SECTION("Hard Rock Hotel Maldives"),
      {
        heading: "Arriving late?",
        paragraphs: [
          "Because the journey is short, evening transfers to Hard Rock are straightforward to arrange. Send your flight time when you book and we confirm the boat for your arrival.",
        ],
      },
    ],
    checklist: [
      "Your flight number and landing time",
      "Number of guests and bags",
      "Whether friends are staying at SAii Lagoon (one boat can take both)",
      "Your departure flight for the return trip",
    ],
    faqs: [
      {
        question: "Where is Hard Rock Hotel Maldives?",
        answer: "At CROSSROADS Maldives in the Emboodhoo Lagoon, South Malé Atoll, next to SAii Lagoon Maldives.",
      },
      {
        question: "Can I get to Hard Rock Hotel Maldives at night?",
        answer: "Yes, evening and night transfers can be arranged on request. Send us your flight time when you book.",
      },
    ],
  },

  "velana-international-airport-to-saii-lagoon-maldives-curio-collection-by-hilton": {
    resort: "SAii Lagoon Maldives",
    sections: [
      {
        heading: "Getting to SAii Lagoon Maldives",
        paragraphs: [
          "SAii Lagoon Maldives, Curio Collection by Hilton, is at CROSSROADS Maldives in the Emboodhoo Lagoon, South Malé Atoll. It is a short speedboat ride from Velana International Airport, so you can be at the resort soon after clearing arrivals.",
          "SAii shares the CROSSROADS lagoon with Hard Rock Hotel Maldives. If your group is staying at both, one boat can take everyone.",
        ],
      },
      ARRIVAL_SECTION("SAii Lagoon Maldives"),
      {
        heading: "Late flights",
        paragraphs: [
          "The short crossing makes evening arrivals easy. Let us know your landing time when booking and we confirm a boat for that time.",
        ],
      },
    ],
    checklist: [
      "Your flight number and landing time",
      "Number of guests and bags",
      "Friends staying at Hard Rock? One boat can take both",
      "Your departure flight, to book the return together",
    ],
    faqs: [
      {
        question: "Where is SAii Lagoon Maldives?",
        answer: "At CROSSROADS Maldives in the Emboodhoo Lagoon, South Malé Atoll, beside Hard Rock Hotel Maldives.",
      },
      {
        question: "Is a seaplane needed for SAii Lagoon?",
        answer: "No. SAii Lagoon is close to the airport and is reached by speedboat.",
      },
    ],
  },

  "velana-international-airport-to-so-maldives": {
    resort: "SO/ Maldives",
    sections: [
      {
        heading: "Getting to SO/ Maldives",
        paragraphs: [
          "SO/ Maldives sits in the Emboodhoo Lagoon in South Malé Atoll, a short speedboat ride from Velana International Airport. Travelling by speedboat means no seaplane wait and no daylight restriction on your arrival time.",
          "Book ahead and share your flight number; we watch your arrival and have the boat ready when you come out of the terminal.",
        ],
      },
      ARRIVAL_SECTION("SO/ Maldives"),
    ],
    checklist: [
      "Your flight number and landing time",
      "Number of guests and bags",
      "Shared seat or private boat",
      "Your departure flight for the return trip",
    ],
    faqs: [
      {
        question: "Where is SO/ Maldives?",
        answer: "In the Emboodhoo Lagoon in South Malé Atoll, a short speedboat ride from the airport.",
      },
      {
        question: "Do I need a seaplane to reach SO/ Maldives?",
        answer: "No, SO/ Maldives is reached by speedboat from Velana International Airport.",
      },
    ],
  },

  "velana-international-airport-to-anantara-dhigu-maldives-resort": {
    resort: "Anantara Dhigu",
    sections: [
      {
        heading: "Getting to Anantara Dhigu",
        paragraphs: [
          "Anantara Dhigu Maldives Resort is in South Malé Atoll and is reached by speedboat from Velana International Airport. The ride heads south across open water and gives you a first view of the atolls on the way.",
          "Anantara Dhigu is close to its sister resorts Anantara Veli and Naladhu. If your group is split between them, ask us about one boat for everyone.",
        ],
      },
      ARRIVAL_SECTION("Anantara Dhigu"),
    ],
    checklist: [
      "Your flight number and landing time",
      "Number of guests and bags",
      "Which Anantara resort each guest is staying at",
      "Your departure flight, to book the return as well",
    ],
    faqs: [
      {
        question: "How do I get to Anantara Dhigu from the airport?",
        answer: "By speedboat from Velana International Airport. Our representative meets you in arrivals and takes you to the boat.",
      },
      {
        question: "Can one boat go to Anantara Dhigu and Anantara Veli?",
        answer: "Yes. The resorts are neighbours, so groups staying at both can share a boat.",
      },
    ],
  },

  "velana-international-airport-to-one-only-reethi-rah": {
    resort: "One&Only Reethi Rah",
    sections: [
      {
        heading: "Getting to One&Only Reethi Rah",
        paragraphs: [
          "One&Only Reethi Rah is in North Malé Atoll, north of the airport, and is reached by speedboat. It is one of the longer speedboat routes from Velana, so a comfortable boat and a smooth airport handover make a real difference at the end of a long flight.",
          "Booking ahead means the boat is waiting when you clear arrivals. Share your flight number and we adjust to any change in your landing time.",
        ],
      },
      ARRIVAL_SECTION("One&Only Reethi Rah"),
      {
        heading: "Why many guests choose a private boat",
        paragraphs: [
          "On a longer route, a private boat gives your family or group space, privacy and a departure time that suits you. Shared seats are also available if you are travelling as a couple.",
        ],
      },
    ],
    checklist: [
      "Your flight number and landing time",
      "Number of guests and bags",
      "Shared seat or private boat",
      "Your departure flight for the return",
    ],
    faqs: [
      {
        question: "Where is One&Only Reethi Rah?",
        answer: "In North Malé Atoll, north of Malé and Velana International Airport, and reached by speedboat.",
      },
      {
        question: "Is a private boat available to One&Only Reethi Rah?",
        answer: "Yes, choose the private transfer option on this page.",
      },
    ],
  },
};

export function getRouteGuide(slug: string): RouteGuide | undefined {
  return ROUTE_GUIDES[slug];
}
