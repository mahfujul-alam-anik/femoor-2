import mongoose, { Schema } from 'mongoose';

const AdminUserSchema = new Schema(
  {
    email: { type: String, unique: true, required: true },
    passwordHash: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.models.AdminUser || mongoose.model('AdminUser', AdminUserSchema);
