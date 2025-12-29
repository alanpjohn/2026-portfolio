export interface SocialLink {
  name: string
  url: string
  icon?: string
}

export interface NavigationLink {
  name: string
  href: string
}

export const navigationLinks: NavigationLink[] = [
  { name: 'Home', href: '/' },
  { name: 'Blog', href: '/blog' },
  { name: 'Work', href: '/work' },
]

export const socialLinks: SocialLink[] = [
  { name: 'GitHub', url: 'https://github.com/username' },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/username' },
]

export const siteConfig = {
  title: 'Portfolio Website',
  description: 'A modern portfolio with blog and content management',
  author: 'Your Name',
  email: 'your.email@example.com',
  pagination: {
    postsPerPage: 10,
    maxVisiblePages: 5
  },
  isr: {
    revalidateTime: 86400 // 1 day in seconds
  }
}