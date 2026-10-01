# Hosting Guide — run your SACCO system online for free

This stack is a **Django REST API** (`backend/`) + **React web app** (`web-app/`).
The two are deployed separately and linked by `VITE_API_URL` (frontend → API)
and `CORS_EXTRA_ORIGINS` (API → frontend).

Everything below works with **zero-paid** accounts on Render / Vercel / Neon.
Free tiers sleep after ~15 min idle (first request wakes the service in ~30s) —
perfect for demos and small SACCOs; add a $7/uptime robot ping or paid plan when
you go live with real members.

---

## Option A — One-click Blueprint on Render (recommended start)

1. Push this repo to **your own GitHub account** (it's already in this workspace's
   repo `mataraparmenas-arch/MGR001` — any fork/copy works the same).
2. Go to **render.com ➜ Dashboard ➜ Blueprints ➜ New Blueprint**.
3. Point it at the repo. Render reads `render.yaml` and provisions:
   - `sacco-api` — Python web service (gunicorn, auto-migrates on boot)
   - `sacco-db` — Postgres
   - `sacco-web` — static React site
4. After the first deploy, open each service's **Environment** tab and set:
   - On `sacco-api`:
     - `DJANGO_SUPERUSER_PASSWORD` = a strong password (first boot creates the admin
       `admin@example.com` — then set `CREATE_DEFAULT_ADMIN=false`)
     - `DJANGO_ALLOWED_HOSTS` = `sacco-api.onrender.com` (your actual API hostname)
     - `CORS_EXTRA_ORIGINS` = your web URL, e.g. `https://sacco-web.onrender.com`
   - On `sacco-web`:
     - `VITE_API_URL` = `https://sacco-api.onrender.com/api/v1` (then **Manual Deploy**
       to rebuild with the baked-in env)

> ⚠️ Render's free Postgres expires after its free window — export a backup
> (`pg_dump` via the dashboard) periodically, or use **Neon's free-forever Postgres**
> and set its connection string as `DATABASE_URL`.

---

## Option B — Vercel (frontend) + Render (API) + Neon (database)
The most reliable zero-cost combo as of 2026.

**1. Database — Neon (free forever)**
- app.neon.tech ➜ New Project ➜ copy the `postgresql://...` connection string.

**2. API — Render**
- New ➜ Web Service ➜ your repo ➜ Root Directory `backend` ➜ Runtime *Python*
- Build: `pip install -r requirements.txt`
- Start: `bash start-server-prod.sh`
- Env: `DEBUG=False`, `DATABASE_URL=<neon string>`, `DJANGO_SECRET_KEY=<random>`,
  `DJANGO_ALLOWED_HOSTS=<your-service>.onrender.com`,
  `CREATE_DEFAULT_ADMIN=true`, `DJANGO_SUPERUSER_EMAIL`, `DJANGO_SUPERUSER_PASSWORD`
  (disable after first boot), and later `CORS_EXTRA_ORIGINS` + `MPESA_*`.

**3. Frontend — Vercel**
- vercel.com ➜ Import repo ➜ Root Directory `web-app` ➜ Framework *Vite*
- Env: `VITE_API_URL=https://<your-service>.onrender.com/api/v1`
- Deploy, then back on Render set `CORS_EXTRA_ORIGINS=https://<your-app>.vercel.app`.

Optionally add a custom domain on both (free SSL is automatic).

---

## Option C — Your own VPS (full control, e.g. for a paying SACCO)
Requires Docker + a domain. Point `sacco.example.com` (web) and
`api.sacco.example.com` (API) at the server.

```bash
git clone <your-repo> && cd <repo>
cp backend/.env.example backend/.env    # set DATABASE_MODE=postgres, secrets, MPESA_*
cp web-app/.env.example web-app/.env    # set VITE_API_URL=https://api.sacco.example.com/api/v1
docker compose up -d --build
```

Put a reverse proxy (Caddy/Nginx + Let's Encrypt) in front. Back up the Postgres
volume nightly.

---

## Going live with M-Pesa (Daraja)

1. **Sandbox:** developer.safaricom.co.ke ➜ create an *App* ➜ copy
   `MPESA_CONSUMER_KEY`, `MPESA_CONSUMER_SECRET`; use test shortcode `174379`
   with the *Lipa na M-Pesa Online Passkey*.
2. Set the five `MPESA_*` env vars on the API host plus:
   `MPESA_CALLBACK_URL=https://<api-domain>/api/v1/payments/mpesa/callback/`
3. Test an STK push with a safaricom test MSISDN (sandbox accepts `254708374149`).
4. **Production:** apply for go-live on the Daraja portal with your paybill/till;
   set `MPESA_ENVIRONMENT=production` and your real shortcode/passkey.

Payment flow: staff (or member) calls `POST /api/v1/payments/mpesa/stk-push/`
→ member enters PIN on the phone → Safaricom calls the callback → the member's
savings account is credited automatically (both when the reference is an account
number `SA00000001` or a membership number).

## Backups & housekeeping
- Nightly DB backup: `pg_dump $DATABASE_URL > backup.sql` (cron/GitHub Action).
- Keep M-Pesa callbacks idempotent — already handled (retries never double-credit).
- Rotate `DJANGO_SUPERUSER_PASSWORD`; never commit `.env`.
