'use client';

import React, { useState, useEffect, useMemo, useCallback, memo, Suspense, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCurrency } from '@/app/contexts/CurrencyContext';
import { SupportedCurrency, getLocationData, formatPrice, currencySymbols } from '@/app/utils/pricing';
import CurrencySelector from '@/app/components/CurrencySelector';
import LoadingScreen from '@/app/components/LoadingScreen';
import PricingPlans from '../components/PricingPlans';
import TransitionEffect from '../components/TransitionEffect';
import { useLocalStorage } from '@/app/hooks/useLocalStorage';
import { createRoot } from 'react-dom/client';
import confetti from 'canvas-confetti';
import { FaStore, FaWordpress } from 'react-icons/fa';
import AiIntegrationSection from '@/app/components/AiIntegrationSection';
import ReviewsDrawer from '@/app/components/ReviewsDrawer';
import ReviewsCarousel from '@/app/components/ReviewsCarousel';
import PlanReviews from '@/app/components/PlanReviews';
import { PlanReview } from '@/app/components/ReviewsDrawer';
import { audiowide, vt323 } from '@/app/utils/fonts';

// Standalone loading screen component with fixed display time
const StandaloneLoadingScreen = () => {
  const [show, setShow] = useState(true);
  
  useEffect(() => {
    console.log("StandaloneLoadingScreen mounted, will display for 10 seconds");
    // Completely prevent scrolling - more aggressive approach
    if (typeof document !== 'undefined') {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Apply multiple techniques to prevent scrolling
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.bottom = '0';
      document.body.style.width = '100%';
      document.documentElement.style.overflow = 'hidden'; // Also lock html element
      
      // Add a class for additional CSS control
      document.body.classList.add('loading-active');
    }
    
    const timer = setTimeout(() => {
      console.log("StandaloneLoadingScreen timer completed, hiding loading screen");
      setShow(false);
      
      // Re-enable scrolling and restore position
      if (typeof document !== 'undefined') {
        const scrollY = parseInt(document.body.style.top || '0') * -1;
        
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.bottom = '';
        document.body.style.width = '';
        document.documentElement.style.overflow = '';
        document.body.classList.remove('loading-active');
        
        // Restore scroll position
        window.scrollTo(0, scrollY);
      }
    }, 10000); // Display for 10 seconds for better visibility
    
    return () => {
      console.log("StandaloneLoadingScreen cleanup");
      clearTimeout(timer);
      
      // Ensure scrolling is re-enabled on unmount
      if (typeof document !== 'undefined') {
        const scrollY = parseInt(document.body.style.top || '0') * -1;
        
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.bottom = '';
        document.body.style.width = '';
        document.documentElement.style.overflow = '';
        document.body.classList.remove('loading-active');
        
        // Restore scroll position
        window.scrollTo(0, scrollY);
      }
    };
  }, []);
  
  if (!show) {
    console.log("StandaloneLoadingScreen not showing");
    return null;
  }
  
  console.log("Rendering StandaloneLoadingScreen");
  return (
    <div 
      className="fixed inset-0 bg-black z-[99999]" 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        zIndex: 99999,
        touchAction: 'none' // Prevent touch scrolling
      }}
    >
      <div className="pt-16 md:pt-20">
        <LoadingScreen />
      </div>
    </div>
  );
};

// Add these type definitions at the top of the file
type PricingFeature = string;
type BestForItem = string;

// Add interface for PricingPlan
interface PricingPlanBase {
  title: string;
  basePrice: number;
  features: string[];
  description: string;
  icon: string;
  timeline: string;
  bestFor: string[];
  includes: string[];
  highlightFeatures: string[];
  additionalInfo: {
    support: string;
    deployment: string;
    maintenance: string;
    revisions: string;
  };
}

// Define the PricingPlan interface
interface PricingPlan extends PricingPlanBase {}

// Define reviewsData locally to avoid import errors
const reviewsData: PlanReview[] = [
  {
    id: '1',
    planTitle: 'WordPress Basic',
    author: 'Ali Hassan',
    role: 'Small Business Owner',
    rating: 5,
    text: 'The WordPress Basic package was perfect for my small business website. Clean code and fast loading!',
    date: '2023-10-15',
    isVerified: true
  },
  {
    id: '2',
    planTitle: 'WordPress Professional',
    author: 'Amina Patel',
    role: 'E-commerce Manager',
    rating: 5,
    text: 'The WordPress Professional package transformed our online store. Sales increased by 45% in the first month!',
    date: '2023-09-22',
    isVerified: true
  },
  {
    id: '3',
    planTitle: 'WordPress Enterprise',
    author: 'James Thompson',
    role: 'CEO',
    rating: 5,
    text: 'The WordPress Enterprise solution has transformed our digital presence. Comprehensive and powerful!',
    date: '2023-11-03',
    isVerified: true
  },
  {
    id: '4',
    planTitle: 'Full-Stack Basic',
    author: 'Zain Ahmed',
    role: 'Startup Founder',
    rating: 5,
    text: 'The Full-Stack Basic package was perfect for our MVP. Clean code and great user experience!',
    date: '2023-10-28',
    isVerified: true
  },
  {
    id: '5',
    planTitle: 'Full-Stack Professional',
    author: 'Layla Khan',
    role: 'CTO',
    rating: 5,
    text: 'The TypeScript integration and NestJS backend have made our codebase robust and maintainable!',
    date: '2023-09-14',
    isVerified: true
  },
  {
    id: '6',
    planTitle: 'Full-Stack Enterprise',
    author: 'Alexander Wright',
    role: 'Enterprise Architect',
    rating: 5,
    text: 'The microservices architecture has transformed our enterprise application. Exceptional scalability!',
    date: '2023-11-10',
    isVerified: true
  },
  {
    id: '7',
    planTitle: 'AI Agents/WebApps',
    author: 'Dr. Rahul Mehta',
    role: 'Research Director',
    rating: 5,
    text: 'The AI integration is seamless and powerful. Our data processing has never been more efficient!',
    date: '2023-10-05',
    isVerified: true
  },
  {
    id: '8',
    planTitle: 'SEO/Content Writing',
    author: 'Benjamin Foster',
    role: 'Content Strategist',
    rating: 5,
    text: 'The semantic keyword research and E-E-A-T content strategy have significantly improved our search rankings!',
    date: '2023-09-30',
    isVerified: true
  },
  {
    id: '9',
    planTitle: 'UI/UX Design',
    author: 'Ethan Williams',
    role: 'Product Designer',
    rating: 5,
    text: 'The design system and interactive prototypes have streamlined our development process!',
    date: '2023-11-08',
    isVerified: true
  },
  {
    id: '10',
    planTitle: 'Mobile App Development',
    author: 'Lucas Chen',
    role: 'App Founder',
    rating: 5,
    text: 'Cross-platform development with native features integration is exceptional. Our app is performing brilliantly!',
    date: '2023-10-20',
    isVerified: true
  }
];

// Add simplified reviews data for the carousel
const carouselReviews = reviewsData.map(review => ({
  text: review.text,
  author: review.author,
  role: review.role,
  rating: review.rating,
  highlightedPhrase: review.planTitle
}));

const pricingPlans: PricingPlan[] = [
  {
    title: "WordPress Basic",
    basePrice: 38500,
    description: "Perfect starter package with essential WordPress features, basic semantic SEO, and E-E-A-T optimization.",
    icon: "🎯",
    timeline: "1-2 weeks",
    bestFor: ["Small Businesses", "Personal Blogs", "Portfolio Sites", "Startups"],
    includes: [
      "GeneratePress Theme License",
      "5 Days Revision Period",
      "2 SEO Articles",
      "Basic Security Package",
      "Basic E-E-A-T Setup"
    ],
    features: [
      "Complete Website Development (Up to 5 Pages)",
      "Mobile-First Responsive Design",
      "Essential Premium Plugins Integration",
      "Speed & Performance Optimization",
      "Basic Semantic SEO Implementation",
      "Basic E-E-A-T Optimization",
      "Author Expertise Markup",
      "Basic Schema Implementation",
      "Google Analytics 4 Setup",
      "Contact Form Integration",
      "Social Media Integration",
      "Basic Content Structure",
      "Mobile Usability Optimization",
      "5 Days Post-Launch Support"
    ],
    highlightFeatures: [
      "Complete Website Development",
      "Mobile-First Responsive Design",
      "Essential Premium Plugins",
      "Basic SEO Implementation",
      "Basic Security Setup"
    ],
    additionalInfo: {
      support: "5 Days Post-Launch Support",
      deployment: "Basic Hosting Setup",
      maintenance: "Basic Updates",
      revisions: "1 Round of Revisions"
    }
  },
  {
    title: "WordPress Professional",
    basePrice: 49500,
    description: "Advanced WordPress solution with comprehensive semantic SEO and E-E-A-T optimization for growing businesses.",
    icon: "⚡",
    timeline: "2-3 weeks",
    bestFor: [
      "Growing Businesses",
      "Content Creators",
      "Online Magazines",
      "E-commerce Startups"
    ],
    includes: [
      "Premium Theme License (Foxiz/Pixwell/Phlox)",
      "10 Days Revision Period",
      "Pro Plugins Bundle",
      "Advanced Security Package",
      "Full E-E-A-T Implementation"
    ],
    features: [
      "Complete Website Development (Up to 10 Pages)",
      "Premium Theme & Elementor Pro Setup",
      "Advanced Performance Optimization",
      "Comprehensive Semantic SEO",
      "Advanced E-E-A-T Implementation",
      "Expert Author Profiles Setup",
      "Content Entity Optimization",
      "Topic Cluster Implementation",
      "Advanced Schema Markup",
      "Knowledge Graph Optimization",
      "Content Quality Guidelines",
      "Trust Signals Integration",
      "Expertise Demonstration Setup",
      "Authority Building Features",
      "Advanced Analytics Integration"
    ],
    highlightFeatures: [
      "Premium Theme & Elementor Pro",
      "Advanced Performance",
      "Comprehensive SEO",
      "Expert Author Profiles",
      "Advanced Analytics"
    ],
    additionalInfo: {
      support: "10 Days Post-Launch Support",
      deployment: "Premium Hosting Setup",
      maintenance: "Regular Updates",
      revisions: "2 Rounds of Revisions"
    }
  },
  {
    title: "WordPress Enterprise",
    basePrice: 71500,
    description: "Complete WordPress solution with advanced semantic SEO, E-E-A-T mastery, and comprehensive digital presence.",
    icon: "👑",
    timeline: "3-4 weeks",
    bestFor: [
      "Large Businesses",
      "E-commerce Sites",
      "News Portals",
      "Multi-location Businesses"
    ],
    includes: [
      "All Premium Theme Access ($500+ Value)",
      "Premium Plugins Bundle ($1000+ Value)",
      "1 Year Hostinger Business Hosting",
      "Free Domain Registration",
      "Premium SSL Certificate",
      "Enterprise E-E-A-T Package"
    ],
    features: [
      "Unlimited Pages Development",
      "Premium Theme Access (AVADA, FOXIX, PIXWELL)",
      "Enterprise Semantic SEO",
      "Complete E-E-A-T Mastery",
      "Advanced Entity Optimization",
      "Industry Expert Profiles",
      "Professional Content Guidelines",
      "Editorial Standards Setup",
      "Multi-language E-E-A-T",
      "Advanced Trust Building",
      "Semantic Content Structure",
      "Knowledge Panel Optimization",
      "Brand Entity Development",
      "Authority Site Architecture",
      "Comprehensive Analytics Suite"
    ],
    highlightFeatures: [
      "Unlimited Pages Development",
      "Premium Theme Access",
      "Enterprise SEO Suite",
      "Multi-language Support",
      "Advanced Security"
    ],
    additionalInfo: {
      support: "1 Year Premium Support",
      deployment: "Enterprise Hosting",
      maintenance: "Priority Updates",
      revisions: "3 Rounds of Revisions"
    }
  },
  {
    title: "Full-Stack Basic",
    basePrice: 60500,
    description: "Entry-level full-stack development package with essential features and modern tech stack for startups and small businesses.",
    icon: "💻",
    timeline: "2-3 weeks",
    bestFor: ["Startups", "Small Businesses", "MVPs", "Personal Projects"],
    includes: [
      "React/Next.js Frontend",
      "Node.js Backend",
      "MongoDB Database",
      "Basic Deployment",
      "3 Months Support",
      "Basic SEO Setup"
    ],
    features: [
      "Modern React/Next.js Frontend",
      "Node.js/Express Backend",
      "MongoDB Database Setup",
      "Basic User Authentication",
      "Essential API Endpoints",
      "Responsive Design",
      "Basic SEO Setup",
      "Performance Optimization",
      "Security Best Practices",
      "Basic Documentation",
      "User Management System",
      "RESTful API Development",
      "Form Handling & Validation",
      "Error Handling & Logging",
      "Basic Analytics Integration"
    ],
    highlightFeatures: [
      "Modern React/Next.js Frontend",
      "Node.js/Express Backend",
      "MongoDB Database Setup",
      "Basic User Authentication",
      "Essential API Endpoints"
    ],
    additionalInfo: {
      support: "3 Months Basic Support",
      deployment: "Basic Server Setup",
      maintenance: "Monthly Updates",
      revisions: "2 Rounds of Revisions"
    }
  },
  {
    title: "Full-Stack Professional",
    basePrice: 82500,
    description: "Advanced full-stack solution with robust features, TypeScript integration, and scalable architecture for growing businesses.",
    icon: "⚡",
    timeline: "3-4 weeks",
    bestFor: ["Growing Businesses", "E-commerce", "SaaS Products", "Web Applications"],
    includes: [
      "Next.js with TypeScript",
      "NestJS Backend",
      "PostgreSQL Database",
      "Cloud Deployment"
    ],
    features: [
      "Next.js/TypeScript Frontend",
      "Node.js/NestJS Backend",
      "PostgreSQL with Prisma ORM",
      "OAuth & JWT Authentication",
      "Comprehensive API Suite",
      "Advanced State Management",
      "Unit & Integration Tests",
      "CI/CD Setup",
      "Performance Monitoring",
      "Detailed Documentation"
    ],
    highlightFeatures: [
      "Next.js/TypeScript Frontend",
      "NestJS Backend",
      "PostgreSQL with Prisma",
      "Advanced Authentication",
      "CI/CD Pipeline"
    ],
    additionalInfo: {
      support: "6 Months Premium Support",
      deployment: "Cloud Infrastructure Setup",
      maintenance: "Bi-weekly Updates",
      revisions: "3 Rounds of Revisions"
    }
  },
  {
    title: "Full-Stack Enterprise",
    basePrice: 104500,
    description: "Enterprise-grade full-stack solution with advanced features, microservices architecture, and comprehensive DevOps integration.",
    icon: "👑",
    timeline: "4-6 weeks",
    bestFor: ["Large Enterprises", "High-Scale Applications", "Complex Systems", "Enterprise Solutions"],
    includes: [
      "Next.js Enterprise Setup",
      "Microservices Architecture",
      "Multi-Database Solution",
      "DevOps Pipeline",
      "24/7 Support"
    ],
    features: [
      "Enterprise Next.js Architecture",
      "Microservices Implementation",
      "Multi-Database Integration",
      "Advanced Security Features",
      "Load Balancing Setup",
      "Auto-Scaling Configuration",
      "Comprehensive Monitoring",
      "Performance Optimization",
      "Advanced Caching System",
      "CDN Integration",
      "Disaster Recovery Plan",
      "High Availability Setup",
      "Enterprise Authentication",
      "Advanced Analytics",
      "24/7 Support Package"
    ],
    highlightFeatures: [
      "Microservices Architecture",
      "Multi-Database Integration",
      "Load Balancing & Auto-Scaling",
      "Advanced Security Suite",
      "24/7 Support Package"
    ],
    additionalInfo: {
      support: "1 Year Enterprise Support",
      deployment: "Enterprise Cloud Setup",
      maintenance: "Weekly Updates",
      revisions: "Unlimited Revisions"
    }
  },
  {
    title: "AI Agents/WebApps",
    basePrice: 93500,
    description: "Intelligent web applications powered by cutting-edge AI technology.",
    icon: "🤖",
    timeline: "1-2 weeks",
    bestFor: ["Tech Companies", "Automation Needs", "Data-driven Businesses"],
    includes: ["AI Model Training", "API Access", "Usage Analytics"],
    features: [
      "AI Model Integration",
      "Custom AI Solutions",
      "Real-time Processing",
      "Data Analytics",
      "Scalable Architecture",
      "API Development",
      "Machine Learning Pipeline",
      "Automated Workflows"
    ],
    highlightFeatures: [
      "AI Model Integration",
      "Custom AI Solutions",
      "Real-time Processing",
      "Scalable Architecture",
      "API Development"
    ],
    additionalInfo: {
      support: "6 Months AI Support",
      deployment: "AI Infrastructure Setup",
      maintenance: "Model Updates",
      revisions: "2 Rounds of Fine-tuning"
    }
  },
  {
    title: "SEO/Content Writing",
    basePrice: 33000,
    description: "Strategic content creation with semantic SEO and E-E-A-T optimization to establish topical authority.",
    icon: "📝",
    timeline: "Ongoing",
    bestFor: [
      "Content Marketers",
      "Digital Brands",
      "Online Publications",
      "E-commerce Sites"
    ],
    includes: [
      "Monthly Reports",
      "Semantic Keyword Research",
      "E-E-A-T Content Calendar",
      "SEO Tools Access",
      "Content Quality Guidelines"
    ],
    features: [
      "Semantic Keyword Research",
      "E-E-A-T Content Strategy",
      "Topic Authority Building",
      "Expert Content Creation",
      "Entity-Based Optimization",
      "Knowledge Graph Integration",
      "Author Expertise Development",
      "Trust Signal Implementation",
      "Content Quality Assurance",
      "Topical Authority Planning",
      "Entity Relationship Building",
      "Content Performance Analysis",
      "Authority Metrics Tracking",
      "Semantic Content Structure"
    ],
    highlightFeatures: [
      "Semantic Keyword Research",
      "E-E-A-T Content Strategy",
      "Topic Authority Building",
      "Content Quality Assurance",
      "Performance Analysis"
    ],
    additionalInfo: {
      support: "Ongoing Support",
      deployment: "Content Calendar Setup",
      maintenance: "Monthly Content Updates",
      revisions: "2 Rounds per Content"
    }
  },
  {
    title: "UI/UX Design",
    basePrice: 55000,
    description: "Professional UI/UX design services with modern aesthetics, user research, and comprehensive design systems.",
    icon: "🎨",
    timeline: "2-3 weeks",
    bestFor: [
      "Digital Products",
      "Web Applications",
      "Mobile Apps",
      "SaaS Platforms"
    ],
    includes: [
      "Complete Design System",
      "User Research Report",
      "Interactive Prototypes",
      "Design Documentation",
      "Brand Guidelines"
    ],
    features: [
      "User Research & Analysis",
      "Information Architecture",
      "Wireframing & Prototyping",
      "Visual Design & Branding",
      "Design System Creation",
      "User Flow Optimization",
      "Responsive Design",
      "Interactive Prototypes",
      "Usability Testing",
      "Design Documentation",
      "Design Handoff Support",
      "Design QA Process",
      "Accessibility Guidelines",
      "Animation Guidelines",
      "Design Asset Library"
    ],
    highlightFeatures: [
      "Complete Design System",
      "Interactive Prototypes",
      "User Research",
      "Responsive Design",
      "Design Documentation"
    ],
    additionalInfo: {
      support: "3 Months Design Support",
      deployment: "Design System Setup",
      maintenance: "Monthly Design Updates",
      revisions: "3 Rounds of Revisions"
    }
  },
  {
    title: "Mobile App Development",
    basePrice: 122920, // This is equivalent to $439 USD (439 * 280 PKR)
    description: "Professional mobile app development with cross-platform capabilities, native features, and AI integration.",
    icon: "📱",
    timeline: "4-6 weeks",
    bestFor: [
      "Startups",
      "Businesses",
      "Entrepreneurs",
      "Enterprise Solutions"
    ],
    includes: [
      "React Native/Flutter Development",
      "Native Features Integration",
      "AI-Powered Features",
      "App Store Deployment",
      "Analytics Integration",
      "Push Notifications"
    ],
    features: [
      "Cross-Platform Development",
      "Native Device Features",
      "Real-time Updates",
      "Offline Functionality",
      "Push Notifications",
      "User Authentication",
      "Cloud Integration",
      "Analytics Dashboard",
      "Performance Optimization",
      "App Store Submission",
      "Play Store Submission",
      "In-App Purchases",
      "Social Media Integration",
      "Location Services",
      "Secure Data Storage"
    ],
    highlightFeatures: [
      "Cross-Platform Support",
      "Native Features",
      "Cloud Integration",
      "App Store Deployment",
      "Analytics Dashboard"
    ],
    additionalInfo: {
      support: "6 Months Premium Support",
      deployment: "App Store & Play Store",
      maintenance: "Monthly Updates",
      revisions: "3 Rounds of Revisions"
    }
  },
];


// Add testimonials data
const testimonials = [
  {
    text: "The development process was smooth and the results exceeded our expectations.",
    author: "SANA MALIK",
    role: "WEBDEVELOPER",
    icon: "💫"
  },
  {
    text: "Outstanding service and incredible attention to detail. Highly recommended!",
    author: "USMAN AFTAB",
    role: "Founder, EcoStore",
    icon: "⭐"
  },
  {
    text: "The team delivered our project ahead of schedule with exceptional quality.",
    author: "EMAN ALI",
    role: "Marketing Director",
    icon: "🌟"
  }
];

// Add these type definitions at the top of the file
interface Feature {
  text: string;
  id: number;
}

interface BestFor {
  text: string;
  id: number;
}

// Update PricingCardProps
interface PricingCardProps {
  plan: PricingPlan;
  onSelect: (plan: PricingPlan) => void;
  onGetStarted: (plan: PricingPlan) => Promise<void>;
  currency: SupportedCurrency;
  exchangeRate: number;
  isExemptCountry: boolean;
  isBaseCurrency: boolean;
  getFormattedPrice: (basePrice: number) => string;
}

// Update PlanModalProps
interface PlanModalProps {
  plan: PricingPlan;
  onClose: () => void;
  onGetStarted: (plan: PricingPlan) => Promise<void>;
  getFormattedPrice: (basePrice: number) => string;
}

// Optimize the PricingCard component with memo and reduced animations
const PricingCard = memo(({ 
  plan, 
  onSelect, 
  onGetStarted,
  currency,
  exchangeRate,
  isExemptCountry,
  isBaseCurrency,
  getFormattedPrice
}: PricingCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.1 }}
      className={`${
        plan.title.includes('Full-Stack') 
          ? 'bg-gradient-to-br from-purple-900/20 to-black border-purple-500/40' 
          : 'bg-black/40 border-purple-500/20'
      } backdrop-blur-sm rounded-2xl p-4 md:p-6 border relative touch-manipulation pricing-card`}
    >
      {/* Most Popular Badge */}
      {(plan.title === "WordPress Enterprise" || 
        plan.title === "Full-Stack Professional" || 
        plan.title === "AI Agents/WebApps") && (
        <div className="absolute -top-3 -right-2 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg transform rotate-2 z-10">
          MOST POPULAR
        </div>
      )}
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <h3 className="text-lg md:text-2xl font-bold text-white">{plan.title}</h3>
        <div className="text-2xl md:text-4xl">{plan.icon}</div>
      </div>

      {/* Price Section */}
      <div className="relative">
        <div className="flex items-center gap-2">
          <p className={`${
            getFormattedPrice(plan.basePrice) === "SOON" 
              ? "text-purple-400 font-bold text-lg" 
              : "text-purple-300"
            } text-base md:text-xl mb-1 md:mb-2`}
          >
            {getFormattedPrice(plan.basePrice)}
            {getFormattedPrice(plan.basePrice) === "SOON" && (
              <span className="text-xs font-normal ml-2 text-purple-300">
                (Coming Soon)
              </span>
            )}
          </p>
          {['USD', 'GBP', 'AED'].includes(currency) && getFormattedPrice(plan.basePrice) !== "SOON" && (
            <span className="bg-purple-500 text-white text-[10px] md:text-xs px-1.5 py-0.5 rounded-full font-medium">
              UPDATED
            </span>
          )}
        </div>
      </div>

      <p className="text-gray-400 text-xs md:text-sm mb-3 md:mb-4">Timeline: {plan.timeline}</p>

      {/* Features Preview */}
      <ul className="text-gray-300 space-y-2 md:space-y-3 mb-4 md:mb-6">
        {useMemo(() => plan.features.slice(0, 3).map((feature, i) => (
          <li key={i} className="flex items-center text-sm md:text-base">
            <svg className="w-4 h-4 md:w-5 md:h-5 text-purple-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {feature}
          </li>
        )), [plan.features])}
      </ul>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2">
        <button 
          onClick={() => getFormattedPrice(plan.basePrice) !== "SOON" && onSelect(plan)}
          className={`flex-1 py-2 md:py-3 px-4 text-white bg-purple-500/10 
            ${getFormattedPrice(plan.basePrice) === "SOON" 
              ? 'opacity-50 cursor-not-allowed' 
              : 'cursor-pointer hover:bg-purple-500/20'} 
            rounded-xl transition-all duration-200
            font-semibold text-sm md:text-base learn-more-btn`}
        >
          Learn More
        </button>
        <button 
          onClick={() => getFormattedPrice(plan.basePrice) !== "SOON" && onGetStarted(plan)}
          className={`flex-1 py-2 md:py-3 px-4 
            ${getFormattedPrice(plan.basePrice) === "SOON"
              ? 'bg-white/50 cursor-not-allowed'
              : plan.title === "Mobile App Development"
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                : 'bg-white hover:bg-gray-50 text-black'}
            rounded-xl transition-all duration-200 transform hover:scale-[1.02]
            font-semibold text-sm md:text-base flex items-center justify-center gap-2 get-started-btn
            shadow-lg hover:shadow-xl ${plan.title === "Mobile App Development" ? 'shadow-purple-500/20 hover:shadow-purple-500/30' : ''}`}
          style={plan.title === "Mobile App Development" ? {} : { color: 'black' }}
        >
          {getFormattedPrice(plan.basePrice) === "SOON" ? (
            "Coming Soon"
          ) : (
            <>
              {plan.title === "Mobile App Development" ? (
                <div className="flex items-center gap-2">
                  <span>JOIN PRIVATELY</span>
                  <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              ) : (
                <>
                  Get Started
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </>
              )}
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
});

PricingCard.displayName = 'PricingCard';

// Optimize the PlanModal component with reduced animations
const PlanModal = memo(({ plan, onClose, onGetStarted, getFormattedPrice }: PlanModalProps) => {
  const featureBatches = useMemo(() => {
    const batches = [];
    for (let i = 0; i < plan.features.length; i += 3) {
      batches.push(plan.features.slice(i, i + 3));
    }
    return batches;
  }, [plan.features]);

  return (
    <div 
      className="fixed inset-0 bg-black/90 flex items-start justify-center z-[9999] p-4 overflow-y-auto pt-16 md:pt-32"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="bg-gradient-to-br from-black/95 to-purple-900/10 backdrop-blur-xl rounded-2xl p-6 md:p-8 w-full max-w-4xl mx-auto relative border border-purple-500/30"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="text-5xl phone-icon">📱</div>
              <div className="absolute -top-2 -right-2 text-2xl sparkle-icon">✨</div>
            </div>
            <div>
              <h2 className={`${audiowide.className} text-3xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400`}>
                Mobile App Development
              </h2>
              <p className="text-purple-300">Transform your ideas into powerful mobile experiences</p>
            </div>
          </div>

          {/* Store Requirements Section */}
          <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-xl p-6 border border-purple-500/30 hover:border-purple-500/50 transition-colors">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              App Store Requirements
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="bg-black/40 rounded-lg p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-purple-300">Google Play Store</span>
                    <span className="text-green-400 font-semibold">$25</span>
                  </div>
                  <p className="text-gray-400 text-sm">One-time registration fee</p>
                </div>
                <div className="bg-black/40 rounded-lg p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-purple-300">Apple App Store</span>
                    <span className="text-green-400 font-semibold">$99/year</span>
                  </div>
                  <p className="text-gray-400 text-sm">Annual developer membership</p>
                </div>
              </div>
              <div className="bg-purple-900/20 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3">Additional Requirements:</h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Developer account verification
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    App privacy policy
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Content guidelines compliance
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-xl p-6 border border-purple-500/30">
            <div className="grid md:grid-cols-2 gap-4">
              <a 
                href="mailto:nexwebs.org@gmail.com" 
                className="flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors bg-black/20 p-3 rounded-lg hover:bg-black/30"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                nexwebs.org@gmail.com
              </a>
              <a 
                href="mailto:nexdevs.org@gmail.com" 
                className="flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors bg-black/20 p-3 rounded-lg hover:bg-black/30"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                nexdevs.org@gmail.com
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Close
            </button>
            <a
              href="mailto:nexwebs.org@gmail.com?subject=Mobile App Development Inquiry&body=I'm interested in developing a mobile app. Please schedule a consultation call."
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg transition-all hover:from-purple-500 hover:to-pink-500 flex items-center gap-2 justify-center group"
            >
              Schedule Consultation
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

// Replace the GuidedTour component and related interfaces with our new popup guide
interface SiteGuideSection {
  title: string;
  content: React.ReactNode;
  icon: string;
  description: string;
}

// New WebsiteGuide popup component
const WebsiteGuide = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const [hasCompletedGuide, setHasCompletedGuide] = useState(false);
  
  // Close welcome message after a delay
  useEffect(() => {
    if (isOpen && showWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 2000); // Slightly shorter delay for better UX
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, showWelcome]);
  
  // Add CSS for smooth scrolling
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .smooth-scroll {
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: thin;
        scrollbar-color: rgba(139, 92, 246, 0.3) rgba(0, 0, 0, 0.2);
      }
      .smooth-scroll::-webkit-scrollbar {
        width: 6px;
      }
      .smooth-scroll::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 10px;
      }
      .smooth-scroll::-webkit-scrollbar-thumb {
        background: rgba(139, 92, 246, 0.3);
        border-radius: 10px;
      }
      .smooth-scroll::-webkit-scrollbar-thumb:hover {
        background: rgba(139, 92, 246, 0.5);
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .fade-in-element {
        animation: fadeIn 0.5s ease-out forwards;
      }
      
      body.no-scroll {
        overflow: hidden !important;
        height: 100vh !important;
        position: fixed !important;
        width: 100% !important;
      }
    `;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, [isOpen]);

  // Add scroll lock effect when guide is open
  useEffect(() => {
    if (isOpen) {
      // Disable scrolling on body
      document.body.classList.add('no-scroll');
    } else {
      // Re-enable scrolling on body
      document.body.classList.remove('no-scroll');
    }
    
    return () => {
      // Cleanup - re-enable scrolling when component unmounts
      document.body.classList.remove('no-scroll');
    };
  }, [isOpen]);

  const handleCloseGuide = () => {
    setHasCompletedGuide(true);
    onClose();
  };

  const sections: SiteGuideSection[] = [
    {
      title: "Auto Region Detection",
      icon: "🌎",
      description: "Our website automatically detects your region and sets the appropriate currency. View pricing in USD, GBP, AED, and PKR with real-time conversion rates.",
      content: (
        <div className="flex flex-col">
          {/* Details section - scrollable */}
          <div className="overflow-y-auto custom-scrollbar mb-6 max-h-[300px]">
            <div className="bg-gradient-to-r from-purple-900/20 to-black/20 rounded-lg p-4 border border-purple-500/30">
              <h4 className="text-purple-300 font-semibold text-sm mb-3">How It Works:</h4>
              <ul className="list-disc list-inside space-y-2 text-gray-300 text-sm">
                <li>Automatic IP geolocation identifies your country</li>
                <li>Local currency is set based on your location</li>
                <li>Real-time exchange rates for accurate pricing</li>
                <li>Manually change currency anytime</li>
              </ul>
            </div>
          </div>
          
          {/* Image section - fixed below */}
          <div className="mt-4">
            <div className="aspect-[16/9] w-full max-w-[600px] mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 to-black/30 rounded-xl" />
              <img 
                src="https://ik.imagekit.io/u7ipvwnqb/850_1x_shots_so.png"
                alt="Region Detection Illustration"
                className="w-full h-full object-cover rounded-xl relative z-10"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Pricing Plans",
      icon: "💰",
      description: "Our pricing is transparent and flexible, with options for every business size. All plans include premium support and regular updates.",
      content: (
        <div className="flex flex-col">
          {/* Details section - scrollable */}
          <div className="overflow-y-auto custom-scrollbar mb-6 max-h-[300px]">
            <div className="bg-gradient-to-r from-purple-900/20 to-black/20 rounded-lg p-4 border border-purple-500/30">
              <h4 className="text-purple-300 font-semibold text-sm mb-3">Plan Categories:</h4>
              <ul className="list-disc list-inside space-y-2 text-gray-300 text-sm">
                <li><span className="text-white font-medium">WordPress Plans</span> - Basic to enterprise</li>
                <li><span className="text-white font-medium">Full-Stack Development</span> - Modern web apps</li>
                <li><span className="text-white font-medium">AI Integration</span> - Custom AI solutions</li>
                <li><span className="text-white font-medium">Specialized Services</span> - SEO, UI/UX, mobile</li>
              </ul>
            </div>
          </div>
          
          {/* Image section - fixed below */}
          <div className="mt-4">
            <div className="aspect-[16/9] w-full max-w-[600px] mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 to-black/30 rounded-xl" />
              <img 
                src="https://ik.imagekit.io/u7ipvwnqb/128_1x_shots_so.png"
                alt="Pricing Plans Overview"
                className="w-full h-full object-cover rounded-xl relative z-10"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      title: "AI Integrations",
      icon: "🤖",
      description: "Transform websites into intelligent, responsive platforms with cutting-edge technology tailored to your needs.",
      content: (
        <div className="flex flex-col">
          {/* Details section - scrollable */}
          <div className="overflow-y-auto custom-scrollbar mb-6 max-h-[300px]">
            <div className="bg-gradient-to-r from-purple-900/20 to-black/20 rounded-lg p-4 border border-purple-500/30">
              <h4 className="text-purple-300 font-semibold text-sm mb-3">AI Features:</h4>
              <ul className="list-disc list-inside space-y-2 text-gray-300 text-sm">
                <li><span className="text-white font-medium">Custom Chatbots</span> - Trained on your data</li>
                <li><span className="text-white font-medium">Content Generation</span> - Automated marketing</li>
                <li><span className="text-white font-medium">Business Intelligence</span> - Data insights</li>
                <li><span className="text-white font-medium">Recommendations</span> - Personalized experience</li>
              </ul>
            </div>
          </div>
          
          {/* Image section - fixed below */}
          <div className="mt-4">
            <div className="aspect-[16/9] w-full max-w-[600px] mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 to-black/30 rounded-xl" />
              <img 
                src="https://ik.imagekit.io/u7ipvwnqb/574_1x_shots_so.png"
                alt="AI Integration Example"
                className="w-full h-full object-cover rounded-xl relative z-10"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Our Reviews",
      icon: "⭐",
      description: "Don't just take our word for it - see what our clients have to say about our services.",
      content: (
        <div className="flex flex-col">
          {/* Details section - scrollable */}
          <div className="overflow-y-auto custom-scrollbar mb-6 max-h-[300px]">
            <div className="bg-gradient-to-r from-purple-900/20 to-black/20 rounded-lg p-4 border border-purple-500/30">
              <h4 className="text-purple-300 font-semibold text-sm mb-3">Key Stats:</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-black/20 rounded-lg">
                  <p className="text-2xl font-bold text-white">98%</p>
                  <p className="text-sm text-purple-300">Satisfaction</p>
                </div>
                <div className="text-center p-3 bg-black/20 rounded-lg">
                  <p className="text-2xl font-bold text-white">245+</p>
                  <p className="text-sm text-purple-300">Projects</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Image section - fixed below */}
          <div className="mt-4">
            <div className="aspect-[16/9] w-full max-w-[600px] mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 to-black/30 rounded-xl" />
              <img 
                src="https://ik.imagekit.io/u7ipvwnqb/605_1x_shots_so.png"
                alt="Client Testimonials"
                className="w-full h-full object-cover rounded-xl relative z-10"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      title: "WordPress & Shopify",
      icon: "🛒",
      description: "Our e-commerce solutions create powerful, high-converting stores with optimized performance, SEO, and user experience.",
      content: (
        <div className="flex flex-col">
          {/* Details section - scrollable */}
          <div className="overflow-y-auto custom-scrollbar mb-6 max-h-[300px]">
            <div className="bg-gradient-to-r from-purple-900/20 to-black/20 rounded-lg p-4 border border-purple-500/30">
              <h4 className="text-purple-300 font-semibold text-sm mb-3">Solutions:</h4>
              <ul className="list-disc list-inside space-y-2 text-gray-300 text-sm">
                <li><span className="text-white font-medium">WordPress Basic</span> - Rs38,500</li>
                <li><span className="text-white font-medium">WordPress Pro</span> - Rs49,500</li>
                <li><span className="text-white font-medium">WordPress Enterprise</span> - Rs71,500</li>
                <li><span className="text-white font-medium">Shopify Standard</span> - $900</li>
              </ul>
            </div>
          </div>
          
          {/* Image section - fixed below */}
          <div className="mt-4">
            <div className="aspect-[16/9] w-full max-w-[600px] mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 to-black/30 rounded-xl" />
              <img 
                src="https://ik.imagekit.io/u7ipvwnqb/207_1x_shots_so.png"
                alt="E-Commerce Solutions"
                className="w-full h-full object-cover rounded-xl relative z-10"
              />
            </div>
          </div>
        </div>
      )
    }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] pointer-events-auto"
        >
          {/* Welcome message overlay */}
          <AnimatePresence>
            {showWelcome && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.1, opacity: 0 }}
                  transition={{ type: "spring", bounce: 0.4 }}
                  className="bg-gradient-to-br from-purple-600/20 to-black/80 rounded-2xl p-6 max-w-xs border border-purple-500/40 text-center backdrop-blur-lg"
                >
                  <div className="text-3xl mb-3">👋</div>
                  <h2 className="text-xl font-bold text-white mb-2">Welcome to NEX-WEBS</h2>
                  <p className="text-purple-200 text-sm mb-4">
                    Explore our guide to discover pricing options and features.
                  </p>
                  <button 
                    onClick={() => setShowWelcome(false)}
                    className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all text-sm"
                  >
                    Get Started
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Main guide interface - Improved layout */}
          <div className="fixed inset-0 flex">
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            
            {/* Left sidebar - Adjusted higher position */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="fixed top-[48px] left-4 w-48 bg-gradient-to-b from-black to-purple-900/20 h-[calc(100vh-120px)] max-h-[420px] border border-purple-500/20 rounded-xl overflow-hidden z-50"
            >
              <div className="p-3 border-b border-purple-500/20">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="text-sm">📖</span> Site Guide
                </h3>
                <p className="text-purple-300 text-xs mt-1">Explore our features</p>
              </div>
              
              <nav className="p-2 space-y-1 overflow-y-auto max-h-[calc(100%-120px)]">
                {sections.map((section, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSection(index)}
                    className={`w-full text-left px-2 py-2 rounded-lg flex items-center gap-2 transition-all ${
                      currentSection === index 
                        ? "bg-purple-900/40 text-white" 
                        : "text-gray-300 hover:bg-purple-900/10 hover:text-white"
                    }`}
                  >
                    <span className="text-sm">{section.icon}</span>
                    <span className="text-xs font-medium">{section.title}</span>
                  </button>
                ))}
              </nav>

              {/* Progress indicator */}
              <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-purple-500/20">
                <div className="flex items-center justify-between text-xs text-purple-300 mb-2">
                  <span>Progress</span>
                  <span>{Math.round((currentSection + 1) / sections.length * 100)}%</span>
                </div>
                <div className="h-1 bg-purple-900/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300"
                    style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
                  />
                </div>
                
                <div className="mt-3">
                  {currentSection === sections.length - 1 ? (
                    <button
                      onClick={handleCloseGuide}
                      className="w-full py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all flex items-center justify-center gap-1"
                    >
                      Finish Guide
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      onClick={() => setCurrentSection(prev => Math.min(sections.length - 1, prev + 1))}
                      className="w-full py-1.5 text-xs bg-purple-500/20 text-purple-200 rounded-lg hover:bg-purple-500/30 transition-all flex items-center justify-center gap-1"
                    >
                      Next
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
            
            {/* Main content area - Adjusted higher position */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="fixed top-[45px] left-[225px] right-[220px] bottom-[57px] max-w-[800px] mx-auto z-50"
            >
              <div className="h-full flex flex-col bg-gradient-to-br from-black/90 to-purple-900/10 backdrop-blur-sm rounded-xl border border-purple-500/20 shadow-lg overflow-hidden">
                {/* Fixed header */}
                <div className="flex items-center gap-2 p-4 border-b border-purple-500/20">
                  <div className="p-1.5 bg-purple-500/20 rounded-full">
                    <span className="text-lg">{sections[currentSection].icon}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{sections[currentSection].title}</h3>
                </div>

                {/* Fixed description */}
                <div className="p-4 border-b border-purple-500/20">
                  <p className="text-gray-300 text-sm">
                    {sections[currentSection].description}
                  </p>
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <div className="p-4">
                    {sections[currentSection].content}
                  </div>
                </div>

                {/* Fixed navigation - REMOVED PREVIOUS BUTTON */}
                <div className="p-4 border-t border-purple-500/20 bg-black/20">
                  <div className="flex items-center justify-end">
                    {currentSection < sections.length - 1 ? (
                      <button
                        onClick={() => setCurrentSection(prev => Math.min(sections.length - 1, prev + 1))}
                        className="px-6 py-2.5 text-sm rounded-lg flex items-center gap-2 text-white bg-purple-500/30 hover:bg-purple-500/40 transition-colors"
                      >
                        Next
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ) : (
                      <button
                        onClick={handleCloseGuide}
                        className="px-6 py-2.5 text-sm rounded-lg flex items-center gap-2 text-white bg-purple-500/30 hover:bg-purple-500/40 transition-colors"
                      >
                        Finish Guide
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Close button in the top-right corner */}
            <button
              onClick={handleCloseGuide}
              className="fixed top-4 right-4 z-50 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Add AppDevelopmentModal component
interface AppDevelopmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AppDevelopmentModal = ({ isOpen, onClose }: AppDevelopmentModalProps) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 flex items-start justify-center z-[9999] p-4 overflow-y-auto pt-16 md:pt-32"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="bg-gradient-to-br from-black/95 to-purple-900/10 backdrop-blur-xl rounded-2xl p-6 md:p-8 w-full max-w-4xl mx-auto relative border border-purple-500/30"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Enhanced Header with CSS Animation */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative">
            <div className="text-5xl phone-icon">
              📱
            </div>
            <div className="absolute -top-2 -right-2 text-2xl sparkle-icon">
              ✨
            </div>
          </div>
          <div>
            <h2 className={`${audiowide.className} text-3xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400`}>
              Mobile App Development
            </h2>
            <p className="text-purple-300">Transform your ideas into powerful mobile experiences</p>
          </div>
        </div>

        {/* Content with Enhanced Sections */}
        <div className="space-y-6">
          {/* Store Requirements Section */}
          <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-xl p-6 border border-purple-500/30 hover:border-purple-500/50 transition-colors fade-in-section">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              App Store Requirements
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="bg-black/40 rounded-lg p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all card-hover">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-purple-300">Google Play Store</span>
                    <span className="text-green-400 font-semibold">$25</span>
                  </div>
                  <p className="text-gray-400 text-sm">One-time registration fee</p>
                </div>
                <div className="bg-black/40 rounded-lg p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all card-hover">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-purple-300">Apple App Store</span>
                    <span className="text-green-400 font-semibold">$99/year</span>
                  </div>
                  <p className="text-gray-400 text-sm">Annual developer membership</p>
                </div>
              </div>
              <div className="bg-purple-900/20 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3">Additional Requirements:</h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Developer account verification
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    App privacy policy
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Content guidelines compliance
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Development Process Section */}
          <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-xl p-6 border border-purple-500/30 hover:border-purple-500/50 transition-colors fade-in-section">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Development Journey
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-purple-500/30"></div>
                  <div className="space-y-6 relative">
                    {[
                      { phase: "Discovery & Planning", duration: "Week 1" },
                      { phase: "Design & Prototyping", duration: "Week 2" },
                      { phase: "Development", duration: "Weeks 3-5" },
                      { phase: "Testing & Refinement", duration: "Week 6" },
                      { phase: "Store Submission", duration: "Final Week" }
                    ].map((step, index) => (
                      <div key={index} className="flex items-start gap-4 timeline-item">
                        <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-white text-sm">{index + 1}</span>
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{step.phase}</h4>
                          <p className="text-purple-300 text-sm">{step.duration}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-purple-900/20 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-3">Development Includes:</h4>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Native performance optimization
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Cross-platform compatibility
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Secure data handling
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Regular progress updates
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Consultation Options Section */}
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-6 border border-purple-500/30 fade-in-section">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Free Consultation Options
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-black/40 rounded-lg p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all card-hover">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Zoom Consultation</h4>
                    <p className="text-purple-300 text-sm">Schedule a detailed project discussion</p>
                  </div>
                </div>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Screen sharing for better understanding
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Interactive feature discussion
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Live cost estimation
                  </li>
                </ul>
              </div>
              <div className="bg-black/40 rounded-lg p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all card-hover">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Private Call</h4>
                    <p className="text-purple-300 text-sm">One-on-one consultation</p>
                  </div>
                </div>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Flexible scheduling
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Personalized attention
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Detailed Q&A session
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-6 border border-purple-500/30 fade-in-section">
            <h3 className="text-xl font-semibold text-white mb-4">Get Started Today</h3>
            <p className="text-gray-300 mb-4">
              Ready to bring your app idea to life? Contact us for a free consultation and let's discuss your project in detail.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <a 
                href="mailto:nexwebs.org@gmail.com" 
                className="flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors bg-black/20 p-3 rounded-lg hover:bg-black/30 email-btn"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                nexwebs.org@gmail.com
              </a>
              <a 
                href="mailto:nexdevs.org@gmail.com" 
                className="flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors bg-black/20 p-3 rounded-lg hover:bg-black/30 email-btn"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                nexdevs.org@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end mt-8 gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-300 hover:text-white transition-colors"
          >
            Close
          </button>
          <a
            href="mailto:nexwebs.org@gmail.com?subject=Mobile App Development Inquiry&body=I'm interested in developing a mobile app. Please schedule a consultation call."
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg transition-all hover:from-purple-500 hover:to-pink-500 flex items-center gap-2 justify-center group cta-btn"
          >
            Schedule Consultation
            <svg 
              className="w-4 h-4 arrow-icon" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Add CSS animations
const cssAnimationsStyle = `
  @keyframes floating {
    0% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0); }
  }

  @keyframes rotating {
    0% { transform: rotate(-12deg); }
    50% { transform: rotate(-8deg); }
    100% { transform: rotate(-12deg); }
  }

  @keyframes floating-right {
    0% { transform: translateY(0) rotate(12deg); }
    50% { transform: translateY(10px) rotate(8deg); }
    100% { transform: translateY(0) rotate(12deg); }
  }

  @keyframes pulse-subtle {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  @keyframes fade-in {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes arrow-move {
    0% { transform: translateX(0); }
    50% { transform: translateX(5px); }
    100% { transform: translateX(0); }
  }
  
  @keyframes attention-pulse {
    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(147, 51, 234, 0.7); }
    70% { transform: scale(1.05); box-shadow: 0 0 0 15px rgba(147, 51, 234, 0); }
    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(147, 51, 234, 0); }
  }
  
  .guide-button-pulse {
    animation: attention-pulse 2s infinite cubic-bezier(0.66, 0, 0, 1);
  }
  
  .floating-mockup-left {
    animation: floating 4s ease-in-out infinite, rotating 6s ease-in-out infinite;
  }
  
  .floating-mockup-right {
    animation: floating-right 4.5s ease-in-out infinite;
  }
  
  .title-sparkle {
    animation: pulse-subtle 3s ease-in-out infinite;
  }

  .fade-in-section {
    animation: fade-in 0.5s ease-out forwards;
  }

  .card-hover:hover {
    transform: scale(1.03);
    transition: transform 0.3s ease;
  }

  .timeline-item {
    opacity: 0;
    animation: fade-in 0.5s ease-out forwards;
    animation-delay: calc(var(--index, 0) * 0.1s);
  }

  .phone-icon {
    animation: pulse-subtle 2s infinite ease-in-out;
  }

  .sparkle-icon {
    animation: pulse-subtle 2s infinite ease-in-out;
  }

  .email-btn:hover {
    transform: translateY(-3px);
    transition: transform 0.3s ease;
  }

  .arrow-icon {
    animation: arrow-move 1.5s infinite;
  }

  .cta-btn:hover .arrow-icon {
    animation: arrow-move 1s infinite;
  }
`;

// Add ForcedLoadingScreen component
const ForcedLoadingScreen = () => {
  const [showLoading, setShowLoading] = useState(true);
  
  useEffect(() => {
    console.log("ForcedLoadingScreen mounted");
    const timer = setTimeout(() => {
      console.log("ForcedLoadingScreen timer completed");
      setShowLoading(false);
    }, 5000); // Force display for 5 seconds
    
    return () => {
      console.log("ForcedLoadingScreen unmounted");
      clearTimeout(timer);
    };
  }, []);
  
  if (showLoading) {
    console.log("Rendering forced LoadingScreen");
    return <LoadingScreen />;
  }
  
  return null;
};

// Use the existing PricingPlan interface

export default function PricingPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Ensure this is true by default
  const { 
    currency, 
    exchangeRate, 
    isBaseCurrency, 
    isExemptCountry, 
    setCurrency 
  } = useCurrency();

  // Add isMobile state to the main component
  const [isMobile, setIsMobile] = useState(false);

  // Add state for our new website guide - initialize as false, we'll set it to true in useEffect
  const [showWebsiteGuide, setShowWebsiteGuide] = useState(false);
  
  // Track if the user has already seen the guide during this session
  const [hasViewedGuide, setHasViewedGuide] = useState(false);

  // Add state for app modal
  const [showAppModal, setShowAppModal] = useState(false);
  
  // Handler for closing the WebsiteGuide
  const handleGuideClose = () => {
    setShowWebsiteGuide(false);
    setHasViewedGuide(true);
  };

  // Force loading screen to appear
  useEffect(() => {
    console.log("Loading state initialized:", isLoading);
    setMounted(true);
    
    // Set scroll position to the top
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
    
    // Forcefully show loading screen for 5 seconds
    console.log("Starting loading timer...");
    const loadingTimer = setTimeout(() => {
      console.log("Loading timer completed, setting isLoading to false");
      setIsLoading(false);
      
      // Then show website guide, but only if it hasn't been shown twice already
      const guideTimer = setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.scrollTo(0, 0);
          
          // Check localStorage for guide view count
          const guideViewCount = localStorage.getItem('pricing-guide-view-count');
          const viewCount = guideViewCount ? parseInt(guideViewCount) : 0;
          
          // Only show guide if it has been shown less than twice
          if (viewCount < 2) {
            setShowWebsiteGuide(true);
            // Increment and save the view count
            localStorage.setItem('pricing-guide-view-count', (viewCount + 1).toString());
            console.log(`Guide shown ${viewCount + 1} times`);
          } else {
            console.log('Guide already shown twice, not showing again');
          }
        }
      }, 500); // Short delay after loading screen disappears
      
      return () => clearTimeout(guideTimer);
    }, 5000); // 5 seconds loading time for visibility
    
    return () => {
      console.log("Cleaning up loading timer");
      clearTimeout(loadingTimer);
    };
  }, []);

  // Comment out the conditional loading screen check since we're using StandaloneLoadingScreen
  // if (isLoading || !mounted) {
  //   console.log("Rendering LoadingScreen component");
  //   return <LoadingScreen />;
  // }

  // Add useEffect to detect mobile devices
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  // Remove the conflicting useEffect that also handles loading state
  // This useEffect was causing the loading screen to not appear properly

  // Add new useEffect to handle the hasViewedGuide state
  useEffect(() => {
    if (showWebsiteGuide === false && hasViewedGuide === false) {
      setHasViewedGuide(true);
    }
  }, [showWebsiteGuide, hasViewedGuide]);

  // Memoize expensive calculations
  const getFormattedPrice = useCallback((basePrice: number): string => {
    const shouldApplyMarkup = !isBaseCurrency;
    return formatPrice(basePrice, currency, exchangeRate, !shouldApplyMarkup);
  }, [currency, exchangeRate, isBaseCurrency]);

  const handleGetStarted = useCallback(async (plan: PricingPlan) => {
    if (plan.title === "Mobile App Development") {
      // Show the app development modal instead of redirecting
      setShowAppModal(true);
      return;
    }

    const isMobile = window.innerWidth < 768;
    
    if (!isMobile) {
      setSelectedPlan(null);
      // Show transition effect
      const transitionDuration = 2500;
      const transitionElement = document.createElement('div');
      transitionElement.id = 'transition-container';
      document.body.appendChild(transitionElement);
      
      const root = createRoot(transitionElement);
      root.render(
        <TransitionEffect 
          isExit={false} 
          message="Preparing your exclusive offer"
        />
      );
      
      await new Promise(resolve => setTimeout(resolve, transitionDuration));
      
      root.unmount();
      transitionElement.remove();
    }
    
    const encodedPlan = encodeURIComponent(plan.title);
    router.push(`/contact?plan=${encodedPlan}`);
  }, [router]);

  useEffect(() => {
    let mounted = true;

    const detectLocation = async () => {
      try {
        const locationData = await getLocationData('');
        if (mounted) {
          setCurrency(locationData.currency as SupportedCurrency);
        }
      } catch (error) {
        console.error('Error detecting location:', error);
        if (mounted) {
          setCurrency('PKR');
        }
      }
    };

    if (typeof window !== 'undefined') {
      detectLocation();
    }

    return () => {
      mounted = false;
    };
  }, [setCurrency]);

  // Memoize the pricing cards list for better performance
  const pricingCardsList = useMemo(() => (
    pricingPlans.map((plan) => (
      <div key={plan.title} className="flex flex-col">
        <PricingCard
          key={plan.title}
          plan={plan}
          onSelect={setSelectedPlan}
          onGetStarted={handleGetStarted}
          currency={currency}
          exchangeRate={exchangeRate}
          isExemptCountry={isExemptCountry}
          isBaseCurrency={isBaseCurrency}
          getFormattedPrice={getFormattedPrice}
        />
        <div className="mt-2">
          <PlanReviews 
            planTitle={plan.title}
            reviews={reviewsData}
          />
        </div>
      </div>
    ))
  ), [currency, exchangeRate, isExemptCountry, isBaseCurrency, handleGetStarted, getFormattedPrice, reviewsData]);



  // Style for currency selector
  const currencySelectorStyle: React.CSSProperties = {
    position: 'relative' as const,
    zIndex: 1000,
    display: 'block',
    marginBottom: '2rem',
  };

  return (
    <>
      <StandaloneLoadingScreen />
    <div className="min-h-screen bg-black relative overflow-x-hidden pt-20 md:pt-32">
      {/* Remove the glow effects div */}

      {/* Optimized Back Button - Adjusted position */}
      <div className="fixed top-2 md:top-16 left-4 md:left-8 z-50">
        <button 
          onClick={() => setSelectedPlan(null)}
          className="flex items-center space-x-2 text-white/80 bg-black/20 backdrop-blur-sm px-3 py-2 rounded-lg"
        >
          <svg 
            className="w-4 h-4 md:w-5 md:h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-xs md:text-sm font-medium">Back</span>
        </button>
      </div>

      {/* Add ReviewsDrawer component here, outside the main container */}
      <ReviewsDrawer 
        reviews={reviewsData} 
        satisfactionRate={98}
        projectsDelivered={245}
        clientsServed={180}
        satisfactionStats={[
          { label: '5-star', percentage: 98, count: 235 },
          { label: '4-star', percentage: 78, count: 8 },
          { label: '3-star', percentage: 21, count: 2 },
          { label: '2-star', percentage: 2, count: 0 },
          { label: '1-star', percentage: 0, count: 0 }
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-4 md:pt-8 pb-20 relative z-20">
        <div className="text-center mb-8 md:mb-16 relative z-10">
          {/* Keep Project Title */}
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="text-lg md:text-xl text-purple-400 font-semibold mb-4"
          >
            NEX-WEBS DEVELOPMENT
          </motion.h2>

          {/* Simplified Currency Info Banner */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="max-w-3xl mx-auto mb-6"
          >
            <div className="bg-[#1a1042] rounded-xl p-4 border border-purple-500/20">
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">💱</span>
                  <h3 className="text-purple-300 font-semibold">Multi-Currency Support</h3>
                  <span className="text-xl">💱</span>
                </div>
                <p className="text-gray-300 text-sm text-center">
                  We accept payments in multiple currencies including USD, GBP, AED, and PKR. Our base prices are in PKR with automatic currency conversion at current market rates.
                </p>
                <div className="flex justify-center gap-3">
                  <span className="bg-purple-900/30 text-purple-200 px-4 py-1 rounded-lg">USD $</span>
                  <span className="bg-purple-900/30 text-purple-200 px-4 py-1 rounded-lg">GBP £</span>
                  <span className="bg-purple-900/30 text-purple-200 px-4 py-1 rounded-lg">AED د.إ</span>
                  <span className="bg-purple-900/30 text-purple-200 px-4 py-1 rounded-lg">PKR ₨</span>
                </div>
                <div className="text-yellow-500/90 text-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  International clients are subject to a 30% service fee
                </div>
              </div>
            </div>
          </motion.div>

          {/* Keep Floating Mockups with animations */}
          <div className="relative w-full max-w-lg mx-auto mb-8 md:mb-12 mt-8 md:mt-12">
            <motion.div
              initial={{ opacity: 0, y: 20, rotate: -12 }}
              animate={{ 
                opacity: 1, 
                y: [0, -10, 0],
                rotate: [-12, -8, -12]
              }}
              transition={{ 
                opacity: { duration: 0.2 },
                y: { 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                },
                rotate: {
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              className="absolute -top-12 md:-top-16 -left-4 md:-left-8 w-16 md:w-24 h-16 md:h-24 bg-purple-500/20 rounded-lg backdrop-blur-sm"
            >
              <span className="text-2xl md:text-4xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">💻</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: -20, rotate: 12 }}
              animate={{ 
                opacity: 1, 
                y: [0, 10, 0],
                rotate: [12, 8, 12]
              }}
              transition={{ 
                opacity: { duration: 0.2 },
                y: { 
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                },
                rotate: {
                  duration: 6.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              className="absolute -top-6 md:-top-8 -right-4 md:-right-8 w-14 md:w-20 h-14 md:h-20 bg-pink-500/20 rounded-lg backdrop-blur-sm"
            >
              <span className="text-2xl md:text-3xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">🚀</span>
            </motion.div>
          </div>

          {/* Keep Main Title with animations */}
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className={`${audiowide.className} text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-4 md:mb-6 px-4 md:px-6 py-4 md:py-6 relative z-30 bg-black/40 backdrop-blur-sm rounded-xl inline-block`}
          >
            Choose Your <span className="inline-block bg-white text-black px-2 md:px-3 py-1 rounded-md">Perfect Plan</span>
            <motion.span
              initial={{ opacity: 0, rotate: 12, y: 0 }}
              animate={{ 
                opacity: 1,
                y: [-2, 2, -2],
                rotate: [12, 15, 12]
              }}
              transition={{
                opacity: { duration: 0.2 },
                y: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                },
                rotate: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              className="absolute -top-4 -right-4 text-xl md:text-2xl"
            >
              ✨
            </motion.span>
          </motion.h1>

          {/* Optimized Currency Selector */}
          <motion.div
            className="flex flex-col items-center justify-center space-y-4 mb-8 px-4 w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div style={currencySelectorStyle} className="currency-selector w-full max-w-sm">
              <CurrencySelector />
            </div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.2 }}
              className="text-gray-400 text-xs mt-2"
            >
              YOUR LOCATION IS AUTOMATICALLY SET
            </motion.p>
          </motion.div>

          {/* Optimized Description */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="text-white/80 text-sm md:text-base glow-text-sm max-w-2xl mx-auto px-3 md:px-4 py-2 bg-black/20 backdrop-blur-sm rounded-lg transform-gpu"
          >
            Transparent pricing with no hidden fees. Select a plan to view detailed features.
          </motion.p>

          {/* AI Integration Section - Moved here */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 mb-12 w-full"
          >
            <div className="max-w-6xl mx-auto px-4 bg-black/30 backdrop-blur-sm rounded-xl border border-purple-500/20">
              <AiIntegrationSection />
            </div>
          </motion.div>

          {/* Add ReviewsCarousel section before pricing plans */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 mb-12 max-w-6xl mx-auto"
          >
            <div className="flex flex-col items-center text-center mb-8">
              <span className="text-2xl mb-2">💬</span>
              <h2 className={`${audiowide.className} text-2xl md:text-3xl font-bold text-white mb-3`}>Client Reviews</h2>
              <p className="text-purple-200 max-w-2xl text-sm md:text-base">
                Don't just take our word for it - see what our clients have to say about our services.
              </p>
            </div>
            
            <div className="mt-8">
              <ReviewsCarousel 
                reviews={carouselReviews} 
                autoplayInterval={5000}
                title="What Our Clients Say"
              />
            </div>
          </motion.div>

          {/* Exclusive Discount Notification */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="mt-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-4 max-w-2xl mx-auto backdrop-blur-sm"
          >
            <div className="flex items-center justify-center gap-3">
              <span className="animate-pulse text-yellow-500 text-xl">🎉</span>
              <p className="text-purple-200 font-medium">
                Special Offer: You'll be redirected to our contact page for an exclusive consultation and personalized discount!
              </p>
              <span className="animate-pulse text-yellow-500 text-xl">✨</span>
            </div>
          </motion.div>

          {/* Optimized Pricing Notice */}
          {['USD', 'GBP', 'AED'].includes(currency) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="max-w-3xl mx-auto mt-6 md:mt-8"
            >
              <div className="bg-gradient-to-r from-purple-900/30 to-purple-800/30 border border-purple-500/30 rounded-xl p-4 shadow-lg backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="bg-purple-500 text-white text-xs px-2 py-1 rounded font-bold animate-pulse">
                    UPDATED
                  </div>
                  <h3 className="text-lg font-semibold text-white">Pricing Update Notice</h3>
                </div>
                <p className="text-purple-100 mt-2 text-sm">
                  We've updated our pricing for {currency} to reflect current market conditions. The new rates provide better value while maintaining our premium service quality.
                </p>
              </div>
            </motion.div>
          )}

          {/* Optimized Price Increase Notice */}
          {!isExemptCountry && !isBaseCurrency && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-purple-400 text-sm mt-2 transform-gpu"
            >
              * Prices include a 30% increase for international clients
            </motion.p>
          )}
        </div>

        {/* Simplified Pricing Cards Grid with PlanReviews integration */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 max-w-6xl mx-auto px-2 md:px-4 relative z-[1]">
          {pricingCardsList}
        </div>

        {/* E-Commerce Store Management Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 mb-16 max-w-6xl mx-auto"
        >
          <div className="flex flex-col items-center text-center mb-8">
            <span className="text-2xl mb-2">🛍️</span>
            <h2 className={`${audiowide.className} text-2xl md:text-3xl font-bold text-white mb-3`}>E-Commerce Store Management</h2>
            <p className="text-purple-200 max-w-2xl text-sm md:text-base">
              Elevate your e-commerce business with our professional store management services. 
              Our AI-driven approach increases sales by 40-60% through optimized customer experience and automated operations.
            </p>
          </div>
          
          {/* E-Commerce Service Cards Slider */}
          <div className="mt-8 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shopify Card */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="bg-black/90 border-2 border-blue-600/30 hover:border-blue-600/50 rounded-xl overflow-hidden cursor-pointer group transition-all duration-300"
              >
                <Link href="/e-commerce-services/shopify">
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-xl p-3 bg-gradient-to-r from-pink-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <span role="img" aria-label="shopping">🏪</span>
                      </div>
                      <h3 className="text-xl font-bold text-white">Shopify Store</h3>
                    </div>
                    <p className="text-gray-300 mb-6 text-sm">
                      Professional Shopify store development with AI-powered features to increase sales by 35-55%.
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="bg-gradient-to-r from-pink-500 to-blue-600 px-3 py-1.5 rounded-lg">
                        <span className="text-white font-semibold">$900</span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-400 group-hover:text-blue-300 transition-colors">
                        <span>View Details</span>
                        <motion.svg 
                          initial={{ x: 0 }}
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="w-5 h-5" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </motion.svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
              
              {/* WordPress Card */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="bg-black/90 border-2 border-purple-600/30 hover:border-purple-600/50 rounded-xl overflow-hidden cursor-pointer group transition-all duration-300"
              >
                <Link href="/e-commerce-services/wordpress">
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-xl p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span role="img" aria-label="cart">🛒</span>
                      </div>
                      <h3 className="text-xl font-bold text-white">WordPress E-commerce</h3>
                    </div>
                    <p className="text-gray-300 mb-6 text-sm">
                      Custom WordPress e-commerce solution with WooCommerce optimization to boost sales by 40-60%.
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-1.5 rounded-lg">
                        <span className="text-white font-semibold">$800</span>
                      </div>
                      <div className="flex items-center gap-2 text-purple-400 group-hover:text-purple-300 transition-colors">
                        <span>View Details</span>
                        <motion.svg 
                          initial={{ x: 0 }}
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="w-5 h-5" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </motion.svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </div>
            
            <div className="flex justify-center mt-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-black px-4 py-2 rounded-lg text-purple-300 text-sm border border-purple-500/20"
              >
                Slide between options or click to view detailed service pages
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Optimized Modal */}
        <AnimatePresence>
          {selectedPlan && (
            <PlanModal
              plan={selectedPlan}
              onClose={() => setSelectedPlan(null)}
              onGetStarted={handleGetStarted}
              getFormattedPrice={getFormattedPrice}
            />
          )}
        </AnimatePresence>

        {/* Guide button removed - guide now appears automatically */}
        
        {/* Add Website Guide component */}
        <WebsiteGuide
          isOpen={showWebsiteGuide}
          onClose={handleGuideClose}
        />
      </div>
      
      {/* Add the AppDevelopmentModal */}
      <AnimatePresence>
        {showAppModal && (
          <AppDevelopmentModal
            isOpen={showAppModal}
            onClose={() => setShowAppModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
    </>
  );
}