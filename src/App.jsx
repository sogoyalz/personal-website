import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import PageMeta from './components/PageMeta'
import Home from './pages/Home'

const AboutPage = lazy(() => import('./pages/AboutPage'))
const SkillsPage = lazy(() => import('./pages/SkillsPage'))
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'))
const JourneyPage = lazy(() => import('./pages/JourneyPage'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function PageFallback() {
  return <div className="min-h-[70vh] pt-32 text-center font-mono text-sm text-muted" role="status">Loading…</div>
}

export default function App() {
  return (
    <ThemeProvider>
      <ScrollToTop />
      <PageMeta />
      <Navbar />
      <main>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/skills" element={<SkillsPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/journey" element={<JourneyPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </ThemeProvider>
  )
}
