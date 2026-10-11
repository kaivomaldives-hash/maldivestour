-- Same gate column/pattern as bookings.confirmation_email_sent_at
-- (supabase/migrations/20250212000100_admin_content_crud_foundation.sql)
-- — lets updateHolidayRequestStatus() send the customer confirmation
-- email exactly once on the transition into 'confirmed', never re-sent
-- on a later unrelated save.
alter table holiday_quote_requests add column confirmation_email_sent_at timestamptz;
