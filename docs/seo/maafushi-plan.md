# Maafushi island page — improvement plan (DRAFT, not published)

Page: https://maldivestour.guide/maldives/islands/maafushi/
Written 2026-11-26 from the live page. Nothing here is live yet.

## Why this page matters

Maafushi is the best-known guesthouse island in the Maldives and the
nearest big one to the airport. People searching for it are mostly
planning a budget trip, and almost all of them need an **airport transfer**
(our main income) plus day trips (snorkeling, sandbank, fishing). The page
should sell the transfer first and the trips second.

## What the page has today (checked live)

- **Title:** "Maafushi, Kaafu Atoll | Maldives Islands | MTG" — no search
  words people actually type (transfer, things to do, guesthouse, ferry).
- **Meta description:** "Maafushi is an inhabited island in Kaafu Atoll,
  Maldives." — one bland sentence, no reason to click.
- **Intro line under the heading** repeats that same bland sentence.
- Good parts already there: quick facts, about, getting there, things to
  do, one-day itinerary, good-to-know, 4 FAQs (with FAQ schema), hotels,
  diving list, links to the airport → Maafushi transfer and the Malé ⇄
  Maafushi routes.
- **Problems:**
  - Transfer time says "30–45 minutes" in text but the price is never
    shown, and there is no "Book transfer" button near the top.
  - The ferry is mentioned ("a slower public ferry also runs") with no
    times, price or link to `/maldives-ferry-schedule/`.
  - One hotel shows its raw code name **"rosemery-maafushi"** instead of a
    real name (fix the name in the admin: "Rosemary Hotel Maafushi" — check
    spelling with the owner).
  - "Fishing on Maafushi" lists ~17 trips, most of them at **Himmafushi,
    Maamendhoo or "42 locations"** — not Maafushi. It looks padded and
    confuses visitors. Show only trips that really leave from Maafushi.
  - No prices for snorkeling / sandbank day trips from Maafushi.
  - No map image or "where to stay" advice (which side of the island,
    near bikini beach or not).

## Target keywords

No search-volume data was available for this draft (Keyword Planner /
Search Console not connected here). Order below is by how likely each is
to bring bookings; **confirm volumes in Google Keyword Planner and Search
Console before final wording.**

| Priority | Keyword | Intent | Where on the page |
|---|---|---|---|
| 1 | maafushi island | general / planning | Title, H1, intro |
| 1 | maafushi transfer / airport to maafushi | booking | Title, "Getting there" box, button |
| 1 | how to get to maafushi | planning → booking | H2 + FAQ |
| 1 | maafushi speedboat (price / schedule) | booking | Getting there box |
| 2 | maafushi ferry (schedule / price) | planning | Getting there + link to ferry page |
| 2 | things to do in maafushi | planning | H2 "Things to do" |
| 2 | maafushi excursions / day trips | booking | Activities section |
| 2 | maafushi snorkeling / sandbank trip | booking | Activities section |
| 2 | maafushi guesthouse / where to stay in maafushi | booking | Where to stay |
| 3 | maafushi bikini beach | info | Already has its own page — link to it |
| 3 | maafushi floating bar / alcohol | info | FAQ (exists) |
| 3 | maafushi fishing trip | booking | Fishing section (only real Maafushi trips) |
| 3 | maafushi diving | booking | Diving section (exists) |
| 3 | is maafushi worth it / maafushi vs (Thulusdhoo, Dhigurah) | planning | New short section |

## Proposed changes

### 1. Title and description (quick win)

- **Title (≈60 chars):** `Maafushi Island Guide: Airport Transfer, Things to Do & Stays`
- **Meta description (≈155 chars):** `Plan your Maafushi trip: 30-45 min speedboat from Malé airport, ferry times, bikini beach, snorkeling and sandbank trips, and where to stay. Book transfers here.`
- **Intro line:** replace with 2 sentences: what Maafushi is + "most
  visitors arrive by shared speedboat from the airport in about 30–45
  minutes".

### 2. "Getting to Maafushi" box near the top

- Shared speedboat: time, price per person, how often, "Book" button →
  `/maldives/transfers/velana-international-airport-to-maafushi/`.
- Private speedboat: price per boat.
- Public ferry: days, rough times, price, link to `/maldives-ferry-schedule/`.
- Return trip link: `/maldives/transfers/maafushi-to-male/`.
- Use the real prices from the transfer route (don't make up numbers).

### 3. Things to do — make it bookable

Short sub-sections, each with a price "from" and a link to the real trip:
snorkeling trip, sandbank trip, dolphin / sunset cruise, resort day visit
(`/maldives/activities/day-visit-a-resort/`), diving (Maafushi Dive and
Water Sports), sunset fishing (`/maldives/fishing/sunset-fishing-trip-maafushi/`).

### 4. Clean up lists

- Fishing: show only trips from Maafushi providers (sunset fishing, local
  trips); link "more fishing trips" to `/maldives/fishing/`.
- Fix the "rosemery-maafushi" hotel name.

### 5. New FAQ questions (add to the existing 4)

- How much is the speedboat from Malé airport to Maafushi?
- Is there a ferry to Maafushi and how long does it take?
- What is the best time of year to visit Maafushi?
- Is Maafushi good for families / couples?
- Can I visit a resort from Maafushi for the day?

### 6. Short "Where to stay" advice

2–3 sentences: guesthouses near bikini beach vs the harbour side, budget
range per night (from the hotel cards already on the page).

### 7. Internal links to this page

Add a link to the Maafushi page from: the airport → Maafushi transfer page,
the Kaafu atoll page, the Maafushi bikini beach page, and the "Maldives on
a budget" travel guide.

## Old URLs already pointing here (keep)

- `/atolls/kaafu-atoll/kaafu-maafushi-island-maldives.html` → this page
- `/maps/maafushi-map.html` → this page
- `/maafushi-island-transfer.html` → airport → Maafushi transfer page

## How to measure

In Search Console, track clicks and position for "maafushi", "maafushi
transfer", "how to get to maafushi" and "maafushi ferry" before the change
and 4 weeks after. Also watch transfer enquiries from this page.
