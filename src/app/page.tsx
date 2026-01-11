import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faDiscord,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionContent } from "@/components/layout/SectionContent";
import { StackedSections } from "@/components/home/StackedSections";
import { siteConfig, socialLinks, navigationLinks } from "@/data/config";
import { seoConfig } from "@/lib/seo/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: seoConfig.pages.home.title,
  description: seoConfig.pages.home.description,
  openGraph: {
    title: seoConfig.pages.home.title,
    description: seoConfig.pages.home.description,
    url: "/",
    type: "website",
    images: [
      {
        url: "/static/og/default.png",
        width: 1200,
        height: 630,
        alt: "Portfolio Website - Alan John",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seoConfig.pages.home.title,
    description: seoConfig.pages.home.description,
    images: ["/static/og/default.png"],
  },
};

export default function Home() {
  return (
    <StackedSections>
      <Section key="hero" id="hero" fullHeight>
        <Container fullWidth>
          <SectionContent className="flex flex-col items-center justify-center text-center">
            <h1 className="text-8xl font-logo font-semibold tracking-tighter sm:text-9xl md:text-[12rem] lg:text-[14rem] leading-none">
              ALAN JOHN
            </h1>
            <p className="mt-8 text-2xl font-medium text-muted-foreground sm:text-3xl md:text-4xl">
              SOFTWARE ENGINEER
            </p>

            {/* Navigation Buttons */}
            <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:gap-6">
              {navigationLinks.slice(1, 4).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-sm font-medium text-black shadow border border-black transition-colors hover:bg-alternate"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
              <p className="text-sm text-muted-foreground/60 animate-pulse">
                scroll to know more
              </p>
            </div>
          </SectionContent>
        </Container>
      </Section>

      <Section key="about" id="about" fullHeight>
        <Container fullWidth>
          <SectionContent>
            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
              <div className="flex-1 space-y-6">
                <h2 className="text-3xl font-medium tracking-tighter sm:text-4xl">
                  About Me
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                  Backend Engineer specialising in AI applications and cloud
                  computing with experience in research and early stage SaaS
                  startups. Passionate about building scalable solutions that
                  make a real impact.
                </p>
              </div>
              <div className="flex-shrink-0">
                <Image
                  src="/images/Alan.jpg"
                  alt="Alan John"
                  width={320}
                  height={320}
                  className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </SectionContent>
        </Container>
      </Section>

      <Section key="contact" id="contact" fullHeight>
        <Container fullWidth>
          <SectionContent className="flex flex-col items-center justify-center text-center">
            <h2 className="text-3xl font-medium tracking-tighter sm:text-4xl md:text-5xl mb-8">
              Contact
            </h2>
            <div className="mb-12 max-w-2xl">
              <p className="text-lg text-muted-foreground leading-relaxed">
                I&apos;m always open to discussing new opportunities and
                interesting projects. Whether you&apos;re looking for a backend
                engineer to join your team or have an exciting project we could
                work together on, I&apos;d love to hear from you.
              </p>
            </div>
            <div className="flex gap-8 md:gap-12">
              <a
                href={socialLinks[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-4xl md:text-6xl link-foreground link-dotted"
                aria-label="GitHub"
              >
                <FontAwesomeIcon icon={faGithub} />
              </a>
              <a
                href={socialLinks[1].url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-4xl md:text-6xl link-foreground link-dotted"
                aria-label="LinkedIn"
              >
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
              <a
                href={socialLinks[2].url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-4xl md:text-6xl link-foreground link-dotted"
                aria-label="Discord"
              >
                <FontAwesomeIcon icon={faDiscord} />
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-4xl md:text-6xl link-foreground link-dotted"
                aria-label="Email"
              >
                <FontAwesomeIcon icon={faEnvelope} />
              </a>
            </div>
          </SectionContent>
        </Container>
      </Section>
    </StackedSections>
  );
}
