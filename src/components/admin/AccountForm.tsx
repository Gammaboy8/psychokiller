'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { slugify } from '@/lib/format';
import type { AccountWithImages } from '@/lib/types';
import { ImageManager, type ManagedImage } from './ImageManager';

type FormState = Record<string, string | boolean>;

const NUMERIC = new Set([
  'price', 'level', 'xp', 'stardust', 'pokemon_storage', 'item_storage',
  'shiny_count', 'shundo_count', 'hundo_count', 'legendary_count', 'mythical_count',
]);

function toInitial(acc?: AccountWithImages): FormState {
  return {
    account_id: acc?.account_id ?? '',
    title: acc?.title ?? '',
    slug: acc?.slug ?? '',
    price: acc?.price?.toString() ?? '',
    currency: acc?.currency ?? 'USD',
    status: acc?.status ?? 'available',
    featured: acc?.featured ?? false,
    tags: acc?.tags?.join(', ') ?? '',
    level: acc?.level?.toString() ?? '',
    xp: acc?.xp?.toString() ?? '',
    stardust: acc?.stardust?.toString() ?? '',
    pokemon_storage: acc?.pokemon_storage?.toString() ?? '',
    item_storage: acc?.item_storage?.toString() ?? '',
    shiny_count: acc?.shiny_count?.toString() ?? '0',
    shundo_count: acc?.shundo_count?.toString() ?? '0',
    hundo_count: acc?.hundo_count?.toString() ?? '0',
    legendary_count: acc?.legendary_count?.toString() ?? '0',
    mythical_count: acc?.mythical_count?.toString() ?? '0',
    rare_pokemon: acc?.rare_pokemon ?? '',
    rare_backgrounds: acc?.rare_backgrounds ?? '',
    rare_costumes: acc?.rare_costumes ?? '',
    special_features: acc?.special_features ?? '',
    account_age: acc?.account_age ?? '',
    description: acc?.description ?? '',
    playerauctions_url: acc?.playerauctions_url ?? '',
    eldorado_url: acc?.eldorado_url ?? '',
    g2g_url: acc?.g2g_url ?? '',
    epicnpc_url: acc?.epicnpc_url ?? '',
    other_marketplace_url: acc?.other_marketplace_url ?? '',
  };
}

export function AccountForm({ account }: { account?: AccountWithImages }) {
  const router = useRouter();
  const supabase = createClient();
  const isEdit = Boolean(account);

  const [form, setForm] = useState<FormState>(() => toInitial(account));
  const [images, setImages] = useState<ManagedImage[]>(
    () =>
      account?.account_images.map((i) => ({
        id: i.id,
        storage_path: i.storage_path,
        public_url: i.public_url,
        is_primary: i.is_primary,
        sort_order: i.sort_order,
      })) ?? []
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const accountKey = useMemo(
    () => account?.id || (form.account_id as string) || 'draft',
    [account?.id, form.account_id]
  );

  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const onTitleBlur = () => {
    if (!form.slug && form.title) set('slug', slugify(form.title as string));
  };

  const buildPayload = (published: boolean) => {
    const p: Record<string, unknown> = {};
    Object.entries(form).forEach(([k, v]) => {
      if (k === 'tags') {
        p.tags = (v as string).split(',').map((t) => t.trim().replace(/^#/, '')).filter(Boolean);
      } else if (k === 'featured') {
        p.featured = v;
      } else if (NUMERIC.has(k)) {
        p[k] = v === '' ? (k === 'price' ? 0 : null) : Number(v);
      } else {
        p[k] = v === '' ? null : v;
      }
    });
    p.currency = form.currency || 'USD';
    p.slug = form.slug || slugify(form.title as string);
    p.published = published;
    return p;
  };

  const save = async (published: boolean) => {
    setError('');
    if (!form.account_id || !form.title) {
      setError('Account ID and Title are required.');
      return;
    }
    setSaving(true);
    const payload = buildPayload(published);

    let accountId = account?.id;
    if (isEdit) {
      const { error: e } = await supabase.from('accounts').update(payload).eq('id', account!.id);
      if (e) { setError(mapErr(e.message)); setSaving(false); return; }
    } else {
      const { data, error: e } = await supabase.from('accounts').insert(payload).select('id').single();
      if (e) { setError(mapErr(e.message)); setSaving(false); return; }
      accountId = data.id;
    }

    // sync images: delete removed, upsert current
    if (accountId) {
      const existingIds = (account?.account_images || []).map((i) => i.id);
      const keptIds = images.filter((i) => i.id).map((i) => i.id!);
      const toDelete = existingIds.filter((id) => !keptIds.includes(id));
      if (toDelete.length) {
        await supabase.from('account_images').delete().in('id', toDelete);
      }
      for (const img of images) {
        const row = {
          account_id: accountId,
          storage_path: img.storage_path,
          public_url: img.public_url,
          sort_order: img.sort_order,
          is_primary: img.is_primary,
        };
        if (img.id) {
          await supabase.from('account_images').update(row).eq('id', img.id);
        } else {
          await supabase.from('account_images').insert(row);
        }
      }
    }

    setSaving(false);
    router.push('/admin');
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="card border-crimson-600/40 bg-crimson-600/10 p-3 text-sm text-crimson-300">
          {error}
        </div>
      )}

      <Section title="Basic Information">
        <Grid>
          <Field label="Account ID *"><input className="input" value={s(form.account_id)} onChange={(e) => set('account_id', e.target.value)} placeholder="pk-001" /></Field>
          <Field label="Title *"><input className="input" value={s(form.title)} onBlur={onTitleBlur} onChange={(e) => set('title', e.target.value)} /></Field>
          <Field label="Slug"><input className="input" value={s(form.slug)} onChange={(e) => set('slug', slugify(e.target.value))} placeholder="auto from title" /></Field>
          <Field label="Price"><input type="number" min="0" step="0.01" className="input" value={s(form.price)} onChange={(e) => set('price', e.target.value)} /></Field>
          <Field label="Currency"><input className="input" value={s(form.currency)} onChange={(e) => set('currency', e.target.value.toUpperCase())} /></Field>
          <Field label="Status">
            <select className="input" value={s(form.status)} onChange={(e) => set('status', e.target.value)}>
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="sold">Sold</option>
            </select>
          </Field>
          <Field label="Tags (comma separated)"><input className="input" value={s(form.tags)} onChange={(e) => set('tags', e.target.value)} placeholder="shiny, legendary, level50" /></Field>
          <Field label="Featured">
            <label className="flex h-[38px] items-center gap-2 text-sm text-gray-300">
              <input type="checkbox" checked={Boolean(form.featured)} onChange={(e) => set('featured', e.target.checked)} className="h-4 w-4 accent-crimson-600" />
              Show on homepage
            </label>
          </Field>
        </Grid>
      </Section>

      <Section title="Account Stats">
        <Grid>
          <Num label="Level" k="level" form={form} set={set} />
          <Num label="XP" k="xp" form={form} set={set} />
          <Num label="Stardust" k="stardust" form={form} set={set} />
          <Num label="Pokémon Storage" k="pokemon_storage" form={form} set={set} />
          <Num label="Item Storage" k="item_storage" form={form} set={set} />
          <Num label="Shiny Count" k="shiny_count" form={form} set={set} />
          <Num label="Shundo Count" k="shundo_count" form={form} set={set} />
          <Num label="Hundo Count" k="hundo_count" form={form} set={set} />
          <Num label="Legendary Count" k="legendary_count" form={form} set={set} />
          <Num label="Mythical Count" k="mythical_count" form={form} set={set} />
        </Grid>
      </Section>

      <Section title="Special Information">
        <Grid>
          <Field label="Rare Pokémon"><textarea className="input min-h-[70px]" value={s(form.rare_pokemon)} onChange={(e) => set('rare_pokemon', e.target.value)} /></Field>
          <Field label="Rare Backgrounds"><textarea className="input min-h-[70px]" value={s(form.rare_backgrounds)} onChange={(e) => set('rare_backgrounds', e.target.value)} /></Field>
          <Field label="Rare Costumes"><textarea className="input min-h-[70px]" value={s(form.rare_costumes)} onChange={(e) => set('rare_costumes', e.target.value)} /></Field>
          <Field label="Special Features"><textarea className="input min-h-[70px]" value={s(form.special_features)} onChange={(e) => set('special_features', e.target.value)} /></Field>
          <Field label="Account Age"><input className="input" value={s(form.account_age)} onChange={(e) => set('account_age', e.target.value)} placeholder="e.g. Created 2017" /></Field>
        </Grid>
      </Section>

      <Section title="Description">
        <textarea
          className="input min-h-[160px]"
          value={s(form.description)}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Full description. Line breaks are preserved. Use plain text — headings, lists via dashes, etc."
        />
      </Section>

      <Section title="Images">
        <ImageManager accountKey={accountKey} images={images} onChange={setImages} />
      </Section>

      <Section title="Marketplace Links">
        <Grid>
          <Field label="PlayerAuctions URL"><input className="input" value={s(form.playerauctions_url)} onChange={(e) => set('playerauctions_url', e.target.value)} /></Field>
          <Field label="Eldorado URL"><input className="input" value={s(form.eldorado_url)} onChange={(e) => set('eldorado_url', e.target.value)} /></Field>
          <Field label="G2G URL"><input className="input" value={s(form.g2g_url)} onChange={(e) => set('g2g_url', e.target.value)} /></Field>
          <Field label="EpicNPC URL"><input className="input" value={s(form.epicnpc_url)} onChange={(e) => set('epicnpc_url', e.target.value)} /></Field>
          <Field label="Other Marketplace URL"><input className="input" value={s(form.other_marketplace_url)} onChange={(e) => set('other_marketplace_url', e.target.value)} /></Field>
        </Grid>
      </Section>

      <div className="sticky bottom-0 flex flex-wrap gap-3 border-t border-ink-700/60 bg-ink-950/90 py-4 backdrop-blur">
        <button disabled={saving} onClick={() => save(true)} className="btn-primary">
          {saving ? 'Saving…' : isEdit ? 'Save & Publish' : 'Publish'}
        </button>
        <button disabled={saving} onClick={() => save(false)} className="btn-ghost">
          Save Draft
        </button>
        <button disabled={saving} onClick={() => router.push('/admin')} className="btn-ghost">
          Cancel
        </button>
      </div>
    </div>
  );
}

function mapErr(msg: string): string {
  if (msg.includes('duplicate') && msg.includes('slug')) return 'That slug is already in use. Choose a unique slug.';
  if (msg.includes('duplicate') && msg.includes('account_id')) return 'That Account ID already exists.';
  if (msg.toLowerCase().includes('row-level security')) return 'Permission denied. Your account is not an authorized admin.';
  return msg;
}

const s = (v: string | boolean | undefined) => (typeof v === 'string' ? v : '');

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-5">
      <h2 className="mb-4 font-display text-lg font-bold uppercase text-white">{title}</h2>
      {children}
    </div>
  );
}
function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="label">{label}</label>{children}</div>;
}
function Num({ label, k, form, set }: { label: string; k: string; form: FormState; set: (k: string, v: string) => void }) {
  return (
    <Field label={label}>
      <input type="number" min="0" className="input" value={s(form[k])} onChange={(e) => set(k, e.target.value)} />
    </Field>
  );
}
