'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useOrders } from '@/hooks/use-orders';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const schema = z.object({
  customerName: z.string().min(2),
  phone: z.string().min(8),
  district: z.string().min(2),
  subtotal: z.coerce.number().positive(),
  shippingFee: z.coerce.number().nonnegative(),
  status: z.string(),
  pushToSteadfast: z.boolean().optional()
});

const orderId = () => {
  const d = new Date();
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  return `ORD-${stamp}-${String(Math.floor(Math.random() * 9000 + 1000))}`;
};

export default function NewOrderPage() {
  const router = useRouter();
  const { create, pushToSteadfast } = useOrders();
  const form = useForm({ resolver: zodResolver(schema), defaultValues: { status: 'Pending', shippingFee: 5, pushToSteadfast: true } });
  const subtotal = form.watch('subtotal') || 0;
  const shipping = form.watch('shippingFee') || 0;

  const onSubmit = form.handleSubmit(async (values) => {
    const newOrderId = orderId();
    const payload = { ...values, orderId: newOrderId, total: Number(subtotal) + Number(shipping), courierStatus: 'Not Pushed', trackingId: '', timeline: [{ id: `EV-${Date.now()}`, type: 'created', message: 'Order created in panel', createdAt: new Date().toISOString() }] };
    await create(payload);
    if (values.pushToSteadfast) await pushToSteadfast(newOrderId);
    toast.success('Order created');
    router.push('/orders');
  });

  const total = useMemo(() => Number(subtotal) + Number(shipping), [subtotal, shipping]);

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-2xl space-y-4 rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <h1 className="text-2xl font-semibold">Create Order</h1>
      <Input placeholder="Customer Name" {...form.register('customerName')} />
      <Input placeholder="Phone" {...form.register('phone')} />
      <Input placeholder="District" {...form.register('district')} />
      <div className="grid grid-cols-2 gap-3"><Input type="number" placeholder="Subtotal" {...form.register('subtotal')} /><Input type="number" placeholder="Shipping Fee" {...form.register('shippingFee')} /></div>
      <Select {...form.register('status')}>{['Pending', 'Processing', 'Delivered', 'Returned', 'Partial', 'Cancelled'].map((s) => <option key={s}>{s}</option>)}</Select>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register('pushToSteadfast')} />Push to Steadfast</label>
      <p className="text-sm text-cyan-300">Live total: ${total}</p>
      <Button type="submit">Save Order</Button>
    </form>
  );
}
