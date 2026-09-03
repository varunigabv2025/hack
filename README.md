# RESILIENCE ENGINE

**Team ALCHEMY (Team 4) · VIT Chennai Hackathon**  
*Sep 3, 12:00 PM – Sep 4, 2:00 PM | 24-hour build*

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
    ↓
Income Pattern Analyzer (baseline, volatility, trend, prediction)
    ↓
Predictive Savings Pocket (surplus detection, auto-suggest, streak tracking)
    ↓
Resilience Score (0-100 score with factor breakdown)
    ↓
Loan Risk Detection (stacking alerts, payment burden)
    ↓
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
| **AI** | Google Gemini API |
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
- Pipeline orchestration (POST /api/transactions → full pipeline)
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
- Google Gemini integration (nudge generation)
- Government scheme matcher
- End-to-end integration testing
- Demo data seeding (3-4 realistic personas)
- Presentation deck
- Demo script and dry-run

## Architecture

### System Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React + Vite)                  │
│  Dashboard | Savings | Score | Loans | Schemes | AI Nudge    │
└─────────────────────────┬───────────────────────────────────┘
                          │ REST API (JSON)
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND (Node.js + Express)                │
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │  Controllers │───→│   Services   │───→│    Models    │  │
│  │  (Routes)    │    │  (Pipeline)  │    │  (Mongoose)  │  │
│  └──────────────┘    └──────┬───────┘    └──────────────┘  │
│                              │                               │
│                              ↓                               │
│                    ┌──────────────────┐                     │
│                    │ Finance Engine   │ ← Member 2          │
│                    │ (Calculations)   │                     │
│                    └──────────────────┘                     │
└─────────────────────────────────────────────────────────────┘
                          │
                          ↓
                   ┌──────────────┐
                   │   MongoDB    │
                   └──────────────┘
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
6. **Frontend**: Member 4's AI calls Gemini API to generate nudge

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
├── backend/              # Member 1: Node.js + Express + MongoDB
│   ├── src/
│   │   ├── config/       # Database connection
│   │   ├── controllers/  # Route handlers
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic + pipeline
│   │   ├── middleware/   # Error handling
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── frontend/             # Member 3: React + Vite + Tailwind
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── README.md
│
├── shared/
│   └── api-contract.md   # API specification (agreed at Hour 0)
│
├── README.md
├── .gitignore
└── .env.example
```

## Development Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (local or MongoDB Atlas)
- Google Gemini API key (for Member 4's AI nudge)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI, port, and Gemini API key
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
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
```

**Frontend (.env):**
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_NUDGE_URL=http://localhost:5000
```

**Note**: Gemini API key is optional. The system uses a rule-based fallback when the key is not configured, making it demo-safe offline.

## Hackathon Timeline

| Hour | Focus |
|------|-------|
| **0-1** | API contract agreement, setup, initial commits |
| **1-4** | Member 1: Backend skeleton, Member 2: Core formulas, Member 3: UI setup |
| **4-6** | Member 1: Pipeline integration, Member 2: Scoring logic, Member 3: Dashboard |
| **6-9** | Member 4: AI integration, Member 3: Polish UI, Member 2: Refine calculations |
| **9-12** | **FEATURE FREEZE** → Integration testing only |
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
✅ Transaction input  
✅ Income pattern analysis  
✅ Savings pocket  
✅ Resilience score  
✅ Loan risk detection  
✅ AI nudge  

### SHOULD HAVE (Differentiators)
✅ Rainy-day fund tracker  
✅ Government scheme matcher  
✅ Score factor breakdown  

### NICE TO HAVE (Polish)
⚠️ Tamil language support  
⚠️ Income prediction chart  
⚠️ Savings streak gamification  

### OUT OF SCOPE
❌ Real bank integrations  
❌ JWT authentication  
❌ Payment gateways  
❌ Real Uber/Swiggy APIs  
❌ Machine learning models  
❌ Production deployment  

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

**Built with ❤️ by Team ALCHEMY**  
VIT Chennai · September 2026
