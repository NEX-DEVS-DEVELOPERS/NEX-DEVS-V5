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

// Add tech stack data
const techStack = [
  { name: 'Next.js', color: 'text-white', importance: 'critical' },
  { name: 'TypeScript', color: 'text-blue-500', importance: 'critical' },
  { name: 'Python', color: 'text-yellow-400', importance: 'critical' },
  { name: 'React', color: 'text-blue-400', importance: 'critical' },
  { name: 'Flutter', color: 'text-cyan-400', importance: 'critical' },
  { name: 'Node.js', color: 'text-green-500', importance: 'critical' },
  { name: 'JavaScript', color: 'text-yellow-300', importance: 'critical' },
  { name: 'AWS', color: 'text-orange-400', importance: 'critical' },
  { name: 'React Native', color: 'text-blue-300', importance: 'critical' },
  { name: 'Java', color: 'text-red-400', importance: 'critical' },
  { name: 'PostgreSQL', color: 'text-blue-600', importance: 'critical' },
  { name: 'MongoDB', color: 'text-green-600', importance: 'medium' },
  { name: 'Firebase', color: 'text-yellow-500', importance: 'medium' },
  { name: 'TensorFlow', color: 'text-orange-500', importance: 'medium' },
  { name: 'Docker', color: 'text-blue-600', importance: 'medium' },
  { name: 'GraphQL', color: 'text-pink-500', importance: 'medium' },
  { name: 'Three.js', color: 'text-purple-400', importance: 'medium' },
  { name: 'Framer Motion', color: 'text-purple-500', importance: 'medium' }
];

// Enhance slide variants for smoother transitions with performance optimizations
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.94,
    filter: 'blur(6px)',
    rotateY: direction > 0 ? '5deg' : '-5deg', // Reduced rotation for smoother animation
    transition: {
      x: { 
        type: "spring", // Changed to spring for smoother motion
        stiffness: 300,
        damping: 35, // Increased damping for smoother motion
        mass: 0.7, // Reduced mass for quicker response
        restDelta: 0.0005 // Smaller restDelta for more precision
      },
      opacity: { duration: 0.4, ease: [0.33, 1, 0.68, 1] }, // Modern cubic-bezier ease
      scale: { duration: 0.5, ease: [0.33, 1, 0.68, 1] },
      filter: { duration: 0.35, ease: [0.33, 1, 0.68, 1] },
      rotateY: { duration: 0.35, ease: [0.33, 1, 0.68, 1] },
    }
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    rotateY: '0deg',
    transition: {
      x: { 
        type: "spring", // Spring physics for smoother motion
        stiffness: 400, // Increased stiffness for more responsive animation
        damping: 40, // Increased damping for less oscillation
        mass: 0.6, // Reduced mass for quicker, more refined movement
        restDelta: 0.0005 // Smaller restDelta for more precision
      },
      opacity: { duration: 0.4, ease: [0.33, 1, 0.68, 1] },
      scale: { duration: 0.5, ease: [0.33, 1, 0.68, 1] },
      filter: { duration: 0.35, ease: [0.33, 1, 0.68, 1] },
      rotateY: { duration: 0.35, ease: [0.33, 1, 0.68, 1] },
    }
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.94,
    filter: 'blur(6px)',
    rotateY: direction < 0 ? '5deg' : '-5deg', // Reduced rotation for smoother animation
    transition: {
      x: { 
        type: "spring", // Spring physics for smoother motion
        stiffness: 300,
        damping: 35, // Increased damping for smoother motion
        mass: 0.7, // Reduced mass for quicker response
        restDelta: 0.0005 // Smaller restDelta for more precision
      },
      opacity: { duration: 0.4, ease: [0.33, 1, 0.68, 1] },
      scale: { duration: 0.5, ease: [0.33, 1, 0.68, 1] },
      filter: { duration: 0.35, ease: [0.33, 1, 0.68, 1] },
      rotateY: { duration: 0.35, ease: [0.33, 1, 0.68, 1] },
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

  // Add effect to prevent body scrolling when welcome screen is shown
  useEffect(() => {
    if (mounted) {
      // Prevent scrolling on the body
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      
      return () => {
        // Restore scrolling when unmounted
        document.body.style.overflow = '';
        document.body.style.height = '';
        document.body.style.position = '';
        document.body.style.width = '';
      };
    }
  }, [mounted]);

  // Get the appropriate service content based on device type
  const serviceContent = getServiceContent(isMobile);

  useEffect(() => {
    if (!localStorage.getItem('welcomeScreenShown')) {
      setMounted(true);
      // Add a small delay before showing the content to ensure smooth animation
      const timer = setTimeout(() => {
        setCurrentSlide(-1);
      }, 100);
      return () => clearTimeout(timer);
    }
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

  if (!mounted) return null;

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

  // Add function to render moving gradient lines - updated to not overlap content
  const renderGradientLines = () => {
    if (isMobile) return null;
    
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]"> {/* Added z-index to stay behind content */}
        {/* Enhanced lines with better visibility but lower z-index */}
        {[...Array(5)].map((_, i) => {
          const topPosition = 20 + i * 15;  // Adjusted positions
          const isEven = i % 2 === 0;
          const duration = 10 + i * 2;      // Slower, more elegant movement
          
          return (
            <motion.div
              key={`line-${i}`}
              className={`absolute h-[2.5px] bg-gradient-to-r 
                        ${isEven 
                          ? 'from-transparent via-blue-500/30 to-purple-500/30' 
                          : 'from-transparent via-purple-500/30 to-emerald-500/30'}`}
              style={{
                filter: 'drop-shadow(0 0 4px rgba(125, 125, 255, 0.3))',
                boxShadow: isEven ? '0 0 8px rgba(59, 130, 246, 0.3)' : '0 0 8px rgba(168, 85, 247, 0.3)',
                zIndex: 1, // Lower z-index so it doesn't overlap content
                width: "120%",
                willChange: "transform, opacity" // Performance optimization
              }}
              initial={{ 
                left: isEven ? "100%" : "-120%",
                top: `${topPosition}%`,
                opacity: 0
              }}
              animate={{ 
                left: isEven ? "-120%" : "100%",
                opacity: [0, 0.6, 0.6, 0]
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                ease: "linear",
                repeatType: "loop",
                delay: i * 0.2 // Reduced delay for faster initial appearance
              }}
            />
          );
        })}
      </div>
    );
  };

  // Add function to render tech stack floating texts
  const renderTechStack = () => {
    if (isMobile || currentSlide !== -1) return null; // Only show on welcome screen
    
    // Filter for critical tech stack items
    const criticalTech = techStack.filter(tech => tech.importance === 'critical');
    
    // Define specific positions for each technology to avoid overlap and focus on empty areas
    const techPositions = [
      { name: 'Next.js', x: '8%', y: '15%', delay: 0, speed: 5 },
      { name: 'TypeScript', x: '92%', y: '22%', delay: 0.2, speed: 6 },
      { name: 'Python', x: '15%', y: '85%', delay: 0.7, speed: 7 },
      { name: 'React', x: '88%', y: '75%', delay: 0.4, speed: 8 },
      { name: 'Flutter', x: '12%', y: '32%', delay: 0.9, speed: 6 },
      { name: 'Node.js', x: '90%', y: '35%', delay: 0.6, speed: 7 },
      { name: 'JavaScript', x: '6%', y: '65%', delay: 0.3, speed: 5 },
      { name: 'AWS', x: '85%', y: '55%', delay: 0.8, speed: 8 },
      { name: 'React Native', x: '7%', y: '48%', delay: 0.5, speed: 7 },
      { name: 'Java', x: '94%', y: '88%', delay: 0.1, speed: 6 },
      { name: 'PostgreSQL', x: '10%', y: '75%', delay: 0.4, speed: 5 }
    ];
    
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {criticalTech.map((tech, i) => {
          // Find the position for this tech or use a fallback
          const position = techPositions.find(pos => pos.name === tech.name) || 
                           { x: `${10 + (i * 8)}%`, y: `${20 + (i * 7)}%`, delay: i * 0.2, speed: 6 };
          
          // Calculate path radius - different for each tech badge
          const radius = 5 + Math.random() * 5; // Random radius between 5-10px
          
          return (
            <motion.div
              key={`tech-${tech.name}`}
              className={`absolute ${tech.color} text-opacity-75 font-mono text-sm font-medium flex items-center gap-2 px-3 py-0.5 rounded-full bg-gray-900/50 backdrop-blur-sm border border-current border-opacity-30`}
              initial={{ 
                opacity: 0.6,
                left: position.x,
                top: position.y,
                scale: 0.9
              }}
              animate={{ 
                x: [radius, -radius, radius], 
                y: [radius, -radius, radius],
                opacity: [0.6, 0.8, 0.6],
                scale: [0.95, 1.05, 0.95]
              }}
              transition={{
                x: {
                  duration: position.speed + Math.random(),
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatType: "reverse"
                },
                y: {
                  duration: position.speed + Math.random() * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatType: "reverse",
                  delay: position.delay
                },
                opacity: {
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatType: "reverse"
                },
                scale: {
                  duration: 6 + Math.random() * 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatType: "reverse"
                }
              }}
              style={{
                boxShadow: '0 3px 10px rgba(0, 0, 0, 0.25)',
                textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
                transform: `translate(-50%, -50%)`,
                zIndex: 5
              }}
            >
              <motion.span 
                className="w-2 h-2 bg-current rounded-full opacity-80"
                animate={{ 
                  opacity: [0.5, 0.9, 0.5],
                  scale: [0.8, 1.2, 0.8]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              {tech.name}
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999] overflow-hidden" 
         style={{ 
           position: 'fixed', 
           top: 0, 
           left: 0, 
           right: 0, 
           bottom: 0, 
           height: '100vh', 
           width: '100vw', 
           margin: 0, 
           padding: 0,
           overscrollBehavior: 'none' // Prevent bounce effects
         }}>
      {/* Dark overlay with better visibility */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 1 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <div className="absolute inset-0 flex items-center justify-center z-[9999]" 
           style={{ 
             display: 'flex', 
             alignItems: 'center', 
             justifyContent: 'center',
             paddingBottom: '2vh' // Add slight bottom padding for better vertical alignment
           }}>
        {/* Dynamic background elements - optimized for visibility and performance */}
        <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
          {/* Main background with enhanced visibility */}
          <motion.div 
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 1, backdropFilter: "blur(8px)" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-0 bg-black/50"
            style={{
              WebkitBackdropFilter: "blur(8px)",
              willChange: "backdrop-filter", // Performance optimization
              position: 'absolute',
              top: 0,
              left: 0, 
              right: 0,
              bottom: 0
            }}
          />
          
          {/* Gradient orbs with improved visibility */}
          <div className="absolute inset-0 z-[1]"> {/* Added z-index */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.12, scale: 1 }}
              transition={{ 
                duration: 0.7, 
                ease: "easeOut",
                opacity: {
                  duration: 0.8,
                  ease: [0.33, 1, 0.68, 1]
                },
                scale: {
                  duration: 0.8,
                  ease: [0.33, 1, 0.68, 1]
                }
              }}
              className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-blue-600/30 rounded-full"
              style={{ 
                filter: 'blur(50px)',
                willChange: "opacity, transform" // Performance optimization
              }}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.12, scale: 1 }}
              transition={{ 
                duration: 0.7, 
                delay: 0.1, 
                ease: "easeOut",
                opacity: {
                  duration: 0.8,
                  ease: [0.33, 1, 0.68, 1]
                },
                scale: {
                  duration: 0.8,
                  ease: [0.33, 1, 0.68, 1]
                }
              }}
              className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-purple-600/30 rounded-full"
              style={{ 
                filter: 'blur(50px)',
                willChange: "opacity, transform" // Performance optimization
              }}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.12, scale: 1 }}
              transition={{ 
                duration: 0.7, 
                delay: 0.15, 
                ease: "easeOut",
                opacity: {
                  duration: 0.8,
                  ease: [0.33, 1, 0.68, 1]
                },
                scale: {
                  duration: 0.8,
                  ease: [0.33, 1, 0.68, 1]
                }
              }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-[30rem] sm:h-[30rem] bg-black/40 rounded-full"
              style={{ 
                filter: 'blur(60px)',
                willChange: "opacity, transform" // Performance optimization
              }}
            />
          </div>

          {/* Add moving gradient lines - now with proper z-index */}
          {renderGradientLines()}

          {/* Add tech stack background only on welcome screen */}
          {renderTechStack()}

          {/* Simplified starry background with performance optimizations */}
          <div className="absolute inset-0 z-[1]"> {/* Added z-index */}
            {/* Fewer stars with better performance */}
            {[...Array(window.innerWidth < 640 ? 15 : 30)].map((_, i) => (
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
                  willChange: "opacity, transform" // Performance optimization
                }}
              />
            ))}
          </div>

          {/* Add new floating particles effect with performance optimizations */}
          <motion.div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]"> {/* Added z-index */}
            {[...Array(12)].map((_, i) => ( // Reduced number of particles
              <motion.div
                key={`particle-${i}`}
                className="absolute w-1 h-1 bg-white/10 rounded-full"
                initial={{ 
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  scale: 0
                }}
                animate={{
                  y: [null, -15, 15],
                  x: [null, -15, 15],
                  scale: [0, 1, 0],
                  opacity: [0, 0.5, 0]
                }}
                transition={{
                  duration: 2.5 + Math.random() * 1.5, // Reduced duration
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                  delay: i * 0.15,
                }}
                style={{
                  willChange: "transform, opacity" // Performance optimization
                }}
              />
            ))}
          </motion.div>
        </div>

        <AnimatePresence 
          mode="wait" 
          initial={false} 
          custom={direction}
          onExitComplete={() => {
            // Minimal delay after exit
            setTimeout(() => {
              // Any cleanup or state updates can go here
            }, 10); // Reduced timeout for better performance
          }}
        >
          <div className="flex items-center justify-center w-full h-full" 
               style={{ 
                 padding: '0', 
                 margin: '0 auto', 
                 paddingBottom: '5vh', // Add bottom spacing for better centering
                 maxWidth: '95vw'  // Ensure content doesn't overflow on small screens
               }}>
            {currentSlide === -1 ? (
              // Welcome Screen with performance optimizations
              <motion.div
                key="welcome"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="relative max-w-3xl w-full mx-auto will-change-transform perspective-1000 z-10"
                style={{ 
                  transformStyle: 'preserve-3d',
                  perspective: '1000px',
                  transformOrigin: direction < 0 ? 'left center' : 'right center',
                  willChange: "transform, opacity, filter, transform", // Performance optimization
                  position: 'relative',
                  margin: '0 auto'
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
                           bg-white/15 hover:bg-white/25 rounded-full backdrop-blur-sm
                           border border-white/20 hover:border-white/50 transition-all duration-300"
                >
                  <span className="text-white/90 text-base">×</span>
                </motion.button>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="bg-gradient-to-br from-black/30 to-black/50 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6 md:p-8 overflow-hidden shadow-2xl"
                  style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1) inset' }}
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
                    
                    {/* Add animated background lines - reduced to 3, more subtle and synchronized */}
                    {!isMobile && (
                      <>
                        <motion.div 
                          className="absolute h-[3px] w-full bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" 
                          style={{ 
                            top: '40%',
                            filter: 'drop-shadow(0 0 3px rgba(59, 130, 246, 0.25))',
                            boxShadow: '0 0 8px rgba(59, 130, 246, 0.25)',
                            zIndex: 2
                          }}
                          animate={{ 
                            left: ['-100%', '100%']
                          }}
                          transition={{
                            duration: 25,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        />
                        <motion.div 
                          className="absolute h-[3px] w-full bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" 
                          style={{ 
                            top: '60%',
                            filter: 'drop-shadow(0 0 3px rgba(168, 85, 247, 0.25))',
                            boxShadow: '0 0 8px rgba(168, 85, 247, 0.25)',
                            zIndex: 2
                          }}
                          animate={{ 
                            left: ['100%', '-100%']
                          }}
                          transition={{
                            duration: 30,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        />
                        <motion.div 
                          className="absolute h-[3px] w-full bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" 
                          style={{ 
                            top: '75%',
                            filter: 'drop-shadow(0 0 3px rgba(34, 211, 238, 0.25))',
                            boxShadow: '0 0 8px rgba(34, 211, 238, 0.25)',
                            zIndex: 2
                          }}
                          animate={{ 
                            left: ['-100%', '100%']
                          }}
                          transition={{
                            duration: 32,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        />
                      </>
                    )}
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
                        className="relative mb-4 sm:mb-6"
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 0.7, ease: "easeOut" }}
                          className="absolute h-[2px] bg-gradient-to-r from-transparent via-blue-500/70 to-transparent top-0 left-0"
                          style={{ filter: 'drop-shadow(0 0 2px rgba(59, 130, 246, 0.5))' }}
                        />
                        <motion.h1 
                          className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 py-3 flex flex-col items-center gap-1 sm:gap-2"
                          style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5))' }}
                        >
                          <span>Welcome to</span>
                          <span>NEX-DEVS</span>
                        </motion.h1>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 0.7, ease: "easeOut" }}
                          className="absolute h-[2px] bg-gradient-to-r from-transparent via-blue-500/70 to-transparent bottom-0 left-0"
                          style={{ filter: 'drop-shadow(0 0 2px rgba(59, 130, 246, 0.5))' }}
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-blue-300/90 text-sm uppercase tracking-widest font-semibold mb-1 sm:mb-2 text-center"
                        style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)' }}
                      >
                        FullStack/Frameworks
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
                        style={{ 
                          filter: 'drop-shadow(0 0 10px rgba(168, 85, 247, 0.25))',
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 0 10px -2px rgba(139, 92, 246, 0.3)'
                        }}
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          See What We Offer
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </span>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-emerald-600/30 opacity-0"
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 0.5 }}
                          transition={{ duration: 0.3 }}
                        />
                      </motion.button>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              // Service Slides with performance optimizations
              <motion.div
                key={`service-${currentSlide}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="relative max-w-4xl w-full mx-auto will-change-transform perspective-1000 z-10"
                style={{ 
                  transformStyle: 'preserve-3d',
                  perspective: '1500px',
                  transformOrigin: 'center center',
                  backfaceVisibility: 'hidden',
                  willChange: "transform, opacity, filter, transform", // Performance optimization
                  position: 'relative',
                  margin: '0 auto'
                }}
                layoutId={`service-container-${currentSlide}`}
              >
                <div className={`bg-gradient-to-br from-black/50 to-black/70 backdrop-blur-xl rounded-xl sm:rounded-2xl 
                               border ${serviceContent[currentSlide].accent} p-3 sm:p-6 md:p-8 relative overflow-hidden
                               transform-gpu transition-all duration-300 hover:scale-[1.02] shadow-2xl`}
                     style={{ 
                       boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
                       WebkitBackfaceVisibility: 'hidden',
                       MozBackfaceVisibility: 'hidden'
                     }}>
                  {/* Background patterns */}
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-grid-white/5 bg-grid-16" />
                    <div className={`absolute inset-0 ${serviceContent[currentSlide].bgAccent} opacity-30`} />
                    
                    {/* Add animated background lines for service slides */}
                    {!isMobile && (
                      <div className="absolute inset-0 overflow-hidden">
                        {/* Horizontal lines */}
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={`hline-${i}`}
                            className="absolute h-[3.5px] w-full bg-white/12"
                            style={{ 
                              top: `${20 * (i + 1)}%`,
                              filter: 'drop-shadow(0 0 2px rgba(255, 255, 255, 0.25))'
                            }}
                            animate={{
                              scaleX: [1, 1.2, 1],
                              opacity: [0.08, 0.15, 0.08]
                            }}
                            transition={{
                              duration: 5 + i,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          />
                        ))}
                        
                        {/* Vertical lines */}
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={`vline-${i}`}
                            className="absolute w-[3.5px] h-full bg-white/12"
                            style={{ 
                              left: `${16.66 * (i + 1)}%`,
                              filter: 'drop-shadow(0 0 2px rgba(255, 255, 255, 0.25))'
                            }}
                            animate={{
                              scaleY: [1, 1.1, 1],
                              opacity: [0.08, 0.15, 0.08]
                            }}
                            transition={{
                              duration: 4 + i,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="relative z-10">
                    <h3 className="text-base sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 text-white/90 drop-shadow-lg relative flex flex-wrap gap-1 sm:gap-2 items-center"
                        style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}>
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
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// This is now the only export
export default React.memo(WelcomeScreen);