'use client';

import React from 'react';
import { motion, MotionProps, useReducedMotion, Transition } from 'framer-motion';
import { cn } from '@/lib/utils';

type AnimationType = 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale' | 'none';

export interface SmoothAnimationProps extends Omit<MotionProps, 'initial' | 'animate' | 'exit' | 'transition'> {
  children: React.ReactNode;
  type?: AnimationType;
  className?: string;
  duration?: number;
  delay?: number;
  repeat?: number;
  shouldAnimate?: boolean;
  forceAnimation?: boolean; // Force animation even if reduced motion is preferred
}

const animationVariants = {
  'fade': {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  'slide-up': {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
  },
  'slide-down': {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
  },
  'slide-left': {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
  },
  'slide-right': {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  },
  'scale': {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  },
  'none': {
    initial: {},
    animate: {},
    exit: {},
  },
};

export function SmoothAnimation({
  children,
  type = 'fade',
  className = '',
  duration = 0.5,
  delay = 0,
  repeat = 0,
  shouldAnimate = true,
  forceAnimation = false,
  ...props
}: SmoothAnimationProps) {
  // Respect user's reduced motion preferences
  const prefersReducedMotion = useReducedMotion();
  const shouldReduceMotion = prefersReducedMotion && !forceAnimation;
  
  // If reduced motion is preferred, use 'none' animation type
  const animationType = shouldReduceMotion || !shouldAnimate ? 'none' : type;
  const variants = animationVariants[animationType];
  
  const transition: Transition = {
    duration: shouldReduceMotion ? 0 : duration,
    delay,
    repeat: repeat > 0 ? repeat : undefined,
    ease: [0.25, 0.1, 0.25, 1], // Cubic bezier for smooth easing
  };
  
  return (
    <motion.div
      initial={variants.initial}
      animate={variants.animate}
      exit={variants.exit}
      transition={transition}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function FadeIn({ children, ...props }: Omit<SmoothAnimationProps, 'type'>) {
  return <SmoothAnimation type="fade" {...props}>{children}</SmoothAnimation>;
}

export function SlideUp({ children, ...props }: Omit<SmoothAnimationProps, 'type'>) {
  return <SmoothAnimation type="slide-up" {...props}>{children}</SmoothAnimation>;
}

export function SlideDown({ children, ...props }: Omit<SmoothAnimationProps, 'type'>) {
  return <SmoothAnimation type="slide-down" {...props}>{children}</SmoothAnimation>;
}

export function SlideLeft({ children, ...props }: Omit<SmoothAnimationProps, 'type'>) {
  return <SmoothAnimation type="slide-left" {...props}>{children}</SmoothAnimation>;
}

export function SlideRight({ children, ...props }: Omit<SmoothAnimationProps, 'type'>) {
  return <SmoothAnimation type="slide-right" {...props}>{children}</SmoothAnimation>;
}

export function ScaleIn({ children, ...props }: Omit<SmoothAnimationProps, 'type'>) {
  return <SmoothAnimation type="scale" {...props}>{children}</SmoothAnimation>;
} 