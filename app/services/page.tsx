'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'

const services = [
  {
    title: "WordPress & Shopify",
    description: "Custom e-commerce solutions and content management systems that drive sales and engagement.",
    icon: "🛍️",
    link: "/services/wordpress-shopify",
    features: [
      "Custom Theme Development",
      "E-commerce Solutions",
      "Plugin Development",
      "Performance Optimization",
      "Security Implementation"
    ],
    gradient: "from-blue-500/20 to-purple-500/20"
  },
  {
    title: "Web Development",
    description: "Modern web applications built with Next.js, React, and cutting-edge technologies.",
    icon: "💻",
    link: "/services/web-development",
    features: [
      "Next.js Development",
      "React Applications",
      "Progressive Web Apps",
      "AI Integration",
      "API Development"
    ],
    gradient: "from-purple-500/20 to-pink-500/20"
  },
  {
    title: "UI/UX Design",
    description: "Beautiful and intuitive user interfaces designed with Figma and Framer.",
    icon: "🎨",
    link: "/services/ui-ux-design",
    features: [
      "User Research",
      "Interface Design",
      "Prototyping",
      "Design Systems",
      "User Testing"
    ],
    gradient: "from-pink-500/20 to-orange-500/20"
  }
]

const stats = [
  { number: "100+", label: "Completed Projects" },
  { number: "50+", label: "Happy Clients" },
  { number: "95%", label: "Client Retention" },
  { number: "24/7", label: "Support" }
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

const easterEggs = [
  {
    trigger: "wordpress",
    message: "💡 Fun fact: Our WordPress sites are so fast, they make Flash jealous!",
  },
  {
    trigger: "webdev",
    message: "🚀 Next.js is like coffee for your website - it makes everything faster!",
  },
  {
    trigger: "design",
    message: "🎨 Our designs are so pixel-perfect, even the pixels thank us!",
  }
]

const funFacts = [
  "Did you know? We've written enough code to reach the moon... if printed on paper! 🌙",
  "Our fastest website loads faster than you can say 'NEX-WEBS'! ⚡",
  "We've fixed so many bugs, we should get an honorary degree in digital pest control! 🐛",
  "Our coffee consumption directly correlates with our code quality! ☕",
  "We dream in JSX and wake up with solutions! 💭",
  "Our designs are so responsive, they reply to your emails! 📱",
  "We've used so many gradients, we're practically color scientists! 🌈"
]

const secretCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'KeyA', 'KeyB', 'Enter']
let secretCodeProgress: string[] = []

const serviceFacts = [
  {
    title: "WordPress & Shopify",
    facts: [
      "🚀 Our WooCommerce stores process 10,000+ orders daily",
      "💪 Custom Shopify apps for unique business needs",
      "🔒 Advanced security measures for e-commerce",
      "⚡ 99.9% uptime guarantee for all stores"
    ]
  },
  {
    title: "Web Development",
    facts: [
      "🌐 Next.js 14 for blazing fast performance",
      "📱 Progressive Web Apps that work offline",
      "🤖 AI-powered features for smart interactions",
      "🛠️ Custom API development and integration"
    ]
  },
  {
    title: "UI/UX Design",
    facts: [
      "🎨 Pixel-perfect designs that convert",
      "📊 Data-driven design decisions",
      "🔄 Iterative design process with user feedback",
      "🎯 Focus on accessibility and usability"
    ]
  }
]

export default function ServicesPage() {
  const [currentFact, setCurrentFact] = useState(funFacts[0])
  const [showFact, setShowFact] = useState(false)
  const [easterEggFound, setEasterEggFound] = useState(false)
  const [showFactModal, setShowFactModal] = useState(false)
  const [currentFactIndex, setCurrentFactIndex] = useState(0)
  const [clickCount, setClickCount] = useState(0)

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

  // Handle key presses for secret code
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      secretCodeProgress.push(event.code)
      
      // Keep only the last N keys pressed, where N is the length of the secret code
      if (secretCodeProgress.length > secretCode.length) {
        secretCodeProgress.shift()
      }

      // Check if the secret code has been entered
      if (JSON.stringify(secretCodeProgress) === JSON.stringify(secretCode)) {
        setCurrentFact("🎮 You found the secret code! You're a true explorer! 🏆")
        setShowFact(true)
        setEasterEggFound(true)
        setTimeout(() => setShowFact(false), 5000)
        secretCodeProgress = []
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  // Easter egg triggers
  const handleIconClick = (type: string) => {
    let newFact = funFacts[Math.floor(Math.random() * funFacts.length)]
    
    // Check for specific triggers
    const matchingEasterEgg = easterEggs.find(egg => egg.trigger === type)
    if (matchingEasterEgg) {
      newFact = matchingEasterEgg.message
    }

    setCurrentFact(newFact)
    setShowFact(true)
    setEasterEggFound(true)
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
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              Our Services
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="block mt-2 sm:mt-4"
              >
                <span className="bg-white text-black px-4 sm:px-6 py-1 sm:py-2 rounded-lg inline-block text-lg sm:text-xl">
                  Crafting Digital Excellence
                </span>
              </motion.span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mt-4 sm:mt-8 px-4">
              From concept to deployment, we deliver comprehensive digital solutions
              that help businesses thrive in the modern world.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Find Easter Eggs Box */}
      <div className="fixed top-24 right-8 z-50">
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-purple-500/10 backdrop-blur-md rounded-lg border border-purple-500/20 p-2 shadow-lg w-[140px] cursor-pointer"
          onClick={() => {
            setClickCount(prev => prev + 1)
            if (clickCount >= 2) {
              setShowFactModal(true)
              setClickCount(0)
            }
          }}
        >
          <div className="flex items-center gap-2 text-white">
            <span role="img" aria-label="dice" className="text-lg">🎲</span>
            <h3 className="font-semibold text-xs">Easter Eggs</h3>
          </div>
          <p className="text-gray-300 text-[10px] mt-0.5">
            {clickCount === 0 ? "Click to play!" : clickCount === 1 ? "Once more!" : "Last click!"}
          </p>
        </motion.div>
      </div>

      {/* Fun Facts Modal */}
      {showFactModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1a1625] rounded-xl border border-purple-500/20 p-6 max-w-md mx-4 relative"
          >
            <button
              onClick={() => setShowFactModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <span className="text-xl">×</span>
            </button>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center">
                <span className="text-3xl">🚀</span>
              </div>
              
              <h2 className="text-xl font-semibold text-purple-400">Code Wizard</h2>
              
              <p className="text-white text-lg">
                {personalFacts[currentFactIndex]}
              </p>

              <button
                onClick={handleNextFact}
                className="mt-6 px-6 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 
                         rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                Next Fun Fact →
              </button>
            </div>
          </motion.div>
        </div>
      )}

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
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">{stat.number}</h3>
                  <p className="text-xs sm:text-sm text-gray-400">{stat.label}</p>
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
            className="text-2xl sm:text-3xl font-bold text-white text-center mb-8 sm:mb-12"
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
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                    <span>{service.title === "WordPress & Shopify" ? "🛍️" : 
                           service.title === "Web Development" ? "💻" : "🎨"}</span>
                    {service.title}
                  </h3>
                  <ul className="space-y-2 sm:space-y-3">
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
                    <span 
                      className="text-3xl sm:text-4xl mb-3 sm:mb-4 block cursor-pointer transform transition-transform hover:scale-110"
                      onClick={(e) => {
                        e.preventDefault()
                        handleIconClick(service.title.toLowerCase().split(' ')[0])
                      }}
                    >
                      {service.icon}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2 sm:mb-3">{service.title}</h3>
                    <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6">{service.description}</p>
                    
                    <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
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
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-4">How We Work</h2>
            <p className="text-base sm:text-xl text-gray-400 max-w-2xl mx-auto px-4">
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
                  <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 bg-white text-black px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold">
                    {step.step}
                  </div>

                  <div className="relative p-4 sm:p-6 rounded-xl border border-white/10 bg-black/50 backdrop-blur-sm
                                hover:border-purple-500/50 transition-all duration-300 mt-4 sm:mt-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                    
                    <div className="relative z-10">
                      <span className="text-3xl sm:text-4xl mb-3 sm:mb-4 block">{step.icon}</span>
                      <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2">{step.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">{step.description}</p>
                      
                      <ul className="space-y-1.5 sm:space-y-2">
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

          {/* Easter Egg Notification */}
          {showFact && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 p-3 sm:p-4 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20
                        text-white text-xs sm:text-sm max-w-[250px] sm:max-w-xs z-50"
            >
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg">🎉</span>
                <p>{currentFact}</p>
              </div>
            </motion.div>
          )}

          {/* Hidden Easter Egg Hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            className="text-center mt-8 sm:mt-16 text-xs sm:text-sm text-gray-500"
          >
            <p>Psst... try clicking the service icons or pressing ↑↑↓↓AB↵ for surprises! 🎮</p>
          </motion.div>
        </div>
      </section>

      {/* Konami Code Easter Egg */}
      <div className="hidden">
        ↑↑↓↓←→←→BA
        {/* This comment helps curious developers find the Konami code! */}
      </div>
    </main>
  )
} 