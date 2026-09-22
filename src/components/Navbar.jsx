import { useEffect, useRef, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { FiMenu, FiX } from 'react-icons/fi'
import { navLinks } from '../data/content'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuButtonRef = useRef(null)
  useEffect(() => {
    if (!open) return undefined
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [open])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const linkClass = ({ isActive }) =>
    `relative font-mono text-[0.72rem] uppercase tracking-[0.12em] transition-colors cursor-pointer after:absolute after:-bottom-1.5 after:left-0 after:h-[1.5px] after:bg-fg after:transition-all after:duration-300 ${
      isActive ? 'text-fg after:w-full' : 'text-muted hover:text-fg after:w-0 hover:after:w-full'
    }`

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 bg-surface/85 backdrop-blur-md border-b transition-shadow duration-300 ${
        scrolled ? 'border-line shadow-[0_1px_0_0_var(--color-line),0_8px_24px_-16px_rgba(0,0,0,0.25)]' : 'border-line'
      }`}
    >
      <nav
        className={`max-w-[1400px] mx-auto flex items-center justify-between px-6 transition-[height] duration-300 ${
          scrolled ? 'h-[56px]' : 'h-[64px]'
        }`}
      >
        {/* Wordmark */}
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2.5 cursor-pointer select-none"
        >
          <span className="w-7 h-7 rounded-[4px] bg-fg text-surface font-bold text-[0.8rem] flex items-center justify-center">
            SG
          </span>
          <span className="font-bold text-[1.05rem] tracking-tight text-fg">Sourav.</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-7">
          {navLinks.map((l) => (
            <li key={l.to}>
              <NavLink to={`/${l.to}`} className={linkClass}>
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="hidden lg:flex items-center gap-3">
          <ThemeToggle />
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="btn-outline !px-4 !py-2 !text-[0.7rem]"
          >
            Résumé
          </a>
          <Link to="/contact" className="btn-solid !px-4 !py-2 !text-[0.7rem]">
            Get In Touch
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          ref={menuButtonRef}
          className="lg:hidden text-fg cursor-pointer"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-navigation"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="lg:hidden overflow-hidden border-t border-line bg-surface"
          >
            <div className="px-6 py-4">
              <ul className="flex flex-col gap-4">
                {navLinks.map((l) => (
                  <li key={l.to}>
                    <NavLink
                      to={`/${l.to}`}
                      onClick={() => setOpen(false)}
                      className={linkClass}
                    >
                      {l.label}
                    </NavLink>
                  </li>
                ))}
                <li>
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[0.72rem] uppercase tracking-[0.12em] font-semibold text-fg"
                  >
                    Résumé →
                  </a>
                </li>
              </ul>
              <div className="mt-5 pt-4 border-t border-line flex items-center gap-3">
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
