import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Settings as SettingsIcon, Globe2, Database, RefreshCw, LogOut } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import { useApp } from '../context/AppContext'
import { logout, getUserName } from '../utils/auth'

const OCCUPATIONS = ['Uber', 'Ola', 'Swiggy', 'Zomato', 'Rapido', 'Dunzo']
const STATES = ['Tamil Nadu', 'Karnataka', 'Telangana', 'Maharashtra', 'Rajasthan', 'Delhi', 'Kerala']
const LANGUAGES = [
  { id: 'en', label: 'English' },
  { id: 'hi', label: 'Hindi' },
  { id: 'ta', label: 'Tamil' },
]

function Toggle({ enabled, onToggle, label }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex cursor-pointer items-center gap-3"
    >
      <div className={`relative h-6 w-11 rounded-full transition-colors duration-300 ${enabled ? 'bg-burgundy' : 'bg-line'}`}>
        <motion.div
          className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md"
          animate={{ x: enabled ? 20 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </div>
      <span className="text-sm text-ink">{label}</span>
    </button>
  )
}

export default function Settings() {
  const navigate = useNavigate()
  const { live, currency, setCurrency, reset, data, updateProfile } = useApp()
  const user = data?.user || {}
  const settings = data?.settings || {}
  const [showReset, setShowReset] = useState(false)
  const [showLogout, setShowLogout] = useState(false)
  
  const authenticatedUserName = getUserName()
  
  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-2xl space-y-6">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 text-2xl font-bold text-gradient-burgundy"
        >
          <SettingsIcon className="h-6 w-6 text-burgundy" /> Settings
        </motion.h2>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="card space-y-4"
        >
          <h3 className="text-sm font-bold uppercase tracking-wide text-muted">Profile</h3>
          <p className="text-xs text-muted">Used by Scheme Studio and the AI coach — occupation and state drive match scores.</p>

          <label className="block" htmlFor="profile-name">
            <span className="mb-1.5 block text-sm text-muted">Name</span>
            <input
              id="profile-name"
              className="input"
              value={user.name || ''}
              onChange={(e) => updateProfile({ user: { name: e.target.value, avatar_label: (e.target.value || 'U')[0].toUpperCase() } })}
            />
          </label>

          <label className="block" htmlFor="profile-occupation">
            <span className="mb-1.5 block text-sm text-muted">Occupation</span>
            <select
              id="profile-occupation"
              className="input"
              value={user.occupation || 'Uber'}
              onChange={(e) => updateProfile({ user: { occupation: e.target.value } })}
            >
              {OCCUPATIONS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </label>

          <label className="block" htmlFor="profile-age">
            <span className="mb-1.5 block text-sm text-muted">Age</span>
            <input
              id="profile-age"
              className="input"
              inputMode="numeric"
              value={user.age ?? ''}
              onChange={(e) => updateProfile({ user: { age: Number(e.target.value.replace(/\D/g, '')) || '' } })}
            />
          </label>

          <label className="block" htmlFor="profile-expense">
            <span className="mb-1.5 block text-sm text-muted">Monthly expense</span>
            <input
              id="profile-expense"
              className="input"
              inputMode="numeric"
              value={user.monthlyExpense ?? ''}
              onChange={(e) => updateProfile({ user: { monthlyExpense: Number(e.target.value.replace(/\D/g, '')) || 0 } })}
            />
          </label>

          <label className="block" htmlFor="profile-state">
            <span className="mb-1.5 block text-sm text-muted">State</span>
            <select
              id="profile-state"
              className="input"
              value={user.state || 'Tamil Nadu'}
              onChange={(e) => updateProfile({ user: { state: e.target.value } })}
            >
              {STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>

          <label className="block" htmlFor="profile-city">
            <span className="mb-1.5 block text-sm text-muted">City</span>
            <input
              id="profile-city"
              className="input"
              value={user.city || ''}
              onChange={(e) => updateProfile({ user: { city: e.target.value } })}
            />
          </label>

          <label className="block" htmlFor="profile-phone">
            <span className="mb-1.5 block text-sm text-muted">Phone</span>
            <input
              id="profile-phone"
              className="input"
              inputMode="tel"
              placeholder="Optional"
              value={user.phone || ''}
              onChange={(e) => updateProfile({ user: { phone: e.target.value } })}
            />
          </label>

          <div>
            <p className="mb-2 text-sm text-muted">Language</p>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => updateProfile({ user: { language: lang.id } })}
                  className={[
                    'cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold transition-all',
                    user.language === lang.id
                      ? 'bg-gradient-to-r from-burgundy to-burgundy/90 text-white shadow-lg shadow-burgundy/20'
                      : 'bg-ivory text-muted hover:bg-burgundy-soft',
                  ].join(' ')}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card space-y-5"
        >
          <h3 className="text-sm font-bold uppercase tracking-wide text-muted">Display</h3>

          <div>
            <p className="mb-2 text-sm text-muted">Active currency highlight</p>
            <div className="flex flex-wrap gap-2">
              {['INR', 'USD', 'EUR', 'GBP', 'JPY'].map((code) => (
                <motion.button
                  key={code}
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrency(code)}
                  className={[
                    'cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold transition-all',
                    currency === code
                      ? 'bg-gradient-to-r from-burgundy to-burgundy/90 text-white shadow-lg shadow-burgundy/20'
                      : 'bg-ivory text-muted hover:bg-burgundy-soft',
                  ].join(' ')}
                >
                  {code}
                </motion.button>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted">
              Amounts are stored in INR from the backend and converted for display using demo exchange rates.
            </p>
          </div>

          <Toggle
            enabled={Boolean(settings.notifications)}
            onToggle={() => updateProfile({ settings: { notifications: !settings.notifications } })}
            label="Push notifications"
          />
          <Toggle
            enabled={Boolean(settings.darkMode)}
            onToggle={() => updateProfile({ settings: { darkMode: !settings.darkMode } })}
            label="Dark mode (coming soon)"
          />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card space-y-4"
        >
          <h3 className="text-sm font-bold uppercase tracking-wide text-muted">System</h3>
          <div className="flex items-center gap-3">
            <Database className="h-4 w-4 text-muted" />
            <p className="text-sm text-ink">
              API mode: <span className="font-bold text-burgundy">{live ? 'Live Express' : 'Mock data'}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Globe2 className="h-4 w-4 text-muted" />
            <p className="text-sm text-ink">
              Currency: <span className="font-bold text-burgundy">{currency}</span>
            </p>
          </div>
        </motion.section>

        {!live && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card space-y-4"
          >
            <h3 className="text-sm font-bold uppercase tracking-wide text-muted">Demo Controls</h3>
            <p className="text-sm text-muted">
              Reset the mock data to the pre-transaction state (score 67, no today pay).
            </p>
            {showReset ? (
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { reset(); setShowReset(false) }}
                  className="btn-primary flex items-center gap-2 text-sm"
                >
                  <RefreshCw className="h-4 w-4" /> Confirm reset
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  onClick={() => setShowReset(false)}
                  className="btn-secondary text-sm"
                >
                  Cancel
                </motion.button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowReset(true)}
                className="btn-secondary flex items-center gap-2 text-sm"
              >
                <RefreshCw className="h-4 w-4" /> Reset demo data
              </motion.button>
            )}
          </motion.section>
        )}
        
        {/* Logout section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="card space-y-4"
        >
          <h3 className="text-sm font-bold uppercase tracking-wide text-muted">Account</h3>
          {authenticatedUserName && (
            <p className="text-sm text-muted">
              Logged in as: <span className="font-semibold text-burgundy">{authenticatedUserName}</span>
            </p>
          )}
          <p className="text-sm text-muted">
            Sign out of your account. You'll need to log in again to access the dashboard.
          </p>
          {showLogout ? (
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl bg-rose px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-rose/20 transition-all hover:bg-rose/90"
              >
                <LogOut className="h-4 w-4" /> Confirm logout
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                onClick={() => setShowLogout(false)}
                className="btn-secondary text-sm"
              >
                Cancel
              </motion.button>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowLogout(true)}
              className="btn-secondary flex items-center gap-2 text-sm"
            >
              <LogOut className="h-4 w-4" /> Logout
            </motion.button>
          )}
        </motion.section>
      </motion.div>
    </AppLayout>
  )
}
