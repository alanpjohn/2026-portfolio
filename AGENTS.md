# AGENTS.md - Portfolio Website Development Guidelines

## Project Overview
Next.js 15.5.9 + React 19.1.4 + TypeScript 5.9.3 + Tailwind CSS 4.1.18
- Static home page + ISR for blog/work pages (1-day revalidation)
- Velite content engine with markdown (blog) and YAML (work items: projects + experiences)
- Framer Motion animations with accessibility support (reduced motion)
- Deployment via Cloudflare Workers with OpenNext.js
- Strict TypeScript with path mapping (`@/*`) and custom Velite-generated types
- **No testing framework** - focus on manual testing and type safety

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

### Testing
```bash
# No automated testing framework configured
# Focus on manual testing and TypeScript type safety

# Manual testing approaches:
# - Browser testing of UI components and interactions
# - TypeScript compilation for type errors (`bunx tsc --noEmit`)
# - Velite content processing validation (`bun run velite`)
# - Build process verification (`bun run build`)
# - Content sync operations testing (`bun run content:*`)
# - Cross-browser compatibility testing
# - Mobile responsiveness testing
# - Accessibility testing with screen readers
# - Animation testing with reduced motion enabled

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
bun run deploy           # Deploy to Cloudflare Workers
bun run preview          # Preview deployment locally
bun run upload           # Upload assets only
bun run cf-typegen       # Generate Cloudflare environment types
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
- Separate animation variants to separate config files (`*.animations.ts`)
- Prefer `will-change` CSS hints for performance-critical animations
- Use `AnimatePresence` for enter/exit animations
- Test animations with reduced motion enabled

### Next.js Patterns
- Use App Router with server components by default
- Add `'use client'` directive only when necessary (hooks, browser APIs, interactivity)
- Leverage ISR for dynamic content with appropriate revalidation times
- Use `next/image` for optimized images with proper sizing
- Implement proper loading states for dynamic content
- Use `next/link` for client-side navigation with prefetching

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

## Content Sync Strategy

**Principle**: Local content directory is the source of truth. R2 serves as a backup/restore mechanism.

**Operations**:
- `content:backup`: Upload all local content to R2
- `content:restore`: Download missing files from R2
- `content:ensure`: Check and restore missing content
- `content:full`: Restore then backup (development sync)

**Guarantees**:
- Local content is never older than R2 (user-provided)
- No bidirectional sync - simple one-way backup
- No conflict resolution - local always wins
- Automatic restore when content directory is empty

**Usage**:
```bash
# Development backup
bun run content:backup

# Restore after fresh clone
bun run content:ensure
```

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

---
Last Updated: January 10, 2026</content>
<parameter name="filePath">/home/alan/Documents/webd/2026-portfolio/AGENTS.md