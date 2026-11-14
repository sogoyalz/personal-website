import { useEffect, useRef, useState } from 'react'
import { about, email, navLinks, socials } from '../data/content'
import {
  CHAPTERS, EDUCATION, MILESTONES, PROJECT_START, PROJECT_STEP, QUICK_EXPERIENCE,
  SECTIONS, STACK, STORY, WORLDS,
} from '../data/experience'
import './experience.css'

const pad = (n) => String(n).padStart(2, '0')
const socialLabel = { twitter: 'X' }

function jumpTo(p) {
  const max = document.documentElement.scrollHeight - innerHeight
  scrollTo({ top: p * max, behavior: 'smooth' })
}

// One line of the journal: every character is its own span so the engine can type it out.
function TypedLine({ parts }) {
  let k = 0
  const text = parts.map(([t]) => t).join('')
  return (
    <p className="verse typed" aria-label={text}>
      <span aria-hidden="true">
        {parts.map(([t, em], i) => {
          const chars = [...t].map((c) => <span className="c" key={k++}>{c}</span>)
          return em ? <em key={i}>{chars}</em> : <span key={i}>{chars}</span>
        })}
        <span className="caret" />
      </span>
    </p>
  )
}

function Beat({ a, b, c, d, className = '', children, ...rest }) {
  return (
    <section className={`beat ${className}`} data-a={a} data-b={b} data-c={c} data-d={d} {...rest}>
      {children}
    </section>
  )
}

function QuickView({ open, onClose, onJump }) {
  const closeRef = useRef(null)
  const returnTo = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    returnTo.current = document.activeElement
    document.documentElement.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    addEventListener('keydown', onKey)
    return () => {
      removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
      returnTo.current?.focus?.({ preventScroll: true })
    }
  }, [open, onClose])

  return (
    <div id="qv" className={open ? 'open' : ''} role="dialog" aria-modal="true" aria-labelledby="qv-title" aria-hidden={!open}>
      <div className="qv-wrap">
        <div className="qv-top">
          <div>
            <h2 id="qv-title">Sourav Goyal</h2>
            <p>Software engineer and junior in Computer Science at Texas Tech University, with minors in AI and Mathematics. I build developer tools, browser extensions and full-stack apps. Open to Summer 2027 software engineering internships.</p>
            <div className="qv-links">
              <a href={`mailto:${email}`}>{email}</a>
              <a href="https://github.com/sogoyalz">GitHub</a>
              <a href="https://www.linkedin.com/in/sogoyalz/">LinkedIn</a>
              <span style={{ color: 'var(--dim)' }}>Lubbock, TX</span>
            </div>
          </div>
          <button className="qv-close" type="button" ref={closeRef} onClick={onClose}>Close ✕</button>
        </div>
        <div className="qv-grid">
          <section>
            <h3>Selected projects</h3>
            {WORLDS.map((w) => (
              <div className="qv-item" key={w.id}>
                <div className="t"><b>{w.name}</b><span className="m">{w.meta}</span></div>
                <p>{w.desc}</p>
                <div className="qv-tags">{w.tech.map((t) => <span key={t}>{t}</span>)}</div>
                <p><a href={w.href}>Repository ↗</a></p>
              </div>
            ))}
          </section>
          <div className="qv-side">
            <section>
              <h3>Experience</h3>
              {QUICK_EXPERIENCE.map((x) => (
                <div className="qv-item" key={x.title}>
                  <div className="t"><b>{x.title}</b><span className="m">{x.date}</span></div>
                  <p>{x.org}{x.text ? ` · ${x.text}` : ''}</p>
                </div>
              ))}
            </section>
            <section>
              <h3>Education</h3>
              <div className="qv-item">
                <div className="t"><b>{EDUCATION.title}, Texas Tech</b><span className="m">{EDUCATION.date}</span></div>
                <p>{EDUCATION.desc}</p>
              </div>
            </section>
            <section>
              <h3>Skills</h3>
              <div className="qv-tags">{[...about.devTools, 'Chrome MV3', 'IndexedDB', 'Figma'].map((t) => <span key={t}>{t}</span>)}</div>
            </section>
            <section>
              <h3>Open source</h3>
              <div className="qv-item"><p>Hacktoberfest 2025 supercontributor with six merged pull requests, including Juno’s frontend. <button type="button" className="qv-inline" onClick={() => onJump(SECTIONS.work)}>See the projects in the film →</button></p></div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Experience() {
  const rootRef = useRef(null)
  const [qvOpen, setQvOpen] = useState(false)
  const [noGL, setNoGL] = useState(false)
  const [copied, setCopied] = useState('Copy email')

  useEffect(() => {
    let stop = () => {}
    let cancelled = false
    // The 3D engine is a large chunk; load it after first paint.
    import('./engine.js').then(({ startExperience }) => {
      if (cancelled) return
      stop = startExperience(rootRef.current, {
        worlds: WORLDS,
        milestones: MILESTONES,
        stack: STACK,
        chapters: CHAPTERS,
        projectStart: PROJECT_START,
        projectStep: PROJECT_STEP,
        onNoGL: () => setNoGL(true),
        onReady: () => {
          const target = SECTIONS[location.hash.slice(1)]
          if (target) setTimeout(() => jumpTo(target), 400)
        },
      })
    })
    return () => { cancelled = true; stop() }
  }, [])

  const closeQV = () => setQvOpen(false)
  const jump = (p) => (e) => { e?.preventDefault?.(); setQvOpen(false); jumpTo(p) }
  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(email); setCopied('Copied ✓') } catch { setCopied('Select the address to copy') }
    setTimeout(() => setCopied('Copy email'), 2200)
  }

  return (
    <div className={`xp${noGL ? ' nogl-mode' : ''}`} ref={rootRef}>
      <canvas id="gl" aria-hidden="true" />
      <div className="film" aria-hidden="true" />
      <div className="leak" id="leak" aria-hidden="true" />

      <div id="loader" role="status" className={noGL ? 'done' : ''}>
        <div className="box">
          <div className="pct" id="pct">00</div>
          <div className="mono" style={{ color: 'var(--dim)', letterSpacing: '.3em', marginTop: 6 }}>Sourav Goyal · Software Engineer</div>
          <div className="bar"><i id="bar" /></div>
          <div className="msg mono" id="msg">Loading</div>
        </div>
      </div>

      <header className="hud tl">
        <a className="emblem" href="#top" aria-label="Sourav Goyal, back to top" onClick={jump(SECTIONS.top)}>SG</a>
        <span className="who"><b>Sourav Goyal</b><span>Software Engineer</span></span>
      </header>
      <nav className="hud tr topnav" aria-label="Sections">
        {navLinks.map(({ to, label }) => <a key={to} href={`#${to}`} onClick={jump(SECTIONS[to])}>{label}</a>)}
        <button className="qv-open" type="button" onClick={() => setQvOpen(true)}>Quick view</button>
        <a className="gh" href="https://github.com/sogoyalz" aria-label="GitHub profile">
          <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>
        </a>
      </nav>
      <div className="hud bl mono"><span id="chapno">01 / 06</span> <span className="chap" id="chapname">Home</span></div>
      <div className="hud br mono">
        <button className="snd" id="snd" type="button" aria-pressed="false"><span className="eq" aria-hidden="true"><i /><i /><i /><i /></span><span id="sndlbl">Sound off</span></button>
        <span id="scrollhint">Scroll to explore</span>
        <svg className="ring" viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="20" stroke="rgba(255,255,255,.12)" /><circle id="ringp" cx="22" cy="22" r="20" stroke="#c8102e" strokeDasharray="125.66" strokeDashoffset="125.66" transform="rotate(-90 22 22)" /></svg>
      </div>
      <nav className="dots" aria-label="Chapters">
        {CHAPTERS.map((c, i) => (
          <button type="button" key={c.name} aria-label={c.name} onClick={jump(c.p + (i ? 0.012 : 0))}>
            <span className="mono">{pad(i + 1)} {c.name}</span>
          </button>
        ))}
      </nav>

      <div id="track" />
      <QuickView open={qvOpen || noGL} onClose={closeQV} onJump={(p) => { setQvOpen(false); jumpTo(p) }} />

      <div id="starlabels">
        {MILESTONES.map((m) => (
          <div className={`slabel${m.future ? ' future' : ''}`} key={m.t}>
            <div className="d mono">{m.d}</div><h3>{m.t}</h3><p>{m.p}</p>
          </div>
        ))}
      </div>

      <main>
        <Beat a={-1} b={0} c={0.055} d={0.085} className="center hero" id="top">
          <div className="eyebrow mono">Texas Tech · Computer Science · 2028</div>
          <h1 className="hero-name" aria-label="Sourav Goyal">
            <span className="row" aria-hidden="true">
              {[...'Sourav Goyal'].map((c, i) => <span className="l" style={{ '--i': i }} key={i}>{c === ' ' ? '  ' : c}</span>)}
            </span>
          </h1>
          <p className="hero-sub">Software engineer and CS student at Texas Tech. I build developer tools, browser extensions and full-stack apps.<br /><b>Open to Summer 2027 SWE internships.</b></p>
          <div className="cta">
            <a className="primary" href="#work" onClick={jump(SECTIONS.work)}>View my work</a>
            <button type="button" onClick={() => setQvOpen(true)}>Quick view</button>
          </div>
        </Beat>

        {STORY.map((s, i) => (
          <Beat key={i} a={s.a} b={s.b} c={s.c} d={s.d} className="center">
            <div className="entry mono">Journal entry · {pad(i + 1)}</div>
            <TypedLine parts={s.parts} />
            <div className="verse-small">{s.small}</div>
          </Beat>
        ))}

        <Beat a={0.32} b={0.335} c={0.395} d={0.415} className="left" id="about">
          <div className="dossier">
            <div className="mono" style={{ color: 'var(--blood-hi)', letterSpacing: '.26em' }}>About</div>
            <h2>The engineer behind the telescope</h2>
            <p>I’m a <b>junior in Computer Science</b> at Texas Tech’s Whitacre College of Engineering, with minors in <b>AI and Mathematics</b>. First-generation, Honors College, and an undergrad grader for <b>CS 2413 Data Structures</b>.</p>
            <p>Away from the editor: DC animated films, The Batman on repeat, and poetry in Urdu, Hindi and English.</p>
            <div className="stats">
              {about.stats.slice(0, 2).map((s) => <div key={s.label}><b>{s.value}</b><span className="mono">{s.label}</span></div>)}
              <div><b>~55</b><span className="mono">students graded</span></div>
            </div>
            <div className="favs"><span>Alien X, always</span><span>DC animated</span><span>SpaceX launches</span><span>The Batman</span></div>
          </div>
        </Beat>

        <Beat a={0.415} b={0.43} c={0.455} d={0.47} className="center" id="work">
          <div className="mono" style={{ color: 'var(--blood-hi)', letterSpacing: '.3em' }}>Chapter 04</div>
          <h2 className="title-card">Worlds I’ve built</h2><div className="rule" />
          <div className="verse-small">Every planet is a project. Each one orbits a question.</div>
        </Beat>

        {WORLDS.map((w, i) => {
          const s = PROJECT_START + i * PROJECT_STEP
          return (
            <Beat key={w.id} a={s - 0.004} b={s + 0.006} c={s + PROJECT_STEP - 0.012} d={s + PROJECT_STEP - 0.002} className="left proj">
              <div className="dossier">
                <div className="idx mono"><span>Project {pad(i + 1)} / {pad(WORLDS.length)}</span><span>{w.meta}</span></div>
                <h2>{w.name}</h2>
                <p>{w.desc}</p>
                <div className="tech mono">{w.tech.map((t) => <span key={t}>{t}</span>)}</div>
                <a className="go" href={w.href}>View repository ↗</a>
              </div>
            </Beat>
          )
        })}

        <Beat a={0.69} b={0.705} c={0.725} d={0.74} className="center" id="experience">
          <div className="mono" style={{ color: 'var(--blood-hi)', letterSpacing: '.3em' }}>Chapter 05</div>
          <h2 className="title-card">Connect the dots</h2><div className="rule" />
          <div className="verse-small">Every milestone is a star. Here is the constellation so far.</div>
        </Beat>

        <Beat a={0.845} b={0.86} c={0.88} d={0.895} className="center">
          <div className="mono" style={{ color: 'var(--blood-hi)', letterSpacing: '.3em' }}>Chapter 06</div>
          <h2 className="title-card">Every city needs a signal</h2><div className="rule" />
        </Beat>

        <Beat a={0.93} b={0.965} c={2} d={3} className="center contact-beat" id="contact" style={{ top: '70%' }}>
          <div className="mono" style={{ color: 'var(--blood-hi)', letterSpacing: '.26em', marginBottom: 14 }}>Contact</div>
          <h2 className="signal-title">Let’s <span>talk.</span></h2>
          <div className="contact-row">
            <a className="mail" href={`mailto:${email}`}>{email}</a>
            <button className="btn" type="button" onClick={copyEmail}>{copied}</button>
          </div>
          <div className="socials mono">
            {socials.map((s) => <a key={s.id} href={s.href}>{socialLabel[s.id] || s.label} ↗</a>)}
          </div>
          <div className="sign-off mono">© {new Date().getFullYear()} Sourav Goyal · Lubbock, TX</div>
        </Beat>
      </main>
    </div>
  )
}
