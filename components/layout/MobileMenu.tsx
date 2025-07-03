'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { useIsMobile } from '@/app/utils/deviceDetection'
import { PhoneIcon } from '@heroicons/react/24/solid'

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useIsMobile()

  const menuItems = [
    ['Home', '/'],
    ['Services', '/services'],
    ['About', '/about'],
    ['Work', '/work'],
    ['Blog', '/blog'],
    ['FAQs', '/faqs'],
    ['Contact', '/contact'],
    ['Pricing', '/pricing']
  ]

  const menuVariants: Variants = {
    closed: {
      x: '100%',
      opacity: 0.9,
      boxShadow: '0 0 0 0 rgba(139, 92, 246, 0)',
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 250,
        when: "afterChildren",
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    open: {
      x: '0%',
      opacity: 1,
      boxShadow: '0 0 20px 2px rgba(139, 92, 246, 0.6)',
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 180,
        mass: 0.8,
        staggerChildren: 0.06,
        delayChildren: 0.08,
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }

  const itemVariants: Variants = {
    closed: {
      y: 8,
      x: 15,
      opacity: 0,
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 250,
        duration: 0.2
      }
    },
    open: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 180,
        mass: 0.8,
        delay: 0.05
      }
    }
  }

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-50 p-2 group"
        aria-label="Toggle Menu"
      >
        <div className="flex flex-col justify-between w-6 h-5">
          <motion.span
            animate={isOpen 
              ? { rotate: 45, y: 8, backgroundColor: "#8b5cf6" } 
              : { rotate: 0, y: 0, backgroundColor: "currentColor" }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-full h-[2px] bg-current block transition-all duration-300 group-hover:w-3/4"
          />
          <motion.span
            animate={isOpen 
              ? { opacity: 0, x: -10, backgroundColor: "#8b5cf6" } 
              : { opacity: 1, x: 0, backgroundColor: "currentColor" }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-3/4 h-[2px] bg-current block transition-all duration-300 group-hover:w-full"
          />
          <motion.span
            animate={isOpen 
              ? { rotate: -45, y: -8, backgroundColor: "#8b5cf6" } 
              : { rotate: 0, y: 0, backgroundColor: "currentColor" }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-full h-[2px] bg-current block transition-all duration-300 group-hover:w-1/2"
          />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 will-change-transform"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed top-4 right-4 h-auto max-h-[80vh] w-[220px] rounded-xl bg-black/80 z-40 origin-right will-change-transform overflow-hidden border border-purple-500 mobile-menu-neon"
            style={{
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              transform: 'translateZ(0)'
            }}
          >
            {/* Neon border glow effect */}
            <motion.div 
              className="absolute inset-0 rounded-xl pointer-events-none will-change-transform"
              animate={{
                boxShadow: ['0 0 8px 1px rgba(139, 92, 246, 0.4)', '0 0 12px 2px rgba(139, 92, 246, 0.6)', '0 0 8px 1px rgba(139, 92, 246, 0.4)'],
                borderColor: ['rgba(139, 92, 246, 0.6)', 'rgba(139, 92, 246, 0.8)', 'rgba(139, 92, 246, 0.6)']
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.5, 1]
              }}
            />
            
            {/* Animated corner accents */}
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-purple-500 rounded-tr-xl" />
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-purple-500 rounded-tl-xl" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-purple-500 rounded-br-xl" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-purple-500 rounded-bl-xl" />
            
            {/* Content container */}
            <div className="relative flex flex-col justify-start h-full px-4 pt-8 pb-6">
              <div className="space-y-3 overflow-y-auto custom-scrollbar max-h-[60vh]">
                {menuItems.map(([text, href], index) => (
                  <motion.div
                    key={text}
                    custom={index}
                    variants={itemVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    className="overflow-hidden"
                    style={{ 
                      transitionDelay: `${index * 0.08}s`
                    }}
                  >
                    <Link
                      href={href}
                      className="group relative block text-sm font-medium text-white/95 transition-all duration-300 hover:text-white"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="relative z-10 block transform transition-all duration-200 ease-out group-hover:translate-x-1 will-change-transform">
                        {text}
                        <motion.span 
                          className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-purple-500 to-transparent w-0 group-hover:w-full will-change-transform"
                          transition={{ duration: 0.2 }}
                        />
                      </span>
                      <motion.div
                        className="absolute inset-0 w-0 opacity-0 bg-gradient-to-r from-purple-600/10 to-transparent rounded-sm -z-10 will-change-transform"
                        animate={{
                          width: ["0%", "0%"],
                          opacity: [0, 0]
                        }}
                        whileHover={{
                          width: "100%",
                          opacity: 1,
                          transition: { duration: 0.2 }
                        }}
                      />
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  variants={itemVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  className="pt-3"
                  style={{ 
                    transitionDelay: `${menuItems.length * 0.08}s`
                  }}
                >
                  <Link 
                    href="/discovery-call"
                    className="discovery-call-button flex items-center gap-2 w-full justify-center py-2 text-sm relative overflow-hidden group will-change-transform"
                    onClick={() => setIsOpen(false)}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-600/80 to-indigo-600/80 opacity-0 group-hover:opacity-100 will-change-transform"
                      transition={{ duration: 0.2 }}
                    />
                    <PhoneIcon className="h-3 w-3 relative z-10" />
                    <span className="relative z-10">Discovery Call</span>
                  </Link>
                </motion.div>
              </div>
            </div>

            <style jsx global>{`
              .custom-scrollbar::-webkit-scrollbar {
                width: 2px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: transparent;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background-color: rgba(139, 92, 246, 0.4);
                border-radius: 20px;
              }
            `}</style>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}