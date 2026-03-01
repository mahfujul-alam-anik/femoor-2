import { cn } from '@/components/ui/utils';

const styles = {
  Pending: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  Processing: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Delivered: 'bg-green-500/20 text-green-300 border-green-500/30',
  Returned: 'bg-red-500/20 text-red-300 border-red-500/30',
  Partial: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  Cancelled: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30'
};

export function StatusBadge({ status }) {
  return <span className={cn('rounded-full border px-2 py-1 text-xs', styles[status] || styles.Pending)}>{status}</span>;
}
