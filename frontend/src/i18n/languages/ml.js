/**
 * ml.js — Malayalam (മലയാളം) translations
 * Resilience Engine UI
 */

const ml = {
  meta: {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    dir: 'ltr',
  },

  // ── Navigation ────────────────────────────────────────────────────────────
  nav: {
    dashboard: 'ഡാഷ്‌ബോർഡ്',
    income: 'വരുമാനം',
    savings: 'സമ്പാദ്യം',
    loans: 'വായ്പകൾ',
    profile: 'പ്രൊഫൈൽ',
    settings: 'ക്രമീകരണങ്ങൾ',
    logout: 'ലോഗ് ഔട്ട്',
    help: 'സഹായം',
  },

  // ── Onboarding ────────────────────────────────────────────────────────────
  onboarding: {
    welcome: 'Resilience Engine-ലേക്ക് സ്വാഗതം',
    subtitle: 'നിങ്ങളുടെ വ്യക്തിഗത സാമ്പത്തിക പ്രതിരോധ കൂട്ടാളി',
    getStarted: 'ആരംഭിക്കുക',
    next: 'അടുത്തത്',
    back: 'തിരികെ',
    finish: 'സജ്ജീകരണം പൂർത്തിയാക്കുക',
    step: 'ഘട്ടം {{current}} / {{total}}',

    fullName: 'പൂർണ്ണ നാമം',
    fullNamePlaceholder: 'നിങ്ങളുടെ പൂർണ്ണ നാമം നൽകുക',
    phoneNumber: 'ഫോൺ നമ്പർ',
    phoneNumberPlaceholder: 'നിങ്ങളുടെ ഫോൺ നമ്പർ നൽകുക',
    dailyExpenses: 'ശരാശരി ദൈനംദിന ചെലവുകൾ (₹)',
    dailyExpensesPlaceholder: 'ഉദാ. 500',
    occupation: 'തൊഴിൽ',
    occupationPlaceholder: 'ഉദാ. ഓട്ടോ ഡ്രൈവർ, തെരുവ് കച്ചവടക്കാരൻ',
    city: 'നഗരം',
    cityPlaceholder: 'നിങ്ങളുടെ നഗരം നൽകുക',
    preferredLanguage: 'ഇഷ്ടപ്പെട്ട ഭാഷ',

    step1Title: 'നിങ്ങളെ കുറിച്ച് പറയൂ',
    step1Subtitle: 'നിങ്ങളുടെ അനുഭവം വ്യക്തിഗതമാക്കാൻ അടിസ്ഥാന വിശദാംശങ്ങൾ',
    step2Title: 'നിങ്ങളുടെ ദൈനംദിന സാമ്പത്തിക കാര്യങ്ങൾ',
    step2Subtitle: 'നിങ്ങളുടെ വരുമാനവും ചെലവുകളും മനസ്സിലാക്കാൻ സഹായിക്കുക',
    step3Title: 'എല്ലാം തയ്യാർ!',
    step3Subtitle: 'നിങ്ങളുടെ പ്രതിരോധ യാത്ര ഇപ്പോൾ ആരംഭിക്കുന്നു',
  },

  // ── Dashboard ─────────────────────────────────────────────────────────────
  dashboard: {
    title: 'ഡാഷ്‌ബോർഡ്',
    greeting: 'ശുഭ {{timeOfDay}}, {{name}}!',
    morning: 'പ്രഭാതം',
    afternoon: 'ഉച്ചതിരിഞ്ഞ്',
    evening: 'സന്ധ്യ',
    todayOverview: 'ഇന്നത്തെ അവലോകനം',
    lastUpdated: 'അവസാനം {{time}} ന് അപ്ഡേറ്റ് ചെയ്തു',
    refresh: 'പുതുക്കുക',
    noData: 'ഇതുവരെ ഡേറ്റ ലഭ്യമല്ല. നിങ്ങളുടെ വരുമാനം ട്രാക്ക് ചെയ്യാൻ ആരംഭിക്കുക.',
  },

  // ── Income ────────────────────────────────────────────────────────────────
  income: {
    title: 'വരുമാനം',
    todayIncome: 'ഇന്നത്തെ വരുമാനം',
    addIncome: 'വരുമാനം ചേർക്കുക',
    incomeHistory: 'വരുമാന ചരിത്രം',
    baseline: 'അടിസ്ഥാനരേഖ (7-ദിവസ ശരാശരി)',
    trend: 'പ്രവണത',
    prediction: 'അടുത്ത ആഴ്ചത്തെ കണക്കുകൂട്ടൽ',
    predictionRange: '₹{{low}} – ₹{{high}}',
    noHistory: 'ഇതുവരെ വരുമാനം രേഖപ്പെടുത്തിയിട്ടില്ല.',
    addFirst: 'നിങ്ങളുടെ ആദ്യ വരുമാന എൻട്രി ചേർക്കുക',
    amount: 'തുക (₹)',
    amountPlaceholder: 'തുക നൽകുക',
    date: 'തീയതി',
    source: 'ഉറവിടം',
    sourcePlaceholder: 'ഉദാ. ഡ്രൈവിംഗ്, ഡെലിവറി',
    save: 'സംരക്ഷിക്കുക',
    cancel: 'റദ്ദാക്കുക',
    edit: 'തിരുത്തുക',
    delete: 'ഇല്ലാതാക്കുക',
    confirmDelete: 'ഈ എൻട്രി ഇല്ലാതാക്കണോ?',

    trendIncreasing: 'വർദ്ധിക്കുന്നു',
    trendStable: 'സ്ഥിരം',
    trendDecreasing: 'കുറയുന്നു',
  },

  // ── Savings Pocket ────────────────────────────────────────────────────────
  savingsPocket: {
    title: 'സമ്പാദ്യ പോക്കറ്റ്',
    surplus: 'ഇന്നത്തെ മിച്ചം',
    suggestedSave: 'സൂചിപ്പിച്ച സമ്പാദ്യം',
    savingsStreak: 'സമ്പാദ്യ സ്ട്രീക്ക്',
    streakDays: '{{count}} ദിവസ സ്ട്രീക്ക്',
    streakDaysSingular: '{{count}} ദിവസ സ്ട്രീക്ക്',
    saveNow: 'ഇപ്പോൾ സൂക്ഷിക്കുക',
    skipToday: 'ഇന്ന് ഒഴിവാക്കുക',
    saved: 'സൂക്ഷിച്ചു!',
    noSurplus: 'ഇന്ന് മിച്ചമില്ല. നാളെ തുടരുക!',
    saveReason: 'ഈ തുക എന്തുകൊണ്ട്?',
    viewHistory: 'സമ്പാദ്യ ചരിത്രം കാണുക',
    totalSaved: 'ആകെ സൂക്ഷിച്ചത്',
    thisWeek: 'ഈ ആഴ്ച',
    thisMonth: 'ഈ മാസം',
  },

  // ── Rainy-Day Fund ────────────────────────────────────────────────────────
  rainyDay: {
    title: 'അടിയന്തര ഫണ്ട്',
    target: 'ലക്ഷ്യം',
    current: 'നിലവിലെ',
    progress: 'പ്രഗതി',
    progressPercent: '{{percent}}% ഫണ്ട് ചെയ്തു',
    targetDays: '{{days}}-ദിവസ സംരക്ഷണം',
    daysToTarget: 'ലക്ഷ്യത്തിലേക്ക് {{days}} ദിവസം',
    fundComplete: 'ഫണ്ട് പൂർത്തിയായി! നിങ്ങൾ സംരക്ഷിക്കപ്പെട്ടു.',
    addToFund: 'ഫണ്ടിലേക്ക് ചേർക്കുക',
    fundDescription: '{{days}} ദിവസത്തെ ചെലവുകൾ കവർ ചെയ്യുന്നു (₹{{amount}}/ദിവസം)',
  },

  // ── Resilience Score ──────────────────────────────────────────────────────
  resilienceScore: {
    title: 'പ്രതിരോധ സ്‌കോർ',
    score: 'സ്‌കോർ',
    outOf: '100-ൽ',
    change: 'ഈ ആഴ്ച {{direction}} {{points}} പോയിന്റ്',
    improved: 'മെച്ചപ്പെട്ടു',
    dropped: 'കുറഞ്ഞു',
    unchanged: 'മാറ്റമില്ല',
    factors: 'സ്‌കോർ ഘടകങ്ങൾ',
    positive: 'ശക്തികൾ',
    negative: 'മെച്ചപ്പെടുത്തേണ്ട മേഖലകൾ',
    volatility: 'വരുമാന സ്ഥിരത',
    trend: 'വരുമാന പ്രവണത',
    savingsStreak: 'സമ്പാദ്യ സ്ഥിരത',
    bufferProgress: 'അടിയന്തര ഫണ്ട്',
    debtBurden: 'കടഭാരം',
    excellent: 'മികച്ചത്',
    good: 'നല്ലത്',
    fair: 'ശരി',
    poor: 'ശ്രദ്ധ ആവശ്യം',
  },

  // ── Loan Risk ─────────────────────────────────────────────────────────────
  loanRisk: {
    title: 'വായ്പ അപകടം',
    level: 'അപകട നില',
    activeLoans: 'സജീവ വായ്പകൾ',
    low: 'കുറവ്',
    medium: 'മധ്യമം',
    high: 'ഉയർന്ന',
    lowDescription: 'നിങ്ങളുടെ കടഭാരം കൈകാര്യം ചെയ്യാവുന്നതാണ്.',
    mediumDescription: 'പുതിയ വായ്പകൾ എടുക്കുന്നതിന് മുൻപ് നിലവിലുള്ളവ തിരിച്ചടക്കാൻ പരിഗണിക്കുക.',
    highDescription: 'അധിക വായ്പകൾ നിങ്ങളുടെ പ്രതിരോധം കുറയ്ക്കുന്നു. തിരിച്ചടവിന് മുൻഗണന നൽകുക.',
    addLoan: 'വായ്പ ചേർക്കുക',
    noLoans: 'സജീവ വായ്പകളില്ല. ഗംഭീരം!',
    loanAmount: 'വായ്പ തുക (₹)',
    lender: 'വായ്പദാതാവ്',
    dueDate: 'കാലക്കെടി',
    emi: 'മാസ EMI (₹)',
  },

  // ── AI Nudge ──────────────────────────────────────────────────────────────
  aiNudge: {
    title: 'AI നിർദ്ദേശം',
    loading: 'നിങ്ങളുടെ വ്യക്തിഗത ഉൾക്കാഴ്ച തയ്യാറാക്കുന്നു…',
    error: 'ഉൾക്കാഴ്ച ലോഡ് ചെയ്യാൻ കഴിഞ്ഞില്ല. വീണ്ടും ശ്രമിക്കുക.',
    retry: 'വീണ്ടും ശ്രമിക്കുക',
    poweredBy: 'AI ഉപയോഗിച്ച് പ്രവർത്തിക്കുന്നു',
    nudgeLabel: 'ഇന്നത്തെ ഉൾക്കാഴ്ച',
    dismiss: 'നിരസിക്കുക',
    helpful: 'സഹായകരം',
    notHelpful: 'സഹായകരമല്ല',
  },

  // ── Common / Shared ───────────────────────────────────────────────────────
  common: {
    loading: 'ലോഡ് ചെയ്യുന്നു…',
    error: 'എന്തോ തകരാർ സംഭവിച്ചു.',
    retry: 'വീണ്ടും ശ്രമിക്കുക',
    save: 'സംരക്ഷിക്കുക',
    cancel: 'റദ്ദാക്കുക',
    confirm: 'സ്ഥിരീകരിക്കുക',
    delete: 'ഇല്ലാതാക്കുക',
    edit: 'തിരുത്തുക',
    close: 'അടക്കുക',
    back: 'തിരികെ',
    next: 'അടുത്തത്',
    done: 'പൂർത്തിയായി',
    yes: 'അതെ',
    no: 'ഇല്ല',
    of: 'ൽ',
    currency: '₹',
    days: 'ദിവസങ്ങൾ',
    day: 'ദിവസം',
    week: 'ആഴ്ച',
    month: 'മാസം',
    today: 'ഇന്ന്',
    yesterday: 'ഇന്നലെ',
    selectLanguage: 'ഭാഷ തിരഞ്ഞെടുക്കുക',
    language: 'ഭാഷ',
    noResults: 'ഫലങ്ങളൊന്നും കണ്ടെത്തിയില്ല.',
    viewAll: 'എല്ലാം കാണുക',
    showLess: 'കുറച്ച് കാണുക',
    optional: 'ഐച്ഛികം',
    required: 'ആവശ്യം',
  },

  // ── Volatility labels ─────────────────────────────────────────────────────
  volatility: {
    low: 'കുറഞ്ഞ ചാഞ്ചല്യം',
    medium: 'മിതമായ ചാഞ്ചല്യം',
    high: 'ഉയർന്ന ചാഞ്ചല്യം',
  },

  // ── Errors / Validation ───────────────────────────────────────────────────
  errors: {
    required: 'ഈ ഫീൽഡ് ആവശ്യമാണ്.',
    invalidAmount: 'ദയവായി സാധുതയുള്ള തുക നൽകുക.',
    invalidPhone: 'ദയവായി സാധുതയുള്ള ഫോൺ നമ്പർ നൽകുക.',
    networkError: 'നെറ്റ്‌വർക്ക് പിശക്. നിങ്ങളുടെ കണക്ഷൻ പരിശോധിക്കുക.',
    serverError: 'സെർവർ പിശക്. ദയവായി പിന്നീട് വീണ്ടും ശ്രമിക്കുക.',
    sessionExpired: 'നിങ്ങളുടെ സെഷൻ കാലഹരണപ്പെട്ടു. ദയവായി വീണ്ടും ലോഗിൻ ചെയ്യുക.',
  },
};

export default ml;
