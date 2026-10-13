import type { Metadata } from "next";

import { canonicalUrl } from "@/lib/seo/site";

export function termsOfServiceMetadata(): Metadata {
  const title = "Terms and Conditions | MTG";
  const description = "Maldives Tour Guide's terms and conditions for accommodation, activity and package bookings.";
  const url = canonicalUrl("/terms-and-conditions");
  return { title, description, alternates: { canonical: url }, openGraph: { title, description, url } };
}
