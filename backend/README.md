# Resilience Engine — Member 4 (AI Nudge, Integration & Demo)

Owns: plain-language nudges, AI integration, demo dataset, end-to-end wiring helpers.

## Rule

The AI **never calculates** financial numbers. Member 2/1 calculate baseline, savings, score, and risk. Member 4 only explains those supplied facts.

## Run

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Service: `http://localhost:5000`

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/nudge` | Generate nudge from facts or full dashboard JSON |
| `POST` | `/nudge/chat` | Gemini coach reply from a question + dashboard facts |
| `GET` | `/nudge/health` | Check if Gemini key is present |
| `GET` | `/demo/profiles` | List 5 deterministic worker stories |
| `GET` | `/demo/profiles/:id` | Full seed history for Member 1 |
| `GET` | `/demo/preview/:id` | Preview fallback nudge for a worker |
| `POST` | `/schemes/analyse` | Rank government schemes for a user profile + AI plan |
| `GET` | `/schemes/health` | Scheme analyser health / Gemini flag |

### Example

```bash
curl -X POST http://localhost:5000/nudge -H "Content-Type: application/json" -d "{\"trend\":\"UP\",\"streak\":4,\"score\":72,\"change\":5,\"suggestedAmount\":120}"
```

Analyse schemes for a gig-worker profile:

```bash
curl -X POST http://localhost:5000/schemes/analyse -H "Content-Type: application/json" -d "{\"user\":{\"occupation\":\"Uber\",\"state\":\"Tamil Nadu\",\"name\":\"User\"},\"income\":{\"baseline\":800,\"trend\":\"UP\"},\"savings\":{\"streak\":4,\"emergencyProgress\":51},\"resilience\":{\"score\":72}}"
```

Force offline fallback:

```bash
curl -X POST "http://localhost:5000/nudge?fallback=1" -H "Content-Type: application/json" -d "{\"trend\":\"UP\",\"streak\":4,\"score\":72,\"change\":5}"
```

## Files

- `src/services/gemini.js` — Gemini API client (`gemini-3.6-flash`)
- `src/services/nudgeEngine.js` — rule-based fallback (always works)
- `src/services/aiNudge.js` — Gemini wrapper + automatic fallback
- `src/services/aiChat.js` — Gemini chat coach
- `src/services/schemeAnalyser.js` — scheme ranking + Gemini plan
- `src/data/demoProfiles.js` — U001–U005 repeatable demo workers
- `../DEMO_FLOW.md` — 2–3 minute judge walkthrough

## Integration with Member 1

After pipeline calculation in `POST /transactions`, call:

```js
import { generateAiNudge } from './services/aiNudge.js'
const nudge = await generateAiNudge({
  trend: incomeProfile.trend,
  streak: savings.streak,
  score: resilience.score,
  change: resilience.change,
  suggestedAmount: savings.suggested_amount,
})
```

Or `POST http://localhost:5000/nudge` with the dashboard payload.
