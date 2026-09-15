-- Run this once in Supabase's SQL Editor to back the Admin dashboard:
-- Client Announcements CRUD, chatbot unanswered-question notifications,
-- and a real FAQ knowledge-base editor.
--
-- Client Announcements accepts EITHER a pasted link (already hosted
-- elsewhere, no size limit) OR a direct file upload into the
-- "announcement-media" Storage bucket (subject to that bucket's size
-- limit) — part 4 below is what makes the upload path work. If you
-- haven't created that bucket yet: Storage tab -> New Bucket -> name it
-- exactly "announcement-media" -> toggle "Public bucket" on, THEN run
-- part 4.

-- =========================================================
-- 1. Announcements table — deliberately minimal: pick a type (which
--    doubles as the title), a date, a description, and up to one each of
--    image/video/file. No manual ordering, no draft/archive state —
--    posting it puts it straight on the site, and removing it in Admin
--    deletes it for good. Newest first is handled by created_at alone.
-- =========================================================
create table if not exists announcements (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('news', 'update', 'image', 'video', 'success-story')),
  title text not null,
  date date not null default current_date,
  description text not null default '',
  image_url text,
  video_url text,
  file_url text,
  created_at timestamptz not null default now()
);

alter table announcements enable row level security;

drop policy if exists "Announcements are publicly readable" on announcements;
create policy "Announcements are publicly readable"
  on announcements for select
  to anon, authenticated
  using (true);

drop policy if exists "Signed-in staff can add announcements" on announcements;
create policy "Signed-in staff can add announcements"
  on announcements for insert
  to authenticated
  with check (true);

drop policy if exists "Signed-in staff can delete announcements" on announcements;
create policy "Signed-in staff can delete announcements"
  on announcements for delete
  to authenticated
  using (true);

-- No update policy — posts aren't edited in this design, only posted or
-- removed. Drop the one an earlier version of this script created.
drop policy if exists "Signed-in staff can edit announcements" on announcements;

-- =========================================================
-- 1b. Migration for an announcements table built by an earlier version
--     of this script (the flexible content-block model with
--     featured/sort_order/published/content) — reshapes it into the
--     fixed-field model above. Safe to run even on a brand-new table
--     (every step here is a no-op then).
-- =========================================================
alter table announcements
  add column if not exists description text not null default '',
  add column if not exists image_url text,
  add column if not exists video_url text,
  add column if not exists file_url text;

-- Best-effort carry-over from the old content-block array into the new
-- fixed fields, before dropping it. Wrapped in a DO block with dynamic
-- SQL: on a brand-new table (created fresh by part 1 above, which never
-- had a `content` column at all) a plain UPDATE referencing it would fail
-- to even parse, since Postgres validates column references at parse
-- time regardless of the WHERE guard — building the query as a string
-- and only executing it once the column is confirmed to exist sidesteps
-- that.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_name = 'announcements' and column_name = 'content'
  ) then
    execute $sql$
      update announcements
      set
        description = coalesce((
          select block ->> 'value' from jsonb_array_elements(content) block
          where block ->> 'type' = 'text' limit 1
        ), ''),
        image_url = (
          select block ->> 'value' from jsonb_array_elements(content) block
          where block ->> 'type' = 'image' limit 1
        ),
        video_url = (
          select block ->> 'value' from jsonb_array_elements(content) block
          where block ->> 'type' = 'video' limit 1
        ),
        file_url = (
          select block ->> 'value' from jsonb_array_elements(content) block
          where block ->> 'type' = 'file' limit 1
        )
      where description = ''
    $sql$;
  end if;
end $$;

-- Old "custom" titled posts don't fit the fixed set of types below —
-- fold them into "update" rather than let them violate the new check
-- constraint.
update announcements set type = 'update' where type not in ('news', 'update', 'image', 'video', 'success-story');

alter table announcements drop constraint if exists announcements_type_check;
alter table announcements add constraint announcements_type_check
  check (type in ('news', 'update', 'image', 'video', 'success-story'));

alter table announcements
  drop column if exists content,
  drop column if exists sort_order,
  drop column if exists published,
  drop column if exists featured,
  drop column if exists updated_at;

-- =========================================================
-- 2. Let signed-in staff see and manage the chatbot's "couldn't answer
--    this" log. It was previously insert-only (the chatbot could log a
--    question, but nothing, not even Admin, could read it back).
-- =========================================================
alter table chatbot_unanswered_questions
  add column if not exists resolved boolean not null default false;

drop policy if exists "Signed-in staff can view unanswered questions" on chatbot_unanswered_questions;
create policy "Signed-in staff can view unanswered questions"
  on chatbot_unanswered_questions for select
  to authenticated
  using (true);

drop policy if exists "Signed-in staff can update unanswered questions" on chatbot_unanswered_questions;
create policy "Signed-in staff can update unanswered questions"
  on chatbot_unanswered_questions for update
  to authenticated
  using (true)
  with check (true);

-- The chatbot widget itself (talking to /api/chatbot with the project's
-- publishable key — sb_publishable_..., no visitor ever logs in) needs to
-- attach a name/email to a question it just logged for itself, once
-- someone optionally leaves contact details after a gap answer.
--
-- First attempt at this scoped the policy "to anon" — that silently never
-- matched: this project uses Supabase's newer sb_publishable_/sb_secret_
-- key format rather than the old JWT anon/service_role keys, and a
-- request authenticated with the publishable key doesn't reliably land on
-- the literal Postgres "anon" role that a "to anon" policy checks for.
-- With no policy applying, the UPDATE just matched zero rows every time —
-- no error, "ok: true" every time, nothing ever actually saved. Proven
-- live: the original INSERT policy below has never had a role
-- restriction (applies to everyone), and inserts always worked; the two
-- UPDATE policies that DID say "to anon"/"to authenticated" both failed
-- for this route. Dropping the role restriction here, matching the
-- insert policy's own working style, is the fix.
drop policy if exists "Public can add contact details to a question they just logged" on chatbot_unanswered_questions;
create policy "Public can add contact details to a question they just logged"
  on chatbot_unanswered_questions for update
  using (true)
  with check (true);

drop policy if exists "Signed-in staff can delete unanswered questions" on chatbot_unanswered_questions;
create policy "Signed-in staff can delete unanswered questions"
  on chatbot_unanswered_questions for delete
  to authenticated
  using (true);

-- =========================================================
-- 3. Let signed-in staff manage the FAQ knowledge base directly (it was
--    previously read-only — every wording fix needed a manual SQL
--    Editor UPDATE). This is what the Admin > Chatbot > Knowledge Base
--    editor uses.
-- =========================================================
drop policy if exists "Signed-in staff can add FAQ entries" on faq_entries;
create policy "Signed-in staff can add FAQ entries"
  on faq_entries for insert
  to authenticated
  with check (true);

drop policy if exists "Signed-in staff can edit FAQ entries" on faq_entries;
create policy "Signed-in staff can edit FAQ entries"
  on faq_entries for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Signed-in staff can delete FAQ entries" on faq_entries;
create policy "Signed-in staff can delete FAQ entries"
  on faq_entries for delete
  to authenticated
  using (true);

-- =========================================================
-- 4. Storage policies for the "announcement-media" bucket — needed for
--    the direct file-upload path in Admin > Client Announcements.
--    Skip this part if the bucket doesn't exist yet in your project;
--    create it first (see the note at the top of this file), then run
--    just this part on its own.
-- =========================================================
drop policy if exists "Announcement media is publicly readable" on storage.objects;
create policy "Announcement media is publicly readable"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'announcement-media');

drop policy if exists "Signed-in staff can upload announcement media" on storage.objects;
create policy "Signed-in staff can upload announcement media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'announcement-media');

drop policy if exists "Signed-in staff can delete announcement media" on storage.objects;
create policy "Signed-in staff can delete announcement media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'announcement-media');

-- =========================================================
-- 5. Chatbot decision trees — the finite logistics pipelines (Quotation,
--    Booking, Customs Clearance, Vendor/Agent Onboarding, Warehousing &
--    Distribution, Sourcing & Procurement) modelled as a tree instead of
--    flat FAQ rows: a root node (no parent) holds the short overview
--    answer, and any number of child nodes hold the "next question"
--    branches, each of which can branch further. Admin's new Process
--    Trees editor manages this; /api/chatbot reads it to drive the
--    guided conversation. `on delete cascade` means removing a node in
--    Admin also removes everything under it, no separate cleanup step.
-- =========================================================
create table if not exists chatbot_nodes (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references chatbot_nodes(id) on delete cascade,
  label text not null,
  -- Only meaningful on a root node (parent_id is null) — the phrases that
  -- route an incoming top-level question into this tree.
  trigger_keywords text[] not null default '{}',
  answer text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists chatbot_nodes_parent_idx on chatbot_nodes (parent_id);

alter table chatbot_nodes enable row level security;

drop policy if exists "Chatbot nodes are publicly readable" on chatbot_nodes;
create policy "Chatbot nodes are publicly readable"
  on chatbot_nodes for select
  to anon, authenticated
  using (true);

drop policy if exists "Signed-in staff can add chatbot nodes" on chatbot_nodes;
create policy "Signed-in staff can add chatbot nodes"
  on chatbot_nodes for insert
  to authenticated
  with check (true);

drop policy if exists "Signed-in staff can edit chatbot nodes" on chatbot_nodes;
create policy "Signed-in staff can edit chatbot nodes"
  on chatbot_nodes for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Signed-in staff can delete chatbot nodes" on chatbot_nodes;
create policy "Signed-in staff can delete chatbot nodes"
  on chatbot_nodes for delete
  to authenticated
  using (true);

-- =========================================================
-- 6. faq_entries.category was originally locked to 6 fixed values
--    ('booking-quotes', 'tracking', 'documentation-customs', 'services',
--    'company-info', 'vendor-onboarding') with NOT NULL. But both the
--    Knowledge Base editor and the "teach the bot" Answer form in Admin
--    let staff type ANY category freely, and leave it blank — that's
--    literally what those forms tell the admin they can do ("Category
--    (optional)"). Left as-is, almost every save from Admin would fail:
--    a blank category violates NOT NULL, and anything other than one of
--    the 6 exact slugs violates the CHECK. Relaxing this to a free-form,
--    optional label matches what the UI already promises and needs no
--    code change — category is purely informational (a badge in the
--    admin list), never read by the matching logic in match.ts/route.ts.
-- =========================================================
alter table faq_entries alter column category drop not null;
alter table faq_entries drop constraint if exists faq_entries_category_check;
