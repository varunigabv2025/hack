# Resilience Engine — Frontend (Member 3)

Premium light fintech dashboard (Ivory + Burgundy + Gold).

## Stack

React + Vite, Tailwind CSS, React Router, Lucide icons.

## Run

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

Mock data is on by default. Set `VITE_API_URL` in `.env` when Express is ready.

## Pages

- `/` Dashboard — income → surplus → save → score → nudge story
- `/savings` Savings pocket
- `/score` Resilience score detail
- `/transactions` Log pay + activity table
- `/insights` `/goals` `/network` `/settings`

## Design

- Light ivory canvas, white cards, burgundy primary, gold accents
- Currency identity chips (not an FX converter — amounts stay INR from backend)
- Desktop sidebar + mobile drawer
