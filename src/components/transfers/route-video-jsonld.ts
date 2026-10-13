export const YOUTUBE_VIDEO_ID = "1Wjic-JZ11g";
export const YOUTUBE_VIDEO_TITLE = "The Best Ways to Travel Around the Maldives — Seaplane Transfers and Speedboats Explained";

export function routeVideoJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: YOUTUBE_VIDEO_TITLE,
    description: "A general explainer on Maldives transfers — speedboats and seaplanes — from Maldives Tour Guide.",
    embedUrl: `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}`,
    thumbnailUrl: [`https://i.ytimg.com/vi/${YOUTUBE_VIDEO_ID}/hqdefault.jpg`],
  };
}
