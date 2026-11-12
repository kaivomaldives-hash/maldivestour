-- Run in the Supabase SQL editor (safe to re-run).
-- = supabase/migrations/20261115002600_email_templates.sql
begin;

create table if not exists email_templates (
  key         text primary key,
  subject     text not null,
  body        text not null,
  updated_at  timestamptz not null default now()
);

drop trigger if exists email_templates_set_updated_at on email_templates;
create trigger email_templates_set_updated_at
  before update on email_templates
  for each row execute function set_updated_at();

alter table email_templates enable row level security;

drop policy if exists email_templates_staff_all on email_templates;
create policy email_templates_staff_all on email_templates
  for all using (is_staff()) with check (is_staff());
commit;

notify pgrst, 'reload schema';
