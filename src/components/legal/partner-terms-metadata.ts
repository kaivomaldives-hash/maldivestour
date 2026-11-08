import type { Metadata } from "next";

import { canonicalUrl } from "@/lib/seo/site";

export function partnerTermsMetadata(): Metadata {
  const title = "Terms and Conditions for Partners | MTG";
  const description =
    "Maldives Tour Guide's general terms and conditions for accommodation, activity, package and transfer partners listing on the site.";
  const url = canonicalUrl("/terms-and-conditions/partners");
  return { title, description, alternates: { canonical: url }, openGraph: { title, description, url } };
}
