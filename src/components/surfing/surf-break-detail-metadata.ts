import type { Metadata } from "next";

import { getSurfBreakBySlug } from "@/lib/surfing/repository";
import { canonicalUrl } from "@/lib/seo/site";

export async function surfBreakDetailMetadata(slug: string): Promise<Metadata> {
  const surfBreak = await getSurfBreakBySlug(slug);
  if (!surfBreak) return {};

  const title = `${surfBreak.title} | Maldives Surf Breaks | MTG`;
  const description = surfBreak.summary ?? `${surfBreak.title}, a Maldives surf break.`;
  const url = canonicalUrl(`/maldives/surf-breaks/${surfBreak.slug}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  };
}
