'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import NexShiftFlowchart from './NexShiftFlowchart'

// Business benefits for showcase
const businessBenefits = [
  {
    title: "Grow Revenue",
    description: "Increase your conversion rate and revenue with our proven tactics",
    icon: "📈"
  },
  {
    title: "Expand Reach",
    description: "Reach new customers through optimized digital channels",
    icon: "🌐"
  },
  {
    title: "Save Time",
    description: "Automate processes and focus on what matters most for your business",
    icon: "⏱️"
  },
  {
    title: "Scale Efficiently",
    description: "Our solutions grow with your business needs",
    icon: "🚀"
  }
]

// Advanced technology features
const advancedFeatures = [
  {
    title: "AI Integration",
    description: "Custom AI solutions that adapt to your business needs",
    icon: "🧠",
    details: ["Chatbot Integration", "Smart Content Generation", "User Behavior Analysis"]
  },
  {
    title: "3D Experiences",
    description: "Immersive 3D elements that engage users and improve brand perception",
    icon: "🌐",
    details: ["Three.js Scenes", "3D Product Showcases", "Interactive Elements"]
  },
  {
    title: "Serverless Architecture",
    description: "Modern cloud solutions for scalability and performance",
    icon: "☁️",
    details: ["AWS/Azure/GCP", "Microservices", "Edge Computing"]
  },
  {
    title: "Mobile-First Design",
    description: "Responsive solutions that prioritize mobile experiences",
    icon: "📱",
    details: ["React Native", "PWA Support", "Cross-platform Compatibility"]
  }
]

// Core technologies
const coreTechnologies = [
  { name: "React + Next.js", level: 99, color: "bg-blue-500" },
  { name: "Node.js & Express", level: 95, color: "bg-green-500" },
  { name: "TypeScript", level: 97, color: "bg-blue-400" },
  { name: "Three.js & WebGL", level: 90, color: "bg-purple-500" },
  { name: "TensorFlow & AI", level: 85, color: "bg-orange-500" },
  { name: "AWS Cloud Suite", level: 88, color: "bg-yellow-500" }
]

interface CounterAnimationProps {
  end: number;
  label: string;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

// Counter animation for metrics
const CounterAnimation = ({ end, label, duration = 2, prefix = '', suffix = '' }: CounterAnimationProps) => {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    let startTime: number | undefined;
    let frameId: number;
    
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        frameId = window.requestAnimationFrame(step);
      }
    };
    
    frameId = window.requestAnimationFrame(step);
    
    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [end, duration]);

  return (
    <div className="text-center">
      <div className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
        {prefix}{count}{suffix}
      </div>
      <div className="text-sm text-gray-400 mt-1">{label}</div>
    </div>
  )
}

export default function BusinessHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  // Parallax effect values
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // State for animated gradient
  const [gradientPosition, setGradientPosition] = useState({ x: 0, y: 0 });
  
  // Mouse movement effect for 3D feeling - optimized with throttling
  useEffect(() => {
    let throttleTimeout: NodeJS.Timeout | null = null;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (throttleTimeout === null) {
        throttleTimeout = setTimeout(() => {
          const { clientX, clientY } = e;
          const x = (clientX / window.innerWidth) * 100;
          const y = (clientY / window.innerHeight) * 100;
          setGradientPosition({ x, y });
          throttleTimeout = null;
        }, 50); // 50ms throttle
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (throttleTimeout) clearTimeout(throttleTimeout);
    };
  }, []);

  return (
    <motion.section
      ref={containerRef}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
      }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen flex flex-col justify-center py-20 px-6 mt-16 sm:mt-20 bg-black will-change-transform overflow-hidden"
      style={{transform: 'translate3d(0, 0, 0)'}}
    >
      {/* Dark background base */}
      <div className="fixed inset-0 bg-[#050509] z-[-2]" style={{transform: 'translate3d(0, 0, 0)'}}></div>
      
      {/* Modern mesh gradient background */}
      <div className="fixed inset-0 z-[-1] opacity-40 pointer-events-none" 
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.08), transparent 50%)`,
          transform: 'translate3d(0, 0, 0)'
        }}
      ></div>

      {/* Mesh grid overlay */}
      <div className="fixed inset-0 z-[-1] opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(99, 102, 241, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          transform: 'translate3d(0, 0, 0)'
        }}
      ></div>
      
      {/* Animated mesh blobs */}
      <div className="fixed inset-0 z-[-1] overflow-hidden">
        {/* Blob 1 */}
        <div className="absolute w-[600px] h-[600px] rounded-full bg-purple-900/10 blur-[100px] opacity-40 animate-blob"
          style={{ 
            top: '10%', 
            left: '10%',
            animation: 'blob 25s infinite alternate ease-in-out',
            transform: 'translate3d(0, 0, 0)'
          }}
        ></div>
        
        {/* Blob 2 */}
        <div className="absolute w-[500px] h-[500px] rounded-full bg-indigo-900/10 blur-[80px] opacity-40 animate-blob"
          style={{ 
            bottom: '5%', 
            right: '20%',
            animation: 'blob 20s infinite alternate-reverse ease-in-out',
            animationDelay: '5s',
            transform: 'translate3d(0, 0, 0)'
          }}
        ></div>
        
        {/* Blob 3 */}
        <div className="absolute w-[400px] h-[400px] rounded-full bg-blue-900/10 blur-[60px] opacity-40 animate-blob"
          style={{ 
            top: '40%', 
            right: '10%',
            animation: 'blob 30s infinite alternate ease-in-out',
            animationDelay: '7s',
            transform: 'translate3d(0, 0, 0)'
          }}
        ></div>
      </div>
      
      {/* Animated diagonal mesh lines */}
      <div className="fixed inset-0 z-[-1] opacity-10 pointer-events-none animate-pulse">
        <div className="absolute w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, transparent 2%, transparent 98%, rgba(139, 92, 246, 0.15) 100%)
            `,
            backgroundSize: '200px 200px',
            animation: 'meshFloat 30s linear infinite',
            transform: 'translate3d(0, 0, 0)'
          }}
        ></div>
      </div>

      {/* Dynamic gradient background that follows mouse */}
      <div 
        className="absolute inset-0 opacity-60 transition-transform duration-[1.5s] ease-out pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${gradientPosition.x}% ${gradientPosition.y}%, rgba(139, 92, 246, 0.15), rgba(30, 27, 75, 0.05) 30%, transparent 60%)`,
          transform: 'translate3d(0, 0, 0)'
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full relative z-10">
        {/* Main hero section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
          {/* Left content - enhanced copy */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 text-purple-300 text-sm">
                <span className="mr-2">✨</span>NEX-DEVS Technology Solutions
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
                Grow Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Business</span> With Data-Driven Solutions
              </h1>
              
              <p className="text-xl text-gray-300 max-w-3xl">
                We help transform your web traffic into paying customers with our proven NEX-SHFT mechanism, delivering up to <span className="text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-blue-400 font-semibold">55% higher conversion rates</span>.
              </p>
              
              {/* Key points with icons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {[
                  { text: "AI-Powered Solutions", icon: "🧠" },
                  { text: "Modern 3D Web Experiences", icon: "🌐" },
                  { text: "Mobile-First Development", icon: "📱" },
                  { text: "Enterprise-Grade Security", icon: "🔒" }
                ].map((point, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + (i * 0.1) }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                      <span>{point.icon}</span>
                    </div>
                    <span className="text-gray-300 text-sm">{point.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <Link href="/discovery-call">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-6 h-auto text-base rounded-lg shadow-lg shadow-purple-600/20 flex items-center gap-2 group">
                  Book Free Discovery Call
                  <motion.span 
                    animate={{ x: [0, 5, 0] }} 
                    transition={{ duration: 1.5, repeat: Infinity }} 
                    className="text-lg group-hover:translate-x-1 transition-transform"
                  >
                    →
                  </motion.span>
                </Button>
              </Link>
              
              <Link href="/projects">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-6 py-6 h-auto text-base rounded-lg">
                  View Case Studies
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right content - Enhanced Business metrics */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-5"
          >
            <div className="bg-gradient-to-br from-black via-purple-950/10 to-black backdrop-blur-lg border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
              {/* Background glow effects */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-md"></div>
              
              <div className="relative">
                <h3 className="text-xl text-white font-semibold mb-6 flex items-center gap-2">
                  <span className="text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-blue-400">★</span> Our Impact in Numbers
                </h3>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-purple-500/30 transition-all duration-300 group">
                    <CounterAnimation end={55} suffix="%" label="Higher Conversion" />
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-purple-500/30 transition-all duration-300 group">
                    <CounterAnimation end={200} suffix="+" label="Satisfied Clients" />
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-purple-500/30 transition-all duration-300 group">
                    <CounterAnimation end={40} suffix="%" label="Cost Reduction" />
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-purple-500/30 transition-all duration-300 group">
                    <CounterAnimation end={83} suffix="%" label="Client Retention" />
                  </div>
                </div>
  
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Trusted & Verified by</span>
                    <span className="text-xs text-purple-400">View all clients →</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 py-2">
                    <div className="flex -space-x-2">
                      {/* Client avatars */}
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400/20 to-blue-500/20 flex items-center justify-center border border-white/10 transition-transform hover:scale-110">
                          <span className="text-xs text-white/80">{i}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400 text-sm">★★★★★</span>
                      <span className="text-xs text-white/70">5.0/5</span>
                    </div>
                  </div>
                </div>
                
                {/* Tech skills showcase */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h4 className="text-base text-white/80 font-medium mb-4">Core Technologies</h4>
                  <div className="space-y-3">
                    {coreTechnologies.map((tech, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">{tech.name}</span>
                          <span className="text-gray-400">{tech.level}%</span>
                        </div>
                        <div className="h-1 bg-white/[0.03] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${tech.level}%` }}
                            transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                            className={`h-full ${tech.color}/70 rounded-full`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Advanced features showcase */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-24"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Advanced Technology Solutions</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Our expertly crafted solutions leverage cutting-edge technologies to give your business a competitive advantage</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {advancedFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="group bg-gradient-to-br from-black via-purple-950/5 to-black backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-purple-500/30 transition-all duration-300 relative overflow-hidden"
              >
                {/* Subtle glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-blue-600/0 opacity-0 group-hover:from-purple-600/10 group-hover:to-blue-600/10 group-hover:opacity-100 transition-all duration-500 pointer-events-none"></div>
                
                <div className="flex items-start gap-5 mb-5">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-2xl">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </div>
                </div>
                
                <div className="pl-[68px]">
                  <div className="flex flex-wrap gap-2">
                    {feature.details.map((detail, i) => (
                      <span 
                        key={i}
                        className="px-2 py-1 text-xs rounded-full bg-white/5 border border-white/10 text-gray-300 group-hover:bg-white/10 group-hover:border-purple-500/30 transition-all duration-300"
                      >
                        {detail}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Business benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-24"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">How We Help Your Business Grow</h2>
            <p className="text-gray-400 mt-2 max-w-2xl mx-auto">Our comprehensive approach addresses key areas to help your business thrive in the digital landscape</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {businessBenefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="bg-gradient-to-br from-black via-purple-950/5 to-black backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:bg-white/[0.02] transition-all hover:border-purple-500/20 relative overflow-hidden group"
              >
                {/* Hover animation effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/5 group-hover:to-blue-500/5 transition-all duration-500"></div>
                
                <div className="relative">
                  <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 mb-4 text-2xl group-hover:from-purple-500/20 group-hover:to-blue-500/20 transition-all duration-300">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-200 transition-colors duration-300">{benefit.title}</h3>
                  <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* NEX-SHFT Methodology Flowchart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-24 pt-10 border-t border-white/10"
        >
          <NexShiftFlowchart />
        </motion.div>
        
        {/* Client logos section - optimized for performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-20 pt-12 border-t border-white/10"
        >
          <div className="text-center mb-10">
            <h3 className="text-lg text-white/70 uppercase tracking-wider font-medium">Trusted by industry leaders</h3>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-8 sm:gap-12 items-center">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0.3 }}
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  delay: i * 0.2,
                  ease: "easeInOut" 
                }}
                className="flex items-center justify-center"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400/20 to-blue-500/20 flex items-center justify-center">
                    <span className="text-lg text-white/40">{i+1}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA section with 3D effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-20 relative rounded-2xl p-8 sm:p-10 text-center overflow-hidden group"
        >
          {/* 3D background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-white/10 rounded-2xl z-0 
                        group-hover:from-purple-900/30 group-hover:to-blue-900/30 transition-all duration-700"></div>
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-10 rounded-2xl z-0"
               style={{backgroundSize: '50px 50px'}}></div>
          
          {/* Floating 3D elements */}
          <motion.div 
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, 0]
            }} 
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-gradient-to-br from-purple-500/20 to-transparent blur-2xl z-0"
          ></motion.div>
          
          <motion.div 
            animate={{ 
              y: [0, 10, 0],
              rotate: [0, -3, 0]
            }} 
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-gradient-to-br from-blue-500/20 to-transparent blur-2xl z-0"
          ></motion.div>
          
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Transform Your Business?</h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8">Book a free discovery call with our team to explore how we can help you achieve your business goals with our advanced technology solutions.</p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/discovery-call">
                <Button className="bg-white text-black hover:bg-gray-100 px-6 py-6 h-auto text-base rounded-lg shadow-lg flex items-center gap-2 group">
                  Schedule Your Free Call
                  <motion.span 
                    animate={{ x: [0, 5, 0] }} 
                    transition={{ duration: 1.5, repeat: Infinity }} 
                    className="text-lg group-hover:translate-x-1 transition-transform"
                  >
                    →
                  </motion.span>
                </Button>
              </Link>
              
              <Link href="/services">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-6 py-6 h-auto text-base rounded-lg">
                  Explore All Services
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
} 