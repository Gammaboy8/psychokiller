import { createClient } from '@/lib/supabase/server';
import { SUPABASE_CONFIGURED } from '@/lib/env';
import type { Account, AccountWithImages, Review } from '@/lib/types';

const LIST_SELECT =
  'id,account_id,title,slug,price,currency,status,featured,tags,level,shiny_count,shundo_count,hundo_count,legendary_count,rare_backgrounds,rare_costumes,created_at,account_images(public_url,is_primary,sort_order)';

export interface ListItem extends Pick<
  Account,
  'id' | 'account_id' | 'title' | 'slug' | 'price' | 'currency' | 'status' |
  'featured' | 'tags' | 'level' | 'shiny_count' | 'shundo_count' |
  'hundo_count' | 'legendary_count' | 'rare_backgrounds' | 'rare_costumes' | 'created_at'
> {
  account_images: { public_url: string; is_primary: boolean; sort_order: number }[];
}

export function primaryImage(item: {
  account_images?: { public_url: string; is_primary: boolean; sort_order: number }[];
}): string | null {
  const imgs = item.account_images || [];
  if (!imgs.length) return null;
  const primary = imgs.find((i) => i.is_primary);
  if (primary) return primary.public_url;
  return [...imgs].sort((a, b) => a.sort_order - b.sort_order)[0].public_url;
}

export interface AccountFilters {
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  minLevel?: number;
  minShiny?: number;
  minShundo?: number;
  minHundo?: number;
  minLegendary?: number;
  hasRareBackground?: boolean;
  hasRareCostume?: boolean;
  status?: string;
  sort?: string;
  featured?: boolean;
}

export async function getPublicAccounts(
  filters: AccountFilters = {}
): Promise<ListItem[]> {
  if (!SUPABASE_CONFIGURED) return [];
  const supabase = createClient();
  let query = supabase.from('accounts').select(LIST_SELECT).eq('published', true);

  if (filters.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  } else if (!filters.status) {
    query = query.neq('status', 'sold');
  }
  if (filters.featured) query = query.eq('featured', true);
  if (filters.q) {
    const q = filters.q.replace(/[%,]/g, ' ').trim();
    query = query.or(
      `title.ilike.%${q}%,account_id.ilike.%${q}%,description.ilike.%${q}%`
    );
  }
  if (typeof filters.minPrice === 'number') query = query.gte('price', filters.minPrice);
  if (typeof filters.maxPrice === 'number') query = query.lte('price', filters.maxPrice);
  if (typeof filters.minLevel === 'number') query = query.gte('level', filters.minLevel);
  if (typeof filters.minShiny === 'number') query = query.gte('shiny_count', filters.minShiny);
  if (typeof filters.minShundo === 'number') query = query.gte('shundo_count', filters.minShundo);
  if (typeof filters.minHundo === 'number') query = query.gte('hundo_count', filters.minHundo);
  if (typeof filters.minLegendary === 'number')
    query = query.gte('legendary_count', filters.minLegendary);
  if (filters.hasRareBackground) query = query.not('rare_backgrounds', 'is', null);
  if (filters.hasRareCostume) query = query.not('rare_costumes', 'is', null);

  switch (filters.sort) {
    case 'oldest':
      query = query.order('created_at', { ascending: true });
      break;
    case 'price_asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price_desc':
      query = query.order('price', { ascending: false });
      break;
    case 'shiny_desc':
      query = query.order('shiny_count', { ascending: false });
      break;
    case 'shundo_desc':
      query = query.order('shundo_count', { ascending: false });
      break;
    default:
      query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query.limit(200);
  if (error) {
    console.error('getPublicAccounts', error.message);
    return [];
  }
  return (data as unknown as ListItem[]) || [];
}

export async function getFeaturedAccounts(limit = 6): Promise<ListItem[]> {
  const items = await getPublicAccounts({ featured: true, sort: 'newest' });
  return items.slice(0, limit);
}

export async function getLatestAccounts(limit = 8): Promise<ListItem[]> {
  const items = await getPublicAccounts({ sort: 'newest' });
  return items.slice(0, limit);
}

export async function getPremiumAccounts(limit = 4): Promise<ListItem[]> {
  const items = await getPublicAccounts({ sort: 'price_desc' });
  return items.slice(0, limit);
}

export async function getRecentlySold(limit = 4): Promise<ListItem[]> {
  const items = await getPublicAccounts({ status: 'sold', sort: 'newest' });
  return items.slice(0, limit);
}

export async function getSoldAccounts(): Promise<ListItem[]> {
  return getPublicAccounts({ status: 'sold', sort: 'newest' });
}

export async function getAccountBySlug(
  slug: string
): Promise<AccountWithImages | null> {
  if (!SUPABASE_CONFIGURED) return null;
  const supabase = createClient();
  const { data, error } = await supabase
    .from('accounts')
    .select('*, account_images(*)')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();
  if (error) {
    console.error('getAccountBySlug', error.message);
    return null;
  }
  if (!data) return null;
  const acc = data as unknown as AccountWithImages;
  acc.account_images = (acc.account_images || []).sort(
    (a, b) => a.sort_order - b.sort_order
  );
  return acc;
}

export async function getAllPublishedSlugs(): Promise<
  { slug: string; updated_at: string }[]
> {
  if (!SUPABASE_CONFIGURED) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from('accounts')
    .select('slug,updated_at')
    .eq('published', true);
  return (data as { slug: string; updated_at: string }[]) || [];
}

export async function getPublishedReviews(): Promise<Review[]> {
  if (!SUPABASE_CONFIGURED) return [];
  const supabase = createClient();
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('published', true)
    .order('review_date', { ascending: false });
  if (error) {
    console.error('getPublishedReviews', error.message);
    return [];
  }
  return (data as Review[]) || [];
}
