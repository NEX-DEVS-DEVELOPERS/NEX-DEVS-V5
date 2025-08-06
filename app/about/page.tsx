import { Metadata } from 'next'
import { FaLightbulb, FaRocket, FaClock, FaHandshake, FaHeart } from 'react-icons/fa'
import { audiowide, vt323 } from '@/app/utils/fonts'
import Image from 'next/image'
import { pageMetadata, generatePersonSchema, generateOrganizationSchema, injectStructuredData } from '@/app/lib/seo'
import AboutPageClient from './AboutPageClient'

// Generate metadata for SEO
export const metadata: Metadata = pageMetadata.about()

// Server-side data fetching
async function getTeamMembers() {
  try {
    // In a real app, this would be a database call or API request
    // For now, we'll return static data that would normally come from your API
    const teamMembers = [
      {
        id: 1,
        name: "Ali Hasnaat",
        title: "Founder & Lead AI Developer",
        bio: "AI specialist with 7+ years of experience in intelligent automation and modern web development.",
        image_url: "/team/ali-hasnaat.jpg",
        skills: ["AI Development", "React", "Next.js", "TypeScript", "Python", "Machine Learning"],
        is_leader: true,
        active: true
      },
      {
        id: 2,
        name: "Eman Ali",
        title: "Creative Director & Life Partner",
        bio: "Creative visionary bringing beauty and intuitive design to our AI solutions.",
        image_url: "/team/eman-ali.jpg",
        skills: ["UI/UX Design", "Creative Direction", "Brand Strategy", "User Experience"],
        is_leader: false,
        active: true
      },
      {
        id: 3,
        name: "Hassam Baloch",
        title: "AI Automation Specialist",
        bio: "Expert in N8N and Make.com automation workflows with focus on business process optimization.",
        image_url: "/team/hassam-baloch.jpg",
        skills: ["N8N", "Make.com", "Workflow Automation", "API Integration", "Business Process"],
        is_leader: false,
        active: true
      },
      {
        id: 4,
        name: "Anns Bashir",
        title: "AI Automation Specialist",
        bio: "Specialized in intelligent automation systems and AI workflow optimization.",
        image_url: "/team/anns-bashir.jpg",
        skills: ["AI Automation", "Workflow Design", "System Integration", "Process Optimization"],
        is_leader: false,
        active: true
      },
      {
        id: 5,
        name: "Faizan Khan",
        title: "Full-Stack Developer",
        bio: "Full-stack developer with expertise in modern web technologies and AI integration.",
        image_url: "/team/faizan-khan.jpg",
        skills: ["Full-Stack Development", "React", "Node.js", "Database Design", "AI Integration"],
        is_leader: false,
        active: true
      }
    ]

    return { data: teamMembers, success: true }
  } catch (error) {
    console.error('Error fetching team members:', error)
    return { data: [], success: false }
  }
}

// Static data that would normally be fetched server-side
const staticData = {
  workflowSteps: [
    { title: "Discovery", description: "Understanding your vision", icon: "🎯" },
    { title: "Planning", description: "Mapping the journey", icon: "🗺️" },
    { title: "Design", description: "Crafting the experience", icon: "🎨" },
    { title: "Development", description: "Building with precision", icon: "⚙️" },
    { title: "Testing", description: "Ensuring perfection", icon: "🔍" },
    { title: "Launch", description: "Going live", icon: "🚀" }
  ],

  companyStats: {
    projectsCompleted: "150+",
    happyClients: "75+",
    yearsExperience: "7+",
    clientSatisfaction: "98%"
  },

  capabilities: [
    {
      icon: "🤖",
      title: "AI Chatbot Integration",
      description: "Advanced NLP processing with Claude, Gemini, and GPT models. Vector database integration for intelligent responses.",
      technologies: ["Claude AI", "OpenAI GPT", "Vector DB", "NLP"],
      gradient: "from-blue-900/20 to-cyan-900/20",
      border: "border-blue-500/20"
    },
    {
      icon: "⚙️",
      title: "Workflow Automation",
      description: "Intelligent automation with n8n, Zapier, and Make.com. 10x productivity enhancement through smart workflows.",
      technologies: ["n8n", "Zapier", "Make.com", "API Integration"],
      gradient: "from-green-900/20 to-emerald-900/20",
      border: "border-green-500/20"
    },
    {
      icon: "📱",
      title: "AI-Mobile Apps",
      description: "Cross-platform mobile applications with AI integration, self-learning systems, and passive income generation.",
      technologies: ["React Native", "Flutter", "AI Integration", "iOS/Android"],
      gradient: "from-purple-900/20 to-pink-900/20",
      border: "border-purple-500/20"
    },
    {
      icon: "🎮",
      title: "3D Web Experiences",
      description: "Immersive 3D websites using Three.js, Spline, and WebGL. Interactive product configurators and showcases.",
      technologies: ["Three.js", "Spline", "WebGL", "GLSL Shaders"],
      gradient: "from-cyan-900/20 to-blue-900/20",
      border: "border-cyan-500/20"
    },
    {
      icon: "🏢",
      title: "Enterprise SaaS",
      description: "AI-powered SaaS solutions with predictive analytics, multi-tenant architecture, and intelligent automation.",
      technologies: ["Predictive AI", "Multi-tenant", "Analytics", "Cloud Native"],
      gradient: "from-indigo-900/20 to-purple-900/20",
      border: "border-indigo-500/20"
    },
    {
      icon: "🛒",
      title: "AI E-commerce",
      description: "Smart e-commerce platforms with AI recommendations, dynamic pricing, and automated customer segmentation.",
      technologies: ["Shopify Plus", "AI Recommendations", "Dynamic Pricing", "Analytics"],
      gradient: "from-orange-900/20 to-red-900/20",
      border: "border-orange-500/20"
    }
  ]
}

// Server component - this runs on the server
export default async function AboutPage() {
  // Fetch team members server-side
  const teamData = await getTeamMembers()

  // Generate structured data for SEO
  const personSchema = generatePersonSchema()
  const organizationSchema = generateOrganizationSchema()

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
          __html: injectStructuredData(organizationSchema)
        }}
      />

      {/* Static content for SEO crawlers */}
      <main className="min-h-screen bg-black relative overflow-hidden px-4 py-8 md:px-8 lg:px-16">
        {/* SEO-friendly content structure */}
        <div className="max-w-4xl mx-auto mb-8 sm:mb-16 relative pt-16 sm:pt-20">
          <h1 className={`text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 text-center ${audiowide.className}`}>
            <span className="text-white">Crafting Digital </span>
            <span className="bg-white text-black px-3 py-1 rounded-md">Excellence</span>
          </h1>
          <div className={`text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-center ${vt323.className}`}>
            <p className="text-purple-400">
              "Democratizing AI through innovative digital solutions"
            </p>
          </div>
        </div>

        {/* About Ali Hasnaat - SEO Content */}
        <section className="max-w-6xl mx-auto mb-8 sm:mb-16 px-4">
          <div className="glass-card p-4 sm:p-8 rounded-2xl backdrop-blur-lg bg-purple-900/10 border border-purple-500/20">
            <h2 className={`text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-purple-300 ${audiowide.className}`}>
              About Ali Hasnaat - Founder & Lead Developer
            </h2>
            <div className={`space-y-4 sm:space-y-6 text-sm sm:text-base text-gray-300 ${vt323.className}`}>
              <p>
                With <strong>over 7 years of experience</strong> in AI-powered web development and digital innovation,
                I specialize in creating cutting-edge digital experiences that combine advanced artificial intelligence
                with exceptional user design. As the founder of NEX-DEVS, I lead a team of AI specialists in transforming
                businesses through intelligent automation and modern technology.
              </p>

              <p>
                As a full-stack developer and AI integration expert, I bring a unique blend of technical expertise,
                creative design thinking, and artificial intelligence to every project. I'm passionate about creating
                solutions that not only look stunning but also leverage AI to deliver exceptional user experiences,
                automate business processes, and drive measurable results.
              </p>

              {/* Mission Statement */}
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg border border-purple-500/20">
                <h3 className={`text-lg font-semibold mb-2 text-purple-300 ${audiowide.className}`}>Mission Statement</h3>
                <p className="text-gray-300">
                  "To democratize AI technology by creating intelligent, accessible solutions that empower businesses
                  to automate processes, enhance customer experiences, and achieve unprecedented growth through the
                  power of artificial intelligence."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pass data to client component for interactive features */}
        <AboutPageClient
          teamMembers={teamData.data}
          loading={!teamData.success}
          staticData={staticData}
        />
      </main>
    </>
  )
}