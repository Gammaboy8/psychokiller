export const runtime = 'edge';

import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AccountForm } from '@/components/admin/AccountForm';
import type { AccountWithImages } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function EditAccountPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const { data } = await supabase
    .from('accounts')
    .select('*, account_images(*)')
    .eq('id', params.id)
    .maybeSingle();

  if (!data) notFound();
  const acc = data as unknown as AccountWithImages;
  acc.account_images = (acc.account_images || []).sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold uppercase tracking-wide text-white">
        Edit: {acc.title}
      </h1>
      <AccountForm account={acc} />
    </div>
  );
}
