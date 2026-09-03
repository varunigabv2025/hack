# Demo Flow — Resilience Engine (2–3 minutes)

Member 4 walkthrough for judges. Use **profile U001 (Arjun)** — deterministic.

## Prep (30 seconds before)

1. Terminal A: `cd backend && npm run dev` → `http://localhost:5000`
2. Terminal B: `cd frontend && npm run dev` → `http://localhost:5173`
3. Optional: set `GEMINI_API_KEY` in `backend/.env`. If missing, fallback nudge still works.
4. Confirm fallback: `curl http://localhost:5000/demo/preview/U001`

## Script (≈2:30)

### 0:00–0:20 — Hook
> “Gig workers don’t get salary slips. Income jumps every day. Resilience Engine turns today’s pay into a measurable safety net.”

Open the dashboard. Point to ivory / burgundy / gold UI.

### 0:20–0:50 — The story in numbers
Highlight the pipeline cards:
- Today’s income **₹1,100**
- Usual baseline **₹800**
- Surplus **₹300**
- Safe to save **₹120**, streak **4 days**
- Resilience score **72** (was 67, **+5**)

> “Every number on this screen comes from the backend formulas — the UI never invents them.”

### 0:50–1:20 — AI Nudge
Click the floating chat button (bottom-right).

> “The nudge only explains those facts. If the AI API is down, a rule-based fallback still speaks — so the demo never dies.”

Optional live proof: `POST /nudge?fallback=1` with the same facts.

### 1:20–1:50 — Transaction action
Go to **Transactions**. Submit **₹1,100 / Uber** (or reset demo → log again).

> “One POST /transactions runs the full pipeline: income pattern → savings pocket → score → nudge.”

### 1:50–2:20 — Why it matters
> “Baseline, surplus, streak, and score movement are deterministic. AI never recalculates money — it only translates the engine’s facts into plain language for the worker.”

### 2:20–2:40 — Close
> “Repeatable demo dataset: five workers (U001–U005). Same inputs, same story, every time.”

## Backup paths

| Risk | Recovery |
|---|---|
| No internet / no Gemini key | Fallback nudge (`source: "fallback"`) |
| Backend down | Frontend mock dashboard still shows U001 story |
| Judge asks for another worker | `GET /demo/preview/U003` (soft week) or `U005` (strong buffer) |

## Q&A cheats

- **Does AI invent numbers?** No. Strict prompt + fallback only use supplied facts.
- **Where is the score calculated?** Member 2 finance engine / Member 1 pipeline — not the LLM.
- **Can we demo offline?** Yes. Fallback nudge + mock frontend.
