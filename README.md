# MGR001 — Modern SACCO Management System

A free, modern, self-hostable **Savings & Credit Cooperative (SACCO)** management
system — built for Kenyan (and East African) cooperatives that want to go digital
without paying per-member license fees.

- **Backend:** Django 4.2 + Django REST Framework + JWT
- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS + TanStack + Recharts
- **Database:** SQLite (dev) / PostgreSQL (production, via `DATABASE_URL`)
- **Payments:** M-Pesa (Safaricom Daraja) STK-push with automatic account crediting
- **Ops:** Docker Compose (dev), gunicorn/WhiteNoise (prod), Render Blueprint included

> Originally based on the open-source
> [`open-sacco`](https://github.com/isaacmain254/open-sacco) project, extended with
> production hardening, self-hosting tooling and the M-Pesa payments module.

---

## Features

| Area | Details |
|---|---|
| 👥 Members | Registration, KYC documents, next of kin, employment, member directory |
| 💰 Savings | Savings products, accounts, deposits/withdrawals, balances, transaction audit |
| 🏦 Loans | Loan products, applications, guarantors, review → approval → disbursement, schedules |
| 📲 M-Pesa | STK push deposits, Daraja callback processing, idempotent crediting, audit trail |
| 📊 Dashboard | Live savings / transaction / loan insights with charts |
| 🔐 Access | JWT auth, role-based modules (admin, manager, operations, finance, loan officer, accountant) |

## Quick start (local development)

**Backend** (Python 3.11+):

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # SQLite by default
python manage.py migrate
python manage.py seed_demo_data   # demo SACCO + admin: admin@example.com / admin12345
python manage.py runserver 0.0.0.0:8000
```

**Frontend** (Node 18+):

```bash
cd web-app
npm install
# .env already defaults to http://localhost:8000/api/v1
npm run dev                   # http://localhost:3000
```

Open http://localhost:3000 and sign in with **admin@example.com / admin12345**
(change it immediately outside demos). See `USER_GUIDE.md` for a staff walkthrough.

### Run the test suite

```bash
cd backend && python manage.py test
```

## Host it online

Everything needed is committed: `render.yaml` (one-click Blueprint),
Dockerfiles, and **HOSTING.md** — a step-by-step guide for free hosting
(Render + Vercel + Neon) or Docker/VPS.

## M-Pesa (Daraja)

New `payments` app:

- `POST /api/v1/payments/mpesa/stk-push/` — initiate (JWT required)
- `POST /api/v1/payments/mpesa/callback/` — Safaricom webhook (public, idempotent)
- `GET  /api/v1/payments/mpesa/transactions/` — staff audit list

Configure via `MPESA_*` env vars (see `backend/.env.example`); with no keys set the
API answers `503` with setup instructions instead of failing. Sandbox keys are free at
[developer.safaricom.co.ke](https://developer.safaricom.co.ke).

## Project layout

```
backend/     Django project — accounts, members, loans, customers, users, payments
web-app/     React + TypeScript + Tailwind frontend
compose.yaml Local dev stack (Postgres + API + web)
render.yaml  One-click Render Blueprint
HOSTING.md   Free-hosting playbook (Render/Vercel/Neon/VPS)
USER_GUIDE.md Staff manual
```

## Roadmap ideas

SMS alerts (Africa's Talking), member self-service portal, dividends & interest
runners, PDF statements/reports, shares register, bulk Excel import,
multi-branch support.
