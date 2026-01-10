'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

export function useHighlightTheme() {
  const [mounted, setMounted] = useState(false)
  const { theme, systemTheme } = useTheme()
  const activeTheme = theme === 'system' ? systemTheme : theme

  useEffect(() => {
    if (!mounted) return

    // Remove existing highlight theme styles
    document.querySelectorAll('link[data-highlight-theme]').forEach(el => el.remove())

    // Determine which CSS file to load
    const cssFile = activeTheme === 'dark' ? 'github-dark.css' : 'github.css'

    // Create and append the link tag
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = `/assets/highlight/${cssFile}`
    link.dataset.highlightTheme = 'true'
    document.head.appendChild(link)

    // Cleanup function to remove the link when theme changes
    return () => {
      const existingLink = document.querySelector(`link[data-highlight-theme]`)
      if (existingLink) {
        existingLink.remove()
      }
    }
  }, [activeTheme, mounted])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])
}