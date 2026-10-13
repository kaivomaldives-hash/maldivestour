/** Real videos recovered from the legacy site (release/public_html), never
 * an invented id — same pattern as src/components/diving/diving-video.tsx,
 * extended to a small gallery covering the range of things to do the
 * Activities page itself lists. */
import { VideoGallerySection } from "@/components/ui/video-gallery-section";
import { VIDEOS } from "@/components/activity/activities-video-jsonld";

export function ActivitiesVideo() {
  return (
    <VideoGallerySection
      title="Maldives Activities — Videos"
      description="Real footage of some of the most popular things to do in the Maldives."
      videos={VIDEOS}
    />
  );
}
