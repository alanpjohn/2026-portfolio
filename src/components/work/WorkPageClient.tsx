"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faDownload, faCheckSquare } from "@fortawesome/free-solid-svg-icons";
import { ProjectCard } from "@/components/work/ProjectCard";
import { ContactSection } from "@/components/home/ContactSection";
import { StackMarquee } from "@/components/ui/Marquee";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/AnimatedSection";
import { siteConfig, socialLinks } from "@/data/config";
import { formatDate } from "@/lib/utils/helpers";
import type { WorkItem } from "@/types/work";

interface WorkPageClientProps {
  experiences: WorkItem[];
  projects: WorkItem[];
}

export function WorkPageClient({ experiences, projects }: WorkPageClientProps) {
  return (
    <main className="bg-background min-h-screen">
      {/* Header Section */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <AnimatedSection
            className="lg:col-span-7 flex flex-col justify-center"
            delay={0}
          >
            <p className="font-mono text-accent font-bold mb-2 uppercase tracking-[0.2em] text-sm">
              {"// Portfolio"}
            </p>
            <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl leading-none uppercase mb-6">
              Work &<br />
              Experience
            </h1>
            <div className="flex flex-wrap gap-4 items-center">
              <a
                href={siteConfig.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-accent text-foreground border-4 border-foreground font-display font-bold text-lg px-6 py-3 brutalist-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2"
              >
                RESUME
                <FontAwesomeIcon icon={faDownload} />
              </a>
              <div className="flex gap-2">
                <a
                  href={socialLinks[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-background border-4 border-foreground p-3 brutalist-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                  aria-label="GitHub"
                >
                  <FontAwesomeIcon icon={faGithub} className="w-6 h-6" />
                </a>
                <a
                  href={socialLinks[1].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-background border-4 border-foreground p-3 brutalist-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                  aria-label="LinkedIn"
                >
                  <FontAwesomeIcon icon={faLinkedin} className="w-6 h-6" />
                </a>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection
            className="lg:col-span-5 flex items-center"
            delay={0.2}
          >
            <div className="w-full border-4 border-foreground p-6 bg-background brutalist-shadow relative overflow-hidden">
              <div className="absolute -right-4 -top-6 font-display font-bold text-8xl text-accent/10 select-none">
                /DEV
              </div>
              <div className="space-y-4 relative font-mono text-sm">
                <div className="flex justify-between items-center border-b border-foreground/10 pb-2">
                  <span className="opacity-60">STATUS</span>
                  <span className="text-accent font-bold flex items-center gap-2">
                    <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
                    OPEN TO NEW OPPORTUNITIES
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="opacity-60">LOCATION</span>
                  <span className="font-bold uppercase">India / Remote</span>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </header>

      {/* Tech Stack Marquee */}
      <StackMarquee />

      {/* Work Experience Section */}
      <section
        id="work"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24"
      >
        <AnimatedSection
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
          delay={0}
        >
          <h2 className="font-display font-bold text-4xl md:text-5xl uppercase">
            Work <span className="text-accent">Experience</span>
          </h2>
          <p className="font-mono text-lg uppercase tracking-widest border-b-4 border-accent pb-2 font-bold">
            {"// CAREER LOG"}
          </p>
        </AnimatedSection>

        <StaggerContainer
          className="grid grid-cols-1 gap-10"
          staggerDelay={0.15}
        >
          {experiences.map((item, index) => (
            <StaggerItem key={item.id}>
              <div className="group relative bg-background border-4 border-foreground p-6 md:p-8 brutalist-shadow hover:-translate-y-2 transition-all">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                  <div>
                    <span
                      className={`${index % 2 === 0 ? "bg-accent text-foreground" : "bg-foreground text-background"} font-mono text-xs px-2 py-1 mb-2 inline-block font-bold uppercase`}
                    >
                      {item.endDate
                        ? `${formatDate(item.date)} - ${formatDate(item.endDate)}`
                        : `${formatDate(item.date)} - PRESENT`}
                    </span>
                    <h3 className="font-display font-bold text-2xl md:text-3xl uppercase">
                      {item.role}
                    </h3>
                    <p className="text-xl font-bold opacity-60 font-mono">
                      {item.company}
                    </p>
                  </div>
                  {/* Database icon removed from experience cards */}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <p className="text-lg leading-relaxed">
                      {item.description}
                    </p>
                    <ul className="space-y-2 font-mono text-sm">
                      {item.bullets.map((bullet, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <FontAwesomeIcon
                            icon={faCheckSquare}
                            className="text-accent text-lg mt-0.5"
                          />
                          <span>{bullet}</span>
                        </li>
                      ))}
                      {/*<li className="flex items-start gap-3">
                        <FontAwesomeIcon
                          icon={faCheckSquare}
                          className="text-accent text-lg mt-0.5"
                        />
                        <span>Key contributor to production systems</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <FontAwesomeIcon
                          icon={faCheckSquare}
                          className="text-accent text-lg mt-0.5"
                        />
                        <span>Cross-functional team collaboration</span>
                      </li>*/}
                    </ul>
                  </div>
                  <div className="bg-foreground/5 p-6 border-2 border-dashed border-foreground">
                    <p className="font-mono text-xs uppercase mb-4 opacity-60 font-bold">
                      TECH STACK
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="border-2 border-foreground bg-background px-3 py-1 font-mono text-sm font-bold uppercase"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Featured Projects Section */}
      <section
        id="projects"
        className="bg-foreground text-background py-16 md:py-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-16" delay={0}>
            <h2 className="font-display font-bold text-4xl md:text-5xl uppercase italic mb-4">
              Featured <span className="text-accent">Projects</span>
            </h2>
            <p className="font-mono opacity-60 tracking-widest font-bold">
              {"// OPEN SOURCE & LABS"}
            </p>
          </AnimatedSection>

          <StaggerContainer
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr"
            staggerDelay={0.1}
          >
            {projects.slice(0, 6).map((project) => (
              <StaggerItem key={project.id} className="h-full">
                <ProjectCard project={project} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Contact Section */}
      <ContactSection variant="accent" />
    </main>
  );
}
