import type { Metadata } from "next";

import { ArticleDetailPage, articleDetailMetadata } from "@/components/articles/article-detail-page";

// Staggered (not a round 3600) so ISR regenerations don't cluster with
// every other route's -- see src/app/page.tsx for why.
export const revalidate = 4350;

interface Params {
  article: string;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { article: slug } = await params;
  return articleDetailMetadata(slug);
}

export default async function ArticleDetailRoute({ params }: { params: Promise<Params> }) {
  const { article: slug } = await params;
  return <ArticleDetailPage slug={slug} />;
}
