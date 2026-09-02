export const runtime = 'edge';

import type { Metadata } from 'next';
import Link from 'next/link';
import { getPublishedReviews } from '@/lib/queries';
import { EmptyState } from '@/components/EmptyState';
import { formatDate } from '@/lib/format';
import type { Review } from '@/lib/types';

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

function shortReference(reference: string) {
  const ending = reference.slice(-4);
  return ending ? `••••${ending}` : 'On file';
}

function ReviewCard({ review }: { review: Review }) {
  const initial = review.display_name.trim().charAt(0).toUpperCase() || 'P';

  return (
    <article className="card flex h-full flex-col p-5 transition-transform duration-300 hover:-translate-y-1 hover:shadow-glow">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-crimson-500/15 font-display text-lg font-bold text-crimson-300 ring-1 ring-crimson-500/30">
          {initial}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-semibold text-white">{review.display_name}</h2>
            <Stars rating={review.rating} />
          </div>
          <p className="mt-0.5 text-xs text-muted">{review.platform || 'Customer feedback'}</p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-gray-300">“{review.body}”</p>

      <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-ink-700/60 pt-4 text-xs text-muted">
        <span>{formatDate(review.review_date)}</span>
        {review.order_ref && (
          <span className="font-mono" title="Order reference retained privately by the team">
            Ref. {shortReference(review.order_ref)}
          </span>
        )}
      </div>
    </article>
  );
}

export default async function ReviewsPage() {
  const reviews = await getPublishedReviews();
  const rated = reviews.filter((review) => review.rating != null);
  const averageRating = rated.length
    ? rated.reduce((total, review) => total + (review.rating || 0), 0) / rated.length
    : null;

  return (
    <div className="container-px py-8 sm:py-12">
      <section className="card overflow-hidden p-6 text-center sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-crimson-300">Customer trust</p>
        <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl">
          Reviews &amp; Vouches
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          Feedback from completed purchases, shared with the customer&apos;s permission. We keep the source visible and protect private order details.
        </p>

        <div className="mx-auto mt-6 grid max-w-xl grid-cols-2 gap-3">
          <div className="rounded-xl border border-ink-700/70 bg-ink-900/70 px-4 py-3">
            <span className="block text-2xl font-extrabold text-white">{reviews.length}</span>
            <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">Published reviews</span>
          </div>
          <div className="rounded-xl border border-ink-700/70 bg-ink-900/70 px-4 py-3">
            <span className="block text-2xl font-extrabold text-white">{averageRating ? `${averageRating.toFixed(1)} / 5` : '—'}</span>
            <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">Average rating</span>
          </div>
        </div>
      </section>

      <section className="my-6 grid gap-3 md:grid-cols-3">
        <TrustPoint title="Source shown" text="When available, the marketplace or community where the buyer shared feedback is displayed." />
        <TrustPoint title="Private details protected" text="Order references are retained privately and only a shortened reference is shown here." />
        <TrustPoint title="Published deliberately" text="New feedback is saved as a draft and goes live only after the team checks it." />
      </section>

      {reviews.length ? (
        <section aria-label="Customer reviews" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => <ReviewCard key={review.id} review={review} />)}
        </section>
      ) : (
        <EmptyState
          title="No published reviews yet."
          hint="Customer feedback will appear here after it has been checked and approved."
        />
      )}

      <section className="mt-8 rounded-2xl border border-crimson-500/25 bg-crimson-500/[0.06] p-5 text-center sm:p-7">
        <h2 className="font-display text-xl font-bold uppercase text-white">Already bought from us?</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted">
          Send us your honest feedback with your marketplace name or a safe order reference. We will ask before publishing it publicly.
        </p>
        <Link href="/contact" className="btn-primary mt-5 inline-flex">Share your feedback</Link>
      </section>
    </div>
  );
}

function TrustPoint({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl border border-ink-700/60 bg-ink-900/60 p-4">
      <h2 className="text-sm font-bold text-white">{title}</h2>
      <p className="mt-1.5 text-xs leading-relaxed text-muted">{text}</p>
    </div>
  );
}
