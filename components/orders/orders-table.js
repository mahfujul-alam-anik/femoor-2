'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useReactTable, flexRender, getCoreRowModel } from '@tanstack/react-table';
import { useOrders } from '@/hooks/use-orders';
import { StatusBadge } from '@/components/shared/status-badge';
import { SkeletonBlock, ErrorState, EmptyState } from '@/components/shared/states';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export function OrdersTable() {
  const [query, setQuery] = useState({ page: 1, pageSize: 8, q: '', status: '', district: '', sortBy: 'createdAt', sortDir: 'desc' });
  const [columnVisibility, setColumnVisibility] = useState({ trackingId: true });
  const { data, isLoading, error, refetch } = useOrders(query);

  const columns = useMemo(() => [
    { accessorKey: 'orderId', header: 'Order', cell: ({ row }) => <Link className="text-cyan-300" href={`/orders/${row.original.orderId}`}>{row.original.orderId}</Link> },
    { accessorKey: 'customerName', header: 'Customer' },
    { accessorKey: 'district', header: 'District' },
    { accessorKey: 'trackingId', header: 'Tracking' },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { accessorKey: 'total', header: 'Total', cell: ({ row }) => `$${row.original.total}` }
  ], []);

  const table = useReactTable({ data: data.data, columns, state: { columnVisibility }, onColumnVisibilityChange: setColumnVisibility, getCoreRowModel: getCoreRowModel() });

  if (isLoading) return <SkeletonBlock className="h-96" />;
  if (error) return <ErrorState message={error.response?.data?.message} onRetry={refetch} />;
  if (!data.data.length) return <EmptyState title="No orders found" ctaHref="/orders/new" ctaLabel="Create Order" />;

  return (
    <div className="space-y-3">
      <div className="grid gap-2 md:grid-cols-4">
        <Input placeholder="Search orderId, customer, phone, tracking" value={query.q} onChange={(e) => setQuery((s) => ({ ...s, q: e.target.value, page: 1 }))} />
        <Select value={query.status} onChange={(e) => setQuery((s) => ({ ...s, status: e.target.value, page: 1 }))}><option value="">All status</option>{['Pending', 'Processing', 'Delivered', 'Returned', 'Partial', 'Cancelled'].map((item) => <option key={item}>{item}</option>)}</Select>
        <Input placeholder="District" value={query.district} onChange={(e) => setQuery((s) => ({ ...s, district: e.target.value, page: 1 }))} />
        <Button variant="outline" onClick={() => setColumnVisibility((s) => ({ ...s, trackingId: !s.trackingId }))}>Toggle Tracking Column</Button>
      </div>
      <div className="overflow-auto rounded-xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead className="bg-zinc-900">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>{headerGroup.headers.map((header) => <th key={header.id} className="px-3 py-2">{flexRender(header.column.columnDef.header, header.getContext())}</th>)}</tr>
            ))}
          </thead>
          <tbody>{table.getRowModel().rows.map((row) => <tr className="border-t border-zinc-800" key={row.id}>{row.getVisibleCells().map((cell) => <td className="px-3 py-2" key={cell.id}>{flexRender(cell.column.columnDef.cell ?? cell.column.columnDef.header, cell.getContext())}</td>)}</tr>)}</tbody>
        </table>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs text-zinc-400">Page {data.meta.page} / {Math.ceil(data.meta.total / data.meta.pageSize) || 1}</p>
        <div className="space-x-2">
          <Button variant="outline" disabled={data.meta.page === 1} onClick={() => setQuery((s) => ({ ...s, page: s.page - 1 }))}>Previous</Button>
          <Button variant="outline" disabled={data.meta.page * data.meta.pageSize >= data.meta.total} onClick={() => setQuery((s) => ({ ...s, page: s.page + 1 }))}>Next</Button>
        </div>
      </div>
    </div>
  );
}
