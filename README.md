# Fullstack Admin Panel (Next.js + MongoDB)

Modern admin panel to manage products, orders, dashboard statistics, and optional Steadfast parcel integration.

## Features
- Admin auth with JWT cookie
- Dashboard analytics cards + charts + recent order table
- Product create/list/delete with image preview + validation
- Order create/list/details with status updates
- Optional push-to-Steadfast during order creation
- Steadfast webhook + manual sync + cron sync endpoint
- MongoDB models for Product, Order, OrderEvent
- Seed script with admin credentials

## Admin Seed Credentials
- Email: `admin@gmail.com`
- Password: `12345`

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env:
   ```bash
   cp .env.example .env
   ```
3. Seed admin and sample products:
   ```bash
   npm run seed
   ```
4. Start app:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:3000/login`.

## Important Routes
- `/admin/dashboard`
- `/admin/products/new`
- `/admin/products`
- `/admin/orders/new`
- `/admin/orders`
- `/admin/orders/[id]`

## API Notes
- `POST /api/orders` creates local order and optionally pushes parcel to Steadfast.
- `POST /api/orders/:id/push` manual push.
- `POST /api/orders/:id/sync` manual status sync.
- `POST /api/webhooks/steadfast` courier webhook updates.
- `GET /api/cron/sync-status` polling sync; requires `x-cron-secret` header.
