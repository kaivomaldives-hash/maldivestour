import type { Metadata } from "next";

import { getAttractionBySlug } from "@/lib/attractions/repository";
import { entityHreflangLanguages } from "@/lib/i18n/repository";
import { canonicalUrl } from "@/lib/seo/site";

export async function attractionDetailMetadata(slug: string): Promise<Metadata> {
  const attraction = await getAttractionBySlug(slug);
  if (!attraction) return {};

  const title = `${attraction.title} | Maldives Attractions | MTG`;
  const description = attraction.summary ?? `${attraction.title}, a Maldives attraction.`;
  const url = canonicalUrl(`/maldives/attractions/${attraction.slug}`);

  const languages = await entityHreflangLanguages(attraction.id, attraction.slug, "/maldives/attractions/");

  return {
    title,
    description,
    alternates: { canonical: url, languages },
    openGraph: { title, description, url },
  };
}
