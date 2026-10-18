export const VIDEOS = [
  {
    id: "4TvWBi1S13c",
    title: "Snorkeling in the Maldives",
    description: "A look at snorkeling, one of the most accessible things to do in the Maldives.",
  },
  {
    id: "AW-UqFyoiVc",
    title: "30 Best Things To Do in Maldives",
    description: "A roundup of things to do in the Maldives, from watersports to island hopping and local culture.",
  },
  {
    id: "1e3k1QK66ZI",
    title: "Maldives Island Hopping",
    description: "Island hopping between local islands, one of the most popular Maldives excursions.",
  },
  {
    id: "3wtrnR2BJoQ",
    title: "Hanifaru Bay",
    description: "Hanifaru Bay in Baa Atoll, a UNESCO biosphere reserve known for manta ray and whale shark encounters.",
  },
] as const;

// See the identical note in fishing-video-jsonld.ts.
const UPLOAD_DATE = "2026-10-13T00:00:00Z";

export function activitiesVideoJsonLd() {
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
