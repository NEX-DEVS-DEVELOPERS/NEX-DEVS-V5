'use client';

import React from 'react';
import { motion, AnimatePresence, useWillChange } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti'; // Import the confetti library

const services = [
  {
    id: 1,
    title: 'MOBILE APPS',
    description: 'Premium iOS and Android applications with advanced AI integration, delivering intelligent experiences that generate passive income through automation.',
    skills: [
      'Cross-Platform AI-Powered Development',
      'Premium AI API Integration',
      'Self-Updating AI Systems with Memory',
      'Passive Income Generation'
    ],
    subFeatures: [
      {
        title: 'iOS & Android Excellence',
        items: [
          'Native Performance Optimization',
          'App Store Ranking Algorithms',
          'Cross-Platform Consistency',
          'Enterprise-Grade Security'
        ]
      },
      {
        title: 'AI Memory & Learning',
        items: [
          'Contextual User Behavior Analysis',
          'Self-Improving Algorithms',
          'Personalized Experience Adaptation',
          'Autonomous Content Generation'
        ]
      }
    ],
    color: 'from-orange-500/30 to-red-600/30',
    accent: 'border-orange-400/50',
    bgAccent: 'bg-orange-500/5'
  },
  {
    id: 2,
    title: 'New 3D Website',
    description: 'Elevate your brand with cutting-edge 3D web experiences featuring stunning animations, immersive interactions, and next-generation performance. Powered by Three.js, Spline, and custom 3D animations for a truly unique digital presence.',
    skills: [
      'Professional 3D Brand Visualization',
      'Interactive 3D Product Showcases',
      'Custom 3D Animation Development',
      'Immersive User Experience Design'
    ],
    subFeatures: [
      {
        title: '3D Technologies',
        items: [
          'Three.js Advanced Rendering',
          'Spline 3D Integration',
          'Custom GLSL Shaders',
          'WebGL Performance Optimization'
        ]
      },
      {
        title: '3D Capabilities',
        items: [
          'Custom 3D Animation Pipeline',
          'Interactive 3D Sections',
          'Real-time 3D Configurators',
          'Responsive 3D Elements'
        ]
      }
    ],
    color: 'from-cyan-500/30 to-cyan-600/30',
    accent: 'border-cyan-400/50',
    bgAccent: 'bg-cyan-500/5'
  },
  {
    id: 3,
    title: 'WordPress Development',
    description: 'AI-Enhanced WordPress solutions featuring advanced automation and intelligent content management systems.',
    skills: [
      'AI-Powered Content Generation & SEO',
      'Smart Media Processing & Optimization',
      'Intelligent User Engagement Systems',
      'Automated Content Scheduling & Distribution'
    ],
    subFeatures: [
      {
        title: 'AI Content Tools',
        items: ['Smart SEO Optimization', 'Ai Agent for content creation', 'Content Performance Analysis']
      },
      {
        title: 'Automation Suite',
        items: ['Smart Publishing', 'Dynamic Templates', 'Intelligent Backups']
      }
    ],
    color: 'from-purple-500/30 to-purple-600/30',
    accent: 'border-purple-400/50',
    bgAccent: 'bg-purple-500/5'
  },
  {
    id: 4,
    title: 'Shopify',
    description: 'AI-Driven e-commerce solutions with advanced analytics and intelligent automation for maximized sales performance.',
    skills: [
      'AI-Powered Product Recommendations',
      'Smart Inventory Management',
      'Predictive Sales Analytics',
      'Automated Customer Segmentation'
    ],
    subFeatures: [
      {
        title: 'Smart Commerce',
        items: ['Dynamic Pricing', 'Inventory Prediction', 'Customer Behavior Analysis']
      },
      {
        title: 'AI Marketing',
        items: ['Automated Campaigns', 'Smart Retargeting', 'Conversion Optimization']
      }
    ],
    color: 'from-green-500/30 to-green-600/30',
    accent: 'border-green-400/50',
    bgAccent: 'bg-green-500/5'
  },
  {
    id: 5,
    title: 'AI Agents',
    description: 'Advanced AI automation solutions featuring intelligent agents and smart systems for enhanced business operations.',
    skills: [
      'Custom AI Agent Development',
      'Automated Workflow Systems',
      'Intelligent Process Automation',
      'Advanced NLP Integration'
    ],
    subFeatures: [
      {
        title: 'AI Applications',
        items: ['Task Automation', 'Smart Decision Systems', 'Process Optimization']
      },
      {
        title: 'Intelligent Systems',
        items: ['Custom AI Models', 'Automated Learning', 'Performance Analytics']
      }
    ],
    color: 'from-violet-600/40 to-fuchsia-600/40',
    accent: 'border-fuchsia-400/50',
    bgAccent: 'bg-violet-500/10'
  },
  {
    id: 6,
    title: 'Web Applications',
    description: 'Enterprise-grade web applications powered by AI, delivering scalable and intelligent solutions for complex business needs.',
    skills: [
      'AI-Enhanced PWA Development',
      'Real-Time AI Processing & Analytics',
      'Smart Authentication Systems',
      'Intelligent Cloud Architecture'
    ],
    subFeatures: [
      {
        title: 'Enterprise AI Solutions',
        items: ['Smart CRM Systems', 'AI-Powered ERP', 'Intelligent Analytics']
      },
      {
        title: 'Advanced SaaS',
        items: ['ML-Based Architecture', 'Intelligent Scaling', 'Smart API Management']
      }
    ],
    color: 'from-yellow-500/30 to-yellow-600/30',
    accent: 'border-yellow-400/50',
    bgAccent: 'bg-yellow-500/5'
  },
  {
    id: 7,
    title: 'Full-Stack Development',
    description: 'Comprehensive AI-integrated development combining advanced Machine Learning with robust cloud-native architecture.',
    skills: [
      'AI-Driven Full Stack Solutions',
      'Advanced ML Model Integration',
      'Intelligent Microservices',
      'Smart Cloud Infrastructure'
    ],
    subFeatures: [
      {
        title: 'AI Integration',
        items: ['Smart Model Training', 'Automated Predictions', 'Intelligent Pipeline']
      },
      {
        title: 'Cloud AI Architecture',
        items: ['Smart Orchestration', 'Intelligent Scaling', 'Automated DevOps']
      }
    ],
    color: 'from-indigo-500/30 to-indigo-600/30',
    accent: 'border-indigo-400/50',
    bgAccent: 'bg-indigo-500/5'
  },
  {
    id: 8,
    title: 'Advanced SEO',
    description: 'AI-Powered SEO strategies utilizing advanced algorithms and Machine Learning for optimal online visibility.',
    skills: [
      'AI-Enhanced Keyword Analysis',
      'Smart Content Optimization',
      'Intelligent Performance Tracking',
      'Automated SEO Workflows'
    ],
    subFeatures: [
      {
        title: 'AI Analytics',
        items: ['Smart Rank Tracking', 'Content Performance AI', 'Automated Reports']
      },
      {
        title: 'Optimization AI',
        items: ['Smart Meta Generation', 'Content Suggestions', 'Trend Analysis']
      }
    ],
    color: 'from-emerald-500/30 to-teal-600/30',
    accent: 'border-emerald-400/50',
    bgAccent: 'bg-emerald-500/5'
  }
];

// Optimize slide variants for smoother transitions and better mobile performance
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.95,
    filter: 'blur(4px)',
    transition: {
      x: { 
        type: "spring", 
        stiffness: 180,
        damping: 20,
        mass: 0.5, // Lower mass for faster response
        restSpeed: 0.01,
      },
      opacity: { duration: 0.4, ease: "easeOut" },
      scale: { duration: 0.4, ease: "easeOut" },
      filter: { duration: 0.3, ease: "easeOut" },
    }
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      x: { 
        type: "spring", 
        stiffness: 200,
        damping: 20,
        mass: 0.5,
        restSpeed: 0.01,
      },
      opacity: { duration: 0.4, ease: "easeOut" },
      scale: { duration: 0.4, ease: "easeOut" },
      filter: { duration: 0.3, ease: "easeOut" },
    }
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.95,
    filter: 'blur(4px)',
    transition: {
      x: { 
        type: "spring", 
        stiffness: 180,
        damping: 20,
        mass: 0.5,
        restSpeed: 0.01,
      },
      opacity: { duration: 0.3, ease: "easeOut" },
      scale: { duration: 0.3, ease: "easeOut" },
      filter: { duration: 0.2, ease: "easeOut" },
    }
  })
};

// Add a modified version of the services data that contains shortened content for mobile
function getServiceContent(isMobile: boolean) {
  // If not mobile, return the original services array
  if (!isMobile) return services;
  
  // Create mobile-optimized version with shorter descriptions and fewer items
  return services.map(service => ({
    ...service,
    description: service.description.split('.')[0] + '.',  // Take just the first sentence
    skills: service.skills.slice(0, 3),  // Limit to top 3 skills
    subFeatures: service.subFeatures?.map(subFeature => ({
      title: subFeature.title,
      items: subFeature.items.slice(0, 2)  // Limit to top 2 items per subFeature
    }))
  }));
}

function WelcomeScreen({ onComplete, initialDirection = -1 }: { onComplete: () => void, initialDirection?: number }) {
  const [currentSlide, setCurrentSlide] = useState(-1);
  const [mounted, setMounted] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const router = useRouter();
  const [direction, setDirection] = useState(initialDirection);
  const [isMobile, setIsMobile] = useState(false);

  // Add will-change optimization for better performance
  const willChange = useWillChange();

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get the appropriate service content based on device type
  const serviceContent = getServiceContent(isMobile);

  useEffect(() => {
    setMounted(true);
    // Add a small delay before showing the content to ensure smooth animation
    const timer = setTimeout(() => {
      setCurrentSlide(-1);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Add entrance animation effect
  useEffect(() => {
    if (mounted) {
      // Simulate the entrance animation completion after a delay
      const timer = setTimeout(() => {
        setAnimationComplete(true);
      }, 2000); // 2 seconds for the entrance animation
      return () => clearTimeout(timer);
    }
  }, [mounted]);

  // Add smooth scroll optimization
  useEffect(() => {
    // Optimize scroll performance
    const optimizeScroll = () => {
      let ticking = false;
      const handleScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            // Perform any scroll-based animations here
            ticking = false;
          });
          ticking = true;
        }
      };
      
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    };

    optimizeScroll();
  }, []);

  // Add performance optimization
  useEffect(() => {
    // Preload critical assets
    const preloadAssets = async () => {
      const criticalImages = document.querySelectorAll('img[data-priority="true"]');
      const imagePromises = Array.from(criticalImages).map((img: any) => {
        return new Promise((resolve) => {
          if (img.complete) resolve(null);
          img.onload = () => resolve(null);
          img.onerror = () => resolve(null);
        });
      });
      await Promise.all(imagePromises);
    };

    preloadAssets();
  }, []);

  // Add close button handler
  const handleClose = () => {
    // Set localStorage to indicate welcome screen was shown
    localStorage.setItem('welcomeScreenShown', 'true');
    onComplete();
  };

  // Handle completion with localStorage
  const handleCompletion = () => {
    localStorage.setItem('welcomeScreenShown', 'true');
    onComplete();
  };

  if (!mounted || localStorage.getItem('welcomeScreenShown')) return null;

  // Update handlers to track direction
  const handleNext = () => {
    setDirection(1);
    if (currentSlide === services.length - 1) {
      // Trigger confetti effect on the last slide
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      handleCompletion();
    } else {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentSlide === -1) {
      return;
    }
    setDirection(-1);
    setCurrentSlide(prev => prev - 1);
  };

  const handleHomeRedirect = () => {
    localStorage.removeItem('welcomeScreenShown'); // Reset the flag to show welcome screen on reload
    window.location.href = '/';  // Redirect to home
  };

  // Add a new function to get optimized transition settings
  const getTransition = (type = "default") => {
    switch (type) {
      case "spring":
        return {
          type: "spring",
          stiffness: 350,
          damping: 30,
          mass: 0.8,
          restDelta: 0.001,
          restSpeed: 0.001,
        };
      case "smooth":
        return {
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1], // Custom cubic-bezier for smooth transitions
        };
      case "stagger":
        return {
          staggerChildren: 0.08,
          delayChildren: 0.1,
        };
      default:
        return {
          duration: 0.5,
          ease: "easeOut",
        };
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pt-24 sm:pt-28">
      {/* Add margin-top to create space for the navigation bar */}
      <div className="absolute inset-0 flex items-center justify-center z-50">
        {/* Dynamic background elements - simplified for mobile */}
        <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
          {/* Main frosted background with smooth fade in */}
          <motion.div 
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 bg-black/30"
          />
          
          {/* Reduced number of gradient orbs for mobile performance */}
          <div className="absolute inset-0">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, filter: "blur(0px)" }}
              animate={{ opacity: 0.1, scale: 1, filter: "blur(16px)" }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-blue-500/10 rounded-full"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, filter: "blur(0px)" }}
              animate={{ opacity: 0.1, scale: 1, filter: "blur(16px)" }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-purple-500/10 rounded-full"
            />
          </div>

          {/* Simplified starry background - reduced elements for mobile */}
          <div className="absolute inset-0">
            {/* Fewer stars for mobile */}
            {[...Array(window.innerWidth < 640 ? 20 : 40)].map((_, i) => (
              <motion.div
                key={`star-${i}`}
                className="absolute w-1 h-1 bg-white rounded-full"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 0.8, 0.1],
                  scale: [0, 1, 0.8]
                }}
                transition={{
                  duration: Math.random() * 2 + 1,
                  delay: i * 0.03,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
        </div>

        <AnimatePresence 
          mode="wait" 
          initial={false} 
          custom={direction}
          onExitComplete={() => {
            // Minimal delay after exit
            setTimeout(() => {
              // Any cleanup or state updates can go here
            }, 20);
          }}
        >
          {currentSlide === -1 ? (
            // Welcome Screen with smoother animations
            <motion.div
              key="welcome"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="relative max-w-3xl w-full mx-4 mt-8 sm:mt-12 will-change-transform perspective-1000"
              style={{ 
                transformStyle: 'preserve-3d',
                perspective: '1000px',
                transformOrigin: direction < 0 ? 'left center' : 'right center'
              }}
            >
              {/* Close button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                whileHover={{ scale: 1.1 }}
                onClick={handleClose}
                className="absolute top-3 right-3 z-50 w-7 h-7 flex items-center justify-center
                         bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm
                         border border-white/20 hover:border-white/40 transition-all duration-300"
              >
                <span className="text-white/80 text-base">×</span>
              </motion.button>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-md rounded-2xl border border-white/10 p-4 sm:p-6 md:p-8 overflow-hidden"
              >
                {/* Background elements */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <div className="absolute inset-0 bg-grid-white/5 bg-grid-16" />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-emerald-500/10" />
                </motion.div>

                <div className="relative z-10">
                  <motion.div 
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="relative mb-4 sm:mb-8"
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="absolute h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent top-0 left-0"
                      />
                      <motion.h1 
                        className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 py-3 flex flex-col items-center gap-1 sm:gap-2"
                      >
                        <span>Welcome to</span>
                        <span>NEX-DEVS</span>
                      </motion.h1>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="absolute h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent bottom-0 left-0"
                      />
                    </motion.div>

                    <div className="relative">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl xs:text-2xl sm:text-3xl md:text-4xl text-white mb-3 max-w-2xl mx-auto font-bold relative flex flex-col items-center gap-1 sm:gap-2"
                      >
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
                          AI is the Future
                        </span>
                        <span className="text-sm xs:text-base sm:text-xl md:text-2xl text-gray-300 font-normal">
                          and We're Here to Build It Together
                        </span>
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <p className="text-sm xs:text-base sm:text-lg text-gray-300 mb-4 sm:mb-6 max-w-3xl mx-auto">
                        Transform your digital presence with our 
                        <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400 font-semibold px-2">
                          cutting-edge AI solutions
                        </span>
                      </p>

                      <div className="text-sm xs:text-base sm:text-lg font-medium text-white/90 mb-4 sm:mb-6">
                        <span className="inline-block bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg px-3 py-1.5 border border-purple-500/30">
                          Discover How AI Elevates Your Business Success
                        </span>
                      </div>
                    </motion.div>

                    <motion.button
                      onClick={handleNext}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      whileHover={{ scale: 1.03 }}
                      className="group px-5 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500/80 via-purple-500/80 to-emerald-500/80 rounded-xl text-white font-semibold
                               hover:from-blue-600/80 hover:via-purple-600/80 hover:to-emerald-600/80 transition-all duration-300
                               backdrop-blur-sm border border-white/10 relative overflow-hidden shadow-lg shadow-purple-500/20"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        See What We Offer
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            // Service Slides with enhanced sliding animations
            <motion.div
              key={`service-${currentSlide}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="relative max-w-4xl w-full mx-4 mt-16 sm:mt-24 will-change-transform perspective-1000"
              style={{ 
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }}
              layoutId={`service-container-${currentSlide}`}
            >
              <div className={`bg-gradient-to-br ${serviceContent[currentSlide].color} backdrop-blur-md rounded-xl sm:rounded-2xl 
                             border ${serviceContent[currentSlide].accent} p-3 sm:p-6 md:p-8 relative overflow-hidden
                             transform-gpu transition-transform duration-300 hover:scale-[1.02]`}>
                {/* Background patterns */}
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-grid-white/5 bg-grid-16" />
                  <div className={`absolute inset-0 ${serviceContent[currentSlide].bgAccent} opacity-30`} />
                </div>

                <div className="relative z-10">
                  <h3 className="text-base sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 text-white/90 drop-shadow-lg relative flex flex-wrap gap-1 sm:gap-2 items-center">
                    {serviceContent[currentSlide].id}. {serviceContent[currentSlide].title === 'New 3D Website' ? (
                      <motion.span className="relative inline-flex items-center">
                        {isMobile ? '3D Website' : 'New 3D Website'}
                        {/* Use fewer and more efficient sparkle effects */}
                        {!isMobile && [...Array(4)].map((_, i) => (
                          <motion.div
                            key={`sparkle-${i}`}
                            className="absolute w-1 h-1 bg-cyan-400 rounded-full hardware-accelerated"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{
                              opacity: [0, 1, 0],
                              scale: [0, 1, 0],
                              x: [0, (i % 2 === 0 ? 12 : -12) * Math.random()],
                              y: [0, -12 * Math.random()],
                            }}
                            transition={{
                              duration: 1.8,
                              repeat: Infinity,
                              repeatDelay: 1 + i * 0.3,
                              ease: "easeInOut",
                              restDelta: 0.01
                            }}
                            style={{
                              left: `${(i * 25) + 50}%`,
                              top: `${Math.random() * 100}%`,
                            }}
                          />
                        ))}
                        {/* NEW badge */}
                        <motion.span
                          className={`absolute ${isMobile ? '-top-4 -right-1 text-[10px]' : '-top-6 left-1/2 transform -translate-x-1/2 text-xs sm:text-sm'} font-extrabold bg-cyan-500/30 text-cyan-300 px-2 py-0.5 rounded-full border ${isMobile ? 'border' : 'border-2'} border-cyan-400/50`}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{
                            scale: [0.8, 1.1, 0.9],
                            opacity: [0.5, 1, 0.8],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse"
                          }}
                        >
                          NEW!
                        </motion.span>
                      </motion.span>
                    ) : serviceContent[currentSlide].title === 'MOBILE APPS' ? (
                      <motion.span className="relative inline-flex items-center">
                        {isMobile ? 'MOBILE APPS' : 'MOBILE APPS'}
                        {/* Sparkle effects for Mobile Apps - only for desktop */}
                        {!isMobile && [...Array(4)].map((_, i) => (
                          <motion.div
                            key={`sparkle-mobile-${i}`}
                            className="absolute w-1 h-1 bg-orange-400 rounded-full hardware-accelerated"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{
                              opacity: [0, 1, 0],
                              scale: [0, 1, 0],
                              x: [0, (i % 2 === 0 ? 12 : -12) * Math.random()],
                              y: [0, -12 * Math.random()],
                            }}
                            transition={{
                              duration: 1.8,
                              repeat: Infinity,
                              repeatDelay: 1 + i * 0.3,
                              ease: "easeInOut",
                              restDelta: 0.01
                            }}
                            style={{
                              left: `${(i * 25) + 50}%`,
                              top: `${Math.random() * 100}%`,
                            }}
                          />
                        ))}
                      </motion.span>
                    ) : serviceContent[currentSlide].title} 
                    <motion.span className="text-purple-400 bg-purple-500/50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg border border-purple-500/50 font-bold text-xs sm:text-lg">AI</motion.span> 
                    {!isMobile && <span className='text-[10px] sm:text-sm text-purple-400 font-normal bg-purple-500/10 px-2 py-1 rounded-lg whitespace-nowrap'>[with AI capabilities]</span>}

                    {/* Move badges to right corner for MOBILE APPS - only show on desktop */}
                    {!isMobile && serviceContent[currentSlide].title === 'MOBILE APPS' && (
                      <div className="absolute top-0 right-0 flex flex-col items-end gap-2 -mt-6 mr-2 sm:mr-4">
                        <motion.div
                          className="flex items-center gap-2"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <motion.span
                            className="text-xs sm:text-sm font-bold bg-gradient-to-r from-orange-500 to-red-500 
                                     text-white px-3 py-1 rounded-full shadow-lg shadow-orange-500/20 
                                     border border-orange-400/50 flex items-center gap-2
                                     hover:shadow-xl hover:shadow-orange-500/30 transition-shadow
                                     backdrop-blur-sm"
                            animate={{
                              scale: [0.95, 1.05, 0.95],
                              rotate: [-2, 2, -2],
                              boxShadow: [
                                '0 10px 15px -3px rgba(251, 146, 60, 0.2)',
                                '0 15px 25px -5px rgba(251, 146, 60, 0.3)',
                                '0 10px 15px -3px rgba(251, 146, 60, 0.2)'
                              ]
                            }}
                            transition={{
                              duration: 4,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            style={{
                              filter: 'drop-shadow(0 0 10px rgba(251, 146, 60, 0.3))'
                            }}
                          >
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                            <span className="relative">
                              NEWLY ADDED
                              <motion.span
                                className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-400/20 blur-sm"
                                animate={{
                                  opacity: [0.5, 1, 0.5]
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                              />
                            </span>
                          </motion.span>
                        </motion.div>
                      </div>
                    )}
                  </h3>

                  <p className={`text-xs sm:text-base text-white/85 ${isMobile ? 'mb-2' : 'mb-3 sm:mb-6'} max-w-3xl drop-shadow`}>
                    {serviceContent[currentSlide].description}
                  </p>

                  {/* Enhanced AI Features Section for New 3D Website */}
                  <div className={`bg-black/30 backdrop-blur-sm rounded-lg sm:rounded-xl ${isMobile ? 'p-2' : 'p-2 sm:p-4 md:p-6'} mb-2 sm:mb-4 border border-purple-500/30
                               relative overflow-hidden group ${serviceContent[currentSlide].title === 'New 3D Website' ? 'border-cyan-400/30' : ''}`}>
                    <div className={`absolute inset-0 bg-gradient-to-r 
                      ${serviceContent[currentSlide].title === 'New 3D Website' 
                        ? 'from-cyan-500/20 via-blue-500/20 to-cyan-500/20'
                        : 'from-purple-500/20 via-blue-500/20 to-purple-500/20'}
                      opacity-0 group-hover:opacity-100 transition-all duration-500`} />
                    <motion.h4 
                      className={`${isMobile ? 'text-xs' : 'text-sm sm:text-lg'} font-semibold mb-1.5 sm:mb-3 text-white/90 drop-shadow flex flex-wrap items-center gap-1 sm:gap-2`}
                      animate={!isMobile ? {
                        textShadow: [
                          "0 0 15px rgba(147, 51, 234, 0.5)",
                          "0 0 25px rgba(147, 51, 234, 0.3)",
                          "0 0 15px rgba(147, 51, 234, 0.5)"
                        ]
                      } : {}}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    >
                      <motion.span 
                        className={`text-purple-400 bg-purple-500/50 ${isMobile ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-sm sm:text-lg'} rounded-lg border border-purple-500/50 font-bold`}
                        animate={!isMobile ? {
                          scale: [1, 1.1, 1],
                          borderColor: ["rgba(147, 51, 234, 0.3)", "rgba(147, 51, 234, 0.5)", "rgba(147, 51, 234, 0.3)"]
                        } : {}}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                      >
                        AI
                      </motion.span> 
                      {isMobile ? 'Features:' : 'Key Features:'} 
                      {!isMobile && <span className='text-[10px] sm:text-sm text-purple-400 font-normal bg-purple-500/10 px-2 py-1 rounded-lg whitespace-nowrap'>Powered by Machine Learning</span>}
                    </motion.h4>

                    <ul className={`grid ${isMobile ? 'grid-cols-1 gap-1' : 'grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2'}`}>
                      {serviceContent[currentSlide].skills.map((skill, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`flex items-start gap-1.5 sm:gap-2 ${isMobile ? 'text-[10px]' : 'text-[10px] sm:text-sm'} text-white/80`}
                        >
                          <span className={`${isMobile ? 'w-1 h-1' : 'w-1.5 h-1.5'} bg-purple-400/50 rounded-full mt-1 flex-shrink-0`} />
                          {skill}
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* AI SubFeatures - Enhanced Layout */}
                  {serviceContent[currentSlide].subFeatures && (
                    <div className={`grid ${isMobile ? 'grid-cols-1 gap-1.5' : 'grid-cols-1 sm:grid-cols-2 gap-2'} mb-2 sm:mb-4`}>
                      {serviceContent[currentSlide].subFeatures.map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 250,
                            damping: 25,
                            delay: 0.2 + index * 0.05,
                            restDelta: 0.01
                          }}
                          className={`bg-purple-500/10 backdrop-blur-sm rounded-lg sm:rounded-xl ${isMobile ? 'p-1.5' : 'p-2 sm:p-4'} 
                                   border border-purple-500/20 hover:border-purple-500/30
                                   hover:bg-purple-500/20 transition-all duration-250 hardware-accelerated`}
                        >
                          <h5 className={`${isMobile ? 'text-[10px] mb-1' : 'text-xs sm:text-base mb-1.5 sm:mb-2'} font-semibold text-purple-200 drop-shadow flex items-center gap-1.5 sm:gap-2`}>
                            <span className={`${isMobile ? 'text-[8px] px-1 py-0.5' : 'text-[10px] sm:text-xs px-1.5 py-0.5'} rounded-full bg-purple-500/20 text-purple-300`}>AI</span>
                            {feature.title}
                          </h5>
                          <ul className={`${isMobile ? 'space-y-0.5' : 'space-y-1 sm:space-y-1.5'}`}>
                            {feature.items.map((item, idx) => (
                              <li key={idx} className={`${isMobile ? 'text-[8px]' : 'text-[10px] sm:text-sm'} text-white/80 flex items-center`}>
                                <span className={`${isMobile ? 'w-0.5 h-0.5 mr-1' : 'w-1 h-1 sm:w-1.5 sm:h-1.5 mr-1.5'} rounded-full bg-purple-400/50 flex-shrink-0`} />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Navigation Controls with smoother animations */}
                  <div className={`flex ${isMobile ? 'flex-row justify-between mt-3' : 'flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mt-6 sm:mt-8'}`}>
                    <div className={`flex ${isMobile ? 'gap-2' : 'gap-4 sm:gap-6'} items-center justify-center ${isMobile ? '' : 'w-full sm:w-auto'}`}>
                      <motion.button
                        onClick={handleBack}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ 
                          scale: 1.02,
                          transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] }
                        }}
                        whileTap={{ 
                          scale: 0.98,
                          transition: { duration: 0.1 }
                        }}
                        transition={{ 
                          duration: 0.25,
                          ease: [0.22, 1, 0.36, 1]
                        }}
                        className={`group relative ${isMobile ? 'px-2 py-1 text-[10px]' : 'px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm'} bg-white/10 backdrop-blur-sm rounded-lg text-white/80 font-medium
                                 border border-white/10 hover:bg-white/20
                                 transition-all duration-250 flex items-center gap-1 sm:gap-2 ${isMobile ? '' : 'flex-1 sm:flex-none'} justify-center overflow-hidden will-change-transform`}
                      >
                        <motion.span
                          className="relative z-10 flex items-center gap-1 hardware-accelerated"
                          animate={{
                            x: [0, -2, 0],
                          }}
                          transition={{
                            duration: 0.25,
                            ease: "easeInOut",
                          }}
                        >
                          <motion.span
                            animate={{
                              opacity: [1, 0.7, 1],
                            }}
                            transition={{
                              duration: 0.15,
                            }}
                          >
                            ←
                          </motion.span>
                          Back
                        </motion.span>
                        <motion.div
                          className="absolute inset-0 bg-white/10"
                          initial={{ scale: 0, opacity: 0 }}
                          whileTap={{
                            scale: 4,
                            opacity: 0,
                            transition: { duration: 0.2 }
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30
                          }}
                        />
                      </motion.button>
                      {!isMobile && (
                        <span className="text-[10px] sm:text-xs text-white/70">
                          {currentSlide + 1} of {services.length}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={handleNext}
                      className={`group ${isMobile ? 'px-2 py-1 text-[10px]' : 'px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm'} backdrop-blur-sm rounded-lg text-white font-semibold
                               border hover:scale-105 ${isMobile ? '' : 'w-full sm:w-auto'} transition-all duration-150 
                               relative overflow-hidden ${isMobile ? '' : 'order-1 sm:order-2'}
                               ${currentSlide === services.length - 1 
                                 ? 'bg-gradient-to-r from-purple-500/80 via-blue-500/80 to-emerald-500/80 border-purple-500/30 shadow-lg shadow-purple-500/20' 
                                 : 'bg-white/10 border-white/20 hover:bg-white/20'}`}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-1 sm:gap-2">
                        {currentSlide === services.length - 1 ? (isMobile ? 'Start ✨' : 'Get Started ✨') : 'Next →'}
                      </span>
                      {!isMobile && currentSlide === services.length - 1 && (
                        <React.Fragment>
                          {/* Celebration particles - Optimized animations */}
                          <div className="absolute -top-1 left-0 w-full hidden sm:block">
                            {[...Array(3)].map((_, i) => (
                              <motion.div
                                key={i}
                                initial={{ y: 0, opacity: 0 }}
                                animate={{
                                  y: [-20, -40],
                                  opacity: [0, 1, 0],
                                  x: [(i - 1) * 20, (i - 1) * 30]
                                }}
                                transition={{
                                  duration: 1.5,
                                  ease: "easeInOut",
                                  repeat: Infinity,
                                  delay: i * 0.2
                                }}
                                className="absolute w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full transform-gpu"
                                style={{
                                  left: `${25 + i * 25}%`,
                                  backgroundColor: i === 0 ? '#A855F7' : i === 1 ? '#60A5FA' : '#34D399'
                                }}
                              />
                            ))}
                          </div>
                          {/* Optimize the gradient background animation */}
                          <motion.div
                            animate={{ opacity: [0.3, 0.5, 0.3] }}
                            transition={{
                              duration: 2.5,
                              ease: "linear",
                              repeat: Infinity,
                              repeatType: "reverse"
                            }}
                            className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-emerald-500/20 blur-lg hardware-accelerated"
                          />
                        </React.Fragment>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// This is now the only export
export default React.memo(WelcomeScreen);