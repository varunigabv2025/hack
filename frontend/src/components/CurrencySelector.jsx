import { motion, AnimatePresence } from 'framer-motion'
import { currencies } from '../data/currencies'
import { useMoney } from '../hooks/useMoney'
import { useState } from 'react'

export default function CurrencySelector() {
  const { currency, setCurrency, active } = useMoney()
  const [toast, setToast] = useState(null)
  const primary = currencies.filter((c) => c.code !== 'ZAR')
  const zar = currencies.find((c) => c.code === 'ZAR')

  function select(code) {
    setCurrency(code)
    const c = currencies.find((x) => x.code === code)
    setToast(`Viewing amounts in ${c.symbol} ${c.code}`)
    setTimeout(() => setToast(null), 2200)
  }

  return (
    <div className="relative">
      <div className="flex max-w-full items-center gap-0.5 overflow-x-auto rounded-full border border-line/80 bg-white/75 p-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {primary.map((item) => {
          const isActive = currency === item.code
          const isInr = item.code === 'INR'
          return (
            <motion.button
              key={item.code}
              type="button"
              onClick={() => select(item.code)}
              whileTap={{ scale: 0.97 }}
              aria-pressed={isActive}
              title={item.name}
              className={[
                'flex h-8 cursor-pointer items-center justify-center whitespace-nowrap rounded-full px-2 text-[11px] font-semibold transition-all duration-200',
                isActive && isInr
                  ? 'bg-burgundy px-3 text-white shadow-sm shadow-burgundy/20'
                  : isActive
                    ? 'bg-burgundy/90 px-2.5 text-white'
                    : 'text-muted/70 hover:bg-burgundy-soft/80 hover:text-burgundy',
              ].join(' ')}
            >
              <span>{item.symbol}</span>
              <span className={isActive || isInr ? 'ml-1' : 'ml-1 hidden sm:inline'}>{item.code}</span>
            </motion.button>
          )
        })}
        <motion.button
          type="button"
          onClick={() => select(zar.code)}
          whileTap={{ scale: 0.97 }}
          aria-pressed={currency === zar.code}
          className={[
            'flex h-8 cursor-pointer items-center justify-center rounded-full px-2.5 text-[11px] font-semibold transition-all',
            currency === zar.code ? 'bg-burgundy text-white' : 'text-muted/70 hover:bg-burgundy-soft/80 hover:text-burgundy',
          ].join(' ')}
          title={zar.name}
        >
          More
        </motion.button>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute right-0 top-full z-10 mt-1 rounded-md bg-white/95 px-2 py-1 text-[10px] font-medium text-burgundy shadow-sm"
          >
            {toast}
          </motion.p>
        )}
      </AnimatePresence>
      <p className="sr-only">Active currency: {active.name}</p>
    </div>
  )
}
