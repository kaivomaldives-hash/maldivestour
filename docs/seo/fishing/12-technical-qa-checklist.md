# 12 — Technical QA checklist (per page, before publishing)

Run against the local production build (`next build && next start`) and again on the live URL after the owner publishes.

## URL and indexing
- [ ] URL matches doc 04 exactly, lowercase with a trailing slash. No change to an existing URL without approval.
- [ ] Returns 200; no redirect chain.
- [ ] `<link rel="canonical">` is self-referencing. Do not change canonical logic globally.
- [ ] Not `noindex`. Appears in `sitemap.xml`; translated versions appear once published.
- [ ] `hreflang` alternates include only locales that really exist (the leaf-page registry `src/lib/i18n/localized-leaf-pages.json`).

## Metadata
- [ ] Title is unique across the site (checked against the audit's duplicate list) and ≤ 60 characters.
- [ ] Meta description is 120–155 characters and unique.
- [ ] Exactly one H1; H2/H3 follow the brief's outline.
- [ ] Open Graph image set, 1200×630 if there is a dedicated image.

## Content accuracy
- [ ] Every price matches the rate sheet or the live DB record (charters USD 1,380 / 980 once the approved SQL is applied).
- [ ] No invented catches, sizes, records, reviews, awards or ratings.
- [ ] Rules and legal statements cite their source (N07).
- [ ] Competitor prices, if mentioned, are attributed and dated.

## Structured data
- [ ] JSON-LD validates (Rich Results Test / schema.org validator).
- [ ] FAQPage only with questions visible on the page.
- [ ] Product/Service/Offer only on product pages, with prices matching the visible prices.
- [ ] No Review/AggregateRating unless backed by real, on-page reviews.

## Images (doc 07)
- [ ] Every image has accurate alt text describing what it shows (not the article title).
- [ ] Original-photo slots filled with owner photos, or the item is held back. No stock image passed off as ours.
- [ ] Served through the media pipeline with size variants (480–1280 px). Hero has `priority`/preload; the rest load lazily.
- [ ] Source width ≥ 1,200 px for hero images; ≥ 800 px elsewhere (the audit found 22 below 800 px).
- [ ] Descriptive filenames for new uploads (doc 07 `proposed_filename_for_new_upload`).

## Links (doc 08)
- [ ] All planned outbound internal links present, with descriptive anchors (no "click here").
- [ ] Inbound links from the planned source pages added in the same release.
- [ ] No broken links (crawl the page and its neighbours).
- [ ] Links point to the same-language version on translated pages.

## Performance and UX
- [ ] Lighthouse mobile: LCP < 2.5 s, CLS < 0.1, no new render-blocking resources.
- [ ] Tables scroll horizontally on mobile without causing page-level horizontal scroll.
- [ ] CTA works: the WhatsApp/enquiry link opens with the right pre-filled text.

## After publishing
- [ ] Request indexing in GSC (owner).
- [ ] Record the publish date in doc 05 `status`.
- [ ] Check the page in GSC after 2 and 4 weeks (doc 11).
