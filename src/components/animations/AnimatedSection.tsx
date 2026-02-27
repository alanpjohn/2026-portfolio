'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedSection({ 
  children, 
  className = '', 
  delay = 0,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ 
        opacity: 0, 
        y: shouldReduceMotion ? 0 : 30 
      }}
      animate={{ 
        opacity: isInView ? 1 : 0, 
        y: isInView ? 0 : (shouldReduceMotion ? 0 : 30) 
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
  const isInView = useInView(ref, { once: true, margin: '-50px' });
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
          y: shouldReduceMotion ? 0 : 20 
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
