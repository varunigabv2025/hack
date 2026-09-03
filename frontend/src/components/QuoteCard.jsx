import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'

const quotes = [
  { text: 'Financial freedom is available to those who learn about it and work for it.', author: 'Robert Kiyosaki' },
]

export default function QuoteCard() {
  const q = quotes[0]
  return (
    <motion.article
      initial={{ opacity: 0, y: 40, rotateX: -8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      whileHover={{ y: -6, boxShadow: '0 20px 50px rgba(107,45,91,0.1)' }}
      className="card flex h-full flex-col justify-center bg-gradient-to-br from-white to-burgundy-soft/30"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.5, type: 'spring' }}
      >
        <Quote className="mb-3 h-6 w-6 text-burgundy/40" aria-hidden="true" />
      </motion.div>
      <p className="text-sm leading-relaxed text-ink italic">{q.text}</p>
      <p className="mt-4 text-xs font-semibold text-muted">— {q.author}</p>
    </motion.article>
  )
}
