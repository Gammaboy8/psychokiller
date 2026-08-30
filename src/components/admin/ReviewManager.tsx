'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Review } from '@/lib/types';
import { formatDate } from '@/lib/format';

export function ReviewManager({ reviews }: { reviews: Review[] }) {
  const router = useRouter();
  const supabase = createClient();
  const [form, setForm] = useState({
    display_name: '',
    platform: '',
    rating: '5',
    body: '',
    order_ref: '',
    review_date: new Date().toISOString().slice(0, 10),
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const add = async () => {
    setError('');
    if (!form.display_name || !form.body) {
      setError('Name and review text are required.');
      return;
    }
    setBusy(true);
    const { error } = await supabase.from('reviews').insert({
      display_name: form.display_name,
      platform: form.platform || null,
      rating: Number(form.rating),
      body: form.body,
      order_ref: form.order_ref || null,
      review_date: form.review_date,
      published: true,
    });
    setBusy(false);
    if (error) { setError(error.message); return; }
    setForm({ ...form, display_name: '', platform: '', body: '', order_ref: '' });
    router.refresh();
  };

  const togglePub = async (r: Review) => {
    await supabase.from('reviews').update({ published: !r.published }).eq('id', r.id);
    router.refresh();
  };

  const remove = async (r: Review) => {
    if (!confirm(`Delete review by ${r.display_name}?`)) return;
    await supabase.from('reviews').delete().eq('id', r.id);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="card p-5">
        <h2 className="mb-4 font-display text-lg font-bold uppercase text-white">Add Review / Vouch</h2>
        {error && <p className="mb-3 text-sm text-crimson-300">{error}</p>}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div><label className="label">Display Name *</label><input className="input" value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })} /></div>
          <div><label className="label">Platform</label><input className="input" value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} placeholder="PlayerAuctions / Discord" /></div>
          <div><label className="label">Rating</label>
            <select className="input" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })}>
              {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ★</option>)}
            </select>
          </div>
          <div><label className="label">Order Ref</label><input className="input" value={form.order_ref} onChange={(e) => setForm({ ...form, order_ref: e.target.value })} /></div>
          <div><label className="label">Date</label><input type="date" className="input" value={form.review_date} onChange={(e) => setForm({ ...form, review_date: e.target.value })} /></div>
          <div className="sm:col-span-2 lg:col-span-3"><label className="label">Review Text *</label><textarea className="input min-h-[90px]" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /></div>
        </div>
        <button disabled={busy} onClick={add} className="btn-primary mt-4">{busy ? 'Adding…' : 'Add Review'}</button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[700px] text-sm">
          <thead className="border-b border-ink-700/60 text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-3 py-3">Name</th>
              <th className="px-3 py-3">Rating</th>
              <th className="px-3 py-3">Platform</th>
              <th className="px-3 py-3">Date</th>
              <th className="px-3 py-3">Published</th>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-800">
            {reviews.length === 0 && (
              <tr><td colSpan={6} className="px-3 py-6 text-center text-muted">No reviews yet.</td></tr>
            )}
            {reviews.map((r) => (
              <tr key={r.id}>
                <td className="px-3 py-3 font-medium text-white">{r.display_name}</td>
                <td className="px-3 py-3 text-crimson-400">{'★'.repeat(r.rating || 0)}</td>
                <td className="px-3 py-3 text-muted">{r.platform || '—'}</td>
                <td className="px-3 py-3 text-xs text-muted">{formatDate(r.review_date)}</td>
                <td className="px-3 py-3">
                  <button onClick={() => togglePub(r)} className={`badge ${r.published ? 'bg-emerald-500/15 text-emerald-300' : 'bg-ink-700 text-muted'}`}>
                    {r.published ? 'Live' : 'Hidden'}
                  </button>
                </td>
                <td className="px-3 py-3 text-right">
                  <button onClick={() => remove(r)} className="btn-ghost btn-sm text-crimson-400">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
