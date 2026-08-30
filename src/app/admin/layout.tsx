import { requireAdmin } from '@/lib/admin-guard';
import { AdminNav } from '@/components/admin/AdminNav';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();
  return (
    <div className="min-h-screen">
      <AdminNav email={user.email ?? undefined} />
      <div className="container-px py-8">{children}</div>
    </div>
  );
}
