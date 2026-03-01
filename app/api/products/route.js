import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/mongoose';
import Product from '@/lib/models/Product';

export async function GET() {
  await dbConnect();
  const products = await Product.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(products);
}

export async function POST(request) {
  await dbConnect();
  const body = await request.json();
  const created = await Product.create(body);
  return NextResponse.json(created, { status: 201 });
}
