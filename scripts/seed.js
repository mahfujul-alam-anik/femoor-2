const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI missing');

  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@gmail.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || '123456';

  await mongoose.connect(uri, { dbName: 'admin_panel' });

  const AdminUser = mongoose.model('AdminUser', new mongoose.Schema({ email: String, passwordHash: String }, { timestamps: true }));
  const Product = mongoose.model('Product', new mongoose.Schema({ name: String, price: Number, details: String, imageUrl: String }, { timestamps: true }));

  const hash = await bcrypt.hash(adminPassword, 10);
  await AdminUser.updateOne({ email: adminEmail.toLowerCase() }, { email: adminEmail.toLowerCase(), passwordHash: hash }, { upsert: true });

  if (await Product.countDocuments() === 0) {
    await Product.insertMany([
      { name: 'Premium T-Shirt', price: 750, details: 'Soft cotton t-shirt', imageUrl: '' },
      { name: 'Denim Jeans', price: 1450, details: 'Regular fit', imageUrl: '' }
    ]);
  }

  console.log(`Seed complete. Admin: ${adminEmail}`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
