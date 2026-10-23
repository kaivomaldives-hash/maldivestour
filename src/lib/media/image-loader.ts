import { IMAGE_VARIANT_WIDTHS, imageVariantPath } from "@/lib/media/types";

const OPTIMIZED_URL_SEGMENT = "/storage/v1/object/public/media/opt/";

/**
 * next/image custom loader (next.config.ts `images.loaderFile`). Maps each
 * srcset width Next asks for onto the smallest pre-built variant at least
 * that wide -- or the full-size file past the largest variant -- for
 * optimized Storage images (see OPTIMIZED_MEDIA_PREFIX). Anything else is
 * returned unchanged; MediaImage only lets optimized paths reach this
 * loader (the rest render `unoptimized`), so a non-variant URL here is
 * just a safe passthrough.
 */
export default function mediaImageLoader({ src, width }: { src: string; width: number; quality?: number }): string {
  if (!src.includes(OPTIMIZED_URL_SEGMENT) || !src.endsWith(".webp")) return src;
  const variant = IMAGE_VARIANT_WIDTHS.find((w) => width <= w);
  return variant ? imageVariantPath(src, variant) : src;
}
