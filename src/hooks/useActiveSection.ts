import { useState, useEffect, useRef, type RefObject } from 'react'

interface UseActiveSectionOptions {
  threshold?: number
  rootMargin?: string
}

interface UseActiveSectionReturn {
  activeIndex: number
  sectionRefs: RefObject<(HTMLDivElement | null)[]>
  setRef: (index: number) => (el: HTMLDivElement | null) => void
}

export function useActiveSection(
  sectionCount: number,
  options: UseActiveSectionOptions = {}
): UseActiveSectionReturn {
  const { threshold = 0.5, rootMargin = '0px' } = options
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])

  const setRef = (index: number) => (el: HTMLDivElement | null) => {
    sectionRefs.current[index] = el
  }

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    
    sectionRefs.current.forEach((section, index) => {
      if (!section) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveIndex(index)
            }
          })
        },
        { threshold, rootMargin }
      )

      observer.observe(section)
      observers.push(observer)
    })

    return () => {
      observers.forEach((observer) => observer.disconnect())
    }
  }, [sectionCount, threshold, rootMargin])

  return { activeIndex, sectionRefs, setRef }
}
