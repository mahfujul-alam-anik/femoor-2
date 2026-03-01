'use client';

import { useState } from 'react';
import { useOrder } from '@/hooks/use-orders';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/shared/status-badge';
import { ErrorState, SkeletonBlock } from '@/components/shared/states';
import { toast } from 'sonner';

export default function OrderDetailsPage({ params }) {
  const { orderId } = params;
  const { data, isLoading, error, refetch, pushToSteadfast, syncStatus, update } = useOrder(orderId);
  const [reason, setReason] = useState('');

  if (isLoading) return <SkeletonBlock className="h-80" />;
  if (error) return <ErrorState message={error.response?.data?.message} onRetry={refetch} />;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
        <div className="mb-3 flex items-center justify-between"><h1 className="text-2xl font-semibold">{data.orderId}</h1><StatusBadge status={data.status} /></div>
        <p className="text-sm text-zinc-300">{data.customerName} • {data.phone} • {data.district}</p>
        <p className="text-sm text-zinc-400">Tracking: {data.trackingId || 'N/A'} ({data.courierStatus})</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={async () => { await pushToSteadfast(); toast.success('Pushed to Steadfast'); }}>Push to Steadfast</Button>
          <Button variant="outline" onClick={async () => { await syncStatus(); toast.success('Status synced'); }}>Sync Status</Button>
        </div>
      </div>
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
        <h2 className="mb-3 font-semibold">Manual Override</h2>
        <div className="flex gap-2"><Input placeholder="Reason" value={reason} onChange={(e) => setReason(e.target.value)} /><Button variant="outline" onClick={async () => { await update({ status: 'Processing', reason }); toast.success('Order manually updated'); }}>Apply</Button></div>
      </div>
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
        <h2 className="mb-3 font-semibold">Timeline</h2>
        <div className="space-y-2">{data.timeline.map((event) => <div key={event.id} className="rounded-lg bg-zinc-800/50 p-3 text-sm"><p>{event.message}</p><p className="text-xs text-zinc-400">{new Date(event.createdAt).toLocaleString()}</p></div>)}</div>
      </div>
    </div>
  );
}
