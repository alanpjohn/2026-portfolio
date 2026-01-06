"use client";

import { Children, isValidElement, type ReactNode, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { useActiveSection } from "@/hooks/useActiveSection";
import {
  defaultAnimationConfig,
  reducedMotionConfig,
} from "./animation-config";

interface StackedSectionsProps {
  children: ReactNode;
}

export function StackedSections({ children }: StackedSectionsProps) {
  const prefersReducedMotion = useReducedMotion();
  const config = prefersReducedMotion
    ? reducedMotionConfig
    : defaultAnimationConfig;

  const sections = Children.toArray(children).filter((child) => {
    if (typeof child === "string") {
      return child.trim().length > 0;
    }
    return child !== null && child !== undefined;
  });

  const { activeIndex, setRef } = useActiveSection(sections.length, {
    threshold: 0.5,
    rootMargin: "-20% 0px -20% 0px",
  });

  return (
    <div className="relative -mt-24">
      <AnimatePresence initial={false} mode="sync">
        {sections.map((child, index) => (
          <StackedSection
            key={
              isValidElement(child) && child.key !== null
                ? child.key
                : `section-${index}`
            }
            index={index}
            total={sections.length}
            activeIndex={activeIndex}
            setRef={setRef}
            config={config}
          >
            {child}
          </StackedSection>
        ))}
      </AnimatePresence>
    </div>
  );
}

interface StackedSectionProps {
  children: ReactNode;
  index: number;
  total: number;
  activeIndex: number;
  setRef: (index: number) => (el: HTMLDivElement | null) => void;
  config: typeof defaultAnimationConfig;
}

function StackedSection({
  children,
  index,
  total,
  activeIndex,
  setRef,
  config,
}: StackedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const isActive = index === activeIndex;
  const stackPosition = activeIndex - index;

  // Z-axis movement: move sections into negative Z space as they recede
  const z = useTransform(
    scrollYProgress,
    [0, 1],
    [0, config.zOffset * Math.abs(stackPosition)],
  );

  // Scale reduction as sections move back in Z space
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    [config.activeScale, config.stackedScale - config.zScaleReduction],
  );

  const variants: Variants = {
    initial: {
      y: config.entranceY,
    },
    animate: {
      y: 0,
      transition: {
        duration: config.transitionDuration,
        type: "spring",
        stiffness: config.springStiffness,
        damping: config.springDamping,
      },
    },
    exit: {
      z: config.zOffset,
      scale: config.stackedScale,
      transition: {
        duration: config.transitionDuration,
        type: "spring",
        stiffness: config.springStiffness,
        damping: config.springDamping,
      },
    },
  };

  return (
    <motion.div
      ref={(el: HTMLDivElement | null) => {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
        setRef(index)(el);
      }}
      className="sticky top-0 flex h-screen items-center overflow-hidden bg-background"
      style={{
        zIndex: index,
        scale,
        z,
        boxShadow: isActive ? config.activeShadow : config.stackedShadow,
        willChange: "transform, opacity",
        borderRadius: config.borderRadius,
        overflow: "hidden",
      }}
      variants={variants}
      initial="initial"
      animate={isActive ? "animate" : undefined}
      role="region"
      aria-label={`Section ${index + 1} of ${total}`}
    >
      <div className={`relative w-full`}>{children}</div>
    </motion.div>
  );
}
