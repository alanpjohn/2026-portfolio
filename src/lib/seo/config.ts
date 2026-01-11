export interface SEOConfig {
  siteName: string
  defaultTitle: string
  defaultDescription: string
  baseUrl: string
  pages: {
    home: { title: string; description: string }
    work: { title: string; description: string }
    blog: { title: string; description: string }
  }
}

export const seoConfig: SEOConfig = {
  siteName: 'Alan John',
  defaultTitle: 'Portfolio Website',
  defaultDescription: 'Software Engineer specializing in AI applications and cloud computing',
  baseUrl: 'https://alanjohn.dev',
  pages: {
    home: {
      title: 'Home - Alan John',
      description: 'Software Engineer specializing in AI applications, cloud computing, and scalable solutions. Backend Engineer with experience in research and SaaS startups.'
    },
    work: {
      title: 'Work - Alan John',
      description: 'Projects and experiences showcasing expertise in AI applications, cloud computing, and full-stack development. Backend engineering and startup experience.'
    },
    blog: {
      title: 'Blog - Alan John',
      description: 'Thoughts on software engineering, AI applications, cloud computing, and technology. Insights from research and early-stage startup experiences.'
    },
  }
}