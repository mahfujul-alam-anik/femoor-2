'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.get('email'), password: form.get('password') })
    });

    if (!res.ok) {
      toast.error('Invalid credentials');
      setLoading(false);
      return;
    }
    toast.success('Logged in');
    router.push('/admin/dashboard');
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100">
      <form onSubmit={onSubmit} className="card w-full max-w-sm space-y-4 p-6">
        <h1 className="text-2xl font-semibold">Admin Login</h1>
        <input name="email" placeholder="Email" defaultValue="admin@gmail.com" required />
        <input name="password" placeholder="Password" type="password" defaultValue="12345" required />
        <button className="w-full rounded-md bg-zinc-900 px-3 py-2 text-white" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
