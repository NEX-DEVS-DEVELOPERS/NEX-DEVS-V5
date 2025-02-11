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

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-50 p-2"
        aria-label="Toggle Menu"
      >
        <div className="flex flex-col justify-between w-6 h-5">
          <motion.span
            animate={isOpen ? { rotate: 45, y: 9 } : { rotate: 0, y: 0 }}
            className="w-full h-0.5 bg-current block transition-all"
          />
          <motion.span
            animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
            className="w-full h-0.5 bg-current block transition-all"
          />
          <motion.span
            animate={isOpen ? { rotate: -45, y: -9 } : { rotate: 0, y: 0 }}
            className="w-full h-0.5 bg-current block transition-all"
          />
        </div>
      </button>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="fixed top-[5.5rem] left-0 h-[calc(100vh-5.5rem)] w-72 bg-[#111111]/95 backdrop-blur-xl z-50 shadow-2xl border-t border-white/10"
          >
            <div className="flex flex-col p-8 space-y-6">
              {menuItems.map(([text, href], index) => (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={href}
                    className="text-xl font-medium text-gray-300 hover:text-white transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {text}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 