# AGENTS.md - Portfolio Website Development Guidelines

## Project Overview
Next.js 16.1.4 + React 19.2.3 + TypeScript 5.9.3 + Tailwind CSS 4.1.18
- Static export with Cloudflare Pages deployment
- Velite content engine with markdown (blog) and YAML (work items)
- Sharp-based build-time image optimization (WebP/AVIF/JPEG variants)
- CustomImage component with blur placeholders and loading states
- Automatic OG image generation using Satori + Resvg (1200x630 PNGs)
- Framer Motion animations with accessibility support (reduced motion)
- Strict TypeScript with path mapping (`@/*`) and Velite-generated types
- No testing framework - focus on manual testing and type safety

## Commands

### Development
```bash
bun run dev              # Start dev server with Velite build + Turbopack
next dev --turbopack     # Dev server without Velite (if content built)
bun run velite           # Build content only (regenerates types and OG images)
bun run optimize-images  # Optimize images with Sharp (generates variants + blur data)
```

### Build & Quality
```bash
bun run build            # Full production build (optimize images + content + OG images)
bun run lint             # ESLint + Next.js rules (core-web-vitals + TypeScript)
bunx tsc --noEmit        # Type check only (strict mode enabled)
bun run velite && bun run lint && bunx tsc --noEmit && bun run build  # Full check
```

### Testing
```bash
# No automated testing framework configured
# Focus on manual testing and TypeScript type safety

# Manual testing approaches:
# - Browser testing of UI components and interactions
# - TypeScript compilation for type errors (`bunx tsc --noEmit`)
# - Velite content processing validation (`bun run velite`)
# - Image optimization validation (`bun run optimize-images`)
# - Build process verification (`bun run build`)
# - Content sync operations testing (`bun run content:*`)
# - Cross-browser compatibility testing
# - Mobile responsiveness testing
# - Accessibility testing with screen readers
# - Animation testing with reduced motion enabled
# - Image loading testing (blur placeholders, format fallbacks)

# Note: There are no commands for running individual tests
# as no testing framework is configured. Use the commands above
# for manual validation of different aspects of the application.
```

### Content Sync
```bash
bun run content:backup    # Upload all local content to R2
bun run content:restore   # Download missing files from R2
bun run content:ensure    # Check and restore missing content
bun run content:full      # Restore then backup (development sync)
```

### Deployment
```bash
bun run deploy:pages      # Deploy to Cloudflare Pages (includes optimization)
```

## Code Style Guidelines

### TypeScript & Types
- Use strict types everywhere, no `any` (use `unknown` with type guards)
- Import types with `import type` syntax for tree-shaking
- Leverage Velite-generated types from `velite-content`
- Define interfaces for all data structures and component props
- Use discriminated unions for complex state management
- Use `ReactNode` for flexible children types, `JSX.Element` for strict component returns
- Prefer `interface` over `type` for object shapes
- Use const assertions for literal types (`as const`)

### Import Organization
1. React imports (alphabetical, multi-line for readability)
2. External libraries (alphabetical, one per line)
3. Internal imports with `@/` prefix (alphabetical, grouped by feature)
4. Type imports (with `import type`, separate block at end)
5. Relative imports only when necessary (prefer `@/` path mapping)

### Formatting & Style
- Use single quotes for strings (ESLint enforced)
- Use 2 spaces for indentation (Prettier default)
- Max line length: 100 characters (ESLint enforced)
- Trailing commas: always (ESLint enforced)
- Semicolons: always required
- Use arrow functions for callbacks and anonymous functions
- Prefer object destructuring and spread operators

### Naming Conventions
- Components: PascalCase (`WorkCard.tsx`, `StackedSections.tsx`)
- Files: PascalCase for components, camelCase for utilities
- Page routes: kebab-case (`src/app/blog/[slug]/page.tsx`)
- Types/interfaces: PascalCase (`WorkItem`, `AnimationConfig`)
- Constants: UPPER_SNAKE_CASE (`SITE_CONFIG`, `DEFAULT_ANIMATION_CONFIG`)
- Content IDs: kebab-case (`"senior-backend-engineer"`)
- Hooks: camelCase with `use` prefix (`useActiveSection`, `useTheme`)
- Animation configs: camelCase with `.animations.ts` suffix
- Utility functions: camelCase (`formatDate`, `slugify`)
- Cache files: lowercase with `.json` extension (`.cache/image-optimization.json`)

### Component Patterns
- Use `'use client'` directive sparingly; prefer server components
- Hydration-safe theme components (check mounted state)
- Extract animation variants to separate config files
- Use semantic HTML and ARIA attributes for accessibility
- Prefer functional components with hooks over class components
- Use Next.js 16 App Router with server components by default
- Leverage static export for optimal performance
- Theme defaults to dark mode with system preference support

### Image Optimization
- Use `CustomImage` component instead of Next.js Image (handles optimization, loading, remotes)
- Local images: Automatic WebP/AVIF/JPEG variants with blur placeholders
- Remote images: Custom loading div with gradient background
- Build-time optimization via `bun run optimize-images`
- Aspect ratios maintained via width/height props
- Blur data auto-generated as base64 URLs

### Animation Guidelines
- Use Framer Motion for all animations with `useReducedMotion` support
- Separate animation variants to separate config files (`*.animations.ts`)
- Prefer `will-change` CSS hints for performance-critical animations
- Use `AnimatePresence` for enter/exit animations
- Test animations with reduced motion enabled

### Next.js Patterns
- Use App Router with server components by default
- Add `'use client'` directive only when necessary (hooks, browser APIs, interactivity)
- Set `metadataBase` in root layout for proper social media URL resolution
- Static export with `output: "export"` for Pages deployment
- Use `CustomImage` for optimized images with proper sizing
- Implement proper loading states for dynamic content
- Use `next/link` for client-side navigation with prefetching
- Include Open Graph and Twitter metadata for social sharing

### Tailwind CSS Patterns
- Use design tokens from `tailwind.config.js` for consistency
- Prefer utility classes over custom CSS when possible
- Use responsive prefixes consistently (`sm:`, `md:`, `lg:`, `xl:`)
- Leverage Tailwind's dark mode support with `dark:` prefix
- Use arbitrary values sparingly (`[value]`) - prefer design tokens
- Group related utilities and use meaningful class combinations

### Error Handling
- Return `undefined` for not-found items (not `null`)
- Use try-catch for external operations with meaningful error messages
- Handle loading states appropriately in async operations
- Log errors with context but never expose sensitive information
- Use proper error boundaries for React components
- Cache operations gracefully handle failures

### Performance & Security
- Use CustomImage for optimized images (Sharp-generated variants)
- Implement proper code splitting for large components
- Memoize expensive calculations with `useMemo`
- Never commit secrets or API keys to version control
- Use environment variables for sensitive configuration
- Cache build artifacts to speed up development

### Accessibility (A11y)
- Use semantic HTML elements (`<main>`, `<section>`, `<article>`)
- Provide meaningful ARIA labels and descriptions
- Ensure keyboard navigation works for all interactive elements
- Maintain sufficient color contrast ratios (WCAG AA compliance)
- Support reduced motion preferences

## Content Structure

**Blog Posts (Markdown):**
```markdown
---
title: "Article Title"
date: 2024-01-15
tags: ["nextjs", "react"]
excerpt: "Brief description..."
---

# Article content here

```javascript {1,3-5}
// Code blocks with syntax highlighting
function example() {
  return 'Hello World'
}
```

**Work Items (YAML - single file):**
```yaml
items:
  - id: "senior-backend-engineer"
    title: "Senior Backend Engineer"
    type: "experience"
    description: "Leading backend architecture..."
    tags: ["Python", "FastAPI", "PostgreSQL"]
    featured: true
    company: "TechCorp AI"
    role: "Senior Backend Engineer"
    date: "2022-03-01"
```

## File Organization
```
content/              # Root level
├── blog/            # Markdown posts
├── work.yaml        # Single work projects file
└── config.yaml      # Site configuration

src/
├── app/             # Next.js app router (kebab-case routes)
├── components/      # Reusable components
│   ├── layout/      # Layout components (Container, Section)
│   ├── ui/          # UI primitives (CustomImage)
│   ├── home/        # Page-specific components
│   └── work/        # Work-related components
├── hooks/           # Custom React hooks
├── lib/             # Business logic
│   ├── api/         # API utilities
│   ├── seo/         # OG image generation + caching
│   └── utils/       # Helper functions
├── types/           # TypeScript definitions
└── data/            # Static configuration

scripts/             # Build scripts (optimize-images.ts)
.cache/              # Non-git cache files
public/
├── images/          # Source images
└── static/
    ├── images/optimized/  # Generated image variants
    └── og/                # Generated OG images
```

## Git Workflow
- Use conventional commit format (`feat:`, `fix:`, `docs:`, `refactor:`)
- Run `bun run optimize-images && bun run velite && bun run lint && bunx tsc --noEmit && bun run build` before committing
- Keep content and code changes separate
- Use descriptive commit messages focusing on "why" not "what"
- Sign commits with `-s` flag

## Content Management
- Add blog posts: Create `.md` in `content/blog/`, run `bun run velite`
- Add work projects: Edit `content/work.yaml`, run `bun run velite`
- Velite regenerates types and OG images automatically on build
- Content is processed at build time for optimal performance
- OG images are generated in `public/static/og/` (1200x630 PNG format)
- Images optimized via Sharp in `public/static/images/optimized/`

## Image Optimization
**Architecture:**
- Sharp processes `public/images/` at build time
- Generates WebP (80%), AVIF (lossless), JPEG (80%) at 320px, 640px, 768px, original widths
- Blur placeholders: 10px blurred base64 JPEG
- CustomImage uses `<picture>` for format negotiation, fallback to original
- Remote images (socialify.git.ci) use custom loading div

**File Location:** `scripts/optimize-images.ts`, `src/components/ui/Image.tsx`

## AI Assistant Guidelines

### Cursor Rules
No Cursor rules found in `.cursor/rules/` or `.cursorrules`

### Copilot Instructions
No Copilot instructions found in `.github/copilot-instructions.md`

### General AI Guidelines
- Follow TypeScript strict mode practices
- Use existing code patterns and conventions
- Prefer server components over client components
- Implement proper error handling and loading states
- Use semantic HTML and accessibility best practices
- Follow the established import organization and naming conventions
- Use CustomImage for all image components
- Run optimization scripts before builds
- Cache results to improve build performance

---
Last Updated: January 23, 2026</content>
<parameter name="filePath">AGENTS.md