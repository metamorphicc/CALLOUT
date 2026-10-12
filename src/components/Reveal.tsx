import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

export default function Reveal({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.div
      initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{
        duration: reduceMotion ? 0 : 0.42,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
