import "server-only";

/** Public routes with their own dedicated detail page built from a
 * `locations` row. Shared by every admin action that mutates something a
 * destination page reads (coordinates, approved photos, approved
 * comments) so the exact page can be revalidated, not just /admin/*
 * routes. Every other location_type (locality, airport, etc.) is only
 * ever rendered embedded inside one of these pages or a directory
 * listing, which a shared cache tag already covers. */
const PUBLIC_LOCATION_PATH: Partial<Record<string, (slug: string) => string>> = {
  island: (slug) => `/maldives/islands/${slug}`,
  atoll: (slug) => `/maldives/atolls/${slug}`,
  dive_site: (slug) => `/maldives/dive-sites/${slug}`,
  poi: (slug) => `/maldives/attractions/${slug}`,
};

export function publicDestinationPath(locationType: string | null | undefined, slug: string): string | null {
  const build = locationType ? PUBLIC_LOCATION_PATH[locationType] : undefined;
  return build ? build(slug) : null;
}
