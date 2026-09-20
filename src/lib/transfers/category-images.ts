import type { MediaAsset } from "@/lib/media/types";

/**
 * Fixed hero images for the transfer hub/category pages, none of which
 * are node-backed (so node_media doesn't apply). Every id here is a real
 * media_assets row inserted by
 * supabase/migrations/20250114000300_transfer_category_hero_images.sql,
 * pointing at a real, purpose-named legacy image (e.g.
 * "maldives-airport-transfers.webp") found in release/public_html/images/
 * transfers/ — never an invented filename.
 */

function asset(id: string, storagePath: string, altText: string): MediaAsset {
  return { id, mediaType: "image", storagePath, youtubeId: null, altText, credit: null, width: null, height: null };
}

export const TRANSFER_CATEGORY_IMAGES = {
  mainHub: asset("5f7b2509-92c8-fbfb-83a9-2bf74649ab4f", "legacy/images/transfers/maldives-transfers.webp", "Maldives transfers"),
  airportTransfers: asset("ceacc1c5-71e5-0d8c-dc4f-29d06f0153da", "legacy/images/transfers/maldives-airport-transfers.webp", "Maldives airport transfers"),
  resortTransfers: asset("cdd2e7cc-2917-c029-24b3-9853e7dba7e8", "legacy/images/transfers/maldives-resort-transfers.webp", "Maldives resort transfers"),
  islandTransfers: asset("3a77847b-1b23-e2a1-d7cc-8a2481214f0a", "legacy/images/transfers/maldives-island-transfers.webp", "Maldives island transfers"),
  hotelTransfers: asset("88336ddc-f145-5d47-0d0d-a95b31a0b925", "legacy/images/transfers/maldives-hotel-transfers.webp", "Maldives hotel transfers"),
  speedboatTransfers: asset("d2d092f3-fa1d-99cd-ee64-bef3c62f556a", "legacy/images/transfers/maldives-speedboat-transfers.webp", "Maldives speedboat transfers"),
  speedboatCharterHub: asset("99737dda-3e6d-c1d0-7061-0d5b0e75a0d1", "legacy/images/transfers/private-speedboat-charter-maldives.webp", "Private speedboat charter in the Maldives"),
  ferryScheduleHub: asset("c77f4ccd-fd8e-5749-a8ea-7c45b0bad74a", "legacy/images/transfers/maldives-transportation.webp", "Maldives public transportation"),
  seaplaneComingSoon: asset("9c4c56d1-9fe2-230e-99ed-b40cca564218", "legacy/images/transfers/maldives-seaplane-transfers.webp", "Maldives seaplane transfers"),
  domesticFlightComingSoon: asset("c84af170-4290-5719-145a-f317e30b11d4", "legacy/images/transfers/maldives-domestic-flight.webp", "Maldives domestic flight transfers"),
} as const;
