import { Navigate, Route, Routes } from 'react-router-dom'
import Experience from './experience/Experience'

// The old multi-page site's addresses land on the matching chapter of the new one.
const LEGACY = { about: 'about', skills: 'about', projects: 'work', journey: 'experience', blog: 'about', contact: 'contact' }

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Experience />} />
      {Object.entries(LEGACY).map(([path, section]) => (
        <Route key={path} path={`/${path}`} element={<Navigate to={{ pathname: '/', hash: `#${section}` }} replace />} />
      ))}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
