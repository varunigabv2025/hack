import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import GoalCard from '../components/GoalCard'
import { useApp } from '../context/AppContext'
import { useMoney } from '../hooks/useMoney'
import { useLang } from '../hooks/useLang'

const presets = [
  { label: '₹10,000 Emergency', target: 10000, icon: '🛡️' },
  { label: '₹25,000 Bike Fund', target: 25000, icon: '🏍️' },
  { label: '₹50,000 Education', target: 50000, icon: '📚' },
  { label: '₹1,00,000 Home', target: 100000, icon: '🏠' },
]

export default function Goals() {
  const { data, addGoal, contributeToGoal } = useApp()
  const { formatMoney } = useMoney()
  const { t } = useLang()
  const goals = data?.goals || []
  const [showForm, setShowForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newTarget, setNewTarget] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    setShowForm(false)
  }, [goals.length])

  async function handleAdd(name, target, icon = '🎯') {
    if (!name || !target || busy) return
    setBusy(true)
    try {
      await addGoal({ name, target: Number(target), icon, current: 0 })
      setShowForm(false)
      setNewName('')
      setNewTarget('')
    } finally {
      setBusy(false)
    }
  }

  async function handleContribute(goalId) {
    if (busy) return
    setBusy(true)
    try {
      await contributeToGoal(goalId, 500)
    } finally {
      setBusy(false)
    }
  }

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="flex items-center justify-between">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-gradient-burgundy"
          >
            {t('yourGoals')}
          </motion.h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <Plus className="h-4 w-4" /> {t('newGoal')}
          </motion.button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="card space-y-4">
                <p className="text-sm font-semibold text-ink">{t('quickStartPreset')}</p>
                <div className="flex flex-wrap gap-2">
                  {presets.map((p) => (
                    <motion.button
                      key={p.label}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAdd(p.label, p.target, p.icon)}
                      disabled={busy}
                      className="btn-secondary flex items-center gap-2 text-sm"
                    >
                      <span>{p.icon}</span> {p.label}
                    </motion.button>
                  ))}
                </div>
                <p className="text-sm font-semibold text-ink">{t('orCreateCustom')}</p>
                <div className="flex gap-3">
                  <input
                    className="input flex-1"
                    placeholder={t('goalName')}
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                  <input
                    className="input w-36"
                    placeholder={t('targetAmount')}
                    inputMode="numeric"
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value.replace(/\D/g, ''))}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAdd(newName, Number(newTarget))}
                    disabled={busy}
                    className="btn-primary text-sm"
                  >
                    {t('add')}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {goals.map((goal, i) => {
            const pct = Math.min(100, Math.round(((Number(goal.current) || 0) / (Number(goal.target) || 1)) * 100))
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 40, rotateX: -10 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 0.1 * i }}
                whileHover={{ y: -6, boxShadow: '0 20px 50px rgba(107,45,91,0.12)' }}
                className="card shimmer-border"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{goal.icon}</span>
                  <div>
                    <p className="font-semibold text-ink">{goal.name}</p>
                    <p className="text-xs text-muted">{t('targetLabel', { amount: formatMoney(goal.target) })}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-muted">{formatMoney(goal.current)}</span>
                    <span className="font-semibold text-burgundy">{pct}%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-line/40">
                    <motion.div
                      className="h-full rounded-full bg-burgundy"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1.2, delay: 0.3 + i * 0.15 }}
                    />
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleContribute(goal.id)}
                  disabled={busy || pct >= 100}
                  className="btn-secondary mt-4 w-full text-sm disabled:opacity-50"
                >
                  {t('add500')}
                </motion.button>
              </motion.div>
            )
          })}
        </div>

        <GoalCard />
      </motion.div>
    </AppLayout>
  )
}
