import type { Metadata } from "next";

import { getDiveSiteBySlug } from "@/lib/diving/repository";
import { entityHreflangLanguages } from "@/lib/i18n/repository";
import { canonicalUrl } from "@/lib/seo/site";

export async function diveSiteDetailMetadata(slug: string): Promise<Metadata> {
  const site = await getDiveSiteBySlug(slug);
  if (!site) return {};

  const title = `${site.title} | Maldives Dive Sites | MTG`;
  const description = site.summary ?? `${site.title}, a Maldives dive site.`;
  const url = canonicalUrl(`/maldives/dive-sites/${site.slug}`);

  const languages = await entityHreflangLanguages(site.id, site.slug, "/maldives/dive-sites/");

  return {
    title,
    description,
    alternates: { canonical: url, languages },
    openGraph: { title, description, url },
  };
}
