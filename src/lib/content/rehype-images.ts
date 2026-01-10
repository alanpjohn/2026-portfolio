import { visit } from 'unist-util-visit'
import { getPlaiceholder } from 'plaiceholder'
import { promises as fs } from 'fs'
import * as path from 'path'
import { Element, Properties, Root } from 'hast'

// Configuration for remote image processing
const REMOTE_IMAGE_CONFIG = {
  maxSize: 5 * 1024 * 1024, // 5MB
  timeout: 10000, // 10 seconds
  retries: 3,
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
}

// Utility functions for image processing
function isValidUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url)
    return ['http:', 'https:'].includes(parsedUrl.protocol)
  } catch {
    return false
  }
}

async function fetchWithTimeout(url: string, timeout: number): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      redirect: 'follow'
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}

async function fetchRemoteImage(url: string, config = REMOTE_IMAGE_CONFIG): Promise<Buffer> {
  for (let attempt = 1; attempt <= config.retries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, config.timeout)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      // Validate content type
      const contentType = response.headers.get('content-type') || ''
      const isImageType = config.allowedTypes.some(type => contentType.includes(type))
      if (!isImageType) {
        throw new Error(`Invalid content type: ${contentType}`)
      }

      // Check content length if available
      const contentLength = response.headers.get('content-length')
      if (contentLength && parseInt(contentLength) > config.maxSize) {
        throw new Error(`Image too large: ${contentLength} bytes (max: ${config.maxSize})`)
      }

      const arrayBuffer = await response.arrayBuffer()

      // Final size check
      if (arrayBuffer.byteLength > config.maxSize) {
        throw new Error(`Image too large: ${arrayBuffer.byteLength} bytes (max: ${config.maxSize})`)
      }

      return Buffer.from(arrayBuffer)
    } catch (error) {
      const isLastAttempt = attempt === config.retries
      const errorMessage = `Attempt ${attempt}/${config.retries} failed: ${error instanceof Error ? error.message : String(error)}`

      if (isLastAttempt) {
        throw new Error(`Failed to fetch image after ${config.retries} attempts: ${errorMessage}`)
      }

      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, attempt - 1) * 1000
      console.warn(`Remote image fetch failed (${errorMessage}), retrying in ${delay}ms...`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw new Error('Unreachable code')
}

export function rehypeImageOptimization() {
  return async function transformer(tree: Root) {
    const imagePromises: Promise<void>[] = []

    visit(tree, 'element', (node: Element) => {
      if (node.tagName === 'img') {
        const src = node.properties?.src as string

        if (src) {
          const promise = (async () => {
            try {
              let buffer: Buffer

              if (src.startsWith('http')) {
                // Handle remote images with validation and retry logic
                if (!isValidUrl(src)) {
                  throw new Error(`Invalid URL format: ${src}`)
                }

                console.log(`Processing remote image: ${src}`)
                buffer = await fetchRemoteImage(src)
              } else {
                // Handle local images - check content/blog directory for blog images
                let imagePath: string

                if (src.startsWith('/static/')) {
                  // Velite transforms relative paths like ./devport.png to /static/devport-51d89c33.png
                  // Extract the base filename before the hash and look for it in content/blog/
                  const staticMatch = src.match(/\/static\/([^-]+)-[a-f0-9]+\.png$/)
                  if (staticMatch) {
                    const baseName = staticMatch[1]
                    imagePath = path.join(process.cwd(), 'content', 'blog', `${baseName}.png`)
                  } else {
                    // Fallback: try the full path after /static/
                    const filename = src.replace('/static/', '')
                    imagePath = path.join(process.cwd(), 'content', 'blog', filename)
                  }
                } else {
                  // Regular relative path
                  imagePath = path.join(process.cwd(), 'content', 'blog', src)
                }

                try {
                  await fs.access(imagePath)
                } catch {
                  throw new Error(`Local image not found: ${imagePath} (original src: ${src})`)
                }

                console.log(`Processing local image: ${imagePath}`)
                buffer = await fs.readFile(imagePath)
              }

              // Generate plaiceholder data
              const { base64, metadata } = await getPlaiceholder(buffer, { size: 10 })

              // Enhance img element with data attributes for progressive enhancement
              node.properties = {
                ...node.properties,
                'data-blur': base64,
                'data-width': metadata.width,
                'data-height': metadata.height,
                'loading': 'lazy',
                'decoding': 'async',
                'class': 'velite-image ' + (node.properties?.className || ''),
              } as Properties

              // Remove any existing children since img is self-closing
              node.children = []
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : String(error)
              console.warn(`Failed to process image ${src}: ${errorMessage}`)
              // Keep original img element if processing fails, but add error class for debugging
              node.properties = {
                ...node.properties,
                'class': 'velite-image-error ' + (node.properties?.className || ''),
                'data-error': errorMessage,
              } as Properties
            }
          })()

          imagePromises.push(promise)
        }
      }
    })

    // Wait for all images to be processed
    await Promise.all(imagePromises)
  }
}