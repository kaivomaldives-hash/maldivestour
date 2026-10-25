# 11 — Measurement plan

## 1. What exists today (audit §11)
- **Vercel Analytics only.** No GA4 and no Search Console verification code in the repo. GSC may be verified by DNS; the owner should confirm.
- **No baseline** for impressions, clicks, positions or enquiries per page.

## 2. Baseline to capture before week 1
| Metric | Source | Scope | Stored as |
|---|---|---|---|
| Impressions, clicks, CTR, average position by query and page | GSC Performance export, last 3 months plus last 28 days | Pages under `/maldives/fishing/`, `/maldives/packages/fishing*`, fishing travel-guide articles, and the lodge | `data/seo/gsc/fishing-YYYY-MM-DD.csv` (raw, never edited) |
| Indexing status for each fishing URL | GSC URL Inspection / Pages report | Same | Column in the snapshot |
| Page views and referrers | Vercel Analytics | Same | Monthly note |
| Enquiries (WhatsApp clicks, forms) for each page | Booking/enquiry records; WhatsApp click tracking if added (needs approval) | Fishing pages | Monthly count |

## 3. KPIs for each target
These come from `measurement_criteria` in doc 05.
- **Update targets:** the change in position and CTR for their primary and secondary keywords, 4 and 8 weeks after the update, against the baseline.
- **New articles:**
  - indexed within 2 weeks
  - first impressions
  - clicks to the commercial pages they link to (U02, U11, products)

**No ranking or traffic targets are promised.** These are directions to watch, not guarantees.

## 4. Stage 2: bringing GSC data into the keyword database
Run this when the owner provides a GSC export.

1. **Keep the raw file.** Save the export unchanged with its date range in the filename, for example `gsc-queries-2026-07-25_2026-10-23.csv`.
2. **Normalise queries:** lowercase, trim, and fold diacritics. Keep the original string as well.
3. **Match against `02-keyword-database.csv`:**
   - exact match on the normalised keyword
   - then a close-variant match (plural/singular, word order, "the/in/of" dropped)
   - flag any fuzzy match for manual review
4. **Fill the metric columns only from GSC:**
   - columns: `gsc_clicks`, `gsc_impressions`, `gsc_ctr`, `current_position`, `current_ranking_url`
   - set `data_status = Verified (GSC)`
   - set `data_source = GSC export <date range>`
   - set `research_date` to the export date
5. **Never overwrite** a verified value with an estimate. When a newer GSC export arrives, keep the previous value in a history file (`02-keyword-history.csv`: keyword_id, metric, value, date range, source).
6. **Add new queries:**
   - Add any GSC query not in the database as a new row with `keyword_role = Discovered (GSC)`.
   - Map it to a cluster and target, or leave it `Unmapped` for review.
7. **Re-prioritise.** Use the rubric in doc 03 plus these flags:
   - **Striking distance:** position 5–20 and impressions ≥ 100 in 28 days → move to P1 and refresh that page first.
   - **Low CTR:** position ≤ 10 and CTR < 2% → rewrite the title and description (needs approval).
   - **Wrong page ranking:** `current_ranking_url` ≠ `recommended_target_url` → check for cannibalization (§5).
8. **Search volume:** GSC impressions are *not* search volume. Leave `monthly_search_volume` as `Not available` unless a keyword tool export (with its name and date) is supplied, and label that as an `Estimate`.

## 5. Detecting cannibalization (after each GSC export)
- Look for queries where **two or more fishing URLs** each get more than 10% of the impressions in the same 28-day period.
- Look for queries where the ranking URL **switches** between exports.
- For each case, check the planned owner in doc 04. Then strengthen that page and adjust anchors and internal links. Merging or redirecting needs **owner approval**.

## 6. Reporting cadence
- **Weekly (weeks 1–12):** what was published or updated, plus any indexing issues.
- **Week 8 and week 12:** compare GSC against the baseline for each target and re-plan.
- Every report states the date range and source of every number.
