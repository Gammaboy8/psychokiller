import Link from 'next/link';
import type { ListItem } from '@/lib/queries';
import { AccountCard } from './AccountCard';

export function SectionRow({
  title,
  items,
  href,
}: {
  title: string;
  items: ListItem[];
  href?: string;
}) {
  if (!items.length) return null;
  return (
    <section className="container-px py-8">
      <div className="mb-4 flex items-end justify-between">
        <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-white">
          {title}
        </h2>
        {href && (
          <Link href={href} className="text-sm font-medium text-crimson-400 hover:underline">
            View all →
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <AccountCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
