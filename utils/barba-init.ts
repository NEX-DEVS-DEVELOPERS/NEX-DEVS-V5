import barba from '@barba/core';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Register GSAP plugins
gsap.registerPlugin(ScrollToPlugin);

// Extend Window interface for TypeScript
declare global {
  interface Window {
    __BARBA_INITIALIZED__?: boolean;
    barba?: any;
  }
}

// TypeScript declaration for Barba data
interface BarbaData {
  current: {
    container: HTMLElement;
    namespace?: string;
  };
  next: {
    container: HTMLElement;
    namespace?: string;
  };
  trigger?: 'back' | 'forward' | string;
}

// Define interface for HTML anchor element with target property
interface HTMLAnchorElement extends HTMLElement {
  target?: string;
  href?: string;
}

interface ProgressBarHelpers {
  updateProgress: (progress: number) => void;
  showOverlay: () => void;
  hideOverlay: () => void;
  resetProgress: () => void;
}

// Define options for Barba initialization
interface BarbaOptions {
  optimizeWelcomeScreen?: boolean;
  transitionSpeed?: number;
  easing?: number[] | string;
}

// Initialize progress bar logic
const initProgressBar = (): ProgressBarHelpers => {
  let progressBar: HTMLElement | null = null;
  let transitionOverlay: HTMLElement | null = null;
  
  if (typeof window !== 'undefined') {
    progressBar = document.getElementById('progress-bar');
    transitionOverlay = document.getElementById('transition-overlay');
  }

  // Update progress bar
  const updateProgress = (progress: number): void => {
    if (progressBar) {
      gsap.to(progressBar, {
        width: `${progress * 100}%`,
        duration: 0.1,
        ease: 'power2.out'
      });
    }
  };

  // Show overlay 
  const showOverlay = (): void => {
    if (transitionOverlay) {
      gsap.to(transitionOverlay, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  };

  // Hide overlay
  const hideOverlay = (): void => {
    if (transitionOverlay) {
      gsap.to(transitionOverlay, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in'
      });
    }
  };

  // Reset progress bar
  const resetProgress = (): void => {
    if (progressBar) {
      gsap.to(progressBar, {
        width: '0%',
        duration: 0.3
      });
    }
  };

  return {
    updateProgress,
    showOverlay,
    hideOverlay,
    resetProgress
  };
};

export const initBarba = (options: BarbaOptions = {}): void => {
  // Don't initialize Barba during SSR
  if (typeof window === 'undefined') return;
  
  // Get options with defaults
  const {
    optimizeWelcomeScreen = false,
    transitionSpeed = 0.6,
    easing = 'power2.out'
  } = options;
  
  const { updateProgress, showOverlay, hideOverlay, resetProgress } = initProgressBar();
  
  // OPTIMIZED: Simple smooth scrolling without GSAP for better performance
  if (typeof document !== 'undefined') {
    document.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      if (target && target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const href = target.getAttribute('href');
        const section = href ? document.querySelector(href) : null;

        if (section) {
          // Use native smooth scrolling for 60fps performance
          section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  }

  // Add smooth scroll behavior to the entire page
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    // Enable smooth scrolling globally
    if (document.documentElement) {
      document.documentElement.style.scrollBehavior = 'smooth';
    }

    // OPTIMIZED: Minimal CSS for performance
    const style = document.createElement('style');
    style.textContent = `
      html {
        scroll-behavior: smooth;
        scroll-snap-type: none !important;
      }

      /* Minimal transitions for performance */
      .smooth-transition {
        transition: opacity 0.2s ease;
      }

      /* Performance-optimized hero */
      .hero-optimized {
        will-change: auto;
        contain: layout style paint;
      }
    `;
    if (document.head) {
      document.head.appendChild(style);
    }
  }

  // Additional transitions for welcome screens if optimizeWelcomeScreen is true
  const welcomeScreenTransition = optimizeWelcomeScreen ? [
    {
      name: 'welcome-screen-transition',
      to: { namespace: ['welcome', 'welcome-screen'] },
      
      leave(data: BarbaData): Promise<void> {
        showOverlay();
        updateProgress(0.4);
        
        return new Promise((resolve) => {
          gsap.to(data.current.container, {
            opacity: 0,
            scale: 0.98,
            y: -10,
            duration: transitionSpeed,
            ease: easing,
            onComplete: () => {
              window.dispatchEvent(new CustomEvent('barbaLeave'));
              updateProgress(0.6);
              resolve();
            }
          });
        });
      },
      
      enter(data: BarbaData): Promise<void> {
        updateProgress(1);
        
        gsap.set(data.next.container, {
          opacity: 0,
          scale: 1.02,
          y: 10
        });
        
        return new Promise((resolve) => {
          gsap.to(data.next.container, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: transitionSpeed,
            ease: easing,
            onComplete: () => {
              window.dispatchEvent(new CustomEvent('barbaEnter'));
              hideOverlay();
              setTimeout(resetProgress, 500);
              resolve();
            }
          });
        });
      }
    }
  ] : [];

  // Initialize Barba
  barba.init({
    debug: process.env.NODE_ENV === 'development',
    timeout: 7000,
    preventRunning: true,
    
    // Define transitions
    transitions: [
      // Default transition
      {
        name: 'default-transition',
        
        // Before leaving current page
        beforeLeave(data: BarbaData): void {
          // Start progress bar
          resetProgress();
          updateProgress(0.1);
        },
        
        // While leaving current page
        leave(data: BarbaData): Promise<void> {
          showOverlay();
          updateProgress(0.4);
          
          return new Promise((resolve) => {
            gsap.to(data.current.container, {
              opacity: 0,
              y: -20,
              duration: transitionSpeed,
              ease: easing,
              onComplete: () => {
                // Dispatch custom event when leaving the page
                window.dispatchEvent(new CustomEvent('barbaLeave'));
                updateProgress(0.6);
                resolve();
              }
            });
          });
        },
        
        // Before entering new page
        beforeEnter(data: BarbaData): void {
          updateProgress(0.8);
          
          // Set initial state for the new page
          gsap.set(data.next.container, {
            opacity: 0,
            y: 20
          });
          
          // Scroll to top when navigating between different pages
          if (data.trigger !== 'back' && data.trigger !== 'forward') {
            window.scrollTo(0, 0);
          }
        },
        
        // While entering new page
        enter(data: BarbaData): Promise<void> {
          updateProgress(1);
          
          return new Promise((resolve) => {
            gsap.to(data.next.container, {
              opacity: 1,
              y: 0,
              duration: transitionSpeed,
              ease: easing,
              onComplete: () => {
                // Dispatch custom event when entering the page
                window.dispatchEvent(new CustomEvent('barbaEnter'));
                hideOverlay();
                
                // Reset progress bar after transition completes
                setTimeout(resetProgress, 500);
                resolve();
              }
            });
          });
        }
      },
      
      // Special transition for hero sections
      {
        name: 'hero-transition',
        to: { namespace: ['hero', 'original-hero', 'business-hero'] },
        
        leave(data: BarbaData): Promise<void> {
          showOverlay();
          updateProgress(0.4);
          
          return new Promise((resolve) => {
            gsap.to(data.current.container, {
              opacity: 0,
              scale: 0.95,
              duration: transitionSpeed + 0.2,
              ease: easing,
              onComplete: () => {
                window.dispatchEvent(new CustomEvent('barbaLeave'));
                updateProgress(0.6);
                resolve();
              }
            });
          });
        },
        
        enter(data: BarbaData): Promise<void> {
          updateProgress(1);
          
          gsap.set(data.next.container, {
            opacity: 0,
            scale: 1.05
          });
          
          return new Promise((resolve) => {
            gsap.to(data.next.container, {
              opacity: 1,
              scale: 1,
              duration: transitionSpeed + 0.2,
              ease: easing,
              onComplete: () => {
                window.dispatchEvent(new CustomEvent('barbaEnter'));
                hideOverlay();
                setTimeout(resetProgress, 500);
                resolve();
              }
            });
          });
        }
      },
      
      // Add welcome screen transition if enabled
      ...welcomeScreenTransition
    ],
    
    // Page-specific scripts or functions
    views: [
      {
        namespace: 'home',
        beforeEnter() {
          console.log('Entering home page');
        },
        afterEnter() {
          // Reinitialize any scripts specific to the home page
        }
      },
      {
        namespace: 'hero',
        afterEnter() {
          console.log('Entering hero section');
          // Reinitialize any scripts specific to hero sections
        }
      },
      
      // Add welcome screen view if optimization is enabled
      ...(optimizeWelcomeScreen ? [{
        namespace: 'welcome-screen',
        afterEnter() {
          console.log('Entering optimized welcome screen');
        }
      }] : [])
    ],
    
    // Prevent Barba from managing certain links
    prevent: ({ el }: { el: HTMLElement }): boolean => {
      const element = el as HTMLAnchorElement;
      return (
        element.classList.contains('no-barba') || 
        (element.hasAttribute('target') && element.target === '_blank') ||
        element.hasAttribute('download') ||
        (element.getAttribute('href') || '').includes('mailto:') ||
        (element.getAttribute('href') || '').includes('tel:') ||
        element.hasAttribute('data-barba-prevent')
      );
    }
  });
  
  // Hook into Barba events for progress indication
  barba.hooks.before(() => {
    if (typeof document !== 'undefined' && document.body) {
      document.body.classList.add('barba-prevent-scroll');
    }
    resetProgress();
  });

  barba.hooks.after(() => {
    if (typeof document !== 'undefined' && document.body) {
      document.body.classList.remove('barba-prevent-scroll');
    }
  });
  
  // Add helpful console messages in development
  if (process.env.NODE_ENV === 'development') {
    barba.hooks.leave(() => console.log('🚀 Leaving page...'));
    barba.hooks.enter(() => console.log('👋 Entering page...'));
    barba.hooks.after(() => console.log('✅ Transition complete!'));
  }
};

// Export a hook to use Barba in React components
export const useBarba = (options: BarbaOptions = {}): void => {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    if (!window.__BARBA_INITIALIZED__) {
      // Ensure DOM is ready before initializing
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          initBarba(options);
          window.__BARBA_INITIALIZED__ = true;
          console.log('🔄 Barba.js initialized after DOM ready');
        });
      } else {
        initBarba(options);
        window.__BARBA_INITIALIZED__ = true;
        console.log('🔄 Barba.js initialized');
      }
    }
  }
};

// Add types for the global window object
declare global {
  interface Window {
    __BARBA_INITIALIZED__?: boolean;
  }
} 