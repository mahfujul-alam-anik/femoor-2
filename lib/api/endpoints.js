export const endpoints = {
  products: '/api/products',
  productById: (id) => `/api/products/${id}`,
  orders: '/api/orders',
  orderById: (orderId) => `/api/orders/${orderId}`,
  pushToSteadfast: (orderId) => `/api/orders/${orderId}/push-to-steadfast`,
  syncStatus: (orderId) => `/api/orders/${orderId}/sync-status`,
  stats: '/api/stats'
};
