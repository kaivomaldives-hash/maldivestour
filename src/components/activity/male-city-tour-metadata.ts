import type { Metadata } from "next";

import { canonicalUrl } from "@/lib/seo/site";

export const PAGE_PATH = "/maldives/male-city-tour";

export async function maleCityTourMetadata(): Promise<Metadata> {
  const title = "Male City Tour — Walking, Bike, Car & Bus Tours | Maldives Tour Guide";
  const description =
    "Book a guided Male City Tour: walking, bike, car, mini bus, or large bus, with airport pickup and drop-off. See Stingray Point, the fish market, Friday Mosque, and more.";
  const url = canonicalUrl(PAGE_PATH);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  };
}
