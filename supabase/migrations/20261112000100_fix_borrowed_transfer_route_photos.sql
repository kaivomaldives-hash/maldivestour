-- Undoes src/lib/admin/transfer-media-bulk-actions.ts's
-- bulkApplyRouteMediaToRoutesWithoutImages(): a sandbox-era stopgap that
-- copied one route's photo (same storage_path) onto every OTHER transfer
-- route that had zero images, giving each a fresh media_assets row titled
-- for ITS OWN destination. The intent was a generic-looking placeholder;
-- in practice it meant e.g. a JW Marriott photo showing up captioned
-- "Club Med Kani Island Resort" on Club Med Kani's own route card —
-- reported by the site owner as "images not working", which is really a
-- wrong-resort-photo problem, not a broken file.
--
-- For every storage_path attached to more than one transfer_route node,
-- this keeps only the OLDEST media_assets row (the real original upload
-- that bulkApply was copying FROM) and removes the borrowed copies on
-- every other route. Those routes go back to showing no image — an
-- honest gap — rather than a mislabeled photo of a different resort.
-- Nothing in Storage is touched: the original file (and its one
-- surviving media_assets row) is untouched; only the duplicate rows this
-- tool created are removed.

create temporary table _route_photo_copies_to_remove as
with transfer_route_media as (
  select nm.node_id, nm.media_id, ma.storage_path, ma.created_at
  from node_media nm
  join nodes n on n.id = nm.node_id and n.node_type = 'transfer_route'
  join media_assets ma on ma.id = nm.media_id
  where ma.storage_path is not null
),
dupe_paths as (
  select storage_path
  from transfer_route_media
  group by storage_path
  having count(distinct node_id) > 1
),
keep as (
  select distinct on (storage_path) media_id
  from transfer_route_media
  order by storage_path, created_at asc
)
select trm.node_id, trm.media_id
from transfer_route_media trm
join dupe_paths dp on dp.storage_path = trm.storage_path
where trm.media_id not in (select media_id from keep);

delete from node_media nm
using _route_photo_copies_to_remove r
where nm.node_id = r.node_id and nm.media_id = r.media_id;

-- Safe even though these media_assets rows are now only ever referenced
-- by this one bulk-apply tool: each row this deletes was created solely
-- as a copy for a single target route (never shared via node_media with
-- anything else), so no other node is left pointing at a since-deleted
-- media_assets row.
delete from media_assets ma
where ma.id in (select media_id from _route_photo_copies_to_remove)
  and not exists (select 1 from node_media nm where nm.media_id = ma.id);

drop table _route_photo_copies_to_remove;
