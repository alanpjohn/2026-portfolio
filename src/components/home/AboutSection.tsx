"use client";

import { CustomImage } from "@/components/ui/Image";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/AnimatedSection";

export function AboutSection() {
  return (
    <section id="about" className="min-h-screen border-b-4 border-foreground">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Left content */}
          <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            <AnimatedSection delay={0}>
              <div className="inline-block bg-accent text-foreground font-mono font-bold px-4 py-1 mb-6 brutalist-border w-fit">
                02 // THE_ENGINEER
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase mb-8 leading-none">
                BUILDING THE
                <br />
                <span className="text-accent">INVISIBLE</span> ENGINES
              </h2>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="space-y-6 text-lg leading-relaxed">
                <p>
                  Twenty Six Year Backend Engineer from Kerala, India
                  specialising in AI applications and cloud computing with
                  experience in research and early stage SaaS startups.
                </p>
                <p className="font-bold border-l-4 border-accent pl-6 py-2 bg-accent/5">
                  Passionate about scalable solutions that make a real impact
                  built on developer platorms designed for high velocity
                  releases Currently focused on distributed systems,
                  cloud-native architectures and AI Platforms
                </p>
                <p>
                  Outside of tech, I do quite a bit of travel and street
                  photography.
                </p>
              </div>
            </AnimatedSection>
          </div>

          {/* Right - Image */}
          <div className="relative bg-accent min-h-100 lg:min-h-full flex items-center justify-center overflow-hidden border-t-4 lg:border-t-0 lg:border-l-4 border-foreground">
            <div className="absolute inset-0 grid-bg opacity-30" />
            <AnimatedSection
              delay={0.3}
              className="relative z-10 w-4/5 h-4/5 max-w-md"
            >
              <CustomImage
                src="/images/Alan.jpg"
                alt="Alan John"
                width={400}
                height={400}
                className="w-full h-full object-cover grayscale hover:grayscale-0 contrast-125 mix-blend-multiply border-4 border-foreground transition-all duration-500"
                priority={true}
              />
            </AnimatedSection>
            <div className="absolute z-10 top-8 right-8 font-mono text-foreground font-bold text-xs bg-background px-4 py-2 brutalist-border rotate-12">
              PROFILE_IMG.PNG
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
