import { contentAPI, paginateItems } from './content'
import type { BlogPost, PaginatedBlogPosts } from '@/types/blog'
import { siteConfig } from '@/data/config'

export function getAllBlogPosts(): BlogPost[] {
  return contentAPI.getBlogPosts()
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return contentAPI.getBlogPostBySlug(slug)
}

export function getBlogPostsByTag(tag: string): BlogPost[] {
  return getAllBlogPosts().filter(post => post.tags.includes(tag))
}

export function getAllTags(): string[] {
  const tags = new Set(getAllBlogPosts().flatMap(post => post.tags))
  return Array.from(tags)
}

export function getPaginatedBlogPosts(page: number = 1): PaginatedBlogPosts {
  const allPosts = getAllBlogPosts()
  const { items, totalPages, totalItems, hasNext, hasPrev } = paginateItems(
    allPosts,
    page,
    siteConfig.pagination.postsPerPage
  )

  return {
    posts: items,
    currentPage: page,
    totalPages,
    totalPosts: totalItems,
    hasNext,
    hasPrev
  }
}

// Client-side filtering functions (placeholder for future implementation)
export function filterBlogPosts(posts: BlogPost[], filters: {
  tag?: string
  search?: string
}): BlogPost[] {
  let filtered = posts

  if (filters.tag) {
    filtered = filtered.filter(post => post.tags.includes(filters.tag!))
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(post => 
      post.title.toLowerCase().includes(searchLower) ||
      post.excerpt.toLowerCase().includes(searchLower) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchLower))
    )
  }

  return filtered
}
