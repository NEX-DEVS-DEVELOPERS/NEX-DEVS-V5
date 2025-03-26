import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const companies = [
  'GitHub',
  'Webflow',
  'Figma',
  'PeoplePerHour',
  'Pinterest',
  'Dribbble',
  'Behance',
  'Upwork',
  'Fiverr'
]

export default function TrustedBy() {
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    const scrollAnimation = () => {
      setScrollPosition((prev) => (prev + 1) % (companies.length * 150))
    }

    const interval = setInterval(scrollAnimation, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full py-8 sm:py-12 overflow-hidden bg-black/40 backdrop-blur-xl relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80 pointer-events-none z-10" />
      
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center text-sm sm:text-base text-gray-400 font-medium mb-8"
        >
          TRUSTED BY
        </motion.h2>

        {/* Mobile Scrolling Grid */}
        <div className="block sm:hidden">
          <div className="grid grid-cols-3 gap-4 text-center">
            {companies.map((company, index) => (
              <motion.div
                key={company}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-center"
              >
                <span className="text-sm text-gray-400 font-medium hover:text-white transition-colors">
                  {company}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Desktop Infinite Scroll */}
        <div className="hidden sm:block relative">
          <div className="flex whitespace-nowrap">
            <div 
              className="flex gap-12 items-center animate-scroll"
              style={{
                transform: `translateX(-${scrollPosition}px)`,
              }}
            >
              {[...companies, ...companies].map((company, index) => (
                <motion.div
                  key={`${company}-${index}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex-shrink-0"
                >
                  <span className="text-base text-gray-400 font-medium hover:text-white transition-colors">
                    {company}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add custom styles for animation */}
      <style jsx global>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </div>
  )
} 