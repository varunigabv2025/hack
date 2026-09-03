import { useMemo } from 'react'
import { motion } from 'framer-motion'
import FallingCoin from './FallingCoin'

const JAR_SRC = '/resilience-jar-no-lid.png'

const ZONE = {
  left: '17%',
  width: '66%',
  top: '16%',
  height: '70%',
}

function mulberry32(seed) {
  let t = seed >>> 0
  return () => {
    t = (t * 9301 + 49297) % 233280
    return t / 233280
  }
}

/**
 * Dense pack — tight rows/cols so gaps in the pile are filled.
 * Coins stay fully inside the fill box (no half-cut tops).
 */
function buildCoinHeap(score) {
  const value = Math.min(100, Math.max(0, Number(score) || 0))
  if (value <= 0) return []

  const rand = mulberry32(Math.round(value * 41) + 13)
  const coins = []
  const rows = Math.max(2, Math.round((value / 100) * 14))

  for (let row = 0; row < rows; row++) {
    const t = rows === 1 ? 0.15 : row / (rows - 1)
    const rowWidth = 90 - t * 26
    // More coins per row + hex stagger to close gaps
    const coinsInRow = Math.max(3, Math.round(7.2 - t * 1.6))
    const size = 32 + (1 - t) * 6 + (rand() - 0.5) * 2
    // Headroom so top discs aren't clipped; still fill most of the % band
    const y = 3 + t * 62

    for (let i = 0; i < coinsInRow; i++) {
      const spread = coinsInRow === 1 ? 0 : (i / (coinsInRow - 1) - 0.5) * rowWidth
      const stagger = row % 2 === 1 ? rowWidth / coinsInRow / 2 : 0

      coins.push({
        id: `r${row}c${i}`,
        left: 50 + spread + stagger + (rand() - 0.5) * 1.2,
        bottom: Math.min(70, Math.max(1, y + (rand() - 0.5) * 1.2)),
        size: Math.max(28, size),
        rot: (rand() - 0.5) * 16,
        z: row * 14 + i,
        delay: 0.05 + row * 0.028 + i * 0.008,
      })
    }
  }

  // Extra filler coins in mid gaps
  const fillers = Math.max(2, Math.round((value / 100) * 8))
  for (let k = 0; k < fillers; k++) {
    const t = 0.15 + rand() * 0.5
    coins.push({
      id: `fill-${k}`,
      left: 28 + rand() * 44,
      bottom: 8 + t * 52,
      size: 26 + rand() * 8,
      rot: (rand() - 0.5) * 22,
      z: 80 + k,
      delay: 0.2 + k * 0.02,
    })
  }

  return coins
}

function labelFor(score) {
  if (score >= 80) return 'strong'
  if (score >= 60) return 'resilient'
  if (score >= 40) return 'building'
  return 'fragile'
}

export default function ResilienceOrb({ score = 0 }) {
  const value = Math.min(100, Math.max(0, Number(score) || 0))
  const rounded = Math.round(value)
  const label = labelFor(rounded)
  const coins = useMemo(() => buildCoinHeap(value), [value])

  // A bit lower in the empty glass — no background pill
  const emptyCenterFromZoneTop = ((100 - value) / 100) * 0.55
  const badgeTopPct = 16 + emptyCenterFromZoneTop * 70 + 2

  return (
    <div
      className="relative mx-auto w-full max-w-[300px] select-none"
      role="img"
      aria-label={`Resilience score ${rounded} out of 100 — jar filled ${rounded}% with coins`}
    >
      <div className="relative mx-auto aspect-square w-[250px]">
        <img
          src={JAR_SRC}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="pointer-events-none absolute inset-0 z-0 h-full w-full object-contain"
        />

        <div className="absolute z-[1] overflow-hidden" style={{ ...ZONE, borderRadius: '50%' }}>
          <motion.div
            className="absolute inset-x-0 bottom-0 overflow-hidden"
            initial={{ height: '0%' }}
            animate={{ height: `${value}%` }}
            transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="absolute inset-x-[8%] bottom-0 h-[88%] rounded-t-full"
              style={{
                background:
                  'radial-gradient(ellipse at 50% 100%, rgba(245,210,120,0.4) 0%, rgba(201,144,63,0.1) 42%, transparent 72%)',
              }}
            />

            {coins.map((coin) => (
              <FallingCoin
                key={coin.id}
                left={coin.left}
                bottom={coin.bottom}
                size={coin.size}
                rot={coin.rot}
                delay={coin.delay}
                zIndex={coin.z}
              />
            ))}
          </motion.div>
        </div>

        <div
          className="pointer-events-none absolute z-[2]"
          style={{
            ...ZONE,
            borderRadius: '50%',
            background:
              'linear-gradient(115deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 28%, transparent 48%)',
          }}
        />

        {/* Score — burgundy text only, no bg, slightly lower */}
        <motion.div
          className="pointer-events-none absolute left-1/2 z-[4] flex -translate-x-1/2 flex-col items-center text-center"
          style={{ top: `${Math.max(18, Math.min(46, badgeTopPct))}%` }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.45 }}
        >
          <p
            className="text-[52px] font-bold leading-none tracking-tight text-burgundy"
            style={{ textShadow: '0 0 14px rgba(255,255,255,0.95), 0 0 24px rgba(255,255,255,0.85)' }}
          >
            {rounded}
          </p>
          <p
            className="mt-1 text-[13px] font-semibold text-burgundy"
            style={{ textShadow: '0 0 10px rgba(255,255,255,0.95), 0 0 18px rgba(255,255,255,0.8)' }}
          >
            {rounded}% {label}
          </p>
        </motion.div>

        <div
          className="absolute z-[3] flex flex-col justify-between text-[11px] font-medium text-burgundy/55"
          style={{ right: '-4px', top: ZONE.top, height: ZONE.height }}
          aria-hidden="true"
        >
          {[100, 75, 50, 25, 0].map((tick) => (
            <div key={tick} className="flex items-center gap-1">
              <span
                className={[
                  'block h-px w-2.5',
                  Math.abs(tick - rounded) <= 5 ? 'bg-burgundy' : 'bg-burgundy/30',
                ].join(' ')}
              />
              <span
                className={[
                  'w-5 tabular-nums',
                  Math.abs(tick - rounded) <= 5 ? 'font-bold text-burgundy' : 'text-burgundy/55',
                ].join(' ')}
              >
                {tick}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
