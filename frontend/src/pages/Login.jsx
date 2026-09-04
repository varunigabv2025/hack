import { useState, useEffect } from 'react'
import { Navigate, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Eye, EyeOff, Globe2, ShieldCheck, 
  Sparkles, AlertCircle 
} from 'lucide-react'
import { isAuthenticated, login, verifyAuth } from '../utils/auth'
import { hasTodaysIncome } from '../services/api'

const highlights = [
  { icon: ShieldCheck, text: 'Loan-stacking & risk alerts' },
  { icon: Sparkles, text: 'AI-guided what-if scenarios' },
  { icon: Globe2, text: 'Multi-currency income tracking' },
]

/**
 * Login Page
 * 
 * REAL AUTHENTICATION
 * 
 * This page implements real authentication with:
 * - Email/password validation
 * - Backend JWT authentication
 * - HTTP-only cookies
 * - Secure password handling
 * 
 * Flow: 
 * - Login → Authenticate with backend
 * - Check today's income
 * - If income exists for today → Dashboard
 * - If no income for today → Income Setup → Dashboard
 */
export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  
  // Check if already authenticated and redirect appropriately
  useEffect(() => {
    async function checkAuth() {
      if (isAuthenticated()) {
        try {
          // Verify authentication with backend
          const { authenticated } = await verifyAuth()
          
          if (authenticated) {
            const hasIncome = await hasTodaysIncome()
            navigate(hasIncome ? '/' : '/income-setup', { replace: true })
          } else {
            setCheckingAuth(false)
          }
        } catch (error) {
          console.error('Auth check error:', error)
          setCheckingAuth(false)
        }
      } else {
        setCheckingAuth(false)
      }
    }
    checkAuth()
  }, [navigate])
  
  if (checkingAuth && isAuthenticated()) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-animated-gradient">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-burgundy border-t-transparent" />
      </div>
    )
  }
  
  async function handleSubmit(e) {
    e.preventDefault()
    
    if (!identifier.trim() || !password.trim()) {
      setError('Please enter your email and password.')
      return
    }
    
    setError('')
    setSubmitting(true)
    
    try {
      // Perform real login with backend
      await login(identifier.trim(), password, remember)
      
      // Check if user has today's income
      const hasIncome = await hasTodaysIncome()
      
      // Navigate based on today's income status
      if (hasIncome) {
        // Income already entered today → go to dashboard
        navigate('/', { replace: true })
      } else {
        // No income for today → go to income setup
        navigate('/income-setup', { replace: true })
      }
    } catch (error) {
      console.error('Login error:', error)
      setError(error.message || 'Login failed. Please check your credentials and try again.')
      setSubmitting(false)
    }
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
                <span className="mb-1.5 block text-sm text-muted">Email</span>
                <input
                  id="login-identifier"
                  type="email"
                  autoComplete="email"
                  className="input px-4"
                  placeholder="Enter your email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  disabled={submitting}
                />
              </label>

              <label className="block" htmlFor="login-password">
                <span className="mb-1.5 block text-sm text-muted">Password</span>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    className="input pl-4 pr-11"
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
                  onClick={() => alert('Password recovery will be available soon. Please contact support if you need assistance.')}
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

            {/* Create account */}
            <p className="mt-6 text-center text-sm text-muted">
              New here?{' '}
              <button
                type="button"
                disabled={submitting}
                className="cursor-pointer font-semibold text-burgundy hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => navigate('/register')}
              >
                Create account
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
