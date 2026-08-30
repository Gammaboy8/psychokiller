export type AccountStatus = 'available' | 'reserved' | 'sold';

export interface AccountImage {
  id: string;
  account_id: string;
  storage_path: string;
  public_url: string;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface Account {
  id: string;
  account_id: string;
  title: string;
  slug: string;
  price: number;
  currency: string;
  status: AccountStatus;
  published: boolean;
  featured: boolean;
  tags: string[];

  level: number | null;
  xp: number | null;
  stardust: number | null;
  pokemon_storage: number | null;
  item_storage: number | null;
  shiny_count: number;
  shundo_count: number;
  hundo_count: number;
  legendary_count: number;
  mythical_count: number;

  rare_pokemon: string | null;
  rare_backgrounds: string | null;
  rare_costumes: string | null;
  special_features: string | null;
  account_age: string | null;

  description: string | null;

  playerauctions_url: string | null;
  eldorado_url: string | null;
  g2g_url: string | null;
  epicnpc_url: string | null;
  other_marketplace_url: string | null;

  views: number;
  last_viewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AccountWithImages extends Account {
  account_images: AccountImage[];
}

export interface Review {
  id: string;
  display_name: string;
  platform: string | null;
  rating: number | null;
  body: string;
  order_ref: string | null;
  screenshot_url: string | null;
  published: boolean;
  review_date: string;
  created_at: string;
}

export const MARKETPLACES = [
  { key: 'playerauctions_url', label: 'PlayerAuctions' },
  { key: 'eldorado_url', label: 'Eldorado' },
  { key: 'g2g_url', label: 'G2G' },
  { key: 'epicnpc_url', label: 'EpicNPC' },
  { key: 'other_marketplace_url', label: 'Other Marketplace' },
] as const;
