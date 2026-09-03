import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, Trophy, TrendingUp, Plus } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import GoalCard from '../components/GoalCard'
import { useApp } from '../context/AppContext'
import { useMoney } from '../hooks/useMoney'

const presets = [
  { label: '₹10,000 Emergency', target: 10000, icon: '🛡️' },
  { label: '₹25,000 Bike Fund', target: 25000, icon: '🏍️' },
  { label: '₹50,000 Education', target: 50000, icon: '📚' },
  { label: '₹1,00,000 Home', target: 100000, icon: '🏠' },
]

export default function Goals() {
  const { data } = useApp()
  const { formatMoney } = useMoney()
  const [goals, setGoals] = useState(() => data?.goals || [])
  const [showForm, setShowForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newTarget, setNewTarget] = useState('')

  useEffect(() => {
    if (data?.goals?.length && goals.length === 0) setGoals(data.goals)
  }, [data?.goals, goals.length])

  function addGoal(name, target, icon = '🎯') {
    setGoals((prev) => [...prev, { id: Date.now(), name, target, current: 0, icon }])
    setShowForm(false)
    setNewName('')
    setNewTarget('')
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
            Your Goals
          </motion.h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <Plus className="h-4 w-4" /> New Goal
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
                <p className="text-sm font-semibold text-ink">Quick start from preset:</p>
                <div className="flex flex-wrap gap-2">
                  {presets.map((p) => (
                    <motion.button
                      key={p.label}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => addGoal(p.label, p.target, p.icon)}
                      className="btn-secondary flex items-center gap-2 text-sm"
                    >
                      <span>{p.icon}</span> {p.label}
                    </motion.button>
                  ))}
                </div>
                <p className="text-sm font-semibold text-ink">Or create custom:</p>
                <div className="flex gap-3">
                  <input
                    className="input flex-1"
                    placeholder="Goal name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                  <input
                    className="input w-36"
                    placeholder="Target ₹"
                    inputMode="numeric"
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value.replace(/\D/g, ''))}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (newName && newTarget) addGoal(newName, Number(newTarget))
                    }}
                    className="btn-primary text-sm"
                  >
                    Add
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {goals.map((goal, i) => {
            const pct = Math.min(100, Math.round((goal.current / goal.target) * 100))
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
                    <p className="text-xs text-muted">Target: {formatMoney(goal.target)}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-muted">{formatMoney(goal.current)}</span>
                    <span className="font-semibold text-burgundy">{pct}%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-line/40">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-burgundy to-gold"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1.2, delay: 0.3 + i * 0.15 }}
                    />
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setGoals((prev) =>
                      prev.map((g) => g.id === goal.id ? { ...g, current: Math.min(g.target, g.current + 500) } : g)
                    )
                  }}
                  className="btn-secondary mt-4 w-full text-sm"
                >
                  + Add ₹500
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
