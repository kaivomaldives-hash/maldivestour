#!/usr/bin/env node
// Attaches the owner's own newly-uploaded fishing photos
// (assets/uploads/fishing/images/{charters,gallery,packages}/, 47 files —
// NOT the atolls/ or articles/ subfolders, out of scope here) to the real
// MFH fishing content.
//
// The owner explicitly confirmed (AskUserQuestion, this task) that despite
// filenames suggesting 15+ separate named businesses (e.g.
// "addu-adventurer.webp", "reef-baa.webp"), every one of these files is
// just an extra real photo for the ONE real charter operator on record
// (Maldives Fishing and Holiday Pvt Ltd, boat "Emperor", Maamendhoo, Gaafu
// Alifu Atoll — see data/maldives/fishing/mfh-charters.json) and its
// lodge/package variants. Never treated as separate listings here.
//
// Registers one media_assets row per file (same
// deterministicUuid("uploaded-media::" + relativePath) /
// storagePathForUpload() scheme as scripts/attach-uploaded-media.mjs, so a
// physical file always gets the same id regardless of which script last
// touched it) for all 47 files, then attaches node_media hero+gallery to:
//   - charters/ (16 files) -> the 2 real charter activities
//     (private-full-day-fishing-charter, private-half-day-fishing-charter)
//   - gallery/  (8 files)  -> the accommodation lodge
//     (maldives-fishing-and-holidays-lodge)
// packages/ (23 files) only get a media_assets row here — this codebase has
// no node_media convention for packages (see
// src/lib/packages/package-images.ts's PACKAGE_HERO_OVERRIDES, a hand-kept
// literal map); 14 of these 23 ids are hand-copied into that file separately
// using this script's printed report, so the two never drift on id/path.
//
// Usage: node scripts/attach-fishing-uploads.mjs [--commit]

import { existsSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import { DATA_DIR, deterministicUuid, ROOT, toAsciiSafe } from "./lib/legacy-shared.mjs";

const COMMIT = process.argv.includes("--commit");
const UPLOADS_DIR = path.join(ROOT, "assets", "uploads", "fishing", "images");
const IMAGE_EXT = new Set([".webp", ".jpg", ".jpeg", ".png", ".avif"]);

const CHARTER_ACTIVITY_SLUGS = ["private-full-day-fishing-charter", "private-half-day-fishing-charter"];
const ACCOMMODATION_SLUG = "maldives-fishing-and-holidays-lodge";

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

// Identical convention to attach-uploaded-media.mjs's storagePathForUpload —
// same "uploads/" + slugified-relativePath scheme, reused verbatim so a
// physical file's storage_path never depends on which script generated it.
function storagePathForUpload(relativePath) {
  const segments = relativePath.split("/");
  const filename = segments.pop();
  const extMatch = filename.match(/\.[a-zA-Z0-9]+$/);
  const ext = extMatch ? extMatch[0].toLowerCase() : "";
  const base = slugifySegment(filename.slice(0, filename.length - ext.length));
  const dir = segments.map(slugifySegment).join("/");
  return `uploads/${dir ? `${dir}/` : ""}${base}${ext}`;
}

function altTextFor(filename) {
  const base = filename.replace(/\.[^.]+$/, "");
  const cleaned = base.replace(/[-_()]+/g, " ").replace(/\s+/g, " ").trim();
  return cleaned ? `${cleaned} — Maldives fishing` : "Maldives fishing";
}

function listImages(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => IMAGE_EXT.has(path.extname(f).toLowerCase()))
    .sort();
}

function registerFile(manifest, folder, filename) {
  const relativePath = `assets/uploads/fishing/images/${folder}/${filename}`;
  const mediaId = deterministicUuid(`uploaded-media::${relativePath}`);
  const storagePath = storagePathForUpload(relativePath);
  const entry = { mediaId, relativePath, storagePath, altText: altTextFor(filename) };
  manifest.push(entry);
  return entry;
}

function attachMedia(lines, nodeType, slug, entries) {
  lines.push(`delete from node_media where role = 'hero' and node_id = (select id from nodes where node_type = ${sqlString(nodeType)} and slug = ${sqlString(slug)});`);
  entries.forEach((entry, i) => {
    const role = i === 0 ? "hero" : "gallery";
    lines.push(
      `insert into node_media (node_id, media_id, role, sort_order) select id, ${sqlString(entry.mediaId)}, ${sqlString(role)}, ${i} from nodes where node_type = ${sqlString(nodeType)} and slug = ${sqlString(slug)} on conflict (node_id, media_id, role) do nothing;`,
    );
  });
}

function main() {
  const charterFiles = listImages(path.join(UPLOADS_DIR, "charters"));
  // Alphabetical puts a close-up fish shot (Blue-marlin.avif) first, which
  // makes an odd lead/hero photo for an accommodation — prefer a
  // boat/place shot as the hero instead, alphabetical for the rest.
  const galleryFiles = listImages(path.join(UPLOADS_DIR, "gallery")).sort((a, b) => {
    const heroLike = /aerial-view|charter-boat/i;
    const aHero = heroLike.test(a) ? 0 : 1;
    const bHero = heroLike.test(b) ? 0 : 1;
    return aHero !== bHero ? aHero - bHero : a.localeCompare(b);
  });
  const packageFiles = listImages(path.join(UPLOADS_DIR, "packages"));

  console.log(`Found: charters=${charterFiles.length} gallery=${galleryFiles.length} packages=${packageFiles.length}`);

  const manifest = [];
  const lines = [];
  lines.push("-- Owner-uploaded fishing charter/gallery/package photos");
  lines.push("-- (assets/uploads/fishing/images/) — real photos the owner pushed");
  lines.push("-- directly for the one real MFH charter/lodge/package listing (confirmed");
  lines.push("-- via AskUserQuestion, not separate businesses despite filenames).");
  lines.push("-- GENERATED FILE, regenerate with:");
  lines.push("--   node scripts/attach-fishing-uploads.mjs --commit");
  lines.push("");

  // media_assets rows for every file (charters + gallery + packages) —
  // packages/ never gets a node_media row below (see header), but still
  // gets a real DB row here so nothing is an orphaned Storage-only file.
  for (const [folder, files] of [["charters", charterFiles], ["gallery", galleryFiles], ["packages", packageFiles]]) {
    for (const filename of files) {
      const entry = registerFile(manifest, folder, filename);
      lines.push(
        `insert into media_assets (id, media_type, storage_path, alt_text) values (${sqlString(entry.mediaId)}, 'image', ${sqlString(entry.storagePath)}, ${sqlString(entry.altText)}) on conflict (id) do nothing;`,
      );
    }
  }
  lines.push("");

  // Charters: split the 16 photos across the 2 real charter activities —
  // first half to the full-day charter, second half to the half-day one
  // (both are the same boat/operator, so this is purely a stable, even
  // split, not a claim that any specific photo is unique to one charter).
  const charterEntries = manifest.filter((e) => e.relativePath.includes("/charters/"));
  const mid = Math.ceil(charterEntries.length / 2);
  const perCharter = [charterEntries.slice(0, mid), charterEntries.slice(mid)];
  CHARTER_ACTIVITY_SLUGS.forEach((slug, i) => {
    lines.push(`-- Charter activity: ${slug}`);
    attachMedia(lines, "activity", slug, perCharter[i]);
    lines.push("");
  });

  // Accommodation lodge: all 8 gallery photos (hero = first).
  const galleryEntries = manifest.filter((e) => e.relativePath.includes("/gallery/"));
  lines.push(`-- Accommodation: ${ACCOMMODATION_SLUG}`);
  attachMedia(lines, "accommodation", ACCOMMODATION_SLUG, galleryEntries);
  lines.push("");

  console.log(`\nCharter activity image assignments:`);
  CHARTER_ACTIVITY_SLUGS.forEach((slug, i) => {
    console.log(`  ${slug}: ${perCharter[i].map((e) => e.relativePath.split("/").pop()).join(", ")}`);
  });
  console.log(`\n${ACCOMMODATION_SLUG}: ${galleryEntries.map((e) => e.relativePath.split("/").pop()).join(", ")}`);

  const packageEntries = manifest.filter((e) => e.relativePath.includes("/packages/"));
  console.log(`\nPackage photos available for PACKAGE_HERO_OVERRIDES (id, storagePath, filename):`);
  for (const e of packageEntries) console.log(`  ${e.mediaId}  ${e.storagePath}  (${e.relativePath.split("/").pop()})`);

  if (COMMIT) {
    const outPath = path.join(ROOT, "supabase", "migrations", "20250124000100_fishing_uploads_media.sql");
    writeFileSync(outPath, [...lines, ""].join("\n"));
    console.log(`\nWrote ${path.relative(ROOT, outPath)}`);

    const manifestPath = path.join(DATA_DIR, "migration", "fishing-uploads-manifest.json");
    writeFileSync(manifestPath, JSON.stringify({ generatedAt: new Date().toISOString(), files: manifest }, null, 2));
    console.log(`Wrote ${path.relative(ROOT, manifestPath)} (${manifest.length} files)`);
  }
}

main();
