import Link from 'next/link';
import Image from 'next/image';
import type { ListItem } from '@/lib/queries';
import { primaryImage } from '@/lib/queries';
import { formatPrice, formatNumber } from '@/lib/format';
import { StatusBadge } from './StatusBadge';

export function AccountCard({ item }: { item: ListItem }) {
  const img = primaryImage(item);
  return (
    <Link
      href={`/accounts/${item.slug}`}
      className="card group flex flex-col overflow-hidden transition-transform hover:-translate-y-0.5 hover:shadow-glow"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink-900">
        {img ? (
          <Image
            src={img}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted">No image</div>
        )}
        <div className="absolute left-2 top-2 flex gap-1.5">
          <StatusBadge status={item.status} />
          {item.featured && <span className="badge-featured">Featured</span>}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-sm font-semibold text-white">{item.title}</h3>
          <span className="shrink-0 font-mono text-[11px] uppercase text-muted">{item.account_id}</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5 text-center">
          <Stat label="Lvl" value={item.level ?? '—'} />
          <Stat label="Shiny" value={formatNumber(item.shiny_count)} />
          <Stat label="Shundo" value={formatNumber(item.shundo_count)} />
          <Stat label="Hundo" value={formatNumber(item.hundo_count)} />
        </div>

        <div className="mt-auto flex items-center justify-between pt-1">
          <span className="text-lg font-bold text-white">
            {item.status === 'sold' ? (
              <span className="text-crimson-400">Sold</span>
            ) : (
              formatPrice(item.price, item.currency)
            )}
          </span>
          <span className="text-xs font-medium text-crimson-400 group-hover:underline">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md bg-ink-900/70 py-1.5">
      <div className="text-sm font-bold text-gray-100">{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-muted">{label}</div>
    </div>
  );
}
