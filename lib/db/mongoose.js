import mongoose from 'mongoose';
import { env } from '@/lib/utils/env';

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

export async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(env.MONGODB_URI, { dbName: 'admin_panel' }).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
