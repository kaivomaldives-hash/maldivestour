import type { Metadata } from "next";

import { getArticleBySlug } from "@/lib/articles/repository";
import { getArticleLocalePaths } from "@/lib/i18n/repository";
import { publicStorageUrl } from "@/lib/media/types";
import { canonicalUrl } from "@/lib/seo/site";

/** Mirrors articleHreflangAlternates() in the [locale] article route --
 * the English article is the other reciprocal half of that same pair, so
 * it needs the identical hreflang set pointing at every translated
 * version (Task 19 §41/48: alternates must be reciprocal, never
 * one-directional). Only ever includes locales with a real, published
 * translations row -- getArticleLocalePaths already enforces that. */
async function articleHreflangAlternates(entityId: string, englishSlug: string): Promise<Record<string, string>> {
  const paths = await getArticleLocalePaths(entityId, englishSlug);
  const alternates: Record<string, string> = {};
  for (const [locale, path] of Object.entries(paths)) {
    alternates[locale] = canonicalUrl(path);
  }
  alternates["x-default"] = alternates.en;
  return alternates;
}

export async function articleDetailMetadata(slug: string): Promise<Metadata> {
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  const title = article.metaTitle ?? `${article.title} | Maldives Travel Guide | MTG`;
  const description = article.metaDescription ?? article.summary ?? undefined;
  const url = canonicalUrl(`/maldives/travel-guide/${article.slug}`);
  const languages = await articleHreflangAlternates(article.id, article.slug);
  const ogImage = article.heroImage?.storagePath ? publicStorageUrl(article.heroImage.storagePath) : null;

  return {
    title,
    description,
    alternates: { canonical: url, languages },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: article.publishedAt ?? undefined,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  };
}
