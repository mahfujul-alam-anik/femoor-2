const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI missing');
  await mongoose.connect(uri, { dbName: 'admin_panel' });

  const AdminUser = mongoose.model('AdminUser', new mongoose.Schema({ email: String, passwordHash: String }, { timestamps: true }));
  const Product = mongoose.model('Product', new mongoose.Schema({ name: String, price: Number, details: String, imageUrl: String }, { timestamps: true }));

  const hash = await bcrypt.hash('12345', 10);
  await AdminUser.updateOne({ email: 'admin@gmail.com' }, { email: 'admin@gmail.com', passwordHash: hash }, { upsert: true });

  if (await Product.countDocuments() === 0) {
    await Product.insertMany([
      { name: 'Premium T-Shirt', price: 750, details: 'Soft cotton t-shirt', imageUrl: '' },
      { name: 'Denim Jeans', price: 1450, details: 'Regular fit', imageUrl: '' }
    ]);
  }

  console.log('Seed complete');
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
