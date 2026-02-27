import Link from 'next/link'
import { navigationLinks, socialLinks } from '@/data/config'

export function Footer() {
  return (
    <footer className="border-t-4 border-foreground bg-background py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Logo and tagline */}
          <div className="flex flex-col items-center md:items-start">
            <div className="font-nippo text-5xl md:text-6xl uppercase mb-2">
              [ AJ ]
            </div>
            <div className="font-mono text-[10px] uppercase font-bold text-accent">
              Software Engineer // V2.0
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-mono text-xs font-bold uppercase underline decoration-4 underline-offset-4 link-foreground hover:text-accent transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Social links */}
          <div className="flex gap-4">
            {socialLinks.slice(0, 3).map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs font-bold uppercase underline decoration-4 underline-offset-4 link-foreground hover:text-accent transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t-2 border-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-mono text-[10px] uppercase font-bold text-center md:text-left opacity-50">
            Designed with Stitch, Built by Opencode, Deployed on Cloudflare. Less Bloat, More Performance.
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase font-bold opacity-50">
            <span className="w-2 h-2 bg-accent rounded-full"></span>
            <span>INDIA / REMOTE</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
