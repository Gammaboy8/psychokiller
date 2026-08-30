'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const key = `pk_viewed_${slug}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');
    const supabase = createClient();
    supabase.rpc('increment_view', { p_slug: slug }).then(() => {});
  }, [slug]);
  return null;
}
