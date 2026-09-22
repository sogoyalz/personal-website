import { Link } from 'react-router-dom'
import {
  FiGithub,
  FiLinkedin,
  FiInstagram,
  FiTwitter,
  FiYoutube,
  FiMail,
  FiMapPin,
  FiArrowUp,
  FiPhone,
} from 'react-icons/fi'
import { navLinks, socials, email, location, phone } from '../data/content'
import { Critter } from './LittleFriends'

const icons = {
  github: FiGithub,
  linkedin: FiLinkedin,
  instagram: FiInstagram,
  twitter: FiTwitter,
  youtube: FiYoutube,
}

// Curated external highlights for the "Explore" column.
const highlights = [
  { label: 'Hydra Blast Radius', href: 'https://github.com/sogoyalz/hydra-blast-radius' },
  { label: 'GitHub Projects', href: 'https://github.com/sogoyalz' },
  { label: 'ReelTogether', href: 'https://github.com/sogoyalz/ReelTogether' },
]

// Black in both themes — uses the non-flipping inset tokens.
export default function Footer() {
  const year = new Date().getFullYear()

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="border-t border-inset-line bg-inset text-inset-body">
      <div className="max-w-[1400px] mx-auto px-6 pt-16 pb-8">
        <div className="footer-friend"><Critter kind="frog" /><p>You made it to the bottom.<br /><span>A frog and a good dog for the road.</span></p><Critter kind="dog" /></div>
        <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr] gap-10 max-lg:grid-cols-2 max-sm:grid-cols-1 max-sm:gap-10">
          {/* Brand + tagline + availability + socials */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-[4px] bg-inset-fg text-inset font-bold text-[0.8rem] flex items-center justify-center">
                SG
              </span>
              <span className="font-bold text-[1.05rem] tracking-tight text-inset-fg">Sourav.</span>
            </div>
            <p className="mt-4 text-[0.85rem] text-inset-body leading-[1.8] max-w-[320px]">
              Computer Science junior at Texas Tech. Building supply-chain
              tools, browser extensions, and movie discovery apps. Former
              co-founder of Probe (now Trace). Usually curious. Occasionally debugging.
            </p>

            {/* Availability pill */}
            <span className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-[4px] border border-inset-line font-mono text-[0.7rem] uppercase tracking-[0.1em] text-inset-fg">
              <span className="w-[7px] h-[7px] rounded-full bg-ok animate-pulse-dot" />
              Available for Summer 2027 internships
            </span>

            {/* Location */}
            <p className="mt-4 flex items-center gap-2 text-[0.78rem] text-inset-body font-mono">
              <FiMapPin size={13} /> {location}
            </p>

            {/* Socials */}
            <div className="mt-5 flex items-center gap-3">
              {socials.map((s) => {
                const Icon = icons[s.id]
                if (!Icon) return null
                return (
                  <a
                    key={s.id}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="w-9 h-9 rounded-[4px] border border-inset-line flex items-center justify-center text-inset-body hover:text-inset-fg hover:border-inset-fg/40 transition-colors"
                  >
                    <Icon size={16} />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Navigate */}
          <div>
            <h3 className="label-micro !text-inset-body mb-4">Navigate</h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link to="/" className="text-[0.85rem] text-inset-body hover:text-inset-fg transition-colors">
                  Home
                </Link>
              </li>
              {navLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={`/${l.to}`}
                    className="text-[0.85rem] text-inset-body hover:text-inset-fg transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h3 className="label-micro !text-inset-body mb-4">Explore</h3>
            <ul className="flex flex-col gap-2.5">
              {highlights.map((h) => (
                <li key={h.label}>
                  <a
                    href={h.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[0.85rem] text-inset-body hover:text-inset-fg transition-colors inline-flex items-center gap-1.5"
                  >
                    {h.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="label-micro !text-inset-body mb-4">Connect</h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <a
                  href={`mailto:${email}`}
                  className="text-[0.85rem] text-inset-body hover:text-inset-fg transition-colors inline-flex items-center gap-2"
                >
                  <FiMail size={14} /> {email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                  className="text-[0.85rem] text-inset-body hover:text-inset-fg transition-colors inline-flex items-center gap-2"
                >
                  <FiPhone size={14} /> {phone}
                </a>
              </li>
              <li>
                <a
                  href={socials.find((s) => s.id === 'linkedin')?.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[0.85rem] text-inset-body hover:text-inset-fg transition-colors inline-flex items-center gap-2"
                >
                  <FiLinkedin size={14} /> LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={socials.find((s) => s.id === 'github')?.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[0.85rem] text-inset-body hover:text-inset-fg transition-colors inline-flex items-center gap-2"
                >
                  <FiGithub size={14} /> GitHub
                </a>
              </li>
            </ul>

            <Link to="/contact" className="btn-outline !mt-5 !border-inset-line !bg-transparent !text-inset-fg hover:!border-inset-fg/50">
              Get in touch →
            </Link>
          </div>
        </div>

        {/* Giant outlined wordmark */}
        <div aria-hidden className="mt-16 select-none overflow-hidden text-center">
          <span className="block font-mono font-bold uppercase whitespace-nowrap leading-none tracking-[-0.02em] text-[clamp(3rem,11vw,11.5rem)] text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.22)]">
            Sourav
          </span>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-inset-line flex items-center justify-between gap-4 max-sm:flex-col max-sm:text-center">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-inset-body">
            © {year} Sourav Goyal · All rights reserved
          </p>
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-inset-body">
            Built with React, Vite &amp; Tailwind
          </p>
          <button
            onClick={scrollToTop}
            className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-inset-body hover:text-inset-fg transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            aria-label="Back to top"
          >
            Back to top <FiArrowUp size={13} />
          </button>
        </div>
      </div>
    </footer>
  )
}
