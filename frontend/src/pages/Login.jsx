import { useState } from 'react'
import { Navigate, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Eye, EyeOff, Globe2, Lock, Mail, ShieldCheck, 
  Sparkles, UserRound, AlertCircle 
} from 'lucide-react'
import { isAuthenticated, loginAsDemo } from '../utils/auth'

const highlights = [
  { icon: ShieldCheck, text: 'Loan-stacking & risk alerts' },
  { icon: Sparkles, text: 'AI-guided what-if scenarios' },
  { icon: Globe2, text: 'Multi-currency income tracking' },
]

/**
 * Login Page
 * 
 * DEMO AUTHENTICATION - NOT PRODUCTION GRADE
 * 
 * This is a demo login for hackathon purposes only.
 * - No real password validation
 * - No secure authentication
 * - Demo user = U001 (Rajesh Kumar, existing seeded user)
 * 
 * Flow: Login → /income-setup → Dashboard
 */
export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  
  // If already authenticated, redirect
  if (isAuthenticated()) {
    return <Navigate to="/income-setup" replace />
  }
  
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  
  function handleDemoLogin() {
    setError('')
    setSubmitting(true)
    
    // Simulate brief loading
    setTimeout(() => {
      loginAsDemo(remember)
      navigate('/income-setup', { replace: true })
    }, 400)
  }
  
  function handleSubmit(e) {
    e.preventDefault()
    
    if (!identifier.trim() || !password.trim()) {
      setError('Please enter your email/mobile number and password.')
      return
    }
    
    setError('')
    setSubmitting(true)
    
    // For hackathon: any non-empty credentials → demo login
    setTimeout(() => {
      loginAsDemo(remember)
      navigate('/income-setup', { replace: true })
    }, 500)
  }
  
  return (
    <div className="min-h-svh bg-animated-gradient text-ink lg:flex">
      {/* Left brand panel */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-burgundy via-burgundy to-burgundy-deep px-12 py-14 text-white lg:flex lg:w-[46%] lg:flex-col lg:justify-between">
        <div className="absolute inset-0 opacity-90">
          <div className="absolute -left-16 -top-16 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md">
            <Globe2 className="h-6 w-6" aria-hidden="true" />
          </div>
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-gold">Resilience</p>
          <p className="text-2xl font-semibold tracking-tight">Engine</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative"
        >
          <h1 className="max-w-md text-3xl font-bold leading-tight tracking-tight">
            Build your financial resilience.
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/75">
            Understand your money. Prepare for uncertainty. Stay financially secure.
          </p>

          <div className="mt-8 space-y-3">
            {highlights.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-sm text-white/85">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/12">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative text-xs text-white/50"
        >
          Income clarity. Savings discipline. Scheme guidance.
        </motion.p>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          {/* Mobile brand */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-burgundy to-burgundy-deep text-white shadow-md shadow-burgundy/25">
              <Globe2 className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold">Resilience</p>
              <p className="text-lg font-semibold tracking-tight text-burgundy">Engine</p>
            </div>
          </div>

          {/* Login form */}
          <div className="card-panel">
            <h2 className="text-xl font-bold tracking-tight text-burgundy">Welcome back</h2>
            <p className="mt-1 text-sm text-muted">Sign in to continue to your dashboard.</p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
              <label className="block" htmlFor="login-identifier">
                <span className="mb-1.5 block text-sm text-muted">Email or mobile number</span>
                <div className="relative">
                  <Mail 
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" 
                    aria-hidden="true" 
                  />
                  <input
                    id="login-identifier"
                    type="text"
                    autoComplete="username"
                    className="input pl-10"
                    placeholder="Enter email or mobile number"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    disabled={submitting}
                  />
                </div>
              </label>

              <label className="block" htmlFor="login-password">
                <span className="mb-1.5 block text-sm text-muted">Password</span>
                <div className="relative">
                  <Lock 
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" 
                    aria-hidden="true" 
                  />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    className="input pl-10 pr-11"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={submitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                    disabled={submitting}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-md p-1 text-muted transition hover:text-burgundy disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>

              {error ? (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="alert"
                  className="flex items-start gap-2 rounded-xl border border-rose/20 bg-rose-soft px-3 py-2 text-xs font-medium text-rose"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              ) : null}

              <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-ink" htmlFor="login-remember">
                  <input
                    id="login-remember"
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    disabled={submitting}
                    className="h-4 w-4 cursor-pointer rounded border-line text-burgundy accent-burgundy disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  disabled={submitting}
                  className="cursor-pointer text-sm font-semibold text-burgundy hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => alert('Password recovery available in production version. This is a demo build.')}
                >
                  Forgot password?
                </button>
              </div>

              <motion.button
                whileHover={{ scale: submitting ? 1 : 1.02 }}
                whileTap={{ scale: submitting ? 1 : 0.98 }}
                type="submit"
                disabled={submitting}
                className="btn-primary flex w-full items-center justify-center gap-2 text-sm disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Signing in…
                  </>
                ) : (
                  'Sign in'
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-line" />
              <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">or</span>
              <div className="h-px flex-1 bg-line" />
            </div>

            {/* Demo user button */}
            <motion.button
              whileHover={{ scale: submitting ? 1 : 1.02 }}
              whileTap={{ scale: submitting ? 1 : 0.98 }}
              type="button"
              onClick={handleDemoLogin}
              disabled={submitting}
              className="btn-secondary flex w-full items-center justify-center gap-2 text-sm"
            >
              <UserRound className="h-4 w-4" />
              Continue as Demo User
            </motion.button>

            {/* Create account */}
            <p className="mt-6 text-center text-sm text-muted">
              New here?{' '}
              <button
                type="button"
                disabled={submitting}
                className="cursor-pointer font-semibold text-burgundy hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => alert('Account creation available in production version. Use "Continue as Demo User" to explore the app.')}
              >
                Create account
              </button>
            </p>
          </div>

          {/* Demo notice */}
          <p className="mt-6 text-center text-xs text-muted">
            Hackathon demo build — Demo authentication only, no data leaves your browser.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
