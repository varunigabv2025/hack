/**
 * hi.js — Hindi (हिन्दी) translations
 * Resilience Engine UI
 */

const hi = {
  meta: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    dir: 'ltr',
  },

  // ── Navigation ────────────────────────────────────────────────────────────
  nav: {
    dashboard: 'डैशबोर्ड',
    income: 'आय',
    savings: 'बचत',
    loans: 'ऋण',
    profile: 'प्रोफ़ाइल',
    settings: 'सेटिंग्स',
    logout: 'लॉग आउट',
    help: 'सहायता',
  },

  // ── Onboarding ────────────────────────────────────────────────────────────
  onboarding: {
    welcome: 'Resilience Engine में आपका स्वागत है',
    subtitle: 'आपका व्यक्तिगत वित्तीय लचीलापन साथी',
    getStarted: 'शुरू करें',
    next: 'अगला',
    back: 'वापस',
    finish: 'सेटअप पूरा करें',
    step: 'चरण {{current}} / {{total}}',

    fullName: 'पूरा नाम',
    fullNamePlaceholder: 'अपना पूरा नाम दर्ज करें',
    phoneNumber: 'फ़ोन नंबर',
    phoneNumberPlaceholder: 'अपना फ़ोन नंबर दर्ज करें',
    dailyExpenses: 'औसत दैनिक खर्च (₹)',
    dailyExpensesPlaceholder: 'जैसे 500',
    occupation: 'व्यवसाय',
    occupationPlaceholder: 'जैसे ऑटो चालक, फेरीवाला',
    city: 'शहर',
    cityPlaceholder: 'अपना शहर दर्ज करें',
    preferredLanguage: 'पसंदीदा भाषा',

    step1Title: 'अपने बारे में बताएं',
    step1Subtitle: 'आपके अनुभव को व्यक्तिगत बनाने के लिए बुनियादी जानकारी',
    step2Title: 'आपके दैनिक वित्त',
    step2Subtitle: 'हमें आपकी आय और खर्चों को समझने में मदद करें',
    step3Title: 'सब तैयार है!',
    step3Subtitle: 'आपकी लचीलापन यात्रा अभी शुरू होती है',
  },

  // ── Dashboard ─────────────────────────────────────────────────────────────
  dashboard: {
    title: 'डैशबोर्ड',
    greeting: 'शुभ {{timeOfDay}}, {{name}}!',
    morning: 'प्रभात',
    afternoon: 'दोपहर',
    evening: 'संध्या',
    todayOverview: 'आज का अवलोकन',
    lastUpdated: 'अंतिम बार {{time}} को अपडेट किया',
    refresh: 'ताज़ा करें',
    noData: 'अभी तक कोई डेटा उपलब्ध नहीं। अपनी आय ट्रैक करना शुरू करें।',
  },

  // ── Income ────────────────────────────────────────────────────────────────
  income: {
    title: 'आय',
    todayIncome: 'आज की आय',
    addIncome: 'आय जोड़ें',
    incomeHistory: 'आय इतिहास',
    baseline: 'आधार रेखा (7-दिन औसत)',
    trend: 'रुझान',
    prediction: 'अगले सप्ताह का अनुमान',
    predictionRange: '₹{{low}} – ₹{{high}}',
    noHistory: 'अभी तक कोई आय दर्ज नहीं।',
    addFirst: 'अपनी पहली आय प्रविष्टि जोड़ें',
    amount: 'राशि (₹)',
    amountPlaceholder: 'राशि दर्ज करें',
    date: 'तारीख',
    source: 'स्रोत',
    sourcePlaceholder: 'जैसे ड्राइविंग, डिलीवरी',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    confirmDelete: 'क्या आप इस प्रविष्टि को हटाना चाहते हैं?',

    trendIncreasing: 'बढ़ रहा है',
    trendStable: 'स्थिर',
    trendDecreasing: 'घट रहा है',
  },

  // ── Savings Pocket ────────────────────────────────────────────────────────
  savingsPocket: {
    title: 'बचत जेब',
    surplus: 'आज का अधिशेष',
    suggestedSave: 'बचत के लिए सुझाव',
    savingsStreak: 'बचत की लकीर',
    streakDays: '{{count}} दिन की लकीर',
    streakDaysSingular: '{{count}} दिन की लकीर',
    saveNow: 'अभी बचाएं',
    skipToday: 'आज छोड़ें',
    saved: 'बच गया!',
    noSurplus: 'आज कोई अधिशेष नहीं। कल जारी रखें!',
    saveReason: 'यह राशि क्यों?',
    viewHistory: 'बचत इतिहास देखें',
    totalSaved: 'कुल बचत',
    thisWeek: 'इस सप्ताह',
    thisMonth: 'इस महीने',
  },

  // ── Rainy-Day Fund ────────────────────────────────────────────────────────
  rainyDay: {
    title: 'आपातकालीन निधि',
    target: 'लक्ष्य',
    current: 'वर्तमान',
    progress: 'प्रगति',
    progressPercent: '{{percent}}% वित्त पोषित',
    targetDays: '{{days}}-दिन सुरक्षा',
    daysToTarget: 'लक्ष्य तक {{days}} दिन',
    fundComplete: 'निधि पूर्ण! आप सुरक्षित हैं।',
    addToFund: 'निधि में जोड़ें',
    fundDescription: '{{days}} दिनों के खर्चों को कवर करता है (₹{{amount}}/दिन)',
  },

  // ── Resilience Score ──────────────────────────────────────────────────────
  resilienceScore: {
    title: 'लचीलापन स्कोर',
    score: 'स्कोर',
    outOf: '100 में से',
    change: 'इस सप्ताह {{direction}} {{points}} अंक',
    improved: 'सुधरा',
    dropped: 'गिरा',
    unchanged: 'अपरिवर्तित',
    factors: 'स्कोर कारक',
    positive: 'शक्तियाँ',
    negative: 'सुधार के क्षेत्र',
    volatility: 'आय स्थिरता',
    trend: 'आय रुझान',
    savingsStreak: 'बचत की निरंतरता',
    bufferProgress: 'आपातकालीन निधि',
    debtBurden: 'ऋण का बोझ',
    excellent: 'उत्कृष्ट',
    good: 'अच्छा',
    fair: 'ठीक',
    poor: 'ध्यान चाहिए',
  },

  // ── Loan Risk ─────────────────────────────────────────────────────────────
  loanRisk: {
    title: 'ऋण जोखिम',
    level: 'जोखिम स्तर',
    activeLoans: 'सक्रिय ऋण',
    low: 'कम',
    medium: 'मध्यम',
    high: 'उच्च',
    lowDescription: 'आपका ऋण बोझ प्रबंधनीय है।',
    mediumDescription: 'नए ऋण लेने से पहले मौजूदा ऋणों को चुकाने पर विचार करें।',
    highDescription: 'अधिक ऋण आपके लचीलेपन को कम कर रहा है। पुनर्भुगतान को प्राथमिकता दें।',
    addLoan: 'ऋण जोड़ें',
    noLoans: 'कोई सक्रिय ऋण नहीं। बढ़िया!',
    loanAmount: 'ऋण राशि (₹)',
    lender: 'ऋणदाता',
    dueDate: 'देय तिथि',
    emi: 'मासिक EMI (₹)',
  },

  // ── AI Nudge ──────────────────────────────────────────────────────────────
  aiNudge: {
    title: 'AI सुझाव',
    loading: 'आपकी व्यक्तिगत जानकारी तैयार की जा रही है…',
    error: 'जानकारी लोड नहीं हो सकी। पुनः प्रयास करें।',
    retry: 'पुनः प्रयास',
    poweredBy: 'AI द्वारा संचालित',
    nudgeLabel: 'आज की जानकारी',
    dismiss: 'खारिज करें',
    helpful: 'उपयोगी',
    notHelpful: 'उपयोगी नहीं',
  },

  // ── Common / Shared ───────────────────────────────────────────────────────
  common: {
    loading: 'लोड हो रहा है…',
    error: 'कुछ गलत हो गया।',
    retry: 'पुनः प्रयास करें',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    confirm: 'पुष्टि करें',
    delete: 'हटाएं',
    edit: 'संपादित करें',
    close: 'बंद करें',
    back: 'वापस',
    next: 'अगला',
    done: 'हो गया',
    yes: 'हाँ',
    no: 'नहीं',
    of: 'में से',
    currency: '₹',
    days: 'दिन',
    day: 'दिन',
    week: 'सप्ताह',
    month: 'महीना',
    today: 'आज',
    yesterday: 'कल',
    selectLanguage: 'भाषा चुनें',
    language: 'भाषा',
    noResults: 'कोई परिणाम नहीं मिला।',
    viewAll: 'सभी देखें',
    showLess: 'कम दिखाएं',
    optional: 'वैकल्पिक',
    required: 'आवश्यक',
  },

  // ── Volatility labels ─────────────────────────────────────────────────────
  volatility: {
    low: 'कम उतार-चढ़ाव',
    medium: 'मध्यम उतार-चढ़ाव',
    high: 'अधिक उतार-चढ़ाव',
  },

  // ── Errors / Validation ───────────────────────────────────────────────────
  errors: {
    required: 'यह फ़ील्ड आवश्यक है।',
    invalidAmount: 'कृपया एक वैध राशि दर्ज करें।',
    invalidPhone: 'कृपया एक वैध फ़ोन नंबर दर्ज करें।',
    networkError: 'नेटवर्क त्रुटि। कृपया अपना कनेक्शन जांचें।',
    serverError: 'सर्वर त्रुटि। कृपया बाद में पुनः प्रयास करें।',
    sessionExpired: 'आपका सत्र समाप्त हो गया। कृपया फिर से लॉग इन करें।',
  },
};

export default hi;
