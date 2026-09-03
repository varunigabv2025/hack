import { motion } from 'framer-motion'
import { Globe2 } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import CurrencyNetwork from '../components/CurrencyNetwork'
export default function GlobalNetwork() {
  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 text-2xl font-bold text-gradient-burgundy"
        >
          <Globe2 className="h-6 w-6 text-burgundy" /> Global Currency Network
        </motion.h2>
        <p className="max-w-2xl text-sm text-muted">
          Different currencies. Different lives. Same goal — financial resilience.
        </p>
        <CurrencyNetwork />
      </motion.div>
    </AppLayout>
  )
}
