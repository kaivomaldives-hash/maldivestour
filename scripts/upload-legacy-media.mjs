#!/usr/bin/env node
// Task 14 §17-19: upload the legacy media files referenced by the
// generated Task 14 SQL migrations to Supabase Storage's `media` bucket.
//
// This script's ONLY input is the union of
// data/maldives/media/media-storage-manifest.json,
// data/maldives/content/article-storage-manifest.json, and
// data/maldives/migration/task20-ferry-storage-manifest.json — the
// manifests scripts/import-legacy-media.mjs,
// scripts/import-legacy-articles.mjs, and
// scripts/build-transfers-platform-v2.mjs write (in --commit mode)
// alongside their generated SQL, listing exactly the media_assets rows
// those migrations create. Uploading precisely that set (never a broader
// guess, e.g. "every high-confidence match") is what keeps "files
// actually in Storage" and "DB rows that reference them" from drifting
// apart.
//
// Dry run (default, no network/credentials required): reports what WOULD
// be uploaded — local file, target storage path, size — and flags any
// manifest entry whose source file is missing on disk.
// --commit: uploads for real via the Supabase Storage API using the
// service-role key. Requires NEXT_PUBLIC_SUPABASE_URL and
// SUPABASE_SERVICE_ROLE_KEY (see .env.local / .env.example) AND real
// network access to the Supabase project. This sandbox cannot reach
// Supabase (see the Task 14 final report) — running --commit here will
// fail at the client-construction or first-request step. That is the
// correct, honest behavior, not a bug: this script must be run from an
// environment with real Supabase access to actually populate Storage.
//
// Usage:
//   node scripts/upload-legacy-media.mjs            # dry run
//   node scripts/upload-legacy-media.mjs --commit    # real upload (needs live Supabase)

import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

import { DATA_DIR, RELEASE_DIR, ROOT } from "./lib/legacy-shared.mjs";

const COMMIT = process.argv.includes("--commit");
const BUCKET = "media";

const CONTENT_TYPE_BY_EXT = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
};

/** .env.local is a plain KEY=VALUE file (no shell interpolation) — this
 * loader is only ever used by this dev script, not the Next.js app itself
 * (which loads it natively), so a small hand-rolled parser avoids adding a
 * dotenv dependency for one script. */
function loadEnvLocal() {
  const envPath = path.join(ROOT, ".env.local");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

function loadManifest(relPath) {
  const full = path.join(ROOT, relPath);
  if (!existsSync(full)) return [];
  const parsed = JSON.parse(readFileSync(full, "utf8"));
  return parsed.files ?? [];
}

function mergeManifests() {
  const mediaManifest = loadManifest("data/maldives/media/media-storage-manifest.json");
  const articleManifest = loadManifest("data/maldives/content/article-storage-manifest.json");
  const ferryManifest = loadManifest("data/maldives/migration/task20-ferry-storage-manifest.json");
  const routeImageManifest = loadManifest("data/maldives/migration/transfer-route-image-manifest.json");
  const categoryImageManifest = loadManifest("data/maldives/migration/transfer-category-image-manifest.json");
  const fullLibraryManifest = loadManifest("data/maldives/migration/full-legacy-image-library-manifest.json");
  const uploadedMediaManifest = loadManifest("data/maldives/migration/uploaded-media-manifest.json");

  const byId = new Map();
  const conflicts = [];
  for (const entry of [...mediaManifest, ...articleManifest, ...ferryManifest, ...routeImageManifest, ...categoryImageManifest, ...fullLibraryManifest, ...uploadedMediaManifest]) {
    const existing = byId.get(entry.mediaId);
    if (!existing) {
      byId.set(entry.mediaId, entry);
    } else if (existing.storagePath !== entry.storagePath) {
      // Should be structurally impossible after storagePathForRelativePath
      // was centralized (Task 14) — kept as a loud safety check, not a
      // silent fallback, in case that invariant is ever broken by a future
      // edit to either generator script.
      conflicts.push({ mediaId: entry.mediaId, a: existing.storagePath, b: entry.storagePath });
    }
  }
  return { files: [...byId.values()], conflicts };
}

function main() {
  loadEnvLocal();

  const { files, conflicts } = mergeManifests();
  if (files.length === 0) {
    console.error(
      "No storage manifests found. Run `node scripts/import-legacy-media.mjs --commit` and " +
        "`node scripts/import-legacy-articles.mjs --commit` first to generate them.",
    );
    process.exit(1);
  }
  if (conflicts.length > 0) {
    console.error(`REFUSING to continue: ${conflicts.length} media id(s) have conflicting storage_path values across manifests:`);
    for (const c of conflicts.slice(0, 5)) console.error(`  ${c.mediaId}: ${c.a}  !=  ${c.b}`);
    process.exit(1);
  }

  const resolved = files.map((f) => ({
    ...f,
    // Every manifest's relativePath is relative to RELEASE_DIR (the
    // extracted legacy site export) EXCEPT the owner's own directly
    // -uploaded photos (assets/uploads/...), which live in the repo
    // itself and are relative to ROOT instead.
    localPath: f.relativePath.startsWith("assets/") ? path.join(ROOT, f.relativePath) : path.join(RELEASE_DIR, f.relativePath),
  }));
  const missing = resolved.filter((f) => !existsSync(f.localPath));
  const present = resolved.filter((f) => existsSync(f.localPath));
  const totalBytes = present.reduce((sum, f) => sum + statSync(f.localPath).size, 0);

  console.log(`Storage upload manifest: ${resolved.length} files (${present.length} found on disk, ${missing.length} missing).`);
  console.log(`Total size to upload: ${(totalBytes / (1024 * 1024)).toFixed(1)} MB`);
  if (missing.length > 0) {
    console.log(`\nMissing source files (in manifest but not found under release/public_html/):`);
    for (const f of missing.slice(0, 10)) console.log(`  ${f.relativePath}`);
    if (missing.length > 10) console.log(`  ... and ${missing.length - 10} more`);
  }

  if (!COMMIT) {
    console.log(`\n(dry run — no files uploaded, no network access attempted)`);
    console.log(`Sample of planned uploads:`);
    for (const f of present.slice(0, 5)) console.log(`  ${f.relativePath}  ->  ${BUCKET}/${f.storagePath}`);
    writeUploadReport(present, missing, /* committed */ false, []);
    return;
  }

  runCommit(present, missing).catch((err) => {
    // A previous version of this function awaited nothing at the top
    // level and had no try/catch around the network call — one transient
    // failure (timeout, dropped connection) partway through a
    // 500MB/4000+-file run threw an unhandled rejection and silently
    // killed the whole process with no output at all, which is exactly
    // what happened running this against a real ~4300 file library on a
    // home connection. This is the last-resort net so a crash is at
    // least visible instead of a script that just vanishes.
    console.error(`\nUpload run crashed: ${err.message}`);
    process.exit(1);
  });
}

const MAX_ATTEMPTS_PER_FILE = 3;

async function uploadOneFile(supabase, f) {
  const ext = (f.relativePath.match(/\.[a-zA-Z0-9]+$/)?.[0] ?? "").toLowerCase();
  const contentType = CONTENT_TYPE_BY_EXT[ext] ?? "application/octet-stream";
  const body = readFileSync(f.localPath);

  let lastError = null;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS_PER_FILE; attempt += 1) {
    try {
      const { error } = await supabase.storage.from(BUCKET).upload(f.storagePath, body, { contentType, upsert: true });
      if (!error) return { ok: true };
      lastError = error.message;
    } catch (err) {
      // Network-level throws (timeout, connection reset) — Supabase's
      // client doesn't always surface these as a returned `error`, so
      // this catches them directly rather than letting them propagate
      // and kill the whole run.
      lastError = err instanceof Error ? err.message : String(err);
    }
    if (attempt < MAX_ATTEMPTS_PER_FILE) {
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
  return { ok: false, error: lastError };
}

async function runCommit(present, missing) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    console.error(
      "\n--commit requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY " +
        "(set them in .env.local — see .env.example). Not attempting any upload.",
    );
    process.exit(1);
  }

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(url, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });

  const results = [];
  let uploaded = 0;
  let failed = 0;
  const startedAt = Date.now();

  for (let i = 0; i < present.length; i += 1) {
    const f = present[i];
    const outcome = await uploadOneFile(supabase, f);
    if (outcome.ok) {
      uploaded += 1;
      results.push({ ...f, status: "uploaded" });
    } else {
      failed += 1;
      results.push({ ...f, status: "failed", error: outcome.error });
      console.error(`FAILED  ${f.storagePath}: ${outcome.error}`);
    }

    // Progress every 100 files (or the last one) — a silent multi-minute
    // run with zero output looks identical to a hung/crashed one from the
    // terminal, which is exactly what caused confusion diagnosing this
    // the first time around.
    if ((i + 1) % 100 === 0 || i === present.length - 1) {
      const elapsedSec = Math.round((Date.now() - startedAt) / 1000);
      console.log(`  ${i + 1}/${present.length} processed (${uploaded} uploaded, ${failed} failed) — ${elapsedSec}s elapsed`);
    }

    // Write the report incrementally too, so even if the process does
    // die partway through (killed terminal, machine sleep, etc.) there's
    // a record of what got uploaded so far instead of nothing at all.
    if ((i + 1) % 200 === 0) {
      writeUploadReport(present, missing, true, results, /* complete */ false);
    }
  }

  console.log(`\nUploaded ${uploaded}/${present.length} files (${failed} failed).`);
  writeUploadReport(present, missing, true, results, /* complete */ true);
}

function writeUploadReport(present, missing, committed, results, complete = true) {
  const reportPath = path.join(DATA_DIR, "media", "storage-upload-report.json");
  writeFileSync(
    reportPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        committed,
        // Distinct from `committed` (which just means --commit was
        // passed): a mid-run checkpoint write and the final "the whole
        // batch is done" write both have committed=true, so a reader
        // checking this file to see whether an upload actually finished
        // (e.g. after the terminal running it got closed) needs this
        // field, not `committed`, to tell the two apart.
        complete,
        bucket: BUCKET,
        totalManifestFiles: present.length + missing.length,
        foundOnDisk: present.length,
        missingOnDisk: missing.map((f) => f.relativePath),
        results: committed ? results : present.map((f) => ({ relativePath: f.relativePath, storagePath: f.storagePath, status: "planned" })),
      },
      null,
      2,
    ),
  );
  console.log(`Wrote ${path.relative(ROOT, reportPath)}`);
}

main();
