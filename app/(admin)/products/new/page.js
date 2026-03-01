'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/hooks/use-products';
import { toast } from 'sonner';

const schema = z.object({
  name: z.string().min(2),
  sku: z.string().min(2),
  price: z.coerce.number().positive(),
  stock: z.coerce.number().int().nonnegative(),
  image: z.string().optional()
});

export default function NewProductPage() {
  const router = useRouter();
  const { create } = useProducts();
  const [preview, setPreview] = useState('');
  const form = useForm({ resolver: zodResolver(schema), defaultValues: { name: '', sku: '', price: 0, stock: 0, image: '' } });

  const onFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) return toast.error('Invalid image type');
    if (file.size > 1024 * 1024 * 2) return toast.error('Image exceeds 2MB');
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      setPreview(result);
      form.setValue('image', result);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = form.handleSubmit(async (values) => {
    await create(values);
    toast.success('Product created');
    router.push('/products');
  });

  const errors = useMemo(() => form.formState.errors, [form.formState.errors]);

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-2xl space-y-4 rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <h1 className="text-2xl font-semibold">Add Product</h1>
      <Input placeholder="Product Name" {...form.register('name')} />{errors.name && <p className="text-xs text-red-300">{errors.name.message}</p>}
      <Input placeholder="SKU" {...form.register('sku')} />
      <div className="grid grid-cols-2 gap-3"><Input type="number" placeholder="Price" {...form.register('price')} /><Input type="number" placeholder="Stock" {...form.register('stock')} /></div>
      <Input type="file" accept="image/*" onChange={onFile} />
      {preview && <img src={preview} alt="preview" className="h-28 w-28 rounded-lg object-cover" />}
      <Button type="submit">Create Product</Button>
    </form>
  );
}
