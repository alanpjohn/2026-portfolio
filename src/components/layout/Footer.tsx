import Link from 'next/link'
import { navigationLinks, siteConfig } from '@/data/config'

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8">
        {/* Row 1: Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-6">
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm link-foreground hover:text-accent transition-colors duration-200"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Row 2: Attribution */}
        <div className="text-center text-sm text-muted-foreground">
          Built with {siteConfig.deployment.builtWith}, deployed on {siteConfig.deployment.platform}
        </div>
      </div>
    </footer>
  )
}