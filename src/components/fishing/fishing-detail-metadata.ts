import type { Metadata } from "next";

import { getEntityLocalePaths } from "@/lib/i18n/repository";
import { getFishingActivityBySlug } from "@/lib/fishing/repository";
import { canonicalUrl } from "@/lib/seo/site";

/** Mirrors packageHreflangAlternates()/[locale] fishing route -- the
 * English activity is the other reciprocal half of that pair, so it
 * needs the identical hreflang set pointing at every translated
 * version. Only ever includes locales with a real, published
 * translations row -- getEntityLocalePaths already enforces that. */
async function fishingHreflangAlternates(entityId: string, englishSlug: string): Promise<Record<string, string>> {
  const paths = await getEntityLocalePaths(entityId, englishSlug, "/maldives/fishing/");
  const alternates: Record<string, string> = {};
  for (const [locale, path] of Object.entries(paths)) {
    alternates[locale] = canonicalUrl(path);
  }
  alternates["x-default"] = alternates.en;
  return alternates;
}

export async function fishingDetailMetadata(slug: string): Promise<Metadata> {
  const activity = await getFishingActivityBySlug(slug);
  if (!activity) return {};

  const title = activity.metaTitle ?? `${activity.title} | Maldives Fishing | MTG`;
  const description = activity.metaDescription ?? activity.summary ?? undefined;
  const url = canonicalUrl(`/maldives/fishing/${activity.slug}`);
  const languages = await fishingHreflangAlternates(activity.id, activity.slug);

  return {
    title,
    description,
    alternates: { canonical: url, languages },
    openGraph: { title, description, url },
  };
}
