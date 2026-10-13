import type { Metadata } from "next";

import { getFishingActivityBySlug } from "@/lib/fishing/repository";
import { canonicalUrl } from "@/lib/seo/site";

export async function fishingDetailMetadata(slug: string): Promise<Metadata> {
  const activity = await getFishingActivityBySlug(slug);
  if (!activity) return {};

  const title = activity.metaTitle ?? `${activity.title} | Maldives Fishing | MTG`;
  const description = activity.metaDescription ?? activity.summary ?? undefined;
  const url = canonicalUrl(`/maldives/fishing/${activity.slug}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  };
}
