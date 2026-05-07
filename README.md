# BPO Management System

Next.js dashboard for managing BPO employees, customers, clients, calls, tickets, attendance, tasks, billing, SLA, complaints, recruitment, and performance data.

The app uses Next.js API routes backed by MongoDB Atlas or any MongoDB-compatible deployment through Mongoose.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Radix UI
- Recharts and Chart.js
- MongoDB with Mongoose

## Setup

Install dependencies:

```bash
npm install
```

Create `.env.local`:

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/bpo_system?retryWrites=true&w=majority
```

Seed MongoDB with demo records:

```bash
npm run db:seed
```

Start the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## MongoDB Atlas

1. Create a MongoDB Atlas project and cluster.
2. Create a database user with read/write access.
3. Add your IP address in Network Access.
4. Copy the Node.js connection string.
5. Replace `USERNAME`, `PASSWORD`, and `CLUSTER` in `.env.local`.
6. Keep the database name as `bpo_system` in the URI path.
7. Run `npm run db:seed` once if you want starter data.

## API Routes

Collection routes use standard REST methods:

- `GET /api/customers`, `POST /api/customers`, `PATCH /api/customers/:id`, `DELETE /api/customers/:id`
- `GET /api/agents`, `POST /api/agents`, `PATCH /api/agents/:id`, `DELETE /api/agents/:id`
- `GET /api/employees`, `POST /api/employees`, `PATCH /api/employees/:id`, `DELETE /api/employees/:id`
- `GET /api/tasks`, `POST /api/tasks`, `PATCH /api/tasks/:id`, `DELETE /api/tasks/:id`
- `GET /api/tickets`, `POST /api/tickets`, `PATCH /api/tickets/:id`, `DELETE /api/tickets/:id`
- Same pattern for `attendance`, `billing`, `calls`, `clients`, `complaints`, `performance`, `recruitment`, `shifts`, `sla`, and `users`.

Special routes:

- `GET /api/dashboard-data`
- `POST /api/mark-attendance`
- `POST /api/login`
- `POST /api/register`

## Scripts

```bash
npm run dev
npm run db:seed
npm run build
npm run start
npm run lint
```
