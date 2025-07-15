'use client';

import React from 'react';
import { motion, AnimatePresence, useWillChange, Variants } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti'; // Import the confetti library
import NeuralNetwork from '@/components/animations/NeuralNetwork'; // Import NeuralNetwork component
import { TypeAnimation } from 'react-type-animation'; // Import the typewriter animation component

// Add barba.js imports
import { initBarba } from '@/utils/barba-init';

// Add Audiowide font import
import { Audiowide } from 'next/font/google';

// Initialize the font
const audiowide = Audiowide({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

const services = [
  {
    id: 1,
    title: 'AI CHATBOT INTEGRATION',
    description: 'Professional AI chatbot solutions with advanced NLP processing and vector database integration. Enhance customer engagement, automate support, and provide 24/7 assistance with cutting-edge large language models.',
    skills: [
      'Advanced NLP Processing Pipeline',
      'Vector Database Knowledge Integration',
      'Enterprise-Grade AI Model Implementation',
      'Custom Training & Fine-Tuning Solutions'
    ],
    subFeatures: [
      {
        title: 'AI Models & Integration',
        items: [
          'Claude, Gemini, DeepSeek, Grok Integration',
          'OpenRouter, HuggingFace, Ollama Support',
          'Custom Fine-Tuning & Optimization',
          'Human-Like Response Generation'
        ]
      },
      {
        title: 'Business Implementation',
        items: [
          'Seamless Website/App Integration',
          'Multi-Platform Deployment',
          'Real-Time Analytics Dashboard',
          'ROI-Focused Implementation Strategy'
        ]
      }
    ],
    imageSection: {
      title: 'Visualization',
      description: 'See how our AI chatbots transform business communication',
      imagePlaceholders: [
        {
          title: 'Customer Service AI',
          description: 'Intelligent support automation'
        },
        {
          title: 'Business Intelligence',
          description: 'Data-driven insights'
        }
      ]
    },
    color: 'from-blue-600/30 to-indigo-600/30',
    accent: 'border-blue-400/50',
    bgAccent: 'bg-blue-500/5'
  },
  {
    id: 2,
    title: 'AI AGENT WORKFLOW DEVELOPMENT',
    description: 'Enterprise workflow automation powered by intelligent AI agents. Transform business operations with custom automation pipelines that increase productivity, reduce errors, and deliver exceptional ROI.',
    skills: [
      'End-to-End Workflow Design & Implementation',
      'Custom AI Agent Development',
      'Cross-Platform Integration Architecture',
      'Process Optimization & Monitoring'
    ],
    subFeatures: [
      {
        title: 'Automation Platforms',
        items: [
          'n8n Custom Workflow Implementation',
          'Zapier Advanced Integration',
          'Make.com (Integromat) Solutions',
          'Custom API Development & Connection'
        ]
      },
      {
        title: 'Business Impact',
        items: [
          '10x Productivity Enhancement',
          'Error Reduction & Quality Control',
          'Cost Optimization & Resource Allocation',
          'Scalable Business Process Transformation'
        ]
      }
    ],
    imageSection: {
      title: 'Workflow Visualization',
      description: 'See how our AI agents transform your workflows',
      imagePlaceholders: [
        {
          title: 'Process Automation',
          description: 'Intelligent workflow orchestration'
        },
        {
          title: 'Integration Hub',
          description: 'Seamless system connectivity'
        }
      ]
    },
    color: 'from-emerald-500/30 to-teal-600/30',
    accent: 'border-emerald-400/50',
    bgAccent: 'bg-emerald-500/5'
  },
  {
    id: 3,
    title: 'AI BUSINESS INTEGRATION',
    description: 'Seamlessly integrate AI capabilities into your business processes, applications, and websites. Enhance decision-making, automate complex tasks, and deliver personalized experiences with enterprise-grade AI solutions.',
    skills: [
      'AI-Powered Business Transformation',
      'Custom Integration Solutions',
      'Intelligent Process Automation',
      'Advanced Analytics & Insights'
    ],
    subFeatures: [
      {
        title: 'Business Applications',
        items: [
          'Enterprise AI Implementation',
          'Workflow Intelligence Integration',
          'Decision Support Systems',
          'Predictive Analytics Solutions'
        ]
      },
      {
        title: 'Technology Integration',
        items: [
          'Legacy System AI Enhancement',
          'Cross-Platform Compatibility',
          'Scalable AI Architecture',
          'Secure Implementation Framework'
        ]
      }
    ],
    imageSection: {
      title: 'Business Intelligence',
      description: 'Transform business operations with AI integration',
      imagePlaceholders: [
        {
          title: 'Enterprise Systems',
          description: 'Intelligent business solutions',
          image: 'https://ik.imagekit.io/u7ipvwnqb/774_1x_shots_so.png?updatedAt=1751975898520'
        },
        {
          title: 'Analytics Dashboard',
          description: 'Data-driven decision making',
          image: 'https://ik.imagekit.io/u7ipvwnqb/343_1x_shots_so.png?updatedAt=1751976256018'
        }
      ]
    },
    color: 'from-purple-500/30 via-blue-400/30 to-pink-500/30',
    accent: 'border-purple-400/50',
    bgAccent: 'bg-gradient-to-r from-purple-500/5 via-blue-400/5 to-pink-500/5'
  },
  {
    id: 4,
    title: 'Ai-MOBILE APPS',
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
    imageSection: {
      title: 'Mobile App Showcase',
      description: 'Explore our AI-powered mobile application solutions',
      imagePlaceholders: [
        {
          title: 'iOS Development',
          description: 'Native performance with AI',
          image: 'https://ik.imagekit.io/u7ipvwnqb/682shots_so.png'
        },
        {
          title: 'Cross-Platform Apps',
          description: 'One codebase, multiple platforms',
          image: 'https://ik.imagekit.io/u7ipvwnqb/319shots_so.png'
        }
      ]
    },
    color: 'from-orange-500/30 to-red-600/30',
    accent: 'border-orange-400/50',
    bgAccent: 'bg-orange-500/5'
  },
  {
    id: 5,
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
    imageSection: {
      title: '3D Web Experiences',
      description: 'Immersive 3D websites that captivate your audience',
      imagePlaceholders: [
        {
          title: '3D Product Showcase',
          description: 'Interactive product visualization',
          image: 'https://ik.imagekit.io/u7ipvwnqb/452_1x_shots_so.png'
        },
        {
          title: 'Immersive Experiences',
          description: 'Engaging 3D web elements',
          image: 'https://ik.imagekit.io/u7ipvwnqb/647_1x_shots_so.png'
        }
      ]
    },
    color: 'from-cyan-500/30 to-cyan-600/30',
    accent: 'border-cyan-400/50',
    bgAccent: 'bg-cyan-500/5'
  },
  {
    id: 6,
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
    imageSection: {
      title: 'Full-Stack Solutions',
      description: 'Complete end-to-end development with AI integration',
      imagePlaceholders: [
        {
          title: 'Modern Architecture',
          description: 'Cloud-native solutions',
          image: 'https://ik.imagekit.io/u7ipvwnqb/NEX-WEBS%20NEXJS%20WEBSITE%20.png?updatedAt=1751992412485'
        },
        {
          title: 'AI Integration',
          description: 'Machine learning capabilities',
          image: 'https://ik.imagekit.io/u7ipvwnqb/694_1x_shots_so.png?updatedAt=1751992278768'
        }
      ]
    },
    color: 'from-indigo-500/30 to-indigo-600/30',
    accent: 'border-indigo-400/50',
    bgAccent: 'bg-indigo-500/5'
  },
  {
    id: 7,
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
    imageSection: {
      title: 'E-commerce Excellence',
      description: 'AI-powered Shopify solutions for modern businesses',
      imagePlaceholders: [
        {
          title: 'Smart Store',
          description: 'AI-powered shopping experience',
          image: 'https://ik.imagekit.io/u7ipvwnqb/182shots_so.png'
        },
        {
          title: 'Sales Analytics',
          description: 'Data-driven business decisions',
          image: 'https://ik.imagekit.io/u7ipvwnqb/936shots_so.png'
        }
      ]
    },
    color: 'from-green-500/30 to-green-600/30',
    accent: 'border-green-400/50',
    bgAccent: 'bg-green-500/5'
  },
  {
    id: 8,
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
    imageSection: {
      title: 'AI Agent Solutions',
      description: 'Intelligent automation for business processes',
      imagePlaceholders: [
        {
          title: 'Workflow Automation',
          description: 'Smart business processes',
          image: 'https://ik.imagekit.io/u7ipvwnqb/NEX-DEVS%20(PET%20GPT%20COMBINED%20IMAGE)%20.png'
        },
        {
          title: 'Intelligent Agents',
          description: 'AI-powered decision making',
          image: 'https://ik.imagekit.io/u7ipvwnqb/946_1x_shots_so.png?updatedAt=1750962486012'
        }
      ]
    },
    color: 'from-violet-600/40 to-fuchsia-600/40',
    accent: 'border-fuchsia-400/50',
    bgAccent: 'bg-violet-500/10'
  },
  {
    id: 9,
    title: 'MODERN AI BASED SAAS PRODUCT',
    description: 'Enterprise-grade SaaS solutions powered by advanced AI, delivering intelligent and scalable business applications with modern cloud architecture.',
    skills: [
      'Enterprise AI Integration',
      'Advanced SaaS Architecture',
      'Predictive Analytics Engine',
      'Intelligent Cloud Infrastructure'
    ],
    subFeatures: [
      {
        title: 'Enterprise SaaS Solutions',
        items: ['AI-Powered Business Apps', 'Predictive Analytics', 'Intelligent Automation']
      },
      {
        title: 'Advanced Architecture',
        items: ['Multi-tenant Design', 'Scalable Infrastructure', 'Enterprise Security']
      }
    ],
    imageSection: {
      title: 'SaaS Product Showcase',
      description: 'Enterprise-grade AI SaaS solutions',
      imagePlaceholders: [
        {
          title: 'Business Applications',
          description: 'AI-powered enterprise tools',
          image: 'https://ik.imagekit.io/u7ipvwnqb/YT-ANALZER%20FINAL%20IMAGE%20.png'
        },
        {
          title: 'Cloud Architecture',
          description: 'Scalable SaaS infrastructure',
          image: 'https://ik.imagekit.io/u7ipvwnqb/YT-ANALYZER%202ND%20IMAGE%20NEX-DEVS.png'
        }
      ]
    },
    color: 'from-yellow-500/30 to-yellow-600/30',
    accent: 'border-yellow-400/50',
    bgAccent: 'bg-yellow-500/5'
  },
  {
    id: 10,
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
    imageSection: {
      title: 'WordPress Solutions',
      description: 'AI-enhanced WordPress development',
      imagePlaceholders: [
        {
          title: 'Content Management',
          description: 'Smart CMS solutions',
          image: 'https://ik.imagekit.io/u7ipvwnqb/821shots_so.png'
        },
        {
          title: 'Website Performance',
          description: 'Optimized WordPress sites',
          image: 'https://ik.imagekit.io/u7ipvwnqb/127shots_so.png'
        }
      ]
    },
    color: 'from-purple-500/30 to-purple-600/30',
    accent: 'border-purple-400/50',
    bgAccent: 'bg-purple-500/5'
  },
  {
    id: 11,
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
    imageSection: {
      title: 'SEO Visualization',
      description: 'AI-powered search engine optimization',
      imagePlaceholders: [
        {
          title: 'Ranking Analytics',
          description: 'Data-driven SEO insights',
          image: 'https://ik.imagekit.io/u7ipvwnqb/884shots_so.png'
        },
        {
          title: 'Content Strategy',
          description: 'AI-optimized content planning',
          image: 'https://ik.imagekit.io/u7ipvwnqb/524shots_so.png'
        }
      ]
    },
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

// Update the slideVariants with correct typing
const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.95,
    rotateY: direction > 0 ? '3deg' : '-3deg',
    transition: { duration: 0.2, ease: [0.32, 0.72, 0, 1] }
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    rotateY: '0deg',
    transition: { duration: 0.2, ease: [0.32, 0.72, 0, 1] }
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.95,
    rotateY: direction < 0 ? '3deg' : '-3deg',
    transition: { duration: 0.2, ease: [0.32, 0.72, 0, 1] }
  })
};

// Add animation sequencing control for welcome screen
const ANIMATION_SEQUENCE = {
  SCREEN_FADE_IN: 0,
  BACKGROUND_ELEMENTS: 0.2, 
  TITLE_TEXT: 0.4,
  SUBTITLE_TEXT: 0.9, 
  DESCRIPTION_TEXT: 1.4,
  NEURAL_NETWORK: 1.8,
  TECH_STACK: 2.4,
  BUTTON: 2.8
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
  const [currentSlide, setCurrentSlide] = useState(initialDirection);
  const [direction, setDirection] = useState(initialDirection);
  const [mounted, setMounted] = useState(false);
  const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [hideMobilePreview, setHideMobilePreview] = useState(true);
  const barbaInitialized = useRef(false);
  
  // Add state for animation sequence control
  const [animationComplete, setAnimationComplete] = useState({
    background: false,
    title: false,
    subtitle: false,
    neural: false,
    techStack: false
  });

  // Image preview functions
  const openImagePreview = (src: string, alt: string) => {
    setPreviewImage({ src, alt });
  };

  const closeImagePreview = () => {
    setPreviewImage(null);
  };

  // Initialize mobile check
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent;
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isSmallScreen = window.innerWidth < 640;
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      // Only consider it mobile if it's actually a mobile device
      const actuallyMobile = isMobileDevice && isSmallScreen && isTouchDevice;
      setIsMobile(actuallyMobile);

      // Never show mobile preview popup for desktop users
      if (!actuallyMobile) {
        setHideMobilePreview(true); // Always hide for desktop
      } else {
        // For actual mobile devices, show after a delay
        setTimeout(() => {
          setHideMobilePreview(false);
        }, 1500);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Enhanced scroll locking effect with immediate application
  useEffect(() => {
    if (mounted) {
      // Store current scroll position
      const scrollPos = window.scrollY;
      setScrollPosition(scrollPos);

      // Create and append a style tag for global styles - apply instantly
      const styleTag = document.createElement('style');
      styleTag.setAttribute('data-welcome-screen', 'true');
      styleTag.innerHTML = `
        html, body {
          overflow: hidden !important;
          height: 100vh !important;
          touch-action: none !important;
          position: fixed !important;
          width: 100% !important;
          top: 0 !important;
          left: 0 !important;
        }
        
        #welcome-screen-overlay {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          overflow: hidden !important;
          touch-action: none !important;
          -webkit-overflow-scrolling: none !important;
          overscroll-behavior: none !important;
          pointer-events: all !important;
          z-index: 9999 !important;
        }
      `;
      document.head.appendChild(styleTag);

      // Apply inline styles immediately
      document.body.style.top = `-${scrollPos}px`;
      
      return () => {
        // Remove the style tag
        if (styleTag.parentNode) {
          document.head.removeChild(styleTag);
        }
        
        // Reset inline styles
        document.body.style.top = '';
        
        // Restore scroll position
        window.scrollTo(0, scrollPos);
        
        // Clean up custom properties
        document.documentElement.style.removeProperty('--initial-background-opacity');
        document.documentElement.style.removeProperty('--initial-blur');
      };
    }
  }, [mounted]);

  // Get the appropriate service content based on device type
  const serviceContent = getServiceContent(isMobile);

  // Update the mounting effect with improved animation sequencing
  useEffect(() => {
    // Always mount and show first slide immediately
    setMounted(true);
    setCurrentSlide(-1);
    
    // Store current scroll position
    const scrollPos = window.scrollY;
    setScrollPosition(scrollPos);

    // Set initial state for animations and apply scroll lock immediately
    document.documentElement.style.setProperty('--initial-background-opacity', '0');
    document.documentElement.style.setProperty('--initial-blur', '0px');
    
    // Sequence the animations
    const animationTimers = [
      setTimeout(() => {
        document.documentElement.style.setProperty('--initial-background-opacity', '1');
        document.documentElement.style.setProperty('--initial-blur', '2px');
      }, 300),
      
      setTimeout(() => {
        setAnimationComplete(prev => ({ ...prev, background: true }));
      }, ANIMATION_SEQUENCE.BACKGROUND_ELEMENTS * 1000),
      
      setTimeout(() => {
        setAnimationComplete(prev => ({ ...prev, title: true }));
      }, ANIMATION_SEQUENCE.TITLE_TEXT * 1000),
      
      setTimeout(() => {
        setAnimationComplete(prev => ({ ...prev, subtitle: true }));
      }, ANIMATION_SEQUENCE.SUBTITLE_TEXT * 1000),
      
      setTimeout(() => {
        setAnimationComplete(prev => ({ ...prev, neural: true }));
      }, ANIMATION_SEQUENCE.NEURAL_NETWORK * 1000),
      
      setTimeout(() => {
        setAnimationComplete(prev => ({ ...prev, techStack: true }));
      }, ANIMATION_SEQUENCE.TECH_STACK * 1000)
    ];
    
    // Create and append a style tag for global styles - apply instantly
    const styleTag = document.createElement('style');
    styleTag.setAttribute('data-welcome-screen', 'true');
    styleTag.innerHTML = `
      html, body {
        overflow: hidden !important;
        height: 100vh !important;
        touch-action: none !important;
        position: fixed !important;
        width: 100% !important;
        top: 0 !important;
        left: 0 !important;
      }
      
      #welcome-screen-overlay {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        overflow: hidden !important;
        touch-action: none !important;
        -webkit-overflow-scrolling: none !important;
        overscroll-behavior: none !important;
        pointer-events: all !important;
        z-index: 9999 !important;
      }
    `;
    document.head.appendChild(styleTag);

    // Apply inline styles immediately
    document.body.style.top = `-${scrollPos}px`;

    return () => {
      // Clear all animation timers
      animationTimers.forEach(timer => clearTimeout(timer));
      
      // Remove the style tag
      if (styleTag.parentNode) {
        document.head.removeChild(styleTag);
      }
      
      // Reset inline styles
      document.body.style.top = '';
      
      // Restore scroll position
      window.scrollTo(0, scrollPos);
      
      // Clean up custom properties
      document.documentElement.style.removeProperty('--initial-background-opacity');
      document.documentElement.style.removeProperty('--initial-blur');
    };
  }, []);

  // Optimize the preloading effect for better performance
  useEffect(() => {
    // Preload critical assets and optimize rendering
    const preloadAssets = () => {
      // Preload critical images
      const criticalImages = document.querySelectorAll('img[data-priority="true"]');
      criticalImages.forEach((img: any) => {
        if (img.loading !== 'eager') img.loading = 'eager';
        if (img.decoding !== 'async') img.decoding = 'async';
      });
      
      // Hint to browser about animations with proper transform properties
      const animationElements = document.querySelectorAll('.will-change-transform, .hardware-accelerated');
      animationElements.forEach((el: any) => {
        if (el.style) {
          el.style.willChange = 'transform';
          el.style.backfaceVisibility = 'hidden';
          el.style.transform = 'translateZ(0)'; // Force GPU acceleration
        }
      });
    };

    preloadAssets();
  }, []);

  // Add close button handler
  const handleClose = () => {
    // Remove any lingering scroll lock styles
    const existingStyleTag = document.querySelector('style[data-welcome-screen]');
    if (existingStyleTag) {
      existingStyleTag.remove();
    }
    
    // Reset body styles
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('position');
    document.body.style.removeProperty('top');
    document.body.style.removeProperty('width');
    
    // Reset html styles
    document.documentElement.style.removeProperty('overflow');
    document.documentElement.style.removeProperty('height');
    
    // Restore scroll position
    window.scrollTo(0, scrollPosition);
    
    // Just call onComplete without any localStorage operations
    onComplete();
  };

  // Handle completion without localStorage
  const handleCompletion = () => {
    onComplete();
  };

  // Add keyboard support for preview modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && previewImage) {
        closeImagePreview();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewImage]);
  
  // Close image preview when slide changes
  useEffect(() => {
    closeImagePreview();
  }, [currentSlide]);

  // Initialize Barba.js when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined' && !barbaInitialized.current) {
      // Custom Barba.js transition specific for the welcome screen
      try {
        initBarba();
        
        // Add special welcome screen transition event listener
        window.addEventListener('welcomeTransitionComplete', () => {
          // Trigger additional animations or cleanup after barba transition
          if (animationComplete.subtitle && animationComplete.neural && animationComplete.techStack) {
            // Enhance animations after Barba transition
            document.querySelectorAll('.tech-stack-item').forEach((el) => {
              (el as HTMLElement).style.opacity = '1';
            });
          }
        });
        
        barbaInitialized.current = true;
      } catch (error) {
        console.error('Error initializing Barba.js:', error);
      }
    }
  }, [animationComplete.subtitle, animationComplete.neural, animationComplete.techStack]);

  if (!mounted) return null;

  // Update handlers to track direction and close preview if open
  const handleNext = () => {
    setDirection(1);
    if (previewImage) closeImagePreview();
    
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
    if (previewImage) closeImagePreview();
    
    setDirection(-1);
    setCurrentSlide(prev => prev - 1);
  };

  const handleHomeRedirect = () => {
    // Simply redirect without affecting localStorage
    window.location.href = '/';
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
        };
      case "smooth":
        return {
          duration: 0.4,
          ease: [0.22, 1, 0.36, 1],
        };
      case "stagger":
        return {
          staggerChildren: 0.04,
          delayChildren: 0.05,
        };
      default:
        return {
          duration: 0.3,
          ease: "easeOut",
        };
    }
  };

  // Add function to render moving gradient lines - updated to not overlap content
  const renderGradientLines = () => {
    if (isMobile) return null;
    
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
        {[...Array(3)].map((_, i) => {
          const topPosition = 30 + i * 20;
          const isEven = i % 2 === 0;
          const duration = 15 + i * 2;
          
          return (
            <motion.div
              key={`line-${i}`}
              className={`absolute h-[2px] bg-gradient-to-r 
                        ${isEven 
                          ? 'from-transparent via-blue-500/20 to-purple-500/20' 
                          : 'from-transparent via-purple-500/20 to-emerald-500/20'}`}
              style={{
                filter: 'blur(2px)',
                boxShadow: isEven ? '0 0 4px rgba(59, 130, 246, 0.2)' : '0 0 4px rgba(168, 85, 247, 0.2)',
                zIndex: 1,
                width: "120%",
                willChange: "transform",
                transition: 'all 0.6s ease-out',
                transform: 'translate3d(0,0,0)'
              }}
              initial={{ 
                left: isEven ? "100%" : "-120%",
                top: `${topPosition}%`,
                opacity: 0.3
              }}
              animate={{ 
                left: isEven ? "-120%" : "100%",
                opacity: [0.3, 0.4, 0.3]
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                ease: "linear",
                repeatType: "loop",
                delay: i * 0.1
              }}
            />
          );
        })}
      </div>
    );
  };

  // Update function to render tech stack floating texts with staggered animations
  const renderTechStack = () => {
    if (isMobile || currentSlide !== -1 || !animationComplete.techStack) return null;
    
    const criticalTech = techStack.filter(tech => tech.importance === 'critical');
    
    // Enhanced positions with better spacing
    const techPositions = [
      { name: 'Next.js', x: '8%', y: '15%', delay: 0, speed: 5 },
      { name: 'TypeScript', x: '92%', y: '22%', delay: 0.6, speed: 6 },
      { name: 'Python', x: '15%', y: '85%', delay: 1.2, speed: 7 },
      { name: 'React', x: '88%', y: '75%', delay: 0.8, speed: 8 },
      { name: 'Flutter', x: '12%', y: '32%', delay: 1.5, speed: 6 },
      { name: 'Node.js', x: '90%', y: '35%', delay: 1.0, speed: 7 },
      { name: 'JavaScript', x: '6%', y: '65%', delay: 0.4, speed: 5 },
      { name: 'AWS', x: '85%', y: '55%', delay: 1.3, speed: 8 },
      { name: 'React Native', x: '7%', y: '48%', delay: 0.9, speed: 7 },
      { name: 'Java', x: '94%', y: '88%', delay: 0.3, speed: 6 },
      { name: 'PostgreSQL', x: '10%', y: '75%', delay: 0.7, speed: 5 }
    ];
    
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {criticalTech.map((tech, i) => {
          const position = techPositions.find(pos => pos.name === tech.name) || 
                         { x: `${10 + (i * 8)}%`, y: `${20 + (i * 7)}%`, delay: i * 0.3, speed: 6 };
          
          const radius = 5 + Math.random() * 5;
          
          // Calculate custom delay - ensures icons pop in sequence with proper timing
          const baseDelay = position.delay + 0.2;
          const appearanceDelay = baseDelay + (i * 0.15); // Increased spacing between icons
          const movementDelay = appearanceDelay + 0.6; // Delay movement until after appearance animation completes

          return (
            <motion.div
              key={`tech-${tech.name}`}
              className={`tech-stack-item absolute ${tech.color} text-opacity-75 font-mono text-sm font-medium flex items-center gap-2 px-3 py-0.5 rounded-full bg-gray-900/50 backdrop-blur-sm border border-current border-opacity-30`}
              initial={{ 
                opacity: 0,
                left: position.x,
                top: position.y,
                scale: 0.01
              }}
              animate={{ 
                x: [radius, -radius, radius], 
                y: [radius, -radius, radius],
                opacity: [0, 0.7, 0.9, 0.8],
                scale: [0.01, 0.7, 1.15, 0.9, 1] // Smoother pop bubble animation effect
              }}
              transition={{
                opacity: {
                  duration: 0.7, // Longer duration for smoother fade-in
                  delay: appearanceDelay,
                  ease: "easeOut"
                },
                scale: {
                  duration: 1.2, // Longer duration for smoother pop effect
                  delay: appearanceDelay,
                  ease: [0.34, 1.56, 0.64, 1], // Custom spring-like effect for natural bubble pop
                  times: [0, 0.3, 0.6, 0.85, 1] // Control timing of scale keyframes for smoother effect
                },
                x: {
                  duration: position.speed + Math.random() * 0.5,
                  delay: movementDelay, // Start floating motion only after appearance animation completes
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatType: "reverse"
                },
                y: {
                  duration: position.speed + Math.random() * 1.5,
                  delay: movementDelay, // Start floating motion only after appearance animation completes
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatType: "reverse"
                }
              }}
              style={{
                boxShadow: '0 3px 15px rgba(0, 0, 0, 0.3)',
                filter: `drop-shadow(0 0 5px ${tech.color.includes('blue') ? 'rgba(59, 130, 246, 0.5)' : 
                  tech.color.includes('green') ? 'rgba(16, 185, 129, 0.5)' : 
                  tech.color.includes('yellow') ? 'rgba(234, 179, 8, 0.5)' : 
                  'rgba(139, 92, 246, 0.5)'})`,
                textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
                transform: `translate(-50%, -50%)`,
                zIndex: 5,
                transformOrigin: 'center center', // Ensure scaling happens from center
                willChange: 'transform, opacity', // Performance optimization hint
              }}
            >
              <motion.span 
                className="w-2 h-2 bg-current rounded-full opacity-80"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 0.7, 1, 0.7],
                  scale: [0, 0.7, 1.3, 0.8]
                }}
                transition={{
                  duration: 1.0, // Longer duration for smoother animation
                  delay: appearanceDelay + 0.15, // Slightly delayed after parent appears
                  ease: [0.34, 1.56, 0.64, 1], // Custom spring-like effect
                  opacity: {
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 3, // Slower pulsing for more subtle effect
                    delay: movementDelay
                  },
                  scale: {
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 3, // Slower pulsing for more subtle effect
                    delay: movementDelay
                  }
                }}
                style={{
                  willChange: 'transform, opacity', // Performance optimization hint
                }}
              />
              {tech.name}
            </motion.div>
          );
        })}
      </div>
    );
  };

  // Add neural network animation to welcome screen with progressive animation
  const renderNeuralNetworkAnimation = () => {
    if (isMobile || currentSlide !== -1 || !animationComplete.neural) return null; // Only show on welcome screen and after animation trigger
    
    // Define neural network nodes with more spread out positioning
    const nodes = [
      { id: 1, x: '15%', y: '25%' },
      { id: 2, x: '38%', y: '18%' },
      { id: 3, x: '50%', y: '32%' },
      { id: 4, x: '70%', y: '22%' },
      { id: 5, x: '85%', y: '38%' },
      { id: 6, x: '20%', y: '65%' },
      { id: 7, x: '42%', y: '75%' },
      { id: 8, x: '65%', y: '68%' },
      { id: 9, x: '82%', y: '52%' }
    ];
    
    // Define connections between nodes - removed a few for better performance
    const connections = [
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 4 },
      { from: 3, to: 4 },
      { from: 3, to: 7 },
      { from: 4, to: 5 },
      { from: 6, to: 7 },
      { from: 7, to: 8 },
      { from: 8, to: 9 }
    ];
    
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
        {/* Render neural network connections (lines) with progressive animation */}
        {connections.map((connection, i) => {
          const fromNode = nodes.find(n => n.id === connection.from);
          const toNode = nodes.find(n => n.id === connection.to);
          
          if (!fromNode || !toNode) return null;
          
          // Calculate line length for animation timing
          const dx = parseInt(toNode.x) - parseInt(fromNode.x);
          const dy = parseInt(toNode.y) - parseInt(fromNode.y);
          const distance = Math.sqrt(dx * dx + dy * dy);
          const animationDuration = distance / 20; // Speed factor
          
          return (
            <div key={`connection-${i}`} className="absolute" style={{
              left: fromNode.x,
              top: fromNode.y,
              width: '100%',
              height: '100%',
              zIndex: 2
            }}>
              <motion.div 
                className="absolute origin-left"
                style={{
                  height: '1px',
                  backgroundColor: i % 3 === 0 ? '#60A5FA' : i % 3 === 1 ? '#A855F7' : '#34D399',
                  width: `${distance}%`,
                  boxShadow: i % 3 === 0 ? '0 0 4px #60A5FA' : i % 3 === 1 ? '0 0 4px #A855F7' : '0 0 4px #34D399',
                  transformOrigin: 'left center',
                  transform: `rotate(${Math.atan2(dy, dx) * (180 / Math.PI)}deg)`,
                  willChange: 'opacity, width'
                }}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: `${distance}%`, opacity: [0.2, 0.6, 1, 0.6] }}
                transition={{
                  width: { 
                    duration: 0.6,
                    delay: 0.05 + i * 0.08,
                    ease: "easeOut" 
                  },
                  opacity: {
                    duration: 3 + i % 3,
                    delay: 0.05 + i * 0.08,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              >
                {/* Add static dot at the end of the line with delayed appearance */}
                <motion.div
                  className="absolute w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: i % 3 === 0 ? '#60A5FA' : i % 3 === 1 ? '#A855F7' : '#34D399',
                    boxShadow: i % 3 === 0 ? '0 0 6px #60A5FA' : i % 3 === 1 ? '0 0 6px #A855F7' : '0 0 6px #34D399',
                    right: '-1px',
                    top: '-2px',
                    transform: 'translate(50%, -50%)'
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.7, 1, 0.7] }}
                  transition={{
                    duration: 2 + i % 2,
                    delay: 0.3 + i * 0.12,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                {/* Moving dots along the lines with delayed appearance */}
                <motion.div
                  className="absolute w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: i % 3 === 0 ? '#60A5FA' : i % 3 === 1 ? '#A855F7' : '#34D399',
                    boxShadow: i % 3 === 0 ? '0 0 6px #60A5FA' : i % 3 === 1 ? '0 0 6px #A855F7' : '0 0 6px #34D399',
                    top: '-2px',
                    willChange: 'transform, left, opacity'
                  }}
                  initial={{ opacity: 0, left: '0%' }}
                  animate={{ left: ['0%', '100%'], scale: [0.8, 1.2, 0.8], opacity: [0.7, 1, 0.7] }}
                  transition={{
                    left: {
                      duration: animationDuration,
                      delay: 0.6 + i * 0.15,
                      ease: "linear",
                      repeat: Infinity,
                      repeatDelay: 0
                    },
                    scale: {
                      duration: 1.5,
                      delay: 0.6 + i * 0.15,
                      repeat: Infinity,
                      ease: "easeInOut",
                      repeatDelay: 0
                    },
                    opacity: {
                      duration: 1.5,
                      delay: 0.6 + i * 0.15,
                      repeat: Infinity,
                      ease: "easeInOut",
                      repeatDelay: 0
                    }
                  }}
                />
              </motion.div>
            </div>
          );
        })}
        
        {/* Render neural network nodes with staggered appearance */}
        {nodes.map((node, i) => (
          <motion.div
            key={`node-${i}`}
            className="absolute w-2.5 h-2.5 rounded-full"
            style={{
              left: node.x,
              top: node.y,
              backgroundColor: i % 3 === 0 ? '#60A5FA' : i % 3 === 1 ? '#A855F7' : '#34D399',
              boxShadow: i % 3 === 0 ? '0 0 8px #60A5FA' : i % 3 === 1 ? '0 0 8px #A855F7' : '0 0 8px #34D399',
              transform: 'translate(-50%, -50%)',
              zIndex: 3
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1, 1.3, 1], 
              opacity: [0, 1, 1, 0.7]
            }}
            transition={{
              scale: {
                duration: 0.5, 
                delay: 0.1 + i * 0.07,
                ease: "easeOut"
              },
              opacity: {
                duration: 0.5,
                delay: 0.1 + i * 0.07,
                ease: "easeOut"
              }
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div 
      id="welcome-screen-overlay"
      className="fixed inset-0 flex items-center justify-center overflow-hidden transform-gpu" 
      data-barba="container"
      data-barba-namespace="welcome-screen"
      data-barba-prevent="all"
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
        overscrollBehavior: 'none',
        touchAction: 'none',
        userSelect: 'none',
        WebkitOverflowScrolling: 'touch',
        WebkitUserSelect: 'none',
        msUserSelect: 'none',
        backfaceVisibility: 'hidden',
        display: 'flex'
      }}
      onTouchMove={(e) => e.preventDefault()}
      onWheel={(e) => e.preventDefault()}
      onScroll={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        if (['Space', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown'].includes(e.code)) {
          e.preventDefault();
        }
      }}
    >
      {/* Neural Network effect for first three slides */}
      {(currentSlide === -1 || currentSlide <= 2) && (
        <>
          {/* Left side neural network */}
          <div className="absolute top-0 bottom-0 left-0 w-[35%] z-[2] pointer-events-none opacity-75" style={{ overflow: 'hidden' }}>
            <NeuralNetwork
              color={
                currentSlide === -1 ? '#a855f7' : 
                currentSlide === 0 ? '#3b82f6' :
                currentSlide === 1 ? '#10b981' :
                currentSlide === 2 ? '#8b5cf6' : 
                '#a855f7'
              }
              lineColor={
                currentSlide === -1 ? '#8b5cf6' : 
                currentSlide === 0 ? '#60a5fa' :
                currentSlide === 1 ? '#34d399' :
                currentSlide === 2 ? '#93c5fd' : 
                '#8b5cf6'
              }
              pointCount={12} 
              connectionRadius={150}
              speed={0.18}
              containerBounds={true}
            />
          </div>

          {/* Right side neural network */}
          <div className="absolute top-0 bottom-0 right-0 w-[35%] z-[2] pointer-events-none opacity-75" style={{ overflow: 'hidden' }}>
            <NeuralNetwork
              color={
                currentSlide === -1 ? '#a855f7' : 
                currentSlide === 0 ? '#3b82f6' :
                currentSlide === 1 ? '#10b981' :
                currentSlide === 2 ? '#a855f7' : 
                '#a855f7'
              }
              lineColor={
                currentSlide === -1 ? '#8b5cf6' : 
                currentSlide === 0 ? '#60a5fa' :
                currentSlide === 1 ? '#34d399' :
                currentSlide === 2 ? '#60a5fa' : 
                '#8b5cf6'
              }
              pointCount={12}
              connectionRadius={150}
              speed={0.18}
              containerBounds={true}
            />
          </div>
        </>
      )}

      {/* Dark overlay with better visibility */}
      <motion.div 
        initial={{ opacity: 0.8 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-black/80"
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0,
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          transform: 'translate3d(0,0,0)',
          willChange: 'opacity',
        }}
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
          {/* Main background with enhanced visibility and smoother animation */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)", scale: 1.05 }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)", scale: 1 }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)", scale: 0.95 }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
              opacity: { duration: 0.6 },
              scale: { duration: 0.8 }
            }}
            className="absolute inset-0 bg-black/60"
            style={{
              WebkitBackdropFilter: "blur(8px)",
              willChange: "backdrop-filter, transform, opacity",
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              transform: 'translate3d(0, 0, 0)'
            }}
          />
          
          {/* Gradient orbs with improved visibility and more professional staggered animation */}
          <div className="absolute inset-0 z-[1]"> {/* Added z-index */}
            <motion.div 
              initial={{ opacity: 0.1 }}
              animate={{ opacity: 0.12 }}
              transition={{ duration: 0.3 }}
              className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-blue-600/30 rounded-full transform-gpu"
              style={{ 
                filter: 'blur(40px)',
                willChange: "opacity",
                transform: 'translate3d(0,0,0)'
              }}
            />
            <motion.div 
              initial={{ opacity: 0.1 }}
              animate={{ opacity: 0.12 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-purple-600/30 rounded-full transform-gpu"
              style={{ 
                filter: 'blur(40px)',
                willChange: "opacity",
                transform: 'translate3d(0,0,0)'
              }}
            />
            <motion.div 
              initial={{ opacity: 0.12 }}
              animate={{ opacity: 0.15 }}
              transition={{ duration: 0.3 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-[30rem] sm:h-[30rem] bg-black/40 rounded-full transform-gpu"
              style={{ 
                filter: 'blur(60px)',
                willChange: "opacity",
                transform: 'translate3d(0,0,0)'
              }}
            />
          </div>

          {/* Add moving gradient lines - now with proper z-index */}
          {renderGradientLines()}

          {/* Add neural network animation to welcome screen */}
          {renderNeuralNetworkAnimation()}

          {/* Add tech stack background only on welcome screen */}
          {renderTechStack()}

          {/* Simplified starry background with improved performance */}
          <div className="absolute inset-0 z-[1]">
            {/* Fewer stars with staggered animation for better performance */}
            {[...Array(typeof window !== 'undefined' && window.innerWidth < 640 ? 12 : 24)].map((_, i) => (
              <motion.div
                key={`star-${i}`}
                className="absolute w-1 h-1 bg-white rounded-full transform-gpu"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 0.8, 0.1],
                  scale: [0, 1, 0.8]
                }}
                transition={{
                  duration: Math.random() * 2 + 1,
                  delay: i * 0.04, // Slightly faster appearance
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  willChange: "opacity, transform"
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
          mode="sync" 
          initial={false} 
          custom={direction}
          onExitComplete={() => {
            // No timeout needed for better performance
          }}
        >
          <div className="flex items-center justify-center w-full h-full" 
               style={{ 
                 padding: '0', 
                 margin: '0 auto', 
                 paddingBottom: '5vh',
                 maxWidth: '95vw'
               }}>
            {currentSlide === -1 ? (
              // Welcome Screen with enhanced animations
              <motion.div
                key="welcome"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="relative max-w-3xl w-full mx-auto will-change-transform perspective-1000 z-10 transform-gpu"
                style={{ 
                  transformStyle: 'preserve-3d',
                  perspective: '1000px',
                  transformOrigin: direction < 0 ? 'left center' : 'right center',
                  willChange: "transform, opacity",
                  position: 'relative',
                  margin: '0 auto',
                  backfaceVisibility: 'hidden'
                }}
              >
                {/* Close button with immediate animation */}
                <motion.button
                  initial={{ opacity: 0.8, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClose}
                  className="absolute top-3 right-3 z-50 w-7 h-7 flex items-center justify-center
                           bg-white/15 hover:bg-white/25 rounded-full backdrop-blur-sm
                           border border-white/20 hover:border-white/50 transition-all duration-300 transform-gpu"
                >
                  <span className="text-white/90 text-base">×</span>
                </motion.button>

                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="bg-gradient-to-br from-black/30 to-black/50 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6 md:p-8 overflow-hidden shadow-2xl transform-gpu"
                  style={{
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
                    transformStyle: 'preserve-3d',
                    perspective: '1000px',
                    transform: 'translate3d(0, 0, 0)'
                  }}
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
                          className="absolute h-[3px] w-full bg-gradient-to-r from-transparent via-blue-500/20 to-transparent transform-gpu will-change-transform hardware-accelerated" 
                          style={{ 
                            top: '40%',
                            filter: 'drop-shadow(0 0 3px rgba(59, 130, 246, 0.25))',
                            boxShadow: '0 0 8px rgba(59, 130, 246, 0.25)',
                            zIndex: 2,
                            transform: 'translate3d(0, 0, 0)'
                          }}
                          initial={{ left: '-100%' }}
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
                          initial={{ left: '100%' }}
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
                          initial={{ left: '-100%' }}
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
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.15 }}
                        className="relative mb-4 sm:mb-6"
                        style={{ visibility: 'visible', display: 'block' }}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                          className="absolute h-[2px] bg-gradient-to-r from-transparent via-blue-500/70 to-transparent top-0 left-0"
                          style={{ filter: 'drop-shadow(0 0 2px rgba(59, 130, 246, 0.5))' }}
                        />
                        <motion.h1
                          className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold py-3 flex flex-col items-center gap-1 sm:gap-2 z-50"
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{
                            duration: 0.4,
                            ease: [0.22, 1, 0.36, 1],
                            delay: ANIMATION_SEQUENCE.TITLE_TEXT
                          }}
                          style={{
                            opacity: animationComplete.title ? 1 : 0,
                            visibility: 'visible',
                            display: 'flex',
                            position: 'relative',
                            padding: '10px 20px',
                            backgroundColor: 'rgba(0,0,0,0.2)',
                            borderRadius: '16px',
                            transform: 'translate3d(0, 0, 0)'
                          }}
                        >
                          {animationComplete.title ? (
                            <>
                              <TypeAnimation
                                sequence={[
                                  'Welcome to',
                                  100
                                ]}
                                wrapper="span"
                                speed={60}
                                style={{
                                  color: '#b4a7f5',
                                  opacity: 1,
                                  visibility: 'visible',
                                  letterSpacing: '2px',
                                  fontWeight: '600',
                                  display: 'block',
                                  width: '100%',
                                  fontFamily: audiowide.style.fontFamily,
                                  textShadow: '0 0 10px rgba(147, 51, 234, 0.5)',
                                }}
                                cursor={false}
                              />
                              <TypeAnimation
                                sequence={[
                                  '',
                                  200,
                                  'NEX-DEVS',
                                  100
                                ]}
                                wrapper="span"
                                speed={70}
                                style={{
                                  color: '#b4a7f5',
                                  opacity: 1,
                                  visibility: 'visible',
                                  letterSpacing: '3px',
                                  fontWeight: '800',
                                  WebkitTextStroke: '1px rgba(147, 51, 234, 0.3)',
                                  display: 'block',
                                  width: '100%',
                                  fontFamily: audiowide.style.fontFamily,
                                  textShadow: '0 0 15px rgba(147, 51, 234, 0.6)',
                                }}
                                cursor={false}
                              />
                            </>
                          ) : (
                            <>
                              <span className={audiowide.className} style={{ 
                                color: '#b4a7f5', 
                                opacity: 0, 
                                letterSpacing: '2px', 
                                fontWeight: '600', 
                                textShadow: '0 0 10px rgba(147, 51, 234, 0.5)',
                              }}>
                                Welcome to
                              </span>
                              <span className={audiowide.className} style={{ 
                                color: '#b4a7f5', 
                                opacity: 0, 
                                letterSpacing: '3px', 
                                fontWeight: '800',
                                WebkitTextStroke: '1px rgba(147, 51, 234, 0.3)',
                                textShadow: '0 0 15px rgba(147, 51, 234, 0.6)',
                              }}>
                                NEX-DEVS
                              </span>
                            </>
                          )}
                        </motion.h1>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
                          className="absolute h-[2px] bg-gradient-to-r from-transparent via-blue-500/70 to-transparent bottom-0 left-0"
                          style={{ filter: 'drop-shadow(0 0 2px rgba(59, 130, 246, 0.5))' }}
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: animationComplete.subtitle ? 1 : 0, y: animationComplete.subtitle ? 0 : 5 }}
                        transition={{ duration: 0.5, delay: ANIMATION_SEQUENCE.SUBTITLE_TEXT }}
                        className="text-blue-300/90 text-sm uppercase tracking-widest font-semibold mb-1 sm:mb-2 text-center"
                        style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)' }}
                      >
                        {animationComplete.subtitle && (
                          <TypeAnimation
                            sequence={[
                              'FullStack/Frameworks',
                              100
                            ]}
                            wrapper="span"
                            speed={50}
                            style={{ display: 'inline-block' }}
                            cursor={false}
                          />
                        )}
                      </motion.div>

                      <div className="relative">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: animationComplete.subtitle ? 1 : 0, y: animationComplete.subtitle ? 0 : 10 }}
                          transition={{ duration: 0.5, delay: ANIMATION_SEQUENCE.SUBTITLE_TEXT + 0.4 }}
                          className="text-xl xs:text-2xl sm:text-3xl md:text-4xl text-white mb-3 max-w-2xl mx-auto font-bold relative flex flex-col items-center gap-1 sm:gap-2"
                        >
                          {animationComplete.subtitle && (
                            <>
                              <TypeAnimation
                                sequence={[
                                  'AI is the Future',
                                  100
                                ]}
                                wrapper="span"
                                speed={60}
                                className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300"
                                cursor={false}
                              />
                              <TypeAnimation
                                sequence={[
                                  '',
                                  150,
                                  'and We\'re Here to Build It Together',
                                  100
                                ]}
                                wrapper="span"
                                speed={60}
                                className="text-sm xs:text-base sm:text-xl md:text-2xl text-gray-300 font-normal"
                                cursor={false}
                              />
                            </>
                          )}
                        </motion.div>
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: animationComplete.subtitle ? 1 : 0, y: animationComplete.subtitle ? 0 : 10 }}
                        transition={{ duration: 0.5, delay: ANIMATION_SEQUENCE.DESCRIPTION_TEXT }}
                      >
                        <p className="text-sm xs:text-base sm:text-lg text-gray-300 mb-4 sm:mb-6 max-w-3xl mx-auto">
                          {animationComplete.subtitle && (
                            <>
                              Transform your digital presence with our 
                              <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400 font-semibold px-2">
                                cutting-edge AI solutions
                              </span>
                            </>
                          )}
                        </p>

                        <div className="text-sm xs:text-base sm:text-lg font-medium text-white/90 mb-4 sm:mb-6">
                          {animationComplete.subtitle && (
                            <motion.span 
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.5, delay: ANIMATION_SEQUENCE.DESCRIPTION_TEXT + 0.3 }}
                              className="inline-block bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg px-3 py-1.5 border border-purple-500/30"
                            >
                              <TypeAnimation
                                sequence={[
                                  'Discover How AI Elevates Your Business Success',
                                  100
                                ]}
                                wrapper="span"
                                speed={70}
                                cursor={false}
                              />
                            </motion.span>
                          )}
                        </div>
                      </motion.div>

                      <motion.button
                        onClick={handleNext}
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ 
                          opacity: (animationComplete.subtitle && animationComplete.neural && animationComplete.techStack) ? 1 : 0, 
                          y: (animationComplete.subtitle && animationComplete.neural && animationComplete.techStack) ? 0 : 10, 
                          scale: (animationComplete.subtitle && animationComplete.neural && animationComplete.techStack) ? 1 : 0.9 
                        }}
                        transition={{
                          duration: 0.4,
                          ease: [0.22, 1, 0.36, 1],
                          delay: 0.2
                        }}
                        whileHover={{
                          scale: 1.05,
                          y: -2,
                          transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] }
                        }}
                        whileTap={{
                          scale: 0.98,
                          transition: { duration: 0.1 }
                        }}
                        className="group px-5 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500/80 via-purple-500/80 to-emerald-500/80 rounded-xl text-white font-semibold
                                 hover:from-blue-600/80 hover:via-purple-600/80 hover:to-emerald-600/80 transition-all duration-300
                                 backdrop-blur-sm border border-white/10 relative overflow-hidden shadow-lg shadow-purple-500/20 transform-gpu"
                        style={{
                          filter: 'drop-shadow(0 0 10px rgba(168, 85, 247, 0.25))',
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 0 10px -2px rgba(139, 92, 246, 0.3)',
                          transform: 'translate3d(0, 0, 0)'
                        }}
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          {animationComplete.subtitle ? 'See What We Offer' : ''}
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
              // Service Slides with optimized animations
              <motion.div
                key={`service-${currentSlide}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  duration: 0.35,
                  ease: [0.32, 0.72, 0, 1],
                  opacity: { duration: 0.35 },
                  scale: { duration: 0.35 },
                  filter: { duration: 0.35 },
                  rotateY: { duration: 0.35 }
                }}
                className="relative max-w-4xl w-full mx-auto will-change-transform perspective-1000 z-10 transform-gpu"
                style={{ 
                  transformStyle: 'preserve-3d',
                  perspective: '1500px',
                  transformOrigin: 'center center',
                  backfaceVisibility: 'hidden',
                  willChange: "transform, opacity, filter",
                  position: 'relative',
                  margin: '0 auto',
                  transform: 'translate3d(0,0,0)'
                }}
                layoutId={`service-container-${currentSlide}`}
              >
                {/* Image Placeholders for AI Chatbot and AI Agent Workflow slides - positioned outside the main container */}
                

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
                      ) : serviceContent[currentSlide].title === 'WordPress Development' ? (
                        <motion.span className="relative inline-flex items-center">
                          WordPress Development
                          <motion.div 
                            className="absolute -top-6 left-0 bg-red-500/20 text-red-300 text-[10px] px-2 py-0.5 rounded-full border border-red-500/30 whitespace-nowrap"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            Discontinuing in 3 months
                          </motion.div>
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
                                 relative overflow-hidden group ${currentSlide <= 1 ? (currentSlide === 0 ? 'border-blue-400/30' : 'border-emerald-400/30') : (serviceContent[currentSlide].title === 'New 3D Website' ? 'border-cyan-400/30' : '')}`}>
                      <div className={`absolute inset-0 bg-gradient-to-r 
                        ${currentSlide <= 1 
                          ? (currentSlide === 0 
                              ? 'from-blue-500/20 via-indigo-500/20 to-blue-500/20' 
                              : 'from-emerald-500/20 via-teal-500/20 to-emerald-500/20')
                          : (serviceContent[currentSlide].title === 'New 3D Website' 
                              ? 'from-cyan-500/20 via-blue-500/20 to-cyan-500/20'
                              : 'from-purple-500/20 via-blue-500/20 to-purple-500/20')}
                        opacity-0 group-hover:opacity-100 transition-all duration-500`} />
                      <motion.h4 
                        className={`${isMobile ? 'text-xs' : 'text-sm sm:text-lg'} font-semibold mb-1.5 sm:mb-3 text-white/90 drop-shadow flex flex-wrap items-center gap-1 sm:gap-2`}
                        animate={!isMobile ? {
                          textShadow: [
                            `0 0 15px ${currentSlide <= 1 ? (currentSlide === 0 ? 'rgba(59, 130, 246, 0.5)' : 'rgba(16, 185, 129, 0.5)') : 'rgba(147, 51, 234, 0.5)'}`,
                            `0 0 25px ${currentSlide <= 1 ? (currentSlide === 0 ? 'rgba(59, 130, 246, 0.3)' : 'rgba(16, 185, 129, 0.3)') : 'rgba(147, 51, 234, 0.3)'}`,
                            `0 0 15px ${currentSlide <= 1 ? (currentSlide === 0 ? 'rgba(59, 130, 246, 0.5)' : 'rgba(16, 185, 129, 0.5)') : 'rgba(147, 51, 234, 0.5)'}`
                          ]
                        } : {}}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                      >
                        <motion.span 
                          className={`${currentSlide <= 1 ? (currentSlide === 0 ? 'text-blue-400 bg-blue-500/50 border-blue-500/50' : 'text-emerald-400 bg-emerald-500/50 border-emerald-500/50') : 'text-purple-400 bg-purple-500/50 border-purple-500/50'} ${isMobile ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-sm sm:text-lg'} rounded-lg border font-bold`}
                          animate={!isMobile ? {
                            scale: [1, 1.1, 1],
                            borderColor: [
                              currentSlide <= 1 
                                ? (currentSlide === 0 
                                   ? "rgba(59, 130, 246, 0.3)" 
                                   : "rgba(16, 185, 129, 0.3)")
                                : "rgba(147, 51, 234, 0.3)",
                              currentSlide <= 1 
                                ? (currentSlide === 0 
                                   ? "rgba(59, 130, 246, 0.5)" 
                                   : "rgba(16, 185, 129, 0.5)")
                                : "rgba(147, 51, 234, 0.5)",
                              currentSlide <= 1 
                                ? (currentSlide === 0 
                                   ? "rgba(59, 130, 246, 0.3)" 
                                   : "rgba(16, 185, 129, 0.3)")
                                : "rgba(147, 51, 234, 0.3)"
                            ]
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
                        {!isMobile && <span className={`text-[10px] sm:text-sm ${currentSlide <= 1 ? (currentSlide === 0 ? 'text-blue-400 bg-blue-500/10' : 'text-emerald-400 bg-emerald-500/10') : 'text-purple-400 bg-purple-500/10'} font-normal px-2 py-1 rounded-lg whitespace-nowrap`}>
                          {currentSlide <= 1 
                            ? (currentSlide === 0 
                              ? 'Powered by Machine Learning' 
                              : 'Automated Workflow Systems')
                            : 'Powered by Machine Learning'}
                        </span>}
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
                            <span className={`${isMobile ? 'w-1 h-1' : 'w-1.5 h-1.5'} ${currentSlide <= 1 ? (currentSlide === 0 ? 'bg-blue-400/50' : 'bg-emerald-400/50') : 'bg-purple-400/50'} rounded-full mt-1 flex-shrink-0`} />
                            {skill}
                          </motion.li>
                        ))}
                      </ul>
                      
                      {/* Add floating particles only for the first two slides */}
                      {(currentSlide === 0 || currentSlide === 1) && !isMobile && (
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                          {[...Array(6)].map((_, i) => (
                            <motion.div
                              key={`particle-${i}`}
                              className={`absolute w-1 h-1 rounded-full ${currentSlide === 0 ? 'bg-blue-400' : 'bg-emerald-400'}`}
                              style={{
                                top: `${20 + Math.random() * 60}%`,
                                left: `${10 + Math.random() * 80}%`,
                                opacity: 0.4,
                                boxShadow: currentSlide === 0 
                                  ? '0 0 4px rgba(59, 130, 246, 0.5)' 
                                  : '0 0 4px rgba(16, 185, 129, 0.5)'
                              }}
                              animate={{
                                y: [0, -15, 0],
                                opacity: [0.2, 0.5, 0.2],
                                scale: [0.8, 1.2, 0.8]
                              }}
                              transition={{
                                duration: 2 + i,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 0.2
                              }}
                            />
                          ))}
                        </div>
                      )}
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
                            className={`${currentSlide <= 1 
                              ? (currentSlide === 0 
                                  ? 'bg-blue-500/10 backdrop-blur-sm border-blue-500/20 hover:border-blue-500/30 hover:bg-blue-500/20' 
                                  : 'bg-emerald-500/10 backdrop-blur-sm border-emerald-500/20 hover:border-emerald-500/30 hover:bg-emerald-500/20')
                              : 'bg-purple-500/10 backdrop-blur-sm border-purple-500/20 hover:border-purple-500/30 hover:bg-purple-500/20'
                            } rounded-lg sm:rounded-xl ${isMobile ? 'p-1.5' : 'p-2 sm:p-4'} 
                                     border transition-all duration-250 hardware-accelerated`}
                          >
                            <h5 className={`${isMobile ? 'text-[10px] mb-1' : 'text-xs sm:text-base mb-1.5 sm:mb-2'} font-semibold ${
                              currentSlide <= 1 
                                ? (currentSlide === 0 
                                    ? 'text-blue-200' 
                                    : 'text-emerald-200')
                                : 'text-purple-200'
                            } drop-shadow flex items-center gap-1.5 sm:gap-2`}>
                              <span className={`${isMobile ? 'text-[8px] px-1 py-0.5' : 'text-[10px] sm:text-xs px-1.5 py-0.5'} rounded-full ${
                                currentSlide <= 1 
                                  ? (currentSlide === 0 
                                      ? 'bg-blue-500/20 text-blue-300' 
                                      : 'bg-emerald-500/20 text-emerald-300')
                                  : 'bg-purple-500/20 text-purple-300'
                              }`}>AI</span>
                              {feature.title}
                            </h5>
                            <ul className={`${isMobile ? 'space-y-0.5' : 'space-y-1 sm:space-y-1.5'}`}>
                              {feature.items.map((item, idx) => (
                                <li key={idx} className={`${isMobile ? 'text-[8px]' : 'text-[10px] sm:text-sm'} text-white/80 flex items-center`}>
                                  <span className={`${isMobile ? 'w-0.5 h-0.5 mr-1' : 'w-1 h-1 sm:w-1.5 sm:h-1.5 mr-1.5'} rounded-full ${
                                    currentSlide <= 1 
                                      ? (currentSlide === 0 
                                          ? 'bg-blue-400/50' 
                                          : 'bg-emerald-400/50')
                                      : 'bg-purple-400/50'
                                  } flex-shrink-0`} />
                                  {item}
                                </li>
                              ))}
                            </ul>
                            
                            {/* Add special accent line only for first two slides */}
                            {(currentSlide === 0 || currentSlide === 1) && !isMobile && (
                              <motion.div 
                                className={`h-[1px] w-full mt-2 ${currentSlide === 0 ? 'bg-blue-500/30' : 'bg-emerald-500/30'}`}
                                initial={{ scaleX: 0, opacity: 0 }}
                                animate={{ scaleX: 1, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.5 + index * 0.2 }}
                              />
                            )}
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
        {currentSlide >= 0 && serviceContent[currentSlide].imageSection && (
          <>
            {/* Guide Lines SVG */}
            <motion.svg
              className="absolute inset-0 w-full h-full pointer-events-none z-[4]"
              initial="hidden"
              animate="visible"
              style={{ overflow: 'visible' }}
            >
              {/* Right side guide line */}
              <motion.path
                d={`M 65% 70% Q 75% 70%, 85% 30%`}
                stroke={
                  currentSlide === 0 ? '#3B82F6' : 
                  currentSlide === 1 ? '#10B981' : 
                  currentSlide === 2 ? '#F97316' : 
                  currentSlide === 3 ? '#06B6D4' : 
                  currentSlide === 4 ? '#6366F1' : 
                  currentSlide === 5 ? '#22C55E' : 
                  currentSlide === 6 ? '#A855F7' : 
                  currentSlide === 7 ? '#EAB308' : 
                  currentSlide === 8 ? '#A855F7' : 
                  '#10B981'
                }
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.5 }}
                transition={{
                  duration: 1,
                  ease: "easeInOut",
                  delay: 0.5
                }}
                style={{
                  filter: `drop-shadow(0 0 3px ${
                    currentSlide === 0 ? '#3B82F6' : 
                    currentSlide === 1 ? '#10B981' : 
                    currentSlide === 2 ? '#F97316' : 
                    currentSlide === 3 ? '#06B6D4' : 
                    currentSlide === 4 ? '#6366F1' : 
                    currentSlide === 5 ? '#22C55E' : 
                    currentSlide === 6 ? '#A855F7' : 
                    currentSlide === 7 ? '#EAB308' : 
                    currentSlide === 8 ? '#A855F7' : 
                    '#10B981'
                  })`,
                  strokeDasharray: "5,5"
                }}
              />
              
              {/* Left side guide line */}
              <motion.path
                d={`M 35% 30% Q 25% 30%, 15% 60%`}
                stroke={
                  currentSlide === 0 ? '#3B82F6' : 
                  currentSlide === 1 ? '#10B981' : 
                  currentSlide === 2 ? '#F97316' : 
                  currentSlide === 3 ? '#06B6D4' : 
                  currentSlide === 4 ? '#6366F1' : 
                  currentSlide === 5 ? '#22C55E' : 
                  currentSlide === 6 ? '#A855F7' : 
                  currentSlide === 7 ? '#EAB308' : 
                  currentSlide === 8 ? '#A855F7' : 
                  '#10B981'
                }
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.5 }}
                transition={{
                  duration: 1,
                  ease: "easeInOut",
                  delay: 0.7
                }}
                style={{
                  filter: `drop-shadow(0 0 3px ${
                    currentSlide === 0 ? '#3B82F6' : 
                    currentSlide === 1 ? '#10B981' : 
                    currentSlide === 2 ? '#F97316' : 
                    currentSlide === 3 ? '#06B6D4' : 
                    currentSlide === 4 ? '#6366F1' : 
                    currentSlide === 5 ? '#22C55E' : 
                    currentSlide === 6 ? '#A855F7' : 
                    currentSlide === 7 ? '#EAB308' : 
                    currentSlide === 8 ? '#A855F7' : 
                    '#10B981'
                  })`,
                  strokeDasharray: "5,5"
                }}
              />

              {/* Animated dots along the paths */}
              <motion.circle
                r="4"
                fill={
                  currentSlide === 0 ? '#3B82F6' : 
                  currentSlide === 1 ? '#10B981' : 
                  currentSlide === 2 ? '#F97316' : 
                  currentSlide === 3 ? '#06B6D4' : 
                  currentSlide === 4 ? '#6366F1' : 
                  currentSlide === 5 ? '#22C55E' : 
                  currentSlide === 6 ? '#A855F7' : 
                  currentSlide === 7 ? '#EAB308' : 
                  currentSlide === 8 ? '#A855F7' : 
                  '#10B981'
                }
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  offsetDistance: ["0%", "100%"]
                }}
                transition={{
                  duration: 2,
                  ease: "linear",
                  repeat: Infinity,
                  delay: 1
                }}
                style={{
                  offsetPath: "path('M 65% 70% Q 75% 70%, 85% 30%')",
                  filter: `drop-shadow(0 0 2px ${
                    currentSlide === 0 ? '#3B82F6' : 
                    currentSlide === 1 ? '#10B981' : 
                    currentSlide === 2 ? '#F97316' : 
                    currentSlide === 3 ? '#06B6D4' : 
                    currentSlide === 4 ? '#6366F1' : 
                    currentSlide === 5 ? '#22C55E' : 
                    currentSlide === 6 ? '#A855F7' : 
                    currentSlide === 7 ? '#EAB308' : 
                    currentSlide === 8 ? '#A855F7' : 
                    '#10B981'
                  })`
                }}
              />

              <motion.circle
                r="4"
                fill={
                  currentSlide === 0 ? '#3B82F6' : 
                  currentSlide === 1 ? '#10B981' : 
                  currentSlide === 2 ? '#F97316' : 
                  currentSlide === 3 ? '#06B6D4' : 
                  currentSlide === 4 ? '#6366F1' : 
                  currentSlide === 5 ? '#22C55E' : 
                  currentSlide === 6 ? '#A855F7' : 
                  currentSlide === 7 ? '#EAB308' : 
                  currentSlide === 8 ? '#A855F7' : 
                  '#10B981'
                }
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  offsetDistance: ["0%", "100%"]
                }}
                transition={{
                  duration: 2,
                  ease: "linear",
                  repeat: Infinity,
                  delay: 1.2
                }}
                style={{
                  offsetPath: "path('M 35% 30% Q 25% 30%, 15% 60%')",
                  filter: `drop-shadow(0 0 2px ${
                    currentSlide === 0 ? '#3B82F6' : 
                    currentSlide === 1 ? '#10B981' : 
                    currentSlide === 2 ? '#F97316' : 
                    currentSlide === 3 ? '#06B6D4' : 
                    currentSlide === 4 ? '#6366F1' : 
                    currentSlide === 5 ? '#22C55E' : 
                    currentSlide === 6 ? '#A855F7' : 
                    currentSlide === 7 ? '#EAB308' : 
                    currentSlide === 8 ? '#A855F7' : 
                    '#10B981'
                  })`
                }}
              />
            </motion.svg>

            {/* Left Image Placeholder - Enhanced version with improved slide-in animation */}
            <motion.div
              key={`left-image-${currentSlide}`}
              initial={{ opacity: 0, scale: 0.9, x: -50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: -50 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.4, 
                ease: [0.22, 1, 0.36, 1],
                opacity: { duration: 0.5 },
                scale: { duration: 0.7 },
                x: { type: "spring", stiffness: 200, damping: 25 }
              }}
              className={`absolute left-16 bottom-23 z-[5]
                       ${isMobile ? 'hidden' : 'hidden sm:block'} w-[140px] lg:w-[180px]`}
            >
              {/* Text moved above the image */}
              <div className={`text-center mb-2 p-2 rounded-lg ${
                currentSlide === 0 ? 'bg-blue-500/20' : 
                currentSlide === 1 ? 'bg-emerald-500/20' : 
                currentSlide === 2 ? 'bg-blue-400/20' : 
                currentSlide === 3 ? 'bg-orange-500/20' : 
                currentSlide === 4 ? 'bg-cyan-500/20' : 
                currentSlide === 5 ? 'bg-indigo-500/20' : 
                currentSlide === 6 ? 'bg-green-500/20' : 
                currentSlide === 7 ? 'bg-violet-500/20' : 
                currentSlide === 8 ? 'bg-yellow-500/20' : 
                currentSlide === 9 ? 'bg-purple-500/20' : 
                currentSlide === 10 ? 'bg-purple-500/20' : 
                currentSlide === 11 ? 'bg-emerald-500/20' : 
                'bg-blue-400/20'
              }`}>
                <span className="text-xs font-semibold text-white drop-shadow-md block">
                  {serviceContent[currentSlide].imageSection.imagePlaceholders[0].title}
                </span>
                <span className="text-[10px] text-white/90 drop-shadow-md">
                  {serviceContent[currentSlide].imageSection.imagePlaceholders[0].description}
                </span>
              </div>
              
              <div 
                className={`relative w-full aspect-square rounded-lg overflow-hidden border-2 ${
                  currentSlide === 0 ? 'border-blue-500' : 
                  currentSlide === 1 ? 'border-emerald-500' : 
                  currentSlide === 2 ? 'border-blue-400' : 
                  currentSlide === 3 ? 'border-orange-500' : 
                  currentSlide === 4 ? 'border-cyan-500' : 
                  currentSlide === 5 ? 'border-indigo-500' : 
                  currentSlide === 6 ? 'border-green-500' : 
                  currentSlide === 7 ? 'border-violet-500' : 
                  currentSlide === 8 ? 'border-yellow-500' : 
                  currentSlide === 9 ? 'border-purple-500' : 
                  currentSlide === 10 ? 'border-purple-500' : 
                  currentSlide === 11 ? 'border-emerald-500' : 
                  'border-blue-400'
                } transition-transform duration-300 shadow-lg cursor-pointer`}
                onClick={() => openImagePreview(
                  currentSlide <= 1 ? (
                    currentSlide === 0 
                      ? "https://ik.imagekit.io/u7ipvwnqb/40_1x_shots_so.png?updatedAt=1751547665623" 
                      : "https://n8niostorageaccount.blob.core.windows.net/n8nio-strapi-blobs-prod/assets/Home_Dev_O_Ps_43aa01a07b.webp"
                  ) : (currentSlide >= 2 && currentSlide <= 10) && 'image' in serviceContent[currentSlide].imageSection.imagePlaceholders[0] 
                      ? (serviceContent[currentSlide].imageSection.imagePlaceholders[0] as {title: string, description: string, image: string}).image
                      : "#", // Placeholder - will be updated later
                  serviceContent[currentSlide].imageSection.imagePlaceholders[0].title
                )}
              >
                {/* Image without overlay or blur effects */}
                <div className="w-full h-full overflow-hidden bg-black/30">
                  {currentSlide <= 1 ? (
                    currentSlide === 0 ? (
                    <img 
                      src="https://ik.imagekit.io/u7ipvwnqb/40_1x_shots_so.png?updatedAt=1751547665623" 
                      alt="AI Chatbot Integration"
                        className="w-full h-full object-contain transform transition-transform duration-300 hover:scale-105"
                        loading="eager"
                    />
                  ) : (
                    <img 
                      src="https://n8niostorageaccount.blob.core.windows.net/n8nio-strapi-blobs-prod/assets/Home_Dev_O_Ps_43aa01a07b.webp" 
                      alt="AI Agent Workflow"
                        className="w-full h-full object-contain transform transition-transform duration-300 hover:scale-105"
                        loading="eager"
                    />
                    )
                  ) : (currentSlide >= 2 && currentSlide <= 10) && 'image' in serviceContent[currentSlide].imageSection.imagePlaceholders[0] ? (
                                          <img 
                      src={(serviceContent[currentSlide].imageSection.imagePlaceholders[0] as {title: string, description: string, image: string}).image} 
                      alt={serviceContent[currentSlide].imageSection.imagePlaceholders[0].title}
                      className="w-full h-full object-contain transform transition-transform duration-300 hover:scale-105"
                      loading="eager"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-xs text-white/70">Image Coming Soon</span>
                    </div>
                  )}
                </div>
                
                {/* Hover preview indicator with animation */}
                <motion.div 
                  className="absolute bottom-2 right-2 w-6 h-6 bg-white/80 rounded-full 
                            flex items-center justify-center hover:bg-white"
                  whileHover={{ scale: 1.2 }}
                  animate={{ 
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      '0 0 0 rgba(255, 255, 255, 0.4)',
                      '0 0 8px rgba(255, 255, 255, 0.6)',
                      '0 0 0 rgba(255, 255, 255, 0.4)'
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <motion.svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 text-gray-800" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                    animate={{
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </motion.svg>
                </motion.div>
              </div>
            </motion.div>
            
            {/* Right Image Placeholder - Enhanced version with smooth scale-up animation */}
            <motion.div
              key={`right-image-${currentSlide}`}
              initial={{ opacity: 0, scale: 0.7, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: 10 }}
              transition={{ 
                duration: 0.7, 
                delay: 0.5, 
                ease: [0.22, 1, 0.36, 1],
                opacity: { duration: 0.6 },
                scale: { type: "spring", stiffness: 150, damping: 22 },
                y: { duration: 0.5 }
              }}
              className={`absolute right-16 top-8 z-[5]
                       ${isMobile ? 'hidden' : 'hidden sm:block'} w-[140px] lg:w-[180px]`}
            >
              {/* Text moved above the image */}
              <div className={`text-center mb-2 p-2 rounded-lg ${
                currentSlide === 0 ? 'bg-blue-500/20' : 
                currentSlide === 1 ? 'bg-emerald-500/20' : 
                currentSlide === 2 ? 'bg-blue-400/20' : 
                currentSlide === 3 ? 'bg-orange-500/20' : 
                currentSlide === 4 ? 'bg-cyan-500/20' : 
                currentSlide === 5 ? 'bg-indigo-500/20' : 
                currentSlide === 6 ? 'bg-green-500/20' : 
                currentSlide === 7 ? 'bg-violet-500/20' : 
                currentSlide === 8 ? 'bg-yellow-500/20' : 
                currentSlide === 9 ? 'bg-purple-500/20' : 
                currentSlide === 10 ? 'bg-purple-500/20' : 
                currentSlide === 11 ? 'bg-emerald-500/20' : 
                'bg-blue-400/20'
              }`}>
                <span className="text-xs font-semibold text-white drop-shadow-md block">
                  {serviceContent[currentSlide].imageSection.imagePlaceholders[1].title}
                </span>
                <span className="text-[10px] text-white/90 drop-shadow-md">
                  {serviceContent[currentSlide].imageSection.imagePlaceholders[1].description}
                </span>
              </div>
              
              <div 
                className={`relative w-full aspect-square rounded-lg overflow-hidden border-2 ${
                  currentSlide === 0 ? 'border-blue-500' : 
                  currentSlide === 1 ? 'border-emerald-500' : 
                  currentSlide === 2 ? 'border-blue-400' : 
                  currentSlide === 3 ? 'border-orange-500' : 
                  currentSlide === 4 ? 'border-cyan-500' : 
                  currentSlide === 5 ? 'border-indigo-500' : 
                  currentSlide === 6 ? 'border-green-500' : 
                  currentSlide === 7 ? 'border-violet-500' : 
                  currentSlide === 8 ? 'border-yellow-500' : 
                  currentSlide === 9 ? 'border-purple-500' : 
                  currentSlide === 10 ? 'border-purple-500' : 
                  currentSlide === 11 ? 'border-emerald-500' : 
                  'border-blue-400'
                } transition-transform duration-300 shadow-lg cursor-pointer`}
                onClick={() => openImagePreview(
                  currentSlide <= 1 ? (
                    currentSlide === 0 
                      ? "https://ik.imagekit.io/u7ipvwnqb/359shots_so.png?updatedAt=1751547783050" 
                      : "https://appsumo2-cdn.appsumo.com/media/selfsubmissions/images/5690197f-8b9a-4f78-9d03-db22e799133c.png?width=1280&height=720&aspect_ratio=16:9&optimizer=gif"
                  ) : (currentSlide >= 2 && currentSlide <= 10) && 'image' in serviceContent[currentSlide].imageSection.imagePlaceholders[1] 
                      ? (serviceContent[currentSlide].imageSection.imagePlaceholders[1] as {title: string, description: string, image: string}).image
                      : "#", // Placeholder - will be updated later
                  serviceContent[currentSlide].imageSection.imagePlaceholders[1].title
                )}
              >
                {/* Image without overlay or blur effects */}
                <div className="w-full h-full overflow-hidden bg-black/30">
                  {currentSlide <= 1 ? (
                    currentSlide === 0 ? (
                    <img 
                      src="https://ik.imagekit.io/u7ipvwnqb/359shots_so.png?updatedAt=1751547783050" 
                      alt="AI Chatbot Business Intelligence"
                        className="w-full h-full object-contain transform transition-transform duration-300 hover:scale-105"
                        loading="eager"
                    />
                  ) : (
                    <img 
                      src="https://appsumo2-cdn.appsumo.com/media/selfsubmissions/images/5690197f-8b9a-4f78-9d03-db22e799133c.png?width=1280&height=720&aspect_ratio=16:9&optimizer=gif" 
                      alt="AI Agent Workflow Integration"
                        className="w-full h-full object-contain transform transition-transform duration-300 hover:scale-105"
                        loading="eager"
                    />
                    )
                  ) : (currentSlide >= 2 && currentSlide <= 10) && 'image' in serviceContent[currentSlide].imageSection.imagePlaceholders[1] ? (
                                          <img 
                      src={(serviceContent[currentSlide].imageSection.imagePlaceholders[1] as {title: string, description: string, image: string}).image} 
                      alt={serviceContent[currentSlide].imageSection.imagePlaceholders[1].title}
                      className="w-full h-full object-contain transform transition-transform duration-300 hover:scale-105"
                      loading="eager"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-xs text-white/70">Image Coming Soon</span>
                    </div>
                  )}
                </div>
                
                {/* Hover preview indicator with animation */}
                <motion.div 
                  className="absolute bottom-2 right-2 w-6 h-6 bg-white/80 rounded-full 
                            flex items-center justify-center hover:bg-white"
                  whileHover={{ scale: 1.2 }}
                  animate={{ 
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      '0 0 0 rgba(255, 255, 255, 0.4)',
                      '0 0 8px rgba(255, 255, 255, 0.6)',
                      '0 0 0 rgba(255, 255, 255, 0.4)'
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <motion.svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 text-gray-800" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                    animate={{
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </motion.svg>
                </motion.div>
                </div>
            </motion.div>
            
            {/* Image Preview Modal */}
            {previewImage && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
                onClick={closeImagePreview}
              >
                <div className="relative max-w-4xl max-h-[90vh] w-auto" onClick={e => e.stopPropagation()}>
                  <motion.button 
                    className="absolute -top-10 right-0 w-8 h-8 flex items-center justify-center bg-white/90 
                              rounded-full text-black hover:bg-white text-xl font-bold"
                    onClick={closeImagePreview}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ×
                  </motion.button>
                  <motion.img 
                    src={previewImage.src} 
                    alt={previewImage.alt}
                    className="max-w-full max-h-[80vh] object-contain rounded shadow-2xl"
                    initial={{ scale: 0.9, opacity: 0.5 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    loading="eager"
                  />
                  <motion.div 
                    className="text-center mt-2 text-white/90 text-sm"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {previewImage.alt}
                  </motion.div>
              </div>
            </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// This is now the only export
export default React.memo(WelcomeScreen);