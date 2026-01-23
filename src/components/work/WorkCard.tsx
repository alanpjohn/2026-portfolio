"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { formatDate } from "@/lib/utils/helpers";
import { CustomImage } from "@/components/ui/Image";
import { useCellAnimation, cellVariants } from "./WorkCard.animations";
import type { WorkItem } from "@/types/work";

interface WorkCardProps {
  item: WorkItem;
}

export function WorkCard({ item }: WorkCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { isInView, shouldReduceMotion } = useCellAnimation(
    ref as React.RefObject<HTMLElement>,
  );

  const title =
    item.type === "experience" ? `${item.role} at ${item.company}` : item.title;

  const dateString =
    item.type === "experience"
      ? `${formatDate(item.date)} - ${item.endDate ? formatDate(item.endDate) : "Present"}`
      : formatDate(item.date);

  return (
    <div ref={ref} className="space-y-2">
      <div className="text-xs text-muted-foreground uppercase tracking-wider">
        {item.type}
      </div>

      <div className="grid py-4 gap-4 border-x-0 border-y-2 grid-cols-1 md:grid-cols-2">
        <motion.div
          variants={cellVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.3,
            delay: shouldReduceMotion ? 0 : 0,
          }}
          className="flex flex-col justify-between"
        >
          <div>
            <h2 className="text-5xl md:text-7xl font-medium">{title}</h2>
            <time
              dateTime={item.date.toISOString()}
              className="my-2 text-md text-muted-foreground"
            >
              {dateString}
            </time>
          </div>
          {item.type === "project" && item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-2 text-sm font-medium text-black shadow border border-black transition-colors hover:bg-alternate uppercase self-start"
            >
              View Project
            </a>
          )}
        </motion.div>

        <motion.div
          variants={cellVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.3,
            delay: shouldReduceMotion ? 0 : 0.1,
          }}
          className={`flex flex-col ${item.type === "project" ? "justify-between" : ""}`}
        >
          {item.image && item.type === "project" && (
            <div className="flex justify-center mb-4">
              {item.url ? (
                <Link href={item.url} target="_blank" rel="noopener noreferrer">
                  <CustomImage
                    src={item.image}
                    alt={title}
                    width={600}
                    height={400}
                    className="rounded-none shadow-lg hover:shadow-xl transition-shadow duration-300"
                  />
                </Link>
              ) : (
                <CustomImage
                  src={item.image}
                  alt={title}
                  width={600}
                  height={400}
                  className="rounded-none shadow-lg"
                />
              )}
            </div>
          )}

          {item.image && item.type === "experience" && (
            <div className="flex justify-center mb-4">
              <CustomImage
                src={item.image}
                alt={title}
                width={600}
                height={400}
                className="rounded-none shadow-lg"
              />
            </div>
          )}

          <p className="text-muted-foreground mb-4">{item.description}</p>
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="bg-accent px-2 py-1 text-xs uppercase tracking-wider text-black"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
