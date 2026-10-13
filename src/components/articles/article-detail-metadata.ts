import type { Metadata } from "next";

import { getArticleBySlug } from "@/lib/articles/repository";
import { publicStorageUrl } from "@/lib/media/types";
import { canonicalUrl } from "@/lib/seo/site";

export async function articleDetailMetadata(slug: string): Promise<Metadata> {
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  const title = article.metaTitle ?? `${article.title} | Maldives Travel Guide | MTG`;
  const description = article.metaDescription ?? article.summary ?? undefined;
  const url = canonicalUrl(`/maldives/travel-guide/${article.slug}`);
  const ogImage = article.heroImage?.storagePath ? publicStorageUrl(article.heroImage.storagePath) : null;

  return {
    title,
    description,
    alternates: { canonical: url },
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
