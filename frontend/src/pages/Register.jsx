import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Eye, EyeOff, Globe2, AlertCircle 
} from 'lucide-react'
import { register } from '../utils/auth'
import { hasTodaysIncome } from '../services/api'

const highlights = [
  { icon: Globe2, text: 'Multi-currency income tracking' },
  { icon: Eye, text: 'AI-guided financial insights' },
  { icon: Globe2, text: 'Location-specific scheme guidance' },
]

/**
 * Registration Page
 * 
 * Creates new user account with real authentication
 */
export default function Register() {
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    occupation: '',
    state: '',
    language: 'English',
    monthly_expense: ''
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  
  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  async function handleSubmit(e) {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.password || !formData.age || 
        !formData.occupation || !formData.state || !formData.monthly_expense) {
      setError('All fields are required.')
      return
    }
    
    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.')
      return
    }
    
    // Validate password length
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }
    
    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    
    // Validate age
    const age = parseInt(formData.age)
    if (isNaN(age) || age < 18 || age > 100) {
      setError('Age must be between 18 and 100.')
      return
    }
    
    // Validate monthly expense
    const monthlyExpense = parseFloat(formData.monthly_expense)
    if (isNaN(monthlyExpense) || monthlyExpense < 0) {
      setError('Please enter a valid monthly expense.')
      return
    }
    
    setError('')
    setSubmitting(true)
    
    try {
      // Register user
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        age,
        occupation: formData.occupation,
        state: formData.state,
        language: formData.language,
        monthly_expense: monthlyExpense
      }, remember)
      
      // Check if user has today's income (new user won't have any)
      const hasIncome = await hasTodaysIncome()
      
      // Navigate based on today's income status
      if (hasIncome) {
        navigate('/', { replace: true })
      } else {
        navigate('/income-setup', { replace: true })
      }
    } catch (error) {
      console.error('Registration error:', error)
      setError(error.message || 'Registration failed. Please try again.')
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
            Start your financial journey.
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/75">
            Join thousands of gig workers building financial resilience.
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
          className="w-full max-w-md"
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

          {/* Registration form */}
          <div className="card-panel">
            <h2 className="text-xl font-bold tracking-tight text-burgundy">Create your account</h2>
            <p className="mt-1 text-sm text-muted">Join the Resilience Engine community.</p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
              {/* Name */}
              <label className="block" htmlFor="register-name">
                <span className="mb-1.5 block text-sm text-muted">Full Name</span>
                <input
                  id="register-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  className="input px-4"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </label>

              {/* Email */}
              <label className="block" htmlFor="register-email">
                <span className="mb-1.5 block text-sm text-muted">Email</span>
                <input
                  id="register-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="input px-4"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </label>

              {/* Password */}
              <label className="block" htmlFor="register-password">
                <span className="mb-1.5 block text-sm text-muted">Password (min. 8 characters)</span>
                <div className="relative">
                  <input
                    id="register-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className="input pl-4 pr-11"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    disabled={submitting}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-md p-1 text-muted transition hover:text-burgundy disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>

              {/* Confirm Password */}
              <label className="block" htmlFor="register-confirm-password">
                <span className="mb-1.5 block text-sm text-muted">Confirm Password</span>
                <div className="relative">
                  <input
                    id="register-confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className="input pl-4 pr-11"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    disabled={submitting}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-md p-1 text-muted transition hover:text-burgundy disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>

              <div className="grid grid-cols-2 gap-4">
                {/* Age */}
                <label className="block" htmlFor="register-age">
                  <span className="mb-1.5 block text-sm text-muted">Age</span>
                  <input
                    id="register-age"
                    name="age"
                    type="number"
                    min="18"
                    max="100"
                    className="input px-4"
                    placeholder="Age"
                    value={formData.age}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                </label>

                {/* Language */}
                <label className="block" htmlFor="register-language">
                  <span className="mb-1.5 block text-sm text-muted">Language</span>
                  <select
                    id="register-language"
                    name="language"
                    className="input px-4"
                    value={formData.language}
                    onChange={handleChange}
                    disabled={submitting}
                  >
                    <option value="English">English</option>
                    <option value="Tamil">Tamil</option>
                  </select>
                </label>
              </div>

              {/* Occupation */}
              <label className="block" htmlFor="register-occupation">
                <span className="mb-1.5 block text-sm text-muted">Occupation</span>
                <input
                  id="register-occupation"
                  name="occupation"
                  type="text"
                  className="input px-4"
                  placeholder="e.g., Uber Driver, Freelance Designer"
                  value={formData.occupation}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </label>

              {/* State */}
              <label className="block" htmlFor="register-state">
                <span className="mb-1.5 block text-sm text-muted">State</span>
                <input
                  id="register-state"
                  name="state"
                  type="text"
                  className="input px-4"
                  placeholder="e.g., Tamil Nadu, Karnataka"
                  value={formData.state}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </label>

              {/* Monthly Expense */}
              <label className="block" htmlFor="register-monthly-expense">
                <span className="mb-1.5 block text-sm text-muted">Monthly Expense (₹)</span>
                <input
                  id="register-monthly-expense"
                  name="monthly_expense"
                  type="number"
                  min="0"
                  step="0.01"
                  className="input px-4"
                  placeholder="Enter monthly expenses"
                  value={formData.monthly_expense}
                  onChange={handleChange}
                  disabled={submitting}
                />
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

              <div className="flex items-center gap-2">
                <input
                  id="register-remember"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  disabled={submitting}
                  className="h-4 w-4 cursor-pointer rounded border-line text-burgundy accent-burgundy disabled:cursor-not-allowed disabled:opacity-50"
                />
                <label className="cursor-pointer text-sm text-ink" htmlFor="register-remember">
                  Keep me signed in
                </label>
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
                    Creating account…
                  </>
                ) : (
                  'Create account'
                )}
              </motion.button>
            </form>

            {/* Sign in link */}
            <p className="mt-6 text-center text-sm text-muted">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-burgundy hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
