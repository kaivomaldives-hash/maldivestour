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

/** ItemList structured data for any real, currently-listed set of
 * entities on a directory/hub page (activities, dive sites, attractions,
 * ...) — one shared implementation instead of a bespoke one per page.
 * `itemType` is the schema.org type of each listed entity (e.g.
 * "Service" for a bookable activity, "TouristAttraction" for a place). */
export function itemListJsonLd(
  items: Array<{ title: string; href: string; summary: string | null }>,
  itemType: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": itemType,
        name: item.title,
        description: item.summary ?? undefined,
        url: canonicalUrl(item.href),
      },
    })),
  };
}
