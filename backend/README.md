# Resilience Engine - Backend

**Owner**: Member 1  
**Tech Stack**: Node.js, Express, MongoDB, Mongoose

## Overview

This is the core backend API that orchestrates the financial intelligence pipeline:

```
Transaction Input 
    â
Pipeline Orchestration (Member 1)
    â
Finance Engine Calculations (Member 2)
    â
Data Persistence (Member 1)
    â
Response with Financial Snapshot
```

## Folder Structure

```
backend/
âââ src/
â   âââ config/
â   â   âââ db.js                    # MongoDB connection
â   â
â   âââ controllers/
â   â   âââ profileController.js     # User profile CRUD
â   â   âââ transactionController.js # Transaction + pipeline trigger
â   â   âââ dashboardController.js   # Dashboard data aggregation
â   â   âââ loanController.js        # Loan CRUD
â   â
â   âââ models/
â   â   âââ User.js                  # User schema
â   â   âââ Transaction.js           # Transaction schema
â   â   âââ Loan.js                  # Loan schema
â   â   âââ FinancialProfile.js      # Financial snapshot schema
â   â
â   âââ routes/
â   â   âââ profileRoutes.js         # /api/profile routes
â   â   âââ transactionRoutes.js     # /api/transactions routes
â   â   âââ dashboardRoutes.js       # /api/dashboard routes
â   â   âââ loanRoutes.js            # /api/loans routes
â   â
â   âââ services/
â   â   âââ pipelineService.js       # Pipeline orchestration logic
â   â   âââ financeEngineAdapter.js  # Interface to Member 2's engine
â   â
â   âââ middleware/
â   â   âââ errorHandler.js          # Global error handler
â   â   âââ notFound.js              # 404 handler
â   â
â   âââ app.js                       # Express app setup
â   âââ server.js                    # Server entry point
â
âââ package.json
âââ .env.example
âââ README.md
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and set:
```
MONGODB_URI=mongodb://localhost:27017/resilience-engine
PORT=5000
NODE_ENV=development
```

### 3. Start MongoDB

Make sure MongoDB is running locally:
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas connection string in .env
```

### 4. Run Development Server

```bash
npm run dev
```

Server will start on `http://localhost:5000`

### 5. Verify Health Check

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-09-03T12:00:00Z"
}
```

## API Endpoints

See full specification: [`../shared/api-contract.md`](../shared/api-contract.md)

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/profile` | Create user profile |
| GET | `/api/profile/:userId` | Get user profile |
| POST | `/api/transactions` | **Add transaction (triggers pipeline)** |
| GET | `/api/transactions/:userId` | Get transaction history |
| GET | `/api/dashboard/:userId` | Get dashboard data |
| POST | `/api/loans` | Add loan |
| GET | `/api/loans/:userId` | Get user loans |

## Member 1 Responsibilities

### â Completed
- [x] Express server setup
- [x] MongoDB connection
- [x] Mongoose models (User, Transaction, Loan, FinancialProfile)
- [x] API route structure
- [x] Error handling middleware
- [x] Health check endpoint

### ð In Progress
- [ ] Profile controller implementation
- [ ] Transaction controller + pipeline trigger
- [ ] Dashboard controller
- [ ] Loan controller
- [ ] Pipeline service orchestration
- [ ] Integration with Member 2's finance engine

### ð Testing
- [ ] Postman collection
- [ ] All endpoints working
- [ ] Error handling verified
- [ ] Integration with frontend

## Pipeline Flow (POST /api/transactions)

```javascript
// 1. Receive transaction data
const { user_id, amount, date, source } = req.body;

// 2. Persist transaction to database
const transaction = await Transaction.create({...});

// 3. Fetch user and transaction history
const user = await User.findOne({ user_id });
const transactions = await Transaction.find({ user_id });
const loans = await Loan.find({ user_id, status: 'active' });

// 4. Call Member 2's finance engine (via adapter)
const incomeProfile = financeEngine.calculateIncomeProfile(transactions, user);
const savingsPocket = financeEngine.calculateSavingsPocket({
  todayIncome: amount,
  incomeProfile,
  transactions,
  user
});
const resilienceScore = financeEngine.calculateResilienceScore({
  incomeProfile,
  savingsPocket,
  transactions,
  loans,
  user
});
const loanRisk = financeEngine.calculateLoanRisk(loans);

// 5. Persist FinancialProfile
await FinancialProfile.findOneAndUpdate(
  { user_id },
  { ...incomeProfile, ...savingsPocket, ...resilienceScore, ...loanRisk },
  { upsert: true }
);

// 6. Build nudge_context for Member 4's AI
const nudge_context = {
  today_income: amount,
  baseline: incomeProfile.baseline,
  trend: incomeProfile.trend,
  surplus: savingsPocket.surplus,
  suggested_saving: savingsPocket.suggested_amount,
  savings_streak: savingsPocket.streak,
  current_score: resilienceScore.score,
  previous_score: resilienceScore.previous_score,
  score_change: resilienceScore.score_change,
  loan_risk: loanRisk.level,
  rainy_day_progress: savingsPocket.rainy_day.progress
};

// 7. Return complete snapshot
res.json({
  success: true,
  transaction,
  income_profile: incomeProfile,
  savings_pocket: savingsPocket,
  resilience_score: resilienceScore,
  loan_risk: loanRisk,
  nudge_context
});
```

## Integration with Member 2

Member 2 provides `financeEngine.js` with 4 pure functions:

```javascript
// backend/src/services/financeEngine.js (owned by Member 2)

export const calculateIncomeProfile = (transactions, user) => {
  // Member 2 implements this
  // Returns: { baseline, volatility, consistency, trend, prediction }
};

export const calculateSavingsPocket = (params) => {
  // Member 2 implements this
  // Returns: { surplus, suggested_amount, streak, rainy_day }
};

export const calculateResilienceScore = (params) => {
  // Member 2 implements this
  // Returns: { score, previous_score, score_change, factors }
};

export const calculateLoanRisk = (loans) => {
  // Member 2 implements this
  // Returns: { level, active_loans, total_monthly_payment, payment_to_income_ratio }
};
```

**Member 1's adapter** (`financeEngineAdapter.js`) wraps these functions with error handling.

## Database Models

### User
```javascript
{
  user_id: String (unique),
  name: String,
  age: Number,
  occupation: String,
  state: String,
  language: String,
  monthly_expense: Number,
  created_at: Date
}
```

### Transaction
```javascript
{
  transaction_id: String (unique),
  user_id: String (ref: User),
  amount: Number,
  date: Date,
  source: String,
  created_at: Date
}
```

### Loan
```javascript
{
  loan_id: String (unique),
  user_id: String (ref: User),
  loan_name: String,
  amount: Number,
  monthly_payment: Number,
  status: String (active/closed),
  created_at: Date
}
```

### FinancialProfile
```javascript
{
  user_id: String (unique, ref: User),
  
  // Income Profile
  baseline: Number,
  volatility: String,
  consistency: Number,
  trend: String,
  prediction: Object,
  
  // Savings Pocket
  surplus: Number,
  suggested_amount: Number,
  savings_streak: Number,
  rainy_day: Object,
  
  // Resilience Score
  resilience_score: Number,
  previous_score: Number,
  score_change: Number,
  score_factors: Object,
  
  // Loan Risk
  loan_risk: String,
  
  updated_at: Date
}
```

## Error Handling

All errors return standardized format:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## Testing with Postman

Example request to add transaction:

```
POST http://localhost:5000/api/transactions
Content-Type: application/json

{
  "user_id": "U001",
  "amount": 1100,
  "date": "2026-09-03",
  "source": "Uber"
}
```

## Hackathon Timeline

| Hour | Task |
|------|------|
| 0-1 | Setup, models, routes skeleton |
| 1-3 | Implement profile + transaction controllers |
| 3-4 | Pipeline service + finance engine adapter |
| 4-6 | Dashboard endpoint + testing |
| 6-9 | Integration with Member 2's calculations |
| 9-12 | Bug fixes, frontend integration |

## Common Issues

### MongoDB Connection Failed
- Check if MongoDB is running
- Verify MONGODB_URI in .env
- Check network/firewall settings

### Finance Engine Not Found
- Member 2 should provide `financeEngine.js`
- Place in `backend/src/services/`
- Update adapter imports

### CORS Errors
- CORS is enabled in app.js
- Check frontend is making requests to correct URL

## Production Considerations (Post-Hackathon)

- Add JWT authentication
- Input validation (express-validator)
- Rate limiting
- API documentation (Swagger)
- Unit tests (Jest)
- Database indexes
- Caching (Redis)
- Logging (Winston)
- Production MongoDB (Atlas)
- Deployment (Render/Railway/Heroku)

## Member 4 — AI Nudge, Schemes & Demo

Mounted on the same Express server:

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/nudge` | Generate nudge from facts or dashboard JSON |
| POST | `/nudge/chat` | Gemini coach reply |
| GET | `/nudge/health` | Gemini key present? |
| POST | `/schemes/analyse` | Rank schemes + AI plan |
| GET | `/schemes/health` | Scheme analyser health |
| GET | `/demo/profiles` | List demo workers |
| GET | `/demo/profiles/:id` | Full seed history |
| GET | `/demo/preview/:id` | Preview fallback nudge |

Set `GEMINI_API_KEY` in `.env` (optional). Without it, rule-based fallback always works.

---

**Built by Team ALCHEMY · VIT Chennai**
