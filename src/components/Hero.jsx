import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { hero } from '../data/content'
import LittleFriends from './LittleFriends'

// Reduced-motion-safe fade: hero content is always mounted (no
// scroll-trigger needed at the top of the page) but must still
// skip the transform when the user prefers reduced motion.
const reducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const fadeUp = (delay) => ({
  initial: reducedMotion ? false : { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: reducedMotion
    ? { duration: 0 }
    : { duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] },
})

export default function Hero() {
  return (
    <section
      id="hero"
      className="hero-sketchbook relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Full-bleed graph-paper background */}
      <div className="absolute inset-0 bg-grid grid-fade pointer-events-none" />
      <div className="hero-doodles" aria-hidden="true"><span>✳</span><span>✦</span><span>✧</span><span>hello, internet!</span></div>

      {/* Soft ambient glow behind the headline */}
      <div
        aria-hidden
        className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[560px] h-[560px] max-w-[90vw] rounded-full pointer-events-none opacity-[0.07] dark:opacity-[0.12] blur-[100px]"
        style={{ background: 'radial-gradient(circle, var(--color-fg) 0%, transparent 70%)' }}
      />

      <div className="relative z-[1] text-center px-6 max-w-[980px] mx-auto pt-[110px] pb-[32px] w-full">
        {/* Path line */}
        <motion.div {...fadeUp(0)} className="font-mono text-[0.7rem] text-muted tracking-[0.08em]">
          ~/sourav/my-little-corner-of-the-internet
        </motion.div>

        {/* Status badge */}
        <motion.div {...fadeUp(0.05)} className="mt-4">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-[4px] border border-line bg-card font-mono text-[0.72rem] uppercase tracking-[0.1em] text-body">
            <span className="w-[7px] h-[7px] rounded-full bg-ok animate-pulse-dot" />
            {hero.badge}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          {...fadeUp(0.1)}
          className="mt-8 font-bold leading-[1.05] tracking-[-0.03em] text-[clamp(2.4rem,6.5vw,4.8rem)]"
        >
          <span className="block text-fg">{hero.titleAccent}</span>
          <span className="block text-muted">{hero.titleRest}</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          {...fadeUp(0.2)}
          className="mt-8 text-body text-[clamp(0.9rem,1.3vw,1.05rem)] leading-[1.8] max-w-[680px] mx-auto"
        >
          {hero.subtitle}
        </motion.p>

        {/* CTAs */}
        <motion.div {...fadeUp(0.3)} className="mt-12 flex items-center justify-center gap-4 flex-wrap">
          <Link to="/projects" className="btn-solid min-w-[220px]">View My Work</Link>
          <Link to="/contact" className="btn-outline">Get In Touch</Link>
        </motion.div>
        <LittleFriends />
      </div>
    </section>
  )
}
