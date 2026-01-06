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
            if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
              setActiveIndex(index)
            } else if (!entry.isIntersecting && activeIndex === index) {
              // Current section is exiting, find new active section
              const intersectingSections = sectionRefs.current
                .map((ref, i) => ({ ref, index: i }))
                .filter(({ ref }) => ref && observer.root?.contains(ref))
                .filter(({ ref }) => {
                  const rect = ref!.getBoundingClientRect()
                  return rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5
                })
                .sort((a, b) => {
                  const aRect = a.ref!.getBoundingClientRect()
                  const bRect = b.ref!.getBoundingClientRect()
                  return Math.abs(aRect.top) - Math.abs(bRect.top)
                })

              if (intersectingSections.length > 0) {
                setActiveIndex(intersectingSections[0].index)
              }
            }
          })
        },
        { threshold, rootMargin, root: null }
      )

      observer.observe(section)
      observers.push(observer)
    })

    return () => {
      observers.forEach((observer) => observer.disconnect())
    }
  }, [sectionCount, threshold, rootMargin, activeIndex])

  return { activeIndex, sectionRefs, setRef }
}
