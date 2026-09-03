import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const CACHE = 'v2'
const FRAMES = Array.from(
  { length: 12 },
  (_, i) => `/coin-fall/frame-${String(i + 1).padStart(2, '0')}.png?${CACHE}`,
)
const FLAT = `/rupee-coin-flat.png?${CACHE}`

/**
 * Plays the 12-frame side-view fall spritesheet, then settles as a flat coin.
 */
export default function FallingCoin({
  left,
  bottom,
  size,
  rot = 0,
  delay = 0,
  zIndex = 1,
}) {
  const [frame, setFrame] = useState(0)
  const [landed, setLanded] = useState(false)

  useEffect(() => {
    let cancelled = false
    let intervalId
    const startId = window.setTimeout(() => {
      let f = 0
      intervalId = window.setInterval(() => {
        if (cancelled) return
        f += 1
        if (f >= FRAMES.length) {
          window.clearInterval(intervalId)
          setFrame(FRAMES.length - 1)
          setLanded(true)
        } else {
          setFrame(f)
        }
      }, 38)
    }, Math.max(0, delay) * 1000)

    return () => {
      cancelled = true
      window.clearTimeout(startId)
      if (intervalId) window.clearInterval(intervalId)
    }
  }, [delay])

  const src = landed ? FLAT : FRAMES[frame]

  return (
    <motion.img
      src={src}
      alt=""
      aria-hidden="true"
      draggable={false}
      className="pointer-events-none absolute bg-transparent"
      style={{
        width: size,
        height: size,
        left: `${left}%`,
        bottom: `${bottom}%`,
        zIndex,
        marginLeft: -size / 2,
        background: 'transparent',
        filter: 'drop-shadow(0 2px 2px rgba(80,35,15,0.35))',
      }}
      initial={{ opacity: 0, y: -56, scale: 0.75, rotate: rot }}
      animate={{ opacity: 1, y: 0, scale: 1, rotate: rot }}
      transition={{
        duration: 0.55,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    />
  )
}
