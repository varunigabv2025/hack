🛡️ Resilience Engine

Turning irregular income into measurable financial resilience.

Resilience Engine is a fintech platform designed to help gig workers, freelancers, delivery partners, drivers, and other users with irregular income understand and improve their financial resilience.

Instead of looking only at how much a person earns, Resilience Engine analyzes their income patterns, savings behaviour, resilience, and loan exposure to provide meaningful financial insights and simple, actionable guidance.

🎯 The Problem

Traditional financial systems are often designed around people with:

Fixed monthly salaries
Predictable income
Stable employment
Conventional credit histories

But gig workers and informal workers may experience significant income fluctuations.

For example:

Monday       ₹900
Tuesday      ₹1,400
Wednesday    ₹650
Thursday     ₹1,100
Friday       ₹500

A simple monthly income figure does not capture the user's actual financial stability.

Resilience Engine asks:
How stable is the user's income?
Is their income increasing or decreasing?
How much can they safely save?
How financially resilient are they?
Is there potential loan-stacking risk?
What simple financial action could help them?
💡 Our Solution

Resilience Engine converts everyday income activity into understandable financial intelligence.

Income
  ↓
Income Pattern Analysis
  ↓
Savings Intelligence
  ↓
Resilience Score
  ↓
Loan Risk Analysis
  ↓
AI Financial Nudge
  ↓
Personalized Dashboard

The platform combines a modern web interface, secure authentication, persistent data storage, financial processing, and AI-assisted guidance.

✨ Key Features
🔐 Real Authentication

Secure user authentication with:

User registration
Login and logout
Password hashing
JWT authentication
HTTP-only cookies
Protected routes
User authorization
User-specific data
💰 Income Tracking

Users can record their income with:

Income amount
Income source
Date

Supported sources include options such as:

Uber
Swiggy
Ola
Zomato
Cash
Other

The application checks whether income has already been recorded for the current day.

Login
  ↓
Check today's income
  ↓
 ┌───────────────┐
 │ Income exists?│
 └───────┬───────┘
       Yes   No
        ↓     ↓
    Dashboard  Income Setup

This prevents unnecessary duplicate daily income entry.

📊 Income Intelligence

The platform analyzes income history to understand financial patterns.

Key indicators include:

Income baseline
Income volatility
Income consistency
Income trend
Recent income behaviour
Income History
      ↓
Income Analysis
      ↓
┌──────────┬───────────┬───────────┐
│ Baseline │ Volatility│   Trend   │
└──────────┴───────────┴───────────┘
🏦 Savings Pocket

The platform provides savings intelligence based on the user's financial situation.

It considers factors such as:

Safe-to-save amount
Savings behaviour
Savings streak
Available surplus

The objective is to encourage users to gradually build a financial buffer rather than assuming they can save a fixed amount every day.

📈 Resilience Score

Resilience Engine provides a simple 0–100 Resilience Score.

The score reflects financial factors such as:

Income stability
Income trend
Savings behaviour
Income Stability
       +
Income Trend
       +
Savings Behaviour
       ↓
Resilience Score
     0 – 100

This gives users an easy way to understand their overall financial resilience.

⚠️ Loan Risk Analysis

Users may rely on multiple loans during periods of irregular income.

Resilience Engine includes loan-risk analysis based on active loan behaviour and potential loan-stacking exposure.

This provides another dimension of financial awareness beyond income alone.

🤖 AI Financial Nudges

AI is used to transform financial information into simple, understandable guidance.

The architecture separates financial calculations from AI-generated explanations:

User Data
   ↓
Backend Financial Engine
   ↓
Financial Facts
   ↓
Minimal AI Context
   ↓
AI
   ↓
Plain-Language Nudge

The backend remains responsible for core financial calculations.

AI helps communicate those results in a way that is easier for users to understand.

📊 Financial Dashboard

The dashboard brings the user's financial information together in one place.

It can display:

Today's income
Income baseline
Income trend
Income history
Savings information
Savings streak
Resilience Score
Loan risk
AI financial nudges
Recent financial activity
🌍 Language & Currency Support

The application includes user-facing support for:

Language selection
Currency selection
Localized financial display

Financial values remain numeric internally while formatting is handled at the presentation layer.

🔄 Complete User Journey
                    ┌───────────────┐
                    │    Landing    │
                    └───────┬───────┘
                            ↓
                    ┌───────────────┐
                    │ Register/Login│
                    └───────┬───────┘
                            ↓
                 ┌─────────────────────┐
                 │ Check Today's Income│
                 └──────────┬──────────┘
                            ↓
                     ┌──────┴──────┐
                     │             │
                    Yes            No
                     │             │
                     ↓             ↓
                 Dashboard    Income Setup
                                   ↓
                            Record Income
                                   ↓
                              MongoDB
                                   ↓
                           Finance Engine
                                   ↓
                 ┌─────────────────┼─────────────────┐
                 ↓                 ↓                 ↓
          Income Analysis      Savings          Loan Risk
                 │                 │                 │
                 └─────────────────┼─────────────────┘
                                   ↓
                            Resilience Score
                                   ↓
                               AI Nudge
                                   ↓
                              Dashboard
🧠 Financial Processing Pipeline
Transaction
     ↓
Validation
     ↓
Persistence
     ↓
Transaction History
     ↓
Income Analysis
     ↓
Savings Calculation
     ↓
Resilience Score
     ↓
Loan Risk
     ↓
AI Nudge Context
     ↓
Financial Nudge
     ↓
Dashboard
🏗️ System Architecture
┌─────────────────────────────────────────────┐
│                  FRONTEND                   │
│                                             │
│ React + Vite + Tailwind CSS + Recharts      │
│                                             │
│ Login → Income → Dashboard → Insights      │
└──────────────────────┬──────────────────────┘
                       │
                       │ REST API
                       ↓
┌─────────────────────────────────────────────┐
│                  BACKEND                    │
│                                             │
│ Node.js + Express                           │
│                                             │
│ Authentication                              │
│ Authorization                               │
│ Controllers                                 │
│ Services                                    │
│ Financial Pipeline                          │
└───────────────┬─────────────────┬───────────┘
                │                 │
                ↓                 ↓
       ┌────────────────┐  ┌────────────────┐
       │    MongoDB     │  │   AI Service   │
       │                │  │                │
       │ Users          │  │ Financial      │
       │ Transactions   │  │ Nudges         │
       │ Loans          │  │                │
       │ Profiles       │  │ Derived Facts  │
       └────────────────┘  └────────────────┘
🛠️ Technology Stack
Category	Technologies
Frontend	React, Vite
Styling	Tailwind CSS
Routing	React Router
Animations	Framer Motion
Charts	Recharts
Icons	Lucide React
Backend	Node.js, Express.js
Database	MongoDB, MongoDB Atlas
ODM	Mongoose
Authentication	JWT, HTTP-only Cookies
Password Security	bcrypt / bcryptjs
AI	OpenAI API
Testing	Postman, Browser DevTools
Version Control	Git, GitHub
📁 Project Structure
hack/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── ...
│   ├── package.json
│   └── ...
│
└── README.md
🔑 Authentication
Registration
Registration Form
       ↓
POST /api/auth/register
       ↓
Validate User
       ↓
Hash Password
       ↓
Create User
       ↓
JWT Authentication
       ↓
HTTP-only Cookie
       ↓
Authenticated Session
Login
Login Form
    ↓
POST /api/auth/login
    ↓
Verify Credentials
    ↓
Generate JWT
    ↓
HTTP-only Cookie
    ↓
Protected Application
Logout
Logout
  ↓
POST /api/auth/logout
  ↓
Clear Authentication
  ↓
Login Page
🔒 Security

Resilience Engine handles financial information, so security is an important part of the architecture.

Implemented
Password hashing
JWT authentication
HTTP-only cookies
Protected frontend routes
Backend authentication middleware
User authorization
User-specific data access
Server-side database access
Environment variables for secrets
Separation of financial calculations and AI-generated explanations
Sensitive information

The application should never request or store highly sensitive credentials such as:

UPI PIN
ATM PIN
CVV
Banking passwords
Card PINs
Production Considerations

This is a hackathon/MVP implementation. A production financial platform would additionally require measures such as:

HTTPS everywhere
Rate limiting
Password recovery
Email verification
Multi-factor authentication
Security monitoring
Audit logging
Encryption and key management
Database backup and recovery systems
🔌 API Reference
Authentication
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Authenticate a user
POST	/api/auth/logout	Log out the current user
GET	/api/auth/me	Retrieve authenticated user
Profile
Method	Endpoint	Description
POST	/api/profile	Create/update profile
GET	/api/profile/:userId	Retrieve profile
Transactions
Method	Endpoint	Description
POST	/api/transactions	Record an income transaction
GET	/api/transactions/:userId	Retrieve transaction history
Loans
Method	Endpoint	Description
POST	/api/loans	Record a loan
GET	/api/loans/:userId	Retrieve user loans
Dashboard
Method	Endpoint	Description
GET	/api/dashboard/:userId	Retrieve financial dashboard data
Health
Method	Endpoint	Description
GET	/api/health	Check backend availability
🗄️ Data Persistence

MongoDB is used to persist application data.

The backend uses Mongoose for database interaction.

Core entities include:

User
  │
  ├── Transactions
  │
  ├── Loans
  │
  └── Financial Profile

Transaction processing follows:

Frontend
   ↓
REST API
   ↓
Express
   ↓
Validation
   ↓
MongoDB
   ↓
Financial Pipeline
   ↓
Dashboard
🚀 Getting Started
Prerequisites

Make sure the following are installed:

Node.js
npm
MongoDB Atlas account or MongoDB instance
Git
1. Clone the Repository
git clone https://github.com/varunigabv2025/hack.git
cd hack
2. Backend Setup
cd backend
npm install

Create a .env file inside the backend directory:

PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
OPENAI_API_KEY=your_openai_api_key

Never commit .env or real credentials to GitHub.

Start the backend:

npm run dev
3. Frontend Setup

Open another terminal:

cd frontend
npm install

Create the frontend environment file:

VITE_API_URL=http://localhost:5000/api

Start the frontend:

npm run dev

Open the local Vite URL shown in the terminal.

🧪 Testing

The project includes testing and verification across important application flows.

Areas verified include:

User registration
User login
Authentication
Logout
Protected routes
User isolation
Income onboarding
Daily income checking
Transaction persistence
Dashboard data
Financial calculations
Savings
Resilience scoring
Loan risk
AI nudges
Page refresh persistence
Direct navigation
Currency handling
Language handling
Responsive UI
📌 Example Financial Flow

Consider a user whose daily income is:

₹900
₹1,200
₹650
₹1,100
₹800
₹1,400
₹700

Instead of simply calculating total earnings, Resilience Engine looks at the pattern.

Income History
      ↓
Baseline
      ↓
Volatility & Consistency
      ↓
Income Trend
      ↓
Savings Intelligence
      ↓
Resilience Score
      ↓
Loan Risk
      ↓
Personalized Nudge

This creates a broader picture of financial resilience.

🌱 Future Enhancements

Potential future improvements include:

Bank statement integration
Automated transaction import
OCR-based financial document processing
Expense categorization
Password reset
Email verification
Two-factor authentication
Push notifications
Advanced financial analytics
Mobile application
More personalized financial planning
🏆 Why Resilience Engine?

Resilience Engine focuses on a financial problem that conventional systems can overlook: income instability.

The project combines:

Financial Intelligence

Understanding income patterns instead of looking only at total earnings.

Predictive Savings

Helping users build financial buffers according to their income situation.

Resilience Measurement

Converting financial behaviour into an understandable 0–100 score.

Risk Awareness

Highlighting potential loan-stacking exposure.

AI Assistance

Turning financial facts into simple, human-readable guidance.

Secure Architecture

Using backend authentication, authorization, password hashing, and persistent user-specific data.

👥 Team

Resilience Engine is a collaborative hackathon project.

Contributions
Member 1 — Backend, database integration, core pipeline, authentication, income onboarding
Member 2 — Financial calculation engine
Member 3 — Dashboard and frontend experience
Member 4 — AI nudges, government schemes, demo/presentation integration
<img width="944" height="497" alt="image" src="https://github.com/user-attachments/assets/544c305c-ea2a-4945-b641-34846bcd4fb7" />
<img width="950" height="494" alt="image" src="https://github.com/user-attachments/assets/0e2772ba-7228-400a-ad78-b9c1c6fcbb94" />
<img width="945" height="497" alt="image" src="https://github.com/user-attachments/assets/7142f70a-84f3-4b9a-8145-55e908ad5d43" />
<img width="940" height="497" alt="image" src="https://github.com/user-attachments/assets/419e7418-61a9-4243-b168-ac78aba147b7" />
<img width="954" height="500" alt="image" src="https://github.com/user-attachments/assets/def67aaa-0b1c-4ad0-bf42-e9c06045dc3f" />
<img width="944" height="508" alt="image" src="https://github.com/user-attachments/assets/ee39db24-a919-4135-8aeb-b4f21c8c5860" />
<img width="958" height="502" alt="image" src="https://github.com/user-attachments/assets/e3c2dcc7-74a7-4c7c-a7d0-3419f9a3192c" />
<img width="956" height="500" alt="image" src="https://github.com/user-attachments/assets/936684b3-1437-4131-9eb7-9a354af046d0" />
<img width="956" height="503" alt="image" src="https://github.com/user-attachments/assets/d79038e7-911c-4b95-840c-fd4677cdebb6" />






🔮 Vision

Financial resilience should not depend on having a fixed salary.

Resilience Engine aims to make financial intelligence more accessible to people whose income does not follow traditional patterns.

By combining income intelligence, savings behaviour, resilience measurement, risk awareness, and understandable guidance, the platform helps users move from simply tracking income to understanding their financial resilience.

📄 License

This project is developed as a hackathon project.

If a formal open-source license is added to the repository, this section should be updated accordingly.
