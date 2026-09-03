/**
 * Difficulty coach — listens to lived problems and proposes safe account customizations.
 * Never invents financial numbers; only sets flags / preferences the user stated.
 */

import { buildSpokenNudge } from './i18n'

function uniq(list = []) {
  return [...new Set(list.filter(Boolean))]
}

/**
 * @returns {{
 *   reply: string,
 *   patches: { user?: object, settings?: object },
 *   applied: string[],
 *   speak?: string
 * }}
 */
export function interpretDifficulty(userText, dashboard = {}, lang = 'en') {
  const raw = String(userText || '').trim()
  const q = raw.toLowerCase()
  const isTa = lang === 'ta' || /[\u0B80-\u0BFF]/.test(raw)

  const focus = [...(dashboard.settings?.focusAreas || [])]
  const flags = [...(dashboard.settings?.hardshipFlags || [])]
  const notes = [...(dashboard.settings?.hardshipNotes || [])]
  const applied = []
  const user = {}
  const settings = {}

  const pushNote = (note) => {
    if (!notes.includes(note)) notes.push(note)
  }

  if (/மழை|rain|flood|வெள்ள/.test(q) || /மழை|rain|flood/.test(raw)) {
    focus.push('weather')
    flags.push('weather_disruption')
    pushNote('Weather / rain disruption affecting trips')
    applied.push(isTa ? 'வானிலை எச்சரிக்கை இயக்கப்பட்டது' : 'Weather focus enabled')
  }

  if (/வேலை இல்லை|no work|no trip|account block|suspend|சஸ்பெண்ட்/.test(q)) {
    focus.push('income_shock')
    flags.push('no_work')
    pushNote('Temporary no-work / platform disruption')
    applied.push(isTa ? 'வருமான அதிர்ச்சி குறிக்கப்பட்டது' : 'Income-shock focus enabled')
  }

  if (/கடன்|loan|debt|emi|interest|வட்டி/.test(q)) {
    focus.push('loan_risk')
    flags.push('loan_pressure')
    pushNote('Loan / EMI pressure reported')
    applied.push(isTa ? 'கடன் எச்சரிக்கை இயக்கப்பட்டது' : 'Loan-pressure focus enabled')
  }

  if (/மருத்துவ|hospital|medical|illness|health|மருந்து/.test(q)) {
    focus.push('medical')
    flags.push('medical')
    pushNote('Medical / health expense stress')
    applied.push(isTa ? 'மருத்துவ ஆதரவு பாதை' : 'Medical support pathway noted')
  }

  if (/குடும்ப|family|school|கல்வி|fees|child|பிள்ளை/.test(q)) {
    focus.push('family_expense')
    flags.push('family_expense')
    pushNote('Family / school expense pressure')
    applied.push(isTa ? 'குடும்பச் செலவு கவனம்' : 'Family-expense focus enabled')
  }

  if (/petrol|fuel|டீசல்|பெட்ரோல்|diesel/.test(q)) {
    focus.push('fuel')
    flags.push('fuel_cost')
    pushNote('Fuel cost squeeze')
    applied.push(isTa ? 'எரிபொருள் செலவு கவனம்' : 'Fuel-cost focus enabled')
  }

  if (/தமிழ்|tamil/.test(q)) {
    user.language = 'ta'
    applied.push('Language → தமிழ்')
  } else if (/\benglish\b|ஆங்கிலம்/.test(q)) {
    user.language = 'en'
    applied.push('Language → English')
  }

  if (/easy mode|large text|low literacy|எளிய|பெரிய எழுத்து/.test(q)) {
    settings.lowLiteracy = true
    applied.push(isTa ? 'எளிய முறை இயக்கப்பட்டது' : 'Easy mode enabled')
  }

  // Occupation hints (only if clearly stated)
  const occMap = [
    [/swiggy|zomato|food delivery|டெலிவரி/, 'Swiggy'],
    [/uber|ola|rapido|auto|bike taxi/, 'Uber'],
    [/dunzo/, 'Dunzo'],
  ]
  for (const [re, occ] of occMap) {
    if (re.test(q) && /work|job|drive|delivery|rider|வேலை/.test(q)) {
      user.occupation = occ
      applied.push(isTa ? `தொழில் → ${occ}` : `Occupation → ${occ}`)
      break
    }
  }

  settings.focusAreas = uniq(focus).slice(-6)
  settings.hardshipFlags = uniq(flags).slice(-6)
  settings.hardshipNotes = notes.slice(-8)

  const patches = {}
  if (Object.keys(user).length) patches.user = user
  if (applied.length) {
    settings.coachCustomizedAt = new Date().toISOString().slice(0, 10)
    patches.settings = settings
  }

  const buffer = dashboard.savings?.emergencyProgress ?? 0
  const suggested = dashboard.savings?.suggested
  const score = dashboard.resilience?.score

  let reply
  if (applied.length === 0) {
    reply = isTa
      ? 'சொல்லுங்கள் — மழை, கடன், மருத்துவம், குடும்பச் செலவு, அல்லது வேலை இல்லாத நாள். உங்கள் கணக்கை அதற்கேற்ப மாற்றுகிறேன். பண எண்ணிக்கைகளை நான் உருவாக்கமாட்டேன்.'
      : 'Tell me what’s hard right now — rain, loans, medical costs, family expenses, or no-work days. I’ll customize your account focus. I won’t invent money numbers.'
  } else {
    const focusLine = settings.focusAreas.join(', ')
    const saveHint =
      suggested != null && Number(suggested) > 0
        ? isTa
          ? ` இயந்திரம் இன்று ₹${suggested} பாதுகாப்பாக சேமிக்கச் சொல்கிறது.`
          : ` The engine marks ₹${suggested} as safe to save today.`
        : ''
    const crisisHint =
      flags.includes('medical') || flags.includes('loan_pressure') || buffer < 25
        ? isTa
          ? ' நெருக்கடி போல் இருந்தால் அரசு உதவி / உதவி எண்ணை பாருங்கள் (Responsible AI).'
          : ' If this feels like a crisis, open Responsible AI for verified support — not a new loan.'
        : ''

    reply = isTa
      ? `கேட்டேன். உங்கள் கணக்கை மாற்றினேன்: ${applied.join(' · ')}. தற்போதைய கவனம்: ${focusLine || 'பொது'}. மதிப்பெண் ${score ?? '—'}/100, பாதுகாப்பு நிதி ${buffer}%.${saveHint}${crisisHint}`
      : `Heard. I customized your account: ${applied.join(' · ')}. Current focus: ${focusLine || 'general'}. Score ${score ?? '—'}/100, buffer ${buffer}%.${saveHint}${crisisHint}`
  }

  return {
    reply,
    patches,
    applied,
    speak: reply,
  }
}

export function difficultySuggestions(lang = 'en') {
  if (lang === 'ta') {
    return ['மழை காரணமாக வருமானம் குறைவு', 'கடன் அழுத்தம் உள்ளது', 'மருத்துவச் செலவு', 'எளிய முறை வேண்டும்']
  }
  return ['Rain cut my income', 'Loan pressure this week', 'Medical expense stress', 'Switch to easy mode']
}

export function difficultyOpening(dashboard, lang = 'en') {
  const spoken = buildSpokenNudge(dashboard, lang)
  if (lang === 'ta') {
    return {
      title: 'உங்கள் சிரமங்களைச் சொல்லுங்கள்',
      text: `${spoken} இங்கே மழை, கடன், மருத்துவம் அல்லது குடும்பச் செலவைச் சொல்லுங்கள் — உங்கள் கணக்கை அதற்கேற்ப மாற்றுவேன்.`,
    }
  }
  return {
    title: 'Tell me what’s hard',
    text: `${spoken} Share rain, loans, medical bills, or family costs here — I’ll customize your account focus. Voice works too.`,
  }
}
