import { useInView, useReducedMotion } from 'framer-motion'

export const cardVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    scale: 1
  }
}

export const imageVariants = {
  hidden: {
    opacity: 0,
    scale: 0.85
  },
  visible: {
    opacity: 1,
    scale: 1
  }
}

export const tagVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    scale: 1
  }
}

// Animation timing constants (in seconds)
const DURATION = 0.4
const STAGGER_DELAY = 0.15
const INITIAL_DELAY = 0.2

export function useWorkCardAnimation(ref: React.RefObject<HTMLElement>) {
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const shouldReduceMotion = useReducedMotion()
  
  return { 
    isInView, 
    shouldReduceMotion,
    duration: shouldReduceMotion ? 0 : DURATION,
    getDelay: (index: number) => shouldReduceMotion ? 0 : INITIAL_DELAY + (index * STAGGER_DELAY)
  }
}

// Legacy export for backward compatibility
export const cellVariants = cardVariants
export function useCellAnimation(ref: React.RefObject<HTMLElement>) {
  return useWorkCardAnimation(ref)
}
