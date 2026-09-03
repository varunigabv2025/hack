/**
 * frontend/src/i18n/useLanguage.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Custom hook for consuming the translation system in any React component.
 *
 * Must be used inside a <LanguageProvider> tree.
 *
 * Returns:
 *   {
 *     t           — full translation object for the active language
 *     translate   — (keyPath, vars?) => string   (dot-path lookup + interpolation)
 *     setLanguage — (code) => void               (instant switch, persists to localStorage)
 *     languageCode — string                       (active BCP-47 code, e.g. 'ta')
 *     languages    — Array                        (all registered languages)
 *     activeLang   — Object                       (active language registry entry)
 *   }
 *
 * ─── Quick-start examples ────────────────────────────────────────────────────
 *
 * // 1. Simple key lookup
 * const { translate } = useLanguage();
 * <h1>{translate('nav.dashboard')}</h1>
 *
 * // 2. Key with interpolated variables
 * const { translate } = useLanguage();
 * <p>{translate('onboarding.step', { current: 2, total: 5 })}</p>
 * // → 'Step 2 of 5'  (en)  /  'படி 2 / 5'  (ta)
 *
 * // 3. Inline object access (when you need many keys from one section)
 * const { t } = useLanguage();
 * <button>{t.common.save}</button>
 * <span>{t.income.trendIncreasing}</span>
 *
 * // 4. Switch language
 * const { setLanguage } = useLanguage();
 * <button onClick={() => setLanguage('ta')}>தமிழ்</button>
 *
 * // 5. Translate a backend value (e.g. volatility level from API)
 * const { translate } = useLanguage();
 * // api returns { volatility: 'high' }
 * <span>{translate(`volatility.${apiData.volatility}`)}</span>
 * // → 'High Volatility' (en) / 'அதிக ஏற்றத்தாழ்வு' (ta)
 *
 * ─── Financial numbers — do NOT translate ────────────────────────────────────
 * Never pass numeric scores, amounts, or API percentages through translate().
 * Only UI labels and static strings should be translated.
 * Financial values come from the backend unchanged.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useContext } from 'react';
import { LanguageContext } from './LanguageContext';

/**
 * useLanguage()
 * @returns {import('./LanguageContext').LanguageContextValue}
 * @throws {Error} if used outside of <LanguageProvider>
 */
export function useLanguage() {
  const ctx = useContext(LanguageContext);

  if (ctx === null) {
    throw new Error(
      '[useLanguage] must be used inside a <LanguageProvider>.\n' +
      'Wrap your app root: <LanguageProvider><App /></LanguageProvider>'
    );
  }

  return ctx;
}

export default useLanguage;
