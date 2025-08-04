'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { FiCode, FiLayout, FiShoppingBag, FiChevronRight } from 'react-icons/fi'
import { BiCodeBlock, BiPalette, BiStore, BiMobile, BiServer, BiAnalyse } from 'react-icons/bi'
import { audiowide, vt323 } from '@/app/utils/fonts'

const services = [
  {
    title: "AI Chatbot Integration",
    description: "Professional AI chatbot solutions with advanced NLP processing and vector database integration for 24/7 customer engagement.",
    icon: "https://ik.imagekit.io/u7ipvwnqb/908shots_so.png",
    link: "/services/ai-chatbot-integration",
    features: [
      "Claude, Gemini, DeepSeek, Grok Integration",
      "Vector Database Knowledge Integration",
      "Custom Fine-Tuning & Optimization",
      "Real-Time Analytics Dashboard",
      "Multi-Platform Deployment"
    ],
    gradient: "from-blue-500/20 to-cyan-500/20"
  },
  {
    title: "AI Agent Workflow Automation",
    description: "Intelligent automation solutions using n8n, Zapier, and Make.com to transform business processes and boost productivity.",
    icon: "https://n8niostorageaccount.blob.core.windows.net/n8nio-strapi-blobs-prod/assets/Home_Dev_O_Ps_43aa01a07b.webp",
    link: "/services/ai-workflow-automation",
    features: [
      "n8n Custom Workflow Implementation",
      "Zapier Advanced Integration",
      "Make.com (Integromat) Solutions",
      "10x Productivity Enhancement",
      "Custom API Development & Connection"
    ],
    gradient: "from-green-500/20 to-emerald-500/20"
  },
  {
    title: "AI-Mobile Apps",
    description: "Premium iOS and Android applications with advanced AI integration, delivering intelligent experiences and passive income generation.",
    icon: "https://ik.imagekit.io/u7ipvwnqb/774_1x_shots_so.png",
    link: "/services/ai-mobile-apps",
    features: [
      "Cross-Platform AI-Powered Development",
      "Native Performance Optimization",
      "Self-Updating AI Systems with Memory",
      "App Store Ranking Algorithms",
      "Enterprise-Grade Security"
    ],
    gradient: "from-purple-500/20 to-violet-500/20"
  },
  {
    title: "3D Web Development",
    description: "Immersive 3D websites using Three.js, Spline, and WebGL for captivating user experiences and interactive showcases.",
    icon: "https://ik.imagekit.io/u7ipvwnqb/452_1x_shots_so.png",
    link: "/services/3d-web-development",
    features: [
      "Three.js Advanced Rendering",
      "Spline 3D Integration",
      "Custom GLSL Shaders",
      "WebGL Performance Optimization",
      "Interactive 3D Configurators"
    ],
    gradient: "from-cyan-500/20 to-blue-500/20"
  },
  {
    title: "AI-Based SaaS Products",
    description: "Enterprise-grade SaaS solutions powered by advanced AI, delivering intelligent and scalable business applications.",
    icon: "https://ik.imagekit.io/u7ipvwnqb/343_1x_shots_so.png",
    link: "/services/ai-saas-products",
    features: [
      "Enterprise AI Integration",
      "Predictive Analytics Engine",
      "Multi-tenant Design",
      "Intelligent Cloud Infrastructure",
      "Advanced SaaS Architecture"
    ],
    gradient: "from-indigo-500/20 to-purple-500/20"
  },
  {
    title: "AI-Enhanced WordPress",
    description: "AI-Enhanced WordPress solutions featuring smart content generation, automated SEO optimization, and intelligent management systems.",
    icon: "https://ik.imagekit.io/u7ipvwnqb/821shots_so.png",
    link: "/services/ai-wordpress-development",
    features: [
      "AI-Powered Content Generation & SEO",
      "Smart Media Processing & Optimization",
      "Intelligent User Engagement Systems",
      "Automated Content Scheduling",
      "AI Agent for Content Creation"
    ],
    gradient: "from-purple-500/20 to-pink-500/20"
  },
  {
    title: "Full-Stack Development",
    description: "Comprehensive AI-integrated development combining advanced Machine Learning with robust cloud-native architecture.",
    icon: "https://ik.imagekit.io/u7ipvwnqb/NEX-WEBS%20NEXJS%20WEBSITE%20.png",
    link: "/services/full-stack-development",
    features: [
      "AI-Driven Full Stack Solutions",
      "Advanced ML Model Integration",
      "Next.js 14 Development",
      "Smart Cloud Infrastructure",
      "Progressive Web Apps"
    ],
    gradient: "from-indigo-500/20 to-blue-500/20"
  },
  {
    title: "Shopify E-commerce",
    description: "AI-Driven e-commerce solutions with advanced analytics, intelligent automation, and smart product recommendations for maximized sales.",
    icon: "https://ik.imagekit.io/u7ipvwnqb/694_1x_shots_so.png",
    link: "/services/shopify-ecommerce",
    features: [
      "AI-Powered Product Recommendations",
      "Smart Inventory Management",
      "Predictive Sales Analytics",
      "Automated Customer Segmentation",
      "Dynamic Pricing Optimization"
    ],
    gradient: "from-green-500/20 to-teal-500/20"
  },
  {
    title: "UI/UX Design",
    description: "Beautiful and intuitive user interfaces designed with Figma and Framer, featuring data-driven design decisions and accessibility focus.",
    icon: "https://ik.imagekit.io/u7ipvwnqb/127shots_so.png",
    link: "/services/ui-ux-design",
    features: [
      "Pixel-Perfect Designs That Convert",
      "Data-Driven Design Decisions",
      "Interactive Prototypes",
      "Design Systems & Components",
      "Accessibility & Usability Focus"
    ],
    gradient: "from-pink-500/20 to-orange-500/20"
  }
]

const stats = [
  { number: "150+", label: "AI-Powered Projects" },
  { number: "75+", label: "Happy Clients" },
  { number: "98%", label: "Client Retention" },
  { number: "24/7", label: "AI Support" }
]

const workflowSteps = [
  {
    step: "01",
    title: "Discovery & Planning",
    description: "Understanding your vision and goals",
    details: [
      "Initial Consultation",
      "Requirements Gathering",
      "Project Scope Definition",
      "Timeline Planning"
    ],
    icon: "🎯"
  },
  {
    step: "02",
    title: "Design & Strategy",
    description: "Creating the perfect blueprint",
    details: [
      "UI/UX Design",
      "Technical Architecture",
      "Strategy Development",
      "Prototype Creation"
    ],
    icon: "✏️"
  },
  {
    step: "03",
    title: "Development",
    description: "Bringing ideas to life",
    details: [
      "Agile Development",
      "Regular Updates",
      "Quality Testing",
      "Performance Optimization"
    ],
    icon: "💻"
  },
  {
    step: "04",
    title: "Launch & Support",
    description: "Delivering excellence",
    details: [
      "Final Testing",
      "Deployment",
      "Training & Documentation",
      "Ongoing Support"
    ],
    icon: "🚀"
  }
]

const funFacts = [
  "Our AI chatbots are so smart, they've started giving us coding advice! 🤖",
  "We've automated so many workflows, our computers work harder than we do! ⚡",
  "Our 3D websites are so immersive, users forget they're on the internet! 🌐",
  "Our AI models process more data than a coffee-fueled developer on deadline! ☕",
  "We dream in neural networks and wake up with AI solutions! 💭",
  "Our mobile apps are so intelligent, they predict what users want before they know it! 📱",
  "We've integrated so much AI, our code reviews itself! 🧠"
]

const serviceFacts = [
  {
    title: "AI Chatbot Integration",
    facts: [
      "🤖 Support for Claude, Gemini, DeepSeek, and Grok models",
      "🧠 Vector database integration for intelligent responses",
      "⚡ 24/7 automated customer support capabilities",
      "📊 Real-time analytics and conversation insights"
    ]
  },
  {
    title: "AI Agent Workflow Automation",
    facts: [
      "🚀 10x productivity enhancement through automation",
      "🔗 Seamless integration with 1000+ business tools",
      "⚙️ Custom n8n workflows for complex processes",
      "💰 Average 60% reduction in operational costs"
    ]
  },
  {
    title: "AI-Mobile Apps",
    facts: [
      "📱 Cross-platform development for iOS and Android",
      "🧠 Self-learning AI systems with contextual memory",
      "💎 Premium app store optimization strategies",
      "💸 Passive income generation through AI automation"
    ]
  },
  {
    title: "3D Web Development",
    facts: [
      "🎮 Three.js and WebGL for immersive experiences",
      "✨ Custom GLSL shaders for unique visual effects",
      "🎯 Interactive 3D product configurators",
      "⚡ Optimized performance across all devices"
    ]
  },
  {
    title: "AI-Based SaaS Products",
    facts: [
      "🏢 Enterprise-grade multi-tenant architecture",
      "🔮 Predictive analytics for business intelligence",
      "🛡️ Advanced security and compliance features",
      "📈 Scalable infrastructure for rapid growth"
    ]
  },
  {
    title: "AI-Enhanced WordPress",
    facts: [
      "✍️ AI-powered content generation and SEO optimization",
      "🎯 Smart media processing and optimization",
      "📅 Automated content scheduling and distribution",
      "🔧 Intelligent backup and maintenance systems"
    ]
  },
  {
    title: "Full-Stack Development",
    facts: [
      "🌐 Next.js 14 for blazing fast performance",
      "🤖 Advanced ML model integration",
      "☁️ Smart cloud-native architecture",
      "🛠️ Custom API development and microservices"
    ]
  },
  {
    title: "Shopify E-commerce",
    facts: [
      "🛒 AI-powered product recommendation engines",
      "📊 Predictive inventory management systems",
      "💰 Dynamic pricing optimization algorithms",
      "🎯 Automated customer segmentation and targeting"
    ]
  },
  {
    title: "UI/UX Design",
    facts: [
      "🎨 Pixel-perfect designs that convert visitors",
      "📊 Data-driven design decisions and A/B testing",
      "♿ Accessibility-first design approach",
      "🔄 Iterative design process with user feedback"
    ]
  }
]

export default function ServicesPage() {
  const [currentFact, setCurrentFact] = useState(funFacts[0])
  const [showFact, setShowFact] = useState(false)
  const [currentFactIndex, setCurrentFactIndex] = useState(0)

  const personalFacts = [
    "I once debugged a production issue while sleeping! (In my dreams, of course)",
    "My code is so clean, it makes Marie Kondo proud! ✨",
    "I speak multiple languages - JavaScript, Python, and Sarcasm 😉",
    "I've written so many lines of code, I dream in binary! 🤖",
    "My debugging skills are so good, bugs run away when they see me coming! 🐛",
    "I don't always test my code, but when I do, I do it in production! (Just kidding!) 🚀"
  ]

  const handleNextFact = () => {
    setCurrentFactIndex((prev) => (prev + 1) % personalFacts.length)
  }

  // Handle icon click - simplified
  const handleIconClick = (type: string) => {
    let newFact = funFacts[Math.floor(Math.random() * funFacts.length)]
    setCurrentFact(newFact)
    setShowFact(true)
    setTimeout(() => setShowFact(false), 3000)
  }

  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="h-24"></div> {/* Spacing for navbar */}
      <section className="relative py-12 sm:py-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/3 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-purple-500/20 rounded-full blur-[128px] animate-pulse" />
          <div className="absolute bottom-0 right-1/3 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-indigo-500/20 rounded-full blur-[128px] animate-pulse delay-500" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4 sm:space-y-6"
          >
            <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-white ${audiowide.className}`}>
              Our Services
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="block mt-2 sm:mt-4"
              >
                <span className={`bg-white text-black px-4 sm:px-6 py-1 sm:py-2 rounded-lg inline-block text-lg sm:text-xl ${audiowide.className}`}>
                  Crafting Digital Excellence
                </span>
              </motion.span>
            </h1>
            <p className={`text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mt-4 sm:mt-8 px-4 ${vt323.className}`}>
              From AI-powered chatbots to immersive 3D experiences, we deliver cutting-edge digital solutions
              that transform businesses and drive innovation in the AI era.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 sm:py-12 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 
                              rounded-xl blur-xl group-hover:opacity-75 transition-opacity duration-500" />
                <div className="relative p-3 sm:p-6 rounded-xl border border-white/10 bg-black/50 backdrop-blur-sm
                              hover:border-purple-500/50 transition-all duration-300 text-center">
                  <h3 className={`text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2 ${audiowide.className}`}>{stat.number}</h3>
                  <p className={`text-xs sm:text-sm text-gray-400 ${vt323.className}`}>{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Facts Box */}
      <section className="py-8 sm:py-12 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-2xl sm:text-3xl font-bold text-white text-center mb-8 sm:mb-12 ${audiowide.className}`}
          >
            Service Highlights
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8"
          >
            {serviceFacts.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group transform hover:scale-105 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 
                              rounded-xl blur-xl group-hover:opacity-75 transition-opacity duration-500" />
                <div className="relative p-4 sm:p-6 rounded-xl border border-white/10 bg-black/50 backdrop-blur-sm
                              hover:border-purple-500/50 transition-all duration-300">
                  <h3 className={`text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center gap-3 ${audiowide.className}`}>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 relative rounded-lg overflow-hidden bg-white/10 backdrop-blur-sm flex-shrink-0">
                      <Image
                        src={service.title === "AI Chatbot Integration" ? "https://ik.imagekit.io/u7ipvwnqb/908shots_so.png" :
                              service.title === "AI Agent Workflow Automation" ? "https://n8niostorageaccount.blob.core.windows.net/n8nio-strapi-blobs-prod/assets/Home_Dev_O_Ps_43aa01a07b.webp" :
                              service.title === "AI-Mobile Apps" ? "https://ik.imagekit.io/u7ipvwnqb/774_1x_shots_so.png" :
                              service.title === "3D Web Development" ? "https://ik.imagekit.io/u7ipvwnqb/452_1x_shots_so.png" :
                              service.title === "AI-Based SaaS Products" ? "https://ik.imagekit.io/u7ipvwnqb/343_1x_shots_so.png" :
                              service.title === "AI-Enhanced WordPress" ? "https://ik.imagekit.io/u7ipvwnqb/821shots_so.png" :
                              service.title === "Full-Stack Development" ? "https://ik.imagekit.io/u7ipvwnqb/NEX-WEBS%20NEXJS%20WEBSITE%20.png" :
                              service.title === "Shopify E-commerce" ? "https://ik.imagekit.io/u7ipvwnqb/694_1x_shots_so.png" :
                              "https://ik.imagekit.io/u7ipvwnqb/127shots_so.png"}
                        alt={`${service.title} service icon`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 32px, 40px"
                      />
                    </div>
                    {service.title}
                  </h3>
                  <ul className={`space-y-2 sm:space-y-3 ${vt323.className}`}>
                    {service.facts.map((fact, i) => (
                      <li key={i} className="flex items-start gap-2 sm:gap-3 text-gray-300 text-xs sm:text-sm">
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5" />
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 sm:py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="group relative"
              >
                <Link href={service.link}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} 
                                rounded-xl blur-xl group-hover:opacity-75 transition-opacity duration-500`} />
                  <div className="relative p-4 sm:p-8 rounded-xl border border-white/10 bg-black/50 backdrop-blur-sm
                                hover:border-purple-500/50 transition-all duration-300 h-full">
                    <div
                      className="w-16 h-16 sm:w-20 sm:h-20 mb-3 sm:mb-4 relative rounded-xl overflow-hidden bg-white/10 backdrop-blur-sm cursor-pointer transform transition-transform hover:scale-110 group-hover:shadow-lg"
                      onClick={(e) => {
                        e.preventDefault()
                        handleIconClick(service.title.toLowerCase().split(' ')[0])
                      }}
                    >
                      <Image
                        src={service.icon}
                        alt={`${service.title} service showcase`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 64px, 80px"
                      />
                    </div>
                    <h3 className={`text-xl sm:text-2xl font-semibold text-white mb-2 sm:mb-3 ${audiowide.className}`}>{service.title}</h3>
                    <p className={`text-sm sm:text-base text-gray-400 mb-4 sm:mb-6 ${vt323.className}`}>{service.description}</p>
                    
                    <ul className={`space-y-2 sm:space-y-3 mb-4 sm:mb-6 ${vt323.className}`}>
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 sm:gap-3 text-gray-300 text-xs sm:text-sm">
                          <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="inline-flex items-center gap-2 text-purple-400 group-hover:text-purple-300 transition-colors text-sm sm:text-base">
                      <span>Learn More</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Work Flow Section */}
      <section className="py-12 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/3 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-purple-500/20 rounded-full blur-[128px] animate-pulse" />
          <div className="absolute bottom-0 right-1/3 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-indigo-500/20 rounded-full blur-[128px] animate-pulse delay-500" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 sm:mb-16"
          >
            <h2 className={`text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-4 ${audiowide.className}`}>How We Work</h2>
            <p className={`text-base sm:text-xl text-gray-400 max-w-2xl mx-auto px-4 ${vt323.className}`}>
              Our proven process ensures successful project delivery and exceeds expectations
            </p>
          </motion.div>

          <div className="relative">
            {/* Connection Line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500/0 via-purple-500/50 to-purple-500/0 hidden lg:block" />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
              {workflowSteps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="relative group"
                >
                  {/* Step Number */}
                  <div className={`absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 bg-white text-black px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold ${audiowide.className}`}>
                    {step.step}
                  </div>

                  <div className="relative p-4 sm:p-6 rounded-xl border border-white/10 bg-black/50 backdrop-blur-sm
                                hover:border-purple-500/50 transition-all duration-300 mt-4 sm:mt-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                    
                    <div className="relative z-10">
                      <span className="text-3xl sm:text-4xl mb-3 sm:mb-4 block">{step.icon}</span>
                      <h3 className={`text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2 ${audiowide.className}`}>{step.title}</h3>
                      <p className={`text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 ${vt323.className}`}>{step.description}</p>
                      
                      <ul className={`space-y-1.5 sm:space-y-2 ${vt323.className}`}>
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-center gap-2 text-gray-300 text-xs sm:text-sm">
                            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Connection Arrow for larger screens */}
                  {index < workflowSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform translate-x-full text-purple-500/50 text-2xl">
                      →
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Keep only the fact notification, but remove Easter Egg references */}
          {showFact && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 p-3 sm:p-4 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20
                        text-white text-xs sm:text-sm max-w-[250px] sm:max-w-xs z-50"
            >
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg">💡</span>
                <p className={vt323.className}>{currentFact}</p>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  )
} 