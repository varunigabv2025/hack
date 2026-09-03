/**
 * en.js — English translations
 * Resilience Engine UI
 *
 * Keys are organised by feature area. Keep this file as the source of truth
 * when adding new keys — all other language files must mirror this structure.
 */

const en = {
  meta: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    dir: 'ltr',
  },

  // ── Navigation ────────────────────────────────────────────────────────────
  nav: {
    dashboard: 'Dashboard',
    income: 'Income',
    savings: 'Savings',
    loans: 'Loans',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
    help: 'Help',
  },

  // ── Onboarding ────────────────────────────────────────────────────────────
  onboarding: {
    welcome: 'Welcome to Resilience Engine',
    subtitle: 'Your personal financial resilience companion',
    getStarted: 'Get Started',
    next: 'Next',
    back: 'Back',
    finish: 'Finish Setup',
    step: 'Step {{current}} of {{total}}',

    // Fields
    fullName: 'Full Name',
    fullNamePlaceholder: 'Enter your full name',
    phoneNumber: 'Phone Number',
    phoneNumberPlaceholder: 'Enter your phone number',
    dailyExpenses: 'Average Daily Expenses (₹)',
    dailyExpensesPlaceholder: 'e.g. 500',
    occupation: 'Occupation',
    occupationPlaceholder: 'e.g. Auto Driver, Street Vendor',
    city: 'City',
    cityPlaceholder: 'Enter your city',
    preferredLanguage: 'Preferred Language',

    // Steps
    step1Title: 'Tell us about yourself',
    step1Subtitle: 'Basic details to personalise your experience',
    step2Title: 'Your daily finances',
    step2Subtitle: 'Help us understand your income and expenses',
    step3Title: 'You\'re all set!',
    step3Subtitle: 'Your resilience journey starts now',
  },

  // ── Dashboard ─────────────────────────────────────────────────────────────
  dashboard: {
    title: 'Dashboard',
    greeting: 'Good {{timeOfDay}}, {{name}}!',
    morning: 'morning',
    afternoon: 'afternoon',
    evening: 'evening',
    todayOverview: 'Today\'s Overview',
    lastUpdated: 'Last updated {{time}}',
    refresh: 'Refresh',
    noData: 'No data available yet. Start tracking your income.',
  },

  // ── Income ────────────────────────────────────────────────────────────────
  income: {
    title: 'Income',
    todayIncome: 'Today\'s Income',
    addIncome: 'Add Income',
    incomeHistory: 'Income History',
    baseline: 'Baseline (7-day avg)',
    trend: 'Trend',
    prediction: 'Next Week Estimate',
    predictionRange: '₹{{low}} – ₹{{high}}',
    noHistory: 'No income recorded yet.',
    addFirst: 'Add your first income entry',
    amount: 'Amount (₹)',
    amountPlaceholder: 'Enter amount',
    date: 'Date',
    source: 'Source',
    sourcePlaceholder: 'e.g. Driving, Delivery',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    confirmDelete: 'Are you sure you want to delete this entry?',

    // Trend labels
    trendIncreasing: 'Increasing',
    trendStable: 'Stable',
    trendDecreasing: 'Decreasing',
  },

  // ── Savings Pocket ────────────────────────────────────────────────────────
  savingsPocket: {
    title: 'Savings Pocket',
    surplus: 'Today\'s Surplus',
    suggestedSave: 'Suggested to Save',
    savingsStreak: 'Savings Streak',
    streakDays: '{{count}} day streak',
    streakDaysSingular: '{{count}} day streak',
    saveNow: 'Save Now',
    skipToday: 'Skip Today',
    saved: 'Saved!',
    noSurplus: 'No surplus today. Keep it up tomorrow!',
    saveReason: 'Why this amount?',
    viewHistory: 'View Savings History',
    totalSaved: 'Total Saved',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
  },

  // ── Rainy-Day Fund ────────────────────────────────────────────────────────
  rainyDay: {
    title: 'Rainy-Day Fund',
    target: 'Target',
    current: 'Current',
    progress: 'Progress',
    progressPercent: '{{percent}}% funded',
    targetDays: '{{days}}-day cover',
    daysToTarget: '{{days}} days to goal',
    fundComplete: 'Fund complete! You\'re protected.',
    addToFund: 'Add to Fund',
    fundDescription: 'Covers {{days}} days of expenses (₹{{amount}}/day)',
  },

  // ── Resilience Score ──────────────────────────────────────────────────────
  resilienceScore: {
    title: 'Resilience Score',
    score: 'Score',
    outOf: 'out of 100',
    change: '{{direction}} {{points}} pts this week',
    improved: 'Improved',
    dropped: 'Dropped',
    unchanged: 'Unchanged',
    factors: 'Score Factors',
    positive: 'Strengths',
    negative: 'Areas to Improve',
    volatility: 'Income Stability',
    trend: 'Income Trend',
    savingsStreak: 'Savings Consistency',
    bufferProgress: 'Emergency Fund',
    debtBurden: 'Debt Burden',
    excellent: 'Excellent',
    good: 'Good',
    fair: 'Fair',
    poor: 'Needs Attention',
  },

  // ── Loan Risk ─────────────────────────────────────────────────────────────
  loanRisk: {
    title: 'Loan Risk',
    level: 'Risk Level',
    activeLoans: 'Active Loans',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    lowDescription: 'Your debt burden is manageable.',
    mediumDescription: 'Consider paying down existing loans before taking new ones.',
    highDescription: 'High loan count is reducing your resilience. Prioritise repayment.',
    addLoan: 'Add Loan',
    noLoans: 'No active loans. Great!',
    loanAmount: 'Loan Amount (₹)',
    lender: 'Lender',
    dueDate: 'Due Date',
    emi: 'Monthly EMI (₹)',
  },

  // ── AI Nudge ──────────────────────────────────────────────────────────────
  aiNudge: {
    title: 'AI Nudge',
    loading: 'Generating your personalised insight…',
    error: 'Could not load insight. Try again.',
    retry: 'Retry',
    poweredBy: 'Powered by AI',
    nudgeLabel: 'Today\'s Insight',
    dismiss: 'Dismiss',
    helpful: 'Helpful',
    notHelpful: 'Not Helpful',
  },

  // ── Common / Shared ───────────────────────────────────────────────────────
  common: {
    loading: 'Loading…',
    error: 'Something went wrong.',
    retry: 'Try Again',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    done: 'Done',
    yes: 'Yes',
    no: 'No',
    of: 'of',
    currency: '₹',
    days: 'days',
    day: 'day',
    week: 'week',
    month: 'month',
    today: 'Today',
    yesterday: 'Yesterday',
    selectLanguage: 'Select Language',
    language: 'Language',
    noResults: 'No results found.',
    viewAll: 'View All',
    showLess: 'Show Less',
    optional: 'optional',
    required: 'required',
  },

  // ── Volatility labels ─────────────────────────────────────────────────────
  volatility: {
    low: 'Low Volatility',
    medium: 'Moderate Volatility',
    high: 'High Volatility',
  },

  // ── Errors / Validation ───────────────────────────────────────────────────
  errors: {
    required: 'This field is required.',
    invalidAmount: 'Please enter a valid amount.',
    invalidPhone: 'Please enter a valid phone number.',
    networkError: 'Network error. Please check your connection.',
    serverError: 'Server error. Please try again later.',
    sessionExpired: 'Your session has expired. Please log in again.',
  },
};

export default en;
