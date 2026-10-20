import type { Metadata } from "next";

import {
  ActivityCategoryLandingPage,
  activityCategoryMetadata,
  type ActivityCategoryConfig,
} from "@/components/activity/activity-category-landing-page";
import { VIDEOS } from "@/components/activity/activities-video-jsonld";

const config: ActivityCategoryConfig = {
  slug: "island-hopping",
  eyebrow: "Local Island Tours",
  h1: "Maldives Island Hopping Tours",
  intro:
    "Island hopping tours visit real, inhabited local islands in a single trip — a way to see traditional Maldivian island life, culture and local markets beyond a single resort. Real, bookable tours below, often combined with snorkeling or a sandbank stop.",
  metaTitle: "Maldives Island Hopping Tours | Local Island Day Trips",
  metaDescription:
    "Real, bookable Maldives island hopping tours — visit local islands, markets and traditional communities, often combined with snorkeling or a sandbank stop.",
  faqs: [
    {
      question: "What is an island hopping tour?",
      answer:
        "A guided boat trip that visits one or more inhabited local islands in a single outing, giving visitors a look at everyday Maldivian island life, local markets and craft, distinct from a resort's own private island.",
    },
    {
      question: "Is island hopping different from a sandbank or snorkeling trip?",
      answer:
        "Yes — island hopping specifically visits inhabited local islands. A sandbank trip visits an uninhabited sand feature; many island hopping tours below also include a snorkeling or sandbank stop in the same day — see the specific listing.",
    },
    {
      question: "Can I stay overnight on a local island instead of a resort?",
      answer:
        "Yes — see Guesthouses for real local-island accommodation; this page covers day-trip island hopping tours, typically departing from and returning to a resort or Male the same day.",
    },
    {
      question: "What should I wear visiting a local island?",
      answer:
        "Local islands are inhabited Maldivian communities, not resorts — modest dress (shoulders and knees covered) is expected away from the island's own designated bikini beach, where one exists.",
    },
  ],
  category: "island-hopping",
  emptyMessage: "No island hopping tours recorded yet — check Maldives Activities for the full current listing.",
  videos: VIDEOS.filter((v) => v.id === "1e3k1QK66ZI"),
};

export function generateMetadata(): Metadata {
  return activityCategoryMetadata(config);
}

export default function IslandHoppingPage() {
  return <ActivityCategoryLandingPage config={config} />;
}
