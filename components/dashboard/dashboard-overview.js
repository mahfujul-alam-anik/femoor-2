'use client';

import { useState } from 'react';
import { useStats } from '@/hooks/use-stats';
import { SkeletonBlock, ErrorState } from '@/components/shared/states';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { StatusBadge } from '@/components/shared/status-badge';
import { Select } from '@/components/ui/select';

const ranges = {
  today: 0,
  week: 7,
  month: 30
};

export function DashboardOverview() {
  const [range, setRange] = useState('week');
  const from = new Date(Date.now() - ranges[range] * 24 * 60 * 60 * 1000).toISOString();
  const { data, isLoading, error, refetch } = useStats({ from, to: new Date().toISOString() });

  if (isLoading) return <SkeletonBlock className="h-96" />;
  if (error) return <ErrorState message={error.response?.data?.message} onRetry={refetch} />;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Select className="max-w-40" value={range} onChange={(e) => setRange(e.target.value)}>
          <option value="today">Today</option>
          <option value="week">Last 7 days</option>
          <option value="month">This month</option>
        </Select>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {[
          ['Revenue', `$${data.revenue}`],
          ['Total Orders', data.totalOrders],
          ['Delivered', data.delivered],
          ['Pending', data.pending]
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <p className="text-xs text-zinc-400">{label}</p>
            <p className="text-2xl font-semibold text-cyan-300">{value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <h3 className="mb-4 text-sm text-zinc-400">Revenue Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%"><LineChart data={data.chart}><XAxis dataKey="date" /><YAxis /><Tooltip /><Line type="monotone" dataKey="total" stroke="#22d3ee" strokeWidth={2} /></LineChart></ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <h3 className="mb-3 text-sm text-zinc-400">Recent Orders</h3>
        <div className="space-y-2">
          {data.recentOrders.map((order) => (
            <div key={order.orderId} className="flex items-center justify-between rounded-lg bg-zinc-800/50 p-3">
              <div>
                <p className="text-sm">{order.orderId}</p>
                <p className="text-xs text-zinc-400">{order.customerName}</p>
              </div>
              <StatusBadge status={order.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
