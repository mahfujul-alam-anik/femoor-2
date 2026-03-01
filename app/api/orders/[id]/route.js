import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/mongoose';
import Order from '@/lib/models/Order';
import OrderEvent from '@/lib/models/OrderEvent';

export async function GET(_, { params }) {
  await dbConnect();
  const order = await Order.findById(params.id).lean();
  const events = await OrderEvent.find({ order: params.id }).sort({ createdAt: -1 }).lean();
  if (!order) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json({ order, events });
}

export async function PATCH(request, { params }) {
  await dbConnect();
  const body = await request.json();
  const order = await Order.findByIdAndUpdate(params.id, { status: body.status }, { new: true });
  await OrderEvent.create({ order: order._id, type: 'MANUAL_OVERRIDE', message: body.reason || 'Manual status update', payload: body });
  return NextResponse.json(order);
}
