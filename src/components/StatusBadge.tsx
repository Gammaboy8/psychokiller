import type { AccountStatus } from '@/lib/types';
import { STATUS_LABELS } from '@/lib/format';

export function StatusBadge({ status }: { status: AccountStatus }) {
  const cls =
    status === 'available'
      ? 'badge-available'
      : status === 'reserved'
        ? 'badge-reserved'
        : 'badge-sold';
  return (
    <span className={cls}>
      {status === 'available' && <span className="status-dot mr-0.5" />}
      {STATUS_LABELS[status]}
    </span>
  );
}
