import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function SkeletonBlock({ className = 'h-20' }) {
  return <div className={`animate-pulse rounded-xl bg-zinc-800 ${className}`} />;
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-xl border border-red-800 bg-red-950/30 p-5 text-red-200">
      <p className="mb-3 text-sm">{message || 'Something went wrong.'}</p>
      {onRetry && <Button onClick={onRetry}>Retry</Button>}
    </div>
  );
}

export function EmptyState({ title, ctaHref, ctaLabel }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center">
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      {ctaHref && (
        <Link href={ctaHref}>
          <Button>{ctaLabel}</Button>
        </Link>
      )}
    </div>
  );
}
