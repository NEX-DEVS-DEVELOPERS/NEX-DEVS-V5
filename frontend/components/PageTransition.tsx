'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import NeuralNetwork from './animations/NeuralNetwork';

export default function PageTransition() {
  const overlay = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [aiStats, setAiStats] = useState({
    neurons: 0,
    connections: 0,
    iterations: 0,
    status: 'Initializing'
  });
  const [isMobile, setIsMobile] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(0);
  const loadingTexts = [
    'Initializing neural network...',
    'Optimizing connections...',
    'Calibrating AI parameters...',
    'Loading interface...'
  ];

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update AI stats and loading text periodically
  useEffect(() => {
    if (!isFirstLoad) return;
    
    // Initial stats - set immediately to prevent flashing
    setAiStats({
      neurons: Math.floor(Math.random() * 10) + 40,
      connections: Math.floor(Math.random() * 50) + 150,
      iterations: 0,
      status: loadingTexts[0]
    });
    
    // Update iterations counter and loading text
    const statsInterval = setInterval(() => {
      setAiStats(prev => ({
        ...prev,
        iterations: prev.iterations + 1
      }));
    }, 800);

    // Change loading text phases
    const phaseInterval = setInterval(() => {
      setLoadingPhase(prev => {
        const newPhase = (prev + 1) % loadingTexts.length;
        setAiStats(stats => ({
          ...stats,
          status: loadingTexts[newPhase]
        }));
        return newPhase;
      });
    }, 2000);
    
    return () => {
      clearInterval(statsInterval);
      clearInterval(phaseInterval);
    };
  }, [isFirstLoad, loadingTexts]);

  // Initial page load animation with CSS transitions
  useEffect(() => {
    if (isFirstLoad && overlay.current && loadingRef.current) {
      // Pre-load critical elements
      document.querySelectorAll('img[loading="eager"]').forEach(img => {
        const image = new Image();
        image.src = (img as HTMLImageElement).src;
      });

      // Hide page content initially
      const pageContent = document.querySelectorAll('[data-page-content="true"]');
      pageContent.forEach(el => {
        (el as HTMLElement).style.opacity = '0';
      });
          
      // Apply overlay styles
      overlay.current.style.top = '0';
      overlay.current.style.left = '0';
      overlay.current.style.right = '0';
      overlay.current.style.bottom = '0';
      overlay.current.style.zIndex = '9999';
      overlay.current.style.background = 'linear-gradient(45deg, rgba(5,5,9,0.98) 0%, rgba(15,15,19,0.98) 100%)';
      overlay.current.style.pointerEvents = 'all';
      overlay.current.style.opacity = '1';

      // Show loading animation
      if (loadingRef.current) {
        loadingRef.current.style.opacity = '1';
        loadingRef.current.style.transform = 'scale(1)';
      }
      
      // Add progress bar animation class
      const progressBar = document.querySelector('.progress-bar');
      if (progressBar) {
        progressBar.classList.add('progress-bar-animate');
      }
      
      // Set timeout to hide loading screen
      setTimeout(() => {
        // Fade out loading indicator
        if (loadingRef.current) {
          loadingRef.current.style.opacity = '0';
          loadingRef.current.style.transform = 'scale(1)';
        }
        
        // Fade out overlay
            if (overlay.current) {
          overlay.current.style.opacity = '0';
          overlay.current.style.pointerEvents = 'none';
        }
        
        // Show page content
        pageContent.forEach(el => {
          (el as HTMLElement).style.opacity = '1';
          (el as HTMLElement).style.transition = 'opacity 0.4s ease-out';
        });
        
        // Set state to prevent this from running again
        setIsFirstLoad(false);
      }, 2500);
    }
  }, [isFirstLoad]);
  
  // Route change transition with CSS
  useEffect(() => {
    // Skip the first render
    if (isFirstLoad) return;

    // Store current scroll position
    const scrollPosition = window.scrollY;
    
    // Apply fade in effect to page content
    const pageContent = document.querySelectorAll('[data-page-content="true"]');
    pageContent.forEach(el => {
      const element = el as HTMLElement;
      element.style.opacity = '0.95';
      element.style.transition = 'opacity 0.3s ease-out';
      
      // Restore opacity after a short delay
      setTimeout(() => {
        element.style.opacity = '1';
        
        // Restore scroll position
            window.scrollTo(0, scrollPosition);
      }, 50);
    });
  }, [pathname, isFirstLoad]);

  return (
    <>
      <div 
        ref={overlay} 
        className="fixed top-0 left-0 right-0 bottom-0 pointer-events-none z-[9999] flex items-center justify-center transition-opacity duration-400"
      >
        {/* Neural Network Background */}
        <div className="absolute inset-0 z-0">
          <NeuralNetwork 
            color="#a855f7" 
            lineColor="#8b5cf6" 
            pointCount={isMobile ? 25 : 45}
            connectionRadius={isMobile ? 100 : 150}
            speed={0.25}
            containerBounds={false}
          />
        </div>
        
        {/* Clean Container - No Blur */}
        <div 
          ref={loadingRef} 
          className="relative z-20 flex flex-col items-center justify-center px-4 opacity-0 scale-95 transition-all duration-300"
        >
          <div className={`bg-black/50 rounded-2xl ${isMobile ? 'p-5 max-w-[280px]' : 'p-7 max-w-[380px]'} shadow-lg border border-white/10 transform-gpu`}>
            <div className="flex flex-col items-center justify-center">
              <div className={`${isMobile ? 'text-2xl mb-3' : 'text-3xl mb-4'} font-bold tracking-wide`}>
                <span className="text-white">NEX-</span>
                <span className="text-amber-400">DEVS</span>
              </div>
              
              {/* Enhanced progress bar with stable container */}
              <div className={`${isMobile ? 'w-52' : 'w-64'} h-1.5 bg-gray-800/80 rounded-full overflow-hidden mt-3 relative`}>
                <div className="progress-bar h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full absolute top-0 left-0 w-0"></div>
              </div>
              
              {/* AI-related stats */}
              <div className={`${isMobile ? 'text-[10px] mt-3' : 'text-xs mt-4'} text-gray-200 font-mono flex items-center justify-center`}>
                <span className="inline-block animate-pulse mr-2 w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                <span className="animate-pulse-text">{aiStats.status}</span>
              </div>
              
              <div className={`mt-2 grid grid-cols-3 gap-4 ${isMobile ? 'text-[9px]' : 'text-[11px]'} text-gray-300/90 font-mono`}>
                <div className="flex flex-col items-center">
                  <span className="text-purple-300">Neurons</span>
                  <span>{aiStats.neurons}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-purple-300">Links</span>
                  <span>{aiStats.connections}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-purple-300">Iter</span>
                  <span>{aiStats.iterations}</span>
                </div>
              </div>
              
              {/* AI-related quote */}
              <div className={`mt-3 text-center ${isMobile ? 'text-[9px]' : 'text-[10px]'} text-gray-400/80 italic`}>
                "Optimizing neural pathways for enhanced development experience"
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add global styles for animations */}
      <style jsx global>{`
        @keyframes pulseText {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        .animate-pulse-text {
          animation: pulseText 2s infinite ease-in-out;
        }
      `}</style>
    </>
  );
} 