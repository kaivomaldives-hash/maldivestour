#!/usr/bin/env node
// Attaches the owner's own real photos of Yuvi Blue Maldives (Himmafushi
// guesthouse, new partner onboarding) to:
//   - the accommodation node (yuvi-blue-maldives-himmafushi): exterior
//     photo as hero, lobby/reception/business-center/beach-dinner as
//     general gallery
//   - two accommodation_rooms rows (via accommodation_room_media): the
//     double/twin room photo and the family room photo
//   - the Himmafushi location node's own gallery: the 2 real island
//     photos, additive to whatever it already has
//
// Source: assets/uploads/hotels/yuvi-blue-himmafushi/ (10 real photos —
// the partner's rate-card screenshot graphics are deliberately excluded,
// they're reference pricing material, not photography fit for a public
// gallery).
//
// Same deterministicUuid("uploaded-media::" + relativePath) /
// storagePathForUpload() scheme as every other attach-*-uploads.mjs
// script, so re-running this is idempotent and never collides with ids
// computed for the same physical file by another script.
//
// Usage: node scripts/attach-yuviblue-uploads.mjs [--commit]

import { existsSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import { DATA_DIR, deterministicUuid, ROOT, toAsciiSafe } from "./lib/legacy-shared.mjs";

const COMMIT = process.argv.includes("--commit");
const UPLOADS_DIR = path.join(ROOT, "assets", "uploads", "hotels", "yuvi-blue-himmafushi");
const IMAGE_EXT = new Set([".webp", ".jpg", ".jpeg", ".png", ".avif"]);

const ACCOMMODATION_SLUG = "yuvi-blue-maldives-himmafushi";
const LOCATION_SLUG = "himmafushi";
// Room photos attach to the Bed & Breakfast tier row of each room type —
// the accommodation has 3 meal-plan price tiers per room type (see the
// content migration), and a room's real photo is the same regardless of
// which meal plan is booked, so it only needs attaching once.
const DOUBLE_ROOM_NAME = "Deluxe Double/Twin Room - Bed & Breakfast";
const FAMILY_ROOM_NAME = "Deluxe Family Room - Bed & Breakfast";

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
  const files = listImages(UPLOADS_DIR);
  console.log(`Found ${files.length} real photos in assets/uploads/hotels/yuvi-blue-himmafushi/`);

  const manifest = [];
  const lines = [];
  lines.push("-- Owner-uploaded real photos of Yuvi Blue Maldives (Himmafushi guesthouse)");
  lines.push("-- (assets/uploads/hotels/yuvi-blue-himmafushi/) — the partner's rate-card");
  lines.push("-- screenshot graphics are deliberately excluded from this set (reference");
  lines.push("-- pricing material, not public gallery photography).");
  lines.push("-- GENERATED FILE, regenerate with:");
  lines.push("--   node scripts/attach-yuviblue-uploads.mjs --commit");
  lines.push("");

  const byName = new Map();
  for (const filename of files) {
    const relativePath = `assets/uploads/hotels/yuvi-blue-himmafushi/${filename}`;
    const entry = registerFile(manifest, relativePath, altTextFor(filename, "Yuvi Blue Maldives, Himmafushi"));
    byName.set(filename, entry);
    lines.push(
      `insert into media_assets (id, media_type, storage_path, alt_text) values (${sqlString(entry.mediaId)}, 'image', ${sqlString(entry.storagePath)}, ${sqlString(entry.altText)}) on conflict (id) do nothing;`,
    );
  }
  lines.push("");

  // Accommodation hero + general gallery (exterior first as hero, then
  // the common-area/dining shots). Room-specific and island photos are
  // attached separately below, not duplicated into this general gallery.
  const accommodationOrder = [
    "yuvi-guest-house.jpeg",
    "yuvi-lobby.jpeg",
    "yuvi-reception.jpeg",
    "yuvi-business-center.jpeg",
    "yuvi-beach-dinner.jpeg",
    "yuvi-single-room.jpeg",
  ].filter((f) => byName.has(f));

  lines.push(`-- Accommodation: ${ACCOMMODATION_SLUG}`);
  lines.push(
    `delete from node_media where role = 'hero' and node_id = (select id from nodes where node_type = 'accommodation' and slug = ${sqlString(ACCOMMODATION_SLUG)});`,
  );
  accommodationOrder.forEach((filename, i) => {
    const entry = byName.get(filename);
    const role = i === 0 ? "hero" : "gallery";
    lines.push(
      `insert into node_media (node_id, media_id, role, sort_order) select id, ${sqlString(entry.mediaId)}, ${sqlString(role)}, ${i} from nodes where node_type = 'accommodation' and slug = ${sqlString(ACCOMMODATION_SLUG)} on conflict (node_id, media_id, role) do nothing;`,
    );
  });
  lines.push("");

  // Room-specific photos (accommodation_room_media)
  if (byName.has("yuvi-double-room.jpeg")) {
    const entry = byName.get("yuvi-double-room.jpeg");
    lines.push(`-- Room photo: ${DOUBLE_ROOM_NAME}`);
    lines.push(
      `insert into accommodation_room_media (room_id, media_id, sort_order) select r.id, ${sqlString(entry.mediaId)}, 0 from accommodation_rooms r join nodes n on n.id = r.accommodation_id where n.node_type = 'accommodation' and n.slug = ${sqlString(ACCOMMODATION_SLUG)} and r.name = ${sqlString(DOUBLE_ROOM_NAME)} on conflict do nothing;`,
    );
  }
  if (byName.has("yuvi-family-room.jpeg")) {
    const entry = byName.get("yuvi-family-room.jpeg");
    lines.push(`-- Room photo: ${FAMILY_ROOM_NAME}`);
    lines.push(
      `insert into accommodation_room_media (room_id, media_id, sort_order) select r.id, ${sqlString(entry.mediaId)}, 0 from accommodation_rooms r join nodes n on n.id = r.accommodation_id where n.node_type = 'accommodation' and n.slug = ${sqlString(ACCOMMODATION_SLUG)} and r.name = ${sqlString(FAMILY_ROOM_NAME)} on conflict do nothing;`,
    );
  }
  lines.push("");

  // Himmafushi location gallery — additive (no hero deletion: the island
  // already has its own established hero from earlier tasks, these are
  // just 2 more real genuine photos added to its gallery).
  const islandFiles = ["himmafushi-beach.jpeg", "himmafushi-island.jpeg"].filter((f) => byName.has(f));
  if (islandFiles.length > 0) {
    lines.push(`-- Location gallery: ${LOCATION_SLUG}`);
    islandFiles.forEach((filename, i) => {
      const entry = byName.get(filename);
      lines.push(
        `insert into node_media (node_id, media_id, role, sort_order) select id, ${sqlString(entry.mediaId)}, 'gallery', 100 + ${i} from nodes where node_type = 'location' and slug = ${sqlString(LOCATION_SLUG)} on conflict (node_id, media_id, role) do nothing;`,
      );
    });
  }
  lines.push("");

  console.log(`\nAccommodation hero+gallery: ${accommodationOrder.join(", ")}`);
  console.log(`Room photos: double=${byName.has("yuvi-double-room.jpeg")} family=${byName.has("yuvi-family-room.jpeg")}`);
  console.log(`Location gallery additions: ${islandFiles.join(", ")}`);

  if (COMMIT) {
    const outPath = path.join(ROOT, "supabase", "migrations", "20261001006900_yuviblue_uploads_media.sql");
    writeFileSync(outPath, [...lines, ""].join("\n"));
    console.log(`\nWrote ${path.relative(ROOT, outPath)}`);

    const manifestPath = path.join(DATA_DIR, "migration", "yuviblue-uploads-manifest.json");
    writeFileSync(manifestPath, JSON.stringify({ generatedAt: new Date().toISOString(), files: manifest }, null, 2));
    console.log(`Wrote ${path.relative(ROOT, manifestPath)} (${manifest.length} files)`);
  }
}

main();
