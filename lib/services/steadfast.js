import { env } from '@/lib/utils/env';

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${env.STEADFAST_API_KEY || ''}`
};

export async function createSteadfastParcel(order) {
  if (!env.STEADFAST_API_BASE_URL) throw new Error('Steadfast API base URL not configured');
  const payload = {
    invoice: order.orderId,
    recipient_name: order.customer.fullName,
    recipient_phone: order.customer.phone,
    recipient_address: `${order.customer.address}, ${order.customer.thana}, ${order.customer.district}`,
    cod_amount: order.totals.totalPrice,
    note: order.note,
    item_description: order.items?.[0]?.productNameSnapshot,
    weight: order.weightKg
  };

  const res = await fetch(`${env.STEADFAST_API_BASE_URL}/create_order`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error(`Steadfast create parcel failed: ${res.status}`);
  return res.json();
}

export async function trackSteadfastParcel(trackingId) {
  if (!env.STEADFAST_API_BASE_URL) throw new Error('Steadfast API base URL not configured');
  const res = await fetch(`${env.STEADFAST_API_BASE_URL}/status_by_trackingcode/${trackingId}`, { headers });
  if (!res.ok) throw new Error(`Steadfast tracking failed: ${res.status}`);
  return res.json();
}
