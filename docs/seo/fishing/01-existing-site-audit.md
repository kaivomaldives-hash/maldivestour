# 01 — Existing Fishing Site Audit

**Date:** 2026-10-24
**Branch / commit:** `claude/charming-franklin-4agbo1` @ `250353d` (adds translated fishing pages and
image-performance fixes; see [PR #60](https://github.com/kaivomaldives-hash/maldivestour/pull/60), not yet merged)
**Method:**

- Read the route files, components and content modules under `src/`.
- Read-only queries against the live Supabase database: activities, nodes, categories, media, translations, articles.
- Crawled all **918 English URLs** from the generated `sitemap.xml` on a local production build of this branch.
  - Records the real `<title>`, description, canonical, robots, H1, H2 count, word count, image count and JSON-LD types of each fishing page.
  - Counts every internal link pointing at a fishing URL.

**Nothing was changed** on the website, in the database, or in Storage while producing this audit.

Word counts are text inside `<main>` (navigation, header and footer excluded) and include card text and
FAQs, so they overstate the editorial copy on listing-style pages.

---

## 1. Summary

| Measure | Count |
|---|---|
| Fishing pages audited (English) | **51**, listed below |
| — Fishing hub | 1 (`/maldives/fishing/`) |
| — Species landing pages | 7 |
| — Technique landing pages | 5 |
| — Emperor charter page | 1 |
| — Bookable fishing activities (charters/trips) | 17 |
| — Fishing packages + the fishing package category page | 17 + 1 |
| — Operator lodge page + operator (provider) page | 2 |
| Fishing articles (Travel Guide) | **3** |
| Translated versions of the above | 6 languages (de, es, it, ru, ja, zh); all 17 activities and all 3 articles are translated |
| Fishing images on activities (distinct files) | 65 |
| Keyword research data with metrics | **None found** (see §11) |

**Biggest problems**

1. **Weak links to the strongest SEO pages.**
   - 5 of the 12 species/technique pages (popping, jigging, trolling, marlin, sailfish) aren't linked from the fishing hub.
   - `/maldives/fishing/trolling/` has **zero** internal links from anywhere on the site.
2. **Thin, overlapping product pages.** Several pages target the same search with only 160–290 words each:
   - three "sunset fishing" pages, two with the identical title "Sunset Fishing Trip"
   - two "night fishing" pages
   - 14 multi-night package pages that differ mainly by night count
3. **Conflicting prices.**
   - The owner's rate sheet and the hub/Emperor FAQs say USD 1,380 (full day) / 980 (half day).
   - The database and the charter detail pages say 1,500 / 1,000.
4. **Only three fishing articles, each about 320–370 words**, and none targets GT, popping/jigging, tuna, cost or "fishing holiday" searches.
5. **Over-long titles and descriptions** on articles (up to 116-character titles) and packages (366-character descriptions), plus a "2 Nights / 1 Days" grammar bug in package titles.

**Biggest strengths**

1. A real, verifiable product to rank for:
   - an owner-operated 32 ft charter boat (Emperor)
   - a lodge on Maamendhoo, Gaafu Alifu, with a documented rate sheet (`data/maldives/fishing/SOURCES-mfh.md`)
   - 16 real multi-night packages
2. A deep hub page with:
   - about 4,600 words, 18 sections and 9 FAQs
   - species, technique, season, location and responsible-fishing content
   - real charters and packages
3. Dedicated species and technique pages already exist (GT, tuna, wahoo, dogtooth, mahi-mahi, marlin, sailfish, popping,
   jigging, trolling, big game, fly fishing), each with its own title, FAQ and structured data.
4. Clean technical baseline:
   - self-referencing canonicals on every page
   - no accidental `noindex`
   - filter URLs correctly `noindex, follow`
   - every page in the sitemap with reciprocal hreflang in 7 languages

---

## 2. Route and content architecture

### 2.1 English routes (App Router)

| Route file | URL pattern | Content source |
|---|---|---|
| `src/app/maldives/fishing/page.tsx` | `/maldives/fishing/` | `src/components/fishing/fishing-directory-page.tsx` (copy, FAQs, sections in code) + DB activities/packages/articles |
| `src/app/maldives/fishing/[activity]/page.tsx` | `/maldives/fishing/{activity-slug}/` | DB: `nodes` + `activities` (category `fishing`) via `fishing-detail-page.tsx` |
| `src/app/maldives/fishing/{gt-fishing,tuna-fishing,wahoo-fishing,dogtooth-tuna,mahi-mahi-fishing,marlin-fishing,sailfish-fishing}/page.tsx` | `/maldives/fishing/{slug}/` | Code: `src/lib/fishing/species-content.ts` + bios in `src/lib/fishing/fish-species.ts` |
| `src/app/maldives/fishing/{popping,jigging,trolling,big-game-fishing,fly-fishing}/page.tsx` | `/maldives/fishing/{slug}/` | Code: `src/lib/fishing/technique-content.ts` |
| `src/app/maldives/fishing/emperor/page.tsx` | `/maldives/fishing/emperor/` | Code: `src/components/fishing/emperor-page.tsx` |
| `src/app/maldives/packages/fishing/page.tsx` | `/maldives/packages/fishing/` | `src/lib/packages/category-content.ts` + DB packages |
| `src/app/maldives/packages/[package]/page.tsx` | `/maldives/packages/{slug}/` | DB `nodes`/`packages` |
| Travel Guide article route | `/maldives/travel-guide/{slug}/` | DB `nodes` (type `article`) + `articles.body` (HTML) |
| Guesthouse route | `/maldives/guesthouses/maldives-fishing-and-holidays-lodge/` | DB accommodation |
| Provider route | `/maldives/providers/maldives-fishing-and-holiday/` | DB provider |

Static species/technique folders take precedence over the dynamic `[activity]` route, so a new code-based
landing page at `/maldives/fishing/{slug}/` must not reuse a slug of an existing activity.

### 2.2 Translated routes

- `src/app/[locale]/maldives/fishing/page.tsx` (hub) and `src/app/[locale]/maldives/fishing/[activity]/page.tsx`.
- The `[activity]` route serves translated activity pages, all 12 species/technique pages and Emperor
  (dispatch by slug).
- Localized URL words come from `src/lib/i18n/hub-paths.ts` and `src/lib/i18n/localized-leaf-pages.json`,
  e.g. `/de/malediven/angeln/gt-angeln/`.
- Copy lives in `src/lib/i18n/fishing-pages/*.ts`.
- **Any new English fishing landing page also needs entries in these files** if it should exist in the other
  6 languages.

### 2.3 Content model, in short

- **Activities** — DB rows editable in the admin.
  - Fields used for SEO: title, summary, meta title, meta description, description, hero/gallery media,
    technique tags (`activity-type` categories), pickup locations.
- **Articles** — DB rows: title, meta title, meta description, HTML body.
  - Tagged under the article category "Fishing".
  - Articles link to products with plain `<a href>` inside the body.
- **Species/technique/Emperor pages** — copy in TypeScript files. Changing them is a code change and a deploy.
- **Hub page** — mostly code (`fishing-directory-page.tsx`), with lists filled from the DB.

---

## 3. Page inventory

### 3.1 Hub and landing pages

| URL | Title (length) | Desc. len | H1 | Words | Imgs | JSON-LD | Inbound links* |
|---|---|---|---|---|---|---|---|
| `/maldives/fishing/` | Maldives Fishing \| Fishing Charters, Trips & Packages (53) | **212** | Maldives Fishing | 4,569 | 73 | FAQPage, ItemList, Service, VideoObject, BreadcrumbList | 918 (nav) / 62 in content |
| `/maldives/fishing/emperor/` | Emperor Private Fishing Charter Maldives \| Maldives Fishing (59) | **229** | Emperor — Private Fishing Charter Across the Maldives | 774 | 3 | FAQPage, BreadcrumbList | 15 |
| `/maldives/fishing/gt-fishing/` | GT Fishing Maldives \| Giant Trevally Fishing Charters (53) | 169 | GT Fishing in the Maldives | 549 | 4 | FAQPage, BreadcrumbList | 8 |
| `/maldives/fishing/tuna-fishing/` | Tuna Fishing Maldives \| Yellowfin Tuna Fishing Charters (55) | 167 | Tuna Fishing in the Maldives | 502 | 4 | FAQPage, BreadcrumbList | 8 |
| `/maldives/fishing/wahoo-fishing/` | Wahoo Fishing Maldives \| Wahoo Fishing Charters (47) | 167 | Wahoo Fishing in the Maldives | 495 | 4 | FAQPage, BreadcrumbList | 13 |
| `/maldives/fishing/mahi-mahi-fishing/` | Mahi Mahi Fishing Maldives \| Mahi Mahi Fishing Charters (55) | 166 | Mahi-Mahi Fishing in the Maldives | 479 | 4 | FAQPage, BreadcrumbList | 9 |
| `/maldives/fishing/dogtooth-tuna/` | Dogtooth Tuna Fishing Maldives \| Jigging Charters (49) | 158 | Dogtooth Tuna Fishing in the Maldives | 462 | 4 | FAQPage, BreadcrumbList | **3** |
| `/maldives/fishing/marlin-fishing/` | Marlin Fishing Maldives \| Marlin Fishing Charters (49) | 134 | Marlin Fishing in the Maldives | 329 | 3 | FAQPage, BreadcrumbList | **1** |
| `/maldives/fishing/sailfish-fishing/` | Sailfish Fishing Maldives \| Sailfish Fishing Charters (53) | 136 | Sailfish Fishing in the Maldives | 276 | 2 | FAQPage, BreadcrumbList | **1** |
| `/maldives/fishing/popping/` | Popping Fishing Maldives \| GT Popping Charters (46) | 138 | Popping in the Maldives | 389 | 15 | FAQPage, BreadcrumbList | **3** |
| `/maldives/fishing/jigging/` | Jigging Maldives \| GT & Dogtooth Tuna Jigging Charters (54) | 152 | Jigging in the Maldives | 374 | 15 | FAQPage, BreadcrumbList | **4** |
| `/maldives/fishing/trolling/` | Trolling Fishing Maldives \| Trolling Charters (45) | 167 | Trolling in the Maldives | 405 | 15 | FAQPage, BreadcrumbList | **0 — orphan** |
| `/maldives/fishing/big-game-fishing/` | Big Game Fishing Maldives \| Big Game Fishing Charters (53) | 149 | Big Game Fishing in the Maldives | 454 | 17 | FAQPage, BreadcrumbList | 16 |
| `/maldives/fishing/fly-fishing/` | Fly Fishing Maldives \| Maldives Fly Fishing Charters (52) | 171 | Fly Fishing in the Maldives | 393 | 4 | FAQPage, BreadcrumbList | **3** |
| `/maldives/packages/fishing/` | Maldives Fishing Holiday Packages \| Fishing Holidays in the Maldives (68) | 152 | Fishing Holiday Packages | 988 | 20 | FAQPage, BreadcrumbList | 72 |

\* Inbound links = number of English sitemap pages that link to the URL (each page counted once). "Content"
excludes the site-wide header/footer navigation.

### 3.2 Bookable fishing activities (17, all `published`)

| Slug | Operator (provider) | Primary location | Price from (DB) | Technique tags | Words | Title / description |
|---|---|---|---|---|---|---|
| `private-full-day-fishing-charter` | maldives-fishing-and-holiday | Maamendhoo (+50 pickup points) | USD **1,500** | popping, jigging, trolling | 526 | desc **299** chars |
| `private-half-day-fishing-charter` | maldives-fishing-and-holiday | Maamendhoo (+50) | USD **1,000** | popping, jigging, trolling | 526 | desc **298** chars |
| `fly-fishing-full-day-charter` | maldives-fishing-and-holiday | *(none)* | USD 1,300 | fly-fishing | 318 | desc **276** chars |
| `fly-fishing-half-day-charter` | maldives-fishing-and-holiday | Maamendhoo (+42) | USD 800 | fly-fishing | 236 | desc **275** chars |
| `big-game-fishing-trip` | maldives-tour-guide-tours | Velassaru (+41) | USD 1,200 | big-game-fishing | 207 | |
| `marlin-big-game-fishing-charter` | knight-at-sea | Hulhumalé (+42) | — | big-game-fishing | 187 | |
| `private-sport-fishing-trip` | active-watersports-maafushi | Maafushi (+41) | — | sport-fishing | 208 | |
| `himmafushi-full-day-fishing-charter` | yuvi-blue-maldives | (17 pickup points, no primary) | USD 1,215 | — | 189 | |
| `himmafushi-half-day-fishing-charter` | yuvi-blue-maldives | *(none)* | USD 810 | — | 189 | |
| `himmafushi-fishing-trip` | yuvi-blue-maldives | Himmafushi (+42) | USD 63.18 | — | 194 | |
| `sunset-fishing-trip` | active-watersports-maafushi | Maafushi (+41) | USD 30 | handline-fishing | 215 | title duplicates ↓ |
| `sunset-fishing-trip-maafushi` | kaani-hotels | *(none)* | USD 25 | — | 291 | **same title "Sunset Fishing Trip"** |
| `sunset-reef-fishing` | universal-resorts | Vihamanaafushi (+41) | — | reef-fishing | 227 | |
| `night-fishing-trip` | icom-tours | Maafushi (+41) | — | night-fishing | 283 | |
| `night-fishing-excursion` | universal-resorts | Velassaru (+41) | — | — | 187 | title suffix "\| Maldives Activities" |
| `traditional-handline-fishing-trip` | six-senses | *(none)* | — | — | 163 | title suffix "\| Maldives Activities" |
| `golden-reel-adventure` | *(no provider)* | *(none)* | — | — | 181 | desc 62 chars — **weakest page** |

- Every activity has a DB meta title, a meta description, a hero image and translations into all 6 languages.
- No activity has structured `rates` rows; the price shown is the single `price_from` column.
- Activity structured data is `Service` (+ `Offer` where a price exists).

### 3.3 Fishing packages (16 real + 1 island-hopping)

| URL group | Count | Words | Title pattern | Notes |
|---|---|---|---|---|
| `/maldives/packages/{2..8}-night-maldives-fishing-package-{full,half}-day-fishing/` | 14 | 685–687 each | "N-Night Maldives Fishing Package — Full-Day Fishing \| N Nights / N-1 Days" (71 chars) | Same product at different night counts; description **366–368** chars; **"2 Nights / 1 Days"** grammar bug |
| `/maldives/packages/{3,5}-night-maldives-fly-fishing-holiday/` | 2 | 639 | "N-Night Maldives Fly Fishing Holiday \| …" (56) | description 342 chars |
| `/maldives/packages/maldives-fishing-island-hopping-package/` | 1 | 606 | 61 chars | no `Product`/`Offer` JSON-LD (others have it) |
| `/maldives/packages/fishing/` | 1 | 988 | 68 chars | category hub; 3 H2s; 72 inbound links |

Package hero images are set in code (`src/lib/packages/package-images.ts`, owner-uploaded photos), not in the
DB `node_media` table.

### 3.4 Fishing articles (Travel Guide) — 3 found

| URL | Title (length) | Words (body / page) | Images | H2s | Body links | Inbound links |
|---|---|---|---|---|---|---|
| `/maldives/travel-guide/maldives-fishing-seasons-month-by-month-guide/` | Maldives Fishing Seasons: A Month-by-Month Guide \| Maldives Travel Guide \| MTG (**78**) | 371 / 469 | 4 | 5 | 6 | 33 |
| `/maldives/travel-guide/maldives-fishing-techniques-guide/` | Maldives Fishing Techniques: Trolling, Jigging, Popping and Handline Fishing Explained \| Maldives Travel Guide \| MTG (**116**) | 356 / 452 | 6 | 5 | 3 | **4** |
| `/maldives/travel-guide/gaafu-atoll-fishing-guide-mfh-maamendhoo/` | Fishing in Gaafu Atoll: A Guide to Maldives Fishing and Holidays Lodge on Maamendhoo \| Maldives Travel Guide \| MTG (**114**) | 316 / 420 | 3 | 6 | 7 | 30 |

- 17 other articles mention fishing in passing, e.g. *100 best things to do* (23 mentions) and the month-by-month
  weather guides (3–15 mentions each).
- These are candidates for links into the fishing cluster.
- The techniques guide doesn't link to the technique landing pages (`/maldives/fishing/popping/` etc.). It links
  only to the provider, one charter and the hub's species anchor.

### 3.5 Related location and operator pages

| URL | Status | Notes |
|---|---|---|
| `/maldives/guesthouses/maldives-fishing-and-holidays-lodge/` | 200 | 2,976 words, 55 images (the most detailed fishing-related page on the site) |
| `/maldives/providers/maldives-fishing-and-holiday/` | 200 | 107 words, titled "Local Fishing Operator"; not translated |
| `/maldives/islands/maamendhoo-gaafu-alifu/` | 200 | Linked from the hub's Gaafu section |
| `/maldives/atolls/gaafu-alifu/` | 200 | |
| `/maldives/islands/himmafushi/`, `/maafushi/`, `/hulhumale/` | 200 | Departure islands for the non-MFH trips |

---

## 4. Metadata findings

| # | Finding | Evidence | Severity | Proposed fix (needs approval) |
|---|---|---|---|---|
| M1 | Duplicate title | `sunset-fishing-trip` and `sunset-fishing-trip-maafushi` are both "Sunset Fishing Trip \| Maldives Fishing \| MTG" | Medium | Give each a distinguishing title (operator/island), via the admin meta title |
| M2 | Over-long article titles | 78–116 characters including the " \| Maldives Travel Guide \| MTG" suffix; Google truncates around 60 | Medium | Shorten the 3 fishing articles' meta titles (DB field) |
| M3 | Over-long descriptions | Hub 212; Emperor 229; charters 275–299; packages 342–368 | Low–Medium | Rewrite to roughly 140–160 characters |
| M4 | "2 Nights / 1 Days" | Package title template appends "N Nights / N-1 Days" | Low (but visible in search results) | Fix the title template to pluralise correctly |
| M5 | Inconsistent title suffix | `night-fishing-excursion`, `traditional-handline-fishing-trip` use "\| Maldives Activities \| MTG"; other fishing activities use "\| Maldives Fishing \| MTG" | Low | Align their DB meta titles |
| M6 | Thin description | `golden-reel-adventure` meta description is 62 characters and the page has no provider, price or location | Medium | Complete the record or hide it until complete (owner decision) |
| M7 | Generic provider title | Provider page H1/title "Local Fishing Operator" doesn't name the business | Low | Use the business name |

---

## 5. Internal linking

**Hub → cluster pages.** The hub links to GT, tuna, wahoo, mahi-mahi, dogtooth, big game, fly fishing and
Emperor. It doesn't link to popping, jigging, trolling, marlin or sailfish.

Inbound internal links per species/technique page:

| Page | Inbound | Page | Inbound |
|---|---|---|---|
| big-game-fishing | 16 | popping | 3 |
| wahoo-fishing | 13 | fly-fishing | 3 |
| mahi-mahi-fishing | 9 | dogtooth-tuna | 3 |
| gt-fishing | 8 | marlin-fishing | 1 |
| tuna-fishing | 8 | sailfish-fishing | 1 |
| jigging | 4 | **trolling** | **0** |

**Other observations**

- **Bookable activity pages are well linked** (49–131 pages each), mostly through activity-card lists and
  related-trip blocks.
- **Articles under-link to commercial pages.** The techniques guide has 3 body links, none to the technique pages.
  The 17 other articles that mention fishing were not checked link by link; that is part of document 08.
- **Anchor text** across product cards is the product title, which is natural. No exact-match anchor stuffing
  was found.

---

## 6. Content accuracy and consistency

### 6.1 Charter price conflict (owner decision needed)

| Source | Full day | Half day |
|---|---|---|
| Owner rate sheet → `data/maldives/fishing/mfh-charters.json` (website price = sheet − USD 20) | USD 1,380 | USD 980 |
| Hub FAQ and Emperor page FAQ/copy (code) | USD 1,380 | USD 980 |
| Database `activities.price_from` → shown on charter detail pages, cards and `Offer` JSON-LD | **USD 1,500** | **USD 1,000** |

- Either the database was updated later (new prices) or the code copy is current.
- Until one is chosen, pages contradict each other, and the structured `Offer` price may not match the visible FAQ.
- This audit doesn't change either value.

### 6.2 Overlapping products

| Group | Pages | Risk |
|---|---|---|
| Sunset fishing | `sunset-fishing-trip` (Maafushi, Active Watersports), `sunset-fishing-trip-maafushi` (Kaani Hotels), `sunset-reef-fishing` (Universal Resorts) | Same intent; two share a title; all 160–290 words |
| Night fishing | `night-fishing-trip` (ICOM, Maafushi), `night-fishing-excursion` (Universal Resorts) | Same intent |
| Himmafushi charters | `himmafushi-full-day-…`, `himmafushi-half-day-…`, `himmafushi-fishing-trip` | Same island; under 200 words each |
| Private charters | MFH private full/half day vs Himmafushi full/half day vs `private-sport-fishing-trip` | "private fishing charter Maldives" spread over 5 thin pages plus Emperor plus the hub |
| Multi-night MFH packages | 14 near-identical pages + `/maldives/packages/fishing/` | Near-duplicate content; they compete for "Maldives fishing package/holiday" |

These are real, separately bookable products, so deleting or merging them isn't recommended without the owner's
decision. Later documents will propose:

- which page is the main target for each search (most likely the hub, Emperor or the package category page)
- how the others should support it with distinct titles and content

### 6.3 Data gaps on product records

- 5 activities have no primary location: `fly-fishing-full-day-charter`, `himmafushi-half-day-fishing-charter`,
  `sunset-fishing-trip-maafushi`, `traditional-handline-fishing-trip`, `golden-reel-adventure`.
- Their location sections and location-based internal links are therefore missing.
- `fly-fishing-full-day-charter` has no pickup locations while the half-day version has 42. This looks
  unintentional.
- `golden-reel-adventure` has no operator, price, duration or location.

---

## 7. Images

**Fishing activity images (65 distinct files, 70 placements)**

- All are served from the optimized `opt/` pipeline, with 480/640/768/960/1280 px variants after PR #60, a
  1-year cache, WebP and lazy loading below the fold.
- **Alt text** is present on every image, but 4 images use an *article title* as alt text:

  | File | Current alt text |
  |---|---|
  | `big-game-fishing-maldives.webp` | "100 Best things to Do in the Maldives: An Ultimate Guide" |
  | `maldives-fishing-trip.webp` | "Maldives in October: Weather, Activities & Expert Travel Guide" |
  | `maldives-night-fishing.webp` | "Maldives in December: Weather, Activities & Expert Travel Guide" |
  | `night-fishing-in-maldives.webp` | "Maldives in August: Weather, Activities & Expert Travel Guide" |

  These should describe the photo. It's a `media_assets.alt_text` edit, which needs approval.
- **22 images are under 800 px wide** (e.g. `giant-trevally-fish.webp` 540×720, `charter-boat-fishing.webp`
  500×375, `jobfish-maldives.webp` 500×375). They are fine on cards but soft as large hero images. Higher-resolution
  originals would help, especially for GT, the boat and charter photos.
- **5 opaque filenames** from admin uploads, e.g. `1791485036509-rjj7d9.webp`. Filenames have a small SEO effect.
  Renaming would change URLs, so it's only worth doing for new uploads.

**Species and technique pages** use 2–4 images, mostly the species bio photo. The marlin and sailfish pages have
no bio photo (code fallback only).

**Original photography visible today**

- Owner uploads: package heroes, Emperor/charter galleries, the lodge (55 images).
- **Not found:**
  - GT, tuna or wahoo catch photos clearly attributed to Emperor trips
  - popping and jigging action shots attributed to Emperor
  - crew or captain portraits
  - Maamendhoo departure jetty or transfer photos (beyond the lodge gallery)

  These are the main gaps for experience-based content.

---

## 8. Structured data

| Page type | Types found | Notes |
|---|---|---|
| Hub | BreadcrumbList, FAQPage, ItemList, Service, VideoObject | Valid set. Google has shown FAQ rich results only for well-known government/health sites since 2023, so FAQPage is harmless but shouldn't be counted on for rich results. |
| Species/technique/Emperor | BreadcrumbList, FAQPage | No `Service`/`Product` on Emperor even though it's the main commercial page for the boat |
| Activities | BreadcrumbList, Service, Offer (where priced) | `Offer` price = DB `price_from` (see §6.1) |
| Packages | BreadcrumbList, FAQPage, Product, Offer | The island-hopping package lacks Product/Offer |
| Articles | Article | Author/date fields not assessed here |

- No review or rating markup was found.
- No fabricated review data was found.

---

## 9. Indexing, canonicals, sitemap, robots

- **Canonicals:** every audited page has one self-referencing canonical. No duplicates or cross-canonicals.
- **Robots:**
  - No audited public page is `noindex`.
  - Hub filter URLs (`?type=`, `?atoll=` etc.) send `noindex, follow` (verified on `?type=reef-fishing`).
  - `robots.txt` disallows only `/api/`, `/admin/`, `/partner/`.
- **Sitemap** (`src/app/sitemap.ts`):
  - Includes the hub, all species/technique pages, Emperor, all activities, all packages and articles.
  - Translations are listed with reciprocal hreflang.
- **Minor:** the 404 page outputs two robots meta tags (`noindex` and `noindex, follow`). It's harmless and not
  fishing-specific.
- **Missing landing pages for technique tags** that only exist as noindexed hub filters:
  - reef fishing, night fishing, handline/traditional, sport fishing
  - `/maldives/fishing/reef-fishing/` and `/maldives/fishing/night-fishing/` return 404
  - whether these deserve pages is decided in document 04, not assumed here

---

## 10. Multilingual

- Hub, 12 species/technique pages, Emperor, all 17 activities, all 16 real packages, the package category page
  and all 3 articles exist in de/es/it/ru/ja/zh, with localized URLs and hreflang.
- Translated species/technique copy mirrors the English page structure.
- **Any new English fishing article or landing page should plan its translations from the start**, because the
  language switcher and hreflang expect them.

---

## 11. Analytics, Search Console and keyword data

| Source | Found? | Notes |
|---|---|---|
| Google Analytics / gtag | No | Not in code |
| Google Search Console | Not in code | May be verified by DNS, which isn't visible from the repo |
| Vercel Analytics + Speed Insights | Yes | `src/app/layout.tsx`; traffic and Web Vitals, but no query data |
| Keyword research with metrics | **No** | `data/maldives/i18n/keyword-research.json` is German terminology only; it states that no search volumes were found from a verifiable source |
| Rank tracking / competitor exports | No | |

**Consequence:** the keyword database (document 02) can list terms and their intent, but every volume,
difficulty, CPC, position, click and impression column will be blank until a Search Console or keyword-tool
export is provided.

---

## 12. Gaps against the brief's keyword clusters

This lists what doesn't exist yet. Whether each gap deserves a page is decided in documents 03–05 with real data.

| Cluster | Existing coverage | Gap |
|---|---|---|
| A. Maldives fishing tours/charters | Hub, Emperor, 17 activities | No dedicated cost/price guide; no "how to choose a charter" content |
| B. Fishing holidays & packages | Package category page, 16 packages, lodge page | No guide comparing package lengths or explaining what's included, transfers and who it suits; thin package copy |
| C. GT fishing | `/maldives/fishing/gt-fishing/` (549 words) | No in-depth GT guide (tackle, season, technique, what a GT trip day looks like) |
| D. Popping & jigging | Technique pages (374–389 words) + 1 short article | No "popping vs jigging" or tackle guide; technique pages poorly linked |
| E. Species | 7 species pages | No barracuda, grouper/reef species or skipjack pages; marlin/sailfish thin (276–329 words) and nearly orphaned |
| F. Techniques & trip types | 5 technique pages; reef/night/handline exist only as products and filters | No reef/night/sunset/traditional fishing guide; no catch-and-release content beyond the hub section |
| G. Locations | Gaafu article, hub Gaafu section, island/atoll pages | No "how to get to Maamendhoo for fishing" (domestic flight + transfer) content beyond short sections |
| H. Global fishing tours | None | No international-angle content |
| I. Destination comparisons | None | No comparisons; claims would need reliable sources |
| J. Trip planning | Seasons article (371 words), techniques article | No cost guide, packing list, tackle guide, safety, regulations, or charter-choice guide |

---

## 13. Decisions needed from the owner

1. **Charter prices:** which is current, USD 1,380/980 (rate sheet, code) or 1,500/1,000 (database)?
2. **Overlapping sunset/night/Himmafushi products:** keep all as separate bookable pages (with distinct titles),
   or hide/merge any that are no longer sold?
3. **`golden-reel-adventure`:** complete it (operator, price, location) or unpublish it?
4. **Fix approvals (low risk):**
   - the 4 mismatched image alt texts
   - the duplicate "Sunset Fishing Trip" title
   - the "1 Days" package title bug
   - shorter article titles and descriptions
   - linking the 5 unlinked species/technique pages from the hub
5. **Data access:** a Google Search Console export, and ideally a keyword-tool export, for the target markets.
6. **Photography:** can the operator supply original photos of Emperor trips, catches (GT, tuna, wahoo), crew,
   techniques and the Maamendhoo departure point?

## 14. Recommended next step

Two options for the next document:

- **Document 02 (keyword database).** Fully useful once a Search Console export is available. Without it, it can
  be built as a term-and-intent list with empty metric columns.
- **Low-risk fixes first.** Fix the internal-link and metadata issues in §4–§5, which need no keyword data:
  - link popping, jigging, trolling, marlin and sailfish from the hub
  - link the techniques article to the technique pages
  - fix the duplicate title and "1 Days" bug
  - correct the 4 alt texts
