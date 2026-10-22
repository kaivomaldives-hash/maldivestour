import Link from "next/link";

import { ArticleCard } from "@/components/articles/article-card";
import type { ArticleDirectorySearchParams } from "@/components/articles/article-directory-metadata";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHero } from "@/components/ui/page-hero";
import { Pagination } from "@/components/ui/pagination";
import { getArticleCategoriesInUse, getArticles } from "@/lib/articles/repository";

const PAGE_SIZE = 24;

export async function ArticleDirectoryPage({ searchParams }: { searchParams: Promise<ArticleDirectorySearchParams> }) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);

  const categories = await getArticleCategoriesInUse();
  const activeCategory = sp.category && categories.some((c) => c.slug === sp.category) ? sp.category : undefined;

  const results = await getArticles({ page, pageSize: PAGE_SIZE, category: activeCategory });
  const totalPages = Math.max(1, Math.ceil(results.total / PAGE_SIZE));

  return (
    <main>
      <PageHero
        breadcrumbs={[{ label: "Maldives", href: "/maldives/" }, { label: "Travel Guide" }]}
        eyebrow="Travel Guide"
        title="Maldives Travel Guide"
        description="Real, in-depth guides to the islands, atolls, diving, weather, and culture of the Maldives."
      />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
        {categories.length > 0 && (
          <nav aria-label="Filter by category" className="flex flex-wrap gap-2 text-sm">
            <Link
              href="/maldives/travel-guide/"
              className={`rounded-full border px-3 py-1 ${!activeCategory ? "border-maldives-600 bg-maldives-600 text-white" : "border-neutral-300 text-neutral-700"}`}
            >
              All topics
            </Link>
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/maldives/travel-guide/?category=${category.slug}`}
                className={`rounded-full border px-3 py-1 ${activeCategory === category.slug ? "border-maldives-600 bg-maldives-600 text-white" : "border-neutral-300 text-neutral-700"}`}
              >
                {category.title}
              </Link>
            ))}
          </nav>
        )}

        {results.items.length === 0 ? (
          <EmptyState title="No articles in this category yet" />
        ) : (
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {results.items.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </ul>
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          basePath="/maldives/travel-guide/"
          baseQuery={activeCategory ? `category=${activeCategory}` : undefined}
        />

        <section className="mt-12 border-t border-neutral-200 pt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Explore More Maldives</h2>
          <nav aria-label="Related Maldives links" className="mt-4 flex flex-wrap gap-2">
            {[
              { href: "/maldives/", label: "Maldives Overview" },
              { href: "/maldives/islands/", label: "Islands" },
              { href: "/maldives/atolls/", label: "Atolls" },
              { href: "/maldives/resorts/", label: "Resorts" },
              { href: "/maldives/activities/", label: "Things to Do" },
              { href: "/maldives/diving/", label: "Diving" },
              { href: "/maldives/transfers/", label: "Transfers" },
              { href: "/maldives/packages/", label: "Packages" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:border-maldives-500 hover:text-maldives-600"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </section>
      </div>
    </main>
  );
}
