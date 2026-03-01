import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/mongoose';
import Order from '@/lib/models/Order';
import OrderEvent from '@/lib/models/OrderEvent';
import Product from '@/lib/models/Product';
import { orderInputSchema } from '@/lib/validations/order';
import { generateOrderId } from '@/lib/utils/order-id';
import { createSteadfastParcel } from '@/lib/services/steadfast';

export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  const status = searchParams.get('status');
  const query = {};
  if (status) query.status = status;
  if (q) {
    query.$or = [
      { orderId: { $regex: q, $options: 'i' } },
      { 'customer.fullName': { $regex: q, $options: 'i' } },
      { 'customer.phone': { $regex: q, $options: 'i' } },
      { 'steadfast.trackingId': { $regex: q, $options: 'i' } }
    ];
  }
  const orders = await Order.find(query).sort({ createdAt: -1 }).limit(200).lean();
  return NextResponse.json(orders);
}

export async function POST(request) {
  await dbConnect();
  const parsed = orderInputSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json(parsed.error.flatten(), { status: 400 });
  const data = parsed.data;

  const product = await Product.findById(data.item.productId);
  if (!product) return NextResponse.json({ message: 'Product not found' }, { status: 404 });

  const itemsSubtotal = data.item.sellingPrice * data.item.quantity;
  const totalPrice = itemsSubtotal + data.deliveryCost;

  const order = await Order.create({
    orderId: generateOrderId(),
    orderDate: new Date(),
    customer: data.customer,
    items: [{
      productId: product._id,
      productNameSnapshot: product.name,
      quantity: data.item.quantity,
      exactPrice: data.item.exactPrice,
      sellingPrice: data.item.sellingPrice
    }],
    weightKg: data.weightKg,
    exchange: data.exchange,
    note: data.note || data.itemDescription || '',
    totals: { itemsSubtotal, deliveryCost: data.deliveryCost, totalPrice },
    status: data.pushToSteadfast ? 'Processing' : data.status,
    steadfast: { pushed: false }
  });

  await OrderEvent.create({ order: order._id, type: 'CREATED', message: 'Order created', payload: data });

  if (data.pushToSteadfast) {
    try {
      const response = await createSteadfastParcel(order);
      order.steadfast = {
        pushed: true,
        trackingId: response?.tracking_code || response?.trackingId || response?.consignment_id,
        courierStatusRaw: response?.status || 'pending',
        payloadSnapshot: response,
        lastSyncedAt: new Date()
      };
      await order.save();
      await OrderEvent.create({ order: order._id, type: 'PUSHED_TO_STEADFAST', message: 'Pushed to Steadfast', payload: response });
    } catch (error) {
      await OrderEvent.create({ order: order._id, type: 'ERROR', message: error.message, payload: { during: 'push' } });
    }
  }

  return NextResponse.json(order, { status: 201 });
}
