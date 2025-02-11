'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Logo from './Logo'
import MobileMenu from './MobileMenu'

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 w-full py-4 px-6 z-50"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-white/10 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/20">
        <Logo />
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {[
            ['Home', '/'],
            ['Services', '/services'],
            ['About', '/about'],
            ['Work', '/work'],
            ['Blog', '/blog'],
            ['Contact', '/contact'],
            ['Pricing', '/pricing']
          ].map(([text, href], index) => (
            <motion.div
              key={text}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -3 }}
            >
              <Link href={href} className="hover:text-gray-300">
                {text}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile Menu */}
        <MobileMenu />
      </div>
    </motion.nav>
  )
} 