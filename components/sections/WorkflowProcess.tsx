'use client'

import React from 'react'
import { motion } from 'framer-motion'

const WorkflowProcess = () => {
  // Define the workflow steps with detailed explanations
  const workflowSteps = [
    {
      id: 1,
      title: "AI-Powered Discovery",
      description: "We leverage advanced AI analysis tools to understand your business needs, market position, and competitive landscape.",
      details: [
        "AI Market Analysis & Competitor Research",
        "Data-Driven Strategy Development",
        "Business Goals & KPI Setting",
        "Resource Planning & Timeline Creation"
      ],
      icon: "🧠",
      color: "from-blue-500 to-purple-600",
      highlight: true
    },
    {
      id: 2,
      title: "Smart Architecture Design",
      description: "Our team creates custom scalable architectures optimized for performance, security, and future growth.",
      details: [
        "AI-Optimized Tech Stack Selection",
        "Scalable Infrastructure Planning",
        "Security-First Architecture",
        "Performance Optimization Blueprint"
      ],
      icon: "⚙️",
      color: "from-purple-600 to-indigo-500",
      highlight: false
    },
    {
      id: 3,
      title: "AI-Enhanced Development",
      description: "We build your solution using cutting-edge development practices and proprietary AI tools for efficiency and quality.",
      details: [
        "AI-Assisted Code Generation & Review",
        "Automated Testing & Quality Assurance",
        "Continuous Integration & Deployment",
        "Regular Client Progress Updates"
      ],
      icon: "🤖",
      color: "from-indigo-500 to-blue-600",
      highlight: true
    },
    {
      id: 4,
      title: "Intelligent Optimization",
      description: "Our proprietary K-SHIGT mechanism analyzes user behavior to continuously improve conversion rates.",
      details: [
        "AI-Driven User Behavior Analysis",
        "Automated A/B Testing System",
        "Conversion Rate Optimization",
        "Intelligent Performance Monitoring"
      ],
      icon: "📈",
      color: "from-blue-600 to-cyan-500",
      highlight: true
    },
    {
      id: 5,
      title: "Launch & Continuous Improvement",
      description: "We ensure a smooth launch and provide ongoing support with AI-powered monitoring and enhancements.",
      details: [
        "Pre-Launch Security & Performance Audit",
        "AI Monitoring & Issue Detection",
        "Continuous Feature Enhancement",
        "Data-Driven Growth Optimization"
      ],
      icon: "🚀",
      color: "from-cyan-500 to-emerald-500",
      highlight: false
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-500/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/15 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center mb-4 relative">
            <h2 className="text-3xl sm:text-4xl font-bold text-white relative z-10">
              NEX-DEVS <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Workflow</span>
            </h2>
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg blur-md"></div>
          </div>
          <p className="text-gray-400 max-w-3xl mx-auto text-sm sm:text-base">
            Our proprietary AI-enhanced workflow makes us different. We combine human expertise with artificial intelligence at every step to deliver superior results with greater efficiency.
          </p>
        </motion.div>

        {/* Process Flow Diagram */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative"
        >
          {/* Connector Line */}
          <div className="absolute left-[50%] top-0 bottom-0 w-0.5 hidden lg:block">
            <div className="h-full bg-gradient-to-b from-purple-500/40 via-blue-500/40 to-cyan-500/40"></div>
            <div className="h-full w-full absolute top-0 left-0 bg-gradient-to-b from-purple-500/40 via-blue-500/40 to-cyan-500/40 blur-sm"></div>
          </div>

          {workflowSteps.map((step, index) => (
            <motion.div
              key={step.id}
              variants={itemVariants}
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-4 mb-12 lg:mb-20 relative`}
            >
              {/* Process Card */}
              <div className={`w-full lg:w-[45%] relative group`}>
                <div className={`p-6 sm:p-8 rounded-xl border ${step.highlight ? 'border-purple-500/40' : 'border-white/10'} 
                              bg-black/60 backdrop-blur-xl transition-all duration-500
                              hover:border-purple-500/60 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]`}>
                  {/* AI Badge for highlighted steps */}
                  {step.highlight && (
                    <div className="absolute -top-3 -right-3 z-10">
                      <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-lg">
                        <span className="text-xs">AI-POWERED</span>
                        <span className="text-sm animate-pulse">✨</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4 mb-4">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${step.color} text-white p-3 shadow-lg`}>
                      <span className="text-xl">{step.icon}</span>
                    </div>
                    <div>
                      <span className="text-sm text-purple-300 font-medium">STEP {step.id}</span>
                      <h3 className="text-xl font-bold text-white">{step.title}</h3>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-6">{step.description}</p>
                  
                  <div className="space-y-3">
                    {step.details.map((detail, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                        </div>
                        <p className="text-gray-400 text-sm">{detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Connection Node */}
              <div className="hidden lg:flex w-[10%] justify-center items-center">
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                            ${step.highlight ? 
                              'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]' : 
                              'bg-black border border-white/20 text-white'}`}
                >
                  {step.id}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* NEX-DEVS Difference */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-20 p-8 rounded-2xl bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/20"
        >
          <h3 className="text-2xl font-bold text-white mb-6 text-center">How NEX-DEVS Is Different</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 hover:border-purple-500/30 transition-all">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 mb-4">
                <span className="text-2xl">🧠</span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">AI Integration</h4>
              <p className="text-sm text-gray-400">Our proprietary AI tools enhance every aspect of development, from planning to launch, ensuring smarter solutions.</p>
            </div>
            
            <div className="p-4 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 hover:border-purple-500/30 transition-all">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">55% Higher Conversion</h4>
              <p className="text-sm text-gray-400">Our K-SHIGT mechanism analyzes user behavior to optimize conversions, delivering measurably better results.</p>
            </div>
            
            <div className="p-4 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 hover:border-purple-500/30 transition-all">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 mb-4">
                <span className="text-2xl">🔄</span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Continuous Improvement</h4>
              <p className="text-sm text-gray-400">We don't just build and leave. Our AI constantly monitors performance to identify and implement improvements.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default WorkflowProcess 