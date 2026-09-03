/**
 * kn.js — Kannada (ಕನ್ನಡ) translations
 * Resilience Engine UI
 */

const kn = {
  meta: {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    dir: 'ltr',
  },

  // ── Navigation ────────────────────────────────────────────────────────────
  nav: {
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    income: 'ಆದಾಯ',
    savings: 'ಉಳಿತಾಯ',
    loans: 'ಸಾಲಗಳು',
    profile: 'ಪ್ರೊಫೈಲ್',
    settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    logout: 'ಲಾಗ್ ಔಟ್',
    help: 'ಸಹಾಯ',
  },

  // ── Onboarding ────────────────────────────────────────────────────────────
  onboarding: {
    welcome: 'Resilience Engine ಗೆ ಸ್ವಾಗತ',
    subtitle: 'ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಆರ್ಥಿಕ ಸ್ಥಿತಿಸ್ಥಾಪಕತ್ವ ಸಂಗಾತಿ',
    getStarted: 'ಪ್ರಾರಂಭಿಸಿ',
    next: 'ಮುಂದೆ',
    back: 'ಹಿಂದೆ',
    finish: 'ಸೆಟಪ್ ಮುಗಿಸಿ',
    step: 'ಹಂತ {{current}} / {{total}}',

    fullName: 'ಪೂರ್ಣ ಹೆಸರು',
    fullNamePlaceholder: 'ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು ನಮೂದಿಸಿ',
    phoneNumber: 'ಫೋನ್ ನಂಬರ್',
    phoneNumberPlaceholder: 'ನಿಮ್ಮ ಫೋನ್ ನಂಬರ್ ನಮೂದಿಸಿ',
    dailyExpenses: 'ಸರಾಸರಿ ದೈನಂದಿನ ವೆಚ್ಚಗಳು (₹)',
    dailyExpensesPlaceholder: 'ಉದಾ. 500',
    occupation: 'ವೃತ್ತಿ',
    occupationPlaceholder: 'ಉದಾ. ಆಟೋ ಚಾಲಕ, ಬೀದಿ ವ್ಯಾಪಾರಿ',
    city: 'ನಗರ',
    cityPlaceholder: 'ನಿಮ್ಮ ನಗರ ನಮೂದಿಸಿ',
    preferredLanguage: 'ಆದ್ಯತೆಯ ಭಾಷೆ',

    step1Title: 'ನಿಮ್ಮ ಬಗ್ಗೆ ಹೇಳಿ',
    step1Subtitle: 'ನಿಮ್ಮ ಅನುಭವವನ್ನು ವೈಯಕ್ತಿಕಗೊಳಿಸಲು ಮೂಲ ವಿವರಗಳು',
    step2Title: 'ನಿಮ್ಮ ದೈನಂದಿನ ಹಣಕಾಸು',
    step2Subtitle: 'ನಿಮ್ಮ ಆದಾಯ ಮತ್ತು ವೆಚ್ಚಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಸಹಾಯ ಮಾಡಿ',
    step3Title: 'ಎಲ್ಲಾ ಸಿದ್ಧ!',
    step3Subtitle: 'ನಿಮ್ಮ ಸ್ಥಿತಿಸ್ಥಾಪಕತ್ವ ಯಾತ್ರೆ ಈಗ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ',
  },

  // ── Dashboard ─────────────────────────────────────────────────────────────
  dashboard: {
    title: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    greeting: 'ಶುಭ {{timeOfDay}}, {{name}}!',
    morning: 'ಬೆಳಗ್ಗೆ',
    afternoon: 'ಮಧ್ಯಾಹ್ನ',
    evening: 'ಸಂಜೆ',
    todayOverview: 'ಇಂದಿನ ಅವಲೋಕನ',
    lastUpdated: 'ಕೊನೆಯದಾಗಿ {{time}} ನಲ್ಲಿ ನವೀಕರಿಸಲಾಗಿದೆ',
    refresh: 'ರಿಫ್ರೆಶ್',
    noData: 'ಇನ್ನೂ ಡೇಟಾ ಲಭ್ಯವಿಲ್ಲ. ನಿಮ್ಮ ಆದಾಯವನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಲು ಪ್ರಾರಂಭಿಸಿ.',
  },

  // ── Income ────────────────────────────────────────────────────────────────
  income: {
    title: 'ಆದಾಯ',
    todayIncome: 'ಇಂದಿನ ಆದಾಯ',
    addIncome: 'ಆದಾಯ ಸೇರಿಸಿ',
    incomeHistory: 'ಆದಾಯ ಇತಿಹಾಸ',
    baseline: 'ಮೂಲ ರೇಖೆ (7-ದಿನ ಸರಾಸರಿ)',
    trend: 'ಪ್ರವೃತ್ತಿ',
    prediction: 'ಮುಂದಿನ ವಾರದ ಅಂದಾಜು',
    predictionRange: '₹{{low}} – ₹{{high}}',
    noHistory: 'ಇನ್ನೂ ಆದಾಯ ದಾಖಲಿಸಿಲ್ಲ.',
    addFirst: 'ನಿಮ್ಮ ಮೊದಲ ಆದಾಯ ನಮೂದು ಸೇರಿಸಿ',
    amount: 'ಮೊತ್ತ (₹)',
    amountPlaceholder: 'ಮೊತ್ತ ನಮೂದಿಸಿ',
    date: 'ದಿನಾಂಕ',
    source: 'ಮೂಲ',
    sourcePlaceholder: 'ಉದಾ. ಡ್ರೈವಿಂಗ್, ಡೆಲಿವರಿ',
    save: 'ಉಳಿಸಿ',
    cancel: 'ರದ್ದು ಮಾಡಿ',
    edit: 'ಸಂಪಾದಿಸಿ',
    delete: 'ಅಳಿಸಿ',
    confirmDelete: 'ಈ ನಮೂದನ್ನು ಅಳಿಸಲು ಬಯಸುವಿರಾ?',

    trendIncreasing: 'ಹೆಚ್ಚಾಗುತ್ತಿದೆ',
    trendStable: 'ಸ್ಥಿರ',
    trendDecreasing: 'ಕಡಿಮೆಯಾಗುತ್ತಿದೆ',
  },

  // ── Savings Pocket ────────────────────────────────────────────────────────
  savingsPocket: {
    title: 'ಉಳಿತಾಯ ಪಾಕೀಟ್',
    surplus: 'ಇಂದಿನ ಹೆಚ್ಚುವರಿ',
    suggestedSave: 'ಉಳಿಸಲು ಸೂಚಿಸಲಾಗಿದೆ',
    savingsStreak: 'ಉಳಿತಾಯ ಸ್ಟ್ರೀಕ್',
    streakDays: '{{count}} ದಿನ ಸ್ಟ್ರೀಕ್',
    streakDaysSingular: '{{count}} ದಿನ ಸ್ಟ್ರೀಕ್',
    saveNow: 'ಈಗ ಉಳಿಸಿ',
    skipToday: 'ಇಂದು ಬಿಟ್ಟುಬಿಡಿ',
    saved: 'ಉಳಿಸಲಾಗಿದೆ!',
    noSurplus: 'ಇಂದು ಹೆಚ್ಚುವರಿ ಇಲ್ಲ. ನಾಳೆ ಮುಂದುವರಿಸಿ!',
    saveReason: 'ಈ ಮೊತ್ತ ಏಕೆ?',
    viewHistory: 'ಉಳಿತಾಯ ಇತಿಹಾಸ ವೀಕ್ಷಿಸಿ',
    totalSaved: 'ಒಟ್ಟು ಉಳಿಸಿದ್ದು',
    thisWeek: 'ಈ ವಾರ',
    thisMonth: 'ಈ ತಿಂಗಳು',
  },

  // ── Rainy-Day Fund ────────────────────────────────────────────────────────
  rainyDay: {
    title: 'ತುರ್ತು ನಿಧಿ',
    target: 'ಗುರಿ',
    current: 'ಪ್ರಸ್ತುತ',
    progress: 'ಪ್ರಗತಿ',
    progressPercent: '{{percent}}% ಹಣ ಸಂಗ್ರಹಿಸಲಾಗಿದೆ',
    targetDays: '{{days}}-ದಿನ ರಕ್ಷಣೆ',
    daysToTarget: 'ಗುರಿಗೆ {{days}} ದಿನಗಳು',
    fundComplete: 'ನಿಧಿ ಪೂರ್ಣ! ನೀವು ಸುರಕ್ಷಿತರಾಗಿದ್ದೀರಿ.',
    addToFund: 'ನಿಧಿಗೆ ಸೇರಿಸಿ',
    fundDescription: '{{days}} ದಿನಗಳ ವೆಚ್ಚಗಳನ್ನು ಒಳಗೊಳ್ಳುತ್ತದೆ (₹{{amount}}/ದಿನ)',
  },

  // ── Resilience Score ──────────────────────────────────────────────────────
  resilienceScore: {
    title: 'ಸ್ಥಿತಿಸ್ಥಾಪಕತ್ವ ಸ್ಕೋರ್',
    score: 'ಸ್ಕೋರ್',
    outOf: '100 ರಲ್ಲಿ',
    change: 'ಈ ವಾರ {{direction}} {{points}} ಅಂಕಗಳು',
    improved: 'ಸುಧಾರಿಸಿದೆ',
    dropped: 'ಕುಸಿದಿದೆ',
    unchanged: 'ಬದಲಾಗಿಲ್ಲ',
    factors: 'ಸ್ಕೋರ್ ಅಂಶಗಳು',
    positive: 'ಶಕ್ತಿಗಳು',
    negative: 'ಸುಧಾರಿಸಬೇಕಾದ ಕ್ಷೇತ್ರಗಳು',
    volatility: 'ಆದಾಯ ಸ್ಥಿರತೆ',
    trend: 'ಆದಾಯ ಪ್ರವೃತ್ತಿ',
    savingsStreak: 'ಉಳಿತಾಯ ನಿರಂತರತೆ',
    bufferProgress: 'ತುರ್ತು ನಿಧಿ',
    debtBurden: 'ಸಾಲದ ಹೊರೆ',
    excellent: 'ಅತ್ಯುತ್ತಮ',
    good: 'ಒಳ್ಳೆಯದು',
    fair: 'ಸರಿ',
    poor: 'ಗಮನ ಅಗತ್ಯ',
  },

  // ── Loan Risk ─────────────────────────────────────────────────────────────
  loanRisk: {
    title: 'ಸಾಲ ಅಪಾಯ',
    level: 'ಅಪಾಯ ಮಟ್ಟ',
    activeLoans: 'ಸಕ್ರಿಯ ಸಾಲಗಳು',
    low: 'ಕಡಿಮೆ',
    medium: 'ಮಧ್ಯಮ',
    high: 'ಹೆಚ್ಚು',
    lowDescription: 'ನಿಮ್ಮ ಸಾಲದ ಹೊರೆ ನಿರ್ವಹಿಸಬಹುದಾದದ್ದು.',
    mediumDescription: 'ಹೊಸ ಸಾಲ ತೆಗೆದುಕೊಳ್ಳುವ ಮೊದಲು ಅಸ್ತಿತ್ವದಲ್ಲಿರುವ ಸಾಲಗಳನ್ನು ಮರುಪಾವತಿಸಲು ಪರಿಗಣಿಸಿ.',
    highDescription: 'ಹೆಚ್ಚಿನ ಸಾಲಗಳು ನಿಮ್ಮ ಸ್ಥಿತಿಸ್ಥಾಪಕತ್ವವನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತಿವೆ. ಮರುಪಾವತಿಗೆ ಆದ್ಯತೆ ನೀಡಿ.',
    addLoan: 'ಸಾಲ ಸೇರಿಸಿ',
    noLoans: 'ಸಕ್ರಿಯ ಸಾಲಗಳಿಲ್ಲ. ಅದ್ಭುತ!',
    loanAmount: 'ಸಾಲ ಮೊತ್ತ (₹)',
    lender: 'ಸಾಲದಾತ',
    dueDate: 'ಮುಕ್ತಾಯ ದಿನಾಂಕ',
    emi: 'ಮಾಸಿಕ EMI (₹)',
  },

  // ── AI Nudge ──────────────────────────────────────────────────────────────
  aiNudge: {
    title: 'AI ಸಲಹೆ',
    loading: 'ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಒಳನೋಟ ರಚಿಸಲಾಗುತ್ತಿದೆ…',
    error: 'ಒಳನೋಟ ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    retry: 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ',
    poweredBy: 'AI ಮೂಲಕ ನಡೆಸಲಾಗುತ್ತಿದೆ',
    nudgeLabel: 'ಇಂದಿನ ಒಳನೋಟ',
    dismiss: 'ವಜಾ ಮಾಡಿ',
    helpful: 'ಉಪಯೋಗಕರ',
    notHelpful: 'ಉಪಯೋಗಕರವಲ್ಲ',
  },

  // ── Common / Shared ───────────────────────────────────────────────────────
  common: {
    loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ…',
    error: 'ಏನೋ ತಪ್ಪಾಗಿದೆ.',
    retry: 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ',
    save: 'ಉಳಿಸಿ',
    cancel: 'ರದ್ದು ಮಾಡಿ',
    confirm: 'ದೃಢೀಕರಿಸಿ',
    delete: 'ಅಳಿಸಿ',
    edit: 'ಸಂಪಾದಿಸಿ',
    close: 'ಮುಚ್ಚಿ',
    back: 'ಹಿಂದೆ',
    next: 'ಮುಂದೆ',
    done: 'ಮುಗಿದಿದೆ',
    yes: 'ಹೌದು',
    no: 'ಇಲ್ಲ',
    of: 'ರಲ್ಲಿ',
    currency: '₹',
    days: 'ದಿನಗಳು',
    day: 'ದಿನ',
    week: 'ವಾರ',
    month: 'ತಿಂಗಳು',
    today: 'ಇಂದು',
    yesterday: 'ನಿನ್ನೆ',
    selectLanguage: 'ಭಾಷೆ ಆಯ್ಕೆ ಮಾಡಿ',
    language: 'ಭಾಷೆ',
    noResults: 'ಫಲಿತಾಂಶಗಳು ಕಂಡುಬಂದಿಲ್ಲ.',
    viewAll: 'ಎಲ್ಲವನ್ನೂ ವೀಕ್ಷಿಸಿ',
    showLess: 'ಕಡಿಮೆ ತೋರಿಸಿ',
    optional: 'ಐಚ್ಛಿಕ',
    required: 'ಅಗತ್ಯ',
  },

  // ── Volatility labels ─────────────────────────────────────────────────────
  volatility: {
    low: 'ಕಡಿಮೆ ಏರಿಳಿತ',
    medium: 'ಮಧ್ಯಮ ಏರಿಳಿತ',
    high: 'ಹೆಚ್ಚಿನ ಏರಿಳಿತ',
  },

  // ── Errors / Validation ───────────────────────────────────────────────────
  errors: {
    required: 'ಈ ಕ್ಷೇತ್ರ ಅಗತ್ಯ.',
    invalidAmount: 'ದಯವಿಟ್ಟು ಮಾನ್ಯ ಮೊತ್ತ ನಮೂದಿಸಿ.',
    invalidPhone: 'ದಯವಿಟ್ಟು ಮಾನ್ಯ ಫೋನ್ ನಂಬರ್ ನಮೂದಿಸಿ.',
    networkError: 'ನೆಟ್‌ವರ್ಕ್ ದೋಷ. ನಿಮ್ಮ ಸಂಪರ್ಕ ಪರಿಶೀಲಿಸಿ.',
    serverError: 'ಸರ್ವರ್ ದೋಷ. ದಯವಿಟ್ಟು ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    sessionExpired: 'ನಿಮ್ಮ ಸೆಷನ್ ಮುಕ್ತಾಯವಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಲಾಗಿನ್ ಮಾಡಿ.',
  },
};

export default kn;
