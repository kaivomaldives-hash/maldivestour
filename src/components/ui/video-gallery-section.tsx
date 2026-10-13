export interface GalleryVideo {
  id: string;
  title: string;
}

/**
 * The multi-video YouTube gallery grid — identical markup in
 * ActivitiesVideo and DivingVideo, differing only in which real videos
 * they embed. Each caller keeps its own VIDEOS array (and xJsonLd()
 * export) and only hands this the {id, title} pairs it needs to render.
 */
export function VideoGallerySection({
  title,
  description,
  videos,
}: {
  title: string;
  description: string;
  videos: ReadonlyArray<GalleryVideo>;
}) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold text-ocean-900">{title}</h2>
      <p className="mt-2 text-sm text-neutral-700">{description}</p>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {videos.map((video) => (
          <div key={video.id}>
            <div className="aspect-video w-full overflow-hidden rounded-2xl bg-neutral-100">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${video.id}`}
                title={video.title}
                loading="lazy"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            <p className="mt-2 text-sm font-medium text-ocean-900">{video.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
