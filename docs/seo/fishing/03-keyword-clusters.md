# 03 — Keyword clusters

Research date: 2026-10-24. Source data: `02-keyword-database.csv` (109 keywords).

## Data-status legend (applies to every keyword document)

| Label | Meaning | May it be overwritten? |
|---|---|---|
| **Verified** | A metric from a named tool or export (GSC, Ahrefs, Semrush, Keyword Planner) with its export date. | Only by a newer export from the same source. Keep the old value in history. |
| **Estimate** | A number from a third-party tool's model, labelled with the tool and the date. | By verified data, never the reverse. |
| **Observed** | Something seen directly, such as the domains on a results page on a given date. It is not a metric. | By a newer observation, dated. |
| **Recommendation** | An editorial judgement: intent, priority, target URL, depth. | Revise freely, but say why. |
| `Not available` | No reliable value exists yet. | Fill only with verified or labelled estimate data. |

**No volume, difficulty, CPC, position or traffic figure in this plan is
measured.** Every one of them is `Not available`. Priorities are editorial
recommendations. Stage 2 (doc 11 §4) replaces them with GSC data where it exists.

## Priority rubric (provisional)

Each keyword gets a score on four factors. Search volume is not one of them,
because there is no volume data.

| Factor | High | Medium | Low |
|---|---|---|---|
| Business relevance | The query is about a product we sell (charters, packages, the lodge). | It is about a nearby activity (reef, sunset, culture). | It is general or international. |
| Booking intent | Transactional or commercial. | Planning. | Informational. |
| Content gap | No page, or a thin existing page. | The page exists but is weak. | Already covered well. |
| Effort | An update. | A new article needing light research. | A new article needing owner input or legal checks. |

- **P1:** high relevance and commercial intent.
- **P2:** supports P1 pages.
- **P3:** informational or international; do these after P1 and P2.

After Stage 2, raise a keyword's priority when GSC shows any of these:
- impressions over 100 in 28 days
- an average position of 5–20
- CTR below 2% at a position of 10 or better

## Clusters

| ID | Cluster | Keywords | Main intent | Pillar / target | Priority |
|---|---|---|---|---|---|
| A | Maldives fishing tours and charters | 15 | Commercial / transactional | U01 hub `/maldives/fishing/`, U02 Emperor | P1 |
| B | Fishing holidays and packages | 12 | Commercial | U11 `/maldives/packages/fishing/`, N02 | P1 |
| C | GT fishing | 8 | Commercial / informational | U03 `/maldives/fishing/gt-fishing/` | P1 |
| D | Popping and jigging | 13 | Commercial / informational | U04 popping, U05 jigging, N04, N05 | P1–P2 |
| E | Fish species | 12 | Informational → commercial | U08–U10, U17–U19, N08 | P2–P3 |
| F | Techniques and trip types | 12 | Informational / commercial | U06, U07, U13, N06, N09 | P1–P3 |
| G | Locations | 8 | Commercial / navigational | U14 Gaafu article, U16 lodge | P1–P2 |
| H | Global fishing tours | 9 | Informational, international | N11, N02 | P3 |
| I | Destination comparisons | 4 | Informational, international | N11, N12 | P3 |
| J | Trip planning and information | 16 | Informational / planning | N01, N03, N07, N10, N13, U12 | P1–P3 |

### A — Maldives fishing tours and charters
- **Head term:** "Maldives fishing". **Variants:** tours, trips, excursions, charter, sport fishing, "book fishing trip".
- **Only the hub (U01) may use the head term as its primary keyword.**
- Emperor (U02) owns "private fishing charter / boat hire".
- The two private-charter product pages target the product names, not the generic term.
- **Live results (2026-10-24):** dominated by booking marketplaces (FishingBooker, Captain Experiences, Boatbookings, GetMyBoat). We compete with real operator detail and real prices, not with listing count.

### B — Fishing holidays and packages
- **Multi-night intent.** U11 (the package category page) owns "packages"; N02 owns "holidays"/planning.
- The 14 MFH package pages are near-duplicates (audit §9). Fix this with a comparison table on U11, not with new pages.

### C — GT fishing
- U03 is the pillar. It covers what GT fishing is, where, when and how.
- Popping and jigging pages cover *methods*. N04 and N05 cover *comparison* and *gear*.
- "GT fishing season" goes to U12 (the seasons article) with a link from U03.

### D — Popping and jigging
- Kept separate from C because the searcher's main concern is the method, not the species.
- **Risk:** U03, U04, U05 and N04 overlap. Each one's primary keyword is unique and set out in doc 04.

### E — Fish species
- One existing landing page per species.
- Reef species (barracuda, grouper, snapper) get no individual pages. They are grouped into N08 to avoid thin pages.

### F — Techniques and trip types
- **"Deep sea fishing"** goes to U07 (big game), not a new page.
- **Sunset/night/handline:** five products overlap. The owner chose to keep them all listed. N06 is the guide that links to each.

### G — Locations
- Gaafu Alifu / Maamendhoo (U14) and the lodge (U16).
- Himmafushi terms map to the hub (U01) for now. **Do not create** an atoll page for each atoll without trips in that atoll.

### H and I — Global and comparisons
- These are for international visitors. They have low booking intent and need cited sources.
- Live results are led by long-standing fly-fishing and travel publishers. Do them last.

### J — Trip planning and information
- Cost (N01) is the biggest gap with commercial value. The rate sheet gives us real prices we can publish.
- **Regulations (N07) must separate national law** (General Fisheries Regulation R-75/2020) from resort or operator policy.

## Cannibalization groups to watch

These are flagged in `02` (`cannibalization_risk` = Medium/High) and resolved in `04`:

1. **Hub vs Emperor vs private-charter products:** "fishing charter Maldives".
2. **GT page vs popping vs jigging vs N04.**
3. **Big game vs trolling vs marlin product pages:** "deep sea / big game".
4. **Five sunset/night products:** N06 links to them all; each product's title names its operator and island (approved SQL fixes the duplicate title).
5. **Seasons article vs species pages' season sections:** species pages summarise and link to U12.
6. **Package category page vs 14 package pages vs N02.**
7. **Gaafu article vs hub Gaafu section vs lodge page.**
