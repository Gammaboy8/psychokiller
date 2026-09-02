'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';

const SORTS = [
  { v: 'newest', l: 'Newest' },
  { v: 'oldest', l: 'Oldest' },
  { v: 'price_asc', l: 'Price: Low → High' },
  { v: 'price_desc', l: 'Price: High → Low' },
  { v: 'shiny_desc', l: 'Highest Shiny' },
  { v: 'shundo_desc', l: 'Highest Shundo' },
];

export function FilterBar() {
  const router = useRouter();
  const params = useSearchParams();
  const [open, setOpen] = useState(false);

  const get = (k: string) => params.get(k) ?? '';

  const push = useCallback(
    (updates: Record<string, string>) => {
      const next = new URLSearchParams(params.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v === '' || v == null) next.delete(k);
        else next.set(k, v);
      });
      router.push(`/accounts?${next.toString()}`);
    },
    [params, router]
  );

  return (
    <div className="card mb-6 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <input
            defaultValue={get('q')}
            placeholder="Search by Account ID, Pokémon, background, shiny or level…"
            className="input pl-9"
            onKeyDown={(e) => {
              if (e.key === 'Enter') push({ q: (e.target as HTMLInputElement).value });
            }}
          />
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">⌕</span>
        </div>

        <select
          className="input md:w-56"
          value={get('sort') || 'newest'}
          onChange={(e) => push({ sort: e.target.value })}
        >
          {SORTS.map((s) => (
            <option key={s.v} value={s.v}>{s.l}</option>
          ))}
        </select>

        <button className="btn-ghost md:w-auto" onClick={() => setOpen((v) => !v)}>
          Filters {open ? '▲' : '▼'}
        </button>
      </div>

      {open && (
        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-ink-700/60 pt-4 md:grid-cols-4">
          <Num label="Min Price" k="minPrice" get={get} push={push} />
          <Num label="Max Price" k="maxPrice" get={get} push={push} />
          <Num label="Min Level" k="minLevel" get={get} push={push} />
          <Num label="Min Shiny" k="minShiny" get={get} push={push} />
          <Num label="Min Shundo" k="minShundo" get={get} push={push} />
          <Num label="Min Hundo" k="minHundo" get={get} push={push} />
          <Num label="Min Legendary" k="minLegendary" get={get} push={push} />
          <div>
            <label className="label">Status</label>
            <select className="input" value={get('status') || ''} onChange={(e) => push({ status: e.target.value })}>
              <option value="">Available &amp; Reserved</option>
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="sold">Sold</option>
              <option value="all">All</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={get('rareBg') === '1'}
              onChange={(e) => push({ rareBg: e.target.checked ? '1' : '' })}
              className="h-4 w-4 accent-crimson-600"
            />
            Rare Background
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={get('rareCostume') === '1'}
              onChange={(e) => push({ rareCostume: e.target.checked ? '1' : '' })}
              className="h-4 w-4 accent-crimson-600"
            />
            Rare Costume
          </label>
          <div className="col-span-2 flex items-end md:col-span-4">
            <button className="btn-ghost btn-sm" onClick={() => router.push('/accounts')}>
              Reset filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Num({
  label,
  k,
  get,
  push,
}: {
  label: string;
  k: string;
  get: (k: string) => string;
  push: (u: Record<string, string>) => void;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input
        type="number"
        min={0}
        defaultValue={get(k)}
        className="input"
        onBlur={(e) => push({ [k]: e.target.value })}
        onKeyDown={(e) => {
          if (e.key === 'Enter') push({ [k]: (e.target as HTMLInputElement).value });
        }}
      />
    </div>
  );
}
