import { FiGithub, FiLinkedin, FiInstagram, FiTwitter, FiYoutube, FiMail } from 'react-icons/fi'
import { socials, email, phone, location } from '../data/content'
import Reveal from './ui/Reveal'

const icons = {
  github: FiGithub,
  linkedin: FiLinkedin,
  instagram: FiInstagram,
  twitter: FiTwitter,
  youtube: FiYoutube,
}

export default function Contact() {
  return (
    <section id="contact" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-grid [mask-image:linear-gradient(to_top,black_50%,transparent_100%)] pointer-events-none" />

      <Reveal
        className="relative z-[1] max-w-[760px] mx-auto px-6 text-center"
        y={30}
        duration={0.7}
      >
        <span className="label-micro">Connect</span>
        <h2 className="mt-4 text-[clamp(2rem,4.5vw,3.4rem)] font-bold tracking-[-0.02em] leading-[1.1] text-fg">
          Let&apos;s Build <span className="text-muted">Something Together</span>
        </h2>
        <p className="mt-6 text-body text-[0.95rem] leading-[1.8]">
          Whether it&apos;s an opportunity, a project, or an introduction — my inbox is always open.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
          <a href={`mailto:${email}`} className="btn-solid">
            <FiMail /> Say Hello
          </a>
          <a href="/resume.pdf" target="_blank" rel="noreferrer" className="btn-outline">
            View Résumé
          </a>
        </div>

        <div className="mt-12 flex items-center justify-center gap-x-8 gap-y-2 flex-wrap font-mono text-[0.8rem] text-muted">
          <a href={`mailto:${email}`} className="hover:text-fg transition-colors">{email}</a>
          <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="hover:text-fg transition-colors">{phone}</a>
          <span>{location}</span>
        </div>

        <div className="mt-10 flex items-center justify-center gap-3">
          {socials.map((s) => {
            const Icon = icons[s.id]
            return (
              <a
                key={s.id}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="w-11 h-11 rounded-[4px] border border-line bg-card flex items-center justify-center text-body hover:text-fg hover:border-line-strong transition-colors"
              >
                <Icon size={18} />
              </a>
            )
          })}
        </div>
      </Reveal>
    </section>
  )
}
