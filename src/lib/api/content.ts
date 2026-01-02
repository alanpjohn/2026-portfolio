import { blog, work } from 'velite-content'
import type { BlogPost } from '@/types/blog'
import type { WorkProject } from '@/types/work'

// Content interfaces for future CMS integration
export interface ContentAPI {
  getBlogPosts(): BlogPost[]
  getBlogPostBySlug(slug: string): BlogPost | undefined
  getWorkProjects(): WorkProject[]
  getFeaturedWorkProjects(): WorkProject[]
}

// Velite-based content engine implementation
class VeliteContentAPI implements ContentAPI {
  getBlogPosts(): BlogPost[] {
    return (blog as unknown as BlogPost[]).map((post: BlogPost) => ({
      ...post,
      date: new Date(post.date as string | Date)
    })).sort((a: BlogPost, b: BlogPost) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  getBlogPostBySlug(slug: string): BlogPost | undefined {
    const post = (blog as unknown as BlogPost[]).find((p: BlogPost) => p.slug === slug)
    if (!post) return undefined
    return {
      ...post,
      date: new Date(post.date as string | Date)
    }
  }

  getWorkProjects(): WorkProject[] {
    const workData = work as unknown as { projects: WorkProject[] }[]
	console.log(work)
	console.log(workData)
	const projects = workData[0]?.projects || []
	console.log(projects)
    return projects.map((project: WorkProject) => ({
      ...project,
      date: new Date(project.date as string | Date)
    })).sort((a: WorkProject, b: WorkProject) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  getFeaturedWorkProjects(): WorkProject[] {
    return this.getWorkProjects().filter(project => project.featured)
  }
}

// Export singleton instance
export const contentAPI: ContentAPI = new VeliteContentAPI()

// Helper functions for pagination
export function paginateItems<T>(items: T[], page: number, itemsPerPage: number): {
  items: T[]
  totalPages: number
  totalItems: number
  hasNext: boolean
  hasPrev: boolean
} {
  const totalItems = items.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedItems = items.slice(startIndex, endIndex)

  return {
    items: paginatedItems,
    totalPages,
    totalItems,
    hasNext: page < totalPages,
    hasPrev: page > 1
  }
}
