import { publicStorageUrl } from "@/lib/media/types";
import type { HeroVideoSource, HeroVideoSources } from "@/components/ui/hero-video-background";

/**
 * The homepage/`/maldives/` hero video — a fixed, hand-curated site asset
 * (see HeroVideoBackground's own comment for why this isn't a
 * MediaAsset/node_media row). Upload the compressed files to the public
 * `media` Storage bucket at exactly these paths and the hero picks them
 * up with no further code change. The mobile/portrait set is optional —
 * omit it and every screen size just gets the desktop/landscape video.
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

const HERO_VIDEO_MOBILE_MP4_PATH = "site/hero-mobile.mp4";
const HERO_VIDEO_MOBILE_WEBM_PATH = "site/hero-mobile.webm";
const HERO_VIDEO_MOBILE_POSTER_PATH = "site/hero-mobile-poster.webp";

function resolveSource(mp4Path: string, webmPath: string, posterPath: string): HeroVideoSource | null {
  const mp4 = publicStorageUrl(mp4Path);
  const poster = publicStorageUrl(posterPath);
  if (!mp4 || !poster) return null;

  const webm = publicStorageUrl(webmPath) ?? undefined;
  return { mp4, webm, poster };
}

export function getSiteHeroVideo(): HeroVideoSources | null {
  const desktop = resolveSource(HERO_VIDEO_MP4_PATH, HERO_VIDEO_WEBM_PATH, HERO_VIDEO_POSTER_PATH);
  if (!desktop) return null;

  const mobile = resolveSource(HERO_VIDEO_MOBILE_MP4_PATH, HERO_VIDEO_MOBILE_WEBM_PATH, HERO_VIDEO_MOBILE_POSTER_PATH) ?? undefined;
  return { desktop, mobile };
}
