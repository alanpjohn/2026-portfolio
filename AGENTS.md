# AGENTS.md - Portfolio Website Development Guidelines

This document provides comprehensive guidelines for agentic coding assistants working on this Next.js portfolio website project.

## 📋 Project Overview

**Tech Stack:**
- Next.js 15.5.9 (App Router)
- React 19.1.4
- TypeScript 5.9.3
- Tailwind CSS 4.1.18
- Velite (content engine)
- Cloudflare Workers (deployment)
- next-themes (dark mode)

**Architecture:**
- Static home page + ISR for blog/work pages
- Content-driven with markdown (blog) and YAML (work)
- Single source of truth for work projects in `content/work.yaml`

## 🚀 Build, Lint, and Test Commands

### Development
```bash
# Start development server (includes Velite build)
bun run dev

# Start development server without Velite (if content already built)
next dev --turbopack

# Build content only
bun run velite
```

### Production Build
```bash
# Full production build (includes content generation)
bun run build

# Build without content regeneration (if content already built)
next build
```

### Quality Checks
```bash
# Lint code (ESLint + Next.js rules)
bun run lint

# Type check only
bunx tsc --noEmit

# Full pre-commit check
bun run velite && bun run lint && bunx tsc --noEmit && bun run build
```

### Deployment
```bash
# Cloudflare Workers deployment
bun run deploy

# Preview deployment
bun run preview

# Upload assets only
bun run upload
```

## 📝 Code Style Guidelines

### TypeScript & Type Safety

**✅ DO:**
- Use strict TypeScript types everywhere
- Define interfaces for all data structures
- Use `unknown` instead of `any` for type assertions
- Leverage Velite-generated types from `.velite/index.d.ts`
- Import types with `import type` syntax

**❌ AVOID:**
- `any` types (use `unknown` and proper type guards)
- Implicit `any` parameters (always type function parameters)
- Type assertions without proper validation

```typescript
// ✅ Good
export interface BlogPost {
  title: string
  date: Date
  category: string
  tags: string[]
  slug: string
  content: string
}

// ✅ Good - Type guard
function isBlogPost(value: unknown): value is BlogPost {
  return (
    typeof value === 'object' &&
    value !== null &&
    'title' in value &&
    typeof (value as any).title === 'string'
  )
}

// ❌ Bad
function processPost(post: any) { /* ... */ }
```

### Import Organization

**Import Order:**
1. React imports
2. External library imports (alphabetical)
3. Internal imports (alphabetical)
4. Type imports (with `import type`)

```typescript
// ✅ Good
import { useState, useEffect } from 'react'
import { unified } from 'unified'
import { remarkParse } from 'remark-parse'
import { contentAPI } from '@/lib/api/content'
import { formatDate } from '@/lib/utils/helpers'
import type { BlogPost } from '@/types/blog'
import type { WorkProject } from '@/types/work'
```

### Naming Conventions

**Files & Components:**
- PascalCase for React components: `BlogCard.tsx`
- camelCase for utilities: `contentAPI.ts`
- kebab-case for page routes: `src/app/blog/[slug]/page.tsx`

**Variables & Functions:**
- camelCase for variables/functions: `getBlogPosts`
- PascalCase for types/interfaces: `BlogPost`
- UPPER_SNAKE_CASE for constants: `SITE_CONFIG`

**Content & Data:**
- kebab-case for IDs: `"ecommerce-platform"`
- camelCase for object keys: `techStack`
- kebab-case for file names: `getting-started-nextjs.md`

### Error Handling

**API Functions:**
- Return `undefined` for not-found items (not `null`)
- Use try-catch for external operations
- Provide meaningful error messages

```typescript
// ✅ Good
export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blog.find(post => post.slug === slug)
}

// ✅ Good - Error handling
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

**Work Projects (YAML - Single File):**
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

### Component Patterns

**Client Components:**
- Use `'use client'` directive sparingly
- Prefer server components when possible
- Hydration-safe theme components

```typescript
// ✅ Good - Client component with hydration safety
'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  if (!mounted) return <div className="w-5 h-5" /> // Placeholder

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
```

### Content APIs

**Structure:**
- Use interfaces for API contracts
- Implement with Velite for current content
- Design for future CMS integration

```typescript
// ✅ Good - API interface pattern
export interface ContentAPI {
  getBlogPosts(): BlogPost[]
  getBlogPostBySlug(slug: string): BlogPost | undefined
  getWorkProjects(): WorkProject[]
  getFeaturedWorkProjects(): WorkProject[]
}

export class VeliteContentAPI implements ContentAPI {
  getBlogPosts(): BlogPost[] {
    return (blog as BlogPost[]).sort(/* ... */)
  }
  // ... implementation
}
```

### File Organization

**Source Structure:**
```
src/
├── app/                    # Next.js app router
│   ├── (pages)/           # Route groups
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── layout/           # Layout components
│   ├── ui/               # UI primitives
│   └── blog/             # Feature components
├── lib/                   # Business logic
│   ├── api/              # Content APIs
│   ├── content/          # Content processing
│   ├── theme/            # Theme system
│   └── utils/            # Utilities
├── types/                 # TypeScript definitions
└── data/                  # Static configuration
```

**Content Structure:**
```
content/                   # Root level content
├── blog/                  # Markdown posts
├── work.yaml             # Single work projects file
└── config.yaml           # Site configuration
```

### Performance Considerations

**ISR Configuration:**
- 1-day revalidation for all dynamic content
- Static generation for home page
- Content-based pagination (10 posts per page)

**Image Optimization:**
- Use Next.js Image component
- Implement blur placeholders (future feature)
- Optimize image formats and sizes

### Deployment & Environment

**Cloudflare Workers:**
- Use OpenNext.js for deployment
- Configure static asset caching
- Environment variables via `.dev.vars`

**Build Process:**
- Velite runs before Next.js build
- Content validation at build time
- Type checking before deployment

### Testing Strategy

**Current State:** No test framework configured yet

**Future Testing:**
- Unit tests for utilities and APIs
- Component tests for React components
- E2E tests for critical user flows
- Content validation tests

### Git Workflow

**Commits:**
- Use conventional commit format
- Run full pre-commit checks
- Keep content and code changes separate

**Branches:**
- `main` - Production deployments
- `develop` - Development integration
- Feature branches for new functionality

### Content Management

**Adding Blog Posts:**
1. Create `.md` file in `content/blog/`
2. Follow frontmatter schema
3. Run `bun run velite` to regenerate types

**Adding Work Projects:**
1. Edit `content/work.yaml` (single file)
2. Add new project object
3. Run `bun run velite` to regenerate types

### Future Considerations

**Scalability:**
- Single YAML file for work projects (good for small portfolio)
- Velite handles content efficiently
- ISR provides good performance/cost balance

**CMS Integration:**
- API interfaces designed for future CMS
- Content types abstracted from implementation
- Easy to swap Velite for headless CMS

## 🎯 Current Development Plan & Status

### **Project Status: Phase 4 Complete (Page Implementation)**

#### **✅ Completed Phases**

**Phase 1: Foundation Setup (COMPLETE)**
- ✅ Install required dependencies (next-themes, velite, rehype-highlight, etc.)
- ✅ Create content directory structure at root
- ✅ Configure Velite.js for content parsing
- ✅ Create base TypeScript interfaces
- ✅ Set up build scripts with Velite integration

**Phase 2: Content Engine & APIs (COMPLETE)**
- ✅ Implement dark theme system with next-themes
- ✅ Build content APIs for blog and work (single YAML file)
- ✅ Create blog pagination config (10 posts per page)
- ✅ Set up Velite configuration for markdown/YAML parsing
- ✅ Generate sample content (3 blog posts + 4 work projects)
- ✅ Create rehype configuration for markdown processing

**Phase 3: Layout & UI Components (COMPLETE)**
- ✅ Build reusable layout components (Header, Footer, Container, Section)
- ✅ Create custom Image component with loading state
- ✅ Set up Tailwind CSS styling structure with CSS variables
- ✅ Implement navigation and theme toggle integration

**Phase 4: Page Implementation (COMPLETE)**
- ✅ Static home page with Hero, About, Latest, and Contact sections
- ✅ ISR blog list with pagination and revalidation
- ✅ ISR blog article pages with syntax highlighting and async params
- ✅ ISR work showcase page with project cards and tech stack display

#### **🚧 Current Checkpoint**
- **Build Status**: ✅ Production build successful (Next.js 15.5.9)
- **Lint Status**: ✅ Zero ESLint errors or warnings
- **Type Safety**: ✅ Fully type-safe with async PageProps and searchParams
- **ISR**: ✅ Working with 1-day revalidation for all content pages

#### **📋 Upcoming Phases**

**Phase 5: Advanced Features (NEXT)**
- Client-side blog filtering (placeholder implementation)
- GitHub theme for code highlighting
- Contact section with mailto and social links
- Performance optimizations and responsive design

**Phase 6: Polish & Styling**
- Advanced styling with Tailwind CSS
- Animations and transitions
- SEO optimizations
- Image assets and final UI refinements

#### **🎨 Design & Styling Notes**
- **Minimal Styling**: Focus on structure first, advanced styling in later phases
- **Tech Stack Pills**: Use simple text-based tech stack display (no icons yet)
- **Dark Theme**: GitHub theme for code blocks, system preference support
- **Social Links**: Placeholder links for GitHub and LinkedIn (will be replaced with icons later)

#### **📊 Content Configuration**
```yaml
# content/config.yaml
pagination:
  postsPerPage: 10  # Configurable pagination
isr:
  revalidateTime: 86400  # 1-day revalidation for all content
```

#### **🏗️ Architecture Priorities**
1. **Content-First**: Velite-powered content management with CMS-ready APIs
2. **Performance**: ISR with strategic revalidation, static home page
3. **Type Safety**: Strict TypeScript with auto-generated content types
4. **Scalability**: Single YAML for work projects, extensible blog system

#### **🔧 Current File Structure**
```
content/ (root level)
├── blog/ (3 sample posts)
├── work.yaml (4 projects, single file)
└── config.yaml (site settings)

src/
├── app/ (Home, Blog, Work pages ✅)
├── components/ (Layout & UI components ✅)
├── lib/api/ (content APIs ✅)
├── lib/theme/ (dark theme ✅)
├── lib/content/ (rehype config ✅)
├── lib/utils/ (helpers ✅)
├── types/ (TypeScript interfaces ✅)
└── data/ (site config ✅)
```

---

**Last Updated:** December 29, 2025
**Next.js Version:** 15.5.9
**React Version:** 19.1.4
**Current Phase:** Checkpoint after Phase 4