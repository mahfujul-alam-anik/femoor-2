import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/mongoose';
import Order from '@/lib/models/Order';
import Product from '@/lib/models/Product';

export async function GET() {
  await dbConnect();
  const [statusCounts, products, totalsAgg, recentOrders, dailyOrders] = await Promise.all([
    Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Product.countDocuments(),
    Order.aggregate([
      {
        $group: {
          _id: null,
          orderCount: { $sum: 1 },
          deliveryCostTotal: { $sum: '$totals.deliveryCost' },
          salesAmount: {
            $sum: {
              $cond: [{ $in: ['$status', ['Delivered', 'Partial']] }, '$totals.totalPrice', 0]
            }
          },
          cancelAmount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Cancelled'] }, '$totals.totalPrice', 0]
            }
          },
          codTotal: { $sum: '$totals.totalPrice' }
        }
      }
    ]),
    Order.find().sort({ createdAt: -1 }).limit(10).lean(),
    Order.aggregate([
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$orderDate' } }, orders: { $sum: 1 }, revenue: { $sum: '$totals.totalPrice' } } },
      { $sort: { _id: 1 } },
      { $limit: 30 }
    ])
  ]);

  return NextResponse.json({
    statusCounts,
    totalProducts: products,
    totals: totalsAgg[0] || {},
    recentOrders,
    dailyOrders
  });
}
