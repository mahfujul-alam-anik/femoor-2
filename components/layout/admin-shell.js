'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/components/ui/utils';

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/products', label: 'Products' },
  { href: '/orders', label: 'Orders' }
];

export function AdminShell({ children }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex max-w-7xl">
        <aside className={cn('fixed inset-y-0 left-0 z-40 w-64 border-r border-zinc-800 bg-zinc-950 p-4 transition md:static md:translate-x-0', open ? 'translate-x-0' : '-translate-x-full')}>
          <h2 className="mb-6 text-xl font-semibold text-cyan-300">Femoor Admin</h2>
          <nav className="space-y-2">
            {links.map((link) => (
              <Link key={link.href} onClick={() => setOpen(false)} href={link.href} className={cn('block rounded-xl px-3 py-2 text-sm', pathname.startsWith(link.href) ? 'bg-cyan-500/20 text-cyan-300' : 'text-zinc-300 hover:bg-zinc-900')}>
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="w-full md:ml-0">
          <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-zinc-800 bg-zinc-900/60 p-4 backdrop-blur">
            <button className="rounded-lg border border-zinc-700 p-2 md:hidden" onClick={() => setOpen((v) => !v)}><Menu size={16} /></button>
            <div>
              <p className="text-sm text-zinc-400">Admin Panel</p>
            </div>
          </header>
          <section className="p-4 md:p-6">{children}</section>
        </main>
      </div>
    </div>
  );
}
