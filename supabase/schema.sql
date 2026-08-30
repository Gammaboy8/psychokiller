-- ============================================================
-- PSYCHOKILLER — Supabase schema
-- Run this in Supabase Dashboard > SQL Editor (one shot).
-- Safe to re-run: uses IF NOT EXISTS / CREATE OR REPLACE.
-- ============================================================

-- Extensions ------------------------------------------------
create extension if not exists "pgcrypto";

-- ============================================================
-- 1. ADMINS  (allowlist of user ids permitted to write)
-- ============================================================
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email   text,
  created_at timestamptz not null default now()
);

-- Helper: is the current auth user an admin?
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins a where a.user_id = auth.uid()
  );
$$;

-- ============================================================
-- 2. ACCOUNTS  (listings)
-- ============================================================
create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  account_id       text unique not null,           -- e.g. pk-001
  title            text not null,
  slug             text unique not null,            -- SEO url slug
  price            numeric(12,2) not null default 0,
  currency         text not null default 'USD',
  status           text not null default 'available'
                     check (status in ('available','reserved','sold')),
  published        boolean not null default false,
  featured         boolean not null default false,
  tags             text[] not null default '{}',

  -- stats
  level            int,
  xp               bigint,
  stardust         bigint,
  pokemon_storage  int,
  item_storage     int,
  shiny_count      int not null default 0,
  shundo_count     int not null default 0,
  hundo_count      int not null default 0,
  legendary_count  int not null default 0,
  mythical_count   int not null default 0,

  -- special info (free text)
  rare_pokemon      text,
  rare_backgrounds  text,
  rare_costumes     text,
  special_features  text,
  account_age       text,

  description      text,

  -- marketplace links
  playerauctions_url     text,
  eldorado_url           text,
  g2g_url                text,
  epicnpc_url            text,
  other_marketplace_url  text,

  views      bigint not null default 0,
  last_viewed_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_accounts_status    on public.accounts(status);
create index if not exists idx_accounts_published on public.accounts(published);
create index if not exists idx_accounts_featured  on public.accounts(featured);
create index if not exists idx_accounts_created    on public.accounts(created_at desc);
create index if not exists idx_accounts_price      on public.accounts(price);
create index if not exists idx_accounts_shiny      on public.accounts(shiny_count desc);
create index if not exists idx_accounts_tags       on public.accounts using gin(tags);

-- keep updated_at fresh
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_accounts_touch on public.accounts;
create trigger trg_accounts_touch
  before update on public.accounts
  for each row execute function public.touch_updated_at();

-- ============================================================
-- 3. ACCOUNT IMAGES
-- ============================================================
create table if not exists public.account_images (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete cascade,
  storage_path text not null,
  public_url   text not null,
  sort_order   int not null default 0,
  is_primary   boolean not null default false,
  created_at   timestamptz not null default now()
);

create index if not exists idx_images_account on public.account_images(account_id, sort_order);

-- ============================================================
-- 4. REVIEWS / VOUCHES
-- ============================================================
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  platform     text,
  rating       int check (rating between 1 and 5),
  body         text not null,
  order_ref    text,
  screenshot_url text,
  published    boolean not null default false,
  review_date  date not null default current_date,
  created_at   timestamptz not null default now()
);

create index if not exists idx_reviews_published on public.reviews(published, review_date desc);

-- ============================================================
-- 5. VIEW COUNTER (atomic, callable by anon)
-- ============================================================
create or replace function public.increment_view(p_slug text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.accounts
     set views = views + 1,
         last_viewed_at = now()
   where slug = p_slug and published = true;
$$;

-- ============================================================
-- 6. ROW LEVEL SECURITY
-- ============================================================
alter table public.accounts       enable row level security;
alter table public.account_images enable row level security;
alter table public.reviews        enable row level security;
alter table public.admins         enable row level security;

-- ---- ACCOUNTS ----
drop policy if exists accounts_public_read on public.accounts;
create policy accounts_public_read on public.accounts
  for select using (published = true);

drop policy if exists accounts_admin_read on public.accounts;
create policy accounts_admin_read on public.accounts
  for select using (public.is_admin());

drop policy if exists accounts_admin_write on public.accounts;
create policy accounts_admin_write on public.accounts
  for all using (public.is_admin()) with check (public.is_admin());

-- ---- ACCOUNT IMAGES ----
drop policy if exists images_public_read on public.account_images;
create policy images_public_read on public.account_images
  for select using (
    exists (select 1 from public.accounts a
            where a.id = account_images.account_id and a.published = true)
  );

drop policy if exists images_admin_read on public.account_images;
create policy images_admin_read on public.account_images
  for select using (public.is_admin());

drop policy if exists images_admin_write on public.account_images;
create policy images_admin_write on public.account_images
  for all using (public.is_admin()) with check (public.is_admin());

-- ---- REVIEWS ----
drop policy if exists reviews_public_read on public.reviews;
create policy reviews_public_read on public.reviews
  for select using (published = true);

drop policy if exists reviews_admin_read on public.reviews;
create policy reviews_admin_read on public.reviews
  for select using (public.is_admin());

drop policy if exists reviews_admin_write on public.reviews;
create policy reviews_admin_write on public.reviews
  for all using (public.is_admin()) with check (public.is_admin());

-- ---- ADMINS (each user may read their own admin row) ----
drop policy if exists admins_self_read on public.admins;
create policy admins_self_read on public.admins
  for select using (auth.uid() = user_id);

-- ============================================================
-- 7. STORAGE BUCKET + POLICIES
--    Bucket: listing-images (public read)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('listing-images', 'listing-images', true)
on conflict (id) do nothing;

drop policy if exists "listing images public read" on storage.objects;
create policy "listing images public read" on storage.objects
  for select using (bucket_id = 'listing-images');

drop policy if exists "listing images admin write" on storage.objects;
create policy "listing images admin write" on storage.objects
  for insert with check (bucket_id = 'listing-images' and public.is_admin());

drop policy if exists "listing images admin update" on storage.objects;
create policy "listing images admin update" on storage.objects
  for update using (bucket_id = 'listing-images' and public.is_admin());

drop policy if exists "listing images admin delete" on storage.objects;
create policy "listing images admin delete" on storage.objects
  for delete using (bucket_id = 'listing-images' and public.is_admin());

-- ============================================================
-- DONE.  Next: add yourself as admin (see README step 6):
--   insert into public.admins (user_id, email)
--   select id, email from auth.users where email = 'you@example.com';
-- ============================================================
