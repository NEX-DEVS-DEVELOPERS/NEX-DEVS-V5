'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { FaLightbulb, FaRocket, FaClock, FaHandshake } from 'react-icons/fa'
import { audiowide, vt323 } from '@/app/utils/fonts'

export default function AboutPage() {
  const [activeStep, setActiveStep] = useState(0)

  const workflowSteps = [
    { title: "Discovery", description: "Understanding your vision", icon: "🎯" },
    { title: "Planning", description: "Mapping the journey", icon: "🗺️" },
    { title: "Design", description: "Crafting the experience", icon: "🎨" },
    { title: "Development", description: "Building with precision", icon: "⚙️" },
    { title: "Testing", description: "Ensuring perfection", icon: "🔍" },
    { title: "Launch", description: "Going live", icon: "🚀" }
  ]

  return (
    <motion.main 
      className="min-h-screen bg-black relative overflow-hidden px-4 py-8 md:px-8 lg:px-16"
    >
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,0,255,0.1),transparent_50%)] animate-pulse" />
      
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto mb-8 sm:mb-16 relative pt-16 sm:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className={`text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 ${audiowide.className}`}>
            <span className="text-white">Crafting Digital </span>
            <span className="bg-white text-black px-3 py-1 rounded-md">Excellence</span>
          </h1>
          <div className={`terminal-text text-base sm:text-lg md:text-xl mb-6 sm:mb-8 typing-animation mt-6 sm:mt-8 ${vt323.className}`}>
            <span>const </span>
            <span className="text-purple-400">passion</span>
            <span> = </span>
            <span className="text-pink-400">"Creating innovative digital solutions"</span>
            <span className="terminal-cursor">|</span>
          </div>
        </motion.div>
      </section>

      {/* About Me Section */}
      <section className="max-w-4xl mx-auto mb-8 sm:mb-16 px-4">
        <div className="glass-card p-4 sm:p-8 rounded-2xl backdrop-blur-lg bg-purple-900/10 border border-purple-500/20">
          <h2 className={`text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-purple-300 ${audiowide.className}`}>About Me</h2>
          <div className={`space-y-4 sm:space-y-6 text-sm sm:text-base text-gray-300 ${vt323.className}`}>
            <p>With <span className="bg-white/10 text-white px-2 py-1 rounded-md font-semibold">over 5 years of experience</span> in web development and design, I specialize in creating seamless digital experiences that combine aesthetic beauty with functional excellence.</p>
            
            <p>As a full-stack developer and UI/UX enthusiast, I bring a unique blend of technical expertise and creative design thinking to every project. I'm passionate about creating websites that not only look stunning but also deliver exceptional user experiences and drive business results.</p>
            
            <p>My approach combines:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <li className="flex items-center space-x-2 text-sm sm:text-base">
                <span className="text-purple-400">▹</span>
                <span>Full-stack Development</span>
              </li>
              <li className="flex items-center space-x-2 text-sm sm:text-base">
                <span className="text-purple-400">▹</span>
                <span>UI/UX Design</span>
              </li>
              <li className="flex items-center space-x-2 text-sm sm:text-base">
                <span className="text-purple-400">▹</span>
                <span>Performance Optimization</span>
              </li>
              <li className="flex items-center space-x-2 text-sm sm:text-base">
                <span className="text-purple-400">▹</span>
                <span>Modern Framework Expertise</span>
              </li>
              <li className="flex items-center space-x-2 text-sm sm:text-base">
                <span className="text-purple-400">▹</span>
                <span>Responsive Design</span>
              </li>
              <li className="flex items-center space-x-2 text-sm sm:text-base">
                <span className="text-purple-400">▹</span>
                <span>SEO Optimization</span>
              </li>
              <li className="flex items-center space-x-2 text-sm sm:text-base">
                <span className="text-purple-400">▹</span>
                <span>API Integration</span>
              </li>
              <li className="flex items-center space-x-2 text-sm sm:text-base">
                <span className="text-purple-400">▹</span>
                <span>Database Architecture</span>
              </li>
            </ul>

            <div className="mt-4 sm:mt-6">
              <h3 className={`text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-purple-300 ${audiowide.className}`}>Tech Stack Highlights</h3>
              <div className="flex flex-wrap gap-2">
                {['React', 'Next.js', 'TypeScript', 'Node.js', 'TailwindCSS', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker'].map((tech) => (
                  <span key={tech} className="px-2 sm:px-3 py-1 bg-purple-900/20 border border-purple-500/20 rounded-full text-xs sm:text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Chart Section */}
      <section className="max-w-5xl mx-auto mb-8 sm:mb-16 px-4">
        <h2 className={`text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-purple-300 ${audiowide.className}`}>My Workflow</h2>
        <div className="relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 transform -translate-y-1/2" />
          <div className="relative grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {workflowSteps.map((step, index) => (
              <motion.div
                key={step.title}
                className={`glass-card p-3 sm:p-6 rounded-xl backdrop-blur-lg bg-purple-900/10 border border-purple-500/20 
                  ${activeStep === index ? 'ring-2 ring-purple-500' : ''}`}
                whileHover={{ scale: 1.05, y: -5 }}
                onHoverStart={() => setActiveStep(index)}
              >
                <div className="text-2xl sm:text-3xl mb-2">{step.icon}</div>
                <h3 className={`text-base sm:text-xl font-semibold mb-1 sm:mb-2 text-purple-300 ${audiowide.className}`}>{step.title}</h3>
                <p className={`text-xs sm:text-sm text-gray-400 ${vt323.className}`}>{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section with Modern Cards */}
      <section className="max-w-4xl mx-auto mb-8 sm:mb-16 px-4">
        <h2 className={`text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-purple-300 ${audiowide.className}`}>Why Work With Me</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
          <motion.div 
            className="glass-card p-4 sm:p-6 rounded-xl backdrop-blur-lg bg-purple-900/10 border border-purple-500/20"
            whileHover={{ scale: 1.02, rotateY: 5 }}
          >
            <FaRocket className="text-2xl sm:text-3xl text-purple-400 mb-3 sm:mb-4" />
            <h3 className={`text-lg sm:text-xl font-semibold mb-2 text-purple-200 ${audiowide.className}`}>Fast Delivery</h3>
            <p className={`text-sm sm:text-base text-gray-400 ${vt323.className}`}>
              Quick turnaround without compromising quality. Most projects completed within 2-4 weeks.
            </p>
          </motion.div>

          <motion.div 
            className="glass-card p-4 sm:p-6 rounded-xl backdrop-blur-lg bg-purple-900/10 border border-purple-500/20"
            whileHover={{ scale: 1.02, rotateY: -5 }}
          >
            <FaLightbulb className="text-2xl sm:text-3xl text-purple-400 mb-3 sm:mb-4" />
            <h3 className={`text-lg sm:text-xl font-semibold mb-2 text-purple-200 ${audiowide.className}`}>Innovative Solutions</h3>
            <p className={`text-sm sm:text-base text-gray-400 ${vt323.className}`}>
              Creative problem-solving with modern technology stack and best practices.
            </p>
          </motion.div>

          <motion.div 
            className="glass-card p-4 sm:p-6 rounded-xl backdrop-blur-lg bg-purple-900/10 border border-purple-500/20"
            whileHover={{ scale: 1.02, rotateY: 5 }}
          >
            <FaClock className="text-2xl sm:text-3xl text-purple-400 mb-3 sm:mb-4" />
            <h3 className={`text-lg sm:text-xl font-semibold mb-2 text-purple-200 ${audiowide.className}`}>Time Management</h3>
            <p className={`text-sm sm:text-base text-gray-400 ${vt323.className}`}>
              Efficient workflow and clear communication ensure projects stay on schedule.
            </p>
          </motion.div>

          <motion.div 
            className="glass-card p-4 sm:p-6 rounded-xl backdrop-blur-lg bg-purple-900/10 border border-purple-500/20"
            whileHover={{ scale: 1.02, rotateY: -5 }}
          >
            <FaHandshake className="text-2xl sm:text-3xl text-purple-400 mb-3 sm:mb-4" />
            <h3 className={`text-lg sm:text-xl font-semibold mb-2 text-purple-200 ${audiowide.className}`}>Client Partnership</h3>
            <p className={`text-sm sm:text-base text-gray-400 ${vt323.className}`}>
              Treating your project as my own, ensuring success through collaboration.
            </p>
          </motion.div>
        </div>
      </section>
    </motion.main>
  )
} 