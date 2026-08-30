'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { Account } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import { formatPrice, formatDate } from '@/lib/format';
import { StatusBadge } from '@/components/StatusBadge';

export function AdminTable({ rows }: { rows: Partial<Account>[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState('');

  const supabase = createClient();

  const patch = async (id: string, updates: Partial<Account>) => {
    setBusy(id);
    setMsg('');
    const { error } = await supabase.from('accounts').update(updates).eq('id', id);
    setBusy(null);
    if (error) setMsg(error.message);
    else router.refresh();
  };

  const duplicate = async (id: string) => {
    setBusy(id);
    setMsg('');
    const { data } = await supabase.from('accounts').select('*').eq('id', id).single();
    if (data) {
      const copy: Record<string, unknown> = { ...data };
      delete copy.id;
      delete copy.created_at;
      delete copy.updated_at;
      delete copy.views;
      delete copy.last_viewed_at;
      const suffix = Math.random().toString(36).slice(2, 6);
      copy.account_id = `${data.account_id}-copy-${suffix}`;
      copy.slug = `${data.slug}-copy-${suffix}`;
      copy.title = `${data.title} (Copy)`;
      copy.published = false;
      copy.featured = false;
      const { error } = await supabase.from('accounts').insert(copy);
      if (error) setMsg(error.message);
    }
    setBusy(null);
    router.refresh();
  };

  const remove = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone. Images will also be removed.`)) return;
    setBusy(id);
    setMsg('');
    const { error } = await supabase.from('accounts').delete().eq('id', id);
    setBusy(null);
    if (error) setMsg(error.message);
    else router.refresh();
  };

  if (!rows.length) {
    return (
      <div className="card p-8 text-center text-muted">
        No listings yet.{' '}
        <Link href="/admin/accounts/new" className="text-crimson-400 hover:underline">
          Add your first account →
        </Link>
      </div>
    );
  }

  return (
    <div className="card overflow-x-auto">
      {msg && <div className="border-b border-crimson-600/40 bg-crimson-600/10 px-4 py-2 text-sm text-crimson-300">{msg}</div>}
      <table className="w-full min-w-[900px] text-sm">
        <thead className="border-b border-ink-700/60 text-left text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="px-3 py-3">ID</th>
            <th className="px-3 py-3">Title</th>
            <th className="px-3 py-3">Price</th>
            <th className="px-3 py-3">Lvl</th>
            <th className="px-3 py-3">Status</th>
            <th className="px-3 py-3">Pub</th>
            <th className="px-3 py-3">Feat</th>
            <th className="px-3 py-3">Views</th>
            <th className="px-3 py-3">Updated</th>
            <th className="px-3 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-800">
          {rows.map((r) => (
            <tr key={r.id} className={busy === r.id ? 'opacity-50' : ''}>
              <td className="px-3 py-3 font-mono text-xs text-muted">{r.account_id}</td>
              <td className="px-3 py-3 font-medium text-white">{r.title}</td>
              <td className="px-3 py-3">{formatPrice(r.price || 0, r.currency)}</td>
              <td className="px-3 py-3">{r.level ?? '—'}</td>
              <td className="px-3 py-3"><StatusBadge status={r.status || 'available'} /></td>
              <td className="px-3 py-3">
                <button
                  onClick={() => patch(r.id!, { published: !r.published })}
                  className={`badge ${r.published ? 'bg-emerald-500/15 text-emerald-300' : 'bg-ink-700 text-muted'}`}
                >
                  {r.published ? 'Live' : 'Draft'}
                </button>
              </td>
              <td className="px-3 py-3">
                <button
                  onClick={() => patch(r.id!, { featured: !r.featured })}
                  className={`badge ${r.featured ? 'badge-featured' : 'bg-ink-700 text-muted'}`}
                >
                  {r.featured ? '★' : '☆'}
                </button>
              </td>
              <td className="px-3 py-3 text-muted">{r.views ?? 0}</td>
              <td className="px-3 py-3 text-xs text-muted">{r.updated_at ? formatDate(r.updated_at) : '—'}</td>
              <td className="px-3 py-3">
                <div className="flex flex-wrap justify-end gap-1">
                  <Link href={`/admin/accounts/${r.id}`} className="btn-ghost btn-sm">Edit</Link>
                  <Link href={`/accounts/${r.slug}`} target="_blank" className="btn-ghost btn-sm">Preview</Link>
                  {r.status !== 'sold' && (
                    <button onClick={() => patch(r.id!, { status: 'sold' })} className="btn-ghost btn-sm">Sold</button>
                  )}
                  {r.status !== 'reserved' && (
                    <button onClick={() => patch(r.id!, { status: 'reserved' })} className="btn-ghost btn-sm">Reserve</button>
                  )}
                  {r.status !== 'available' && (
                    <button onClick={() => patch(r.id!, { status: 'available' })} className="btn-ghost btn-sm">Avail</button>
                  )}
                  <button onClick={() => duplicate(r.id!)} className="btn-ghost btn-sm">Dup</button>
                  <button onClick={() => remove(r.id!, r.title || '')} className="btn-ghost btn-sm text-crimson-400">Del</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
