import type { NextConfig } from "next";

/**
 * Localized URL segments for the translated [locale] hubs -- must stay
 * in sync with src/lib/i18n/hub-paths.ts's LOCALIZED_HUB_PREFIXES (the
 * values here are duplicated rather than imported because next.config.ts
 * is loaded by Next's own lightweight config loader, which doesn't
 * resolve the "@/..." tsconfig path alias the rest of the app uses --
 * importing a project module here risks silently failing to resolve at
 * build time). Each entry's `parent` is null for the top-level Maldives
 * hub itself, or the parent hub's own key for a sub-hub nested under it
 * (e.g. "packages" sits under "maldives"), so the English path and the
 * localized path can both be composed correctly for every locale.
 */
const LOCALIZED_HUBS: Array<{ englishSegment: string; parent: string | null; words: Partial<Record<string, string>> }> = [
  { englishSegment: "maldives", parent: null, words: { de: "malediven", es: "maldivas", it: "maldive", ru: "maldivy", ja: "morudibu", zh: "maerdaifu" } },
  { englishSegment: "packages", parent: "maldives", words: { de: "pakete", es: "paquetes", it: "pacchetti", ru: "pakety", ja: "pakeji", zh: "taocan" } },
  { englishSegment: "transfers", parent: "maldives", words: { de: "transfer", es: "traslados", it: "trasferimenti", ru: "transfery", ja: "sogei", zh: "jiesong" } },
  { englishSegment: "travel-guide", parent: "maldives", words: { de: "reisefuehrer", es: "guia-de-viaje", it: "guida-di-viaggio", ru: "putevoditel", ja: "ryokou-gaido", zh: "lvyou-zhinan" } },
  { englishSegment: "fishing", parent: "maldives", words: { de: "angeln", es: "pesca", it: "pesca", ru: "rybalka", ja: "tsuri", zh: "diaoyu" } },
  { englishSegment: "diving", parent: "maldives", words: { de: "tauchen", es: "buceo", it: "immersioni", ru: "dayving", ja: "daibingu", zh: "qianshui" } },
  { englishSegment: "activities", parent: "maldives", words: { de: "aktivitaeten", es: "actividades", it: "attivita", ru: "aktivnosti", ja: "akutibiti", zh: "huodong" } },
  { englishSegment: "atolls", parent: "maldives", words: { de: "atolle", es: "atolones", it: "atolli", ru: "atolly", ja: "kansho", zh: "huanjiao" } },
  { englishSegment: "islands", parent: "maldives", words: { de: "inseln", es: "islas", it: "isole", ru: "ostrova", ja: "shima", zh: "daoyu" } },
  { englishSegment: "dive-sites", parent: "maldives", words: { de: "tauchplaetze", es: "puntos-de-buceo", it: "siti-di-immersione", ru: "dayv-sayty", ja: "daibu-pointo", zh: "qianshui-didian" } },
  { englishSegment: "stays", parent: "maldives", words: { de: "unterkuenfte", es: "alojamiento", it: "alloggi", ru: "prozhivanie", ja: "shukuhaku", zh: "zhusu" } },
  { englishSegment: "resorts", parent: "maldives", words: { de: "resorts", es: "resorts", it: "resort", ru: "kurorty", ja: "rizooto", zh: "dujiacun" } },
  { englishSegment: "hotels", parent: "maldives", words: { de: "hotels", es: "hoteles", it: "hotel", ru: "oteli", ja: "hoteru", zh: "jiudian" } },
  { englishSegment: "guesthouses", parent: "maldives", words: { de: "gaestehaeuser", es: "casas-de-huespedes", it: "guesthouse", ru: "gostevye-doma", ja: "gesutohausu", zh: "minsu" } },
  { englishSegment: "attractions", parent: "maldives", words: { de: "sehenswuerdigkeiten", es: "atracciones", it: "attrazioni", ru: "dostoprimechatelnosti", ja: "kanko-supotto", zh: "jingdian" } },
];

const LOCALES = ["de", "es", "it", "ru", "ja", "zh"];

function englishPathFor(hub: (typeof LOCALIZED_HUBS)[number]): string {
  const parent = hub.parent ? LOCALIZED_HUBS.find((h) => h.englishSegment === hub.parent) : null;
  return parent ? `${englishPathFor(parent)}${hub.englishSegment}/` : `/${hub.englishSegment}/`;
}

function localizedPathFor(hub: (typeof LOCALIZED_HUBS)[number], locale: string): string | null {
  const word = hub.words[locale];
  if (!word) return null;
  const parent = hub.parent ? LOCALIZED_HUBS.find((h) => h.englishSegment === hub.parent) : null;
  if (!parent) return `/${word}/`;
  const parentPath = localizedPathFor(parent, locale);
  return parentPath ? `${parentPath}${word}/` : null;
}

// Most specific (longest) English path first, so a nested hub's rule is
// tried before its parent's more general one -- otherwise the parent's
// `:path*` wildcard would always win and the nested segment would never
// localize.
const ORDERED_HUBS = [...LOCALIZED_HUBS].sort((a, b) => englishPathFor(b).length - englishPathFor(a).length);

function buildHubRewrites() {
  const rules: Array<{ source: string; destination: string }> = [];
  for (const locale of LOCALES) {
    for (const hub of ORDERED_HUBS) {
      const localizedPath = localizedPathFor(hub, locale);
      if (!localizedPath) continue;
      const englishPath = englishPathFor(hub);
      rules.push({ source: `/${locale}${localizedPath}`, destination: `/${locale}${englishPath}` });
      rules.push({ source: `/${locale}${localizedPath}:path*/`, destination: `/${locale}${englishPath}:path*/` });
    }
  }
  return rules;
}

function buildHubRedirects() {
  const rules: Array<{ source: string; destination: string; permanent: true }> = [];
  for (const locale of LOCALES) {
    for (const hub of ORDERED_HUBS) {
      const localizedPath = localizedPathFor(hub, locale);
      if (!localizedPath) continue;
      const englishPath = englishPathFor(hub);
      rules.push({ source: `/${locale}${englishPath}`, destination: `/${locale}${localizedPath}`, permanent: true });
      rules.push({ source: `/${locale}${englishPath}:path*/`, destination: `/${locale}${localizedPath}:path*/`, permanent: true });
    }
  }
  return rules;
}

const nextConfig: NextConfig = {
  // Every canonical URL (src/lib/seo/site.ts's canonicalUrl()), every
  // internal <Link href>, and every url_redirects.target_path sitewide
  // already uses a trailing slash — but Next's own unconfigured default
  // is the opposite (redirects trailing-slash URLs to the non-slash
  // version, e.g. "/foo/" -> "/foo"). Every page on the site was
  // therefore silently fighting its own canonical/link convention with a
  // same-site 308 on every single request. Root cause of an SEO audit
  // flagging dozens of "redirect loop"/non-indexable-canonical pages —
  // the canonical tag points to the trailing-slash URL, which then
  // redirects back to the no-slash URL a crawler just fetched. Setting
  // this to true makes Next's own behavior match the convention already
  // used everywhere instead of undoing it. (This was set once before,
  // then lost in an unrelated batch of reverts on 2026-10-05 — see git
  // history for commits 2ebd93b/94ac3a6 — restoring it now.)
  trailingSlash: true,
  // Localizes the [locale] hub route segments beyond the bare
  // `/{locale}` prefix (e.g. "/ru/maldivy/pakety/" for the Russian
  // packages hub) without moving any actual route files -- the real
  // page still lives at src/app/[locale]/maldives/packages/page.tsx.
  // redirects() sends anyone hitting the OLD locale-prefixed-but-
  // English-segment URL (e.g. "/ru/maldives/packages/", which the app's
  // own canonical/hreflang/Link generation no longer produces, but an
  // old cached/external link still might) on to the new localized URL
  // with a permanent 308, so only ONE URL per locale page ever serves
  // 200 -- never two URLs for the same content (duplicate-content risk
  // the redirects close off). rewrites() then does the reverse,
  // invisibly, so Next can actually find the page files at that new
  // URL. See src/lib/i18n/hub-paths.ts for the single source of truth
  // these word choices mirror (duplicated here, not imported -- see
  // LOCALIZED_HUBS's own comment above for why).
  async redirects() {
    return buildHubRedirects();
  },
  async rewrites() {
    return buildHubRewrites();
  },
  // Partner verification document uploads (business license/ID/bank
  // proof/property photos, src/lib/partner/document-actions.ts) go
  // through a Server Action as multipart/form-data — the 1MB default
  // easily clips a phone-camera photo or scanned PDF.
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  // Task 17 §31: no security headers existed before this. Deliberately NOT
  // adding a Content-Security-Policy here — the site embeds Tawk.to,
  // YouTube, and Supabase Storage images, and this sandbox has no network
  // access to actually verify a CSP against them (confirmed blocked
  // earlier this session); shipping an untested CSP risks silently
  // breaking one of those on the live site, which the task's own
  // instructions warn against. These four are safe regardless of what
  // third parties are embedded, since none of them restrict what the page
  // itself can load — only what it discloses/how it can be framed.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  images: {
    // Serves pre-built size variants straight from Storage for optimized
    // media (see src/lib/media/image-loader.ts) -- a custom loader means
    // next/image never routes anything through Vercel's metered
    // /_next/image optimizer.
    loader: "custom",
    loaderFile: "./src/lib/media/image-loader.ts",
    remotePatterns: [
      // Supabase Storage public bucket URLs (see src/lib/media/types.ts's
      // publicStorageUrl and the "media" bucket created in
      // supabase/migrations/20250110000100_legacy_migration_schema.sql). A
      // hostname wildcard rather than a hardcoded project ref so this
      // config doesn't depend on env vars being available at build/config
      // evaluation time, and works the same across dev/staging/prod
      // Supabase projects.
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
