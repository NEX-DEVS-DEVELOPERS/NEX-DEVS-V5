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
    <div className="min-h-screen bg-black relative overflow-hidden pt-52 md:pt-64">
      {/* Enhanced Glow Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] animate-float-smooth opacity-50 md:opacity-100"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-float-delayed opacity-50 md:opacity-100"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-700/5 rounded-full blur-[150px] animate-pulse opacity-50 md:opacity-100"></div>
      </div>

      {/* Back Button - Further adjusted position */}
      <div className="fixed top-20 md:top-24 left-4 md:left-8 z-50">
        <button 
          onClick={() => router.push('/')}
          className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors group bg-black/20 backdrop-blur-sm px-3 py-2 rounded-lg"
        >
          <svg 
            className="w-5 h-5 transform transition-transform group-hover:-translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-16 md:pt-20 pb-20 relative z-20">
        <div className="text-center mb-16 md:mb-20 relative z-10">
          {/* Floating Mockups - Further adjusted position */}
          <div className="relative w-full max-w-lg mx-auto mb-12 mt-12 md:mt-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute -top-16 -left-8 w-24 h-24 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg backdrop-blur-sm transform -rotate-12 animate-float-smooth"
            >
              <span className="text-4xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">💻</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute -top-8 -right-8 w-20 h-20 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg backdrop-blur-sm transform rotate-12 animate-float-delayed"
            >
              <span className="text-3xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">🚀</span>
            </motion.div>
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 md:mb-8 glow-text-purple px-6 py-6 relative z-20 bg-black/40 backdrop-blur-sm rounded-xl inline-block mt-8"
          >
            Choose Your <span className="inline-block bg-white text-black px-3 py-1 rounded-md">Perfect Plan</span>
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute -top-4 -right-4 text-2xl transform rotate-12"
            >
              ✨
            </motion.span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            className="text-white/80 text-base md:text-lg glow-text-sm max-w-2xl mx-auto px-4 py-2 bg-black/20 backdrop-blur-sm rounded-lg"
          >
            Transparent pricing with no hidden fees. Select a plan to view detailed features.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto px-2 md:px-4">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: index * 0.15, 
                duration: 0.8,
                ease: "easeOut"
              }}
              onHoverStart={() => setHoveredPlan(plan.title)}
              onHoverEnd={() => setHoveredPlan(null)}
              onClick={() => setSelectedPlan(plan)}
              className={`${
                plan.title.includes('Full-Stack') 
                  ? 'bg-gradient-to-br from-purple-900/20 to-black border-purple-500/40 hover:border-purple-500/70 shadow-lg shadow-purple-500/20' 
                  : 'bg-black/40 border-purple-500/20 hover:border-purple-500/50'
              } backdrop-blur-sm rounded-xl p-6 md:p-8 cursor-pointer transition-all duration-500 hover:bg-black/60 border group
              hover:transform hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-white glow-text-purple-sm">{plan.title}</h3>
                <span className="text-4xl animate-float-smooth">{plan.icon}</span>
              </div>
              <p className="text-purple-300 text-xl mb-2">{plan.price}</p>
              <p className="text-gray-400 text-sm mb-4">Timeline: {plan.timeline}</p>
              <ul className="text-gray-300 space-y-3 mb-6">
                {plan.features.slice(0, 3).map((feature, i) => (
                  <motion.li 
                    key={i} 
                    className="flex items-center"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                  >
                    <svg className="w-5 h-5 text-purple-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </motion.li>
                ))}
              </ul>
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ 
                  opacity: hoveredPlan === plan.title ? 1 : 0,
                  height: hoveredPlan === plan.title ? 'auto' : 0
                }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="border-t border-purple-500/20 pt-4 mb-4">
                  <p className="text-purple-300 font-semibold mb-2">Best For:</p>
                  <div className="flex flex-wrap gap-2">
                    {plan.bestFor.map((item, i) => (
                      <span key={i} className="text-xs bg-purple-500/10 text-purple-300 px-2 py-1 rounded">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
              <button className="w-full py-3 px-6 text-black bg-white rounded-lg transition-all duration-300 
                hover:bg-gray-100 font-semibold group-hover:shadow-lg group-hover:shadow-white/20 
                transform group-hover:scale-[1.02]">
                Learn More
              </button>
            </motion.div>
          ))}
        </div>

        {/* New Testimonials Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 max-w-6xl mx-auto"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12 glow-text-purple-sm">
            What Our Clients Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="bg-gradient-to-br from-purple-500/10 to-transparent backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 transition-colors duration-200 hover:border-purple-500/40"
              >
                <div className="flex items-start mb-4">
                  <span className="text-3xl mr-3">{testimonial.icon}</span>
                  <p className="text-gray-300 italic">{testimonial.text}</p>
                </div>
                <div className="mt-4">
                  <p className="text-white font-medium">{testimonial.author}</p>
                  <p className="text-purple-400 text-sm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Package Details Modal */}
        {selectedPlan && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 bg-black/90 flex items-start justify-center z-[100] p-2 md:p-4 modal-overlay overflow-y-auto pt-32"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                duration: 0.3,
                ease: "easeOut"
              }}
              className="bg-black/80 backdrop-blur-md rounded-xl p-6 md:p-8 w-full max-w-4xl my-12 relative border border-purple-500/30 shadow-purple-glow"
            >
              {/* Close button with tooltip - Adjusted position */}
              <div className="sticky top-6 right-6 float-right group z-50">
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="text-purple-400 hover:text-white transition-colors p-3 bg-black/50 rounded-full backdrop-blur-sm"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="absolute right-0 top-full mt-2 px-2 py-1 bg-purple-500/10 backdrop-blur-sm rounded text-xs text-white/80 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Press ESC to close
                </div>
              </div>

              {/* Modal header - Made sticky with increased padding */}
              <div className="sticky top-0 bg-black/95 backdrop-blur-md z-40 -mx-6 -mt-6 md:-mx-8 md:-mt-8 px-8 py-8 md:px-10 md:py-10 rounded-t-xl border-b border-purple-500/20">
                <div className="flex items-center gap-8">
                  <span className="text-6xl animate-float-smooth">{selectedPlan.icon}</span>
                  <div>
                    <h2 className="text-4xl font-bold text-white glow-text-purple mb-2">{selectedPlan.title}</h2>
                    <p className="text-purple-300 text-2xl">{selectedPlan.price}</p>
                  </div>
                  </div>
                </div>

              {/* Modal content - Increased padding and spacing */}
              <div className="space-y-10 pt-10">
                <div className="bg-purple-500/10 rounded-lg p-8 mb-10">
                  <h3 className="text-2xl text-white font-semibold mb-6">Project Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base">
                    <div className="flex items-center text-gray-300 bg-purple-500/5 p-4 rounded-lg">
                      <svg className="w-6 h-6 text-purple-400 mr-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Timeline: {selectedPlan.timeline}</span>
                    </div>
                    <div className="flex items-center text-gray-300 bg-purple-500/5 p-4 rounded-lg">
                      <svg className="w-6 h-6 text-purple-400 mr-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Includes Support</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-300 text-lg mb-8">{selectedPlan.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="text-white font-semibold mb-3 flex items-center">
                      <svg className="w-5 h-5 text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Features Included
                    </h3>
                    <ul className="space-y-2">
                      {selectedPlan.features.map((feature, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center text-gray-300 text-sm"
                        >
                          <svg className="w-4 h-4 text-purple-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {feature}
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-white font-semibold mb-3 flex items-center">
                      <svg className="w-5 h-5 text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Package Includes
                    </h3>
                    <ul className="space-y-2">
                      {selectedPlan.includes.map((item, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center text-gray-300 text-sm"
                        >
                          <svg className="w-4 h-4 text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {item}
                        </motion.li>
                      ))}
                    </ul>

                    <div className="mt-6">
                      <h3 className="text-white font-semibold mb-3 flex items-center">
                        <svg className="w-5 h-5 text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Best For
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedPlan.bestFor.map((item, index) => (
                          <motion.span
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="text-xs bg-purple-500/10 text-purple-300 px-2 py-1 rounded"
                          >
                            {item}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer - Made sticky with increased padding */}
                <div className="sticky bottom-0 bg-black/95 backdrop-blur-md -mx-6 md:-mx-8 px-8 md:px-10 py-6 mt-10 border-t border-purple-500/20 rounded-b-xl">
                  <div className="flex justify-end">
                  <button 
                    onClick={() => handleGetStarted(selectedPlan)}
                      className="py-4 px-10 text-black bg-white rounded-lg hover:bg-gray-100 transition-colors duration-200 font-semibold text-lg group"
                  >
                    <span className="flex items-center">
                      Get Started
                        <svg className="w-6 h-6 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 