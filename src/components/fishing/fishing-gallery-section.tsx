import { MediaImage } from "@/components/ui/media-image";
import { asset } from "@/lib/packages/category-images";

/**
 * The owner's own newly-uploaded fishing gallery photos
 * (assets/uploads/fishing/images/gallery/) — real photos of the charter
 * boat, catches, and the Maldives atolls, registered by
 * scripts/attach-fishing-uploads.mjs. Not tied to any single node, so kept
 * as a plain hardcoded list here (same pattern as fishing-video.tsx).
 */
const GALLERY_IMAGES = [
  asset("8c2e8baf-376e-b0b6-a222-a8450b073a09", "uploads/assets/uploads/fishing/images/gallery/maldives-atoll-aerial-view.webp", "Maldives atoll aerial view"),
  asset("cd447d34-97f4-718f-3b87-779345d99c1f", "uploads/assets/uploads/fishing/images/gallery/fishing-liveaboard-maldives.webp", "Fishing liveaboard in the Maldives"),
  asset("c1e3ca08-0e43-1f98-3061-c6d9951c6834", "uploads/assets/uploads/fishing/images/gallery/giant-trevally.webp", "Giant trevally caught fishing in the Maldives"),
  asset("a1f586e2-ef91-87af-5d6f-c1b39315a7d7", "uploads/assets/uploads/fishing/images/gallery/reef-fishing-grouper.webp", "Reef fishing grouper in the Maldives"),
  asset("d647a2a4-2099-8667-168f-88c292b6de0d", "uploads/assets/uploads/fishing/images/gallery/sailfish-maldives.webp", "Sailfish caught fishing in the Maldives"),
  asset("a8ba6833-886f-504b-136f-7cb31111c497", "uploads/assets/uploads/fishing/images/gallery/yellowfin-tuna-fishing-maldives.webp", "Yellowfin tuna caught fishing in the Maldives"),
  asset("dbd93db3-e064-94a9-5883-96ea6c3aebf1", "uploads/assets/uploads/fishing/images/gallery/blue-marlin.avif", "Blue marlin caught fishing in the Maldives"),
];

export function FishingGallerySection() {
  return (
    <section id="fishing-gallery" className="mt-12 scroll-mt-20 border-t border-neutral-200 pt-10">
      <h2 className="text-xl font-semibold text-ocean-900">Fishing Gallery</h2>
      <p className="mt-2 text-sm text-neutral-700">Real photos from Maldives fishing charters and catches — the boat, the crew, and what comes up on the line.</p>
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {GALLERY_IMAGES.map((image) => (
          <li key={image.id} className="overflow-hidden rounded-xl">
            <MediaImage asset={image} alt={image.altText ?? "Maldives fishing"} aspectClassName="aspect-square" />
          </li>
        ))}
      </ul>
    </section>
  );
}
