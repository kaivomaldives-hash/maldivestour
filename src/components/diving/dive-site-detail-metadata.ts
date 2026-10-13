import type { Metadata } from "next";

import { getDiveSiteBySlug } from "@/lib/diving/repository";
import { canonicalUrl } from "@/lib/seo/site";

export async function diveSiteDetailMetadata(slug: string): Promise<Metadata> {
  const site = await getDiveSiteBySlug(slug);
  if (!site) return {};

  const title = `${site.title} | Maldives Dive Sites | MTG`;
  const description = site.summary ?? `${site.title}, a Maldives dive site.`;
  const url = canonicalUrl(`/maldives/dive-sites/${site.slug}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  };
}
