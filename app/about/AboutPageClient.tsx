'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaLightbulb, FaRocket, FaClock, FaHandshake, FaHeart } from 'react-icons/fa'
import { audiowide, vt323 } from '@/frontend/utils/fonts'
import Image from 'next/image'

interface TeamMember {
  id: number
  name: string
  title: string
  bio?: string
  image_url: string
  skills: string[]
  is_leader: boolean
  active: boolean
}

interface StaticData {
  workflowSteps: Array<{
    title: string
    description: string
    icon: string
  }>
  companyStats: {
    projectsCompleted: string
    happyClients: string
    yearsExperience: string
    clientSatisfaction: string
  }
  capabilities: Array<{
    icon: string
    title: string
    description: string
    technologies: string[]
    gradient: string
    border: string
  }>
}

interface AboutPageClientProps {
  teamMembers: TeamMember[]
  loading: boolean
  staticData: StaticData
}

export default function AboutPageClient({ teamMembers, loading, staticData }: AboutPageClientProps) {
  const [activeStep, setActiveStep] = useState(0)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,0,255,0.1),transparent_50%)] animate-pulse" />
      
      {/* Special Section - Ali & Eman */}
      <section className="max-w-6xl mx-auto mb-8 sm:mb-16 px-4">
        <div className="text-center mb-8">
          <h2 className={`text-2xl sm:text-3xl font-bold mb-4 text-purple-300 ${audiowide.className}`}>The Heart of NEX-DEVS</h2>
          <p className={`text-lg text-gray-300 ${vt323.className}`}>Where Innovation Meets Love</p>
        </div>

        {/* Ali & Eman Special Card */}
        <motion.div
          className="glass-card p-8 rounded-2xl backdrop-blur-lg bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-purple-900/20 border border-purple-500/20 mb-12"
          whileHover={{ scale: 1.01 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Ali's Section */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-blue-500 mr-4">
                  {(() => {
                    const leader = teamMembers.find(member => member.is_leader);
                    return leader && leader.image_url && leader.image_url !== '/team/placeholder.jpg' ? (
                      <Image
                        src={leader.image_url}
                        alt="Ali Hasnaat"
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-white">
                        AH
                      </div>
                    );
                  })()}
                </div>
                <div>
                  <h3 className={`text-2xl font-bold text-purple-200 ${audiowide.className}`}>Ali Hasnaat</h3>
                  <p className={`text-purple-400 ${vt323.className}`}>Founder & Lead Developer</p>
                </div>
              </div>
            </div>

            {/* Eman's Section */}
            <div className="text-center lg:text-right">
              <div className="flex items-center justify-center lg:justify-end mb-4">
                <div className="order-2 lg:order-1">
                  <h3 className={`text-2xl font-bold text-pink-200 ${audiowide.className}`}>Eman Ali</h3>
                  <p className={`text-pink-400 ${vt323.className}`}>Life Partner & Creative Director</p>
                </div>
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-r from-pink-500 to-purple-500 ml-4 order-1 lg:order-2">
                  {(() => {
                    const eman = teamMembers.find(member =>
                      member.name.toLowerCase().includes('eman') &&
                      member.name.toLowerCase().includes('ali')
                    );
                    return eman && eman.image_url && eman.image_url !== '/team/placeholder.jpg' ? (
                      <Image
                        src={eman.image_url}
                        alt="Eman Ali"
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-white">
                        EA
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Love & Partnership Message */}
          <div className="text-center mt-8 p-6 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg border border-purple-500/20">
            <FaHeart className="text-3xl text-pink-400 mx-auto mb-4" />
            <h3 className={`text-xl font-bold mb-4 text-purple-200 ${audiowide.className}`}>A Partnership Beyond Business</h3>
            <p className={`text-gray-300 mb-4 ${vt323.className}`}>
              "Behind every great innovation is a love that inspires it. Eman isn't just my life partner; she's the creative soul that brings beauty to our digital world. Together, we don't just build applications – we craft experiences that touch hearts and transform lives."
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="text-center">
                <h4 className={`text-lg font-semibold text-purple-300 mb-2 ${audiowide.className}`}>In Business</h4>
                <p className={`text-sm text-gray-400 ${vt323.className}`}>
                  Eman's design expertise and creative vision shape every project, ensuring our AI solutions are not just functional but beautiful and intuitive.
                </p>
              </div>
              <div className="text-center">
                <h4 className={`text-lg font-semibold text-pink-300 mb-2 ${audiowide.className}`}>In Life</h4>
                <p className={`text-sm text-gray-400 ${vt323.className}`}>
                  Our love story is woven into every line of code, every design element, and every client success. Together, we're building not just a company, but a legacy.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Team Section */}
      <section className="max-w-6xl mx-auto mb-8 sm:mb-16 px-4">
        <h2 className={`text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-purple-300 ${audiowide.className}`}>Meet Our AI Specialists Team</h2>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers
              .filter(member => !member.is_leader) // Exclude leader as they're shown above
              .map((member) => (
                <motion.div
                  key={member.id}
                  className="glass-card p-6 rounded-xl backdrop-blur-lg bg-purple-900/10 border border-purple-500/20"
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <div className="text-center mb-4">
                    <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-blue-500">
                      {member.image_url && member.image_url !== '/team/placeholder.jpg' ? (
                        <Image
                          src={member.image_url}
                          alt={member.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-white">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      )}
                    </div>
                    <h3 className={`text-lg font-semibold text-purple-200 ${audiowide.className}`}>{member.name}</h3>
                    <p className={`text-sm text-purple-400 ${vt323.className}`}>{member.title}</p>
                  </div>
                  <div className="space-y-3">
                    {member.skills && member.skills.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-cyan-400 mb-2">Specializations</h4>
                        <div className="flex flex-wrap gap-1">
                          {member.skills.slice(0, 5).map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-cyan-900/20 border border-cyan-500/20 rounded-full text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {member.bio && (
                      <p className={`text-xs text-gray-400 ${vt323.className}`}>
                        {member.bio}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}

            {/* Team Stats Card */}
            <motion.div
              className="glass-card p-6 rounded-xl backdrop-blur-lg bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/20"
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="text-center">
                <h3 className={`text-lg font-semibold text-purple-200 mb-4 ${audiowide.className}`}>Team Achievements</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-2xl font-bold text-white">{staticData.companyStats.projectsCompleted}</div>
                    <div className="text-sm text-gray-400">AI Projects Delivered</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{staticData.companyStats.happyClients}</div>
                    <div className="text-sm text-gray-400">Happy Clients</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{staticData.companyStats.yearsExperience}</div>
                    <div className="text-sm text-gray-400">Years Experience</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{staticData.companyStats.clientSatisfaction}</div>
                    <div className="text-sm text-gray-400">Client Satisfaction</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </section>

      {/* Workflow Chart Section */}
      <section className="max-w-5xl mx-auto mb-8 sm:mb-16 px-4">
        <h2 className={`text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-purple-300 ${audiowide.className}`}>Our AI-Powered Workflow</h2>
        <div className="relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 transform -translate-y-1/2" />
          <div className="relative grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {staticData.workflowSteps.map((step, index) => (
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

      {/* AI Capabilities Showcase */}
      <section className="max-w-6xl mx-auto mb-8 sm:mb-16 px-4">
        <h2 className={`text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-purple-300 ${audiowide.className}`}>Our AI-Powered Capabilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staticData.capabilities.map((capability, index) => (
            <motion.div
              key={capability.title}
              className={`glass-card p-6 rounded-xl backdrop-blur-lg bg-gradient-to-br ${capability.gradient} border ${capability.border}`}
              whileHover={{ scale: 1.02, y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="text-3xl mb-4">{capability.icon}</div>
              <h3 className={`text-lg font-semibold mb-3 text-white ${audiowide.className}`}>{capability.title}</h3>
              <p className={`text-sm text-gray-400 mb-4 ${vt323.className}`}>
                {capability.description}
              </p>
              <div className="flex flex-wrap gap-1">
                {capability.technologies.map((tech) => (
                  <span key={tech} className="px-2 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-white">
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits Section with Modern Cards */}
      <section className="max-w-4xl mx-auto mb-8 sm:mb-16 px-4">
        <h2 className={`text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-purple-300 ${audiowide.className}`}>Why Choose NEX-DEVS</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
          <motion.div
            className="glass-card p-4 sm:p-6 rounded-xl backdrop-blur-lg bg-purple-900/10 border border-purple-500/20"
            whileHover={{ scale: 1.02, rotateY: 5 }}
          >
            <FaRocket className="text-2xl sm:text-3xl text-purple-400 mb-3 sm:mb-4" />
            <h3 className={`text-lg sm:text-xl font-semibold mb-2 text-purple-200 ${audiowide.className}`}>AI-Powered Delivery</h3>
            <p className={`text-sm sm:text-base text-gray-400 ${vt323.className}`}>
              Accelerated development with AI assistance. Most AI-integrated projects completed within 2-4 weeks.
            </p>
          </motion.div>

          <motion.div
            className="glass-card p-4 sm:p-6 rounded-xl backdrop-blur-lg bg-purple-900/10 border border-purple-500/20"
            whileHover={{ scale: 1.02, rotateY: -5 }}
          >
            <FaLightbulb className="text-2xl sm:text-3xl text-purple-400 mb-3 sm:mb-4" />
            <h3 className={`text-lg sm:text-xl font-semibold mb-2 text-purple-200 ${audiowide.className}`}>Cutting-Edge Innovation</h3>
            <p className={`text-sm sm:text-base text-gray-400 ${vt323.className}`}>
              Latest AI technologies and frameworks. Custom solutions that give you competitive advantage.
            </p>
          </motion.div>

          <motion.div
            className="glass-card p-4 sm:p-6 rounded-xl backdrop-blur-lg bg-purple-900/10 border border-purple-500/20"
            whileHover={{ scale: 1.02, rotateY: 5 }}
          >
            <FaClock className="text-2xl sm:text-3xl text-purple-400 mb-3 sm:mb-4" />
            <h3 className={`text-lg sm:text-xl font-semibold mb-2 text-purple-200 ${audiowide.className}`}>Intelligent Automation</h3>
            <p className={`text-sm sm:text-base text-gray-400 ${vt323.className}`}>
              AI-driven project management and automated workflows ensure efficient delivery and quality.
            </p>
          </motion.div>

          <motion.div
            className="glass-card p-4 sm:p-6 rounded-xl backdrop-blur-lg bg-purple-900/10 border border-purple-500/20"
            whileHover={{ scale: 1.02, rotateY: -5 }}
          >
            <FaHandshake className="text-2xl sm:text-3xl text-purple-400 mb-3 sm:mb-4" />
            <h3 className={`text-lg sm:text-xl font-semibold mb-2 text-purple-200 ${audiowide.className}`}>AI-Enhanced Partnership</h3>
            <p className={`text-sm sm:text-base text-gray-400 ${vt323.className}`}>
              Collaborative approach with AI-powered insights and recommendations for optimal results.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Story & Vision Section */}
      <section className="max-w-6xl mx-auto mb-8 sm:mb-16 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Company Story */}
          <motion.div
            className="glass-card p-6 sm:p-8 rounded-2xl backdrop-blur-lg bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/20"
            whileHover={{ scale: 1.01 }}
          >
            <h2 className={`text-2xl sm:text-3xl font-bold mb-6 text-purple-300 ${audiowide.className}`}>Our Story</h2>
            <div className={`space-y-4 text-sm sm:text-base text-gray-300 ${vt323.className}`}>
              <p>
                Founded in 2018, NEX-DEVS began as a vision to bridge the gap between cutting-edge artificial intelligence and practical business solutions. What started as a small team of passionate developers has evolved into a specialized AI development agency that transforms how businesses operate in the digital age.
              </p>
              <p>
                Our journey began when we recognized that while AI technology was advancing rapidly, most businesses struggled to implement these powerful tools effectively. We set out to change that by creating accessible, intelligent solutions that deliver real value.
              </p>
              <p>
                Today, we're proud to be at the forefront of AI integration, helping businesses automate processes, enhance customer experiences, and achieve unprecedented growth through the strategic implementation of artificial intelligence.
              </p>
              <div className="mt-6 p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
                <h3 className={`text-lg font-semibold mb-2 text-purple-300 ${audiowide.className}`}>Key Milestones</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <span className="text-purple-400">•</span>
                    <span>2018: Founded NEX-DEVS with focus on modern web development</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-purple-400">•</span>
                    <span>2020: Expanded into AI chatbot integration and automation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-purple-400">•</span>
                    <span>2022: Launched comprehensive AI workflow automation services</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-purple-400">•</span>
                    <span>2024: Pioneered 3D web experiences and enterprise AI solutions</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Vision & Values */}
          <motion.div
            className="glass-card p-6 sm:p-8 rounded-2xl backdrop-blur-lg bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/20"
            whileHover={{ scale: 1.01 }}
          >
            <h2 className={`text-2xl sm:text-3xl font-bold mb-6 text-blue-300 ${audiowide.className}`}>Vision & Values</h2>
            <div className={`space-y-6 text-sm sm:text-base text-gray-300 ${vt323.className}`}>
              <div>
                <h3 className={`text-lg font-semibold mb-3 text-blue-300 ${audiowide.className}`}>Our Vision</h3>
                <p>
                  To become the global leader in democratizing AI technology, making advanced artificial intelligence accessible to businesses of all sizes and empowering them to achieve extraordinary growth through intelligent automation.
                </p>
              </div>

              <div>
                <h3 className={`text-lg font-semibold mb-3 text-cyan-300 ${audiowide.className}`}>Core Values</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <span className="text-cyan-400 mt-1">🚀</span>
                    <div>
                      <h4 className="font-semibold text-cyan-200">Innovation First</h4>
                      <p className="text-sm text-gray-400">Constantly pushing boundaries with latest AI technologies</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-cyan-400 mt-1">🤝</span>
                    <div>
                      <h4 className="font-semibold text-cyan-200">Client Success</h4>
                      <p className="text-sm text-gray-400">Your success is our primary measure of achievement</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-cyan-400 mt-1">🎯</span>
                    <div>
                      <h4 className="font-semibold text-cyan-200">Quality Excellence</h4>
                      <p className="text-sm text-gray-400">Delivering exceptional results that exceed expectations</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-cyan-400 mt-1">🌍</span>
                    <div>
                      <h4 className="font-semibold text-cyan-200">Global Impact</h4>
                      <p className="text-sm text-gray-400">Creating solutions that make a positive difference worldwide</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Future Goals */}
        <motion.div
          className="mt-8 glass-card p-6 sm:p-8 rounded-2xl backdrop-blur-lg bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-cyan-900/20 border border-purple-500/20"
          whileHover={{ scale: 1.01 }}
        >
          <h2 className={`text-2xl sm:text-3xl font-bold mb-6 text-center text-purple-300 ${audiowide.className}`}>The Future of AI Development</h2>
          <div className={`text-center space-y-4 text-sm sm:text-base text-gray-300 ${vt323.className}`}>
            <p className="text-lg">
              We're not just building AI solutions for today – we're crafting the foundation for tomorrow's intelligent digital ecosystem.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-3xl mb-3">🧠</div>
                <h3 className={`text-lg font-semibold text-purple-300 mb-2 ${audiowide.className}`}>Advanced AI Research</h3>
                <p className="text-sm text-gray-400">Pioneering next-generation AI models and integration techniques</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">🌐</div>
                <h3 className={`text-lg font-semibold text-blue-300 mb-2 ${audiowide.className}`}>Global Expansion</h3>
                <p className="text-sm text-gray-400">Bringing AI solutions to businesses worldwide</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">🔮</div>
                <h3 className={`text-lg font-semibold text-cyan-300 mb-2 ${audiowide.className}`}>Future Technologies</h3>
                <p className="text-sm text-gray-400">Exploring quantum computing, AGI, and beyond</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </motion.div>
  )
}

