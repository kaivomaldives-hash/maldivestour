import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import sharp from "sharp";

import { IMAGE_VARIANT_WIDTHS, imageVariantPath, OPTIMIZED_MEDIA_PREFIX } from "@/lib/media/types";

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

// 1600 covers a full-bleed hero on a typical desktop display; anything
// smaller is served from the pre-resized variants (IMAGE_VARIANT_WIDTHS).
const MAX_DIMENSION = 1600;
const WEBP_QUALITY = 80;

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

/**
 * compressImage plus one narrower copy per IMAGE_VARIANT_WIDTHS entry,
 * uploaded together under OPTIMIZED_MEDIA_PREFIX -- so the returned
 * storagePath satisfies the variant guarantee src/lib/media/image-loader.ts
 * relies on. Narrow sources still get every variant (at their own size)
 * so a variant URL can never 404. `paths` lists every uploaded object,
 * for a caller that has to clean up after a later failure. 1-year
 * cacheControl: the path is timestamp/random-suffixed and never reused,
 * so its bytes never change (Search Console flagged the SDK's 1-hour
 * default as a sitewide "inefficient cache lifetime" cost).
 */
export async function uploadOptimizedImage(
  supabase: { storage: SupabaseClient["storage"] },
  folder: string,
  input: ArrayBuffer | Buffer,
): Promise<{ storagePath: string; paths: string[]; error?: undefined } | { error: string }> {
  const full = await compressImage(input);
  const variants = await Promise.all(
    IMAGE_VARIANT_WIDTHS.map(async (width) => ({
      width,
      buffer: await sharp(full.buffer).resize({ width, withoutEnlargement: true }).webp({ quality: WEBP_QUALITY }).toBuffer(),
    })),
  );

  const storagePath = `${OPTIMIZED_MEDIA_PREFIX}${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
  const files = [{ path: storagePath, buffer: full.buffer }, ...variants.map((v) => ({ path: imageVariantPath(storagePath, v.width), buffer: v.buffer }))];
  const paths = files.map((f) => f.path);

  const results = await Promise.all(
    files.map((f) => supabase.storage.from("media").upload(f.path, f.buffer, { contentType: "image/webp", upsert: false, cacheControl: "31536000" })),
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) {
    await supabase.storage.from("media").remove(paths);
    return { error: failed.error.message };
  }
  return { storagePath, paths };
}
