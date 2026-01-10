import React from 'react'
import { cn } from '@/lib/utils/helpers'

export function Heading({
  level = 1,
  children,
  className,
}: {
  level?: 1 | 2 | 3 | 4 | 5 | 6
  children: React.ReactNode
  className?: string
}) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

  return (
    <Tag className={cn('font-heading tracking-tight', className)}>
      {children}
    </Tag>
  )
}

export function Text({
  children,
  className,
  muted = false,
}: {
  children: React.ReactNode
  className?: string
  muted?: boolean
}) {
  return (
    <p className={cn(
      muted && 'text-muted-foreground',
      className
    )}>
      {children}
    </p>
  )
}