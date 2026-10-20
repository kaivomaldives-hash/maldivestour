import { LocationGallerySection } from "@/components/locations/location-gallery-section";
import { NodeCommentsSection } from "@/components/nodes/node-comments-section";
import type { GalleryVideo } from "@/components/ui/video-gallery-section";
import { VideoGallerySection } from "@/components/ui/video-gallery-section";
import { getMediaForNodes } from "@/lib/media/repository";
import { getPublishedNodeComments } from "@/lib/nodes/comments/repository";

/**
 * Shared "media + video + comments" bolt-on for any category/hub page
 * that isn't itself a single photographed node — the activity-category
 * SEO pages, the fishing technique pages, and the package-style pages all
 * use this one implementation rather than three near-duplicates.
 *
 * - Gallery: real photos pulled from `galleryNodeIds` (the real listings
 *   tagged into this hub) via getMediaForNodes() — never a stock
 *   substitute; an empty result renders nothing.
 * - Videos: the caller's own already-curated, real (non-fabricated)
 *   YouTube ids — same VIDEOS arrays this site already uses on Activities/
 *   Diving/Fishing. Omitted entirely when the caller has nothing
 *   genuinely on-topic rather than reusing an unrelated clip.
 * - Comments: a real guest-comment thread on the hub page's own node
 *   (node_comments — see 20261108000100), independent of any individual
 *   listing's own reviews.
 */
export async function HubPageExtras({
  nodeId,
  galleryNodeIds,
  galleryTitle,
  videos,
  videoTitle,
  videoDescription,
}: {
  nodeId: string;
  galleryNodeIds: string[];
  galleryTitle: string;
  videos?: ReadonlyArray<GalleryVideo>;
  videoTitle?: string;
  videoDescription?: string;
}) {
  const [gallery, comments] = await Promise.all([
    getMediaForNodes(galleryNodeIds, 12),
    getPublishedNodeComments(nodeId),
  ]);

  return (
    <>
      <LocationGallerySection title={galleryTitle} images={gallery} />
      {videos && videos.length > 0 && (
        <VideoGallerySection title={videoTitle ?? `${galleryTitle} — Videos`} description={videoDescription ?? "Real footage, not stock."} videos={videos} />
      )}
      <NodeCommentsSection nodeId={nodeId} comments={comments} />
    </>
  );
}
