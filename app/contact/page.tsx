'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaLinkedin, FaGithub, FaTwitter, FaWhatsapp, FaClock, FaGlobe, FaCode, FaPalette, FaRocket, FaMobile, FaWordpress, FaShoppingCart } from 'react-icons/fa';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { PlanReview } from '../components/ReviewsDrawer';
import { carouselReviews, planReviews, Review } from '../components/ReviewsData';

// Add glowing dots component
const GlowingDot = ({ className = "", size = "small" }) => (
  <div className={`absolute ${size === "small" ? "w-1.5 h-1.5" : "w-2 h-2"} bg-white rounded-full animate-pulse ${className}`}>
    <div className="absolute inset-0 bg-white/50 rounded-full animate-ping"></div>
  </div>
);

const expertiseAreas = [
  {
    icon: <FaCode className="w-6 h-6" />,
    title: "Custom Development",
    description: "Full-stack development with modern technologies and best practices"
  },
  {
    icon: <FaWordpress className="w-6 h-6" />,
    title: "WordPress Solutions",
    description: "Custom themes, plugins, and optimized WordPress development"
  },
  {
    icon: <FaShoppingCart className="w-6 h-6" />,
    title: "E-commerce",
    description: "Shopify and WooCommerce solutions for online stores"
  },
  {
    icon: <FaMobile className="w-6 h-6" />,
    title: "Responsive Design",
    description: "Mobile-first approach ensuring perfect display on all devices"
  },
  {
    icon: <FaPalette className="w-6 h-6" />,
    title: "UI/UX Design",
    description: "Beautiful and intuitive user interfaces with great user experience"
  },
  {
    icon: <FaRocket className="w-6 h-6" />,
    title: "Performance",
    description: "Optimized for speed, SEO, and conversion rates"
  }
];

const testimonials = [
  {
    name: "AHMAD JAVEED",
    role: "CEO, Tech Solutions",
    content: "Exceptional web development service! The attention to detail and professional approach exceeded our expectations.",
    image: "/testimonials/john.jpg"
  },
  {
    name: "SAIMA KHAN",
    role: "Marketing Director",
    content: "The WordPress website they built for us is both beautiful and functional. Highly recommended!",
    image: "/testimonials/sarah.jpg"
  },
  {
    name: "FAIZAN KHAN",
    role: "E-commerce Manager",
    content: "Our Shopify store's conversion rate improved significantly after their optimization work.",
    image: "/testimonials/mike.jpg"
  }
];

interface Package {
  name: string;
  price: string;
  features: string[];
  hasDiscount: boolean;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  timeline: string;
  details: string;
  projectType: string;
  budget: string;
  requirements: string[];
  existingWebsite: string;
  competitors: string;
  targetAudience: string;
  projectGoals: string;
  designPreferences: string;
  contentCreation: string;
  technicalPreferences: string[];
  businessIndustry: string;
  maintenanceNeeds: string;
  seoRequirements: string;
  securityRequirements: string[];
  performanceExpectations: string;
  launchTimeframe: string;
  userConsent: boolean;
}

const exchangeRates = {
  PKR: 1,      // Base currency
  USD: 0.0036, // 1 PKR = 0.0036 USD (1 USD = ~278 PKR)
  INR: 0.30,   // 1 PKR = 0.30 INR (1 INR = ~3.33 PKR)
  GBP: 0.0028, // 1 PKR = 0.0028 GBP (1 GBP = ~357 PKR)
  AED: 0.013   // 1 PKR = 0.013 AED (1 AED = ~77 PKR)
};

const currencySymbols = {
  PKR: 'Rs',
  USD: '$',
  INR: '₹',
  GBP: '£',
  AED: 'د.إ'
};

const packages: Package[] = [
  {
    name: "MODERN AI BASED SAAS PRODUCT",
    price: "93500",
    features: [
      "Enterprise AI Model Integration",
      "Advanced SaaS Architecture",
      "Real-time Data Processing",
      "Predictive Analytics Engine",
      "Scalable Cloud Infrastructure",
      "Enterprise API Development",
      "Machine Learning Pipeline",
      "Automated Business Workflows",
      "Multi-tenant Architecture",
      "Advanced Security Protocols",
      "Custom AI Solutions",
      "Business Intelligence Tools",
      "Performance Monitoring",
      "Automated Scaling",
      "24/7 Premium Support"
    ],
    hasDiscount: true
  },
  {
    name: "WordPress Basic",
    price: "38500",
    features: [
      "Complete Website Development",
      "Mobile-First Responsive Design",
      "Essential Premium Plugins",
      "Speed & Performance Optimization",
      "Basic SEO Implementation"
    ],
    hasDiscount: true
  },
  {
    name: "WordPress Professional",
    price: "49500",
    features: [
      "Premium Theme & Elementor Pro",
      "Advanced Performance",
      "Comprehensive SEO",
      "Expert Author Profiles",
      "Advanced Analytics"
    ],
    hasDiscount: true
  },
  {
    name: "WordPress Enterprise",
    price: "71500",
    features: [
      "Unlimited Pages Development",
      "Premium Theme Access",
      "Enterprise SEO Suite",
      "Multi-language Support",
      "Advanced Security"
    ],
    hasDiscount: true
  },
  {
    name: "WordPress E-commerce",
    price: "280000",
    features: [
      "Complete WooCommerce Setup",
      "AI-Powered Product Recommendations",
      "40-60% Sales Growth Potential",
      "Automated Inventory Management",
      "Conversion Rate Optimization",
      "Mobile-Optimized Checkout",
      "6 Months Premium Support"
    ],
    hasDiscount: true
  },
  {
    name: "Shopify Store",
    price: "252000",
    features: [
      "Complete Shopify Store Setup",
      "AI-Driven Sales Optimization",
      "40-60% Sales Growth Potential",
      "Mobile-First Design",
      "Cross-Selling & Upselling Features",
      "Automated Inventory Management",
      "6 Months Premium Support"
    ],
    hasDiscount: true
  },
  {
    name: "Full-Stack Basic",
    price: "60500",
    features: [
      "Modern React/Next.js Frontend",
      "Node.js Backend",
      "MongoDB Database",
      "Basic User Authentication",
      "Essential API Endpoints"
    ],
    hasDiscount: true
  },
  {
    name: "Full-Stack Professional",
    price: "82500",
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
    hasDiscount: true
  },
  {
    name: "Full-Stack Enterprise",
    price: "104500",
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
    ],
    hasDiscount: true
  },
  {
    name: "AI Agents/WebApps",
    price: "93500",
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
    hasDiscount: true
  },
  {
    name: "UI/UX Design",
    price: "55000",
    features: [
      "Custom UI Design",
      "Interactive Prototypes",
      "Design System Creation",
      "Responsive Layouts",
      "User Flow Mapping",
      "Wireframe Development",
      "Animation & Interactions",
      "Design Handoff",
      "Style Guide",
      "Design Documentation"
    ],
    hasDiscount: true
  }
];

// Add these animation variants near the top of the file
const fadeInScale = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

// Add the Confetti component
const Confetti = () => {
  const confettiColors = ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0'];
  const particles = Array.from({ length: 50 });

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((_, index) => (
        <motion.div
          key={index}
          initial={{
            opacity: 1,
            scale: 0,
            x: Math.random() * window.innerWidth,
            y: -20,
            rotate: Math.random() * 360
          }}
          animate={{
            opacity: 0,
            scale: 1,
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 20,
            rotate: Math.random() * 360
          }}
          transition={{
            duration: Math.random() * 2 + 1,
            ease: "easeOut",
            delay: Math.random() * 0.5
          }}
          className="absolute w-2 h-2"
          style={{
            backgroundColor: confettiColors[Math.floor(Math.random() * confettiColors.length)],
            borderRadius: Math.random() > 0.5 ? '50%' : '0%',
          }}
        />
      ))}
    </div>
  );
};

const SuccessMessage = ({ message, onClose }: { message: string; onClose: () => void }) => {
  const [showConfetti, setShowConfetti] = React.useState(false);

  React.useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-50 px-4 sm:px-0 backdrop-blur-sm bg-black/20"
    >
      {showConfetti && <Confetti />}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 200, 
          damping: 20,
          duration: 0.6 
        }}
        className="bg-emerald-950/90 text-white px-8 py-6 rounded-xl shadow-xl border border-emerald-800 
          flex flex-col items-center space-y-4 w-[90%] sm:w-auto min-w-[320px] max-w-[90vw] sm:max-w-md mx-auto relative
          backdrop-blur-xl"
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-emerald-500/5 to-emerald-400/10 rounded-xl"></div>
        <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-500/20 to-emerald-400/20 blur-xl opacity-50 rounded-xl"></div>
        
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-emerald-400/80 hover:text-emerald-300 transition-colors"
        >
          <motion.svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </motion.svg>
        </button>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay: 0.1
          }}
          className="relative"
        >
          <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl"></div>
          <motion.div 
            className="relative bg-gradient-to-br from-emerald-500/20 to-emerald-400/20 rounded-full p-3 border border-emerald-400/30
              shadow-lg shadow-emerald-500/20"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <motion.svg 
              className="w-8 h-8 text-emerald-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </motion.svg>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center space-y-2 relative z-10"
        >
          <motion.h3 
            className="text-xl font-semibold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Message Sent Successfully
          </motion.h3>
          <motion.p 
            className="text-emerald-200/90 text-sm"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {message}
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="w-full pt-2 relative z-10"
        >
          <div className="h-1 w-full bg-emerald-900/50 rounded-full overflow-hidden backdrop-blur-sm">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// Add the ReviewFormModal component before the ContactPageContent function
const ReviewFormModal = ({ isOpen, onClose, onSubmit }: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSubmit: (review: Partial<PlanReview>) => void;
}) => {
  const [reviewData, setReviewData] = useState<Partial<PlanReview>>({
    author: '',
    role: '',
    company: '',
    country: '',
    rating: 5,
    text: '',
    planTitle: '',
    projectType: '',
    date: new Date().toISOString().split('T')[0],
    successMetrics: [{ label: '', value: '' }]
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const totalSteps = 3;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setReviewData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rating: number) => {
    setReviewData(prev => ({ ...prev, rating }));
  };

  const handleSuccessMetricChange = (index: number, field: 'label' | 'value', value: string) => {
    setReviewData(prev => {
      const metrics = [...(prev.successMetrics || [])];
      if (!metrics[index]) {
        metrics[index] = { label: '', value: '' };
      }
      metrics[index][field] = value;
      return { ...prev, successMetrics: metrics };
    });
  };

  const addSuccessMetric = () => {
    setReviewData(prev => ({
      ...prev,
      successMetrics: [...(prev.successMetrics || []), { label: '', value: '' }]
    }));
  };

  const removeSuccessMetric = (index: number) => {
    setReviewData(prev => {
      const metrics = [...(prev.successMetrics || [])];
      metrics.splice(index, 1);
      return { ...prev, successMetrics: metrics };
    });
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    // Generate a unique ID for the review
    const reviewWithId = {
      ...reviewData,
      id: `review-${Date.now()}`,
      isVerified: true // Auto-verify for now
    };
    
    // Show animation for 1.5 seconds before closing
    setTimeout(() => {
      onSubmit(reviewWithId);
      setTimeout(() => {
        onClose();
        setFormSubmitted(false);
        setCurrentStep(1);
      }, 500);
    }, 1500);
  };

  // Check if a step is valid
  const isStepValid = (step: number): boolean => {
    switch(step) {
      case 1:
        return !!reviewData.author && !!reviewData.role;
      case 2:
        return !!reviewData.planTitle && !!reviewData.rating;
      case 3:
        return !!reviewData.text;
      default:
        return false;
    }
  };

  // Determine if next button should be disabled
  const isNextDisabled = !isStepValid(currentStep);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-50 px-4 sm:px-0 backdrop-blur-md bg-black/70"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {formSubmitted ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-zinc-900/95 text-white p-8 rounded-xl shadow-2xl border border-green-500/40 
            max-w-md w-full relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-purple-500/10 to-green-500/10 opacity-50"></div>
          
          <div className="relative z-10 flex flex-col items-center justify-center text-center py-12">
            {/* Success animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500/20 to-green-400/20 
                flex items-center justify-center mb-8 border border-green-500/30"
            >
              <motion.svg 
                className="w-12 h-12 text-green-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              >
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </motion.svg>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold mb-3 text-white"
            >
              Thank You!
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-green-300 mb-4"
            >
              Your review has been submitted successfully
            </motion.p>
            
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5 }}
              className="h-1 bg-green-500/50 rounded-full w-full max-w-xs mt-4"
            />
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="bg-zinc-900/95 text-white p-5 md:p-8 rounded-xl shadow-2xl border border-purple-500/30 
            w-[95%] max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Decorative elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-purple-500/5 to-purple-400/5 rounded-xl"></div>
          <div className="absolute -inset-0.5 bg-gradient-to-br from-purple-500/10 to-purple-400/10 blur-xl opacity-30 rounded-xl"></div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-purple-300 hover:text-white transition-colors z-10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
              Share Your Experience
            </h2>
            
            {/* Progress indicator */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                {Array.from({ length: totalSteps }).map((_, index) => (
                  <motion.div 
                    key={index}
                    className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full text-sm md:text-base font-medium z-10
                      ${index + 1 === currentStep 
                        ? 'bg-purple-600 text-white' 
                        : index + 1 < currentStep 
                          ? 'bg-green-600 text-white' 
                          : 'bg-zinc-800 text-gray-400'}`}
                    initial={false}
                    animate={index + 1 === currentStep ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {index + 1 < currentStep ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </motion.div>
                ))}
                
                {/* Connecting lines */}
                <div className="absolute left-0 right-0 flex justify-between h-0.5">
                  {Array.from({ length: totalSteps - 1 }).map((_, index) => (
                    <motion.div 
                      key={index}
                      className="h-0.5 bg-zinc-700 flex-1 mx-4"
                      initial={false}
                      animate={{
                        backgroundColor: index + 1 < currentStep ? '#16a34a' : '#3f3f46'
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-between px-1 text-xs text-gray-400">
                <span>Basic Info</span>
                <span>Project Details</span>
                <span>Your Review</span>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-5"
                  >
                    <h3 className="text-xl font-medium text-purple-300 mb-4">Basic Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-purple-200">Your Name*</label>
                        <input
                          type="text"
                          name="author"
                          value={reviewData.author}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-purple-200">Your Role/Position*</label>
                        <input
                          type="text"
                          name="role"
                          value={reviewData.role}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                          required
                          placeholder="e.g. Marketing Director"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-purple-200">Company/Organization</label>
                        <input
                          type="text"
                          name="company"
                          value={reviewData.company || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                          placeholder="e.g. Acme Corp"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-purple-200">Country</label>
                        <input
                          type="text"
                          name="country"
                          value={reviewData.country || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                          placeholder="e.g. Pakistan"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-5"
                  >
                    <h3 className="text-xl font-medium text-purple-300 mb-4">Project Details</h3>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1 text-purple-200">Which package did you use?*</label>
                      <select
                        name="planTitle"
                        value={reviewData.planTitle}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 text-sm rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      >
                        <option value="">Select a package</option>
                        <option value="WordPress Basic">WordPress Basic</option>
                        <option value="WordPress Professional">WordPress Professional</option>
                        <option value="WordPress Enterprise">WordPress Enterprise</option>
                        <option value="WordPress E-commerce">WordPress E-commerce</option>
                        <option value="Shopify Store">Shopify Store</option>
                        <option value="Full-Stack Basic">Full-Stack Basic</option>
                        <option value="Full-Stack Professional">Full-Stack Professional</option>
                        <option value="Full-Stack Enterprise">Full-Stack Enterprise</option>
                        <option value="AI Agents/WebApps">AI Agents/WebApps</option>
                        <option value="SEO/Content Writing">SEO/Content Writing</option>
                        <option value="UI/UX Design">UI/UX Design</option>
                        <option value="Mobile App Development">Mobile App Development</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1 text-purple-200">Project Type</label>
                      <input
                        type="text"
                        name="projectType"
                        value={reviewData.projectType || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                        placeholder="e.g. E-commerce Website, Corporate Site, Blog"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-purple-200">Your Rating*</label>
                      <div className="flex items-center space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleRatingChange(star)}
                            className="text-2xl focus:outline-none transition-transform hover:scale-110"
                          >
                            <motion.span 
                              className={star <= reviewData.rating! ? "text-yellow-400" : "text-gray-400"}
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                              animate={star <= reviewData.rating! ? { 
                                scale: [1, 1.2, 1],
                                rotate: [0, 5, 0, -5, 0],
                                transition: { duration: 0.5 }
                              } : {}}
                            >
                              ★
                            </motion.span>
                          </button>
                        ))}
                        <span className="ml-2 text-sm text-gray-400">
                          {reviewData.rating} out of 5 stars
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-5"
                  >
                    <h3 className="text-xl font-medium text-purple-300 mb-4">Your Review</h3>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1 text-purple-200">Your Review*</label>
                      <textarea
                        name="text"
                        value={reviewData.text}
                        onChange={handleInputChange}
                        rows={4}
                        required
                        className="w-full px-3 py-2 text-sm rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                        placeholder="Please share your experience working with us. What did you like? Was there anything we could improve?"
                      ></textarea>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="block text-sm font-medium text-purple-200">Success Metrics (Optional)</label>
                        <button 
                          type="button"
                          onClick={addSuccessMetric}
                          className="text-xs bg-purple-700/50 text-purple-200 px-2 py-1 rounded-md hover:bg-purple-700/70 transition-colors flex items-center gap-1"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Add Metric
                        </button>
                      </div>
                      
                      <p className="text-xs text-gray-400">What measurable improvements did you see after working with us?</p>
                      
                      {reviewData.successMetrics?.map((metric, index) => (
                        <motion.div 
                          key={index} 
                          className="grid grid-cols-5 gap-2 items-center"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="col-span-2">
                            <input
                              type="text"
                              value={metric.label}
                              onChange={(e) => handleSuccessMetricChange(index, 'label', e.target.value)}
                              className="w-full px-3 py-2 text-xs rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                              placeholder="e.g. Conversion Rate"
                            />
                          </div>
                          <div className="col-span-2">
                            <input
                              type="text"
                              value={metric.value}
                              onChange={(e) => handleSuccessMetricChange(index, 'value', e.target.value)}
                              className="w-full px-3 py-2 text-xs rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                              placeholder="e.g. +30%"
                            />
                          </div>
                          <button 
                            type="button"
                            onClick={() => removeSuccessMetric(index)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pt-4 mt-4 border-t border-zinc-800 flex justify-between">
                {currentStep > 1 ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={prevStep}
                    className="bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-2.5 px-5 rounded-lg transition-all flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </motion.button>
                ) : <div></div>}
                
                {currentStep < totalSteps ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={nextStep}
                    disabled={isNextDisabled}
                    className={`${isNextDisabled ? 'bg-zinc-700 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'} 
                      text-white font-medium py-2.5 px-5 rounded-lg transition-all flex items-center gap-1`}
                  >
                    Next
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={!isStepValid(currentStep)}
                    className={`${!isStepValid(currentStep) ? 'bg-zinc-700 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900'} 
                      text-white font-medium py-2.5 px-6 rounded-lg transition-all shadow-lg shadow-purple-900/30`}
                  >
                    Submit Review
                  </motion.button>
                )}
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

function ContactPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedTimeline, setSelectedTimeline] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('');
  const [isInternational, setIsInternational] = useState(false);
  const [currencyLocked, setCurrencyLocked] = useState(false);
  const [exchangeRate, setExchangeRate] = useState<number>(1);
  const [adjustedPrice, setAdjustedPrice] = useState('');
  const [showDiscountBanner, setShowDiscountBanner] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    timeline: '',
    details: '',
    projectType: '',
    budget: '',
    requirements: [] as string[],
    existingWebsite: '',
    competitors: '',
    targetAudience: '',
    projectGoals: '',
    designPreferences: '',
    contentCreation: '',
    technicalPreferences: [] as string[],
    businessIndustry: '',
    maintenanceNeeds: '',
    seoRequirements: '',
    securityRequirements: [] as string[],
    performanceExpectations: '',
    launchTimeframe: '',
    userConsent: false
  });
  const [charCount, setCharCount] = useState(0);
  const MAX_CHARS = 200;
  // Add state for requirements panel visibility
  const [showRequirementsPanel, setShowRequirementsPanel] = useState(false);
  
  // Toggle requirements panel visibility
  const toggleRequirementsPanel = () => {
    setShowRequirementsPanel(prev => !prev);
  };

  // Add these new states for review functionality
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviews, setReviews] = useState<PlanReview[]>([...planReviews]);
  
  // Add this function to handle submitting a review
  const handleReviewSubmit = async (newReview: Partial<PlanReview>) => {
    try {
      setIsLoading(true);
      
      // Submit the review to the API
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newReview),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Add the new review to the local state
        setReviews(prevReviews => [result.review, ...prevReviews]);
        
        // Show success message
        setSuccessMessage('Thank you! Your review has been submitted successfully.');
        
        // Close the review modal
        setIsReviewModalOpen(false);
      } else {
        setErrorMessage(result.message || 'Failed to submit review. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setErrorMessage('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Get user's country code (you can use a geolocation service here)
    // For now, we'll assume any non-PKR selection means international
    const plan = searchParams?.get('plan');
    const currency = searchParams?.get('currency');
    
    if (currency) {
      setSelectedCurrency(currency);
      setCurrencyLocked(true);
      setIsInternational(currency !== 'PKR');
    } else {
      // Default to PKR for local users, USD for international
      setSelectedCurrency('PKR');
      setIsInternational(false);
    }

    if (plan) {
      const selectedPackage = packages.find(p => p.name === decodeURIComponent(plan));
      setSelectedPlan(plan);
      setFormData(prev => ({
        ...prev,
        details: `I'm interested in the ${plan} package.`
      }));
      
      setShowDiscountBanner(selectedPackage?.hasDiscount ?? false);
    }
  }, [searchParams]);

  const handleCurrencyChange = (currency: string) => {
    if (!currencyLocked) {
      setSelectedCurrency(currency);
      setIsInternational(currency !== 'PKR');
      setExchangeRate(exchangeRates[currency as keyof typeof exchangeRates]);
    }
  };

  const calculatePrice = (basePrice: number, timeline: string, currency: string): { 
    finalPrice: number;
    rushFee?: number;
    discount?: number;
    internationalFee?: number;
    internationalDiscount?: number;
    pkrDiscount?: number;
  } => {
    const rate = exchangeRates[currency as keyof typeof exchangeRates];
    let priceInForeignCurrency = basePrice * rate;
    
    // Calculate timeline adjustments first
    let rushFee: number | undefined;
    let discount: number | undefined;
    let internationalFee: number | undefined;
    let internationalDiscount: number | undefined;
    let pkrDiscount: number | undefined;
    
    // Apply timeline adjustments to base price
    if (timeline === 'urgent') {
      rushFee = priceInForeignCurrency * 0.2; // 20% rush fee
      priceInForeignCurrency += rushFee;
    } else if (timeline === 'relaxed') {
      discount = priceInForeignCurrency * 0.05; // 5% discount
      priceInForeignCurrency -= discount;
    }
    
    // Apply PKR discount or international fees
    if (currency === 'PKR') {
      pkrDiscount = priceInForeignCurrency * 0.2; // 20% PKR discount
      priceInForeignCurrency -= pkrDiscount;
    } else {
      internationalFee = priceInForeignCurrency * 0.1; // 10% international fee
      internationalDiscount = priceInForeignCurrency * 0.2; // 20% international discount
      priceInForeignCurrency = priceInForeignCurrency + internationalFee - internationalDiscount;
    }
    
    return {
      finalPrice: Number(priceInForeignCurrency.toFixed(2)),
      rushFee: rushFee ? Number(rushFee.toFixed(2)) : undefined,
      discount: discount ? Number(discount.toFixed(2)) : undefined,
      internationalFee: internationalFee ? Number(internationalFee.toFixed(2)) : undefined,
      internationalDiscount: internationalDiscount ? Number(internationalDiscount.toFixed(2)) : undefined,
      pkrDiscount: pkrDiscount ? Number(pkrDiscount.toFixed(2)) : undefined
    };
  };

  const formatPrice = (price: number, currency: string): string => {
    const symbol = currencySymbols[currency as keyof typeof currencySymbols];
    return `${symbol}${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleTimelineChange = (timeline: string) => {
    setSelectedTimeline(timeline);
    setFormData(prev => ({ ...prev, timeline }));
    
    if (selectedPlan) {
      const selectedPackage = packages.find(p => p.name === selectedPlan);
      if (selectedPackage?.price) {
        const basePrice = parseInt(selectedPackage.price);
        const priceDetails = calculatePrice(basePrice, timeline, selectedCurrency);
        setAdjustedPrice(priceDetails.finalPrice.toString());
      }
    }
  };

  // Add handler for requirements checkbox selection
  const handleRequirementChange = (requirement: string) => {
    setFormData((prev: FormData) => {
      const newRequirements = prev.requirements.includes(requirement)
        ? prev.requirements.filter(req => req !== requirement)
        : [...prev.requirements, requirement];
      
      return {
        ...prev,
        requirements: newRequirements
      };
    });
  };

  // Add handler for technical preferences checkbox selection
  const handleTechnicalPreferenceChange = (preference: string) => {
    setFormData((prev: FormData) => {
      const newPreferences = prev.technicalPreferences.includes(preference)
        ? prev.technicalPreferences.filter(pref => pref !== preference)
        : [...prev.technicalPreferences, preference];
      
      return {
        ...prev,
        technicalPreferences: newPreferences
      };
    });
  };

  // Add handler for security requirements checkbox selection
  const handleSecurityRequirementChange = (requirement: string) => {
    setFormData((prev: FormData) => {
      const newRequirements = prev.securityRequirements.includes(requirement)
        ? prev.securityRequirements.filter(req => req !== requirement)
        : [...prev.securityRequirements, requirement];
      
      return {
        ...prev,
        securityRequirements: newRequirements
      };
    });
  };

  // Add handler for consent toggle
  const handleConsentToggle = () => {
    setFormData((prev: FormData) => ({
      ...prev,
      userConsent: !prev.userConsent
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setSuccessMessage('');
    setErrorMessage('');
    
    if (!formData.name || !formData.email || !formData.timeline) {
      setErrorMessage('Please fill in all required fields');
      return;
    }

    if (!formData.userConsent) {
      setErrorMessage('Please provide your consent to submit the form');
      return;
    }

    try {
      setIsLoading(true);

      const selectedPackage = packages.find(p => p.name === selectedPlan);
      const basePrice = selectedPackage ? parseInt(selectedPackage.price) : 0;
      
      // Calculate all price components
      const priceDetails = calculatePrice(basePrice, formData.timeline, selectedCurrency);

      const payload = {
        ...formData,
        selectedPlan: selectedPlan || '',
        currency: selectedCurrency,
        exchangeRate: exchangeRates[selectedCurrency as keyof typeof exchangeRates],
        basePrice,
        finalPrice: priceDetails.finalPrice,
        rushFee: priceDetails.rushFee,
        discount: priceDetails.discount,
        internationalFee: priceDetails.internationalFee,
        internationalDiscount: priceDetails.internationalDiscount
      };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        setSuccessMessage('We will get back to you within 24 hours! 🚀');
        setFormData({
          name: '',
          email: '',
          phone: '',
          address: '',
          timeline: '',
          details: '',
          projectType: '',
          budget: '',
          requirements: [],
          existingWebsite: '',
          competitors: '',
          targetAudience: '',
          projectGoals: '',
          designPreferences: '',
          contentCreation: '',
          technicalPreferences: [],
          businessIndustry: '',
          maintenanceNeeds: '',
          seoRequirements: '',
          securityRequirements: [],
          performanceExpectations: '',
          launchTimeframe: '',
          userConsent: false
        });
        setSelectedPlan(null);
        setSelectedTimeline('');
        setAdjustedPrice('');
        setShowRequirementsPanel(false);
      } else {
        setErrorMessage(result.message || 'Failed to send message. Please try again later.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <main className="min-h-screen bg-black text-white overflow-hidden">
        {/* Back Button - Add this at the top of the main content */}
        <div className="fixed top-32 md:top-36 left-4 md:left-8 z-50">
          <button 
            onClick={() => router.push('/pricing')}
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
            <span className="text-sm font-medium">Back to Pricing</span>
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-24 relative">
          {/* Background Dots */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <GlowingDot className="top-20 left-10" size="large" />
            <GlowingDot className="top-40 right-20" />
            <GlowingDot className="bottom-40 left-1/4" size="large" />
            <GlowingDot className="top-1/2 right-1/3" />
            <GlowingDot className="bottom-20 right-10" size="large" />
            <GlowingDot className="top-1/3 left-1/3" />
            <GlowingDot className="bottom-1/3 right-1/4" size="large" />
            <GlowingDot className="top-3/4 left-20" />
            <GlowingDot className="top-1/4 right-1/4" />
            <GlowingDot className="bottom-1/2 left-1/2" size="large" />
            <GlowingDot className="top-10 right-1/2" />
            <GlowingDot className="bottom-3/4 right-3/4" size="large" />
            <GlowingDot className="top-2/3 left-10" />
            <GlowingDot className="bottom-1/4 right-20" size="large" />
          </div>

          {/* Enhanced Purple Glow Effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-96 bg-purple-600/20 blur-[100px] rounded-full pointer-events-none" />
          
          {/* Enhanced Header Section */}
          <div className="relative z-10 mb-16 pt-12">
            <div className="relative">
              {selectedPlan && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-gradient-to-r from-yellow-500 to-yellow-400 
                    text-black py-3 md:py-4 shadow-xl border-b-4 border-yellow-600 mb-6 md:mb-8 rounded-lg px-3 md:px-4
                    ${!showDiscountBanner ? 'hidden' : ''}`}
                >
                  <div className="container mx-auto text-center">
                    <div className="text-lg md:text-2xl font-black flex items-center justify-center gap-2 md:gap-4">
                      <span className="animate-bounce hidden md:inline">🎉</span>
                      EXCLUSIVE OFFER: 20% OFF
                      <span className="animate-bounce hidden md:inline">🎉</span>
                    </div>
                    <div className="text-sm md:text-lg font-bold mt-1">
                      Use Code: <span className="bg-black text-yellow-400 px-2 md:px-4 py-1 rounded-full">NEX-DEVS20%</span>
                    </div>
                  </div>
                </motion.div>
              )}
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-center mb-4 md:mb-6 text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
                Let's Work <span className="inline-block bg-white text-black px-3 py-1 rounded-md">Together</span>
              </h1>
              {selectedPlan && (
                <motion.div 
                  initial="initial"
                  animate="animate"
                  variants={fadeInScale}
                  className="flex flex-col items-center justify-center mb-6 md:mb-8 space-y-4"
                >
                  <div 
                    className="bg-gradient-to-r from-yellow-500/20 via-purple-500/30 to-yellow-500/20 backdrop-blur-md 
                      border-4 border-yellow-500/50 rounded-xl px-4 md:px-8 py-4 md:py-6 
                      shadow-[0_0_50px_-5px_rgba(234,179,8,0.5)] 
                      transform hover:scale-105 transition-transform duration-300 relative
                      animate-pulse w-full md:w-auto"
                  >
                    <div className="absolute -left-8 md:-left-12 top-1/2 transform -translate-y-1/2 text-2xl md:text-4xl animate-bounce">
                      🎁
                    </div>
                    <div className="absolute -right-8 md:-right-12 top-1/2 transform -translate-y-1/2 text-2xl md:text-4xl animate-bounce">
                      💰
                    </div>

                    <div className="text-center space-y-3 md:space-y-4">
                      <div className="text-yellow-300 text-sm md:text-lg font-bold uppercase tracking-wider">
                        Special Discount Package
                      </div>
                      <div className="text-xl md:text-3xl font-bold text-white flex items-center justify-center gap-2 md:gap-4">
                        <span className="text-2xl md:text-4xl animate-spin-slow">✨</span>
                        {selectedPlan}
                        <span className="text-2xl md:text-4xl animate-spin-slow">✨</span>
                      </div>
                      <div className="bg-yellow-400 text-black px-4 md:px-6 py-2 md:py-3 rounded-full font-black text-sm md:text-xl inline-block">
                        20% OFF - Use Code: NEX-DEVS20%
                      </div>
                    </div>
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex gap-2 items-center text-purple-300/80 text-xs md:text-sm"
                  >
                    <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    {!adjustedPrice ? (
                      "Scroll down to complete your project details"
                    ) : (
                      <span className="text-yellow-400 animate-pulse">
                        Don't forget to save your discount code!
                      </span>
                    )}
                  </motion.div>
                </motion.div>
              )}
              <p className="text-center text-gray-300 text-xl max-w-2xl mx-auto mt-6">
                Transform your digital presence with our expert web development services. 
                <span className="block mt-2">We're here to bring your vision to life.</span>
              </p>
            </div>
          </div>

          {/* Expertise Section with Smaller Boxes and Colors */}
          <section className="mb-20 relative z-10">
            <h2 className="text-3xl font-bold text-center mb-8">Our Expertise</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {expertiseAreas.map((area, index) => (
                <div 
                  key={index} 
                  className="group bg-gradient-to-br from-zinc-900/50 via-purple-900/10 to-zinc-900/50 p-6 rounded-lg backdrop-blur-sm 
                  border border-white/5 hover:border-purple-500/30 transition-all duration-500 
                  hover:-translate-y-2 hover:translate-x-1 hover:rotate-2
                  hover:shadow-lg hover:shadow-purple-500/10"
                >
                  <div className="text-purple-400 group-hover:text-purple-300 transition-colors mb-4 transform group-hover:rotate-12 duration-500">
                    {area.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white/90 group-hover:text-white">{area.title}</h3>
                  <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                    {area.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Enhanced Contact Grid with 3D hover effects */}
          <div className="grid md:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-16 px-4 md:px-0">
            <div className="contact-info bg-zinc-900/50 p-4 md:p-6 rounded-xl backdrop-blur-sm border border-white/5 
            hover:border-white/30 transition-all duration-500 
            transform perspective-1000 hover:scale-105 hover:rotate-1
            hover:shadow-lg hover:shadow-purple-500/20">
              <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-white">Contact Information</h2>
              <div className="space-y-4 md:space-y-6">
                {/* Primary Contact Info */}
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-start gap-2 md:gap-3">
                    <FaPhone className="text-purple-500 w-4 h-4 md:w-5 md:h-5 mt-1" />
                    <div>
                      <p className="text-sm md:text-base font-medium">Call Us</p>
                      <p className="text-xs md:text-sm">+92 329-2425-950</p>
                      <p className="text-xs text-gray-400">Mon-Fri, 8am-9pm EST</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 md:gap-3">
                    <FaWhatsapp className="text-purple-500 w-4 h-4 md:w-5 md:h-5 mt-1" />
                    <div>
                      <p className="text-sm md:text-base font-medium">WhatsApp</p>
                      <p className="text-xs md:text-sm">+92 329-2425-950</p>
                      <p className="text-xs text-gray-400">Available for quick chat</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 md:gap-3">
                    <FaEnvelope className="text-purple-500 w-4 h-4 md:w-5 md:h-5 mt-1" />
                    <div>
                      <p className="text-sm md:text-base font-medium">Email Us</p>
                      <p className="text-xs md:text-sm">nexwebs.org@gmail.com</p>
                      <p className="text-xs text-gray-400">24/7 support available</p>
                    </div>
                  </div>
                </div>

                {/* Location & Hours */}
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-start gap-2 md:gap-3">
                    <FaMapMarkerAlt className="text-purple-500 w-4 h-4 md:w-5 md:h-5 mt-1" />
                    <div>
                      <p className="text-sm md:text-base font-medium">Location</p>
                      <p className="text-xs md:text-sm">MULTAN ,MUX</p>
                      <p className="text-xs text-gray-400">NOT AVAILABE FOR REMORTE WORK YET!</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 md:gap-3">
                    <FaClock className="text-purple-500 w-4 h-4 md:w-5 md:h-5 mt-1" />
                    <div>
                      <p className="text-sm md:text-base font-medium">Business Hours</p>
                      <p className="text-xs md:text-sm">Monday - Friday</p>
                      <p className="text-xs text-gray-400">9:00 AM - 8:00 PM EST</p>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="pt-3 md:pt-4 border-t border-zinc-800">
                  <p className="text-sm md:text-base font-medium mb-2 md:mb-3">Connect With Us</p>
                  <div className="flex gap-3 md:gap-4">
                    <a href="#" className="text-purple-500 hover:text-purple-400 transition-colors">
                      <FaLinkedin className="w-5 h-5 md:w-6 md:h-6" />
                    </a>
                    <a href="#" className="text-purple-500 hover:text-purple-400 transition-colors">
                      <FaGithub className="w-5 h-5 md:w-6 md:h-6" />
                    </a>
                    <a href="#" className="text-purple-500 hover:text-purple-400 transition-colors">
                      <FaTwitter className="w-5 h-5 md:w-6 md:h-6" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Contact Form */}
            <div className="md:col-span-2 bg-zinc-900/50 p-4 md:p-6 rounded-xl backdrop-blur-sm border-2 border-yellow-500/30">
              <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-500/10 -mx-4 md:-mx-6 -mt-4 md:-mt-6 mb-4 md:mb-6 py-3 md:py-4 px-4 md:px-6 rounded-t-xl">
                <h3 className="text-base md:text-xl font-bold text-center">
                  <span className="text-yellow-400">🎯 20% Discount Applied</span>
                </h3>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                {/* Success Message */}
                {successMessage && (
                  <AnimatePresence>
                    <SuccessMessage message={successMessage} onClose={() => setSuccessMessage('')} />
                  </AnimatePresence>
                )}

                {/* Error Message */}
                {errorMessage && (
                  <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>{errorMessage}</span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-xs md:text-sm font-medium mb-1 md:mb-2">Name</label>
                    <input
                      type="text"
                      className="w-full px-3 md:px-4 py-2 text-sm rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium mb-1 md:mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full px-3 md:px-4 py-2 text-sm rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-xs md:text-sm font-medium mb-1 md:mb-2">Phone</label>
                    <input
                      type="tel"
                      className="w-full px-3 md:px-4 py-2 text-sm rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium mb-1 md:mb-2">Address</label>
                    <input
                      type="text"
                      className="w-full px-3 md:px-4 py-2 text-sm rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium mb-1 md:mb-2">Currency</label>
                  <select 
                    className={`w-full px-3 md:px-4 py-2 text-sm rounded-lg bg-zinc-800 border border-zinc-700 
                      focus:border-purple-500 focus:ring-1 focus:ring-purple-500 
                      ${currencyLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                    value={selectedCurrency}
                    onChange={(e) => handleCurrencyChange(e.target.value)}
                    disabled={currencyLocked}
                  >
                    {!isInternational && <option value="PKR">PKR - Pakistani Rupee</option>}
                    <option value="USD">USD - US Dollar</option>
                    <option value="INR">INR - Indian Rupee</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="AED">AED - UAE Dirham</option>
                  </select>
                  {currencyLocked && (
                    <p className="text-xs text-gray-400 mt-1">Currency locked based on selection from pricing page</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium mb-1 md:mb-2">Package</label>
                  <select 
                    className="w-full px-3 md:px-4 py-2 text-sm rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    required
                    value={selectedPlan || ""}
                    onChange={(e) => {
                      const selected = e.target.value;
                      setSelectedPlan(selected);
                      const selectedPackage = packages.find(p => p.name === selected);
                      setShowDiscountBanner(selectedPackage?.hasDiscount ?? false);
                    }}
                  >
                    <option value="">Select a Package</option>
                    {packages.map((pkg, index) => (
                      <option key={index} value={pkg.name}>
                        {pkg.name}
                      </option>
                    ))}
                  </select>

                  {/* Package Details Display */}
                  {selectedPlan && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 md:mt-4 p-3 md:p-4 bg-purple-500/10 rounded-lg border border-purple-500/20"
                    >
                      <h4 className="text-sm md:text-base font-medium text-white mb-2">Package Features:</h4>
                      <ul className="space-y-1.5 md:space-y-2">
                        {packages.find(p => p.name === selectedPlan)?.features.map((feature, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center text-gray-300 text-xs md:text-sm"
                          >
                            <svg className="w-3 h-3 md:w-4 md:h-4 text-purple-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {feature}
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium mb-1 md:mb-2">Project Timeline</label>
                  <select 
                    className="w-full px-3 md:px-4 py-2 text-sm rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    required
                    value={selectedTimeline}
                    onChange={(e) => handleTimelineChange(e.target.value)}
                  >
                    <option value="">Select Timeline</option>
                    <option value="urgent">Urgent Delivery (1-2 weeks) (+20% surcharge)</option>
                    <option value="normal">Normal (2-3 weeks)</option>
                    <option value="relaxed">Relaxed (4+ weeks) (-5% discount)</option>
                  </select>
                </div>
                <p className="text-sm text-gray-300 mt-2">Selected Timeline: {selectedTimeline}</p>
                <div>
                  <label className="block text-xs md:text-sm font-medium mb-3 md:mb-4">Project Requirements</label>

                  {/* Project Requirements Toggle Button */}
                  <button
                    type="button"
                    onClick={toggleRequirementsPanel}
                    className="w-full mb-5 bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-800 hover:to-indigo-900 
                      text-white py-4 px-5 rounded-xl transition-all duration-300 flex items-center justify-between
                      shadow-xl shadow-purple-900/30 font-medium border-2 border-purple-500/20 relative overflow-hidden group"
                  >
                    {/* Animated gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/10 to-purple-500/20 opacity-50 
                      group-hover:opacity-70 transition-opacity duration-500" style={{ backgroundSize: "200% 100%" }}></div>
                    
                    {/* Animated shine effect */}
                    <div className="absolute inset-0 opacity-30 bg-gradient-to-r from-transparent via-white to-transparent 
                      -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out"></div>
                    
                    <div className="flex items-center z-10">
                      {/* NEX-DEVS logo/icon */}
                      <div className="flex items-center justify-center mr-3 bg-white/10 rounded-lg p-2 border border-white/20">
                        <span className="text-lg font-black tracking-tight">NEX-DEVS</span>
                      </div>
                      
                      <div className="flex flex-col text-left">
                        <span className="text-sm font-bold uppercase tracking-wider text-purple-200">Development Requirements</span>
                        <span className="text-xs text-purple-300/90 mt-0.5">Required information from client</span>
                      </div>
                    </div>
                    
                    {/* Pulsing indicator */}
                    <div className="flex items-center z-10">
                      <div className="mr-3 hidden md:block">
                        <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-purple-600/70 text-white 
                          animate-pulse border border-purple-400/30">
                          Important
                        </span>
                      </div>
                      <svg 
                        className={`w-6 h-6 transition-transform duration-300 ${showRequirementsPanel ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  
                  {/* Expandable Requirements Panel */}
                  {showRequirementsPanel && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-5 bg-zinc-800/50 p-4 md:p-6 rounded-lg border border-zinc-700 mb-5"
                    >
                      <div className="text-purple-400 text-sm font-medium mb-4 pb-2 border-b border-zinc-700">
                        Business Objectives
                      </div>
                      
                      {/* Project Type */}
                      <div>
                        <label className="block text-xs md:text-sm font-medium mb-2">Project Type <span className="text-purple-400">*</span></label>
                        <select
                          className="w-full px-3 md:px-4 py-2 text-sm rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                          value={formData.projectType}
                          onChange={(e) => setFormData(prev => ({ ...prev, projectType: e.target.value }))}
                          required
                        >
                          <option value="">Select Project Type</option>
                          <option value="business-website">Business Website</option>
                          <option value="e-commerce">E-commerce Store</option>
                          <option value="portfolio">Portfolio Website</option>
                          <option value="blog">Blog</option>
                          <option value="web-application">Web Application</option>
                          <option value="redesign">Website Redesign</option>
                          <option value="maintenance">Website Maintenance</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      {/* Business Industry */}
                      <div>
                        <label className="block text-xs md:text-sm font-medium mb-2">Business Industry</label>
                        <select
                          className="w-full px-3 md:px-4 py-2 text-sm rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                          value={formData.businessIndustry}
                          onChange={(e) => setFormData(prev => ({ ...prev, businessIndustry: e.target.value }))}
                        >
                          <option value="">Select Your Industry</option>
                          <option value="retail">Retail & E-commerce</option>
                          <option value="healthcare">Healthcare & Medical</option>
                          <option value="finance">Finance & Banking</option>
                          <option value="education">Education & Training</option>
                          <option value="technology">Technology & SaaS</option>
                          <option value="hospitality">Hospitality & Tourism</option>
                          <option value="real-estate">Real Estate & Property</option>
                          <option value="manufacturing">Manufacturing & Industry</option>
                          <option value="legal">Legal Services</option>
                          <option value="media">Media & Entertainment</option>
                          <option value="nonprofit">Nonprofit & Charity</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      
                      {/* Target Audience */}
                      <div>
                        <label className="block text-xs md:text-sm font-medium mb-2">Target Audience</label>
                        <textarea
                          className="w-full px-3 md:px-4 py-2 text-sm rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                          rows={2}
                          placeholder="Describe your target audience (age, demographic, interests, etc.)"
                          value={formData.targetAudience}
                          onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                        />
                      </div>
                      
                      {/* Project Goals */}
                      <div>
                        <label className="block text-xs md:text-sm font-medium mb-2">Project Goals & Success Metrics</label>
                        <textarea
                          className="w-full px-3 md:px-4 py-2 text-sm rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                          rows={2}
                          placeholder="What are your main business goals for this project? How will you measure success?"
                          value={formData.projectGoals}
                          onChange={(e) => setFormData(prev => ({ ...prev, projectGoals: e.target.value }))}
                        />
                      </div>

                      {/* Launch Timeframe */}
                      <div>
                        <label className="block text-xs md:text-sm font-medium mb-2">Desired Launch Timeframe</label>
                        <select
                          className="w-full px-3 md:px-4 py-2 text-sm rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                          value={formData.launchTimeframe}
                          onChange={(e) => setFormData(prev => ({ ...prev, launchTimeframe: e.target.value }))}
                        >
                          <option value="">Select Timeframe</option>
                          <option value="asap">As soon as possible</option>
                          <option value="1-month">Within 1 month</option>
                          <option value="2-3-months">2-3 months</option>
                          <option value="3-6-months">3-6 months</option>
                          <option value="6-plus-months">6+ months</option>
                          <option value="flexible">Flexible</option>
                        </select>
                      </div>

                      <div className="text-purple-400 text-sm font-medium mt-6 mb-4 pb-2 border-b border-zinc-700">
                        Technical Specifications
                      </div>

                      {/* Functional Requirements */}
                      <div>
                        <label className="block text-xs md:text-sm font-medium mb-2">Core Functional Requirements</label>
                        <div className="grid grid-cols-2 gap-2 md:gap-3">
                          {[
                            "User Authentication",
                            "Payment Integration",
                            "Content Management",
                            "Search Functionality",
                            "User Profiles",
                            "Multi-language Support",
                            "Product Catalog",
                            "Social Media Integration",
                            "Blog Section",
                            "Contact Forms",
                            "Newsletter Integration",
                            "Admin Dashboard",
                            "Responsive Design",
                            "SEO Optimization",
                            "Custom API Integration",
                            "Analytics Integration"
                          ].map((req, index) => (
                            <div key={index} className="flex items-start p-2 hover:bg-zinc-700/30 rounded-md transition-colors">
                              <input
                                type="checkbox"
                                id={`req-${index}`}
                                className="mt-1 mr-2"
                                checked={formData.requirements.includes(req)}
                                onChange={() => handleRequirementChange(req)}
                              />
                              <label htmlFor={`req-${index}`} className="text-xs md:text-sm text-gray-300 cursor-pointer">
                                {req}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Security Requirements */}
                      <div>
                        <label className="block text-xs md:text-sm font-medium mb-2">Security Requirements</label>
                        <div className="grid grid-cols-2 gap-2 md:gap-3">
                          {[
                            "SSL Certificate",
                            "GDPR Compliance",
                            "Data Encryption",
                            "Two-Factor Authentication",
                            "Firewall Protection",
                            "Regular Backups",
                            "DDoS Protection",
                            "Privacy Policy"
                          ].map((req, index) => (
                            <div key={index} className="flex items-start p-2 hover:bg-zinc-700/30 rounded-md transition-colors">
                              <input
                                type="checkbox"
                                id={`security-${index}`}
                                className="mt-1 mr-2"
                                checked={formData.securityRequirements.includes(req)}
                                onChange={() => handleSecurityRequirementChange(req)}
                              />
                              <label htmlFor={`security-${index}`} className="text-xs md:text-sm text-gray-300 cursor-pointer">
                                {req}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Technical Preferences */}
                      <div>
                        <label className="block text-xs md:text-sm font-medium mb-2">Technical Preferences</label>
                        <p className="text-xs text-gray-400 mb-3">Select technologies you prefer or are already using:</p>
                        <div className="grid grid-cols-2 gap-2 md:gap-3">
                          {[
                            "WordPress",
                            "Shopify",
                            "WooCommerce",
                            "Next.js",
                            "React",
                            "Vue.js",
                            "PHP",
                            "Node.js",
                            "MySQL",
                            "MongoDB"
                          ].map((tech, index) => (
                            <div key={index} className="flex items-start p-2 hover:bg-zinc-700/30 rounded-md transition-colors">
                              <input
                                type="checkbox"
                                id={`tech-${index}`}
                                className="mt-1 mr-2"
                                checked={formData.technicalPreferences.includes(tech)}
                                onChange={() => handleTechnicalPreferenceChange(tech)}
                              />
                              <label htmlFor={`tech-${index}`} className="text-xs md:text-sm text-gray-300 cursor-pointer">
                                {tech}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* SEO Requirements */}
                      <div>
                        <label className="block text-xs md:text-sm font-medium mb-2">SEO Requirements</label>
                        <select
                          className="w-full px-3 md:px-4 py-2 text-sm rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                          value={formData.seoRequirements}
                          onChange={(e) => setFormData(prev => ({ ...prev, seoRequirements: e.target.value }))}
                        >
                          <option value="">Select SEO Requirements</option>
                          <option value="basic">Basic SEO (meta tags, sitemaps)</option>
                          <option value="standard">Standard SEO (includes keyword research)</option>
                          <option value="advanced">Advanced SEO (full optimization package)</option>
                          <option value="none">No SEO services needed</option>
                        </select>
                      </div>

                      {/* Performance Expectations */}
                      <div>
                        <label className="block text-xs md:text-sm font-medium mb-2">Performance Expectations</label>
                        <select
                          className="w-full px-3 md:px-4 py-2 text-sm rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                          value={formData.performanceExpectations}
                          onChange={(e) => setFormData(prev => ({ ...prev, performanceExpectations: e.target.value }))}
                        >
                          <option value="">Select Performance Expectations</option>
                          <option value="standard">Standard (Google PageSpeed 80+)</option>
                          <option value="high">High Performance (Google PageSpeed 90+)</option>
                          <option value="extreme">Extreme Performance (Google PageSpeed 95+)</option>
                          <option value="custom">Custom Requirements</option>
                        </select>
                      </div>

                      {/* Maintenance Needs */}
                      <div>
                        <label className="block text-xs md:text-sm font-medium mb-2">Maintenance Requirements</label>
                        <select
                          className="w-full px-3 md:px-4 py-2 text-sm rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                          value={formData.maintenanceNeeds}
                          onChange={(e) => setFormData(prev => ({ ...prev, maintenanceNeeds: e.target.value }))}
                        >
                          <option value="">Select Maintenance Needs</option>
                          <option value="none">No maintenance needed</option>
                          <option value="basic">Basic maintenance (security updates only)</option>
                          <option value="standard">Standard maintenance (updates, backups, minor changes)</option>
                          <option value="premium">Premium support (24/7 monitoring, regular updates, content changes)</option>
                          <option value="custom">Custom maintenance plan</option>
                        </select>
                      </div>

                      <div className="text-purple-400 text-sm font-medium mt-6 mb-4 pb-2 border-b border-zinc-700">
                        Design & Content
                      </div>

                      {/* Design Preferences */}
                      <div>
                        <label className="block text-xs md:text-sm font-medium mb-2">Design Preferences</label>
                        <textarea
                          className="w-full px-3 md:px-4 py-2 text-sm rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                          rows={2}
                          placeholder="Describe your design preferences (modern, minimalist, colorful, etc.) and any branding guidelines"
                          value={formData.designPreferences}
                          onChange={(e) => setFormData(prev => ({ ...prev, designPreferences: e.target.value }))}
                        />
                      </div>

                      {/* Content Creation */}
                      <div>
                        <label className="block text-xs md:text-sm font-medium mb-2">Content Creation</label>
                        <select
                          className="w-full px-3 md:px-4 py-2 text-sm rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                          value={formData.contentCreation}
                          onChange={(e) => setFormData(prev => ({ ...prev, contentCreation: e.target.value }))}
                        >
                          <option value="">Select Content Creation Option</option>
                          <option value="client-provided">All content will be provided by me/my team</option>
                          <option value="partial">I need help with some content creation</option>
                          <option value="full">I need full content creation services</option>
                          <option value="copywriting">I only need copywriting services</option>
                          <option value="media">I only need media (images/videos) creation</option>
                        </select>
                      </div>

                      <div className="text-purple-400 text-sm font-medium mt-6 mb-4 pb-2 border-b border-zinc-700">
                        References
                      </div>

                      {/* Existing Website */}
                      <div>
                        <label className="block text-xs md:text-sm font-medium mb-2">Do you have an existing website?</label>
                        <input
                          type="text"
                          className="w-full px-3 md:px-4 py-2 text-sm rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                          placeholder="If yes, please provide the URL"
                          value={formData.existingWebsite}
                          onChange={(e) => setFormData(prev => ({ ...prev, existingWebsite: e.target.value }))}
                        />
                      </div>

                      {/* Competitors */}
                      <div>
                        <label className="block text-xs md:text-sm font-medium mb-2">Competitors or Reference Websites</label>
                        <textarea
                          className="w-full px-3 md:px-4 py-2 text-sm rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                          rows={2}
                          placeholder="List websites you like or competitors for reference"
                          value={formData.competitors}
                          onChange={(e) => setFormData(prev => ({ ...prev, competitors: e.target.value }))}
                        />
                      </div>

                      {/* Additional Details */}
                  <div className="relative">
                        <label className="block text-xs md:text-sm font-medium mb-2">Additional Details</label>
                    <textarea
                      className={`w-full px-3 md:px-4 py-2 text-sm rounded-lg bg-zinc-800 border 
                        ${charCount > MAX_CHARS ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-zinc-700 focus:border-purple-500 focus:ring-purple-500'} 
                        focus:ring-1`}
                          rows={3}
                          placeholder="Any other specific requirements, features, or expectations?"
                      maxLength={MAX_CHARS}
                      value={formData.details}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, details: e.target.value }));
                        setCharCount(e.target.value.length);
                      }}
                    />
                    <div className={`absolute bottom-2 right-2 text-xs transition-all duration-300 
                      ${charCount > MAX_CHARS ? 'text-red-400' : charCount > MAX_CHARS * 0.8 ? 'text-yellow-400' : 'text-gray-400'}`}>
                      <span className="font-medium">{charCount}</span>
                      <span className="text-gray-500">/{MAX_CHARS}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                  {/* Add consent checkbox */}
                  <div className="mt-6 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="consent-checkbox"
                        className="mt-1 mr-3"
                        checked={formData.userConsent}
                        onChange={handleConsentToggle}
                        required
                      />
                      <label htmlFor="consent-checkbox" className="text-sm text-gray-300 cursor-pointer">
                        <span className="font-medium text-white">I consent to NEX-DEVS processing my data</span> - By submitting this form, 
                        I acknowledge that the information provided will be processed in accordance with NEX-DEVS' privacy policy for the purpose 
                        of responding to my inquiry and potentially establishing a business relationship. I understand I can withdraw my consent at any time.
                      </label>
                        </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-xs md:text-sm font-medium mb-1 md:mb-2">Currency</label>
                    <select 
                      className={`w-full px-3 md:px-4 py-2 text-sm rounded-lg bg-zinc-800 border border-zinc-700 
                        focus:border-purple-500 focus:ring-1 focus:ring-purple-500 
                        ${currencyLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                      value={selectedCurrency}
                      onChange={(e) => handleCurrencyChange(e.target.value)}
                      disabled={currencyLocked}
                    >
                      {!isInternational && <option value="PKR">PKR - Pakistani Rupee</option>}
                      <option value="USD">USD - US Dollar</option>
                      <option value="INR">INR - Indian Rupee</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="AED">AED - UAE Dirham</option>
                    </select>
                    {currencyLocked && (
                      <p className="text-xs text-gray-400 mt-1">Currency locked based on selection from pricing page</p>
                    )}
                  </div>
                  
                  {selectedPlan && selectedTimeline && (
                    <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700">
                      <h4 className="text-sm font-medium mb-2">Price Breakdown</h4>
                      <div className="space-y-1 text-sm">
                        {(() => {
                          const basePrice = parseInt(packages.find(p => p.name === selectedPlan)?.price || '0');
                          const priceDetails = calculatePrice(basePrice, selectedTimeline, selectedCurrency);
                          
                          return (
                            <>
                              <p className="flex justify-between text-gray-300">
                                <span>Base Price:</span>
                                <span>{formatPrice(basePrice * exchangeRate, selectedCurrency)}</span>
                              </p>
                              {priceDetails.rushFee && (
                                <p className="flex justify-between text-red-400">
                                  <span>Rush Fee (20%):</span>
                                  <span>+{formatPrice(priceDetails.rushFee, selectedCurrency)}</span>
                                </p>
                              )}
                              {priceDetails.discount && (
                                <p className="flex justify-between text-green-400">
                                  <span>Discount (5%):</span>
                                  <span>-{formatPrice(priceDetails.discount, selectedCurrency)}</span>
                                </p>
                              )}
                              {priceDetails.pkrDiscount && (
                                <p className="flex justify-between text-green-400">
                                  <span>PKR Discount (20%):</span>
                                  <span>-{formatPrice(priceDetails.pkrDiscount, selectedCurrency)}</span>
                                </p>
                              )}
                              {priceDetails.internationalFee && (
                                <p className="flex justify-between text-purple-400">
                                  <span>International Fee (10%):</span>
                                  <span>+{formatPrice(priceDetails.internationalFee, selectedCurrency)}</span>
                                </p>
                              )}
                              {priceDetails.internationalDiscount && (
                                <p className="flex justify-between text-green-400">
                                  <span>International Discount (20%):</span>
                                  <span>-{formatPrice(priceDetails.internationalDiscount, selectedCurrency)}</span>
                                </p>
                              )}
                              <div className="border-t border-zinc-700 mt-2 pt-2">
                                <p className="flex justify-between font-medium">
                                  <span>Final Price:</span>
                                  <span>{formatPrice(priceDetails.finalPrice, selectedCurrency)}</span>
                                </p>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-3 md:space-y-4">
                  <button
                    type="button"
                    onClick={() => router.push(`/checkout?plan=${encodeURIComponent(selectedPlan || '')}`)}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm md:text-base font-medium py-2 md:py-3 px-4 md:px-6 rounded-lg transition-colors"
                    disabled={isLoading}
                  >
                    Proceed to Checkout
                  </button>
                  <motion.button
                    type="submit"
                    className="w-full bg-white hover:bg-gray-100 text-black text-sm md:text-base font-medium py-2 md:py-3 px-4 md:px-6 rounded-lg transition-colors flex items-center justify-center"
                    disabled={isLoading}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <span className="flex items-center">
                        Send Message
                        <motion.span
                          className="ml-2"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          →
                        </motion.span>
                      </span>
                    )}
                  </motion.button>
                </div>
                <p className="text-xs md:text-sm text-gray-400 text-center">
                  We typically respond within 24 hours
                </p>
              </form>
            </div>
          </div>

          {/* Modern Solutions Section */}
          <section className="mb-8 md:mb-20 relative z-10 bg-gradient-to-br from-zinc-900/50 via-purple-900/10 to-zinc-900/50 
          rounded-lg md:rounded-2xl p-4 md:p-8 backdrop-blur-sm border border-white/5
          transition-all duration-300 ease-in-out
          hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/20 mx-2 md:mx-0">
            <div className="grid md:grid-cols-2 gap-4 md:gap-12 items-start md:items-center">
              <div className="space-y-4 md:space-y-8">
                <div className="space-y-3 md:space-y-4">
                  <div className="relative inline-block">
                    <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent leading-tight mb-2
                      animate-fade-in-up tracking-tight">
                      NEX-DEVS
                    </h2>
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-xl opacity-75"></div>
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent leading-tight">
                    Modern Solutions for Modern Businesses
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-xl">
                    Empowering your digital transformation with cutting-edge solutions.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 gap-3 md:gap-4">
                  {[
                    {
                      title: "Web Development Excellence",
                      description: "Custom solutions built with modern frameworks and best practices",
                      icon: "🚀"
                    },
                    {
                      title: "E-commerce Innovation",
                      description: "Scalable and secure online shopping experiences",
                      icon: "🛍️"
                    },
                    {
                      title: "Digital Transformation",
                      description: "End-to-end solutions for business modernization",
                      icon: "💡"
                    }
                  ].map((item, index) => (
                    <div 
                      key={index}
                      className="group p-3 md:p-4 bg-black/20 rounded-lg border border-white/5 
                      transition-all duration-500 ease-in-out
                      hover:border-purple-500/30 hover:bg-purple-900/10 hover:translate-x-1
                      hover:shadow-lg hover:shadow-purple-500/10"
                    >
                      <div className="flex items-start gap-3 md:gap-4">
                        <span className="text-xl md:text-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                          {item.icon}
                        </span>
                        <div className="space-y-0.5 md:space-y-1">
                          <h3 className="text-base md:text-lg font-semibold text-white transition-colors duration-300 group-hover:text-purple-300">
                            {item.title}
                          </h3>
                          <p className="text-xs md:text-sm text-gray-400 transition-colors duration-300 group-hover:text-gray-300">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative mt-6 md:mt-0">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-2xl opacity-60"></div>
                <div className="relative bg-zinc-900/70 p-4 md:p-6 rounded-lg md:rounded-xl border border-purple-500/20 overflow-hidden
                  transition-all duration-500 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/20">
                  <div className="relative z-10 space-y-4 md:space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-2 md:gap-4">
                      {[
                        { label: "Projects Delivered", value: "200+" },
                        { label: "Client Satisfaction", value: "98%" },
                        { label: "Team Experts", value: "20+" },
                        { label: "Years Experience", value: "5+" }
                      ].map((stat, index) => (
                        <div 
                          key={index}
                          className="p-2 md:p-4 bg-black/30 rounded-lg border border-purple-500/10 
                          transition-all duration-500 hover:border-purple-500/30 hover:translate-y-[-2px]
                          hover:shadow-lg hover:shadow-purple-500/20"
                        >
                          <div className="text-lg md:text-2xl font-bold text-white mb-0.5 md:mb-1">{stat.value}</div>
                          <div className="text-xs md:text-sm text-gray-400">{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Technologies */}
                    <div className="space-y-2 md:space-y-3">
                      <h4 className="text-base md:text-lg font-semibold text-white">Technologies We Excel In</h4>
                      <div className="flex flex-wrap gap-1.5 md:gap-2">
                        {[
                          "React", "Next.js", "Node.js", "TypeScript",
                          "Python", "AWS", "Docker", "MongoDB"
                        ].map((tech, index) => (
                          <span 
                            key={index}
                            className="px-2 md:px-3 py-0.5 md:py-1 text-xs md:text-sm bg-purple-500/10 rounded-full border border-purple-500/20
                            transition-all duration-300 hover:bg-purple-500/20 hover:border-purple-500/30
                            hover:translate-y-[-2px] hover:shadow-sm hover:shadow-purple-500/30"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-24 md:w-32 h-24 md:h-32 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-full blur-2xl"></div>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials Section with updated animations */}
          <section className="px-2 md:px-0">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">Client Testimonials</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} 
                  className="bg-zinc-900/50 p-4 md:p-6 rounded-lg md:rounded-xl backdrop-blur-sm
                  transition-all duration-500 ease-in-out
                  hover:shadow-lg hover:shadow-purple-500/20 hover:translate-y-[-4px]
                  border border-white/5 hover:border-purple-500/30">
                  <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-purple-500/20 
                      transition-all duration-500 hover:bg-purple-500/30" />
                    <div>
                      <h4 className="text-sm md:text-base font-semibold">{testimonial.name}</h4>
                      <p className="text-xs md:text-sm text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-sm md:text-base text-gray-300">{testimonial.content}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Enhanced Client Review Section */}
          <section className="mt-16 mb-12 relative z-10">
            <div className="relative">
              {/* Purple glow background effect */}
              <div className="absolute -inset-10 bg-purple-600/10 blur-3xl opacity-50 rounded-full"></div>
              
              <div className="relative bg-zinc-900/60 border border-purple-500/30 rounded-2xl p-6 md:p-8 backdrop-blur-sm shadow-xl">
                <div className="text-center space-y-4 mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold">
                    <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Share Your Experience With Us
                    </span>
                  </h2>
                  <p className="text-gray-300 max-w-2xl mx-auto">
                    We value your feedback and appreciate your time. Let us know about your experience working with NEX-DEVS.
                  </p>
                </div>
                
                {/* Featured Reviews Grid - Displays the most recent client reviews */}
                <div className="mb-10 relative">
                  <h3 className="text-xl font-medium text-center mb-6 flex items-center justify-center gap-2">
                    <span className="text-purple-300">★</span>
                    Recent Client Reviews
                    <span className="text-purple-300">★</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {reviews.slice(0, 3).map((review, index) => (
                      <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-black/40 rounded-xl p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 group"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold">
                              {review.author.charAt(0)}
                            </div>
                            <div>
                              <h4 className="text-white font-medium text-sm md:text-base">{review.author}</h4>
                              <p className="text-purple-200 text-xs">{review.role} {review.company && `at ${review.company}`}</p>
                            </div>
                          </div>
                          <div className="text-yellow-400 text-sm flex">
                            {'★'.repeat(review.rating)}
                          </div>
                        </div>
                        
                        <div className="text-gray-300 text-sm mb-3 h-16 overflow-hidden relative">
                          <p className="line-clamp-3">{review.text}</p>
                          <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-black/40 to-transparent"></div>
                        </div>
                        
                        <div className="flex justify-between items-center text-xs text-purple-300/70">
                          <div>
                            {review.projectType || review.planTitle}
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {new Date(review.date).toLocaleDateString()}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* Review CTAs */}
                <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsReviewModalOpen(true)}
                    className="group relative overflow-hidden px-8 py-4 rounded-xl 
                      bg-gradient-to-r from-purple-600 to-purple-800 
                      hover:from-purple-500 hover:to-purple-700
                      text-white font-medium shadow-lg shadow-purple-700/30
                      border border-purple-500/40 hover:border-purple-500/60
                      transition-all duration-300 flex-1 flex items-center justify-center max-w-md w-full"
                  >
                    {/* Shine animation effect */}
                    <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-15 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
                    
                    <div className="flex items-center gap-2 relative z-10">
                      <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      <span className="text-lg">Leave a Review</span>
                    </div>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push('/pricing')}
                    className="group relative overflow-hidden px-8 py-4 rounded-xl 
                      bg-black/40
                      text-white font-medium 
                      border border-purple-500/20 hover:border-purple-500/40
                      transition-all duration-300 flex-1 flex items-center justify-center max-w-md w-full"
                  >
                    <div className="flex items-center gap-2 relative z-10">
                      <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span className="text-lg">See All Reviews</span>
                    </div>
                  </motion.button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      {/* Review Modal */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <ReviewFormModal 
            isOpen={isReviewModalOpen} 
            onClose={() => setIsReviewModalOpen(false)} 
            onSubmit={handleReviewSubmit}
          />
        )}
      </AnimatePresence>

      {/* Package Details Section */}
      {selectedPlan && (
        <div className="mt-8">
          <div className="bg-black/40 rounded-xl p-6 border border-purple-500/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                {selectedPlan === "MODERN AI BASED SAAS PRODUCT" && <span>🤖</span>}
                {selectedPlan}
              </h3>
              <div className="text-purple-300 font-semibold">
                {formatPrice(Number(packages.find(p => p.name === selectedPlan)?.price || 0), selectedCurrency)}
              </div>
            </div>
            
            <div className="space-y-4">
              {/* Features List */}
              <div className="grid gap-2">
                {packages.find(p => p.name === selectedPlan)?.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2 bg-purple-900/20 p-3 rounded-lg">
                    <svg className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              {/* SAAS-specific additional info */}
              {selectedPlan === "MODERN AI BASED SAAS PRODUCT" && (
                <div className="mt-6 space-y-4">
                  <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/20">
                    <h4 className="text-white font-medium mb-2">Enterprise AI Integration</h4>
                    <p className="text-gray-300 text-sm">
                      Our SAAS solution comes with advanced AI capabilities, real-time data processing, 
                      and scalable architecture designed for enterprise-level operations.
                    </p>
                  </div>
                  <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/20">
                    <h4 className="text-white font-medium mb-2">Performance & Scalability</h4>
                    <p className="text-gray-300 text-sm">
                      Built with cutting-edge technology to handle high loads and scale automatically 
                      based on your business needs. Includes advanced monitoring and analytics.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Display SAAS Reviews if SAAS package is selected */}
          {selectedPlan === "MODERN AI BASED SAAS PRODUCT" && (
            <div className="mt-8 bg-black/40 rounded-xl p-6 border border-purple-500/30">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>🤖</span>
                Client Reviews for SAAS Solutions
              </h3>
              <div className="grid gap-4">
                {Array.isArray(planReviews) && planReviews.filter(review => review.projectType === "MODERN AI BASED SAAS PRODUCT").map((review, index: number) => (
                  <div key={index} className="bg-white rounded-lg shadow-md p-6 mb-4">
                    <div className="flex items-center mb-4">
                      <div>
                        <h4 className="text-lg font-semibold">{review.name}</h4>
                        <p className="text-gray-600">{review.role}</p>
                      </div>
                      <div className="ml-auto">
                        <div className="flex items-center">
                          {[...Array(review.rating)].map((_, i) => (
                            <span key={i} className="text-yellow-400">★</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">{review.comment}</p>
                    <p className="text-gray-500 text-sm">{review.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    }>
      <ContactPageContent />
    </Suspense>
  );
}