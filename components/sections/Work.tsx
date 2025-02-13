import { motion } from 'framer-motion'
import Link from 'next/link'
import { FiCode, FiLayout, FiShoppingBag, FiDatabase, FiSmartphone, FiGlobe, FiTrello, FiServer, FiCpu, FiBox } from 'react-icons/fi'

const projects = [
  {
    title: "AI-Powered E-commerce Platform",
    category: "Full Stack Development",
    icon: FiShoppingBag,
    description: "Built a sophisticated e-commerce platform with AI-driven product recommendations and real-time inventory management.",
    technologies: ["Next.js", "Python", "TensorFlow", "AWS", "MongoDB"],
    metrics: ["2M+ Monthly Users", "45% Conversion Rate", "99.9% Uptime"],
    link: "/work/ecommerce",
    gradient: "from-blue-500 to-purple-500"
  },
  {
    title: "Portfolio Design System",
    category: "UI/UX Design",
    icon: FiLayout,
    description: "Created a comprehensive design system with reusable components and interactive documentation.",
    technologies: ["Figma", "React", "Storybook", "Framer Motion", "TypeScript"],
    metrics: ["100+ Components", "50% Dev Time Saved", "98% Accessibility Score"],
    link: "/work/design-system",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    title: "Real-time Collaboration Platform",
    category: "Web Development",
    icon: FiGlobe,
    description: "Developed a real-time collaboration tool with video conferencing and document sharing capabilities.",
    technologies: ["WebRTC", "Socket.io", "Redis", "React", "Node.js"],
    metrics: ["10k+ Daily Users", "5ms Latency", "4.9★ Rating"],
    link: "/work/collaboration",
    gradient: "from-green-500 to-blue-500"
  },
  {
    title: "DevOps Automation Suite",
    category: "DevOps",
    icon: FiServer,
    description: "Implemented a comprehensive DevOps pipeline with automated testing and deployment workflows.",
    technologies: ["Docker", "Kubernetes", "Jenkins", "Terraform", "AWS"],
    metrics: ["99.9% Uptime", "15min Deployment", "100% Test Coverage"],
    link: "/work/devops",
    gradient: "from-orange-500 to-red-500"
  },
  {
    title: "AI Image Recognition App",
    category: "Machine Learning",
    icon: FiCpu,
    description: "Built an AI-powered image recognition system with real-time object detection and classification.",
    technologies: ["Python", "TensorFlow", "OpenCV", "Flask", "React Native"],
    metrics: ["95% Accuracy", "50ms Processing", "1M+ Images Processed"],
    link: "/work/ai-vision",
    gradient: "from-red-500 to-purple-500"
  },
  {
    title: "Blockchain Trading Platform",
    category: "Blockchain",
    icon: FiBox,
    description: "Developed a secure cryptocurrency trading platform with real-time market data and automated trading strategies.",
    technologies: ["Solidity", "Web3.js", "React", "Node.js", "PostgreSQL"],
    metrics: ["$10M+ Volume", "100k+ Transactions", "0 Security Breaches"],
    link: "/work/blockchain",
    gradient: "from-yellow-500 to-orange-500"
  }
]

export default function Work() {
  return (
    <section className="w-full bg-black text-white py-20 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-900/10 via-black to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15),transparent_70%)]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-4 mb-16"
        >
          <div className="inline-block bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 px-4 py-1 rounded-full backdrop-blur-sm border border-purple-500/20">
            FEATURED WORK
          </div>
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
            Recent Projects
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl">
            Explore my portfolio of innovative solutions and digital transformations. Each project represents a unique challenge solved with cutting-edge technology.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={project.link} className="group block">
                <div className="relative overflow-hidden rounded-xl bg-white/5 border border-purple-500/10 p-6 backdrop-blur-sm hover:border-purple-500/30 transition-all duration-300">
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  <div className="relative space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-500/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
                        <project.icon className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm text-purple-400">{project.category}</p>
                        <h3 className="text-xl font-bold group-hover:text-purple-300 transition-colors">
                          {project.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-gray-400 line-clamp-2">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 bg-purple-500/10 rounded-full text-purple-300 group-hover:bg-purple-500/20 transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="space-y-2">
                      {project.metrics.map((metric, i) => (
                        <div key={i} className="text-sm text-gray-400 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500/50" />
                          {metric}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center text-purple-400 group-hover:text-purple-300 transition-colors pt-2">
                      View Project Details
                      <motion.svg
                        className="w-4 h-4 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        initial={{ x: 0 }}
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </motion.svg>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link 
            href="/work" 
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 rounded-lg transition-all duration-300 border border-purple-500/20 hover:border-purple-500/30 text-purple-300 backdrop-blur-sm group"
          >
            <span>View All Projects</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
} 