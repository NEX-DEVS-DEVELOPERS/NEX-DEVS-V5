'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

const projects = [
  {
    title: "E-commerce Platform",
    description: "A full-featured e-commerce platform built with Next.js and Shopify, handling 100k+ monthly users with seamless performance.",
    image: "/projects/ecommerce.webp",
    tech: ["Next.js", "Node.js", "MongoDB", "AWS", "Shopify"],
    metrics: ["45% faster loading", "2x conversion rate", "99.9% uptime"],
    link: "#",
    category: "E-commerce",
    gradient: "from-blue-500/20 to-purple-500/20"
  },
  {
    title: "AI Analytics Dashboard",
    description: "Enterprise-level analytics platform with AI-powered insights, helping businesses make data-driven decisions.",
    image: "/projects/analytics.webp",
    tech: ["Python", "TensorFlow", "React", "GraphQL"],
    metrics: ["85% accuracy", "3x faster insights", "50% cost reduction"],
    link: "#",
    category: "AI & Analytics",
    gradient: "from-purple-500/20 to-pink-500/20"
  },
  {
    title: "Healthcare Management System",
    description: "Comprehensive healthcare platform managing patient records, appointments, and medical data with strict security protocols.",
    image: "/projects/healthcare.webp",
    tech: ["React", "Node.js", "PostgreSQL", "Docker"],
    metrics: ["99.99% uptime", "HIPAA compliant", "30% efficiency increase"],
    link: "#",
    category: "Healthcare",
    gradient: "from-indigo-500/20 to-violet-500/20"
  },
  // Add more projects as needed
]

export default function Projects() {
  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[128px] animate-pulse" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[128px] animate-pulse delay-700" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Featured Projects
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Explore our portfolio of successful projects delivering innovative solutions
              across various industries
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 gap-12">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} 
                              opacity-20 rounded-xl blur-xl group-hover:opacity-30 
                              transition-opacity duration-500`} />
                
                <div className="relative p-8 rounded-xl border border-white/10 bg-black/50 
                              backdrop-blur-sm hover:border-purple-500/50 
                              transition-all duration-300">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Project Image */}
                    <div className="relative h-[300px] rounded-xl overflow-hidden">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Project Details */}
                    <div className="space-y-6">
                      <div>
                        <span className="text-sm text-purple-400">{project.category}</span>
                        <h3 className="text-2xl font-bold text-white mt-1 
                                   group-hover:text-purple-200 transition-colors">
                          {project.title}
                        </h3>
                      </div>

                      <p className="text-gray-400">{project.description}</p>

                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 text-sm rounded-full bg-white/5 
                                   border border-white/10 text-gray-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Metrics */}
                      <div className="space-y-2">
                        {project.metrics.map((metric) => (
                          <div key={metric} className="flex items-center gap-2 text-sm text-gray-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500/50" />
                            {metric}
                          </div>
                        ))}
                      </div>

                      {/* Project Link */}
                      <Link
                        href={project.link}
                        className="inline-flex items-center gap-2 text-white hover:text-purple-200 
                                transition-colors duration-300"
                      >
                        View Project Details
                        <span className="text-xl">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <h2 className="text-3xl font-bold text-white">Start Your Project</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Ready to transform your digital presence? Let's create something amazing together.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black 
                     rounded-xl hover:bg-gray-100 transition-colors duration-300"
            >
              Get in Touch
              <span className="text-xl">→</span>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  )
} 