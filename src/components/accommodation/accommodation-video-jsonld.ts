import { extractYoutubeId } from "@/lib/youtube";

/**
 * `publishedAt` is nodes.published_at — the real date this property went
 * live on the site. Used as the video's uploadDate since the actual
 * YouTube upload date isn't available without a Data API key, and Google's
 * structured data validator requires a full ISO 8601 datetime with a
 * timezone designator either way (nodes.published_at already comes back
 * from PostgREST in that form).
 */
export function accommodationVideoJsonLd(youtubeId: string | null, accommodationTitle: string, description: string | null, publishedAt: string | null) {
  const id = youtubeId ? extractYoutubeId(youtubeId) : null;
  if (!id || !publishedAt) return null;
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: `${accommodationTitle} — video`,
    description: description ?? `Video of ${accommodationTitle}, Maldives.`,
    embedUrl: `https://www.youtube.com/embed/${id}`,
    thumbnailUrl: [`https://i.ytimg.com/vi/${id}/hqdefault.jpg`],
    uploadDate: publishedAt,
  };
}
