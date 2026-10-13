import type { Metadata } from "next";

import { canonicalUrl } from "@/lib/seo/site";

export function privacyPolicyMetadata(): Metadata {
  const title = "Privacy Policy | MTG";
  const description = "How Maldives Tour Guide collects, uses, and protects your personal information.";
  const url = canonicalUrl("/privacy-policy");
  return { title, description, alternates: { canonical: url }, openGraph: { title, description, url } };
}
