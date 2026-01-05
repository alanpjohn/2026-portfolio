import type { ElementType, ReactNode } from 'react'
import { cn } from '@/lib/utils/helpers'

interface SectionProps {
  children: ReactNode
  className?: string
  id?: string
  as?: ElementType
  fullHeight?: boolean
}

export function Section({
  children,
  className,
  id,
  as: Component = 'section',
  fullHeight = false,
}: SectionProps) {
  return (
    <Component
      id={id}
      className={cn(
        'py-12 md:py-24 lg:py-32',
        'bg-background',
        fullHeight && 'min-h-screen flex items-center',
        className,
      )}
    >
      {children}
    </Component>
  )
}
