'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const services = [
  {
    id: 1,
    title: 'Web Development',
    description: 'AI-Specialized web solutions leveraging advanced Machine Learning algorithms for intelligent, adaptive, and future-ready digital experiences.',
    skills: [
      'AI-Powered Development with GitHub Copilot',
      'Advanced ML Model Integration',
      'AI-Driven Testing & Performance Optimization',
      'Neural Network Analytics & User Behavior Prediction'
    ],
    subFeatures: [
      {
        title: 'AI Integration',
        items: ['Automated Code Generation', 'Smart Error Detection', 'Predictive Performance Analysis']
      },
      {
        title: 'Smart Features',
        items: ['User Behavior Learning', 'Dynamic Content Adaptation', 'Intelligent Caching']
      }
    ],
    color: 'from-blue-500/30 to-blue-600/30',
    accent: 'border-blue-400/50',
    bgAccent: 'bg-blue-500/5'
  },
  {
    id: 2,
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
        items: ['Smart SEO Optimization', 'Auto-Generated Meta Tags', 'Content Performance Analysis']
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
    id: 3,
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
    id: 4,
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
    color: 'from-red-500/30 to-red-600/30',
    accent: 'border-red-400/50',
    bgAccent: 'bg-red-500/5'
  },
  {
    id: 5,
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
    color: 'from-indigo-500/30 to-indigo-600/30',
    accent: 'border-indigo-400/50',
    bgAccent: 'bg-indigo-500/5'
  },
  {
    id: 7,
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

export default function WelcomeScreen({ onComplete }: { onComplete: () => void }) {
  const [currentSlide, setCurrentSlide] = useState(-1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleNext = () => {
    if (currentSlide === services.length - 1) {
      onComplete();
    } else {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentSlide === -1) {
      return;
    }
    setCurrentSlide(prev => prev - 1);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Dynamic background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main frosted background */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
        
        {/* Animated gradient orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
        </div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-float"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 5}s`
              }}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {currentSlide === -1 ? (
          // Welcome Screen
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative max-w-4xl w-full mx-4"
          >
            <div className="bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-md rounded-2xl border border-white/10 p-8 sm:p-12 overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-full h-full bg-grid-white/5 bg-grid-16" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-emerald-500/10" />
              </div>

              <div className="relative z-10">
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.h1 
                    className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400"
                    animate={{
                      textShadow: [
                        "0 0 20px rgba(56, 189, 248, 0.5)",
                        "0 0 35px rgba(168, 85, 247, 0.5)",
                        "0 0 20px rgba(16, 185, 129, 0.5)"
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    Welcome to NEX-WEBS
                  </motion.h1>
                  <div className="relative">
                    <motion.span
                      className="text-2xl sm:text-3xl text-white mb-4 max-w-2xl mx-auto font-semibold relative"
                      style={{}}
                      animate={{
                        textShadow: [
                          "0 0 25px rgba(147, 51, 234, 0.7)",
                          "0 0 45px rgba(147, 51, 234, 0.5)",
                          "0 0 25px rgba(147, 51, 234, 0.7)"
                        ]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    >
                      AI is the Future
                    </motion.span>
                    <span>, and We're Here to Build It Together</span>
                    <motion.div
                      className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 rounded-lg blur-lg"
                      animate={{
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{
                        duration: 2,
                      }}
                    />
                  </div>
                  <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                    Transform your digital presence with our 
                    <span className="text-purple-400 font-semibold"> cutting-edge AI solutions </span>
                    and innovative web technologies
                  </p>
                  <motion.button
                    onClick={handleNext}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group px-8 py-4 bg-gradient-to-r from-blue-500/80 via-purple-500/80 to-emerald-500/80 rounded-xl text-white font-semibold
                             hover:from-blue-600/80 hover:via-purple-600/80 hover:to-emerald-600/80 transition-all duration-300
                             backdrop-blur-sm border border-white/10 relative overflow-hidden shadow-lg shadow-purple-500/20"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Explore Our Services
                      <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                    <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ) : (
          // Service Slides
          <motion.div
            key={`service-${currentSlide}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              mass: 1
            }}
            className="relative max-w-4xl w-full mx-4 mt-16 sm:mt-20 transform-gpu"
          >
            <div className={`bg-gradient-to-br ${services[currentSlide].color} backdrop-blur-md rounded-xl sm:rounded-2xl 
                           border ${services[currentSlide].accent} p-3 sm:p-6 md:p-8 relative overflow-hidden`}>
              {/* Background patterns */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-grid-white/5 bg-grid-16" />
                <div className={`absolute inset-0 ${services[currentSlide].bgAccent} opacity-30`} />
              </div>

              <div className="relative z-10">
                <h3 className="text-lg sm:text-2xl md:text-3xl font-bold mb-2 text-white/90 drop-shadow-lg">
                  {services[currentSlide].id}. {services[currentSlide].title}
                </h3>
                <p className="text-xs sm:text-base text-white/85 mb-3 sm:mb-6 max-w-3xl drop-shadow">
                  {services[currentSlide].description}
                </p>

                {/* AI Features Section - Highlighted */}
                <div className="bg-black/30 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-4 md:p-6 mb-2 sm:mb-4 border border-purple-500/30
                             relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 
                               opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <motion.h4 
                    className="text-sm sm:text-lg font-semibold mb-2 sm:mb-3 text-white/90 drop-shadow flex items-center gap-2"
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
                      className="text-purple-400 bg-purple-500/10 px-2 py-1 rounded-lg border border-purple-500/30"
                      animate={{
                        scale: [1, 1.05, 1],
                        borderColor: ["rgba(147, 51, 234, 0.3)", "rgba(147, 51, 234, 0.5)", "rgba(147, 51, 234, 0.3)"]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    >
                      AI
                    </motion.span> 
                    Key Features:
                    <span className="text-xs sm:text-sm text-purple-400 font-normal bg-purple-500/10 px-2 py-1 rounded-lg">
                      Powered by Machine Learning
                    </span>
                  </motion.h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-3">
                    {services[currentSlide].skills.map((skill, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 100,
                          damping: 20,
                          delay: index * 0.1
                        }}
                        className="flex items-start text-xs sm:text-base group/item transform-gpu"
                      >
                        <div className="w-5 h-5 sm:w-7 sm:h-7 mr-2 sm:mr-3 mt-0.5 rounded-lg bg-purple-500/20 flex items-center justify-center
                                    group-hover/item:bg-purple-500/30 transition-colors duration-300 flex-shrink-0">
                          <svg
                            className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <span className="text-white/85 group-hover/item:text-purple-200 transition-colors duration-300 drop-shadow">
                          {skill}
                        </span>
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
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 100,
                          damping: 20,
                          delay: 0.3 + index * 0.1
                        }}
                        className="bg-purple-500/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-4 
                                 border border-purple-500/20 hover:border-purple-500/30
                                 hover:bg-purple-500/20 transition-all duration-300 transform-gpu"
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

                {/* Navigation Controls - Mobile Optimized */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 mt-2 sm:mt-0">
                  <div className="flex gap-2 sm:gap-3 items-center order-2 sm:order-1 w-full sm:w-auto">
                    <button
                      onClick={handleBack}
                      className="group px-2 sm:px-3 py-1 sm:py-1.5 bg-white/10 backdrop-blur-sm rounded-lg text-white/80 text-xs sm:text-sm font-medium
                               border border-white/10 hover:bg-white/20 transform hover:scale-105 
                               transition-all duration-300 flex items-center gap-1 sm:gap-2 flex-1 sm:flex-none justify-center"
                    >
                      ← Back
                    </button>
                    <span className="text-[10px] sm:text-xs text-white/70">
                      {currentSlide + 1} of {services.length}
                    </span>
                  </div>
                  <button
                    onClick={handleNext}
                    className={`group px-3 sm:px-4 py-1.5 sm:py-2 backdrop-blur-sm rounded-lg text-white text-xs sm:text-sm font-semibold
                             border hover:scale-105 w-full sm:w-auto transition-all duration-300 
                             relative overflow-hidden order-1 sm:order-2
                             ${currentSlide === services.length - 1 
                               ? 'bg-gradient-to-r from-purple-500/80 via-blue-500/80 to-emerald-500/80 border-purple-500/30 shadow-lg shadow-purple-500/20' 
                               : 'bg-white/10 border-white/20 hover:bg-white/20'}`}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-1 sm:gap-2">
                      {currentSlide === services.length - 1 ? 'Get Started ✨' : 'Next →'}
                    </span>
                    {currentSlide === services.length - 1 && (
                      <>
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
                        {/* Glowing effect - Optimized animation */}
                        <motion.div
                          initial={{ opacity: 0.3 }}
                          animate={{ opacity: [0.3, 0.6, 0.3] }}
                          transition={{
                            duration: 2,
                            ease: "easeInOut",
                            repeat: Infinity,
                            repeatType: "reverse"
                          }}
                          className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-emerald-500/20 blur-lg transform-gpu"
                        />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 