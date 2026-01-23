'use client'

import { useState, useEffect } from 'react'
import { blurData } from '@/lib/blur-data'

interface CustomImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  blurDataURL?: string
}

function getSlugFromSrc(src: string): string {
  // For local images like /images/Alan.jpg -> Alan
  const match = src.match(/\/images\/([^.]+)\./)
  return match ? match[1] : ''
}

function getOptimizedSrc(slug: string, width: number, ext: string): string {
  return `/static/images/optimized/${slug}-${width}.${ext}`
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
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const isRemote = src.startsWith('http://') || src.startsWith('https://')

  // Force load detection and timeout safeguard
  useEffect(() => {
    // Force load detection with Image constructor
    if (!isRemote) {
      const img = new Image()
      img.onload = () => setIsLoading(false)
      img.onerror = () => {
        setIsLoading(false)
        setHasError(true)
      }
      img.src = src
    }

    // Timeout safeguard
    const timeout = setTimeout(() => setIsLoading(false), 10000)

    return () => clearTimeout(timeout)
  }, [src, isRemote])

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

  if (isRemote) {
    // Custom loading for remote images
    return (
      <div className={`relative overflow-hidden ${className}`}>
        {isLoading && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-muted/50"
            style={{ aspectRatio: `${width}/${height}` }}
          >
            <span className="text-muted-foreground font-medium">LOADING</span>
          </div>
        )}
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={() => setIsLoading(false)}
          onError={(error) => {
            console.error('[CustomImage] Image load error:', src, error)
            setIsLoading(false)
            setHasError(true)
          }}
        />
      </div>
    )
  }

  // Local optimized image
  const slug = getSlugFromSrc(src)
  const defaultBlur = blurDataURL || blurData[slug] || ''

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div
          className="absolute inset-0 bg-muted"
          style={{
            aspectRatio: `${width}/${height}`,
            backgroundImage: defaultBlur ? `url(${defaultBlur})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      )}
      <picture>
        <source
          srcSet={`${getOptimizedSrc(slug, 320, 'webp')} 320w, ${getOptimizedSrc(slug, 640, 'webp')} 640w, ${getOptimizedSrc(slug, 768, 'webp')} 768w, ${getOptimizedSrc(slug, width, 'webp')} ${width}w`}
          sizes="(max-width: 320px) 320px, (max-width: 640px) 640px, (max-width: 768px) 768px, 100vw"
          type="image/webp"
        />
        <source
          srcSet={`${getOptimizedSrc(slug, 320, 'avif')} 320w, ${getOptimizedSrc(slug, 640, 'avif')} 640w, ${getOptimizedSrc(slug, 768, 'avif')} 768w, ${getOptimizedSrc(slug, width, 'avif')} ${width}w`}
          sizes="(max-width: 320px) 320px, (max-width: 640px) 640px, (max-width: 768px) 768px, 100vw"
          type="image/avif"
        />
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          loading={priority ? 'eager' : 'lazy'}
          onLoad={() => setIsLoading(false)}
          onError={(error) => {
            console.log('[CustomImage] Image load error:', src, error)
            setIsLoading(false)
            setHasError(true)
          }}
        />
      </picture>
    </div>
  )
}