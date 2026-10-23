"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { preload } from "react-dom";

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
const MOBILE_MEDIA = "(max-width: 639px)";
const DESKTOP_MEDIA = "(min-width: 640px)";

function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export function HeroVideoBackground({ source, overlayClassName }: { source: HeroVideoSources; overlayClassName?: string }) {
  // Both read false during SSR and hydration (getServerSnapshot), then
  // the real value -- so hydration never swaps anything the server
  // rendered. The poster doesn't depend on them at all (see the <picture>
  // below); only the later choice of video source does.
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const isMobile = useMediaQuery(MOBILE_MEDIA);
  // Hides the whole layer on a genuine load failure (e.g. the files
  // haven't actually been uploaded to Storage yet) so a broken-image/
  // broken-video icon never sits on top of the page — PageHero/the
  // homepage both keep their ocean-gradient base layer underneath this
  // for exactly that case, so hiding this layer just reveals it.
  const [failed, setFailed] = useState(false);
  // Mounting <video autoPlay> starts its byte stream immediately,
  // competing with the poster <img> for bandwidth on the very connection
  // LCP is timed against — real Chrome field data (Search Console's Core
  // Web Vitals report) showed a sitewide mobile LCP/CLS regression after
  // this hero shipped. Rendering only the (fast, high-priority) poster
  // image for the first idle tick, then swapping in the real <video>,
  // keeps the poster as the uncontested LCP resource; since the <video>
  // itself also shows that exact same image via its own `poster`
  // attribute until playback starts, the swap is visually seamless.
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => number; cancelIdleCallback?: (id: number) => void };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setVideoReady(true));
      return () => w.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(() => setVideoReady(true), 300);
    return () => window.clearTimeout(id);
  }, []);

  // The poster is the LCP element. It used to be chosen from `isMobile`,
  // which the server can't know -- so the server always sent the desktop
  // poster and phones only requested theirs after hydration (~1s of LCP
  // "resource load delay" in Lighthouse). Now the HTML picks it: a <link
  // rel=preload> per breakpoint in <head> (React hoists preload()) and a
  // <picture> below, so the right file starts downloading as soon as the
  // HTML arrives, with no JS involved.
  const { desktop, mobile } = source;
  if (mobile) {
    preload(mobile.poster, { as: "image", fetchPriority: "high", media: MOBILE_MEDIA });
    preload(desktop.poster, { as: "image", fetchPriority: "high", media: DESKTOP_MEDIA });
  } else {
    preload(desktop.poster, { as: "image", fetchPriority: "high" });
  }

  if (failed) return null;

  const active = isMobile && mobile ? mobile : desktop;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {reducedMotion || !videoReady ? (
        <picture>
          {mobile && <source media={MOBILE_MEDIA} srcSet={mobile.poster} />}
          <img
          src={desktop.poster}
          alt=""
          // fetchPriority: this poster is the hero band's LCP candidate —
          // without a priority hint it competes on a level footing with
          // every other resource the page requests, including the video
          // byte stream itself once autoplay kicks in.
          fetchPriority="high"
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
          />
        </picture>
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
          // Same reasoning as the <img> branch's fetchPriority above — the
          // poster is what Chrome measures for LCP here, not the decoded
          // video frame, so it needs the same priority hint.
          // @ts-expect-error -- fetchPriority is valid on <video> per the
          // HTML spec and supported in Chromium, but not yet in React's
          // DOM typings.
          fetchPriority="high"
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
