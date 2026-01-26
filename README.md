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
- Content is managed locally in the `content/` directory (not pushed to GitHub)
- Automatic backup to Cloudflare R2 storage via `bun run content:backup`
- Content sync commands ensure data safety and availability across development environments

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
- `scripts/` - Build automation (image optimization)
- `public/static/` - Generated optimized images and OG images

The portfolio functions as a static site with content processed at build time, ensuring optimal performance and reliability.
