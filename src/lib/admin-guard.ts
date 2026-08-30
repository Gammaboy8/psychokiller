import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { SUPABASE_CONFIGURED } from '@/lib/env';

/**
 * Server-side guard. Ensures the request has an authenticated user who is
 * present in public.admins. Redirects to /login otherwise.
 * Returns the verified user.
 */
export async function requireAdmin() {
  if (!SUPABASE_CONFIGURED) redirect('/login');
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/admin');

  const { data: adminRow } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!adminRow) redirect('/login?next=/admin');
  return user;
}
