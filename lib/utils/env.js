import { z } from 'zod';

const envSchema = z.object({
  MONGODB_URI: z.string().min(1),
  JWT_SECRET: z.string().min(10),
  STEADFAST_API_BASE_URL: z.string().url().optional().or(z.literal('')),
  STEADFAST_API_KEY: z.string().optional(),
  STEADFAST_SECRET: z.string().optional(),
  CRON_SECRET: z.string().min(6).default('changeme')
});

export const env = envSchema.parse({
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  STEADFAST_API_BASE_URL: process.env.STEADFAST_API_BASE_URL,
  STEADFAST_API_KEY: process.env.STEADFAST_API_KEY,
  STEADFAST_SECRET: process.env.STEADFAST_SECRET,
  CRON_SECRET: process.env.CRON_SECRET
});
