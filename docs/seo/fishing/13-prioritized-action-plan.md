# 13 — Prioritized action plan

Every item needs owner approval before it is done. **"Approved"** means the owner already decided it on 2026-10-24.

## Now (week 0): approved, waiting to be applied
| # | Action | Status | How |
|---|---|---|---|
| 1 | Set charter prices to USD 1,380 full day / 980 half day | Approved, **not applied** (database write blocked by session permissions) | Run `approved-fixes-2026-10-24.sql` in the Supabase SQL editor. Undo: `.revert.sql`. |
| 2 | Unpublish Golden Reel Adventure (set to draft, not deleted) | Approved, not applied | Same SQL |
| 3 | Give the two "Sunset Fishing Trip" pages distinct titles | Approved (the trips stay listed), not applied | Same SQL |
| 4 | Make 4 fishing photos' alt text and titles describe what they show | Approved, not applied | Same SQL |
| 5 | 301 `/maldives/fishing/golden-reel-adventure/` → `/maldives/fishing/` | **Recommended, needs approval** | Admin redirect form |
| 6 | Supply the GSC export (queries + pages, 3 months) | Owner | Starts Stage 2 (doc 11 §4) |

## Next (weeks 1–3): quick wins on existing pages
| # | Action | Why | Effort |
|---|---|---|---|
| 7 | Link popping, jigging, trolling, marlin and sailfish from the hub | Trolling is orphaned. The others have only 1–4 inbound links. | Low |
| 8 | Shorten over-long meta descriptions: hub 212, Emperor 229, charters 275–299, packages 342–368 | They get truncated in results | Low |
| 9 | Fix the "2 Nights / 1 Days" package title bug | Visible error in titles | Low (code or data; needs approval) |
| 10 | Align title suffixes on `night-fishing-excursion` and `traditional-handline-fishing-trip` | Consistency | Low |
| 11 | Update Emperor (U02) and the GT page (U03) | Highest commercial value | Medium |
| 12 | Update popping, jigging and trolling (U04–U06) | Method pages with thin content | Medium |

## Then (weeks 4–7): the biggest gaps
| # | Action | Why |
|---|---|---|
| 13 | N01 cost guide | Real rate-sheet prices; observed results show prices from ~USD 450 to ~4,200 with no clear source |
| 14 | U11 package comparison table | Fixes the 14 near-duplicate package pages without deleting any |
| 15 | U12 seasons article expanded | Online season claims conflict; a sourced per-species answer |
| 16 | U14 Gaafu article expanded | Almost no fishing-trip content exists for Gaafu |
| 17 | N06 sunset and night guide | Resolves the overlap between 5 products (all stay listed) |
| 18 | N02 holiday planning | Multi-night intent; feeds the package pages |

## Later (weeks 8–12)
N03, N04, N05, N07, N08, N13, then N09–N12, plus the remaining small updates (U09, U10, U15–U19). Full order in doc 10.

## Images
- Original photos are no longer a blocker. Every slot now uses either a photo already in the bucket (viewed and matched) or a free Pexels/Pixabay photo with credit. The list is in `07a-free-image-list.md`.
- **Chosen:** 1 of 14 (the Seychelles beach for N12).
- **Still to choose:** 13. Pick each one before its article's week.
- **The one photo most worth taking yourself:** the outside of the lodge. None exists.

## Risks
- **Prices:** until item 1 is applied, the charter pages and Offer JSON-LD show 1,500 / 1,000, while the FAQs and descriptions say 1,380 / 980.
- **Cannibalization:** watch the seven groups in doc 03. Check after each GSC export (doc 11 §5).
- **Unverified claims:** regulations (N07) and destination comparisons (N11/N12) need sources. Tackle (N05) needs the captain's input.
- **No measurement baseline** until the GSC export arrives.
- **Golden Reel URL:** once unpublished it will 404 in all locales until a redirect is approved (item 5).
