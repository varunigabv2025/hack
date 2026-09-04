import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Plus, Check, Calendar, Loader2, AlertCircle } from 'lucide-react'
import { addTransaction } from '../services/api'
import { formatMoney as formatMoneyFn } from '../lib/format'

const sources = ['Uber', 'Swiggy', 'Ola', 'Zomato', 'Cash', 'Other']

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

/**
 * Income Setup Page - Manual Income Onboarding
 * 
 * PHASE 3: LOGIN INTEGRATION READY
 * 
 * This page collects the user's first income entry for onboarding.
 * 
 * CURRENT STATE (Phases 1-2 Complete):
 * - ✅ UI with form validation
 * - ✅ Backend integration (POST /api/transactions)
 * - ✅ MongoDB persistence
 * - ✅ Finance engine processing
 * - ✅ Currency fixes (INR display)
 * - ✅ Date formatting fixes
 * 
 * LOGIN INTEGRATION (Phase 3):
 * - User ID is currently DEFAULT_USER_ID ('U001') defined in api.js
 * - This page does NOT implement authentication
 * - It expects to receive user_id from the authentication layer
 * 
 * WHAT LOGIN NEEDS TO PROVIDE:
 * After successful signup/login, the authentication system should:
 * 1. Create/retrieve the user's profile
 * 2. Store authenticated user_id in auth context/state
 * 3. Navigate to /income-setup
 * 4. The addTransaction() API will automatically use the authenticated user_id
 * 
 * NAME FIELD HANDLING:
 * - The "name" field is collected for onboarding UX
 * - NOT sent to POST /api/transactions (endpoint doesn't accept it)
 * - Should be stored via POST /api/profile during signup
 * - Displayed in confirmation UI only
 * 
 * INTEGRATION POINT:
 * When login is added, update DEFAULT_USER_ID in api.js to retrieve
 * the authenticated user's ID from your auth context.
 * 
 * See: INCOME_LOGIN_INTEGRATION.md for detailed integration guide
 */
export default function IncomeSetup() {
  const navigate = useNavigate()
  
  // Force INR for onboarding (Indian gig worker use case)
  // This ensures amounts display correctly during income setup
  const formatMoney = (value) => formatMoneyFn(value, 'INR')
  
  // Form state
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [source, setSource] = useState('')
  const [otherSource, setOtherSource] = useState('')
  const [date, setDate] = useState(todayIso())
  
  // Validation state
  const [errors, setErrors] = useState({})
  const [confirmed, setConfirmed] = useState(false)
  
  // Submission state
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  
  // Entry data for confirmation
  const [entryData, setEntryData] = useState(null)
  const [backendResponse, setBackendResponse] = useState(null)

  function validateForm() {
    const newErrors = {}
    
    if (!name.trim()) {
      newErrors.name = 'Please enter your name'
    }
    
    if (!amount || Number(amount) <= 0) {
      newErrors.amount = 'Please enter a valid income amount'
    }
    
    if (!source) {
      newErrors.source = 'Please select an income source'
    }
    
    if (source === 'Other' && !otherSource.trim()) {
      newErrors.otherSource = 'Please specify the income source'
    }
    
    if (!date) {
      newErrors.date = 'Please select a date'
    }
    
    return newErrors
  }

  async function handleAddIncome(e) {
    e.preventDefault()
    
    // Prevent duplicate submissions
    if (submitting) return
    
    const validationErrors = validateForm()
    setErrors(validationErrors)
    setSubmitError('')
    
    if (Object.keys(validationErrors).length === 0) {
      // Form is valid - submit to backend
      setSubmitting(true)
      
      try {
        const finalSource = source === 'Other' ? otherSource : source
        
        // Call existing addTransaction API
        // Note: user_id is automatically added as DEFAULT_USER_ID (U001) in api.js
        // TODO: Replace DEFAULT_USER_ID with authenticated user ID when login integration is added
        const response = await addTransaction({
          amount: Number(amount),
          date,
          source: finalSource
        })
        
        // Backend success - show confirmation
        setEntryData({
          name: name.trim(),
          amount: Number(amount),
          source: finalSource,
          date
        })
        setBackendResponse(response)
        setConfirmed(true)
        
      } catch (error) {
        // Handle API errors
        console.error('Transaction submission failed:', error)
        
        if (error.status === 400) {
          setSubmitError('Invalid transaction data. Please check your entries.')
        } else if (error.status === 404) {
          setSubmitError('Service not found. Please try again later.')
        } else if (error.status >= 500) {
          setSubmitError('Server error. Please try again later.')
        } else {
          setSubmitError("Couldn't save your income. Please try again.")
        }
      } finally {
        setSubmitting(false)
      }
    }
  }

  function handleAddAnother() {
    // Clear form and states
    setAmount('')
    setSource('')
    setOtherSource('')
    setDate(todayIso())
    setErrors({})
    setConfirmed(false)
    setEntryData(null)
    setBackendResponse(null)
    setSubmitError('')
  }

  function handleContinueToDashboard() {
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-ivory px-4 py-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="page-title mb-3 text-3xl">Let's understand your income</h1>
          <p className="text-base text-muted">
            Start with one recent income entry. You can add more later.
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card space-y-6"
        >
          <form onSubmit={handleAddIncome} className="space-y-6">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-semibold text-ink">
                Your name
              </label>
              <input
                id="name"
                type="text"
                className={`input ${errors.name ? 'border-rose' : ''}`}
                placeholder="Enter your name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (errors.name) {
                    setErrors({ ...errors, name: '' })
                  }
                }}
              />
              <AnimatePresence>
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 text-sm text-rose"
                  >
                    {errors.name}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Amount Input */}
            <div>
              <label htmlFor="amount" className="mb-2 block text-sm font-semibold text-ink">
                How much did you earn?
              </label>
              <input
                id="amount"
                type="text"
                inputMode="numeric"
                className={`input text-2xl font-bold ${errors.amount ? 'border-rose' : ''}`}
                placeholder="e.g. 1200"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value.replace(/\D/g, ''))
                  if (errors.amount) {
                    setErrors({ ...errors, amount: '' })
                  }
                }}
              />
              <AnimatePresence>
                {errors.amount && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 text-sm text-rose"
                  >
                    {errors.amount}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Source Selection */}
            <div>
              <p className="mb-3 text-sm font-semibold text-ink">
                Where did you earn this?
              </p>
              <div className="flex flex-wrap gap-2">
                {sources.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setSource(item)
                      if (errors.source) {
                        setErrors({ ...errors, source: '' })
                      }
                    }}
                    className={`
                      rounded-full border-2 px-4 py-2 text-sm font-semibold transition-all
                      ${
                        source === item
                          ? 'border-burgundy bg-burgundy text-white shadow-md'
                          : 'border-line bg-white text-ink hover:border-burgundy-soft hover:bg-burgundy-soft'
                      }
                    `}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <AnimatePresence>
                {errors.source && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 text-sm text-rose"
                  >
                    {errors.source}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Other Source Input (conditional) */}
            <AnimatePresence>
              {source === 'Other' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label htmlFor="otherSource" className="mb-2 block text-sm font-semibold text-ink">
                    Specify source
                  </label>
                  <input
                    id="otherSource"
                    type="text"
                    className={`input ${errors.otherSource ? 'border-rose' : ''}`}
                    placeholder="e.g. Freelance, Tutoring"
                    value={otherSource}
                    onChange={(e) => {
                      setOtherSource(e.target.value)
                      if (errors.otherSource) {
                        setErrors({ ...errors, otherSource: '' })
                      }
                    }}
                  />
                  <AnimatePresence>
                    {errors.otherSource && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 text-sm text-rose"
                      >
                        {errors.otherSource}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Date Input */}
            <div>
              <label htmlFor="date" className="mb-2 block text-sm font-semibold text-ink">
                When did you receive it?
              </label>
              <div className="relative">
                <input
                  id="date"
                  type="date"
                  className={`input ${errors.date ? 'border-rose' : ''}`}
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value)
                    if (errors.date) {
                      setErrors({ ...errors, date: '' })
                    }
                  }}
                />
                <Calendar className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
              </div>
              <AnimatePresence>
                {errors.date && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 text-sm text-rose"
                  >
                    {errors.date}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Submit Button */}
            {!confirmed && (
              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={!submitting ? { scale: 1.02 } : {}}
                whileTap={!submitting ? { scale: 0.98 } : {}}
                className={`btn-primary w-full ${submitting ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Adding income...
                  </span>
                ) : (
                  'Add income'
                )}
              </motion.button>
            )}

            {/* Error Message */}
            <AnimatePresence>
              {submitError && !confirmed && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="rounded-xl border-2 border-rose bg-rose-soft p-4"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 text-rose" />
                    <div>
                      <p className="font-semibold text-rose">Error</p>
                      <p className="text-sm text-rose">{submitError}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          {/* Confirmation State */}
          <AnimatePresence>
            {confirmed && entryData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {/* Confirmation Card */}
                <div className="rounded-2xl border-2 border-gold bg-gold-soft p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold text-white">
                      <Check className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gold-deep">Income added successfully</h3>
                      <p className="text-sm text-gold-deep">Welcome, {entryData.name}!</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 rounded-xl bg-white/60 p-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-burgundy">
                        {formatMoney(entryData.amount)}
                      </span>
                      <span className="text-sm text-muted">from {entryData.source}</span>
                    </div>
                    <p className="text-sm text-muted">
                      {new Date(entryData.date).toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>

                    {/* Show backend calculated values if available */}
                    {backendResponse && (
                      <div className="mt-4 space-y-2 border-t border-line pt-3">
                        {backendResponse.resilience_score?.score != null && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted">Resilience Score:</span>
                            <span className="font-semibold text-burgundy">
                              {backendResponse.resilience_score.score}
                            </span>
                          </div>
                        )}
                        {backendResponse.income_profile?.baseline != null && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted">New Baseline:</span>
                            <span className="font-semibold text-ink">
                              {formatMoney(backendResponse.income_profile.baseline)}
                            </span>
                          </div>
                        )}
                        {backendResponse.savings_pocket?.suggested_amount != null && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted">Suggested Savings:</span>
                            <span className="font-semibold text-gold-deep">
                              {formatMoney(backendResponse.savings_pocket.suggested_amount)}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleAddAnother}
                    className="btn-secondary flex items-center justify-center gap-2"
                  >
                    <Plus className="h-5 w-5" />
                    Add another income
                  </button>
                  <button
                    type="button"
                    onClick={handleContinueToDashboard}
                    className="btn-primary flex items-center justify-center gap-2"
                  >
                    Continue to dashboard
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Info Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center text-sm text-muted"
        >
          This helps us understand your income pattern and build your financial resilience profile.
        </motion.p>
      </div>
    </div>
  )
}
