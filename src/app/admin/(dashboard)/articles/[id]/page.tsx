import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleForm } from "@/components/admin/article-form";
import { requireStaff } from "@/lib/admin/auth";
import { getArticleByIdAdmin } from "@/lib/admin/articles-repository";
import { getNodeMediaAdmin } from "@/lib/admin/media-repository";
import { getCategoryIdsForNode, getCategoryOptionsByGroup } from "@/lib/admin/node-relations-repository";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  await requireStaff();
  const { id } = await params;
  const [article, media, categoryOptions, categoryIds] = await Promise.all([
    getArticleByIdAdmin(id),
    getNodeMediaAdmin(id),
    getCategoryOptionsByGroup("article-category"),
    getCategoryIdsForNode(id),
  ]);
  if (!article) notFound();

  return (
    <div>
      <Link href="/admin/articles" className="text-sm text-maldives-600 hover:underline">
        ← All articles
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-ocean-900">{article.title}</h1>
      <div className="mt-6">
        <ArticleForm
          categoryOptions={categoryOptions}
          initial={{
            id: article.id,
            core: {
              title: article.title,
              slug: article.slug,
              summary: article.summary,
              status: article.status,
              metaTitle: article.metaTitle,
              metaDescription: article.metaDescription,
            },
            fields: article.fields,
            categoryId: categoryOptions.find((c) => categoryIds.includes(c.id))?.id ?? null,
            media,
          }}
        />
      </div>
    </div>
  );
}
