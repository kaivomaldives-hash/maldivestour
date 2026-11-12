-- Prints the SQL to re-create MTG's own additions to Supabase's managed
-- schemas, which database dumps leave out:
--   - row-level security policies in the storage schema (who may read,
--     upload and delete files in each bucket); without them signed-in users,
--     admins included, get "Object not found" on private files
--   - triggers on auth tables (on_auth_user_created creates the profile row
--     for every new signup)
-- migrate-database.sh and backup.sh save its output; the restores apply it.
select format('create policy %I on %I.%I as %s for %s to %s%s%s;',
  policyname, schemaname, tablename, permissive, cmd,
  (select string_agg(quote_ident(r), ', ') from unnest(roles) r),
  case when qual is not null then ' using (' || qual || ')' else '' end,
  case when with_check is not null then ' with check (' || with_check || ')' else '' end)
from pg_policies
where schemaname = 'storage'
union all
select pg_get_triggerdef(t.oid) || ';'
from pg_trigger t
join pg_class c on c.oid = t.tgrelid
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'auth' and not t.tgisinternal;
