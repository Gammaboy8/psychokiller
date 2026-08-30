import Link from 'next/link';
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
        <div className="container-px flex flex-col items-center py-20 text-center md:py-28">
          <span className="badge-featured mb-5">Premium Pokémon GO Accounts</span>
          <h1 className="font-display text-5xl font-extrabold uppercase tracking-tight text-white sm:text-6xl md:text-7xl">
            PSYCHO<span className="text-crimson-500">KILLER</span>
          </h1>
          <p className="mt-4 text-lg font-medium text-gray-300">
            Pokémon GO Account Marketplace
          </p>
          <p className="mt-3 max-w-xl text-sm text-muted">
            Hand-picked, high-value accounts — shinies, shundos, hundos and legendaries.
            Browse the catalog, then buy safely through an authorized marketplace.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/accounts" className="btn-primary">Browse Accounts</Link>
            {DISCORD_URL && (
              <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                Join Discord
              </a>
            )}
          </div>
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
