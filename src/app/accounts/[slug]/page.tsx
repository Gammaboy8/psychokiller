export const runtime = 'edge';

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAccountBySlug } from '@/lib/queries';
import { formatPrice, formatNumber } from '@/lib/format';
import { MARKETPLACES } from '@/lib/types';
import { SITE_URL } from '@/lib/env';
import { Gallery } from '@/components/Gallery';
import { SharePanel } from '@/components/SharePanel';
import { StatusBadge } from '@/components/StatusBadge';
import { ViewTracker } from '@/components/ViewTracker';

export const revalidate = 30;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const acc = await getAccountBySlug(params.slug);
  if (!acc) return { title: 'Listing not found' };

  const desc = `Level ${acc.level ?? '?'} · ${acc.shiny_count} shiny · ${acc.shundo_count} shundo · ${acc.hundo_count} hundo · ${acc.status === 'sold' ? 'SOLD' : formatPrice(acc.price, acc.currency)}`;
  const img = acc.account_images?.[0]?.public_url;
  const url = `${SITE_URL}/accounts/${acc.slug}`;

  return {
    title: acc.title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title: `${acc.title} | PSYCHOKILLER`,
      description: desc,
      url,
      images: img ? [{ url: img }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${acc.title} | PSYCHOKILLER`,
      description: desc,
      images: img ? [img] : undefined,
    },
  };
}

export default async function AccountDetail({
  params,
}: {
  params: { slug: string };
}) {
  const acc = await getAccountBySlug(params.slug);
  if (!acc) notFound();

  const images = acc.account_images.map((i) => i.public_url);
  const url = `${SITE_URL}/accounts/${acc.slug}`;

  const shareText = `🔥 PSYCHOKILLER Account\n\n${acc.title}\nLevel ${acc.level ?? '?'}\n${acc.shiny_count} Shinies\n${acc.shundo_count} Shundos\n${acc.hundo_count} Hundos\n\nPrice: ${acc.status === 'sold' ? 'SOLD' : formatPrice(acc.price, acc.currency)}`;

  const marketLinks = MARKETPLACES.map((m) => ({
    label: m.label,
    url: acc[m.key as keyof typeof acc] as string | null,
  })).filter((m) => m.url);

  const stats: [string, string | number][] = [
    ['Account ID', acc.account_id],
    ['Level', acc.level ?? '—'],
    ['XP', formatNumber(acc.xp)],
    ['Stardust', formatNumber(acc.stardust)],
    ['Pokémon Storage', formatNumber(acc.pokemon_storage)],
    ['Item Storage', formatNumber(acc.item_storage)],
    ['Shiny', formatNumber(acc.shiny_count)],
    ['Shundo', formatNumber(acc.shundo_count)],
    ['Hundo', formatNumber(acc.hundo_count)],
    ['Legendary', formatNumber(acc.legendary_count)],
    ['Mythical', formatNumber(acc.mythical_count)],
    ['Account Age', acc.account_age || '—'],
  ];

  const special: [string, string | null][] = [
    ['Rare Pokémon', acc.rare_pokemon],
    ['Rare Backgrounds', acc.rare_backgrounds],
    ['Rare Costumes', acc.rare_costumes],
    ['Special Features', acc.special_features],
  ].filter(([, v]) => v) as [string, string | null][];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: acc.title,
    image: images,
    description: acc.description || shareText,
    sku: acc.account_id,
    offers: {
      '@type': 'Offer',
      price: acc.price,
      priceCurrency: acc.currency,
      availability:
        acc.status === 'sold'
          ? 'https://schema.org/OutOfStock'
          : 'https://schema.org/InStock',
      url,
    },
  };

  return (
    <div className="container-px py-8">
      <ViewTracker slug={acc.slug} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="mb-4 text-sm text-muted">
        <Link href="/accounts" className="hover:text-white">Accounts</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-300">{acc.account_id}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        {/* LEFT: gallery */}
        <div className="flex flex-col gap-6">
          <Gallery images={images} title={acc.title} />

          {acc.description && (
            <div className="card p-5">
              <h2 className="mb-3 font-display text-xl font-bold uppercase text-white">Description</h2>
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-300">
                {acc.description}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: info */}
        <div className="flex flex-col gap-6">
          <div className="card p-5">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <StatusBadge status={acc.status} />
              {acc.featured && <span className="badge-featured">Featured</span>}
            </div>
            <h1 className="font-display text-2xl font-bold uppercase leading-tight text-white">
              {acc.title}
            </h1>
            <div className="mt-3 text-3xl font-extrabold text-white">
              {acc.status === 'sold' ? (
                <span className="text-crimson-400">SOLD</span>
              ) : (
                formatPrice(acc.price, acc.currency)
              )}
            </div>

            {acc.tags?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {acc.tags.map((t) => (
                  <span key={t} className="badge bg-ink-700 text-gray-300">#{t}</span>
                ))}
              </div>
            )}

            {marketLinks.length > 0 && acc.status !== 'sold' ? (
              <div className="mt-5 flex flex-col gap-2">
                {marketLinks.map((m) => (
                  <a
                    key={m.label}
                    href={m.url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full"
                  >
                    Buy / View on {m.label}
                  </a>
                ))}
              </div>
            ) : acc.status === 'sold' ? (
              <p className="mt-5 rounded-lg bg-ink-900 px-3 py-2 text-sm text-muted">
                This account has been sold and is kept here for reference.
              </p>
            ) : (
              <p className="mt-5 rounded-lg bg-ink-900 px-3 py-2 text-sm text-muted">
                No marketplace link yet — contact us for availability.
              </p>
            )}
          </div>

          <div className="card p-5">
            <h2 className="mb-3 font-display text-xl font-bold uppercase text-white">Account Info</h2>
            <div className="grid grid-cols-2 gap-2">
              {stats.map(([k, v]) => (
                <div key={k} className="stat-chip">
                  <span className="text-[11px] uppercase tracking-wide text-muted">{k}</span>
                  <span className="text-sm font-semibold text-gray-100">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {special.length > 0 && (
            <div className="card p-5">
              <h2 className="mb-3 font-display text-xl font-bold uppercase text-white">Special</h2>
              <dl className="space-y-3">
                {special.map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-[11px] uppercase tracking-wide text-muted">{k}</dt>
                    <dd className="whitespace-pre-wrap text-sm text-gray-200">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <SharePanel url={url} shareText={shareText} />
        </div>
      </div>
    </div>
  );
}
