import type { Metadata } from "next";

import { SpeciesLandingPage, speciesPageMetadata } from "@/components/fishing/species-landing-page";
import { SPECIES_PAGES } from "@/lib/fishing/species-content";

const CONTENT = SPECIES_PAGES["dogtooth-tuna"];

export function generateMetadata(): Metadata {
  return speciesPageMetadata(CONTENT);
}

export default function Page() {
  return <SpeciesLandingPage content={CONTENT} />;
}
