/**
 * bn.js — Bengali (বাংলা) translations
 * Resilience Engine UI
 */

const bn = {
  meta: {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    dir: 'ltr',
  },

  // ── Navigation ────────────────────────────────────────────────────────────
  nav: {
    dashboard: 'ড্যাশবোর্ড',
    income: 'আয়',
    savings: 'সঞ্চয়',
    loans: 'ঋণ',
    profile: 'প্রোফাইল',
    settings: 'সেটিংস',
    logout: 'লগ আউট',
    help: 'সাহায্য',
  },

  // ── Onboarding ────────────────────────────────────────────────────────────
  onboarding: {
    welcome: 'Resilience Engine-এ স্বাগতম',
    subtitle: 'আপনার ব্যক্তিগত আর্থিক স্থিতিস্থাপকতা সঙ্গী',
    getStarted: 'শুরু করুন',
    next: 'পরবর্তী',
    back: 'পেছনে',
    finish: 'সেটআপ শেষ করুন',
    step: 'ধাপ {{current}} / {{total}}',

    fullName: 'পূর্ণ নাম',
    fullNamePlaceholder: 'আপনার পূর্ণ নাম লিখুন',
    phoneNumber: 'ফোন নম্বর',
    phoneNumberPlaceholder: 'আপনার ফোন নম্বর লিখুন',
    dailyExpenses: 'গড় দৈনিক ব্যয় (₹)',
    dailyExpensesPlaceholder: 'যেমন ৫০০',
    occupation: 'পেশা',
    occupationPlaceholder: 'যেমন অটো চালক, রাস্তার বিক্রেতা',
    city: 'শহর',
    cityPlaceholder: 'আপনার শহর লিখুন',
    preferredLanguage: 'পছন্দের ভাষা',

    step1Title: 'আপনার সম্পর্কে বলুন',
    step1Subtitle: 'আপনার অভিজ্ঞতা ব্যক্তিগতকৃত করতে মৌলিক তথ্য',
    step2Title: 'আপনার দৈনিক অর্থ',
    step2Subtitle: 'আপনার আয় এবং ব্যয় বুঝতে সাহায্য করুন',
    step3Title: 'সব প্রস্তুত!',
    step3Subtitle: 'আপনার স্থিতিস্থাপকতার যাত্রা এখন শুরু হচ্ছে',
  },

  // ── Dashboard ─────────────────────────────────────────────────────────────
  dashboard: {
    title: 'ড্যাশবোর্ড',
    greeting: 'শুভ {{timeOfDay}}, {{name}}!',
    morning: 'সকাল',
    afternoon: 'দুপুর',
    evening: 'সন্ধ্যা',
    todayOverview: 'আজকের সংক্ষিপ্ত বিবরণ',
    lastUpdated: 'সর্বশেষ {{time}} এ আপডেট করা হয়েছে',
    refresh: 'রিফ্রেশ',
    noData: 'এখনো কোনো ডেটা নেই। আপনার আয় ট্র্যাক শুরু করুন।',
  },

  // ── Income ────────────────────────────────────────────────────────────────
  income: {
    title: 'আয়',
    todayIncome: 'আজকের আয়',
    addIncome: 'আয় যোগ করুন',
    incomeHistory: 'আয়ের ইতিহাস',
    baseline: 'বেসলাইন (৭-দিনের গড়)',
    trend: 'প্রবণতা',
    prediction: 'পরের সপ্তাহের অনুমান',
    predictionRange: '₹{{low}} – ₹{{high}}',
    noHistory: 'এখনো কোনো আয় রেকর্ড করা হয়নি।',
    addFirst: 'আপনার প্রথম আয়ের এন্ট্রি যোগ করুন',
    amount: 'পরিমাণ (₹)',
    amountPlaceholder: 'পরিমাণ লিখুন',
    date: 'তারিখ',
    source: 'উৎস',
    sourcePlaceholder: 'যেমন ড্রাইভিং, ডেলিভারি',
    save: 'সংরক্ষণ করুন',
    cancel: 'বাতিল করুন',
    edit: 'সম্পাদনা করুন',
    delete: 'মুছুন',
    confirmDelete: 'আপনি কি এই এন্ট্রি মুছতে চান?',

    trendIncreasing: 'বাড়ছে',
    trendStable: 'স্থিতিশীল',
    trendDecreasing: 'কমছে',
  },

  // ── Savings Pocket ────────────────────────────────────────────────────────
  savingsPocket: {
    title: 'সঞ্চয় পকেট',
    surplus: 'আজকের উদ্বৃত্ত',
    suggestedSave: 'সঞ্চয়ের পরামর্শ',
    savingsStreak: 'সঞ্চয় স্ট্রিক',
    streakDays: '{{count}} দিনের স্ট্রিক',
    streakDaysSingular: '{{count}} দিনের স্ট্রিক',
    saveNow: 'এখন সংরক্ষণ করুন',
    skipToday: 'আজ বাদ দিন',
    saved: 'সংরক্ষিত!',
    noSurplus: 'আজ কোনো উদ্বৃত্ত নেই। কাল চালিয়ে যান!',
    saveReason: 'এই পরিমাণ কেন?',
    viewHistory: 'সঞ্চয়ের ইতিহাস দেখুন',
    totalSaved: 'মোট সঞ্চয়',
    thisWeek: 'এই সপ্তাহ',
    thisMonth: 'এই মাস',
  },

  // ── Rainy-Day Fund ────────────────────────────────────────────────────────
  rainyDay: {
    title: 'জরুরি তহবিল',
    target: 'লক্ষ্য',
    current: 'বর্তমান',
    progress: 'অগ্রগতি',
    progressPercent: '{{percent}}% অর্থায়িত',
    targetDays: '{{days}}-দিনের সুরক্ষা',
    daysToTarget: 'লক্ষ্যে পৌঁছাতে {{days}} দিন',
    fundComplete: 'তহবিল সম্পূর্ণ! আপনি সুরক্ষিত।',
    addToFund: 'তহবিলে যোগ করুন',
    fundDescription: '{{days}} দিনের খরচ কভার করে (₹{{amount}}/দিন)',
  },

  // ── Resilience Score ──────────────────────────────────────────────────────
  resilienceScore: {
    title: 'স্থিতিস্থাপকতা স্কোর',
    score: 'স্কোর',
    outOf: '১০০-এর মধ্যে',
    change: 'এই সপ্তাহ {{direction}} {{points}} পয়েন্ট',
    improved: 'উন্নত হয়েছে',
    dropped: 'কমেছে',
    unchanged: 'অপরিবর্তিত',
    factors: 'স্কোরের কারণ',
    positive: 'শক্তি',
    negative: 'উন্নতির ক্ষেত্র',
    volatility: 'আয়ের স্থিতিশীলতা',
    trend: 'আয়ের প্রবণতা',
    savingsStreak: 'সঞ্চয়ের ধারাবাহিকতা',
    bufferProgress: 'জরুরি তহবিল',
    debtBurden: 'ঋণের বোঝা',
    excellent: 'চমৎকার',
    good: 'ভালো',
    fair: 'ঠিকঠাক',
    poor: 'মনোযোগ প্রয়োজন',
  },

  // ── Loan Risk ─────────────────────────────────────────────────────────────
  loanRisk: {
    title: 'ঋণ ঝুঁকি',
    level: 'ঝুঁকির স্তর',
    activeLoans: 'সক্রিয় ঋণ',
    low: 'কম',
    medium: 'মাঝারি',
    high: 'উচ্চ',
    lowDescription: 'আপনার ঋণের বোঝা পরিচালনাযোগ্য।',
    mediumDescription: 'নতুন ঋণ নেওয়ার আগে বিদ্যমান ঋণ পরিশোধ করার কথা ভাবুন।',
    highDescription: 'অধিক ঋণ আপনার স্থিতিস্থাপকতা কমাচ্ছে। পরিশোধকে অগ্রাধিকার দিন।',
    addLoan: 'ঋণ যোগ করুন',
    noLoans: 'কোনো সক্রিয় ঋণ নেই। দারুণ!',
    loanAmount: 'ঋণের পরিমাণ (₹)',
    lender: 'ঋণদাতা',
    dueDate: 'নির্ধারিত তারিখ',
    emi: 'মাসিক EMI (₹)',
  },

  // ── AI Nudge ──────────────────────────────────────────────────────────────
  aiNudge: {
    title: 'AI পরামর্শ',
    loading: 'আপনার ব্যক্তিগতকৃত অন্তর্দৃষ্টি তৈরি হচ্ছে…',
    error: 'অন্তর্দৃষ্টি লোড করা যায়নি। আবার চেষ্টা করুন।',
    retry: 'আবার চেষ্টা করুন',
    poweredBy: 'AI দ্বারা চালিত',
    nudgeLabel: 'আজকের অন্তর্দৃষ্টি',
    dismiss: 'বরখাস্ত করুন',
    helpful: 'সহায়ক',
    notHelpful: 'সহায়ক নয়',
  },

  // ── Common / Shared ───────────────────────────────────────────────────────
  common: {
    loading: 'লোড হচ্ছে…',
    error: 'কিছু একটা ভুল হয়েছে।',
    retry: 'আবার চেষ্টা করুন',
    save: 'সংরক্ষণ করুন',
    cancel: 'বাতিল করুন',
    confirm: 'নিশ্চিত করুন',
    delete: 'মুছুন',
    edit: 'সম্পাদনা করুন',
    close: 'বন্ধ করুন',
    back: 'পেছনে',
    next: 'পরবর্তী',
    done: 'সম্পন্ন',
    yes: 'হ্যাঁ',
    no: 'না',
    of: 'এর মধ্যে',
    currency: '₹',
    days: 'দিন',
    day: 'দিন',
    week: 'সপ্তাহ',
    month: 'মাস',
    today: 'আজ',
    yesterday: 'গতকাল',
    selectLanguage: 'ভাষা নির্বাচন করুন',
    language: 'ভাষা',
    noResults: 'কোনো ফলাফল পাওয়া যায়নি।',
    viewAll: 'সব দেখুন',
    showLess: 'কম দেখুন',
    optional: 'ঐচ্ছিক',
    required: 'প্রয়োজনীয়',
  },

  // ── Volatility labels ─────────────────────────────────────────────────────
  volatility: {
    low: 'কম অস্থিরতা',
    medium: 'মাঝারি অস্থিরতা',
    high: 'উচ্চ অস্থিরতা',
  },

  // ── Errors / Validation ───────────────────────────────────────────────────
  errors: {
    required: 'এই ক্ষেত্রটি প্রয়োজনীয়।',
    invalidAmount: 'অনুগ্রহ করে একটি বৈধ পরিমাণ লিখুন।',
    invalidPhone: 'অনুগ্রহ করে একটি বৈধ ফোন নম্বর লিখুন।',
    networkError: 'নেটওয়ার্ক ত্রুটি। আপনার সংযোগ পরীক্ষা করুন।',
    serverError: 'সার্ভার ত্রুটি। অনুগ্রহ করে পরে আবার চেষ্টা করুন।',
    sessionExpired: 'আপনার সেশন শেষ হয়ে গেছে। অনুগ্রহ করে আবার লগইন করুন।',
  },
};

export default bn;
