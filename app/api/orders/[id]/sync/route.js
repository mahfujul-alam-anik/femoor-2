import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/mongoose';
import Order from '@/lib/models/Order';
import OrderEvent from '@/lib/models/OrderEvent';
import { trackSteadfastParcel } from '@/lib/services/steadfast';
import { mapCourierStatus } from '@/lib/services/status-map';

export async function POST(_, { params }) {
  await dbConnect();
  const order = await Order.findById(params.id);
  if (!order?.steadfast?.trackingId) return NextResponse.json({ message: 'No tracking id' }, { status: 400 });

  const tracking = await trackSteadfastParcel(order.steadfast.trackingId);
  const raw = tracking?.status || tracking?.parcel_status || 'pending';
  const mapped = mapCourierStatus(raw);

  if (order.steadfast.courierStatusRaw !== raw) {
    order.status = mapped;
    order.steadfast.courierStatusRaw = raw;
    order.steadfast.lastSyncedAt = new Date();
    await order.save();
    await OrderEvent.create({ order: order._id, type: 'STATUS_UPDATED', message: `Synced status to ${mapped}`, payload: tracking });
  }

  return NextResponse.json(order);
}
