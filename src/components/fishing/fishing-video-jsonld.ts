export const YOUTUBE_VIDEO_ID = "VI-9L68aBMg";
export const YOUTUBE_VIDEO_TITLE = "Maldives Fishing";
// The date this video was published on this site (when this file was
// added) -- YouTube's own real upload date isn't available to us without
// a YouTube Data API key, and Google's structured data validator requires
// a full ISO 8601 datetime with a timezone designator either way.
const UPLOAD_DATE = "2026-10-13T00:00:00Z";

export function fishingVideoJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: YOUTUBE_VIDEO_TITLE,
    description: "A look at Maldives fishing trips, recovered from Maldives Tour Guide's own legacy content.",
    embedUrl: `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}`,
    thumbnailUrl: [`https://i.ytimg.com/vi/${YOUTUBE_VIDEO_ID}/hqdefault.jpg`],
    uploadDate: UPLOAD_DATE,
  };
}
