#!/usr/bin/env node
// Backfill for new entries in IMAGE_VARIANT_WIDTHS (src/lib/media/types.ts):
// for every optimized image asset (storage_path under opt/), writes the
// missing ".w<width>.webp" siblings, resized from the asset's own full-size
// opt/ WebP. Only adds files -- never touches media_assets rows or any
// existing object -- so it's safe to run before the code that requests the
// new widths is deployed (and that code must not ship until this finishes).
//
// Lighthouse flagged cards downloading the 1280px variant to fill ~720
// device pixels (412px phone viewport x 1.75 DPR); with only 640/1280 to
// choose from, anything over 640 got the 1280 file.
//
// Resumable: finished asset ids are appended to scripts/output/
// media-size-variants-done.txt and skipped on a re-run.
//
// Usage:
//   SUPABASE_URL=https://<ref>.supabase.co SUPABASE_SERVICE_ROLE_KEY=... \
//     node scripts/add-media-size-variants.mjs [--limit N]

import { appendFileSync, existsSync, readFileSync } from "node:fs";
import path from "node:path";

import sharp from "sharp";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const LIMIT = Number(process.argv[process.argv.indexOf("--limit") + 1]) || Infinity;
const BASE = (process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!BASE) {
  console.error("Set SUPABASE_URL (and SUPABASE_SERVICE_ROLE_KEY) first.");
  process.exit(1);
}

// The widths being added -- the rest of IMAGE_VARIANT_WIDTHS (640, 1280)
// already exist for every opt/ asset (scripts/optimize-media-variants.mjs).
const NEW_WIDTHS = [480, 768, 960];
const WEBP_QUALITY = 80; // same as src/lib/media/compress-image.ts
const CONCURRENCY = 16;
const DONE_LOG = path.join(ROOT, "scripts/output/media-size-variants-done.txt");

const authHeaders = KEY ? { apikey: KEY, Authorization: `Bearer ${KEY}` } : {};
const encode = (p) => p.split("/").map(encodeURIComponent).join("/");

async function fetchOptimizedAssets() {
  const rows = [];
  for (let offset = 0; ; offset += 1000) {
    const res = await fetch(`${BASE}/rest/v1/media_assets?select=id,storage_path&media_type=eq.image&storage_path=like.opt/*&order=id&limit=1000&offset=${offset}`, {
      headers: authHeaders,
    });
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

async function processAsset(asset, stats) {
  const src = asset.storage_path.replace(/^\/+/, "").replace(/^media\//, "");
  if (!src.endsWith(".webp")) return void stats.skipped++;
  const res = await fetch(`${BASE}/storage/v1/object/public/media/${encode(src)}`);
  if (!res.ok) throw new Error(`download ${src}: ${res.status}`);
  const full = Buffer.from(await res.arrayBuffer());
  await Promise.all(
    NEW_WIDTHS.map(async (width) => {
      const buffer = await sharp(full).resize({ width, withoutEnlargement: true }).webp({ quality: WEBP_QUALITY }).toBuffer();
      await upload(src.replace(/\.webp$/, `.w${width}.webp`), buffer);
      stats.bytes += buffer.length;
    }),
  );
  appendFileSync(DONE_LOG, `${asset.id}\n`);
  stats.done++;
}

const done = new Set(existsSync(DONE_LOG) ? readFileSync(DONE_LOG, "utf8").split("\n").filter(Boolean) : []);
const assets = (await fetchOptimizedAssets()).filter((a) => !done.has(a.id)).slice(0, LIMIT);
const stats = { todo: assets.length, alreadyDone: done.size, done: 0, skipped: 0, failed: 0, bytes: 0 };
console.error(`${assets.length} assets to process (${done.size} already done)`);

let next = 0;
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (next < assets.length) {
      const asset = assets[next++];
      try {
        await processAsset(asset, stats);
      } catch (error) {
        stats.failed++;
        console.error(`FAILED ${asset.id} ${asset.storage_path}: ${error.message}`);
      }
      if (next % 250 === 0) console.error(`... ${next}/${assets.length}`);
    }
  }),
);

console.log({ ...stats, bytes: `${(stats.bytes / 1e6).toFixed(1)} MB` });
