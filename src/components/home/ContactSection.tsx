"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLinkedin,
  faGithub,
  faDiscord,
} from "@fortawesome/free-brands-svg-icons";
import { siteConfig, socialLinks } from "@/data/config";
import { AnimatedSection } from "@/components/animations/AnimatedSection";

interface ContactSectionProps {
  variant?: "dark" | "accent";
}

export function ContactSection({ variant = "dark" }: ContactSectionProps) {
  const isDark = variant === "dark";

  return (
    <section
      id="contact"
      className={`min-h-screen flex flex-col ${isDark ? "bg-foreground text-background" : "bg-accent text-foreground"}`}
    >
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col justify-center">
        <div className="text-center">
          <AnimatedSection delay={0}>
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold uppercase leading-[0.85] mb-10">
              LET&apos;S BUILD
              <br />
              SOMETHING
              <br />
              <span
                className={`italic ${isDark ? "text-accent" : "opacity-60"}`}
              >
                TOGETHER
              </span>
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12">
              <a
                href={`mailto:${siteConfig.email}`}
                className={`brutalist-border px-10 py-5 font-display font-bold text-xl md:text-2xl ${isDark ? "brutalist-shadow-hover" : "brutalist-shadow-hover-2"} transition-all uppercase ${isDark ? "bg-accent text-foreground" : "bg-foreground text-background"}`}
              >
                GET IN TOUCH
              </a>

              <div className="flex gap-6 md:gap-8 font-mono font-bold text-lg">
                <a
                  href={socialLinks[1].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`transition-colors underline decoration-4 underline-offset-4 ${isDark ? "hover:text-accent" : "hover:text-background"}`}
                >
                  <FontAwesomeIcon icon={faLinkedin} className="mr-2" />
                  LINKEDIN
                </a>
                <a
                  href={socialLinks[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`transition-colors underline decoration-4 underline-offset-4 ${isDark ? "hover:text-accent" : "hover:text-background"}`}
                >
                  <FontAwesomeIcon icon={faGithub} className="mr-2" />
                  GITHUB
                </a>
                <a
                  href={socialLinks[2].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`transition-colors underline decoration-4 underline-offset-4 ${isDark ? "hover:text-accent" : "hover:text-background"}`}
                >
                  <FontAwesomeIcon icon={faDiscord} className="mr-2" />
                  DISCORD
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Bottom info bar */}
      <div
        className={`border-t-4 py-6 px-4 sm:px-6 lg:px-8 ${isDark ? "border-background" : "border-foreground"}`}
      >
        <div
          className={`max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-xs font-bold ${isDark ? "text-background/60" : "text-foreground/60"}`}
        >
          <p>© 2026 ALAN JOHN. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${isDark ? "bg-accent" : "bg-foreground"}`}
            ></span>
            <span>INDIA / REMOTE</span>
          </div>
          <p>ALWAYS OPEN TO CONNECT</p>
        </div>
      </div>
    </section>
  );
}
