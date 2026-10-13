import type { Metadata } from "next";

import {
  articleDirectoryMetadata,
  type ArticleDirectorySearchParams,
} from "@/components/articles/article-directory-metadata";
import { ArticleDirectoryPage } from "@/components/articles/article-directory-page";

export function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<ArticleDirectorySearchParams>;
}): Promise<Metadata> {
  return articleDirectoryMetadata(searchParams);
}

export default function TravelGuidePage({
  searchParams,
}: {
  searchParams: Promise<ArticleDirectorySearchParams>;
}) {
  return <ArticleDirectoryPage searchParams={searchParams} />;
}
