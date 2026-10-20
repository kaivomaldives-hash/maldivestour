import type { Metadata } from "next";

import {
  ActivityCategoryLandingPage,
  activityCategoryMetadata,
  type ActivityCategoryConfig,
} from "@/components/activity/activity-category-landing-page";
import { VIDEOS } from "@/components/activity/activities-video-jsonld";

const config: ActivityCategoryConfig = {
  slug: "dolphin-whale-watching",
  eyebrow: "Dolphin Cruises & Marine Life",
  h1: "Maldives Dolphin & Whale Watching",
  intro:
    "Spinner dolphins are a common, real sighting on sunset cruises across many Maldives atolls. Real, bookable dolphin cruises and marine-life trips below, sourced from actual operators — not a guaranteed-sighting guarantee, since wildlife sightings are never certain.",
  metaTitle: "Maldives Dolphin & Whale Watching | Sunset Dolphin Cruises",
  metaDescription:
    "Real, bookable Maldives dolphin watching cruises and marine-life trips from real operators — sunset dolphin cruises and more.",
  faqs: [
    {
      question: "Am I guaranteed to see dolphins or whales?",
      answer:
        "No — these are real wildlife sightings, not staged encounters, so nothing is guaranteed on any individual trip. Spinner dolphins are commonly sighted on sunset cruises in several atolls, which is why this is a popular, regularly-run excursion.",
    },
    {
      question: "What's the best time of day for a dolphin cruise?",
      answer:
        "Most dolphin cruises run around sunset, when dolphin pods are commonly active near the surface — see the specific listing below for its departure time.",
    },
    {
      question: "Can I see whales in the Maldives?",
      answer:
        "Whale sightings are far less common than dolphin sightings and not the focus of most listed trips below — check the specific listing's description for what it actually targets.",
    },
    {
      question: "Is this trip suitable for children?",
      answer:
        "Dolphin cruises are generally a relaxed boat trip suitable for most ages — check the specific listing below for any stated age requirement.",
    },
  ],
  category: "dolphin-whale-watching",
  emptyMessage: "No dolphin or whale watching trips recorded yet — check Maldives Activities for the full current listing.",
  videos: VIDEOS.filter((v) => v.id === "3wtrnR2BJoQ"),
};

export function generateMetadata(): Metadata {
  return activityCategoryMetadata(config);
}

export default function DolphinWhaleWatchingPage() {
  return <ActivityCategoryLandingPage config={config} />;
}
