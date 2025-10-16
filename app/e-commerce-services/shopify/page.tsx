'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowRight, FaStore, FaChartLine, FaCreditCard, FaUsers, FaMobileAlt, FaGlobe, FaRocket, FaCheck } from 'react-icons/fa';
import { MdShoppingCart, MdOutlineSpeed, MdAnalytics } from 'react-icons/md';

// Enhanced floating elements component with e-commerce icons
const FloatingElements = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const ecommerceIcons = [
    <MdShoppingCart key="cart" className="text-pink-500/30" />,
    <FaStore key="store" className="text-blue-500/30" />,
    <FaCreditCard key="card" className="text-purple-500/30" />,
    <FaUsers key="users" className="text-indigo-500/30" />,
    <FaGlobe key="globe" className="text-cyan-500/30" />,
    <FaRocket key="rocket" className="text-pink-500/30" />
  ];

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  if (dimensions.width === 0 || dimensions.height === 0) {
    return null;
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient orbs */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute w-16 h-16 rounded-full bg-gradient-to-r from-pink-500/10 to-blue-500/5"
          initial={{ 
            x: Math.random() * dimensions.width, 
            y: Math.random() * dimensions.height,
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{
            x: [null, Math.random() * dimensions.width],
            y: [null, Math.random() * dimensions.height],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: Math.random() * 30 + 20,
            ease: "linear",
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      ))}
      
      {/* Floating e-commerce icons */}
      {ecommerceIcons.map((icon, i) => (
        <motion.div
          key={`icon-${i}`}
          className="absolute text-4xl"
          initial={{ 
            x: Math.random() * dimensions.width, 
            y: Math.random() * dimensions.height,
            rotate: 0,
            opacity: 0.3
          }}
          animate={{
            x: [null, Math.random() * dimensions.width],
            y: [null, Math.random() * dimensions.height],
            rotate: [0, 360],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: Math.random() * 20 + 15,
            ease: "linear",
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          {icon}
        </motion.div>
      ))}

      {/* Premium effect lines */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`line-${i}`}
          className="absolute h-px bg-gradient-to-r from-transparent via-pink-500/20 to-transparent w-full"
          initial={{ 
            y: Math.random() * dimensions.height,
            scaleX: 0,
            opacity: 0
          }}
          animate={{
            scaleX: [0, 1, 0],
            opacity: [0, 0.5, 0],
            y: [null, Math.random() * dimensions.height]
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            ease: "linear",
            repeat: Infinity,
            delay: i * 2
          }}
        />
      ))}
    </div>
  );
};

// Enhanced stat card with hover effects
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
    className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 p-6 rounded-xl border border-blue-500/30 relative overflow-hidden group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <motion.div 
      className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-blue-500/10"
      initial={{ opacity: 0 }}
      whileHover={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    />
    <div className="flex items-start gap-4 relative z-10">
      <div className="bg-gradient-to-r from-pink-500 to-blue-600 p-3 rounded-lg text-white shadow-xl">
        {icon}
      </div>
      <div>
        <h3 className="text-gray-300 text-sm font-medium">{title}</h3>
        <p className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-blue-300 bg-clip-text text-transparent">{value}</p>
        <p className="text-gray-400 text-xs mt-1">{subtitle}</p>
      </div>
    </div>
    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
  </motion.div>
);

// Enhanced feature row with modern hover effects
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
    className={`grid grid-cols-3 gap-2 py-3 px-4 ${index % 2 === 0 ? 'bg-black/20' : 'bg-black/10'} rounded-lg my-1 hover:bg-gradient-to-r hover:from-blue-900/20 hover:to-pink-900/20 transition-all duration-300 group`}
  >
    <div className="text-gray-300 font-medium group-hover:text-white transition-colors">{feature}</div>
    <div className="text-center">
      {standard ? (
        <motion.div
          whileHover={{ scale: 1.2 }}
          className="inline-flex"
        >
          <FaCheck className="inline text-green-500 mx-auto" />
        </motion.div>
      ) : (
        <span className="text-gray-500">-</span>
      )}
    </div>
    <div className="text-center">
      <span className="text-blue-300 font-medium group-hover:text-blue-200 transition-colors relative">
        {withUs}
        <motion.div
          className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400/50"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
        />
      </span>
    </div>
  </motion.div>
);

// Enhanced testimonial component
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
    className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 p-6 rounded-xl border border-blue-500/30 relative overflow-hidden group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500"
  >
    <motion.div 
      className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-blue-500/5"
      initial={{ opacity: 0 }}
      whileHover={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    />
    <div className="flex flex-col gap-4 relative z-10">
      <div className="absolute top-0 right-0 text-8xl text-blue-500/10 font-serif">"</div>
      <p className="text-gray-300 italic relative z-10">{quote}</p>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white font-medium group-hover:text-blue-200 transition-colors">{author}</p>
          <p className="text-gray-400 text-sm">{role}, {company}</p>
        </div>
        <div className="bg-blue-900/50 px-4 py-2 rounded-lg text-center transform group-hover:scale-105 transition-transform">
          <p className="text-blue-300 text-xs">{metric}</p>
          <p className="text-white font-bold group-hover:text-blue-200 transition-colors">{metricValue}</p>
        </div>
      </div>
    </div>
    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
  </motion.div>
);

// Main page component
export default function ShopifyStorePage() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('growth');
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Animation to slide content into view
  useEffect(() => {
    setIsVisible(true);
    
    // Scroll to top when page loads
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
      {/* Background effects */}
      <FloatingElements />
      <div className="absolute top-0 left-0 w-full h-[70vh] bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-full h-[50vh] bg-gradient-to-t from-pink-900/20 to-transparent pointer-events-none"></div>
      
      {/* Back button */}
      <div className="fixed top-24 left-4 z-50">
        <Link href="/pricing" className="flex items-center space-x-2 bg-black/40 backdrop-blur-sm px-3 py-2 rounded-lg text-white/80 hover:text-white transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm">Back</span>
        </Link>
      </div>
      
      {/* Hero section with animated entrance */}
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
                <div className="bg-gradient-to-r from-pink-500 to-blue-600 p-4 rounded-xl inline-block">
                  <FaStore className="h-10 w-10 text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-400 via-blue-300 to-pink-400 bg-clip-text text-transparent">
                Shopify Store
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                Professional Shopify store development with AI sales optimization to maximize conversions and transform your brand's digital presence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={scrollToPricing}
                  className="bg-gradient-to-r from-pink-600 to-blue-700 px-8 py-4 rounded-lg text-white font-semibold flex items-center justify-center gap-2"
                >
                  Get Started <FaArrowRight className="h-4 w-4" />
                </motion.button>
                <Link href="/contact?plan=Shopify%20Store">
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
            
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
              <StatCard 
                icon={<FaChartLine className="h-6 w-6" />}
                title="Sales Growth"
                value="35-55%"
                subtitle="Within first 3 months"
                delay={0.2}
              />
              <StatCard 
                icon={<FaCreditCard className="h-6 w-6" />}
                title="Conversion Rate"
                value="3.2%"
                subtitle="Industry avg: 1.4%"
                delay={0.3}
              />
              <StatCard 
                icon={<FaUsers className="h-6 w-6" />}
                title="Customer Satisfaction"
                value="98%"
                subtitle="Based on 1,500+ surveys"
                delay={0.4}
              />
              <StatCard 
                icon={<FaMobileAlt className="h-6 w-6" />}
                title="Mobile Performance"
                value="96/100"
                subtitle="Google PageSpeed score"
                delay={0.5}
              />
            </div>
            
            {/* Tabbed Features Section */}
            <div ref={contentRef} className="mb-20">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl font-bold text-center mb-8"
              >
                How We Elevate Your Shopify Business
              </motion.h2>
              
              {/* Tab Navigation */}
              <div className="flex justify-center mb-8">
                <div className="inline-flex bg-black/50 backdrop-blur-sm p-1 rounded-lg">
                  {['growth', 'features', 'performance'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === tab 
                          ? 'bg-gradient-to-r from-pink-600 to-blue-700 text-white' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {tab === 'growth' && 'Growth'}
                      {tab === 'features' && 'Features'}
                      {tab === 'performance' && 'Performance'}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Tab Content */}
              <div className="bg-gradient-to-br from-gray-900/70 to-black/70 backdrop-blur-sm rounded-xl border border-blue-800/30 overflow-hidden">
                {/* Tab Header */}
                <div className="grid grid-cols-3 gap-2 bg-gradient-to-r from-blue-900/40 to-pink-900/40 p-4 rounded-t-xl">
                  {activeTab === 'growth' && (
                    <>
                      <div className="text-gray-300 font-semibold">Metric</div>
                      <div className="text-center text-gray-300 font-semibold">Standard Shopify</div>
                      <div className="text-center text-gray-300 font-semibold">With NEX-DEVS</div>
                    </>
                  )}
                  
                  {activeTab === 'features' && (
                    <>
                      <div className="text-gray-300 font-semibold">Feature</div>
                      <div className="text-center text-gray-300 font-semibold">Basic Shopify</div>
                      <div className="text-center text-gray-300 font-semibold">Our Solution</div>
                    </>
                  )}
                  
                  {activeTab === 'performance' && (
                    <>
                      <div className="text-gray-300 font-semibold">Performance</div>
                      <div className="text-center text-gray-300 font-semibold">Before</div>
                      <div className="text-center text-gray-300 font-semibold">After</div>
                    </>
                  )}
                </div>
                
                {/* Tab Body */}
                <div className="p-4">
                  {activeTab === 'growth' && (
                    <div className="space-y-1">
                      <FeatureRow feature="Conversion Rate" standard={true} withUs="2.3x higher" index={0} />
                      <FeatureRow feature="Average Order Value" standard={true} withUs="37% increase" index={1} />
                      <FeatureRow feature="Cart Abandonment" standard={true} withUs="55% reduction" index={2} />
                      <FeatureRow feature="Customer Lifetime Value" standard={true} withUs="78% higher" index={3} />
                      <FeatureRow feature="Return Customer Rate" standard={true} withUs="2.5x improvement" index={4} />
                      <FeatureRow feature="International Sales" standard={true} withUs="150% increase" index={5} />
                      <FeatureRow feature="Upselling Rate" standard={true} withUs="3.5x higher" index={6} />
                      <FeatureRow feature="Email Marketing ROI" standard={true} withUs="285% higher" index={7} />
                    </div>
                  )}
                  
                  {activeTab === 'features' && (
                    <div className="space-y-1">
                      <FeatureRow feature="AI Sales Optimization" standard={false} withUs="Included" index={0} />
                      <FeatureRow feature="Custom Theme Development" standard={false} withUs="Premium" index={1} />
                      <FeatureRow feature="Mobile-First Design" standard={true} withUs="Enhanced" index={2} />
                      <FeatureRow feature="Multi-Currency Support" standard={true} withUs="Advanced" index={3} />
                      <FeatureRow feature="Custom Checkout Flow" standard={false} withUs="Optimized" index={4} />
                      <FeatureRow feature="Abandoned Cart Recovery" standard={true} withUs="AI-Powered" index={5} />
                      <FeatureRow feature="Analytics Dashboard" standard={true} withUs="Custom Built" index={6} />
                      <FeatureRow feature="SEO Optimization" standard={true} withUs="Advanced" index={7} />
                    </div>
                  )}
                  
                  {activeTab === 'performance' && (
                    <div className="space-y-1">
                      <FeatureRow feature="Page Load Speed" standard={true} withUs="2.1x faster" index={0} />
                      <FeatureRow feature="Mobile Performance" standard={true} withUs="96/100 PSI" index={1} />
                      <FeatureRow feature="First Contentful Paint" standard={true} withUs="65% reduction" index={2} />
                      <FeatureRow feature="Image Optimization" standard={true} withUs="Next-gen formats" index={3} />
                      <FeatureRow feature="App Performance" standard={true} withUs="Code splitting" index={4} />
                      <FeatureRow feature="Core Web Vitals" standard={true} withUs="All Green" index={5} />
                      <FeatureRow feature="Server Response" standard={true} withUs="75% faster" index={6} />
                      <FeatureRow feature="CDN Integration" standard={true} withUs="Global Edge" index={7} />
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Feature Highlights */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
            >
              <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/10 p-6 rounded-xl border border-blue-500/30 flex flex-col">
                <div className="h-12 w-12 bg-gradient-to-r from-pink-500 to-blue-600 flex items-center justify-center rounded-lg mb-4">
                  <MdShoppingCart className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Professional Shopify Store Design</h3>
                <p className="text-gray-300 mb-4 text-sm flex-grow">Custom-designed Shopify store that perfectly represents your brand and optimizes the customer journey for maximum conversions.</p>
                <div className="border-t border-blue-800/50 pt-4 mt-2">
                  <p className="text-blue-400 text-sm font-semibold">Results: 94% customer approval</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/10 p-6 rounded-xl border border-blue-500/30 flex flex-col">
                <div className="h-12 w-12 bg-gradient-to-r from-pink-500 to-blue-600 flex items-center justify-center rounded-lg mb-4">
                  <MdAnalytics className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Sales Optimization</h3>
                <p className="text-gray-300 mb-4 text-sm flex-grow">Advanced AI algorithms that analyze customer behavior patterns and automatically adjust product recommendations to increase sales.</p>
                <div className="border-t border-blue-800/50 pt-4 mt-2">
                  <p className="text-blue-400 text-sm font-semibold">Results: 55% increase in AOV</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/10 p-6 rounded-xl border border-blue-500/30 flex flex-col">
                <div className="h-12 w-12 bg-gradient-to-r from-pink-500 to-blue-600 flex items-center justify-center rounded-lg mb-4">
                  <MdOutlineSpeed className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Mobile-First Responsive Design</h3>
                <p className="text-gray-300 mb-4 text-sm flex-grow">Optimized for mobile-first shopping experiences with lightning-fast performance and intuitive navigation on all devices.</p>
                <div className="border-t border-blue-800/50 pt-4 mt-2">
                  <p className="text-blue-400 text-sm font-semibold">Results: 82% mobile conversion</p>
                </div>
              </div>
            </motion.div>
            
            {/* Client Testimonial */}
            <div className="mb-20">
              <Testimonial 
                quote="NEX-DEVS delivered an exceptional Shopify store that exceeded our expectations. The AI sales optimization has dramatically increased our conversion rates and customer satisfaction. Their mobile-first approach has been a game-changer for our business."
                author="Jessica Williams"
                role="Founder"
                company="Luxury Homeware"
                metric="Sales Growth"
                metricValue="86%"
              />
            </div>
            
            {/* Pricing Section */}
            <div id="pricing-section" className="mb-12">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl font-bold text-center mb-8"
              >
                Shopify Store Package
              </motion.h2>
              
              <div className="bg-gradient-to-br from-blue-900/30 to-pink-800/20 rounded-xl border border-blue-500/30 overflow-hidden max-w-3xl mx-auto">
                <div className="bg-gradient-to-r from-blue-800/40 to-pink-800/40 px-6 py-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-white">Professional Shopify Solution</h3>
                    <div className="bg-gradient-to-r from-pink-500 to-blue-600 px-4 py-2 rounded-lg">
                      <span className="text-white font-bold">$900</span>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mt-1">Rs. 252,000 PKR</p>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <h4 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
                        <FaCheck className="h-4 w-4" /> Core Features
                      </h4>
                      <ul className="space-y-2 text-gray-300 text-sm">
                        <li className="flex items-start gap-2">
                          <FaCheck className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                          <span>Professional Shopify Store Design</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <FaCheck className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                          <span>AI Sales Optimization</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <FaCheck className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                          <span>35-55% Sales Growth Potential</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <FaCheck className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                          <span>Custom Theme Development</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
                        <FaCheck className="h-4 w-4" /> Advanced Features
                      </h4>
                      <ul className="space-y-2 text-gray-300 text-sm">
                        <li className="flex items-start gap-2">
                          <FaCheck className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                          <span>Mobile-First Responsive Design</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <FaCheck className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                          <span>Advanced Analytics Dashboard</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <FaCheck className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                          <span>SEO & Performance Optimization</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <FaCheck className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                          <span>6 Months Premium Support</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 justify-center">
                    <Link href="/contact?plan=Shopify%20Store">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-pink-600 to-blue-700 px-6 py-3 rounded-lg text-white font-semibold flex items-center justify-center gap-2"
                      >
                        Get Started <FaArrowRight className="h-4 w-4" />
                      </motion.button>
                    </Link>
                    <Link href="/contact">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-transparent border border-blue-500 px-6 py-3 rounded-lg text-blue-400 font-semibold hover:bg-blue-900/20 transition-colors"
                      >
                        Contact Us
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-6 text-gray-400 text-sm">
                <p>Need a custom solution? <Link href="/contact" className="text-blue-400 hover:underline">Contact us</Link> for personalized pricing.</p>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Premium Features Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-center mb-16 bg-gradient-to-r from-pink-400 via-blue-300 to-pink-400 bg-clip-text text-transparent"
          >
            Premium E-commerce Features
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🚀",
                title: "AI-Powered Product Recommendations",
                description: "Boost sales with intelligent product suggestions based on user behavior and preferences."
              },
              {
                icon: "⚡",
                title: "Lightning-Fast Performance",
                description: "Optimized loading speeds with next-gen image formats and efficient caching."
              },
              {
                icon: "🎯",
                title: "Advanced Analytics Dashboard",
                description: "Real-time insights into sales, customer behavior, and inventory management."
              },
              {
                icon: "🔒",
                title: "Enhanced Security Features",
                description: "Premium security measures including fraud detection and SSL encryption."
              },
              {
                icon: "🌐",
                title: "Multi-Currency Support",
                description: "Seamless international transactions with automatic currency conversion."
              },
              {
                icon: "📱",
                title: "Progressive Web App",
                description: "App-like experience with offline capabilities and push notifications."
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative p-6 rounded-xl border border-blue-500/30 bg-black/50 backdrop-blur-sm hover:border-pink-500/50 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                <span className="text-4xl mb-4 block">{feature.icon}</span>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-200 transition-colors">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Ecosystem Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-center mb-16 bg-gradient-to-r from-pink-400 via-blue-300 to-pink-400 bg-clip-text text-transparent"
          >
            Premium Integration Ecosystem
          </motion.h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Payment Gateways", count: "15+" },
              { name: "Marketing Tools", count: "25+" },
              { name: "Analytics Platforms", count: "10+" },
              { name: "Shipping Providers", count: "20+" },
              { name: "Social Media", count: "12+" },
              { name: "Email Marketing", count: "8+" },
              { name: "Inventory Systems", count: "15+" },
              { name: "CRM Platforms", count: "10+" }
            ].map((integration, index) => (
              <motion.div
                key={integration.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group relative p-4 rounded-xl border border-blue-500/30 bg-black/50 backdrop-blur-sm hover:border-pink-500/50 transition-all duration-300 text-center"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-200 transition-colors">{integration.name}</h3>
                <p className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-blue-300 bg-clip-text text-transparent">{integration.count}</p>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
} 
