import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/mongoose';
import Order from '@/lib/models/Order';
import OrderEvent from '@/lib/models/OrderEvent';
import { mapCourierStatus } from '@/lib/services/status-map';

export async function POST(request) {
  await dbConnect();
  const body = await request.json();
  const trackingId = body?.tracking_code || body?.trackingId;
  const status = body?.status || body?.parcel_status;
  if (!trackingId) return NextResponse.json({ message: 'tracking missing' }, { status: 400 });

  const order = await Order.findOne({ 'steadfast.trackingId': trackingId });
  if (!order) return NextResponse.json({ ok: true });

  if (order.steadfast?.courierStatusRaw === status) return NextResponse.json({ ok: true, deduped: true });

  order.steadfast.courierStatusRaw = status;
  order.steadfast.lastSyncedAt = new Date();
  order.status = mapCourierStatus(status);
  await order.save();

  await OrderEvent.create({ order: order._id, type: 'COURIER_UPDATE', message: `Webhook update: ${status}`, payload: body });
  return NextResponse.json({ ok: true });
}
