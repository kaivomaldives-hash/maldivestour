export function accommodationVideoJsonLd(youtubeId: string | null, accommodationTitle: string, description: string | null) {
  if (!youtubeId) return null;
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: `${accommodationTitle} — video`,
    description: description ?? `Video of ${accommodationTitle}, Maldives.`,
    embedUrl: `https://www.youtube.com/embed/${youtubeId}`,
    thumbnailUrl: [`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`],
  };
}
