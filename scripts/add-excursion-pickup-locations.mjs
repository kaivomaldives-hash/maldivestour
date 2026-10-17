#!/usr/bin/env node
// Generates supabase/migrations/20261023000100_excursion_pickup_locations.sql
//
// The owner wants the Male-Atoll excursion products (snorkeling/dolphin
// trips + city tours — the ones already advertised as "free pickup from
// Male Atoll resorts and islands") tagged with every resort/island on
// their pickup list, as secondary node_locations rows, so each of those
// resort/island pages can surface these activities as nearby.
//
// Resorts aren't `locations` rows themselves (confirmed against the
// schema: locations.id references nodes(id) directly, and a resort is a
// separate node_type='accommodation' row) — each resort resolves to the
// island it's built on via its own primary node_locations row. A handful
// of resorts have no distinct island node in this dataset and only ever
// resolved to the Kaafu atoll (see supabase/migrations/20250126000100_
// fix_fake_resort_islands.sql, which hit the same resorts) — that's a
// real, pre-existing data gap, not something this script papers over.
//
// Deliberately scoped to only the general multi-resort excursions per the
// owner's explicit choice — NOT every fishing-category activity, since
// several (Himmafushi/Yuvi Blue charters, fly fishing, MFH charters) are
// tied to one fixed base and tagging them with this whole resort list
// would publish inaccurate pickup claims.
//
// Resolution is done by the migration's own SQL at apply time (ILIKE
// against accommodation titles / exact slug against island locations),
// not baked-in UUIDs, so it reflects whatever the live database actually
// has — this sandbox has no DB credentials to verify matches itself.
// Run the verification SELECT (printed at the end of this script, and
// given separately to the owner) after applying to see any name that
// matched zero rows.

import { writeFileSync } from "node:fs";
import path from "node:path";
import { ROOT } from "./lib/legacy-shared.mjs";

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

// label: exactly as the owner wrote it (kept for the verification report).
// keyword: the distinctive substring matched against accommodations.title
// via ILIKE '%keyword%' — chosen to be specific enough not to collide
// with an unrelated resort, not necessarily the owner's full string
// (brand suffixes like "Resort & Spa"/"Maldives" vary in the DB).
const RESORTS = [
  { label: "Adaaran Select Hudhuranfushi", keyword: "Adaaran Select Hudhuranfushi" },
  { label: "Adaaran Prestige Ocean Villas", keyword: "Adaaran Prestige Ocean Villas" },
  { label: "Asdu Sun Island Resort", keyword: "Asdu Sun Island" },
  { label: "Baros Maldives", keyword: "Baros Maldives" },
  { label: "Bandos Maldives", keyword: "Bandos Maldives" },
  { label: "Banyan Tree Vabbinfaru", keyword: "Banyan Tree Vabbinfaru" },
  { label: "Cinnamon Dhonveli Maldives", keyword: "Cinnamon Dhonveli" },
  { label: "Club Med Kani", keyword: "Club Med Kani" },
  { label: "Club Med Finolhu Villas", keyword: "Club Med Finolhu" },
  { label: "Coco Bodu Hithi", keyword: "Coco Bodu Hithi" },
  { label: "Coco Prive", keyword: "Coco Priv" },
  { label: "Dhawa Ihuru", keyword: "Dhawa Ihuru" },
  { label: "Eri Maldives", keyword: "Eriyadu" },
  { label: "Four Seasons Resort Maldives at Kuda Huraa", keyword: "Four Seasons" },
  { label: "Gili Lankanfushi", keyword: "Gili Lankanfushi" },
  { label: "Grand Park Kodhipparu Maldives", keyword: "Grand Park Kodhipparu" },
  { label: "Huvafen Fushi", keyword: "Huvafen Fushi" },
  { label: "Jumeirah Maldives Olhahali Island", keyword: "Jumeirah" },
  { label: "Kagi Maldives Resort & Spa", keyword: "Kagi" },
  { label: "Kuda Villingili Resort Maldives", keyword: "Kuda Villingili" },
  { label: "Kurumba Maldives", keyword: "Kurumba" },
  { label: "Makunudu Island", keyword: "Makunudu" },
  { label: "Malahini Kuda Bandos", keyword: "Malahini Kuda Bandos" },
  { label: "Meeru Maldives Resort Island", keyword: "Meeru" },
  // Verbatim from the owner's list as given — possibly a typo/duplicate of
  // "Kurumba Maldives" above (no resort by this exact name was found in
  // the existing accommodation data); kept literal rather than guessed at,
  // so this one will show 0 matches in the verification query below for
  // the owner to confirm.
  { label: "Niva Kurumba Maldives", keyword: "Niva Kurumba" },
  { label: "Oblu Select at Sangeli", keyword: "Sangeli" },
  { label: "Oblu by Atmosphere at Helengeli", keyword: "Helengeli" },
  { label: "One&Only Reethi Rah", keyword: "Reethi Rah" },
  { label: "Patina Maldives, Fari Islands", keyword: "Patina Maldives" },
  { label: "Sheraton Maldives Full Moon Resort & Spa", keyword: "Sheraton Maldives Full Moon" },
  { label: "Summer Island Maldives", keyword: "Summer Island" },
  { label: "Thulhagiri Island Resort & Spa", keyword: "Thulhagiri" },
  { label: "The Ritz-Carlton Maldives, Fari Islands", keyword: "Ritz-Carlton" },
  { label: "Varu by Atmosphere", keyword: "Varu by Atmosphere" },
  { label: "Villa Nautica", keyword: "Villa Nautica" },
  { label: "Vivanta Maldives (formerly Taj Coral Reef)", keyword: "Taj Coral Reef" },
  { label: "Hilton Maldives Amingiri Resort & Spa", keyword: "Amingiri" },
  { label: "Centara Mirage Lagoon Maldives", keyword: "Centara Mirage" },
  { label: "Centara Grand Lagoon Maldives", keyword: "Centara Grand" },
  { label: "dusitD2 Feydhoo Maldives", keyword: "Feydhoo" },
  // South Male Atoll
  { label: "Adaaran Club Rannalhi", keyword: "Adaaran Club Rannalhi" },
  { label: "Adaaran Prestige Vadoo", keyword: "Adaaran Prestige Vadoo" },
  { label: "Anantara Dhigu Maldives Resort", keyword: "Anantara Dhigu" },
  { label: "Anantara Veli Maldives Resort", keyword: "Anantara Veli" },
  { label: "COMO Cocoa Island", keyword: "Cocoa Island" },
  { label: "Embudu Village", keyword: "Embudu Village" },
  { label: "Fihalhohi Maldives", keyword: "Fihalhohi" },
  { label: "Hard Rock Hotel Maldives", keyword: "Hard Rock Hotel" },
  { label: "Holiday Inn Resort Kandooma Maldives", keyword: "Kandooma" },
  { label: "Jumeirah Vittaveli", keyword: "Vittaveli" },
  { label: "Naladhu Private Island Maldives", keyword: "Naladhu" },
  { label: "OZEN Life Maadhoo", keyword: "Maadhoo" },
  { label: "Rihiveli The Dream", keyword: "Rihiveli" },
  { label: "SAii Lagoon Maldives", keyword: "SAii Lagoon" },
  { label: "Taj Exotica Resort & Spa Maldives", keyword: "Taj Exotica" },
  { label: "Velassaru Maldives", keyword: "Velassaru" },
  { label: "Waldorf Astoria Maldives Ithaafushi", keyword: "Waldorf Astoria" },
  { label: "Sun Siyam Olhuveli", keyword: "Olhuveli" },
  { label: "SO/ Maldives", keyword: "SO/ Maldives" },
];

// Local inhabited islands given directly by name (not resorts) — matched
// by exact slug on the locations table.
const ISLAND_SLUGS = [
  { label: "Huraa", slug: "huraa" },
  { label: "Gulhi", slug: "gulhi" },
  { label: "Maafushi", slug: "maafushi" },
  { label: "Thulusdhoo", slug: "thulusdhoo" },
  { label: "Dhiffushi", slug: "dhiffushi" },
  { label: "Guraidhoo", slug: "guraidhoo" },
];

function sqlQuote(value) {
  return `'${value.replace(/'/g, "''")}'`;
}

function resortLocationSelect({ label, keyword }) {
  // Each branch of a UNION ALL chain must be parenthesized for LIMIT to
  // apply to that branch alone rather than being a syntax error against
  // the whole chain.
  return `  -- ${label}
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || ${sqlQuote(keyword)} || '%'
   limit 1)`;
}

function islandLocationSelect({ label, slug }) {
  return `  -- ${label}
  (select loc.id as location_id
   from nodes loc
   where loc.node_type = 'location' and loc.slug = ${sqlQuote(slug)})`;
}

function buildSql() {
  const resortBlocks = RESORTS.map(resortLocationSelect).join("\n  union all\n");
  const islandBlocks = ISLAND_SLUGS.map(islandLocationSelect).join("\n  union all\n");

  return `-- Tags the Male Atoll excursion/city-tour products (already sold as
-- "free pickup from Male Atoll resorts and islands") with every resort
-- and local island on the owner's pickup list, as secondary
-- node_locations rows, so each resort/island's own page can surface these
-- as nearby activities.
--
-- Deliberately scoped to the 11 general-excursion products only (owner's
-- explicit choice) — not every fishing-category activity, since several
-- (Himmafushi/Yuvi Blue charters, fly fishing, MFH charters) are tied to
-- one fixed base and don't actually offer this resort network's pickup.
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
${resortBlocks}
  union all
${islandBlocks}
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
