import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/mongoose';
import Order from '@/lib/models/Order';
import OrderEvent from '@/lib/models/OrderEvent';
import { createSteadfastParcel } from '@/lib/services/steadfast';

export async function POST(_, { params }) {
  await dbConnect();
  const order = await Order.findById(params.id);
  if (!order) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  if (order.steadfast?.pushed) return NextResponse.json(order);

  try {
    const result = await createSteadfastParcel(order);
    order.steadfast = {
      pushed: true,
      trackingId: result?.tracking_code || result?.trackingId,
      courierStatusRaw: result?.status || 'pending',
      payloadSnapshot: result,
      lastSyncedAt: new Date()
    };
    order.status = 'Processing';
    await order.save();
    await OrderEvent.create({ order: order._id, type: 'PUSHED_TO_STEADFAST', message: 'Manually pushed to Steadfast', payload: result });
    return NextResponse.json(order);
  } catch (error) {
    await OrderEvent.create({ order: order._id, type: 'ERROR', message: error.message, payload: { during: 'manual push' } });
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
