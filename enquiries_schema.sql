-- =========================================================
-- Enquiries ("Get a Quote" form) — 2026-10-03, per Vignesh.
-- Run this ONCE in Supabase: Dashboard > SQL Editor > New query > paste > Run.
-- Safe to run again (it only creates what's missing).
-- =========================================================
create table if not exists enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  service text not null,
  name text not null,
  phone text not null,
  email text not null,
  company text,
  origin text,
  destination text,
  message text,
  handled boolean not null default false
);

alter table enquiries enable row level security;

-- The website's quote form (publishable key, no visitor logs in) can add
-- enquiries. No role restriction, matching the chatbot log's insert policy
-- that is known to work with this project's sb_publishable_ key.
drop policy if exists "Website can add enquiries" on enquiries;
create policy "Website can add enquiries"
  on enquiries for insert
  with check (true);

-- Only signed-in staff (the admin) can read, mark handled, or delete.
drop policy if exists "Signed-in staff can view enquiries" on enquiries;
create policy "Signed-in staff can view enquiries"
  on enquiries for select
  to authenticated
  using (true);

drop policy if exists "Signed-in staff can update enquiries" on enquiries;
create policy "Signed-in staff can update enquiries"
  on enquiries for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Signed-in staff can delete enquiries" on enquiries;
create policy "Signed-in staff can delete enquiries"
  on enquiries for delete
  to authenticated
  using (true);
