import Link from "next/link";

import { CARD_CLASS, CARD_IMAGE_BLEED_CLASS } from "@/components/ui/card";
import { MediaImage } from "@/components/ui/media-image";
import { articleHref, type ArticleSummary } from "@/lib/articles/types";
import { localizedPath, type Locale } from "@/lib/i18n/locales";

/** `locale` only changes the href prefix (e.g. `/de/maldives/travel-guide/
 * {translated-slug}/`) — `article.slug`/`.title` are expected to already be
 * the translated values when this is used on a localized page (see
 * getTranslatedArticles in src/lib/articles/repository.ts). Omitted (or
 * "en"), this renders the plain English card exactly as before. */
export function ArticleCard({ article, locale }: { article: ArticleSummary; locale?: Locale }) {
  const href = locale ? localizedPath(locale, articleHref(article)) : articleHref(article);
  return (
    <li className={CARD_CLASS}>
      {article.heroImage && (
        <div className={CARD_IMAGE_BLEED_CLASS}>
          <MediaImage asset={article.heroImage} alt={article.title} aspectClassName="aspect-[16/10]" />
        </div>
      )}
      <Link href={href} className="text-lg font-medium text-ocean-900 transition-colors hover:text-maldives-600">
        {article.title}
      </Link>
      {article.summary && <p className="mt-1.5 text-sm text-neutral-600">{article.summary}</p>}
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-neutral-500">
        {article.category && <span>{article.category.title}</span>}
        {article.readingTimeMinutes !== null && <span>{article.readingTimeMinutes} min read</span>}
      </div>
    </li>
  );
}
