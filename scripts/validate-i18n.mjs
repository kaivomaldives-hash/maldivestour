#!/usr/bin/env node
// Task 19 §48: pre-deploy sanity checks over the live translation data --
// catches the specific failure modes a manual review is likely to miss:
// a published row with no route to serve it (dead hreflang target), a
// slug collision between two tables that would make two different
// resolvers claim the same URL, or a translation row accidentally
// created for locale='en' (English is the canonical content -- it must
// never also have a translation row).
//
// This is a read-only report, not a migration -- it never writes to the
// database. Non-zero exit code on any failed check, so it can gate CI.
//
// Usage:
//   DATABASE_URL="postgresql://postgres:PASSWORD@HOST:5432/postgres" \
//     node scripts/validate-i18n.mjs

import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("Set DATABASE_URL first (see scripts/run-sql-file.mjs's header comment for where to find it).");
  process.exit(1);
}

// Mirrors src/lib/i18n/locales.ts -- kept as a small duplicated constant
// rather than importing the TS module, since this plain .mjs script runs
// outside Next's build/type pipeline (same convention as this repo's
// other one-off scripts/*.mjs files).
const SUPPORTED_LOCALES = ["en", "de", "fr", "es", "it", "ru", "zh", "ja", "ko"];
const DEFAULT_LOCALE = "en";

// Which page_key values currently have an implemented src/app/[locale]/...
// route to actually serve a published translation. A page_key not listed
// here would mean a published row nobody can ever reach -- exactly the
// "dead hreflang target" case this script exists to catch.
const PAGE_KEY_ROUTE_FILE = {
  homepage: "src/app/[locale]/page.tsx",
  "maldives-hub": "src/app/[locale]/maldives/page.tsx",
};

const { Client } = await import("pg");
const client = new Client({ connectionString });
await client.connect();

const errors = [];
const warnings = [];

try {
  const { rows: pageRows } = await client.query(
    `select page_key, locale, slug, title, translation_status from page_translations order by page_key, locale`
  );
  const { rows: entityRows } = await client.query(
    `select entity_id, entity_type, locale, slug, title, translation_status from translations order by entity_type, locale`
  );

  const publishedPages = pageRows.filter((r) => r.translation_status === "published");
  const publishedEntities = entityRows.filter((r) => r.translation_status === "published");

  // 1. English must never have a translation row (it *is* the canonical
  // content -- see src/lib/i18n/repository.ts's `if (locale === "en") return null`
  // guards, which this checks the data actually respects).
  for (const r of [...pageRows, ...entityRows]) {
    if (r.locale === "en") errors.push(`English translation row found (should never exist): ${r.entity_id ?? r.page_key} / en`);
  }

  // 2. locale must be one of the 9 supported codes.
  for (const r of [...pageRows, ...entityRows]) {
    if (!SUPPORTED_LOCALES.includes(r.locale)) errors.push(`Unsupported locale code "${r.locale}" on ${r.entity_id ?? r.page_key}`);
  }

  // 3. Every published page_translations row must have an implemented
  // [locale] route, or it's a published row with no way to serve it.
  for (const r of publishedPages) {
    const routeFile = PAGE_KEY_ROUTE_FILE[r.page_key];
    if (!routeFile) {
      errors.push(`Published page_translations row for page_key="${r.page_key}" locale="${r.locale}" has no known [locale] route -- would 404.`);
      continue;
    }
    if (!existsSync(path.join(repoRoot, routeFile))) {
      errors.push(`Route file ${routeFile} for page_key="${r.page_key}" is missing on disk.`);
    }
  }

  // 4. Required fields non-empty. Slug may legitimately be "" only for
  // the homepage (its canonical path IS the locale root, "/{locale}/").
  for (const r of publishedPages) {
    if (!r.title?.trim()) errors.push(`Empty title: page_translations ${r.page_key}/${r.locale}`);
    if (r.slug === null || r.slug === undefined) errors.push(`Null slug: page_translations ${r.page_key}/${r.locale}`);
    if (r.slug === "" && r.page_key !== "homepage") errors.push(`Empty slug on non-homepage page_translations row: ${r.page_key}/${r.locale}`);
  }
  for (const r of publishedEntities) {
    if (!r.title?.trim()) errors.push(`Empty title: translations ${r.entity_type}/${r.entity_id}/${r.locale}`);
    if (!r.slug?.trim()) errors.push(`Empty slug: translations ${r.entity_type}/${r.entity_id}/${r.locale}`);
  }

  // 5. No duplicate (locale, slug) within each table -- the DB's own
  // unique constraints already prevent this at write time, but a
  // constraint added later than existing data, or a direct psql insert
  // bypassing the app, wouldn't be caught anywhere else.
  function checkDuplicates(rows, label) {
    const seen = new Map();
    for (const r of rows) {
      const key = `${r.locale}::${r.slug}`;
      if (seen.has(key)) errors.push(`Duplicate (locale, slug) in ${label}: ${key} (${seen.get(key)} and ${r.entity_id ?? r.page_key})`);
      else seen.set(key, r.entity_id ?? r.page_key);
    }
  }
  checkDuplicates(pageRows, "page_translations");
  checkDuplicates(entityRows, "translations");

  // 6. Cross-table slug collision: the same (locale, slug) claimed by
  // both a page and an entity would make two different resolvers race
  // for the same incoming URL.
  const pageSlugKeys = new Set(pageRows.filter((r) => r.slug).map((r) => `${r.locale}::${r.slug}`));
  for (const r of entityRows) {
    const key = `${r.locale}::${r.slug}`;
    if (pageSlugKeys.has(key)) errors.push(`Cross-table slug collision at ${key}: exists in both page_translations and translations.`);
  }

  // 7. Reciprocal hreflang sanity: for each page_key, every published
  // locale's alternates are built from the *same* published-locale set
  // (src/lib/seo/site.ts's hreflangAlternates always includes every
  // published locale + x-default -> English by construction), so this
  // just confirms there's at least one published locale per page_key
  // that has any published row at all, and that x-default's target
  // (the plain English route) actually exists.
  const pageKeysWithPublished = new Set(publishedPages.map((r) => r.page_key));
  for (const pageKey of pageKeysWithPublished) {
    if (pageKey === "homepage" && !existsSync(path.join(repoRoot, "src/app/page.tsx"))) {
      errors.push(`x-default target missing: src/app/page.tsx (English homepage) for hreflang on page_key="homepage"`);
    }
    if (pageKey === "maldives-hub" && !existsSync(path.join(repoRoot, "src/app/maldives/page.tsx"))) {
      errors.push(`x-default target missing: src/app/maldives/page.tsx (English hub) for hreflang on page_key="maldives-hub"`);
    }
  }

  // 8. Informational: report translation coverage so this doubles as a
  // quick status check, not just a pass/fail gate.
  const localeCounts = {};
  for (const l of SUPPORTED_LOCALES) {
    if (l === DEFAULT_LOCALE) continue;
    localeCounts[l] = {
      pages: publishedPages.filter((r) => r.locale === l).length,
      entities: publishedEntities.filter((r) => r.locale === l).length,
    };
  }

  console.log("i18n validation report");
  console.log("=======================");
  console.log(`Published page_translations rows: ${publishedPages.length} (of ${pageRows.length} total)`);
  console.log(`Published translations rows:      ${publishedEntities.length} (of ${entityRows.length} total)`);
  console.log("");
  console.log("Published coverage by locale:");
  for (const [locale, counts] of Object.entries(localeCounts)) {
    console.log(`  ${locale}: ${counts.pages} pages, ${counts.entities} entities`);
  }
  console.log("");

  if (warnings.length > 0) {
    console.log(`Warnings (${warnings.length}):`);
    for (const w of warnings) console.log(`  - ${w}`);
    console.log("");
  }

  if (errors.length > 0) {
    console.log(`FAILED -- ${errors.length} error(s):`);
    for (const e of errors) console.log(`  - ${e}`);
    process.exitCode = 1;
  } else {
    console.log("PASSED -- no errors found.");
  }
} finally {
  await client.end();
}
