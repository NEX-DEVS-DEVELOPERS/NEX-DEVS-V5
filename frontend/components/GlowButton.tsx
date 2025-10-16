import Link from 'next/link'
import { motion } from 'framer-motion'

interface GlowButtonProps {
  children: React.ReactNode
  href: string
}

export default function GlowButton({ children, href }: GlowButtonProps) {
  return (
    <div className="relative group">
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
      
      <Link href={href}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative px-8 py-4 bg-black text-white rounded-lg leading-none flex items-center divide-x divide-gray-600"
        >
          <span className="flex items-center space-x-2">
            {children}
          </span>
        </motion.button>
      </Link>
    </div>
  )
} 