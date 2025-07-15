import { useEffect } from 'react';

/**
 * Hook to enable smooth scrolling behavior
 * Works with both regular anchor links and with Barba.js transitions
 */
export const useSmoothScroll = (): void => {
  useEffect(() => {
    // Don't run during SSR
    if (typeof window === 'undefined') return;
    
    // Add smooth scrolling behavior to the html element
    document.documentElement.style.scrollBehavior = 'smooth';
    
    const handleAnchorClick = (e: MouseEvent): void => {
      const target = e.target as HTMLElement;
      
      // Check if the target is an anchor link
      if (target.tagName === 'A') {
        const href = target.getAttribute('href');
        
        // Process only local anchor links
        if (href && href.startsWith('#')) {
          e.preventDefault();
          
          const targetElement = document.querySelector(href);
          
          if (targetElement) {
            // Use smooth scrolling to the target element
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
            
            // Optionally update URL hash without jumping
            window.history.pushState({}, '', href);
          }
        }
      }
    };
    
    // Add event listener to handle anchor clicks
    document.addEventListener('click', handleAnchorClick);
    
    // Handle Barba.js transitions for smooth page transitions
    window.addEventListener('barbaEnter', () => {
      // Handle hash in URL after page transition
      if (window.location.hash) {
        setTimeout(() => {
          const targetElement = document.querySelector(window.location.hash);
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }, 500); // Delay to ensure page has fully loaded
      }
    });
    
    // Cleanup event listeners
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);
}; 