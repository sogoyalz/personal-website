import { Link } from 'react-router-dom'
import { timeline } from '../data/content'
import Reveal from './ui/Reveal'
import SectionHeader from './ui/SectionHeader'

export default function ExperiencePreview() {
  const current = timeline.filter((entry) => entry.featured)

  return (
    <section className="py-24 border-b border-line" aria-labelledby="current-work-heading">
      <div className="max-w-[1200px] mx-auto px-6">
        <Reveal className="flex items-end justify-between gap-6 max-md:flex-col max-md:items-start">
          <SectionHeader
            label="Right now"
            title="Current Experience"
            titleId="current-work-heading"
            sub="Teaching, research, and mentorship at Texas Tech."
            className="[&_h2]:!mb-0"
          />
          <Link to="/journey" className="btn-outline shrink-0">
            Full Journey →
          </Link>
        </Reveal>

        <div className="mt-12 grid grid-cols-3 max-lg:grid-cols-1 gap-5">
          {current.map((entry, index) => (
            <Reveal
              as="article"
              key={entry.title}
              delay={index * 0.08}
              className="p-7 border border-line bg-card rounded-[6px]"
            >
              <span className="label-micro">{entry.date}</span>
              <h3 className="mt-4 text-[1.05rem] font-semibold text-fg">
                {entry.title}
              </h3>
              <p className="mt-1 font-mono text-[0.72rem] text-muted">{entry.org}</p>
              <p className="mt-4 text-[0.85rem] leading-[1.75] text-body">{entry.summary}</p>
              {entry.roles && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {entry.roles.map((role) => <span key={role.title} className="chip">{role.title}</span>)}
                </div>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
