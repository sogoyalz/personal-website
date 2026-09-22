import { FiExternalLink, FiGithub } from 'react-icons/fi'
import { projects } from '../data/content'
import TerminalChrome from './ui/TerminalChrome'
import Reveal from './ui/Reveal'

export default function Projects({ limit }) {
  const shown = limit ? projects.slice(0, limit) : projects

  return (
    <section id="projects" className="py-28 border-b border-line">
      <div className="max-w-[1400px] mx-auto px-6">
        <Reveal
          className="mb-14 flex items-end justify-between max-md:flex-col max-md:items-start max-md:gap-3"
          y={30}
          duration={0.6}
        >
          <div>
            <span className="label-micro">Selected Work</span>
            <h2 className="mt-4 text-[clamp(2rem,3.6vw,3rem)] font-bold tracking-[-0.02em] text-fg">
              Selected Work
            </h2>
          </div>
          <p className="text-body text-[0.9rem] max-w-[360px]">
            A selection of engineering projects, product work, and leadership.
          </p>
        </Reveal>

        <div className="grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-5">
          {shown.map((p, i) => (
            <Reveal
              as="article"
              key={p.id}
              className="group flex"
              delay={0.07 * i}
            >
              <TerminalChrome
                path={`~/projects/${p.id}`}
                right={<span className="label-micro !text-[0.6rem]">{p.tag}</span>}
                hoverable
                className="flex flex-col w-full"
              >
                {p.image && (
                  <div className="h-[180px] overflow-hidden border-b border-line">
                    <img
                      src={p.image}
                      alt={p.title}
                      loading="lazy"
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                )}
                <div className="p-7 flex flex-col flex-1">
                  <span className="text-[1.6rem] inline-block transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">{p.emoji}</span>
                  <h3 className="mt-4 text-[1.05rem] font-semibold text-fg group-hover:underline decoration-line underline-offset-4">
                    {p.title}
                  </h3>
                  <p className="mt-2.5 text-[0.85rem] text-body leading-[1.7] flex-1">{p.desc}</p>
                  <div className="mt-5 flex gap-2 flex-wrap">
                    {p.tech.map((tch) => (
                      <span key={tch} className="chip">{tch}</span>
                    ))}
                  </div>
                  {(p.link || p.github) && (
                    <div className="mt-5 flex gap-5">
                      {p.link && (
                        <a
                          href={p.link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-fg hover:underline"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-ok" />
                          <FiExternalLink size={13} /> {p.linkLabel || 'Live'}
                        </a>
                      )}
                      {p.github && (
                        <a
                          href={p.github}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-muted hover:text-fg"
                        >
                          <FiGithub size={13} /> Code
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </TerminalChrome>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
