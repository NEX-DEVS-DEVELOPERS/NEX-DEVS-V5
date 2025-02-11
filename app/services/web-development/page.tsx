'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const technologies = [
  {
    name: "Next.js",
    description: "Enterprise-grade React framework offering server-side rendering, static generation, and optimal developer workflow",
    icon: "/icons/nextjs.svg",
    features: [
      "Instant Hot Reload Development",
      "Serverless API Routes & Edge Functions",
      "Advanced Image & Font Optimization",
      "Built-in i18n Support & Routing",
      "Zero-Config TypeScript Integration",
      "Automatic Code Splitting"
    ]
  },
  {
    name: "React",
    description: "Industry-leading UI library for building scalable, maintainable component-based applications",
    icon: "/icons/react.svg",
    features: [
      "Modern Component Architecture",
      "Virtual DOM Performance",
      "Advanced Hooks Ecosystem",
      "Server & Client Components",
      "Concurrent Rendering",
      "Extensive Third-party Libraries"
    ]
  },
  {
    name: "HTML5/CSS3",
    description: "Latest web standards implementation with cutting-edge styling capabilities",
    icon: "/icons/html5.svg",
    features: [
      "Semantic HTML5 Structure",
      "Modern CSS Grid & Flexbox",
      "CSS Custom Properties",
      "Advanced Animations & Transitions",
      "Responsive Design Patterns",
      "CSS Modules & Sass Integration"
    ]
  },
  {
    name: "Web Apps",
    description: "Next-generation Progressive Web Applications delivering native-like experiences",
    icon: "/icons/pwa.svg",
    features: [
      "Service Worker Implementation",
      "Background Sync & Push APIs",
      "App Shell Architecture",
      "Cross-platform Compatibility",
      "Offline-first Data Strategy",
      "Device API Integration"
    ]
  },
  {
    name: "AI Integration",
    description: "State-of-the-art artificial intelligence features enhancing user experiences",
    icon: "/icons/ai.svg",
    features: [
      "GPT-4 API Integration",
      "Real-time Image Recognition",
      "Sentiment Analysis",
      "Predictive User Behavior",
      "Content Recommendation Engine",
      "Voice Interface Integration"
    ]
  }
]

const projects = [
  {
    title: "Enterprise E-commerce Platform",
    description: "High-performance e-commerce solution powered by Next.js with AI-driven personalization",
    tech: ["Next.js", "React", "AI", "Stripe"],
    features: [
      "AI-powered Product Recommendations",
      "Real-time Inventory Management",
      "Advanced Search with Filters",
      "Multi-currency Support",
      "Automated Email Marketing",
      "Analytics Dashboard"
    ],
    metrics: [
      "200% Faster Page Loads",
      "45% Higher Conversion Rate",
      "AI-Powered Search with 99% Accuracy",
      "60% Increase in Average Order Value",
      "24/7 Automated Customer Support"
    ]
  },
  {
    title: "Enterprise SaaS Dashboard",
    description: "Real-time analytics platform with AI insights and predictive modeling",
    tech: ["React", "TypeScript", "AI", "WebSocket"],
    features: [
      "Real-time Data Visualization",
      "Predictive Analytics",
      "Custom Report Builder",
      "Role-based Access Control",
      "Multi-tenant Architecture",
      "API Integration Hub"
    ],
    metrics: [
      "Real-time Updates < 100ms",
      "99.99% System Uptime",
      "5x Faster Data Analysis",
      "30% Reduced Decision Time",
      "Unlimited Scale Capacity"
    ]
  }
]

const processSteps = [
  {
    title: "Requirements Analysis",
    description: "Understanding your vision and technical needs",
    icon: "🎯",
    details: [
      "Business Goals Analysis",
      "Technical Requirements",
      "User Journey Mapping",
      "Feature Prioritization"
    ]
  },
  {
    title: "Design & Architecture",
    description: "Creating the blueprint for your web solution",
    icon: "✏️",
    details: [
      "UI/UX Design",
      "Technical Architecture",
      "Database Schema",
      "API Design"
    ]
  },
  {
    title: "Development",
    description: "Building with modern technologies",
    icon: "💻",
    details: [
      "Agile Development",
      "Code Reviews",
      "Testing",
      "Performance Optimization"
    ]
  },
  {
    title: "Deployment & Support",
    description: "Launching and maintaining your solution",
    icon: "🚀",
    details: [
      "CI/CD Setup",
      "Security Audits",
      "Performance Monitoring",
      "24/7 Support"
    ]
  }
]

export default function WebDevelopmentPage() {
  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[128px] animate-pulse" />
          <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[128px] animate-pulse delay-500" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <div className="space-y-4">
              <h1 className="text-5xl font-bold text-white">
                Modern Web Development
              </h1>
              <div className="flex justify-center">
                <span className="inline-block bg-white text-black px-8 py-2 rounded-lg text-3xl font-semibold">
                  Solutions
                </span>
              </div>
            </div>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Delivering cutting-edge web applications with advanced technologies, 
              robust architecture, and exceptional user experiences. Our solutions 
              combine modern frameworks, AI capabilities, and best practices to 
              create scalable, high-performance digital products.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-white text-center mb-16"
          >
            Technologies We Master
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative p-6 rounded-xl border border-white/10 bg-black/50 backdrop-blur-lg
                         hover:border-purple-500/50 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-transparent to-transparent 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                
                <div className="relative z-10">
                  <div className="h-12 w-12 mb-4">
                    <Image
                      src={tech.icon}
                      alt={tech.name}
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{tech.name}</h3>
                  <p className="text-gray-400 mb-4">{tech.description}</p>
                  
                  <ul className="space-y-2">
                    {tech.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-300">
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-white text-center mb-16"
          >
            Featured Projects
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 
                              rounded-xl blur-xl group-hover:opacity-75 transition-opacity duration-500" />
                <div className="relative rounded-xl border border-white/10 bg-black/50 backdrop-blur-sm
                              hover:border-purple-500/50 transition-all duration-300 p-8">
                  <h3 className="text-2xl font-semibold text-white mb-4">{project.title}</h3>
                  <p className="text-gray-200 text-lg mb-6">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((t) => (
                      <span key={t} className="px-3 py-1.5 text-sm rounded-full bg-purple-500/20 
                                            border border-purple-500/30 text-purple-200 font-medium">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-white mb-3">Key Features</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {project.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-gray-200">
                          <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Performance Metrics</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {project.metrics.map((metric, i) => (
                        <li key={i} className="flex items-center gap-2 text-gray-200">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                          {metric}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Development Process */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-white text-center mb-16"
          >
            Our Development Process
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 
                              rounded-xl blur-xl group-hover:opacity-75 transition-opacity duration-500" />
                <div className="relative p-6 rounded-xl border border-white/10 bg-black/50 backdrop-blur-sm
                              hover:border-purple-500/50 transition-all duration-300">
                  <span className="text-3xl mb-4 block">{step.icon}</span>
                  <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{step.description}</p>
                  
                  <ul className="space-y-2">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-300 text-sm">
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
} 