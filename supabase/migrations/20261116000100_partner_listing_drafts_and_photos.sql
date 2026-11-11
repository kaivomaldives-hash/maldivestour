-- Partner listings: drafts and photos.
--
-- Partners signed up but never listed anything; the form had to be filled
-- in one sitting, only after approval, and had no photos. This adds:
--
-- 1. 'draft' submissions. A partner can start (and autosave) listings as
--    soon as they have an account, approved or not. Only the move from
--    draft to 'pending' (sending it to the review queue) still needs an
--    approved partner. Drafts never show in the admin queue.
-- 2. Photo uploads. Partners upload straight into the public `media`
--    bucket, under opt/partner-uploads/<their user id>/ only; the paths go
--    in the submission payload ("photos"), and approval attaches them to
--    the listing.

alter table listing_submissions drop constraint if exists listing_submissions_status_check;
alter table listing_submissions
  add constraint listing_submissions_status_check check (status in ('draft', 'pending', 'approved', 'rejected'));

alter table listing_submissions add column if not exists updated_at timestamptz not null default now();

-- Insert: a draft from any partner; a submission for review only from an
-- approved partner. Updates only for listings the partner owns, as before.
drop policy if exists listing_submissions_self_insert on listing_submissions;
create policy listing_submissions_self_insert on listing_submissions for insert
  with check (
    partner_id = auth.uid()
    and (
      (status = 'draft' and is_partner())
      or (status = 'pending' and is_approved_partner())
    )
    and (node_id is null or exists (select 1 from nodes n where n.id = node_id and n.created_by = auth.uid()))
  );

-- Update: only the partner's own drafts, and only to keep it a draft or
-- send it for review (approved partners). Reviewed rows stay staff-owned,
-- so the review history is never overwritten.
create policy listing_submissions_self_update_draft on listing_submissions for update
  using (partner_id = auth.uid() and status = 'draft')
  with check (
    partner_id = auth.uid()
    and (status = 'draft' or (status = 'pending' and is_approved_partner()))
    and (node_id is null or exists (select 1 from nodes n where n.id = node_id and n.created_by = auth.uid()))
  );

create policy listing_submissions_self_delete_draft on listing_submissions for delete
  using (partner_id = auth.uid() and status = 'draft');

create index if not exists listing_submissions_partner_status_idx on listing_submissions(partner_id, status);

-- Photos: each partner may write and remove only inside their own folder
-- of the public media bucket (reads are already public).
create policy media_bucket_partner_insert
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'media'
    and is_partner()
    and (storage.foldername(name))[1] = 'opt'
    and (storage.foldername(name))[2] = 'partner-uploads'
    and (storage.foldername(name))[3] = auth.uid()::text
  );

create policy media_bucket_partner_delete
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'media'
    and is_partner()
    and (storage.foldername(name))[1] = 'opt'
    and (storage.foldername(name))[2] = 'partner-uploads'
    and (storage.foldername(name))[3] = auth.uid()::text
  );
