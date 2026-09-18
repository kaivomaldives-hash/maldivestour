const DEFAULT_SITE_URL = "https://maldivestour.guide";

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL).replace(/\/+$/, "");
}

/** Builds an absolute, trailing-slash canonical URL for a site-relative path. */
export function canonicalUrl(path: string): string {
  const normalized = `/${path.replace(/^\/+/, "").replace(/\/+$/, "")}/`;
  return `${getSiteUrl()}${normalized === "//" ? "/" : normalized}`;
}
