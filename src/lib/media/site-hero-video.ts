import { publicStorageUrl } from "@/lib/media/types";
import type { HeroVideoSource, HeroVideoSources } from "@/components/ui/hero-video-background";

/**
 * Fixed, hand-curated hero videos for the handful of top-level gateway
 * pages that want a full-bleed looping background instead of a flat
 * gradient (see HeroVideoBackground's own comment for why these aren't
 * MediaAsset/node_media rows). Upload the compressed files to the
 * public `media` Storage bucket at `site/{key}-hero.mp4` /
 * `site/{key}-hero-poster.webp` (desktop) and `site/{key}-hero-mobile.mp4` /
 * `site/{key}-hero-mobile-poster.webp` (mobile) and the matching hero
 * picks them up with no further code change. The mobile/portrait set is
 * optional — omit it and that page just gets its desktop/landscape
 * video on every screen size.
 *
 * Every page with a hero video gets its own `key` (own source footage,
 * own Storage path) rather than sharing one asset — "maldives" is the
 * homepage's boat/speedboat clip, "maldives-country" is the /maldives/
 * hub page's own footage, "activities" is the Activities directory's,
 * "resorts" is the Resorts directory's.
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
function resolveSource(mp4Path: string, posterPath: string): HeroVideoSource | null {
  const mp4 = publicStorageUrl(mp4Path);
  const poster = publicStorageUrl(posterPath);
  if (!mp4 || !poster) return null;

  return { mp4, poster };
}

function resolveHeroVideo(key: string): HeroVideoSources | null {
  const desktop = resolveSource(`site/${key}-hero.mp4`, `site/${key}-hero-poster.webp`);
  if (!desktop) return null;

  const mobile = resolveSource(`site/${key}-hero-mobile.mp4`, `site/${key}-hero-mobile-poster.webp`) ?? undefined;
  return { desktop, mobile };
}

/** Homepage hero (the boat/speedboat clip). */
export function getSiteHeroVideo(): HeroVideoSources | null {
  return resolveHeroVideo("maldives");
}

/** /maldives/ hub page hero (the "Maldives country" clip). */
export function getMaldivesHubHeroVideo(): HeroVideoSources | null {
  return resolveHeroVideo("maldives-country");
}

/** Activities directory hero (dedicated activities-footage clip). */
export function getActivitiesHeroVideo(): HeroVideoSources | null {
  return resolveHeroVideo("activities");
}

/** Resorts directory hero (dedicated resorts-footage clip). */
export function getResortsHeroVideo(): HeroVideoSources | null {
  return resolveHeroVideo("resorts");
}

/** Transfers directory hero (dedicated transfers-footage clip). */
export function getTransfersHeroVideo(): HeroVideoSources | null {
  return resolveHeroVideo("transfers");
}
