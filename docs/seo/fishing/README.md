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
| 02 | `02-keyword-database.csv` | One row per keyword, with metrics and their source | Not started — blocked on keyword data (see "Missing inputs") |
| 03 | `03-keyword-clusters.md` | Cluster definitions (A–J) and search intent | Not started |
| 04 | `04-keyword-url-mapping.csv` | Keyword → existing/proposed URL, cannibalization checks | Not started |
| 05 | `05-blog-content-roadmap.csv` | Every proposed article: priority, keywords, images, word range, phase | Not started |
| 06 | `06-individual-content-briefs.md` | A full brief per approved article | Not started |
| 07 | `07-image-production-plan.csv` | Image subjects, filenames, alt text, sourcing | Not started |
| 08 | `08-internal-linking-plan.csv` | Source → destination links and anchor suggestions | Not started |
| 09 | `09-competitor-analysis.md` | Search-result and competitor analysis | Not started |
| 10 | `10-twelve-week-publishing-plan.md` | Weekly production schedule | Not started |
| 11 | `11-measurement-plan.md` | Metrics and review process | Not started |
| 12 | `12-technical-qa-checklist.md` | Pre-publication checks | Not started |
| 13 | `13-prioritized-action-plan.md` | Recommended next actions, in order | Not started |

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

## Missing inputs (needed for documents 02–13)

| Input | Why it matters | Who can provide it |
|-------|----------------|--------------------|
| Google Search Console export (queries + pages, last 16 months, all countries) | Real impressions, clicks and positions for fishing queries; finds pages close to page one | Site owner (Search Console → Performance → Export) |
| A keyword tool export (Semrush, Ahrefs, Google Keyword Planner, or similar) for the cluster seed terms | Search volume and difficulty by country | Site owner, or approve a tool to use |
| Target markets (countries/languages that actually book) | Decides which country's metrics to prioritise | Site owner |
| Enquiry/booking counts by product, if tracked | Ties content priority to revenue | Site owner |
| Original fishing photographs (boat, crew, catches, techniques, lodge, Maamendhoo) | Most planned images must be real, not stock | Site owner / operator |
| Confirmation of current charter prices | Pages currently disagree (audit §6.1) | Site owner |
