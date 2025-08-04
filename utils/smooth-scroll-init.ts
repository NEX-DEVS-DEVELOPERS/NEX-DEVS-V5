// Smooth Scrolling Initialization
// Enhances all anchor links with smooth scrolling behavior

import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Register GSAP plugins
gsap.registerPlugin(ScrollToPlugin);

interface SmoothScrollOptions {
  duration?: number;
  offsetY?: number;
  ease?: string | number[];
  onComplete?: () => void;
}

export const initSmoothScrolling = (options: SmoothScrollOptions = {}) => {
  const {
    duration = 1.2,
    offsetY = 80,
    ease = "power2.inOut",
    onComplete
  } = options;

  // Don't initialize on server
  if (typeof window === 'undefined') return;

  // Add smooth scrolling to all anchor links
  const addSmoothScrolling = () => {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
      // Remove existing listeners to prevent duplicates
      link.removeEventListener('click', handleSmoothScroll);
      link.addEventListener('click', handleSmoothScroll);
    });
  };

  // Handle smooth scroll click
  const handleSmoothScroll = (e: Event) => {
    e.preventDefault();
    
    const target = e.currentTarget as HTMLAnchorElement;
    const href = target.getAttribute('href');
    
    if (!href || !href.startsWith('#')) return;
    
    const targetElement = document.querySelector(href);
    
    if (targetElement) {
      // Add smooth-scroll-link class for styling
      target.classList.add('smooth-scroll-link');
      
      // Use GSAP for ultra-smooth scrolling
      gsap.to(window, {
        duration,
        scrollTo: {
          y: targetElement,
          offsetY,
          autoKill: true
        },
        ease,
        onComplete: () => {
          // Update URL hash without jumping
          if (history.pushState) {
            history.pushState(null, '', href);
          }
          
          // Call completion callback
          if (onComplete) onComplete();
          
          // Remove the class after animation
          setTimeout(() => {
            target.classList.remove('smooth-scroll-link');
          }, 100);
        }
      });
    }
  };

  // Initialize smooth scrolling
  addSmoothScrolling();

  // Re-initialize when new content is added (for dynamic content)
  const observer = new MutationObserver(() => {
    addSmoothScrolling();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Add scroll-to-top functionality
  const addScrollToTop = () => {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.className = 'scroll-to-top-btn';
    scrollToTopBtn.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: white;
      color: black;
      border: none;
      font-size: 20px;
      font-weight: bold;
      cursor: pointer;
      z-index: 1000;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    `;

    scrollToTopBtn.addEventListener('click', () => {
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: 0 },
        ease: "power2.inOut"
      });
    });

    document.body.appendChild(scrollToTopBtn);

    // Show/hide scroll to top button
    const toggleScrollToTop = () => {
      const scrollY = window.scrollY;
      const shouldShow = scrollY > 300;

      gsap.to(scrollToTopBtn, {
        opacity: shouldShow ? 1 : 0,
        y: shouldShow ? 0 : 20,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    window.addEventListener('scroll', toggleScrollToTop);
    toggleScrollToTop(); // Initial check
  };

  // Add scroll to top button
  addScrollToTop();

  // Add smooth scrolling for programmatic scrolls
  const smoothScrollTo = (target: string | HTMLElement, customOptions?: Partial<SmoothScrollOptions>) => {
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    
    if (element) {
      const finalOptions = { ...options, ...customOptions };
      
      gsap.to(window, {
        duration: finalOptions.duration,
        scrollTo: {
          y: element,
          offsetY: finalOptions.offsetY,
          autoKill: true
        },
        ease: finalOptions.ease,
        onComplete: finalOptions.onComplete
      });
    }
  };

  // Add intersection observer for section animations
  const addSectionAnimations = () => {
    const sections = document.querySelectorAll('section, .section-transition');
    
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    sections.forEach(section => {
      section.classList.add('section-transition');
      sectionObserver.observe(section);
    });
  };

  // Initialize section animations
  addSectionAnimations();

  // Return utility functions
  return {
    scrollTo: smoothScrollTo,
    refresh: addSmoothScrolling,
    destroy: () => {
      observer.disconnect();
      const scrollToTopBtn = document.querySelector('.scroll-to-top-btn');
      if (scrollToTopBtn) {
        scrollToTopBtn.remove();
      }
    }
  };
};

// Export a React hook for easy use in components
export const useSmoothScrolling = (options?: SmoothScrollOptions) => {
  if (typeof window !== 'undefined') {
    return initSmoothScrolling(options);
  }
  return null;
};

// Auto-initialize with default options
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    initSmoothScrolling();
  });
}
