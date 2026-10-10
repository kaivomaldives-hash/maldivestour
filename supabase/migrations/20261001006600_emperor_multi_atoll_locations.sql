-- Emperor's two charter products (private-full-day-fishing-charter,
-- private-half-day-fishing-charter) have always genuinely operated across
-- many atolls at the same rate (see src/components/fishing/
-- emperor-page.tsx's own copy and FAQ), but until now that was only ever
-- stated in prose — the activities themselves were tagged (node_locations)
-- to a single atoll (Gaafu Alifu, 'primary'). This tags the same 8 other
-- atolls already named on the Emperor page's "Where Can You Fish?" section
-- as 'secondary' locations, so: (1) the activity-location filtering that
-- already treats any node_locations row as a match (see
-- src/lib/activities/repository.ts's getNodeIdsAtLocations, which never
-- filters by relation) correctly surfaces Emperor's charters when browsing
-- fishing by any of these atolls, and (2) the activity/fishing pages can
-- render this as real tagged data instead of a hardcoded list.
--
-- Gaafu Alifu is already the 'primary' row from the original seed
-- (supabase/migrations/20250119000100_seed_mfh_fishing.sql) and is left
-- untouched here — only 'secondary' rows are added, for the 8 atolls that
-- don't already have a row for either charter.

insert into node_locations (node_id, location_id, relation)
select activity.id, atoll.id, 'secondary'
from nodes activity
cross join nodes atoll
where activity.slug in ('private-full-day-fishing-charter', 'private-half-day-fishing-charter')
  and activity.node_type = 'activity'
  and atoll.node_type = 'location'
  and atoll.slug in ('kaafu', 'alif-alif', 'alif-dhaalu', 'baa', 'vaavu', 'laamu', 'gaafu-dhaalu', 'seenu')
on conflict (node_id, location_id) do nothing;
