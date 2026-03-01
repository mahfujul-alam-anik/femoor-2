import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { dbConnect } from '@/lib/db/mongoose';
import AdminUser from '@/lib/models/AdminUser';
import { signAdminToken } from '@/lib/auth/jwt';

export async function POST(request) {
  await dbConnect();
  const body = await request.json();
  const user = await AdminUser.findOne({ email: body.email?.toLowerCase() });
  if (!user) return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });

  const ok = await bcrypt.compare(body.password || '', user.passwordHash);
  if (!ok) return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });

  const token = await signAdminToken({ sub: user._id.toString(), email: user.email });
  const response = NextResponse.json({ ok: true });
  response.cookies.set('admin_token', token, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 });
  return response;
}
