/**
 * Site-wide personalization from coach hardship / focus choices.
 * Never invents money numbers — only surfaces focus + safe next steps.
 */

export const FOCUS_CATALOG = {
  medical: {
    id: 'medical',
    flag: 'medical',
    label: { en: 'Medical stress', ta: 'மருத்துவ அழுத்தம்' },
    short: { en: 'Medical', ta: 'மருத்துவம்' },
    guidance: {
      en: 'Protect essentials and health-related spend. Prefer schemes and verified support over a new loan.',
      ta: 'அத்தியாவசியம் மற்றும் மருத்துவச் செலவைப் பாதுகாக்கவும். புதிய கடனுக்குப் பதில் திட்டங்கள் / உறுதிப்படுத்தப்பட்ட ஆதரவைத் தேர்வு செய்யுங்கள்.',
    },
    cta: { en: 'Open health schemes', ta: 'சுகாதாரத் திட்டங்களைத் திற' },
    to: '/schemes',
    badWeekId: 'medical',
    schemeBoost: ['pmjay', 'eshram'],
    tone: 'rose',
  },
  weather: {
    id: 'weather',
    flag: 'weather_disruption',
    label: { en: 'Weather disruption', ta: 'வானிலை இடையூறு' },
    short: { en: 'Weather', ta: 'வானிலை' },
    guidance: {
      en: 'Rain or floods can cut trips. Stress-test your buffer and prep a bad-week plan.',
      ta: 'மழை / வெள்ளம் பயணங்களைக் குறைக்கலாம். பாதுகாப்பு நிதியைச் சோதித்து கெட்ட-வாரத் திட்டம் தயாரிக்கவும்.',
    },
    cta: { en: 'Open Bad Week Simulator', ta: 'கெட்ட வாரம் சிமுலேட்டர்' },
    to: '/bad-week',
    badWeekId: 'rain-flood',
    schemeBoost: ['eshram'],
    tone: 'gold',
  },
  income_shock: {
    id: 'income_shock',
    flag: 'no_work',
    label: { en: 'No-work / income shock', ta: 'வேலை இல்லை / வருமான அதிர்ச்சி' },
    short: { en: 'Income shock', ta: 'வருமான அதிர்ச்சி' },
    guidance: {
      en: 'Platform downtime hurts cash flow. Grow a small buffer before stacking debt.',
      ta: 'தள இடைவெளி பண ஓட்டத்தைப் பாதிக்கும். கடன் அடுக்குவதற்கு முன் சிறிய பாதுகாப்பு நிதி வளர்க்கவும்.',
    },
    cta: { en: 'Stress-test buffer', ta: 'பாதுகாப்பு நிதியைச் சோதி' },
    to: '/bad-week',
    badWeekId: 'no-work-3',
    schemeBoost: ['eshram', 'ncs'],
    tone: 'burgundy',
  },
  loan_risk: {
    id: 'loan_risk',
    flag: 'loan_pressure',
    label: { en: 'Loan pressure', ta: 'கடன் அழுத்தம்' },
    short: { en: 'Loans', ta: 'கடன்' },
    guidance: {
      en: 'Avoid another loan this week. Review stacking risk and protect EMI cash flow.',
      ta: 'இந்த வாரம் மற்றொரு கடன் எடுக்க வேண்டாம். அடுக்கு அபாயத்தைப் பார்த்து தவணை பண ஓட்டத்தைப் பாதுகாக்கவும்.',
    },
    cta: { en: 'Review loan stacking', ta: 'கடன் அடுக்கைப் பார்க்கவும்' },
    to: '/loans',
    badWeekId: 'income-drop-30',
    schemeBoost: ['eshram'],
    tone: 'rose',
  },
  family_expense: {
    id: 'family_expense',
    flag: 'family_expense',
    label: { en: 'Family / school expense', ta: 'குடும்ப / பள்ளிச் செலவு' },
    short: { en: 'Family', ta: 'குடும்பம்' },
    guidance: {
      en: 'Plan a named goal for school or family costs and delay non-essentials.',
      ta: 'பள்ளி / குடும்பச் செலவுக்கு இலக்கு அமைத்து அத்தியாவசியம் அல்லாதவற்றைத் தள்ளிப்போடுங்கள்.',
    },
    cta: { en: 'Open Goals', ta: 'இலக்குகளைத் திற' },
    to: '/goals',
    badWeekId: 'family-expense',
    schemeBoost: ['eshram'],
    tone: 'gold',
  },
  fuel: {
    id: 'fuel',
    flag: 'fuel_cost',
    label: { en: 'Fuel cost squeeze', ta: 'எரிபொருள் செலவு அழுத்தம்' },
    short: { en: 'Fuel', ta: 'எரிபொருள்' },
    guidance: {
      en: 'Higher fuel shrinks take-home pay. Log expenses and save any small surplus.',
      ta: 'எரிபொருள் விலை வருமானத்தைக் குறைக்கும். செலவுகளைப் பதிவு செய்து சிறிய உபரியைச் சேமியுங்கள்.',
    },
    cta: { en: 'Log expenses', ta: 'செலவுகளைப் பதிவு செய்' },
    to: '/expenses',
    badWeekId: 'fuel-price',
    schemeBoost: [],
    tone: 'gold',
  },
}

const FLAG_TO_FOCUS = {
  medical: 'medical',
  weather_disruption: 'weather',
  no_work: 'income_shock',
  loan_pressure: 'loan_risk',
  family_expense: 'family_expense',
  fuel_cost: 'fuel',
}

function langCode(lang) {
  return lang === 'ta' ? 'ta' : 'en'
}

export function resolveFocusIds(settings = {}) {
  const fromFocus = Array.isArray(settings.focusAreas) ? settings.focusAreas : []
  const fromFlags = (Array.isArray(settings.hardshipFlags) ? settings.hardshipFlags : [])
    .map((f) => FLAG_TO_FOCUS[f])
    .filter(Boolean)
  return [...new Set([...fromFocus, ...fromFlags])].filter((id) => FOCUS_CATALOG[id])
}

export function getPersonalization(dashboard = {}, lang = 'en') {
  const settings = dashboard.settings || {}
  const code = langCode(lang)
  const focusIds = resolveFocusIds(settings)
  const items = focusIds.map((id) => {
    const entry = FOCUS_CATALOG[id]
    return {
      id,
      label: entry.label[code],
      short: entry.short[code],
      guidance: entry.guidance[code],
      cta: entry.cta[code],
      to: entry.to,
      badWeekId: entry.badWeekId,
      schemeBoost: entry.schemeBoost || [],
      tone: entry.tone,
      note: (settings.hardshipNotes || []).find((n) =>
        n.toLowerCase().includes(entry.short.en.toLowerCase().split(' ')[0]),
      ),
    }
  })

  const primary = items[items.length - 1] || null
  const notes = Array.isArray(settings.hardshipNotes) ? settings.hardshipNotes.slice(-4) : []

  return {
    active: items.length > 0,
    items,
    primary,
    notes,
    customizedAt: settings.coachCustomizedAt || null,
    headline: primary
      ? code === 'ta'
        ? `உங்கள் கவனம்: ${primary.label}`
        : `Your focus: ${primary.label}`
      : null,
    summary:
      items.length === 0
        ? null
        : code === 'ta'
          ? `பயிற்சியாளர் தனிப்பயனாக்கம் · ${items.map((i) => i.short).join(' · ')}`
          : `Coach personalization · ${items.map((i) => i.short).join(' · ')}`,
  }
}

/** Prefer hardship-aware next action when coach focus is set. */
export function resolvePersonalizedAction(dashboard = {}, lang = 'en') {
  const pers = getPersonalization(dashboard, lang)
  if (!pers.primary) return null

  const p = pers.primary
  const code = langCode(lang)

  if (p.id === 'medical') {
    return {
      id: 'focus-medical',
      title: code === 'ta' ? 'மருத்துவ ஆதரவு பாதையைப் பின்பற்றுங்கள்' : 'Follow the medical support pathway',
      detail: p.guidance,
      cta: p.cta,
      to: p.to,
      tone: 'rose',
      ctaKey: 'ctaOpenSchemeStudio',
    }
  }
  if (p.id === 'loan_risk') {
    return {
      id: 'focus-loan',
      title: code === 'ta' ? 'இந்த வாரம் மற்றொரு கடன் எடுக்க வேண்டாம்' : 'Avoid taking another loan this week',
      titleKey: 'nextActionAvoidLoan',
      detail: p.guidance,
      cta: p.cta,
      to: p.to,
      tone: 'rose',
      ctaKey: 'ctaReviewLoanStacking',
    }
  }
  if (p.id === 'weather' || p.id === 'income_shock') {
    return {
      id: 'focus-shock',
      title: code === 'ta' ? 'கெட்ட வாரத்திற்கு உங்கள் பையைச் சோதிக்கவும்' : 'Stress-test your pocket for a bad week',
      detail: p.guidance,
      cta: p.cta,
      to: p.to,
      tone: 'gold',
    }
  }
  if (p.id === 'family_expense') {
    return {
      id: 'focus-family',
      title: code === 'ta' ? 'குடும்பச் செலவுக்கு இலக்கு அமைக்கவும்' : 'Set a goal for the family expense',
      detail: p.guidance,
      cta: p.cta,
      to: p.to,
      tone: 'gold',
    }
  }
  if (p.id === 'fuel') {
    return {
      id: 'focus-fuel',
      title: code === 'ta' ? 'எரிபொருள் செலவைப் பதிவு செய்து உபரியைச் சேமியுங்கள்' : 'Log fuel spend and save any surplus',
      detail: p.guidance,
      cta: p.cta,
      to: p.to,
      tone: 'burgundy',
      ctaKey: 'ctaReviewExpenses',
    }
  }
  return {
    id: `focus-${p.id}`,
    title: p.label,
    detail: p.guidance,
    cta: p.cta,
    to: p.to,
    tone: p.tone || 'burgundy',
  }
}

export function clearPersonalizationPatch() {
  return {
    settings: {
      focusAreas: [],
      hardshipFlags: [],
      hardshipNotes: [],
      coachCustomizedAt: null,
    },
  }
}

export function removeFocusPatch(settings = {}, focusId) {
  const entry = FOCUS_CATALOG[focusId]
  const focusAreas = (settings.focusAreas || []).filter((f) => f !== focusId)
  const hardshipFlags = (settings.hardshipFlags || []).filter((f) => f !== entry?.flag)
  const hardshipNotes = (settings.hardshipNotes || []).filter((n) => {
    if (!entry) return true
    const token = entry.short.en.toLowerCase().split(' ')[0]
    return !String(n).toLowerCase().includes(token)
  })
  return {
    settings: {
      ...settings,
      focusAreas,
      hardshipFlags,
      hardshipNotes,
      coachCustomizedAt: focusAreas.length ? settings.coachCustomizedAt : null,
    },
  }
}
