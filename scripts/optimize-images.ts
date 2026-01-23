import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import sharp from 'sharp'

const INPUT_DIR = 'public/images'
const OUTPUT_DIR = 'public/static/images/optimized'
const BLUR_DATA_FILE = 'src/lib/blur-data.ts'
const CACHE_FILE = '.cache/image-optimization.json'

interface BlurData {
  [key: string]: string
}

interface CacheEntry {
  mtime: number
  hash: string
}

interface Cache {
  [filePath: string]: CacheEntry
}

const blurData: BlurData = {}

function loadCache(): Cache {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'))
    }
  } catch (error) {
    console.warn('Failed to load cache:', error)
  }
  return {}
}

function saveCache(cache: Cache) {
  try {
    fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true })
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2))
  } catch (error) {
    console.warn('Failed to save cache:', error)
  }
}

function getFileMtime(filePath: string): number {
  try {
    return fs.statSync(filePath).mtime.getTime()
  } catch {
    return 0
  }
}

function getFileHash(filePath: string): string {
  try {
    const content = fs.readFileSync(filePath)
    return crypto.createHash('md5').update(content).digest('hex')
  } catch {
    return ''
  }
}

async function optimizeImage(inputPath: string, slug: string) {
  const image = sharp(inputPath)
  const metadata = await image.metadata()
  const originalWidth = metadata.width || 800

  // Widths to generate: 320 (home), 640 (mobile), 768 (tablet), original
  const widths = [320, 640, 768, originalWidth].filter(w => w <= originalWidth)

  // Generate formats
  const formats = [
    { ext: 'webp', format: 'webp', options: { quality: 80 } },
    { ext: 'avif', format: 'avif', options: { lossless: true } },
    { ext: 'jpg', format: 'jpeg', options: { quality: 80 } }
  ]

  for (const width of widths) {
    for (const format of formats) {
      const outputPath = path.join(OUTPUT_DIR, `${slug}-${width}.${format.ext}`)
      let pipeline = image.resize(width, null, { withoutEnlargement: true })
      if (format.format === 'webp') {
        pipeline = pipeline.webp(format.options)
      } else if (format.format === 'avif') {
        pipeline = pipeline.avif(format.options)
      } else if (format.format === 'jpeg') {
        pipeline = pipeline.jpeg(format.options)
      }
      await pipeline.toFile(outputPath)
    }
  }

  // Generate blur placeholder
  const blurBuffer = await image
    .resize(10, 10, { withoutEnlargement: true })
    .blur(2)
    .jpeg({ quality: 70 })
    .toBuffer()

  blurData[slug] = `data:image/jpeg;base64,${blurBuffer.toString('base64')}`
}

async function main() {
  const cache = loadCache()
  const updatedCache: Cache = { ...cache }

  const files = fs.readdirSync(INPUT_DIR).filter(file =>
    /\.(jpg|jpeg|png|webp)$/i.test(file)
  )

  for (const file of files) {
    const inputPath = path.join(INPUT_DIR, file)
    const slug = path.parse(file).name
    const currentMtime = getFileMtime(inputPath)
    const cached = cache[inputPath]

    if (cached && cached.mtime === currentMtime) {
      console.log(`Skipping ${file} (mtime unchanged)`)
      continue
    }

    const currentHash = getFileHash(inputPath)
    if (cached && cached.hash === currentHash) {
      console.log(`Skipping ${file} (hash unchanged)`)
      continue
    }

    console.log(`Optimizing ${file}...`)
    await optimizeImage(inputPath, slug)

    updatedCache[inputPath] = { mtime: currentMtime, hash: currentHash }
  }

  // Write blur data as TypeScript
  const tsContent = `// Auto-generated blur data for optimized images
export const blurData: Record<string, string> = ${JSON.stringify(blurData, null, 2)};
`
  fs.writeFileSync(BLUR_DATA_FILE, tsContent)
  saveCache(updatedCache)
  console.log('Image optimization complete!')
}

main().catch(console.error)