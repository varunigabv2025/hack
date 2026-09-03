/**
 * te.js — Telugu (తెలుగు) translations
 * Resilience Engine UI
 */

const te = {
  meta: {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    dir: 'ltr',
  },

  // ── Navigation ────────────────────────────────────────────────────────────
  nav: {
    dashboard: 'డాష్‌బోర్డ్',
    income: 'ఆదాయం',
    savings: 'పొదుపు',
    loans: 'రుణాలు',
    profile: 'ప్రొఫైల్',
    settings: 'సెట్టింగులు',
    logout: 'లాగ్ అవుట్',
    help: 'సహాయం',
  },

  // ── Onboarding ────────────────────────────────────────────────────────────
  onboarding: {
    welcome: 'Resilience Engine కు స్వాగతం',
    subtitle: 'మీ వ్యక్తిగత ఆర్థిక స్థితిస్థాపకత తోడు',
    getStarted: 'ప్రారంభించండి',
    next: 'తదుపరి',
    back: 'వెనుకకు',
    finish: 'సెటప్ పూర్తి చేయండి',
    step: 'దశ {{current}} / {{total}}',

    fullName: 'పూర్తి పేరు',
    fullNamePlaceholder: 'మీ పూర్తి పేరు నమోదు చేయండి',
    phoneNumber: 'ఫోన్ నంబర్',
    phoneNumberPlaceholder: 'మీ ఫోన్ నంబర్ నమోదు చేయండి',
    dailyExpenses: 'సగటు రోజువారీ ఖర్చులు (₹)',
    dailyExpensesPlaceholder: 'ఉదా. 500',
    occupation: 'వృత్తి',
    occupationPlaceholder: 'ఉదా. ఆటో డ్రైవర్, వీధి వ్యాపారి',
    city: 'నగరం',
    cityPlaceholder: 'మీ నగరం నమోదు చేయండి',
    preferredLanguage: 'ప్రాధాన్య భాష',

    step1Title: 'మీ గురించి చెప్పండి',
    step1Subtitle: 'మీ అనుభవాన్ని వ్యక్తిగతీకరించడానికి ప్రాథమిక వివరాలు',
    step2Title: 'మీ రోజువారీ ఆర్థికాలు',
    step2Subtitle: 'మీ ఆదాయం మరియు ఖర్చులను అర్థం చేసుకోవడంలో సహాయపడండి',
    step3Title: 'అన్నీ సిద్ధంగా ఉన్నాయి!',
    step3Subtitle: 'మీ స్థితిస్థాపకత ప్రయాణం ఇప్పుడు ప్రారంభమవుతుంది',
  },

  // ── Dashboard ─────────────────────────────────────────────────────────────
  dashboard: {
    title: 'డాష్‌బోర్డ్',
    greeting: 'శుభ {{timeOfDay}}, {{name}}!',
    morning: 'ప్రభాతం',
    afternoon: 'మధ్యాహ్నం',
    evening: 'సాయంత్రం',
    todayOverview: 'నేటి సమీక్ష',
    lastUpdated: 'చివరిగా {{time}} కి నవీకరించబడింది',
    refresh: 'రిఫ్రెష్',
    noData: 'ఇంకా డేటా అందుబాటులో లేదు. మీ ఆదాయాన్ని ట్రాక్ చేయడం ప్రారంభించండి.',
  },

  // ── Income ────────────────────────────────────────────────────────────────
  income: {
    title: 'ఆదాయం',
    todayIncome: 'నేటి ఆదాయం',
    addIncome: 'ఆదాయం జోడించండి',
    incomeHistory: 'ఆదాయ చరిత్ర',
    baseline: 'బేస్‌లైన్ (7-రోజుల సగటు)',
    trend: 'ధోరణి',
    prediction: 'తదుపరి వారం అంచనా',
    predictionRange: '₹{{low}} – ₹{{high}}',
    noHistory: 'ఇంకా ఆదాయం నమోదు కాలేదు.',
    addFirst: 'మీ మొదటి ఆదాయ ఎంట్రీ జోడించండి',
    amount: 'మొత్తం (₹)',
    amountPlaceholder: 'మొత్తం నమోదు చేయండి',
    date: 'తేదీ',
    source: 'మూలం',
    sourcePlaceholder: 'ఉదా. డ్రైవింగ్, డెలివరీ',
    save: 'సేవ్ చేయండి',
    cancel: 'రద్దు చేయండి',
    edit: 'సవరించండి',
    delete: 'తొలగించండి',
    confirmDelete: 'ఈ ఎంట్రీని తొలగించాలనుకుంటున్నారా?',

    trendIncreasing: 'పెరుగుతోంది',
    trendStable: 'స్థిరంగా ఉంది',
    trendDecreasing: 'తగ్గుతోంది',
  },

  // ── Savings Pocket ────────────────────────────────────────────────────────
  savingsPocket: {
    title: 'పొదుపు జేబు',
    surplus: 'నేటి మిగులు',
    suggestedSave: 'పొదుపు చేయడానికి సూచన',
    savingsStreak: 'పొదుపు స్ట్రీక్',
    streakDays: '{{count}} రోజుల స్ట్రీక్',
    streakDaysSingular: '{{count}} రోజు స్ట్రీక్',
    saveNow: 'ఇప్పుడు పొదుపు చేయండి',
    skipToday: 'నేడు దాటవేయండి',
    saved: 'పొదుపు చేయబడింది!',
    noSurplus: 'నేడు మిగులు లేదు. రేపు కొనసాగండి!',
    saveReason: 'ఈ మొత్తం ఎందుకు?',
    viewHistory: 'పొదుపు చరిత్ర చూడండి',
    totalSaved: 'మొత్తం పొదుపు',
    thisWeek: 'ఈ వారం',
    thisMonth: 'ఈ నెల',
  },

  // ── Rainy-Day Fund ────────────────────────────────────────────────────────
  rainyDay: {
    title: 'అత్యవసర నిధి',
    target: 'లక్ష్యం',
    current: 'ప్రస్తుతం',
    progress: 'పురోగతి',
    progressPercent: '{{percent}}% నిధి కలిగి ఉంది',
    targetDays: '{{days}}-రోజుల భద్రత',
    daysToTarget: 'లక్ష్యానికి {{days}} రోజులు',
    fundComplete: 'నిధి పూర్తయింది! మీరు రక్షించబడ్డారు.',
    addToFund: 'నిధికి జోడించండి',
    fundDescription: '{{days}} రోజుల ఖర్చులను కవర్ చేస్తుంది (₹{{amount}}/రోజు)',
  },

  // ── Resilience Score ──────────────────────────────────────────────────────
  resilienceScore: {
    title: 'స్థితిస్థాపకత స్కోర్',
    score: 'స్కోర్',
    outOf: '100 లో',
    change: 'ఈ వారం {{direction}} {{points}} పాయింట్లు',
    improved: 'మెరుగుపడింది',
    dropped: 'తగ్గింది',
    unchanged: 'మారలేదు',
    factors: 'స్కోర్ కారకాలు',
    positive: 'బలాలు',
    negative: 'మెరుగుపరచవలసిన రంగాలు',
    volatility: 'ఆదాయ స్థిరత్వం',
    trend: 'ఆదాయ ధోరణి',
    savingsStreak: 'పొదుపు స్థిరత్వం',
    bufferProgress: 'అత్యవసర నిధి',
    debtBurden: 'రుణ భారం',
    excellent: 'అద్భుతం',
    good: 'మంచిది',
    fair: 'సరిగ్గా ఉంది',
    poor: 'శ్రద్ధ అవసరం',
  },

  // ── Loan Risk ─────────────────────────────────────────────────────────────
  loanRisk: {
    title: 'రుణ ప్రమాదం',
    level: 'ప్రమాద స్థాయి',
    activeLoans: 'చురుకైన రుణాలు',
    low: 'తక్కువ',
    medium: 'మధ్యస్థం',
    high: 'అధికం',
    lowDescription: 'మీ రుణ భారం నిర్వహించదగినది.',
    mediumDescription: 'కొత్త రుణాలు తీసుకునే ముందు ఇప్పటికే ఉన్న రుణాలను చెల్లించడాన్ని పరిగణించండి.',
    highDescription: 'అధిక రుణ సంఖ్య మీ స్థితిస్థాపకతను తగ్గిస్తోంది. చెల్లింపులకు ప్రాధాన్యత ఇవ్వండి.',
    addLoan: 'రుణం జోడించండి',
    noLoans: 'చురుకైన రుణాలు లేవు. చాలా బాగుంది!',
    loanAmount: 'రుణ మొత్తం (₹)',
    lender: 'రుణదాత',
    dueDate: 'గడువు తేదీ',
    emi: 'నెలవారీ EMI (₹)',
  },

  // ── AI Nudge ──────────────────────────────────────────────────────────────
  aiNudge: {
    title: 'AI సూచన',
    loading: 'మీ వ్యక్తిగత అంతర్దృష్టి రూపొందిస్తోంది…',
    error: 'అంతర్దృష్టి లోడ్ చేయడం సాధ్యపడలేదు. మళ్ళీ ప్రయత్నించండి.',
    retry: 'మళ్ళీ ప్రయత్నించండి',
    poweredBy: 'AI ద్వారా నడపబడుతోంది',
    nudgeLabel: 'నేటి అంతర్దృష్టి',
    dismiss: 'తొలగించు',
    helpful: 'సహాయకరంగా ఉంది',
    notHelpful: 'సహాయకరంగా లేదు',
  },

  // ── Common / Shared ───────────────────────────────────────────────────────
  common: {
    loading: 'లోడ్ అవుతోంది…',
    error: 'ఏదో తప్పు జరిగింది.',
    retry: 'మళ్ళీ ప్రయత్నించండి',
    save: 'సేవ్ చేయండి',
    cancel: 'రద్దు చేయండి',
    confirm: 'నిర్ధారించండి',
    delete: 'తొలగించండి',
    edit: 'సవరించండి',
    close: 'మూసివేయండి',
    back: 'వెనుకకు',
    next: 'తదుపరి',
    done: 'పూర్తయింది',
    yes: 'అవును',
    no: 'కాదు',
    of: 'లో',
    currency: '₹',
    days: 'రోజులు',
    day: 'రోజు',
    week: 'వారం',
    month: 'నెల',
    today: 'నేడు',
    yesterday: 'నిన్న',
    selectLanguage: 'భాషను ఎంచుకోండి',
    language: 'భాష',
    noResults: 'ఫలితాలు కనుగొనబడలేదు.',
    viewAll: 'అన్నీ చూడండి',
    showLess: 'తక్కువ చూపించు',
    optional: 'ఐచ్ఛికం',
    required: 'అవసరం',
  },

  // ── Volatility labels ─────────────────────────────────────────────────────
  volatility: {
    low: 'తక్కువ హెచ్చుతగ్గులు',
    medium: 'మధ్యస్థ హెచ్చుతగ్గులు',
    high: 'అధిక హెచ్చుతగ్గులు',
  },

  // ── Errors / Validation ───────────────────────────────────────────────────
  errors: {
    required: 'ఈ ఫీల్డ్ అవసరం.',
    invalidAmount: 'దయచేసి చెల్లుబాటు అయ్యే మొత్తాన్ని నమోదు చేయండి.',
    invalidPhone: 'దయచేసి చెల్లుబాటు అయ్యే ఫోన్ నంబర్ నమోదు చేయండి.',
    networkError: 'నెట్‌వర్క్ లోపం. దయచేసి మీ కనెక్షన్ తనిఖీ చేయండి.',
    serverError: 'సర్వర్ లోపం. దయచేసి తర్వాత మళ్ళీ ప్రయత్నించండి.',
    sessionExpired: 'మీ సెషన్ గడువు ముగిసింది. దయచేసి మళ్ళీ లాగిన్ చేయండి.',
  },
};

export default te;
