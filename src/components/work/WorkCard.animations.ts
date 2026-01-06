import { useInView, useReducedMotion } from 'framer-motion'

export const cellVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    scale: 1
  }
}

export function useCellAnimation(ref: React.RefObject<HTMLElement>) {
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const shouldReduceMotion = useReducedMotion()
  return { isInView, shouldReduceMotion }
}