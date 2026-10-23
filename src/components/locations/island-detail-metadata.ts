import type { Metadata } from "next";

import { getIslandBySlug } from "@/lib/locations/repository";
import { entityHreflangLanguages } from "@/lib/i18n/repository";
import { canonicalUrl } from "@/lib/seo/site";

export async function islandDetailMetadata(slug: string): Promise<Metadata> {
  const island = await getIslandBySlug(slug);
  if (!island) return {};

  const title = island.metaTitle ?? `${island.title}, Maldives | Things to Do, Stays & Travel Guide | MTG`;
  const description = island.metaDescription ?? island.summary ?? undefined;
  const url = canonicalUrl(`/maldives/islands/${island.slug}`);

  const languages = await entityHreflangLanguages(island.id, island.slug, "/maldives/islands/");

  return {
    title,
    description,
    alternates: { canonical: url, languages },
    openGraph: { title, description, url },
  };
}
