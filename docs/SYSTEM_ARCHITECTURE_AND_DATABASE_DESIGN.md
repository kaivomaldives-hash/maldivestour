# MTG — Complete System Architecture & Database Design (Task 2, Revision 2)

Status: **Design only. Nothing built.** No Next.js project, no Supabase project, no database, no migrations, no packages, no pages, no components, no redirects, no booking logic, no email integration, no application code. This revision supersedes the prior version of this document and resolves the 14 issues raised in review. Task 1's blueprint (`docs/ARCHITECTURE_BLUEPRINT.md`) remains valid at the level it operates on; this document is the authoritative detailed design.

Section 14 of the review ("LEGACY URL MIGRATION") arrived without a body in the request. §22 below keeps the previously-approved redirect design unchanged, and confirms it still holds correctly against every schema change made in this revision — see §22 for the explicit consistency check.

---

## 1. Transfers — Final Required Model: Routes vs. Services

**Two tables, deliberately not collapsed: `transfer_routes` and `transfer_services`.**

### Why they must stay separate

A **route** is a geographic fact: a directional origin→destination pair. It is stable, reusable, and reference-like — "Velana International Airport → Thulusdhoo" exists as a concept whether or not anyone currently sells a ticket on it. A **service** is a commercial offering on that route: who runs it, in what vehicle, on what schedule, for what price. A route regularly has *many* services (Provider A/B/C in the worked example), each changing independently and at different rates — price and schedule churn constantly, while the route itself almost never does.

Collapsing them into one table forces a choice between two bad outcomes: either the origin/destination geography gets duplicated once per provider/service row (denormalized, error-prone if a location is renamed or its atoll changes), or a route can only ever have one operator (contradicts the requirement outright). Keeping them separate means:

- Origin/destination is stored **once per direction**, referenced by every service on it.
- "Show all services on this route" is a plain join, not a `GROUP BY` over duplicated geography.
- A route and its reverse (`A→B` vs `B→A`) are genuinely independent rows — different services, different prices, sometimes only one direction is even sold (e.g., a resort-included one-way transfer) — exactly as the review specifies. Nothing about this model infers or auto-generates the reverse; it must be created as its own row if it exists.

### Schema

```sql
create table transfer_routes (
  id                          uuid primary key references nodes(id) on delete cascade,
  origin_location_id          uuid not null references locations(id),
  destination_location_id     uuid not null references locations(id),
  distance_km                 numeric(6,2),
  typical_duration_minutes    int,
  unique (origin_location_id, destination_location_id)
);
create index transfer_routes_origin_idx      on transfer_routes(origin_location_id);
create index transfer_routes_destination_idx on transfer_routes(destination_location_id);
```

`transfer_routes.id` shares a primary key with `nodes.id` (§2) — a route is the addressable, SEO-visible, reviewable unit ("Transfers: Velana Airport → Thulusdhoo" is a real page). `origin_location_id`/`destination_location_id` reference the canonical `locations` table directly (never free text), so a route participates in the same location-hub queries as everything else.

```sql
create table transfer_services (
  id                     uuid primary key default gen_random_uuid(),
  route_id               uuid not null references transfer_routes(id) on delete cascade,
  provider_id            uuid references providers(id),
  transfer_type          text not null check (transfer_type in (
                            'speedboat', 'seaplane', 'domestic_flight', 'ferry',
                            'private_yacht', 'land_transfer'
                          )),
  vehicle_type           text,               -- e.g. "40-seat speedboat", "DHC-6 Twin Otter"
  shared_or_private      text not null check (shared_or_private in ('shared','private')),
  departure_time         time,               -- null for on-request/private-charter services
  arrival_time           time,
  duration_minutes       int,
  price                  numeric(10,2) not null,
  currency               text not null default 'USD',
  capacity               int,
  luggage_allowance      text,
  operating_days         text[],             -- e.g. {'mon','wed','fri'} or {'daily'}
  status                 text not null default 'active' check (status in (
                            'active', 'seasonal', 'suspended', 'discontinued'
                          )),
  pickup_instructions    text,
  dropoff_instructions   text,
  booking_requirements   text,
  cancellation_policy    text,
  description            text,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);
create index transfer_services_route_idx    on transfer_services(route_id);
create index transfer_services_provider_idx on transfer_services(provider_id);

create table transfer_service_media (
  transfer_service_id   uuid not null references transfer_services(id) on delete cascade,
  media_id              uuid not null references media_assets(id) on delete cascade,
  role                  text not null check (role in ('hero','gallery')),
  sort_order            int default 0,
  primary key (transfer_service_id, media_id, role)
);
```

Every field the review listed as "where applicable" is present as its own column (provider, transfer type, vehicle/boat type, shared/private, departure/arrival time, duration, price, currency, capacity, luggage, operating days, status/availability, pickup/dropoff instructions, booking requirements, cancellation policy, description, media) — nothing here is buried in JSONB, consistent with §11's relational boundary.

---

## 2. Nodes + Transfers Consistency — Final Model

**Resolved:** `nodes.node_type` now includes `'transfer_route'` (replacing the earlier, incorrect `'transfer_option'`). **Transfer services are explicitly not nodes.**

```sql
-- nodes.node_type check constraint, final:
check (node_type in (
  'location', 'category', 'provider', 'accommodation',
  'activity', 'transfer_route', 'package', 'article'
))
```

**Why routes are nodes:** a route needs everything the node backbone provides — a slug and canonical URL, draft/published status, SEO metadata, breadcrumbs, the ability to be reviewed ("how was the Velana→Thulusdhoo transfer experience"), a hero image/gallery, and discoverability through search and location hubs. It is content in its own right.

**Why services are not nodes:** a service is a fast-changing, provider-owned commercial line item, not an independently addressable page — it doesn't need its own slug, its own draft/publish lifecycle, or its own canonical URL; it's presented as one row in a comparison list on its route's page (exactly like the worked example: one route page, three service rows). Making every service a full node would mean giving volatile pricing/schedule data the same lifecycle machinery (SEO fields, status enum, rating aggregates) as genuine content, for no benefit — a direct violation of "don't invent unnecessary features" and of §11's relational/JSONB discipline applied one level up (don't force a shape onto data that doesn't need it).

**Consequence for reviews:** since only nodes are reviewable, reviews attach at the **route** level (the transfer experience generally) or at the **provider** level (§8, providers are nodes — a provider's overall reputation across everything it runs, transfers included). There is no per-service review table — this is a deliberate scope limit, not an oversight: it can be added later as `transfer_service_id` on `reviews` (nullable, alongside `node_id`) if provider-vs-provider review comparison on the same route becomes a real product need, without touching any other part of the schema.

**Consequence for booking:** a service is still fully bookable — see §3, which handles "bookable thing is sometimes a node, sometimes a transfer_service" explicitly rather than pretending everything is a node.

**Consequence for URLs:** a service has no canonical URL of its own; it only ever appears inline within its route's page (§21).

The ER diagram in §23 reflects this exactly: `transfer_routes` hangs off `nodes`; `transfer_services` hangs off `transfer_routes`, not off `nodes`.

---

## 3. Booking / Inquiry — Guest Bookings

One table, `bookings`, serves every bookable thing on the platform — accommodations, activities, packages, and transfer services — per the instruction not to fragment booking into per-entity-type tables. `user_id` is nullable; guest contact fields are first-class.

```sql
create table bookings (
  id                        uuid primary key default gen_random_uuid(),
  booking_reference         text not null unique,                -- MTG-2026-000123, see §4

  -- what is being booked: exactly one of the two branches below (§2 consequence)
  product_type              text not null check (product_type in ('node','transfer_service')),
  product_node_id           uuid references bookable_products(id),
  transfer_service_id       uuid references transfer_services(id),
  check (
    (product_type = 'node' and product_node_id is not null and transfer_service_id is null)
    or
    (product_type = 'transfer_service' and transfer_service_id is not null and product_node_id is null)
  ),

  -- who is booking: account optional, guest details always captured
  user_id                   uuid references auth.users(id),      -- nullable — guests have none
  customer_name              text not null,
  customer_email             text not null,
  customer_phone             text,
  customer_whatsapp          text,

  -- trip details — nullable where not applicable to the product type
  origin_location_id         uuid references locations(id),
  destination_location_id    uuid references locations(id),
  travel_date                date,
  travel_time                 time,
  return_date                 date,
  return_time                 time,
  trip_type                   text check (trip_type in ('one_way','round_trip','multi_day','n_a')),
  adults                      int not null default 1,
  children                    int not null default 0,
  infants                     int not null default 0,
  flight_number                text,
  special_requests              text,

  -- commercial
  estimated_price              numeric(10,2),
  quoted_price                 numeric(10,2),
  currency                     text not null default 'USD',

  -- operations
  internal_notes               text,
  status                       text not null default 'new' check (status in (
                                  'new', 'contacted', 'pending', 'confirmed', 'cancelled', 'completed'
                                )),
  notification_status          text not null default 'pending' check (notification_status in (
                                  'pending', 'sent', 'failed'
                                )),

  created_at                   timestamptz not null default now(),
  updated_at                   timestamptz not null default now()
);
create index bookings_reference_idx             on bookings(booking_reference);
create index bookings_status_idx                on bookings(status);
create index bookings_user_idx                  on bookings(user_id);
create index bookings_product_node_idx          on bookings(product_node_id);
create index bookings_transfer_service_idx      on bookings(transfer_service_id);
```

`bookable_products` (from Task 2 rev 1, unchanged) remains the opt-in gate for which **nodes** (accommodations, activities, packages) can be booked at all:

```sql
create table bookable_products (
  id              uuid primary key references nodes(id) on delete cascade,
  booking_mode    text not null default 'inquiry' check (booking_mode in ('inquiry','instant')),
  base_price      numeric(10,2),
  currency        text default 'USD',
  max_guests      int
);
```

`bookings.product_node_id` references `bookable_products.id`, not `nodes.id` directly — this makes it structurally impossible to create a booking against a node that was never marked bookable, rather than relying on application code to check that separately. Transfer-specific fields (`origin_location_id`, `flight_number`, etc.) stay nullable and are simply unused for an accommodation/activity/package booking; there is no separate `transfer_bookings` table, per the instruction.

---

## 4. Booking Reference

`booking_reference text unique`, format `MTG-{year}-{6-digit sequence}`, generated server-side — never client-supplied, never guessable in advance, never subject to a race condition under concurrent inserts.

```sql
create table booking_reference_counters (
  year         int primary key,
  last_value   int not null default 0
);

create or replace function generate_booking_reference() returns trigger as $$
declare
  next_val int;
  yr int := extract(year from now());
begin
  insert into booking_reference_counters (year, last_value)
  values (yr, 1)
  on conflict (year) do update set last_value = booking_reference_counters.last_value + 1
  returning last_value into next_val;

  new.booking_reference := 'MTG-' || yr || '-' || lpad(next_val::text, 6, '0');
  return new;
end;
$$ language plpgsql;

create trigger set_booking_reference
  before insert on bookings
  for each row
  when (new.booking_reference is null)
  execute function generate_booking_reference();
```

**Why this is safe under concurrency:** the counter increment is done with a single `INSERT ... ON CONFLICT (year) DO UPDATE ... RETURNING`, which Postgres executes as one atomic, row-locked statement — two simultaneous bookings in the same year cannot read-then-write the same `last_value` and collide, because the second transaction blocks on the row lock until the first commits. This is the standard safe pattern for a gapless-enough sequential counter in Postgres (small gaps are still possible only if a transaction rolls back after incrementing, which is acceptable — uniqueness is guaranteed, sequential-without-gaps is not promised or needed here). The reference resets to `000001` at the start of each calendar year, matching the `MTG-2026-000123` example. The UUID `bookings.id` remains the real primary key and the only value used in foreign keys (`booking_notifications.booking_id`, etc.); `booking_reference` exists purely as the human-facing lookup/communication string.

---

## 5. Booking Status

| Status | Meaning |
|---|---|
| `new` | Inquiry just submitted by the customer (guest or logged-in); nobody on staff has actioned it yet. |
| `contacted` | Staff has reached out to the customer — clarifying details, checking availability with a provider, or sending a quote — but nothing is agreed yet. |
| `pending` | A quote/offer is out and MTG is waiting on something external to close it: customer confirmation, payment, or a provider's availability confirmation. |
| `confirmed` | Both sides have agreed — the booking is locked in for the stated dates. |
| `cancelled` | The booking will not proceed (customer- or operator-initiated cancellation, at any prior stage). |
| `completed` | The travel date has passed and the service was delivered as booked. |

This is a linear-ish workflow (`new → contacted → pending → confirmed → completed`) with `cancelled` reachable from any non-terminal state — enough to run an inquiry desk without building a full workflow/state-machine engine, consistent with keeping v1 to inquiry-mode bookings (Task 1 §20/Task 2 §15, unchanged: no payments, no live availability engine).

---

## 6. Booking Notification

**The recipient address is data, not code.** It lives in one configurable settings table, never hardcoded in application source:

```sql
create table platform_settings (
  key            text primary key,
  value          text not null,
  description    text,
  updated_at     timestamptz not null default now()
);
-- conceptual seed row (not created now):
-- ('booking_notification_email', 'contact@maldivestour.guide', 'Default recipient for booking/inquiry notifications')
```

The application reads `platform_settings['booking_notification_email']` in exactly one place (a single config-access function), so changing the recipient — or adding a second one later — is an admin-editable data change, never a code search-and-replace.

**Notification tracking**, separate from the booking row itself so multiple attempts/recipients can be logged without overloading `bookings`:

```sql
create table booking_notifications (
  id                    uuid primary key default gen_random_uuid(),
  booking_id            uuid not null references bookings(id) on delete cascade,
  notification_type     text not null check (notification_type in ('admin_alert','customer_confirmation')),
  recipient_email       text not null,
  status                text not null default 'pending' check (status in ('pending','sent','failed')),
  provider_message_id   text,
  error_message         text,
  attempted_at          timestamptz not null default now(),
  sent_at               timestamptz
);
create index booking_notifications_booking_idx on booking_notifications(booking_id);
```

`bookings.notification_status` stays as a fast, denormalized summary for admin list views (mirrors the latest `admin_alert` attempt); `booking_notifications` is the full, appendable audit trail supporting retries and more than one notification type.

**Designed flow (not implemented — no email provider wired up):**
1. Guest or user submits an inquiry → `bookings` row inserted (via the RPC in §7), `booking_reference` auto-generated (§4).
2. A `booking_notifications` row is inserted: `notification_type = 'admin_alert'`, `recipient_email` read from `platform_settings`, `status = 'pending'`.
3. An Edge Function (triggered by a DB webhook/`pg_net` call on insert, or a scheduled job — provider TBD) sends the email containing all booking details, then updates that notification row's `status`/`sent_at`/`error_message` and mirrors the outcome onto `bookings.notification_status`.
4. If the booking includes `customer_email` and customer confirmations are enabled, a second `booking_notifications` row (`notification_type = 'customer_confirmation'`) follows the same path.
5. The admin booking list surfaces `notification_status` per booking (and, on demand, the full `booking_notifications` history) so staff can see at a glance whether the office was actually notified — with a manual "resend" admin action simply inserting a fresh `booking_notifications` row.

---

## 7. Booking Security

Guest bookings mean `auth.uid() = user_id` cannot be the (or the only) access control — it's `false` for every guest row and enforces nothing on the anonymous-write side at all. The design instead separates the **write path** from **table access**:

**Write path — a `SECURITY DEFINER` RPC function, not a direct table INSERT:**

- `create_booking_inquiry(...)` accepts only customer-facing fields (product reference, contact details, trip details) — it never accepts `status`, `internal_notes`, `booking_reference`, or `notification_status`; those are fixed by defaults/triggers regardless of what's passed.
- It runs as `SECURITY DEFINER`, so it can insert into `bookings` even though the `anon`/`authenticated` Postgres roles have **no direct INSERT grant** on the table — the table stays locked down; the function is the only door.
- It returns the minimal confirmation payload (`booking_reference`, `id`) — never the full row — so the response can't be used to enumerate or read other people's bookings.
- It is called through Supabase RPC and is rate-limited at the application layer (§Task-2-rev1 §24 rate limiting, still applies) to curb anonymous abuse.

**Table-level RLS on `bookings` — default-deny, no policy relies on `user_id`:**

- **No `SELECT`/`INSERT`/`UPDATE`/`DELETE` policy grants anything to `anon` or `authenticated` directly.** All direct table access is denied by RLS unless a policy below explicitly allows it.
- `SELECT`/`UPDATE` allowed for `profiles.role IN ('editor','admin')` — staff manage the inquiry desk through the admin (§17), same role pattern used everywhere else in the schema.
- A logged-in customer who wants to see "my bookings" is served by a second `SECURITY DEFINER` function, `get_my_bookings()`, which internally filters `where user_id = auth.uid()` and returns only that user's rows — this is a narrow, purpose-built function, not a table policy, precisely because a blanket `auth.uid() = user_id` policy would do nothing for the anonymous-write case and is easy to misconfigure into a false sense of coverage.
- `booking_notifications`, `booking_reference_counters`, and `platform_settings` are staff/service-role only — never exposed to `anon` or `authenticated` under any policy.

Net effect: an anonymous visitor can create exactly one thing (a booking, through the function, with only the fields the function accepts) and can read nothing back except their own confirmation reference; only staff and, narrowly, the owning authenticated user can ever read booking rows.

---

## 8. Packages — Taxonomies (No Boolean Columns)

Packages reuse the existing `categories`/`node_categories` system from Task 2 rev 1 (§9 of that document) — no new taxonomy mechanism, no boolean flags. `categories.category_group` gains the groups this review calls for, alongside the ones already defined for accommodations/activities:

```sql
-- categories.category_group check constraint, final:
check (category_group in (
  'accommodation-type', 'activity-type', 'amenity',       -- unchanged from rev 1
  'traveler-type', 'package-style', 'duration-band', 'inclusion', 'theme'  -- new, package-oriented
))
```

| `category_group` | Example values |
|---|---|
| `traveler-type` | Honeymoon, Family, Couple, Solo, Group, Luxury, Budget, Long Stay |
| `package-style` | Local Island, Resort, Hotel, Guesthouse, Mix Islands, Local Island + Resort, Island Hopping |
| `duration-band` | 3 Nights, 4 Nights, 5 Nights, 7 Nights, 10 Nights, 14 Nights, Custom |
| `inclusion` | Accommodation, Activities, Transfers, Food, Breakfast, Half Board, Full Board, All Inclusive, Airport Transfer, Speedboat Transfer, Seaplane Transfer, Domestic Flight, Excursions, Tours |
| `theme` | Diving, Fishing, Surfing, Island Hopping, Beach Holiday, Adventure, Culture, Wellness, Romantic, Family Activities |

A package attaches to any number of these via the existing `node_categories` junction — "Honeymoon + Resort + 7 Nights + All Inclusive + Romantic" is five rows, not five columns, and adding a new value (e.g. a future "Wellness Retreat" `theme`) is a data insert, never a migration.

**On `duration-band` specifically:** the package's authoritative duration lives as a real numeric column (`packages.duration_nights`, §9) used for exact display and range filtering (`WHERE duration_nights BETWEEN 5 AND 7`). The `duration-band` category tag is a separate, editor-assignable *marketing facet* — normally auto-suggested from `duration_nights` but overridable (e.g. a 6-night package intentionally tagged "7 Nights" for a marketing bucket) — kept as a tag rather than only relying on a numeric filter because faceted-browse UIs read far more naturally off a small fixed set of bands than a raw number range.

**On `inclusion` values that look like transfer types** (Airport Transfer, Speedboat Transfer, Seaplane Transfer, Domestic Flight): these are **discovery/filter tags**, not the actual booked components — "this package includes some kind of speedboat transfer" for search/filtering. The real, dated, priced transfer is a `transfer_service` referenced in the package's itinerary (§9). Both exist for different reasons: the category tag makes the package filterable and summarizable at a glance; the itinerary item is the literal thing a guest experiences on Day 1. Neither duplicates the other's data — the tag carries no price/schedule, the itinerary item carries no marketing copy.

---

## 9. Package Itinerary

A package is a day-by-day sequence, not an unordered bag of related nodes. `package_components` from Task 2 rev 1 is **replaced** by two tables — it was a flat, day-blind junction and can't represent "Day 1: transfer, Day 1–3: Hotel A, Day 3: transfer, Day 4–6: Hotel B."

```sql
create table package_itinerary_days (
  id             uuid primary key default gen_random_uuid(),
  package_id     uuid not null references nodes(id) on delete cascade,
  day_number     int not null,
  night_count    int not null default 1,     -- nights at this stage; 0 for a pure transfer/activity day
  title          text,                        -- e.g. "Arrival & transfer to Maafushi"
  description    text,
  sort_order     int not null default 0,
  unique (package_id, day_number)
);

create table package_itinerary_items (
  id                    uuid primary key default gen_random_uuid(),
  itinerary_day_id      uuid not null references package_itinerary_days(id) on delete cascade,
  component_type        text not null check (component_type in ('node','transfer_service')),
  component_node_id     uuid references nodes(id),
  transfer_service_id   uuid references transfer_services(id),
  component_role        text not null check (component_role in (
                           'accommodation', 'activity', 'transfer', 'meal', 'free_time', 'excursion', 'other'
                         )),
  quantity              int not null default 1,
  notes                 text,
  sort_order            int not null default 0,
  check (
    (component_type = 'node' and component_node_id is not null and transfer_service_id is null)
    or
    (component_type = 'transfer_service' and transfer_service_id is not null and component_node_id is null)
  )
);
create index package_itinerary_items_day_idx on package_itinerary_items(itinerary_day_id);
```

Walking the worked example: `package_itinerary_days` gets one row per day (1–7); `package_itinerary_items` gets, e.g., Day 1 → {transfer_service: airport→Maafushi, role=`transfer`} + {node: Hotel A, role=`accommodation`}; Day 2 → {node: Snorkeling activity, role=`activity`} + {node: Hotel A, role=`accommodation`}; Day 4 → {transfer_service: Maafushi→Thulusdhoo, role=`transfer`} + {node: Hotel B, role=`accommodation`}; and so on. Repeating "Hotel A" as an item on each night's day is intentional — it keeps every day self-describing for rendering ("where am I this day") without needing to derive stay-ranges from sparse start/end markers.

**No data is duplicated into the package:** every item is a reference (`component_node_id` → the actual hotel/activity node, or `transfer_service_id` → the actual transfer service), never a copy of that thing's title, price, or description. If the linked hotel's photos or price change, every package itinerary referencing it reflects that automatically on next render.

`package_id` is reachable through `itinerary_day_id → package_itinerary_days.package_id`, so there is exactly one place ("what's in this package") to query, not two overlapping systems — `package_components` is removed entirely rather than kept alongside this.

---

## 10. Activities vs. Sites

Two genuinely different kinds of thing were being conflated:

- **Bookable activities/services** — a guided dive, a night dive, a fishing trip, a surf lesson, an island-hopping tour. These are commercial offerings: they have a price, a provider, a duration, and can be booked. Modeled by the existing `activities` table (Task 2 rev 1 §5), unchanged.
- **Geographic/experience sites** — Fish Head, Banana Reef, Manta Point, a named surf break, a known fishing ground. These are *places*, not products — nobody "books Banana Reef"; operators book *trips to* it. Forcing every site into the `activities` table (as a commercial entity with a price) was the actual bug this review is calling out.

**Resolution: sites are `locations`, not `activities`.** Because `locations` rows already share the `nodes` backbone (§2 of Task 2 rev 1), a site gets full SEO metadata, a canonical URL, reviews, media, and search/filter visibility for free, with zero new tables — it only needed the right `location_type` values:

```sql
-- locations.location_type check constraint, final:
check (location_type in (
  'country', 'atoll', 'island', 'locality', 'airport', 'seaport', 'harbour', 'poi',
  'dive_site', 'surf_break', 'fishing_spot'
))
```

A site sits in the same hierarchy as everything else via `parent_id` (Banana Reef's parent is its atoll or nearest island) — no separate geography system. Site-specific descriptive facts (depth range and visibility for a dive site; break type and best swell direction for a surf break; target species and season for a fishing spot) live in `nodes.attributes` JSONB, validated per `location_type` via `attribute_definitions` — the same mechanism already used for activity-category-specific facts (§11 draws this exact line explicitly).

**How activities and sites connect — no new junction needed:** a "Guided Dive at Banana Reef" activity references Banana Reef through the *existing* `node_locations` table (a site is a location, so this already works) — `primary` location = Banana Reef, `secondary` = its atoll. Ten different operators' dive-trip activities can all reference the same Banana Reef row without duplicating its description, coordinates, or depth data ten times; and Banana Reef can be browsed, reviewed, and appear in search entirely independent of any specific operator's trip.

**Bookability stays where it belongs:** sites never get a `bookable_products` row — they have no price of their own. Only `activities`/`accommodations`/`packages` (opted in via `bookable_products`) and `transfer_services` are ever bookable, which is exactly "bookings where appropriate" without inventing a parallel booking concept for geography.

---

## 11. JSONB Boundaries

**Relational (real columns/tables — never JSONB):**

| Category | Where |
|---|---|
| Identity | `nodes.id`, `node_type`, `slug`, `title`, `status`, timestamps |
| Locations | `locations` table, `parent_id`, `path`, `lat`/`lng` |
| Providers | `providers` table |
| Relationships | `node_locations`, `node_categories`, `package_itinerary_days`/`items` |
| Package taxonomy | `node_categories` rows linking a package to `traveler-type`/`package-style`/`duration-band`/`inclusion`/`theme` categories |
| Package components | `package_itinerary_days`, `package_itinerary_items` |
| Transfer origin/destination | `transfer_routes.origin_location_id` / `destination_location_id` |
| Transfer providers | `transfer_services.provider_id` |
| Prices needed for filtering | `accommodations.price_tier`, `activities.price_from`, `transfer_services.price`, `packages.duration_nights`/`price_from` |
| Booking fields | every column on `bookings` (§3) |
| Reviews | `reviews` table |
| Media | `media_assets`, `node_media`, `transfer_service_media` |
| Status | `nodes.status`, `bookings.status`, `transfer_services.status` |
| SEO identity | `nodes.slug`, `meta_title`, `meta_description`, canonical derivation (§21) |

**JSONB (`nodes.attributes`, GIN-indexed) — only for:**
- Genuinely flexible, category-specific descriptive attributes: dive site depth/visibility, surf break type/swell direction, fishing spot species/season, activity-category-specific facts (certification required, boat type).
- Uncommon/rare descriptive fields that apply to very few entities and don't justify a dedicated column.
- Future attributes that don't yet justify a migration.

**The promotion rule** (governs every future addition, not just today's): if a fact needs to be filtered precisely, sorted on, aggregated, or referenced with real foreign-key integrity, it belongs in a column — promote it out of `attributes` the moment that's true. If it's purely descriptive, optional, or too rare to justify a schema change yet, it stays in `attributes`. This is why, for example, transfer service fields (price, capacity, schedule — all filter/sort-critical) were made explicit columns in §1 rather than JSONB, while dive-site depth (descriptive, occasionally filtered, not sorted/aggregated across the platform) stays in `attributes`.

---

## 12. Location Hierarchy

Unchanged in shape from Task 2 rev 1, confirmed here with the §10 sites addition folded in:

```
Maldives (country, root)
 └─ Atoll                      e.g. Kaafu Atoll
      └─ Island                 e.g. Thulusdhoo, Malé, Hulhumalé, a private resort island
           ├─ Locality/district    only where it genuinely exists
           ├─ Airport / Seaport / Harbour   (parent = nearest island)
           └─ Dive site / Surf break / Fishing spot   (parent = nearest island or atoll)
```

**One canonical row per place** — Thulusdhoo exists exactly once in `locations`; atoll/country ancestry is always derived by walking `parent_id`/`ltree`, never re-stored on the entities that reference it.

**How everything connects to locations:**

| Entity | Mechanism |
|---|---|
| Accommodations | `node_locations` — primary = island (or the resort's own island) |
| Activities | `node_locations` — primary = the site if the activity happens at one (§10), else the island |
| Sites | *are* `locations` rows themselves — connected via `parent_id`, not a junction |
| Transfers | `transfer_routes.origin_location_id` / `destination_location_id` — direct FKs, not `node_locations`, because a route has exactly two fixed geographic roles, not an open set of associated places |
| Packages | `node_locations` for overall marketing location tags (e.g. "Kaafu Atoll package"); day-to-day geography is also derivable via the itinerary's components' own locations, never duplicated |
| Articles | `node_locations`, same as Task 2 rev 1 — e.g. a "Diving in Kaafu Atoll" guide tagged to Kaafu Atoll |

---

## 13. SEO URL Architecture

**Canonical URLs never depend on an entity's location.** The category-first structure from Task 2 rev 1 stands; location is a discovery/relationship mechanism (location hub pages, filters, breadcrumbs) layered on top, never part of an entity's own canonical path.

**Generation rule — one function, one source of truth:**

```
canonical_path(node) = '/maldives/' + url_segment(node.node_type, node.subtype) + '/' + node.slug + '/'
```

`url_segment` is a fixed, small mapping table (design-time constant, defined once and used both to render `<link rel="canonical">` and to build the sitemap, so the two can never diverge):

| `node_type` / subtype | URL segment |
|---|---|
| `accommodation` (hotel) | `hotels` |
| `accommodation` (resort) | `resorts` |
| `accommodation` (guesthouse) | `guesthouses` |
| `accommodation` (villa) | `villas` |
| `activity` (general/watersports/excursion/…) | `activities` |
| `activity` (fishing) | `fishing` |
| `activity` (diving) | `diving` |
| `activity` (surfing) | `surfing` |
| `location` (dive_site) | `dive-sites` |
| `location` (surf_break) | `surf-spots` |
| `location` (fishing_spot) | `fishing-spots` |
| `location` (airport/seaport/harbour) | `travel-points` |
| `transfer_route` | `transfers` |
| `package` | `packages` |
| `article` | `travel-guide` |
| `provider` | `providers` |

Country/atoll/island/locality `locations` keep the nested location-hub structure already established (`/maldives/atolls/[atoll-slug]/[island-slug]/`) — that nesting describes the *administrative hierarchy's own pages*, not an entity borrowing location in its URL, so it does not conflict with the "no location-dependent entity URLs" rule. Every other `location_type` (sites, transfer points) gets a flat, category-first path like any other entity, per the rule above — a dive site's URL never encodes which atoll it's in.

**Uniqueness/stability:** guaranteed by `UNIQUE (node_type, slug)` on `nodes` plus the fixed, reviewed `url_segment` mapping (no two `node_type`/subtype pairs are ever assigned the same segment) — the path is deterministic from data that never changes after creation except a deliberate slug edit (which is exactly when a redirect, §22, gets created).

**Filtered/query-param URLs are never canonical targets.** Search results and filtered listing pages (`/maldives/search?...`, `/maldives/hotels/?budget=true`) always carry `<link rel="canonical">` pointing at the unfiltered listing page, and combinations that add no unique value are `noindex` — they are explicitly not treated as independently indexable URLs.

---

## 14–20. (Reserved — no new requirement text was supplied for point 14 onward in this review)

The review's item 14 ("LEGACY URL MIGRATION") was sent without a body. Nothing here has changed as a result — the existing redirect design from Task 2 rev 1 is retained, and its consistency against every change made in this revision is checked explicitly in §22 below. If there are further specific requirements for legacy URL migration, they should be supplied for a follow-up revision; nothing in this document assumes they won't be.

---

## 21. Redirect Management (Retained, Re-Verified Against This Revision)

Unchanged from Task 2 rev 1, still fully data-agnostic (no live crawl of `maldivestour.guide` is available in this environment — see the status note at the top of this document):

```sql
alter table nodes add column legacy_slugs text[] default '{}';
create index nodes_legacy_slugs_gin on nodes using gin (legacy_slugs);

create table url_redirects (
  id               uuid primary key default gen_random_uuid(),
  source_path      text not null unique,
  target_type      text not null check (target_type in ('node','path','external_url')),
  target_node_id   uuid references nodes(id),
  target_path      text,
  status_code      smallint not null default 301 check (status_code in (301,302,308)),
  is_active        boolean not null default true,
  notes            text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index url_redirects_active_idx on url_redirects(source_path) where is_active;
```

**Explicit consistency check against this revision's changes:**
- `transfer_routes` are nodes → a legacy transfer-route-style URL redirects straight to `target_node_id` like any other entity. No change needed.
- `transfer_services` are **not** nodes and have no canonical URL of their own (§2) → a legacy URL that referred to a specific operator's transfer offering has no single equivalent node to redirect to; it redirects to the **route's** page (`target_node_id` = the parent `transfer_route`), where that operator's current service, if still offered, appears inline. This is a real, deliberate consequence of the routes-are-nodes/services-aren't decision, not a gap — noted here so it isn't rediscovered as a bug later.
- `package_components` is removed and replaced by the itinerary tables (§9) → this affects how a package's *contents* are queried, not its URL; package canonical URLs and any redirects to them are unaffected.
- The `activities` vs `locations`(sites) split (§10) means a legacy URL that used to point at, say, a "Banana Reef" page built as an activity now redirects to the equivalent **location** node instead — still just `target_node_id`, no schema change required, only a different `node_type` at the far end.

No part of this mechanism needed to change to stay correct under this revision — that is the intended payoff of routing every redirect through `nodes.id` rather than through type-specific tables.

---

## 22. Complete Database Schema Reference (Consolidated, Final)

Everything below is exactly as it would be applied as migrations **when building is approved** — nothing has been run.

```sql
-- Extensions
create extension if not exists pgcrypto;
create extension if not exists ltree;
create extension if not exists pg_trgm;

-- Backbone
create table nodes (
  id                   uuid primary key default gen_random_uuid(),
  node_type            text not null check (node_type in (
                          'location', 'category', 'provider', 'accommodation',
                          'activity', 'transfer_route', 'package', 'article'
                        )),
  slug                 text not null,
  title                text not null,
  summary              text,
  status               text not null default 'draft' check (status in ('draft','published','archived')),
  rating_avg           numeric(3,2) default 0,
  rating_count         int default 0,
  attributes           jsonb not null default '{}'::jsonb,
  legacy_slugs         text[] default '{}',
  meta_title           text,
  meta_description     text,
  og_image_media_id    uuid,
  created_by           uuid references auth.users(id),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  published_at         timestamptz,
  unique (node_type, slug)
);
create index nodes_status_idx     on nodes(status);
create index nodes_attributes_gin on nodes using gin (attributes jsonb_path_ops);
create index nodes_search_idx     on nodes using gin (to_tsvector('english', title || ' ' || coalesce(summary,'')));
create index nodes_legacy_slugs_gin on nodes using gin (legacy_slugs);

-- Geography (§10, §12)
create table locations (
  id                    uuid primary key references nodes(id) on delete cascade,
  location_type         text not null check (location_type in (
                           'country', 'atoll', 'island', 'locality', 'airport', 'seaport', 'harbour', 'poi',
                           'dive_site', 'surf_break', 'fishing_spot'
                         )),
  parent_id             uuid references locations(id),
  path                  ltree not null,
  lat                   numeric(9,6),
  lng                   numeric(9,6),
  timezone              text default 'Indian/Maldives',
  is_inhabited          boolean,
  administrative_code   text
);
create index locations_path_gist  on locations using gist (path);
create index locations_parent_idx on locations(parent_id);

-- Taxonomy (§8)
create table categories (
  id                uuid primary key references nodes(id) on delete cascade,
  category_group    text not null check (category_group in (
                       'accommodation-type', 'activity-type', 'amenity',
                       'traveler-type', 'package-style', 'duration-band', 'inclusion', 'theme'
                     )),
  parent_id         uuid references categories(id),
  path              ltree not null
);
create index categories_path_gist on categories using gist (path);

create table attribute_definitions (
  id                     uuid primary key default gen_random_uuid(),
  applies_to_node_type   text not null,
  applies_to_subtype     text,
  key                    text not null,
  label                  text not null,
  data_type              text not null check (data_type in ('text','number','boolean','enum','date')),
  unit                   text,
  is_filterable          boolean default true,
  enum_options           text[],
  sort_order             int default 0,
  unique (applies_to_node_type, applies_to_subtype, key)
);

-- Businesses
create table providers (
  id                uuid primary key references nodes(id) on delete cascade,
  legal_name        text,
  contact_email     text,
  contact_phone     text,
  website_url       text,
  license_number    text,
  is_verified       boolean default false
);

-- Accommodation (§4 of rev 1, unchanged)
create table accommodations (
  id                        uuid primary key references nodes(id) on delete cascade,
  accommodation_type        text not null check (accommodation_type in ('hotel','resort','guesthouse','villa','other')),
  operated_by_provider_id   uuid references providers(id),
  star_rating               smallint check (star_rating between 1 and 5),
  price_tier                text check (price_tier in ('budget','mid','luxury','ultra_luxury')),
  room_count                int,
  all_inclusive             boolean default false,
  overwater_villas          boolean default false,
  check_in_time             time,
  check_out_time            time,
  currency                  text default 'USD'
);

-- Activities (§5 of rev 1, unchanged; sites moved out to locations per §10)
create table activities (
  id                        uuid primary key references nodes(id) on delete cascade,
  activity_category         text not null check (activity_category in (
                               'general', 'fishing', 'diving', 'surfing', 'watersports',
                               'excursion', 'island_hopping', 'spa', 'culture'
                             )),
  operated_by_provider_id   uuid references providers(id),
  duration_minutes          int,
  min_age                   smallint,
  difficulty                text check (difficulty in ('beginner','intermediate','advanced','all_levels')),
  price_from                numeric(10,2),
  currency                  text default 'USD',
  max_participants          int
);

-- Transfers (§1, §2 — final model)
create table transfer_routes (
  id                          uuid primary key references nodes(id) on delete cascade,
  origin_location_id          uuid not null references locations(id),
  destination_location_id     uuid not null references locations(id),
  distance_km                 numeric(6,2),
  typical_duration_minutes    int,
  unique (origin_location_id, destination_location_id)
);
create index transfer_routes_origin_idx      on transfer_routes(origin_location_id);
create index transfer_routes_destination_idx on transfer_routes(destination_location_id);

create table transfer_services (
  id                     uuid primary key default gen_random_uuid(),
  route_id               uuid not null references transfer_routes(id) on delete cascade,
  provider_id            uuid references providers(id),
  transfer_type          text not null check (transfer_type in (
                            'speedboat','seaplane','domestic_flight','ferry','private_yacht','land_transfer'
                          )),
  vehicle_type           text,
  shared_or_private      text not null check (shared_or_private in ('shared','private')),
  departure_time         time,
  arrival_time           time,
  duration_minutes       int,
  price                  numeric(10,2) not null,
  currency               text not null default 'USD',
  capacity               int,
  luggage_allowance      text,
  operating_days         text[],
  status                 text not null default 'active' check (status in ('active','seasonal','suspended','discontinued')),
  pickup_instructions    text,
  dropoff_instructions   text,
  booking_requirements   text,
  cancellation_policy    text,
  description            text,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);
create index transfer_services_route_idx    on transfer_services(route_id);
create index transfer_services_provider_idx on transfer_services(provider_id);

create table transfer_service_media (
  transfer_service_id   uuid not null references transfer_services(id) on delete cascade,
  media_id              uuid not null references media_assets(id) on delete cascade,
  role                  text not null check (role in ('hero','gallery')),
  sort_order            int default 0,
  primary key (transfer_service_id, media_id, role)
);

-- Packages (§8, §9 — final model)
create table packages (
  id                        uuid primary key references nodes(id) on delete cascade,
  duration_nights           int,
  price_from                numeric(10,2),
  currency                  text default 'USD',
  operated_by_provider_id   uuid references providers(id)
);

create table package_itinerary_days (
  id             uuid primary key default gen_random_uuid(),
  package_id     uuid not null references nodes(id) on delete cascade,
  day_number     int not null,
  night_count    int not null default 1,
  title          text,
  description    text,
  sort_order     int not null default 0,
  unique (package_id, day_number)
);

create table package_itinerary_items (
  id                    uuid primary key default gen_random_uuid(),
  itinerary_day_id      uuid not null references package_itinerary_days(id) on delete cascade,
  component_type        text not null check (component_type in ('node','transfer_service')),
  component_node_id     uuid references nodes(id),
  transfer_service_id   uuid references transfer_services(id),
  component_role        text not null check (component_role in (
                           'accommodation','activity','transfer','meal','free_time','excursion','other'
                         )),
  quantity              int not null default 1,
  notes                 text,
  sort_order            int not null default 0,
  check (
    (component_type = 'node' and component_node_id is not null and transfer_service_id is null)
    or
    (component_type = 'transfer_service' and transfer_service_id is not null and component_node_id is null)
  )
);
create index package_itinerary_items_day_idx on package_itinerary_items(itinerary_day_id);

-- Articles
create table articles (
  id                   uuid primary key references nodes(id) on delete cascade,
  body                 text not null,
  reading_time_minutes int,
  author_id            uuid references auth.users(id)
);

-- Junctions
create table node_locations (
  node_id       uuid not null references nodes(id) on delete cascade,
  location_id   uuid not null references locations(id) on delete cascade,
  relation      text not null default 'primary' check (relation in ('primary','secondary')),
  primary key (node_id, location_id)
);
create index node_locations_location_idx on node_locations(location_id);

create table node_categories (
  node_id       uuid not null references nodes(id) on delete cascade,
  category_id   uuid not null references categories(id) on delete cascade,
  primary key (node_id, category_id)
);
create index node_categories_category_idx on node_categories(category_id);

-- Generic systems
create table reviews (
  id            uuid primary key default gen_random_uuid(),
  node_id       uuid not null references nodes(id) on delete cascade,
  user_id       uuid not null references auth.users(id),
  rating        smallint not null check (rating between 1 and 5),
  title         text,
  body          text,
  status        text not null default 'pending' check (status in ('pending','published','rejected')),
  created_at    timestamptz not null default now(),
  unique (node_id, user_id)
);
create index reviews_node_idx on reviews(node_id) where status = 'published';

create table article_comments (
  id                  uuid primary key default gen_random_uuid(),
  article_id          uuid not null references nodes(id) on delete cascade,
  user_id             uuid not null references auth.users(id),
  parent_comment_id   uuid references article_comments(id),
  body                text not null,
  status              text not null default 'visible' check (status in ('visible','flagged','removed')),
  created_at          timestamptz not null default now()
);
create index article_comments_article_idx on article_comments(article_id);

create table favorites (
  user_id     uuid not null references auth.users(id) on delete cascade,
  node_id     uuid not null references nodes(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (user_id, node_id)
);

create table media_assets (
  id             uuid primary key default gen_random_uuid(),
  media_type     text not null check (media_type in ('image','youtube')),
  storage_path   text,
  youtube_id     text,
  alt_text       text,
  credit         text,
  width          int,
  height         int,
  created_at     timestamptz not null default now()
);

create table node_media (
  node_id      uuid not null references nodes(id) on delete cascade,
  media_id     uuid not null references media_assets(id) on delete cascade,
  role         text not null check (role in ('hero','gallery','thumbnail')),
  sort_order   int default 0,
  primary key (node_id, media_id, role)
);

-- Booking / inquiry (§3–§7 — final model)
create table bookable_products (
  id              uuid primary key references nodes(id) on delete cascade,
  booking_mode    text not null default 'inquiry' check (booking_mode in ('inquiry','instant')),
  base_price      numeric(10,2),
  currency        text default 'USD',
  max_guests      int
);

create table booking_reference_counters (
  year         int primary key,
  last_value   int not null default 0
);

create table bookings (
  id                         uuid primary key default gen_random_uuid(),
  booking_reference          text not null unique,
  product_type               text not null check (product_type in ('node','transfer_service')),
  product_node_id            uuid references bookable_products(id),
  transfer_service_id        uuid references transfer_services(id),
  user_id                    uuid references auth.users(id),
  customer_name              text not null,
  customer_email             text not null,
  customer_phone             text,
  customer_whatsapp          text,
  origin_location_id         uuid references locations(id),
  destination_location_id    uuid references locations(id),
  travel_date                date,
  travel_time                time,
  return_date                date,
  return_time                time,
  trip_type                  text check (trip_type in ('one_way','round_trip','multi_day','n_a')),
  adults                     int not null default 1,
  children                   int not null default 0,
  infants                    int not null default 0,
  flight_number               text,
  special_requests             text,
  estimated_price             numeric(10,2),
  quoted_price                 numeric(10,2),
  currency                     text not null default 'USD',
  internal_notes               text,
  status                       text not null default 'new' check (status in (
                                  'new','contacted','pending','confirmed','cancelled','completed'
                                )),
  notification_status          text not null default 'pending' check (notification_status in ('pending','sent','failed')),
  created_at                   timestamptz not null default now(),
  updated_at                   timestamptz not null default now(),
  check (
    (product_type = 'node' and product_node_id is not null and transfer_service_id is null)
    or
    (product_type = 'transfer_service' and transfer_service_id is not null and product_node_id is null)
  )
);
create index bookings_reference_idx        on bookings(booking_reference);
create index bookings_status_idx           on bookings(status);
create index bookings_user_idx             on bookings(user_id);
create index bookings_product_node_idx     on bookings(product_node_id);
create index bookings_transfer_service_idx on bookings(transfer_service_id);

create table booking_notifications (
  id                    uuid primary key default gen_random_uuid(),
  booking_id            uuid not null references bookings(id) on delete cascade,
  notification_type     text not null check (notification_type in ('admin_alert','customer_confirmation')),
  recipient_email       text not null,
  status                text not null default 'pending' check (status in ('pending','sent','failed')),
  provider_message_id   text,
  error_message         text,
  attempted_at          timestamptz not null default now(),
  sent_at               timestamptz
);
create index booking_notifications_booking_idx on booking_notifications(booking_id);

create table platform_settings (
  key            text primary key,
  value          text not null,
  description    text,
  updated_at     timestamptz not null default now()
);

-- Identity
create table profiles (
  id             uuid primary key references auth.users(id) on delete cascade,
  display_name   text,
  avatar_url     text,
  bio            text,
  home_country   text,
  role           text not null default 'user' check (role in ('user','editor','admin')),
  created_at     timestamptz not null default now()
);

-- Migration support (§21)
create table url_redirects (
  id               uuid primary key default gen_random_uuid(),
  source_path      text not null unique,
  target_type      text not null check (target_type in ('node','path','external_url')),
  target_node_id   uuid references nodes(id),
  target_path      text,
  status_code      smallint not null default 301 check (status_code in (301,302,308)),
  is_active        boolean not null default true,
  notes            text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index url_redirects_active_idx on url_redirects(source_path) where is_active;

-- Booking reference generator (§4)
create or replace function generate_booking_reference() returns trigger as $$
declare
  next_val int;
  yr int := extract(year from now());
begin
  insert into booking_reference_counters (year, last_value)
  values (yr, 1)
  on conflict (year) do update set last_value = booking_reference_counters.last_value + 1
  returning last_value into next_val;
  new.booking_reference := 'MTG-' || yr || '-' || lpad(next_val::text, 6, '0');
  return new;
end;
$$ language plpgsql;

create trigger set_booking_reference
  before insert on bookings
  for each row
  when (new.booking_reference is null)
  execute function generate_booking_reference();
```

**What was removed in this revision:** `package_components` (replaced by `package_itinerary_days`/`items`, §9); the `transfer_option` node type and the earlier single-table `transfer_options` (replaced by `transfer_routes` + `transfer_services`, §1–§2); the plain `auth.uid() = user_id` RLS policy on bookings as the sole access control (replaced by the RPC + role-based model, §7).

---

## 23. Entity-Relationship Diagram (Final, Matches Schema Exactly)

```
                                ┌────────────┐
                                │   nodes    │  location · category · provider · accommodation ·
                                └─────┬──────┘  activity · transfer_route · package · article
   ┌────────┬───────────┬──────┬─────┴─────┬──────────────┬───────────┬──────────┐
   ▼        ▼           ▼      ▼           ▼              ▼           ▼          ▼
locations categories providers accommodations activities transfer_routes packages articles
   │          │           │        │            │              │            │
   │          │           └────────┴────────────┴──────────────┘            │
   │          │              (operated_by_provider_id)                      │
   │          │                                                              │
   └──node_locations                    node_categories ──────────────────────┘
        (any node ↔ any location)            (any node ↔ any category,
                                                incl. package taxonomy §8)

transfer_routes ──< transfer_services >── providers          (route has many services;
      │                    │                                  service belongs to one route)
      │                    ├──< transfer_service_media >── media_assets
      │                    │
locations(origin/destination) ──── transfer_routes            (direct FK, not node_locations)

nodes ──< reviews                (node_id, user_id, rating — routes & providers reviewable;
                                   services are NOT — §2)
nodes ──< favorites               (node_id, user_id)
nodes ──< node_media >── media_assets
nodes(article) ──< article_comments   (threaded, user_id)

nodes(bookable node types) ──< bookable_products
bookable_products ──< bookings >── transfer_services      (bookings.product_type discriminates
        │                                                   which FK is populated — §3)
auth.users ──○ bookings.user_id (nullable — guest bookings, §3)
bookings ──< booking_notifications
platform_settings, booking_reference_counters             (support tables, staff-only, §6/§4)

nodes(package) ──< package_itinerary_days ──< package_itinerary_items >── nodes / transfer_services
                                                                            (component_type discriminates)

auth.users ── profiles (1:1, role)
nodes.legacy_slugs[] / url_redirects → nodes (canonical target only — §21)
```

Every relationship above corresponds 1:1 to a foreign key or check constraint in §22 — nothing in this diagram is aspirational or simplified away from the actual schema.

---

## 24. Security, Permissions & RLS (Consolidated, Including §7's Booking Model)

- **RLS enabled on every table, default-deny**, as in rev 1: public `SELECT` on `nodes` and its detail/junction/media tables only where `status = 'published'`; `INSERT`/`UPDATE`/`DELETE` restricted to `profiles.role IN ('editor','admin')`.
- **`bookings`** — no policy relies on `auth.uid() = user_id`; writes go through a `SECURITY DEFINER` RPC, reads are staff-only plus a narrow `get_my_bookings()` function for the owning authenticated user (§7, full detail there).
- **`reviews`, `favorites`, `article_comments`** — insert requires `auth.uid() = user_id` (these *do* require an account, unlike bookings — reviewing/favoriting are identity-bound actions by design); select public for published/visible rows.
- **`booking_notifications`, `booking_reference_counters`, `platform_settings`, `url_redirects`** — staff/service-role only, never exposed to `anon`/`authenticated`.
- **`profiles.role`** excluded from the user's own update policy — no self-escalation path.
- Every Server Action re-validates input with Zod regardless of client-side validation; the Supabase service-role key never reaches the browser.

---

**Nothing has been built.** This is the final revised design for review. It has not yet been approved for implementation — that approval is a separate, explicit step.
