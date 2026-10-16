#!/usr/bin/env node
// Attaches the owner's own GoTripMaldives/Yuvi Blue photos to:
//   - media_assets rows for 16 new Himmafushi holiday-package hero images
//     (assets/uploads/gotrip/packages/) — one distinct real photo per
//     package so the packages directory never shows the same card image
//     twice (owner's explicit instruction). These are NOT attached via
//     node_media (packages have no such convention — see
//     src/lib/packages/package-images.ts's PACKAGE_HERO_OVERRIDES header);
//     this script only registers the media_assets rows + prints the
//     id/storagePath list, which is hand-copied into that file.
//   - media_assets rows + node_media hero/gallery for 3 real photos of
//     Maldives Fishing and Holidays Lodge (assets/uploads/gotrip/lodge/),
//     the accommodation on Maamendhoo, Gaafu Alifu Atoll — replacing the
//     placeholder generic fishing photos that were never actually in
//     Storage (see git history on package-images.ts's
//     ACCOMMODATION_GALLERY_IMAGES entry for this same accommodation).
//
// Source: the owner's own "gotrip.zip" upload (this session), confirmed
// against the owner-supplied "Gotripmaldives Customer Holiday Rates.pdf"
// and "Gotripmaldives Customer Fishing Rate Sheet.pdf" — Yuvi Blue
// Maldives (Himmafushi) and Maldives Fishing and Holidays Lodge
// (Maamendhoo) are both run under the same GoTripMaldives/Yuvi Blue brand
// per those PDFs' own booking terms ("GoTripMaldives / YUVI Blue").
//
// Same deterministicUuid("uploaded-media::" + relativePath) /
// storagePathForUpload() scheme as every other attach-*-uploads.mjs
// script, so re-running this is idempotent and never collides with ids
// computed for the same physical file by another script.
//
// Usage: node scripts/attach-gotrip-uploads.mjs [--commit]

import { existsSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import { DATA_DIR, deterministicUuid, ROOT, toAsciiSafe } from "./lib/legacy-shared.mjs";

const COMMIT = process.argv.includes("--commit");
const PACKAGES_DIR = path.join(ROOT, "assets", "uploads", "gotrip", "packages");
const LODGE_DIR = path.join(ROOT, "assets", "uploads", "gotrip", "lodge");
const IMAGE_EXT = new Set([".webp", ".jpg", ".jpeg", ".png", ".avif"]);

const LODGE_ACCOMMODATION_SLUG = "maldives-fishing-and-holidays-lodge";

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

function altTextFor(filename, suffix) {
  const base = filename.replace(/\.[^.]+$/, "");
  const cleaned = base.replace(/[-_()]+/g, " ").replace(/\s+/g, " ").trim();
  return cleaned ? `${cleaned} — ${suffix}` : suffix;
}

function listImages(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => IMAGE_EXT.has(path.extname(f).toLowerCase()))
    .sort();
}

function registerFile(manifest, relativePath, altText) {
  const mediaId = deterministicUuid(`uploaded-media::${relativePath}`);
  const storagePath = storagePathForUpload(relativePath);
  const entry = { mediaId, relativePath, storagePath, altText };
  manifest.push(entry);
  return entry;
}

function main() {
  const packageFiles = listImages(PACKAGES_DIR);
  const lodgeFiles = listImages(LODGE_DIR);
  console.log(`Found: packages=${packageFiles.length} lodge=${lodgeFiles.length}`);

  const manifest = [];
  const lines = [];
  lines.push("-- Owner-uploaded GoTripMaldives/Yuvi Blue photos (assets/uploads/gotrip/)");
  lines.push("-- — 16 real Himmafushi package card photos + 3 real photos of Maldives");
  lines.push("-- Fishing and Holidays Lodge, Maamendhoo, Gaafu Alifu Atoll.");
  lines.push("-- GENERATED FILE, regenerate with:");
  lines.push("--   node scripts/attach-gotrip-uploads.mjs --commit");
  lines.push("");

  const byName = new Map();
  for (const filename of packageFiles) {
    const relativePath = `assets/uploads/gotrip/packages/${filename}`;
    const entry = registerFile(manifest, relativePath, altTextFor(filename, "Himmafushi holiday package, Maldives"));
    byName.set(filename, entry);
    lines.push(
      `insert into media_assets (id, media_type, storage_path, alt_text) values (${sqlString(entry.mediaId)}, 'image', ${sqlString(entry.storagePath)}, ${sqlString(entry.altText)}) on conflict (id) do nothing;`,
    );
  }
  for (const filename of lodgeFiles) {
    const relativePath = `assets/uploads/gotrip/lodge/${filename}`;
    const entry = registerFile(manifest, relativePath, altTextFor(filename, "Maldives Fishing and Holidays Lodge, Maamendhoo"));
    byName.set(filename, entry);
    lines.push(
      `insert into media_assets (id, media_type, storage_path, alt_text) values (${sqlString(entry.mediaId)}, 'image', ${sqlString(entry.storagePath)}, ${sqlString(entry.altText)}) on conflict (id) do nothing;`,
    );
  }
  lines.push("");

  // Lodge accommodation: real photos as hero + gallery, replacing whatever
  // hero row exists today (the earlier placeholder was never actually in
  // Storage — see this script's header).
  const lodgeOrder = ["mfh-lodge-exterior.jpeg", "mfh-lodge-guest-house.jpeg", "mfh-lodge-hotel.jpeg"].filter((f) => byName.has(f));
  if (lodgeOrder.length > 0) {
    lines.push(`-- Accommodation: ${LODGE_ACCOMMODATION_SLUG}`);
    lines.push(
      `delete from node_media where role = 'hero' and node_id = (select id from nodes where node_type = 'accommodation' and slug = ${sqlString(LODGE_ACCOMMODATION_SLUG)});`,
    );
    lodgeOrder.forEach((filename, i) => {
      const entry = byName.get(filename);
      const role = i === 0 ? "hero" : "gallery";
      lines.push(
        `insert into node_media (node_id, media_id, role, sort_order) select id, ${sqlString(entry.mediaId)}, ${sqlString(role)}, ${i} from nodes where node_type = 'accommodation' and slug = ${sqlString(LODGE_ACCOMMODATION_SLUG)} on conflict (node_id, media_id, role) do nothing;`,
      );
    });
    lines.push("");
  }

  console.log(`\nLodge hero+gallery: ${lodgeOrder.join(", ")}`);

  const packageEntries = manifest.filter((e) => e.relativePath.includes("/packages/"));
  console.log(`\nPackage photos for PACKAGE_HERO_OVERRIDES (id, storagePath, filename):`);
  for (const e of packageEntries) console.log(`  ${e.mediaId}  ${e.storagePath}  (${e.relativePath.split("/").pop()})`);

  if (COMMIT) {
    const outPath = path.join(ROOT, "supabase", "migrations", "20261020000100_gotrip_uploads_media.sql");
    writeFileSync(outPath, [...lines, ""].join("\n"));
    console.log(`\nWrote ${path.relative(ROOT, outPath)}`);

    const manifestPath = path.join(DATA_DIR, "migration", "gotrip-uploads-manifest.json");
    writeFileSync(manifestPath, JSON.stringify({ generatedAt: new Date().toISOString(), files: manifest }, null, 2));
    console.log(`Wrote ${path.relative(ROOT, manifestPath)} (${manifest.length} files)`);
  }
}

main();
