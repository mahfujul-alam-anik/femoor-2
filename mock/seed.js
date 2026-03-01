const districts = ['Dhaka', 'Chattogram', 'Khulna', 'Rajshahi', 'Sylhet'];
const productNames = ['Wireless Mouse', 'Mechanical Keyboard', '4K Monitor', 'USB-C Hub', 'Noise Cancelling Headphones'];

const today = new Date();

const mkDate = (delta) => {
  const d = new Date(today);
  d.setDate(d.getDate() - delta);
  return d.toISOString();
};

export const seedProducts = productNames.map((name, index) => ({
  id: `P-${index + 1}`,
  name,
  sku: `SKU-${1000 + index}`,
  price: 45 + index * 20,
  stock: 10 + index * 5,
  image: '',
  createdAt: mkDate(index + 2)
}));

export const seedOrders = Array.from({ length: 18 }, (_, i) => {
  const statuses = ['Pending', 'Processing', 'Delivered', 'Returned', 'Partial', 'Cancelled'];
  const status = statuses[i % statuses.length];
  const orderId = `ORD-202603${String((i % 28) + 1).padStart(2, '0')}-${String(1000 + i)}`;
  return {
    orderId,
    customerName: `Customer ${i + 1}`,
    phone: `01700${String(100000 + i).slice(1)}`,
    district: districts[i % districts.length],
    status,
    subtotal: 80 + i * 15,
    shippingFee: 5,
    total: 85 + i * 15,
    trackingId: i % 3 === 0 ? `TRK-${20000 + i}` : '',
    courierStatus: i % 3 === 0 ? 'In Transit' : 'Not Pushed',
    createdAt: mkDate(i),
    timeline: [
      {
        id: `${orderId}-event-1`,
        type: 'created',
        message: 'Order created in panel',
        createdAt: mkDate(i)
      }
    ]
  };
});
