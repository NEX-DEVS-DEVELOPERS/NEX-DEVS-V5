'use client'

import { useState } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { FiChevronDown, FiChevronUp, FiShoppingBag, FiLayout, FiDatabase, FiSmartphone } from 'react-icons/fi'

// Icon mapping for string to component conversion
const iconMap = {
  FiShoppingBag,
  FiLayout,
  FiDatabase,
  FiSmartphone,
}

interface Project {
  id: number
  title: string
  description: string
  icon: string
  technologies: string[]
  metrics: string[]
  link: string
  detailedInfo: {
    challenge: string
    solution: string
    features: string[]
    technicalDetails: string[]
    results: string[]
  }
}

interface Testimonial {
  id: number
  name: string
  role: string
  company: string
  content: string
  image: string
}

interface WorkProcess {
  phase: string
  description: string
  steps: string[]
}

interface StaticData {
  testimonials: Testimonial[]
  workProcess: WorkProcess[]
  stats: Array<{
    label: string
    value: string
  }>
}

interface WorkPageClientProps {
  featuredProjects: Project[]
  staticData: StaticData
}

export default function WorkPageClient({ featuredProjects, staticData }: WorkPageClientProps) {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)
  const [expandedProject, setExpandedProject] = useState<number | null>(null)
  const [expandedStat, setExpandedStat] = useState<string | null>(null)
  const controls = useAnimation()

  const toggleProject = (projectId: number) => {
    setExpandedProject(expandedProject === projectId ? null : projectId)
  }

  const handleStatClick = (label: string) => {
    setExpandedStat(expandedStat === label ? null : label)
  }

  return (
    <>
      {/* Enhanced Featured Projects Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-7xl mx-auto mb-12 sm:mb-20"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Interactive Project Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
          {featuredProjects.map((project) => (
            <motion.div
              key={project.id}
              className="relative overflow-hidden rounded-xl bg-white/5 border border-purple-500/10 backdrop-blur-sm hover:border-purple-500/20 transition-colors"
              onHoverStart={() => setHoveredProject(project.id)}
              onHoverEnd={() => setHoveredProject(null)}
            >
              <div className="p-4 sm:p-6">
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  {(() => {
                    const IconComponent = iconMap[project.icon as keyof typeof iconMap]
                    return IconComponent ? <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" /> : null
                  })()}
                  <h3 className="text-xl sm:text-2xl font-bold">{project.title}</h3>
                </div>
                <p className="text-sm sm:text-base text-gray-300 mb-3 sm:mb-4">{project.description}</p>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs px-2 py-1 bg-purple-500/10 rounded-full text-purple-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {project.metrics.map((metric, index) => (
                      <div key={index} className="text-sm text-gray-400">
                        • {metric}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Read More Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleProject(project.id)
                  }}
                  className="flex items-center gap-2 mt-4 text-purple-400 hover:text-purple-300 transition-colors group"
                >
                  <span>Read More</span>
                  {expandedProject === project.id ? (
                    <FiChevronUp className="transition-transform group-hover:-translate-y-1" />
                  ) : (
                    <FiChevronDown className="transition-transform group-hover:translate-y-1" />
                  )}
                </button>

                {/* Expanded Content */}
                <AnimatePresence>
                  {expandedProject === project.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ 
                        height: { duration: 0.3 },
                        opacity: { duration: 0.2 }
                      }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 mt-4 border-t border-purple-500/20">
                        <motion.div 
                          className="space-y-6"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <div className="bg-purple-500/5 p-4 rounded-lg border border-purple-500/10">
                            <h4 className="text-purple-300 font-semibold mb-2 flex items-center gap-2">
                              <span className="w-1 h-1 rounded-full bg-purple-500"></span>
                              Challenge
                            </h4>
                            <p className="text-gray-400">{project.detailedInfo.challenge}</p>
                          </div>
                          
                          <div className="space-y-3">
                            <h4 className="text-purple-300 font-semibold flex items-center gap-2">
                              <span className="w-1 h-1 rounded-full bg-purple-500"></span>
                              Solution
                            </h4>
                            <p className="text-gray-400">{project.detailedInfo.solution}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                              {project.detailedInfo.features.map((feature, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="flex items-center gap-2 text-gray-400 bg-purple-500/5 p-2 rounded-lg"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500/50 flex-shrink-0" />
                                  <span className="text-sm">{feature}</span>
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <h4 className="text-purple-300 font-semibold flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-purple-500"></span>
                                Technical Details
                              </h4>
                              <div className="space-y-2">
                                {project.detailedInfo.technicalDetails.map((detail, index) => (
                                  <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center gap-2 text-gray-400 bg-purple-500/5 p-2 rounded-lg"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500/50 flex-shrink-0" />
                                    <span className="text-sm">{detail}</span>
                                  </motion.div>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-3">
                              <h4 className="text-purple-300 font-semibold flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-purple-500"></span>
                                Key Results
                              </h4>
                              <div className="space-y-2">
                                {project.detailedInfo.results.map((result, index) => (
                                  <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center gap-2 text-gray-400 bg-purple-500/5 p-2 rounded-lg"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500/50 flex-shrink-0" />
                                    <span className="text-sm">{result}</span>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="max-w-7xl mx-auto mb-20"
      >
        <h2 className="text-3xl font-bold mb-8">Client Testimonials</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {staticData.testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              className="bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-purple-500/10 hover:border-purple-500/20 transition-colors"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4 border-2 border-purple-500/20"
                />
                <div>
                  <h3 className="font-bold">{testimonial.name}</h3>
                  <p className="text-sm text-purple-300">{testimonial.role} at {testimonial.company}</p>
                </div>
              </div>
              <p className="text-gray-300 italic">{testimonial.content}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Work Process Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="max-w-7xl mx-auto mb-12 sm:mb-20"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Work Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
          {staticData.workProcess.map((phase, index) => (
            <motion.div
              key={phase.phase}
              className="bg-white/5 p-4 sm:p-6 rounded-xl backdrop-blur-sm border border-purple-500/10 hover:border-purple-500/20 transition-colors"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index }}
            >
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-purple-300">{phase.phase}</h3>
              <p className="text-sm sm:text-base text-gray-300 mb-3 sm:mb-4">{phase.description}</p>
              <ul className="space-y-2">
                {phase.steps.map((step, stepIndex) => (
                  <li key={stepIndex} className="flex items-center gap-2 text-sm sm:text-base text-gray-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500/50" />
                    {step}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="max-w-7xl mx-auto mb-12 sm:mb-20"
      >
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8"
          animate={controls}
        >
          {staticData.stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className={`text-center p-4 sm:p-6 rounded-xl backdrop-blur-sm cursor-pointer
                ${expandedStat === stat.label 
                  ? 'bg-purple-500/30 border-purple-400/50 shadow-[0_0_30px_rgba(168,85,247,0.4)]' 
                  : 'bg-white/5 border-purple-500/10'} 
                border hover:border-purple-500/30 transition-all duration-500`}
              whileHover={{ 
                y: -8, 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              onClick={() => handleStatClick(stat.label)}
            >
              <motion.h4 
                className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-300 to-purple-500 bg-clip-text text-transparent mb-2 sm:mb-3"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {stat.value}
              </motion.h4>
              <p className="text-sm sm:text-base text-gray-200 font-semibold">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
    </>
  )
}

