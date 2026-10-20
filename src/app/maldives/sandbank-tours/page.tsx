import type { Metadata } from "next";

import {
  ActivityCategoryLandingPage,
  activityCategoryMetadata,
  type ActivityCategoryConfig,
} from "@/components/activity/activity-category-landing-page";

const config: ActivityCategoryConfig = {
  slug: "sandbank-tours",
  eyebrow: "Sandbanks & Picnics",
  h1: "Maldives Sandbank Tours",
  intro:
    "A sandbank is a real, shifting strip of exposed sand surrounded by open lagoon — no vegetation, no building — reached only by boat. These are real, bookable sandbank trips, often paired with snorkeling or a picnic lunch, from actual Maldives operators.",
  metaTitle: "Maldives Sandbank Tours | Picnics, Snorkeling & Boat Trips",
  metaDescription:
    "Real, bookable Maldives sandbank tours — picnic trips and sandbank-and-snorkeling excursions from real operators, with boat transfer included.",
  faqs: [
    {
      question: "What is a Maldives sandbank, exactly?",
      answer:
        "It's a small, uninhabited bank of exposed sand within a lagoon or reef, with open water on every side — distinct from an island, which has vegetation and a fixed shoreline. Sandbanks can shift in size and shape with the tide and season.",
    },
    {
      question: "Is a sandbank tour the same as an island-hopping tour?",
      answer:
        "Not quite — island hopping visits inhabited local islands, while a sandbank tour visits an uninhabited sand feature, usually for photos, a swim, snorkeling or a picnic. Some trips combine both — check the specific listing below.",
    },
    {
      question: "What's included on a typical sandbank trip?",
      answer:
        "Boat transfer to and from the sandbank, and often snorkeling gear or a picnic lunch — see the specific listing below for exactly what that operator includes.",
    },
    {
      question: "Can I snorkel from the sandbank?",
      answer:
        "Many sandbanks sit near a reef edge, making them a common pairing with snorkeling — see Snorkeling for dedicated reef and marine-life trips, or check whether a specific sandbank listing below already includes it.",
    },
  ],
  category: "sandbank-tours",
  emptyMessage: "No sandbank tours recorded yet — check Maldives Activities for the full current listing.",
};

export function generateMetadata(): Metadata {
  return activityCategoryMetadata(config);
}

export default function SandbankToursPage() {
  return <ActivityCategoryLandingPage config={config} />;
}
