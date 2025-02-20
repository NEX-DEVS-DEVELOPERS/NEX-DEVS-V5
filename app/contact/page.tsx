'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaLinkedin, FaGithub, FaTwitter, FaWhatsapp, FaClock, FaGlobe, FaCode, FaPalette, FaRocket, FaMobile, FaWordpress, FaShoppingCart } from 'react-icons/fa';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

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

const packages = [
  {
    name: "WordPress Basic",
    features: [
      "GeneratePress Theme Setup",
      "Up to 5 Pages Development",
      "Mobile-First Design",
      "2 SEO Articles",
      "5 Days Revision",
      "Basic XML Sitemap",
      "Google Analytics Integration",
      "Contact Form Integration",
      "Social Media Integration",
      "Basic Security Package"
    ],
    hasDiscount: false
  },
  {
    name: "WordPress Professional",
    features: [
      "Premium Theme (Foxiz/Pixwell/Phlox)",
      "Up to 10 Pages Development",
      "Rank Math Pro + Elementor Pro",
      "Advanced SEO Setup",
      "10 Days Revision",
      "CDN Integration",
      "Schema Markup Implementation",
      "Advanced Analytics",
      "Database Optimization",
      "Advanced Security Package"
    ],
    hasDiscount: true
  },
  {
    name: "WordPress Enterprise",
    features: [
      "All Premium Themes Access",
      "Unlimited Pages Development",
      "Premium Plugin Bundle",
      "6 SEO Articles + Backlinks",
      "1 Year Hosting + Domain",
      "WP Rocket Pro Integration",
      "Multi-language Support",
      "Custom Admin Dashboard",
      "Monthly Performance Reports",
      "Priority Support (30 Days)"
    ],
    hasDiscount: true
  },
  {
    name: "Shopify/WooCommerce",
    features: [
      "Custom Store Design",
      "Product Setup & Migration",
      "Payment Gateway Integration",
      "Inventory Management",
      "Analytics Integration",
      "Mobile Commerce Ready",
      "Multi-currency Support",
      "Automated Email Marketing",
      "Order Management System",
      "Security Implementation"
    ],
    hasDiscount: true
  },
  {
    name: "Full-Stack Basic",
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
    ],
    hasDiscount: true
  },
  {
    name: "Full-Stack Professional",
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
    name: "UI/UX Design",
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
  },
  {
    name: "Web Apps & AI Solutions",
    features: [
      "AI Model Integration",
      "Custom AI Solutions",
      "Real-time Processing",
      "Data Analytics",
      "Machine Learning Pipeline",
      "API Development",
      "Scalable Architecture",
      "Automated Workflows",
      "Performance Monitoring",
      "Technical Support"
    ],
    hasDiscount: true
  },
  {
    name: "SEO & Content Writing",
    features: [
      "Keyword Research",
      "Content Strategy",
      "Technical SEO",
      "Content Creation",
      "Performance Tracking",
      "Monthly Reports",
      "Competitor Analysis",
      "Link Building Strategy",
      "Analytics Setup",
      "Content Calendar"
    ],
    hasDiscount: true
  }
];

// Add this animation variant near the top of the file
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

function ContactPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedTimeline, setSelectedTimeline] = useState('');
  const [adjustedPrice, setAdjustedPrice] = useState('');
  const [showDiscountBanner, setShowDiscountBanner] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    timeline: '',
    details: ''
  });

  useEffect(() => {
    const plan = searchParams.get('plan');
    if (plan) {
      const selectedPackage = packages.find(p => p.name === decodeURIComponent(plan));
      setSelectedPlan(plan);
      setFormData(prev => ({
        ...prev,
        details: `I'm interested in the ${plan} package.`
      }));
      
      // Only show discount banner for eligible packages
      setShowDiscountBanner(selectedPackage?.hasDiscount ?? false);
    }
  }, [searchParams]);

  const handleTimelineChange = (timeline: string) => {
    setSelectedTimeline(timeline);
    setFormData(prev => ({ ...prev, timeline }));
    
    // Update pricing based on timeline
    if (selectedPlan) {
      const basePrice = packages.find(p => p.name === selectedPlan)?.price || '';
      let newPrice = basePrice;
      
      if (timeline === 'urgent') {
        // Add 20% for urgent timeline
        const numericPrice = parseInt(basePrice.replace(/[^0-9]/g, ''));
        const rushFee = Math.round(numericPrice * 0.2);
        newPrice = `${basePrice} + ${rushFee}k Rush Fee`;
      }
      
      setAdjustedPrice(newPrice);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add form validation
    if (!formData.name || !formData.email || !formData.timeline || !formData.details) {
      alert('Please fill in all required fields');
      return;
    }

    // Here you would typically send the form data to your backend
    console.log('Form submitted:', {
      ...formData,
      selectedPlan,
      adjustedPrice
    });

    // Redirect to checkout if a plan is selected
    if (selectedPlan) {
      router.push(`/checkout?plan=${encodeURIComponent(selectedPlan)}&timeline=${encodeURIComponent(formData.timeline)}`);
    }
  };

  return (
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
                    Use Code: <span className="bg-black text-yellow-400 px-2 md:px-4 py-1 rounded-full">NEX-WEBS20%</span>
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
                      20% OFF - Use Code: NEX-WEBS20%
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
                hover:shadow-lg hover:shadow-purple-500/10
                transform perspective-1000 hover:scale-105"
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
                  value={formData.timeline}
                  onChange={(e) => {
                    const timeline = e.target.value;
                    setFormData(prev => ({ ...prev, timeline }));
                    handleTimelineChange(timeline);
                  }}
                >
                  <option value="">Select Timeline</option>
                  <option value="urgent">Urgent (1-2 weeks) +20% Rush Fee</option>
                  <option value="normal">Normal (2-4 weeks)</option>
                  <option value="relaxed">Relaxed (4+ weeks)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium mb-1 md:mb-2">Project Details</label>
                <textarea
                  className="w-full px-3 md:px-4 py-2 text-sm rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  rows={4}
                  placeholder="Tell us about your project requirements, goals, and any specific features you need..."
                  required
                  value={formData.details}
                  onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
                />
              </div>
              <div className="space-y-3 md:space-y-4">
                <button
                  type="button"
                  onClick={() => router.push(`/checkout?plan=${encodeURIComponent(selectedPlan || '')}`)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm md:text-base font-medium py-2 md:py-3 px-4 md:px-6 rounded-lg transition-colors"
                >
                  Proceed to Checkout
                </button>
                <button
                  type="submit"
                  className="w-full bg-white hover:bg-gray-100 text-black text-sm md:text-base font-medium py-2 md:py-3 px-4 md:px-6 rounded-lg transition-colors"
                >
                  Send Message
                </button>
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
                    NEX-WEBS
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
      </div>
    </main>
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