"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { formatDate } from "@/lib/utils/helpers";
import { CustomImage } from "@/components/ui/Image";
import { 
  useWorkCardAnimation, 
  cardVariants, 
  imageVariants, 
  tagVariants 
} from "./WorkCard.animations";
import type { WorkItem } from "@/types/work";

interface WorkCardProps {
  item: WorkItem;
}

export function WorkCard({ item }: WorkCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { isInView, shouldReduceMotion, duration, getDelay } = useWorkCardAnimation(
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
        {/* Left Column - Title, Date, View Project */}
        <div className="flex flex-col justify-between">
          {/* Title */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{
              duration: shouldReduceMotion ? 0 : duration,
              delay: getDelay(0),
            }}
          >
            <h2 className="text-5xl md:text-7xl font-medium">{title}</h2>
          </motion.div>

          {/* Date */}
          <motion.time
            dateTime={item.date.toISOString()}
            variants={cardVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{
              duration: shouldReduceMotion ? 0 : duration,
              delay: getDelay(1),
            }}
            className="my-2 text-md text-muted-foreground block"
          >
            {dateString}
          </motion.time>

          {/* View Project Button */}
          {item.type === "project" && item.url && (
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{
                duration: shouldReduceMotion ? 0 : duration,
                delay: getDelay(4),
              }}
              className="flex justify-end md:justify-start"
            >
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-polygon-sm btn-polygon inline-flex items-center justify-center"
              >
                View Project
              </a>
            </motion.div>
          )}
        </div>

        {/* Right Column - Image, Description, Tags */}
        <div className={`flex flex-col ${item.type === "project" ? "justify-between" : ""}`}>
          {/* Image */}
          {(item.image && item.type === "project") && (
            <motion.div 
              className="flex justify-center mb-4"
              variants={imageVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{
                duration: shouldReduceMotion ? 0 : duration,
                delay: getDelay(2),
              }}
            >
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
            </motion.div>
          )}

          {item.image && item.type === "experience" && (
            <motion.div 
              className="flex justify-center mb-4"
              variants={imageVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{
                duration: shouldReduceMotion ? 0 : duration,
                delay: getDelay(2),
              }}
            >
              <CustomImage
                src={item.image}
                alt={title}
                width={600}
                height={400}
                className="rounded-none shadow-lg"
              />
            </motion.div>
          )}

          {/* Description */}
          <motion.p 
            className="text-muted-foreground mb-4"
            variants={cardVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{
              duration: shouldReduceMotion ? 0 : duration,
              delay: getDelay(3),
            }}
          >
            {item.description}
          </motion.p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag, index) => (
              <motion.span
                key={tag}
                variants={tagVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                transition={{
                  duration: shouldReduceMotion ? 0 : duration,
                  delay: getDelay(5 + index),
                }}
                className="bg-accent px-2 py-1 text-xs uppercase tracking-wider text-black"
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
