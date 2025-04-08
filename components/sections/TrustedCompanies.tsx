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

// New sleek logo designs with strokes and accent colors
const logoDesigns = {
  GitHub: {
    before: "[ ",
    after: " ]",
    accent: "/"
  },
  Webflow: {
    before: "{ ",
    after: " }",
    accent: "~"
  },
  Spline: {
    before: "< ",
    after: " >",
    accent: "+"
  },
  Fiverr: {
    before: "« ",
    after: " »",
    accent: "$"
  },
  Upwork: {
    before: "// ",
    after: "",
    accent: "_"
  },
  LinkedIn: {
    before: "| ",
    after: " |",
    accent: "•"
  },
  Supabase: {
    before: "⟦ ",
    after: " ⟧",
    accent: "◆"
  },
  Dribbble: {
    before: "★ ",
    after: "",
    accent: "."
  },
  Vercel: {
    before: "→ ",
    after: "",
    accent: "△"
  },
  Netlify: {
    before: "{ ",
    after: " }",
    accent: "*"
  }
}

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

  const renderCompanyLogo = (company: any) => {
    const design = logoDesigns[company.name as keyof typeof logoDesigns];
    return (
      <span className={`text-2xl font-bold ${company.className} whitespace-nowrap transition-all duration-500 group-hover:drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]`}>
        <span className="opacity-70">{design.before}</span>
        <span>{company.name}</span>
        <span className="text-purple-400 mx-1">{design.accent}</span>
        <span className="opacity-70">{design.after}</span>
      </span>
    );
  };

  return (
    <section 
      ref={sectionRef}
      className="relative -mt-10 pt-16 pb-10 overflow-hidden bg-transparent will-change-transform"
    >
      {/* Enhanced Gradient Background that blends with hero */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black/80"></div>
        
        {/* Blurred light spots */}
        <div className="absolute top-1/3 left-1/4 w-[700px] h-[400px] bg-gradient-to-r from-purple-500/8 to-pink-500/8 rounded-full blur-[180px] animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 right-1/4 w-[700px] h-[400px] bg-gradient-to-r from-violet-500/8 to-indigo-500/8 rounded-full blur-[180px] animate-pulse-slower"></div>
        
        {/* Subtle mesh grid overlay */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.png')] bg-repeat opacity-5"></div>
        
        {/* Vignette effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.8)_100%)]"></div>
      </div>
      
      {/* Enhanced Side Blur Effects */}
      <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-black via-black/95 to-transparent z-10 pointer-events-none blur-[3px]"></div>
      <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-black via-black/95 to-transparent z-10 pointer-events-none blur-[3px]"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-[1]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <motion.div 
            className="inline-block"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <span className="text-sm sm:text-base text-purple-200 font-medium uppercase tracking-wider px-6 py-1.5 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full backdrop-blur-xl shadow-[0_0_20px_rgba(168,85,247,0.15)]">
              Trusted By
            </span>
          </motion.div>
        </motion.div>

        {/* Mobile Carousel */}
        <div className="block md:hidden overflow-hidden">
          <div className="flex flex-wrap justify-center gap-3 py-1">
            {companiesWithTheme.map((company, index) => (
              <motion.div
                key={`mobile-${company.name}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="px-3 py-1.5 bg-gradient-to-r from-purple-900/10 to-pink-900/10 backdrop-blur-xl rounded-full shadow-[0_0_15px_rgba(168,85,247,0.05)] hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-500"
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
          <div className="relative overflow-hidden h-16 mb-6">
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
                    y: -3,
                    transition: { type: "spring", stiffness: 300, damping: 15 }
                  }}
                  className="flex-shrink-0 cursor-pointer group"
                >
                  {renderCompanyLogo(company)}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Second Row - Right to Left */}
          <div className="relative overflow-hidden h-16">
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
                    y: -3,
                    transition: { type: "spring", stiffness: 300, damping: 15 }
                  }}
                  className="flex-shrink-0 cursor-pointer group"
                >
                  {renderCompanyLogo(company)}
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
          animation: smooth-marquee 60s linear infinite;
          animation-fill-mode: forwards;
          will-change: transform;
        }
        
        .animate-smooth-marquee-reverse {
          animation: smooth-marquee-reverse 60s linear infinite;
          animation-fill-mode: forwards;
          will-change: transform;
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.3; }
        }

        @keyframes pulse-slower {
          0%, 100% { opacity: 0.08; }
          50% { opacity: 0.2; }
        }

        .animate-pulse-slow {
          animation: pulse-slow 12s ease-in-out infinite;
        }

        .animate-pulse-slower {
          animation: pulse-slower 15s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
} 