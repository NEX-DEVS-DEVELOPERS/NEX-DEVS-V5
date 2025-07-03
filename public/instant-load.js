// Instant Color Shift Prevention - Load this FIRST in <head>
(function() {
  'use strict';
  
  // Apply critical CSS immediately
  const criticalCSS = `
    html { 
      visibility: hidden !important; 
      opacity: 0 !important; 
    }
    * { 
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
    }
    .text-transparent,
    .bg-clip-text,
    [class*="from-"],
    [class*="via-"],
    [class*="to-"],
    .gradient-text,
    [style*="background-clip: text"] {
      transform: translateZ(0) !important;
      backface-visibility: hidden !important;
      -webkit-font-smoothing: antialiased !important;
      -moz-osx-font-smoothing: grayscale !important;
      contain: layout style paint !important;
    }
    nav, header, button, .btn, .card,
    h1, h2, h3, h4, h5, h6, p, span, a {
      transform: translateZ(0);
      backface-visibility: hidden;
    }
    .gsap-mesh-float,
    .gsap-gradient-animation,
    .gsap-blob,
    .mesh-background,
    .animated-background {
      opacity: 0;
      visibility: hidden;
    }
  `;
  
  // Inject critical CSS immediately
  const style = document.createElement('style');
  style.textContent = criticalCSS;
  document.head.insertBefore(style, document.head.firstChild);
  
  // Prevent any flashing
  document.documentElement.style.setProperty('visibility', 'hidden', 'important');
  document.documentElement.style.setProperty('opacity', '0', 'important');
  
  // Show page when everything is ready
  function showPage() {
    // Wait for fonts and critical resources
    Promise.all([
      document.fonts ? document.fonts.ready : Promise.resolve(),
      new Promise(resolve => {
        if (document.readyState === 'complete') {
          resolve();
        } else {
          window.addEventListener('load', resolve);
        }
      })
    ]).then(() => {
      // Small delay to ensure everything is stable
      setTimeout(() => {
        // Apply hardware acceleration to all gradient elements
        const gradientElements = document.querySelectorAll(`
          .text-transparent, .bg-clip-text, [class*="from-"], [class*="via-"], [class*="to-"],
          .gradient-text, [style*="background-clip: text"], [style*="-webkit-background-clip: text"]
        `);
        
        gradientElements.forEach(el => {
          el.style.transform = 'translateZ(0)';
          el.style.backfaceVisibility = 'hidden';
          el.style.webkitFontSmoothing = 'antialiased';
          el.style.mozOsxFontSmoothing = 'grayscale';
          el.style.contain = 'layout style paint';
          // Force repaint
          el.offsetHeight;
        });
        
        // Apply hardware acceleration to common elements
        const commonElements = document.querySelectorAll('nav, header, button, .btn, .card, h1, h2, h3, h4, h5, h6, p, span, a');
        commonElements.forEach(el => {
          el.style.transform = 'translateZ(0)';
          el.style.backfaceVisibility = 'hidden';
        });
        
        // Show page smoothly
        document.documentElement.classList.add('loaded');
        document.documentElement.style.setProperty('visibility', 'visible', 'important');
        document.documentElement.style.setProperty('opacity', '1', 'important');
        document.documentElement.style.transition = 'opacity 0.3s ease-in-out';
        
        // Enable background animations after a delay
        setTimeout(() => {
          const bgElements = document.querySelectorAll(`
            .gsap-mesh-float, .gsap-gradient-animation, .gsap-blob,
            .mesh-background, .animated-background
          `);
          
          bgElements.forEach((el, index) => {
            setTimeout(() => {
              el.style.opacity = '1';
              el.style.visibility = 'visible';
              el.style.transition = 'opacity 0.5s ease-in-out';
              el.classList.add('loaded');
            }, index * 100);
          });
        }, 300);
        
      }, 150);
    });
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showPage);
  } else {
    showPage();
  }
  
  // Emergency fallback - show page after 3 seconds no matter what
  setTimeout(() => {
    if (document.documentElement.style.opacity === '0') {
      console.warn('Emergency color shift fallback activated');
      document.documentElement.style.setProperty('visibility', 'visible', 'important');
      document.documentElement.style.setProperty('opacity', '1', 'important');
    }
  }, 3000);
  
})();
