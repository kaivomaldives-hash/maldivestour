import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
