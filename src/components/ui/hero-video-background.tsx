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

/**
 * Full-bleed looping background video for a hero band — used by PageHero
 * (variant="video") and the homepage's own hero. Not a `media_assets`
 * row: both the video and its poster are fixed, hand-curated site assets
 * tied to specific pages, never a photo attached to a real listing/node,
 * so the existing MediaAsset/node_media relational model (built for the
 * latter) doesn't fit and would just add indirection here.
 *
 * Respects `prefers-reduced-motion` by never autoplaying — shows the
 * poster as a plain static image instead, same content, no motion. This
 * can only be checked client-side (the server doesn't know the visitor's
 * OS setting), hence "use client" — but nothing here blocks the initial
 * paint: the poster attribute (or the fallback <img> below) shows
 * immediately either way, before this check has even run.
 */
export function HeroVideoBackground({ source, overlayClassName }: { source: HeroVideoSource; overlayClassName?: string }) {
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
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

  if (failed) return null;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {reducedMotion ? (
        // eslint-disable-next-line @next/next/no-img-element -- a plain full-bleed background image, not page content; next/image's fixed intrinsic sizing doesn't fit this absolutely-positioned cover layer.
        <img src={source.poster} alt="" className="h-full w-full object-cover" onError={() => setFailed(true)} />
      ) : (
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster={source.poster}
          onError={() => setFailed(true)}
        >
          {source.webm && <source src={source.webm} type="video/webm" />}
          <source src={source.mp4} type="video/mp4" />
        </video>
      )}
      <div className={overlayClassName ?? "absolute inset-0 bg-gradient-to-t from-ocean-950/85 via-ocean-900/55 to-ocean-900/20"} />
    </div>
  );
}
