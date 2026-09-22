import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

// Robust scroll-reveal. Content is NEVER left permanently invisible:
//  - reveals when the element scrolls into view (IntersectionObserver via framer)
//  - reveals immediately if the element is already on-screen at mount
//  - reveals after a hard fallback timeout even if the observer never fires
//  - reveals instantly (no transform) when the user prefers reduced motion
//
// Returns props to spread onto a framer-motion element, plus the ref to attach.
export function useReveal({ delay = 0, y = 24, duration = 0.5 } = {}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })
  const [forced, setForced] = useState(false)

  // Respect reduced-motion: skip the transform entirely.
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  // Hard fallback: if nothing has revealed this within 1.2s of mount
  // (observer never fired, JS hiccup, etc.), force it visible anyway.
  useEffect(() => {
    const id = setTimeout(() => setForced(true), 1200)
    return () => clearTimeout(id)
  }, [])

  const shown = inView || forced || reduced

  return {
    ref,
    initial: reduced ? false : { opacity: 0, y },
    animate: shown ? { opacity: 1, y: 0 } : { opacity: 0, y },
    transition: { duration: reduced ? 0 : duration, delay: reduced ? 0 : delay },
  }
}
