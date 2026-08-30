export const runtime = 'edge';

import type { Metadata } from 'next';
import { getPublishedReviews } from '@/lib/queries';
import { EmptyState } from '@/components/EmptyState';
import { formatDate } from '@/lib/format';

export const revalidate = 120;

export const metadata: Metadata = {
  title: 'Reviews & Vouches',
  description: 'Customer reviews, vouches and marketplace reputation for PSYCHOKILLER.',
};

function Stars({ rating }: { rating: number | null }) {
  if (!rating) return null;
  return (
    <div className="text-crimson-400" aria-label={`${rating} out of 5`}>
      {'★'.repeat(rating)}
      <span className="text-ink-600">{'★'.repeat(5 - rating)}</span>
    </div>
  );
}

export default async function ReviewsPage() {
  const reviews = await getPublishedReviews();
  return (
    <div className="container-px py-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-white">
          Reviews &amp; Vouches
        </h1>
        <p className="mt-1 text-sm text-muted">
          Real feedback from verified buyers across marketplaces.
        </p>
      </div>

      {reviews.length ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <div key={r.id} className="card p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-semibold text-white">{r.display_name}</span>
                <Stars rating={r.rating} />
              </div>
              <p className="text-sm leading-relaxed text-gray-300">{r.body}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-muted">
                <span>{r.platform || 'Marketplace'}</span>
                <span>{formatDate(r.review_date)}</span>
              </div>
              {r.order_ref && (
                <div className="mt-1 font-mono text-[11px] text-muted">Ref: {r.order_ref}</div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No reviews yet."
          hint="Verified customer reviews and vouches will appear here."
        />
      )}
    </div>
  );
}
