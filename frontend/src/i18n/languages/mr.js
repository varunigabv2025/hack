/**
 * mr.js — Marathi (मराठी) translations
 * Resilience Engine UI
 */

const mr = {
  meta: {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    dir: 'ltr',
  },

  // ── Navigation ────────────────────────────────────────────────────────────
  nav: {
    dashboard: 'डॅशबोर्ड',
    income: 'उत्पन्न',
    savings: 'बचत',
    loans: 'कर्जे',
    profile: 'प्रोफाइल',
    settings: 'सेटिंग्ज',
    logout: 'लॉग आउट',
    help: 'मदत',
  },

  // ── Onboarding ────────────────────────────────────────────────────────────
  onboarding: {
    welcome: 'Resilience Engine मध्ये आपले स्वागत आहे',
    subtitle: 'तुमचा वैयक्तिक आर्थिक लवचिकता सोबती',
    getStarted: 'सुरू करा',
    next: 'पुढे',
    back: 'मागे',
    finish: 'सेटअप पूर्ण करा',
    step: 'पायरी {{current}} / {{total}}',

    fullName: 'पूर्ण नाव',
    fullNamePlaceholder: 'तुमचे पूर्ण नाव प्रविष्ट करा',
    phoneNumber: 'फोन नंबर',
    phoneNumberPlaceholder: 'तुमचा फोन नंबर प्रविष्ट करा',
    dailyExpenses: 'सरासरी दैनिक खर्च (₹)',
    dailyExpensesPlaceholder: 'उदा. ५००',
    occupation: 'व्यवसाय',
    occupationPlaceholder: 'उदा. ऑटो चालक, फेरीवाला',
    city: 'शहर',
    cityPlaceholder: 'तुमचे शहर प्रविष्ट करा',
    preferredLanguage: 'पसंतीची भाषा',

    step1Title: 'तुमच्याबद्दल सांगा',
    step1Subtitle: 'तुमचा अनुभव वैयक्तिकृत करण्यासाठी मूलभूत तपशील',
    step2Title: 'तुमचे दैनिक वित्त',
    step2Subtitle: 'तुमचे उत्पन्न आणि खर्च समजून घेण्यास मदत करा',
    step3Title: 'सर्व तयार आहे!',
    step3Subtitle: 'तुमचा लवचिकता प्रवास आता सुरू होतो',
  },

  // ── Dashboard ─────────────────────────────────────────────────────────────
  dashboard: {
    title: 'डॅशबोर्ड',
    greeting: 'शुभ {{timeOfDay}}, {{name}}!',
    morning: 'सकाळ',
    afternoon: 'दुपार',
    evening: 'संध्याकाळ',
    todayOverview: 'आजचा आढावा',
    lastUpdated: 'शेवटचे {{time}} ला अद्यतनित केले',
    refresh: 'रिफ्रेश',
    noData: 'अजून डेटा उपलब्ध नाही. तुमचे उत्पन्न ट्रॅक करणे सुरू करा.',
  },

  // ── Income ────────────────────────────────────────────────────────────────
  income: {
    title: 'उत्पन्न',
    todayIncome: 'आजचे उत्पन्न',
    addIncome: 'उत्पन्न जोडा',
    incomeHistory: 'उत्पन्नाचा इतिहास',
    baseline: 'आधाररेषा (७-दिवसांची सरासरी)',
    trend: 'कल',
    prediction: 'पुढील आठवड्याचा अंदाज',
    predictionRange: '₹{{low}} – ₹{{high}}',
    noHistory: 'अजून उत्पन्न नोंदवलेले नाही.',
    addFirst: 'तुमची पहिली उत्पन्नाची नोंद जोडा',
    amount: 'रक्कम (₹)',
    amountPlaceholder: 'रक्कम प्रविष्ट करा',
    date: 'तारीख',
    source: 'स्रोत',
    sourcePlaceholder: 'उदा. ड्रायव्हिंग, डिलिव्हरी',
    save: 'जतन करा',
    cancel: 'रद्द करा',
    edit: 'संपादित करा',
    delete: 'हटवा',
    confirmDelete: 'तुम्हाला ही नोंद हटवायची आहे का?',

    trendIncreasing: 'वाढत आहे',
    trendStable: 'स्थिर',
    trendDecreasing: 'कमी होत आहे',
  },

  // ── Savings Pocket ────────────────────────────────────────────────────────
  savingsPocket: {
    title: 'बचत खिसा',
    surplus: 'आजचे अतिरिक्त',
    suggestedSave: 'बचतीसाठी सुचवलेले',
    savingsStreak: 'बचत स्ट्रीक',
    streakDays: '{{count}} दिवसांची स्ट्रीक',
    streakDaysSingular: '{{count}} दिवसाची स्ट्रीक',
    saveNow: 'आत्ता जतन करा',
    skipToday: 'आज सोडा',
    saved: 'जतन केले!',
    noSurplus: 'आज अतिरिक्त नाही. उद्या सुरू ठेवा!',
    saveReason: 'ही रक्कम का?',
    viewHistory: 'बचतीचा इतिहास पहा',
    totalSaved: 'एकूण बचत',
    thisWeek: 'या आठवड्यात',
    thisMonth: 'या महिन्यात',
  },

  // ── Rainy-Day Fund ────────────────────────────────────────────────────────
  rainyDay: {
    title: 'आपत्कालीन निधी',
    target: 'लक्ष्य',
    current: 'सध्याचे',
    progress: 'प्रगती',
    progressPercent: '{{percent}}% निधी',
    targetDays: '{{days}}-दिवसांचे संरक्षण',
    daysToTarget: 'लक्ष्यापर्यंत {{days}} दिवस',
    fundComplete: 'निधी पूर्ण! तुम्ही संरक्षित आहात.',
    addToFund: 'निधीत जोडा',
    fundDescription: '{{days}} दिवसांचे खर्च भागवते (₹{{amount}}/दिवस)',
  },

  // ── Resilience Score ──────────────────────────────────────────────────────
  resilienceScore: {
    title: 'लवचिकता गुण',
    score: 'गुण',
    outOf: '१०० पैकी',
    change: 'या आठवड्यात {{direction}} {{points}} गुण',
    improved: 'सुधारले',
    dropped: 'घसरले',
    unchanged: 'अपरिवर्तित',
    factors: 'गुणांचे घटक',
    positive: 'शक्ती',
    negative: 'सुधारणेची क्षेत्रे',
    volatility: 'उत्पन्नाची स्थिरता',
    trend: 'उत्पन्नाचा कल',
    savingsStreak: 'बचतीची सातत्यता',
    bufferProgress: 'आपत्कालीन निधी',
    debtBurden: 'कर्जाचा बोजा',
    excellent: 'उत्कृष्ट',
    good: 'चांगले',
    fair: 'ठीक',
    poor: 'लक्ष द्या',
  },

  // ── Loan Risk ─────────────────────────────────────────────────────────────
  loanRisk: {
    title: 'कर्ज जोखीम',
    level: 'जोखीम पातळी',
    activeLoans: 'सक्रिय कर्जे',
    low: 'कमी',
    medium: 'मध्यम',
    high: 'जास्त',
    lowDescription: 'तुमचा कर्जाचा बोजा व्यवस्थापन करण्यायोग्य आहे.',
    mediumDescription: 'नवीन कर्जे घेण्यापूर्वी विद्यमान कर्जे फेडण्याचा विचार करा.',
    highDescription: 'जास्त कर्जे तुमची लवचिकता कमी करत आहेत. परतफेडीला प्राधान्य द्या.',
    addLoan: 'कर्ज जोडा',
    noLoans: 'कोणतेही सक्रिय कर्ज नाही. छान!',
    loanAmount: 'कर्जाची रक्कम (₹)',
    lender: 'कर्जदाता',
    dueDate: 'देय तारीख',
    emi: 'मासिक EMI (₹)',
  },

  // ── AI Nudge ──────────────────────────────────────────────────────────────
  aiNudge: {
    title: 'AI सूचना',
    loading: 'तुमची वैयक्तिकृत माहिती तयार केली जात आहे…',
    error: 'माहिती लोड होऊ शकली नाही. पुन्हा प्रयत्न करा.',
    retry: 'पुन्हा प्रयत्न करा',
    poweredBy: 'AI द्वारे चालवले जाते',
    nudgeLabel: 'आजची माहिती',
    dismiss: 'बरखास्त करा',
    helpful: 'उपयुक्त',
    notHelpful: 'उपयुक्त नाही',
  },

  // ── Common / Shared ───────────────────────────────────────────────────────
  common: {
    loading: 'लोड होत आहे…',
    error: 'काहीतरी चुकले.',
    retry: 'पुन्हा प्रयत्न करा',
    save: 'जतन करा',
    cancel: 'रद्द करा',
    confirm: 'पुष्टी करा',
    delete: 'हटवा',
    edit: 'संपादित करा',
    close: 'बंद करा',
    back: 'मागे',
    next: 'पुढे',
    done: 'झाले',
    yes: 'होय',
    no: 'नाही',
    of: 'पैकी',
    currency: '₹',
    days: 'दिवस',
    day: 'दिवस',
    week: 'आठवडा',
    month: 'महिना',
    today: 'आज',
    yesterday: 'काल',
    selectLanguage: 'भाषा निवडा',
    language: 'भाषा',
    noResults: 'कोणतेही निकाल आढळले नाहीत.',
    viewAll: 'सर्व पहा',
    showLess: 'कमी दाखवा',
    optional: 'ऐच्छिक',
    required: 'आवश्यक',
  },

  // ── Volatility labels ─────────────────────────────────────────────────────
  volatility: {
    low: 'कमी चढ-उतार',
    medium: 'मध्यम चढ-उतार',
    high: 'जास्त चढ-उतार',
  },

  // ── Errors / Validation ───────────────────────────────────────────────────
  errors: {
    required: 'हे फील्ड आवश्यक आहे.',
    invalidAmount: 'कृपया वैध रक्कम प्रविष्ट करा.',
    invalidPhone: 'कृपया वैध फोन नंबर प्रविष्ट करा.',
    networkError: 'नेटवर्क त्रुटी. कृपया तुमचे कनेक्शन तपासा.',
    serverError: 'सर्व्हर त्रुटी. कृपया नंतर पुन्हा प्रयत्न करा.',
    sessionExpired: 'तुमचे सत्र संपले. कृपया पुन्हा लॉगिन करा.',
  },
};

export default mr;
