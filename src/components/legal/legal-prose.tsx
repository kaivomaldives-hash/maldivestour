import type { ReactNode } from "react";

/**
 * Same heading/paragraph/list styling as the Travel Guide article body
 * (src/components/articles/article-detail-page.tsx) so legal pages read
 * as part of the site, not a bare text dump — just plain JSX here instead
 * of dangerouslySetInnerHTML, since this content is static and fully
 * authored by us (no CMS body to sanitize).
 */
export function LegalProse({ children }: { children: ReactNode }) {
  return (
    <article
      className="
        max-w-none text-neutral-800
        [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-ocean-900
        [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-ocean-900
        [&_p]:mt-4 [&_p]:leading-relaxed
        [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6
        [&_a]:text-maldives-600 [&_a]:underline
      "
    >
      {children}
    </article>
  );
}
