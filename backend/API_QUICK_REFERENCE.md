# API QUICK REFERENCE

**Resilience Engine Backend - All Endpoints**

---

## 🏥 Health Check

```bash
GET /api/health
```

---

## 👤 User Profile

### Create User
```bash
POST /api/profile
{
  "user_id": "U001",
  "name": "Rajesh Kumar",
  "age": 28,
  "occupation": "Uber Driver",
  "state": "Tamil Nadu",
  "language": "English",
  "monthly_expense": 15000
}
```

### Get User Profile
```bash
GET /api/profile/:userId
```

---

## 💰 Transactions (Income)

### Create Transaction (Triggers Finance Engine Pipeline)
```bash
POST /api/transactions
{
  "user_id": "U001",
  "amount": 1200,
  "date": "2026-09-07",
  "source": "Uber"
}

# Returns: transaction + income_profile + savings_pocket + 
#          resilience_score + loan_risk + nudge_context
```

### Get Transaction History
```bash
GET /api/transactions/:userId
GET /api/transactions/:userId?limit=20&offset=0
```

---

## 💳 Expenses ⭐ NEW

### Create Expense
```bash
POST /api/expenses
{
  "user_id": "U001",
  "amount": 500,
  "date": "2026-09-03",
  "category": "Food",  # Food, Transport, Housing, Healthcare, etc.
  "essential": true,
  "description": "Groceries"
}
```

### Get Expenses
```bash
# All expenses
GET /api/expenses/:userId

# With summary
GET /api/expenses/:userId?summary=true

# Filter by category
GET /api/expenses/:userId?category=Food

# Filter essential only
GET /api/expenses/:userId?essential=true

# Date range
GET /api/expenses/:userId?from_date=2026-09-01&to_date=2026-09-30
```

### Get Expense Summary Only
```bash
GET /api/expenses/:userId/summary

# With filters
GET /api/expenses/:userId/summary?category=Food
```

---

## 🎯 What-If Simulator ⭐ NEW

### Simulate Income Change
```bash
POST /api/simulator
{
  "user_id": "U001",
  "income_change_percent": -20  # -100 to 200
}

# Returns: current state + simulated state + changes + insights
```

**Common Scenarios:**
- Job loss: `-50`
- Income cut: `-20`
- Small decrease: `-10`
- Promotion: `+25`
- Side income: `+15`

---

## 🏦 Loans

### Create Loan
```bash
POST /api/loans
{
  "user_id": "U001",
  "amount": 50000,
  "purpose": "Medical emergency",
  "interest_rate": 12,
  "tenure_months": 12,
  "monthly_payment": 4442,
  "status": "active"
}
```

### Get User Loans
```bash
GET /api/loans/:userId
```

---

## 📊 Dashboard

### Get Complete Dashboard
```bash
GET /api/dashboard/:userId

# Returns:
# - user profile
# - financial_profile (income, savings, resilience, loan risk)
# - latest_transaction
# - recent_transactions
# - active_loans
# - nudge_context
```

---

## 📈 Response Formats

### Transaction Response
```json
{
  "success": true,
  "transaction": { ... },
  "income_profile": {
    "baseline": 950,
    "volatility": "low",
    "trend": "increasing",
    "prediction": { ... }
  },
  "savings_pocket": {
    "surplus": 250,
    "suggested_amount": 100,
    "streak": 1
  },
  "resilience_score": {
    "score": 64,
    "score_change": 14,
    "factors": { ... }
  },
  "loan_risk": { "level": "low" },
  "nudge_context": { ... }
}
```

### Expense Summary Response
```json
{
  "success": true,
  "summary": {
    "total_expenses": 3450,
    "essential_expenses": 3000,
    "non_essential_expenses": 450,
    "expense_count": 6,
    "category_breakdown": {
      "Food": { "total": 500, "count": 1 }
    },
    "recent_average": 575
  }
}
```

### Simulator Response
```json
{
  "success": true,
  "scenario": { "description": "Income decreases by 20%" },
  "current": {
    "income": 1200,
    "baseline": 950,
    "safe_to_save": 100,
    "resilience_score": 64
  },
  "simulated": {
    "income": 960,
    "baseline": 760,
    "safe_to_save": 80,
    "resilience_score": 64
  },
  "change": {
    "baseline_change": -190,
    "resilience_score_change": 0
  },
  "insights": [ ... ]
}
```

---

## 🔐 Error Codes

| Code | Meaning |
|------|---------|
| 400 | Bad Request (validation error) |
| 404 | Not Found (user/resource not found) |
| 500 | Internal Server Error |

---

## 📦 Expense Categories

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

---

## 🚀 Quick Test Commands

```bash
# Create user
curl -X POST http://localhost:5000/api/profile \
  -H "Content-Type: application/json" \
  -d '{"user_id":"U002","name":"Test User","age":25,"occupation":"Driver","state":"TN","monthly_expense":10000}'

# Create transaction
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{"user_id":"U002","amount":1000,"date":"2026-09-03","source":"Work"}'

# Create expense
curl -X POST http://localhost:5000/api/expenses \
  -H "Content-Type: application/json" \
  -d '{"user_id":"U002","amount":200,"date":"2026-09-03","category":"Food","essential":true}'

# Run simulator
curl -X POST http://localhost:5000/api/simulator \
  -H "Content-Type: application/json" \
  -d '{"user_id":"U002","income_change_percent":-20}'

# Get dashboard
curl http://localhost:5000/api/dashboard/U002
```

---

**Base URL:** `http://localhost:5000`  
**Content-Type:** `application/json`  
**All endpoints return JSON**
