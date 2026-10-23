import { PREFIXED_LOCALES } from "@/lib/i18n/locales";
import { createClient } from "@/lib/supabase/public";

/**
 * Legacy-URL redirect resolution (Task 16). The new app namespaces every
 * real route under `/maldives/` (plus the bare homepage `/` and `/api/*`)
 * — see src/app's top-level directories — so every legacy path from the
 * old site (root-level `.html` files, `/atolls/...`, `/transfer/...`,
 * `/tours/...`, etc.) is structurally distinguishable from a real new-site
 * request without needing to know the full new route table. This keeps
 * the url_redirects lookup off the hot path for the site's actual traffic
 * (Task 16 §35 — "avoid expensive database calls for every request where
 * possible").
 *
 * This list has not kept up with every top-level route added since Task 16
 * (confirmed against src/app's current top-level directories): the admin
 * CMS, the standalone marketing/info pages, and — most costly, since this
 * runs on every single page view, not just bot traffic — every locale-
 * prefixed page (`/de`, `/de/maldives/...`, etc. for all 8 non-English
 * locales) was falling through to "looks like legacy" and paying for a
 * url_redirects read on every real visit, on top of every bot probe of
 * `/admin/*` doing the same. Locale prefixes only ever wrap `/<locale>`
 * (the locale homepage) and `/<locale>/maldives` (see src/app/[locale]'s
 * own tree — it has no other subtree), so those are the only two shapes
 * needed per locale. */
const NEW_APP_PATHS = [
  "/maldives",
  "/api",
  "/admin",
  "/become-a-partner",
  "/maldives-ferry-schedule",
  "/maldives-speedboats-charter",
  "/terms-and-conditions",
  ...PREFIXED_LOCALES.flatMap((locale) => [`/${locale}`, `/${locale}/maldives`]),
];
const NEVER_REDIRECT_EXACT = new Set(["/", "/favicon.ico", "/robots.txt", "/sitemap.xml"]);

export function looksLikeLegacyPath(pathname: string): boolean {
  if (NEVER_REDIRECT_EXACT.has(pathname)) return false;
  if (pathname.startsWith("/_next/")) return false;
  return !NEW_APP_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/** Legacy source paths were recorded (scripts/generate-redirect-seed.mjs)
 * as the exact on-disk `.html` path, no trailing slash, no query string,
 * no fragment. Strips those off an incoming request path the same way,
 * so a browser/crawler hitting a trailing-slash or query-string variant
 * of an old URL still resolves (Task 16 §8/§33/§34). */
export function normalizeLegacyPath(pathname: string): string {
  let normalized = pathname;
  try {
    normalized = decodeURIComponent(normalized);
  } catch {
    // malformed percent-encoding — use as-is
  }
  normalized = normalized.replace(/\/+$/, "");
  return normalized === "" ? "/" : normalized;
}

export interface ResolvedRedirect {
  targetPath: string;
  statusCode: 301 | 302 | 308;
}

/** Only ever returns a same-origin, server-relative path (starts with a
 * single `/`, never `//host/...` or `scheme://...`) — the open-redirect
 * guard required by Task 16 §36. url_redirects.target_path is always
 * populated by scripts/generate-redirect-seed.mjs from a real internal
 * app route, so this should never trip in practice; it's here as a
 * defensive read-time check, not a trust boundary this code relies on. */
function isSafeInternalPath(value: string): boolean {
  return value.startsWith("/") && !value.startsWith("//") && !/^\/[a-z]+:/i.test(value);
}

/**
 * Looks up an active redirect for `pathname` in `url_redirects`. Uses a
 * plain (non-session, non-cookie) Supabase client — this is a public,
 * unauthenticated read of `is_active` rows only (see the
 * `url_redirects_public_read` RLS policy), the same trust level as any
 * other anonymous visitor request, so no session/auth machinery is needed
 * for it. Returns null (never throws) on any failure — a redirect lookup
 * problem must never break the page a visitor is trying to reach.
 */
export async function resolveLegacyRedirect(pathname: string): Promise<ResolvedRedirect | null> {
  const sourcePath = normalizeLegacyPath(pathname);

  try {
    const supabase = await createClient();
    // Sources are matched with or without a trailing slash: legacy .html
    // paths were recorded without one, but redirects for new-site URLs
    // (added by hand, or from the admin) are often stored with one.
    const candidates = sourcePath === "/" ? [sourcePath] : [sourcePath, `${sourcePath}/`];
    const { data: rows, error } = await supabase
      .from("url_redirects")
      .select("target_type, target_path, status_code")
      .in("source_path", candidates)
      .eq("is_active", true)
      .limit(1)
      .returns<Array<{ target_type: string; target_path: string | null; status_code: number }>>();

    const data = rows?.[0];
    if (error || !data) return null;
    if (data.target_type !== "path" || !data.target_path) return null;
    if (!isSafeInternalPath(data.target_path)) return null;
    if (![301, 302, 308].includes(data.status_code)) return null;

    return { targetPath: data.target_path, statusCode: data.status_code as 301 | 302 | 308 };
  } catch {
    return null;
  }
}

const IN_APP_SOURCES_TTL_MS = 60_000;
let inAppSources: { paths: Set<string>; fetchedAt: number } | null = null;
let inAppSourcesInFlight: Promise<Set<string>> | null = null;

async function fetchInAppRedirectSources(): Promise<Set<string>> {
  const supabase = await createClient();
  // .html sources are all legacy (handled per request already) and are the
  // bulk of the table -- leaving them out keeps this one small read well
  // under PostgREST's 1000-row response cap.
  const { data, error } = await supabase
    .from("url_redirects")
    .select("source_path")
    .eq("is_active", true)
    .not("source_path", "like", "%.html")
    .returns<Array<{ source_path: string }>>();
  if (error || !data) throw error ?? new Error("no data");
  return new Set(data.map((r) => normalizeLegacyPath(r.source_path)).filter((p) => !looksLikeLegacyPath(p)));
}

/**
 * True when an active redirect exists whose source is a NEW-site path
 * (e.g. a retired /maldives/transfers/<slug> URL, added from the admin) --
 * the case looksLikeLegacyPath deliberately skips so real traffic never
 * pays for a per-request url_redirects read. Instead, the whole (small)
 * set of such sources is held in memory and refreshed at most once a
 * minute per server instance, so a new redirect takes effect within
 * about a minute. A failed refresh keeps the previous set, and a cold
 * failure means "no redirect" -- never a broken page.
 */
export async function hasInAppRedirect(pathname: string): Promise<boolean> {
  const now = Date.now();
  if (!inAppSources || now - inAppSources.fetchedAt > IN_APP_SOURCES_TTL_MS) {
    inAppSourcesInFlight ??= fetchInAppRedirectSources()
      .then((paths) => {
        inAppSources = { paths, fetchedAt: Date.now() };
        return paths;
      })
      .catch(() => {
        if (inAppSources) inAppSources.fetchedAt = Date.now(); // back off, keep the last good set
        return inAppSources?.paths ?? new Set<string>();
      })
      .finally(() => {
        inAppSourcesInFlight = null;
      });
    if (!inAppSources) await inAppSourcesInFlight; // first request waits; later ones use the previous set meanwhile
  }
  return inAppSources?.paths.has(normalizeLegacyPath(pathname)) ?? false;
}
