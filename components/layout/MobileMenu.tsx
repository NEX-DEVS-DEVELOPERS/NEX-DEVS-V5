'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    ['Home', '/'],
    ['Services', '/services'],
    ['About', '/about'],
    ['Work', '/work'],
    ['Blog', '/blog'],
    ['Contact', '/contact'],
    ['Pricing', '/pricing']
  ]

  const menuVariants = {
    closed: {
      scale: 0,
      opacity: 0,
      borderRadius: '100%',
    },
    open: {
      scale: 1,
      opacity: 1,
      borderRadius: '0%',
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  }

  const itemVariants = {
    closed: { x: -20, opacity: 0 },
    open: (i: number) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 100,
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
              ? { rotate: 45, y: 10, backgroundColor: "#fff" } 
              : { rotate: 0, y: 0, backgroundColor: "currentColor" }}
            className="w-full h-[2px] bg-current block transition-all duration-300 group-hover:w-3/4"
          />
          <motion.span
            animate={isOpen 
              ? { opacity: 0, x: -10 } 
              : { opacity: 1, x: 0 }}
            className="w-3/4 h-[2px] bg-current block transition-all duration-300 group-hover:w-full"
          />
          <motion.span
            animate={isOpen 
              ? { rotate: -45, y: -10, backgroundColor: "#fff" } 
              : { rotate: 0, y: 0, backgroundColor: "currentColor" }}
            className="w-full h-[2px] bg-current block transition-all duration-300 group-hover:w-1/2"
          />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-purple-950/40 backdrop-blur-md z-40"
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
            className="fixed top-4 right-4 h-[50vh] w-[270px] rounded-[30px] bg-gradient-to-b from-purple-950/85 via-purple-900/80 to-purple-950/85 backdrop-blur-xl z-40 origin-top-right shadow-[-10px_0_30px_rgba(0,0,0,0.2)] overflow-hidden"
          >
            <div className="flex flex-col justify-start h-full px-6 pt-12 pb-8">
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
                      className="group relative block text-base font-medium text-purple-100 transition-colors duration-300 hover:text-white"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="relative z-10 block transform transition-transform duration-300 group-hover:translate-x-2">
                        {text}
                      </span>
                      <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-purple-200 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            <style jsx global>{`
              .custom-scrollbar::-webkit-scrollbar {
                width: 3px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: transparent;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background-color: rgba(139, 92, 246, 0.3);
                border-radius: 20px;
              }
            `}</style>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 