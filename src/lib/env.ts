export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'http://localhost:3000';

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const DISCORD_URL = process.env.NEXT_PUBLIC_DISCORD_URL || '';
export const TELEGRAM_URL = process.env.NEXT_PUBLIC_TELEGRAM_URL || '';
export const TWITTER_URL = process.env.NEXT_PUBLIC_TWITTER_URL || '';
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || '';

export const SUPABASE_CONFIGURED = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
