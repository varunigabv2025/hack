export const currencies = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', region: 'India', accent: '#6B2D5B', rateFromInr: 1 },
  { code: 'USD', symbol: '$', name: 'US Dollar', region: 'United States', accent: '#059669', rateFromInr: 0.012 },
  { code: 'EUR', symbol: '€', name: 'Euro', region: 'Europe', accent: '#2563EB', rateFromInr: 0.011 },
  { code: 'GBP', symbol: '£', name: 'Pound Sterling', region: 'United Kingdom', accent: '#7C3AED', rateFromInr: 0.0095 },
  { code: 'JPY', symbol: '¥', name: 'Yen', region: 'Japan', accent: '#DC2626', rateFromInr: 1.82 },
  { code: 'KRW', symbol: '₩', name: 'Won', region: 'South Korea', accent: '#0D9488', rateFromInr: 16.2 },
  { code: 'NGN', symbol: '₦', name: 'Naira', region: 'Nigeria', accent: '#EA580C', rateFromInr: 18.5 },
  { code: 'ZAR', symbol: 'R', name: 'Rand', region: 'South Africa', accent: '#C9842F', rateFromInr: 0.22 },
]

const symbolToCode = Object.fromEntries(currencies.map((c) => [c.symbol, c.code]))

export function getCurrency(code) {
  return currencies.find((c) => c.code === code) || currencies[0]
}

export function getCurrencyBySymbol(symbol) {
  return getCurrency(symbolToCode[symbol])
}

export function convertFromInr(amountInr, code) {
  const c = getCurrency(code)
  return Number(amountInr) * c.rateFromInr
}
