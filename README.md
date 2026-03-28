# Portfolio

> Built by Opencode

A modern, purely static portfolio website built with Next.js 16 and deployed on Cloudflare Pages. This is a follow-up to my old [next-notion-portfolio](https://github.com/alanpjohn/next-notion-portfolio), now with a more optimized architecture and better performance. I tried setting up with opennext and cloudflare workers first but realised I dont need it.

## Deployment Choice

**Cloudflare Pages over Vercel**: This portfolio is deployed on Cloudflare Pages for better global CDN performance, built-in analytics, and cost efficiency. The static export approach ensures fast loading times worldwide.

## Content Architecture

**Static Generation over ISR**: 
- Content is built at compile time using Velite, processing Markdown (blog) and YAML (work items) into optimized static assets
- ISR (Incremental Static Regeneration) was not chosen due to the low frequency of portfolio updates
- Static generation provides better performance and simpler hosting.

**Content Management**:
- Content is managed externally via the `CONTENT_DIR` environment variable
- Set `CONTENT_DIR` in `.env.local` to point to your content directory (see `.env.example`)
- Supports both relative paths (e.g., `./content`, `../my-content`) and absolute paths
- Use `content-example/` as a reference for the required directory structure
- Content directory must contain:
  - `blog/` subdirectory with Markdown (.md) posts
  - `work.yaml` file with work items and projects

## Environment Setup

### Content Directory (CONTENT_DIR)

The `CONTENT_DIR` environment variable is **required** and must point to your content directory.

#### Quick Start

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and set your content path:
   ```bash
   CONTENT_DIR=./content
   ```

3. Verify your content directory has the required structure:
   ```
   content/
   ├── blog/          # Markdown blog posts
   └── work.yaml      # Work items and projects
   ```

#### Path Formats

**Relative paths** (resolved from project root):
```bash
CONTENT_DIR=./content           # Subdirectory
CONTENT_DIR=../my-content       # Parent directory
```

**Absolute paths**:
```bash
CONTENT_DIR=/home/user/my-portfolio/content
CONTENT_DIR=/mnt/external/portfolio-content
```

#### Troubleshooting

If you see the error "CONTENT_DIR environment variable is not set":
- Ensure you've created a `.env` file from `.env.example`
- Check that CONTENT_DIR points to an existing directory
- Verify the directory contains `blog/` and `work.yaml`

See `content-example/` for a complete reference structure.

## Key Features

- **Modern Stack**: Next.js 16.1.4 + React 19.2.3 + TypeScript 5.9.3 + Tailwind CSS 4.1.18
- **Content Engine**: Velite for processing Markdown and YAML content with type safety
- **Image Optimization**: For non blog pages, Sharp-based build-time optimization generating WebP/AVIF/JPEG variants with blur placeholders. For blog content pages, a client side optimiser to lazy load images without using Next/Image due to lack of react hydration of blog content generated pages.
- **OG Images**: Automatic social media image generation using Satori + Resvg
- **Animations**: Framer Motion with accessibility support (reduced motion)
- **Static Export**: Optimized for Cloudflare Pages deployment
- **Type Safety**: Strict TypeScript with Velite-generated types

## Development

```bash
bun run dev              # Start development server
bun run build            # Production build with optimization
bun run lint             # ESLint + type checking
bun run optimize-images  # Image optimization pipeline
bun run velite           # Content processing and OG image generation
```

## Project Structure

- `src/` - React components and pages
- `content-example/` - Reference structure for external content management
- `scripts/` - Build automation (image optimization)
- `public/static/` - Generated optimized images and OG images

Content is external (referenced via `CONTENT_DIR` environment variable). The `content-example/` directory shows the expected structure with blog posts and work items.
