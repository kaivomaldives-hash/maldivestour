#!/usr/bin/env node
// Generates supabase/migrations/20261024000100_fishing_pickup_locations.sql
//
// The owner confirmed their real fishing charters (Himmafushi/Yuvi Blue,
// fly fishing, MFH, and the other seeded fishing products) do pickups
// across the same resort/island network as the excursions tagged by
// add-excursion-pickup-locations.mjs — so this applies the identical
// pickup list to every fishing-category activity in the database.
//
// See scripts/lib/resort-island-pickup-locations.mjs for the resort/
// island list and the resort->island resolution rationale (resorts
// resolve via their accommodation node's own primary location, never as
// a locations row themselves).
//
// Resolution is done by the migration's own SQL at apply time (ILIKE
// against accommodation titles / exact slug against island locations),
// not baked-in UUIDs, so it reflects whatever the live database actually
// has — this sandbox has no DB credentials to verify matches itself.
// Run the verification SELECT (given separately to the owner) after
// applying to see any name that matched zero rows.

import { writeFileSync } from "node:fs";
import path from "node:path";
import { ROOT } from "./lib/legacy-shared.mjs";
import { RESORTS, ISLAND_SLUGS, sqlQuote, buildTargetLocationsCte } from "./lib/resort-island-pickup-locations.mjs";

// Every node_type='activity' row with activities.activity_category =
// 'fishing' in the current migration set, found by scanning every
// `insert into activities (...) select n.id, 'fishing', ...` block for
// its `n.slug = '...'` condition (scripts/add-fishing-pickup-locations.mjs
// commit message has the exact command used) — not hand-picked, so a
// product added after this was generated needs a re-run of this script.
const TARGET_ACTIVITY_SLUGS = [
  "big-game-fishing-trip",
  "big-game-fishing-trip-lankanfushi",
  "fishing-is-a-family-matter",
  "fly-fishing-full-day-charter",
  "fly-fishing-half-day-charter",
  "golden-reel-adventure",
  "himmafushi-fishing-trip",
  "himmafushi-full-day-fishing-charter",
  "himmafushi-half-day-fishing-charter",
  "marlin-big-game-fishing-charter",
  "night-fishing-excursion",
  "night-fishing-trip",
  "private-full-day-fishing-charter",
  "private-half-day-fishing-charter",
  "private-sport-fishing-trip",
  "sunset-fishing-trip",
  "sunset-fishing-trip-maafushi",
  "sunset-reef-fishing",
  "traditional-handline-fishing-trip",
];

function buildSql() {
  return `-- Tags every fishing-category activity with every resort and local
-- island on the owner's pickup list, as secondary node_locations rows,
-- so each resort/island's own page can surface these as nearby
-- activities, and a "fishing in <island>" style search can match them.
-- The owner confirmed their fishing charters do pickups across this same
-- resort/island network as the Male Atoll excursions (see
-- 20261023000100_excursion_pickup_locations.sql, which tags the
-- excursion/city-tour products with the identical list).
--
-- Resorts resolve via their own accommodation node's PRIMARY location
-- (locations.id references nodes(id) directly; a resort is its own
-- node_type='accommodation' row, never a locations row) — a handful have
-- no distinct island node in this dataset and only ever resolved to the
-- Kaafu atoll (same gap documented in 20250126000100_fix_fake_resort_
-- islands.sql). Local islands given by name resolve by exact slug.
--
-- GENERATED FILE, regenerate with:
--   node scripts/add-fishing-pickup-locations.mjs

with target_activities as (
  select id from nodes where node_type = 'activity' and slug in (
    ${TARGET_ACTIVITY_SLUGS.map(sqlQuote).join(",\n    ")}
  )
),
target_locations as (
${buildTargetLocationsCte()}
)
insert into node_locations (node_id, location_id, relation)
select ta.id, tl.location_id, 'secondary'
from target_activities ta
cross join (select distinct location_id from target_locations where location_id is not null) tl
on conflict (node_id, location_id) do nothing;
`;
}

function main() {
  const sql = buildSql();
  const outPath = path.join(ROOT, "supabase/migrations/20261024000100_fishing_pickup_locations.sql");
  writeFileSync(outPath, sql);
  console.log(`Wrote ${path.relative(ROOT, outPath)}`);
  console.log(`${TARGET_ACTIVITY_SLUGS.length} target activities x up to ${RESORTS.length + ISLAND_SLUGS.length} locations.`);
}

main();
