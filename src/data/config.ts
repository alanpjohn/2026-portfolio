export interface SocialLink {
  name: string;
  url: string;
  icon?: string;
}

export interface NavigationLink {
  name: string;
  href: string;
}

export const navigationLinks: NavigationLink[] = [
  { name: "Home", href: "/" },
  { name: "Blog", href: "/blog" },
  { name: "Work", href: "/work" },
  { name: "Photos", href: "https://photos.alanjohn.dev" },
  { name: "Contact", href: "#contact" },
];

export const socialLinks: SocialLink[] = [
  { name: "GitHub", url: "https://github.com/alanpjohn" },
  { name: "LinkedIn", url: "https://linkedin.com/in/pjohnalan" },
  { name: "Discord", url: "https://discord.com/users/alanpjohn" },
];

export const siteConfig = {
  title: "Portfolio Website",
  description: "A modern portfolio with blog and content management",
  author: "Alan John",
  email: "alanpjohn@outlook.com",
  resumeUrl:
    "https://drive.google.com/file/d/1AmSD-f0080nX0xZfYu32NSV5Ir1et1Dl/view?usp=sharing",
  pagination: {
    postsPerPage: 10,
    maxVisiblePages: 5,
  },
  deployment: {
    platform: "Cloudflare",
    builtWith: "opencode",
  },
};
