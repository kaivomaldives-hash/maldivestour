-- Run in the Supabase SQL editor (safe to re-run).
-- = supabase/migrations/20261115002500_booking_thank_you_email.sql
begin;

alter table bookings add column if not exists thank_you_email_sent_at timestamptz;

alter table booking_notifications drop constraint if exists booking_notifications_notification_type_check;
alter table booking_notifications add constraint booking_notifications_notification_type_check
  check (notification_type in ('admin_alert', 'customer_confirmation', 'customer_thank_you'));
commit;

notify pgrst, 'reload schema';
