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

export function getWorkProjectsByTag(tag: string): WorkProject[] {
  return getAllWorkProjects().filter(project => 
    project.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
  )
}

export function getAllTags(): string[] {
  const tagSet = new Set<string>()
  getAllWorkProjects().forEach(project => {
    project.tags.forEach(tag => tagSet.add(tag))
  })
  return Array.from(tagSet).sort()
}
