import { motion } from 'framer-motion'
import { useReveal } from '../../hooks/useReveal'

// Single audited scroll-reveal wrapper used across all sections.
// Guarantees content becomes visible (see useReveal) — an element wrapped
// in <Reveal> can never get stranded at opacity:0.
//
// `as` picks the motion element (default div); extra props/className pass through.
export default function Reveal({
  as = 'div',
  delay = 0,
  y = 24,
  duration = 0.5,
  children,
  ...rest
}) {
  const MotionTag = motion[as] ?? motion.div
  const reveal = useReveal({ delay, y, duration })
  return (
    <MotionTag {...reveal} {...rest}>
      {children}
    </MotionTag>
  )
}
