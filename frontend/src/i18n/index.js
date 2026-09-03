/**
 * frontend/src/i18n/index.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Central registry for all supported languages.
 *
 * HOW TO ADD A NEW LANGUAGE:
 *   1. Create frontend/src/i18n/languages/<code>.js  (copy en.js as template)
 *   2. Import it here and add one entry to LANGUAGES
 *   3. That's it — LanguageContext and LanguageToggle pick it up automatically.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import en from './languages/en';
import ta from './languages/ta';
import hi from './languages/hi';
import te from './languages/te';
import ml from './languages/ml';
import kn from './languages/kn';
import bn from './languages/bn';
import mr from './languages/mr';

/**
 * LANGUAGES — ordered list of all supported locales.
 *
 * Each entry shape:
 * {
 *   code:        string   — BCP-47 language tag used as the lookup key
 *   name:        string   — English display name
 *   nativeName:  string   — Name in the language itself (shown in the toggle)
 *   dir:         'ltr'|'rtl'
 *   translations: Object  — the full translation object from the language file
 * }
 */
export const LANGUAGES = [
  { code: 'en', name: 'English',   nativeName: 'English',   dir: 'ltr', translations: en },
  { code: 'ta', name: 'Tamil',     nativeName: 'தமிழ்',      dir: 'ltr', translations: ta },
  { code: 'hi', name: 'Hindi',     nativeName: 'हिन्दी',     dir: 'ltr', translations: hi },
  { code: 'te', name: 'Telugu',    nativeName: 'తెలుగు',     dir: 'ltr', translations: te },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം',    dir: 'ltr', translations: ml },
  { code: 'kn', name: 'Kannada',   nativeName: 'ಕನ್ನಡ',      dir: 'ltr', translations: kn },
  { code: 'bn', name: 'Bengali',   nativeName: 'বাংলা',      dir: 'ltr', translations: bn },
  { code: 'mr', name: 'Marathi',   nativeName: 'मराठी',      dir: 'ltr', translations: mr },
];

/** Fast lookup map: code → language entry */
export const LANGUAGE_MAP = Object.fromEntries(
  LANGUAGES.map((lang) => [lang.code, lang])
);

/** Default language code */
export const DEFAULT_LANGUAGE = 'en';

/** localStorage key used to persist the user's choice */
export const STORAGE_KEY = 'resilience_engine_language';

/**
 * getTranslations(code)
 * Returns the translation object for the given language code.
 * Falls back to English if the code is not found.
 */
export function getTranslations(code) {
  return LANGUAGE_MAP[code]?.translations ?? en;
}

/**
 * interpolate(template, vars)
 * Replaces {{key}} placeholders in a translation string with actual values.
 *
 * Usage:
 *   interpolate('Step {{current}} of {{total}}', { current: 2, total: 5 })
 *   // → 'Step 2 of 5'
 */
export function interpolate(template, vars = {}) {
  if (!template || typeof template !== 'string') return template ?? '';
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) =>
    vars[key] !== undefined ? String(vars[key]) : `{{${key}}}`
  );
}

export default LANGUAGES;
