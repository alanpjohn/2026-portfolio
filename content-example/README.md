# Content Example

This directory contains a minimal example of the content structure used by this portfolio website.

## Purpose

Use this as a template to set up your own content directory. It demonstrates the required files and their formats.

## Quick Setup

To use this as your content directory:

1. Copy or rename `content-example/` to `content/`:
   ```bash
   cp -r content-example content
   ```

2. Configure your environment (if not already done):
   - Copy `.env.example` to `.env.local`
   - Set `CONTENT_DIR=./content` in `.env.local`

3. Start the development server and add your own content!

## Required Structure

```
content/
├── blog/           # Markdown blog posts
│   └── *.md        # Individual post files
├── work.yaml       # Work/projects/experiences
└── config.yaml     # Site configuration (optional)
```

## Schemas

### Blog Posts (`blog/*.md`)

Blog posts use Markdown with YAML frontmatter:

```yaml
---
title: "Post Title"
date: 2024-01-01
excerpt: "Brief description for previews"
publish: true
tags: ["tag1", "tag2"]
---

# Markdown content here
```

| Field     | Type       | Required | Description                          |
| --------- | ---------- | -------- | ------------------------------------ |
| `title`   | `string`   | Yes      | The post title                       |
| `date`    | `date`     | Yes      | Publication date (YYYY-MM-DD)        |
| `excerpt` | `string`   | Yes      | Short description for previews       |
| `publish` | `boolean`  | Yes      | Whether to show the post             |
| `tags`    | `string[]` | No       | Array of tag strings                 |

### Work Items (`work.yaml`)

Work items are defined in a single YAML file with two types:

```yaml
items:
  - id: "unique-id"
    title: "Item Title"
    type: "project" | "experience"
    description: "Description text"
    tags: ["tag1", "tag2"]
    featured: true
    date: "2024-01-01"
    # Project-specific fields:
    url: "https://example.com"
    # Experience-specific fields:
    company: "Company Name"
    role: "Job Title"
    endDate: "2024-12-31"  # Optional, omit for "present"
```

| Field         | Type       | Required | Description                              |
| ------------- | ---------- | -------- | ---------------------------------------- |
| `id`          | `string`   | Yes      | Unique kebab-case identifier              |
| `title`       | `string`   | Yes      | Display title                            |
| `type`        | `string`   | Yes      | Either `"project"` or `"experience"`     |
| `description` | `string`   | Yes      | Brief description                        |
| `tags`        | `string[]` | No       | Array of related technologies/skills     |
| `featured`    | `boolean`  | No       | Show in featured section (default: true) |
| `date`        | `string`   | Yes      | Start date (YYYY-MM-DD)                  |
| `url`         | `string`   | No       | Project URL (projects only)              |
| `company`     | `string`   | No       | Company name (experiences only)          |
| `role`        | `string`   | No       | Job role (experiences only)              |
| `endDate`     | `string`   | No       | End date, omit for current position      |

## Environment Configuration

For local development, ensure your `.env.local` file has the correct `CONTENT_DIR` path. See `.env.example` for reference:

```bash
# Point to your content directory
CONTENT_DIR=./content
```

## Next Steps

1. Replace sample content with your own
2. Run `bun run velite` to regenerate types and process content
3. Run `bun run lint && bunx tsc --noEmit` to verify everything
4. Run `bun run build` to create the production build
