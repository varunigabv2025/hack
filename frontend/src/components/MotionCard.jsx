import { motion } from 'framer-motion'
import { useState, useRef } from 'react'

export default function MotionCard({ children, className = '', delay = 0, glow, ...props }) {
  const ref = useRef(null)
  const [rotate, setRotate] = useState({ x: 0, y: 0 })

  function handleMouse(e) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const x = (e.clientY - rect.top - rect.height / 2) / 20
    const y = -(e.clientX - rect.left - rect.width / 2) / 20
    setRotate({ x: Math.max(-6, Math.min(6, x)), y: Math.max(-6, Math.min(6, y)) })
  }

  function handleLeave() {
    setRotate({ x: 0, y: 0 })
  }

  const glowClass = glow === 'burgundy' ? 'card-glow-burgundy' : glow === 'glass' ? 'card-glass' : 'card'

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, rotateX: -5 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ scale: 1.015 }}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transformStyle: 'preserve-3d',
      }}
      className={`${glowClass} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}
