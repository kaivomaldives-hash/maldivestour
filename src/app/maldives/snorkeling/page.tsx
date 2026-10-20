import type { Metadata } from "next";

import {
  ActivityCategoryLandingPage,
  activityCategoryMetadata,
  type ActivityCategoryConfig,
} from "@/components/activity/activity-category-landing-page";

const config: ActivityCategoryConfig = {
  slug: "snorkeling",
  eyebrow: "Reefs, Marine Life & Guided Trips",
  h1: "Snorkeling in the Maldives",
  intro:
    "The Maldives' shallow house reefs and lagoons put snorkeling within reach of almost every visitor, resort and local island alike — no diving certification needed. Below are real, bookable snorkeling trips, from guided reef excursions to nurse shark and stingray snorkeling, sourced from actual operators rather than generic stock listings.",
  metaTitle: "Snorkeling in the Maldives | Reefs, Marine Life & Guided Trips",
  metaDescription:
    "Real, bookable Maldives snorkeling trips — reef snorkeling, shark and stingray spots, equipment and guided excursions from real operators.",
  faqs: [
    {
      question: "Do I need to be a strong swimmer to snorkel in the Maldives?",
      answer:
        "Basic swimming ability and comfort in open water are enough for most guided trips — operators typically provide a life jacket on request and keep the group close to the boat or reef edge. Check the specific listing below for any stated fitness or age requirements.",
    },
    {
      question: "What marine life can I expect to see while snorkeling?",
      answer:
        "Reef fish, coral gardens, and often turtles are common on a house-reef snorkel. Several listed trips below are built specifically around higher-probability sightings — reef sharks, nurse sharks, or stingrays at known cleaning or feeding spots — see each listing for exactly what it targets.",
    },
    {
      question: "Is shark snorkeling actually safe?",
      answer:
        "The reef and nurse shark species found at the shallow snorkeling spots used by Maldives operators are not considered dangerous to humans and are routinely approached by guided groups. Always follow your guide's instructions on distance and behaviour — see the specific trip listing for safety details from that operator.",
    },
    {
      question: "Do I need my own snorkeling equipment?",
      answer:
        "Most operators include mask, snorkel and fins in the trip price, or offer rental — check the specific listing below. Bringing your own well-fitted mask is worth it if you snorkel often or have a hard time with rental fit.",
    },
    {
      question: "Where can I snorkel without booking a boat trip?",
      answer:
        "Many resorts have a snorkelable house reef accessible directly from the beach or jetty — ask your resort. The trips below are boat-based excursions to specific reef, shark or sandbank spots beyond a resort's own house reef.",
    },
  ],
  category: "snorkeling",
  emptyMessage: "No snorkeling trips recorded yet — check Maldives Activities for the full current listing.",
};

export function generateMetadata(): Metadata {
  return activityCategoryMetadata(config);
}

export default function SnorkelingPage() {
  return <ActivityCategoryLandingPage config={config} />;
}
