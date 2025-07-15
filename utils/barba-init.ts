import barba from '@barba/core';
import { gsap } from 'gsap';

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

export const initBarba = (): void => {
  // Don't initialize Barba during SSR
  if (typeof window === 'undefined') return;
  
  const { updateProgress, showOverlay, hideOverlay, resetProgress } = initProgressBar();
  
  // Handle smooth scrolling for all anchor links
  document.addEventListener('click', (e: Event) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
      e.preventDefault();
      const href = target.getAttribute('href');
      const section = document.querySelector(href || '');
      
      if (section) {
        // Smooth scroll to section (native implementation)
        section.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });

  // Initialize Barba
  barba.init({
    debug: process.env.NODE_ENV === 'development',
    timeout: 7000,
    preventRunning: true,
    
    // Define transitions
    transitions: [
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
              duration: 0.6,
              ease: 'power2.inOut',
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
              duration: 0.6,
              ease: 'power2.out',
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
              duration: 0.8,
              ease: 'power2.inOut',
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
              duration: 0.8,
              ease: 'power2.out',
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
      }
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
    document.body.classList.add('barba-prevent-scroll');
    resetProgress();
  });
  
  barba.hooks.after(() => {
    document.body.classList.remove('barba-prevent-scroll');
  });
  
  // Add helpful console messages in development
  if (process.env.NODE_ENV === 'development') {
    barba.hooks.leave(() => console.log('🚀 Leaving page...'));
    barba.hooks.enter(() => console.log('👋 Entering page...'));
    barba.hooks.after(() => console.log('✅ Transition complete!'));
  }
};

// Export a hook to use Barba in React components
export const useBarba = (): void => {
  if (typeof window !== 'undefined') {
    if (!window.__BARBA_INITIALIZED__) {
      initBarba();
      window.__BARBA_INITIALIZED__ = true;
      console.log('🔄 Barba.js initialized');
    }
  }
};

// Add types for the global window object
declare global {
  interface Window {
    __BARBA_INITIALIZED__?: boolean;
  }
} 