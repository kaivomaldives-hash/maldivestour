import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleCard } from "@/components/articles/article-card";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHero } from "@/components/ui/page-hero";
import { getTranslatedArticles } from "@/lib/articles/repository";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { getUiStrings } from "@/lib/i18n/ui-strings";
import { localizedCanonicalUrl } from "@/lib/seo/site";

export const revalidate = 3600;

/**
 * Localized Travel Guide hub — lists only articles that actually have a
 * published translation in this locale (getTranslatedArticles). No
 * category filter/pagination yet (unlike the English hub,
 * src/components/articles/article-directory-page.tsx): translated article
 * counts per locale are small enough right now that a single flat grid is
 * honest about how much is actually here, rather than building paging UI
 * for a handful of cards.
 */
async function loadOrNotFound(locale: string): Promise<Locale> {
  if (!isLocale(locale) || locale === "en") notFound();
  return locale;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "en") return {};
  const ui = getUiStrings(locale);
  const h = ui.travelGuideHub;
  const url = localizedCanonicalUrl(locale, "/maldives/travel-guide/");

  return {
    title: `${h.title} | MTG`,
    description: h.description,
    alternates: { canonical: url },
    openGraph: { title: h.title, description: h.description, url, locale },
  };
}

export default async function LocaleTravelGuideHubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = await loadOrNotFound(rawLocale);
  const ui = getUiStrings(locale);
  const h = ui.travelGuideHub;

  const articles = await getTranslatedArticles(locale);

  return (
    <main>
      <PageHero
        breadcrumbs={[{ label: ui.nav.maldives, href: `/${locale}/maldives/` }, { label: ui.nav.travelGuide }]}
        eyebrow={h.heroEyebrow}
        title={h.title}
        description={h.description}
      />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
        {articles.length === 0 ? (
          <EmptyState title={h.emptyStateTitle} />
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} locale={locale} />
            ))}
          </ul>
        )}
        <p className="mt-8 text-sm text-neutral-500">{h.comingSoonNote}</p>
      </div>
    </main>
  );
}
