import { NextResponse } from 'next/server';
import { env } from '@/lib/utils/env';
import { dbConnect } from '@/lib/db/mongoose';
import Order from '@/lib/models/Order';
import { trackSteadfastParcel } from '@/lib/services/steadfast';
import { mapCourierStatus } from '@/lib/services/status-map';
import OrderEvent from '@/lib/models/OrderEvent';

export async function GET(request) {
  const token = request.headers.get('x-cron-secret');
  if (token !== env.CRON_SECRET) return NextResponse.json({ message: 'unauthorized' }, { status: 401 });

  await dbConnect();
  const orders = await Order.find({ status: { $in: ['Pending', 'Processing'] }, 'steadfast.pushed': true }).limit(30);

  for (const order of orders) {
    try {
      const result = await trackSteadfastParcel(order.steadfast.trackingId);
      const raw = result?.status || result?.parcel_status;
      if (raw && order.steadfast.courierStatusRaw !== raw) {
        order.steadfast.courierStatusRaw = raw;
        order.status = mapCourierStatus(raw);
        order.steadfast.lastSyncedAt = new Date();
        await order.save();
        await OrderEvent.create({ order: order._id, type: 'STATUS_UPDATED', message: `Cron sync: ${raw}`, payload: result });
      }
    } catch {}
  }

  return NextResponse.json({ synced: orders.length });
}
