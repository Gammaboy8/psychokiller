# PSYCHOKILLER — Pokémon GO Account Marketplace

A production-ready, dark/premium catalog & storefront for Pokémon GO accounts.
Public browsing + a private admin dashboard (add/edit/sell/feature listings,
upload images, manage reviews). Built on **Next.js 14 + TypeScript + Supabase**,
deployable free on **Cloudflare Pages**.

> This site is a **catalog/storefront**. It never stores account passwords,
> recovery codes, or 2FA secrets. Buyers are sent to authorized marketplaces
> (PlayerAuctions, Eldorado, G2G, EpicNPC) to complete the transaction.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS (dark, crimson accents) |
| Database | Supabase PostgreSQL (with Row Level Security) |
| Auth | Supabase Auth (email + password) |
| Storage | Supabase Storage (`listing-images` bucket) |
| Hosting | Cloudflare Pages (or Vercel) |
| Source control | GitHub |

All secrets live in environment variables. The browser only ever sees the
**anon** key; the service-role key is never used.

---

## 1. Run locally

```bash
npm install                 # install deps
cp .env.example .env.local  # then fill in your values
npm run dev                 # http://localhost:3000
```

Production build / preview:

```bash
npm run build
npm run start
```

> Note: if your shell has `NODE_ENV=production` set globally, install with
> `npm install --include=dev` so build tooling (Tailwind, TypeScript) is installed.

---

## 2. Create a Supabase project

1. Go to <https://supabase.com> → **New project** (free tier is fine).
2. Pick a name + strong DB password + region close to you.
3. Wait ~2 min for provisioning.

---

## 3. Create the database tables

1. In Supabase → **SQL Editor** → **New query**.
2. Paste the entire contents of [`supabase/schema.sql`](./supabase/schema.sql).
3. Click **Run**.

This creates: `accounts`, `account_images`, `reviews`, `admins`, the
`increment_view` function, all indexes, RLS policies, and the storage bucket.
Safe to re-run.

---

## 4. Storage bucket

The schema already creates a **public** bucket named `listing-images` with the
right policies (public read; admin-only write). No manual step needed. If you
ever recreate it manually: Storage → New bucket → name `listing-images` →
**Public** → then re-run the storage policy section of the schema.

---

## 5. Environment variables

Copy `.env.example` → `.env.local` (local) and set the same values in your host
(Cloudflare). Get the Supabase values from **Project Settings → API**.

| Variable | Where to find it | Required |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Settings → API → Project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Settings → API → `anon` `public` key | ✅ |
| `NEXT_PUBLIC_SITE_URL` | Your live URL, e.g. `https://psychokiller.pages.dev` | ✅ |
| `NEXT_PUBLIC_DISCORD_URL` | Your Discord invite | optional |
| `NEXT_PUBLIC_TELEGRAM_URL` | Your Telegram link | optional |
| `NEXT_PUBLIC_TWITTER_URL` | Your X/Twitter link | optional |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Contact email | optional |

> The `anon` key is safe to expose in the browser — RLS enforces that only
> admins can write. **Never** put the `service_role` key in these variables.

---

## 6. Create your admin account

1. Supabase → **Authentication → Users → Add user** → enter your email +
   password → **Create user** (tick "Auto Confirm User").
2. Make that user an admin. Supabase → **SQL Editor**, run (use your email):

   ```sql
   insert into public.admins (user_id, email)
   select id, email from auth.users where email = 'you@example.com'
   on conflict (user_id) do nothing;
   ```

3. Visit `/login`, sign in, and you'll reach `/admin`.

Only users present in `public.admins` can access `/admin` or write data — this
is enforced both in the app (route guard) **and** in the database (RLS).

---

## 7. Deploy to Cloudflare Pages

1. Push this repo to GitHub (see below).
2. Cloudflare Dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
3. Select your repo. Framework preset: **Next.js**.
   - Build command: `npx next build`
   - Build output: `.next`
4. Add the **environment variables** from step 5 (Production + Preview).
5. Deploy. Your site is live at `https://<project>.pages.dev`.

> Cloudflare Pages runs Next.js via the `@cloudflare/next-on-pages` adapter
> automatically with the Next.js preset. If you prefer **Vercel**, just import
> the repo and add the same env vars — zero config.

Push to GitHub:

```bash
git init
git add .
git commit -m "PSYCHOKILLER marketplace"
git branch -M main
git remote add origin https://github.com/<you>/psychokiller.git
git push -u origin main
```

---

## 8. Add / edit listings (no code)

1. `/login` → `/admin`.
2. **+ Add Account** → fill Basic Info (Account ID like `pk-001`, Title, Price…).
3. Drag & drop screenshots (auto-compressed to WebP; set a primary; reorder).
4. Add marketplace URLs (PlayerAuctions / Eldorado / G2G / EpicNPC).
5. **Publish** (or **Save Draft**). The public site updates automatically.

From the dashboard table you can inline: mark **Sold/Reserved/Available**,
toggle **Featured**, toggle **Live/Draft**, **Duplicate**, **Preview**, **Delete**.

Reviews/vouches: **Admin → Reviews** to add real testimonials and
publish/unpublish them.

---

## 9. Custom domain

Cloudflare Pages → your project → **Custom domains → Set up a domain**. Add your
domain (Cloudflare will guide DNS). Then update `NEXT_PUBLIC_SITE_URL` to the
custom domain and redeploy so share links / OG tags / sitemap use it.

---

## Project structure

```
supabase/schema.sql        # full DB schema + RLS + storage (run once)
src/lib/                   # supabase clients, queries, types, env, formatting
src/components/            # UI (Header, Footer, cards, gallery, share…)
src/components/admin/      # admin table, forms, image manager, reviews
src/app/                   # routes (public + /admin + /login) + robots + sitemap
```

## Security notes

- RLS: public can only read `published` rows; only `admins` can write.
- `/admin` protected by middleware + a server-side admin check.
- Anon key only in the browser; no service-role key anywhere client-side.
- No account credentials are ever stored.

## Legal

Independent marketplace/catalog. Not affiliated with, endorsed by, or sponsored
by Niantic, Inc. or The Pokémon Company. All trademarks belong to their owners.
