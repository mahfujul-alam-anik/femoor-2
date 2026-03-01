import { seedOrders, seedProducts } from '@/mock/seed';

const STORAGE_KEY = 'femoor-admin-db';

const clone = (value) => JSON.parse(JSON.stringify(value));

const wait = () => new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 600) + 300));

const parseQuery = (url, config = {}) => {
  const query = new URLSearchParams(url.split('?')[1] || '');
  Object.entries(config?.params || {}).forEach(([key, value]) => value != null && query.set(key, String(value)));
  return query;
};

const sortRows = (rows, sortBy, sortDir = 'desc') => {
  if (!sortBy) return rows;
  return [...rows].sort((a, b) => {
    const av = a[sortBy];
    const bv = b[sortBy];
    if (av === bv) return 0;
    if (sortDir === 'asc') return av > bv ? 1 : -1;
    return av < bv ? 1 : -1;
  });
};

const pageRows = (rows, page = 1, pageSize = 10) => {
  const p = Number(page);
  const s = Number(pageSize);
  const start = (p - 1) * s;
  return { data: rows.slice(start, start + s), meta: { page: p, pageSize: s, total: rows.length } };
};

const createError = (status, message) => {
  const error = new Error(message);
  error.response = { status, data: { message } };
  throw error;
};

const getInitialDb = () => {
  if (typeof window === 'undefined') return { products: clone(seedProducts), orders: clone(seedOrders) };
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) return { products: clone(seedProducts), orders: clone(seedOrders) };
  try {
    return JSON.parse(saved);
  } catch {
    return { products: clone(seedProducts), orders: clone(seedOrders) };
  }
};

export const createMockServer = () => {
  const db = getInitialDb();
  const persist = () => window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));

  const handlers = {
    async GET(url, config) {
      if (url.startsWith('/api/products')) {
        const query = parseQuery(url, config);
        const q = query.get('q')?.toLowerCase() || '';
        const sortBy = query.get('sortBy');
        const sortDir = query.get('sortDir') || 'desc';
        const rows = db.products.filter((product) => !q || `${product.name} ${product.sku}`.toLowerCase().includes(q));
        return { data: sortRows(rows, sortBy, sortDir), status: 200 };
      }
      if (url.startsWith('/api/orders/')) {
        const orderId = url.split('/')[3];
        const order = db.orders.find((item) => item.orderId === orderId);
        if (!order) createError(404, 'Order not found');
        return { data: { data: order }, status: 200 };
      }
      if (url.startsWith('/api/orders')) {
        const query = parseQuery(url, config);
        const q = query.get('q')?.toLowerCase() || '';
        const status = query.get('status') || '';
        const district = query.get('district') || '';
        const from = query.get('from');
        const to = query.get('to');
        const sortBy = query.get('sortBy') || 'createdAt';
        const sortDir = query.get('sortDir') || 'desc';
        let rows = db.orders.filter((order) => {
          const matchedSearch = !q || `${order.orderId} ${order.customerName} ${order.phone} ${order.trackingId}`.toLowerCase().includes(q);
          const matchedStatus = !status || order.status === status;
          const matchedDistrict = !district || order.district === district;
          const ts = new Date(order.createdAt).getTime();
          const matchedFrom = !from || ts >= new Date(from).getTime();
          const matchedTo = !to || ts <= new Date(to).getTime();
          return matchedSearch && matchedStatus && matchedDistrict && matchedFrom && matchedTo;
        });
        rows = sortRows(rows, sortBy, sortDir);
        return { data: pageRows(rows, query.get('page') || 1, query.get('pageSize') || 8), status: 200 };
      }
      if (url.startsWith('/api/stats')) {
        const query = parseQuery(url, config);
        const from = query.get('from');
        const to = query.get('to');
        const filtered = db.orders.filter((order) => {
          const ts = new Date(order.createdAt).getTime();
          const matchedFrom = !from || ts >= new Date(from).getTime();
          const matchedTo = !to || ts <= new Date(to).getTime();
          return matchedFrom && matchedTo;
        });
        const revenue = filtered.reduce((sum, order) => sum + order.total, 0);
        const delivered = filtered.filter((o) => o.status === 'Delivered').length;
        const pending = filtered.filter((o) => o.status === 'Pending').length;
        const chart = Object.entries(filtered.reduce((acc, order) => {
          const key = order.createdAt.slice(0, 10);
          acc[key] = (acc[key] || 0) + order.total;
          return acc;
        }, {})).map(([date, total]) => ({ date, total }));
        return { data: { data: { revenue, delivered, pending, totalOrders: filtered.length, chart, recentOrders: filtered.slice(0, 5) } }, status: 200 };
      }
      createError(404, 'Endpoint not found');
    },
    async POST(url, data) {
      if (url === '/api/products') {
        if (!data?.name) createError(400, 'Product name required');
        const next = { ...data, id: `P-${Date.now()}`, createdAt: new Date().toISOString() };
        db.products.unshift(next);
        persist();
        return { data: { data: next }, status: 201 };
      }
      if (url === '/api/orders') {
        const next = { ...data, createdAt: new Date().toISOString(), timeline: data.timeline || [] };
        db.orders.unshift(next);
        persist();
        return { data: { data: next }, status: 201 };
      }
      if (url.includes('/push-to-steadfast')) {
        const orderId = url.split('/')[3];
        const order = db.orders.find((item) => item.orderId === orderId);
        if (!order) createError(404, 'Order not found');
        order.trackingId = `TRK-${Math.floor(Math.random() * 90000 + 10000)}`;
        order.courierStatus = 'In Transit';
        order.timeline.unshift({ id: `EV-${Date.now()}`, type: 'courier', message: 'Pushed to Steadfast', createdAt: new Date().toISOString() });
        persist();
        return { data: { data: order }, status: 200 };
      }
      if (url.includes('/sync-status')) {
        const orderId = url.split('/')[3];
        const order = db.orders.find((item) => item.orderId === orderId);
        if (!order) createError(404, 'Order not found');
        const nextStatus = order.status === 'Processing' ? 'Delivered' : 'Processing';
        order.status = nextStatus;
        order.courierStatus = nextStatus === 'Delivered' ? 'Delivered' : 'Out for Delivery';
        order.timeline.unshift({ id: `EV-${Date.now()}`, type: 'sync', message: `Status synced to ${order.status}`, createdAt: new Date().toISOString() });
        persist();
        return { data: { data: order }, status: 200 };
      }
      createError(404, 'Endpoint not found');
    },
    async PATCH(url, data) {
      if (url.startsWith('/api/products/')) {
        const id = url.split('/')[3];
        const product = db.products.find((item) => item.id === id);
        if (!product) createError(404, 'Product not found');
        Object.assign(product, data);
        persist();
        return { data: { data: product }, status: 200 };
      }
      if (url.startsWith('/api/orders/')) {
        const orderId = url.split('/')[3];
        const order = db.orders.find((item) => item.orderId === orderId);
        if (!order) createError(404, 'Order not found');
        Object.assign(order, data);
        order.timeline.unshift({ id: `EV-${Date.now()}`, type: 'manual', message: data.reason || 'Manual override', createdAt: new Date().toISOString() });
        persist();
        return { data: { data: order }, status: 200 };
      }
      createError(404, 'Endpoint not found');
    },
    async DELETE(url) {
      if (url.startsWith('/api/products/')) {
        const id = url.split('/')[3];
        const index = db.products.findIndex((item) => item.id === id);
        if (index < 0) createError(404, 'Product not found');
        db.products.splice(index, 1);
        persist();
        return { data: { ok: true }, status: 200 };
      }
      createError(404, 'Endpoint not found');
    }
  };

  return {
    async handle({ method, url, data, config }) {
      await wait();
      if (Math.random() < 0.02) createError(500, 'Random mock server failure');
      const response = await handlers[method](url, data || config);
      return response;
    }
  };
};
