import { timeline } from '../data/content'
import SectionHeader from './ui/SectionHeader'
import Reveal from './ui/Reveal'

function TimelineList({ entries }) {
  return (
    <div className="flex flex-col">
      {entries.map((entry, index) => {
        const last = index === entries.length - 1
        return (
          <Reveal
            key={entry.title}
            className="relative grid grid-cols-[48px_1fr] gap-6 max-sm:gap-4 pb-12 last:pb-0"
            delay={0.08 * index}
          >
            <div className="relative flex flex-col items-center">
              <div className="w-12 h-12 shrink-0 rounded-[6px] border border-line bg-card flex items-center justify-center font-mono font-bold text-fg text-[0.9rem]">
                {index + 1}
              </div>
              {!last && <span className="absolute top-12 bottom-0 w-px bg-line" aria-hidden />}
            </div>

            <div className="pt-1">
              <span className="label-micro">
                {String(index + 1).padStart(2, '0')}. {entry.date}
              </span>
              <h3 className="mt-2 text-[1.05rem] font-semibold text-fg">{entry.title}</h3>
              <p className="mt-0.5 font-mono text-[0.75rem] text-muted">{entry.org}</p>
              {entry.roles ? (
                <div className="mt-6 ml-1 border-l border-line pl-6 space-y-8">
                  {entry.roles.map((role) => (
                    <div key={role.title} className="relative">
                      <span className="absolute -left-[1.72rem] top-1.5 w-2 h-2 rounded-full bg-fg ring-4 ring-surface" aria-hidden />
                      <span className="label-micro">{role.date}</span>
                      <h4 className="mt-2 text-[0.95rem] font-semibold text-fg">{role.title}</h4>
                      <p className="mt-2.5 text-[0.88rem] text-body leading-[1.7]">{role.desc}</p>
                      <div className="mt-3.5 flex gap-2 flex-wrap">
                        {role.tags.map((tag) => <span key={tag} className="chip">{tag}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <p className="mt-2.5 text-[0.88rem] text-body leading-[1.7]">{entry.desc}</p>
                  <div className="mt-3.5 flex gap-2 flex-wrap">
                    {entry.tags.map((tag) => <span key={tag} className="chip">{tag}</span>)}
                  </div>
                </>
              )}
            </div>
          </Reveal>
        )
      })}
    </div>
  )
}

export default function Timeline() {
  const experience = timeline.filter((entry) => entry.category !== 'education')
  const education = timeline.filter((entry) => entry.category === 'education')

  return (
    <section id="journey" className="py-28 border-b border-line">
      <div className="max-w-[860px] mx-auto px-6">
        <Reveal className="mb-16" y={30} duration={0.6}>
          <SectionHeader
            label="Journey"
            title="Experience"
            sub="From Jaipur, India to Lubbock, Texas."
            align="center"
          />
        </Reveal>

        <TimelineList entries={experience} />

        <Reveal className="mt-24 mb-12 border-t border-line pt-16" y={24} duration={0.6}>
          <span className="label-micro">Academic background</span>
          <h2 className="mt-4 text-[clamp(2rem,3.6vw,3rem)] font-bold tracking-[-0.02em] text-fg">
            Education
          </h2>
        </Reveal>
        <TimelineList entries={education} />
      </div>
    </section>
  )
}
