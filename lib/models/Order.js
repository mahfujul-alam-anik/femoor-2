import mongoose, { Schema } from 'mongoose';

export const ORDER_STATUSES = ['Pending', 'Processing', 'Delivered', 'Returned', 'Partial', 'Cancelled'];

const OrderSchema = new Schema(
  {
    orderId: { type: String, unique: true, index: true },
    orderDate: { type: Date, default: Date.now, index: true },
    customer: {
      fullName: String,
      phone: { type: String, required: true, index: true },
      altPhone: String,
      email: String,
      address: { type: String, required: true },
      district: { type: String, required: true },
      thana: { type: String, required: true }
    },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product' },
        productNameSnapshot: String,
        quantity: Number,
        exactPrice: Number,
        sellingPrice: Number
      }
    ],
    weightKg: { type: Number, default: 0.5 },
    exchange: { type: Boolean, default: false },
    note: { type: String, default: '' },
    totals: {
      itemsSubtotal: Number,
      deliveryCost: Number,
      totalPrice: Number
    },
    status: { type: String, enum: ORDER_STATUSES, default: 'Pending', index: true },
    steadfast: {
      pushed: { type: Boolean, default: false },
      trackingId: { type: String, index: true },
      lastSyncedAt: Date,
      courierStatusRaw: String,
      payloadSnapshot: Schema.Types.Mixed
    }
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
