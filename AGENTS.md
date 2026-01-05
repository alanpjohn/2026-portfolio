# AGENTS.md - Portfolio Website Development Guidelines

## Project Overview
Next.js 15.5.9 + React 19.1.4 + TypeScript 5.9.3 + Tailwind CSS 4.1.18
- Static home page + ISR for blog/work pages (1-day revalidation)
- Velite content engine with markdown (blog) and single YAML (work projects)
- Framer Motion animations with accessibility support (reduced motion)
- Deployment via Cloudflare Workers with OpenNext.js

## Commands

### Development
```bash
bun run dev              # Start dev server with Velite build
next dev --turbopack     # Dev server without Velite (if content built)
bun run velite           # Build content only (regenerates types)
```

### Build & Quality
```bash
bun run build            # Full production build (includes content)
bun run lint             # ESLint + Next.js rules (core-web-vitals + TypeScript)
bunx tsc --noEmit        # Type check only (strict mode enabled)
bun run velite && bun run lint && bunx tsc --noEmit && bun run build  # Full check
```

### Deployment
```bash
bun run deploy           # Deploy to Cloudflare Workers
bun run preview          # Preview deployment locally
bun run upload           # Upload assets only
bun run cf-typegen       # Generate Cloudflare environment types
```

### Testing
No test framework configured yet. Future plans: Jest/Vitest for unit tests, Playwright for E2E.
```bash
# Planned commands (when implemented):
# npm run test              # Run all tests
# npm run test:unit         # Run unit tests only
# npm run test:e2e          # Run E2E tests
# npm run test -- <file>    # Run tests for specific file
```

## Code Style Guidelines

### TypeScript & Types
- Use strict types everywhere, no `any` (use `unknown` with type guards)
- Import types with `import type` syntax for tree-shaking
- Leverage Velite-generated types from `.velite/index.d.ts`
- Define interfaces for all data structures and component props
- Use discriminated unions for complex state management

```typescript
// ✅ Good
export interface BlogPost {
  title: string
  slug: string
  content: string
  date: Date
  tags: string[]
}

export type AnimationState = 'idle' | 'animating' | 'complete'

function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blog.find(post => post.slug === slug)
}

// ❌ Bad
function processPost(post: any) { /* ... */ }
```

### Import Organization
1. React imports (alphabetical)
2. External libraries (alphabetical)
3. Internal imports (alphabetical, grouped by depth)
4. Type imports (with `import type`)

```typescript
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { unified } from 'unified'

import { Container } from '@/components/layout/Container'
import { formatDate } from '@/lib/utils/helpers'
import { siteConfig } from '@/data/config'

import type { BlogPost } from '@/types/blog'
import type { Variants } from 'framer-motion'
```

### Naming Conventions
- Components: PascalCase (`BlogCard.tsx`, `StackedSections.tsx`)
- Utilities/functions: camelCase (`contentAPI.ts`, `getBlogPosts`, `formatDate`)
- Page routes: kebab-case (`src/app/blog/[slug]/page.tsx`)
- Types/interfaces: PascalCase (`BlogPost`, `AnimationConfig`)
- Constants: UPPER_SNAKE_CASE (`SITE_CONFIG`, `DEFAULT_ANIMATION_CONFIG`)
- Content IDs: kebab-case (`"ecommerce-platform"`)
- Content keys: camelCase (`techStack`, `liveUrl`)
- Hooks: camelCase with `use` prefix (`useActiveSection`, `useTheme`)
- Custom hooks: camelCase (`useScrollTransform`)

### Component Patterns
- Use `'use client'` directive sparingly; prefer server components
- Hydration-safe theme components (check mounted state)
- Extract animation variants to separate config files
- Use semantic HTML and ARIA attributes for accessibility

```typescript
'use client'
import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  if (!mounted) return <div className="w-5 h-5" />

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </motion.button>
  )
}
```

### Animation Guidelines
- Use Framer Motion for all animations with `useReducedMotion` support
- Separate animation config from components (`animation-config.ts`)
- Prefer `will-change` CSS hints for performance-critical animations
- Use `AnimatePresence` for enter/exit animations
- Test animations with reduced motion enabled

```typescript
// animation-config.ts
export const defaultAnimationConfig = {
  initial: { opacity: 0, y: 100 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -100 },
  transition: { duration: 0.6, ease: 'easeOut' }
}
```

### Error Handling
- Return `undefined` for not-found items (not `null`)
- Use try-catch for external operations with meaningful error messages
- Handle loading states appropriately in async operations
- Log errors with context but never expose sensitive information

```typescript
export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blog.find(post => post.slug === slug)
}

export async function processContent(content: string): Promise<string> {
  try {
    const result = await markdownProcessor.process(content)
    return String(result)
  } catch (error) {
    console.error('Failed to process markdown:', error)
    throw new Error('Content processing failed')
  }
}
```

### Performance Best Practices
- Use Next.js Image component for optimized images
- Implement proper code splitting for large components
- Use CSS-in-JS sparingly; prefer Tailwind utilities
- Memoize expensive calculations with `useMemo`
- Avoid unnecessary re-renders with proper dependency arrays

### Security Guidelines
- Never commit secrets or API keys
- Use environment variables for sensitive configuration
- Validate and sanitize all user inputs
- Implement proper CORS policies for API routes
- Use HTTPS-only cookies for authentication

### Accessibility (A11y)
- Use semantic HTML elements (`<main>`, `<section>`, `<article>`)
- Provide meaningful ARIA labels and descriptions
- Ensure keyboard navigation works for all interactive elements
- Test with screen readers and keyboard-only navigation
- Maintain sufficient color contrast ratios

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

```javascript
// Code blocks with syntax highlighting
function example() {
  return 'Hello World'
}
```

Highlight specific lines: ```javascript {1,3-5}
```

**Work Projects (YAML - single file):**
```yaml
projects:
  - id: "project-id"
    title: "Project Title"
    description: "Project description"
    tags: ["Tech1", "Tech2"]
    featured: true
    url: "https://example.com"
    image: "/images/project.jpg"
    date: 2024-01-15
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
│   ├── ui/          # UI primitives
│   └── home/        # Page-specific components
├── hooks/           # Custom React hooks
├── lib/             # Business logic
│   ├── api/         # API utilities
│   ├── content/     # Content processing
│   └── utils/       # Helper functions
├── types/           # TypeScript definitions
└── data/            # Static configuration
```

## Git Workflow
- Use conventional commit format (`feat:`, `fix:`, `docs:`, `refactor:`)
- Run `bun run velite && bun run lint && bunx tsc --noEmit && bun run build` before committing
- Keep content and code changes separate
- Use descriptive commit messages focusing on "why" not "what"

## Content Management
- Add blog posts: Create `.md` in `content/blog/`, run `bun run velite`
- Add work projects: Edit `content/work.yaml`, run `bun run velite`
- Velite regenerates types automatically on build
- Content is processed at build time for optimal performance

---
Last Updated: January 5, 2026</content>
<parameter name="filePath">/home/alan/Documents/webd/2026-portfolio/AGENTS.md