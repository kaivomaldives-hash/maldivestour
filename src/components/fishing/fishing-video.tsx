import { YOUTUBE_VIDEO_ID, YOUTUBE_VIDEO_TITLE } from "@/components/fishing/fishing-video-jsonld";

/**
 * Task 22 §21: a real video recovered from the legacy site
 * (release/public_html/maldives-fishing-trips.html), embedded properly —
 * never an invented id. Same pattern as
 * src/components/transfers/route-video.tsx.
 */
export function FishingVideo() {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold text-ocean-900">Fishing in the Maldives — Video</h2>
      <p className="mt-2 text-sm text-neutral-700">A look at what a real Maldives fishing trip looks like on the water.</p>
      <div className="mt-4 aspect-video w-full overflow-hidden rounded-2xl bg-neutral-100">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}`}
          title={YOUTUBE_VIDEO_TITLE}
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </section>
  );
}
