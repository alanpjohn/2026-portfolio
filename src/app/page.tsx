import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { seoConfig } from "@/lib/seo/config";
import { AboutSection } from "@/components/home/AboutSection";
import { ContactSection } from "@/components/home/ContactSection";
import { StackMarquee } from "@/components/ui/Marquee";
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
    <main className="bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex flex-col items-center justify-center overflow-hidden border-b-4 border-foreground">
        {/* Grid background */}
        <div className="absolute inset-0 grid-bg" />

        {/* Main content */}
        <div className="relative z-10 text-center px-4 mb-8">
          <p className="font-mono text-accent font-bold uppercase tracking-[0.5em] mb-4 text-sm md:text-base">
            Software Engineer
          </p>
          <h1 className="font-nippo text-[12vw] md:text-[10vw] font-bold uppercase leading-[0.85]">
            ALAN
            <br />
            JOHN
          </h1>
        </div>

        {/* Floating navigation cards - All screens */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden block">
          {/* Projects Card */}
          <Link
            href="/work"
            className="pointer-events-auto absolute top-[8%] md:top-[15%] left-[5%] brutalist-border bg-background p-4 md:p-6 brutalist-shadow-hover -rotate-6 group"
          >
            <div className="font-mono text-[10px] text-accent mb-1 font-bold uppercase tracking-tight">
              {"// RECENT_WORKS"}
            </div>
            <div className="font-display text-xl md:text-2xl font-bold uppercase group-hover:text-accent transition-colors">
              Projects
            </div>
            <span className="absolute -top-3 -right-3 bg-foreground text-background p-1 text-xs">
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </span>
          </Link>

          {/* Blog Card */}
          <Link
            href="/blog"
            className="pointer-events-auto absolute bottom-[20%] left-[3%] brutalist-border bg-accent text-foreground p-4 md:p-6 brutalist-shadow-hover rotate-3 group"
          >
            <div className="font-mono text-[10px] mb-1 font-bold uppercase tracking-tight">
              {"// THOUGHT_LOG"}
            </div>
            <div className="font-display text-xl md:text-2xl font-bold uppercase">
              Blog
            </div>
            <span className="absolute -bottom-3 -right-3 bg-foreground text-background p-1 text-xs">
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </span>
          </Link>

          {/* Contact Card */}
          <Link
            href="#contact"
            className="pointer-events-auto absolute top-[10%] md:top-[20%] right-[5%] brutalist-border bg-foreground text-background p-4 md:p-6 brutalist-shadow-hover rotate-6 group"
          >
            <div className="font-mono text-[10px] text-accent mb-1 font-bold uppercase tracking-tight">
              {"// GET_IN_TOUCH"}
            </div>
            <div className="font-display text-xl md:text-2xl font-bold uppercase group-hover:text-accent transition-colors">
              Contact
            </div>
            <span className="absolute -top-3 -left-3 bg-accent text-foreground p-1 text-xs">
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </span>
          </Link>

          {/* Photos Card */}
          <Link
            href="/photos"
            className="pointer-events-auto absolute bottom-[15%] right-[8%] brutalist-border bg-background p-4 md:p-6 brutalist-shadow-hover -rotate-3 group"
          >
            <div className="font-mono text-[10px] text-accent mb-1 font-bold uppercase tracking-tight">
              {"// VISUALS"}
            </div>
            <div className="font-display text-xl md:text-2xl font-bold uppercase group-hover:text-accent transition-colors">
              Photos
            </div>
            <span className="absolute -bottom-3 -right-3 bg-accent text-foreground p-1 text-xs">
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </span>
          </Link>
        </div>

        {/* Mobile navigation buttons - Hidden on larger screens */}
        <div className="hidden md:hidden flex flex-wrap justify-center gap-4 mt-8 relative z-20 px-4">
          <Link
            href="/work"
            className="brutalist-border bg-background px-6 py-3 font-display font-bold uppercase brutalist-shadow text-sm"
          >
            Projects
          </Link>
          <Link
            href="/blog"
            className="brutalist-border bg-accent text-foreground px-6 py-3 font-display font-bold uppercase brutalist-shadow text-sm"
          >
            Blog
          </Link>
          <Link
            href="#contact"
            className="brutalist-border bg-foreground text-background px-6 py-3 font-display font-bold uppercase brutalist-shadow text-sm"
          >
            Contact
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
          <p className="text-sm font-mono uppercase tracking-widest opacity-60">
            Scroll to explore
          </p>
        </div>
      </section>

      {/* Tech Stack Marquee */}
      <StackMarquee />

      {/* About Section with Animations */}
      <AboutSection />

      {/* Contact CTA Section with Animations */}
      <ContactSection />
    </main>
  );
}
