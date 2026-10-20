-- Real category nodes for the 11 existing /maldives/packages/<style>/
-- pages (luxury, family, adults-only, long-stay, budget, honeymoon, solo,
-- diving, fishing, surfing, liveaboard) so each has somewhere real to
-- anchor a guest-comment thread (node_comments, see 20261108000100) — a
-- new 'package-category' group, parallel to 'activity-category'. Unlike
-- the activity-category / fishing-technique nodes, these are deliberately
-- NOT tagged with node_categories: a package's real category membership
-- is already computed in application code at render time
-- (filterPackageViews() against PackageView.categories), so the page
-- itself hands HubPageExtras the exact real, already-filtered package ids
-- for its gallery — tagging these nodes would just be a second,
-- redundant source of truth that could drift from the real one.

alter table categories drop constraint categories_category_group_check;
alter table categories add constraint categories_category_group_check
  check (category_group in (
    'accommodation-type', 'activity-type', 'amenity',
    'traveler-type', 'package-style', 'duration-band', 'inclusion', 'theme',
    'article-category', 'transfer-category', 'activity-category', 'package-category'
  ));

insert into nodes (id, node_type, slug, title, status, published_at) values ('c7a2f1d4-2e5b-4c3a-9f8e-1a2b3c4d5e01', 'category', 'luxury-packages', 'Luxury Packages', 'published', now()) on conflict (node_type, slug) do nothing;
insert into categories (id, category_group, path) select id, 'package-category', 'luxury'::ltree from nodes where node_type = 'category' and slug = 'luxury-packages' on conflict (id) do nothing;

insert into nodes (id, node_type, slug, title, status, published_at) values ('c7a2f1d4-2e5b-4c3a-9f8e-1a2b3c4d5e02', 'category', 'family-packages', 'Family Packages', 'published', now()) on conflict (node_type, slug) do nothing;
insert into categories (id, category_group, path) select id, 'package-category', 'family'::ltree from nodes where node_type = 'category' and slug = 'family-packages' on conflict (id) do nothing;

insert into nodes (id, node_type, slug, title, status, published_at) values ('c7a2f1d4-2e5b-4c3a-9f8e-1a2b3c4d5e03', 'category', 'adults-only-packages', 'Adults-Only Packages', 'published', now()) on conflict (node_type, slug) do nothing;
insert into categories (id, category_group, path) select id, 'package-category', 'adults_only'::ltree from nodes where node_type = 'category' and slug = 'adults-only-packages' on conflict (id) do nothing;

insert into nodes (id, node_type, slug, title, status, published_at) values ('c7a2f1d4-2e5b-4c3a-9f8e-1a2b3c4d5e04', 'category', 'long-stay-packages', 'Long-Stay Packages', 'published', now()) on conflict (node_type, slug) do nothing;
insert into categories (id, category_group, path) select id, 'package-category', 'long_stay'::ltree from nodes where node_type = 'category' and slug = 'long-stay-packages' on conflict (id) do nothing;

insert into nodes (id, node_type, slug, title, status, published_at) values ('c7a2f1d4-2e5b-4c3a-9f8e-1a2b3c4d5e05', 'category', 'budget-packages', 'Budget Packages', 'published', now()) on conflict (node_type, slug) do nothing;
insert into categories (id, category_group, path) select id, 'package-category', 'budget'::ltree from nodes where node_type = 'category' and slug = 'budget-packages' on conflict (id) do nothing;

insert into nodes (id, node_type, slug, title, status, published_at) values ('c7a2f1d4-2e5b-4c3a-9f8e-1a2b3c4d5e06', 'category', 'honeymoon-packages', 'Honeymoon Packages', 'published', now()) on conflict (node_type, slug) do nothing;
insert into categories (id, category_group, path) select id, 'package-category', 'honeymoon'::ltree from nodes where node_type = 'category' and slug = 'honeymoon-packages' on conflict (id) do nothing;

insert into nodes (id, node_type, slug, title, status, published_at) values ('c7a2f1d4-2e5b-4c3a-9f8e-1a2b3c4d5e07', 'category', 'solo-packages', 'Solo Travel Packages', 'published', now()) on conflict (node_type, slug) do nothing;
insert into categories (id, category_group, path) select id, 'package-category', 'solo'::ltree from nodes where node_type = 'category' and slug = 'solo-packages' on conflict (id) do nothing;

insert into nodes (id, node_type, slug, title, status, published_at) values ('c7a2f1d4-2e5b-4c3a-9f8e-1a2b3c4d5e08', 'category', 'diving-packages', 'Diving Packages', 'published', now()) on conflict (node_type, slug) do nothing;
insert into categories (id, category_group, path) select id, 'package-category', 'diving'::ltree from nodes where node_type = 'category' and slug = 'diving-packages' on conflict (id) do nothing;

insert into nodes (id, node_type, slug, title, status, published_at) values ('c7a2f1d4-2e5b-4c3a-9f8e-1a2b3c4d5e09', 'category', 'fishing-packages', 'Fishing Packages', 'published', now()) on conflict (node_type, slug) do nothing;
insert into categories (id, category_group, path) select id, 'package-category', 'fishing'::ltree from nodes where node_type = 'category' and slug = 'fishing-packages' on conflict (id) do nothing;

insert into nodes (id, node_type, slug, title, status, published_at) values ('c7a2f1d4-2e5b-4c3a-9f8e-1a2b3c4d5e10', 'category', 'surfing-packages', 'Surfing Packages', 'published', now()) on conflict (node_type, slug) do nothing;
insert into categories (id, category_group, path) select id, 'package-category', 'surfing'::ltree from nodes where node_type = 'category' and slug = 'surfing-packages' on conflict (id) do nothing;

insert into nodes (id, node_type, slug, title, status, published_at) values ('c7a2f1d4-2e5b-4c3a-9f8e-1a2b3c4d5e11', 'category', 'liveaboard-packages', 'Liveaboard Packages', 'published', now()) on conflict (node_type, slug) do nothing;
insert into categories (id, category_group, path) select id, 'package-category', 'liveaboard'::ltree from nodes where node_type = 'category' and slug = 'liveaboard-packages' on conflict (id) do nothing;
