import { FiMoon, FiSun } from 'react-icons/fi'
import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle({ className = '' }) {
  const { theme, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-[4px] border border-line text-body transition-colors hover:border-line-strong hover:text-fg ${className}`}
    >
      {theme === 'dark' ? <FiSun size={15} /> : <FiMoon size={15} />}
    </button>
  )
}
