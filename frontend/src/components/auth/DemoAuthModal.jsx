import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles, X } from 'lucide-react'

export default function DemoAuthModal({ open, title, message, onClose }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="overlay"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/40 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="demo-modal-title"
            className="card-panel relative w-full max-w-sm"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-3 cursor-pointer rounded-lg p-1 text-muted transition hover:bg-burgundy-soft hover:text-burgundy"
            >
              <X className="h-4 w-4" />
            </button>

            <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-burgundy to-burgundy-deep text-white shadow-md shadow-burgundy/25">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </span>

            <h2 id="demo-modal-title" className="text-lg font-bold tracking-tight text-burgundy">
              {title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{message}</p>

            <button type="button" onClick={onClose} className="btn-primary mt-5 w-full text-sm">
              Got it
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
