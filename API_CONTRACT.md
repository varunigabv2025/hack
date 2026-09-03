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

- `user`: `{ "name", "occupation", "state", "city", "phone", "language", "avatar_label" }`
- `settings`: `{ "notifications", "darkMode" }`
- `transactions[]`: `{ id, date, source, amount, vs_baseline, saved }`
- `weekly[]`: `{ label, income, saved, baseline }` — Insights chart
- `goals[]`: `{ id, name, target, current, icon }` — Goals page
- `savings_activity[]`: `{ date, amount, note }` — Savings Pocket history
- `month_total_saved`, `emergency_buffer`: `{ current, target }`
- `income_profile.volatility`
- `resilience_score.explanation`

## POST /nudge (Member 4)

Body: raw facts **or** a full dashboard snapshot.

```json
{
  "trend": "UP",
  "streak": 4,
  "score": 72,
  "change": 5,
  "suggestedAmount": 120
}
```

Response:

```json
{
  "nudge": {
    "triggered": true,
    "title": "You're getting stronger financially.",
    "message": "Your income is trending upward and you've kept a 4-day savings streak…"
  },
  "meta": { "source": "fallback" }
}
```

`meta.source`: `ai` | `fallback` — fallback always works without Gemini.

## POST /schemes/analyse (Member 4)

Body: dashboard snapshot or profile facts (`user`, `income`, `savings`, `resilience`).

Returns ranked schemes for the user profile plus an AI/fallback recommendation plan:

```json
{
  "ctx": { "occupation": "Uber", "state": "Tamil Nadu", "score": 72, "streak": 4 },
  "ranked": [{ "id": "eshram", "name": "e-Shram", "match": 96, "priority": "High", "reason": "..." }],
  "insight": {
    "title": "AI Scheme Recommendation",
    "narrative": "...",
    "actionPlan": [{ "step": 1, "schemeId": "eshram", "scheme": "e-Shram", "action": "..." }],
    "source": "fallback"
  }
}
```

AI never invents eligibility — it only explains the ranked matches.

## Integration

Set `VITE_API_URL` in `frontend/.env` (no trailing slash), e.g. `http://localhost:5000`.
Optional: `VITE_NUDGE_URL=http://localhost:5000` for Member 4’s nudge service.
Leave empty to use mock snapshots in `frontend/src/data/mockData.js`.
