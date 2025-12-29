import { defineConfig, s } from 'velite'

export default defineConfig({
  collections: {
    blog: {
      name: 'BlogPost',
      pattern: 'blog/*.md',
      schema: s.object({
        title: s.string().max(200),
        date: s.string().transform((date) => new Date(date)),
        category: s.string(),
        tags: s.array(s.string()).max(10),
        excerpt: s.string().max(300),
        readingTime: s.number().min(1),
        slug: s.path().transform(path => path.replace(/^blog\//, '').replace(/\.md$/, '')),
        content: s.markdown()
      })
    },
    work: {
      name: 'WorkProject',
      pattern: 'work.yaml',
      schema: s.object({
        projects: s.array(s.object({
          id: s.string(),
          title: s.string(),
          description: s.string(),
          techStack: s.array(s.string()),
          featured: s.boolean(),
          liveUrl: s.string().optional(),
          githubUrl: s.string().optional(),
          image: s.string().optional(),
          date: s.string().transform((date) => new Date(date))
        }))
      })
    }
  }
})