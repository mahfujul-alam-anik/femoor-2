import mongoose, { Schema } from 'mongoose';

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    details: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    sku: { type: String, default: '' },
    stock: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
