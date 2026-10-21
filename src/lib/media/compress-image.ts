import "server-only";

import sharp from "sharp";

/**
 * Resizes/recompresses an uploaded image before it ever reaches the
 * public `media` Storage bucket — a one-time, zero-ongoing-cost
 * alternative to Vercel's per-request Image Optimization (which the
 * MediaImage component deliberately bypasses with `unoptimized`, to
 * avoid that metered cost — see its own comment and git history around
 * commit 3f7c058/4218a21). PageSpeed Insights' "Improve image delivery"
 * finding was ~1.1MB of savings from full-resolution originals (e.g. a
 * 1152x720 JPEG) being shipped for a card that only ever displays at
 * ~400px — this fixes that at the source instead, for every future
 * upload.
 *
 * Always re-encodes to WebP regardless of the source format: broad
 * browser support, meaningfully smaller than JPEG/PNG at the same visual
 * quality, and it's already this site's own dominant format for
 * hand-optimized photos (see the many *.webp paths throughout the seed
 * migrations). Caps the longest edge at MAX_DIMENSION — generous enough
 * for a full-bleed hero on a large desktop display, well beyond anything
 * a card/gallery thumbnail needs — rather than a fixed small size, since
 * this one file is reused across every size context (card, gallery,
 * hero) with no responsive variants.
 */

const MAX_DIMENSION = 2000;
const WEBP_QUALITY = 82;

export interface CompressedImage {
  buffer: Buffer;
  contentType: "image/webp";
  ext: "webp";
}

export async function compressImage(input: ArrayBuffer | Buffer): Promise<CompressedImage> {
  const buffer = Buffer.isBuffer(input) ? input : Buffer.from(input);
  const output = await sharp(buffer)
    // rotate() with no args reads the EXIF orientation tag and applies
    // it, then sharp strips metadata (including that same EXIF block) by
    // default on output — without this, a portrait phone photo often
    // ends up sideways once EXIF is gone.
    .rotate()
    .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: "inside", withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();

  return { buffer: output, contentType: "image/webp", ext: "webp" };
}
