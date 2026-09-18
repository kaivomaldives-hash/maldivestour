# MTG — Complete System Architecture & Database Design (Task 2)

Status: **Design only. Nothing built.** No Next.js project, no Supabase project, no database, no packages, no redirects, no pages have been created. This document extends Task 1's blueprint (`docs/ARCHITECTURE_BLUEPRINT.md`) into a complete, concrete system and database design.

**Note on legacy-site data:** this design was produced *without* a live crawl of `maldivestour.guide` — this environment's network egress to that domain is blocked, and no prior SEO/URL audit exists in the repository. Rather than fabricate findings about the existing site, §21 (Redirect Management) is built as a **generic, data-agnostic migration mechanism**: a redirect table + legacy-slug column that can absorb the real legacy URL list (sitemap export, crawl, or Search Console export) whenever it's supplied, without any redesign. Nothing about the rest of the architecture depends on that data being available now.

---

## 1. System Architecture

MTG is a single Next.js application backed by one Supabase Postgres database. There is no separate backend service — Postgres, via Supabase, *is* the API layer (through RLS-protected queries/views/functions), which keeps the system to two moving parts (app + database) instead of three or four.

```
┌─────────────────────────────────────────────────────────────────────┐
│  Browser / Search Engine Crawler                                     │
└───────────────┬────────────────────────────────────────────────────┘
                 │ HTTPS
┌───────────────▼────────────────────────────────────────────────────┐
│  Next.js (App Router, TypeScript) — Vercel                           │
│                                                                        │
│  Middleware ── legacy URL check → url_redirects lookup → 301/308      │
│                (falls through to normal routing if no match)          │
│                                                                        │
│  Server Components (read path)          Server Actions (write path)   │
│  ├─ location/category/entity pages      ├─ submit review              │
│  ├─ search & filter results             ├─ toggle favorite            │
│  ├─ sitemap / robots / JSON-LD routes    ├─ post comment               │
│  └─ admin CMS (role-gated)               └─ submit booking inquiry     │
│                                                                        │
│  lib/db  (repository layer — the only code that queries Supabase)     │
│  lib/seo (metadata + JSON-LD builders)                                │
│  lib/search (query builder, swappable backend)                        │
└───────────────┬────────────────────────────────────────────────────┘
                 │ Supabase client (anon key, RLS-enforced) / service role (server-only)
┌───────────────▼────────────────────────────────────────────────────┐
│  Supabase                                                             │
│  ├─ Postgres (nodes backbone + typed detail tables, see §23)          │
│  │    extensions: pgcrypto, ltree, pg_trgm, (postgis — phase 2)       │
│  ├─ Auth (auth.users — email/password + OAuth)                        │
│  ├─ Storage (media buckets: images, avatars)                          │
│  ├─ RLS policies (public read on published; owner/role-gated writes)  │
│  └─ Edge Functions / pg_cron (rating rollups, sitemap cache warm,     │
│       booking notification emails)                                    │
└────────────────────────────────────────────────────────────────────┘
```

**How the pieces interact, concretely:**

- **Content pages** (hotels, resorts, activities, articles, location hubs) are Server Components calling repository functions in `lib/db`, which run RLS-scoped Postgres queries/RPCs. Rendered with ISR; republished via on-demand `revalidatePath` when an editor publishes/edits in the admin.
- **Search & filters** run server-side (`lib/search`) against Postgres full-text + JSONB attribute queries at launch; the same interface can be repointed at Typesense/Meilisearch later without touching page code (§14).
- **Reviews, comments, favorites, booking inquiries** are Server Actions that validate input (Zod), then insert through the Supabase client under the requesting user's session — RLS decides what they're allowed to write, so the app layer doesn't have to re-implement authorization.
- **Media (images + YouTube)** is uploaded to Supabase Storage via signed URLs issued by a Server Action, then attached to any entity through the generic `node_media` join — the same upload/attach flow works for a hotel gallery, a dive-site hero shot, or a category banner. YouTube videos store only the video ID (no file), rendered via a lite embed component.
- **Admin/CMS** is a role-gated route group in the *same* Next.js app (not a separate CMS product) — because it writes through the same repository layer and RLS rules as the public site, there's exactly one source of truth for what an entity looks like.
- **SEO/sitemap/structured data** are generated at request time from the same repository queries the pages already run — no separate SEO pipeline to keep in sync.
- **Redirect management** is checked in middleware before normal routing resolves — legacy URLs either 301 to their new canonical location or fall through untouched (§21).
- **Providers/businesses** sit "behind" accommodations, activities, and transfers as the operating entity, surfaced on their own profile pages and referenced (not copied) by everything they operate (§8).

This is intentionally a **monolith with one database**, not a microservice/multi-service architecture — at MTG's scale (a content + directory + light-booking site), splitting services would add operational complexity without a corresponding benefit. The scaling levers (§25) are caching, indexing, and swapping the search backend — not splitting the system apart.

---

## 2. Core Architecture Principle: Entity-Based, No Duplication

Every addressable "thing" on the platform — every location, category, provider, accommodation, activity, transfer route, package, and article — is one row in a universal backbone table, `nodes`, plus one row in a type-specific detail table sharing the same primary key (Postgres "class-table inheritance"). This is *the* decision that makes reuse possible everywhere else the brief asks for it:

- **One canonical Island.** `locations` has exactly one row for Thulusdhoo. Every hotel, activity, dive site, fishing trip, surf spot, transfer route, package, and article that relates to Thulusdhoo references `locations.id` through a join table (`node_locations`) — the island's name, coordinates, and hierarchy are never copied into another table as free text.
- **One reviews table, one favorites table, one media-attachment table** for the entire platform — because every reviewable/favoritable/media-bearing thing is a `node`, these systems don't need a per-entity-type variant.
- **One providers table.** A dive operator that runs both diving trips and speedboat transfers is one `providers` row, referenced by both, not duplicated business info in two places.
- **Relationships are rows, not copies.** "This package includes this hotel and this fishing trip" is two rows in `package_components` pointing at existing nodes — never a re-entry of the hotel's or trip's details into the package.

**Refinement over Task 1's sketch — merging near-identical subtypes.** Task 1 proposed separate `hotels`/`resorts` tables and separate `fishing_trips`/`diving_sites`/`surf_spots` tables. Applying this task's explicit "do not duplicate the same information across unrelated tables" principle more strictly, this design merges those into:
- One `accommodations` table (`accommodation_type`: hotel / resort / guesthouse / villa / other) — they share nearly every column (rooms, price tier, amenities); only the *label* differs, which is exactly what a type discriminator is for.
- One `activities` table (`activity_category`: general / fishing / diving / surfing / watersports / excursion / island-hopping / spa / culture) — they share duration, price, difficulty, provider, location; category-specific detail (dive depth, surf break type, fishing trip type) lives in a flexible `attributes` JSONB column rather than four narrow tables with mostly-empty columns.

This keeps the number of tables proportional to genuinely different data shapes, not to the number of marketing categories — and it means adding "liveaboards" or "spa & wellness" next year is a new `accommodation_type`/`activity_category` value, not a new table plus new review/media/favorite wiring.

---

## 3. Location / Geography Architecture

One self-referencing table, `locations`, models the entire geography — administrative hierarchy *and* points of interest — because both need the same capabilities (a name, a position in the hierarchy, coordinates, and the ability to be referenced by everything else):

```sql
create table locations (
  id                    uuid primary key references nodes(id) on delete cascade,
  location_type         text not null check (location_type in (
                           'country', 'atoll', 'island', 'locality',
                           'airport', 'seaport', 'harbour', 'poi'
                         )),
  parent_id             uuid references locations(id),
  path                  ltree not null,          -- e.g. 'maldives.kaafu.thulusdhoo'
  lat                   numeric(9,6),
  lng                   numeric(9,6),
  timezone              text default 'Indian/Maldives',
  is_inhabited           boolean,
  administrative_code    text                      -- optional, e.g. official atoll/island codes
);
create index locations_path_gist  on locations using gist (path);
create index locations_parent_idx on locations(parent_id);
```

**Hierarchy:**

```
Maldives (country, root)
 └─ Atoll                     e.g. Kaafu Atoll, Addu Atoll
      └─ Island                e.g. Thulusdhoo, Hulhumalé, Malé, a private resort island
           └─ Locality/district   only where it genuinely exists (e.g. a ward within Malé)
```

**Points of interest that aren't part of the administrative chain** — airports, seaports, harbours — are still `locations` rows, `location_type = 'airport'` etc., with `parent_id` set to the nearest island (e.g. Velana International Airport's parent is Hulhulé Island) so they inherit the same breadcrumb/`ltree` machinery. This lets a *transfer route* reference an airport as an origin/destination exactly like it references an island (§6), without a separate "points of interest" system.

**Malé and Hulhumalé** need no special-casing: both are simply `locations` rows with `location_type = 'island'` and `parent_id` = Kaafu Atoll, same as any other island. Malé being the capital or Hulhumalé being reclaimed land is descriptive content (on the node's `summary`/article content), not a schema concern.

**Private-island resorts** (where the resort *is* the island) are still modeled as two nodes — one `locations` row (the island) and one `accommodations` row (the resort) — linked via `node_locations`, because the island is still a reusable reference point (for maps, for "resorts in this atoll" listings, for transfer routes) independent of whether one specific resort currently operates there.

`ltree` gives cheap, indexed answers to the queries this system runs constantly — "everything in Kaafu Atoll" is `path <@ 'maldives.kaafu'`, breadcrumbs are a path split, no recursive CTEs required.

---

## 4. Accommodation Architecture (Hotels, Resorts, Guesthouses, Villas, Other)

```sql
create table accommodations (
  id                       uuid primary key references nodes(id) on delete cascade,
  accommodation_type       text not null check (accommodation_type in (
                              'hotel', 'resort', 'guesthouse', 'villa', 'other'
                            )),
  operated_by_provider_id  uuid references providers(id),
  star_rating               smallint check (star_rating between 1 and 5),
  price_tier                text check (price_tier in ('budget','mid','luxury','ultra_luxury')),
  room_count                int,
  all_inclusive              boolean default false,
  overwater_villas           boolean default false,
  check_in_time              time,
  check_out_time             time,
  currency                  text default 'USD'
);
```

- **Location:** `node_locations` — typically one `primary` island, optionally an `atoll` as `secondary` for broader listing pages.
- **Categories/tags:** `node_categories` — e.g. Hotels/Resorts (type-level tag, mirrors `accommodation_type` for filter UI consistency), Family, Budget, Honeymoon, Dive-Friendly — any number, any group (§9).
- **Amenities** that are genuinely per-property, filterable facts (pool, spa, wifi, kids-club) live in `nodes.attributes` JSONB rather than as booleans bolted onto the table — new amenities are a new key, not a migration.
- **Provider:** `operated_by_provider_id` links to the managing business (§8) — a resort chain's brand page can list every property it operates via a reverse lookup, no duplicated company info per property.
- **Media, reviews, favorites, bookable status:** all via the generic systems (§10, §13, §12, §15) — an accommodation is just a `node`.

---

## 5. Activities, Diving, Fishing, Surfing & Watersports

```sql
create table activities (
  id                       uuid primary key references nodes(id) on delete cascade,
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
```

Category-specific facts — dive depth range and certification requirement, fishing trip type (sport / night / big-game / reef) and boat type, surf break type and best season — live in `nodes.attributes` JSONB, validated at the application layer by a Zod schema selected by `activity_category` (so the admin form and the filter UI both know what fields a diving activity needs vs. a fishing trip, without the database enforcing four different table shapes for what is structurally the same entity). `attribute_definitions` (§9) drives which keys apply to which category, so this stays data-driven rather than hardcoded per page.

Fishing, diving, and surfing all get their own top-level URL sections (`/maldives/fishing/`, `/maldives/diving/`, `/maldives/surfing/`) — that's a **routing/filtering concern** (query `activities` where `activity_category = 'diving'`), not a reason for separate tables.

---

## 6. Transfers Architecture

Transfers are first-class, SEO-relevant content (e.g. "Speedboat transfer: Velana International Airport → Thulusdhoo") and are modeled as nodes so they get their own detail pages, reviews, and search visibility like everything else:

```sql
create table transfer_options (
  id                        uuid primary key references nodes(id) on delete cascade,
  transfer_type              text not null check (transfer_type in (
                               'speedboat', 'seaplane', 'domestic_flight', 'ferry', 'private_yacht'
                             )),
  operated_by_provider_id    uuid references providers(id),
  origin_location_id         uuid not null references locations(id),
  destination_location_id    uuid not null references locations(id),
  duration_minutes           int,
  price_from                 numeric(10,2),
  currency                   text default 'USD',
  shared_or_private          text check (shared_or_private in ('shared','private'))
);
create index transfer_options_route_idx on transfer_options(origin_location_id, destination_location_id);
```

Both endpoints reference `locations` directly (an airport, a harbour, or an island) — never free-text "from"/"to" fields — so a transfer route participates in the same location hub pages as everything else ("transfers available from Velana Airport" is a query, not hand-maintained content). Transfers attach to packages via `package_components` exactly like accommodations and activities do.

---

## 7. Packages Architecture

```sql
create table packages (
  id                        uuid primary key references nodes(id) on delete cascade,
  duration_days              int,
  price_from                 numeric(10,2),
  currency                   text default 'USD',
  operated_by_provider_id    uuid references providers(id)
);

create table package_components (
  package_id     uuid not null references nodes(id) on delete cascade,
  component_id   uuid not null references nodes(id),
  quantity       int not null default 1,
  notes          text,
  sort_order     int default 0,
  primary key (package_id, component_id)
);
```

A package referencing an accommodation, two activities, and a transfer is four rows in `package_components` — the package page composes its content by joining out to each component's own node data (title, image, price, rating) at render time, so if an included hotel's price or photos change, every package that includes it stays current automatically.

---

## 8. Providers / Businesses Architecture

```sql
create table providers (
  id                 uuid primary key references nodes(id) on delete cascade,
  legal_name         text,
  contact_email      text,
  contact_phone      text,
  website_url        text,
  license_number     text,
  is_verified        boolean default false
);
```

A provider is a `node` (so it gets a public profile page, SEO metadata, media, and can be reviewed) referenced by `operated_by_provider_id` on `accommodations`, `activities`, and `transfer_options`. This is the layer that answers "what else does this dive operator run?" as a reverse query, and is also where future business-facing features (claim-your-listing, provider dashboards, verified badges) attach without touching the entity tables themselves.

---

## 9. Categories / Taxonomy System

```sql
create table categories (
  id                uuid primary key references nodes(id) on delete cascade,
  category_group    text not null check (category_group in (
                       'accommodation-type', 'activity-type', 'audience', 'trip-style', 'amenity'
                     )),
  parent_id         uuid references categories(id),
  path              ltree not null
);
create index categories_path_gist on categories using gist (path);

create table node_categories (
  node_id       uuid not null references nodes(id) on delete cascade,
  category_id   uuid not null references categories(id) on delete cascade,
  primary key (node_id, category_id)
);
create index node_categories_category_idx on node_categories(category_id);

create table node_locations (
  node_id       uuid not null references nodes(id) on delete cascade,
  location_id   uuid not null references locations(id) on delete cascade,
  relation      text not null default 'primary' check (relation in ('primary','secondary')),
  primary key (node_id, location_id)
);
create index node_locations_location_idx on node_locations(location_id);
```

Structurally identical to locations (self-referencing tree, `ltree` path), grouped so unrelated taxonomies don't collide (e.g. "Family" as an `audience` category vs. some future "Family Island" as a `trip-style`). A node attaches to any number of categories across any number of groups, which is what lets a hotel be Hotels + Family + Budget simultaneously without new columns.

**Attribute definitions** — drives dynamic, per-type filters and admin forms without schema churn:

```sql
create table attribute_definitions (
  id                     uuid primary key default gen_random_uuid(),
  applies_to_node_type   text not null,         -- 'activity', 'accommodation', ...
  applies_to_subtype     text,                  -- 'diving', 'resort', null = all subtypes
  key                    text not null,          -- 'depth_max_meters'
  label                  text not null,          -- 'Max depth'
  data_type              text not null check (data_type in ('text','number','boolean','enum','date')),
  unit                   text,
  is_filterable          boolean default true,
  enum_options           text[],
  sort_order             int default 0,
  unique (applies_to_node_type, applies_to_subtype, key)
);
```

---

## 10. Reviews & Ratings Architecture

```sql
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
```

Generic across every node type — a hotel, a fishing trip, a transfer route, or a provider are all reviewable through this one table. `nodes.rating_avg`/`rating_count` are denormalized and kept current by an `AFTER INSERT/UPDATE/DELETE` trigger, so list/search pages never need to aggregate reviews at query time.

---

## 11. Comments Architecture

```sql
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
```

Deliberately separate from reviews (threaded discussion vs. a 1-per-user rating+text) and deliberately scoped to articles only — extending to other node types later is a column rename (`article_id` → `node_id`), not a redesign.

---

## 12. Favorites Architecture

```sql
create table favorites (
  user_id     uuid not null references auth.users(id) on delete cascade,
  node_id     uuid not null references nodes(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (user_id, node_id)
);
```

One mechanism for "save this resort," "save this dive site," "save this travel guide," "save this package."

---

## 13. Media, Images & YouTube Video Architecture

```sql
create table media_assets (
  id             uuid primary key default gen_random_uuid(),
  media_type     text not null check (media_type in ('image','youtube')),
  storage_path   text,           -- Supabase Storage path, images only
  youtube_id     text,           -- YouTube video ID, videos only
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
```

One upload/attach flow and one gallery component serve hotel photo sets, island hero images, a "diving in Kaafu Atoll" YouTube embed, and a category banner alike — because they all attach to a `node_id`. YouTube assets store only the ID (never re-hosted); the app renders a privacy-respecting lite embed. Images live in Supabase Storage, served through Next.js `<Image>`; an image-transform CDN layer is a later addition (§25), not a foundation dependency.

---

## 14. Search Architecture

**Launch:** Postgres full-text search — a `tsvector` generated from `title`/`summary` (weighted) on `nodes`, combined with `pg_trgm` for typo tolerance, exposed as a Postgres function taking a query string plus location/category/attribute filters, called via Supabase RPC.

```sql
create index nodes_search_idx on nodes using gin (to_tsvector('english', title || ' ' || coalesce(summary,'')));
```

**Growth path:** because every page calls search through one `lib/search` interface, swapping the backend for Typesense or Meilisearch (better faceting, typo tolerance, and relevance tuning at scale) is a backend change behind that interface, not a rewrite of every page that searches.

Search always scopes to `status = 'published'` and composes with the location (`ltree` ancestor match) and category filters described in §9 — "diving in Kaafu Atoll" is a full-text match on `nodes` intersected with a location filter, not a special case.

---

## 15. Bookings / Inquiries Architecture

```sql
create table bookable_products (
  id              uuid primary key references nodes(id) on delete cascade,
  booking_mode    text not null default 'inquiry' check (booking_mode in ('inquiry','instant')),
  base_price      numeric(10,2),
  currency        text default 'USD',
  max_guests      int
);

create table bookings (
  id                  uuid primary key default gen_random_uuid(),
  product_id          uuid not null references nodes(id),
  user_id             uuid not null references auth.users(id),
  status              text not null default 'requested' check (status in ('requested','confirmed','cancelled','completed')),
  travel_date_start   date,
  travel_date_end     date,
  guests              int,
  total_price         numeric(10,2),
  currency            text default 'USD',
  notes               text,
  created_at          timestamptz not null default now()
);
create index bookings_user_idx    on bookings(user_id);
create index bookings_product_idx on bookings(product_id);
```

Any accommodation, activity, transfer, or package can become a `bookable_product` by adding one row — booking capability is opt-in per entity, not a separate parallel content system. **v1 scope is inquiry/lead bookings** (a request the operator/admin confirms manually) — no payment processing, no live availability engine — matching the "don't invent unnecessary features" instruction; `booking_mode = 'instant'` is reserved for a later phase (real-time availability + payment) behind the same interface.

---

## 16. Authentication & User Architecture

Identity stays entirely in Supabase Auth (`auth.users` — email/password + OAuth). A 1:1 `profiles` table carries only public/app-specific fields:

```sql
create table profiles (
  id             uuid primary key references auth.users(id) on delete cascade,
  display_name   text,
  avatar_url     text,
  bio            text,
  home_country   text,
  role           text not null default 'user' check (role in ('user','editor','admin')),
  created_at     timestamptz not null default now()
);
```

`role` drives both RLS (§24) and admin route access — no separate staff/permissions table needed at this scale. `role` is never user-writable (excluded from the self-update RLS policy) to prevent privilege escalation.

---

## 17. Admin / Content-Management Architecture

A role-gated route group (`/admin`) inside the same Next.js app, not a separate CMS product — because it reads and writes through the exact same repository layer, RLS policies, and entity schema as the public site, there is one source of truth for what a "hotel" or "package" is. Gated at both the Next.js middleware layer (redirect non-editors) and the database layer (RLS — never trust the client alone). Built around one reusable "node editor" shell (shared fields: title, slug, status, locations, categories, media, SEO fields) plus a type-specific panel per node type (accommodation fields, activity fields, etc.), rather than a bespoke screen per entity type. Includes: draft/publish workflow, review/comment moderation queue, media upload, and (§21) a redirect-management screen for editors to add/adjust legacy-URL mappings without a deploy.

---

## 18. SEO Architecture

- Per-node `meta_title`/`meta_description`, with generated fallbacks (`"{title} — {primary location}, Maldives | MTG"`), editor-overridable.
- Canonical URL derived from the node's primary location + slug (§19); enforced via `<link rel="canonical">` even when a node is reachable through a filtered/query-param URL.
- Breadcrumbs generated from the `locations`/`categories` `ltree` path, also emitted as `BreadcrumbList` JSON-LD.
- OpenGraph/Twitter metadata generated from the node's hero `node_media` row + summary.
- Internal linking is queried, not authored: "other activities on this island," "other packages including this hotel," and "diving sites in this atoll" are all derived from `node_locations`/`node_categories`/`package_components`, rendered by one reusable `<RelatedNodes>` component across every entity/location/category page — this is also what builds topical link clusters (location hub ↔ entities ↔ articles) for SEO.

---

## 19. URL Structure

Flat, category-first URLs (avoids a location × category URL explosion and duplicate-content risk from the same hotel being reachable at multiple nested paths):

```
/maldives/
/maldives/atolls/
/maldives/atolls/[atoll-slug]/
/maldives/atolls/[atoll-slug]/[island-slug]/
/maldives/hotels/[slug]/            (accommodation_type = hotel)
/maldives/resorts/[slug]/           (accommodation_type = resort)
/maldives/guesthouses/[slug]/       (accommodation_type = guesthouse)
/maldives/villas/[slug]/            (accommodation_type = villa)
/maldives/activities/[slug]/        (activity_category = general/watersports/excursion/...)
/maldives/fishing/[slug]/           (activity_category = fishing)
/maldives/diving/[slug]/            (activity_category = diving)
/maldives/surfing/[slug]/           (activity_category = surfing)
/maldives/transfers/[slug]/
/maldives/packages/[slug]/
/maldives/travel-guide/[slug]/
/maldives/providers/[slug]/
/maldives/search?...
```

Each accommodation/activity URL section is a filtered view over the shared `accommodations`/`activities` table (`WHERE accommodation_type = 'hotel'`), not a separate content system — consistent with §2/§4/§5. Slugs are unique per `node_type` (`UNIQUE (node_type, slug)` on `nodes`), so a hotel and an article can share a slug string without colliding. Location-scoped browsing happens on the atoll/island hub pages (which list everything associated via `node_locations`), not via location-nested entity URLs.

---

## 20. Sitemap & Structured-Data Strategy

**Sitemap:** a sitemap index plus one sitemap per major type (`locations`, `accommodations`, `activities`, `transfers`, `packages`, `travel-guide`, `providers`), each a route handler querying `nodes` filtered by type and `status = 'published'`, edge-cached, invalidated on publish/unpublish.

**Structured data**, generated server-side from the same data already fetched for the page (`lib/seo/jsonld.ts`):

| Node type | Schema.org type |
|---|---|
| Accommodation | `Hotel`/`Resort`/`LodgingBusiness` (+ `AggregateRating`) |
| Activity / Fishing / Diving / Surfing | `TouristAttraction` or `Product` (+ `AggregateRating`) |
| Transfer option | `Service` |
| Package | `Product`/`TouristTrip` (+ `Offer`) |
| Provider | `LocalBusiness` |
| Travel guide article | `Article` |
| Every page | `BreadcrumbList` |
| Site-wide | `Organization`/`WebSite` + `SearchAction` |

---

## 21. Redirect Management Architecture (Legacy URL Migration)

Two mechanisms, layered, so the bulk of legacy URLs cost nothing at request time and ad-hoc ones don't require a deploy:

**1. Legacy slugs on the node itself** — for content that migrates 1:1 (the old hotel page becomes the new hotel page under a new URL scheme):

```sql
alter table nodes add column legacy_slugs text[] default '{}';
create index nodes_legacy_slugs_gin on nodes using gin (legacy_slugs);
```

**2. A general-purpose redirect table** — for anything that doesn't map to a single surviving node 1:1 (merged pages, removed pages redirected to a category hub, restructured URLs):

```sql
create table url_redirects (
  id               uuid primary key default gen_random_uuid(),
  source_path      text not null unique,        -- legacy path, e.g. '/resorts/old-resort-name'
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

**How it will be used once the legacy URL list exists (not implemented now):** the bulk, known legacy → new-URL mapping is applied at Next.js's build-time `redirects()` config (fast, edge-level, no DB round trip) once that mapping is known; `url_redirects` plus a thin middleware fallback handles anything discovered or added *after* launch (a 404 that turns out to be an old URL someone still links to) so editors can add a mapping from the admin (§17) without a code deploy. Both mechanisms point at the same target — a node's canonical URL — so there is one place (`nodes.canonical` derived from type+slug) that defines truth, and redirects only ever point *at* it.

This design is deliberately data-agnostic: it works whether the eventual legacy URL list has 50 entries or 5,000, and requires no schema change once that data is available — only rows.

---

## 22. Entity-Relationship Summary

```
                         ┌────────────┐
                         │   nodes    │  (backbone: every location, category, provider,
                         └─────┬──────┘   accommodation, activity, transfer, package, article)
        ┌───────┬──────────┬──┴───┬───────────┬────────────┬───────────┐
        ▼       ▼          ▼      ▼           ▼            ▼           ▼
   locations categories providers accommodations activities transfer_options packages / articles
        │        │          │        │            │              │             │
        │        │          └────────┴────────────┴──────────────┘             │
        │        │             (operated_by_provider_id)                       │
        │        │                                                              │
        └──node_locations                node_categories──────────────────────┘
                 (any node ↔ any location)      (any node ↔ any category)

   nodes ──< reviews            (node_id, user_id, rating)
   nodes ──< favorites          (node_id, user_id)
   nodes ──< node_media >── media_assets
   nodes(article) ──< article_comments  (threaded, user_id)
   nodes ──< bookable_products ──< bookings (user_id)
   nodes(package) ──< package_components >── nodes(any component)
   locations(transfer origin/destination) ── transfer_options
   auth.users ── profiles (1:1, role)
   nodes.legacy_slugs / url_redirects → nodes (canonical target)
```

Every arrow into `nodes` from a generic system (reviews, favorites, media, categories, locations) is the mechanism that makes the platform "entity-based" rather than "table-based" — new content types plug into all of them for free.

---

## 23. Complete Database Schema Reference (Consolidated)

This consolidates every table above in dependency order, exactly as it would be applied as migrations **when building is approved** — nothing here has been run.

```sql
-- Extensions
create extension if not exists pgcrypto;
create extension if not exists ltree;
create extension if not exists pg_trgm;
-- postgis: add in phase 2 if/when maps are prioritized

-- Backbone
create table nodes ( ... );                 -- §1 interactions / §2 principle, full def below
create table locations ( ... );              -- §3
create table categories ( ... );              -- §9
create table providers ( ... );               -- §8
create table accommodations ( ... );           -- §4
create table activities ( ... );               -- §5
create table transfer_options ( ... );          -- §6
create table packages ( ... );                  -- §7
create table package_components ( ... );         -- §7
create table articles ( ... );                    -- travel guides

-- Junctions
create table node_locations ( ... );               -- §9
create table node_categories ( ... );               -- §9
create table attribute_definitions ( ... );          -- §9

-- Generic systems
create table reviews ( ... );                          -- §10
create table article_comments ( ... );                  -- §11
create table favorites ( ... );                          -- §12
create table media_assets ( ... );                        -- §13
create table node_media ( ... );                            -- §13

-- Booking
create table bookable_products ( ... );                       -- §15
create table bookings ( ... );                                  -- §15

-- Identity
create table profiles ( ... );                                    -- §16

-- Migration support
create table url_redirects ( ... );                                 -- §21
alter table nodes add column legacy_slugs text[] default '{}';        -- §21
```

Full column-level definitions for each table are given inline in their respective sections above (§3–§21) rather than repeated here, to keep this reference from drifting out of sync with the narrative design.

**`nodes` (the one definition not yet shown in full):**

```sql
create table nodes (
  id                   uuid primary key default gen_random_uuid(),
  node_type            text not null check (node_type in (
                          'location', 'category', 'provider', 'accommodation',
                          'activity', 'transfer_option', 'package', 'article'
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
create index nodes_status_idx    on nodes(status);
create index nodes_attributes_gin on nodes using gin (attributes jsonb_path_ops);
create index nodes_search_idx     on nodes using gin (to_tsvector('english', title || ' ' || coalesce(summary,'')));
```

---

## 24. Security, Permissions & RLS

- **RLS enabled on every table, default-deny.** Public `SELECT` on `nodes` and its detail/junction/media tables only where `status = 'published'`; `INSERT`/`UPDATE`/`DELETE` restricted to `profiles.role IN ('editor','admin')`.
- **User-generated content** (`reviews`, `favorites`, `article_comments`, `bookings`): insert requires `auth.uid() = user_id`; update/delete requires ownership; select is public for published/visible rows, owner+admin for the rest.
- **`profiles.role`** is excluded from the user's own update policy (guarded so only an admin-context write can change it) — prevents self-escalation to editor/admin.
- **`url_redirects`** is editor/admin-only for both read and write — it's operational data, not public content.
- Server Actions re-validate every input with Zod even though the client also validates.
- Supabase **service-role key** never reaches the browser — used only in trusted server contexts (Edge Functions, admin server actions) for the few operations RLS can't express (e.g. cross-user aggregate rollups).
- Rate limiting on review/comment/booking submission endpoints to deter spam/abuse.
- Rich text (article bodies, review text, comments) sanitized before render to prevent stored XSS.

---

## 25. Scalability & What This Phase Deliberately Excludes

**Scales without added complexity because:**
- Hierarchy queries (`locations`, `categories`) use `ltree` + GiST indexes, not recursive CTEs.
- Rating aggregates are denormalized on `nodes`, not recomputed per page view.
- ISR + on-demand revalidation means most traffic hits the edge cache, not the database.
- New content types are additive (`node_type`/`accommodation_type`/`activity_category` enum growth), never a new parallel table-and-wiring set.
- Search is swappable behind one interface (§14); redirect handling is swappable between static config and DB-backed lookup (§21) without touching callers.

**Explicitly deferred, not designed away, to avoid inventing unneeded complexity now:**
- Real-time booking availability + payments (`booking_mode = 'instant'`) — v1 is inquiry-only.
- PostGIS/interactive maps — `lat`/`lng` columns exist on `locations` today; spatial indexing and map UI are a phase-2 addition, not a schema change.
- A dedicated search service (Typesense/Meilisearch) — Postgres FTS covers launch-scale content.
- Multi-language content — `locale` columns are cheap to add before content exists; not added speculatively now (flagged as an open question in Task 1, still open).
- Provider self-service dashboards / claim-a-listing flow — the `providers` table supports it later without restructuring accommodations/activities/transfers.

---

**Nothing has been built.** This is the complete design for review. On approval, implementation follows Task 1 §22's phase order, now informed by this document's concrete schema.
