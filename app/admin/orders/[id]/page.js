'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function OrderDetails({ params }) {
  const [data, setData] = useState(null);
  const [reason, setReason] = useState('');

  async function load() {
    const res = await fetch(`/api/orders/${params.id}`);
    setData(await res.json());
  }

  useEffect(() => { load(); }, [params.id]);

  if (!data) return <div className="card p-6">Loading...</div>;
  const { order, events } = data;

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h2 className="text-xl font-semibold">{order.orderId}</h2>
        <p>{order.customer.fullName} • {order.customer.phone}</p>
        <p>{order.customer.address}, {order.customer.thana}, {order.customer.district}</p>
        <p>Status: <span className="rounded bg-zinc-900 px-2 py-1 text-xs text-white">{order.status}</span></p>
        <p>Tracking: {order.steadfast?.trackingId || 'Not pushed'}</p>
        <p>Total: {order.totals?.totalPrice}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          {!order.steadfast?.pushed && <button onClick={async () => {
            const res = await fetch(`/api/orders/${order._id}/push`, { method: 'POST' });
            if (!res.ok) return toast.error('Push failed');
            toast.success('Pushed');
            load();
          }} className="rounded bg-zinc-900 px-3 py-2 text-white">Push to Steadfast</button>}
          <button onClick={async () => {
            const res = await fetch(`/api/orders/${order._id}/sync`, { method: 'POST' });
            if (!res.ok) return toast.error('Sync failed');
            toast.success('Synced');
            load();
          }} className="rounded border px-3 py-2">Sync status now</button>
          <select defaultValue={order.status} onChange={async (e) => {
            await fetch(`/api/orders/${order._id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: e.target.value, reason }) });
            toast.success('Updated');
            load();
          }}>
            {['Pending', 'Processing', 'Delivered', 'Returned', 'Partial', 'Cancelled'].map((s) => <option key={s}>{s}</option>)}
          </select>
          <input placeholder="Override reason" value={reason} onChange={(e) => setReason(e.target.value)} />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="mb-2 font-semibold">Event timeline</h3>
        <ul className="space-y-2 text-sm">
          {events.map((e) => <li key={e._id} className="border-b pb-2"><strong>{e.type}</strong> — {e.message} <span className="text-zinc-500">({new Date(e.createdAt).toLocaleString()})</span></li>)}
        </ul>
      </div>
    </div>
  );
}
