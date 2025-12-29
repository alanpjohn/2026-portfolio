export interface WorkProject {
  id: string
  title: string
  description: string
  techStack: string[]
  featured: boolean
  liveUrl?: string
  githubUrl?: string
  image?: string
  date: Date
}

export interface WorkData {
  projects: WorkProject[]
}