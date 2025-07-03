'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface TeamMember {
  id: number
  name: string
  title: string
  bio?: string
  image_url: string
  skills: string[]
  is_leader: boolean
  socialLinks: {
    github?: string
    linkedin?: string
    twitter?: string
    dribbble?: string
    website?: string
  }
}

  // Social icon components
  const SocialIcon = ({ platform }: { platform: string }) => {
    switch (platform) {
      case 'github':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
        )
      case 'linkedin':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
        )
      case 'twitter':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
          </svg>
        )
      case 'dribbble':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" />
          </svg>
        )
      default:
        return <span className="text-xs capitalize">{platform}</span>
    }
  }

export default function TeamSection() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch team members from API
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch('/api/team-members')
        if (response.ok) {
          const data = await response.json()
          setTeamMembers(data.data || [])
        }
      } catch (error) {
        console.error('Error fetching team members:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTeamMembers()
  }, [])

  // Separate leader and regular members
  const teamLeader = teamMembers.find(member => member.is_leader)
  const regularMembers = teamMembers.filter(member => !member.is_leader)

  if (loading) {
    return (
      <section className="py-12 sm:py-16 relative bg-gradient-to-b from-black via-purple-950/5 to-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Meet Our Team</h2>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="team" className="py-12 sm:py-16 relative overflow-hidden">
      {/* Neural Network Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/5 to-black"></div>

        {/* Floating Tech Stack Names */}
        {[
          { name: 'Next.js', color: 'text-blue-400' },
          { name: 'React', color: 'text-cyan-400' },
          { name: 'TypeScript', color: 'text-blue-500' },
          { name: 'Node.js', color: 'text-green-400' },
          { name: 'Python', color: 'text-yellow-400' },
          { name: 'AWS', color: 'text-orange-400' },
          { name: 'PostgreSQL', color: 'text-blue-300' },
          { name: 'Flutter', color: 'text-cyan-300' },
          { name: 'React Native', color: 'text-blue-400' }
        ].map((tech, i) => (
          <div
            key={`tech-${i}`}
            className={`absolute ${tech.color} text-sm font-mono opacity-40 transform-gpu`}
            style={{
              top: `${15 + Math.random() * 70}%`,
              left: `${Math.random() > 0.5 ? 5 + Math.random() * 20 : 80 + Math.random() * 15}%`,
              animation: `float-tech ${8 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          >
            • {tech.name}
          </div>
        ))}

        {/* Neural Network Nodes and Connections */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={`node-${i}`}
              className="absolute w-1 h-1 rounded-full transform-gpu"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                background: `rgba(${
                  Math.random() > 0.5 
                    ? '147, 51, 234' 
                    : Math.random() > 0.5 
                      ? '56, 189, 248'
                      : '52, 211, 153'
                }, ${0.4 + Math.random() * 0.3})`,
                boxShadow: `0 0 6px rgba(147, 51, 234, 0.3)`,
                animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            >
              {/* Multiple Neural Connections per Node */}
              {[...Array(3)].map((_, j) => (
                <div
                  key={`connection-${i}-${j}`}
                  className="absolute w-48 h-px origin-left transform-gpu"
                  style={{
                    background: `linear-gradient(90deg, rgba(${
                      Math.random() > 0.5 
                        ? '147, 51, 234' 
                        : Math.random() > 0.5 
                          ? '56, 189, 248'
                          : '52, 211, 153'
                    }, 0.4) 0%, transparent 100%)`,
                    transform: `rotate(${Math.random() * 360}deg)`,
                    animation: `connection-pulse ${4 + Math.random() * 3}s cubic-bezier(0.4, 0, 0.2, 1) infinite`,
                    animationDelay: `${Math.random() * 2}s`,
                    height: '1px',
                    filter: 'blur(0.2px)'
                  }}
                ></div>
              ))}
            </div>
          ))}
        </div>

        {/* Animation Keyframes */}
        <style jsx global>{`
          @keyframes float {
            0%, 100% { transform: translate(0, 0) translateZ(0); }
            50% { transform: translate(${Math.random() > 0.5 ? '' : '-'}8px, -8px) translateZ(0); }
          }

          @keyframes float-tech {
            0%, 100% { transform: translate(0, 0) translateZ(0); opacity: 0.4; }
            50% { transform: translate(${Math.random() > 0.5 ? '' : '-'}15px, -10px) translateZ(0); opacity: 0.6; }
          }

          @keyframes connection-pulse {
            0% { transform: scaleX(0) rotate(var(--rotation)) translateZ(0); opacity: 0; }
            50% { transform: scaleX(1) rotate(var(--rotation)) translateZ(0); opacity: 0.4; }
            100% { transform: scaleX(0) rotate(var(--rotation)) translateZ(0); opacity: 0; }
          }

          .transform-gpu {
            transform-style: preserve-3d;
            backface-visibility: hidden;
            perspective: 1000px;
            will-change: transform;
          }
        `}</style>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        {/* Compact Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-4">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Our Team
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-4">
            Meet Our Team
          </h2>
        </div>

        {/* Team Leader Card - Modern Design */}
        {teamLeader && (
          <div className="mb-12">
            <div className="relative">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-black/40 rounded-2xl border border-purple-500/20 p-6 backdrop-blur-sm">
                {/* Leader Image with Enhanced Quality */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                    <Image
                      src={teamLeader.image_url}
                      alt={teamLeader.name}
                      width={1920}
                      height={1080}
                      className="object-cover w-full h-full transition-all duration-700 ease-in-out group-hover:scale-105 blur-[8px] group-hover:blur-0"
                      placeholder="blur"
                      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMjAyMDMwIi8+PC9zdmc+"
                      priority
                      quality={100}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                  </div>
                </div>

                {/* Leader Info - Modernized */}
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-sm font-medium">
                        Team Leader
                      </span>
                      {/* Availability Indicator */}
                      <span className="inline-flex items-center gap-2 text-sm text-emerald-400">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Available for Projects
                      </span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                      {teamLeader.name}
                    </h3>
                    <p className="text-lg text-purple-400 font-medium mb-4">{teamLeader.title}</p>
                    {teamLeader.bio && (
                      <p className="text-gray-300 leading-relaxed">{teamLeader.bio}</p>
                    )}
                  </div>

                  {teamLeader.skills && teamLeader.skills.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-white font-medium">Core Expertise</h4>
                      <div className="flex flex-wrap gap-2">
                        {teamLeader.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 text-sm font-medium rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Modern Social Links */}
                  <div className="flex gap-3">
                    {Object.entries(teamLeader.socialLinks).map(([platform, url]) => {
                      if (!url) return null
                      return (
                        <Link
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-purple-400 hover:border-purple-500/50 transition-all duration-300 hover:scale-110"
                        >
                          <SocialIcon platform={platform} />
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regular Team Members - Compact Grid */}
        {regularMembers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {regularMembers.map((member) => (
                <div
                  key={member.id}
                className="group relative bg-black/40 rounded-xl border border-purple-500/20 p-4 backdrop-blur-sm hover:border-purple-500/40 transition-all duration-300"
              >
                <div className="relative mb-4 aspect-[4/3] rounded-lg overflow-hidden">
                          <Image
                            src={member.image_url}
                            alt={member.name}
                    width={400}
                    height={300}
                    className="object-cover w-full h-full transition-all duration-700 ease-in-out group-hover:scale-105 blur-[8px] group-hover:blur-0"
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMjAyMDMwIi8+PC9zdmc+"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{member.name}</h3>
                    <p className="text-sm text-purple-400">{member.title}</p>
                      </div>

                  {member.skills && (
                    <div className="flex flex-wrap gap-1">
                      {member.skills.slice(0, 3).map((skill, index) => (
                            <span
                          key={index}
                          className="px-2 py-0.5 text-xs rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-200"
                            >
                              {skill}
                            </span>
                          ))}
                      {member.skills.length > 3 && (
                        <span className="text-xs text-gray-400">+{member.skills.length - 3} more</span>
                      )}
                      </div>
                    )}

                  <div className="flex gap-2">
                        {Object.entries(member.socialLinks).map(([platform, url]) => {
                          if (!url) return null
                          return (
                            <Link
                              key={platform}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-purple-400 hover:border-purple-500/50 transition-all duration-300"
                            >
                              <SocialIcon platform={platform} />
                            </Link>
                          )
                        })}
                      </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
} 