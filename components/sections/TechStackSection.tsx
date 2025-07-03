'use client'

import { motion, Variants, cubicBezier } from 'framer-motion'
import { IconCloud } from "@/components/ui/interactive-icon-cloud"
import { useIsMobile } from '@/app/utils/deviceDetection'

const techSlugs = [
  "typescript",
  "javascript",
  "react",
  "nextdotjs",
  "nodejs",
  "express",
  "prisma",
  "postgresql",
  "mongodb",
  "firebase",
  "supabase",
  "vercel",
  "aws",
  "docker",
  "kubernetes",
  "git",
  "github",
  "figma",
  "tailwindcss",
  "sass",
  "html5",
  "css3",
  "python",
  "django",
  "fastapi",
  "redis",
  "nginx",
  "cloudflare",
  "stripe",
  "openai"
]

export default function TechStackSection() {
  const isMobile = useIsMobile()

  // Define custom easing
  const customEase = cubicBezier(0.645, 0.045, 0.355, 1)

  // Optimized animation variants for 60fps performance with proper easing
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        duration: 0.4,
        ease: customEase
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: customEase
      }
    }
  }

  // Optimized floating animation with reduced complexity
  const floatingVariants: Variants = {
    animate: {
      y: [0, -8, 0],
      rotate: [0, 3, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
        repeatType: "reverse" as const
      }
    }
  }

  return (
    <div className="w-full py-12 sm:py-16 lg:py-20 relative overflow-hidden bg-[#050509]">
      {/* Subtle purple accent line */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-purple-500/20" />
        <div className="absolute bottom-0 left-1/4 right-1/4 h-[1px] bg-purple-500/20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center"
        >
          {/* Left Column - Content */}
          <motion.div
            variants={itemVariants}
            className="space-y-6 lg:space-y-8"
          >
            <div className="space-y-4 sm:space-y-6">
              <motion.div
                variants={itemVariants}
                className="inline-block"
              >
                <span className="text-xs sm:text-sm font-medium text-purple-400 bg-black px-3 py-1.5 rounded-full border-2 border-purple-500/50">
                  Technology Stack
                </span>
              </motion.div>

              <motion.h2
                variants={itemVariants}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight"
              >
                Cutting-Edge
                <span className="block bg-gradient-to-r from-purple-400 via-purple-300 to-purple-500 bg-clip-text text-transparent">
                  Technologies
                </span>
              </motion.h2>

              <motion.p
                variants={itemVariants}
                className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-xl"
              >
                I leverage the latest technologies and frameworks to build scalable,
                performant, and future-ready applications that drive business growth.
              </motion.p>
            </div>

            <motion.div
              variants={itemVariants}
              className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-4 sm:gap-6'}`}
            >
              {/* Technology category boxes */}
              <motion.div
                variants={itemVariants}
                className="space-y-2 sm:space-y-3 p-3 sm:p-4 rounded-lg bg-black border-2 border-purple-500/30"
              >
                <h3 className="text-white font-semibold text-sm sm:text-base">Frontend</h3>
                <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                  <div className="hover:text-purple-300 transition-colors duration-200">React & Next.js</div>
                  <div className="hover:text-purple-300 transition-colors duration-200">TypeScript</div>
                  <div className="hover:text-purple-300 transition-colors duration-200">Tailwind CSS</div>
                  <div className="hover:text-purple-300 transition-colors duration-200">Framer Motion</div>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="space-y-2 sm:space-y-3 p-3 sm:p-4 rounded-lg bg-black border-2 border-purple-500/30"
              >
                <h3 className="text-white font-semibold text-sm sm:text-base">Backend</h3>
                <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                  <div className="hover:text-purple-300 transition-colors duration-200">Node.js & Express</div>
                  <div className="hover:text-purple-300 transition-colors duration-200">Python & Django</div>
                  <div className="hover:text-purple-300 transition-colors duration-200">PostgreSQL & MongoDB</div>
                  <div className="hover:text-purple-300 transition-colors duration-200">Redis & Prisma</div>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="space-y-2 sm:space-y-3 p-3 sm:p-4 rounded-lg bg-black border-2 border-purple-500/30"
              >
                <h3 className="text-white font-semibold text-sm sm:text-base">Cloud & DevOps</h3>
                <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                  <div className="hover:text-purple-300 transition-colors duration-200">AWS & Vercel</div>
                  <div className="hover:text-purple-300 transition-colors duration-200">Docker & Kubernetes</div>
                  <div className="hover:text-purple-300 transition-colors duration-200">CI/CD Pipelines</div>
                  <div className="hover:text-purple-300 transition-colors duration-200">Monitoring & Analytics</div>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="space-y-2 sm:space-y-3 p-3 sm:p-4 rounded-lg bg-black border-2 border-purple-500/30"
              >
                <h3 className="text-white font-semibold text-sm sm:text-base">AI & Tools</h3>
                <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                  <div className="hover:text-purple-300 transition-colors duration-200">OpenAI Integration</div>
                  <div className="hover:text-purple-300 transition-colors duration-200">Machine Learning</div>
                  <div className="hover:text-purple-300 transition-colors duration-200">Design Systems</div>
                  <div className="hover:text-purple-300 transition-colors duration-200">Performance Optimization</div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Column - Interactive Icon Cloud */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center lg:justify-end order-first lg:order-last"
          >
            <div className={`relative w-full ${isMobile ? 'max-w-sm' : 'max-w-lg'}`}>
              {/* Icon Cloud Container */}
              <div
                className={`relative bg-black rounded-2xl border-2 border-purple-500/50 ${
                  isMobile ? 'p-4' : 'p-6 lg:p-8'
                }`}
              >
                <IconCloud iconSlugs={techSlugs} />
              </div>

              {/* Floating elements with visible neon borders */}
              {!isMobile && (
                <>
                  <motion.div
                    variants={floatingVariants}
                    animate="animate"
                    className="absolute -top-4 -right-4 w-12 h-12"
                    style={{ transform: 'translate3d(0, 0, 0)', willChange: 'transform' }}
                  >
                    <div className="absolute inset-0 rounded-full border-[3px] border-purple-500" />
                  </motion.div>

                  <motion.div
                    variants={{
                      animate: {
                        y: [0, 8, 0],
                        rotate: [0, -3, 0],
                        transition: {
                          duration: 5,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 1,
                          repeatType: "reverse" as const
                        }
                      }
                    }}
                    animate="animate"
                    className="absolute -bottom-4 -left-4 w-10 h-10"
                    style={{ transform: 'translate3d(0, 0, 0)', willChange: 'transform' }}
                  >
                    <div className="absolute inset-0 rounded-full border-[3px] border-purple-500" />
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
