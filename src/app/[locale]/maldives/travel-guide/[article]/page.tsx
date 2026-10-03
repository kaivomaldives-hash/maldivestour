import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { RegisterArticleLocaleLinks } from "@/components/i18n/article-locale-links-context";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { getTranslatedArticleBySlug } from "@/lib/articles/repository";
import { DEFAULT_LOCALE, isLocale, localizedPath, type Locale } from "@/lib/i18n/locales";
import { getArticleLocalePaths } from "@/lib/i18n/repository";
import { getUiStrings } from "@/lib/i18n/ui-strings";
import { publicStorageUrl } from "@/lib/media/types";
import { canonicalUrl, getSiteUrl } from "@/lib/seo/site";
import { createClient } from "@/lib/supabase/public";

/** An entity's hreflang alternates can't reuse hreflangAlternates() from
 * src/lib/seo/site.ts -- that helper assumes one shared path across every
 * locale (true for the fixed page_key pages), but an article's translated
 * slug is genuinely different per locale. Builds the map from real
 * per-locale slugs: the canonical English one (nodes.slug, which has no
 * translations row of its own by design) plus every published
 * translations row. */
async function articleHreflangAlternates(entityId: string, englishSlug: string): Promise<Record<string, string>> {
  const paths = await getArticleLocalePaths(entityId, englishSlug);
  const alternates: Record<string, string> = {};
  for (const [locale, path] of Object.entries(paths)) {
    alternates[locale] = canonicalUrl(path);
  }
  alternates["x-default"] = alternates[DEFAULT_LOCALE];
  return alternates;
}

export const revalidate = 3600;

interface Params {
  locale: string;
  article: string;
}

/**
 * Localized equivalent of src/app/maldives/travel-guide/[article]/page.tsx
 * (and src/components/articles/article-detail-page.tsx). `article` here is
 * the *translated* slug (translations.slug), resolved via
 * getTranslatedArticleBySlug — never the canonical English slug.
 *
 * Deliberately simpler than the English page in two ways: contextual
 * auto-linking (applyContextualLinks) isn't applied to translated body
 * text — the entity-name matching it relies on is built against English
 * titles and isn't reliable against translated prose — and
 * relatedLocations/relatedEntities keep linking to their English pages
 * (those verticals don't have a translated route yet), same convention
 * already established on the [locale]/maldives hub page.
 */
async function loadOrNotFound(locale: string, slug: string) {
  if (!isLocale(locale) || locale === "en") notFound();
  const article = await getTranslatedArticleBySlug(locale, slug);
  if (!article) notFound();
  return { locale: locale as Locale, article };
}

async function getEnglishSlug(entityId: string): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("nodes").select("slug").eq("id", entityId).maybeSingle<{ slug: string }>();
  return data?.slug ?? null;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, article: slug } = await params;
  if (!isLocale(locale) || locale === "en") return {};
  const article = await getTranslatedArticleBySlug(locale, slug);
  if (!article) return {};

  const title = article.metaTitle ?? `${article.title} | Maldives Travel Guide | MTG`;
  const description = article.metaDescription ?? article.summary ?? undefined;
  const url = localizedPath(locale, `/maldives/travel-guide/${article.slug}/`);
  const englishSlug = (await getEnglishSlug(article.id)) ?? article.slug;
  const languages = await articleHreflangAlternates(article.id, englishSlug);
  const ogImage = article.heroImage?.storagePath ? publicStorageUrl(article.heroImage.storagePath) : null;

  return {
    title,
    description,
    alternates: { canonical: `${getSiteUrl()}${url}`, languages },
    openGraph: { title, description, url: `${getSiteUrl()}${url}`, type: "article", locale, images: ogImage ? [{ url: ogImage }] : undefined },
  };
}

function articleJsonLd(locale: Locale, article: NonNullable<Awaited<ReturnType<typeof getTranslatedArticleBySlug>>>) {
  const url = `${getSiteUrl()}${localizedPath(locale, `/maldives/travel-guide/${article.slug}/`)}`;
  const imageUrl = article.heroImage?.storagePath ? publicStorageUrl(article.heroImage.storagePath) : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription ?? article.summary ?? undefined,
    image: imageUrl ? [imageUrl] : undefined,
    datePublished: article.publishedAt ?? undefined,
    inLanguage: locale,
    mainEntityOfPage: url,
    publisher: { "@type": "Organization", name: "Maldives Tour Guide", url: getSiteUrl() },
  };
}

export default async function LocaleArticleDetailPage({ params }: { params: Promise<Params> }) {
  const { locale: rawLocale, article: slug } = await params;
  const { locale, article } = await loadOrNotFound(rawLocale, slug);
  const ui = getUiStrings(locale);
  const d = ui.articleDetail;
  const englishSlug = (await getEnglishSlug(article.id)) ?? article.slug;
  const localePaths = await getArticleLocalePaths(article.id, englishSlug);

  return (
    <main>
      <RegisterArticleLocaleLinks paths={localePaths} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(locale, article)) }} />

      <PageHero
        breadcrumbs={[
          { label: ui.nav.maldives, href: `/${locale}/maldives/` },
          { label: ui.nav.travelGuide, href: `/${locale}/maldives/travel-guide/` },
          { label: article.title },
        ]}
        eyebrow={article.category?.title ?? ui.nav.travelGuide}
        title={article.title}
        description={article.summary ?? undefined}
        image={article.heroImage}
        meta={article.readingTimeMinutes !== null ? <span>{article.readingTimeMinutes} {d.minRead}</span> : undefined}
      />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_280px]">
          <article
            className="
              max-w-none text-neutral-800
              [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-ocean-900
              [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-ocean-900
              [&_h4]:mt-4 [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:text-ocean-900
              [&_p]:mt-4 [&_p]:leading-relaxed
              [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6
              [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-6
              [&_blockquote]:mt-4 [&_blockquote]:border-l-4 [&_blockquote]:border-maldives-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-neutral-600
              [&_figure]:mt-6 [&_figure]:overflow-hidden [&_figure]:rounded-2xl
              [&_img]:h-auto [&_img]:w-full
              [&_table]:mt-4 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm
              [&_td]:border [&_td]:border-neutral-200 [&_td]:p-2
              [&_a]:text-maldives-600 [&_a]:underline
              [&_[data-youtube-id]]:relative [&_[data-youtube-id]]:mt-6 [&_[data-youtube-id]]:aspect-video [&_[data-youtube-id]]:overflow-hidden [&_[data-youtube-id]]:rounded-2xl [&_[data-youtube-id]]:bg-neutral-100
            "
            dangerouslySetInnerHTML={{ __html: article.bodyHtml }}
          />

          <aside className="space-y-8">
            {article.relatedLocations.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">{d.relatedPlaces}</h2>
                <ul className="mt-3 space-y-2 text-sm">
                  {article.relatedLocations.map((location) => (
                    <li key={location.id}>
                      <Link
                        href={location.locationType === "atoll" ? `/maldives/atolls/${location.slug}/` : `/maldives/islands/${location.slug}/`}
                        className="text-maldives-600 hover:underline"
                      >
                        {location.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {article.relatedEntities.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">{d.relatedBookable}</h2>
                <ul className="mt-3 space-y-2 text-sm">
                  {article.relatedEntities.map((entity) => (
                    <li key={entity.id}>
                      <Link href={entity.href} className="text-maldives-600 hover:underline">
                        {entity.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {article.category && (
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">{d.topic}</h2>
                <Link
                  href={`/maldives/travel-guide/?category=${article.category.slug}`}
                  className="mt-3 inline-block rounded-full border border-neutral-300 px-3 py-1 text-sm text-neutral-700 hover:border-maldives-600 hover:text-maldives-600"
                >
                  {article.category.title}
                </Link>
              </div>
            )}
          </aside>
        </div>

        {article.relatedArticles.length > 0 && (
          <div className="mt-14 border-t border-neutral-200 pt-10">
            <h2 className="text-xl font-semibold text-ocean-900">{d.relatedArticles}</h2>
            <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {article.relatedArticles.map((related) => (
                <li key={related.id}>
                  <Link
                    href={localizedPath(locale, `/maldives/travel-guide/${related.slug}/`)}
                    className="block rounded-xl border border-neutral-200 p-4 text-sm font-medium text-ocean-900 transition-colors hover:border-maldives-600 hover:text-maldives-600"
                  >
                    {related.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-10 border-t border-neutral-200 pt-6">
          <Link href={`/${locale}/maldives/travel-guide/`} className="text-sm font-medium text-maldives-600 hover:underline">
            {d.backToGuide}
          </Link>
        </div>
      </div>
    </main>
  );
}
