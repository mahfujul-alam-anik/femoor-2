'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { orderInputSchema } from '@/lib/validations/order';
import { toast } from 'sonner';

export default function AddOrderPage() {
  const [products, setProducts] = useState([]);
  const { register, handleSubmit, watch, setValue } = useForm({
    resolver: zodResolver(orderInputSchema),
    defaultValues: { status: 'Pending', quantity: 1, deliveryCost: 0, exchange: false, pushToSteadfast: false }
  });

  useEffect(() => {
    fetch('/api/products').then((r) => r.json()).then(setProducts);
  }, []);

  const quantity = Number(watch('item.quantity') || 0);
  const sellingPrice = Number(watch('item.sellingPrice') || 0);
  const deliveryCost = Number(watch('deliveryCost') || 0);
  const total = useMemo(() => quantity * sellingPrice + deliveryCost, [quantity, sellingPrice, deliveryCost]);

  async function onSubmit(values) {
    const res = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) });
    if (!res.ok) return toast.error('Could not create order');
    toast.success('Order created');
  }

  return (
    <form className="card grid gap-3 p-6" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-xl font-semibold">Create Order</h2>
      <h3 className="font-medium">Customer details</h3>
      <input placeholder="Full name" {...register('customer.fullName')} />
      <input placeholder="Phone" {...register('customer.phone')} />
      <input placeholder="Alternative phone" {...register('customer.altPhone')} />
      <input placeholder="Email" {...register('customer.email')} />
      <input placeholder="Address" {...register('customer.address')} />
      <input placeholder="District" {...register('customer.district')} />
      <input placeholder="Thana" {...register('customer.thana')} />

      <h3 className="font-medium">Order details</h3>
      <select {...register('item.productId')} onChange={(e) => {
        const p = products.find((x) => x._id === e.target.value);
        if (p) {
          setValue('item.sellingPrice', p.price);
          setValue('item.exactPrice', p.price);
        }
      }}>
        <option value="">Select product</option>
        {products.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
      </select>
      <input type="number" placeholder="Quantity" {...register('item.quantity')} />
      <input type="number" step="0.01" placeholder="Exact price" {...register('item.exactPrice')} />
      <input type="number" step="0.01" placeholder="Selling price" {...register('item.sellingPrice')} />
      <input type="number" step="0.01" placeholder="Delivery cost" {...register('deliveryCost')} />
      <input type="number" step="0.1" placeholder="Weight kg" {...register('weightKg')} />
      <textarea placeholder="Item description" {...register('itemDescription')} />
      <textarea placeholder="Internal note" {...register('note')} />
      <label className="flex items-center gap-2"><input type="checkbox" {...register('exchange')} /> Exchange</label>
      <select {...register('status')}>
        {['Pending', 'Processing', 'Delivered', 'Returned', 'Partial', 'Cancelled'].map((s) => <option key={s}>{s}</option>)}
      </select>
      <label className="flex items-center gap-2"><input type="checkbox" {...register('pushToSteadfast')} /> Push to Steadfast</label>
      <p className="text-sm">Total Price: <strong>{total.toFixed(2)}</strong></p>
      <button className="rounded-md bg-zinc-900 px-3 py-2 text-white">Create Order</button>
    </form>
  );
}
