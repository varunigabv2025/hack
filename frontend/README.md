# Resilience Engine — Frontend (Member 3)

Mobile-first React dashboard for gig-worker income, savings, resilience score, and AI nudges.

The UI **only displays** backend (or mock) numbers. It does not calculate scores, baselines, or savings.

## Stack

React + Vite, Tailwind CSS, Recharts, React Router.

## Run

```bash
cd frontend
npm install
npm run dev
```

Opens at http://localhost:5173

Until Express is live, leave `VITE_API_URL` empty. Mock data matches [`API_CONTRACT.md`](../API_CONTRACT.md).

## Pages

- `/` Dashboard
- `/savings` Savings pocket
- `/score` Resilience score
- `/activity` Transactions + demo `POST /transactions`
