import { AnimatePresence, motion } from 'framer-motion'

/**
 * Small gold ₹ coins flying from the deposit CTA toward the pocket balance.
 * Decorative only — result is always announced via aria-live separately.
 */
export default function SavingsDepositCoins({ coins = [], reducedMotion = false }) {
  if (reducedMotion || !coins.length) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[80]" aria-hidden="true">
      <AnimatePresence>
        {coins.map((coin) => {
          const dx = coin.to.x - coin.from.x
          const dy = coin.to.y - coin.from.y
          return (
            <motion.span
              key={coin.id}
              className="absolute flex h-7 w-7 items-center justify-center rounded-full border border-gold/40 bg-gold text-[11px] font-bold text-burgundy-deep shadow-sm"
              style={{ left: coin.from.x - 14, top: coin.from.y - 14 }}
              initial={{ opacity: 0, scale: 0.7, x: 0, y: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0.7, 1, 1, 0.85],
                x: dx,
                y: dy,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.85,
                delay: coin.delay || 0,
                ease: [0.23, 1, 0.32, 1],
              }}
            >
              ₹
            </motion.span>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
