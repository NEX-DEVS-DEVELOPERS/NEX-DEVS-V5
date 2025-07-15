"use client";

import { useEffect } from 'react';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

/**
 * Client component to initialize Barba.js
 * This should be imported in the ClientLayout component
 */
export default function BarbaInitializer() {
  // Initialize Barba.js
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Dynamically import barba initialization to avoid SSR issues
      import('@/utils/barba-init').then(({ useBarba }) => {
        useBarba();
        console.log('Barba.js initialized from client component');
      })
      .catch(error => {
        console.error('Failed to initialize Barba.js:', error);
      });
    }
  }, []);

  // Initialize smooth scrolling
  useSmoothScroll();

  // This component doesn't render anything
  return null;
} 