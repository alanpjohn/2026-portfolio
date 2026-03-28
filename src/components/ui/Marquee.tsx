"use client";

import { motion } from "framer-motion";

const techStack = [
  "Software Engineering",
  "Serverless Computing",
  "Photography",
  "Agentic Systems",
  "DevOps",
];

export function StackMarquee() {
  return (
    <div className="border-b-4 border-foreground bg-foreground text-background py-4 md:py-6 overflow-hidden whitespace-nowrap">
      <div className="flex animate-marquee font-mono uppercase font-black text-lg md:text-xl space-x-12">
        {/* First set */}
        {techStack.map((tech) => (
          <span key={`1-${tech}`} className="flex items-center">
            {tech} <span className="text-accent ml-12">/</span>
          </span>
        ))}
        {/* Second set for seamless loop */}
        {techStack.map((tech) => (
          <span key={`2-${tech}`} className="flex items-center">
            {tech} <span className="text-accent ml-12">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
