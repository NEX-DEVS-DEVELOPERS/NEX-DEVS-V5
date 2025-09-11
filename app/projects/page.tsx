import { Metadata } from 'next'
import Link from 'next/link'
import FeaturedProject from '../components/FeaturedProject'
import NewlyAddedProjects from '../components/NewlyAddedProjects'
import ProjectsGrid from '../components/ProjectsGrid'
import ProjectImageGallery from '../components/ProjectImageGallery'
import NeuralNetworkBackground from '../../components/NeuralNetworkBackground'
import { audiowide, vt323 } from '@/app/utils/fonts'
import { pageMetadata, generatePersonSchema, generateWebSiteSchema, injectStructuredData } from '@/app/lib/seo'
import ProjectsPageClient from './ProjectsPageClient'

// Generate metadata for SEO
export const metadata: Metadata = pageMetadata.projects()

// Static data for server-side rendering
const staticProjectsData = {
  funFacts: [
    "My code is so clean, it makes soap jealous! ✨",
    "I named all my bugs 'Feature' - now the client loves them! 🐛",
    "My keyboard has worn-out Ctrl, C, and V keys... I wonder why 🤔",
    "I don't always test my code, but when I do, I do it in production 😎",
  ],

  asciiDecorations: {
    rocket: `
  ▲
 ▲ ▲
█████
 ███
  █
`,
    laptop: `
 ┌───────┐
 │ >_    │
 │       │
 └───────┘
`,
    terminal: `
┌──────────┐
│ $ code . │
└──────────┘
`,
    diamond: `
   ╱╲
  ╱  ╲
  ╲  ╱
   ╲╱
`
  },

  projectCategories: [
    {
      id: 'ai-automation',
      name: 'AI & Automation',
      description: 'Intelligent automation solutions and AI-powered applications',
      count: 15,
      featured: true
    },
    {
      id: 'web-development',
      name: 'Web Development',
      description: 'Modern web applications and responsive websites',
      count: 25,
      featured: true
    },
    {
      id: 'mobile-apps',
      name: 'Mobile Apps',
      description: 'Cross-platform mobile applications',
      count: 12,
      featured: false
    },
    {
      id: 'ecommerce',
      name: 'E-commerce',
      description: 'Online stores and marketplace solutions',
      count: 8,
      featured: false
    }
  ],

  stats: {
    totalProjects: 60,
    completedProjects: 55,
    activeProjects: 5,
    clientSatisfaction: 98
  }
}

// Server-side data fetching function
async function getProjectsData() {
  try {
    // In a real app, this would be a database call or API request
    // For now, we'll return static data that would normally come from your API
    return {
      success: true,
      data: staticProjectsData
    }
  } catch (error) {
    console.error('Error fetching projects data:', error)
    return {
      success: false,
      data: staticProjectsData // fallback to static data
    }
  }
}

// Server component - this runs on the server
export default async function ProjectsPage() {
  // Fetch projects data server-side
  const projectsData = await getProjectsData()

  // Generate structured data for SEO
  const personSchema = generatePersonSchema()
  const websiteSchema = generateWebSiteSchema()

  return (
    <>
      {/* Inject structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: injectStructuredData(personSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: injectStructuredData(websiteSchema)
        }}
      />

      {/* Static content for SEO crawlers */}
      <div className="min-h-screen bg-black text-white">
        {/* Hero Section - SEO optimized */}
        <section className="relative pt-24 pb-12 px-6">
          <div className="max-w-7xl mx-auto text-center">
            {/* Title with Neural Network Background */}
            <div className="relative mb-6">
              {/* Neural Network Background - expanded to spread around frosted background */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[300px] pointer-events-none">
                <NeuralNetworkBackground 
                  nodeCount={25}
                  connectionDistance={120}
                  nodeSize={3}
                  className="opacity-90"
                />
              </div>
              
              {/* Frosted White Background - reduced blur intensity */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[120px] 
                           bg-white/8 backdrop-blur-sm rounded-2xl border border-white/15 
                           shadow-[0_4px_16px_0_rgba(255,255,255,0.08)] z-[5] pointer-events-none">
              </div>
              
              {/* Title with enhanced styling */}
              <h1 className={`relative text-4xl md:text-6xl font-bold ${audiowide.className} z-10`}>
                <span className="text-white drop-shadow-lg">My </span>
                <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
                  Projects
                </span>
              </h1>
            </div>
            <p className={`text-xl text-gray-300 mb-8 max-w-3xl mx-auto ${vt323.className}`}>
              Explore my portfolio of AI-powered applications, web development projects, and innovative digital solutions.
              Each project represents a unique challenge solved with cutting-edge technology and creative problem-solving.
            </p>

            {/* Project Categories - SEO Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {projectsData.data.projectCategories.map((category) => (
                <div
                  key={category.id}
                  className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-colors"
                >
                  <h3 className={`text-lg font-semibold mb-2 text-purple-300 ${audiowide.className}`}>
                    {category.name}
                  </h3>
                  <p className={`text-sm text-gray-400 mb-3 ${vt323.className}`}>
                    {category.description}
                  </p>
                  <div className="text-2xl font-bold text-white">
                    {category.count}
                  </div>
                  <div className="text-xs text-gray-500">Projects</div>
                </div>
              ))}
            </div>

            {/* Project Stats - SEO Content */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{projectsData.data.stats.totalProjects}</div>
                <div className="text-sm text-gray-400">Total Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{projectsData.data.stats.completedProjects}</div>
                <div className="text-sm text-gray-400">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{projectsData.data.stats.activeProjects}</div>
                <div className="text-sm text-gray-400">Active</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-400">{projectsData.data.stats.clientSatisfaction}%</div>
                <div className="text-sm text-gray-400">Satisfaction</div>
              </div>
            </div>
          </div>
        </section>

        {/* Pass data to client component for interactive features */}
        <ProjectsPageClient
          projectsData={projectsData.data}
          loading={!projectsData.success}
        />
      </div>
    </>
  )
}