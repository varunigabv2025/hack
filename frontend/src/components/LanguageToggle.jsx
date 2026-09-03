/**
 * frontend/src/components/LanguageToggle.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Drop-in language selector component.
 *
 * Features:
 *   - Displays all registered languages from the i18n registry
 *   - Shows native name in the option (e.g. "தமிழ்" not "Tamil")
 *   - Active language highlighted with a checkmark
 *   - Accessible: keyboard navigable, labelled select element
 *   - Tailwind-styled, matches a typical dark nav or light card surface
 *   - Instant switch — no page reload
 *   - Supports two layout variants: 'dropdown' (default) and 'pills'
 *
 * Usage:
 *   // Minimal — place anywhere inside <LanguageProvider>
 *   import LanguageToggle from './components/LanguageToggle';
 *   <LanguageToggle />
 *
 *   // With variant
 *   <LanguageToggle variant="pills" />
 *
 *   // In a navbar (compact)
 *   <LanguageToggle variant="dropdown" className="ml-auto" />
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React from 'react';
import { useLanguage } from '../i18n/useLanguage';

// ─── GlobeIcon — inline SVG so there's no icon-library dependency ─────────────
function GlobeIcon({ className = '' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

// ─── CheckIcon ────────────────────────────────────────────────────────────────
function CheckIcon({ className = '' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// ─── DropdownVariant ──────────────────────────────────────────────────────────
/**
 * Standard <select> dropdown — best for navbars and tight spaces.
 * Renders natively on mobile so no custom JS is needed.
 */
function DropdownVariant({ languages, languageCode, setLanguage, translate, className }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {/* Globe icon */}
      <GlobeIcon className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />

      {/* Native select — styled to look consistent with Tailwind */}
      <select
        id="language-select"
        value={languageCode}
        onChange={(e) => setLanguage(e.target.value)}
        aria-label={translate('common.selectLanguage')}
        className={[
          // layout
          'appearance-none cursor-pointer',
          // sizing
          'text-sm py-1.5 pl-2 pr-6',
          // colours — works on both light and dark backgrounds
          'bg-white dark:bg-gray-800',
          'text-gray-700 dark:text-gray-200',
          'border border-gray-300 dark:border-gray-600',
          // shape
          'rounded-md',
          // focus ring
          'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
          // transition
          'transition-colors duration-150',
        ].join(' ')}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {/* Show native name + english name so users recognise their language */}
            {lang.nativeName}
            {lang.code !== 'en' ? ` (${lang.name})` : ''}
          </option>
        ))}
      </select>

      {/* Custom chevron — because we reset <select> appearance */}
      <span
        className="pointer-events-none -ml-5 text-gray-400 dark:text-gray-500"
        aria-hidden="true"
      >
        ▾
      </span>
    </div>
  );
}

// ─── PillsVariant ─────────────────────────────────────────────────────────────
/**
 * Horizontal pill buttons — best for settings pages or onboarding screens
 * where there's enough horizontal space.
 */
function PillsVariant({ languages, languageCode, setLanguage, translate, className }) {
  return (
    <div
      role="group"
      aria-label={translate('common.selectLanguage')}
      className={`flex flex-wrap gap-2 ${className}`}
    >
      {languages.map((lang) => {
        const isActive = lang.code === languageCode;
        return (
          <button
            key={lang.code}
            type="button"
            onClick={() => setLanguage(lang.code)}
            aria-pressed={isActive}
            lang={lang.code}
            className={[
              // base
              'inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium',
              'border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1',
              // active state
              isActive
                ? 'bg-indigo-600 border-indigo-600 text-white focus:ring-indigo-500'
                : [
                    'bg-white dark:bg-gray-800',
                    'border-gray-300 dark:border-gray-600',
                    'text-gray-600 dark:text-gray-300',
                    'hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400',
                    'focus:ring-indigo-400',
                  ].join(' '),
            ].join(' ')}
          >
            {isActive && (
              <CheckIcon className="w-3 h-3 flex-shrink-0" />
            )}
            <span>{lang.nativeName}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── LanguageToggle (public export) ──────────────────────────────────────────

/**
 * LanguageToggle
 *
 * @param {{ variant?: 'dropdown' | 'pills', className?: string }} props
 *
 * variant   'dropdown' (default) — compact <select>, good for navbars
 *           'pills'              — button group, good for settings screens
 *
 * className  Extra Tailwind classes forwarded to the wrapper element
 */
function LanguageToggle({ variant = 'dropdown', className = '' }) {
  const { languages, languageCode, setLanguage, translate } = useLanguage();

  const sharedProps = { languages, languageCode, setLanguage, translate, className };

  if (variant === 'pills') {
    return <PillsVariant {...sharedProps} />;
  }

  return <DropdownVariant {...sharedProps} />;
}

export default LanguageToggle;
