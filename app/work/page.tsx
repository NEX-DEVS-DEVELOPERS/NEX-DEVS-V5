import { Metadata } from 'next'
import Link from 'next/link'
import { FiCode, FiLayout, FiShoppingBag, FiDatabase, FiSmartphone } from 'react-icons/fi'
import { pageMetadata, generatePersonSchema, injectStructuredData } from '@/app/lib/seo'
import WorkPageClient from './WorkPageClient'

// Generate metadata for SEO
export const metadata: Metadata = pageMetadata.work()

// Static data for server-side rendering
const staticWorkData = {
  testimonials: [
    {
      id: 1,
      name: "JUNAID KHAN",
      role: "CEO",
      company: "TechCorp",
      content: "Working with this developer was an absolute pleasure. Their attention to detail and creative solutions exceeded our expectations. The final product was exactly what we needed and more.",
      image: "/testimonials/john.jpg"
    },
    {
      id: 2,
      name: "ALI IMRAN",
      role: "Product Manager",
      company: "InnovateLabs",
      content: "The web application developed for us is not only beautiful but also highly functional. The attention to user experience and performance optimization really sets this work apart.",
      image: "/testimonials/sarah.jpg"
    },
    {
      id: 3,
      name: "MUNEEB AHMAD",
      role: "CTO",
      company: "DigitalFirst",
      content: "Exceptional work on our e-commerce platform. The implementation of modern technologies and best practices has significantly improved our conversion rates.",
      image: "/testimonials/michael.jpg"
    }
  ],

  workProcess: [
    {
      phase: "Discovery",
      description: "Deep dive into your business needs and project requirements. We analyze market trends, user behavior, and technical constraints to create a solid foundation.",
      steps: [
        "Initial consultation",
        "Requirements gathering",
        "Market research",
        "Technical feasibility analysis"
      ]
    },
    {
      phase: "Development",
      description: "Building your solution using cutting-edge technologies and best practices. Focused on creating scalable, maintainable, and high-performance applications.",
      steps: [
        "Architecture planning",
        "Agile development",
        "Regular code reviews",
        "Continuous integration"
      ]
    },
    {
      phase: "Delivery",
      description: "Thorough testing and optimization before launch. Ensuring a smooth deployment and providing ongoing support for your success.",
      steps: [
        "Quality assurance",
        "Performance optimization",
        "Deployment strategy",
        "Post-launch support"
      ]
    }
  ],

  stats: [
    { label: "Projects Completed", value: "50+" },
    { label: "Happy Clients", value: "30+" },
    { label: "Years Experience", value: "5+" },
    { label: "Technologies", value: "15+" }
  ]
}

// Featured projects data for server-side rendering
const featuredProjects = [
  {
    id: 1,
    title: "E-commerce Platform",
    description: "A modern e-commerce solution built with Next.js and Shopify. Features include real-time inventory management, AI-powered recommendations, and seamless payment integration.",
    icon: "FiShoppingBag",
    technologies: ["Next.js", "Shopify", "Tailwind CSS", "TypeScript"],
    metrics: ["50% faster loading", "35% higher conversion", "99.9% uptime"],
    link: "/projects/ecommerce",
    detailedInfo: {
      challenge: "The client needed a scalable e-commerce solution that could handle high traffic and provide personalized shopping experiences.",
      solution: "Implemented a headless Shopify architecture with Next.js frontend, featuring:",
      features: [
        "AI-powered product recommendations using machine learning",
        "Real-time inventory synchronization across multiple warehouses",
        "Custom checkout flow optimized for conversion",
        "Advanced analytics dashboard for business insights",
        "Mobile-first responsive design with PWA capabilities"
      ],
      technicalDetails: [
        "Server-side rendering for optimal performance",
        "Redis caching layer for fast data retrieval",
        "Elasticsearch for advanced product search",
        "WebSocket integration for real-time updates",
        "CI/CD pipeline with automated testing"
      ],
      results: [
        "Increased mobile conversion rate by 35%",
        "Reduced page load time by 50%",
        "Improved customer engagement by 40%",
        "Achieved 99.9% uptime during peak seasons"
      ]
    }
  },
  {
    id: 2,
    title: "Portfolio Platform",
    description: "A creative portfolio platform with interactive elements and dynamic content loading. Built with modern web technologies for optimal performance.",
    icon: "FiLayout",
    technologies: ["React", "Framer Motion", "Three.js", "TypeScript"],
    metrics: ["Perfect Lighthouse score", "2s average load time", "60fps animations"],
    link: "/projects/portfolio",
    detailedInfo: {
      challenge: "The client needed a portfolio platform that could showcase their creative projects effectively.",
      solution: "Developed a React-based portfolio platform with Framer Motion for smooth animations and Three.js for 3D effects.",
      features: [
        "Interactive portfolio elements",
        "Dynamic content loading",
        "3D project visualization",
        "Responsive design",
        "SEO optimization"
      ],
      technicalDetails: [
        "React for frontend development",
        "Framer Motion for animations",
        "Three.js for 3D effects",
        "Tailwind CSS for styling",
        "SEO optimization"
      ],
      results: [
        "Improved project visibility",
        "Increased engagement",
        "Enhanced user experience",
        "SEO ranking improvement"
      ]
    }
  },
  {
    id: 3,
    title: "Mobile App Backend",
    description: "Scalable backend infrastructure for a fitness tracking mobile app. Handles real-time data synchronization and analytics.",
    icon: "FiDatabase",
    technologies: ["Node.js", "MongoDB", "WebSocket", "AWS"],
    metrics: ["1M+ daily requests", "50ms response time", "Zero downtime deployment"],
    link: "/projects/backend",
    detailedInfo: {
      challenge: "The client needed a scalable backend infrastructure for a fitness tracking mobile app.",
      solution: "Developed a Node.js backend using MongoDB for data storage and WebSocket for real-time data synchronization.",
      features: [
        "Scalable architecture",
        "Real-time data synchronization",
        "Data storage using MongoDB",
        "WebSocket integration",
        "AWS deployment"
      ],
      technicalDetails: [
        "Node.js backend development",
        "MongoDB for data storage",
        "WebSocket for real-time data synchronization",
        "AWS deployment",
        "CI/CD pipeline with automated testing"
      ],
      results: [
        "Improved data synchronization",
        "Reduced response time",
        "Achieved zero downtime deployment",
        "Increased daily requests"
      ]
    }
  },
  {
    id: 4,
    title: "React Native App",
    description: "Cross-platform mobile application with offline capabilities and smooth animations. Features include biometric authentication and push notifications.",
    icon: "FiSmartphone",
    technologies: ["React Native", "Redux", "Firebase", "Jest"],
    metrics: ["4.8★ App Store rating", "100k+ downloads", "98% crash-free sessions"],
    link: "/projects/mobile",
    detailedInfo: {
      challenge: "The client needed a cross-platform mobile application with offline capabilities and smooth animations.",
      solution: "Developed a React Native application using Redux for state management and Firebase for authentication.",
      features: [
        "Cross-platform compatibility",
        "Offline capabilities",
        "Smooth animations",
        "Biometric authentication",
        "Push notifications"
      ],
      technicalDetails: [
        "React Native for cross-platform development",
        "Redux for state management",
        "Firebase for authentication and real-time database",
        "Jest for testing",
        "CI/CD pipeline with automated testing"
      ],
      results: [
        "Increased app downloads",
        "Improved user experience",
        "Reduced crash rate",
        "Achieved high App Store rating"
      ]
    }
  }
]

// Server component - this runs on the server
export default async function WorkPage() {
  // Generate structured data for SEO
  const personSchema = generatePersonSchema()

  return (
    <>
      {/* Inject structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: injectStructuredData(personSchema)
        }}
      />

      {/* Static content for SEO crawlers */}
      <div className="min-h-screen bg-black">
        {/* Enhanced Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[128px] animate-pulse" />
          <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[128px] animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-700/5 rounded-full blur-[150px] animate-pulse delay-500" />
        </div>

        <div className="relative pt-24 px-6 backdrop-blur-sm">
          {/* Hero Section - SEO optimized */}
          <section className="max-w-7xl mx-auto mb-12 sm:mb-20">
            <div className="inline-block bg-purple-500/10 text-purple-300 px-3 py-1 text-sm rounded-full mb-4 backdrop-blur-sm border border-purple-500/20">
              MY WORK
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-center">
              Crafting Digital <span className="inline-block bg-white text-black px-3 py-1 rounded-md">Excellence</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto text-center">
              Transforming ideas into exceptional digital experiences. Explore my portfolio of successful projects and discover how I can help bring your vision to life.
            </p>
          </section>

          {/* Featured Projects Preview - SEO Content */}
          <section className="max-w-7xl mx-auto mb-12 sm:mb-20">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Featured Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
              {featuredProjects.slice(0, 2).map((project) => (
                <div
                  key={project.id}
                  className="relative overflow-hidden rounded-xl bg-white/5 border border-purple-500/10 backdrop-blur-sm p-4 sm:p-6"
                >
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <project.icon className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
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
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                href="/projects"
                className="inline-block px-8 py-3 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg transition-colors border border-purple-500/20 hover:border-purple-500/30 text-purple-300"
              >
                View All Projects →
              </Link>
            </div>
          </section>

          {/* Pass data to client component for interactive features */}
          <WorkPageClient
            featuredProjects={featuredProjects}
            staticData={staticWorkData}
          />
        </div>
      </div>
    </>
  )
}