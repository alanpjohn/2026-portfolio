# AGENTS.md - Portfolio Website Development Guidelines

## Project Overview
Next.js 15.5.9 + React 19.1.4 + TypeScript 5.9.3 + Tailwind CSS 4.1.18
- Static home page + ISR for blog/work pages (1-day revalidation)
- Velite content engine with markdown (blog) and YAML (work items: projects + experiences)
- Framer Motion animations with accessibility support (reduced motion)
- Deployment via Cloudflare Workers with OpenNext.js
- Strict TypeScript with path mapping (`@/*`) and custom Velite-generated types

## Commands

### Development
```bash
bun run dev              # Start dev server with Velite build + Turbopack
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

## Code Style Guidelines

### TypeScript & Types
- Use strict types everywhere, no `any` (use `unknown` with type guards)
- Import types with `import type` syntax for tree-shaking
- Leverage Velite-generated types from `.velite/index.d.ts`
- Define interfaces for all data structures and component props
- Use discriminated unions for complex state management
- Use `ReactNode` for flexible children types, `JSX.Element` for strict component returns

### Import Organization
1. React imports (alphabetical, multi-line for readability)
2. External libraries (alphabetical)
3. Internal imports (alphabetical, grouped by depth)
4. Type imports (with `import type`, separate block)

### Naming Conventions
- Components: PascalCase (`WorkCard.tsx`, `StackedSections.tsx`)
- Files: PascalCase for components, camelCase for utilities
- Page routes: kebab-case (`src/app/blog/[slug]/page.tsx`)
- Types/interfaces: PascalCase (`WorkItem`, `AnimationConfig`)
- Constants: UPPER_SNAKE_CASE (`SITE_CONFIG`, `DEFAULT_ANIMATION_CONFIG`)
- Content IDs: kebab-case (`"senior-backend-engineer"`)
- Hooks: camelCase with `use` prefix (`useActiveSection`, `useTheme`)

### Component Patterns
- Use `'use client'` directive sparingly; prefer server components
- Hydration-safe theme components (check mounted state)
- Extract animation variants to separate config files
- Use semantic HTML and ARIA attributes for accessibility
- Prefer functional components with hooks over class components
- Use Next.js 15 App Router with server components by default
- Leverage ISR for dynamic content (1-day revalidation)

### Animation Guidelines
- Use Framer Motion for all animations with `useReducedMotion` support
- Separate animation config from components (`animation-config.ts`)
- Prefer `will-change` CSS hints for performance-critical animations
- Use `AnimatePresence` for enter/exit animations
- Test animations with reduced motion enabled

### Error Handling
- Return `undefined` for not-found items (not `null`)
- Use try-catch for external operations with meaningful error messages
- Handle loading states appropriately in async operations
- Log errors with context but never expose sensitive information
- Use proper error boundaries for React components

### Performance & Security
- Use Next.js Image component (via CustomImage) for optimized images
- Implement proper code splitting for large components
- Memoize expensive calculations with `useMemo`
- Never commit secrets or API keys to version control
- Use environment variables for sensitive configuration

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

  - id: "ecommerce-platform"
    title: "E-commerce Platform"
    type: "project"
    description: "Full-stack e-commerce solution..."
    tags: ["Next.js", "TypeScript", "Prisma"]
    featured: true
    url: "https://example.com"
    image: "/images/project.jpg"
    date: "2024-01-15"
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
│   ├── home/        # Page-specific components
│   └── work/        # Work-related components
├── hooks/           # Custom React hooks
├── lib/             # Business logic
│   ├── api/         # API utilities
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
Last Updated: January 5, 2026

---
Last Updated: January 5, 2026</content>
<parameter name="filePath">/home/alan/Documents/webd/2026-portfolio/AGENTS.md