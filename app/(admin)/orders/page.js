import Link from 'next/link';
import { OrdersTable } from '@/components/orders/orders-table';
import { Button } from '@/components/ui/button';

export default function OrdersPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-semibold">Orders</h1><Link href="/orders/new"><Button>Create Order</Button></Link></div>
      <OrdersTable />
    </div>
  );
}
