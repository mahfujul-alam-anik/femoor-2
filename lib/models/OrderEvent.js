import mongoose, { Schema } from 'mongoose';

const OrderEventSchema = new Schema(
  {
    order: { type: Schema.Types.ObjectId, ref: 'Order', index: true },
    type: {
      type: String,
      enum: ['CREATED', 'PUSHED_TO_STEADFAST', 'STATUS_UPDATED', 'COURIER_UPDATE', 'MANUAL_OVERRIDE', 'ERROR'],
      required: true
    },
    message: String,
    payload: Schema.Types.Mixed
  },
  { timestamps: true }
);

OrderEventSchema.index({ order: 1, createdAt: -1 });

export default mongoose.models.OrderEvent || mongoose.model('OrderEvent', OrderEventSchema);
