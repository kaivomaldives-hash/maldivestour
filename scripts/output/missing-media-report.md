# Missing media files

Image assets whose file doesn't exist in the public `media` Storage bucket (raw list:
`missing-media-assets.json`, written by `scripts/optimize-media-variants.mjs`).

- 47 asset rows point at a missing file; **0** are attached to a published page.
- The 98 transfer-route gallery images and the Tsunami Monument hero that used to be listed here were fixed by
  `20261115001450_fix_missing_transfer_and_attraction_images.sql` (repointed to the real photos in each transfer folder).
- The manta ray species card image (hardcoded in `src/lib/fishing/fish-species.ts`) was also missing; it now uses the owner's photo from `assets/uploads/diving/`.
- `legacy/resorts/bookingphp/img/background.jpg` exists but is a corrupt JPEG that couldn't be re-encoded; it still serves as before.

