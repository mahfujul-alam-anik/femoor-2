'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

const schema = z.object({
  name: z.string().min(2),
  price: z.coerce.number().min(0),
  details: z.string().optional(),
  imageUrl: z.string().optional(),
  sku: z.string().optional(),
  stock: z.coerce.number().min(0).optional()
});

export default function AddProductPage() {
  const [preview, setPreview] = useState('');
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({ resolver: zodResolver(schema) });

  async function onSubmit(values) {
    const res = await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) });
    if (!res.ok) return toast.error('Failed to create product');
    toast.success('Product created');
    reset();
    setPreview('');
  }

  function onImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return toast.error('Please upload an image');
    if (file.size > 2 * 1024 * 1024) return toast.error('Image size should be below 2MB');

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
      setValue('imageUrl', String(reader.result));
    };
    reader.readAsDataURL(file);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4 p-6">
      <h2 className="text-xl font-semibold">Add Product</h2>
      <input placeholder="Name" {...register('name')} />
      {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      <input type="number" step="0.01" placeholder="Price" {...register('price')} />
      <textarea placeholder="Details" {...register('details')} />
      <div>
        <input type="file" accept="image/*" onChange={onImageChange} />
        {preview && <img src={preview} alt="Preview" className="mt-2 h-24 w-24 rounded object-cover" />}
      </div>
      <input placeholder="SKU" {...register('sku')} />
      <input type="number" placeholder="Stock" {...register('stock')} />
      <button className="rounded-md bg-zinc-900 px-3 py-2 text-white">Create Product</button>
    </form>
  );
}
