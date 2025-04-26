'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useIsMobile } from '@/app/utils/deviceDetection'
import FloatingActionButton from '@/app/components/FloatingActionButton'

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

  const menuVariants = {
    closed: {
      clipPath: 'circle(0% at calc(100% - 48px) 28px)',
      opacity: 0,
      scale: 0.95,
      transition: {
        type: "spring",
        damping: 40,
        stiffness: 300,
        when: "afterChildren",
        duration: 0.5
      }
    },
    open: {
      clipPath: 'circle(150% at calc(100% - 48px) 28px)',
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 40,
        stiffness: 200,
        mass: 0.8,
        staggerChildren: 0.08,
        delayChildren: 0.3,
        duration: 0.6
      }
    }
  }

  const itemVariants = {
    closed: {
      y: 20,
      x: -20,
      opacity: 0,
      transition: {
        type: "spring",
        damping: 40,
        stiffness: 300
      }
    },
    open: (i: number) => ({
      y: 0,
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 200,
        mass: 0.8,
        delay: i * 0.1
      }
    })
  }

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-50 p-2 group"
        aria-label="Toggle Menu"
      >
        <div className="flex flex-col justify-between w-7 h-6">
          <motion.span
            animate={isOpen 
              ? { rotate: 45, y: 10, backgroundColor: "#4B5563" } 
              : { rotate: 0, y: 0, backgroundColor: "currentColor" }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-full h-[2px] bg-current block transition-all duration-300 group-hover:w-3/4"
          />
          <motion.span
            animate={isOpen 
              ? { opacity: 0, x: -10 } 
              : { opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-3/4 h-[2px] bg-current block transition-all duration-300 group-hover:w-full"
          />
          <motion.span
            animate={isOpen 
              ? { rotate: -45, y: -10, backgroundColor: "#4B5563" } 
              : { rotate: 0, y: 0, backgroundColor: "currentColor" }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-full h-[2px] bg-current block transition-all duration-300 group-hover:w-1/2"
          />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(24px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ 
              duration: 0.5, 
              ease: [0.4, 0, 0.2, 1],
              backdropFilter: {
                duration: 0.6,
                ease: "easeOut"
              }
            }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 backdrop-blur-2xl z-40"
            style={{
              background: "linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(255,255,255,0.05))"
            }}
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
            className="fixed top-4 right-4 h-[60vh] w-[280px] rounded-[30px] bg-white/10 z-40 origin-right shadow-2xl shadow-white/10 will-change-transform touch-manipulation overflow-hidden border border-white/30"
          >
            {/* Glass reflection effect - keeping subtle reflection */}
            <div className="absolute inset-x-0 top-0 h-[120%] w-[200%] -translate-x-1/2 -translate-y-[10%] rotate-[-12deg] bg-gradient-to-b from-white/10 to-transparent" />
            
            {/* Frosted glass effect */}
            <div className="absolute inset-0 backdrop-blur-xl backdrop-saturate-150 z-0"></div>
            
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 opacity-90 pointer-events-none" />
            
            {/* Content container */}
            <div className="relative flex flex-col justify-start h-full px-6 pt-12 pb-8">
              <div className="space-y-4 overflow-y-auto custom-scrollbar">
                {menuItems.map(([text, href], index) => (
                  <motion.div
                    key={text}
                    custom={index}
                    variants={itemVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    className="overflow-hidden"
                  >
                    <Link
                      href={href}
                      className="group relative block text-base font-medium text-gray-800 transition-all duration-300 hover:text-black"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="relative z-10 block transform transition-all duration-500 ease-out group-hover:translate-x-2">
                        {text}
                        <span className="absolute inset-0 -z-10 block h-full w-0 rounded-lg bg-gradient-to-r from-white/30 via-white/50 to-white/30 transition-all duration-500 group-hover:w-full"></span>
                      </span>
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  variants={itemVariants}
                  custom={menuItems.length}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  className="pt-4"
                >
                  <FloatingActionButton />
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
                background-color: rgba(75, 85, 99, 0.3);
                border-radius: 20px;
              }
            `}</style>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}