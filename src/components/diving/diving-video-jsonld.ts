export const VIDEOS = [
  {
    id: "1B5ULRsWNR4",
    title: "Best Places for Diving in the Maldives",
    description: "A look at some of the Maldives' best-known dive sites.",
  },
  {
    id: "1oJb1oIOtTc",
    title: "Full Day Dive Trip Maldives",
    description: "A full-day diving charter, visiting multiple sites in one trip.",
  },
  {
    id: "AgAYoXFnY-s",
    title: "Maldives Diving In Moofushi Kandu South Ari Atoll",
    description: "Diving at Moofushi Kandu, a channel dive site in South Ari Atoll.",
  },
  {
    id: "rao_dDgz0Rg",
    title: "Liveaboard Dive Vessels",
    description: "Liveaboard dive vessels used for multi-day diving trips around the Maldives.",
  },
] as const;

// See the identical note in fishing-video-jsonld.ts.
const UPLOAD_DATE = "2026-10-13T00:00:00Z";

export function divingVideoJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: VIDEOS.map((video, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "VideoObject",
        name: video.title,
        description: `${video.description} Recovered from Maldives Tour Guide's own legacy content.`,
        embedUrl: `https://www.youtube.com/embed/${video.id}`,
        thumbnailUrl: [`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`],
        uploadDate: UPLOAD_DATE,
      },
    })),
  };
}
