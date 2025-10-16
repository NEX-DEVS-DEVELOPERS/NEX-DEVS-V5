'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { toast, Toaster } from 'react-hot-toast'
import AdminAuthCheck from '@/frontend/components/AdminAuthCheck'

interface TeamMemberForm {
  name: string
  title: string
  bio: string
  image_url: string
  email: string
  linkedin_url: string
  github_url: string
  twitter_url: string
  dribbble_url: string
  website_url: string
  skills: string[]
  order_priority: number
  is_leader: boolean
  active: boolean
}

export default function NewTeamMember() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  
  const [teamMember, setTeamMember] = useState<TeamMemberForm>({
    name: '',
    title: '',
    bio: '',
    image_url: '/team/placeholder.jpg',
    email: '',
    linkedin_url: '',
    github_url: '',
    twitter_url: '',
    dribbble_url: '',
    website_url: '',
    skills: [''],
    order_priority: 0,
    is_leader: false,
    active: true
  })

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setTeamMember(prev => ({
        ...prev,
        [name]: checked
      }))
    } else if (type === 'number') {
      setTeamMember(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }))
    } else {
      setTeamMember(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  // Handle skills array changes
  const handleSkillChange = (index: number, value: string) => {
    const newSkills = [...teamMember.skills]
    newSkills[index] = value
    setTeamMember(prev => ({
      ...prev,
      skills: newSkills
    }))
  }

  const addSkillField = () => {
    setTeamMember(prev => ({
      ...prev,
      skills: [...prev.skills, '']
    }))
  }

  const removeSkillField = (index: number) => {
    if (teamMember.skills.length > 1) {
      const newSkills = teamMember.skills.filter((_, i) => i !== index)
      setTeamMember(prev => ({
        ...prev,
        skills: newSkills
      }))
    }
  }

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      
      const formData = new FormData()
      formData.append('file', file)
      formData.append('password', sessionStorage.getItem('adminPassword') || 'nex-devs.org889123')

      const response = await fetch('/api/team-members/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `HTTP error ${response.status}` }))
        throw new Error(errorData.error || 'Failed to upload image')
      }

      const data = await response.json()
      
      if (data.success) {
        setTeamMember(prev => ({
          ...prev,
          image_url: data.imagePath
        }))
        setUploadedImage(data.imagePath)
        toast.success('Image uploaded successfully!')
      } else {
        throw new Error(data.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Get the admin password
      const password = sessionStorage.getItem('adminPassword') || 'nex-devs.org889123'
      
      // Prepare submission data
      const submissionData = {
        ...teamMember,
        skills: teamMember.skills.filter(skill => skill.trim() !== ''),
        password
      }
      
      console.log('Submitting team member data:', {
        name: submissionData.name,
        title: submissionData.title,
        isLeader: submissionData.is_leader,
        skillsCount: submissionData.skills.length
      })
      
      // Submit the data
      const response = await fetch('/api/team-members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `HTTP error ${response.status}` }))
        throw new Error(errorData.error || `Failed to create team member: ${response.status}`)
      }
      
      // Successfully added team member
      toast.success('Team member created successfully!')
      
      // Navigate back to team members page
      router.push('/hasnaat/team-members')
    } catch (error) {
      console.error('Error creating team member:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create team member')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AdminAuthCheck>
      <div className="min-h-screen bg-[#0a0a0a] pt-32 p-6">
        <Toaster position="top-right" />
        
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-400 to-blue-500 bg-clip-text text-transparent">
                Add New Team Member
              </h1>
              <p className="text-gray-400 mt-1">Create a new team member profile</p>
            </div>
            
            <Link 
              href="/admin/team-members" 
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Team Members
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="bg-gray-900/50 rounded-xl p-6 border border-purple-500/20">
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300">Full Name*</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={teamMember.name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md bg-black/50 border-gray-600 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500/20"
                  />
                </div>

                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-300">Job Title*</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={teamMember.title}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md bg-black/50 border-gray-600 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500/20"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-300">Bio/Description</label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  value={teamMember.bio}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md bg-black/50 border-gray-600 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500/20"
                  placeholder="Brief description about the team member..."
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Profile Image*</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-2">
                    <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden aspect-square relative">
                      {teamMember.image_url ? (
                        <Image 
                          src={teamMember.image_url} 
                          alt="Team member preview"
                          fill
                          className="object-cover"
                          unoptimized={teamMember.image_url.startsWith('data:')}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-gray-400">No image selected</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-4">
                    <div className="flex-1 flex flex-col justify-center">
                      <input
                        type="file"
                        id="imageUpload"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <div className="flex flex-col space-y-3">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                          className="px-4 py-2 rounded-md bg-purple-600/40 border border-purple-600/40 text-white hover:bg-purple-600/60 transition-colors flex items-center justify-center gap-2"
                        >
                          {isUploading ? (
                            <>
                              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Uploading...
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                              </svg>
                              Upload Image
                            </>
                          )}
                        </button>
                        <input
                          type="text"
                          id="image_url"
                          name="image_url"
                          value={teamMember.image_url}
                          onChange={handleChange}
                          className="px-3 py-2 rounded-md bg-black/50 border border-gray-600 text-white text-sm focus:border-purple-500 focus:ring focus:ring-purple-500/20"
                          placeholder="/team/your-image.jpg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={teamMember.email}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md bg-black/50 border-gray-600 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="linkedin_url" className="block text-sm font-medium text-gray-300">LinkedIn URL</label>
                    <input
                      type="url"
                      id="linkedin_url"
                      name="linkedin_url"
                      value={teamMember.linkedin_url}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md bg-black/50 border-gray-600 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="github_url" className="block text-sm font-medium text-gray-300">GitHub URL</label>
                    <input
                      type="url"
                      id="github_url"
                      name="github_url"
                      value={teamMember.github_url}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md bg-black/50 border-gray-600 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="twitter_url" className="block text-sm font-medium text-gray-300">Twitter URL</label>
                    <input
                      type="url"
                      id="twitter_url"
                      name="twitter_url"
                      value={teamMember.twitter_url}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md bg-black/50 border-gray-600 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Skills & Expertise</label>
                <div className="space-y-2">
                  {teamMember.skills.map((skill, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => handleSkillChange(index, e.target.value)}
                        placeholder={`Skill ${index + 1}`}
                        className="flex-1 rounded-md bg-black/50 border-gray-600 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500/20"
                      />
                      <button
                        type="button"
                        onClick={() => removeSkillField(index)}
                        disabled={teamMember.skills.length <= 1}
                        className="px-3 py-1 bg-red-900/30 text-red-400 rounded hover:bg-red-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addSkillField}
                  className="mt-2 px-3 py-1 bg-purple-500/20 text-purple-400 rounded hover:bg-purple-500/30"
                >
                  Add Skill
                </button>
              </div>

              {/* Settings */}
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="order_priority" className="block text-sm font-medium text-gray-300">Display Priority</label>
                    <input
                      type="number"
                      id="order_priority"
                      name="order_priority"
                      value={teamMember.order_priority}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md bg-black/50 border-gray-600 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500/20"
                    />
                    <p className="text-xs text-gray-400 mt-1">Lower numbers appear first</p>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_leader"
                      name="is_leader"
                      checked={teamMember.is_leader}
                      onChange={handleChange}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 bg-gray-700 border-gray-600 rounded"
                    />
                    <label htmlFor="is_leader" className="ml-2 text-sm text-gray-300">
                      Team Leader
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="active"
                      name="active"
                      checked={teamMember.active}
                      onChange={handleChange}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 bg-gray-700 border-gray-600 rounded"
                    />
                    <label htmlFor="active" className="ml-2 text-sm text-gray-300">
                      Active Member
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating...' : 'Create Team Member'}
                </button>
                <Link
                  href="/admin/team-members"
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-center"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AdminAuthCheck>
  )
}

