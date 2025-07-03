'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

type AnimationType = 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale' | 'none';

export interface SmoothAnimationProps {
  children: React.ReactNode;
  type?: AnimationType;
  className?: string;
  duration?: number;
  delay?: number;
  repeat?: number;
  shouldAnimate?: boolean;
  forceAnimation?: boolean; // Force animation even if reduced motion is preferred
  onComplete?: () => void;
  trigger?: 'mount' | 'hover' | 'manual';
}

// CSS animation class mappings
const getAnimationClass = (type: AnimationType) => {
  switch (type) {
    case 'fade':
      return 'fade-in';
    case 'slide-up':
      return 'slide-up';
    case 'slide-down':
      return 'slide-down';
    case 'slide-left':
      return 'slide-left';
    case 'slide-right':
      return 'slide-right';
    case 'scale':
      return 'scale-in';
    default:
      return '';
  }
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
  onComplete,
  trigger = 'mount',
  ...props
}: SmoothAnimationProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const shouldReduceMotion = prefersReducedMotion && !forceAnimation;

  // If reduced motion is preferred, use 'none' animation type
  const animationType = shouldReduceMotion || !shouldAnimate ? 'none' : type;
  const animationClass = getAnimationClass(animationType);

  useEffect(() => {
    if (!elementRef.current || animationType === 'none') return;
    
    const element = elementRef.current;
    
    // Set initial state
    element.style.opacity = '0';
    
    // Apply animation with delay
    setTimeout(() => {
      element.classList.add(animationClass);
      
      // Handle animation completion
      const handleAnimationEnd = () => {
        if (onComplete) onComplete();
        element.removeEventListener('animationend', handleAnimationEnd);
      };
      
      element.addEventListener('animationend', handleAnimationEnd);
      
      // Handle repeat if needed
      if (repeat > 0) {
        let count = 0;
        const intervalId = setInterval(() => {
          if (count >= repeat) {
            clearInterval(intervalId);
            return;
          }
          
          element.classList.remove(animationClass);
          void element.offsetWidth; // Force reflow
          element.classList.add(animationClass);
          count++;
        }, (duration + delay) * 1000);
        
        return () => clearInterval(intervalId);
      }
    }, delay * 1000);
    
  }, [animationType, animationClass, duration, delay, repeat, shouldReduceMotion, onComplete]);

  // Apply custom duration and delay via inline styles
  const customStyles = {
    animationDuration: duration ? `${duration}s` : undefined,
    animationDelay: delay ? `${delay}s` : undefined,
  };

  return (
    <div
      ref={elementRef}
      className={cn(
        'gpu-accelerated',
        animationType !== 'none' ? 'will-change-transform-opacity' : '',
        className
      )}
      style={customStyles}
      {...props}
    >
      {children}
    </div>
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