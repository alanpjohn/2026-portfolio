export interface BlogPost {
  title: string
  date: Date
  category: string
  tags: string[]
  excerpt: string
  readingTime: number
  slug: string
  content: string
}

export interface BlogFilters {
  category?: string
  tag?: string
  search?: string
}

export interface PaginatedBlogPosts {
  posts: BlogPost[]
  currentPage: number
  totalPages: number
  totalPosts: number
  hasNext: boolean
  hasPrev: boolean
}