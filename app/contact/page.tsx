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
    name: "WordPress Development",
    price: "Starting at $999",
    features: [
      "Custom WordPress Theme",
      "Plugin Development",
      "Speed Optimization",
      "Security Setup",
      "WooCommerce Integration"
    ]
  },
  {
    name: "Shopify/WooCommerce",
    price: "Starting at $1499",
    features: [
      "Store Setup & Configuration",
      "Custom Theme Development",
      "Payment Gateway Integration",
      "Product Management",
      "Analytics Setup"
    ]
  },
  {
    name: "FULLSTACK WEBSITE",
    price: "Starting at $2499",
    features: [
      "Modern React Development",
      "SEO Optimization",
      "Performance Optimization",
      "API Integration",
      "Responsive Design"
    ]
  },
  {
    name: "UI/UX Design",
    price: "Starting at $799",
    features: [
      "Figma/Framer Design",
      "Wireframing",
      "Prototype Development",
      "User Flow Design",
      "Design System Creation"
    ]
  },
  {
    name: "Web Apps & AI Solutions",
    price: "Starting at $3999",
    features: [
      "Custom AI Integration",
      "Full-Stack Development",
      "Database Architecture",
      "API Development",
      "Real-time Features"
    ]
  },
  {
    name: "SEO & Content Writing",
    price: "Starting at $599",
    features: [
      "Keyword Research",
      "Content Strategy",
      "Technical SEO",
      "Blog Writing",
      "Performance Tracking"
    ]
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
      setSelectedPlan(plan);
      setFormData(prev => ({
        ...prev,
        details: `I'm interested in the ${plan} package.`
      }));
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
                className="bg-gradient-to-r from-yellow-500 to-yellow-400 
                  text-black py-3 md:py-4 shadow-xl border-b-4 border-yellow-600 mb-6 md:mb-8 rounded-lg px-3 md:px-4"
              >
                <div className="container mx-auto text-center">
                  <div className="text-lg md:text-2xl font-black flex items-center justify-center gap-2 md:gap-4">
                    <span className="animate-bounce hidden md:inline">🎉</span>
                    EXCLUSIVE OFFER: 20% OFF
                    <span className="animate-bounce hidden md:inline">🎉</span>
                  </div>
                  <div className="text-sm md:text-lg font-bold mt-1">
                    Use Code: <span className="bg-black text-yellow-400 px-2 md:px-4 py-1 rounded-full">EASTER20</span>
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
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="contact-info bg-zinc-900/50 p-6 rounded-xl backdrop-blur-sm border border-white/5 
          hover:border-white/30 transition-all duration-500 
          transform perspective-1000 hover:scale-105 hover:rotate-1
          hover:shadow-lg hover:shadow-purple-500/20">
            <h2 className="text-2xl font-semibold mb-6 text-white">Contact Information</h2>
            <div className="space-y-6">
              {/* Primary Contact Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FaPhone className="text-purple-500 w-5 h-5" />
                  <div>
                    <p className="font-medium">Call Us</p>
                    <p>+92 329-2425-950</p>
                    <p className="text-sm text-gray-400">Mon-Fri, 8am-9pm EST</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaWhatsapp className="text-purple-500 w-5 h-5" />
                  <div>
                    <p className="font-medium">WhatsApp</p>
                    <p>+92 329-2425-950</p>
                    <p className="text-sm text-gray-400">Available for quick chat</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-purple-500 w-5 h-5" />
                  <div>
                    <p className="font-medium">Email Us</p>
                    <p>nexwebs.org@gmail.com.com</p>
                    <p className="text-sm text-gray-400">24/7 support available</p>
                  </div>
                </div>
              </div>

              {/* Location & Hours */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-purple-500 w-5 h-5" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p>MULTAN ,MUX</p>
                    <p className="text-sm text-gray-400">NOT AVAILABE FOR REMORTE WORK YET!</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaClock className="text-purple-500 w-5 h-5" />
                  <div>
                    <p className="font-medium">Business Hours</p>
                    <p>Monday - Friday</p>
                    <p className="text-sm text-gray-400">9:00 AM - 8:00 PM EST</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-4 border-t border-zinc-800">
                <p className="font-medium mb-3">Connect With Us</p>
                <div className="flex gap-4">
                  <a href="#" className="text-purple-500 hover:text-purple-400 transition-colors">
                    <FaLinkedin className="w-6 h-6" />
                  </a>
                  <a href="#" className="text-purple-500 hover:text-purple-400 transition-colors">
                    <FaGithub className="w-6 h-6" />
                  </a>
                  <a href="#" className="text-purple-500 hover:text-purple-400 transition-colors">
                    <FaTwitter className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Contact Form */}
          <div className="md:col-span-2 bg-zinc-900/50 p-6 rounded-xl backdrop-blur-sm border-2 border-yellow-500/30">
            <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-500/10 -mx-6 -mt-6 mb-6 py-4 px-6 rounded-t-xl">
              <h3 className="text-xl font-bold text-center">
                <span className="text-yellow-400">🎯 20% Discount Applied</span>
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Package</label>
                <select 
                  className={`w-full px-4 py-2 rounded-lg bg-zinc-800 border transition-all duration-300
                    ${selectedPlan 
                      ? 'border-purple-500 ring-2 ring-purple-500/20 shadow-[0_0_10px_-2px_rgba(147,51,234,0.3)]' 
                      : 'border-zinc-700'} 
                    focus:border-purple-500 focus:ring-1 focus:ring-purple-500`}
                  required
                  value={selectedPlan || ""}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                >
                  <option value="">Select a Package</option>
                  <option value="WordPress Development">WordPress Development</option>
                  <option value="Shopify/WooCommerce">Shopify/WooCommerce</option>
                  <option value="Full-Stack Website">Full-Stack Website</option>
                  <option value="Figma/Framer">UI/UX Design</option>
                  <option value="AI Agents/WebApps">Web Apps & AI Solutions</option>
                  <option value="SEO/Content Writing">SEO & Content Writing</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Project Timeline</label>
                <select 
                  className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
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
                {formData.timeline && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-gray-400"
                  >
                    {formData.timeline === 'urgent' && (
                      <span className="text-yellow-400">
                        ⚡ Rush delivery includes 20% additional fee for prioritized development
                      </span>
                    )}
                    {formData.timeline === 'normal' && (
                      <span>
                        ✨ Standard timeline for optimal development and testing
                      </span>
                    )}
                    {formData.timeline === 'relaxed' && (
                      <span>
                        🌟 Extended timeline for more iterations and refinements
                      </span>
                    )}
                  </motion.p>
                )}
                {adjustedPrice && formData.timeline === 'urgent' && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm font-medium text-yellow-400"
                  >
                    Adjusted Price: {adjustedPrice}
                  </motion.p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Project Details</label>
                <textarea
                  className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  rows={4}
                  placeholder="Tell us about your project requirements, goals, and any specific features you need..."
                  required
                  value={formData.details}
                  onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
                />
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => router.push(`/checkout?plan=${encodeURIComponent(selectedPlan || '')}`)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors mb-4"
                >
                  Proceed to Checkout
                </button>
                <button
                  type="submit"
                  className="w-full bg-white hover:bg-gray-100 text-black font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  Send Message
                </button>
              </div>
              <p className="text-sm text-gray-400 text-center mt-4">
                We typically respond within 24 hours
              </p>
            </form>
          </div>
        </div>

        {/* Modern Solutions Section */}
        <section className="mb-20 relative z-10 bg-gradient-to-br from-zinc-900/50 via-purple-900/10 to-zinc-900/50 
        rounded-2xl p-8 backdrop-blur-sm border border-white/5
        transform perspective-1000 hover:scale-[1.02] hover:rotate-1 transition-all duration-500
        hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Modern Solutions for Modern Businesses
              </h2>
              <p className="text-gray-300 text-lg">
                We create cutting-edge digital solutions that help businesses thrive in the modern world. 
                Our expertise spans across various technologies and platforms.
              </p>
              <ul className="space-y-4">
                {["Responsive Web Applications", "E-commerce Solutions", "Custom CMS Development"].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 group">
                    <span className="text-purple-400 transform group-hover:scale-110 transition-transform">✓</span>
                    <span className="group-hover:translate-x-1 transition-transform text-gray-300 group-hover:text-white">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-3xl group-hover:blur-2xl transition-all"></div>
              <div className="relative bg-zinc-900/50 p-4 rounded-xl border border-purple-500/10 transform hover:scale-105 transition-all duration-300 hover:border-purple-500/30">
                <div className="aspect-video rounded-lg overflow-hidden flex items-center justify-center relative">
                  {/* Improved Background Gradients */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-transparent to-blue-900/30"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_60%)]"></div>
                  
                  {/* Main Content Container */}
                  <div className="relative z-10 text-center space-y-8 p-8">
                    {/* Main Title with Clean 3D Effect */}
                    <div className="relative">
                      <h3 className="text-4xl md:text-6xl font-bold tracking-tight inline-block
                        [text-shadow:_0_1px_0_rgb(255_255_255_/_60%),_0_2px_0_rgb(255_255_255_/_40%),_0_3px_0_rgb(255_255_255_/_30%),_0_4px_0_rgb(255_255_255_/_20%),_0_8px_8px_rgba(0,0,0,0.3)]
                        bg-gradient-to-b from-white via-white to-purple-200 bg-clip-text text-transparent
                        transform-gpu hover:scale-105 transition-transform duration-500
                        animate-reveal"
                      >
                        NEX-WEBS
                      </h3>
                      {/* Subtle Glow Effect */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-blue-600/20 blur-2xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    </div>

                    {/* Tagline with Refined Animation */}
                    <h4 className="text-xl md:text-2xl font-semibold inline-block
                      bg-gradient-to-r from-purple-200 via-white to-purple-200 bg-clip-text text-transparent
                      [text-shadow:_0_2px_4px_rgba(0,0,0,0.3)]
                      transform-gpu hover:scale-105 transition-transform duration-500
                      animate-typing"
                    >
                    "Elevate Your Online Presence."
                    </h4>

                    {/* Services List with Clean Typography */}
                    <div className="flex flex-wrap justify-center gap-x-4 text-base md:text-lg
                      text-purple-100/90 font-medium tracking-wide overflow-hidden"
                    >
                      <span className="animate-reveal">Web Development</span>
                      <span className="animate-reveal-delay-1">•</span>
                      <span className="animate-reveal-delay-1">Design</span>
                      <span className="animate-reveal-delay-1">•</span>
                      <span className="animate-reveal-delay-2">Innovation</span>
                    </div>

                    {/* Subtitle with Subtle Animation */}
                    <p className="text-base md:text-lg text-gray-300
                      tracking-wide font-medium max-w-2xl mx-auto
                      [text-shadow:_0_1px_2px_rgba(0,0,0,0.3)]
                      animate-reveal-delay-2"
                    >
                      Transforming Ideas into Digital Excellence
                    </p>

                    {/* Refined Floating Elements */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400/40 rounded-full animate-float-smooth"></div>
                      <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-blue-400/40 rounded-full animate-float-smooth"></div>
                      <div className="absolute top-1/2 left-1/3 w-1.5 h-1.5 bg-pink-400/40 rounded-full animate-float-smooth"></div>
                      <div className="absolute bottom-1/3 right-1/3 w-1.5 h-1.5 bg-purple-400/40 rounded-full animate-float-smooth"></div>
                    </div>
                  </div>
                </div>

                {/* Refined Border Elements */}
                <div className="absolute -top-6 -left-6 w-12 h-12 border-t-[1px] border-l-[1px] border-purple-500/30 rounded-tl-2xl"></div>
                <div className="absolute -bottom-6 -right-6 w-12 h-12 border-b-[1px] border-r-[1px] border-purple-500/30 rounded-br-2xl"></div>
                <div className="absolute -top-6 -right-6 w-12 h-12 border-t-[1px] border-r-[1px] border-blue-500/20 rounded-tr-2xl"></div>
                <div className="absolute -bottom-6 -left-6 w-12 h-12 border-b-[1px] border-l-[1px] border-blue-500/20 rounded-bl-2xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section with 3D effects */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-8">Client Testimonials</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} 
                className="bg-zinc-900/50 p-6 rounded-xl backdrop-blur-sm
                transform perspective-1000 hover:scale-105 hover:rotate-2
                transition-all duration-500 hover:shadow-lg hover:shadow-purple-500/20
                border border-white/5 hover:border-purple-500/30">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 
                    transform group-hover:rotate-12 transition-transform duration-500" />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300">{testimonial.content}</p>
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