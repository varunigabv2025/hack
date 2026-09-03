/**
 * Member 4 — Deterministic demo dataset (3–5 workers).
 * Repeatable for judge walkthrough. Amounts are INR integers.
 */

const demoProfiles = [
  {
    id: 'U001',
    name: 'Arjun',
    occupation: 'Uber',
    state: 'Tamil Nadu',
    essential_expenses: 800,
    story: 'Main demo — surplus day lifts score 67 → 72',
    transactions: [
      { date: '2026-08-31', source: 'Zomato', amount: 950 },
      { date: '2026-09-01', source: 'Uber', amount: 650 },
      { date: '2026-09-02', source: 'Swiggy', amount: 850 },
      { date: '2026-09-03', source: 'Uber', amount: 1100 },
    ],
    expectedAfterLast: {
      baseline: 800,
      today: 1100,
      surplus: 300,
      suggested: 120,
      streak: 4,
      score: 72,
      previousScore: 67,
      change: 5,
      trend: 'UP',
    },
  },
  {
    id: 'U002',
    name: 'Meena',
    occupation: 'Swiggy',
    state: 'Karnataka',
    essential_expenses: 700,
    story: 'Stable earner — small surplus, steady streak',
    transactions: [
      { date: '2026-08-31', source: 'Swiggy', amount: 720 },
      { date: '2026-09-01', source: 'Swiggy', amount: 740 },
      { date: '2026-09-02', source: 'Swiggy', amount: 710 },
      { date: '2026-09-03', source: 'Swiggy', amount: 780 },
    ],
    expectedAfterLast: {
      baseline: 730,
      today: 780,
      surplus: 50,
      suggested: 20,
      streak: 3,
      score: 68,
      previousScore: 66,
      change: 2,
      trend: 'STABLE',
    },
  },
  {
    id: 'U003',
    name: 'Ravi',
    occupation: 'Ola',
    state: 'Telangana',
    essential_expenses: 900,
    story: 'Soft week — lower income, protect essentials',
    transactions: [
      { date: '2026-08-31', source: 'Ola', amount: 900 },
      { date: '2026-09-01', source: 'Ola', amount: 820 },
      { date: '2026-09-02', source: 'Ola', amount: 700 },
      { date: '2026-09-03', source: 'Ola', amount: 550 },
    ],
    expectedAfterLast: {
      baseline: 840,
      today: 550,
      surplus: 0,
      suggested: 0,
      streak: 0,
      score: 58,
      previousScore: 63,
      change: -5,
      trend: 'DOWN',
    },
  },
  {
    id: 'U004',
    name: 'Priya',
    occupation: 'Zomato',
    state: 'Maharashtra',
    essential_expenses: 750,
    story: 'Volatile week — high then low earnings',
    transactions: [
      { date: '2026-08-31', source: 'Zomato', amount: 1200 },
      { date: '2026-09-01', source: 'Zomato', amount: 480 },
      { date: '2026-09-02', source: 'Zomato', amount: 1100 },
      { date: '2026-09-03', source: 'Zomato', amount: 600 },
    ],
    expectedAfterLast: {
      baseline: 845,
      today: 600,
      surplus: 0,
      suggested: 0,
      streak: 1,
      score: 61,
      previousScore: 64,
      change: -3,
      trend: 'DOWN',
    },
  },
  {
    id: 'U005',
    name: 'Karthik',
    occupation: 'Uber',
    state: 'Tamil Nadu',
    essential_expenses: 850,
    story: 'Strong buffer builder — multi-day surplus',
    transactions: [
      { date: '2026-08-30', source: 'Uber', amount: 1000 },
      { date: '2026-08-31', source: 'Uber', amount: 1050 },
      { date: '2026-09-01', source: 'Uber', amount: 980 },
      { date: '2026-09-02', source: 'Swiggy', amount: 900 },
      { date: '2026-09-03', source: 'Uber', amount: 1250 },
    ],
    expectedAfterLast: {
      baseline: 980,
      today: 1250,
      surplus: 270,
      suggested: 110,
      streak: 5,
      score: 78,
      previousScore: 74,
      change: 4,
      trend: 'UP',
    },
  },
]

function getDemoProfile(id = 'U001') {
  return demoProfiles.find((p) => p.id === id) || demoProfiles[0]
}

module.exports = { demoProfiles, getDemoProfile }
