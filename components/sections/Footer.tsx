'use client'

import Link from 'next/link'
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

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-8">
            <Link href="/" className="block">
              <div className="space-y-2">
                <div className="text-[3.5rem] font-bold leading-tight">
                  <span className="text-white">NEX-</span>
                </div>
                <div className="bg-white rounded-xl px-4 py-2 inline-block">
                  <span className="text-[3rem] font-bold text-black">WEBS.</span>
                </div>
                <span className="block text-gray-400 text-xl mt-4">
                  Transforming ideas into seamless digital experiences.
                </span>
              </div>
            </Link>
            
            <p className="text-gray-400 text-lg max-w-md">
              "Delivering cutting-edge web solutions with precision and expertise."
            </p>


          </div>

          {/* Navigation Links */}
          <div className="space-y-6">
            <h3 className="text-white text-xl font-semibold">Navigation</h3>
            <ul className="space-y-4">
              {navigationLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className="text-gray-400 block transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div className="space-y-6">
            <h3 className="text-white text-xl font-semibold">Services</h3>
            <ul className="space-y-4">
              {serviceLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className="text-gray-400 block transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-white text-xl font-semibold">Get in Touch</h3>
            <div className="space-y-4">
              <h2 className="text-gray-400">(nexwebs.org@gmail.com)</h2>
              <h2 className="text-gray-400"> (0309-2425950)</h2>
              <div className="flex space-x-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-colors duration-200"
                  >
                    <span className="text-white">{link.label[0]}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024-2025 NEX-WEBS. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <Link href="/privacy" className="text-gray-400 transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 transition-colors duration-200">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
