import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionContent } from "@/components/layout/SectionContent";
import { StackedSections } from "@/components/home/StackedSections";
import { siteConfig, socialLinks } from "@/data/config";

export default function Home() {
  return (
    <StackedSections>
      <Section key="hero" id="hero" fullHeight>
        <Container fullWidth>
          <SectionContent className="flex flex-col items-center justify-center text-center">
            <h1 className="text-8xl font-black tracking-tighter sm:text-9xl md:text-[12rem] lg:text-[14rem] leading-none">
              ALAN JOHN
            </h1>
            <p className="mt-8 text-2xl font-medium text-muted-foreground sm:text-3xl md:text-4xl">
              SOFTWARE ENGINEER
            </p>
          </SectionContent>
        </Container>
      </Section>

      <Section key="about" id="about" fullHeight>
        <Container fullWidth>
          <SectionContent>
            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
              <div className="flex-1 space-y-6">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
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

      <Section key="navigation" id="navigation" fullHeight>
        <Container fullWidth>
          <SectionContent className="flex flex-col items-center justify-center text-center">
            <div className="flex flex-col gap-8 md:gap-12">
              <Link
                href="/work"
                className="text-4xl md:text-6xl font-black tracking-tighter hover:text-primary transition-colors"
              >
                WORK
              </Link>
              <Link
                href="/blog"
                className="text-4xl md:text-6xl font-black tracking-tighter hover:text-primary transition-colors"
              >
                BLOG
              </Link>
              <Link
                href="https://photos.alanjohn.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-4xl md:text-6xl font-black tracking-tighter hover:text-primary transition-colors"
              >
                PHOTOS
              </Link>
            </div>
          </SectionContent>
        </Container>
      </Section>

      <Section key="contact" id="contact" fullHeight>
        <Container fullWidth>
          <SectionContent className="flex flex-col items-center justify-center text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-12">
              Contact
            </h2>
            <div className="flex gap-8 md:gap-12">
              <a
                href={socialLinks[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-4xl md:text-6xl font-black tracking-tighter hover:text-primary transition-colors"
              >
                G
              </a>
              <a
                href={socialLinks[1].url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-4xl md:text-6xl font-black tracking-tighter hover:text-primary transition-colors"
              >
                L
              </a>
              <a
                href={socialLinks[2].url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-4xl md:text-6xl font-black tracking-tighter hover:text-primary transition-colors"
              >
                D
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-4xl md:text-6xl font-black tracking-tighter hover:text-primary transition-colors"
              >
                E
              </a>
            </div>
          </SectionContent>
        </Container>
      </Section>
    </StackedSections>
  );
}
