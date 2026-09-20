#!/usr/bin/env node
// Recovers real, route-specific hero images from the legacy release for
// every migrated transfer route (Task 18/20 follow-up — the user
// explicitly asked to use more legacy imagery). Two real sources, tried
// in order per route:
//   1. The route's own legacy page's own <meta property="og:image">
//      (re-read directly from its sourceFile — never guessed).
//   2. A same-route image under images/transfers/Male-airport-to-*.webp
//      (a real, dedicated "airport to <destination>" image set on the
//      legacy site), matched by real token overlap with the route's own
//      recovered destination name — same matching approach already used
//      throughout this project, never a random/first-available pick.
// A route with neither gets no image — never a stock substitute.
//
// Writes: supabase/migrations/20250114000200_transfer_route_images.sql
// and data/maldives/migration/transfer-route-image-manifest.json (read by
// scripts/upload-legacy-media.mjs, same as every other Task 14+ manifest).
//
// Usage: node scripts/recover-transfer-route-images.mjs [--commit]

import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import {
  DATA_DIR,
  deterministicUuid,
  distinctiveTokens,
  RELEASE_DIR,
  ROOT,
  storagePathForRelativePath,
  toAsciiSafe,
} from "./lib/legacy-shared.mjs";

const COMMIT = process.argv.includes("--commit");
const CONTENT_DATA_DIR = path.join(DATA_DIR, "migration");

function sqlString(value) {
  if (value === null || value === undefined) return "null";
  return `'${toAsciiSafe(String(value)).replace(/'/g, "''")}'`;
}

function extractOgImage(html) {
  const m = html.match(/<meta property="og:image" content="([^"]*)"/);
  if (!m || !m[1]) return null;
  const url = m[1];
  return url.split("/").pop();
}

function tokenOverlapScore(a, b) {
  const ta = new Set(distinctiveTokens(a));
  const tb = new Set(distinctiveTokens(b));
  if (ta.size === 0 || tb.size === 0) return 0;
  let shared = 0;
  for (const t of ta) if (tb.has(t)) shared += 1;
  return shared / Math.max(ta.size, tb.size);
}

function main() {
  const recoveryPath = path.join(CONTENT_DATA_DIR, "transfer-legacy-recovery.json");
  if (!existsSync(recoveryPath)) {
    console.error("Run scripts/rebuild-legacy-transfers.mjs --commit first.");
    process.exit(1);
  }
  const recovery = JSON.parse(readFileSync(recoveryPath, "utf8"));
  const ready = recovery.records.filter((r) => r.status === "ready");

  const transfersImageDir = path.join(RELEASE_DIR, "images", "transfers");
  const routeImageFiles = existsSync(transfersImageDir)
    ? readdirSync(transfersImageDir).filter((f) => /^Male-airport-to-/i.test(f))
    : [];

  const lines = [];
  const uploadManifest = [];
  let viaOgImage = 0;
  let viaFuzzyMatch = 0;
  let unmatched = [];

  for (const r of ready) {
    const sourcePath = path.join(RELEASE_DIR, r.sourceFile);
    if (!existsSync(sourcePath)) {
      unmatched.push({ islandSlug: r.islandSlug, reason: "source file missing" });
      continue;
    }
    const html = readFileSync(sourcePath, "utf8");
    const ogFilename = extractOgImage(html);

    let relativePath = null;

    if (ogFilename) {
      const candidates = [
        path.join("images", "transfers", ogFilename),
        path.join("images", ogFilename),
      ];
      const hit = candidates.find((c) => existsSync(path.join(RELEASE_DIR, c)));
      if (hit) {
        relativePath = hit;
        viaOgImage += 1;
      }
    }

    if (!relativePath && routeImageFiles.length > 0) {
      let best = null;
      let bestScore = 0;
      for (const filename of routeImageFiles) {
        const score = tokenOverlapScore(r.destinationNameRaw, filename.replace(/^Male-airport-to-/i, ""));
        if (score > bestScore) {
          bestScore = score;
          best = filename;
        }
      }
      if (best && bestScore >= 0.5) {
        relativePath = path.join("images", "transfers", best);
        viaFuzzyMatch += 1;
      }
    }

    if (!relativePath) {
      unmatched.push({ islandSlug: r.islandSlug, reason: "no og:image or fuzzy match above threshold" });
      continue;
    }

    const mediaId = deterministicUuid(`legacy-media::${relativePath}`);
    const storagePath = storagePathForRelativePath(relativePath);
    uploadManifest.push({ mediaId, relativePath, storagePath });

    lines.push(
      `insert into media_assets (id, media_type, storage_path, alt_text) values (${sqlString(mediaId)}, 'image', ${sqlString(storagePath)}, ${sqlString(`Velana International Airport to ${r.islandTitle} transfer`)}) on conflict (id) do nothing;`,
    );
    lines.push(
      `insert into node_media (node_id, media_id, role, sort_order) select id, ${sqlString(mediaId)}, 'hero', 0 from nodes where node_type = 'transfer_route' and slug = ${sqlString(`velana-international-airport-to-${r.islandSlug}`)} on conflict (node_id, media_id, role) do nothing;`,
    );
  }

  const sql = [
    "-- Real, route-specific hero images recovered from the legacy release",
    "-- (each route's own og:image, or a matched images/transfers/Male-airport-to-*",
    "-- file) -- GENERATED FILE, regenerate with:",
    "--   node scripts/recover-transfer-route-images.mjs --commit",
    "",
    ...lines,
    "",
  ].join("\n");

  if (COMMIT) {
    const outPath = path.join(ROOT, "supabase", "migrations", "20250114000200_transfer_route_images.sql");
    writeFileSync(outPath, sql);
    console.log(`Wrote ${path.relative(ROOT, outPath)}`);

    const manifestPath = path.join(CONTENT_DATA_DIR, "transfer-route-image-manifest.json");
    writeFileSync(manifestPath, JSON.stringify({ generatedAt: new Date().toISOString(), files: uploadManifest }, null, 2));
    console.log(`Wrote ${path.relative(ROOT, manifestPath)} (${uploadManifest.length} images)`);
  } else {
    console.log(sql.slice(0, 1500));
  }

  console.log(`\nReady routes: ${ready.length}`);
  console.log(`Matched via own og:image: ${viaOgImage}`);
  console.log(`Matched via Male-airport-to-* fuzzy match: ${viaFuzzyMatch}`);
  console.log(`Total images recovered: ${uploadManifest.length}`);
  console.log(`Unmatched: ${unmatched.length}`);
  if (unmatched.length > 0) console.log(unmatched.slice(0, 10));
}

main();
