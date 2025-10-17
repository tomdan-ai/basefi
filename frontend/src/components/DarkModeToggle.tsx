import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface DarkModeToggleProps {
  className?: string
}

export default function DarkModeToggle ({ className }: DarkModeToggleProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Check initial color scheme preference
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches
    const savedPreference = localStorage.getItem('darkMode')

    if (
      savedPreference === 'true' ||
      (savedPreference === null && prefersDark)
    ) {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    } else {
      setIsDarkMode(false)
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)

    if (newMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('darkMode', 'true')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('darkMode', 'false')
    }
  }

  return (
    <button
      onClick={toggleDarkMode}
      className={cn(
        'p-2 rounded-md transition-all duration-200',
        isDarkMode
          ? 'text-white hover:bg-gray-800'
          : 'text-gray-800 hover:bg-gray-100',
        className
      )}
      aria-label='Toggle dark mode'
    >
      <span className='font-medium sr-only'>Dark Mode</span>
      {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}
