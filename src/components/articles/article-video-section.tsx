import { extractYoutubeId } from "@/lib/youtube";

/** Same embed shape as activity/activity-video-section.tsx — kept as its
 * own copy for the same reason (separate vertical, three lines of
 * markup). Rendered right after the hero, before the body, per the
 * standard "video near the top" placement used elsewhere on the site. */
export function ArticleVideoSection({ youtubeId, articleTitle }: { youtubeId: string | null; articleTitle: string }) {
  const id = youtubeId ? extractYoutubeId(youtubeId) : null;
  if (!id) return null;

  return (
    <div className="aspect-video w-full overflow-hidden rounded-2xl bg-neutral-100">
      <iframe
        className="h-full w-full"
        src={`https://www.youtube.com/embed/${id}`}
        title={`${articleTitle} — video`}
        loading="lazy"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}
