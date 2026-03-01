'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel, flexRender } from '@tanstack/react-table';

export default function OrderListPage() {
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');

  useEffect(() => { fetch('/api/orders').then((r) => r.json()).then(setData); }, []);

  const columns = useMemo(() => [
    { accessorKey: 'orderId', header: 'Order ID' },
    { accessorKey: 'orderDate', header: 'Date', cell: ({ row }) => new Date(row.original.orderDate).toLocaleDateString() },
    { accessorKey: 'customer.fullName', header: 'Customer' },
    { accessorKey: 'customer.phone', header: 'Phone' },
    { id: 'district', header: 'District/Thana', cell: ({ row }) => `${row.original.customer?.district}/${row.original.customer?.thana}` },
    { accessorKey: 'totals.totalPrice', header: 'Total' },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'steadfast.trackingId', header: 'Tracking' },
    { id: 'actions', header: 'Actions', cell: ({ row }) => <Link href={`/admin/orders/${row.original._id}`} className="text-blue-600">View</Link> }
  ], []);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  return (
    <div className="card p-4">
      <h2 className="mb-3 text-xl font-semibold">Orders</h2>
      <input placeholder="Search orderId, name, phone, tracking..." value={globalFilter ?? ''} onChange={(e) => setGlobalFilter(e.target.value)} className="mb-3 w-full" />
      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead>{table.getHeaderGroups().map((hg) => <tr key={hg.id}>{hg.headers.map((h) => <th key={h.id} onClick={h.column.getToggleSortingHandler()} className="cursor-pointer text-left">{flexRender(h.column.columnDef.header, h.getContext())}</th>)}</tr>)}</thead>
          <tbody>{table.getRowModel().rows.map((row) => <tr key={row.id} className="border-t">{row.getVisibleCells().map((cell) => <td key={cell.id}>{flexRender(cell.column.columnDef.cell ?? cell.column.columnDef.accessorKey, cell.getContext())}</td>)}</tr>)}</tbody>
        </table>
      </div>
      <div className="mt-3 flex gap-2">
        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Prev</button>
        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</button>
      </div>
    </div>
  );
}
