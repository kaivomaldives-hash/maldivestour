import type { Metadata } from "next";

import { getEntityLocalePaths } from "@/lib/i18n/repository";
import { getPackageViewBySlug } from "@/lib/packages/view-repository";
import { canonicalUrl } from "@/lib/seo/site";

/** Mirrors articleHreflangAlternates()/[locale] package route -- the
 * English package is the other reciprocal half of that pair, so it
 * needs the identical hreflang set pointing at every translated
 * version (Task 19 §41/48: alternates must be reciprocal, never
 * one-directional). Only ever includes locales with a real, published
 * translations row -- getEntityLocalePaths already enforces that. */
async function packageHreflangAlternates(entityId: string, englishSlug: string): Promise<Record<string, string>> {
  const paths = await getEntityLocalePaths(entityId, englishSlug, "/maldives/packages/");
  const alternates: Record<string, string> = {};
  for (const [locale, path] of Object.entries(paths)) {
    alternates[locale] = canonicalUrl(path);
  }
  alternates["x-default"] = alternates.en;
  return alternates;
}

export async function packageDetailMetadata(slug: string): Promise<Metadata> {
  const pkg = await getPackageViewBySlug(slug);
  if (!pkg) return {};

  const title = `${pkg.title} | ${pkg.nights ?? "?"} Nights / ${pkg.days ?? "?"} Days`;
  const description = pkg.shortDescription ?? undefined;
  const url = canonicalUrl(`/maldives/packages/${pkg.slug}`);
  const languages = pkg.isDemo ? undefined : await packageHreflangAlternates(pkg.id, pkg.slug);

  return {
    title,
    description,
    alternates: { canonical: url, ...(languages ? { languages } : {}) },
    openGraph: { title, description, url },
    // Demo packages are real, useful content but not a real commercial
    // offer yet — never let search engines index them as if they were
    // (Task 21 §59/§60). Real packages stay fully indexable.
    robots: pkg.isDemo ? { index: false, follow: true } : undefined,
  };
}
