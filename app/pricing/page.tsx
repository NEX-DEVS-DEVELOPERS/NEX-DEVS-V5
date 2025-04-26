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

// Add these type definitions at the top of the file
type PricingFeature = string;
type BestForItem = string;

interface PricingPlanBase {
  title: string;
  basePrice: number;
  features: PricingFeature[];
  description: string;
  icon: string;
  timeline: string;
  bestFor: BestForItem[];
  includes: string[];
  highlightFeatures: string[];
  additionalInfo: {
    support: string;
    deployment: string;
    maintenance: string;
    revisions: string;
  };
}

// Extend the existing PricingPlan interface
interface PricingPlan extends PricingPlanBase {}

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
const PlanModal = memo(({ 
  plan, 
  onClose, 
  onGetStarted,
  getFormattedPrice 
}: PlanModalProps) => {
  if (!plan) return null;

  // Group features into batches to improve performance
  const featureBatches = useMemo(() => {
    const batchSize = 6;
    const batches = [];
    for (let i = 0; i < plan.features.length; i += batchSize) {
      batches.push(plan.features.slice(i, i + batchSize));
    }
    return batches;
  }, [plan.features]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 flex items-start justify-center z-[9999] p-4 modal-overlay overflow-y-auto pt-16 md:pt-32"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-black/95 to-purple-900/10 backdrop-blur-xl rounded-2xl p-6 md:p-8 w-full max-w-4xl mx-auto relative border border-purple-500/30 z-[10000]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-6">
          <div className="bg-purple-500/5 rounded-xl p-4 md:p-6">
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">{plan.description}</p>
            <p className="text-purple-300 text-lg md:text-xl mt-4">
              {getFormattedPrice(plan.basePrice)}
            </p>
          </div>

          {/* Features Grid - Optimized with batched rendering */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {featureBatches.map((batch, batchIndex) => (
              <React.Fragment key={batchIndex}>
                {batch.map((feature, index) => (
                  <motion.div
                    key={batchIndex * 6 + index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.03 * batchIndex }} // Reduced delay 
                    className="flex items-start bg-purple-500/5 rounded-lg p-3 md:p-4 group hover:bg-purple-500/10 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-purple-400 mr-3 flex-shrink-0 mt-0.5 group-hover:text-purple-300 transition-colors duration-200" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-300 text-sm md:text-base group-hover:text-white transition-colors duration-200">{feature}</span>
                  </motion.div>
                ))}
              </React.Fragment>
            ))}
          </div>

          {/* Best For Section */}
          <div className="bg-purple-500/5 rounded-xl p-4 md:p-6">
            <h3 className="text-white font-semibold mb-4 text-base md:text-lg">Best For:</h3>
            <div className="flex flex-wrap gap-2">
              {plan.bestFor.map((item, i) => (
                <span key={i} className="text-sm bg-purple-500/10 text-purple-300 px-3 py-1.5 rounded-full">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button 
              onClick={onClose}
              className="flex-1 py-3 px-6 text-white bg-transparent border border-white/20 
                rounded-xl hover:bg-white/5 transition-all duration-200 font-semibold"
            >
              Back
            </button>
            <button 
              onClick={() => onGetStarted(plan)}
              className="flex-1 py-3 px-6 bg-white text-black rounded-xl 
                hover:bg-purple-50 transition-all duration-200 font-semibold
                flex items-center justify-center gap-2"
            >
              Get Started
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

PlanModal.displayName = 'PlanModal';

// Enhanced GuideStep interface with better configuration options
interface GuideStep {
  title: string;
  content: string;
  target: string;
  placement: 'top' | 'bottom' | 'left' | 'right';
  arrowPosition?: {
    top?: string;
    left?: string;
    transform?: string;
    rotate?: string;
  };
  highlightTarget?: boolean;
  highlightStyle?: 'pulse' | 'glow' | 'spotlight' | 'outline';
  emoji: string;
  actionType?: 'click' | 'hover' | 'none';
  targetSelector: string;
  showArrow?: boolean;
}

// Enhanced arrow position calculation for better targeting
const getArrowPosition = (stepContent: GuideStep, targetElement: HTMLElement | null) => {
  if (!targetElement) return {};

  const rect = targetElement.getBoundingClientRect();
  const padding = 15; // Space between the element and the arrow
  const placement = stepContent.placement;

  switch (placement) {
    case 'top':
      return {
        top: `${rect.top - padding - 10}px`,
        left: `${rect.left + rect.width / 2}px`,
        transform: 'rotate(90deg) translateX(-50%)',
      };
    case 'bottom':
      return {
        top: `${rect.bottom + padding}px`,
        left: `${rect.left + rect.width / 2}px`,
        transform: 'rotate(-90deg) translateX(-50%)',
      };
    case 'left':
      return {
        top: `${rect.top + rect.height / 2}px`,
        left: `${rect.left - padding - 10}px`,
        transform: 'rotate(0deg) translateY(-50%)',
      };
    case 'right':
      return {
        top: `${rect.top + rect.height / 2}px`,
        left: `${rect.right + padding}px`,
        transform: 'rotate(180deg) translateY(-50%)',
      };
    default:
      return {};
  }
};

// Add this function before the GuidedTour component
const getGuidePosition = (isMobile: boolean, step: number): React.CSSProperties => {
  if (isMobile) {
    return {
      position: 'fixed' as const,
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      width: '90vw',
      maxWidth: '400px',
      margin: '0',
      zIndex: 9999,
    };
  }

  // Special position for step 1 (index 0) - positioned to the left
  if (step === 0) {
    return {
      position: 'fixed' as const,
      left: '20%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      width: 'auto',
      maxWidth: '400px',
      height: 'auto',
      zIndex: 9999,
    };
  }

  // Positions for other steps
  const positions = [
    { top: '20%', left: '50%', transform: 'translate(-50%, -20%)' }, // Not used for step 1 anymore
    { top: '20%', right: '20%', transform: 'translate(0, -20%)' },
    { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
    { bottom: '20%', right: '30%', transform: 'translate(0, 0)' }
  ];

  // Use position 0 for step 2, position 1 for step 3, etc.
  const positionIndex = step > 0 ? (step - 1) % (positions.length - 1) + 1 : 0;

  return {
    position: 'fixed' as const,
    ...positions[positionIndex],
    width: 'auto',
    maxWidth: '450px',
    height: 'auto',
  };
};

// Add these interfaces before the DirectionalArrow component
interface ArrowProps {
  fromElement: HTMLElement;
  toElement: HTMLElement;
  color?: string;
  thickness?: number;
  animate?: boolean;
}

// Enhance the DirectionalArrow component with better styling and animations
const DirectionalArrow = ({ 
  fromElement, 
  toElement, 
  color = 'rgba(168, 85, 247, 0.9)',
  thickness = 3,
  animate = true 
}: ArrowProps) => {
  if (!fromElement || !toElement) return null;

  const fromRect = fromElement.getBoundingClientRect();
  const toRect = toElement.getBoundingClientRect();

  const fromX = fromRect.left + fromRect.width / 2;
  const fromY = fromRect.top + fromRect.height / 2;
  const toX = toRect.left + toRect.width / 2;
  const toY = toRect.top + toRect.height / 2;

  const angle = Math.atan2(toY - fromY, toX - fromX);
  const length = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        x: animate ? [0, 5, 0] : 0
      }}
      transition={{ 
        duration: 0.5,
        x: {
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
      style={{
        position: 'fixed',
        top: fromY,
        left: fromX,
        width: length,
        height: thickness + 2, // Increased thickness
        background: `linear-gradient(90deg, rgba(168, 85, 247, 0.9), rgba(138, 43, 226, 0.9))`, // Brighter gradient
        transformOrigin: 'left',
        transform: `rotate(${angle}rad)`,
        zIndex: 1001,
        pointerEvents: 'none',
        boxShadow: '0 0 12px 4px rgba(168, 85, 247, 0.7)', // Enhanced glow
      }}
    >
      <div
        style={{
          position: 'absolute',
          right: -12, // Larger arrow
          top: -10,
          width: 0,
          height: 0,
          borderTop: '10px solid transparent',
          borderBottom: '10px solid transparent',
          borderLeft: `20px solid rgba(168, 85, 247, 1)`, // Brighter color
          filter: 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.8))', // Enhanced glow
        }}
      />
      {/* Add pulsing dot at the start of the arrow for more attention */}
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          left: -6,
          top: -6 + (thickness / 2),
          width: 12,
          height: 12,
          borderRadius: '50%',
          backgroundColor: 'rgba(168, 85, 247, 1)',
          boxShadow: '0 0 10px 2px rgba(168, 85, 247, 0.8)',
        }}
      />
    </motion.div>
  );
};

// Enhanced GuidedTour component with better UI and animations
const GuidedTour = memo(({
  isOpen,
  onClose,
  currentStep,
  totalSteps,
  stepContent,
  onNext,
  onPrev,
  onSkip,
  isMobile,
}: {
  isOpen: boolean;
  onClose: () => void;
  currentStep: number;
  totalSteps: number;
  stepContent: GuideStep;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  isMobile: boolean;
}) => {
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [arrowStartElement, setArrowStartElement] = useState<HTMLElement | null>(null);
  const tourRef = useRef<HTMLDivElement>(null);
  
  // Arrow animation function
  const getArrowAnimation = () => {
    return {
      x: [0, 5, 0],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    };
  };

  // Function to trigger confetti animation
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#a855f7', '#c084fc', '#d8b4fe', '#f0abfc']
    });
  };

  // Handle close with confetti for the last slide
  const handleLastSlideAction = () => {
    triggerConfetti();
    // Add a small delay to allow confetti to be visible before closing
    setTimeout(() => {
      onSkip();
    }, 800);
  };

  useEffect(() => {
    if (isOpen && stepContent.targetSelector) {
      const element = document.querySelector(stepContent.targetSelector) as HTMLElement;
      
      if (element) {
        setTargetElement(element);
        
        // Apply highlight effect based on the specified style
        if (stepContent.highlightTarget) {
          // Apply highlight effect
          const style = stepContent.highlightStyle || 'pulse';
          element.style.position = 'relative';
          element.style.zIndex = '999';
          
          // Add CSS classes for highlighting
          if (style === 'pulse') {
            element.classList.add('highlight-pulse-no-shadow');
          } else {
            element.classList.add(`highlight-${style}`);
          }
          
          // Preserve text color for Get Started button
          if (element.classList.contains('get-started-btn')) {
            element.style.color = 'black';
          }
          
          // Smooth scroll to the element
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }

        // Set up action based on actionType
        if (stepContent.actionType === 'click') {
          const handleClick = () => {
            setTimeout(() => onNext(), 500);
          };
          element.addEventListener('click', handleClick);
          return () => {
            element.removeEventListener('click', handleClick);
            if (stepContent.highlightStyle === 'pulse') {
              element.classList.remove('highlight-pulse-no-shadow');
              element.classList.remove('highlight-pulse-with-shadow');
            } else {
              element.classList.remove(`highlight-${stepContent.highlightStyle || 'pulse'}`);
            }
            // Reset any inline styles we added
            if (element.classList.contains('get-started-btn')) {
              element.style.color = '';
            }
          };
        } else if (stepContent.actionType === 'hover') {
          const handleHover = () => {
            setTimeout(() => onNext(), 800);
          };
          element.addEventListener('mouseenter', handleHover);
          return () => {
            element.removeEventListener('mouseenter', handleHover);
            if (stepContent.highlightStyle === 'pulse') {
              element.classList.remove('highlight-pulse-no-shadow');
              element.classList.remove('highlight-pulse-with-shadow');
            } else {
              element.classList.remove(`highlight-${stepContent.highlightStyle || 'pulse'}`);
            }
          };
        }
        
        return () => {
          if (stepContent.highlightStyle === 'pulse') {
            element.classList.remove('highlight-pulse-no-shadow');
            element.classList.remove('highlight-pulse-with-shadow');
          } else {
            element.classList.remove(`highlight-${stepContent.highlightStyle || 'pulse'}`);
          }
          // Reset any inline styles we added
          if (element.classList.contains('get-started-btn')) {
            element.style.color = '';
          }
        };
      }
    }
  }, [isOpen, stepContent, onNext]);

  // Set arrow start element (the guide panel)
  useEffect(() => {
    if (tourRef.current) {
      setArrowStartElement(tourRef.current);
    }
  }, [tourRef.current]);

  const guidePosition = useMemo(() => 
    getGuidePosition(isMobile, currentStep),
    [isMobile, currentStep]
  );

  // Define the CSS classes without interpolation
  const pulseClass = currentStep === 0 ? 'highlight-pulse-no-shadow' : 'highlight-pulse-with-shadow';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Semi-transparent overlay with NO blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.6)' // Fixed opacity, no animation
            }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[998]"
            onClick={onSkip}
          />

          {/* CSS for highlighting effects with enhanced visibility */}
          <style jsx global>{`
            @keyframes highlight-pulse-base {
              0% { 
                transform: scale(1);
                background-color: rgba(168, 85, 247, 0.05);
              }
              50% { 
                transform: scale(1.02);
                background-color: rgba(168, 85, 247, 0.1);
              }
              100% { 
                transform: scale(1);
                background-color: rgba(168, 85, 247, 0.05);
              }
            }
            
            .highlight-pulse-no-shadow {
              animation: highlight-pulse-base 2s infinite ease-in-out;
              position: relative;
              z-index: 1000 !important;
              border-radius: 4px;
              box-shadow: 0 0 20px 5px rgba(168, 85, 247, 0.6);
            }
            
            .highlight-pulse-with-shadow {
              animation: highlight-pulse-base 2s infinite ease-in-out;
              position: relative;
              z-index: 1000 !important;
              border-radius: 4px;
              box-shadow: 0 0 0 4000px rgba(0, 0, 0, 0.6), 0 0 20px 5px rgba(168, 85, 247, 0.6);
            }
            
            @keyframes highlight-glow {
              0% { 
                outline: 3px solid rgba(168, 85, 247, 0.6); 
                outline-offset: 3px;
                box-shadow: 0 0 15px 3px rgba(168, 85, 247, 0.4);
                background-color: rgba(168, 85, 247, 0.05);
              }
              50% { 
                outline: 4px solid rgba(168, 85, 247, 1); 
                outline-offset: 6px;
                box-shadow: 0 0 25px 8px rgba(168, 85, 247, 0.7);
                background-color: rgba(168, 85, 247, 0.1);
              }
              100% { 
                outline: 3px solid rgba(168, 85, 247, 0.6); 
                outline-offset: 3px;
                box-shadow: 0 0 15px 3px rgba(168, 85, 247, 0.4);
                background-color: rgba(168, 85, 247, 0.05);
              }
            }
            
            @keyframes highlight-spotlight {
              0% { 
                filter: brightness(1.1) drop-shadow(0 0 12px rgba(168, 85, 247, 0.6)); 
                transform: scale(1);
              }
              50% { 
                filter: brightness(1.2) drop-shadow(0 0 25px rgba(168, 85, 247, 0.9)); 
                transform: scale(1.01);
              }
              100% { 
                filter: brightness(1.1) drop-shadow(0 0 12px rgba(168, 85, 247, 0.6)); 
                transform: scale(1);
              }
            }
            
            @keyframes highlight-outline {
              0% { 
                outline: 3px solid rgba(168, 85, 247, 0.7); 
                outline-offset: 3px;
                box-shadow: 0 0 15px rgba(168, 85, 247, 0.5);
              }
              50% { 
                outline: 3px solid rgba(168, 85, 247, 1); 
                outline-offset: 6px;
                box-shadow: 0 0 25px rgba(168, 85, 247, 0.8);
              }
              100% { 
                outline: 3px solid rgba(168, 85, 247, 0.7); 
                outline-offset: 3px;
                box-shadow: 0 0 15px rgba(168, 85, 247, 0.5);
              }
            }
            
            .highlight-pulse {
              animation: highlight-pulse-base 2s infinite ease-in-out;
              position: relative;
              z-index: 1000 !important;
              border-radius: 4px;
            }
            
            .highlight-glow {
              animation: highlight-glow 2s infinite ease-in-out;
              position: relative;
              z-index: 1000 !important;
              border-radius: 4px;
            }
            
            .highlight-spotlight {
              animation: highlight-spotlight 2s infinite ease-in-out;
              position: relative;
              z-index: 1000 !important;
              border-radius: 4px;
            }
            
            .highlight-outline {
              animation: highlight-outline 2s infinite ease-in-out;
              position: relative;
              z-index: 1000 !important;
              border-radius: 4px;
            }
            
            /* Ensure text color is preserved during highlighting */
            .get-started-btn.highlight-outline,
            .get-started-btn.highlight-glow,
            .get-started-btn.highlight-pulse,
            .get-started-btn.highlight-spotlight,
            .get-started-btn.highlight-pulse-no-shadow,
            .get-started-btn.highlight-pulse-with-shadow {
              color: black !important;
            }
            
            /* Ensure the pricing card is properly highlighted */
            .pricing-card.highlight-spotlight {
              z-index: 1000 !important;
            }
          `}</style>

          {/* Tour guide card with improved design */}
          <motion.div
            ref={tourRef}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            style={guidePosition}
            className="bg-black/90 border border-purple-500/30 rounded-xl shadow-lg shadow-purple-900/20 overflow-hidden z-[10000] max-w-md"
          >
            {/* Progress indicator */}
            <div className="w-full h-1 bg-gray-800">
                <motion.div
                initial={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                className="h-full bg-gradient-to-r from-purple-500 to-purple-700"
                />
              </div>

            {/* Header with step indicator and close button */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-purple-900/30">
                    <div className="flex items-center gap-2">
                <span className="text-xl">{stepContent.emoji}</span>
                <h3 className="font-semibold text-white text-lg tracking-tight">
                  {stepContent.title}
                </h3>
                  </div>
                  {/* Show X icon on second+ visit or after step 2 */}
                  {(typeof window !== 'undefined' && localStorage.getItem('pricing-guide-shown') === 'true' || currentStep >= 2) && (
                    <button
                      onClick={onSkip}
                      className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                  )}
                </div>

            {/* Content */}
            <div className="px-5 py-4">
              <p className="text-gray-300 leading-relaxed">
                    {stepContent.content}
              </p>
                </div>

            {/* Step indicator and navigation */}
            <div className="px-5 py-3 bg-purple-900/20 border-t border-purple-900/30 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalSteps }).map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`w-2 h-2 rounded-full ${idx === currentStep ? 'bg-purple-500' : 'bg-gray-600'}`}
                  />
                ))}
              </div>
              
              <div className="flex items-center gap-2">
                  <button
                    onClick={onPrev}
                    disabled={currentStep === 0}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    currentStep === 0 
                      ? 'text-gray-500 cursor-not-allowed' 
                      : 'text-gray-300 hover:text-white hover:bg-purple-700/30'
                  }`}
                >
                    Previous
                  </button>
                
                {currentStep === totalSteps - 1 ? (
                  <button
                    onClick={handleLastSlideAction}
                    className="px-3 py-1.5 bg-purple-700 hover:bg-purple-600 text-white rounded-md text-sm font-medium transition-colors flex items-center gap-1"
                  >
                    Get Started
                    <svg 
                      className="w-4 h-4" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={onNext}
                    className="px-3 py-1.5 bg-purple-700 hover:bg-purple-600 text-white rounded-md text-sm font-medium transition-colors flex items-center gap-1"
                  >
                    Next
                    <motion.svg
                      animate={getArrowAnimation()}
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </motion.svg>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
          
          {/* Show directional arrow if configured */}
          {false && stepContent.showArrow !== false && targetElement && arrowStartElement && (
            <DirectionalArrow
              fromElement={arrowStartElement as HTMLElement}
              toElement={targetElement as HTMLElement}
              animate={true}
            />
          )}
        </>
      )}
    </AnimatePresence>
  );
});

GuidedTour.displayName = 'GuidedTour';

// Add the AppDevelopmentModal component
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

        {/* Enhanced Header with Animation */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="relative">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 0.9, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-5xl"
            >
              📱
            </motion.div>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-2 -right-2 text-2xl"
            >
              ✨
            </motion.div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              Mobile App Development
            </h2>
            <p className="text-purple-300">Transform your ideas into powerful mobile experiences</p>
          </div>
        </motion.div>

        {/* Content with Enhanced Sections */}
        <div className="space-y-6">
          {/* Store Requirements Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-xl p-6 border border-purple-500/30 hover:border-purple-500/50 transition-colors"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              App Store Requirements
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="bg-black/40 rounded-lg p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all hover:transform hover:scale-105">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-purple-300">Google Play Store</span>
                    <span className="text-green-400 font-semibold">$25</span>
                  </div>
                  <p className="text-gray-400 text-sm">One-time registration fee</p>
                </div>
                <div className="bg-black/40 rounded-lg p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all hover:transform hover:scale-105">
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
          </motion.div>

          {/* Development Process Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-xl p-6 border border-purple-500/30 hover:border-purple-500/50 transition-colors"
          >
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
                      <div key={index} className="flex items-start gap-4">
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
          </motion.div>

          {/* Consultation Options Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-6 border border-purple-500/30"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Free Consultation Options
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-black/40 rounded-lg p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all hover:transform hover:scale-105">
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
              <div className="bg-black/40 rounded-lg p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all hover:transform hover:scale-105">
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
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-6 border border-purple-500/30"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Get Started Today</h3>
            <p className="text-gray-300 mb-4">
              Ready to bring your app idea to life? Contact us for a free consultation and let's discuss your project in detail.
            </p>
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
          </motion.div>
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
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg transition-all hover:from-purple-500 hover:to-pink-500 flex items-center gap-2 justify-center group"
          >
            Schedule Consultation
            <svg 
              className="w-4 h-4 transform transition-transform group-hover:translate-x-1" 
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

export default function PricingPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { 
    currency, 
    exchangeRate, 
    isBaseCurrency, 
    isExemptCountry, 
    setCurrency 
  } = useCurrency();

  // Add isMobile state to the main component
  const [isMobile, setIsMobile] = useState(false);

  // Replace the showGuide state initialization
  const [showGuide, setShowGuide] = useState(true);
  const [currentGuideStep, setCurrentGuideStep] = useState(0);

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

  // Modify the guide initialization effect
  useEffect(() => {
    if (mounted) {
      // Check if user has visited before
      const hasVisitedBefore = localStorage.getItem('pricing-guide-shown') === 'true';
      
      if (hasVisitedBefore) {
        // This is a subsequent visit - either don't show guide or show with X button
        // Uncomment the next line if you want to never show the guide on subsequent visits
        // setShowGuide(false);
      }
      
      setCurrentGuideStep(0);
    }
  }, [mounted]);

  const handleSkipGuide = () => {
    setShowGuide(false);
    // Store in localStorage instead of sessionStorage to persist across browser sessions
    localStorage.setItem('pricing-guide-shown', 'true');
  };

  // Enhanced guide steps with better descriptions and highlighting
  const guideSteps: GuideStep[] = [
    {
      title: "Your Currency",
      content: "Your currency is automatically set based on your location. You can view pricing in multiple currencies including USD, GBP, AED, and PKR with real-time conversion rates.",
      target: "currency-selector",
      placement: "bottom",
      emoji: "💰",
      targetSelector: ".currency-selector",
      highlightTarget: true,
      highlightStyle: "pulse",
      actionType: "click",
      showArrow: false
    },
    {
      title: "Explore Pricing Plans",
      content: "Browse through our pricing plans. Each plan is carefully designed to meet different needs and requirements. Hover over a plan to see its features.",
      target: "pricing-grid",
      placement: "top",
      emoji: "🔍",
      targetSelector: ".pricing-card",
      highlightTarget: true,
      highlightStyle: "spotlight",
      actionType: "hover",
      showArrow: false
    },
    {
      title: "View Plan Details",
      content: "Click 'Learn More' to view comprehensive details about any plan including features, support options, and deployment information.",
      target: "plan-details",
      placement: "right",
      emoji: "📋",
      targetSelector: ".learn-more-btn",
      highlightTarget: true,
      highlightStyle: "glow",
      actionType: "click",
      showArrow: false
    },
    {
      title: "Get Started",
      content: "Found the perfect plan for your project? Click 'Get Started' to begin your journey with NEX-WEBS and take your digital presence to the next level!",
      target: "get-started",
      placement: "bottom",
      emoji: "🚀",
      targetSelector: ".get-started-btn",
      highlightTarget: true,
      highlightStyle: "outline",
      actionType: "click",
      showArrow: false
    }
  ];

  // Add useEffect to handle client-side mounting and loading state
  useEffect(() => {
    setMounted(true);
    window.scrollTo(0, 0); // Set scroll position to the top
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds loading time

    return () => clearTimeout(timer);
  }, []);

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
    ))
  ), [currency, exchangeRate, isExemptCountry, isBaseCurrency, handleGetStarted, getFormattedPrice]);

  // Handle advancing to next step
  const handleNextStep = () => {
    if (currentGuideStep < guideSteps.length - 1) {
      setCurrentGuideStep(prev => prev + 1);
    } else {
      handleSkipGuide(); // Close the guide when finished all steps
    }
  };

  // Handle going back to previous step
  const handlePrevStep = () => {
    setCurrentGuideStep(prev => Math.max(prev - 1, 0));
  };

  // Style for currency selector
  const currencySelectorStyle: React.CSSProperties = {
    position: 'relative' as const,
    zIndex: 1000,
    display: 'block',
    marginBottom: '2rem',
  };

  // Add state for app modal
  const [showAppModal, setShowAppModal] = useState(false);

  // Return loading screen while loading or during client-side hydration
  if (!mounted || isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-black relative overflow-x-hidden pt-20 md:pt-32">
      {/* Remove the glow effects div */}

      {/* Optimized Back Button - Simplified */}
      <div className="fixed top-4 md:top-20 left-4 md:left-8 z-50">
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
            className="text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-4 md:mb-6 px-4 md:px-6 py-4 md:py-6 relative z-30 bg-black/40 backdrop-blur-sm rounded-xl inline-block"
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

        {/* E-Commerce Store Management Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 mb-16 max-w-6xl mx-auto"
        >
          <div className="flex flex-col items-center text-center mb-8">
            <span className="text-2xl mb-2">🛍️</span>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">E-Commerce Store Management</h2>
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

        {/* Simplified Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 max-w-6xl mx-auto px-2 md:px-4 relative z-[1]">
          {pricingCardsList}
        </div>

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

        {/* Guided Tour - Only show for desktop users */}
        {!isMobile && (
          <GuidedTour
            isOpen={showGuide}
            onClose={() => setShowGuide(false)}
            currentStep={currentGuideStep}
            totalSteps={guideSteps.length}
            stepContent={guideSteps[currentGuideStep]}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
            onSkip={handleSkipGuide}
            isMobile={isMobile}
          />
        )}
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
  );
}