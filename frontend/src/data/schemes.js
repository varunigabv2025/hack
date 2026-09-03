/**
 * Government scheme catalog for Indian gig / platform workers.
 * Matching is advisory — not an official eligibility certificate.
 */

export const schemes = [
  {
    id: 'eshram',
    name: 'e-Shram',
    shortName: 'e-Shram',
    category: 'Identity & benefits',
    authority: 'Ministry of Labour & Employment',
    summary: 'National database for unorganised workers with a Universal Account Number (UAN).',
    benefit: 'Access to social security schemes, accident insurance cover pathways, and worker identity.',
    tags: ['gig', 'unorganised', 'registration'],
    link: 'https://eshram.gov.in/',
    fit: ({ occupation }) =>
      ['Uber', 'Ola', 'Swiggy', 'Zomato', 'Rapido', 'Dunzo'].includes(occupation) ? 96 : 70,
    why: () => 'Platform / gig work is treated as unorganised work — e-Shram is the base registration.',
  },
  {
    id: 'pmsby',
    name: 'PM Suraksha Bima Yojana',
    shortName: 'PMSBY',
    category: 'Insurance',
    authority: 'Govt. of India',
    summary: 'Low-cost accidental death & disability cover for working-age adults.',
    benefit: '₹2 lakh accidental cover at a very low annual premium via bank account.',
    tags: ['insurance', 'accident', 'low-cost'],
    link: 'https://www.jansuraksha.gov.in/',
    fit: ({ baseline, occupation }) => {
      if (!occupation) return 60
      if (baseline != null && baseline < 1200) return 92
      return 84
    },
    why: ({ baseline }) =>
      baseline != null && baseline < 1200
        ? 'Your usual daily income is modest — a cheap accident cover protects income shocks.'
        : 'Gig driving/delivery has on-road risk; PMSBY is an affordable safety layer.',
  },
  {
    id: 'pmjjby',
    name: 'PM Jeevan Jyoti Bima Yojana',
    shortName: 'PMJJBY',
    category: 'Insurance',
    authority: 'Govt. of India',
    summary: 'Life insurance cover for bank account holders in the eligible age band.',
    benefit: '₹2 lakh life cover with annual premium deducted from savings account.',
    tags: ['insurance', 'life'],
    link: 'https://www.jansuraksha.gov.in/',
    fit: ({ score, buffer }) => {
      if (score < 65 || buffer < 50) return 88
      return 72
    },
    why: ({ score }) =>
      score < 65
        ? 'Your resilience score is still building — life cover reduces family risk while you grow savings.'
        : 'Pairs well with your growing savings habit for household protection.',
  },
  {
    id: 'pmsym',
    name: 'PM Shram Yogi Maandhan (PM-SYM)',
    shortName: 'PM-SYM',
    category: 'Pension',
    authority: 'Ministry of Labour & Employment',
    summary: 'Voluntary pension for unorganised workers in the eligible age and income band.',
    benefit: 'Contributory pension pathway after 60 for eligible unorganised workers.',
    tags: ['pension', 'unorganised'],
    link: 'https://maandhan.in/',
    fit: ({ occupation }) => (occupation ? 88 : 60),
    why: () => 'Gig / unorganised work is the intended PM-SYM audience — verify age and income on the official portal.',
  },
  {
    id: 'apy',
    name: 'Atal Pension Yojana',
    shortName: 'APY',
    category: 'Retirement',
    authority: 'PFRDA / Govt. of India',
    summary: 'Guaranteed pension for workers in the unorganised sector.',
    benefit: 'Fixed monthly pension after 60, with government co-contribution for eligible joiners.',
    tags: ['pension', 'long-term'],
    link: 'https://www.npscra.nsdl.co.in/scheme-details.php',
    fit: ({ streak, suggested, baseline }) => {
      let s = 68
      if (streak >= 3) s += 12
      if (suggested > 0) s += 8
      if (baseline >= 700) s += 5
      return Math.min(95, s)
    },
    why: ({ streak }) =>
      streak >= 3
        ? `You already have a ${streak}-day savings streak — APY can turn that habit into retirement income.`
        : 'Even small auto-debits from surplus days can fund a future pension.',
  },
  {
    id: 'pmjay',
    name: 'Ayushman Bharat (PM-JAY)',
    shortName: 'PM-JAY',
    category: 'Health',
    authority: 'NHA',
    summary: 'Health insurance for eligible families for hospitalisation care.',
    benefit: 'Cashless treatment cover up to scheme limits at empanelled hospitals.',
    tags: ['health', 'hospitalisation'],
    link: 'https://pmjay.gov.in/',
    fit: ({ buffer, score }) => {
      if (buffer < 60) return 86
      if (score < 70) return 78
      return 64
    },
    why: ({ buffer }) =>
      buffer < 60
        ? 'Your emergency buffer is under 60% — health cover reduces the chance of a medical bill wiping savings.'
        : 'Still useful as a hospitalisation backstop alongside your pocket.',
  },
  {
    id: 'state-gig',
    name: 'State Gig Worker Welfare Boards',
    shortName: 'State Gig Board',
    category: 'State welfare',
    authority: 'State governments',
    summary: 'Emerging state boards / welfare funds for platform workers (TN, KA, RJ and others).',
    benefit: 'Registration may unlock accident aid, health support, or skill benefits depending on state rules.',
    tags: ['state', 'welfare', 'gig'],
    link: 'https://labour.gov.in/',
    fit: ({ state, occupation }) => {
      const gigStates = ['Tamil Nadu', 'Karnataka', 'Rajasthan', 'Telangana', 'Maharashtra']
      if (gigStates.includes(state) && occupation) return 90
      if (occupation) return 74
      return 55
    },
    why: ({ state }) =>
      state
        ? `${state} is actively discussing / rolling out platform-worker welfare — worth tracking registration drives.`
        : 'Several states are creating gig-worker boards — register when your state opens enrollment.',
  },
  {
    id: 'mudra',
    name: 'PM Mudra / micro-credit pathways',
    shortName: 'MUDRA',
    category: 'Credit',
    authority: 'SIDBI / banks',
    summary: 'Collateral-light micro loans for micro enterprises and self-employed workers.',
    benefit: 'May help fund a bike upgrade, phone, or small working-capital need — only if cashflow is stable.',
    tags: ['credit', 'self-employed'],
    link: 'https://www.mudra.org.in/',
    fit: ({ trend, score, surplus }) => {
      if (trend === 'UP' && score >= 70 && surplus > 0) return 80
      if (trend === 'DOWN' || score < 60) return 35
      return 55
    },
    why: ({ trend, score }) =>
      trend === 'UP' && score >= 70
        ? 'Income trend and score look stable enough to explore micro-credit carefully — never stack high-cost apps.'
        : 'Skip high-cost loans for now; rebuild surplus and score before taking credit.',
  },
  {
    id: 'udyam',
    name: 'Udyam Registration',
    shortName: 'Udyam',
    category: 'Enterprise',
    authority: 'Ministry of MSME',
    summary: 'MSME registration for self-employed / micro businesses.',
    benefit: 'Opens doors to MSME schemes, priority sector lending, and formal identity for your work.',
    tags: ['msme', 'formalisation'],
    link: 'https://udyamregistration.gov.in/',
    fit: ({ occupation, streak }) => {
      if (occupation && streak >= 2) return 76
      return 62
    },
    why: () => 'If you operate as self-employed, Udyam helps formalise your work identity.',
  },
  {
    id: 'vishwakarma',
    name: 'PM Vishwakarma',
    shortName: 'Vishwakarma',
    category: 'Skilling',
    authority: 'Govt. of India',
    summary: 'Support for traditional artisans and craftspeople (skill, toolkit, credit pathways).',
    benefit: 'May help if your work maps to a notified trade — check the official list before applying.',
    tags: ['skill', 'credit'],
    link: 'https://pmvishwakarma.gov.in/',
    fit: () => 58,
    why: () => 'Only a fit if your occupation is a notified Vishwakarma trade — most platform driving/delivery work will rank lower.',
  },
]
