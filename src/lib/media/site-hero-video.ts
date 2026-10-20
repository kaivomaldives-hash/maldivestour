import { publicStorageUrl } from "@/lib/media/types";
import type { HeroVideoSource } from "@/components/ui/hero-video-background";

/**
 * The homepage/`/maldives/` hero video — a fixed, hand-curated site asset
 * (see HeroVideoBackground's own comment for why this isn't a
 * MediaAsset/node_media row). Upload the compressed files to the public
 * `media` Storage bucket at exactly these paths and the hero picks them
 * up with no further code change.
 *
 * publicStorageUrl() only confirms NEXT_PUBLIC_SUPABASE_URL is configured
 * — same as every other caller in this codebase, it can't check whether
 * a file actually exists at the path without a network request this is
 * a plain sync function. Until the files are uploaded, the <video>/<img>
 * this URL feeds will 404; HeroVideoBackground's onError handler catches
 * that and hides itself, falling back to the page's own ocean gradient
 * rather than a broken-media icon.
 */
const HERO_VIDEO_MP4_PATH = "site/hero.mp4";
const HERO_VIDEO_WEBM_PATH = "site/hero.webm";
const HERO_VIDEO_POSTER_PATH = "site/hero-poster.webp";

export function getSiteHeroVideo(): HeroVideoSource | null {
  const mp4 = publicStorageUrl(HERO_VIDEO_MP4_PATH);
  const poster = publicStorageUrl(HERO_VIDEO_POSTER_PATH);
  if (!mp4 || !poster) return null;

  const webm = publicStorageUrl(HERO_VIDEO_WEBM_PATH) ?? undefined;
  return { mp4, webm, poster };
}
