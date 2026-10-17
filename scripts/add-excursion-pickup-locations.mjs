#!/usr/bin/env node
// Generates supabase/migrations/20261023000100_excursion_pickup_locations.sql
//
// The owner wants the Male-Atoll excursion products (snorkeling/dolphin
// trips + city tours — the ones already advertised as "free pickup from
// Male Atoll resorts and islands") tagged with every resort/island on
// their pickup list, as secondary node_locations rows, so each of those
// resort/island pages can surface these activities as nearby.
//
// The resort/island list itself and the SQL that resolves each one to a
// location_id live in scripts/lib/resort-island-pickup-locations.mjs,
// shared with add-fishing-pickup-locations.mjs (the owner later confirmed
// their fishing charters use this same pickup network too) — see that
// module's own comment for the resort->island resolution rationale.
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

const TARGET_ACTIVITY_SLUGS = [
  // Male Atoll excursions already sold as "free pickup from Male Atoll resorts and islands"
  "full-day-excursion-male-atoll",
  "vaavu-atoll-excursion",
  "stingray-snorkeling",
  "nurse-shark-snorkeling",
  "sandbank-and-snorkeling-excursion",
  "dolphin-excursion",
  // Male City Tour products (also resort-pickup based)
  "male-city-walking-tour",
  "male-city-bike-tour",
  "male-city-car-tour",
  "male-city-half-day-walking-tour",
  "male-city-half-day-bike-tour",
];

function buildSql() {
  return `-- Tags the Male Atoll excursion/city-tour products (already sold as
-- "free pickup from Male Atoll resorts and islands") with every resort
-- and local island on the owner's pickup list, as secondary
-- node_locations rows, so each resort/island's own page can surface these
-- as nearby activities.
--
-- Resorts resolve via their own accommodation node's PRIMARY location
-- (locations.id references nodes(id) directly; a resort is its own
-- node_type='accommodation' row, never a locations row) — a handful have
-- no distinct island node in this dataset and only ever resolved to the
-- Kaafu atoll (same gap documented in 20250126000100_fix_fake_resort_
-- islands.sql). Local islands given by name resolve by exact slug.
--
-- GENERATED FILE, regenerate with:
--   node scripts/add-excursion-pickup-locations.mjs

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
  const outPath = path.join(ROOT, "supabase/migrations/20261023000100_excursion_pickup_locations.sql");
  writeFileSync(outPath, sql);
  console.log(`Wrote ${path.relative(ROOT, outPath)}`);
  console.log(`${TARGET_ACTIVITY_SLUGS.length} target activities x up to ${RESORTS.length + ISLAND_SLUGS.length} locations.`);
}

main();
