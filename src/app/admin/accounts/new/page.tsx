export const runtime = 'edge';

import { AccountForm } from '@/components/admin/AccountForm';

export const dynamic = 'force-dynamic';

export default function NewAccountPage() {
  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold uppercase tracking-wide text-white">
        Add Account
      </h1>
      <AccountForm />
    </div>
  );
}
