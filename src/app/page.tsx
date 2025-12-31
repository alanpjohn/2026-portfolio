import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { siteConfig } from "@/data/config";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Section>
        <Container>
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Welcome to My Portfolio
            </h1>
            <p className="mt-4 max-w-[700px] text-lg text-muted-foreground sm:text-xl">
              {siteConfig.description}
            </p>
            <div className="mt-8 flex gap-4">
              <Link
                href="/blog"
                className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                View Blog
              </Link>
              <Link
                href="/work"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                See Work
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
              <div className="flex flex-col space-y-1.5">
                <h3 className="text-2xl font-semibold leading-none tracking-tight">
                  About Me
                </h3>
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-muted-foreground">
                  {siteConfig.author}
                </p>
                <p className="text-sm text-muted-foreground">
                  Full-stack developer passionate about building modern web applications with cutting-edge technologies.
                </p>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
              <div className="flex flex-col space-y-1.5">
                <h3 className="text-2xl font-semibold leading-none tracking-tight">
                  Latest Projects
                </h3>
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-muted-foreground">
                  Explore my featured work showcasing various technologies and solutions.
                </p>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
              <div className="flex flex-col space-y-1.5">
                <h3 className="text-2xl font-semibold leading-none tracking-tight">
                  Blog Posts
                </h3>
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-muted-foreground">
                  Read articles about development, tutorials, and technical insights.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Let&apos;s Work Together
            </h2>
            <p className="mt-4 max-w-[600px] text-lg text-muted-foreground">
              Have a project in mind? I&apos;d love to hear from you.
            </p>
            <div className="mt-8">
              <Link
                href={`mailto:${siteConfig.email}`}
                className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Contact Me
            </h2>
            <p className="mt-4 max-w-[600px] text-lg text-muted-foreground">
              Feel free to reach out via email or connect on social media.
            </p>
            <div className="mt-8 flex flex-col gap-4">
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-lg text-foreground hover:text-primary transition-colors"
              >
                {siteConfig.email}
              </a>
              <div className="flex gap-4">
                <a
                  href="https://github.com/username"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  GitHub
                </a>
                <a
                  href="https://linkedin.com/in/username"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}