import type { Metadata } from "next";

import { getPackageViewBySlug } from "@/lib/packages/view-repository";
import { canonicalUrl } from "@/lib/seo/site";

export async function packageDetailMetadata(slug: string): Promise<Metadata> {
  const pkg = await getPackageViewBySlug(slug);
  if (!pkg) return {};

  const title = `${pkg.title} | ${pkg.nights ?? "?"} Nights / ${pkg.days ?? "?"} Days`;
  const description = pkg.shortDescription ?? undefined;
  const url = canonicalUrl(`/maldives/packages/${pkg.slug}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
    // Demo packages are real, useful content but not a real commercial
    // offer yet — never let search engines index them as if they were
    // (Task 21 §59/§60). Real packages stay fully indexable.
    robots: pkg.isDemo ? { index: false, follow: true } : undefined,
  };
}
