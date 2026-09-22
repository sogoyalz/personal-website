import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import TechMarquee from '../components/TechMarquee'
import SkillsBento from '../components/SkillsBento'
import Projects from '../components/Projects'
import Contact from '../components/Contact'
import ExperiencePreview from '../components/ExperiencePreview'
import AboutPreview from '../components/AboutPreview'

export default function Home() {
  return (
    <>
      <Hero />
      <TechMarquee />
      <Projects limit={3} />
      <div className="border-b border-line">
        <div className="max-w-[1400px] mx-auto px-6 py-12 flex justify-center">
          <Link to="/projects" className="btn-outline">View All Work →</Link>
        </div>
      </div>
      <ExperiencePreview />
      <SkillsBento />
      <AboutPreview />
      <Contact />
    </>
  )
}
