export const YOUTUBE_VIDEO_ID = "VI-9L68aBMg";
export const YOUTUBE_VIDEO_TITLE = "Maldives Fishing";

export function fishingVideoJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: YOUTUBE_VIDEO_TITLE,
    description: "A look at Maldives fishing trips, recovered from Maldives Tour Guide's own legacy content.",
    embedUrl: `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}`,
    thumbnailUrl: [`https://i.ytimg.com/vi/${YOUTUBE_VIDEO_ID}/hqdefault.jpg`],
  };
}
