# RESILIENCE ENGINE

**Team ALCHEMY (Team 4) Â· VIT Chennai Hackathon**  
*Sep 3, 12:00 PM â Sep 4, 2:00 PM | 24-hour build*

## Problem

Gig workers and informal laborers face unique financial challenges due to irregular income patterns:

- **Unpredictable cash flow**: Income varies week-to-week, making traditional budgeting difficult
- **Savings difficulty**: Hard to save consistently without steady paychecks
- **Credit invisibility**: Lack formal employment records, making loans inaccessible or predatory
- **Financial stress**: No emergency buffer leads to debt traps and high-cost borrowing
- **Limited financial literacy**: Complex financial products are hard to navigate

## Solution

**Resilience Engine** converts irregular gig-worker income into measurable financial resilience through a 6-stage intelligence pipeline:

```
Transaction 
    â
Income Pattern Analyzer (baseline, volatility, trend, prediction)
    â
Predictive Savings Pocket (surplus detection, auto-suggest, streak tracking)
    â
Resilience Score (0-100 score with factor breakdown)
    â
Loan Risk Detection (stacking alerts, payment burden)
    â
AI Nudge (plain-language personalized guidance)
```

## Core Features

### 1. **Income Pattern Analyzer**
Analyzes transaction history to compute:
- Baseline income (median or smoothed average)
- Volatility (income fluctuation)
- Consistency score
- Trend (improving/declining)
- 7-day income prediction

### 2. **Predictive Savings Pocket**
Detects surplus income and suggests savings:
- Real-time surplus calculation
- Savings suggestion (% of surplus)
- Savings streak tracking
- Rainy-day fund builder

### 3. **Resilience Score (0-100)**
Holistic financial health metric based on:
- Income stability
- Savings behavior
- Debt burden
- Emergency buffer
- Score change tracking

### 4. **Loan Stacking Risk**
Alerts users to dangerous borrowing patterns:
- Multiple active loan detection
- Payment-to-income ratio
- Risk level: low/medium/high

### 5. **AI Nudge**
Plain-language financial guidance:
- Personalized to user's situation
- Explains score changes
- Suggests actionable improvements
- English/Tamil support (if implemented)

### 6. **Rainy-Day Fund**
Emergency buffer tracker:
- Target: 1 month of baseline expenses
- Progress visualization
- Motivational milestones

## Differentiators

### 7. **Government Scheme Discovery**
Matches users to relevant Indian schemes:
- **PM-SYM** (Pension for unorganized workers)
- **e-Shram** (Unorganized worker registration)
- **PMJJBY** (Life insurance)
- **PMSBY** (Accident insurance)
- **PM Vishwakarma** (Artisan support)
- State-specific worker benefits

Based on user profile: age, income, occupation, state

### 8. **Language Support**
- English
- Tamil (optional, if time permits)

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React + Vite, Tailwind CSS |
| **Backend** | Node.js, Express |
| **Database** | MongoDB, Mongoose |
| **AI** | Google Gemini (with offline rule-based fallback) |
| **Charts** | Recharts |
| **Testing** | Postman |
| **Version Control** | GitHub |

## Team Structure

| Member | Responsibility |
|--------|---------------|
| **Member 1** | Backend, Database & Core Pipeline |
| **Member 2** | Financial Intelligence & Scoring |
| **Member 3** | Frontend & User Dashboard |
| **Member 4** | AI Nudge, Integration & Demo |

### Member 1: Backend, Database & Core Pipeline
- Express server setup
- MongoDB connection
- Mongoose models (User, Transaction, Loan, FinancialProfile)
- API routes (profile, transactions, loans, dashboard)
- Pipeline orchestration (POST /api/transactions â full pipeline)
- Error handling
- Integration with Member 2's finance engine

### Member 2: Financial Intelligence & Scoring
- Income pattern analyzer (baseline, volatility, trend, prediction)
- Predictive savings pocket (surplus, suggestions, streak, rainy-day)
- Resilience score engine (weighted factors, 0-100 score)
- Loan risk calculator
- Pure functions that return calculated values (no DB access)

### Member 3: Frontend & User Dashboard
- React + Vite + Tailwind setup
- Onboarding flow
- Dashboard (income chart, score card, savings, loans)
- Savings pocket UI
- Resilience score detail view
- Loan risk warnings
- Government scheme cards
- Responsive design

### Member 4: AI Nudge, Integration & Demo
- Gemini integration (nudge generation + chat coach)
- Government scheme matcher
- End-to-end integration testing
- Demo data seeding (3-4 realistic personas)
- Presentation deck
- Demo script and dry-run

## Architecture

### System Flow

```
âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
â                     FRONTEND (React + Vite)                  â
â  Dashboard | Savings | Score | Loans | Schemes | AI Nudge    â
âââââââââââââââââââââââââââ¬ââââââââââââââââââââââââââââââââââââ
                          â REST API (JSON)
                          â
âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
â                   BACKEND (Node.js + Express)                â
â                                                              â
â  ââââââââââââââââ    ââââââââââââââââ    ââââââââââââââââ  â
â  â  Controllers ââââââ   Services   ââââââ    Models    â  â
â  â  (Routes)    â    â  (Pipeline)  â    â  (Mongoose)  â  â
â  ââââââââââââââââ    ââââââââ¬ââââââââ    ââââââââââââââââ  â
â                              â                               â
â                              â                               â
â                    ââââââââââââââââââââ                     â
â                    â Finance Engine   â â Member 2          â
â                    â (Calculations)   â                     â
â                    ââââââââââââââââââââ                     â
âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
                          â
                          â
                   ââââââââââââââââ
                   â   MongoDB    â
                   ââââââââââââââââ
```

### Data Flow (POST /api/transactions)

1. **Request**: Transaction data (user_id, amount, date, source)
2. **Persist**: Save transaction to MongoDB
3. **Analyze**: Member 2's finance engine calculates:
   - Income profile
   - Savings pocket
   - Resilience score
   - Loan risk
4. **Store**: Save FinancialProfile to MongoDB
5. **Respond**: Return complete financial snapshot + nudge_context
6. **Frontend**: Member 4's AI calls Gemini to generate nudge (falls back offline)

## API Contract

See detailed specification: [`shared/api-contract.md`](./shared/api-contract.md)

### Key Endpoint: POST /api/transactions

**Request:**
```json
{
  "user_id": "U001",
  "amount": 1100,
  "date": "2026-09-03",
  "source": "Uber"
}
```

**Response:**
```json
{
  "success": true,
  "income_profile": { "baseline": 800, "volatility": "medium", "trend": "increasing", "prediction": {} },
  "savings_pocket": { "surplus": 300, "suggested_amount": 120, "streak": 4, "rainy_day": {} },
  "resilience_score": { "score": 72, "score_change": 5, "factors": {} },
  "loan_risk": { "level": "low", "active_loans": 0 },
  "nudge_context": {}
}
```

## Project Structure

```
hack/
âââ backend/              # Member 1: Node.js + Express + MongoDB
â   âââ src/
â   â   âââ config/       # Database connection
â   â   âââ controllers/  # Route handlers
â   â   âââ models/       # Mongoose schemas
â   â   âââ routes/       # API routes
â   â   âââ services/     # Business logic + pipeline
â   â   âââ middleware/   # Error handling
â   â   âââ app.js
â   â   âââ server.js
â   âââ package.json
â   âââ .env.example
â   âââ README.md
â
âââ frontend/             # Member 3: React + Vite + Tailwind
â   âââ src/
â   â   âââ components/
â   â   âââ pages/
â   â   âââ services/
â   â   âââ App.jsx
â   â   âââ main.jsx
â   âââ package.json
â   âââ README.md
â
âââ shared/
â   âââ api-contract.md   # API specification (agreed at Hour 0)
â
âââ README.md
âââ .gitignore
âââ .env.example
```

## Development Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (local or MongoDB Atlas)
- Gemini API key (for Member 4's AI nudge; optional — rule-based fallback works offline)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and port
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

### Environment Variables

**Backend (.env):**
```
MONGODB_URI=mongodb://localhost:27017/resilience-engine
PORT=5000
NODE_ENV=development
GEMINI_API_KEY=
GEMINI_MODEL=gemini-3.6-flash
```

**Frontend (.env):**
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_NUDGE_URL=http://localhost:5000
```

### Member 4 endpoints (same backend process)

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/nudge` | AI / fallback nudge from dashboard facts |
| POST | `/nudge/chat` | Coach chat reply |
| GET | `/nudge/health` | Gemini key status |
| POST | `/schemes/analyse` | Rank schemes + AI plan |
| GET | `/demo/profiles` | Demo worker list |

## Hackathon Timeline

| Hour | Focus |
|------|-------|
| **0-1** | API contract agreement, setup, initial commits |
| **1-4** | Member 1: Backend skeleton, Member 2: Core formulas, Member 3: UI setup |
| **4-6** | Member 1: Pipeline integration, Member 2: Scoring logic, Member 3: Dashboard |
| **6-9** | Member 4: AI integration, Member 3: Polish UI, Member 2: Refine calculations |
| **9-12** | **FEATURE FREEZE** â Integration testing only |
| **12-14** | Demo data, dry-run, bug fixes |
| **14-15** | Final presentation prep, slides, demo script |

### Critical Sync Points
- **Hour 0**: API contract agreement (all members)
- **Hour 3**: Backend + Finance engine integration check
- **Hour 6**: Frontend + Backend integration check
- **Hour 9**: FEATURE FREEZE (no new logic after this)
- **Hour 12**: Full integration dry-run

## Hackathon Scope

### MUST HAVE (Core Pipeline)
â Transaction input  
â Income pattern analysis  
â Savings pocket  
â Resilience score  
â Loan risk detection  
â AI nudge  

### SHOULD HAVE (Differentiators)
â Rainy-day fund tracker  
â Government scheme matcher  
â Score factor breakdown  

### NICE TO HAVE (Polish)
â ï¸ Tamil language support  
â ï¸ Income prediction chart  
â ï¸ Savings streak gamification  

### OUT OF SCOPE
â Real bank integrations  
â JWT authentication  
â Payment gateways  
â Real Uber/Swiggy APIs  
â Machine learning models  
â Production deployment  

## Testing

- **Backend**: Postman collection (Member 1)
- **Finance Engine**: Unit tests for calculations (Member 2)
- **Frontend**: Manual browser testing (Member 3)
- **Integration**: End-to-end demo scenarios (Member 4)

## Demo Strategy

Member 4 will create 3 realistic personas:

1. **High Resilience**: Uber driver, consistent income, good savings, no loans
2. **Medium Resilience**: Swiggy rider, fluctuating income, some savings, 1 loan
3. **At Risk**: Gig worker, erratic income, no savings, multiple loans

Each persona demonstrates the full pipeline and differentiators.

## Judging Criteria Alignment

| Criterion | Our Approach |
|-----------|-------------|
| **Technical Implementation** | Full-stack working prototype, clean architecture, real calculations |
| **Innovation** | Resilience score for gig workers, predictive savings, government scheme integration |
| **Feasibility** | Uses existing rails (TReDS concept), no new infrastructure needed |
| **Sustainability** | Can be revenue-neutral (data broker model), scales with digital payments |
| **Social Impact** | Financial inclusion for 450M+ informal workers in India |

## License

MIT License (Hackathon Project)

---

**Built with â¤ï¸ by Team ALCHEMY**  
VIT Chennai Â· September 2026
