import type { Metadata } from 'next';
import { getPublicAccounts, type AccountFilters } from '@/lib/queries';
import { AccountCard } from '@/components/AccountCard';
import { FilterBar } from '@/components/FilterBar';
import { EmptyState } from '@/components/EmptyState';

export const revalidate = 30;

export const metadata: Metadata = {
  title: 'Browse Accounts',
  description: 'Browse all available PSYCHOKILLER Pokémon GO accounts. Filter by level, shiny, shundo, hundo and price.',
};

function num(v: string | undefined): number | undefined {
  if (v == null || v === '') return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export default async function AccountsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const g = (k: string) => {
    const v = searchParams[k];
    return Array.isArray(v) ? v[0] : v;
  };

  const filters: AccountFilters = {
    q: g('q') || undefined,
    minPrice: num(g('minPrice')),
    maxPrice: num(g('maxPrice')),
    minLevel: num(g('minLevel')),
    minShiny: num(g('minShiny')),
    minShundo: num(g('minShundo')),
    minHundo: num(g('minHundo')),
    minLegendary: num(g('minLegendary')),
    hasRareBackground: g('rareBg') === '1',
    hasRareCostume: g('rareCostume') === '1',
    status: g('status') || undefined,
    sort: g('sort') || 'newest',
    featured: g('featured') === '1',
  };

  const items = await getPublicAccounts(filters);

  return (
    <div className="container-px py-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-white">
          Browse Accounts
        </h1>
        <p className="mt-1 text-sm text-muted">
          {items.length} {items.length === 1 ? 'listing' : 'listings'} found
        </p>
      </div>

      <FilterBar />

      {items.length ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <AccountCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No accounts match your filters."
          hint="Try widening your price range or clearing some filters."
        />
      )}
    </div>
  );
}
