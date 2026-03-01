export const courierToInternalStatus = {
  delivered: 'Delivered',
  partial_delivered: 'Partial',
  returned: 'Returned',
  cancelled: 'Cancelled',
  in_review: 'Processing',
  pending: 'Pending'
};

export function mapCourierStatus(status) {
  return courierToInternalStatus[String(status || '').toLowerCase()] || 'Processing';
}
