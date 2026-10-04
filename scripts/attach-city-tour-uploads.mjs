#!/usr/bin/env node
// Owner-uploaded photos for the Male City Tour family (assets/uploads/city-tour/),
// requested alongside two new bus-tour products (mini bus $150/hr, large bus
// $200/hr) and a unified /maldives/male-city-tour/ hub page that lists every
// Male City Tour option (walking, bike, car, mini bus, large bus, plus the
// two existing half-day variants).
//
// The 5 existing Male City Tour activities (male-city-walking-tour,
// male-city-bike-tour, male-city-car-tour, male-city-half-day-walking-tour,
// male-city-half-day-bike-tour) were created in
// 20250201000100_male_city_tour_and_whale_submarine.sql using photos from
// the legacy site's own image library. This script replaces each one's
// hero with a real owner-uploaded photo (the owner explicitly asked these
// new uploads be used) and adds a shared gallery pool of Male city photos,
// then creates the 2 new bus-tour activities the same way the walking/bike/
// car tours were created, tagged into the same 'city-tour' category so all
// 7 are reachable via one category lookup (see
// src/lib/activities/city-tour.ts).
//
// Usage: node scripts/attach-city-tour-uploads.mjs [--commit]

import { writeFileSync } from "node:fs";
import path from "node:path";

import { DATA_DIR, deterministicUuid, ROOT, toAsciiSafe } from "./lib/legacy-shared.mjs";

const COMMIT = process.argv.includes("--commit");
const UPLOAD_DIR_REL = "assets/uploads/city-tour";

function sqlString(value) {
  return `'${toAsciiSafe(String(value)).replace(/'/g, "''")}'`;
}

function altTextFor(filename) {
  const base = filename.replace(/\.[^.]+$/, "");
  const cleaned = base.replace(/[-_()]+/g, " ").replace(/\s+/g, " ").trim();
  return cleaned ? `${cleaned} — Male City Tour` : "Male City Tour";
}

function storagePathFor(relativePath) {
  // Same scheme as every other owner-upload script: storage_path is
  // "uploads/" + the relativePath verbatim (assets/uploads/city-tour/
  // filenames are already slug-safe, no further slugification needed).
  return `uploads/${relativePath}`;
}

const manifest = [];
function register(filename) {
  const relativePath = `${UPLOAD_DIR_REL}/${filename}`;
  const mediaId = deterministicUuid(`uploaded-media::${relativePath}`);
  const storagePath = storagePathFor(relativePath);
  const entry = { mediaId, relativePath, storagePath, altText: altTextFor(filename) };
  manifest.push(entry);
  return entry;
}

// Hero + gallery assignment, hand-picked from the 27 uploaded files so
// each activity gets a specific, relevant hero rather than a generic one.
const SHARED_GALLERY = [
  "male-city-bridge.webp",
  "male-city-harbour.webp",
  "muleeaage-male-city.webp",
  "male-city-stingray-point.webp",
  "male-city-artificial-beach.webp",
  "male-arial.webp",
  "maldives-capital-city-tour.webp",
  "male-maldives.webp",
].map(register);

const ASSIGNMENTS = [
  { slug: "male-city-walking-tour", hero: "male-city-guided-tour.webp", gallery: [0, 1, 4] },
  { slug: "male-city-bike-tour", hero: "male-bike-tour.webp", gallery: [3, 0, 5] },
  { slug: "male-city-car-tour", hero: "male-city-car-tour.png", gallery: [1, 6, 5] },
  { slug: "male-city-half-day-walking-tour", hero: "maldives-historical-tour.webp", gallery: [2, 7, "visit-male-city.webp"] },
  { slug: "male-city-half-day-bike-tour", hero: "male-island-tour.webp", gallery: [3, 7, "male-city.webp"] },
  { slug: "male-city-mini-bus-tour", hero: "maldives-bus-tour.webp", gallery: [1, 6, 5], isNew: true, priceFrom: 150, note: "Mini bus (up to ~15 seats), USD 150 per hour." },
  { slug: "male-city-large-bus-tour", hero: "male-city-bus-tour.jpeg", gallery: [1, 6, "male-city-tour.webp"], isNew: true, priceFrom: 200, note: "Large bus (30+ seats), USD 200 per hour." },
].map((a) => {
  const heroEntry = register(a.hero);
  const galleryEntries = a.gallery.map((g) => (typeof g === "number" ? SHARED_GALLERY[g] : register(g)));
  return { ...a, heroEntry, galleryEntries };
});

const HUB_HERO = register("maldives-city-tour.webp");

const lines = [];
lines.push("-- Owner-uploaded Male City Tour photos (assets/uploads/city-tour/) plus");
lines.push("-- 2 new bus-tour activities (mini bus USD 150/hr, large bus USD 200/hr),");
lines.push("-- requested alongside a unified /maldives/male-city-tour/ hub page.");
lines.push("-- GENERATED FILE, regenerate with:");
lines.push("--   node scripts/attach-city-tour-uploads.mjs --commit");
lines.push("");

// media_assets rows for every file used (hero + gallery + hub hero).
for (const entry of manifest) {
  lines.push(
    `insert into media_assets (id, media_type, storage_path, alt_text) values (${sqlString(entry.mediaId)}, 'image', ${sqlString(entry.storagePath)}, ${sqlString(entry.altText)}) on conflict (id) do nothing;`,
  );
}
lines.push("");

// The 2 new bus-tour activities, same shape as the existing 5 (see
// 20250201000100_male_city_tour_and_whale_submarine.sql).
const BUS_TOURS = [
  {
    slug: "male-city-mini-bus-tour",
    title: "Male City Mini Bus Tour",
    price: 150,
    summary:
      "Male City Mini Bus Tour is a guided sightseeing tour of Male, the Maldives' capital island, by air-conditioned mini bus (up to ~15 seats), with airport pickup and drop-off. USD 150 per hour, minimum 2 hours. Includes: airport pickup and drop-off, local guide, mini bus, taxes. Highlights: Stingray Point, local market, fish market, souvenir street, Old Presidential Palace, Grand Friday Mosque, Victory Monument, Old Friday Mosque (heritage), Presidential Office, Parliament, Artificial Beach, surfing point, Tsunami Monument, King Salmaan Mosque, and the Sinamale Bridge.",
    metaTitle: "Male City Mini Bus Tour (USD 150/hr) | Maldives Tour Guide",
    metaDescription:
      "Male City Mini Bus Tour is a guided sightseeing tour of Male by air-conditioned mini bus, with airport pickup and drop-off. USD 150 per hour.",
  },
  {
    slug: "male-city-large-bus-tour",
    title: "Male City Large Bus Tour",
    price: 200,
    summary:
      "Male City Large Bus Tour is a guided sightseeing tour of Male, the Maldives' capital island, by air-conditioned large bus (30+ seats), ideal for bigger groups, with airport pickup and drop-off. USD 200 per hour, minimum 2 hours. Includes: airport pickup and drop-off, local guide, large bus, taxes. Highlights: Stingray Point, local market, fish market, souvenir street, Old Presidential Palace, Grand Friday Mosque, Victory Monument, Old Friday Mosque (heritage), Presidential Office, Parliament, Artificial Beach, surfing point, Tsunami Monument, King Salmaan Mosque, and the Sinamale Bridge.",
    metaTitle: "Male City Large Bus Tour (USD 200/hr) | Maldives Tour Guide",
    metaDescription:
      "Male City Large Bus Tour is a guided sightseeing tour of Male by air-conditioned large bus, ideal for groups, with airport pickup and drop-off. USD 200 per hour.",
  },
];

for (const bus of BUS_TOURS) {
  lines.push(`-- Activity: ${bus.title} (USD ${bus.price}/hour)`);
  lines.push(
    `insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, published_at) values (${sqlString("activity")}, ${sqlString(bus.slug)}, ${sqlString(bus.title)}, ${sqlString(bus.summary)}, 'published', ${sqlString(bus.metaTitle)}, ${sqlString(bus.metaDescription)}, now()) on conflict (node_type, slug) do nothing;`,
  );
  lines.push(
    `insert into activities (id, activity_category, operated_by_provider_id, price_from, currency) select n.id, 'excursion', p.id, ${bus.price}, 'USD' from nodes n, nodes p where n.node_type = 'activity' and n.slug = ${sqlString(bus.slug)} and p.node_type = 'provider' and p.slug = 'maldives-tour-guide-tours' on conflict (id) do nothing;`,
  );
  lines.push(
    `insert into node_locations (node_id, location_id, relation) select n.id, l.id, 'primary' from nodes n, nodes l where n.node_type = 'activity' and n.slug = ${sqlString(bus.slug)} and l.node_type = 'location' and l.slug = 'male' on conflict (node_id, location_id) do nothing;`,
  );
  lines.push(
    `insert into bookable_products (id, booking_mode, base_price, currency) select id, 'inquiry', ${bus.price}, 'USD' from nodes where node_type = 'activity' and slug = ${sqlString(bus.slug)} on conflict (id) do nothing;`,
  );
  lines.push(
    `insert into node_categories (node_id, category_id) select n.id, c.id from nodes n, nodes c where n.node_type = 'activity' and n.slug = ${sqlString(bus.slug)} and c.node_type = 'category' and c.slug = 'city-tour' on conflict (node_id, category_id) do nothing;`,
  );
  lines.push("");
}

// Hero + gallery attachment for all 7 activities (5 existing get their
// hero REPLACED with a new owner photo; all 7 get a fresh gallery on top
// of whatever gallery rows already exist, offset to sort_order 10+ so
// nothing collides with or is lost from the existing legacy-library rows).
for (const a of ASSIGNMENTS) {
  lines.push(`-- ${a.slug}: hero + gallery from owner uploads`);
  lines.push(
    `delete from node_media where role = 'hero' and node_id = (select id from nodes where node_type = 'activity' and slug = ${sqlString(a.slug)});`,
  );
  lines.push(
    `insert into node_media (node_id, media_id, role, sort_order) select id, ${sqlString(a.heroEntry.mediaId)}, 'hero', 0 from nodes where node_type = 'activity' and slug = ${sqlString(a.slug)} on conflict (node_id, media_id, role) do nothing;`,
  );
  a.galleryEntries.forEach((entry, i) => {
    lines.push(
      `insert into node_media (node_id, media_id, role, sort_order) select id, ${sqlString(entry.mediaId)}, 'gallery', ${10 + i} from nodes where node_type = 'activity' and slug = ${sqlString(a.slug)} on conflict (node_id, media_id, role) do nothing;`,
    );
  });
  lines.push("");
}

// Fix the /male-city-tour.html redirect to point at the new unified hub
// page (previously pointed at just the walking-tour activity page).
lines.push("-- Redirect the legacy single-page URL to the new unified hub page.");
lines.push(
  `insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/male-city-tour.html', 'path', '/maldives/male-city-tour/', 301, '[redirect, confidence=high] Updated to the new unified Male City Tour hub page listing all 7 tour options (was pointing at just the walking-tour activity page).') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();`,
);
lines.push("");

console.log(`Registered ${manifest.length} media files.`);
console.log(`Hub hero: ${HUB_HERO.relativePath} (mediaId ${HUB_HERO.mediaId})`);
for (const a of ASSIGNMENTS) {
  console.log(`${a.slug}: hero=${a.hero}, gallery=${a.galleryEntries.map((e) => e.relativePath.split("/").pop()).join(", ")}`);
}

if (COMMIT) {
  const outPath = path.join(ROOT, "supabase", "migrations", "20261001004500_city_tour_uploads_and_bus_tours.sql");
  writeFileSync(outPath, lines.join("\n") + "\n");
  console.log(`\nWrote ${path.relative(ROOT, outPath)}`);

  const manifestPath = path.join(DATA_DIR, "migration", "city-tour-uploads-manifest.json");
  writeFileSync(manifestPath, JSON.stringify({ generatedAt: new Date().toISOString(), files: manifest }, null, 2));
  console.log(`Wrote ${path.relative(ROOT, manifestPath)} (${manifest.length} files)`);
  console.log(`\nHub hero media asset to use in the page component:`);
  console.log(`  id: ${HUB_HERO.mediaId}`);
  console.log(`  storagePath: ${HUB_HERO.storagePath}`);
  console.log(`  altText: ${HUB_HERO.altText}`);
}
