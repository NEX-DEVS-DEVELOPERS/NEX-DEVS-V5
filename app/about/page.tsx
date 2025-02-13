'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { FaLightbulb, FaRocket, FaClock, FaHandshake } from 'react-icons/fa'

export default function AboutPage() {
  const [easterEggFound, setEasterEggFound] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [clickCount, setClickCount] = useState(0)

  const triggerEasterEgg = () => {
    setClickCount(prev => prev + 1)
    if (clickCount >= 2) { // Activate after 3 clicks
      setEasterEggFound(true)
      setTimeout(() => {
        setEasterEggFound(false)
        setClickCount(0)
      }, 5000)
    }
  }

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
      animate={easterEggFound ? {
        filter: ["hue-rotate(0deg)", "hue-rotate(360deg)"],
        transition: { 
          duration: 5,
          repeat: Infinity,
          ease: "linear"
        }
      } : {}}
    >
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,0,255,0.1),transparent_50%)] animate-pulse" />
      
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto mb-16 relative pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-white">Crafting Digital </span>
            <span className="bg-white text-black px-4 py-1 rounded-md">Excellence</span>
          </h1>
          <div className="terminal-text text-lg md:text-xl mb-8 typing-animation mt-8">
            <span>const </span>
            <span className="text-purple-400">passion</span>
            <span> = </span>
            <span className="text-pink-400">"Creating innovative digital solutions"</span>
            <span className="terminal-cursor">|</span>
          </div>
        </motion.div>
      </section>

      {/* About Me Section */}
      <section className="max-w-4xl mx-auto mb-16">
        <div className="glass-card p-8 rounded-2xl backdrop-blur-lg bg-purple-900/10 border border-purple-500/20">
          <h2 className="text-3xl font-bold mb-6 text-purple-300">About Me</h2>
          <div className="space-y-6 text-gray-300">
            <p>With <span className="bg-white/10 text-white px-2 py-1 rounded-md font-semibold">over 5 years of experience</span> in web development and design, I specialize in creating seamless digital experiences that combine aesthetic beauty with functional excellence.</p>
            
            <p>As a full-stack developer and UI/UX enthusiast, I bring a unique blend of technical expertise and creative design thinking to every project. I'm passionate about creating websites that not only look stunning but also deliver exceptional user experiences and drive business results.</p>
            
            <p>My approach combines:</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <li className="flex items-center space-x-2">
                <span className="text-purple-400">▹</span>
                <span>Full-stack Development</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-purple-400">▹</span>
                <span>UI/UX Design</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-purple-400">▹</span>
                <span>Performance Optimization</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-purple-400">▹</span>
                <span>Modern Framework Expertise</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-purple-400">▹</span>
                <span>Responsive Design</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-purple-400">▹</span>
                <span>SEO Optimization</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-purple-400">▹</span>
                <span>API Integration</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-purple-400">▹</span>
                <span>Database Architecture</span>
              </li>
            </ul>

            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-3 text-purple-300">Tech Stack Highlights</h3>
              <div className="flex flex-wrap gap-2">
                {['React', 'Next.js', 'TypeScript', 'Node.js', 'TailwindCSS', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker'].map((tech) => (
                  <span key={tech} className="px-3 py-1 bg-purple-900/20 border border-purple-500/20 rounded-full text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Chart Section */}
      <section className="max-w-5xl mx-auto mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center text-purple-300">My Workflow</h2>
        <div className="relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 transform -translate-y-1/2" />
          <div className="relative grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {workflowSteps.map((step, index) => (
              <motion.div
                key={step.title}
                className={`glass-card p-6 rounded-xl backdrop-blur-lg bg-purple-900/10 border border-purple-500/20 
                  ${activeStep === index ? 'ring-2 ring-purple-500' : ''}`}
                whileHover={{ scale: 1.05, y: -5 }}
                onHoverStart={() => setActiveStep(index)}
              >
                <div className="text-3xl mb-2">{step.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-purple-300">{step.title}</h3>
                <p className="text-sm text-gray-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section with Modern Cards */}
      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center text-purple-300">Why Work With Me</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            className="glass-card p-6 rounded-xl backdrop-blur-lg bg-purple-900/10 border border-purple-500/20"
            whileHover={{ scale: 1.02, rotateY: 5 }}
          >
            <FaRocket className="text-3xl text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-purple-200">Fast Delivery</h3>
            <p className="text-gray-400">
              Quick turnaround without compromising quality. Most projects completed within 2-4 weeks.
            </p>
          </motion.div>

          <motion.div 
            className="glass-card p-6 rounded-xl backdrop-blur-lg bg-purple-900/10 border border-purple-500/20"
            whileHover={{ scale: 1.02, rotateY: -5 }}
          >
            <FaLightbulb className="text-3xl text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-purple-200">Innovative Solutions</h3>
            <p className="text-gray-400">
              Creative problem-solving with modern technology stack and best practices.
            </p>
          </motion.div>

          <motion.div 
            className="glass-card p-6 rounded-xl backdrop-blur-lg bg-purple-900/10 border border-purple-500/20"
            whileHover={{ scale: 1.02, rotateY: 5 }}
          >
            <FaClock className="text-3xl text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-purple-200">Time Management</h3>
            <p className="text-gray-400">
              Efficient workflow and clear communication ensure projects stay on schedule.
            </p>
          </motion.div>

          <motion.div 
            className="glass-card p-6 rounded-xl backdrop-blur-lg bg-purple-900/10 border border-purple-500/20"
            whileHover={{ scale: 1.02, rotateY: -5 }}
          >
            <FaHandshake className="text-3xl text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-purple-200">Client Partnership</h3>
            <p className="text-gray-400">
              Treating your project as my own, ensuring success through collaboration.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Modern Easter Egg */}
      <motion.div 
        className="max-w-4xl mx-auto text-center mb-8"
        animate={easterEggFound ? {
          scale: [1, 1.2, 0.8, 1.1, 1],
          rotate: [0, 10, -10, 5, 0],
          transition: {
            duration: 0.5,
            ease: "easeInOut"
          }
        } : {}}
      >
        <motion.button
          className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium
            hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/25
            relative overflow-hidden group"
          onClick={triggerEasterEgg}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative z-10">
            🎮 {clickCount < 3 ? `Click ${3 - clickCount} more times for magic!` : 'Discover Something Magical'}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.button>
        {easterEggFound && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-purple-400"
          >
            ✨ You found the easter egg! Watch the magic happen! ✨
          </motion.div>
        )}
      </motion.div>
    </motion.main>
  )
} 