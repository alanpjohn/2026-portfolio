'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

interface FadeInSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

const directionOffsets = {
  up: { y: 40, x: 0 },
  down: { y: -40, x: 0 },
  left: { x: 40, y: 0 },
  right: { x: -40, y: 0 },
};

export function FadeInSection({ 
  children, 
  className = '', 
  delay = 0,
  direction = 'up' 
}: FadeInSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const shouldReduceMotion = useReducedMotion();

  const offset = directionOffsets[direction];

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ 
        opacity: 0, 
        x: shouldReduceMotion ? 0 : offset.x, 
        y: shouldReduceMotion ? 0 : offset.y 
      }}
      animate={{ 
        opacity: isInView ? 1 : 0, 
        x: isInView ? 0 : (shouldReduceMotion ? 0 : offset.x), 
        y: isInView ? 0 : (shouldReduceMotion ? 0 : offset.y) 
      }}
      transition={{ 
        duration: shouldReduceMotion ? 0 : 0.6, 
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({ 
  children, 
  className = '',
  staggerDelay = 0.1
}: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: shouldReduceMotion ? 0 : staggerDelay,
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className = '' }: StaggerItemProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { 
          opacity: 0, 
          y: shouldReduceMotion ? 0 : 30 
        },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: {
            duration: shouldReduceMotion ? 0 : 0.5,
            ease: [0.22, 1, 0.36, 1]
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
}
