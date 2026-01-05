import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/helpers'

interface SectionContentProps {
  children: ReactNode
  className?: string
}

export function SectionContent({ children, className }: SectionContentProps) {
  return <div className={cn('w-full', className)}>{children}</div>
}
