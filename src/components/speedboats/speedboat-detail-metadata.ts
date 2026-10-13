import type { Metadata } from "next";

import { getSpeedboatBySlug } from "@/lib/speedboats/repository";
import { canonicalUrl } from "@/lib/seo/site";

export async function speedboatDetailMetadata(slug: string): Promise<Metadata> {
  const boat = await getSpeedboatBySlug(slug);
  if (!boat) return {};
  const title = boat.metaTitle ?? `${boat.title} Private Speedboat Charter | Maldives Tour Guide`;
  const description = boat.metaDescription ?? boat.summary ?? `Charter the ${boat.title} in the Maldives.`;
  const url = canonicalUrl(`/maldives-speedboats-charter/${boat.slug}`);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  };
}
