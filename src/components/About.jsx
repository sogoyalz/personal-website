import { about } from '../data/content'
import SectionHeader from './ui/SectionHeader'
import TerminalChrome from './ui/TerminalChrome'
import Reveal from './ui/Reveal'
import { Critter } from './LittleFriends'

export default function About() {
  return (
    <section id="about" className="relative py-28 border-b border-line overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Section label */}
        <Reveal className="mb-14" duration={0.6}>
          <SectionHeader label="About" title={about.heading} />
        </Reveal>

        {/* Two-column: portrait card + bio */}
        <div className="grid grid-cols-[340px_1fr] gap-14 max-lg:grid-cols-1 max-lg:gap-10 items-start">
          {/* Portrait card */}
          <Reveal
            delay={0.1}
            duration={0.6}
            className="relative max-lg:max-w-[340px] max-lg:mx-auto w-full"
          >
            <TerminalChrome path="~/sourav/portrait">
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={`${import.meta.env.BASE_URL}images/sourav.png`}
                  alt="Sourav Goyal"
                  className="w-full h-full object-cover object-top grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
            </TerminalChrome>
            <div className="portrait-cat" aria-hidden="true"><Critter kind="cat" /><span>seems like a nice human.</span></div>
            {/* Floating credential badge */}
            <div className="absolute -bottom-4 -right-4 max-sm:right-2 px-4 py-3 rounded-[6px] border border-line bg-card shadow-lg">
              <span className="block label-micro">CS · Junior</span>
              <span className="block mt-1 text-[0.8rem] font-semibold text-fg">Texas Tech University</span>
            </div>
          </Reveal>

          {/* Bio + tools */}
          <div>
            <div className="flex flex-col gap-4">
              {about.bio.map((para, i) => (
                <Reveal
                  key={i}
                  as="p"
                  delay={0.15 + i * 0.08}
                  duration={0.6}
                  className="text-body text-[0.95rem] leading-[1.9]"
                >
                  {para}
                </Reveal>
              ))}
            </div>

            {/* Toolset split */}
            <Reveal delay={0.45} duration={0.6} className="mt-8 grid grid-cols-2 max-sm:grid-cols-1 gap-8">
              <div>
                <h4 className="label-micro mb-3">Engineering</h4>
                <div className="flex flex-wrap gap-2">
                  {about.devTools.map((tool) => (
                    <span key={tool} className="chip">{tool}</span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="label-micro mb-3">Design &amp; Creative</h4>
                <div className="flex flex-wrap gap-2">
                  {about.creativeTools.map((tool) => (
                    <span key={tool} className="chip">{tool}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Stat tiles */}
        <Reveal
          delay={0.4}
          duration={0.6}
          className="mt-16 grid grid-cols-4 max-sm:grid-cols-2 border border-line divide-x divide-line max-sm:divide-x-0 max-sm:divide-y bg-card"
        >
          {about.stats.map((s) => (
            <div key={s.label} className="p-7 max-sm:p-5 text-center max-sm:[&:nth-child(odd)]:border-r max-sm:[&:nth-child(odd)]:border-line">
              <div className="stat-number text-[clamp(2.4rem,4vw,3.4rem)] leading-none text-fg">
                {s.value}
              </div>
              <div className="mt-3 label-micro leading-snug">{s.label}</div>
            </div>
          ))}
        </Reveal>

        {/* Fact cells */}
        <Reveal
          delay={0.5}
          duration={0.6}
          className="mt-6 grid grid-cols-4 max-lg:grid-cols-2 max-sm:grid-cols-1 border border-line divide-x divide-line max-lg:divide-x-0 max-lg:divide-y"
        >
          {about.facts.map((f) => (
            <div key={f.title} className="p-6 bg-card hover:bg-card-hover transition-colors group">
              <span className="text-[1.4rem] group-hover:scale-110 inline-block transition-transform">{f.emoji}</span>
              <strong className="block mt-3 text-[0.95rem] font-semibold text-fg">{f.title}</strong>
              <span className="block mt-1 text-[0.8rem] font-mono text-muted">{f.sub}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
