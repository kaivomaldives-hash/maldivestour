import { publicStorageUrl } from "@/lib/media/types";
import type { HeroVideoSource, HeroVideoSources } from "@/components/ui/hero-video-background";

/**
 * Fixed, hand-curated hero videos for the handful of top-level gateway
 * pages that want a full-bleed looping background instead of a flat
 * gradient (see HeroVideoBackground's own comment for why these aren't
 * MediaAsset/node_media rows). Upload the compressed files to the
 * public `media` Storage bucket at exactly the paths below and the
 * matching hero picks them up with no further code change. Each page's
 * mobile/portrait set is optional — omit it and that page just gets its
 * desktop/landscape video on every screen size.
 *
 * Three distinct videos, not one shared asset: the homepage keeps the
 * original boat/speedboat clip, the /maldives/ hub page gets its own
 * "Maldives country" footage, and the Activities directory gets its
 * own dedicated activities footage — each is different source footage,
 * so each gets its own Storage path rather than overloading one.
 *
 * MP4-only, no WebM: publicStorageUrl() only confirms
 * NEXT_PUBLIC_SUPABASE_URL is configured, not that a file actually exists
 * at the path — so a WebM path here would always resolve to a URL, 404 or
 * not, making the <video> always advertise a WebM <source> that 404s
 * whenever no WebM file has been uploaded. Browsers are inconsistent
 * about recovering from a failed non-last <source> — that's exactly what
 * caused the hero to intermittently fall back to the poster/old gradient
 * on reload once already. Add a WebM pair back only once real WebM files
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

const MALDIVES_HUB_VIDEO_MP4_PATH = "site/maldives-country-hero.mp4";
const MALDIVES_HUB_VIDEO_POSTER_PATH = "site/maldives-country-hero-poster.webp";
const MALDIVES_HUB_VIDEO_MOBILE_MP4_PATH = "site/maldives-country-hero-mobile.mp4";
const MALDIVES_HUB_VIDEO_MOBILE_POSTER_PATH = "site/maldives-country-hero-mobile-poster.webp";

const ACTIVITIES_VIDEO_MP4_PATH = "site/activities-hero.mp4";
const ACTIVITIES_VIDEO_POSTER_PATH = "site/activities-hero-poster.webp";
const ACTIVITIES_VIDEO_MOBILE_MP4_PATH = "site/activities-hero-mobile.mp4";
const ACTIVITIES_VIDEO_MOBILE_POSTER_PATH = "site/activities-hero-mobile-poster.webp";

function resolveSource(mp4Path: string, posterPath: string): HeroVideoSource | null {
  const mp4 = publicStorageUrl(mp4Path);
  const poster = publicStorageUrl(posterPath);
  if (!mp4 || !poster) return null;

  return { mp4, poster };
}

/** Homepage hero (the boat/speedboat clip). */
export function getSiteHeroVideo(): HeroVideoSources | null {
  const desktop = resolveSource(HERO_VIDEO_MP4_PATH, HERO_VIDEO_POSTER_PATH);
  if (!desktop) return null;

  const mobile = resolveSource(HERO_VIDEO_MOBILE_MP4_PATH, HERO_VIDEO_MOBILE_POSTER_PATH) ?? undefined;
  return { desktop, mobile };
}

/** /maldives/ hub page hero (the "Maldives country" clip). */
export function getMaldivesHubHeroVideo(): HeroVideoSources | null {
  const desktop = resolveSource(MALDIVES_HUB_VIDEO_MP4_PATH, MALDIVES_HUB_VIDEO_POSTER_PATH);
  if (!desktop) return null;

  const mobile = resolveSource(MALDIVES_HUB_VIDEO_MOBILE_MP4_PATH, MALDIVES_HUB_VIDEO_MOBILE_POSTER_PATH) ?? undefined;
  return { desktop, mobile };
}

/** Activities directory hero (dedicated activities-footage clip). */
export function getActivitiesHeroVideo(): HeroVideoSources | null {
  const desktop = resolveSource(ACTIVITIES_VIDEO_MP4_PATH, ACTIVITIES_VIDEO_POSTER_PATH);
  if (!desktop) return null;

  const mobile = resolveSource(ACTIVITIES_VIDEO_MOBILE_MP4_PATH, ACTIVITIES_VIDEO_MOBILE_POSTER_PATH) ?? undefined;
  return { desktop, mobile };
}
