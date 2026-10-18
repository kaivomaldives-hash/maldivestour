import { extractYoutubeId } from "@/lib/youtube";

/** Same embed shape as accommodation/video-section.tsx — kept as its own
 * copy (not a shared import) since the two live in sibling-but-separate
 * verticals and the embed itself is three lines of markup, not worth a
 * cross-vertical dependency for. */
export function ActivityVideoSection({ youtubeId, activityTitle }: { youtubeId: string | null; activityTitle: string }) {
  const id = youtubeId ? extractYoutubeId(youtubeId) : null;
  if (!id) return null;

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold text-ocean-900">Video</h2>
      <div className="mt-4 aspect-video w-full overflow-hidden rounded-2xl bg-neutral-100">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${id}`}
          title={`${activityTitle} — video`}
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </section>
  );
}
