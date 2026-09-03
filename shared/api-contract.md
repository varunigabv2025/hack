# RESILIENCE ENGINE - API CONTRACT

**Version**: 1.0  
**Agreed**: Hour 0 (Sep 3, 2026)  
**Team**: ALCHEMY (Team 4)

---

## Overview

This document defines the REST API contract between:
- **Member 1** (Backend + Pipeline)
- **Member 2** (Finance Engine)
- **Member 3** (Frontend)
- **Member 4** (AI Nudge + Integration)

All endpoints return JSON. All dates are ISO 8601 strings (`YYYY-MM-DD`).

---

## Base URL

**Development**: `http://localhost:5000/api`  
**Production**: TBD

---

## Authentication

**Hackathon scope**: No authentication required.  
Use `user_id` in request body/params to identify users.

---

## Endpoints

### 1. Health Check

**GET** `/health`

Check if backend is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-09-03T12:00:00Z"
}
```

---

### 2. Create User Profile

**POST** `/profile`

Create a new user profile.

**Request Body:**
```json
{
  "user_id": "U001",
  "name": "Rajesh Kumar",
  "age": 28,
  "occupation": "Uber Driver",
  "state": "Tamil Nadu",
  "language": "Tamil",
  "monthly_expense": 15000
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "user_id": "U001",
    "name": "Rajesh Kumar",
    "age": 28,
    "occupation": "Uber Driver",
    "state": "Tamil Nadu",
    "language": "Tamil",
    "monthly_expense": 15000,
    "created_at": "2026-09-03T12:00:00Z"
  }
}
```

---

### 3. Get User Profile

**GET** `/profile/:userId`

Retrieve user profile.

**Response:**
```json
{
  "success": true,
  "user": {
    "user_id": "U001",
    "name": "Rajesh Kumar",
    "age": 28,
    "occupation": "Uber Driver",
    "state": "Tamil Nadu",
    "language": "Tamil",
    "monthly_expense": 15000,
    "created_at": "2026-09-03T12:00:00Z"
  }
}
```

---

### 4. Add Transaction (CORE PIPELINE)

**POST** `/transactions`

Add a new transaction and trigger the full financial intelligence pipeline.

**Request Body:**
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
  "transaction": {
    "transaction_id": "T12345",
    "user_id": "U001",
    "amount": 1100,
    "date": "2026-09-03",
    "source": "Uber",
    "created_at": "2026-09-03T12:00:00Z"
  },
  "income_profile": {
    "baseline": 800,
    "volatility": "medium",
    "consistency": 0.72,
    "trend": "increasing",
    "prediction": {
      "next_7_days": 850,
      "confidence": "medium"
    }
  },
  "savings_pocket": {
    "surplus": 300,
    "suggested_amount": 120,
    "streak": 4,
    "rainy_day": {
      "current": 2400,
      "target": 15000,
      "progress": 0.16
    }
  },
  "resilience_score": {
    "score": 72,
    "previous_score": 67,
    "score_change": 5,
    "factors": {
      "income_stability": 65,
      "savings_behavior": 80,
      "debt_burden": 90,
      "emergency_buffer": 50
    }
  },
  "loan_risk": {
    "level": "low",
    "active_loans": 0,
    "total_monthly_payment": 0,
    "payment_to_income_ratio": 0.0
  },
  "nudge_context": {
    "today_income": 1100,
    "baseline": 800,
    "trend": "increasing",
    "surplus": 300,
    "suggested_saving": 120,
    "savings_streak": 4,
    "current_score": 72,
    "previous_score": 67,
    "score_change": 5,
    "loan_risk": "low",
    "rainy_day_progress": 0.16
  }
}
```

**IMPORTANT NOTES:**
- The numbers shown are **DEMO EXAMPLES** only
- Member 2's finance engine calculates the actual values
- Never hardcode these numbers in backend/frontend
- `nudge_context` is passed to Member 4's AI (AI never invents numbers)

---

### 5. Get Transaction History

**GET** `/transactions/:userId`

Retrieve all transactions for a user.

**Query Parameters:**
- `limit` (optional): Number of transactions (default: 50)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "transactions": [
    {
      "transaction_id": "T12345",
      "user_id": "U001",
      "amount": 1100,
      "date": "2026-09-03",
      "source": "Uber",
      "created_at": "2026-09-03T12:00:00Z"
    }
  ],
  "count": 1
}
```

---

### 6. Get Dashboard Data

**GET** `/dashboard/:userId`

Retrieve complete financial snapshot for dashboard.

**Response:**
```json
{
  "success": true,
  "user": {
    "user_id": "U001",
    "name": "Rajesh Kumar",
    "occupation": "Uber Driver"
  },
  "financial_profile": {
    "income_profile": {
      "baseline": 800,
      "volatility": "medium",
      "trend": "increasing"
    },
    "savings_pocket": {
      "surplus": 300,
      "suggested_amount": 120,
      "streak": 4
    },
    "resilience_score": {
      "score": 72,
      "score_change": 5
    },
    "loan_risk": {
      "level": "low",
      "active_loans": 0
    }
  },
  "recent_transactions": [],
  "active_loans": []
}
```

---

### 7. Add Loan

**POST** `/loans`

Add a new loan record.

**Request Body:**
```json
{
  "user_id": "U001",
  "loan_name": "Personal Loan",
  "amount": 50000,
  "monthly_payment": 5000,
  "status": "active"
}
```

**Response:**
```json
{
  "success": true,
  "loan": {
    "loan_id": "L001",
    "user_id": "U001",
    "loan_name": "Personal Loan",
    "amount": 50000,
    "monthly_payment": 5000,
    "status": "active",
    "created_at": "2026-09-03T12:00:00Z"
  }
}
```

---

### 8. Get User Loans

**GET** `/loans/:userId`

Retrieve all loans for a user.

**Response:**
```json
{
  "success": true,
  "loans": [
    {
      "loan_id": "L001",
      "user_id": "U001",
      "loan_name": "Personal Loan",
      "amount": 50000,
      "monthly_payment": 5000,
      "status": "active",
      "created_at": "2026-09-03T12:00:00Z"
    }
  ],
  "count": 1
}
```

---

## Member 2: Finance Engine Interface

Member 2 provides a `financeEngine.js` module with pure calculation functions.

### Function Signatures

#### 1. calculateIncomeProfile(transactions, user)

**Input:**
- `transactions`: Array of transaction objects
- `user`: User object

**Output:**
```javascript
{
  baseline: 800,              // Median or smoothed average
  volatility: "medium",        // "low" | "medium" | "high"
  consistency: 0.72,           // 0-1 score
  trend: "increasing",         // "increasing" | "stable" | "declining"
  prediction: {
    next_7_days: 850,
    confidence: "medium"       // "low" | "medium" | "high"
  }
}
```

---

#### 2. calculateSavingsPocket(params)

**Input:**
```javascript
{
  todayIncome: 1100,
  incomeProfile: { baseline: 800, ... },
  transactions: [...],
  user: { monthly_expense: 15000, ... }
}
```

**Output:**
```javascript
{
  surplus: 300,                // todayIncome - baseline
  suggested_amount: 120,       // % of surplus
  streak: 4,                   // Days with savings
  rainy_day: {
    current: 2400,             // Total accumulated
    target: 15000,             // 1 month expenses
    progress: 0.16             // current / target
  }
}
```

---

#### 3. calculateResilienceScore(params)

**Input:**
```javascript
{
  incomeProfile: {...},
  savingsPocket: {...},
  transactions: [...],
  loans: [...],
  user: {...}
}
```

**Output:**
```javascript
{
  score: 72,                   // 0-100
  previous_score: 67,          // From last calculation
  score_change: 5,             // score - previous_score
  factors: {
    income_stability: 65,      // 0-100
    savings_behavior: 80,      // 0-100
    debt_burden: 90,           // 0-100
    emergency_buffer: 50       // 0-100
  }
}
```

---

#### 4. calculateLoanRisk(loans)

**Input:**
- `loans`: Array of loan objects

**Output:**
```javascript
{
  level: "low",                // "low" | "medium" | "high"
  active_loans: 0,
  total_monthly_payment: 0,
  payment_to_income_ratio: 0.0
}
```

---

## Member 4: AI Nudge Generation

Member 4 receives `nudge_context` from the backend response and generates a plain-language nudge.

### AI Rules

1. **AI NEVER invents or calculates financial numbers**
2. AI only explains the numbers provided in `nudge_context`
3. Use OpenAI API (GPT-3.5 or GPT-4)
4. Fallback to template-based nudge if API fails

### Example Prompt

```
You are a financial advisor for gig workers in India. 
Generate a friendly, actionable nudge in plain language.

Context:
- Today's income: ₹1100
- Baseline income: ₹800
- Trend: increasing
- Surplus: ₹300
- Suggested saving: ₹120
- Savings streak: 4 days
- Current resilience score: 72 (up from 67)
- Loan risk: low

Generate a 2-3 sentence nudge encouraging good behavior.
```

### Example Nudge Output

```
"Great work! Your income is ₹300 above your usual baseline today. 
You're on a 4-day savings streak—save ₹120 today to keep it going. 
Your resilience score just jumped to 72!"
```

---

## Government Scheme Matcher (Member 4)

Member 4 implements a scheme matcher based on user profile.

### Input
```javascript
{
  age: 28,
  income: 800,
  occupation: "Uber Driver",
  state: "Tamil Nadu"
}
```

### Output
```javascript
{
  eligible_schemes: [
    {
      name: "PM-SYM",
      description: "Pension scheme for unorganized workers",
      eligibility: "Age 18-40, income < ₹15,000/month",
      action_url: "https://maandhan.in"
    },
    {
      name: "e-Shram",
      description: "National database for unorganized workers",
      eligibility: "All unorganized workers",
      action_url: "https://eshram.gov.in"
    }
  ]
}
```

---

## Error Handling

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": "Error message here",
  "code": "ERROR_CODE"
}
```

### Common Error Codes
- `USER_NOT_FOUND`
- `TRANSACTION_INVALID`
- `DATABASE_ERROR`
- `FINANCE_ENGINE_ERROR`

---

## Data Validation Rules

### Transaction
- `amount`: Must be positive number
- `date`: Must be valid ISO 8601 date
- `source`: String, max 100 characters
- `user_id`: Must exist in database

### User Profile
- `age`: Integer, 18-100
- `monthly_expense`: Positive number
- `state`: Valid Indian state name
- `language`: "English" or "Tamil"

---

## Member Integration Checklist

### Member 1 (Backend)
- ✅ Implement all 8 endpoints
- ✅ Integrate Member 2's finance engine
- ✅ Persist data to MongoDB
- ✅ Error handling middleware
- ✅ Postman collection for testing

### Member 2 (Finance Engine)
- ✅ Implement 4 calculation functions
- ✅ Return exact output format specified above
- ✅ No database access (pure functions)
- ✅ Handle edge cases (empty transactions, etc.)

### Member 3 (Frontend)
- ✅ API service layer (axios/fetch)
- ✅ Dashboard calls GET /dashboard/:userId
- ✅ Transaction form calls POST /transactions
- ✅ Display all returned data
- ✅ Error handling for failed requests

### Member 4 (AI + Integration)
- ✅ AI nudge generation from nudge_context
- ✅ Government scheme matcher
- ✅ End-to-end testing
- ✅ Demo data seeding

---

## Testing Scenarios

### Scenario 1: New User Journey
1. POST /profile (create user)
2. POST /transactions (first income)
3. POST /transactions (second income)
4. GET /dashboard/:userId

### Scenario 2: Loan Risk
1. POST /loans (add loan)
2. POST /transactions (income below loan payment)
3. Check loan_risk.level = "high"

### Scenario 3: Savings Streak
1. POST /transactions (5 days in a row with surplus)
2. Check savings_pocket.streak = 5

---

## Sync Points

- **Hour 0**: API contract agreement ✅
- **Hour 3**: Backend + Finance engine integration check
- **Hour 6**: Frontend + Backend integration check
- **Hour 9**: FEATURE FREEZE

---

**Last Updated**: Sep 3, 2026  
**Owner**: Member 1 (varun)  
**Reviewers**: All members
