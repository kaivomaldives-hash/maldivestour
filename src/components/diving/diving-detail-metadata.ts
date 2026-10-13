import type { Metadata } from "next";

import { getDivingActivityBySlug } from "@/lib/diving/repository";
import { canonicalUrl } from "@/lib/seo/site";

export async function divingDetailMetadata(slug: string): Promise<Metadata> {
  const activity = await getDivingActivityBySlug(slug);
  if (!activity) return {};

  const title = activity.metaTitle ?? `${activity.title} | Maldives Diving | MTG`;
  const description = activity.metaDescription ?? activity.summary ?? undefined;
  const url = canonicalUrl(`/maldives/diving/${activity.slug}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  };
}
