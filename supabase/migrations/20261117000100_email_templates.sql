-- Editable email wording (Admin -> Email Templates). A row replaces the
-- built-in default in src/lib/email-templates/registry.ts for that key;
-- deleting the row goes back to the default. Emails are sent with the
-- service role, and the sign-up emails are read through the website
-- (src/app/api/auth-email-templates/[file]/route.ts), so only staff need
-- table access here.

create table if not exists public.email_templates (
  key text primary key check (key ~ '^[a-z0-9_]{1,60}$'),
  subject text check (subject is null or char_length(subject) <= 300),
  body text not null check (char_length(body) <= 20000),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

alter table public.email_templates enable row level security;

drop policy if exists email_templates_staff_select on public.email_templates;
create policy email_templates_staff_select on public.email_templates
  for select to authenticated using (is_staff());

drop policy if exists email_templates_staff_insert on public.email_templates;
create policy email_templates_staff_insert on public.email_templates
  for insert to authenticated with check (is_staff());

drop policy if exists email_templates_staff_update on public.email_templates;
create policy email_templates_staff_update on public.email_templates
  for update to authenticated using (is_staff()) with check (is_staff());

drop policy if exists email_templates_staff_delete on public.email_templates;
create policy email_templates_staff_delete on public.email_templates
  for delete to authenticated using (is_staff());
