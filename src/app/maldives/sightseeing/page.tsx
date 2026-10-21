import type { Metadata } from "next";

import {
  ActivityCategoryLandingPage,
  activityCategoryMetadata,
  type ActivityCategoryConfig,
} from "@/components/activity/activity-category-landing-page";
import { VIDEOS } from "@/components/activity/activities-video-jsonld";

const config: ActivityCategoryConfig = {
  slug: "sightseeing",
  eyebrow: "Malé City Tours & Island Hopping",
  h1: "Maldives Sightseeing",
  intro:
    "Sightseeing in the Maldives mostly means two real things: a guided tour of Malé, the country's small, densely built capital island (Old Friday Mosque, the Grand Friday Mosque, the local and fish markets, Victory Monument, and the colourful Artificial Beach), and island hopping day trips that visit real, inhabited local islands beyond a single resort. Real, bookable listings below — not a generic stock directory.",
  metaTitle: "Maldives Sightseeing | Malé City Tours & Island Hopping",
  metaDescription:
    "Real, bookable Maldives sightseeing — guided Malé city tours (walking, bike, car) and island hopping day trips to local islands.",
  faqs: [
    {
      question: "What is there to see on a Malé city tour?",
      answer:
        "Malé is the Maldives' capital island — real stops on the listed tours include the Old Friday Mosque, the Grand Friday Mosque, the local and fish markets, Victory Monument, the Old Presidential Palace, and Artificial Beach. See the specific listing for its exact route and duration.",
    },
    {
      question: "How long does a Malé city tour take?",
      answer: "It varies by listing — walking and bike tours typically run around 2 hours; half-day versions cover more ground. Check the specific listing's own duration.",
    },
    {
      question: "What's the difference between a city tour and island hopping?",
      answer: "A city tour is specific to Malé, the capital island. Island hopping visits one or more other inhabited local islands — traditional communities, markets and craft beyond Malé or a resort's own private island.",
    },
    {
      question: "Can I combine a city tour with my airport transfer?",
      answer: "Several listed city tours include airport pickup and drop-off as part of the tour itself — check the specific listing for what's included.",
    },
    {
      question: "Do I need to book sightseeing in advance?",
      answer: "Enquire directly on any listing below to confirm current availability and timing before your trip.",
    },
  ],
  category: "sightseeing",
  emptyMessage: "No sightseeing listings recorded yet — check Maldives Activities for the full current listing.",
  videos: VIDEOS.filter((v) => v.id === "1e3k1QK66ZI"),
};

export function generateMetadata(): Metadata {
  return activityCategoryMetadata(config);
}

export default function SightseeingPage() {
  return <ActivityCategoryLandingPage config={config} />;
}
