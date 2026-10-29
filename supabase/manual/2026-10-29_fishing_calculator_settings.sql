-- Run in the Supabase SQL editor: creates the fishing calculator settings table
-- (same as supabase/migrations/20261115002000_fishing_calculator_settings.sql).
begin;
-- Fishing package calculator settings (/maldives/fishing/calculator/ and
-- the embed on the /maldives/fishing/ hub), edited at
-- /admin/fishing-calculator.
--
-- One row (id = 1) holding the whole calculator config as JSON: markup,
-- package lengths and long-stay savings, atolls (transfer + room rates),
-- fishing packages (rate per boat per day, optional published per-person
-- tables) and the fleet. The shape is validated in application code
-- (parseFishingCalculatorConfig in src/lib/fishing/package-calculator-
-- rates.ts) on every save and every read. Until the first admin save
-- there is no row and the site uses the built-in defaults.

create table if not exists fishing_calculator_settings (
  id          smallint primary key default 1 check (id = 1),
  config      jsonb not null,
  updated_at  timestamptz not null default now()
);

drop trigger if exists fishing_calculator_settings_set_updated_at on fishing_calculator_settings;
create trigger fishing_calculator_settings_set_updated_at
  before update on fishing_calculator_settings
  for each row execute function set_updated_at();

alter table fishing_calculator_settings enable row level security;

-- Public read: these are the prices the public calculator shows, the same
-- trust level as holiday_pricing_config_public_read.
drop policy if exists fishing_calculator_settings_public_read on fishing_calculator_settings;
create policy fishing_calculator_settings_public_read on fishing_calculator_settings
  for select using (true);
drop policy if exists fishing_calculator_settings_staff_all on fishing_calculator_settings;
create policy fishing_calculator_settings_staff_all on fishing_calculator_settings
  for all using (is_staff()) with check (is_staff());
commit;

notify pgrst, 'reload schema';
