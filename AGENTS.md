# AGENTS.md - Portfolio Website Development Guidelines

## Project Overview
Next.js 15.5.9 + React 19.1.4 + TypeScript 5.9.3 + Tailwind CSS 4.1.18
- Static home page + ISR for blog/work pages (1-day revalidation)
- Velite content engine with markdown (blog) and single YAML (work projects)
- Deployment via Cloudflare Workers with OpenNext.js

## Commands

### Development
```bash
bun run dev              # Start dev server with Velite build
next dev --turbopack     # Dev server without Velite (if content built)
bun run velite           # Build content only
```

### Build & Quality
```bash
bun run build            # Full production build (includes content)
bun run lint             # ESLint + Next.js rules
bunx tsc --noEmit        # Type check only
bun run velite && bun run lint && bunx tsc --noEmit && bun run build  # Full check
```

### Deployment
```bash
bun run deploy           # Deploy to Cloudflare Workers
bun run preview          # Preview deployment
bun run upload           # Upload assets only
```

### Testing
No test framework configured yet. Future plans: Jest/Vitest for unit tests, Playwright for E2E.

## Code Style Guidelines

### TypeScript & Types
- Use strict types everywhere, no `any` (use `unknown` with type guards)
- Import types with `import type` syntax
- Leverage Velite-generated types from `.velite/index.d.ts`
- Define interfaces for all data structures

```typescript
// ✅ Good
export interface BlogPost { title: string; slug: string; content: string }
function getBlogPostBySlug(slug: string): BlogPost | undefined { /* ... */ }

// ❌ Bad
function processPost(post: any) { /* ... */ }
```

### Import Organization
1. React imports
2. External libraries (alphabetical)
3. Internal imports (alphabetical)
4. Type imports (with `import type`)

```typescript
import { useState } from 'react'
import { unified } from 'unified'
import { contentAPI } from '@/lib/api/content'
import { formatDate } from '@/lib/utils/helpers'
import type { BlogPost } from '@/types/blog'
```

### Naming Conventions
- Components: PascalCase (`BlogCard.tsx`)
- Utilities/functions: camelCase (`contentAPI.ts`, `getBlogPosts`)
- Page routes: kebab-case (`src/app/blog/[slug]/page.tsx`)
- Types/interfaces: PascalCase (`BlogPost`)
- Constants: UPPER_SNAKE_CASE (`SITE_CONFIG`)
- Content IDs: kebab-case (`"ecommerce-platform"`)
- Content keys: camelCase (`techStack`)

### Error Handling
- Return `undefined` for not-found items (not `null`)
- Use try-catch for external operations with meaningful error messages

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

### Component Patterns
- Use `'use client'` directive sparingly; prefer server components
- Hydration-safe theme components (check mounted state before rendering)

```typescript
'use client'
import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="w-5 h-5" />
  return <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
    {theme === 'dark' ? '☀️' : '🌙'}
  </button>
}
```

### Content Structure
**Blog Posts (Markdown):**
```markdown
---
title: "Article Title"
date: 2024-01-15
category: "development"
tags: ["nextjs", "react"]
excerpt: "Brief description..."
readingTime: 8
---

# Article content here
```

**Work Projects (YAML - single file):**
```yaml
projects:
  - id: "project-id"
    title: "Project Title"
    description: "Project description"
    techStack: ["Tech1", "Tech2"]
    featured: true
    liveUrl: "https://example.com"
    githubUrl: "https://github.com/user/repo"
    image: "/images/project.jpg"
    date: 2024-01-15
```

### File Organization
```
content/              # Root level
├── blog/            # Markdown posts
├── work.yaml        # Single work projects file
└── config.yaml      # Site configuration

src/
├── app/             # Next.js app router
├── components/      # Reusable components (layout/, ui/, blog/)
├── lib/             # Business logic (api/, content/, theme/, utils/)
├── types/           # TypeScript definitions
└── data/            # Static configuration
```

### Git Workflow
- Use conventional commit format
- Run `bun run velite && bun run lint && bunx tsc --noEmit && bun run build` before committing
- Keep content and code changes separate

### Content Management
- Add blog posts: Create `.md` in `content/blog/`, run `bun run velite`
- Add work projects: Edit `content/work.yaml`, run `bun run velite`
- Velite regenerates types automatically on build

---
Last Updated: January 4, 2026
