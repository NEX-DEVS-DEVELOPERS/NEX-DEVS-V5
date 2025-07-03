'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { toast, Toaster } from 'react-hot-toast'
import AdminAuthCheck from '@/components/AdminAuthCheck'

interface TeamMember {
  id: number
  name: string
  title: string
  bio?: string
  image_url: string
  email?: string
  linkedin_url?: string
  github_url?: string
  twitter_url?: string
  dribbble_url?: string
  website_url?: string
  skills: string[]
  order_priority: number
  active: boolean
  is_leader: boolean
  created_at: string
  last_updated: string
}

export default function TeamMembersAdmin() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<number | null>(null)

  // Fetch team members
  const fetchTeamMembers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/team-members')
      
      if (!response.ok) {
        throw new Error(`Failed to fetch team members: ${response.status}`)
      }
      
      const data = await response.json()
      setTeamMembers(data.data || [])
    } catch (error) {
      console.error('Error fetching team members:', error)
      toast.error('Failed to load team members')
    } finally {
      setLoading(false)
    }
  }

  // Delete team member
  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      return
    }

    try {
      setDeleting(id)
      const password = sessionStorage.getItem('adminPassword') || 'nex-devs.org889123'
      
      const response = await fetch(`/api/team-members/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `HTTP error ${response.status}` }))
        throw new Error(errorData.error || `Failed to delete team member: ${response.status}`)
      }

      toast.success(`${name} deleted successfully!`)
      fetchTeamMembers() // Refresh the list
    } catch (error) {
      console.error('Error deleting team member:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete team member')
    } finally {
      setDeleting(null)
    }
  }

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  if (loading) {
    return (
      <AdminAuthCheck>
        <div className="min-h-screen bg-[#0a0a0a] pt-32 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
          </div>
        </div>
      </AdminAuthCheck>
    )
  }

  return (
    <AdminAuthCheck>
      <div className="min-h-screen bg-[#0a0a0a] pt-32 p-6">
        <Toaster position="top-right" />
        
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-400 to-blue-500 bg-clip-text text-transparent">
                Team Members Management
              </h1>
              <p className="text-gray-400 mt-1">Manage your team members and their information</p>
            </div>
            
            <div className="flex items-center gap-4">
              <Link 
                href="/admin/team-members/new" 
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Team Member
              </Link>
              <Link 
                href="/admin" 
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Back to Admin
              </Link>
            </div>
          </div>

          {/* Team Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-gray-900/50 rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-colors"
              >
                {/* Member Image and Basic Info */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border border-purple-500/20">
                    <Image
                      src={member.image_url}
                      alt={member.name}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      {member.name}
                      {member.is_leader && (
                        <span className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-400 rounded-full border border-yellow-500/30">
                          Leader
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-purple-400">{member.title}</p>
                  </div>
                </div>

                {/* Bio */}
                {member.bio && (
                  <p className="text-gray-400 text-sm mb-4" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>{member.bio}</p>
                )}

                {/* Skills */}
                {member.skills && member.skills.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {member.skills.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-200"
                        >
                          {skill}
                        </span>
                      ))}
                      {member.skills.length > 3 && (
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-500/10 border border-gray-500/20 text-gray-400">
                          +{member.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Social Links */}
                <div className="flex gap-2 mb-4">
                  {member.github_url && (
                    <a href={member.github_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                  )}
                  {member.linkedin_url && (
                    <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link
                    href={`/admin/team-members/${member.id}/edit`}
                    className="flex-1 px-3 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors text-center text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(member.id, member.name)}
                    disabled={deleting === member.id}
                    className="flex-1 px-3 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors text-sm disabled:opacity-50"
                  >
                    {deleting === member.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>

                {/* Metadata */}
                <div className="mt-4 pt-4 border-t border-gray-700/50">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>ID: {member.id}</span>
                    <span>Priority: {member.order_priority}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {teamMembers.length === 0 && (
            <div className="text-center py-20">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Team Members Found</h3>
              <p className="text-gray-400 mb-6">Get started by adding your first team member.</p>
              <Link 
                href="/admin/team-members/new" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add First Team Member
              </Link>
            </div>
          )}
        </div>
      </div>
    </AdminAuthCheck>
  )
}
