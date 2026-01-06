import { contentAPI } from './content'
import type { WorkItem } from '@/types/work'

export function getAllWorkItems(): WorkItem[] {
  return contentAPI.getWorkItems()
}

export function getWorkProjects(): WorkItem[] {
  return contentAPI.getWorkProjects()
}

export function getWorkExperiences(): WorkItem[] {
  return contentAPI.getWorkExperiences()
}

export function getFeaturedWorkItems(): WorkItem[] {
  return contentAPI.getFeaturedWorkItems()
}

export function getWorkItemById(id: string): WorkItem | undefined {
  return getAllWorkItems().find(item => item.id === id)
}

export function getWorkItemsByTag(tag: string): WorkItem[] {
  return getAllWorkItems().filter(item =>
    item.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
  )
}

export function getAllTags(): string[] {
  const tagSet = new Set<string>()
  getAllWorkItems().forEach(item => {
    item.tags.forEach(tag => tagSet.add(tag))
  })
  return Array.from(tagSet).sort()
}
