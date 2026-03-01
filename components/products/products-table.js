'use client';

import { useMemo, useState } from 'react';
import { useReactTable, getCoreRowModel, flexRender, getSortedRowModel } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState, ErrorState, SkeletonBlock } from '@/components/shared/states';
import { useProducts } from '@/hooks/use-products';
import { toast } from 'sonner';

export function ProductsTable() {
  const [q, setQ] = useState('');
  const [sorting, setSorting] = useState([]);
  const { data, isLoading, error, remove, refetch } = useProducts({ q, sortBy: sorting[0]?.id, sortDir: sorting[0]?.desc ? 'desc' : 'asc' });

  const columns = useMemo(() => [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'sku', header: 'SKU' },
    { accessorKey: 'price', header: 'Price', cell: ({ row }) => `$${row.original.price}` },
    { accessorKey: 'stock', header: 'Stock' },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Button
          variant="danger"
          onClick={async () => {
            if (!window.confirm('Delete this product?')) return;
            await remove(row.original.id);
            toast.success('Product deleted');
          }}
        >
          Delete
        </Button>
      )
    }
  ], [remove]);

  const table = useReactTable({ data, columns, state: { sorting }, onSortingChange: setSorting, getCoreRowModel: getCoreRowModel(), getSortedRowModel: getSortedRowModel() });

  if (isLoading) return <SkeletonBlock className="h-80" />;
  if (error) return <ErrorState message={error.response?.data?.message} onRetry={refetch} />;
  if (!data.length) return <EmptyState title="No products yet" ctaHref="/products/new" ctaLabel="Add Product" />;

  return (
    <div className="space-y-3">
      <Input placeholder="Search products..." value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="overflow-auto rounded-xl border border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-900">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-3 py-2" onClick={header.column.getToggleSortingHandler()}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t border-zinc-800">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-3 py-2">{flexRender(cell.column.columnDef.cell ?? cell.column.columnDef.header, cell.getContext())}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
