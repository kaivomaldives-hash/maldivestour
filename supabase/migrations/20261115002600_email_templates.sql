-- Editable wording for customer and account emails (/admin/email-templates).
-- One row per email the site owner has saved; an email with no row uses
-- its built-in default (src/lib/email-templates/definitions.ts). Read by
-- server code with the service-role client only, so no public policy.

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
