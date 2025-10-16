'use client'

import { motion } from 'framer-motion'

const designTools = [
  {
    name: "Figma",
    description: "Industry-leading collaborative interface design tool that enables real-time team collaboration and powerful design systems",
    icon: "🎨",
    features: [
      "Real-time Design Collaboration",
      "Advanced Component Libraries",
      "Smart Auto-layout System",
      "Interactive Prototyping",
      "Design System Management",
      "Version History & Control"
    ]
  },
  {
    name: "Framer",
    description: "Advanced prototyping and animation platform that brings designs to life with realistic interactions and transitions",
    icon: "✨",
    features: [
      "Advanced Motion Design",
      "Interactive Components",
      "Smart Layout Systems",
      "3D Transformations",
      "Code-based Customization",
      "Real Device Preview"
    ]
  },
  {
    name: "Sketch",
    description: "Professional UI/UX design platform known for its powerful vector editing and extensive plugin ecosystem",
    icon: "💎",
    features: [
      "Vector Editing Tools",
      "Symbol Libraries",
      "Design System Tools",
      "Prototyping Features",
      "Plugin Ecosystem",
      "Cloud Collaboration"
    ]
  }
]

const designProcess = [
  {
    title: "Research & Discovery",
    description: "Understanding users and business objectives through comprehensive research",
    icon: "🔍",
    steps: [
      "User Research & Interviews",
      "Competitor Analysis",
      "Market Research & Trends",
      "User Personas & Stories",
      "Business Goals Alignment",
      "Project Requirements"
    ]
  },
  {
    title: "Information Architecture",
    description: "Creating intuitive structures and user flows for seamless navigation",
    icon: "🗺️",
    steps: [
      "Site Mapping & Navigation",
      "User Flow Diagrams",
      "Content Strategy",
      "Information Hierarchy",
      "Taxonomy Development",
      "Accessibility Planning"
    ]
  },
  {
    title: "UI Design",
    description: "Crafting beautiful and functional interfaces that engage users",
    icon: "🎨",
    steps: [
      "Wireframing & Layouts",
      "Visual Design Systems",
      "Component Libraries",
      "Responsive Design",
      "Micro-interactions",
      "Dark/Light Modes"
    ]
  },
  {
    title: "Prototyping & Testing",
    description: "Validating designs through interactive prototypes and user testing",
    icon: "✨",
    steps: [
      "Interactive Prototypes",
      "Animation Design",
      "Usability Testing",
      "A/B Testing",
      "User Feedback",
      "Design Iterations"
    ]
  }
]

const projects = [
  {
    title: "E-commerce Redesign",
    description: "Complete UX overhaul of a major e-commerce platform focusing on conversion optimization and user engagement",
    icon: "🛍️",
    tags: ["E-commerce", "UX Design", "Mobile-first", "A/B Testing"],
    results: [
      "150% increase in conversion rate",
      "30% decrease in cart abandonment",
      "4.8/5 user satisfaction score",
      "60% reduction in support tickets",
      "45% increase in mobile purchases"
    ]
  },
  {
    title: "Mobile App Design",
    description: "User-centered design for a fitness tracking app with gamification elements and social features",
    icon: "📱",
    tags: ["Mobile App", "UI Design", "Gamification", "Social"],
    results: [
      "200k+ downloads in first month",
      "4.9/5 App Store rating",
      "90% user retention rate",
      "35% increase in daily active users",
      "25min average session duration"
    ]
  },
  {
    title: "SaaS Dashboard",
    description: "Complex data visualization and analytics dashboard redesigned for improved usability and efficiency",
    icon: "📊",
    tags: ["SaaS", "Dashboard", "Data Viz", "Enterprise"],
    results: [
      "40% reduction in task completion time",
      "95% positive user feedback",
      "28% increase in feature adoption",
      "50% decrease in onboarding time",
      "3x increase in data exports"
    ]
  }
]

const testimonials = [
  {
    name: "EMAN MALIK",
    role: "Product Manager",
    company: "TechStart Inc",
    content: "Their UI/UX expertise transformed our product completely. The user engagement metrics increased dramatically after the redesign, and the new interface has received overwhelming positive feedback from our user base.",
    icon: "👨‍💼",
    metrics: ["2x User Engagement", "45% More Features Used", "92% User Satisfaction"]
  },
  {
    name: "Danial Ahmad",
    role: "Founder & CEO",
    company: "HealthTech Solutions",
    content: "The design process was incredibly thorough and professional. They truly understood our users' needs and delivered a solution that exceeded our expectations. The attention to detail and focus on user experience has been instrumental in our app's success.",
    icon: "👨‍💻",
    metrics: ["500k+ Active Users", "4.8/5 App Rating", "89% User Retention"]
  }
]

export default function UIUXDesignPage() {
  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[128px] animate-pulse" />
          <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[128px] animate-pulse delay-500" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4 sm:space-y-6"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              UI/UX Design
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="block mt-2 sm:mt-4"
              >
                <span className="bg-white text-black px-4 sm:px-6 py-1 sm:py-2 rounded-lg inline-block text-lg sm:text-xl">
                  That Delights Users
                </span>
              </motion.span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mt-4 sm:mt-8">
              Creating intuitive and beautiful digital experiences with cutting-edge design tools and methodologies
            </p>
          </motion.div>
        </div>
      </section>

      {/* Design Tools */}
      <section className="py-12 sm:py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-8 sm:mb-16"
          >
            Our Design Tools
            <span className="block text-sm sm:text-base md:text-lg text-gray-400 mt-2 sm:mt-4 font-normal">
              Professional tools for professional results
            </span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {designTools.map((tool, index) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="group relative p-4 sm:p-6 md:p-8 rounded-xl border border-white/10 bg-black/50 backdrop-blur-lg
                         hover:border-purple-500/50 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-transparent to-transparent 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                
                <div className="relative z-10">
                  <div className="text-4xl sm:text-5xl mb-4 sm:mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    {tool.icon}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2 sm:mb-3">{tool.name}</h3>
                  <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6">{tool.description}</p>
                  
                  <ul className="space-y-2 sm:space-y-3">
                    {tool.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 sm:gap-3 text-gray-300 text-sm sm:text-base">
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Design Process */}
      <section className="py-12 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[128px] animate-pulse" />
          <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[128px] animate-pulse delay-500" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-4">
              Our Design Process
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="block mt-2 sm:mt-4"
              >
                <span className="bg-white text-black px-4 sm:px-6 py-1 sm:py-2 rounded-lg inline-block text-sm sm:text-base md:text-lg">
                  From Research to Reality
                </span>
              </motion.span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mt-4 sm:mt-8">
              A systematic approach to creating user-centered designs that deliver measurable results
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {designProcess.map((process, index) => (
              <motion.div
                key={process.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="group relative"
              >
                <div className="relative p-4 sm:p-6 md:p-8 rounded-xl border border-white/10 bg-black/50 backdrop-blur-sm
                              hover:border-purple-500/50 transition-all duration-300">
                  <span className="text-3xl sm:text-4xl mb-3 sm:mb-4 block transform group-hover:scale-110 transition-transform duration-300">{process.icon}</span>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-2">{process.title}</h3>
                  <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6">{process.description}</p>
                  
                  <ul className="space-y-2 sm:space-y-3">
                    {process.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-2 sm:gap-3 text-gray-300 text-sm sm:text-base">
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                        <span>{step}</span>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Featured Projects
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="block mt-4"
              >
                <span className="bg-white text-black px-6 py-2 rounded-lg inline-block text-base md:text-lg">
                  Success Through Design
                </span>
              </motion.span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mt-8">
              Real results from our user-centered design approach
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
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
                              hover:border-purple-500/50 transition-all duration-300 overflow-hidden">
                  <div className="p-6 md:p-8">
                    <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                      {project.icon}
                    </div>
                    <h3 className="text-xl md:text-2xl font-semibold text-white mb-3">{project.title}</h3>
                    <p className="text-gray-400 text-sm md:text-base mb-4">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 text-sm rounded-full bg-purple-500/10 
                                              border border-purple-500/30 text-purple-300">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <ul className="space-y-2">
                      {project.results.map((result, i) => (
                        <li key={i} className="flex items-center gap-3 text-gray-300 text-sm md:text-base">
                          <span className="w-1.5 h-1.5 bg-purple-500 rounded-full flex-shrink-0" />
                          <span>{result}</span>
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

      {/* Testimonials */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Client Testimonials
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="block mt-4"
              >
                <span className="bg-white text-black px-6 py-2 rounded-lg inline-block text-base md:text-lg">
                  What Our Clients Say
                </span>
              </motion.span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mt-8">
              Real feedback from satisfied clients
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 
                              rounded-xl blur-xl group-hover:opacity-75 transition-opacity duration-500" />
                <div className="relative p-6 md:p-8 rounded-xl border border-white/10 bg-black/50 backdrop-blur-sm
                              hover:border-purple-500/50 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-4xl transform group-hover:scale-110 transition-transform duration-300">
                      {testimonial.icon}
                    </div>
                    <div>
                      <h4 className="text-lg md:text-xl font-semibold text-white">{testimonial.name}</h4>
                      <p className="text-gray-400 text-sm md:text-base">{testimonial.role}</p>
                      <p className="text-purple-400 text-sm">{testimonial.company}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm md:text-base italic mb-6">{testimonial.content}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {testimonial.metrics.map((metric, i) => (
                      <div key={i} className="bg-purple-500/10 rounded-lg p-3 text-center">
                        <p className="text-purple-300 text-sm font-medium">{metric}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
} 
