import type { Metadata } from "next";

import { AccommodationSeoLandingPage } from "@/components/accommodation/accommodation-seo-landing-page";
import { accommodationSeoLandingMetadata } from "@/components/accommodation/accommodation-seo-landing-metadata";

export function generateMetadata(): Promise<Metadata> {
  return accommodationSeoLandingMetadata("resort", "overwater-villas");
}

export default function OverwaterVillaResortsPage() {
  return <AccommodationSeoLandingPage type="resort" slug="overwater-villas" />;
}
