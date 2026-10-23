import type { Metadata } from "next";

import { getAtollBySlug } from "@/lib/locations/repository";
import { entityHreflangLanguages } from "@/lib/i18n/repository";
import { canonicalUrl } from "@/lib/seo/site";

export async function atollDetailMetadata(slug: string): Promise<Metadata> {
  const atoll = await getAtollBySlug(slug);
  if (!atoll) return {};

  const title = atoll.metaTitle ?? `${atoll.title} | Maldives Atolls | MTG`;
  const description = atoll.metaDescription ?? atoll.summary ?? undefined;
  const url = canonicalUrl(`/maldives/atolls/${atoll.slug}`);

  const languages = await entityHreflangLanguages(atoll.id, atoll.slug, "/maldives/atolls/");

  return {
    title,
    description,
    alternates: { canonical: url, languages },
    openGraph: { title, description, url },
  };
}
