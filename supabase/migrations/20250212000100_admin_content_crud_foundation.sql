-- Admin Dashboard content CRUD foundation.
--
-- 1. Staff write access to the `media` Storage bucket. Only a public-read
--    policy existed (20250110000100) -- every upload to date went through
--    scripts/upload-legacy-media.mjs using the service-role key, never
--    application code. The new admin media manager writes via the normal
--    RLS-respecting client (matching every other admin write in this
--    project -- see node-actions.ts's own header comment on this rule),
--    so it needs its own is_staff()-gated policy rather than reaching for
--    a service-role client here.
create policy media_bucket_staff_write
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media' and is_staff());

create policy media_bucket_staff_update
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media' and is_staff())
  with check (bucket_id = 'media' and is_staff());

create policy media_bucket_staff_delete
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media' and is_staff());

-- 2. Idempotency tracking for the new booking-confirmed customer email.
--    `booking_notifications.notification_type = 'customer_confirmation'`
--    already exists but is used only for the inquiry-received email sent
--    at booking-creation time (src/lib/bookings/notifications.ts) -- a
--    genuinely different email fired later, on admin status change, needs
--    its own idempotency marker so re-saving the same 'confirmed' status
--    (e.g. only changing internal notes) never re-sends it.
alter table bookings add column confirmation_email_sent_at timestamptz;
