import Link from "next/link";

import { CARD_CLASS, CARD_IMAGE_BLEED_CLASS } from "@/components/ui/card";
import { MediaImage } from "@/components/ui/media-image";
import { articleHref, type ArticleSummary } from "@/lib/articles/types";
import type { Locale } from "@/lib/i18n/locales";
import { localizeHubPath } from "@/lib/i18n/hub-paths";
import type { LinkLocalizer } from "@/lib/i18n/link-localizer";

/** `locale` only changes the href prefix (e.g. `/de/malediven/reisefuehrer/
 * {translated-slug}/`) — `article.slug`/`.title` are expected to already be
 * the translated values when this is used on a localized page (see
 * getTranslatedArticles in src/lib/articles/repository.ts). Omitted (or
 * "en"), this renders the plain English card exactly as before.
 * `localize` is the other route in: an English `article` shown on a
 * translated page, linked (and titled) as that article's translation. */
export function ArticleCard({ article, locale, localize }: { article: ArticleSummary; locale?: Locale; localize?: LinkLocalizer }) {
  const englishHref = articleHref(article);
  const href = localize ? localize.href(englishHref) : locale ? localizeHubPath(locale, englishHref) : englishHref;
  const title = localize ? localize.title(englishHref, article.title) : article.title;
  return (
    <li className={CARD_CLASS}>
      {article.heroImage && (
        <div className={CARD_IMAGE_BLEED_CLASS}>
          <MediaImage asset={article.heroImage} alt={title} aspectClassName="aspect-[16/10]" />
        </div>
      )}
      <Link href={href} className="text-lg font-medium text-ocean-900 transition-colors hover:text-maldives-600">
        {title}
      </Link>
      {article.summary && <p className="mt-1.5 text-sm text-neutral-600">{article.summary}</p>}
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-neutral-500">
        {article.category && <span>{article.category.title}</span>}
        {article.readingTimeMinutes !== null && <span>{article.readingTimeMinutes} min read</span>}
      </div>
    </li>
  );
}
