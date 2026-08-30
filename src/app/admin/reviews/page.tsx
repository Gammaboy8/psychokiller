import { createClient } from '@/lib/supabase/server';
import { ReviewManager } from '@/components/admin/ReviewManager';
import type { Review } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function AdminReviewsPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from('reviews')
    .select('*')
    .order('review_date', { ascending: false });

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold uppercase tracking-wide text-white">
        Reviews &amp; Vouches
      </h1>
      <ReviewManager reviews={(data as Review[]) || []} />
    </div>
  );
}
