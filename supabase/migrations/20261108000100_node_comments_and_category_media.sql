-- Generic guest-comment thread for any node, not just `locations` rows.
-- The new activity-category / fishing-technique / package-style landing
-- pages (snorkeling, big-game-fishing, luxury packages, etc.) are
-- themselves real `category`-type nodes (see 20261107000100 and the
-- fishing-technique content's own node, or the package-style category
-- nodes already seeded) but are never rows in `locations` — the existing
-- location_comments table hard-checks `exists (select 1 from locations
-- where id = p_location_id)`, so it can't be reused here. This is the
-- exact same shape (pending/published/rejected, guest_name/guest_email,
-- agreed_to_terms — matching the standing convention from
-- 20261015000100/20261016000100) just keyed to `nodes(id)` generically,
-- the same relationship `reviews.node_id` already has.

create table node_comments (
  id                uuid primary key default gen_random_uuid(),
  node_id           uuid not null references nodes(id) on delete cascade,
  user_id           uuid references auth.users(id),
  guest_name        text,
  guest_email       text,
  body              text not null,
  agreed_to_terms   boolean not null default false,
  status            text not null default 'pending' check (status in ('pending', 'published', 'rejected')),
  rejection_reason  text,
  reviewed_by       uuid references auth.users(id),
  reviewed_at       timestamptz,
  created_at        timestamptz not null default now(),
  check (user_id is not null or (guest_name is not null and guest_email is not null)),
  constraint node_comments_agreed_to_terms_check check (agreed_to_terms = true)
);
create index node_comments_node_idx on node_comments(node_id) where status = 'published';
create index node_comments_status_idx on node_comments(status);

alter table node_comments enable row level security;
create policy node_comments_public_read on node_comments for select using (status = 'published');
create policy node_comments_staff_read  on node_comments for select using (is_staff());
create policy node_comments_staff_all   on node_comments for all using (is_staff()) with check (is_staff());
-- No insert policy for anon/authenticated: submit_node_comment() below is
-- the only way a row is created (SECURITY DEFINER, bypasses RLS).

create or replace function submit_node_comment(
  p_node_id         uuid,
  p_body            text,
  p_guest_name      text,
  p_guest_email     text,
  p_agreed_to_terms boolean
) returns table (id uuid)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_id uuid;
  v_user_id uuid := auth.uid();
begin
  if not exists (select 1 from nodes where nodes.id = p_node_id) then
    raise exception 'node_id % does not reference an existing node', p_node_id;
  end if;
  if p_body is null or length(trim(p_body)) = 0 then
    raise exception 'a comment body is required';
  end if;
  if p_agreed_to_terms is not true then
    raise exception 'You must confirm you are responsible for this content before submitting.';
  end if;
  if v_user_id is null then
    if p_guest_name is null or length(trim(p_guest_name)) = 0 then
      raise exception 'guest_name is required';
    end if;
    if p_guest_email is null or p_guest_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
      raise exception 'a valid guest_email is required';
    end if;
  end if;

  -- Same inline-throttle shape as submit_location_comment(): at most 2
  -- submissions per email per rolling 24 hours, counting every status.
  if p_guest_email is not null and (
    select count(*) from node_comments
    where guest_email = p_guest_email and created_at > now() - interval '24 hours'
  ) >= 2 then
    raise exception 'You have reached the limit of 2 submissions per day for this email address. Please try again tomorrow.';
  end if;

  insert into node_comments (node_id, user_id, guest_name, guest_email, body, agreed_to_terms)
  values (
    p_node_id, v_user_id,
    case when v_user_id is null then trim(p_guest_name) end,
    case when v_user_id is null then trim(p_guest_email) end,
    trim(p_body),
    true
  )
  returning node_comments.id into v_id;

  return query select v_id;
end;
$$;

revoke all on function submit_node_comment(uuid, text, text, text, boolean) from public;
grant execute on function submit_node_comment(uuid, text, text, text, boolean) to anon, authenticated;
