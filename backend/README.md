# FXDC Camp API

Express + TypeScript backend with MongoDB for education and trading-tools applications.

## Setup

1. Copy `.env.example` to `.env` and set MongoDB Atlas `MONGODB_URI`, Cloudinary keys, and a 32+ character `JWT_SECRET`.
2. Allow your IP in Atlas Network Access, then install and run:

```bash
npm install
npm run seed:admin
npm run dev
```

The API listens on `http://localhost:5000`. The Vite frontend proxies `/api` to this server.

## Public endpoints

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/health` | Health check |
| POST | `/api/auth/register` | Create a user account |
| POST | `/api/auth/login` | Sign in |
| POST | `/api/auth/logout` | Clear auth cookie |
| GET | `/api/auth/me` | Current user |
| PATCH | `/api/auth/me` | Update profile |
| PATCH | `/api/auth/password` | Change password |
| POST | `/api/education-applications` | Submit education form |
| POST | `/api/trading-tools-applications` | Submit trading tools form |

## Admin endpoints

Send `Authorization: Bearer <token>` or use the `fxdc_token` cookie.

| Method | Path |
| --- | --- |
| GET | `/api/admin/stats` |
| GET | `/api/admin/users` |
| GET | `/api/admin/users/:id` |
| PATCH | `/api/admin/users/:id` |
| GET | `/api/admin/education-applications` |
| GET | `/api/admin/education-applications/:id` |
| PATCH | `/api/admin/education-applications/:id` |
| DELETE | `/api/admin/education-applications/:id` |
| GET | `/api/admin/trading-tools-applications` |
| GET | `/api/admin/trading-tools-applications/:id` |
| PATCH | `/api/admin/trading-tools-applications/:id` |
| DELETE | `/api/admin/trading-tools-applications/:id` |
| GET | `/api/admin/media` |
| POST | `/api/admin/media` |
| DELETE | `/api/admin/media/:id` |

Query params for list routes: `page`, `limit`, `search`, `status` (`pending` \| `reviewed` \| `contacted` \| `closed`).

PATCH body: `{ "status": "contacted", "notes": "Called applicant" }`.
