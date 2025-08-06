import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Audiowide } from 'next/font/google'
import BusinessHeroClient from './BusinessHeroClient'

const audiowide = Audiowide({
  weight: '400',
  subsets: ['latin'],
});

// Static data for server-side rendering
const staticHeroData = {
  businessBenefits: [
    {
      title: "AI Automation",
      description: "Automate repetitive tasks and workflows with intelligent AI systems",
      icon: "🤖"
    },
    {
      title: "Data Analysis", 
      description: "Gain insights through advanced AI-powered data analysis",
      icon: "📊"
    },
    {
      title: "Smart Decisions",
      description: "Make data-backed decisions with predictive AI models", 
      icon: "🧠"
    },
    {
      title: "Scale Efficiently",
      description: "AI solutions that grow with your business needs",
      icon: "🚀"
    }
  ],

  advancedFeatures: [
    {
      title: "AI Integration",
      description: "Custom AI solutions that adapt to your business needs",
      icon: "🧠",
      details: ["Chatbot Integration", "Smart Content Generation", "User Behavior Analysis"]
    },
    {
      title: "Automation",
      description: "Streamline workflows with intelligent automation systems",
      icon: "⚙️",
      details: ["Workflow Automation", "Process Optimization", "Task Scheduling"]
    },
    {
      title: "Analytics",
      description: "Deep insights through advanced data analytics and reporting",
      icon: "📈",
      details: ["Real-time Analytics", "Predictive Modeling", "Performance Metrics"]
    },
    {
      title: "Scalability",
      description: "Solutions that grow and adapt with your business",
      icon: "🔄",
      details: ["Cloud Infrastructure", "Auto-scaling", "Load Balancing"]
    }
  ],

  stats: {
    projectsCompleted: "950+",
    clientSatisfaction: "98%",
    yearsExperience: "7+",
    technologiesUsed: "50+"
  },

  services: [
    {
      title: "AI-Powered Web Development",
      description: "Modern web applications with integrated AI capabilities",
      features: ["React/Next.js", "AI Integration", "Real-time Features", "Responsive Design"]
    },
    {
      title: "Intelligent Automation",
      description: "Streamline business processes with smart automation",
      features: ["Workflow Automation", "Data Processing", "API Integration", "Custom Solutions"]
    },
    {
      title: "Data Analytics & Insights",
      description: "Transform data into actionable business intelligence",
      features: ["Predictive Analytics", "Real-time Dashboards", "Custom Reports", "Data Visualization"]
    }
  ]
}

// Server-side component for SEO and initial render
export default function BusinessHeroSSR() {
  return (
    <section className="relative min-h-screen bg-black overflow-hidden">
      {/* Static background for SEO */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-black" />
      
      {/* Main content container */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        {/* Hero Header - SEO optimized */}
        <div className="text-center mb-16">
          <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-6 ${audiowide.className}`}>
            <span className="text-white">Transform Your Business with </span>
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI-Powered Solutions
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
            NEX-DEVS specializes in creating intelligent web applications, automation systems, 
            and AI integrations that drive business growth and efficiency.
          </p>

          {/* CTA Buttons - Static for SEO */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/contact">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg">
                Start Your AI Journey
              </Button>
            </Link>
            <Link href="/projects">
              <Button variant="outline" className="border-purple-500 text-purple-300 hover:bg-purple-500/10 px-8 py-3 text-lg">
                View Our Work
              </Button>
            </Link>
          </div>
        </div>

        {/* Business Benefits Grid - SEO Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {staticHeroData.businessBenefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 text-center hover:border-purple-500/40 transition-colors"
            >
              <div className="text-4xl mb-4">{benefit.icon}</div>
              <h3 className={`text-lg font-semibold text-white mb-2 ${audiowide.className}`}>
                {benefit.title}
              </h3>
              <p className="text-gray-300 text-sm">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Services Overview - SEO Content */}
        <div className="mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold text-center text-white mb-12 ${audiowide.className}`}>
            Our AI-Powered Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {staticHeroData.services.map((service, index) => (
              <div
                key={service.title}
                className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-8"
              >
                <h3 className={`text-xl font-semibold text-white mb-4 ${audiowide.className}`}>
                  {service.title}
                </h3>
                <p className="text-gray-300 mb-6">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-400">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section - SEO Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">
              {staticHeroData.stats.projectsCompleted}
            </div>
            <div className="text-gray-300 text-sm">Projects Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-green-400 mb-2">
              {staticHeroData.stats.clientSatisfaction}
            </div>
            <div className="text-gray-300 text-sm">Client Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">
              {staticHeroData.stats.yearsExperience}
            </div>
            <div className="text-gray-300 text-sm">Years Experience</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-pink-400 mb-2">
              {staticHeroData.stats.technologiesUsed}
            </div>
            <div className="text-gray-300 text-sm">Technologies Used</div>
          </div>
        </div>

        {/* Technology Stack - SEO Content */}
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold text-white mb-8 ${audiowide.className}`}>
            Cutting-Edge Technology Stack
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              'React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'AI/ML',
              'AWS', 'Docker', 'PostgreSQL', 'MongoDB', 'Redis', 'GraphQL'
            ].map((tech) => (
              <div
                key={tech}
                className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-lg p-4 text-center"
              >
                <span className="text-white font-medium">{tech}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action - SEO Content */}
        <div className="text-center bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-8">
          <h2 className={`text-2xl md:text-3xl font-bold text-white mb-4 ${audiowide.className}`}>
            Ready to Transform Your Business?
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Join 950+ successful projects and discover how AI-powered solutions can revolutionize your business operations, 
            increase efficiency, and drive unprecedented growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3">
                Get Free Consultation
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" className="border-purple-500 text-purple-300 hover:bg-purple-500/10 px-8 py-3">
                Learn More About Us
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Pass data to client component for interactive features */}
      <BusinessHeroClient heroData={staticHeroData} />
    </section>
  )
}
