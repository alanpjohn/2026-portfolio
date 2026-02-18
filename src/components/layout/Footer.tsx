import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
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
          Built with{' '}
          <FontAwesomeIcon icon={faHeart} className="w-3 h-3 text-accent mx-1" />{' '}
          using{' '}
          <a
            href="https://opencode.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="border-b border-dotted border-current hover:text-accent hover:border-accent transition-colors duration-200"
          >
            {siteConfig.deployment.builtWith}
          </a>
          , deployed on{' '}
          <a
            href="https://cloudflare.com"
            target="_blank"
            rel="noopener noreferrer"
            className="border-b border-dotted border-current hover:text-accent hover:border-accent transition-colors duration-200"
          >
            {siteConfig.deployment.platform}
          </a>
        </div>
      </div>
    </footer>
  )
}