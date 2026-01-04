export interface WorkProject {

  id: string
  title: string
  description: string
  tags: string[]
  featured: boolean
  url?: string
  image?: string
  date: Date
}

export interface WorkData {
  projects: WorkProject[]
}
