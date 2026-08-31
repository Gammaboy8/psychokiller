export const runtime = 'edge';

import Link from 'next/link';
import Image from 'next/image';
import {
  getFeaturedAccounts,
  getLatestAccounts,
  getPremiumAccounts,
  getRecentlySold,
} from '@/lib/queries';
import { SectionRow } from '@/components/SectionRow';
import { EmptyState } from '@/components/EmptyState';
import { DISCORD_URL } from '@/lib/env';

export const revalidate = 60;

export default async function HomePage() {
  const [featured, latest, premium, sold] = await Promise.all([
    getFeaturedAccounts(4),
    getLatestAccounts(8),
    getPremiumAccounts(4),
    getRecentlySold(4),
  ]);

  const hasAny = featured.length || latest.length || premium.length || sold.length;

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-ink-700/60">
        {/* layered glows */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 animate-pulse-glow rounded-full bg-crimson-600/30 blur-[110px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-10 h-[300px] w-[300px] rounded-full bg-crimson-700/20 blur-[90px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 bottom-0 h-[260px] w-[260px] rounded-full bg-purple-900/25 blur-[90px]"
        />

        {/* shooting stars */}
        <span aria-hidden className="shooting-star" style={{ top: '18%', animationDelay: '2s' }} />
        <span aria-hidden className="shooting-star" style={{ top: '55%', animationDelay: '9s' }} />
        <span aria-hidden className="shooting-star" style={{ top: '35%', animationDelay: '16s' }} />

        {/* giant rotating pokeball watermark */}
        <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 opacity-[0.05]">
          <svg width="560" height="560" viewBox="0 0 100 100" fill="none" className="animate-spin-slow text-crimson-400">
            <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="1.4" />
            <line x1="4" y1="50" x2="35" y2="50" stroke="currentColor" strokeWidth="1.4" />
            <line x1="65" y1="50" x2="96" y2="50" stroke="currentColor" strokeWidth="1.4" />
            <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="1.4" />
            <circle cx="50" cy="50" r="6" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </div>

        <div className="container-px relative flex flex-col items-center py-16 text-center md:py-24">
          {/* logo medallion */}
          <div className="relative mb-6">
            <div aria-hidden className="absolute inset-0 -m-3 animate-pulse-glow rounded-full bg-crimson-500/40 blur-2xl" />
            <div aria-hidden className="logo-ring absolute inset-0 -m-2 rounded-full" />
            <Image
              src="/logo.webp"
              alt="PSYCHOKILLER"
              width={120}
              height={120}
              priority
              className="relative h-24 w-24 rounded-full object-cover ring-2 ring-crimson-500/70 shadow-[0_0_40px_rgba(224,58,58,0.5)] md:h-28 md:w-28"
            />
          </div>

          <span className="badge-featured mb-5">Premium Pokémon GO Accounts</span>
          <h1 className="hero-title font-display text-5xl font-extrabold uppercase tracking-tight sm:text-6xl md:text-7xl">
            PSYCHO<span className="hero-title-red">KILLER</span>
          </h1>
          <p className="mt-4 text-lg font-medium text-gray-300">
            Pokémon GO Account Marketplace
          </p>
          <p className="mt-3 max-w-xl text-sm text-muted">
            Hand-picked, high-value accounts — shinies, shundos, hundos and legendaries.
            Browse the catalog, then buy safely through an authorized marketplace.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/accounts" className="btn-primary btn-shine px-6 py-3 text-base">
              Browse Accounts
            </Link>
            <Link href="/contact" className="btn-ghost px-6 py-3 text-base">
              Contact Us
            </Link>
            {DISCORD_URL && (
              <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                Join Discord
              </a>
            )}
          </div>

          {/* trust chips */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5 text-xs">
            <span className="trust-chip">✅ Verified listings</span>
            <span className="trust-chip">🔒 Marketplace escrow</span>
            <span className="trust-chip">⚡ Fast delivery</span>
            <span className="trust-chip">💬 24/7 Telegram support</span>
          </div>
        </div>
      </section>

      {/* FEATURE STRIP */}
      <section className="border-b border-ink-700/60 bg-ink-900/40">
        <div className="container-px grid grid-cols-2 gap-4 py-8 md:grid-cols-4">
          {[
            { icon: '✨', title: 'Shundos & Hundos', desc: 'Perfect IV collections' },
            { icon: '📸', title: 'Full Documentation', desc: 'Real screenshots & stats' },
            { icon: '🛡️', title: 'Safe Purchases', desc: 'Escrow via marketplaces' },
            { icon: '💰', title: 'UPI · e₹ · USDT', desc: 'Flexible payments' },
          ].map((f) => (
            <div
              key={f.title}
              className="group flex flex-col items-center gap-1.5 rounded-xl border border-ink-700/50 bg-ink-850/60 p-4 text-center transition-all hover:border-crimson-500/50 hover:shadow-glow"
            >
              <span className="text-2xl transition-transform group-hover:scale-125">{f.icon}</span>
              <span className="text-sm font-bold text-white">{f.title}</span>
              <span className="text-xs text-muted">{f.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {hasAny ? (
        <>
          <SectionRow title="Featured Accounts" items={featured} href="/accounts?featured=1" />
          <SectionRow title="Latest Listings" items={latest} href="/accounts" />
          <SectionRow title="Premium Accounts" items={premium} href="/accounts?sort=price_desc" />
          <SectionRow title="Recently Sold" items={sold} href="/sold" />
        </>
      ) : (
        <div className="container-px py-16">
          <EmptyState
            title="No accounts available right now."
            hint="Check back soon — new listings are added regularly. Admins can publish listings from the dashboard."
          />
        </div>
      )}
    </>
  );
}
