import type { Metadata } from "next";

import {
  ActivityCategoryLandingPage,
  activityCategoryMetadata,
  type ActivityCategoryConfig,
} from "@/components/activity/activity-category-landing-page";

const config: ActivityCategoryConfig = {
  slug: "water-sports",
  eyebrow: "Jet Ski, Parasailing & More",
  h1: "Maldives Water Sports",
  intro:
    "Jet skiing, parasailing, banana boating and similar powered watersports are offered at many Maldives resorts and local islands — real, bookable listings below, sourced from actual operators rather than a generic catalog.",
  metaTitle: "Maldives Water Sports | Jet Ski, Parasailing & Banana Boat",
  metaDescription:
    "Real, bookable Maldives water sports — jet ski, parasailing, banana boating and similar activities from real resort and independent operators.",
  faqs: [
    {
      question: "What water sports are available in the Maldives?",
      answer:
        "Jet skiing, parasailing, banana boating, and similar powered watersports, offered by resorts and independent operators — see the real listings below for what's currently bookable.",
    },
    {
      question: "Do I need experience to try these activities?",
      answer:
        "Most are suitable for first-timers, with a safety briefing and supervision included — check the specific listing below for any stated minimum age or requirement.",
    },
    {
      question: "Are water sports available at local islands or only resorts?",
      answer:
        "Both — some listings below are resort-based, others run from local islands with public access. Check each listing's location.",
    },
    {
      question: "How does this differ from snorkeling or diving?",
      answer:
        "Water sports here means powered, surface activities like jet skiing or parasailing — for underwater reef experiences, see Snorkeling or Diving instead.",
    },
  ],
  category: "water-sports",
  emptyMessage: "No water sports activities recorded yet — check Maldives Activities for the full current listing.",
};

export function generateMetadata(): Metadata {
  return activityCategoryMetadata(config);
}

export default function WaterSportsPage() {
  return <ActivityCategoryLandingPage config={config} />;
}
