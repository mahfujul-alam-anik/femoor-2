# Fullstack Admin Panel (Next.js 16 + MongoDB)

Modern admin panel to manage products, orders, dashboard statistics, and optional Steadfast parcel integration.

## Tech Stack
- Next.js 16 (App Router, JavaScript)
- React 19
- Tailwind CSS 4
- MongoDB + Mongoose
- TanStack Table, React Hook Form + Zod

## Features
- Admin auth with JWT cookie
- Dashboard analytics cards + charts + recent order table
- Product create/list/delete with image preview + validation
- Order create/list/details with status updates
- Optional push-to-Steadfast during order creation
- Steadfast webhook + manual sync + cron sync endpoint
- MongoDB models for Product, Order, OrderEvent
- Seed script with admin credentials from environment variables

## Environment
Copy env file and adjust as needed:

```bash
cp .env.example .env
```

Default `.env.example` already uses your MongoDB Atlas URI format.

## Admin Seed Credentials
Set using env vars:
- `SEED_ADMIN_EMAIL=admin@gmail.com`
- `SEED_ADMIN_PASSWORD=123456`

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

## Avoiding PR Merge Conflicts
If GitHub shows conflicts when opening a PR, sync your branch with latest `main` before opening/updating the PR:

```bash
./scripts/sync-main.sh
```

Then push your branch again:

```bash
git push --force-with-lease origin <your-branch>
```

Also ensure your PR **base branch is `main`** and your compare branch is your feature branch.
