import type { Metadata } from "next";

import { MaleCityTourPage, maleCityTourMetadata } from "@/components/activity/male-city-tour-page";

// Staggered (not a round 3600) so ISR regenerations don't cluster with
// every other route's -- see src/app/page.tsx for why.
export const revalidate = 4500;

export async function generateMetadata(): Promise<Metadata> {
  return maleCityTourMetadata();
}

export default async function MaleCityTourRoute() {
  return <MaleCityTourPage />;
}
