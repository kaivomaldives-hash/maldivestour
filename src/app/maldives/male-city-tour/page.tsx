import type { Metadata } from "next";

import { MaleCityTourPage, maleCityTourMetadata } from "@/components/activity/male-city-tour-page";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return maleCityTourMetadata();
}

export default async function MaleCityTourRoute() {
  return <MaleCityTourPage />;
}
