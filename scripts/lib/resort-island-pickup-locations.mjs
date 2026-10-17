// Shared data + SQL-building helpers for the owner's North/South Male
// Atoll resort + local-island pickup list, used by every
// add-*-pickup-locations.mjs generator (excursions, fishing charters, and
// any future batch) so the list is defined once, not copy-pasted per
// script. See add-excursion-pickup-locations.mjs for the full rationale
// (resorts resolve via their accommodation node's own primary location,
// never as a locations row themselves).

// label: exactly as the owner wrote it (kept for the verification report).
// keyword: the distinctive substring matched against accommodations.title
// via ILIKE '%keyword%' — chosen to be specific enough not to collide
// with an unrelated resort, not necessarily the owner's full string
// (brand suffixes like "Resort & Spa"/"Maldives" vary in the DB).
export const RESORTS = [
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
  // so this one will show 0 matches in the verification query for the
  // owner to confirm.
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
export const ISLAND_SLUGS = [
  { label: "Huraa", slug: "huraa" },
  { label: "Gulhi", slug: "gulhi" },
  { label: "Maafushi", slug: "maafushi" },
  { label: "Thulusdhoo", slug: "thulusdhoo" },
  { label: "Dhiffushi", slug: "dhiffushi" },
  { label: "Guraidhoo", slug: "guraidhoo" },
];

export function sqlQuote(value) {
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

/** The full `target_locations` CTE body (every resort + island select,
 * joined with UNION ALL) — shared verbatim by every pickup-locations
 * generator script. */
export function buildTargetLocationsCte() {
  const resortBlocks = RESORTS.map(resortLocationSelect).join("\n  union all\n");
  const islandBlocks = ISLAND_SLUGS.map(islandLocationSelect).join("\n  union all\n");
  return `${resortBlocks}\n  union all\n${islandBlocks}`;
}
