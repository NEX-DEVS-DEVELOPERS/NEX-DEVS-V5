'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import AdminAuthCheck from '@/app/components/AdminAuthCheck'
import { toast, Toaster } from 'react-hot-toast'

// Team member types
type SocialLinks = {
  github?: string;
  linkedin?: string;
  twitter?: string;
  dribbble?: string;
}

type TeamMember = {
  name: string;
  role: string;
  image: string;
  skills: string[];
  socialLinks: SocialLinks;
}

type TeamLeader = TeamMember & {
  bio: string;
}

type TeamData = {
  leader: TeamLeader;
  members: TeamMember[];
}

export default function AdminTeamPage() {
  const [teamData, setTeamData] = useState<TeamData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const leaderFileInputRef = useRef<HTMLInputElement>(null)
  const memberFileInputRefs = useRef<Array<HTMLInputElement | null>>([])

  // Function to fetch team data
  const fetchTeamData = async () => {
    setIsLoading(true)
    try {
      // Enhanced cache busting with multiple random values
      const timestamp = new Date().getTime();
      const randomValue = Math.floor(Math.random() * 10000000);
      const cache = `nocache=${timestamp}-${randomValue}`;
      
      const response = await fetch(`/api/team?t=${timestamp}&r=${randomValue}&${cache}`, {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
          'X-Force-Refresh': 'true',
          'X-Random-Value': randomValue.toString()
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`)
      }
      
      const data = await response.json()
      setTeamData(data)
    } catch (error) {
      console.error('Error fetching team data:', error)
      setError('Failed to load team data')
      toast.error('Failed to load team data')
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch team data on component mount
  useEffect(() => {
    fetchTeamData()
  }, [])

  // Handle leader image upload
  const handleLeaderImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return
    }
    
    const file = e.target.files[0]
    setIsUploading(true)
    
    try {
      // Get admin password for authorization
      const password = sessionStorage.getItem('adminPassword') || 'nex-devs.org889123'
      
      const formData = new FormData()
      formData.append('file', file)
      formData.append('password', password)
      formData.append('roleType', 'leader')
      
      // Include timestamp for cache busting
      const timestamp = Date.now()
      
      const response = await fetch(`/api/team/upload?t=${timestamp}`, {
        method: 'POST',
        body: formData,
        cache: 'no-store'
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `HTTP error ${response.status}` }))
        throw new Error(errorData.error || `Failed to upload image: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Update the team data with the new image path
      if (teamData) {
        setTeamData({
          ...teamData,
          leader: {
            ...teamData.leader,
            image: data.imagePath
          }
        })
      }
      
      toast.success('Leader image uploaded successfully!')
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  // Handle member image upload
  const handleMemberImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (!e.target.files || e.target.files.length === 0 || !teamData) {
      return
    }
    
    const file = e.target.files[0]
    setIsUploading(true)
    
    try {
      // Get admin password for authorization
      const password = sessionStorage.getItem('adminPassword') || 'nex-devs.org889123'
      
      const formData = new FormData()
      formData.append('file', file)
      formData.append('password', password)
      formData.append('roleType', 'member')
      
      // Include timestamp for cache busting
      const timestamp = Date.now()
      
      const response = await fetch(`/api/team/upload?t=${timestamp}`, {
        method: 'POST',
        body: formData,
        cache: 'no-store'
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `HTTP error ${response.status}` }))
        throw new Error(errorData.error || `Failed to upload image: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Update the team data with the new image path
      const updatedMembers = [...teamData.members]
      updatedMembers[index] = {
        ...updatedMembers[index],
        image: data.imagePath
      }
      
      setTeamData({
        ...teamData,
        members: updatedMembers
      })
      
      toast.success(`Team member image uploaded successfully!`)
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  // Handle form input change for leader
  const handleLeaderChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    if (!teamData) return
    
    if (name.startsWith('socialLinks.')) {
      const linkType = name.split('.')[1]
      setTeamData({
        ...teamData,
        leader: {
          ...teamData.leader,
          socialLinks: {
            ...teamData.leader.socialLinks,
            [linkType]: value
          }
        }
      })
    } else if (name === 'skills') {
      setTeamData({
        ...teamData,
        leader: {
          ...teamData.leader,
          skills: value.split(',').map(skill => skill.trim())
        }
      })
    } else {
      setTeamData({
        ...teamData,
        leader: {
          ...teamData.leader,
          [name]: value
        }
      })
    }
  }

  // Handle form input change for members
  const handleMemberChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value } = e.target
    
    if (!teamData) return
    
    const updatedMembers = [...teamData.members]
    
    if (name.startsWith('socialLinks.')) {
      const linkType = name.split('.')[1]
      updatedMembers[index] = {
        ...updatedMembers[index],
        socialLinks: {
          ...updatedMembers[index].socialLinks,
          [linkType]: value
        }
      }
    } else if (name === 'skills') {
      updatedMembers[index] = {
        ...updatedMembers[index],
        skills: value.split(',').map(skill => skill.trim())
      }
    } else {
      updatedMembers[index] = {
        ...updatedMembers[index],
        [name]: value
      }
    }
    
    setTeamData({
      ...teamData,
      members: updatedMembers
    })
  }

  // Save team data
  const saveTeamData = async () => {
    if (!teamData) return
    
    try {
      // Get admin password for authorization
      const password = sessionStorage.getItem('adminPassword') || 'nex-devs.org889123'
      
      const response = await fetch('/api/team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...teamData,
          password
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `HTTP error ${response.status}` }))
        throw new Error(errorData.error || `Failed to save team data: ${response.status}`)
      }
      
      const data = await response.json()
      toast.success('Team data saved successfully!')
      
      // Refresh the data
      fetchTeamData()
    } catch (error) {
      console.error('Error saving team data:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save team data')
    }
  }

  return (
    <AdminAuthCheck>
      <div className="min-h-screen bg-[#0a0a0a] pt-32 p-6">
        <Toaster position="top-right" />
        
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-purple-400 to-blue-500 bg-clip-text text-transparent">
                Team Management
              </h1>
              <p className="text-gray-400 mt-2">Manage your team information and images</p>
            </div>
            
            <div className="flex flex-wrap gap-2 md:gap-3">
              <Link
                href="/hasnaat"
                className="bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span>Admin Home</span>
              </Link>

              <button
                onClick={saveTeamData}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Save Changes</span>
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          ) : teamData ? (
            <div className="space-y-8">
              {/* Team Leader Section */}
              <div className="bg-gray-900/50 rounded-xl border border-purple-500/20 overflow-hidden shadow-lg p-6">
                <h2 className="text-xl text-white font-semibold mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-purple-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Team Leader
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Leader Image */}
                  <div className="flex flex-col space-y-4">
                    <div className="aspect-ratio-box relative rounded-lg overflow-hidden bg-gray-800 border border-gray-700">
                      <div className="aspect-ratio-box-inside">
                        {teamData.leader.image ? (
                          <Image
                            src={teamData.leader.image}
                            alt={teamData.leader.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full bg-gray-800 text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>
                    </div>
                    <input
                      type="file"
                      ref={leaderFileInputRef}
                      onChange={handleLeaderImageUpload}
                      className="hidden"
                      accept="image/*"
                    />
                    <button
                      onClick={() => leaderFileInputRef.current?.click()}
                      disabled={isUploading}
                      className="px-4 py-2 bg-purple-600/40 text-white rounded-lg hover:bg-purple-600/60 transition-colors flex items-center justify-center gap-2"
                    >
                      {isUploading ? 'Uploading...' : 'Upload Leader Image'}
                    </button>
                    <p className="text-xs text-gray-400 text-center">
                      Recommended: Square image (1:1 aspect ratio)
                    </p>
                  </div>

                  {/* Leader Details */}
                  <div className="md:col-span-2 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={teamData.leader.name}
                          onChange={handleLeaderChange}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Role
                        </label>
                        <input
                          type="text"
                          name="role"
                          value={teamData.leader.role}
                          onChange={handleLeaderChange}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={teamData.leader.bio}
                        onChange={handleLeaderChange}
                        rows={4}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Skills (comma separated)
                      </label>
                      <input
                        type="text"
                        name="skills"
                        value={teamData.leader.skills.join(', ')}
                        onChange={handleLeaderChange}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          GitHub
                        </label>
                        <input
                          type="text"
                          name="socialLinks.github"
                          value={teamData.leader.socialLinks.github || ''}
                          onChange={handleLeaderChange}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          LinkedIn
                        </label>
                        <input
                          type="text"
                          name="socialLinks.linkedin"
                          value={teamData.leader.socialLinks.linkedin || ''}
                          onChange={handleLeaderChange}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Twitter
                        </label>
                        <input
                          type="text"
                          name="socialLinks.twitter"
                          value={teamData.leader.socialLinks.twitter || ''}
                          onChange={handleLeaderChange}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Dribbble
                        </label>
                        <input
                          type="text"
                          name="socialLinks.dribbble"
                          value={teamData.leader.socialLinks.dribbble || ''}
                          onChange={handleLeaderChange}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Members Section */}
              <div className="bg-gray-900/50 rounded-xl border border-purple-500/20 overflow-hidden shadow-lg p-6">
                <h2 className="text-xl text-white font-semibold mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-purple-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  Team Members
                </h2>

                <div className="space-y-8">
                  {teamData.members.map((member, index) => (
                    <div key={index} className="border-t border-gray-800 pt-6 first:border-0 first:pt-0">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Member Image */}
                        <div className="flex flex-col space-y-4">
                          <div className="aspect-ratio-box relative rounded-lg overflow-hidden bg-gray-800 border border-gray-700">
                            <div className="aspect-ratio-box-inside">
                              {member.image ? (
                                <Image
                                  src={member.image}
                                  alt={member.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full bg-gray-800 text-gray-400">
                                  No Image
                                </div>
                              )}
                            </div>
                          </div>
                          <input
                            type="file"
                            ref={(el) => {
                              memberFileInputRefs.current[index] = el;
                            }}
                            onChange={(e) => handleMemberImageUpload(e, index)}
                            className="hidden"
                            accept="image/*"
                          />
                          <button
                            onClick={() => memberFileInputRefs.current[index]?.click()}
                            disabled={isUploading}
                            className="px-4 py-2 bg-purple-600/40 text-white rounded-lg hover:bg-purple-600/60 transition-colors flex items-center justify-center gap-2"
                          >
                            {isUploading ? 'Uploading...' : 'Upload Image'}
                          </button>
                          <p className="text-xs text-gray-400 text-center">
                            Recommended: Square image (1:1 aspect ratio)
                          </p>
                        </div>

                        {/* Member Details */}
                        <div className="md:col-span-2 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-400 mb-1">
                                Name
                              </label>
                              <input
                                type="text"
                                name="name"
                                value={member.name}
                                onChange={(e) => handleMemberChange(e, index)}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-400 mb-1">
                                Role
                              </label>
                              <input
                                type="text"
                                name="role"
                                value={member.role}
                                onChange={(e) => handleMemberChange(e, index)}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                              Skills (comma separated)
                            </label>
                            <input
                              type="text"
                              name="skills"
                              value={member.skills.join(', ')}
                              onChange={(e) => handleMemberChange(e, index)}
                              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-400 mb-1">
                                GitHub
                              </label>
                              <input
                                type="text"
                                name="socialLinks.github"
                                value={member.socialLinks.github || ''}
                                onChange={(e) => handleMemberChange(e, index)}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-400 mb-1">
                                LinkedIn
                              </label>
                              <input
                                type="text"
                                name="socialLinks.linkedin"
                                value={member.socialLinks.linkedin || ''}
                                onChange={(e) => handleMemberChange(e, index)}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-400 mb-1">
                                Twitter
                              </label>
                              <input
                                type="text"
                                name="socialLinks.twitter"
                                value={member.socialLinks.twitter || ''}
                                onChange={(e) => handleMemberChange(e, index)}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-400 mb-1">
                                Dribbble
                              </label>
                              <input
                                type="text"
                                name="socialLinks.dribbble"
                                value={member.socialLinks.dribbble || ''}
                                onChange={(e) => handleMemberChange(e, index)}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save button at bottom */}
              <div className="flex justify-end mt-8">
                <button
                  onClick={saveTeamData}
                  className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Save All Changes</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg p-4">
              {error || 'Could not load team data'}
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .aspect-ratio-box {
          position: relative;
          padding-bottom: 100%; /* Square aspect ratio (1:1) */
          height: 0;
          overflow: hidden;
        }
        
        .aspect-ratio-box-inside {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </AdminAuthCheck>
  )
} 