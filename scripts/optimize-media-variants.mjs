#!/usr/bin/env node
// One-off backfill for the responsive-image convention in
// src/lib/media/types.ts (OPTIMIZED_MEDIA_PREFIX): every existing image
// asset in the public `media` bucket gets a recompressed full-size WebP
// (longest edge capped at 1600px, q80) plus one pre-resized copy per
// variant width, written under "opt/<original path minus extension>",
// and its media_assets.storage_path (and width/height) repointed there.
// New uploads already do this (uploadOptimizedImage); this brings the
// ~5.5k legacy/imported assets up to the same standard.
//
// Never overwrites or deletes an original: the old file stays at its old
// path, so reverting is just restoring storage_path. Every change is
// recorded in two SQL files:
//   supabase/migrations/20261115001500_optimized_media_paths.sql (forward replay)
//   scripts/output/optimized-media-revert.sql            (exact undo)
// plus scripts/output/missing-media-report.md for assets whose original
// file no longer exists in Storage (broken images on the live site).
//
// Idempotent: assets already under opt/ are skipped, so re-running only
// picks up whatever is left. Animated images are skipped (sharp would
// keep only the first frame).
//
// Usage:
//   SUPABASE_URL=https://<ref>.supabase.co SUPABASE_SERVICE_ROLE_KEY=... \
//     node scripts/optimize-media-variants.mjs [--commit] [--limit N]
// Without --commit it only measures (downloads + compresses, no writes).

import { appendFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import sharp from "sharp";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const COMMIT = process.argv.includes("--commit");
const LIMIT = Number(process.argv[process.argv.indexOf("--limit") + 1]) || Infinity;
const BASE = (process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!BASE) {
  console.error("Set SUPABASE_URL (and SUPABASE_SERVICE_ROLE_KEY) first.");
  process.exit(1);
}

// Must match src/lib/media/types.ts / src/lib/media/compress-image.ts.
const PREFIX = "opt/";
const VARIANT_WIDTHS = [640, 1280];
const MAX_DIMENSION = 1600;
const WEBP_QUALITY = 80;
const CONCURRENCY = 24;
// Every committed change is appended here immediately, so an interrupted
// run loses nothing: a re-run skips assets already under opt/, and the
// SQL files are rebuilt from this whole log, not just the latest run.
const CHANGE_LOG = path.join(ROOT, "scripts/output/optimized-media-changes.jsonl");

const authHeaders = KEY ? { apikey: KEY, Authorization: `Bearer ${KEY}` } : {};
const publicPrefix = `${BASE}/storage/v1/object/public/media/`;

function bucketPath(storagePath) {
  if (storagePath.startsWith(publicPrefix)) return decodeURIComponent(storagePath.slice(publicPrefix.length));
  if (/^https?:\/\//i.test(storagePath)) return null; // hosted elsewhere -- not ours to rewrite
  return storagePath.replace(/^\/+/, "").replace(/^media\//, "");
}
const encode = (p) => p.split("/").map(encodeURIComponent).join("/");

async function fetchAllAssets() {
  const rows = [];
  for (let offset = 0; ; offset += 1000) {
    const res = await fetch(`${BASE}/rest/v1/media_assets?select=id,storage_path,width,height&media_type=eq.image&order=id&limit=1000&offset=${offset}`, { headers: authHeaders });
    const page = await res.json();
    rows.push(...page);
    if (page.length < 1000) return rows;
  }
}

async function upload(objectPath, buffer) {
  const res = await fetch(`${BASE}/storage/v1/object/media/${encode(objectPath)}`, {
    method: "POST",
    headers: { ...authHeaders, "Content-Type": "image/webp", "cache-control": "max-age=31536000", "x-upsert": "true" },
    body: buffer,
  });
  if (!res.ok) throw new Error(`upload ${objectPath}: ${res.status} ${await res.text()}`);
}

async function repoint(id, storagePath, width, height) {
  const res = await fetch(`${BASE}/rest/v1/media_assets?id=eq.${id}`, {
    method: "PATCH",
    headers: { ...authHeaders, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify({ storage_path: storagePath, width, height }),
  });
  if (!res.ok) throw new Error(`update ${id}: ${res.status} ${await res.text()}`);
}

const q = (v) => (v === null || v === undefined ? "null" : typeof v === "number" ? String(v) : `'${String(v).replace(/'/g, "''")}'`);

async function processAsset(asset, stats, changes, missing) {
  const src = bucketPath(asset.storage_path ?? "");
  if (!src) return void stats.external++;
  if (src.startsWith(PREFIX)) return void stats.already++;

  const res = await fetch(`${publicPrefix}${encode(src)}`);
  if (!res.ok) return void missing.push({ id: asset.id, storagePath: asset.storage_path, status: res.status });
  const original = Buffer.from(await res.arrayBuffer());

  let meta;
  try {
    meta = await sharp(original).metadata();
  } catch {
    return void missing.push({ id: asset.id, storagePath: asset.storage_path, status: "unreadable" });
  }
  if ((meta.pages ?? 1) > 1) return void stats.animated++;

  const full = await sharp(original)
    .rotate()
    .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: "inside", withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer({ resolveWithObject: true });
  // A small source that's already a well-compressed WebP can come out
  // larger after re-encoding -- keep its original bytes in that case.
  const fitsAlready = meta.format === "webp" && Math.max(meta.width ?? 0, meta.height ?? 0) <= MAX_DIMENSION && !meta.orientation;
  if (fitsAlready && original.length <= full.data.length) {
    full.data = original;
    full.info = { ...full.info, width: meta.width, height: meta.height };
  }
  const variants = await Promise.all(
    VARIANT_WIDTHS.map(async (w) => ({ w, buffer: await sharp(full.data).resize({ width: w, withoutEnlargement: true }).webp({ quality: WEBP_QUALITY }).toBuffer() })),
  );

  const target = `${PREFIX}${src.replace(/\.[^./]+$/, "")}.webp`;
  stats.processed++;
  stats.bytesBefore += original.length;
  stats.bytesAfter += full.data.length;
  stats.bytesAfterCard += variants[0].buffer.length;

  const change = { id: asset.id, from: asset.storage_path, to: target, oldWidth: asset.width, oldHeight: asset.height, width: full.info.width, height: full.info.height };
  if (COMMIT) {
    await Promise.all([upload(target, full.data), ...variants.map((v) => upload(target.replace(/\.webp$/, `.w${v.w}.webp`), v.buffer))]);
    appendFileSync(CHANGE_LOG, JSON.stringify(change) + "\n"); // before the repoint, so the undo log never misses a changed row
    await repoint(asset.id, target, full.info.width, full.info.height);
  }
  changes.push(change);
}

const assets = (await fetchAllAssets()).slice(0, LIMIT);
const stats = { total: assets.length, processed: 0, already: 0, external: 0, animated: 0, failed: 0, bytesBefore: 0, bytesAfter: 0, bytesAfterCard: 0 };
const changes = [];
const missing = [];

let next = 0;
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (next < assets.length) {
      const asset = assets[next++];
      try {
        await processAsset(asset, stats, changes, missing);
      } catch (error) {
        stats.failed++;
        console.error(`FAILED ${asset.id} ${asset.storage_path}: ${error.message}`);
      }
      if (next % 250 === 0) console.error(`... ${next}/${assets.length}`);
    }
  }),
);

const mb = (n) => `${(n / 1e6).toFixed(1)} MB`;
console.log({ ...stats, missing: missing.length, bytesBefore: mb(stats.bytesBefore), bytesAfter: mb(stats.bytesAfter), bytesAfterCard: mb(stats.bytesAfterCard) });

if (COMMIT && existsSync(CHANGE_LOG)) {
  // Whole history across runs, last entry per asset wins.
  const byId = new Map(readFileSync(CHANGE_LOG, "utf8").trim().split("\n").map((l) => JSON.parse(l)).map((c) => [c.id, c]));
  const changes = [...byId.values()].sort((a, b) => a.id.localeCompare(b.id));
  writeFileSync(
    path.join(ROOT, `supabase/migrations/20261115001500_optimized_media_paths.sql`),
    `-- Repoints ${changes.length} image assets at their optimized WebP copies under\n-- opt/ (each with .w640/.w1280 size variants alongside), written by\n-- scripts/optimize-media-variants.mjs. Originals were left in place --\n-- scripts/output/optimized-media-revert.sql restores the old paths.\n-- Already applied directly against the live DB; this file keeps a\n-- from-scratch replay in sync (it assumes the opt/ objects exist).\n` +
      changes.map((c) => `update media_assets set storage_path = ${q(c.to)}, width = ${q(c.width)}, height = ${q(c.height)} where id = ${q(c.id)};`).join("\n") +
      "\n",
  );
  writeFileSync(
    path.join(ROOT, "scripts/output/optimized-media-revert.sql"),
    `-- Undo for scripts/optimize-media-variants.mjs: points every changed asset\n-- back at its untouched original file.\n` +
      changes.map((c) => `update media_assets set storage_path = ${q(c.from)}, width = ${q(c.oldWidth)}, height = ${q(c.oldHeight)} where id = ${q(c.id)};`).join("\n") +
      "\n",
  );
}
writeFileSync(path.join(ROOT, "scripts/output/missing-media-assets.json"), JSON.stringify(missing, null, 2) + "\n");
