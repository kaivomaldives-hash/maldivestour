#!/usr/bin/env node
// Migrates the ENTIRE real legacy image library (release/public_html/
// images/), not just the subset currently wired into specific pages —
// the owner wants the full set available in Storage for future pages.
// Every file gets a real media_assets row using the exact same
// deterministicUuid("legacy-media::" + relativePath) convention every
// other Task 14+ migration script uses, so this can never create a
// duplicate row for a file some other script already covered — it just
// resolves to the same id and no-ops via ON CONFLICT.
//
// Excludes only genuinely non-image junk found in the folder (Windows
// thumbnail caches, stray .php/.html files, a .lnk shortcut, and the two
// .mp4s — this project's media_assets.media_type only supports
// 'image'/'youtube', no generic video type, so real video files are
// reported but not migrated here).
//
// Writes: supabase/migrations/20250115000100_full_legacy_image_library.sql
// (in numbered parts if very large) and
// data/maldives/migration/full-legacy-image-library-manifest.json (read
// by scripts/upload-legacy-media.mjs).
//
// Usage: node scripts/build-full-legacy-image-library.mjs [--commit]

import { closeSync, existsSync, openSync, readdirSync, readSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

import { DATA_DIR, deterministicUuid, RELEASE_DIR, ROOT, storagePathForRelativePath, toAsciiSafe } from "./lib/legacy-shared.mjs";

const COMMIT = process.argv.includes("--commit");
const IMAGES_ROOT = path.join(RELEASE_DIR, "images");

const IMAGE_EXTENSIONS = new Set([".webp", ".jpg", ".jpeg", ".png", ".gif", ".avif", ".svg"]);
const SKIP_FILENAMES = new Set(["thumbs.db"]);

/** Several legacy files lost their extension on disk (confirmed real
 * WebP images via magic bytes, e.g. release/public_html/images/maps/de/
 * Geographie) — sniff the first 16 bytes rather than trust a missing/
 * wrong extension, so a real image is never dropped as "junk". */
function sniffImageExtension(absPath) {
  const fd = openSync(absPath, "r");
  const buf = Buffer.alloc(16);
  readSync(fd, buf, 0, 16, 0);
  closeSync(fd);

  if (buf.subarray(0, 4).toString("ascii") === "RIFF" && buf.subarray(8, 12).toString("ascii") === "WEBP") return ".webp";
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return ".jpg";
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return ".png";
  if (buf.subarray(0, 3).toString("ascii") === "GIF") return ".gif";
  return null;
}

function sqlString(value) {
  if (value === null || value === undefined) return "null";
  return `'${toAsciiSafe(String(value)).replace(/'/g, "''")}'`;
}

function altTextFor(filename) {
  const base = filename.replace(/\.[^.]+$/, "");
  const cleaned = base.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  return cleaned || "Maldives Tour Guide";
}

function walk(dir, relBase, out) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    const rel = relBase ? `${relBase}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      walk(abs, rel, out);
      continue;
    }
    if (!entry.isFile()) continue;
    out.push({ abs, rel, filename: entry.name });
  }
}

function main() {
  if (!existsSync(IMAGES_ROOT)) {
    console.error(`Not found: ${IMAGES_ROOT}`);
    process.exit(1);
  }

  const allFiles = [];
  walk(IMAGES_ROOT, "", allFiles);

  const images = [];
  const skippedVideo = [];
  const skippedOther = [];
  let recoveredByMagicBytes = 0;

  for (const f of allFiles) {
    const ext = path.extname(f.filename).toLowerCase();
    const lowerName = f.filename.toLowerCase();
    if (SKIP_FILENAMES.has(lowerName)) continue;
    if (ext === ".mp4" || ext === ".mov") {
      skippedVideo.push(f.rel);
      continue;
    }

    const size = statSync(f.abs).size;
    if (size === 0) {
      skippedOther.push(`${f.rel} (0 bytes)`);
      continue;
    }

    if (IMAGE_EXTENSIONS.has(ext)) {
      images.push(f);
      continue;
    }

    // Extension missing/wrong (e.g. release/public_html/images/maps/de/
    // Geographie is a real WebP file with no extension at all) — sniff
    // magic bytes before giving up on it, so a real image is never
    // dropped as junk just because its filename lost its suffix.
    const sniffed = sniffImageExtension(f.abs);
    if (sniffed) {
      recoveredByMagicBytes += 1;
      images.push({ ...f, rel: `${f.rel}${sniffed}`, filename: `${f.filename}${sniffed}` });
      continue;
    }

    skippedOther.push(f.rel);
  }

  const lines = [];
  const uploadManifest = [];

  for (const img of images) {
    const relativePath = `images/${img.rel}`;
    const mediaId = deterministicUuid(`legacy-media::${relativePath}`);
    const storagePath = storagePathForRelativePath(relativePath);
    uploadManifest.push({ mediaId, relativePath, storagePath });
    lines.push(
      `insert into media_assets (id, media_type, storage_path, alt_text) values (${sqlString(mediaId)}, 'image', ${sqlString(storagePath)}, ${sqlString(altTextFor(img.filename))}) on conflict (id) do nothing;`,
    );
  }

  const sql = [
    "-- Full legacy image library (Task 20 follow-up): every real image",
    "-- file under release/public_html/images/, not just the subset wired",
    "-- into specific pages -- available for future pages to reference by",
    "-- its own storage_path. GENERATED FILE, regenerate with:",
    "--   node scripts/build-full-legacy-image-library.mjs --commit",
    "",
    ...lines,
    "",
  ].join("\n");

  if (COMMIT) {
    const outPath = path.join(ROOT, "supabase", "migrations", "20250115000100_full_legacy_image_library.sql");
    writeFileSync(outPath, sql);
    console.log(`Wrote ${path.relative(ROOT, outPath)}`);

    const manifestPath = path.join(DATA_DIR, "migration", "full-legacy-image-library-manifest.json");
    writeFileSync(manifestPath, JSON.stringify({ generatedAt: new Date().toISOString(), files: uploadManifest }, null, 2));
    console.log(`Wrote ${path.relative(ROOT, manifestPath)} (${uploadManifest.length} images)`);

    const reportPath = path.join(DATA_DIR, "migration", "full-legacy-image-library-report.json");
    writeFileSync(
      reportPath,
      JSON.stringify({ generatedAt: new Date().toISOString(), totalFilesFound: allFiles.length, imagesMigrated: images.length, skippedVideo, skippedOther }, null, 2),
    );
    console.log(`Wrote ${path.relative(ROOT, reportPath)}`);
  }

  console.log(`\nTotal files under images/: ${allFiles.length}`);
  console.log(`Real images migrated: ${images.length} (including ${recoveredByMagicBytes} recovered by content sniffing, no/wrong extension on disk)`);
  console.log(`Skipped (video, media_assets has no video type): ${skippedVideo.length}`, skippedVideo);
  console.log(`Skipped (genuinely not an image): ${skippedOther.length}`);
  if (skippedOther.length > 0) console.log(skippedOther.slice(0, 40));
}

main();
