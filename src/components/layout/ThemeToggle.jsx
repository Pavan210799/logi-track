import { useState } from 'react'
import { Moon, Sun } from 'lucide-react'

const storageKey = 'logitrack-theme'

// Switches between light and dark; index.html applies the saved choice before the app loads
function ThemeToggle() {
  const [isDark, setIsDark] = useState(function () {
    return document.documentElement.classList.contains('dark')
  })

  function handleToggle() {
    const nextDark = !isDark
    document.documentElement.classList.toggle('dark', nextDark)
    try {
      localStorage.setItem(storageKey, nextDark ? 'dark' : 'light')
    } catch {
      // Private mode can block storage; the theme still applies for this visit
    }
    setIsDark(nextDark)
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className="relative grid h-10 w-10 cursor-pointer place-items-center overflow-hidden rounded-xl border border-line bg-surface transition duration-200 hover:-translate-y-0.5 hover:border-burgundy/30 hover:text-accent hover:shadow-md"
    >
      <Sun
        size={19}
        className={
          'absolute transition duration-500 ' + (isDark ? 'rotate-0 scale-100 opacity-100 text-amber-400' : '-rotate-90 scale-50 opacity-0')
        }
      />
      <Moon
        size={18}
        className={'absolute transition duration-500 ' + (isDark ? 'rotate-90 scale-50 opacity-0' : 'rotate-0 scale-100 opacity-100')}
      />
    </button>
  )
}

export default ThemeToggle
