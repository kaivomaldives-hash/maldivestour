# Maldives Attractions — sources

All 12 entries in `attractions.json` are drawn verbatim (paraphrased for
length, no facts invented) from the "Places to Visit in Male" section
(§3.1–3.14) of the legacy article **"Beautiful Places to Visit in
Maldives"** (`articles.slug = 'beautiful-places-to-visit-in-maldives'`,
already imported by `20250110000300_legacy_articles.sql`). Two of that
section's 14 sub-entries were excluded because they're real inhabited
islands already represented as their own `locations` rows, not standalone
attractions: §3.8 Hulhumalé Island and §3.10 Villingili Island.

Each attraction is seeded as a `locations` row (`location_type = 'poi'`),
parented directly under the real `male` island node — the same
architecture Task 8 established for dive sites (`location_type =
'dive_site'`) and surf breaks (`location_type = 'surf_break'`). No new
table, no duplicate entity model.

## Images

Every image is a real file from the legacy site's own image library
(`data/maldives/migration/full-legacy-image-library-manifest.json`),
matched by the exact `<figure><img src="...">` embedded in that specific
§3.x section of the source article — i.e. the image the legacy site
itself displayed for that landmark, not a name-matched guess. Two
entries had no embedded image in the source article:

- **Victory Monument** — no image available; the card/detail page
  render without a hero image rather than use an unrelated photo.
- **Tsunami Monument** — no image in the source article's own markup,
  but a genuinely on-topic photo (`Tsunami-Monument-in-Mal.webp`) exists
  elsewhere in the legacy image library and was used instead.

## Known gaps

- No independent verification beyond the legacy site's own text (e.g. no
  cross-check against Wikipedia or official tourism sources) — same
  sourcing standard already applied to the dive-sites dataset.
- `best_for` and `attraction_type` are editorial classifications added
  here, not verbatim from the source.
