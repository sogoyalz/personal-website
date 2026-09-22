import { Link } from 'react-router-dom'
import { about } from '../data/content'
import Reveal from './ui/Reveal'

export default function AboutPreview() {
  return (
    <section className="py-24 border-b border-line" aria-labelledby="about-preview-heading">
      <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-[220px_1fr] max-md:grid-cols-1 gap-12 items-center">
        <Reveal className="relative max-md:max-w-[180px]">
          <div className="aspect-square overflow-hidden rounded-[12px] border border-line bg-card rotate-[-2deg]">
            <img src={`${import.meta.env.BASE_URL}images/sourav.png`} alt="Sourav Goyal" className="w-full h-full object-cover object-top" />
          </div>
          <span aria-hidden className="absolute -right-4 -bottom-4 text-4xl rotate-12">✦</span>
        </Reveal>

        <Reveal delay={0.1}>
          <span className="label-micro">A little more human</span>
          <h2 id="about-preview-heading" className="mt-4 text-[clamp(2rem,3.6vw,3rem)] font-bold tracking-[-0.02em] text-fg">
            Beyond the code
          </h2>
          <p className="mt-6 text-[0.95rem] leading-[1.85] text-body">{about.bio[0]}</p>
          <p className="mt-4 text-[0.95rem] leading-[1.85] text-body">{about.bio[2]}</p>
          <Link to="/about" className="btn-outline mt-7">More About Me →</Link>
        </Reveal>
      </div>
    </section>
  )
}
