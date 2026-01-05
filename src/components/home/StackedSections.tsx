'use client'

import { Children, isValidElement, type ReactNode, useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useReducedMotion,
  type Variants
} from 'framer-motion'
import { useActiveSection } from '@/hooks/useActiveSection'
import { defaultAnimationConfig, reducedMotionConfig } from './animation-config'

interface StackedSectionsProps {
  children: ReactNode
}

export function StackedSections({ children }: StackedSectionsProps) {
  const prefersReducedMotion = useReducedMotion()
  const config = prefersReducedMotion ? reducedMotionConfig : defaultAnimationConfig

  const sections = Children.toArray(children).filter((child) => {
    if (typeof child === 'string') {
      return child.trim().length > 0
    }
    return child !== null && child !== undefined
  })

  const containerRef = useRef<HTMLDivElement>(null)
  const { activeIndex, setRef } = useActiveSection(sections.length, {
    threshold: 0.6,
  })

  const stackHeight = `${Math.max(sections.length, 1) * 100}vh`

  return (
    <div
      ref={containerRef}
      className="relative snap-y snap-mandatory overflow-y-auto"
      style={{ height: stackHeight }}
    >
      <AnimatePresence initial={false} mode="sync">
        {sections.map((child, index) => (
          <StackedSection
            key={isValidElement(child) && child.key !== null ? child.key : `section-${index}`}
            index={index}
            total={sections.length}
            activeIndex={activeIndex}
            setRef={setRef}
            config={config}
          >
            {child}
          </StackedSection>
        ))}
      </AnimatePresence>
    </div>
  )
}

interface StackedSectionProps {
  children: ReactNode
  index: number
  total: number
  activeIndex: number
  setRef: (index: number) => (el: HTMLDivElement | null) => void
  config: typeof defaultAnimationConfig
}

function StackedSection({
  children,
  index,
  total,
  activeIndex,
  setRef,
  config
}: StackedSectionProps) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const isActive = index === activeIndex
  const isAbove = index < activeIndex
  const stackPosition = activeIndex - index

  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [config.stackedScale, config.activeScale, config.stackedScale]
  )

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [config.stackedOpacity, config.activeOpacity, config.activeOpacity, config.stackedOpacity]
  )

  const y = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [
      config.stackedOffsetY + (stackPosition * config.stackedOffsetYIncrement),
      0,
      config.stackedOffsetY
    ]
  )

  const blur = isAbove ? config.stackedBlur * Math.min(stackPosition, 3) : 0

  const variants: Variants = {
    initial: {
      y: config.entranceY,
      opacity: config.entranceOpacity,
    },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: config.transitionDuration,
      },
    },
    exit: {
      y: config.stackedOffsetY,
      opacity: config.stackedOpacity,
      scale: config.stackedScale,
      transition: {
        duration: config.transitionDuration,
      },
    },
  }

  return (
    <motion.div
      ref={(el: HTMLDivElement | null) => {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = el
        setRef(index)(el)
      }}
      className="sticky top-0 flex min-h-screen items-center snap-start overflow-hidden"
      style={{
        zIndex: total - index,
        scale,
        y,
        filter: blur > 0 ? `blur(${blur}px)` : 'none',
        boxShadow: isActive ? config.activeShadow : config.stackedShadow,
        willChange: 'transform, opacity, filter',
        opacity: isActive ? undefined : opacity,
      }}
      variants={variants}
      initial="initial"
      animate={isActive ? 'animate' : undefined}
      role="region"
      aria-label={`Section ${index + 1} of ${total}`}
    >
      <div className="w-full bg-background">
        {children}
      </div>
    </motion.div>
  )
}
