import { MediaImage } from "@/components/ui/media-image";
import type { MediaAsset } from "@/lib/media/types";

/** Same shape as accommodation/gallery-section.tsx — kept as its own copy
 * for the same reason noted elsewhere in this codebase (separate
 * vertical, a few lines of markup). Rendered above RouteVideo on the
 * route detail page, not below it like the accommodation page's
 * video-then-gallery order — these are real per-route photos, more
 * relevant than the shared generic explainer video. */
export function RouteGallerySection({ images, routeTitle }: { images: MediaAsset[]; routeTitle: string }) {
  if (images.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold text-ocean-900">Gallery</h2>
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((image, i) => (
          <li key={image.id} className="relative aspect-[4/3] overflow-hidden rounded-xl">
            <MediaImage asset={image} alt={`${routeTitle} — photo ${i + 1}`} fillParent />
          </li>
        ))}
      </ul>
    </section>
  );
}
