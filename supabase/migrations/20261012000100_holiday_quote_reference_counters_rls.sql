-- holiday_quote_reference_counters (supabase/migrations/20261001007000_
-- holiday_builder_schema.sql) was created without ever having RLS
-- enabled -- the one genuine gap out of 47 tables (every other one
-- already gets `enable row level security` somewhere, just not always in
-- the same file it's created in; this one simply never got it at all).
-- Same "zero client-role policies, touched only internally by the
-- reference-generating trigger" shape as its sibling
-- booking_reference_counters (enabled in 20250101001400_rls_policies.sql)
-- -- not a public table, nothing reads or writes it directly via the API.
alter table holiday_quote_reference_counters enable row level security;
