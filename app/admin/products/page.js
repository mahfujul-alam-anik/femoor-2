'use client';

import { useEffect, useMemo, useState } from 'react';
import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, flexRender } from '@tanstack/react-table';
import { toast } from 'sonner';

export default function ProductListPage() {
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);

  async function load() {
    const res = await fetch('/api/products');
    setData(await res.json());
  }

  useEffect(() => { load(); }, []);

  const columns = useMemo(() => [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'price', header: 'Price' },
    { accessorKey: 'createdAt', header: 'Created', cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString() },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => <button className="text-red-600" onClick={async () => {
        await fetch(`/api/products/${row.original._id}`, { method: 'DELETE' });
        toast.success('Deleted');
        load();
      }}>Delete</button>
    }
  ], []);

  const table = useReactTable({ data, columns, state: { sorting }, onSortingChange: setSorting, getCoreRowModel: getCoreRowModel(), getSortedRowModel: getSortedRowModel(), getPaginationRowModel: getPaginationRowModel() });

  return (
    <div className="card p-4">
      <h2 className="mb-3 text-xl font-semibold">Products</h2>
      <table className="w-full text-sm">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>{hg.headers.map((h) => <th key={h.id} className="cursor-pointer text-left" onClick={h.column.getToggleSortingHandler()}>{flexRender(h.column.columnDef.header, h.getContext())}</th>)}</tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-t">{row.getVisibleCells().map((c) => <td key={c.id}>{flexRender(c.column.columnDef.cell ?? c.column.columnDef.accessorKey, c.getContext())}</td>)}</tr>
          ))}
        </tbody>
      </table>
      <div className="mt-3 flex gap-2">
        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Prev</button>
        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</button>
      </div>
    </div>
  );
}
