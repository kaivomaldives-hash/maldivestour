import type { Metadata } from "next";

import { getSurfingActivityBySlug } from "@/lib/surfing/repository";
import { canonicalUrl } from "@/lib/seo/site";

export async function surfingDetailMetadata(slug: string): Promise<Metadata> {
  const activity = await getSurfingActivityBySlug(slug);
  if (!activity) return {};

  const title = activity.metaTitle ?? `${activity.title} | Maldives Surfing | MTG`;
  const description = activity.metaDescription ?? activity.summary ?? undefined;
  const url = canonicalUrl(`/maldives/surfing/${activity.slug}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  };
}
