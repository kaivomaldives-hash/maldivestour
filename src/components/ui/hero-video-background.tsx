"use client";

import { useEffect, useState } from "react";

export interface HeroVideoSource {
  mp4: string;
  /** Optional VP9/AV1 WebM — smaller than the MP4 at the same quality in
   * every browser that supports it; listed first so those browsers pick
   * it, with the MP4 as the universal fallback. */
  webm?: string;
  /** Shown instantly while the video buffers, and used as the entire
   * background whenever the video doesn't play at all (reduced-motion,
   * or a browser that blocks autoplay) — this is the thing that actually
   * has to be fast, not the video. A real `next/image`-optimized photo,
   * not the video's own first frame grabbed at request time. */
  poster: string;
}

export interface HeroVideoSources {
  /** Landscape video, used from the sm breakpoint (640px) up. */
  desktop: HeroVideoSource;
  /** Optional portrait/vertical video, shown below the sm breakpoint.
   * Falls back to `desktop` when omitted — e.g. before a mobile cut has
   * been uploaded. */
  mobile?: HeroVideoSource;
}

/**
 * Full-bleed looping background video for a hero band — used by PageHero
 * (variant="video") and the homepage's own hero. Not a `media_assets`
 * row: both the video and its poster are fixed, hand-curated site assets
 * tied to specific pages, never a photo attached to a real listing/node,
 * so the existing MediaAsset/node_media relational model (built for the
 * latter) doesn't fit and would just add indirection here.
 *
 * Picks the portrait `mobile` source below the sm breakpoint (640px) and
 * the landscape `desktop` source at or above it — only one <video> is
 * ever mounted, so switching (e.g. rotating a phone) never downloads
 * both. Also respects `prefers-reduced-motion` by never autoplaying —
 * shows the poster as a plain static image instead, same content, no
 * motion. Both checks can only run client-side (the server doesn't know
 * the visitor's viewport or OS setting), hence "use client" — but
 * nothing here blocks the initial paint: the poster attribute (or the
 * fallback <img> below) shows immediately either way, before either
 * check has run.
 */
export function HeroVideoBackground({ source, overlayClassName }: { source: HeroVideoSources; overlayClassName?: string }) {
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches,
  );
  // Hides the whole layer on a genuine load failure (e.g. the files
  // haven't actually been uploaded to Storage yet) so a broken-image/
  // broken-video icon never sits on top of the page — PageHero/the
  // homepage both keep their ocean-gradient base layer underneath this
  // for exactly that case, so hiding this layer just reveals it.
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 639px)");
    const handleChange = (event: MediaQueryListEvent) => setIsMobile(event.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  if (failed) return null;

  const active = isMobile && source.mobile ? source.mobile : source.desktop;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {reducedMotion ? (
        // eslint-disable-next-line @next/next/no-img-element -- a plain full-bleed background image, not page content; next/image's fixed intrinsic sizing doesn't fit this absolutely-positioned cover layer.
        <img key={active.poster} src={active.poster} alt="" className="h-full w-full object-cover" onError={() => setFailed(true)} />
      ) : (
        <video
          key={active.mp4}
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster={active.poster}
          onError={() => setFailed(true)}
        >
          {active.webm && <source src={active.webm} type="video/webm" />}
          <source src={active.mp4} type="video/mp4" />
        </video>
      )}
      <div className={overlayClassName ?? "absolute inset-0 bg-gradient-to-t from-ocean-950/85 via-ocean-900/55 to-ocean-900/20"} />
    </div>
  );
}
