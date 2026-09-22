import {
  SiReact, SiJavascript, SiPython, SiTailwindcss, SiGit, SiFigma,
  SiHtml5, SiCss, SiTypescript, SiNextdotjs, SiFastapi, SiDocker,
} from 'react-icons/si'
import { VscVscode } from 'react-icons/vsc'
import { FiVideo, FiImage, FiZap } from 'react-icons/fi'
import { techMarquee } from '../data/content'

// react-icons no longer ships Adobe brand icons — generic glyphs stand in.
const icons = [
  { icon: SiReact, label: 'React' },
  { icon: SiJavascript, label: 'JavaScript' },
  { icon: SiPython, label: 'Python' },
  { icon: SiTailwindcss, label: 'Tailwind' },
  { icon: SiGit, label: 'Git' },
  { icon: SiFigma, label: 'Figma' },
  { icon: FiVideo, label: 'Premiere Pro' },
  { icon: FiImage, label: 'Photoshop' },
  { icon: FiZap, label: 'After Effects' },
  { icon: VscVscode, label: 'VS Code' },
  { icon: SiHtml5, label: 'HTML5' },
  { icon: SiCss, label: 'CSS3' },
  { icon: SiTypescript, label: 'TypeScript' },
  { icon: SiNextdotjs, label: 'Next.js' },
  { icon: SiFastapi, label: 'FastAPI' },
  { icon: SiDocker, label: 'Docker' },
]
const items = techMarquee.map(label => ({ label, icon: icons.find(item => item.label === label)?.icon || FiZap }))

export default function TechMarquee() {
  return (
    <section className="border-y border-line bg-card">
      <div className="max-w-[1400px] mx-auto flex items-center max-md:flex-col">
        <div className="shrink-0 px-8 py-6 label-micro border-r border-line max-md:border-r-0 max-md:border-b max-md:w-full max-md:text-center">
          Stack // Tools
        </div>
        <div className="relative flex-1 overflow-hidden py-6 max-md:w-full [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          {/* Two copies of the list; animation slides -50% for a seamless loop. */}
          <div className="flex w-max gap-14 animate-marquee">
            {[...items, ...items].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 text-muted hover:text-fg transition-colors">
                <item.icon size={18} />
                <span className="font-mono font-medium text-[0.85rem] whitespace-nowrap">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
