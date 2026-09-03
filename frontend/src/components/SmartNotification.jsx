/**
 * frontend/src/components/SmartNotification.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Smart Financial Pop-up Notification — renders the toast stack at the
 * bottom-right corner of the screen.
 *
 * - Reads from NotificationContext (no props needed)
 * - Stacks multiple notifications with spacing
 * - Each toast: auto-dismisses, has × close button, slide-in/fade-out animation
 * - Fully responsive (works on mobile too — shifts to bottom-centre on xs)
 * - Matches the Resilience Engine design system:
 *     burgundy / gold / ivory palette, Inter font, rounded-xl cards
 * - DEMO: fires one sample notification on mount so it's immediately visible.
 *   To remove the demo, delete the single useEffect block marked "DEMO".
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef } from 'react'
import { useNotificationContext } from '../context/NotificationContext'

// ─── type → visual config ─────────────────────────────────────────────────────
const TYPE_CONFIG = {
  success: {
    bar: 'bg-emerald-500',
    icon: '✅',
    label: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    container:
      'bg-white border border-emerald-200 shadow-[0_4px_24px_rgba(16,185,129,0.15)]',
  },
  warning: {
    bar: 'bg-amber-400',
    icon: '⚠️',
    label: 'bg-amber-50 text-amber-700 border-amber-200',
    container:
      'bg-white border border-amber-200 shadow-[0_4px_24px_rgba(245,158,11,0.15)]',
  },
  danger: {
    bar: 'bg-rose-500',
    icon: '🚨',
    label: 'bg-rose-50 text-rose-700 border-rose-200',
    container:
      'bg-white border border-rose-200 shadow-[0_4px_24px_rgba(239,68,68,0.15)]',
  },
  info: {
    bar: 'bg-[#6b2d5b]',           // burgundy — matches brand
    icon: '💡',
    label: 'bg-[#f3e8ef] text-[#6b2d5b] border-[#e8dfd4]',
    container:
      'bg-white border border-[#e8dfd4] shadow-[0_4px_24px_rgba(107,45,91,0.12)]',
  },
}

// ─── keyframe animation injected once ────────────────────────────────────────
const STYLE_ID = 're-notification-styles'

function injectStyles() {
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = `
    @keyframes re-slide-in {
      from { transform: translateX(110%); opacity: 0; }
      to   { transform: translateX(0);   opacity: 1; }
    }
    @keyframes re-fade-out {
      from { opacity: 1; transform: translateX(0); }
      to   { opacity: 0; transform: translateX(110%); }
    }
    .re-notify-enter {
      animation: re-slide-in 0.32s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }
    .re-notify-progress {
      transform-origin: left;
      animation: re-progress-shrink linear forwards;
    }
    @keyframes re-progress-shrink {
      from { transform: scaleX(1); }
      to   { transform: scaleX(0); }
    }
  `
  document.head.appendChild(style)
}

// ─── single toast ─────────────────────────────────────────────────────────────
function Toast({ notification, onDismiss }) {
  const { id, message, type, duration } = notification
  const cfg = TYPE_CONFIG[type] ?? TYPE_CONFIG.info

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className={[
        // layout
        'relative w-80 max-w-[calc(100vw-2rem)] rounded-xl overflow-hidden',
        // font
        'font-sans text-sm',
        // enter animation
        're-notify-enter',
        // type-specific
        cfg.container,
      ].join(' ')}
    >
      {/* coloured left accent bar */}
      <div className={`absolute left-0 top-0 h-full w-1 ${cfg.bar}`} />

      {/* content row */}
      <div className="flex items-start gap-3 px-4 py-3 pl-5">
        {/* message */}
        <p className="flex-1 leading-snug text-[#2a1f28] font-medium">
          {message}
        </p>

        {/* close button */}
        <button
          type="button"
          onClick={() => onDismiss(id)}
          aria-label="Close notification"
          className={[
            'flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center',
            'text-xs text-[#8a7f88] hover:text-[#2a1f28]',
            'hover:bg-[#f3ebe2] transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-[#6b2d5b]',
          ].join(' ')}
        >
          ×
        </button>
      </div>

      {/* progress bar — shrinks over `duration` ms */}
      <div className={`h-0.5 ${cfg.bar} re-notify-progress`}
        style={{ animationDuration: `${duration}ms` }}
      />
    </div>
  )
}

// ─── SmartNotification (container) ───────────────────────────────────────────
export default function SmartNotification() {
  const { notifications, showNotification, dismiss } = useNotificationContext()
  const demoFired = useRef(false)

  // Inject keyframe CSS once on mount
  useEffect(() => { injectStyles() }, [])

  // ── DEMO ── fires one sample notification when the component first mounts.
  // To remove the demo, delete everything inside this useEffect (keep the
  // closing brace). The SmartNotification component itself stays in place.
  useEffect(() => {
    if (demoFired.current) return
    demoFired.current = true
    const timer = setTimeout(() => {
      showNotification('🛡️ Your resilience score improved!', 'success', 5000)
    }, 1200) // slight delay so the page paints first
    return () => clearTimeout(timer)
  }, [showNotification])
  // ── END DEMO ──

  if (!notifications.length) return null

  return (
    // Fixed portal — bottom-right on md+, bottom-centre on mobile
    <div
      aria-label="Notifications"
      className={[
        'fixed z-[9999] flex flex-col gap-3',
        // mobile: centred at bottom
        'bottom-4 left-1/2 -translate-x-1/2',
        // md+: right-aligned
        'md:left-auto md:right-5 md:-translate-x-0 md:bottom-5',
      ].join(' ')}
    >
      {notifications.map((n) => (
        <Toast key={n.id} notification={n} onDismiss={dismiss} />
      ))}
    </div>
  )
}
