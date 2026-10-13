/** Real videos recovered from the legacy site
 * (release/public_html/scuba-diving-in-maldives.html), embedded properly —
 * never an invented id. Same pattern as
 * src/components/transfers/route-video.tsx, extended to a small gallery
 * since the legacy page itself hosted several distinct diving videos. */
import { VideoGallerySection } from "@/components/ui/video-gallery-section";
import { VIDEOS } from "@/components/diving/diving-video-jsonld";

export function DivingVideo() {
  return (
    <VideoGallerySection
      title="Diving in the Maldives — Videos"
      description="Real footage of Maldives dive sites, dive trips and liveaboard vessels."
      videos={VIDEOS}
    />
  );
}
