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
 * MP4-only, no WebM: publicStorageUrl() only confirms
 * NEXT_PUBLIC_SUPABASE_URL is configured, not that a file actually exists
 * at the path — so a WebM path here would always resolve to a URL, 404 or
 * not, making the <video> always advertise a WebM <source> that 404s
 * whenever (as today) no WebM file has been uploaded. Browsers are
 * inconsistent about recovering from a failed non-last <source> — that's
 * exactly what caused the hero to intermittently fall back to the poster/
 * old gradient on reload. Add a WebM pair back only once real WebM files
 * exist at these paths.
 *
 * publicStorageUrl() can't check whether a file actually exists at the
 * path without a network request — this is a plain sync function. Until
 * the files are uploaded, the <video>/<img> this URL feeds will 404;
 * HeroVideoBackground's onError handler catches that and hides itself,
 * falling back to the page's own ocean gradient rather than a broken-
 * media icon.
 */
const HERO_VIDEO_MP4_PATH = "site/maldives-hero.mp4";
const HERO_VIDEO_POSTER_PATH = "site/maldives-hero-poster.webp";

const HERO_VIDEO_MOBILE_MP4_PATH = "site/maldives-hero-mobile.mp4";
const HERO_VIDEO_MOBILE_POSTER_PATH = "site/maldives-hero-mobile-poster.webp";

function resolveSource(mp4Path: string, posterPath: string): HeroVideoSource | null {
  const mp4 = publicStorageUrl(mp4Path);
  const poster = publicStorageUrl(posterPath);
  if (!mp4 || !poster) return null;

  return { mp4, poster };
}

export function getSiteHeroVideo(): HeroVideoSources | null {
  const desktop = resolveSource(HERO_VIDEO_MP4_PATH, HERO_VIDEO_POSTER_PATH);
  if (!desktop) return null;

  const mobile = resolveSource(HERO_VIDEO_MOBILE_MP4_PATH, HERO_VIDEO_MOBILE_POSTER_PATH) ?? undefined;
  return { desktop, mobile };
}
