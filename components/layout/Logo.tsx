import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Logo() {
  const handleLogoClick = (e: React.MouseEvent) => {
    // Force a hard redirect to the root URL
    window.location.href = '/';
    e.preventDefault();
  };

  return (
    <Link href="/" onClick={handleLogoClick}>
      <motion.div 
        className="flex items-center gap-6 px-5 py-2.5 group cursor-pointer relative rounded-full"
        initial={{ background: 'rgba(255, 255, 255, 0)' }}
        whileHover={{ 
          background: 'rgba(255, 255, 255, 0.03)',
          transition: { duration: 0.3 }
        }}
        whileTap={{ scale: 0.97 }}
        suppressHydrationWarning
      >
        {/* Modern Glassmorphism Effect */}
        <motion.div
          className="absolute inset-0 rounded-full -z-10 opacity-0 backdrop-blur-sm"
          whileHover={{
            opacity: 1,
            boxShadow: [
              "0 0 0 1px rgba(255,255,255,0.05)",
              "0 0 30px 1px rgba(168,85,247,0.2)"
            ],
            transition: { duration: 0.4 }
          }}
        />

        {/* Modern Logo Text */}
        <div className="relative">
          <motion.div 
            className="text-2xl font-extrabold tracking-tight
              bg-gradient-to-r from-white via-purple-300 to-white
              bg-clip-text text-transparent
              transition-all duration-500"
            whileHover={{
              backgroundSize: "200% 100%",
              backgroundPosition: "100% 50%",
              transition: {
                duration: 1.2,
                ease: [0.43, 0.13, 0.23, 0.96]
              }
            }}
          >
            NEX-WEBS
            
            {/* Modern Dot Accent */}
            <motion.span
              className="absolute -right-1 -top-1 w-1.5 h-1.5 bg-purple-400 rounded-full"
              whileHover={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
                transition: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            />
          </motion.div>

          {/* Modern Underline Effect */}
          <motion.div 
            className="absolute -bottom-0.5 left-0 right-0 h-[1px]"
            initial={{ background: 'linear-gradient(90deg, transparent, transparent)' }}
            whileHover={{ 
              background: [
                'linear-gradient(90deg, transparent, rgba(168,85,247,0.4), transparent)',
                'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)'
              ],
              transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          />
        </div>
        
        {/* Modern Separator */}
        <motion.div 
          className="hidden md:block w-[1px] h-6"
          initial={{ background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.1), transparent)' }}
          whileHover={{
            background: 'linear-gradient(to bottom, transparent, rgba(168,85,247,0.3), transparent)',
            height: "28px",
            transition: { duration: 0.3 }
          }}
        />
        
        {/* Modern Tagline */}
        <motion.div className="hidden md:block relative overflow-hidden">
          <motion.div 
            className="text-[11px] font-medium tracking-wider uppercase text-white/60"
            whileHover={{
              color: "rgba(255, 255, 255, 0.9)",
              transition: { duration: 0.3 }
            }}
          >
            Elevate Your Digital Presence
            
            {/* Modern Line Through Effect */}
            <motion.div
              className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-400/40 to-transparent"
              initial={{ x: '-100%' }}
              whileHover={{
                x: '100%',
                transition: {
                  duration: 1,
                  ease: "easeInOut",
                  repeat: Infinity
                }
              }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </Link>
  )
} 