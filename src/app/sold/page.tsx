import type { Metadata } from 'next';
import { getSoldAccounts } from '@/lib/queries';
import { AccountCard } from '@/components/AccountCard';
import { EmptyState } from '@/components/EmptyState';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Sold Accounts',
  description: 'Archive of sold PSYCHOKILLER Pokémon GO accounts.',
};

export default async function SoldPage() {
  const items = await getSoldAccounts();
  return (
    <div className="container-px py-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-white">
          Sold Archive
        </h1>
        <p className="mt-1 text-sm text-muted">
          A record of successfully sold accounts.
        </p>
      </div>
      {items.length ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <AccountCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <EmptyState title="No sold accounts yet." hint="Sold listings will appear here." />
      )}
    </div>
  );
}
