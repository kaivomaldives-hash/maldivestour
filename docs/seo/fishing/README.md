# Maldives Fishing SEO Strategy — Working Folder

Planning documents for growing organic search traffic to the fishing side of
<https://maldivestour.guide/>: Maldives fishing tours and charters, fishing
holidays and packages, GT fishing, popping and jigging, tuna and offshore
fishing, reef and traditional fishing, and the international fishing-holiday
searches that can lead people to them.

This is an **audit and planning** workstream. Nothing in this folder changes
the website. Code, routes, metadata, canonicals, robots, the sitemap, booking
and database records are only changed later, in separate tasks, after the
owner approves a specific recommendation.

## Status

The brief was split into steps so each one can be reviewed before the next
starts.

| # | File | What it is | Status |
|---|------|------------|--------|
| — | `README.md` | This overview | **Done** (2026-10-24) |
| 01 | `01-existing-site-audit.md` | Audit of every existing fishing page, article, product, image and their SEO setup | **Done** (2026-10-24) |
| 02 | `02-keyword-database.csv` | 109 keywords, 10 clusters: intent, audience, target URL, cannibalization, priority. Metrics are `Not available` until real data arrives. | **Done (Stage 1, preliminary)**. Stage 2 = GSC merge (doc 11 §4) |
| 03 | `03-keyword-clusters.md` | Cluster definitions (A–J), data-status legend, priority rubric | **Done** |
| 04 | `04-keyword-url-mapping.csv` | 32 targets (19 updates, 13 new): keyword → URL, cannibalization resolution | **Done** |
| 05 | `05-blog-content-roadmap.csv` | Priority, depth, images, links, CTA, week for each target | **Done** |
| 06 | `06-individual-content-briefs.md` | Full briefs for N01–N13; update briefs for U01–U19 | **Done** (awaiting approval) |
| 07 | `07-image-production-plan.csv` | 94 image slots (70 existing bucket photos, each viewed; 14 free-licence Pexels/Pixabay photos with credit; 10 illustrations) + 5 HTML-table rows | **Done** |
| 07a | `07a-free-image-list.md` | Pexels/Pixabay list: search terms, upload filenames, credit rules; issues found in the bucket | **Done**. 1 of 14 chosen |
| 08 | `08-internal-linking-plan.csv` | 77 planned links with anchors | **Done** |
| 09 | `09-competitor-analysis.md` | Results observed for 12 queries (2026-10-24) | **Done** |
| 10 | `10-twelve-week-publishing-plan.md` | Weekly schedule | **Done** (proposal) |
| 11 | `11-measurement-plan.md` | Baseline, KPIs, GSC (Stage 2) process, cannibalization checks | **Done** |
| 12 | `12-technical-qa-checklist.md` | Pre-publication checks | **Done** |
| 13 | `13-prioritized-action-plan.md` | Recommended next actions, in order | **Done** |
| — | `approved-fixes-2026-10-24.sql` (+ `.revert.sql`) | The owner's 2026-10-24 decisions (charter prices 1,380/980, unpublish Golden Reel, distinct sunset titles, 4 alt texts) as SQL. **Not applied yet.** | Waiting for the owner to run it |

The brief's Phase 1 also names `docs/seo/fishing-seo-audit.md`. That audit
lives at `docs/seo/fishing/01-existing-site-audit.md` instead, so there is one
copy, not two.

## How to use these documents

1. Read `01-existing-site-audit.md` first. Everything later builds on it: what
   already exists, what is thin, which pages compete with each other, and
   which problems should be fixed before any new content is written.
2. Section 13 of the audit lists **decisions for the owner** (for example,
   which charter price is current). Those answers change what the later
   documents recommend, so they are worth settling early.
3. Later documents (keyword database, mapping, briefs) should only use URLs
   that the audit confirms exist, or new URLs that follow the route
   conventions in audit section 2.

## Scope

- **In scope:** English fishing pages and their translations (de, es, it,
  ru, ja, zh), fishing products (activities/charters and packages), fishing
  articles in the Travel Guide, images used on those pages, internal links,
  metadata, structured data, sitemap entries.
- **Out of scope for this workstream:** redesigns, booking flow, admin and
  partner portals, database schema, global robots/sitemap/canonical logic.

## Important limitations

- **No keyword metrics exist in the project.** The only keyword file,
  `data/maldives/i18n/keyword-research.json`, holds German terminology for
  translation and explicitly contains no search volumes. No Search Console
  export, keyword-tool export, rank tracking or analytics export was found.
  Keyword volumes, difficulty, CPC, rankings and traffic must therefore be
  **left blank** until real data is supplied. They will not be estimated or
  invented.
- **The audit reflects branch `claude/charming-franklin-4agbo1`**, which adds
  the translated fishing pages and performance fixes in
  [PR #60](https://github.com/kaivomaldives-hash/maldivestour/pull/60). Until
  that PR is merged, the live site does not yet have the translated fishing
  species, technique and Emperor pages, or the image-size improvements.
- **Measurements come from a local production build** of that branch, run
  against the live database. Search engines may currently see slightly
  different HTML on the live site.
- **No rankings, traffic or bookings are promised** by anything in this
  folder. Word counts, keyword counts and image counts are planning estimates,
  to be adjusted against real search results.

## Missing inputs (still needed)

| Input | Why it matters | Who can provide it |
|-------|----------------|--------------------|
| Google Search Console export (queries + pages, last 16 months, all countries) | Real impressions, clicks and positions for fishing queries; finds pages close to page one | Site owner (Search Console → Performance → Export) |
| A keyword tool export (Semrush, Ahrefs, Google Keyword Planner, or similar) for the cluster seed terms | Search volume and difficulty by country | Site owner, or approve a tool to use |
| Target markets (countries/languages that actually book) | Decides which country's metrics to prioritise | Site owner |
| Enquiry/booking counts by product, if tracked | Ties content priority to revenue | Site owner |
| Original fishing photographs (boat, crew, catches, techniques, lodge, Maamendhoo) | Most planned images must be real, not stock | Site owner / operator |
| ~~Confirmation of current charter prices~~ | Confirmed 2026-10-24: USD 1,380 / 980 | Done |
