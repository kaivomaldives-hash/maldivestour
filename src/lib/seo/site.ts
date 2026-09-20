const DEFAULT_SITE_URL = "https://maldivestour.guide";

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL).replace(/\/+$/, "");
}

/** Builds an absolute, trailing-slash canonical URL for a site-relative path. */
export function canonicalUrl(path: string): string {
  const normalized = `/${path.replace(/^\/+/, "").replace(/\/+$/, "")}/`;
  return `${getSiteUrl()}${normalized === "//" ? "/" : normalized}`;
}

/** BreadcrumbList structured data from the same {label, href} pairs a
 * page already passes to <PageHero breadcrumbs=.../> — real, visible
 * navigation only, never a fabricated hierarchy (Task 18 §"structured
 * data"). The final crumb (the current page, usually href-less) is
 * pointed at the page's own canonical URL. */
export function breadcrumbJsonLd(items: Array<{ label: string; href?: string }>, currentPath: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href ? canonicalUrl(item.href) : canonicalUrl(currentPath),
    })),
  };
}
