# NEW FEATURES DOCUMENTATION

**Date:** September 3, 2026  
**Member:** Member 1 - Backend  
**Status:** ✅ COMPLETE AND TESTED

---

## 🎯 OVERVIEW

Two new features have been added to the Resilience Engine backend:

1. **Expense Tracking** - Record and analyze user expenses
2. **What-If Resilience Simulator** - Simulate hypothetical income scenarios

Both features preserve the existing architecture and do NOT modify any existing functionality.

---

## ✅ FEATURE 1: EXPENSE TRACKING

### Purpose
Allow users to record their expenses and get deterministic summaries without using AI.

### Database Model

**Collection:** `expenses`

**Schema:**
```javascript
{
  expense_id: String (unique, auto-generated),
  user_id: String (required, references User),
  amount: Number (required, positive),
  date: Date (required),
  category: String (required, enum),
  essential: Boolean (required, default: false),
  description: String (optional, max 200 chars),
  created_at: Date (auto)
}
```

**Categories:**
- Food
- Transport
- Housing
- Healthcare
- Education
- Entertainment
- Utilities
- Insurance
- Shopping
- Debt Payment
- Savings
- Other

**Indexes:**
- `{ user_id: 1, date: -1 }`
- `{ expense_id: 1 }`
- `{ user_id: 1, category: 1 }`

---

### API Endpoints

#### 1. Create Expense

**Endpoint:** `POST /api/expenses`

**Request Body:**
```json
{
  "user_id": "U001",
  "amount": 500,
  "date": "2026-09-03",
  "category": "Food",
  "essential": true,
  "description": "Groceries for the week"
}
```

**Response:**
```json
{
  "success": true,
  "expense": {
    "expense_id": "EXP1788458428342TKG4ZEVGO",
    "user_id": "U001",
    "amount": 500,
    "date": "2026-09-03T00:00:00.000Z",
    "category": "Food",
    "essential": true,
    "description": "Groceries for the week",
    "created_at": "2026-09-03T17:07:08.342Z"
  }
}
```

**Validation:**
- `user_id` - Required, must exist in database
- `amount` - Required, must be positive
- `date` - Required, valid ISO 8601 format
- `category` - Required, must be from allowed list
- `essential` - Optional boolean (defaults to false)
- `description` - Optional, max 200 characters

**Error Codes:**
- `400` - Missing required fields or validation error
- `404` - User not found

---

#### 2. Get Expenses

**Endpoint:** `GET /api/expenses/:userId`

**Query Parameters:**
- `limit` - Number of expenses to return (default: 50)
- `offset` - Pagination offset (default: 0)
- `category` - Filter by category (optional)
- `essential` - Filter by essential status: true/false (optional)
- `from_date` - Filter from this date (optional)
- `to_date` - Filter to this date (optional)
- `summary` - Include summary: true/false (default: false)

**Examples:**

Get all expenses:
```
GET /api/expenses/U001
```

Get with summary:
```
GET /api/expenses/U001?summary=true
```

Filter by category:
```
GET /api/expenses/U001?category=Food
```

Filter essential only:
```
GET /api/expenses/U001?essential=true
```

Date range:
```
GET /api/expenses/U001?from_date=2026-09-01&to_date=2026-09-30
```

**Response:**
```json
{
  "success": true,
  "expenses": [
    {
      "expense_id": "EXP...",
      "user_id": "U001",
      "amount": 500,
      "date": "2026-09-03",
      "category": "Food",
      "essential": true,
      "description": "Groceries"
    }
  ],
  "count": 6,
  "limit": 50,
  "offset": 0,
  "summary": {
    "total_expenses": 3450,
    "essential_expenses": 3000,
    "non_essential_expenses": 450,
    "expense_count": 6,
    "category_breakdown": {
      "Food": {
        "total": 500,
        "count": 1,
        "essential": 500,
        "non_essential": 0
      }
    },
    "recent_average": 575,
    "recent_count": 6
  }
}
```

**Note:** `summary` field only appears if `summary=true` query parameter is used.

---

#### 3. Get Expense Summary Only

**Endpoint:** `GET /api/expenses/:userId/summary`

**Query Parameters:** Same filtering options as GET expenses

**Response:**
```json
{
  "success": true,
  "user_id": "U001",
  "summary": {
    "total_expenses": 3450,
    "essential_expenses": 3000,
    "non_essential_expenses": 450,
    "expense_count": 6,
    "category_breakdown": {
      "Food": { "total": 500, "count": 1, "essential": 500, "non_essential": 0 },
      "Housing": { "total": 1500, "count": 1, "essential": 1500, "non_essential": 0 },
      "Transport": { "total": 200, "count": 1, "essential": 200, "non_essential": 0 }
    },
    "recent_average": 575,
    "recent_count": 6
  }
}
```

---

### Summary Calculations (Deterministic)

**Total Expenses:** Sum of all expense amounts

**Essential Expenses:** Sum of expenses where `essential = true`

**Non-Essential Expenses:** Sum of expenses where `essential = false`

**Category Breakdown:** For each category:
- `total` - Total amount spent in this category
- `count` - Number of transactions in this category
- `essential` - Amount spent on essential items in this category
- `non_essential` - Amount spent on non-essential items in this category

**Recent Average:** Average expense amount in the last 30 days

**Recent Count:** Number of expenses in the last 30 days

**NO AI USED** - All calculations are simple arithmetic operations on database records.

---

## ✅ FEATURE 2: WHAT-IF RESILIENCE SIMULATOR

### Purpose
Allow users to simulate hypothetical income changes and see the impact on their financial resilience WITHOUT modifying their real data.

### Key Principles

1. **Never Save Simulated Data** - Simulations are in-memory only
2. **Reuse Member 2's Finance Engine** - Same calculations as real pipeline
3. **Return Comparison** - Shows both current and simulated states
4. **Deterministic** - No AI, purely mathematical projections

---

### API Endpoint

#### Simulate Income Change Scenario

**Endpoint:** `POST /api/simulator`

**Request Body:**
```json
{
  "user_id": "U001",
  "income_change_percent": -20
}
```

**Parameters:**
- `user_id` - Required, must exist with transaction history
- `income_change_percent` - Required, between -100 and 200
  - Negative values = income decrease
  - Positive values = income increase
  - Example: `-20` means 20% decrease, `30` means 30% increase

**Response Structure:**
```json
{
  "success": true,
  "user_id": "U001",
  "scenario": {
    "income_change_percent": -20,
    "description": "Income decreases by 20%"
  },
  "current": {
    "income": 1200,
    "baseline": 950,
    "volatility": "low",
    "trend": "increasing",
    "prediction": { "min": 898, "max": 1097, "confidence": "high" },
    "surplus": 250,
    "safe_to_save": 100,
    "savings_streak": 1,
    "rainy_day_progress": 0.01,
    "resilience_score": 64,
    "score_factors": {
      "income_stability": 96,
      "savings_behavior": 32,
      "debt_burden": 100,
      "emergency_buffer": 1
    },
    "loan_risk": "low"
  },
  "simulated": {
    "income": 960,
    "baseline": 760,
    "volatility": "low",
    "trend": "increasing",
    "prediction": { "min": 718, "max": 878, "confidence": "high" },
    "surplus": 200,
    "safe_to_save": 80,
    "savings_streak": 1,
    "rainy_day_progress": 0.01,
    "resilience_score": 64,
    "score_factors": {
      "income_stability": 96,
      "savings_behavior": 32,
      "debt_burden": 100,
      "emergency_buffer": 1
    },
    "loan_risk": "low"
  },
  "change": {
    "income_change_percent": -20,
    "baseline_change": -190,
    "baseline_change_percent": -20,
    "safe_to_save_change": -20,
    "safe_to_save_change_percent": -20,
    "resilience_score_change": 0,
    "resilience_score_change_percent": 0,
    "surplus_change": -50,
    "volatility_change": { "from": "low", "to": "low" },
    "trend_change": { "from": "increasing", "to": "increasing" }
  },
  "insights": [
    "Your resilience score would remain relatively stable.",
    "Your saving capacity would reduce by ₹20 per transaction."
  ]
}
```

---

### How It Works

1. **Fetch Real Data**
   - User's transaction history
   - User's active loans
   - User profile

2. **Calculate Current State**
   - Uses Member 2's real finance engine
   - Calls `calculateIncomeProfile()`
   - Calls `calculateSavingsPocket()`
   - Calls `calculateResilienceScore()`
   - Calls `calculateLoanRisk()`

3. **Create Simulated Transactions (In Memory)**
   - Clone all transactions
   - Multiply amounts by `(1 + income_change_percent / 100)`
   - Example: -20% means multiply by 0.8
   - **Never saved to MongoDB**

4. **Calculate Simulated State**
   - Uses same Member 2 finance engine functions
   - Processes simulated transactions
   - Loans remain unchanged (not affected by simulation)

5. **Compare States**
   - Calculate differences between current and simulated
   - Generate percentage changes
   - Identify trend/volatility changes

6. **Generate Insights**
   - Simple rule-based insights
   - NO AI used
   - Based on score thresholds and changes

---

### Validation

**User Validation:**
- User must exist in database
- User must have transaction history (cannot simulate with no data)

**Parameter Validation:**
- `income_change_percent` must be between -100 and 200
- -100 means income drops to zero
- 200 means income triples

**Error Codes:**
- `400` - Missing fields, invalid range, or no transaction history
- `404` - User not found

---

### Example Scenarios

#### Scenario 1: Job Loss (-50%)
```json
POST /api/simulator
{
  "user_id": "U001",
  "income_change_percent": -50
}
```

Shows impact if user loses half their income.

#### Scenario 2: Promotion (+25%)
```json
POST /api/simulator
{
  "user_id": "U001",
  "income_change_percent": 25
}
```

Shows benefit if user gets 25% raise.

#### Scenario 3: Gig Work Reduction (-15%)
```json
POST /api/simulator
{
  "user_id": "U001",
  "income_change_percent": -15
}
```

Shows impact of reduced gig work availability.

---

### Important Notes

✅ **Simulations are READ-ONLY**
- No data is written to MongoDB
- User's real transactions are never modified
- User's financial profile is never updated
- Only in-memory calculations

✅ **Reuses Existing Logic**
- Same finance engine as POST /api/transactions
- Deterministic calculations from Member 2
- Consistent with real financial analysis

✅ **No AI Required**
- Pure mathematical projections
- Rule-based insights
- No machine learning models

---

## 📊 TESTING RESULTS

### Expense Tracking Tests

| Test | Status | Details |
|------|--------|---------|
| Create expense | ✅ PASS | Expense saved to MongoDB |
| Get expenses | ✅ PASS | Retrieved 6 expenses |
| Filter by category | ✅ PASS | Filtered Food expenses |
| Filter essential | ✅ PASS | Retrieved 4 essential expenses |
| Expense summary | ✅ PASS | Calculated correctly |
| Category breakdown | ✅ PASS | All categories counted |
| Recent average | ✅ PASS | 30-day average correct |

**Total:** 7/7 tests passed

---

### Simulator Tests

| Test | Status | Details |
|------|--------|---------|
| Income decrease (-20%) | ✅ PASS | Correct simulation |
| Income increase (+30%) | ✅ PASS | Correct simulation |
| Moderate decrease (-10%) | ✅ PASS | Correct simulation |
| Current state calculation | ✅ PASS | Matches real data |
| Simulated state calculation | ✅ PASS | Uses real engine |
| Change calculations | ✅ PASS | All deltas correct |
| Insights generation | ✅ PASS | Rules applied correctly |
| Data not saved | ✅ PASS | MongoDB unchanged |
| Transaction count unchanged | ✅ PASS | Still 7 transactions |
| Real baseline unchanged | ✅ PASS | Still ₹950 |

**Total:** 10/10 tests passed

---

## 🗂️ FILES CREATED

### Models
- `backend/src/models/Expense.js` - Expense model with validation

### Controllers
- `backend/src/controllers/expenseController.js` - Expense CRUD and summaries
- `backend/src/controllers/simulatorController.js` - What-if simulation logic

### Routes
- `backend/src/routes/expenseRoutes.js` - Expense endpoints
- `backend/src/routes/simulatorRoutes.js` - Simulator endpoint

### Modified Files
- `backend/src/app.js` - Added new routes (2 lines added)

### Tests
- `backend/test-new-features.js` - Comprehensive test suite (17/17 tests passed)

---

## 🔄 INTEGRATION WITH EXISTING SYSTEM

### Preserved Functionality
✅ All existing endpoints still work
✅ POST /api/transactions unchanged
✅ Member 2 finance engine unchanged
✅ Dashboard API unchanged
✅ Transaction/loan/profile endpoints unchanged

### New Collections
- `expenses` collection added (does not affect existing collections)

### Architecture Consistency
- Follows same pattern as Transaction controller
- Uses same validation approach
- Uses same error handling
- Uses same response format
- Follows same file organization

---

## 🚀 READY FOR PRODUCTION

Both features are:
- ✅ Fully tested
- ✅ MongoDB integrated
- ✅ API documented
- ✅ Error handling complete
- ✅ Validation implemented
- ✅ No breaking changes
- ✅ Backend server running successfully

---

## 📋 NEXT STEPS FOR OTHER TEAM MEMBERS

### Member 3 (Frontend)

**For Expense Tracking:**
1. Create expense form with category dropdown
2. Display expense list with filter options (category, essential)
3. Show expense summary with charts/graphs
4. Category breakdown visualization

**For Simulator:**
1. Create slider/input for income change percentage
2. Display current vs simulated comparison side-by-side
3. Visualize resilience score change with progress bars
4. Show insights in a card/panel
5. Add "what-if" scenarios as preset buttons (-50%, -20%, 0%, +20%, +50%)

### Member 4 (AI Integration)

**Can use expense data for:**
- Personalized nudges about spending patterns
- Warnings when non-essential spending is high
- Suggestions based on expense categories

**Can use simulator data for:**
- Risk warnings ("If your income drops by X%, your resilience would...")
- Opportunity messages ("If you increase income by X%, you could save Y more")

---

## 📖 API SUMMARY

### All Backend Endpoints (Updated)

| Method | Endpoint | Feature | Status |
|--------|----------|---------|--------|
| GET | /api/health | Health check | Existing ✅ |
| POST | /api/profile | User profile | Existing ✅ |
| GET | /api/profile/:userId | User profile | Existing ✅ |
| POST | /api/transactions | Create transaction | Existing ✅ |
| GET | /api/transactions/:userId | Transaction history | Existing ✅ |
| GET | /api/dashboard/:userId | Dashboard data | Existing ✅ |
| POST | /api/loans | Create loan | Existing ✅ |
| GET | /api/loans/:userId | User loans | Existing ✅ |
| **POST** | **/api/expenses** | **Create expense** | **NEW ✅** |
| **GET** | **/api/expenses/:userId** | **Get expenses** | **NEW ✅** |
| **GET** | **/api/expenses/:userId/summary** | **Expense summary** | **NEW ✅** |
| **POST** | **/api/simulator** | **What-if simulator** | **NEW ✅** |

**Total:** 12 endpoints (8 existing + 4 new)

---

**Documentation Complete**  
**Member 1 - Backend Development**  
**September 3, 2026**
