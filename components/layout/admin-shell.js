'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const nav = [
  ['Dashboard', '/admin/dashboard'],
  ['Add Product', '/admin/products/new'],
  ['Products', '/admin/products'],
  ['Add Order', '/admin/orders/new'],
  ['Orders', '/admin/orders']
];

export function AdminShell({ children }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-zinc-100">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 p-4 md:grid-cols-[220px_1fr]">
        <aside className="card p-4">
          <h1 className="mb-4 text-xl font-semibold">Admin Panel</h1>
          <nav className="space-y-1">
            {nav.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className={`block rounded-md px-3 py-2 text-sm ${pathname === href ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-100'}`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
