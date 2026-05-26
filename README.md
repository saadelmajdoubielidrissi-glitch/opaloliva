# OpalOliva 🫒

Premium bilingual olive tree ecommerce website — Lovei Péter, Kecskemét, Hungary.

## Stack
- **Frontend:** React 18 + Vite + Tailwind CSS + Framer Motion
- **Backend:** FastAPI + Motor (async MongoDB)
- **Payments:** Stripe Checkout
- **Deployment:** Vercel (frontend) + Railway (backend + MongoDB)

## Local Development

### Prerequisites
- Node.js 18+
- Python 3.11+
- MongoDB running locally

### Backend
```bash
cd backend
cp .env.example .env
# Edit .env — add your Stripe test key
pip install -r requirements.txt
uvicorn server:app --reload --port 8001
```

### Frontend
```bash
cd frontend
# Edit .env.local if needed
npm run dev
```
Site runs at: http://localhost:3000

### API test
```bash
curl http://localhost:8001/api/
curl http://localhost:8001/api/pricing
```

## Deployment

### Backend → Railway
1. Push repo to GitHub
2. New Railway project → Deploy from GitHub
3. Select `backend/` folder
4. Add env vars: `MONGO_URL`, `STRIPE_API_KEY`, `CORS_ORIGINS=https://opaloliva.hu`
5. Note the Railway public URL

### Frontend → Vercel
1. New Vercel project → import from GitHub
2. Set root directory: `frontend`
3. Add env var: `VITE_BACKEND_URL=https://your-railway-url.up.railway.app`
4. Deploy → add custom domain `opaloliva.hu`

### Stripe Production
1. Replace test key with live key in Railway env vars
2. Add webhook in Stripe Dashboard → `https://your-railway-url.up.railway.app/api/webhook/stripe`
3. Add `STRIPE_WEBHOOK_SECRET` env var in Railway

## Admin
Visit `/admin` — shows contacts, orders, newsletter subscribers.
⚠️ Add authentication before production!

## Contact
**Lovei Péter** — lovei.peter888@icloud.com — +36 30 312 2522
