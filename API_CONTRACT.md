# Shared API Contract — Resilience Engine

Frontend displays this payload. Member 1's Express API should return the same shape from `POST /transactions` and `GET /dashboard`.

Money values are INR integers. The frontend never calculates scores, baselines, savings, or volatility.

## POST /transactions

```json
{
  "amount": 1100,
  "date": "2026-09-03",
  "source": "Uber"
}
```

## Response / GET /dashboard

```json
{
  "income_profile": {
    "baseline": 800,
    "today_income": 1100,
    "trend": "UP",
    "volatility": 0.18
  },
  "savings_pocket": {
    "suggested_amount": 120,
    "streak": 4,
    "current_balance": 4200
  },
  "resilience_score": {
    "score": 72,
    "previous_score": 67,
    "change": 5,
    "factors": {
      "income_stability": 82,
      "income_trend": 76,
      "savings_behavior": 71,
      "emergency_buffer": 60
    }
  },
  "nudge": {
    "triggered": true,
    "message": "You're building a stronger safety net. Your income is trending upward and you've maintained a 4-day savings streak. Your resilience score increased by 5 points this week."
  }
}
```

`trend`: `UP` | `DOWN` | `STABLE`

Optional extras the UI can show if present:

- `user`: `{ "name": "Karthik" }`
- `transactions[]`: `{ date, source, amount, vs_baseline, saved }`
- `weekly[]`: `{ label, income, saved, baseline }`
- `savings_activity[]`: `{ date, amount, note }`
- `month_total_saved`, `emergency_buffer`: `{ current, target }`
- `resilience_score.explanation`

## Integration

Set `VITE_API_URL` in `frontend/.env` (no trailing slash), e.g. `http://localhost:5000`.
Leave empty to use mock snapshots in `frontend/src/data/mockData.js`.
