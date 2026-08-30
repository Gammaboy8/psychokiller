import { createClient } from '@/lib/supabase/server';
import { AdminTable } from '@/components/admin/AdminTable';
import type { Account } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const supabase = createClient();
  const { data } = await supabase
    .from('accounts')
    .select(
      'id,account_id,title,slug,price,currency,status,published,featured,level,views,created_at,updated_at'
    )
    .order('created_at', { ascending: false });

  const rows = (data as Partial<Account>[]) || [];

  const total = rows.length;
  const available = rows.filter((r) => r.status === 'available').length;
  const reserved = rows.filter((r) => r.status === 'reserved').length;
  const sold = rows.filter((r) => r.status === 'sold').length;
  const featured = rows.filter((r) => r.featured).length;
  const totalViews = rows.reduce((s, r) => s + (r.views || 0), 0);

  const stats = [
    { label: 'Total Listings', value: total },
    { label: 'Available', value: available },
    { label: 'Reserved', value: reserved },
    { label: 'Sold', value: sold },
    { label: 'Featured', value: featured },
    { label: 'Total Views', value: totalViews },
  ];

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold uppercase tracking-wide text-white">
        Dashboard
      </h1>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => (
          <div key={s.label} className="card p-4">
            <div className="text-2xl font-extrabold text-white">{s.value}</div>
            <div className="mt-1 text-xs uppercase tracking-wide text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      <AdminTable rows={rows} />
    </div>
  );
}
