-- ============================================================
--  Joy Cleaning LLC — Supabase Setup
--  Run this entire file in: Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Create the leads table
create table if not exists leads (
  id           uuid        default gen_random_uuid() primary key,
  name         text        not null,
  phone        text        not null,
  email        text,
  address      text,
  service_type text        not null,
  frequency    text,
  bedrooms     text,
  bathrooms    text,
  notes        text,
  status       text        default 'new',
  created_at   timestamptz default now()
);

-- 2. Enable Row Level Security
--    This ensures the anon key can WRITE but never READ leads from the browser.
alter table leads enable row level security;

-- 3. Allow the anonymous role to INSERT (submit the form)
create policy "Allow anon inserts"
  on leads
  for insert
  to anon
  with check (true);

-- 4. Block all SELECT from the browser (leads are only readable via service role / dashboard)
--    No SELECT policy = no reads. This is intentional.

-- ──────────────────────────────────────────────
--  Optional: view leads sorted by newest first
--  Run this query anytime in the SQL editor:
--
--    select * from leads order by created_at desc;
--
-- ──────────────────────────────────────────────
