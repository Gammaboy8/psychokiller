'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Logo } from '@/components/Brand';

export function AdminNav({ email }: { email?: string }) {
  const router = useRouter();
  const signOut = async () => {
    await createClient().auth.signOut();
    router.push('/login');
    router.refresh();
  };
  return (
    <div className="border-b border-ink-700/60 bg-ink-900">
      <div className="container-px flex h-14 items-center justify-between">
        <div className="flex items-center gap-4">
          <Logo />
          <span className="hidden text-xs uppercase tracking-widest text-crimson-400 sm:inline">
            Admin
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-sm text-gray-300 hover:text-white">Dashboard</Link>
          <Link href="/admin/accounts/new" className="btn-primary btn-sm">+ Add Account</Link>
          <Link href="/admin/reviews" className="text-sm text-gray-300 hover:text-white">Reviews</Link>
          {email && <span className="hidden text-xs text-muted md:inline">{email}</span>}
          <button onClick={signOut} className="btn-ghost btn-sm">Sign out</button>
        </div>
      </div>
    </div>
  );
}
