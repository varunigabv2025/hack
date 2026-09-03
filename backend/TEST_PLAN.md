# RESILIENCE ENGINE - API TEST PLAN

**Member 1 Backend Implementation - Phase 2 Complete**

## Prerequisites

1. **MongoDB Running**: Start MongoDB locally on port 27017
   ```bash
   mongod
   ```

2. **Start Backend Server**:
   ```bash
   cd backend
   npm run dev
   ```

Server should start on: `http://localhost:5000`

---

## Test Sequence

### 1. Health Check

**Endpoint**: `GET /api/health`

```bash
curl http://localhost:5000/api/health
```

**Expected Response**:
```json
{
  "status": "ok",
  "timestamp": "2026-09-03T12:00:00Z",
  "environment": "development"
}
```

---

### 2. Create User Profile

**Endpoint**: `POST /api/profile`

```bash
curl -X POST http://localhost:5000/api/profile \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "U001",
    "name": "Arun Kumar",
    "age": 28,
    "occupation": "Uber Driver",
    "state": "Tamil Nadu",
    "language": "English",
    "monthly_expense": 12000
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "user": {
    "user_id": "U001",
    "name": "Arun Kumar",
    "age": 28,
    "occupation": "Uber Driver",
    "state": "Tamil Nadu",
    "language": "English",
    "monthly_expense": 12000,
    "created_at": "2026-09-03T..."
  }
}
```

---

### 3. Get User Profile

**Endpoint**: `GET /api/profile/:userId`

```bash
curl http://localhost:5000/api/profile/U001
```

**Expected Response**:
```json
{
  "success": true,
  "user": {
    "user_id": "U001",
    "name": "Arun Kumar",
    ...
  }
}
```

---

### 4. Create Transaction (CORE PIPELINE)

**Endpoint**: `POST /api/transactions`

**First Transaction**:
```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "U001",
    "amount": 1100,
    "date": "2026-09-03",
    "source": "Uber"
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "transaction": {
    "transaction_id": "TXN...",
    "user_id": "U001",
    "amount": 1100,
    "date": "2026-09-03",
    "source": "Uber",
    "created_at": "..."
  },
  "income_profile": {
    "baseline": 1100,
    "volatility": "medium",
    "consistency": 0.5,
    "trend": "stable",
    "prediction": {
      "next_7_days": 0,
      "confidence": "low"
    }
  },
  "savings_pocket": {
    "surplus": 0,
    "suggested_amount": 0,
    "streak": 0,
    "rainy_day": {
      "current": 0,
      "target": 12000,
      "progress": 0
    }
  },
  "resilience_score": {
    "score": 50,
    "previous_score": 50,
    "score_change": 0,
    "factors": {
      "income_stability": 50,
      "savings_behavior": 50,
      "debt_burden": 50,
      "emergency_buffer": 50
    }
  },
  "loan_risk": {
    "level": "low",
    "active_loans": 0,
    "total_monthly_payment": 0,
    "payment_to_income_ratio": 0
  },
  "nudge_context": {
    "today_income": 1100,
    "baseline": 1100,
    "trend": "stable",
    "surplus": 0,
    "suggested_saving": 0,
    "savings_streak": 0,
    "current_score": 50,
    "previous_score": 50,
    "score_change": 0,
    "loan_risk": "low",
    "rainy_day_progress": 0
  }
}
```

**NOTE**: These values are from the **MOCK** finance engine. When Member 2 provides `financeEngine.js`, the actual calculated values will be returned.

---

### 5. Create Second Transaction

```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "U001",
    "amount": 850,
    "date": "2026-09-04",
    "source": "Uber"
  }'
```

**Result**: Pipeline recalculates with 2 transactions in history.

---

### 6. Get Transaction History

**Endpoint**: `GET /api/transactions/:userId`

```bash
curl http://localhost:5000/api/transactions/U001
```

**Expected Response**:
```json
{
  "success": true,
  "transactions": [
    {
      "transaction_id": "TXN...",
      "user_id": "U001",
      "amount": 850,
      "date": "2026-09-04",
      "source": "Uber",
      "created_at": "..."
    },
    {
      "transaction_id": "TXN...",
      "user_id": "U001",
      "amount": 1100,
      "date": "2026-09-03",
      "source": "Uber",
      "created_at": "..."
    }
  ],
  "count": 2,
  "limit": 50,
  "offset": 0
}
```

---

### 7. Create Loan

**Endpoint**: `POST /api/loans`

```bash
curl -X POST http://localhost:5000/api/loans \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "U001",
    "loan_name": "Loan App A",
    "amount": 10000,
    "monthly_payment": 1500,
    "status": "active"
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "loan": {
    "loan_id": "LOAN...",
    "user_id": "U001",
    "loan_name": "Loan App A",
    "amount": 10000,
    "monthly_payment": 1500,
    "status": "active",
    "created_at": "..."
  }
}
```

---

### 8. Get User Loans

**Endpoint**: `GET /api/loans/:userId`

```bash
curl http://localhost:5000/api/loans/U001
```

**Expected Response**:
```json
{
  "success": true,
  "loans": [
    {
      "loan_id": "LOAN...",
      "user_id": "U001",
      "loan_name": "Loan App A",
      "amount": 10000,
      "monthly_payment": 1500,
      "status": "active",
      "created_at": "..."
    }
  ],
  "count": 1,
  "active_count": 1,
  "total_monthly_payment": 1500
}
```

---

### 9. Create Third Transaction (With Loan)

```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "U001",
    "amount": 900,
    "date": "2026-09-05",
    "source": "Uber"
  }'
```

**Result**: Pipeline now includes loan data in loan_risk calculation.

---

### 10. Get Dashboard

**Endpoint**: `GET /api/dashboard/:userId`

```bash
curl http://localhost:5000/api/dashboard/U001
```

**Expected Response**:
```json
{
  "success": true,
  "user": {
    "user_id": "U001",
    "name": "Arun Kumar",
    "age": 28,
    "occupation": "Uber Driver",
    "state": "Tamil Nadu",
    "language": "English",
    "monthly_expense": 12000
  },
  "financial_profile": {
    "income_profile": {
      "baseline": 950,
      "volatility": "medium",
      "consistency": 0.5,
      "trend": "stable",
      "prediction": {...}
    },
    "savings_pocket": {
      "surplus": 0,
      "suggested_amount": 0,
      "streak": 0,
      "rainy_day": {...}
    },
    "resilience_score": {
      "score": 50,
      "previous_score": 50,
      "score_change": 0,
      "factors": {...}
    },
    "loan_risk": {
      "level": "medium"
    },
    "updated_at": "..."
  },
  "latest_transaction": {...},
  "recent_transactions": [...],
  "active_loans": [...],
  "nudge_context": {...}
}
```

---

## Error Test Cases

### Test 1: Missing User

```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "U999",
    "amount": 1100,
    "date": "2026-09-03",
    "source": "Uber"
  }'
```

**Expected**:
```json
{
  "success": false,
  "error": "User not found. Create a profile first using POST /api/profile",
  "code": "USER_NOT_FOUND"
}
```

### Test 2: Missing Required Fields

```bash
curl -X POST http://localhost:5000/api/profile \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "U002",
    "name": "Test User"
  }'
```

**Expected**:
```json
{
  "success": false,
  "error": "Missing required fields: user_id, name, age, occupation, state, monthly_expense",
  "code": "MISSING_FIELDS"
}
```

### Test 3: Invalid Amount

```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "U001",
    "amount": -100,
    "date": "2026-09-03",
    "source": "Uber"
  }'
```

**Expected**:
```json
{
  "success": false,
  "error": "Amount cannot be negative",
  "code": "INVALID_AMOUNT"
}
```

### Test 4: Duplicate User ID

```bash
# Create U001 again
curl -X POST http://localhost:5000/api/profile \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "U001",
    "name": "Another User",
    "age": 30,
    "occupation": "Driver",
    "state": "Kerala",
    "monthly_expense": 10000
  }'
```

**Expected**:
```json
{
  "success": false,
  "error": "user_id already exists",
  "code": "DUPLICATE_KEY"
}
```

---

## Integration with Member 2

When Member 2 provides `backend/src/services/financeEngine.js` with these functions:

```javascript
module.exports = {
  calculateIncomeProfile: (transactions, user) => { ... },
  calculateSavingsPocket: (params) => { ... },
  calculateResilienceScore: (params) => { ... },
  calculateLoanRisk: (loans) => { ... }
};
```

The backend will **automatically** use the real calculations instead of mocks.

**No changes required** to controllers, routes, or pipeline service.

---

## MongoDB Verification

After running tests, verify data persistence in MongoDB:

```bash
mongosh resilience-engine

db.users.find()
db.transactions.find()
db.financialprofiles.find()
db.loans.find()
```

---

## Postman Collection

Import these endpoints into Postman for easier testing:

1. Health Check (GET)
2. Create Profile (POST)
3. Get Profile (GET)
4. Create Transaction (POST) - **Core pipeline**
5. Get Transactions (GET)
6. Create Loan (POST)
7. Get Loans (GET)
8. Get Dashboard (GET)

---

## Success Criteria

✅ All 8 endpoints respond without syntax errors  
✅ Transaction persistence works  
✅ FinancialProfile updates after each transaction  
✅ Pipeline orchestration flows correctly  
✅ Error handling returns proper status codes  
✅ Mock finance engine provides fallback values  
✅ Ready for Member 2's real finance engine integration  
✅ Ready for Member 3's frontend integration  
✅ Ready for Member 4's AI nudge integration  

---

**Phase 2 Implementation Status: COMPLETE**
