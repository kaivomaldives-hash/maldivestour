import { extractYoutubeId } from "@/lib/youtube";

export function VideoSection({ youtubeId, accommodationTitle }: { youtubeId: string | null; accommodationTitle: string }) {
  const id = youtubeId ? extractYoutubeId(youtubeId) : null;
  if (!id) return null;

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold text-ocean-900">Video</h2>
      <div className="mt-4 aspect-video w-full overflow-hidden rounded-2xl bg-neutral-100">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${id}`}
          title={`${accommodationTitle} — video`}
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </section>
  );
}
