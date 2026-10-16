-- Admin list/display-order management: a manual per-node position, a
-- cached rating aggregate (so "sort by rating" is a plain ORDER BY rather
-- than an unsupported aggregate-join), and a small per-node-type table
-- recording which sort order each public listing page should use by
-- default (title A-Z, price, rating, publish date, or manual position).

-- ============================================================
-- Manual position + cached rating aggregate on `nodes`
-- ============================================================
alter table nodes add column if not exists sort_order integer;
alter table nodes add column if not exists rating_avg numeric(3,2);
alter table nodes add column if not exists rating_count integer not null default 0;

comment on column nodes.sort_order is 'Admin-set manual display position for "manual" sort mode. Null = not manually positioned (sorts last).';
comment on column nodes.rating_avg is 'Cached average of this node''s own published reviews.rating — maintained by refresh_node_rating(), never written directly.';
comment on column nodes.rating_count is 'Cached count of this node''s own published reviews — maintained by refresh_node_rating(), never written directly.';

-- Keeps nodes.rating_avg/rating_count in sync with reviews whenever a
-- review is inserted, updated (e.g. moderated into/out of 'published'),
-- or deleted — so "sort by rating" is a single ORDER BY against `nodes`
-- instead of an aggregate join PostgREST can't express in .order().
create or replace function refresh_node_rating() returns trigger as $$
declare
  affected_node_id uuid;
begin
  affected_node_id := coalesce(new.node_id, old.node_id);
  update nodes set
    rating_avg = (select round(avg(rating)::numeric, 2) from reviews where node_id = affected_node_id and status = 'published'),
    rating_count = (select count(*) from reviews where node_id = affected_node_id and status = 'published')
  where id = affected_node_id;
  return null;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists reviews_refresh_node_rating on reviews;
create trigger reviews_refresh_node_rating
  after insert or update or delete on reviews
  for each row execute function refresh_node_rating();

-- Backfill existing published reviews into the new cached columns.
update nodes n set
  rating_avg = agg.avg_rating,
  rating_count = agg.review_count
from (
  select node_id, round(avg(rating)::numeric, 2) as avg_rating, count(*) as review_count
  from reviews
  where status = 'published'
  group by node_id
) agg
where n.id = agg.node_id;

-- ============================================================
-- Per-node-type default public sort order
-- ============================================================
create table if not exists content_sort_settings (
  node_type     text primary key,
  default_sort  text not null default 'title_asc'
                check (default_sort in ('title_asc', 'price_asc', 'price_desc', 'rating_desc', 'published_desc', 'manual')),
  updated_at    timestamptz not null default now()
);

alter table content_sort_settings enable row level security;
create policy content_sort_settings_public_read on content_sort_settings for select using (true);
create policy content_sort_settings_staff_all on content_sort_settings for all
  using (is_staff()) with check (is_staff());

insert into content_sort_settings (node_type, default_sort) values
  ('package', 'title_asc'),
  ('activity', 'title_asc'),
  ('accommodation', 'title_asc'),
  ('transfer_route', 'title_asc')
on conflict (node_type) do nothing;
