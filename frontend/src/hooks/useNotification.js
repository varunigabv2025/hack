/**
 * frontend/src/hooks/useNotification.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Public hook for triggering notifications from any component in the app.
 *
 * Usage:
 *   import { useNotification } from '../hooks/useNotification'
 *
 *   const { showNotification } = useNotification()
 *
 *   // trigger from anywhere — a button click, data load, score change, etc.
 *   showNotification('💰 Great income today!', 'success')
 *   showNotification('⚠️ Income is lower than usual.', 'warning')
 *   showNotification('💳 Loan payment risk detected.', 'danger')
 *   showNotification('🏛️ A new scheme may be available for you.', 'info')
 *
 * Types:
 *   'success'  — green  — positive milestones
 *   'warning'  — amber  — gentle nudges
 *   'info'     — blue   — neutral information / schemes
 *   'danger'   — red    — risk alerts
 *
 * Optional third arg: duration in ms (default 4000)
 *   showNotification('🎯 You're close to your savings goal!', 'success', 5000)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useNotificationContext } from '../context/NotificationContext'

export function useNotification() {
  const { showNotification } = useNotificationContext()
  return { showNotification }
}
