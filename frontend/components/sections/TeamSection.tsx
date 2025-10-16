'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import TeamMemberCard from './TeamMemberCard' // Import the new component
import { audiowide } from '@/frontend/utils/fonts';
import { fetchWithCache } from '@/lib/cache-utils';

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

  // Fetch team members from API with smart caching
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        // Use smart caching to reduce API calls
        const data = await fetchWithCache<{data: TeamMember[]}>(
          '/api/team-members',
          {},
          {
            ttl: 10 * 60 * 1000, // 10 minutes cache for team data
            tags: ['team', 'team-members']
          }
        );
        setTeamMembers(data.data || [])
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
      {/* Aurora Background Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none">
        {/* Base Background */}
        <div className="absolute inset-0 bg-black"></div>

        {/* Aurora Orbs */}
        <div className="absolute top-[-10%] left-[20%] w-[28rem] h-[28rem] bg-gradient-to-br from-purple-500/35 via-fuchsia-400/20 to-blue-500/25 rounded-full blur-[110px] mix-blend-screen animate-aurora-1"></div>
        <div className="absolute top-1/3 right-[18%] w-[24rem] h-[24rem] bg-gradient-to-br from-blue-500/30 via-cyan-400/20 to-violet-500/20 rounded-full blur-[110px] mix-blend-screen animate-aurora-2"></div>
        <div className="absolute bottom-[-12%] left-1/2 -translate-x-1/2 w-[22rem] h-[22rem] bg-gradient-to-br from-violet-500/25 via-purple-400/15 to-blue-400/20 rounded-full blur-[110px] mix-blend-screen animate-aurora-3"></div>

        {/* Animation Keyframes */}
        <style jsx global>{`
          @keyframes aurora-1 {
            0%, 100% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.35; }
            33% { transform: translate3d(30px, -30px, 0) scale(1.08); opacity: 0.45; }
            66% { transform: translate3d(-20px, 15px, 0) scale(0.95); opacity: 0.4; }
          }

          @keyframes aurora-2 {
            0%, 100% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.28; }
            33% { transform: translate3d(-40px, 30px, 0) scale(1.03); opacity: 0.35; }
            66% { transform: translate3d(25px, -25px, 0) scale(0.98); opacity: 0.32; }
          }

          @keyframes aurora-3 {
            0%, 100% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.22; }
            33% { transform: translate3d(20px, 20px, 0) scale(1.05); opacity: 0.3; }
            66% { transform: translate3d(-30px, -15px, 0) scale(0.96); opacity: 0.26; }
          }

          .animate-aurora-1 { animation: aurora-1 18s ease-in-out infinite; }
          .animate-aurora-2 { animation: aurora-2 22s ease-in-out infinite; }
          .animate-aurora-3 { animation: aurora-3 26s ease-in-out infinite; }
        `}</style>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Compact Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-4">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Our Team
          </div>
          <h2 className={`text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-4 ${audiowide.className}`}>
            Meet Our Team
          </h2>
        </div>

        {/* Team Leader Card - Modern Design */}
        {teamLeader && (
          <div className="mb-12">
            <div className="relative">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-black/40 rounded-2xl border border-white/10 p-6 backdrop-blur-sm">
                {/* Use TeamMemberCard for the leader */}
                <TeamMemberCard member={teamLeader} />

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

                  {/* Leader's Social Links */}
                  <div className="flex items-center space-x-4">
                    {Object.entries(teamLeader.socialLinks).map(([platform, url]) => (
                      url && (
                        <a key={platform} href={url as string} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
                          <span className="sr-only">{platform}</span>
                          <SocialIcon platform={platform} />
                        </a>
                      )
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regular Team Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularMembers.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  )
} 