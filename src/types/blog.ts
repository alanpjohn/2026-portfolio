export interface BlogPost {
  title: string
  date: Date
  tags: string[]
  excerpt: string
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
