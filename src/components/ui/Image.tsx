'use client'

import Image from 'next/image'
import { useState } from 'react'

interface CustomImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  blurDataURL?: string
}

export function CustomImage({
  src,
  alt,
  width = 800,
  height = 600,
  className = '',
  priority = false,
  blurDataURL
}: CustomImageProps) {
  const [isLoading, setIsLoading] = useState(!blurDataURL)
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-muted ${className}`}
        style={{ aspectRatio: `${width}/${height}` }}
      >
        <span className="text-muted-foreground">Image not available</span>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div
          className="absolute inset-0 animate-pulse bg-muted"
          style={{ aspectRatio: `${width}/${height}` }}
        />
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        placeholder={blurDataURL ? 'blur' : undefined}
        blurDataURL={blurDataURL}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={blurDataURL ? undefined : () => setIsLoading(false)}
        onError={() => {
          setIsLoading(false)
          setHasError(true)
        }}
      />
    </div>
  )
}