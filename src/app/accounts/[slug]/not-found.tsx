import Link from 'next/link';
import { EmptyState } from '@/components/EmptyState';

export default function NotFound() {
  return (
    <div className="container-px py-20">
      <EmptyState
        title="Listing not found"
        hint="This account may have been removed or is not currently published."
      />
      <div className="mt-6 text-center">
        <Link href="/accounts" className="btn-primary">Back to Accounts</Link>
      </div>
    </div>
  );
}
