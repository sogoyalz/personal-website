import { skillsBento } from '../data/content'
import Reveal from './ui/Reveal'

export default function SkillsBento() {
  return (
    <section id="skills" className="py-28 border-b border-line">
      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-[1fr_2fr] max-lg:grid-cols-1 gap-16 max-lg:gap-10">
        {/* Left: sticky heading */}
        <Reveal className="lg:sticky lg:top-28 self-start" y={30} duration={0.6}>
          <span className="label-micro">Skills</span>
          <h2 className="mt-4 text-[clamp(2rem,3.6vw,3rem)] font-bold tracking-[-0.02em] leading-[1.15] text-fg">
            Skills &amp;
            <br />
            <span className="text-muted">Expertise</span>
          </h2>
          <p className="mt-6 text-body text-[0.95rem] leading-[1.8] max-w-[380px]">
            A focused set of engineering skills — from shipping full-stack web
            applications to applied machine learning and open-source work.
          </p>
        </Reveal>

        {/* Right: bento grid */}
        <div className="grid grid-cols-2 max-sm:grid-cols-1 border border-line divide-line">
          {skillsBento.map((s, i) => {
            const count = skillsBento.length
            const inset = i === 0 || i === count - 1
            const isLastRow = i >= count - (count % 2 === 0 ? 2 : 1)
            const isLastItem = i === count - 1
            return (
              <Reveal
                key={s.title}
                className={`p-8 border-line transition-all duration-300 group hover:-translate-y-0.5 ${
                  inset
                    ? 'bg-inset bg-scanlines'
                    : 'bg-card hover:bg-card-hover'
                } ${i % 2 === 0 ? 'sm:border-r' : ''} ${
                  isLastRow ? 'max-sm:border-b' : 'border-b'
                } ${isLastItem ? 'max-sm:border-b-0' : ''}`}
                delay={0.08 * i}
              >
                {inset && (
                  <span className="block font-mono text-[0.65rem] text-inset-body mb-3">
                    /skills/layer_{String(i + 1).padStart(2, '0')}
                  </span>
                )}
                <h3
                  className={`text-[1.05rem] font-semibold ${
                    inset ? 'text-inset-fg' : 'text-fg'
                  }`}
                >
                  {s.title}
                </h3>
                <p
                  className={`mt-2.5 text-[0.85rem] leading-[1.7] ${
                    inset ? 'text-inset-body' : 'text-body'
                  }`}
                >
                  {s.desc}
                </p>
                <div className="mt-5 flex gap-2 flex-wrap">
                  {s.chips.map((c) => (
                    <span
                      key={c}
                      className={
                        inset
                          ? 'inline-flex items-center gap-1 font-mono text-[0.68rem] text-inset-body border border-inset-line bg-transparent rounded-[3px] px-2 py-1 whitespace-nowrap'
                          : 'chip'
                      }
                    >
                      {inset && <span aria-hidden>[•]</span>}
                      {c}
                    </span>
                  ))}
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
