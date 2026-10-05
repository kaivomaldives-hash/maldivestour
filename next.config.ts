import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every canonical URL (src/lib/seo/site.ts's canonicalUrl()), every
  // internal <Link href>, and every url_redirects.target_path sitewide
  // already uses a trailing slash — but Next's own unconfigured default
  // is the opposite (redirects trailing-slash URLs to the non-slash
  // version, e.g. "/foo/" -> "/foo"). Every page on the site was
  // therefore silently fighting its own canonical/link convention with a
  // same-site 308 on every single request — confirmed live (curl
  // "/become-a-partner/" returned "308 -> /become-a-partner" before this
  // flag). Root cause of an on-page SEO audit flagging ~34 "non-indexable
  // canonical" pages, ~21 internal links that redirect, and it doubled up
  // every one of the 559 legacy url_redirects rows into a 2-hop redirect
  // (legacy path -> trailing-slash target -> Next strips the slash).
  // Setting this to true makes Next's own behavior match the convention
  // already used everywhere instead of undoing it.
  trailingSlash: true,
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
