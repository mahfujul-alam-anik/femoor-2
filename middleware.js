import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth/jwt';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin_token')?.value;
    if (!token) return NextResponse.redirect(new URL('/login', request.url));
    try {
      await verifyAdminToken(token);
    } catch {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
