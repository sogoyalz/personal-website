// Data for the cinematic site. Facts come from content.js; this file adds how each
// thing appears in the film (planet colours, where in the scroll it shows up, etc.).
import { about, projects, timeline } from './content.js'

// Scroll positions (0 = top, 1 = end) that the navigation jumps to.
export const SECTIONS = { top: 0, about: 0.345, work: 0.481, experience: 0.75, contact: 0.985 }

export const CHAPTERS = [
  { name: 'Home', p: 0 },
  { name: 'Origin', p: 0.11 },
  { name: 'The Galaxy', p: 0.33 },
  { name: 'Worlds I built', p: 0.43 },
  { name: 'Constellation', p: 0.7 },
  { name: 'The Signal', p: 0.86 },
]

// Journal entries typed out during the origin chapter. [text, emphasised?] pairs.
export const STORY = [
  { a: 0.095, b: 0.115, c: 0.15, d: 0.17, parts: [['When I was a kid, I was going to '], ['study the stars.', true]], small: 'Ben 10 on the TV. SpaceX launches on loop.' },
  { a: 0.175, b: 0.19, c: 0.22, d: 0.24, parts: [['Physics had '], ['other plans.', true]], small: 'I loved the sky more than the equations.' },
  { a: 0.245, b: 0.26, c: 0.29, d: 0.31, parts: [['So now I build '], ['universes in code', true], [' instead.']], small: 'Keep scrolling.' },
]

// How each project looks as a planet. type: 0 rocky, 1 gas giant, 2 molten.
const LOOKS = [
  { id: 'hydra-blast-radius', name: 'Hydra Blast Radius', meta: 'Hack Hydra 2026 · Track 2A', type: 2, a: [.10, .03, .02], b: [.25, .08, .04], c: [1.0, .42, .12], r: 9, orbit: 52 },
  { id: 'doomscroll', name: 'Doomscroll', meta: 'Chrome extension · local-only', type: 1, a: [.05, .25, .30], b: [.55, .85, .80], c: [.10, .45, .55], r: 12, orbit: 78 },
  { id: 'reeltogether', name: 'ReelTogether', meta: 'Full stack · movie discovery', type: 1, a: [.45, .30, .14], b: [.95, .78, .50], c: [.70, .45, .20], r: 13, orbit: 104, rings: true },
  { id: '1', name: 'Probe → Trace', meta: 'Co-founder · Sep 2025 – Feb 2026', type: 0, a: [.55, .70, .85], b: [.92, .96, 1.0], c: [.30, .40, .55], r: 8, orbit: 128, moon: true },
  { id: '2', name: 'NeuroSole', meta: 'HackRice · team project', type: 0, a: [.20, .35, .22], b: [.62, .70, .45], c: [.10, .16, .12], r: 9, orbit: 150 },
  { id: 'movie-pulse', name: 'Movie Pulse', meta: 'Full stack · analytics', type: 1, a: [.25, .12, .40], b: [.85, .55, .95], c: [.45, .25, .70], r: 11, orbit: 174 },
]

export const WORLDS = LOOKS.map((look) => {
  const project = projects.find(({ id }) => String(id) === look.id)
  if (!project) throw new Error(`No project with id ${look.id} in content.js`)
  return { ...look, desc: project.desc, tech: project.tech, href: project.github || project.link }
})

// The project chapter: when the first planet visit starts, and how long each visit lasts.
export const PROJECT_START = 0.475
export const PROJECT_STEP = 0.036

// Stars in the constellation, oldest first. The last one is the next step.
export const MILESTONES = [
  { d: 'Aug 2024', t: 'Liftoff: B.S. CS', p: 'Texas Tech, Whitacre College of Engineering. AI and Math minors, Honors College.' },
  { d: 'May 2025', t: 'ATLC tech support', p: 'Front-line support across the computing labs, later student supervisor.' },
  { d: '2025', t: 'LYFE mentor', p: 'Mentoring engineering underclassmen, one-on-one.' },
  { d: 'Sep 2025', t: 'Co-founded Probe', p: 'A developer browser, now Trace. Shipped the site and early access.' },
  { d: 'Oct 2025', t: 'Hacktoberfest + HackRice', p: 'Supercontributor with six merged PRs. NeuroSole in 36 hours.' },
  { d: '2026', t: 'Hack Hydra · Ecology lab', p: 'Built Hydra Blast Radius. Started undergraduate research.' },
  { d: 'Sep 2026', t: 'CS 2413 grader', p: 'Supporting about 55 Data Structures students.' },
  { d: 'Summer 2027', t: 'Your team?', p: 'Open to software engineering internships.', future: true },
]

// Tool names that drift in the asteroid belt.
export const STACK = [...about.devTools.filter((t) => t !== 'JavaScript' && t !== 'Git'), 'Chrome MV3', 'IndexedDB', 'Figma', 'After Effects']

// Quick view: experience and education straight from the timeline.
export const QUICK_EXPERIENCE = timeline
  .filter(({ category }) => category !== 'education')
  .map(({ title, org, date, summary, desc, roles }) => ({
    title,
    org,
    date,
    text: summary || desc || roles?.map((r) => r.title).join(' · '),
  }))

export const EDUCATION = timeline.find(({ category }) => category === 'education')
