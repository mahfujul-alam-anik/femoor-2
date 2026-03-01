import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/mongoose';
import Product from '@/lib/models/Product';

export async function DELETE(_, { params }) {
  await dbConnect();
  await Product.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}
