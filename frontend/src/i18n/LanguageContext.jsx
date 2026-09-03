/**
 * frontend/src/i18n/LanguageContext.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * React context that owns the active language state for the entire app.
 *
 * Features:
 *   - Reads initial language from localStorage (falls back to English)
 *   - Persists every language change to localStorage instantly
 *   - Updates document lang + dir attributes for accessibility / RTL support
 *   - No page refresh required — all consumers re-render automatically
 *
 * Usage (wrap your app once in main.jsx or App.jsx):
 *   import { LanguageProvider } from './i18n/LanguageContext';
 *   <LanguageProvider><App /></LanguageProvider>
 *
 * Consume via the useLanguage hook (see useLanguage.js) — do NOT consume
 * LanguageContext directly in components; always go through the hook.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_MAP,
  LANGUAGES,
  STORAGE_KEY,
  getTranslations,
  interpolate,
} from './index';

// ─── context shape ────────────────────────────────────────────────────────────

/**
 * @typedef {Object} LanguageContextValue
 * @property {string}   languageCode     - Active BCP-47 code, e.g. 'ta'
 * @property {Object}   t                - Full translation object for active language
 * @property {Function} setLanguage      - (code: string) => void
 * @property {Function} translate        - (keyPath: string, vars?: Object) => string
 * @property {Array}    languages        - Full LANGUAGES array (for building dropdowns)
 * @property {Object}   activeLang       - Active entry from LANGUAGE_MAP
 */

export const LanguageContext = createContext(/** @type {LanguageContextValue} */ (null));

// ─── helpers ─────────────────────────────────────────────────────────────────

/**
 * Read a dot-separated key path from a nested object.
 * e.g. resolvePath({ nav: { dashboard: 'Dashboard' } }, 'nav.dashboard')
 *      → 'Dashboard'
 */
function resolvePath(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

/**
 * Return a validated language code. Defaults to DEFAULT_LANGUAGE if the
 * stored/requested code is not in LANGUAGE_MAP.
 */
function sanitiseCode(code) {
  return LANGUAGE_MAP[code] ? code : DEFAULT_LANGUAGE;
}

// ─── provider ────────────────────────────────────────────────────────────────

/**
 * LanguageProvider
 *
 * Wrap your application root once:
 *   <LanguageProvider>
 *     <App />
 *   </LanguageProvider>
 *
 * @param {{ children: React.ReactNode, defaultCode?: string }} props
 */
export function LanguageProvider({ children, defaultCode }) {
  // ── initialise from localStorage ──────────────────────────────────────────
  const [languageCode, setLanguageCode] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return sanitiseCode(stored || defaultCode || DEFAULT_LANGUAGE);
    } catch {
      // localStorage may be unavailable (private browsing, SSR, etc.)
      return sanitiseCode(defaultCode || DEFAULT_LANGUAGE);
    }
  });

  // ── derived values ────────────────────────────────────────────────────────
  const activeLang = LANGUAGE_MAP[languageCode];
  const t = useMemo(() => getTranslations(languageCode), [languageCode]);

  // ── sync <html lang> and <html dir> whenever language changes ─────────────
  useEffect(() => {
    try {
      document.documentElement.lang = languageCode;
      document.documentElement.dir = activeLang?.dir ?? 'ltr';
    } catch {
      // no-op in test environments without a real DOM
    }
  }, [languageCode, activeLang]);

  // ── public API ────────────────────────────────────────────────────────────

  /**
   * setLanguage(code)
   * Switch the active language instantly. Persists to localStorage.
   */
  const setLanguage = useCallback((code) => {
    const safe = sanitiseCode(code);
    setLanguageCode(safe);
    try {
      localStorage.setItem(STORAGE_KEY, safe);
    } catch {
      // ignore write failures
    }
  }, []);

  /**
   * translate(keyPath, vars)
   * Look up a dot-separated translation key and optionally interpolate variables.
   *
   * Examples:
   *   translate('nav.dashboard')           → 'Dashboard' / 'டாஷ்போர்டு'
   *   translate('income.predictionRange', { low: 500, high: 800 })
   *                                        → '₹500 – ₹800'
   *   translate('onboarding.step', { current: 2, total: 5 })
   *                                        → 'Step 2 of 5'
   *
   * Falls back to the key path string if the key is not found, so a missing
   * translation never crashes the UI — it just shows the key name.
   */
  const translate = useCallback(
    (keyPath, vars) => {
      const raw = resolvePath(t, keyPath);
      if (raw === undefined || raw === null) {
        // Graceful degradation: return the key so developers notice it
        return keyPath;
      }
      return vars ? interpolate(String(raw), vars) : String(raw);
    },
    [t]
  );

  // ── context value (memoised to prevent unnecessary re-renders) ────────────
  const value = useMemo(
    () => ({
      languageCode,
      t,
      setLanguage,
      translate,
      languages: LANGUAGES,
      activeLang,
    }),
    [languageCode, t, setLanguage, translate, activeLang]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export default LanguageProvider;
