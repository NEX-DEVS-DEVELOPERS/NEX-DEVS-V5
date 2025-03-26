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

// Smooth sliding animation with minimal delay
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    scale: direction < 0 ? 0.92 : 0.95,
    filter: 'blur(4px)',
    rotateY: direction < 0 ? -5 : 0,
    transition: {
      x: { 
        type: "spring", 
        stiffness: direction < 0 ? 160 : 180,
        damping: direction < 0 ? 20 : 22,
        mass: 0.6,
        restSpeed: 0.2,
        restDelta: 0.001,
      },
      opacity: { 
        duration: direction < 0 ? 0.4 : 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
      scale: { 
        duration: direction < 0 ? 0.6 : 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
      filter: { 
        duration: 0.4,
        ease: "easeOut",
      },
      rotateY: {
        duration: direction < 0 ? 0.7 : 0.5,
        ease: [0.22, 1, 0.36, 1],
      }
    }
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    rotateY: 0,
    transition: {
      x: { 
        type: "spring", 
        stiffness: 180,  // Smoother spring motion
        damping: 22,     // Balanced damping
        mass: 0.6,       // Lighter mass for quicker response
        restSpeed: 0.2,
        restDelta: 0.001,
        delay: 0.05      // Minimal delay
      },
      opacity: { 
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.08
      },
      scale: { 
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.05
      },
      filter: { 
        duration: 0.4,
        ease: "easeOut",
        delay: 0.05
      },
      rotateY: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.05
      }
    }
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.95,
    filter: 'blur(4px)',
    rotateY: direction > 0 ? 5 : 0,
    transition: {
      x: { 
        type: "spring", 
        stiffness: 180,
        damping: 22,
        mass: 0.6,
        restSpeed: 0.2,
        delay: 0.02
      },
      opacity: { 
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1]
      },
      scale: { 
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1]
      },
      filter: { 
        duration: 0.3,
        ease: "easeOut"
      },
      rotateY: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  })
};

function WelcomeScreen({ onComplete, initialDirection = -1 }: { onComplete: () => void, initialDirection?: number }) {
  const [currentSlide, setCurrentSlide] = useState(-1);
  const [mounted, setMounted] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const router = useRouter();
  const [direction, setDirection] = useState(initialDirection);

  // Add will-change optimization for better performance
  const willChange = useWillChange();

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
        {/* Dynamic background elements */}
        <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
          {/* Main frosted background with smooth fade in */}
          <motion.div 
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 bg-black/30"
          />
          
          {/* Enhanced Animated gradient orbs with smooth entrance */}
          <div className="absolute inset-0">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, filter: "blur(0px)", y: -100 }}
              animate={{ opacity: 0.1, scale: 1, filter: "blur(24px)", y: 0 }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full animate-pulse"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, filter: "blur(0px)", x: 100 }}
              animate={{ opacity: 0.1, scale: 1, filter: "blur(24px)", x: 0 }}
              transition={{ duration: 1.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full animate-pulse delay-1000"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, filter: "blur(0px)", y: 100 }}
              animate={{ opacity: 0.1, scale: 1, filter: "blur(24px)", y: 0 }}
              transition={{ duration: 1.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full animate-pulse delay-2000"
            />
            
            {/* New animated background elements */}
            <motion.div 
              initial={{ opacity: 0, scale: 0, filter: "blur(0px)" }}
              animate={{ 
                opacity: 0.08, 
                scale: 1.2, 
                filter: "blur(30px)",
                rotate: 360
              }}
              transition={{ 
                duration: 3, 
                delay: 0.6, 
                ease: [0.22, 1, 0.36, 1],
                rotate: {
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }
              }}
              className="absolute top-1/3 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0, filter: "blur(0px)" }}
              animate={{ 
                opacity: 0.08, 
                scale: 1.2, 
                filter: "blur(30px)",
                rotate: -360
              }}
              transition={{ 
                duration: 3, 
                delay: 0.8, 
                ease: [0.22, 1, 0.36, 1],
                rotate: {
                  duration: 25,
                  repeat: Infinity,
                  ease: "linear"
                }
              }}
              className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-pink-500/10 rounded-full"
            />
          </div>

          {/* Enhanced Starry Background with smooth entrance */}
          <div className="absolute inset-0">
            {/* Small twinkling stars with staggered entrance */}
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={`star-${i}`}
                className="absolute w-1 h-1 bg-white rounded-full"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 0.8, 0.1],
                  scale: [0, 1.2, 0.8]
                }}
                transition={{
                  duration: Math.random() * 2 + 1,
                  delay: i * 0.02,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: [0.22, 1, 0.36, 1]
                }}
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
              />
            ))}
            
            {/* Shooting stars with smooth entrance */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={`shooting-star-${i}`}
                className="absolute w-1 h-1 bg-white rounded-full"
                initial={{ 
                  top: `${Math.random() * 50}%`,
                  left: '-5%',
                  opacity: 0,
                  filter: 'blur(0px)'
                }}
                animate={{
                  top: [`${Math.random() * 50}%`, `${Math.random() * 100}%`],
                  left: ['-5%', '105%'],
                  opacity: [0, 1, 0],
                  filter: ['blur(0px)', 'blur(2px)', 'blur(0px)'],
                  scale: [0.5, 1.5, 0.5]
                }}
                transition={{
                  duration: Math.random() * 2 + 2,
                  delay: i * 1.5,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 3 + 2,
                  ease: [0.22, 1, 0.36, 1]
                }}
              />
            ))}
          </div>

          {/* Floating particles with enhanced entrance and glow */}
          <div className="absolute inset-0 opacity-30">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute w-1 h-1 bg-white rounded-full"
                initial={{ 
                  opacity: 0,
                  scale: 0,
                  filter: 'blur(0px)'
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0, 0.8, 0],
                  scale: [0, 1, 0],
                  filter: [
                    'blur(0px)',
                    'blur(2px)',
                    'blur(0px)'
                  ]
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: [0.22, 1, 0.36, 1]
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
              {/* Add close button with fade-in animation */}
              <motion.button
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.3 }}
                whileHover={{ scale: 1.1 }}
                onClick={handleClose}
                className="absolute top-3 right-3 z-50 w-7 h-7 flex items-center justify-center
                         bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm
                         border border-white/20 hover:border-white/40 transition-all duration-300"
              >
                <span className="text-white/80 text-base">×</span>
              </motion.button>

              <motion.div 
                initial={{ 
                  opacity: 0, 
                  y: 40, 
                  scale: 0.9, 
                  rotateX: 10,
                  rotateY: -5
                }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  rotateX: 0,
                  rotateY: 0
                }}
                transition={{ 
                  duration: 0.8, 
                  ease: [0.22, 1, 0.36, 1],
                  opacity: { duration: 0.6 },
                  scale: { duration: 0.7 },
                  rotateX: { duration: 0.8 },
                  rotateY: { duration: 0.8 }
                }}
                className="bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-md rounded-2xl border border-white/10 p-6 sm:p-8 overflow-hidden"
              >
                {/* Decorative elements with staggered entrance */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="absolute top-0 left-0 w-full h-full bg-grid-white/5 bg-grid-16" 
                  />
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.7 }}
                    className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-emerald-500/10" 
                  />
                </motion.div>

                <div className="relative z-10">
                  <motion.div 
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, delay: 0.3 }}
                      className="relative mb-8"
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                        className="absolute h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent top-0 left-0"
                      />
                      <motion.h1 
                        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="text-3xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 py-4 flex flex-col items-center gap-2"
                      >
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.8, delay: 0.6 }}
                        >
                          {"Welcome to".split("").map((char, index) => (
                            <motion.span
                              key={`char-welcome-${index}`}
                              initial={{ opacity: 0, y: 20, rotateY: 90 }}
                              animate={{ opacity: 1, y: 0, rotateY: 0 }}
                              transition={{
                                duration: 0.4,
                                delay: 0.6 + index * 0.04,
                                ease: [0.22, 1, 0.36, 1]
                              }}
                              style={{ display: "inline-block" }}
                            >
                              {char === " " ? "\u00A0" : char}
                            </motion.span>
                          ))}
                        </motion.span>
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.8, delay: 0.8 }}
                        >
                          {"NEX-DEVS".split("").map((char, index) => (
                            <motion.span
                              key={`char-nexdevs-${index}`}
                              initial={{ opacity: 0, y: 20, rotateY: 90 }}
                              animate={{ opacity: 1, y: 0, rotateY: 0 }}
                              transition={{
                                duration: 0.4,
                                delay: 0.8 + index * 0.04,
                                ease: [0.22, 1, 0.36, 1]
                              }}
                              style={{ display: "inline-block" }}
                            >
                              {char === " " ? "\u00A0" : char}
                            </motion.span>
                          ))}
                        </motion.span>
                      </motion.h1>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                        className="absolute h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent bottom-0 left-0"
                      />
                      {/* Animated particles around welcome text */}
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={`particle-${i}`}
                          className="absolute w-1 h-1 bg-blue-400 rounded-full"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0],
                            x: [0, (i % 2 === 0 ? 50 : -50)],
                            y: [0, -30],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: i * 0.2,
                            ease: "easeOut",
                          }}
                          style={{
                            left: `${50 + (i - 1) * 20}%`,
                            top: "50%",
                          }}
                        />
                      ))}
                    </motion.div>

                    <div className="relative">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                        className="text-2xl sm:text-4xl md:text-5xl text-white mb-4 max-w-2xl mx-auto font-bold relative flex flex-col items-center gap-2"
                      >
                        <motion.span
                          initial={{ opacity: 0, y: 20, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ 
                            duration: 0.6, 
                            delay: 1.4,
                            ease: [0.22, 1, 0.36, 1]
                          }}
                          className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300"
                        >
                          AI is the Future
                        </motion.span>
                        <motion.span 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.7 }}
                          className="text-base sm:text-xl md:text-2xl text-gray-300 font-normal"
                        >
                          and We're Here to Build It Together
                        </motion.span>
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.8 }}
                    >
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.9 }}
                        className="text-lg sm:text-xl text-gray-300 mb-8 max-w-3xl mx-auto mt-6"
                      >
                        Transform your digital presence with our 
                        <motion.span 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: 1 }}
                          className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400 font-semibold px-2"
                        >
                          cutting-edge AI solutions
                        </motion.span>
                      </motion.p>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.1 }}
                        className="text-lg sm:text-xl font-medium text-white/90 mb-8"
                      >
                        <motion.span 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.6, delay: 1.2 }}
                          className="inline-block bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg px-4 py-2 border border-purple-500/30"
                        >
                          Discover How AI Elevates Your Business Success
                        </motion.span>
                      </motion.div>
                    </motion.div>

                    <motion.button
                      onClick={handleNext}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 1.3 }}
                      whileHover={{ 
                        scale: 1.05,
                        backgroundColor: ['#4F46E5', '#3B82F6', '#10B981'],
                        transition: { 
                          scale: { duration: 0.2 },
                          backgroundColor: { duration: 1, repeat: Infinity, repeatType: 'reverse' }
                        }
                      }}
                      className="group px-8 py-4 bg-gradient-to-r from-blue-500/80 via-purple-500/80 to-emerald-500/80 rounded-xl text-white font-semibold
                               hover:from-blue-600/80 hover:via-purple-600/80 hover:to-emerald-600/80 transition-all duration-300
                               backdrop-blur-sm border border-white/10 relative overflow-hidden shadow-lg shadow-purple-500/20"
                    >
                      <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 1.4 }}
                        className="relative z-10 flex items-center gap-2"
                      >
                        See What We Offer
                        <motion.svg 
                          className="w-5 h-5" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 1.5 }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </motion.svg>
                      </motion.span>
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
              <div className={`bg-gradient-to-br ${services[currentSlide].color} backdrop-blur-md rounded-xl sm:rounded-2xl 
                             border ${services[currentSlide].accent} p-4 sm:p-6 md:p-8 relative overflow-hidden
                             transform-gpu transition-transform duration-300 hover:scale-[1.02]`}>
                {/* Background patterns */}
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-grid-white/5 bg-grid-16" />
                  <div className={`absolute inset-0 ${services[currentSlide].bgAccent} opacity-30`} />
                </div>

                <div className="relative z-10">
                  <h3 className="text-base sm:text-2xl md:text-3xl font-bold mb-2 text-white/90 drop-shadow-lg relative flex flex-wrap gap-2 items-center">
                    {services[currentSlide].id}. {services[currentSlide].title === 'New 3D Website' ? (
                      <motion.span className="relative inline-flex items-center">
                        New 3D Website
                        {/* Use fewer and more efficient sparkle effects */}
                        {[...Array(4)].map((_, i) => (
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
                          className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs sm:text-sm font-extrabold bg-cyan-500/30 text-cyan-300 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border-2 border-cyan-400/50"
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
                    ) : services[currentSlide].title === 'MOBILE APPS' ? (
                      <motion.span className="relative inline-flex items-center">
                        MOBILE APPS
                        {/* Sparkle effects for Mobile Apps */}
                        {[...Array(4)].map((_, i) => (
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
                    ) : services[currentSlide].title} 
                    <motion.span className="text-purple-400 bg-purple-500/50 px-2 py-1 rounded-lg border border-purple-500/50 font-bold text-sm sm:text-lg">AI</motion.span> 
                    <span className='text-[10px] sm:text-sm text-purple-400 font-normal bg-purple-500/10 px-2 py-1 rounded-lg whitespace-nowrap'>[with AI capabilities]</span>

                    {/* Move badges to right corner for MOBILE APPS */}
                    {services[currentSlide].title === 'MOBILE APPS' && (
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

                  <p className="text-xs sm:text-base text-white/85 mb-3 sm:mb-6 max-w-3xl drop-shadow">
                    {services[currentSlide].description}
                  </p>

                  {/* Enhanced AI Features Section for New 3D Website */}
                  <div className={`bg-black/30 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-4 md:p-6 mb-2 sm:mb-4 border border-purple-500/30
                               relative overflow-hidden group ${services[currentSlide].title === 'New 3D Website' ? 'border-cyan-400/30' : ''}`}>
                    <div className={`absolute inset-0 bg-gradient-to-r 
                      ${services[currentSlide].title === 'New 3D Website' 
                        ? 'from-cyan-500/20 via-blue-500/20 to-cyan-500/20'
                        : 'from-purple-500/20 via-blue-500/20 to-purple-500/20'}
                      opacity-0 group-hover:opacity-100 transition-all duration-500`} />
                    <motion.h4 
                      className="text-sm sm:text-lg font-semibold mb-2 sm:mb-3 text-white/90 drop-shadow flex flex-wrap items-center gap-2"
                      animate={{
                        textShadow: [
                          "0 0 15px rgba(147, 51, 234, 0.5)",
                          "0 0 25px rgba(147, 51, 234, 0.3)",
                          "0 0 15px rgba(147, 51, 234, 0.5)"
                        ]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    >
                      <motion.span 
                        className="text-purple-400 bg-purple-500/50 px-2 py-1 rounded-lg border border-purple-500/50 font-bold text-sm sm:text-lg"
                        animate={{
                          scale: [1, 1.1, 1],
                          borderColor: ["rgba(147, 51, 234, 0.3)", "rgba(147, 51, 234, 0.5)", "rgba(147, 51, 234, 0.3)"]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                      >
                        AI
                      </motion.span> Key Features: <span className='text-[10px] sm:text-sm text-purple-400 font-normal bg-purple-500/10 px-2 py-1 rounded-lg whitespace-nowrap'>Powered by Machine Learning</span>
                    </motion.h4>

                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                      {services[currentSlide].skills.map((skill, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-2 text-[10px] sm:text-sm text-white/80"
                        >
                          <span className="w-1.5 h-1.5 bg-purple-400/50 rounded-full mt-1 flex-shrink-0" />
                          {skill}
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* AI SubFeatures - Enhanced Layout */}
                  {services[currentSlide].subFeatures && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2 sm:mb-4">
                      {services[currentSlide].subFeatures.map((feature, index) => (
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
                          className="bg-purple-500/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-4 
                                   border border-purple-500/20 hover:border-purple-500/30
                                   hover:bg-purple-500/20 transition-all duration-250 hardware-accelerated"
                        >
                          <h5 className="text-xs sm:text-base font-semibold mb-1.5 sm:mb-2 text-purple-200 drop-shadow flex items-center gap-2">
                            <span className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300">AI</span>
                            {feature.title}
                          </h5>
                          <ul className="space-y-1 sm:space-y-1.5">
                            {feature.items.map((item, idx) => (
                              <li key={idx} className="text-[10px] sm:text-sm text-white/80 flex items-center">
                                <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-purple-400/50 mr-1.5 flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Navigation Controls with smoother animations */}
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mt-6 sm:mt-8">
                    <div className="flex gap-4 sm:gap-6 items-center justify-center w-full sm:w-auto">
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
                        className="group relative px-2 sm:px-3 py-1 sm:py-1.5 bg-white/10 backdrop-blur-sm rounded-lg text-white/80 text-xs sm:text-sm font-medium
                                 border border-white/10 hover:bg-white/20
                                 transition-all duration-250 flex items-center gap-1 sm:gap-2 flex-1 sm:flex-none justify-center overflow-hidden will-change-transform"
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
                      <span className="text-[10px] sm:text-xs text-white/70">
                        {currentSlide + 1} of {services.length}
                      </span>
                    </div>
                    <button
                      onClick={handleNext}
                      className={`group px-3 sm:px-4 py-1.5 sm:py-2 backdrop-blur-sm rounded-lg text-white text-xs sm:text-sm font-semibold
                               border hover:scale-105 w-full sm:w-auto transition-all duration-150 
                               relative overflow-hidden order-1 sm:order-2
                               ${currentSlide === services.length - 1 
                                 ? 'bg-gradient-to-r from-purple-500/80 via-blue-500/80 to-emerald-500/80 border-purple-500/30 shadow-lg shadow-purple-500/20' 
                                 : 'bg-white/10 border-white/20 hover:bg-white/20'}`}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-1 sm:gap-2">
                        {currentSlide === services.length - 1 ? 'Get Started ✨' : 'Next →'}
                      </span>
                      {currentSlide === services.length - 1 && (
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