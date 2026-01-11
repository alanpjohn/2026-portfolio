import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionContent } from "@/components/layout/SectionContent";
import { StackedSections } from "@/components/home/StackedSections";
import { getAllWorkItems } from "@/lib/api/work";
import { WorkCard } from "@/components/work/WorkCard";
import { siteConfig, socialLinks } from "@/data/config";
import { seoConfig } from "@/lib/seo/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: seoConfig.pages.work.title,
  description: seoConfig.pages.work.description,
  openGraph: {
    title: seoConfig.pages.work.title,
    description: seoConfig.pages.work.description,
    url: "/work",
    type: "website",
    images: [
      {
        url: "/static/og/default.png",
        width: 1200,
        height: 630,
        alt: "Work - Alan John",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seoConfig.pages.work.title,
    description: seoConfig.pages.work.description,
    images: ["/static/og/default.png"],
  },
};

export default function WorkPage() {
  const items = getAllWorkItems();

  return (
    <StackedSections>
      <Section key="work-header" id="work-header" fullHeight>
        <Container fullWidth>
          <SectionContent className="flex flex-col items-center justify-center text-center">
            <h1 className="text-6xl font-semibold tracking-tighter sm:text-7xl md:text-8xl">
              WORK
            </h1>
            <p className="mt-6 text-xl text-muted-foreground sm:text-2xl max-w-2xl">
              Previous Work Experiences and Projects, check out more on Github
            </p>

            {/* Action Buttons */}
            <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:gap-6">
              <a
                href={siteConfig.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-6 py-3 font-medium text-2xl text-black shadow border border-black transition-colors hover:bg-alternate"
              >
                <FontAwesomeIcon icon={faDownload} className="text-xs" />
                Resume
              </a>
              <a
                href={socialLinks[1].url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-6 py-3 font-medium text-2xl text-black shadow border border-foreground transition-colors hover:bg-alternate"
              >
                <FontAwesomeIcon icon={faLinkedin} className="text-xs" />
                LinkedIn
              </a>
              <a
                href={socialLinks[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-6 py-3 font-medium text-2xl text-black shadow border border-foreground transition-colors hover:bg-alternate"
              >
                <FontAwesomeIcon icon={faGithub} className="text-xs" />
                GitHub
              </a>
            </div>
          </SectionContent>
        </Container>
      </Section>

      {items.map((item) => (
        <Section key={item.id} id={item.id} fullHeight>
          <Container fullWidth>
            <SectionContent className="flex flex-col items-center justify-center">
              <WorkCard item={item} />
            </SectionContent>
          </Container>
        </Section>
      ))}
    </StackedSections>
  );
}
