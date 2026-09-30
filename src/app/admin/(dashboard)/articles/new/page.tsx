import Link from "next/link";

import { ArticleForm } from "@/components/admin/article-form";
import { getCategoryOptionsByGroup } from "@/lib/admin/node-relations-repository";

export default async function NewArticlePage() {
  const categoryOptions = await getCategoryOptionsByGroup("article-category");

  return (
    <div>
      <Link href="/admin/articles" className="text-sm text-maldives-600 hover:underline">
        ← All articles
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-ocean-900">New article</h1>
      <div className="mt-6">
        <ArticleForm categoryOptions={categoryOptions} />
      </div>
    </div>
  );
}
