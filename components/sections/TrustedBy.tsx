import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

// Redesigned company display with minimal styling
const companies = [
  { name: 'GitHub', symbol: '/' },
  { name: 'Webflow', symbol: '~' },
  { name: 'Spline', symbol: '+' },
  { name: 'Fiverr', symbol: '$' },
  { name: 'Upwork', symbol: '_' },
  { name: 'LinkedIn', symbol: '•' },
  { name: 'Supabase', symbol: '◆' },
  { name: 'Dribbble', symbol: '.' },
  { name: 'Vercel', symbol: '△' }
]

export default function TrustedBy() {
  return (
    <div className="w-full py-8 sm:py-12 overflow-hidden relative">
      {/* Enhanced Gradient Background that matches hero section */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black/80"></div>
        
        {/* Blurred light spots for visual interest */}
        <div className="absolute top-1/3 left-1/4 w-[700px] h-[400px] bg-gradient-to-r from-purple-500/8 to-pink-500/8 rounded-full blur-[180px]"></div>
        <div className="absolute bottom-1/3 right-1/4 w-[700px] h-[400px] bg-gradient-to-r from-violet-500/8 to-indigo-500/8 rounded-full blur-[180px]"></div>
        
        {/* Subtle mesh grid overlay */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.png')] bg-repeat opacity-5"></div>
        
        {/* Side blur effects to soften edges */}
        <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-black via-black/95 to-transparent z-10 pointer-events-none blur-[3px]"></div>
        <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-black via-black/95 to-transparent z-10 pointer-events-none blur-[3px]"></div>
      </div>
      
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

        {/* Mobile Grid Layout */}
        <div className="block md:hidden">
          <div className="grid grid-cols-3 gap-4 text-center">
            {companies.map((company, index) => (
              <motion.div
                key={`mobile-${company.name}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                whileHover={{ scale: 1.05 }}
                className="px-3 py-1.5 bg-gradient-to-r from-purple-900/10 to-pink-900/10 backdrop-blur-xl rounded-full shadow-[0_0_15px_rgba(168,85,247,0.05)] hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300"
              >
                <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-pink-100">
                  {company.name}<span className="text-purple-400 ml-1">{company.symbol}</span>
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Desktop Static Grid with Beautiful Styling */}
        <div className="hidden md:block">
          <div className="flex flex-wrap justify-center gap-6">
            {companies.map((company, index) => (
              <motion.div
                key={`desktop-${company.name}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: index * 0.05, 
                  duration: 0.4,
                  ease: [0.21, 0.6, 0.35, 1] // Custom easing for smoother animation
                }}
                whileHover={{ 
                  scale: 1.1,
                  transition: { 
                    duration: 0.2, 
                    ease: "easeOut" 
                  }
                }}
                className="group px-5 py-2 bg-gradient-to-r from-purple-900/10 to-pink-900/10 backdrop-blur-xl rounded-full shadow-[0_0_15px_rgba(168,85,247,0.05)] hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300"
              >
                <span className="text-base font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-pink-100 whitespace-nowrap transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]">
                  <span className="opacity-70">{index % 2 === 0 ? '[' : '{'}</span>
                  {company.name}
                  <span className="text-purple-400 mx-1">{company.symbol}</span>
                  <span className="opacity-70">{index % 2 === 0 ? ']' : '}'}</span>
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 