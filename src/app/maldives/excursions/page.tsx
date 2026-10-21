import type { Metadata } from "next";

import {
  ActivityCategoryLandingPage,
  activityCategoryMetadata,
  type ActivityCategoryConfig,
} from "@/components/activity/activity-category-landing-page";
import { VIDEOS } from "@/components/activity/activities-video-jsonld";

const config: ActivityCategoryConfig = {
  slug: "excursions",
  eyebrow: "Day Trips & Guided Tours",
  h1: "Maldives Excursions",
  intro:
    "From sandbank picnics and dolphin cruises to multi-stop reef and local-island tours, these are real, individually bookable excursions across the Maldives — sourced from actual resorts and independent operators, not a generic stock listing.",
  metaTitle: "Maldives Excursions | Day Trips, Cruises & Guided Tours",
  metaDescription:
    "Real, bookable Maldives excursions — sandbank picnics, dolphin cruises, snorkeling trips and guided local-island tours from real operators.",
  faqs: [
    {
      question: "What counts as an excursion versus an activity?",
      answer:
        "An excursion is typically a guided outing — a boat trip, cruise or tour with a set itinerary — rather than a single focused activity like a dive or surf lesson. The listings below are all real guided excursions; see Maldives Activities for the full range including fishing, diving and surfing.",
    },
    {
      question: "How long do excursions typically last?",
      answer:
        "It varies by trip — some are a half-day sandbank or snorkeling outing, others run a full day combining several stops. Check the specific listing below for its exact duration.",
    },
    {
      question: "Can excursions be booked for a private group?",
      answer:
        "Some operators offer private charter alongside their shared/scheduled option — enquire directly on the specific listing's page to confirm current pricing and availability.",
    },
    {
      question: "Are excursions suitable for children?",
      answer:
        "Many are — check the specific listing below for any stated minimum age or fitness requirement, since this varies by operator and trip type.",
    },
  ],
  category: "excursions",
  emptyMessage: "No excursions recorded yet — check Maldives Activities for the full current listing.",
  videos: VIDEOS.filter((v) => v.id === "AW-UqFyoiVc"),
};

export function generateMetadata(): Metadata {
  return activityCategoryMetadata(config);
}

export default function ExcursionsPage() {
  return <ActivityCategoryLandingPage config={config} />;
}
