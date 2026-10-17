#!/usr/bin/env node
// Attaches the owner's own photos (assets/uploads/himmafushi/watersports/)
// to the matching Himmafushi/Yuvi Blue watersports activities as their
// hero image. These 4 are a real match for 4 of the 14 Himmafushi
// watersports/snorkeling/fishing-trip activities seeded in
// 20261001006700_yuviblue_himmafushi.sql — confirmed none of the 14 had
// any node_media row at all before this (grepped the whole migration
// history for each slug). The other 10 still have no photo; they need
// one supplied the same way before they can get this same treatment.
//
// Same deterministicUuid("uploaded-media::" + relativePath) /
// storagePathForUpload() scheme as every other attach-*-uploads.mjs
// script, so re-running this is idempotent and never collides with ids
// computed for the same physical file by another script.
//
// Usage: node scripts/attach-himmafushi-watersports-uploads.mjs [--commit]

import { existsSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import { DATA_DIR, deterministicUuid, ROOT, toAsciiSafe } from "./lib/legacy-shared.mjs";

const COMMIT = process.argv.includes("--commit");
const SOURCE_DIR = path.join(ROOT, "assets", "uploads", "himmafushi", "watersports");
const IMAGE_EXT = new Set([".webp", ".jpg", ".jpeg", ".png", ".avif"]);

// filename (in SOURCE_DIR) -> the activity slug it's the hero image for.
const FILENAME_TO_ACTIVITY_SLUG = {
  "himmafushi-fun-tube.webp": "himmafushi-fun-tube",
  "himmafushi-canoeing.webp": "himmafushi-canoeing",
  "himmafushi-jet-ski.webp": "himmafushi-jet-ski",
  "himmafushi-parasailing.webp": "himmafushi-parasailing",
};

function sqlString(value) {
  return `'${toAsciiSafe(String(value)).replace(/'/g, "''")}'`;
}

function slugifySegment(input) {
  return String(input)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function storagePathForUpload(relativePath) {
  const segments = relativePath.split("/");
  const filename = segments.pop();
  const extMatch = filename.match(/\.[a-zA-Z0-9]+$/);
  const ext = extMatch ? extMatch[0].toLowerCase() : "";
  const base = slugifySegment(filename.slice(0, filename.length - ext.length));
  const dir = segments.map(slugifySegment).join("/");
  return `uploads/${dir ? `${dir}/` : ""}${base}${ext}`;
}

function listImages(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => IMAGE_EXT.has(path.extname(f).toLowerCase()))
    .sort();
}

function main() {
  const files = listImages(SOURCE_DIR);
  console.log(`Found ${files.length} image(s) in ${path.relative(ROOT, SOURCE_DIR)}`);

  const manifest = [];
  const lines = [];
  lines.push("-- Owner-uploaded photos for 4 of the 14 Himmafushi/Yuvi Blue");
  lines.push("-- watersports activities (assets/uploads/himmafushi/watersports/) --");
  lines.push("-- none of the 14 had any image before this (confirmed by grepping the");
  lines.push("-- whole migration history for a node_media row on any of their slugs).");
  lines.push("-- GENERATED FILE, regenerate with:");
  lines.push("--   node scripts/attach-himmafushi-watersports-uploads.mjs --commit");
  lines.push("");

  for (const filename of files) {
    const activitySlug = FILENAME_TO_ACTIVITY_SLUG[filename];
    if (!activitySlug) {
      console.log(`  skip (no mapped activity): ${filename}`);
      continue;
    }
    const relativePath = `assets/uploads/himmafushi/watersports/${filename}`;
    const mediaId = deterministicUuid(`uploaded-media::${relativePath}`);
    const storagePath = storagePathForUpload(relativePath);
    const altText = `${activitySlug.replace("himmafushi-", "").replace(/-/g, " ")} — Himmafushi, Maldives`;
    manifest.push({ mediaId, relativePath, storagePath, altText });

    lines.push(`-- ${activitySlug}`);
    lines.push(
      `insert into media_assets (id, media_type, storage_path, alt_text) values (${sqlString(mediaId)}, 'image', ${sqlString(storagePath)}, ${sqlString(altText)}) on conflict (id) do nothing;`,
    );
    lines.push(
      `insert into node_media (node_id, media_id, role, sort_order) select id, ${sqlString(mediaId)}, 'hero', 0 from nodes where node_type = 'activity' and slug = ${sqlString(activitySlug)} on conflict (node_id, media_id, role) do nothing;`,
    );
    lines.push("");
  }

  console.log(`\nMapped ${manifest.length}/${files.length} files to an activity.`);

  if (COMMIT) {
    const outPath = path.join(ROOT, "supabase", "migrations", "20261026000100_himmafushi_watersports_images.sql");
    writeFileSync(outPath, [...lines, ""].join("\n"));
    console.log(`Wrote ${path.relative(ROOT, outPath)}`);

    const manifestPath = path.join(DATA_DIR, "migration", "himmafushi-watersports-uploads-manifest.json");
    writeFileSync(manifestPath, JSON.stringify({ generatedAt: new Date().toISOString(), files: manifest }, null, 2));
    console.log(`Wrote ${path.relative(ROOT, manifestPath)} (${manifest.length} files)`);
  }
}

main();
