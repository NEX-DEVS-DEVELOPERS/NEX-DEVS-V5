'use client'

import { motion } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'

const companies = [
  { name: 'GitHub', className: 'text-white' },
  { name: 'Webflow', className: 'text-blue-400' },
  { name: 'Spline', className: 'text-green-400' },
  { name: 'Fiverr', className: 'text-green-500' },
  { name: 'Upwork', className: 'text-green-400' },
  { name: 'LinkedIn', className: 'text-blue-500' },
  { name: 'Supabase', className: 'text-emerald-500' },
  { name: 'Dribbble', className: 'text-pink-500' },
  { name: 'Vercel', className: 'text-white' },
  { name: 'Netlify', className: 'text-teal-400' }
]

// Updated colors to match website theme
const companiesWithTheme = [
  { name: 'GitHub', className: 'bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200' },
  { name: 'Webflow', className: 'bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300' },
  { name: 'Spline', className: 'bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-violet-300' },
  { name: 'Fiverr', className: 'bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-300' },
  { name: 'Upwork', className: 'bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-200' },
  { name: 'LinkedIn', className: 'bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300' },
  { name: 'Supabase', className: 'bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-purple-300' },
  { name: 'Dribbble', className: 'bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-rose-300' },
  { name: 'Vercel', className: 'bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300' },
  { name: 'Netlify', className: 'bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-violet-100' }
]

export default function TrustedCompanies() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Use IntersectionObserver to only animate when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative py-16 overflow-hidden bg-black/30 backdrop-blur-xl will-change-transform"
    >
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-[600px] h-[300px] bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute top-1/2 right-1/4 w-[600px] h-[300px] bg-gradient-to-r from-violet-500/20 to-indigo-500/20 rounded-full blur-[120px] animate-pulse-slower"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]"></div>
      </div>
      
      {/* Enhanced Gradient Overlays */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black via-black/80 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black via-black/80 to-transparent z-10 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-[1]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <motion.div 
            className="inline-block"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <span className="text-sm sm:text-base text-gray-300 font-medium uppercase tracking-wider bg-gradient-to-r from-purple-900/30 to-pink-900/30 px-6 py-2 rounded-full backdrop-blur-xl border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
              Trusted By
            </span>
          </motion.div>
        </motion.div>

        {/* Mobile Carousel */}
        <div className="block md:hidden overflow-hidden">
          <div className="flex flex-wrap justify-center gap-4 py-2">
            {companiesWithTheme.map((company, index) => (
              <motion.div
                key={`mobile-${company.name}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="px-4 py-2 bg-gradient-to-r from-purple-900/20 to-pink-900/20 backdrop-blur-xl rounded-full border border-purple-500/20 hover:border-purple-500/50 transition-all duration-500 shadow-[0_0_15px_rgba(168,85,247,0.1)] hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]"
              >
                <span className={`text-sm font-medium ${company.className}`}>
                  {company.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Desktop Infinite Carousel */}
        <div className="hidden md:block">
          {/* First Row - Left to Right */}
          <div className="relative overflow-hidden h-20 mb-8">
            <div 
              className={`absolute flex space-x-24 ${isVisible ? 'animate-smooth-marquee' : ''}`}
              style={{ willChange: 'transform' }}
            >
              {[...companiesWithTheme, ...companiesWithTheme, ...companiesWithTheme].map((company, index) => (
                <motion.div
                  key={`row1-${company.name}-${index}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ 
                    scale: 1.1,
                    y: -5,
                    transition: { type: "spring", stiffness: 400, damping: 10 }
                  }}
                  className="flex-shrink-0 cursor-pointer group"
                >
                  <span className={`text-2xl font-bold ${company.className} whitespace-nowrap transition-all duration-500 group-hover:drop-shadow-[0_0_12px_rgba(168,85,247,0.5)]`}>
                    {company.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Second Row - Right to Left */}
          <div className="relative overflow-hidden h-20">
            <div 
              className={`absolute flex space-x-24 ${isVisible ? 'animate-smooth-marquee-reverse' : ''}`}
              style={{ willChange: 'transform' }}
            >
              {[...companiesWithTheme.reverse(), ...companiesWithTheme, ...companiesWithTheme].map((company, index) => (
                <motion.div
                  key={`row2-${company.name}-${index}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ 
                    scale: 1.1,
                    y: -5,
                    transition: { type: "spring", stiffness: 400, damping: 10 }
                  }}
                  className="flex-shrink-0 cursor-pointer group"
                >
                  <span className={`text-2xl font-bold ${company.className} whitespace-nowrap transition-all duration-500 group-hover:drop-shadow-[0_0_12px_rgba(168,85,247,0.5)]`}>
                    {company.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes smooth-marquee {
          0% {
            transform: translateX(0) translateZ(0);
          }
          100% {
            transform: translateX(-33.33%) translateZ(0);
          }
        }
        
        @keyframes smooth-marquee-reverse {
          0% {
            transform: translateX(-33.33%) translateZ(0);
          }
          100% {
            transform: translateX(0) translateZ(0);
          }
        }
        
        .animate-smooth-marquee {
          animation: smooth-marquee 45s linear infinite;
          animation-fill-mode: forwards;
          will-change: transform;
        }
        
        .animate-smooth-marquee-reverse {
          animation: smooth-marquee-reverse 45s linear infinite;
          animation-fill-mode: forwards;
          will-change: transform;
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        @keyframes pulse-slower {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.5; }
        }

        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }

        .animate-pulse-slower {
          animation: pulse-slower 8s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
} 