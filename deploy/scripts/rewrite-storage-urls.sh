#!/usr/bin/env bash
# Some older records store the full Supabase cloud address of an image
# (https://<ref>.supabase.co/storage/v1/...). After the move those must point
# to the self-hosted address instead. Run as the mtg user AFTER
# migrate-database.sh:
#
#   OLD_URL='https://<ref>.supabase.co' bash deploy/scripts/rewrite-storage-urls.sh          # report only
#   OLD_URL='https://<ref>.supabase.co' bash deploy/scripts/rewrite-storage-urls.sh --apply  # change them
#
# The new address is NEXT_PUBLIC_SUPABASE_URL from deploy/.env. Checks every
# text, varchar and jsonb column in the public schema. --apply runs in one
# transaction.
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
APPLY=0; [ "${1:-}" = "--apply" ] && APPLY=1
[ -n "${OLD_URL:-}" ] || { echo "Set OLD_URL, e.g. https://abcdefghijklmnopqrst.supabase.co" >&2; exit 1; }
NEW_URL=$(grep -E '^NEXT_PUBLIC_SUPABASE_URL=' "$REPO_DIR/deploy/.env" | cut -d= -f2- | tr -d "\"'")
DB_URL=$(grep -E '^DATABASE_URL=' "$REPO_DIR/deploy/.env" | cut -d= -f2- | tr -d "\"'")
OLD_URL=${OLD_URL%/}; NEW_URL=${NEW_URL%/}
[ -n "$NEW_URL" ] && [ -n "$DB_URL" ] || { echo "NEXT_PUBLIC_SUPABASE_URL and DATABASE_URL must be set in deploy/.env" >&2; exit 1; }
echo "Replacing  $OLD_URL  ->  $NEW_URL   (mode: $([ $APPLY = 1 ] && echo APPLY || echo report only))"

psql "$DB_URL" -v ON_ERROR_STOP=1 -v old="$OLD_URL" -v new="$NEW_URL" -v apply="$APPLY" <<'SQL'
begin;
create temp table url_hits (tbl text, col text, n bigint) on commit drop;
select set_config('mtg.old', :'old', true), set_config('mtg.new', :'new', true), set_config('mtg.apply', :'apply', true);
do $$
declare
  r record; n bigint;
  old_url text := current_setting('mtg.old');
  new_url text := current_setting('mtg.new');
  do_apply boolean := current_setting('mtg.apply') = '1';
begin
  for r in
    select c.table_name, c.column_name, c.data_type
    from information_schema.columns c
    join information_schema.tables t on t.table_schema = c.table_schema and t.table_name = c.table_name
    where c.table_schema = 'public' and t.table_type = 'BASE TABLE'
      and c.data_type in ('text', 'character varying', 'jsonb')
  loop
    if r.data_type = 'jsonb' then
      execute format('select count(*) from public.%I where %I::text like %L', r.table_name, r.column_name, '%' || old_url || '%') into n;
      if n > 0 and do_apply then
        execute format('update public.%I set %I = replace(%I::text, %L, %L)::jsonb where %I::text like %L',
          r.table_name, r.column_name, r.column_name, old_url, new_url, r.column_name, '%' || old_url || '%');
      end if;
    else
      execute format('select count(*) from public.%I where %I like %L', r.table_name, r.column_name, '%' || old_url || '%') into n;
      if n > 0 and do_apply then
        execute format('update public.%I set %I = replace(%I, %L, %L) where %I like %L',
          r.table_name, r.column_name, r.column_name, old_url, new_url, r.column_name, '%' || old_url || '%');
      end if;
    end if;
    if n > 0 then insert into url_hits values (r.table_name, r.column_name, n); end if;
  end loop;
end $$;
\echo
\echo Rows containing the old address:
select tbl as "table", col as "column", n as rows from url_hits order by n desc;
commit;
SQL
[ "$APPLY" = 1 ] && echo "Done — addresses updated." || echo "Report only. Re-run with --apply to change them."
