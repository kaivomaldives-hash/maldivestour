import type { Metadata } from "next";

import { canonicalUrl } from "@/lib/seo/site";

export function speedboatDirectoryMetadata(): Metadata {
  const title = "Maldives Private Speedboat Charter | Boat Hire & Private Transfers";
  const description = "Charter a private speedboat in the Maldives — real boats, real capacity and specs, hourly, destination-based, or custom hire. No fixed public price; request a quote.";
  const url = canonicalUrl("/maldives-speedboats-charter");
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  };
}
