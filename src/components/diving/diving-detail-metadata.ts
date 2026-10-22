import type { Metadata } from "next";

import { getEntityLocalePaths } from "@/lib/i18n/repository";
import { getDivingActivityBySlug } from "@/lib/diving/repository";
import { canonicalUrl } from "@/lib/seo/site";

/** Mirrors fishingHreflangAlternates()/[locale] diving route -- see
 * that function's own comment. */
async function divingHreflangAlternates(entityId: string, englishSlug: string): Promise<Record<string, string>> {
  const paths = await getEntityLocalePaths(entityId, englishSlug, "/maldives/diving/");
  const alternates: Record<string, string> = {};
  for (const [locale, path] of Object.entries(paths)) {
    alternates[locale] = canonicalUrl(path);
  }
  alternates["x-default"] = alternates.en;
  return alternates;
}

export async function divingDetailMetadata(slug: string): Promise<Metadata> {
  const activity = await getDivingActivityBySlug(slug);
  if (!activity) return {};

  const title = activity.metaTitle ?? `${activity.title} | Maldives Diving | MTG`;
  const description = activity.metaDescription ?? activity.summary ?? undefined;
  const url = canonicalUrl(`/maldives/diving/${activity.slug}`);
  const languages = await divingHreflangAlternates(activity.id, activity.slug);

  return {
    title,
    description,
    alternates: { canonical: url, languages },
    openGraph: { title, description, url },
  };
}
