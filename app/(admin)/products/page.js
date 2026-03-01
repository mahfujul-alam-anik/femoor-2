import Link from 'next/link';
import { ProductsTable } from '@/components/products/products-table';
import { Button } from '@/components/ui/button';

export default function ProductsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-semibold">Products</h1><Link href="/products/new"><Button>Add Product</Button></Link></div>
      <ProductsTable />
    </div>
  );
}
