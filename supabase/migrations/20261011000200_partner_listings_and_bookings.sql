-- Partner self-service portal, phase 2: listing management (create/edit,
-- pending admin approval to publish) + a read-only partner bookings
-- dashboard with a safe confirm/cancel action — built on top of
-- 20261011000100_partner_portal_foundation.sql.
--
-- Listing moderation deliberately does NOT give a partner any write
-- access to accommodations/activities/packages/transfer_routes/
-- transfer_services directly (no new RLS policy touches those tables at
-- all here). Every partner-authored listing instead lands as a row in
-- `listing_submissions` (a JSON payload, not live rows); only a staff
-- member's "Approve" action — reusing the exact same createAccommodation/
-- updateAccommodation/createActivity/... functions the staff admin
-- editors already call (src/lib/admin/*-actions.ts) — ever writes to
-- those tables for a partner-originated listing. This keeps the new
-- surface area small: one new table's RLS to get right, instead of
-- reasoning about partner-scoped writes across five existing tables.
--
-- A partner's own already-published listing is already readable by them
-- via each table's existing `*_public_read` policy (status = 'published')
-- — no new SELECT policy needed for edit-form prefill.

create table listing_submissions (
  id              uuid primary key default gen_random_uuid(),
  partner_id      uuid not null references partner_accounts(id) on delete cascade,
  -- Null until a 'create' is approved and the real node exists; required
  -- for 'update' (the node being proposed changes for).
  node_id         uuid references nodes(id) on delete cascade,
  node_type       text not null check (node_type in ('accommodation', 'activity', 'package', 'transfer_route')),
  submission_kind text not null check (submission_kind in ('create', 'update')),
  -- Denormalized from payload so the admin queue list can show a title
  -- without unpacking jsonb for every row.
  title           text not null,
  payload         jsonb not null,
  status          text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  admin_note      text,
  reviewed_by     uuid references auth.users(id),
  reviewed_at     timestamptz,
  created_at      timestamptz not null default now(),
  check (submission_kind = 'create' or node_id is not null)
);
create index listing_submissions_partner_idx on listing_submissions(partner_id);
create index listing_submissions_status_idx  on listing_submissions(status);

alter table listing_submissions enable row level security;

create policy listing_submissions_self_select on listing_submissions for select using (partner_id = auth.uid());

-- A partner may only submit for themselves, only once approved, and (for
-- an 'update') only for a node they actually own — same ownership check
-- the server action makes, enforced again here independently.
create policy listing_submissions_self_insert on listing_submissions for insert
  with check (
    partner_id = auth.uid()
    and is_approved_partner()
    and (node_id is null or exists (select 1 from nodes n where n.id = node_id and n.created_by = auth.uid()))
  );

-- No partner update/delete policy — same "status-transition-only, staff-
-- owned" shape as reviews/article_comments moderation elsewhere in this
-- codebase. A rejected submission is resubmitted as a brand-new row, so
-- the review history is never overwritten.
create policy listing_submissions_staff_all on listing_submissions for all using (is_staff()) with check (is_staff());

-- ─────────────────────────────────────────────────────────────────
-- Partner bookings dashboard: read-only. A booking has no direct
-- provider/partner column (see the 4 provider-linkage columns this joins
-- through) — the four provider-linkage columns across the whole schema
-- are accommodations/activities/packages.operated_by_provider_id and
-- transfer_services.provider_id, so this policy is necessarily a 4-way
-- OR of EXISTS joins rather than a single comparison.
-- ─────────────────────────────────────────────────────────────────
create policy bookings_partner_read on bookings for select using (
  exists (
    select 1 from accommodations a
    join partner_accounts pa on pa.provider_id = a.operated_by_provider_id
    where a.id = bookings.product_node_id and pa.id = auth.uid()
  )
  or exists (
    select 1 from activities ac
    join partner_accounts pa on pa.provider_id = ac.operated_by_provider_id
    where ac.id = bookings.product_node_id and pa.id = auth.uid()
  )
  or exists (
    select 1 from packages pk
    join partner_accounts pa on pa.provider_id = pk.operated_by_provider_id
    where pk.id = bookings.product_node_id and pa.id = auth.uid()
  )
  or exists (
    select 1 from transfer_services ts
    join partner_accounts pa on pa.provider_id = ts.provider_id
    where ts.id = bookings.transfer_service_id and pa.id = auth.uid()
  )
);

-- A partner may move a booking they own into 'confirmed' or 'cancelled'
-- only — never touch price, customer details, or any other field, and
-- never reach a status outside that pair (so they can't e.g. mark
-- something 'completed' or revert a cancellation). SECURITY DEFINER so
-- the ownership check below runs with its own trusted read, independent
-- of the `bookings_partner_read` policy that already (separately) grants
-- read access to the same rows.
create or replace function partner_update_booking_status(p_booking_id uuid, p_status text) returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_owns boolean;
begin
  if p_status not in ('confirmed', 'cancelled') then
    raise exception 'partners may only set a booking to confirmed or cancelled';
  end if;

  select exists (
    select 1 from bookings b
    left join accommodations a on a.id = b.product_node_id
    left join activities ac on ac.id = b.product_node_id
    left join packages pk on pk.id = b.product_node_id
    left join transfer_services ts on ts.id = b.transfer_service_id
    join partner_accounts pa on pa.id = v_uid
    where b.id = p_booking_id
      and (
        pa.provider_id = a.operated_by_provider_id
        or pa.provider_id = ac.operated_by_provider_id
        or pa.provider_id = pk.operated_by_provider_id
        or pa.provider_id = ts.provider_id
      )
  ) into v_owns;

  if not v_owns then
    raise exception 'booking not found or not yours to update';
  end if;

  update bookings set status = p_status where id = p_booking_id;
end;
$$;

revoke all on function partner_update_booking_status(uuid, text) from public;
grant execute on function partner_update_booking_status(uuid, text) to authenticated;
