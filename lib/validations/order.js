import { z } from 'zod';

export const orderInputSchema = z.object({
  customer: z.object({
    fullName: z.string().min(2),
    phone: z.string().min(5),
    altPhone: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    address: z.string().min(3),
    district: z.string().min(2),
    thana: z.string().min(2)
  }),
  item: z.object({
    productId: z.string().min(1),
    quantity: z.coerce.number().positive(),
    exactPrice: z.coerce.number().min(0),
    sellingPrice: z.coerce.number().min(0)
  }),
  itemDescription: z.string().optional(),
  note: z.string().optional(),
  weightKg: z.coerce.number().min(0.1),
  exchange: z.boolean().default(false),
  deliveryCost: z.coerce.number().min(0),
  status: z.enum(['Pending', 'Processing', 'Delivered', 'Returned', 'Partial', 'Cancelled']).default('Pending'),
  pushToSteadfast: z.boolean().default(false)
});
