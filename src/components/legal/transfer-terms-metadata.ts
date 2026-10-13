import type { Metadata } from "next";

import { canonicalUrl } from "@/lib/seo/site";

export function transferTermsMetadata(): Metadata {
  const title = "Terms and Conditions for Transfers | MTG";
  const description = "Maldives Tour Guide's terms and conditions for speedboat, airport, resort and island transfer bookings.";
  const url = canonicalUrl("/terms-and-conditions/transfers");
  return { title, description, alternates: { canonical: url }, openGraph: { title, description, url } };
}
