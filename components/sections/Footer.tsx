'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function Footer() {
  const navigationLinks = [
    { id: 1, label: 'Services', href: '/services' },
    { id: 2, label: 'About', href: '/about' },
    { id: 3, label: 'Work', href: '/work' },
    { id: 4, label: 'Contact', href: '/contact' },
  ]

  const serviceLinks = [
    { id: 1, label: 'WEBSITE DEVOPS', href: '/services/email' },
    { id: 2, label: 'WORDPRESS/SHOPIFY', href: '/services/social' },
    { id: 3, label: 'FIMA /FRAMER ', href: '/services/seo' },
    { id: 4, label: 'SEO CONTENT CREATION', href: '/services/content' },
  ]

  const socialLinks = [
    { id: 1, label: 'Instagram', href: '#', icon: '/icons/instagram.svg' },
    { id: 2, label: 'Twitter', href: '#', icon: '/icons/twitter.svg' },
    { id: 3, label: 'LinkedIn', href: '#', icon: '/icons/linkedin.svg' },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  return (
    <footer className="relative bg-black pt-20 pb-10 overflow-hidden">
      {/* Geometric Background */}
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
        <Image
          src="/images/geometric-bg.webp"
          alt="Geometric Pattern"
          fill
          className="object-cover"
        />
      </div>

      <motion.div
        className="container mx-auto px-4 relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <motion.div variants={itemVariants} className="space-y-8">
            <Link href="/" className="block">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="space-y-2"
              >
                <div className="text-[3.5rem] font-bold leading-tight">
                  <motion.span 
                    className="text-white"
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    NEX-
                  </motion.span>
                </div>
                <div className="bg-white rounded-xl px-4 py-2 inline-block">
                  <motion.span 
                    className="text-[3rem] font-bold text-black"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    WEBS.
                  </motion.span>
                </div>
                <span className="block text-gray-400 text-xl mt-4">
                Transforming ideas into seamless digital experiences.
                </span>
              </motion.div>
            </Link>
            
            <motion.p 
              className="text-gray-400 text-lg max-w-md"
              variants={itemVariants}
            >
              "Delivering cutting-edge web solutions with precision and expertise."
            </motion.p>

            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-gray-400">Trusted by Industry Leaders</p>
              <div className="flex -space-x-4 ml-4">
                {[1, 2, 3, 4].map((index) => (
                  <motion.div
                    key={index}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600/20 to-white/20 border border-white/10"
                    whileHover={{ scale: 1.2, zIndex: 10 }}
                    transition={{ duration: 0.2 }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Navigation Links */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="text-white text-xl font-semibold">Navigation</h3>
            <ul className="space-y-4">
              {navigationLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300 block hover:scale-105"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services Links */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="text-white text-xl font-semibold">Services</h3>
            <ul className="space-y-4">
              {serviceLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300 block hover:scale-105"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="text-white text-xl font-semibold">Get in Touch</h3>
            <div className="space-y-4">
              <h2 className="text-gray-400">(nexwebs.org@gmail.com)</h2>
              <h2 className="text-gray-400"> (0309-2425950)</h2>
              <div className="flex space-x-4">
                {socialLinks.map((link) => (
                  <motion.a
                    key={link.id}
                    href={link.href}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors duration-300"
                  >
                    <span className="text-white">{link.label[0]}</span>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          variants={itemVariants}
          className="border-t border-white/10 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024-2025 NEX-WEBS. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-300">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white transition-colors duration-300">
              Terms of Service
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  )
}
