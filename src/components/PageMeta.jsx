import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const defaultDescription = 'Sourav Goyal is a computer science student and software engineer building thoughtful web, data, and developer tools.'

const pages = {
  '/': ['Sourav Goyal — Software Engineer & CS Student', defaultDescription],
  '/about': ['About Sourav Goyal', 'Meet Sourav Goyal, a Texas Tech computer science student, undergraduate grader, mentor, and software builder.'],
  '/skills': ['Skills — Sourav Goyal', 'Explore Sourav Goyal’s full-stack, data, open-source, browser-extension, and creative skills.'],
  '/projects': ['Projects — Sourav Goyal', 'Selected software projects and public GitHub work by Sourav Goyal, including Hydra Blast Radius, Doomscroll, and ReelTogether.'],
  '/journey': ['Experience & Education — Sourav Goyal', 'Sourav Goyal’s experience in teaching, research, mentorship, product building, and computer science education.'],
  '/blog': ['Writing — Sourav Goyal', 'Notes and stories about software engineering, hackathons, learning, and building products.'],
  '/contact': ['Contact Sourav Goyal', 'Get in touch with Sourav Goyal about software engineering opportunities, projects, and collaboration.'],
}

function setMeta(selector, attributes) {
  let element = document.head.querySelector(selector)
  if (!element) {
    element = document.createElement('meta')
    document.head.appendChild(element)
  }
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value))
}

export default function PageMeta() {
  const { pathname } = useLocation()

  useEffect(() => {
    const [title, description] = pages[pathname] ?? ['Page Not Found — Sourav Goyal', defaultDescription]
    const configuredOrigin = import.meta.env.VITE_SITE_URL?.replace(/\/$/, '')
    const canonicalUrl = `${configuredOrigin || window.location.origin}${pathname}`

    document.title = title
    setMeta('meta[name="description"]', { name: 'description', content: description })
    setMeta('meta[property="og:title"]', { property: 'og:title', content: title })
    setMeta('meta[property="og:description"]', { property: 'og:description', content: description })
    setMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl })
    setMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title })
    setMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description })

    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = canonicalUrl
  }, [pathname])

  return null
}
