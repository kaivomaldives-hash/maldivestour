import type { MediaAsset } from "@/lib/media/types";
import { asset } from "@/lib/packages/category-images";

/**
 * Task 21 follow-up: several packages anchored to the same accommodation
 * (e.g. three different packages all staying at Kaani Beach Hotel) were
 * all showing that accommodation's single hero image, making them look
 * like duplicates of each other on the packages directory. Every id below
 * is a genuine legacy photo of the SAME real accommodation/island
 * (confirmed against data/maldives/migration/full-legacy-image-library-manifest.json
 * before hardcoding — never a stock or unrelated image), just a different
 * shot than whichever one is already that accommodation's own hero via
 * supabase/migrations/20250116000200_accommodation_images.sql. Checked
 * here FIRST (before accommodationHeroImage/categoryFallbackImage) by both
 * realPackageToView() and resolveOneDemoPackage() so a real package and a
 * demo package can both override independently — no schema change needed,
 * since these are just literal MediaAsset objects the same way
 * category-images.ts already builds fallback images.
 */
export const PACKAGE_HERO_OVERRIDES: Record<string, MediaAsset> = {
  // Real packages
  "maldives-honeymoon-escape-soneva-fushi": asset(
    "5f6fb23a-f861-d616-eac7-c406870896f9",
    "legacy/resorts/soneva-fushi/images/soneva-fushi-kunfunadhoo-island-maldives-beach.webp",
    "Soneva Fushi, Kunfunadhoo Island, Baa Atoll",
  ),
  "maldives-diving-holiday-baros": asset(
    "a93f256b-062c-747f-e550-0c85c39e7ea2",
    "legacy/resorts/baros-island/images/baros-maldives-water-villa.webp",
    "Baros Maldives water villa",
  ),
  "5-night-maafushi-local-island-escape": asset(
    "2dffb5db-f8e4-5860-bf6e-4f8cd991f0c6",
    "legacy/hotels/kaanibeach-maafushi/images/kaani-beach-maafushi-seaview-room.webp",
    "Kaani Beach Hotel seaview room, Maafushi",
  ),
  "maldives-fishing-island-hopping-package": asset(
    "745db38b-4f24-91c9-d270-a28aa8da4d2c",
    "legacy/hotels/kaanibeach-maafushi/images/kaani-beach-maafushi-tripple-seaview-room.webp",
    "Kaani Beach Hotel seaview room, Maafushi",
  ),

  // Maldives Fishing and Holiday (MFH) packages — 14 real packages, all the
  // same product (a stay at Maldives Fishing and Holidays Lodge plus the
  // operator's own charter) at different night counts, so there's no
  // per-package location/subject to photograph uniquely. These are the
  // owner's own newly-uploaded fishing photos (assets/uploads/fishing/images/packages/,
  // confirmed via AskUserQuestion to be extra decorative photos for this one
  // real listing, not separate businesses despite the filenames) — see
  // scripts/attach-fishing-uploads.mjs, which registers each file's
  // media_assets row and printed this exact id/storagePath list. Not yet in
  // Storage until `upload-legacy-media.mjs --commit --only=fishing-uploads`
  // is run.
  "2-night-maldives-fishing-package-full-day-fishing": asset(
    "34d3a832-9c47-4608-4b21-3ab917b11418",
    "uploads/assets/uploads/fishing/images/packages/big-game-fishing-in-maldives.webp",
    "Big game fishing in the Maldives",
  ),
  "3-night-maldives-fishing-package-full-day-fishing": asset(
    "468db768-64ec-c26a-3fb0-1e39e4862f27",
    "uploads/assets/uploads/fishing/images/packages/bottom-meemu.webp",
    "Maldives fishing package",
  ),
  "4-night-maldives-fishing-package-full-day-fishing": asset(
    "5a298822-ac29-e70d-ab95-86e81ccc1977",
    "uploads/assets/uploads/fishing/images/packages/deep-laamu.webp",
    "Maldives fishing package",
  ),
  "5-night-maldives-fishing-package-full-day-fishing": asset(
    "d7cdb13d-0b83-4bca-fa8a-2ede82941941",
    "uploads/assets/uploads/fishing/images/packages/explorer-gaaf.webp",
    "Maldives fishing package",
  ),
  "6-night-maldives-fishing-package-full-day-fishing": asset(
    "6438802c-801f-b2aa-a77d-af0e3c1df112",
    "uploads/assets/uploads/fishing/images/packages/family-ari.webp",
    "Maldives fishing package",
  ),
  "7-night-maldives-fishing-package-full-day-fishing": asset(
    "824e6e0b-16f8-2420-1d18-964d52647acf",
    "uploads/assets/uploads/fishing/images/packages/fishing-tours-maldives.webp",
    "Maldives fishing tours",
  ),
  "8-night-maldives-fishing-package-full-day-fishing": asset(
    "a36d4a5b-78ec-d507-256b-4aa72ce70a05",
    "uploads/assets/uploads/fishing/images/packages/fly-addu.webp",
    "Maldives fishing package",
  ),
  "2-night-maldives-fishing-package-half-day-fishing": asset(
    "f8056c21-0415-bd3a-bb0e-eae40c5c0a7e",
    "uploads/assets/uploads/fishing/images/packages/grand-slam-ari.webp",
    "Maldives fishing package",
  ),
  "3-night-maldives-fishing-package-half-day-fishing": asset(
    "6b7a8751-b720-7f64-f773-6ecf5e25287c",
    "uploads/assets/uploads/fishing/images/packages/gt-safari-male.webp",
    "Maldives fishing package",
  ),
  "4-night-maldives-fishing-package-half-day-fishing": asset(
    "0d2a1fac-1296-34d1-de17-05f73ce2228b",
    "uploads/assets/uploads/fishing/images/packages/jigging-lhaviyani.webp",
    "Maldives fishing package",
  ),
  "5-night-maldives-fishing-package-half-day-fishing": asset(
    "35f87a59-f0dc-f8d5-cf1f-dd2eeeee2203",
    "uploads/assets/uploads/fishing/images/packages/luxury-dhaalu.webp",
    "Maldives fishing package",
  ),
  "6-night-maldives-fishing-package-half-day-fishing": asset(
    "870b3478-e43e-f532-e4b3-63a7001ca306",
    "uploads/assets/uploads/fishing/images/packages/mahi-mahi-fish.webp",
    "Mahi-mahi caught fishing in the Maldives",
  ),
  "7-night-maldives-fishing-package-half-day-fishing": asset(
    "7d531cad-b82a-e7e1-ecce-a68073a0959c",
    "uploads/assets/uploads/fishing/images/packages/maldives-fishing.webp",
    "Maldives fishing package",
  ),

  // Fly Fishing Holiday packages — the site owner's own dedicated fly
  // fishing photos, uploaded directly for this feature (assets/uploads/
  // fishing/images/gallery/maldives-fly-fishing*.jpeg). The two packages
  // get different photos from each other so they don't look identical in
  // the packages grid; the "-packages" one is the more fitting of the two
  // for a package listing specifically.
  "3-night-maldives-fly-fishing-holiday": asset(
    "0f934170-314e-c46a-d2e4-7899963d850f",
    "uploads/assets/uploads/fishing/images/gallery/maldives-fly-fishing-packages.jpeg",
    "Maldives fly fishing package",
  ),
  "5-night-maldives-fly-fishing-holiday": asset(
    "df242384-66bf-6063-1664-5c69a9e14f73",
    "uploads/assets/uploads/fishing/images/gallery/maldives-fly-fishing.jpeg",
    "Maldives fly fishing",
  ),
  "8-night-maldives-fishing-package-half-day-fishing": asset(
    "75c3a404-3596-d027-80ae-bff1528c8b8e",
    "uploads/assets/uploads/fishing/images/packages/marlin-ari.webp",
    "Marlin fishing in the Maldives",
  ),

  // GoTripMaldives / Yuvi Blue holiday packages — 16 real packages (Diving,
  // Surfing, Honeymoon, Family themes x 2/4/5/6 nights) at Yuvi Blue
  // Maldives, Himmafushi, sourced from the owner's "Gotripmaldives Customer
  // Holiday Rates.pdf". Each gets its own distinct real photo (never the
  // same image across two cards) via scripts/attach-gotrip-uploads.mjs,
  // which printed this exact id/storagePath list. Not yet in Storage until
  // `upload-legacy-media.mjs --commit --only=gotrip-uploads` is run.
  "himmafushi-diving-holiday-2-nights": asset(
    "e015510f-f0c7-ab66-fe70-ed4d8178cbed",
    "uploads/assets/uploads/gotrip/packages/diving-2n-faru-reef.webp",
    "Diving in the Maldives",
  ),
  "himmafushi-diving-holiday-4-nights": asset(
    "9d6b3ce8-ed4c-0b13-44e0-ab3d912b3b3b",
    "uploads/assets/uploads/gotrip/packages/diving-4n-maldives-diving.webp",
    "Diving in the Maldives",
  ),
  "himmafushi-diving-holiday-5-nights": asset(
    "483fb4cd-e867-5401-8ad1-65dbb5afb055",
    "uploads/assets/uploads/gotrip/packages/diving-5n-maldives-snorkeling.jpeg",
    "Snorkeling in the Maldives",
  ),
  "himmafushi-diving-holiday-6-nights": asset(
    "7775c0f2-5b0d-7891-3389-2a3d7fe49033",
    "uploads/assets/uploads/gotrip/packages/diving-6n-turtle-snorkeling.jpeg",
    "Turtle snorkeling in the Maldives",
  ),
  "himmafushi-surfing-holiday-2-nights": asset(
    "f5750f17-4f03-234f-f9c6-e58a1980b02b",
    "uploads/assets/uploads/gotrip/packages/surfing-2n-sandbank-excursion.webp",
    "Sandbank excursion, Male Atoll",
  ),
  "himmafushi-surfing-holiday-4-nights": asset(
    "0fe5c3cc-e050-296a-09e2-194d66a00004",
    "uploads/assets/uploads/gotrip/packages/surfing-4n-sand-bank-trip.webp",
    "Sandbank trip, Male Atoll",
  ),
  "himmafushi-surfing-holiday-5-nights": asset(
    "1540c3c9-f6e0-f8bb-2787-6cbb92026026",
    "uploads/assets/uploads/gotrip/packages/surfing-5n-sandbank-maldives.webp",
    "Sandbank in the Maldives",
  ),
  "himmafushi-surfing-holiday-6-nights": asset(
    "1a0b9fce-a570-aa7f-f15d-91d1b6ba6a21",
    "uploads/assets/uploads/gotrip/packages/surfing-6n-himmafushi-beach.jpeg",
    "Himmafushi beach, Kaafu Atoll",
  ),
  "himmafushi-honeymoon-2-nights": asset(
    "06dd0cb4-6adf-5009-6ffd-3dbd350985bc",
    "uploads/assets/uploads/gotrip/packages/honeymoon-2n-himmafushi.jpeg",
    "Himmafushi, Kaafu Atoll",
  ),
  "himmafushi-honeymoon-4-nights": asset(
    "f82022bf-9899-1aad-2d63-b560eb933eee",
    "uploads/assets/uploads/gotrip/packages/honeymoon-4n-himmafushi.jpeg",
    "Himmafushi, Kaafu Atoll",
  ),
  "himmafushi-honeymoon-5-nights": asset(
    "69cd62de-7f04-69ec-568a-c1b3505053c8",
    "uploads/assets/uploads/gotrip/packages/honeymoon-5n-himmafushi.jpeg",
    "Himmafushi, Kaafu Atoll",
  ),
  "himmafushi-honeymoon-6-nights": asset(
    "3d99d1a9-aab6-09f0-bef4-8b33d3243649",
    "uploads/assets/uploads/gotrip/packages/honeymoon-6n-himmafushi.jpeg",
    "Himmafushi, Kaafu Atoll",
  ),
  "himmafushi-family-holiday-2-nights": asset(
    "fe68c080-2a8f-4fc2-c418-79bc174c99cd",
    "uploads/assets/uploads/gotrip/packages/family-2n-island-beach.jpeg",
    "Island beach, Maldives",
  ),
  "himmafushi-family-holiday-4-nights": asset(
    "9c374528-1c52-2923-0d98-6cf14175785a",
    "uploads/assets/uploads/gotrip/packages/family-4n-water-sports.jpeg",
    "Local island water sports, Maldives",
  ),
  "himmafushi-family-holiday-5-nights": asset(
    "c9639b9b-f401-a49b-3b0e-3db16bddaae0",
    "uploads/assets/uploads/gotrip/packages/family-5n-island-tour.jpeg",
    "Local island tour, Maldives",
  ),
  "himmafushi-family-holiday-6-nights": asset(
    "e5ec4fc4-0e5f-7d9f-0ed0-3f72247ab66f",
    "uploads/assets/uploads/gotrip/packages/family-6n-island-visit.jpeg",
    "Island visit, Maldives",
  ),

  // Demo packages
  "maafushi-local-island-getaway": asset(
    "9bbead44-417f-23d5-a02d-e7741f6d21ac",
    "legacy/hotels/kaanibeach-maafushi/images/kaani-beach-maafushi.webp",
    "Kaani Beach Hotel, Maafushi",
  ),
  "maldives-luxury-overwater-escape": asset(
    "8db576eb-f813-2b4c-148a-77c0b50c6c56",
    "legacy/resorts/soneva-fushi/images/soneva-fushi-kunfunadhoo-island-maldives-pool.webp",
    "Soneva Fushi pool",
  ),
  "extended-soneva-fushi-wellness-retreat": asset(
    "b7450abb-1b63-19bb-d765-cfcd33ae1892",
    "legacy/resorts/soneva-fushi/images/soneva-fushi-maldives-one-bedroom-water-retreat.webp",
    "Soneva Fushi one-bedroom water retreat",
  ),
  "tropical-maldives-honeymoon-baros": asset(
    "1907c26d-f2cb-85fa-2760-21dcfe4c0fa0",
    "legacy/resorts/baros-island/images/baros-maldives-island-resort-beach-dinner.webp",
    "Beach dinner at Baros Maldives",
  ),
  "maldives-solo-island-explorer-ukulhas": asset(
    "df1a234a-f8a1-743d-7069-cc0750519361",
    "legacy/images/maldives/ukulhas-island-maldives.webp",
    "Ukulhas island, Alif Alif Atoll",
  ),
  "maldives-long-stay-island-escape-gulhi": asset(
    "1ab187bc-c135-c88d-1d2c-c81f43b6ba4b",
    "legacy/images/surfing/budget-surfing-island-gulhi.webp",
    "Gulhi island, Kaafu Atoll",
  ),
  "maldives-diving-discovery-rasdhoo": asset(
    "3a9f3165-2a04-9145-5c5d-4d086b6f9075",
    "legacy/images/diving/rasdhoo-channel-maldives.webp",
    "Rasdhoo Channel dive site",
  ),
  "maldives-fishing-adventure-maafushi": asset(
    "7261cdbc-1f54-7562-bcdc-8c7f71bf3aec",
    "legacy/hotels/arena-maafushi/images/arean-beach-maafushi-seaview-room.webp",
    "Arena Beach Hotel seaview room, Maafushi",
  ),
  "marlin-big-game-fishing-escape-hulhumale": asset(
    "7a68684e-2128-4b86-5845-e072f899596d",
    "legacy/images/fishing/merlin-fish-in-maldives.webp",
    "Marlin fishing in the Maldives",
  ),
  "maldives-surf-island-escape-thulusdhoo": asset(
    "64ac712a-db77-b067-a90e-664397d49268",
    "legacy/images/maldives/thulusdhoo-island-maldives.webp",
    "Thulusdhoo island",
  ),
  "thulusdhoo-surf-camp": asset(
    "7fcad8f7-8be7-45d0-2822-8da88cec6250",
    "legacy/images/surfing/budget-surfing-island-thulusdho.webp",
    "Surfing at Thulusdhoo",
  ),
  "extended-kurumba-resort-stay": asset(
    "73252dff-79bd-ecd9-01e1-9bb3d6b05ff9",
    "legacy/resorts/kurumba/images/kurumba-maldives-island-resort-water-sports.webp",
    "Kurumba Maldives water sports",
  ),
  "maldives-local-island-hopping-adventure": asset(
    "1169d556-fa59-fd56-3eb2-660d07d28e40",
    "legacy/images/activities/island-hopping/island-hopping-tour.webp",
    "Local island hopping tour",
  ),
};

/**
 * A handful of extra genuine photos per accommodation, beyond its single
 * `node_media` hero row, used only to populate a package's Gallery section
 * (Task 21 follow-up). Not a general-purpose accommodation gallery feature
 * — just enough real material (confirmed against the same manifest) for
 * the package detail page to show more than one photo without inventing
 * anything. Accommodations not listed here simply show fewer gallery
 * images (hero + override only), same "stay honestly imageless rather
 * than fabricate" rule as everywhere else in this pipeline.
 */
export const ACCOMMODATION_GALLERY_IMAGES: Record<string, MediaAsset[]> = {
  "kurumba-maldives": [
    asset("bcf519da-ea47-d987-b5fd-320ececb6416", "legacy/resorts/kurumba/images/kurumba-maldives-island-resort-beach.webp", "Kurumba Maldives beach"),
    asset("57740a06-9540-9d5c-4938-f6434dae361e", "legacy/resorts/kurumba/images/kurumba-maldives-island-resort-deluxe-pool-villa.webp", "Kurumba Maldives deluxe pool villa"),
    asset("7dc7ba14-7389-19de-438e-3d29ce825230", "legacy/resorts/kurumba/images/kurumba-maldives-island-resort-dinning.webp", "Kurumba Maldives dining"),
  ],
  "soneva-fushi": [
    asset("632803b4-f32a-fc61-47ba-d389c3f1bbe7", "legacy/resorts/soneva-fushi/images/soneva-fushi-kunfunadhoo-island-maldives-activities.webp", "Soneva Fushi activities"),
    asset("6c7a21e8-2802-edea-c196-c2730560add3", "legacy/resorts/soneva-fushi/images/soneva-fushi-kunfunadhoo-island-maldives-resort.webp", "Soneva Fushi resort"),
    asset("7ea5dfca-f7ec-1bc4-c32b-18515b96e2fa", "legacy/resorts/soneva-fushi/images/soneva-fushi-kunfunadhoo-island-maldives-spa.webp", "Soneva Fushi spa"),
  ],
  "baros-maldives": [
    asset("a2f447e8-a22b-04ad-6025-a7d2a8e296ba", "legacy/resorts/baros-island/images/baros-island-resort-maldives.webp", "Baros Island Resort"),
    asset("4359e47b-9e3e-8807-1a61-e32049d32a69", "legacy/resorts/baros-island/images/baros-maldives-deluxe-villa.webp", "Baros Maldives deluxe villa"),
    asset("ea357590-893c-721b-cf78-f24fa707b820", "legacy/resorts/baros-island/images/baros-maldives-island-resort-beach.webp", "Baros Maldives beach"),
  ],
  "velassaru-maldives": [
    asset("c221e6c2-1784-a30c-deb7-285a3f4dfe70", "legacy/resorts/velassaru/images/velassaru-maldives-beach.webp", "Velassaru Maldives beach"),
    asset("5f80d49a-0bba-a31e-5229-7f660831844b", "legacy/resorts/velassaru/images/velassaru-maldives-deluxe-villa.webp", "Velassaru Maldives deluxe villa"),
    asset("30df640b-92ae-f553-e844-1b97bcba2547", "legacy/resorts/velassaru/images/velassaru-maldives-beach-villa-pool1.webp", "Velassaru Maldives beach villa pool"),
  ],
  "gili-lankanfushi": [
    asset("4304563f-d2ef-f760-1292-9bed538a3f95", "legacy/resorts/gili-lankanfushi/images/gili-lankanfushi-maldives-beach.webp", "Gili Lankanfushi beach"),
    asset("5c1754f5-99f1-534b-d679-108b703ae900", "legacy/resorts/gili-lankanfushi/images/gili-lankanfushi-maldives-beach-breakfast.webp", "Gili Lankanfushi beach breakfast"),
    asset("5855b9d8-4a35-ed83-2b32-462d79a1ecd3", "legacy/resorts/gili-lankanfushi/images/gili-lankanfushi-maldives-dinner.webp", "Gili Lankanfushi dinner"),
  ],
  "six-senses-laamu": [
    asset("9d6a7b3d-a111-add5-1d55-52c88556bf80", "legacy/resorts/six-senses-laamu/images/six-senses-laamu-maldives-dinning.webp", "Six Senses Laamu dining"),
    asset("42c37644-f67a-65c3-e39c-420c7b25ba29", "legacy/resorts/six-senses-laamu/images/six-senses-laamu-maldives-diving.webp", "Six Senses Laamu diving"),
    asset("09039b1c-8c82-8d3e-957b-405d9d1576bc", "legacy/resorts/six-senses-laamu/images/six-senses-laamu-maldives-excursions.webp", "Six Senses Laamu excursions"),
  ],
  "arena-beach-hotel": [
    asset("17e55473-8b04-2c8b-1ad2-8fd99df3791c", "legacy/hotels/arena-maafushi/images/arean-beach-hotel-maldives.webp", "Arena Beach Hotel, Maafushi"),
    asset("73bdd20e-bb4e-ac5f-46e5-574c83dcae71", "legacy/hotels/arena-maafushi/images/arean-beach-maafushi-hotel-maldives.webp", "Arena Beach Hotel, Maafushi"),
    asset("e3128603-5cff-038a-c26a-6b07dfd3d9fe", "legacy/hotels/arena-maafushi/images/arean-beach-maafushi-island-hotel.webp", "Arena Beach Hotel, Maafushi"),
  ],
  "maldives-fishing-and-holidays-lodge": [
    // Real photos of the actual lodge (scripts/attach-gotrip-uploads.mjs) —
    // preferred over the generic fishing stock photos below, which were
    // never actually uploaded to Storage.
    asset("4d986db8-7f38-4e59-c35f-94510e3c0e7e", "uploads/assets/uploads/gotrip/lodge/mfh-lodge-exterior.jpeg", "Maldives Fishing and Holidays Lodge, Maamendhoo"),
    asset("74bb4580-2f9d-7cbc-5714-e0097953bca3", "uploads/assets/uploads/gotrip/lodge/mfh-lodge-guest-house.jpeg", "Maldives Fishing and Holidays Lodge, Maamendhoo"),
    asset("78a6c490-6263-2e47-c74b-59f312afd4e9", "uploads/assets/uploads/gotrip/lodge/mfh-lodge-hotel.jpeg", "Maldives Fishing and Holidays Lodge, Maamendhoo"),
    asset("bb2efb47-152b-60e9-2443-dacc2bd61f65", "uploads/assets/uploads/fishing/images/packages/sunset-raa.webp", "Sunset fishing in the Maldives"),
    asset("fdcb6dcb-87a4-1f21-4095-4e9ffc1be220", "uploads/assets/uploads/fishing/images/packages/trolling-fishing.webp", "Trolling fishing in the Maldives"),
    asset("4ff44b0e-81a3-a18f-cf0f-d781fccc47e6", "uploads/assets/uploads/fishing/images/packages/yellowfin-tuna.webp", "Yellowfin tuna caught fishing in the Maldives"),
  ],
  "kaani-beach-hotel": [
    asset("f747bc41-b4ca-66a0-e1a6-804d2332a410", "legacy/hotels/kaanibeach-maafushi/images/kaani-beach-hotel-maafushi-island-maldives.webp", "Kaani Beach Hotel, Maafushi"),
    asset("d19a0ea9-d00a-3e74-6ca0-cff793306732", "legacy/hotels/kaanibeach-maafushi/images/kaani-beach-maafushi-hotel-maldives.webp", "Kaani Beach Hotel, Maafushi"),
    asset("a90df2c7-481e-7f55-18e7-bc4a0748b911", "legacy/hotels/kaanibeach-maafushi/images/kaani-beach-maafushi-island-hotel-maldives.webp", "Kaani Beach Hotel, Maafushi"),
  ],
};
