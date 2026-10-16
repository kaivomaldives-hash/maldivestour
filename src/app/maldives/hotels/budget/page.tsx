import type { Metadata } from "next";

import { AccommodationSeoLandingPage } from "@/components/accommodation/accommodation-seo-landing-page";
import { accommodationSeoLandingMetadata } from "@/components/accommodation/accommodation-seo-landing-metadata";

export function generateMetadata(): Promise<Metadata> {
  return accommodationSeoLandingMetadata("hotel", "budget");
}

export default function BudgetHotelsPage() {
  return <AccommodationSeoLandingPage type="hotel" slug="budget" />;
}
