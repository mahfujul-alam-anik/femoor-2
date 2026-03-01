import { SignJWT, jwtVerify } from 'jose';
import { env } from '@/lib/utils/env';

const key = new TextEncoder().encode(env.JWT_SECRET);

export async function signAdminToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key);
}

export async function verifyAdminToken(token) {
  const { payload } = await jwtVerify(token, key);
  return payload;
}
