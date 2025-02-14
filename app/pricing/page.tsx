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
    title: "WordPress Development",
    price: "Starting from Pkr30k-50k",
    description: "Custom WordPress solutions tailored to your business needs with modern design and functionality.",
    icon: "🎨",
    timeline: "1 weeks",
    bestFor: ["Small Businesses", "Bloggers", "Portfolio Sites"],
    includes: ["Free SSL Certificate", "1 Year Hosting", "24/7 Support"],
    features: [
      "Custom Theme Development",
      "Plugin Integration & Customization",
      "E-commerce Integration",
      "Speed Optimization",
      "SEO-friendly Structure",
      "Mobile Responsive Design",
      "Security Hardening",
      "Performance Monitoring"
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
    title: "Full-Stack Website",
    price: "Starting from PKR 60k-70k",
    description: "End-to-end web solutions with custom functionality and seamless user experience.",
    icon: "⚡",
    timeline: "3-5 weeks",
    bestFor: ["Enterprises", "SaaS Products", "Web Applications"],
    includes: ["CI/CD Setup", "Database Design", "API Documentation"],
    features: [
      "Custom Frontend & Backend",
      "Database Design",
      "API Integration",
      "User Authentication",
      "Cloud Deployment",
      "Performance Optimization",
      "Scalable Architecture",
      "Real-time Features"
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
    <div className="min-h-screen bg-black relative overflow-hidden pt-32 md:pt-36">
      {/* Enhanced Glow Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] animate-float-smooth opacity-50 md:opacity-100"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-float-delayed opacity-50 md:opacity-100"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-700/5 rounded-full blur-[150px] animate-pulse opacity-50 md:opacity-100"></div>
      </div>

      {/* Back Button */}
      <div className="fixed top-32 md:top-36 left-4 md:left-8 z-50">
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

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-8 md:pt-12 pb-20 relative z-20">
        <div className="text-center mb-12 md:mb-16">
          {/* Floating Mockups */}
          <div className="relative w-full max-w-lg mx-auto mb-8">
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
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 glow-text-purple px-4 relative"
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
            className="text-white/80 text-base md:text-lg glow-text-sm max-w-2xl mx-auto px-4"
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
              className="bg-black/40 backdrop-blur-sm rounded-xl p-6 md:p-8 cursor-pointer transform transition-all duration-500 hover:scale-105 hover:bg-black/60 border border-purple-500/20 hover:border-purple-500/50 hover:shadow-purple-glow group"
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
              <button className="w-full py-3 px-6 text-black bg-white rounded-lg hover:bg-gray-100 transition-all duration-300 font-semibold">
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
                transition={{ delay: index * 0.2 }}
                className="bg-gradient-to-br from-purple-500/10 to-transparent backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-colors"
              >
                <div className="flex items-start mb-4">
                  <span className="text-3xl mr-3 animate-float-smooth">{testimonial.icon}</span>
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
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-2 md:p-4 modal-overlay overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="bg-black/80 backdrop-blur-md rounded-xl p-6 md:p-8 w-full max-w-4xl mt-32 mb-4 md:mt-40 lg:mt-44 relative border border-purple-500/30 shadow-purple-glow"
            >
              {/* Close button with tooltip */}
              <div className="absolute top-4 right-4 group">
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="text-purple-400 hover:text-white transition-colors p-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="absolute right-0 top-full mt-2 px-2 py-1 bg-purple-500/10 backdrop-blur-sm rounded text-xs text-white/80 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Press ESC to close
                </div>
              </div>

              {/* Modal content with better spacing */}
              <div className="space-y-8">
                <div className="flex items-center gap-6 border-b border-purple-500/20 pb-6">
                  <span className="text-5xl animate-float-smooth">{selectedPlan.icon}</span>
                  <div>
                    <h2 className="text-3xl font-bold text-white glow-text-purple">{selectedPlan.title}</h2>
                    <p className="text-purple-300 text-xl">{selectedPlan.price}</p>
                  </div>
                </div>

                <div className="bg-purple-500/10 rounded-lg p-6 mb-8">
                  <h3 className="text-xl text-white font-semibold mb-4">Project Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-gray-300 bg-purple-500/5 p-3 rounded-lg">
                      <svg className="w-5 h-5 text-purple-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Timeline: {selectedPlan.timeline}
                    </div>
                    <div className="flex items-center text-gray-300 bg-purple-500/5 p-3 rounded-lg">
                      <svg className="w-5 h-5 text-purple-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Includes Support
                    </div>
                  </div>
                </div>

                <p className="text-gray-300 mb-6">{selectedPlan.description}</p>

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

                <div className="flex justify-end pt-6 border-t border-purple-500/20">
                  <button 
                    onClick={() => handleGetStarted(selectedPlan)}
                    className="py-3 px-8 text-black bg-white rounded-lg hover:bg-gray-100 transition-all duration-300 font-semibold group"
                  >
                    <span className="flex items-center">
                      Get Started
                      <svg className="w-5 h-5 ml-2 transform transition-transform duration-500 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 