'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowRight, FaWordpress, FaChartLine, FaCreditCard, FaUsers, FaMobileAlt, FaGlobe, FaRocket, FaCheck } from 'react-icons/fa';
import { BiStore, BiSupport, BiCustomize } from 'react-icons/bi';

// Floating elements component for background effects
const FloatingElements = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (dimensions.width === 0 || dimensions.height === 0) {
    return null;
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating decorative elements */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-16 h-16 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/5"
          initial={{ 
            x: Math.random() * dimensions.width, 
            y: Math.random() * dimensions.height,
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{
            x: [null, Math.random() * dimensions.width],
            y: [null, Math.random() * dimensions.height]
          }}
          transition={{
            duration: Math.random() * 30 + 20,
            ease: "linear",
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      ))}
    </div>
  );
};

// Stat card component for displaying metrics
interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  delay: number;
}

const StatCard = ({ icon, title, value, subtitle, delay }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-gradient-to-br from-blue-900/40 to-purple-800/20 p-6 rounded-xl border border-blue-500/30 relative overflow-hidden group"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div className="flex items-start gap-4">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-lg text-white">
        {icon}
      </div>
      <div>
        <h3 className="text-gray-300 text-sm font-medium">{title}</h3>
        <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{value}</p>
        <p className="text-gray-400 text-xs mt-1">{subtitle}</p>
      </div>
    </div>
  </motion.div>
);

// Feature comparison row component
interface FeatureRowProps {
  feature: string;
  standard: boolean;
  withUs: string;
  index: number;
}

const FeatureRow = ({ feature, standard, withUs, index }: FeatureRowProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
    className={`grid grid-cols-3 gap-2 py-3 px-4 ${index % 2 === 0 ? 'bg-black/20' : 'bg-black/10'} rounded-lg my-1`}
  >
    <div className="text-gray-300 font-medium">{feature}</div>
    <div className="text-center">{standard ? <FaCheck className="inline text-green-500 mx-auto" /> : <span className="text-gray-500">-</span>}</div>
    <div className="text-center text-blue-300 font-medium">{withUs}</div>
  </motion.div>
);

// Testimonial component
interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  company: string;
  metric: string;
  metricValue: string;
}

const Testimonial = ({ quote, author, role, company, metric, metricValue }: TestimonialProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, delay: 0.5 }}
    className="bg-gradient-to-br from-blue-900/30 to-purple-800/20 p-6 rounded-xl border border-blue-500/30 relative"
  >
    <div className="flex flex-col gap-4">
      <p className="text-gray-300 italic">"{quote}"</p>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white font-medium">{author}</p>
          <p className="text-gray-400 text-sm">{role}, {company}</p>
        </div>
        <div className="bg-blue-900/50 px-4 py-2 rounded-lg text-center">
          <p className="text-blue-300 text-xs">{metric}</p>
          <p className="text-white font-bold">{metricValue}</p>
        </div>
      </div>
    </div>
  </motion.div>
);

// Main page component
export default function WordPressEcommercePage() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('growth');
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Animation to slide content into view
  useEffect(() => {
    setIsVisible(true);
    window.scrollTo(0, 0);
  }, []);

  // Scroll to pricing section 
  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing-section');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-black text-white relative pt-16 md:pt-24">
      <FloatingElements />
      <div className="absolute top-0 left-0 w-full h-[70vh] bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-full h-[50vh] bg-gradient-to-t from-purple-900/20 to-transparent pointer-events-none"></div>
      
      {/* Back button */}
      <div className="fixed top-24 left-4 z-50">
        <Link href="/pricing" className="flex items-center space-x-2 bg-black/40 backdrop-blur-sm px-3 py-2 rounded-lg text-white/80 hover:text-white transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm">Back</span>
        </Link>
      </div>
      
      {/* Hero section */}
      <AnimatePresence>
        {isVisible && (
          <div className="container mx-auto px-4 py-10 md:py-16">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-center max-w-4xl mx-auto mb-16"
            >
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-xl inline-block">
                  <FaWordpress className="h-10 w-10 text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                WordPress E-commerce
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                Custom WordPress e-commerce solutions with WooCommerce optimization to boost your sales and elevate your online store's performance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={scrollToPricing}
                  className="bg-gradient-to-r from-blue-600 to-purple-700 px-8 py-4 rounded-lg text-white font-semibold flex items-center justify-center gap-2"
                >
                  Get Started <FaArrowRight className="h-4 w-4" />
                </motion.button>
                <Link href="/contact?plan=WordPress%20E-commerce">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-transparent border border-blue-500 px-8 py-4 rounded-lg text-blue-400 font-semibold hover:bg-blue-900/20 transition-colors"
                  >
                    Contact Us
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              <StatCard
                icon={<FaChartLine className="h-6 w-6" />}
                title="Average Revenue Growth"
                value="147%"
                subtitle="Year-over-year increase for our clients"
                delay={0.2}
              />
              <StatCard
                icon={<FaCreditCard className="h-6 w-6" />}
                title="Transaction Success Rate"
                value="99.9%"
                subtitle="Optimized checkout process"
                delay={0.3}
              />
              <StatCard
                icon={<FaUsers className="h-6 w-6" />}
                title="Customer Retention"
                value="82%"
                subtitle="Repeat customer rate"
                delay={0.4}
              />
              <StatCard
                icon={<FaMobileAlt className="h-6 w-6" />}
                title="Mobile Conversion"
                value="68%"
                subtitle="Mobile-first optimization"
                delay={0.5}
              />
            </div>

            {/* Features Section */}
            <div className="mb-16">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Why Choose Our WordPress Solution?</h2>
                <p className="text-gray-400">Compare our professional WordPress development with standard solutions</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-900/30 to-purple-800/20 rounded-xl p-6 border border-blue-500/30">
                <div className="grid grid-cols-3 gap-2 mb-4 px-4 text-sm font-medium text-gray-400">
                  <div>Feature</div>
                  <div className="text-center">Standard WordPress</div>
                  <div className="text-center">Our Solution</div>
                </div>
                
                <FeatureRow
                  feature="Performance Optimization"
                  standard={false}
                  withUs="Advanced Caching"
                  index={0}
                />
                <FeatureRow
                  feature="Security Measures"
                  standard={true}
                  withUs="Enterprise-grade"
                  index={1}
                />
                <FeatureRow
                  feature="Mobile Optimization"
                  standard={false}
                  withUs="Full Responsive Design"
                  index={2}
                />
                <FeatureRow
                  feature="SEO Configuration"
                  standard={true}
                  withUs="Advanced SEO Suite"
                  index={3}
                />
                <FeatureRow
                  feature="Payment Integration"
                  standard={false}
                  withUs="Multiple Gateways"
                  index={4}
                />
              </div>
            </div>

            {/* Testimonial Section */}
            <div className="mb-16">
              <Testimonial
                quote="The WordPress solution provided exceeded our expectations. Our online sales increased by 200% within the first three months."
                author="Sarah Johnson"
                role="E-commerce Director"
                company="Fashion Boutique"
                metric="Revenue Growth"
                metricValue="+200%"
              />
            </div>

            {/* Pricing Section */}
            <div id="pricing-section" className="scroll-mt-24">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Professional WordPress Solution</h2>
                <p className="text-gray-400">Everything you need to succeed online</p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-blue-900/30 to-purple-800/20 rounded-xl p-8 border border-blue-500/30"
              >
                <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
                  <div className="flex-1">
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold mb-2">$800</h3>
                      <p className="text-gray-400">Professional WordPress E-commerce Solution</p>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-blue-400">Core Features:</h4>
                      <ul className="space-y-2">
                        {[
                          "Custom WordPress & WooCommerce Setup",
                          "Mobile-Responsive Design",
                          "Payment Gateway Integration",
                          "SEO Optimization",
                          "Security Configuration",
                          "Performance Optimization",
                        ].map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <FaCheck className="text-green-500 flex-shrink-0" />
                            <span className="text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-purple-400">Advanced Features:</h4>
                      <ul className="space-y-2">
                        {[
                          "Inventory Management System",
                          "Customer Analytics Dashboard",
                          "Automated Email Marketing",
                          "Multi-currency Support",
                          "Advanced Product Filtering",
                          "Custom Shipping Rules",
                        ].map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <FaCheck className="text-green-500 flex-shrink-0" />
                            <span className="text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/contact?plan=WordPress%20E-commerce">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-blue-600 to-purple-700 px-8 py-4 rounded-lg text-white font-semibold w-full sm:w-auto"
                    >
                      Get Started Now
                    </motion.button>
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.location.href = 'mailto:contact@example.com'}
                    className="bg-transparent border border-blue-500 px-8 py-4 rounded-lg text-blue-400 font-semibold hover:bg-blue-900/20 transition-colors w-full sm:w-auto"
                  >
                    Schedule Consultation
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
} 
