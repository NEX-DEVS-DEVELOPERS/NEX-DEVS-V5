'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PricingPlan {
  title: string;
  price: string;
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

const pricingPlans: PricingPlan[] = [
  {
    title: "WordPress Basic",
    price: "PKR 25,000",
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
    price: "PKR 35,000",
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
    price: "PKR 50,000",
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
    price: "PKR 40,000",
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
    price: "PKR 60,000",
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
    price: "PKR 100,000",
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
    price: "Starting from PKR 70K",
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
    price: "Starting from 20K",
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

export default function PricingPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  // Handle keyboard and click events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedPlan) {
        setSelectedPlan(null);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (selectedPlan && (e.target as HTMLElement).classList.contains('modal-overlay')) {
        setSelectedPlan(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleClickOutside);
    };
  }, [selectedPlan]);

  const handleGetStarted = (plan: PricingPlan) => {
    const encodedPlan = encodeURIComponent(plan.title);
    router.push(`/contact?plan=${encodedPlan}`);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden pt-24 md:pt-52">
      {/* Enhanced Glow Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-500/10 rounded-full blur-[120px] animate-float-smooth opacity-50 md:opacity-100"></div>
        <div className="absolute bottom-0 right-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-float-delayed opacity-50 md:opacity-100"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-purple-700/5 rounded-full blur-[150px] animate-pulse opacity-50 md:opacity-100"></div>
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

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-8 md:pt-16 pb-20 relative z-20">
        <div className="text-center mb-8 md:mb-16 relative z-10">
          {/* Floating Mockups - Adjusted for mobile */}
          <div className="relative w-full max-w-lg mx-auto mb-8 md:mb-12 mt-8 md:mt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: typeof window !== 'undefined' && window.innerWidth > 768 ? 0.8 : 0.3 
              }}
              className="absolute -top-12 md:-top-16 -left-4 md:-left-8 w-16 md:w-24 h-16 md:h-24 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg backdrop-blur-sm transform -rotate-12 animate-float-smooth"
            >
              <span className="text-2xl md:text-4xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">💻</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: typeof window !== 'undefined' && window.innerWidth > 768 ? 0.8 : 0.3,
                delay: typeof window !== 'undefined' && window.innerWidth > 768 ? 0.2 : 0
              }}
              className="absolute -top-6 md:-top-8 -right-4 md:-right-8 w-14 md:w-20 h-14 md:h-20 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg backdrop-blur-sm transform rotate-12 animate-float-delayed"
            >
              <span className="text-2xl md:text-3xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">🚀</span>
            </motion.div>
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: typeof window !== 'undefined' && window.innerWidth > 768 ? 0.8 : 0.3,
              ease: "easeOut" 
            }}
            className="text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-4 md:mb-6 glow-text-purple px-4 md:px-6 py-4 md:py-6 relative z-20 bg-black/40 backdrop-blur-sm rounded-xl inline-block mt-4 md:mt-8"
          >
            Choose Your <span className="inline-block bg-white text-black px-2 md:px-3 py-1 rounded-md">Perfect Plan</span>
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute -top-4 -right-4 text-xl md:text-2xl transform rotate-12"
            >
              ✨
            </motion.span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ 
              delay: typeof window !== 'undefined' && window.innerWidth > 768 ? 0.4 : 0,
              duration: typeof window !== 'undefined' && window.innerWidth > 768 ? 0.8 : 0.3,
              ease: "easeOut" 
            }}
            className="text-white/80 text-sm md:text-base glow-text-sm max-w-2xl mx-auto px-3 md:px-4 py-2 bg-black/20 backdrop-blur-sm rounded-lg"
          >
            Transparent pricing with no hidden fees. Select a plan to view detailed features.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 max-w-6xl mx-auto px-2 md:px-4">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.title}
              initial={{
                opacity: 0,
                y: typeof window !== 'undefined' && window.innerWidth > 768 ? 20 : 0
              }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: typeof window !== 'undefined' && window.innerWidth > 768 ? index * 0.1 : 0, 
                duration: typeof window !== 'undefined' && window.innerWidth > 768 ? 0.5 : 0.3,
                ease: "easeOut"
              }}
              onMouseEnter={() => setHoveredPlan(plan.title)}
              onMouseLeave={() => setHoveredPlan(null)}
              className={`${
                plan.title.includes('Full-Stack') 
                  ? 'bg-gradient-to-br from-purple-900/20 to-black border-purple-500/40' 
                  : 'bg-black/40 border-purple-500/20'
              } backdrop-blur-sm rounded-xl p-4 md:p-6 cursor-pointer border group
              transition-all duration-500 ease-out
              hover:scale-[1.02] hover:border-purple-500/70
              active:scale-[0.98] md:active:scale-[1.02]
              hover:shadow-[0_0_20px_-5px_rgba(147,51,234,0.2)]
              relative touch-manipulation`}
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
              <p className="text-purple-300 text-base md:text-xl mb-1 md:mb-2">{plan.price}</p>
              <p className="text-gray-400 text-xs md:text-sm mb-3 md:mb-4">Timeline: {plan.timeline}</p>
              
              {/* Mobile View Additional Details */}
              <div className="block md:hidden space-y-4 mb-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-purple-300">Key Features:</p>
                  <ul className="space-y-1.5">
                    {plan.highlightFeatures.map((feature, i) => (
                      <li key={i} className="flex items-start text-xs text-gray-300">
                        <svg className="w-4 h-4 text-purple-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Desktop Features Preview */}
              <ul className="hidden md:block text-gray-300 space-y-2 md:space-y-3 mb-4 md:mb-6">
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
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPlan(plan);
                  }}
                  className="flex-1 py-2 md:py-3 px-4 text-white bg-transparent border border-white/20 
                    rounded-lg transition-all duration-300 hover:bg-white/5 hover:border-white/40
                    font-semibold text-sm md:text-base"
                >
                  Learn More
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGetStarted(plan);
                  }}
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
          ))}
        </div>

        {/* Modal */}
        {selectedPlan && (
          <div 
            className="fixed inset-0 bg-black/90 flex items-start justify-center z-[100] p-4 modal-overlay overflow-y-auto pt-16 md:pt-32"
            onClick={() => setSelectedPlan(null)}
          >
            <div
              className="bg-gradient-to-br from-black/95 to-purple-900/10 backdrop-blur-md rounded-2xl p-6 md:p-8 w-full max-w-4xl mx-auto relative border border-purple-500/30"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Content */}
              <div className="space-y-6">
                {/* Description */}
                <div className="bg-purple-500/5 rounded-xl p-4 md:p-6">
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed">{selectedPlan.description}</p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {selectedPlan.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start bg-purple-500/5 rounded-lg p-3 md:p-4 group hover:bg-purple-500/10 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-purple-400 mr-3 flex-shrink-0 mt-0.5 group-hover:text-purple-300 transition-colors duration-200" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-300 text-sm md:text-base group-hover:text-white transition-colors duration-200">{feature}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Best For Section */}
                <div className="bg-purple-500/5 rounded-xl p-4 md:p-6">
                  <h3 className="text-white font-semibold mb-4 text-base md:text-lg">Best For:</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPlan.bestFor.map((item, i) => (
                      <span key={i} className="text-sm bg-purple-500/10 text-purple-300 px-3 py-1.5 rounded-full">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Modal Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button 
                    onClick={() => setSelectedPlan(null)}
                    className="flex-1 py-3 px-6 text-white bg-transparent border border-white/20 
                      rounded-xl hover:bg-white/5 transition-all duration-200 font-semibold"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => handleGetStarted(selectedPlan)}
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
          </div>
        )}

        {/* Testimonials section - Adjusted for mobile */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 md:mt-20 max-w-6xl mx-auto px-4"
        >
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white text-center mb-8 md:mb-12 glow-text-purple-sm">
            What Our Clients Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="bg-gradient-to-br from-purple-500/10 to-transparent backdrop-blur-sm rounded-xl p-4 md:p-6 border border-purple-500/20 transition-colors duration-200 hover:border-purple-500/40"
              >
                <div className="flex items-start mb-3 md:mb-4">
                  <span className="text-2xl md:text-3xl mr-2 md:mr-3">{testimonial.icon}</span>
                  <p className="text-gray-300 italic text-sm md:text-base">{testimonial.text}</p>
                </div>
                <div className="mt-3 md:mt-4">
                  <p className="text-white font-medium text-sm md:text-base">{testimonial.author}</p>
                  <p className="text-purple-400 text-xs md:text-sm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Add these keyframes at the end of the file, before the last closing brace
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes scaleIn {
    from { 
      opacity: 0;
      transform: scale(0.95) translateY(10px);
    }
    to { 
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }

  .animate-scaleIn {
    animation: scaleIn 0.3s ease-out;
  }

  .animate-shimmer {
    animation: shimmer 2s infinite;
  }
`;

// Add this to your document head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}