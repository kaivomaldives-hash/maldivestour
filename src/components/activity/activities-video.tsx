const YOUTUBE_VIDEO_ID = "4TvWBi1S13c";
const YOUTUBE_VIDEO_TITLE = "Snorkeling in the Maldives";

/** A real video recovered from the legacy site
 * (release/public_html/maldives-capital-male-city.html), embedded
 * properly — never an invented id. Same pattern as
 * src/components/transfers/route-video.tsx. */
export function ActivitiesVideo() {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold text-ocean-900">Maldives Activities — Video</h2>
      <p className="mt-2 text-sm text-neutral-700">A look at snorkeling, one of the most accessible things to do in the Maldives.</p>
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

export function activitiesVideoJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: YOUTUBE_VIDEO_TITLE,
    description: "A look at snorkeling in the Maldives, recovered from Maldives Tour Guide's own legacy content.",
    embedUrl: `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}`,
    thumbnailUrl: [`https://i.ytimg.com/vi/${YOUTUBE_VIDEO_ID}/hqdefault.jpg`],
  };
}
