/**
 * ta.js — Tamil (தமிழ்) translations
 * Resilience Engine UI
 */

const ta = {
  meta: {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    dir: 'ltr',
  },

  // ── Navigation ────────────────────────────────────────────────────────────
  nav: {
    dashboard: 'டாஷ்போர்டு',
    income: 'வருமானம்',
    savings: 'சேமிப்பு',
    loans: 'கடன்கள்',
    profile: 'சுயவிவரம்',
    settings: 'அமைப்புகள்',
    logout: 'வெளியேறு',
    help: 'உதவி',
  },

  // ── Onboarding ────────────────────────────────────────────────────────────
  onboarding: {
    welcome: 'ரெசிலியன்ஸ் இன்ஜினுக்கு வரவேற்கிறோம்',
    subtitle: 'உங்கள் தனிப்பட்ட நிதி நெகிழ்வுத்தன்மை துணை',
    getStarted: 'தொடங்குங்கள்',
    next: 'அடுத்து',
    back: 'திரும்பு',
    finish: 'அமைவை முடி',
    step: 'படி {{current}} / {{total}}',

    fullName: 'முழு பெயர்',
    fullNamePlaceholder: 'உங்கள் முழு பெயரை உள்ளிடவும்',
    phoneNumber: 'தொலைபேசி எண்',
    phoneNumberPlaceholder: 'உங்கள் தொலைபேசி எண்ணை உள்ளிடவும்',
    dailyExpenses: 'சராசரி தினசரி செலவுகள் (₹)',
    dailyExpensesPlaceholder: 'எ.கா. 500',
    occupation: 'தொழில்',
    occupationPlaceholder: 'எ.கா. ஆட்டோ ஓட்டுனர், தெரு விற்பனையாளர்',
    city: 'நகரம்',
    cityPlaceholder: 'உங்கள் நகரத்தை உள்ளிடவும்',
    preferredLanguage: 'விருப்பமான மொழி',

    step1Title: 'உங்களைப் பற்றி சொல்லுங்கள்',
    step1Subtitle: 'உங்கள் அனுபவத்தை தனிப்பயனாக்க அடிப்படை விவரங்கள்',
    step2Title: 'உங்கள் தினசரி நிதி',
    step2Subtitle: 'உங்கள் வருமானம் மற்றும் செலவுகளை புரிந்துகொள்ள உதவுங்கள்',
    step3Title: 'அனைத்தும் தயார்!',
    step3Subtitle: 'உங்கள் நெகிழ்வுத்தன்மை பயணம் இப்போது தொடங்குகிறது',
  },

  // ── Dashboard ─────────────────────────────────────────────────────────────
  dashboard: {
    title: 'டாஷ்போர்டு',
    greeting: 'வணக்கம் {{timeOfDay}}, {{name}}!',
    morning: 'காலை',
    afternoon: 'மதியம்',
    evening: 'மாலை',
    todayOverview: 'இன்றைய கண்ணோட்டம்',
    lastUpdated: 'கடைசியாக புதுப்பிக்கப்பட்டது {{time}}',
    refresh: 'புதுப்பி',
    noData: 'இன்னும் தரவு இல்லை. உங்கள் வருமானத்தை கண்காணிக்கத் தொடங்குங்கள்.',
  },

  // ── Income ────────────────────────────────────────────────────────────────
  income: {
    title: 'வருமானம்',
    todayIncome: 'இன்றைய வருமானம்',
    addIncome: 'வருமானம் சேர்',
    incomeHistory: 'வருமான வரலாறு',
    baseline: 'அடிப்படை (7-நாள் சராசரி)',
    trend: 'போக்கு',
    prediction: 'அடுத்த வார மதிப்பீடு',
    predictionRange: '₹{{low}} – ₹{{high}}',
    noHistory: 'இன்னும் வருமானம் பதிவாகவில்லை.',
    addFirst: 'உங்கள் முதல் வருமான உள்ளீட்டை சேர்க்கவும்',
    amount: 'தொகை (₹)',
    amountPlaceholder: 'தொகையை உள்ளிடவும்',
    date: 'தேதி',
    source: 'மூலம்',
    sourcePlaceholder: 'எ.கா. வாகனம் ஓட்டுதல், டெலிவரி',
    save: 'சேமி',
    cancel: 'ரத்து செய்',
    edit: 'திருத்து',
    delete: 'நீக்கு',
    confirmDelete: 'இந்த உள்ளீட்டை நீக்க விரும்புகிறீர்களா?',

    trendIncreasing: 'அதிகரிக்கிறது',
    trendStable: 'நிலையானது',
    trendDecreasing: 'குறைகிறது',
  },

  // ── Savings Pocket ────────────────────────────────────────────────────────
  savingsPocket: {
    title: 'சேமிப்பு பாக்கெட்',
    surplus: 'இன்றைய உபரி',
    suggestedSave: 'சேமிக்க பரிந்துரைக்கப்பட்டது',
    savingsStreak: 'சேமிப்பு தொடர்',
    streakDays: '{{count}} நாள் தொடர்',
    streakDaysSingular: '{{count}} நாள் தொடர்',
    saveNow: 'இப்போது சேமி',
    skipToday: 'இன்று தவிர்',
    saved: 'சேமிக்கப்பட்டது!',
    noSurplus: 'இன்று உபரி இல்லை. நாளை தொடருங்கள்!',
    saveReason: 'இந்த தொகை ஏன்?',
    viewHistory: 'சேமிப்பு வரலாற்றை காண்',
    totalSaved: 'மொத்தம் சேமிக்கப்பட்டது',
    thisWeek: 'இந்த வாரம்',
    thisMonth: 'இந்த மாதம்',
  },

  // ── Rainy-Day Fund ────────────────────────────────────────────────────────
  rainyDay: {
    title: 'மழைக்காலக் கோப்பு',
    target: 'இலக்கு',
    current: 'தற்போது',
    progress: 'முன்னேற்றம்',
    progressPercent: '{{percent}}% நிரம்பியது',
    targetDays: '{{days}}-நாள் பாதுகாப்பு',
    daysToTarget: 'இலக்கை அடைய {{days}} நாட்கள்',
    fundComplete: 'கோப்பு நிறைந்தது! நீங்கள் பாதுகாக்கப்பட்டீர்கள்.',
    addToFund: 'கோப்பில் சேர்',
    fundDescription: '{{days}} நாட்கள் செலவுகளை ஈடுகட்டுகிறது (₹{{amount}}/நாள்)',
  },

  // ── Resilience Score ──────────────────────────────────────────────────────
  resilienceScore: {
    title: 'நெகிழ்வுத்தன்மை மதிப்பெண்',
    score: 'மதிப்பெண்',
    outOf: '100 இல்',
    change: 'இந்த வாரம் {{direction}} {{points}} புள்ளிகள்',
    improved: 'மேம்பட்டது',
    dropped: 'குறைந்தது',
    unchanged: 'மாறவில்லை',
    factors: 'மதிப்பெண் காரணிகள்',
    positive: 'வலிமைகள்',
    negative: 'மேம்படுத்த வேண்டிய பகுதிகள்',
    volatility: 'வருமான நிலைத்தன்மை',
    trend: 'வருமான போக்கு',
    savingsStreak: 'சேமிப்பு நிலைத்தன்மை',
    bufferProgress: 'அவசரகால நிதி',
    debtBurden: 'கடன் சுமை',
    excellent: 'சிறப்பானது',
    good: 'நல்லது',
    fair: 'சரியானது',
    poor: 'கவனம் தேவை',
  },

  // ── Loan Risk ─────────────────────────────────────────────────────────────
  loanRisk: {
    title: 'கடன் ஆபத்து',
    level: 'ஆபத்து நிலை',
    activeLoans: 'செயலில் உள்ள கடன்கள்',
    low: 'குறைவு',
    medium: 'நடுத்தரம்',
    high: 'அதிகம்',
    lowDescription: 'உங்கள் கடன் சுமை கையாளக்கூடியது.',
    mediumDescription: 'புதிய கடன்கள் எடுக்கும் முன் ஏற்கனவே உள்ள கடன்களை அடைக்க பரிசீலிக்கவும்.',
    highDescription: 'அதிக கடன் எண்ணிக்கை உங்கள் நெகிழ்வுத்தன்மையை குறைக்கிறது. திருப்பிச் செலுத்துவதை முன்னுரிமை செய்யுங்கள்.',
    addLoan: 'கடன் சேர்',
    noLoans: 'செயலில் கடன்கள் இல்லை. சிறப்பு!',
    loanAmount: 'கடன் தொகை (₹)',
    lender: 'கடன் வழங்குபவர்',
    dueDate: 'நிர்ணயிக்கப்பட்ட தேதி',
    emi: 'மாதாந்திர EMI (₹)',
  },

  // ── AI Nudge ──────────────────────────────────────────────────────────────
  aiNudge: {
    title: 'AI யோசனை',
    loading: 'உங்கள் தனிப்பயனாக்கப்பட்ட நுண்ணறிவை உருவாக்குகிறோம்…',
    error: 'நுண்ணறிவை ஏற்ற முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
    retry: 'மீண்டும் முயற்சி',
    poweredBy: 'AI ஆல் இயக்கப்படுகிறது',
    nudgeLabel: 'இன்றைய நுண்ணறிவு',
    dismiss: 'நிராகரி',
    helpful: 'உதவியாக இருந்தது',
    notHelpful: 'உதவியாக இல்லை',
  },

  // ── Common / Shared ───────────────────────────────────────────────────────
  common: {
    loading: 'ஏற்றுகிறது…',
    error: 'ஏதோ தவறு நடந்தது.',
    retry: 'மீண்டும் முயற்சி',
    save: 'சேமி',
    cancel: 'ரத்து செய்',
    confirm: 'உறுதிப்படுத்து',
    delete: 'நீக்கு',
    edit: 'திருத்து',
    close: 'மூடு',
    back: 'திரும்பு',
    next: 'அடுத்து',
    done: 'முடிந்தது',
    yes: 'ஆம்',
    no: 'இல்லை',
    of: 'இல்',
    currency: '₹',
    days: 'நாட்கள்',
    day: 'நாள்',
    week: 'வாரம்',
    month: 'மாதம்',
    today: 'இன்று',
    yesterday: 'நேற்று',
    selectLanguage: 'மொழியை தேர்வு செய்க',
    language: 'மொழி',
    noResults: 'முடிவுகள் எதுவும் இல்லை.',
    viewAll: 'அனைத்தையும் காண்',
    showLess: 'குறைவாக காட்டு',
    optional: 'விருப்பத்தேர்வு',
    required: 'கட்டாயம்',
  },

  // ── Volatility labels ─────────────────────────────────────────────────────
  volatility: {
    low: 'குறைந்த ஏற்றத்தாழ்வு',
    medium: 'மிதமான ஏற்றத்தாழ்வு',
    high: 'அதிக ஏற்றத்தாழ்வு',
  },

  // ── Errors / Validation ───────────────────────────────────────────────────
  errors: {
    required: 'இந்த புலம் கட்டாயமாகும்.',
    invalidAmount: 'சரியான தொகையை உள்ளிடவும்.',
    invalidPhone: 'சரியான தொலைபேசி எண்ணை உள்ளிடவும்.',
    networkError: 'நெட்வொர்க் பிழை. உங்கள் இணைப்பை சரிபார்க்கவும்.',
    serverError: 'சர்வர் பிழை. பின்னர் மீண்டும் முயற்சிக்கவும்.',
    sessionExpired: 'உங்கள் அமர்வு காலாவதியானது. மீண்டும் உள்நுழையவும்.',
  },
};

export default ta;
