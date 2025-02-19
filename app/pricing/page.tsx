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
}

const pricingPlans: PricingPlan[] = [
  {
    title: "WordPress Basic",
    price: "PKR 25,000",
    description: "Perfect starter package for small businesses and bloggers with essential WordPress features and SEO optimization.",
    icon: "🎯",
    timeline: "1-2 weeks",
    bestFor: ["Small Businesses", "Personal Blogs", "Portfolio Sites", "Startups"],
    includes: [
      "GeneratePress Theme License",
      "5 Days Revision Period",
      "2 SEO Articles",
      "Basic Security Package"
    ],
    features: [
      "GeneratePress Theme Professional Setup",
      "Complete Website Development (Up to 5 Pages)",
      "Mobile-First Responsive Design",
      "Essential Premium Plugins Integration",
      "Speed & Performance Optimization",
      "2 SEO-Optimized Articles with Research",
      "Basic XML Sitemap Setup",
      "Google Analytics Integration",
      "Contact Form Integration",
      "Social Media Integration",
      "Basic On-Page SEO Setup",
      "5 Days Post-Launch Support",
      "Website Security Setup",
      "1-on-1 Training Session"
    ]
  },
  {
    title: "WordPress Professional",
    price: "PKR 35,000",
    description: "Advanced WordPress solution with premium themes, plugins, and comprehensive SEO optimization for growing businesses.",
    icon: "⚡",
    timeline: "2-3 weeks",
    bestFor: [
      "Growing Businesses",
      "Content Creators",
      "Online Magazines",
      "Professional Bloggers"
    ],
    includes: [
      "Premium Theme License (Foxiz/Pixwell/Phlox)",
      "10 Days Revision Period",
      "Pro Plugins Bundle",
      "Advanced Security Package"
    ],
    features: [
      "Premium Theme Installation & Setup",
      "Complete Website Development (Up to 10 Pages)",
      "Rank Math Pro SEO Suite Integration",
      "Elementor Pro Page Builder Setup",
      "WPForms Pro Integration",
      "Advanced Performance Optimization",
      "CDN Integration & Setup",
      "Complete Schema Markup Implementation",
      "Advanced XML Sitemap Configuration",
      "Google Search Console Setup",
      "Advanced Analytics Integration",
      "Social Media Widgets Integration",
      "Custom 404 Error Page",
      "Database Optimization",
      "Caching System Implementation",
      "Advanced Security Measures",
      "Comprehensive SEO Strategy Document",
      "2 Hours of Training Sessions"
    ]
  },
  {
    title: "WordPress Enterprise",
    price: "PKR 50,000",
    description: "Complete WordPress solution with all premium features, hosting, extensive SEO optimization, and comprehensive digital presence setup.",
    icon: "👑",
    timeline: "3-4 weeks",
    bestFor: [
      "Large Businesses",
      "E-commerce Sites",
      "News Portals",
      "Digital Agencies"
    ],
    includes: [
      "All Premium Theme Access ($500+ Value)",
      "Premium Plugins Bundle ($1000+ Value)",
      "1 Year Hostinger Business Hosting",
      "Free Domain Registration",
      "Premium SSL Certificate"
    ],
    features: [
      "Unlimited Pages Development",
      "Premium Theme Access (AVADA, FOXIX, PIXWELL)",
      "WP Rocket Pro Speed Optimization ($170 Value)",
      "Rank Math Pro SEO Suite ($129/year Value)",
      "Elementor Pro Page Builder ($59/year Value)",
      "Smush Pro Image Optimization",
      "Advanced Forms Pro Integration",
      "6 Semantically Optimized Articles (2000+ Words Each)",
      "Professional Backlinks Strategy Document",
      "Comprehensive Keyword Research",
      "Complete Technical SEO Setup",
      "Advanced Security Implementation",
      "Regular Backup System",
      "Multi-language Support Setup",
      "Advanced E-commerce Features",
      "Custom Gutenberg Blocks",
      "API Integration for Fast Indexing",
      "Advanced Analytics Dashboard",
      "Custom Admin Dashboard",
      "Priority Support (30 Days)",
      "4 Hours of Team Training",
      "Monthly Performance Report",
      "Complete Technical Documentation"
    ]
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
      "Basic Deployment"
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
      "Basic Documentation"
    ]
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
    ]
  },
  {
    title: "Full-Stack Enterprise",
    price: "PKR 80,000",
    description: "Enterprise-grade full-stack development with premium features, microservices architecture, and advanced security for large-scale applications.",
    icon: "🚀",
    timeline: "4-6 weeks",
    bestFor: ["Enterprises", "Large-scale Apps", "High-traffic Platforms", "Complex Systems"],
    includes: [
      "Microservices Architecture",
      "Multi-Database Support",
      "Advanced Security",
      "DevOps Setup"
    ],
    features: [
      "Next.js 14/React Server Components",
      "Microservices Architecture",
      "Multi-Database Support",
      "Advanced Security Features",
      "CI/CD Pipeline Setup",
      "Load Balancing",
      "Auto-scaling Configuration",
      "Monitoring & Logging",
      "Disaster Recovery",
      "Enterprise Documentation"
    ]
  },
  {
    title: "Shopify/WooCommerce",
    price: "Starting from PKR 40k-50k",
    description: "Complete e-commerce solutions with powerful features to grow your online business.",
    icon: "🛍️",
    timeline: "1-2 weeks",
    bestFor: ["Online Stores", "Retailers", "Digital Products"],
    includes: ["Payment Gateway Setup", "Inventory System", "Order Management"],
    features: [
      "Custom Store Design",
      "Product Setup & Migration",
      "Payment Gateway Integration",
      "Inventory Management",
      "Analytics Integration",
      "Mobile Commerce Ready",
      "Multi-currency Support",
      "Automated Email Marketing"
    ]
  },
  {
    title: "Figma/Framer",
    price: "Starting from PKR 40K-50K",
    description: "Professional UI/UX design services with modern design principles and interactive prototypes.",
    icon: "✨",
    timeline: "1 weeks",
    bestFor: ["Startups", "Design Teams", "Product Managers"],
    includes: ["Design System", "Component Library", "Prototype Access"],
    features: [
      "Custom UI Design",
      "Interactive Prototypes",
      "Design System Creation",
      "Animation & Micro-interactions",
      "Responsive Layouts",
      "Design Handoff",
      "User Flow Mapping",
      "Accessibility Guidelines"
    ]
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
    ]
  },
  {
    title: "SEO/Content Writing",
    price: "Starting from 20K",
    description: "Strategic content creation and SEO optimization to improve your online presence.",
    icon: "📝",
    timeline: "Ongoing",
    bestFor: ["Content Marketers", "Digital Brands", "Online Publications"],
    includes: ["Monthly Reports", "Keyword Research", "Content Calendar"],
    features: [
      "Keyword Research",
      "Content Strategy",
      "Technical SEO",
      "Content Creation",
      "Performance Tracking",
      "Monthly Reports",
      "Competitor Analysis",
      "Link Building Strategy"
    ]
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
    // Encode the plan title to be URL-safe
    const encodedPlan = encodeURIComponent(plan.title);
    // Navigate to contact page with the selected plan
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
              transition-transform duration-300 ease-out
              hover:scale-[1.02] hover:border-purple-500/70
              hover:shadow-[0_0_20px_-5px_rgba(147,51,234,0.2)]
              relative
              before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br
              before:from-purple-500/5 before:to-purple-500/0
              before:transition-opacity before:duration-300
              hover:before:opacity-100`}
              onClick={() => setSelectedPlan(plan)}
            >
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <h3 className="text-lg md:text-2xl font-bold text-white glow-text-purple-sm transition-colors duration-300 group-hover:text-purple-200">{plan.title}</h3>
                <span className="text-2xl md:text-4xl transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-[8deg]">{plan.icon}</span>
              </div>
              <p className="text-purple-300 text-base md:text-xl mb-1 md:mb-2 transition-colors duration-300 group-hover:text-purple-200">{plan.price}</p>
              <p className="text-gray-400 text-xs md:text-sm mb-3 md:mb-4 transition-colors duration-300 group-hover:text-gray-300">Timeline: {plan.timeline}</p>
              <ul className="text-gray-300 space-y-2 md:space-y-3 mb-4 md:mb-6">
                {plan.features.slice(0, 3).map((feature, i) => (
                  <li 
                    key={i} 
                    className="flex items-start md:items-center text-sm md:text-base opacity-0 animate-fadeIn group-hover:text-gray-200"
                    style={{ 
                      animationDelay: `${i * 100}ms`, 
                      animationFillMode: 'forwards',
                      transition: 'transform 0.3s ease-out, color 0.3s ease-out',
                      transform: `translateX(${hoveredPlan === plan.title ? '4px' : '0px'})`
                    }}
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-purple-400 mr-2 mt-1 md:mt-0 flex-shrink-0 transition-colors duration-300 group-hover:text-purple-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="leading-tight transition-transform duration-300 ease-out">{feature}</span>
                  </li>
                ))}
              </ul>
              <div 
                className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
                style={{
                  maxHeight: hoveredPlan === plan.title ? '200px' : '0',
                  opacity: hoveredPlan === plan.title ? 1 : 0,
                  transform: `translateY(${hoveredPlan === plan.title ? '0' : '-10px'})`,
                }}
              >
                <div className="border-t border-purple-500/20 pt-3 md:pt-4 mb-3 md:mb-4">
                  <p className="text-purple-300 font-semibold text-sm md:text-base mb-2">Best For:</p>
                  <div className="flex flex-wrap gap-1.5 md:gap-2">
                    {plan.bestFor.map((item, i) => (
                      <span 
                        key={i} 
                        className="text-[10px] md:text-xs bg-purple-500/10 text-purple-300 px-1.5 md:px-2 py-0.5 md:py-1 rounded
                        transition-all duration-300 ease-out hover:bg-purple-500/20 hover:text-purple-200"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <button className="w-full py-2 md:py-3 px-4 md:px-6 text-black bg-white rounded-lg 
                transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
                hover:bg-purple-50 font-semibold text-sm md:text-base 
                group-hover:shadow-lg group-hover:shadow-white/20
                relative overflow-hidden
                before:absolute before:inset-0 before:bg-gradient-to-r
                before:from-transparent before:via-purple-100/50 before:to-transparent
                before:translate-x-[-200%] group-hover:before:translate-x-[200%]
                before:transition-transform before:duration-[800ms] before:ease-out
                group-hover:scale-[1.02]">
                Learn More
              </button>
            </motion.div>
          ))}
        </div>

        {/* Modal */}
        {selectedPlan && (
          <div 
            className="fixed inset-0 bg-black/90 flex items-start justify-center z-[100] p-2 md:p-4 modal-overlay overflow-y-auto pt-16 md:pt-32 opacity-0 animate-fadeIn"
            style={{ animationDuration: '200ms', animationFillMode: 'forwards' }}
          >
            <div
              className="bg-gradient-to-br from-black/95 to-purple-900/10 backdrop-blur-md rounded-2xl p-6 md:p-8 lg:p-10 w-full max-w-4xl mx-auto relative border border-purple-500/30 shadow-2xl shadow-purple-500/20 opacity-0 animate-scaleIn"
              style={{ animationDuration: '300ms', animationFillMode: 'forwards', animationDelay: '100ms' }}
            >
              {/* Close button - Repositioned */}
              <button
                onClick={() => setSelectedPlan(null)}
                className="absolute top-4 right-4 md:top-6 md:right-6 text-purple-400 hover:text-white transition-colors p-2 md:p-3 bg-black/50 rounded-full backdrop-blur-sm z-50 hover:bg-black/70"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Modal header - Redesigned */}
              <div className="border-b border-purple-500/20 pb-6 md:pb-8 mb-6 md:mb-8">
                <div className="flex items-start md:items-center gap-4 md:gap-6">
                  <div className="bg-gradient-to-br from-purple-500/20 to-purple-900/20 p-3 md:p-4 rounded-xl">
                    <span className="text-3xl md:text-5xl lg:text-6xl block">{selectedPlan.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 md:mb-3">{selectedPlan.title}</h2>
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                      <p className="text-xl md:text-2xl text-purple-300 font-semibold">{selectedPlan.price}</p>
                      <span className="hidden md:block text-purple-400/60">•</span>
                      <p className="text-sm md:text-base text-purple-400/80">{selectedPlan.timeline}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal content - Reorganized */}
              <div className="space-y-6 md:space-y-8 lg:space-y-10">
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

                {/* CTA Button */}
                <div className="pt-4 md:pt-6">
                  <button 
                    onClick={() => handleGetStarted(selectedPlan)}
                    className="w-full py-4 px-6 bg-white text-black rounded-xl hover:bg-gray-100 transition-all duration-200 font-semibold text-base md:text-lg flex items-center justify-center gap-2 group"
                  >
                    Get Started
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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