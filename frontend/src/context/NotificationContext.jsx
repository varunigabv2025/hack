/**
 * frontend/src/context/NotificationContext.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Provides a global notification queue for the Smart Financial Pop-up system.
 *
 * - Completely separate from AppContext — zero modifications to existing code.
 * - Exposes showNotification(message, type, duration?) to any component via
 *   the useNotification() hook.
 * - Manages auto-dismiss timers and manual close.
 *
 * Types: 'success' | 'warning' | 'info' | 'danger'
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createContext, useCallback, useContext, useRef, useState } from 'react'

const NotificationContext = createContext(null)

let _idCounter = 0

/**
 * NotificationProvider — wrap around the app (inside AppProvider, inside BrowserRouter).
 * Each notification object: { id, message, type, duration }
 */
export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])
  const timers = useRef({})

  /**
   * showNotification(message, type, duration)
   * @param {string}  message   — text to display (can include emoji)
   * @param {'success'|'warning'|'info'|'danger'} type — controls colour
   * @param {number}  duration  — ms before auto-dismiss (default 4000)
   */
  const showNotification = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++_idCounter
    setNotifications((prev) => [...prev, { id, message, type, duration }])

    // auto-dismiss
    timers.current[id] = setTimeout(() => {
      dismiss(id)
    }, duration)

    return id
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const dismiss = useCallback((id) => {
    clearTimeout(timers.current[id])
    delete timers.current[id]
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  return (
    <NotificationContext.Provider value={{ notifications, showNotification, dismiss }}>
      {children}
    </NotificationContext.Provider>
  )
}

/** Internal hook used by SmartNotification component */
export function useNotificationContext() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotificationContext must be used inside NotificationProvider')
  return ctx
}
