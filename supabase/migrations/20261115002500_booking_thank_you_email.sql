-- Thank-you email sent when an admin marks a booking 'completed'
-- (sendBookingThankYouEmail in src/lib/bookings/notifications.ts): records
-- when it was sent, so it goes out once, and allows its own type in the
-- notification log.

alter table bookings add column if not exists thank_you_email_sent_at timestamptz;

alter table booking_notifications drop constraint if exists booking_notifications_notification_type_check;
alter table booking_notifications add constraint booking_notifications_notification_type_check
  check (notification_type in ('admin_alert', 'customer_confirmation', 'customer_thank_you'));
