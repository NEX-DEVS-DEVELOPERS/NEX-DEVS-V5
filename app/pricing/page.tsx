'use client';

import React, { useState, useEffect, useMemo, useCallback, memo, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCurrency } from '@/app/contexts/CurrencyContext';
import { SupportedCurrency, getLocationData, formatPrice, currencySymbols } from '@/app/utils/pricing';
import CurrencySelector from '@/app/components/CurrencySelector';
import LoadingScreen from '@/app/components/LoadingScreen';
import PricingPlans from '../components/PricingPlans';
import TransitionEffect from '../components/TransitionEffect';
import dynamic from 'next/dynamic';

// Properly type the dynamic import for framer-motion
const DynamicTransitionEffect = dynamic(() => import('../components/TransitionEffect'), {
  ssr: false,
  loading: () => null
});

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
  }
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
  hoveredPlan: string | null;
  onHover: (planTitle: string | null) => void;
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

// Optimize the PricingCard component with memo
const PricingCard = memo(({ 
  plan, 
  onSelect, 
  onGetStarted, 
  hoveredPlan, 
  onHover,
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
      transition={{ duration: 0.15 }} // Reduce animation duration
      onMouseEnter={() => onHover(plan.title)}
      onMouseLeave={() => onHover(null)}
      className={`${
        plan.title.includes('Full-Stack') 
          ? 'bg-gradient-to-br from-purple-900/20 to-black border-purple-500/40' 
          : 'bg-black/40 border-purple-500/20'
      } backdrop-blur-sm rounded-xl p-4 md:p-6 cursor-pointer border group
      transition-transform duration-200 ease-out
      hover:scale-[1.02] hover:border-purple-500/70
      active:scale-[0.98] relative touch-manipulation will-change-transform`} // Add will-change-transform
    >
      {/* Most Popular Badge */}
      {(plan.title === "WordPress Enterprise" || 
        plan.title === "Full-Stack Professional" || 
        plan.title === "AI Agents/WebApps") && (
        <div className="absolute -top-3 -right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg transform rotate-2 z-10">
          MOST POPULAR
        </div>
      )}
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <h3 className="text-lg md:text-2xl font-bold text-white glow-text-purple-sm">{plan.title}</h3>
        <span className="text-2xl md:text-4xl">{plan.icon}</span>
      </div>

      {/* Price Section with Breakdown */}
      <div className="relative group">
        <div className="flex items-center gap-2">
          <p className="text-purple-300 text-base md:text-xl mb-1 md:mb-2">
            {getFormattedPrice(plan.basePrice)}
          </p>
          {['USD', 'GBP', 'AED'].includes(currency) && (
            <span className="bg-purple-500 text-white text-[10px] md:text-xs px-1.5 py-0.5 rounded-full font-medium animate-pulse">
              UPDATED
            </span>
          )}
        </div>
        
        {/* Price Breakdown Tooltip - Optimized to only render when needed */}
        {hoveredPlan === plan.title && (
          <div className="absolute left-0 w-full transform scale-100 opacity-100 transition-all duration-200 z-20 pointer-events-auto">
            <div className="bg-black/90 border border-purple-500/20 rounded-lg p-4 shadow-xl backdrop-blur-sm mt-2">
              <div className="space-y-2 text-sm">
                <p className="flex justify-between items-center">
                  <span className="text-gray-400">Base Price (PKR):</span>
                  <span className="text-white">₨{plan.basePrice.toLocaleString()}</span>
                </p>
                {!isExemptCountry && !isBaseCurrency && (
                  <>
                    <p className="flex justify-between items-center">
                      <span className="text-gray-400">International Fee (30%):</span>
                      <span className="text-purple-400">
                        {currencySymbols[currency]}{(plan.basePrice * 0.3 * exchangeRate).toLocaleString(undefined, {maximumFractionDigits: 2})}
                      </span>
                    </p>
                    <p className="flex justify-between items-center">
                      <span className="text-gray-400">Exchange Rate:</span>
                      <span className="text-gray-300">1 PKR = {exchangeRate.toFixed(4)} {currency}</span>
                    </p>
                    <div className="border-t border-purple-500/20 mt-2 pt-2">
                      <p className="flex justify-between items-center font-medium">
                        <span className="text-white">Final Price:</span>
                        <span className="text-purple-400">{getFormattedPrice(plan.basePrice)}</span>
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <p className="text-gray-400 text-xs md:text-sm mb-3 md:mb-4">Timeline: {plan.timeline}</p>

      {/* Features Preview - Show only 3 features to improve performance */}
      <ul className="text-gray-300 space-y-2 md:space-y-3 mb-4 md:mb-6">
        {plan.features.slice(0, 3).map((feature, i) => (
          <li key={i} className="flex items-center text-sm md:text-base">
            <svg className="w-4 h-4 md:w-5 md:h-5 text-purple-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2">
        <button 
          onClick={() => onSelect(plan)}
          className="flex-1 py-2 md:py-3 px-4 text-white bg-transparent border border-white/20 
            rounded-lg transition-all duration-300 hover:bg-white/5 hover:border-white/40
            font-semibold text-sm md:text-base"
        >
          Learn More
        </button>
        <button 
          onClick={() => onGetStarted(plan)}
          className="flex-1 py-2 md:py-3 px-4 text-black bg-white 
            rounded-lg transition-all duration-300 hover:bg-purple-50 active:bg-purple-100
            font-semibold text-sm md:text-base flex items-center justify-center gap-2"
        >
          Get Started
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
});

PricingCard.displayName = 'PricingCard';

// Optimize the PlanModal component
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
      transition={{ duration: 0.15 }} // Reduced duration
      className="fixed inset-0 bg-black/90 flex items-start justify-center z-[100] p-4 modal-overlay overflow-y-auto pt-16 md:pt-32"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-black/95 to-purple-900/10 backdrop-blur-md rounded-2xl p-6 md:p-8 w-full max-w-4xl mx-auto relative border border-purple-500/30"
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

export default function PricingPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);
  const [showExitTransition, setShowExitTransition] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const { 
    currency, 
    exchangeRate, 
    isBaseCurrency, 
    isExemptCountry, 
    setCurrency 
  } = useCurrency();

  // Memoize expensive calculations
  const getFormattedPrice = useCallback((basePrice: number): string => {
    const shouldApplyMarkup = !isBaseCurrency;
    return formatPrice(basePrice, currency, exchangeRate, !shouldApplyMarkup);
  }, [currency, exchangeRate, isBaseCurrency]);

  const handleGetStarted = useCallback(async (plan: PricingPlan) => {
    const isMobile = window.innerWidth < 768;
    
    if (!isMobile) {
      setShowExitTransition(true);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Reduced from 1800
    }
    
    const encodedPlan = encodeURIComponent(plan.title);
    router.push(`/contact?plan=${encodedPlan}`);
  }, [router]);

  const handleHover = useCallback((planTitle: string | null) => {
    setHoveredPlan(planTitle);
  }, []);

  useEffect(() => {
    let mounted = true;

    const detectLocation = async () => {
      try {
        // Prevent layout shifts by using a small delay
        const locationData = await getLocationData('');
        if (mounted) {
          setCurrency(locationData.currency as SupportedCurrency);
          // Delay hiding loading screen to prevent jank
          requestAnimationFrame(() => {
            if (mounted) setShowLoadingScreen(false);
          });
        }
      } catch (error) {
        console.error('Error detecting location:', error);
        if (mounted) {
          setCurrency('PKR');
          setShowLoadingScreen(false);
        }
      }
    };

    detectLocation();

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
        hoveredPlan={hoveredPlan}
        onHover={handleHover}
        currency={currency}
        exchangeRate={exchangeRate}
        isExemptCountry={isExemptCountry}
        isBaseCurrency={isBaseCurrency}
        getFormattedPrice={getFormattedPrice}
      />
    ))
  ), [hoveredPlan, currency, exchangeRate, isExemptCountry, isBaseCurrency, handleGetStarted, handleHover, getFormattedPrice]);

  if (showLoadingScreen) {
    return <LoadingScreen />;
  }

  return (
    <>
      <AnimatePresence>
        {showExitTransition && (
          <Suspense fallback={null}>
            <DynamicTransitionEffect isExit message="See you soon!" />
          </Suspense>
        )}
      </AnimatePresence>
      
      <div className="min-h-screen bg-black relative overflow-hidden pt-20 md:pt-32">
        {/* Enhanced Glow Effects - Reduced complexity for better performance */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-500/10 rounded-full blur-[120px] opacity-50 md:opacity-100 will-change-transform"></div>
          <div className="absolute bottom-0 right-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-600/10 rounded-full blur-[120px] opacity-50 md:opacity-100 will-change-transform"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-purple-700/5 rounded-full blur-[150px] opacity-50 md:opacity-100 will-change-transform"></div>
        </div>

        {/* Back Button - Adjusted for mobile */}
        <div className="fixed top-4 md:top-20 left-4 md:left-8 z-50">
          <button 
            onClick={() => setSelectedPlan(null)}
            className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors group bg-black/20 backdrop-blur-sm px-3 py-2 rounded-lg"
          >
            <svg 
              className="w-4 h-4 md:w-5 md:h-5 transform transition-transform group-hover:-translate-x-1" 
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
            {/* Project Title - Simplified animation */}
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-lg md:text-xl text-purple-400 font-semibold mb-4"
            >
              NEX-WEBS DEVELOPMENT
            </motion.h2>

            {/* Currency Info Banner - Simplified animations */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
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

            {/* Enhanced Floating Mockups with Animations */}
            <div className="relative w-full max-w-lg mx-auto mb-8 md:mb-12 mt-8 md:mt-12">
              <motion.div
                initial={{ opacity: 0, y: 20, rotate: -12 }}
                animate={{ 
                  opacity: 1, 
                  y: [0, -10, 0],
                  rotate: [-12, -8, -12]
                }}
                transition={{ 
                  opacity: { duration: 0.3 },
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
                className="absolute -top-12 md:-top-16 -left-4 md:-left-8 w-16 md:w-24 h-16 md:h-24 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg backdrop-blur-sm"
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
                  opacity: { duration: 0.3 },
                  y: { 
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  },
                  rotate: {
                    duration: 4.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
                className="absolute -top-6 md:-top-8 -right-4 md:-right-8 w-14 md:w-20 h-14 md:h-20 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg backdrop-blur-sm"
              >
                <span className="text-2xl md:text-3xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">🚀</span>
              </motion.div>
            </div>

            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-4 md:mb-6 glow-text-purple px-4 md:px-6 py-4 md:py-6 relative z-30 bg-black/40 backdrop-blur-sm rounded-xl inline-block"
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
                  opacity: { duration: 0.3 },
                  y: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  },
                  rotate: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
                className="absolute -top-4 -right-4 text-xl md:text-2xl"
              >
                ✨
              </motion.span>
            </motion.h1>

            {/* Simplified Currency Selector */}
            <motion.div
              className="flex flex-col items-center justify-center space-y-2 mb-8 px-4 w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <CurrencySelector />
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="text-gray-400 text-xs mt-1"
              >
                YOUR LOCATION IS AUTOMATICALLY SET
              </motion.p>
            </motion.div>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-white/80 text-sm md:text-base glow-text-sm max-w-2xl mx-auto px-3 md:px-4 py-2 bg-black/20 backdrop-blur-sm rounded-lg"
            >
              Transparent pricing with no hidden fees. Select a plan to view detailed features.
            </motion.p>

            {/* Updated Pricing Notice for USD, GBP, AED - Conditionally render */}
            {['USD', 'GBP', 'AED'].includes(currency) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
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

            {/* Price increase notice - Only show for non-exempt countries */}
            {!isExemptCountry && !isBaseCurrency && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-purple-400 text-sm mt-2"
              >
                * Prices include a 30% increase for international clients
              </motion.p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 max-w-6xl mx-auto px-2 md:px-4">
            {pricingCardsList}
          </div>

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
        </div>
      </div>
    </>
  );
}