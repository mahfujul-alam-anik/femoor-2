'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const colors = ['#18181b', '#52525b', '#71717a', '#a1a1aa', '#d4d4d8', '#3f3f46'];

export default function DashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/stats').then((r) => r.json()).then(setData);
  }, []);

  if (!data) return <div className="card p-6">Loading dashboard...</div>;

  const statusMap = Object.fromEntries(data.statusCounts.map((s) => [s._id, s.count]));

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Business Overview</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Total Orders" value={data.totals.orderCount || 0} />
        <Card title="Delivered" value={statusMap.Delivered || 0} />
        <Card title="Returned" value={statusMap.Returned || 0} />
        <Card title="Partial" value={statusMap.Partial || 0} />
        <Card title="Pending + Processing" value={(statusMap.Pending || 0) + (statusMap.Processing || 0)} />
        <Card title="Total Products" value={data.totalProducts || 0} />
        <Card title="Sales Amount" value={data.totals.salesAmount || 0} />
        <Card title="Cancel Amount" value={data.totals.cancelAmount || 0} />
        <Card title="Delivery Cost Total" value={data.totals.deliveryCostTotal || 0} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card h-72 p-4">
          <h3 className="mb-3 font-medium">Orders over time</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.dailyOrders}>
              <Line type="monotone" dataKey="orders" stroke="#18181b" />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card h-72 p-4">
          <h3 className="mb-3 font-medium">Status distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data.statusCounts} dataKey="count" nameKey="_id" outerRadius={90}>
                {data.statusCounts.map((_, i) => (
                  <Cell key={i} fill={colors[i % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="mb-3 font-medium">Recent Orders</h3>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-zinc-500">
                <th>Order</th><th>Customer</th><th>Phone</th><th>Status</th><th>Total</th>
              </tr>
            </thead>
            <tbody>
              {data.recentOrders.map((o) => (
                <tr key={o._id} className="border-t">
                  <td>{o.orderId}</td><td>{o.customer?.fullName}</td><td>{o.customer?.phone}</td><td>{o.status}</td><td>{o.totals?.totalPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="card p-4">
      <p className="text-sm text-zinc-500">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}
