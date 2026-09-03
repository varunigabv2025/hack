# Resilience Engine

Hackathon app: convert irregular gig-worker income into measurable financial resilience.

| Folder | Owner | Role |
|---|---|---|
| `frontend/` | Member 3 | React + Vite dashboard |
| `backend/` | Member 4 (nudge) → merge with Member 1 | AI nudge service + demo dataset |
| Shared contract | All | [`API_CONTRACT.md`](./API_CONTRACT.md) |
| Demo script | Member 4 | [`DEMO_FLOW.md`](./DEMO_FLOW.md) |

## Member 3 — run the UI

```bash
cd frontend
npm install
npm run dev
```

## Member 4 — run AI Nudge & Demo API

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

- Nudge API: `http://localhost:5000/nudge`
- Demo profiles: `http://localhost:5000/demo/profiles`
- Offline-safe without `GEMINI_API_KEY` (rule-based fallback)

Optional frontend env:

```env
VITE_NUDGE_URL=http://localhost:5000
```

If unset, the floating chat button uses the same fallback logic locally.
