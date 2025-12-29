import { contentAPI } from './content'
import type { WorkProject } from '@/types/work'

export function getAllWorkProjects(): WorkProject[] {
  return contentAPI.getWorkProjects()
}

export function getFeaturedWorkProjects(): WorkProject[] {
  return contentAPI.getFeaturedWorkProjects()
}

export function getWorkProjectById(id: string): WorkProject | undefined {
  return getAllWorkProjects().find(project => project.id === id)
}

export function getWorkProjectsByTech(tech: string): WorkProject[] {
  return getAllWorkProjects().filter(project => 
    project.techStack.some(t => t.toLowerCase().includes(tech.toLowerCase()))
  )
}

export function getAllTechnologies(): string[] {
  const techSet = new Set<string>()
  getAllWorkProjects().forEach(project => {
    project.techStack.forEach(tech => techSet.add(tech))
  })
  return Array.from(techSet).sort()
}