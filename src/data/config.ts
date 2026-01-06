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
    { name: 'Photos', href: "https://photos.alanjohn.dev" },
]

export const socialLinks: SocialLink[] = [
    { name: 'GitHub', url: 'https://github.com/alanpjohn' },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/pjohnalan' },
    { name: 'Discord', url: 'https://discord.com/users/your-discord-id' },
]

export const siteConfig = {
    title: 'Portfolio Website',
    description: 'A modern portfolio with blog and content management',
    author: 'Alan John',
    email: 'alanpjohn@outlook.com',
    pagination: {
        postsPerPage: 10,
        maxVisiblePages: 5
    },
    isr: {
        revalidateTime: 86400 // 1 day in seconds
    }
}
