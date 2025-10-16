'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { AutomationWorkflow } from '@/app/api/automation-workflows/route'
import { audiowide } from '@/frontend/utils/fonts'
import { compressImage, compressVideo, validateImageFile, validateVideoFile, uploadFile } from '@/frontend/utils/compression'

export default function EditAutomationWorkflowPage() {
  const router = useRouter()
  const params = useParams()
  const workflowId = params.id
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  
  // Form state
  const [formData, setFormData] = useState<Partial<AutomationWorkflow>>({})

  // Dynamic field management for arrays
  const [tempFields, setTempFields] = useState({
    automation_tool: '',
    use_case: '',
    workflow_step: '',
    integration: '',
    ai_component: '',
    automation_trigger: '',
    industry_tag: '',
    agent_capability: ''
  })

  useEffect(() => {
    fetchWorkflow()
  }, [workflowId])

  const fetchWorkflow = async () => {
    try {
      const response = await fetch('/api/automation-workflows')
      if (response.ok) {
        const workflows = await response.json()
        const workflow = workflows.find((w: AutomationWorkflow) => w.id === parseInt(workflowId as string))
        if (workflow) {
          setFormData(workflow)
        } else {
          setError('Workflow not found')
        }
      } else {
        setError('Failed to fetch workflow')
      }
    } catch (err) {
      setError('Error fetching workflow')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? parseFloat(value) || 0 : 
              value
    }))
  }

  const addArrayItem = (fieldName: keyof typeof tempFields, arrayName: keyof AutomationWorkflow) => {
    const value = tempFields[fieldName].trim()
    if (value) {
      setFormData(prev => ({
        ...prev,
        [arrayName]: [...(prev[arrayName] as string[] || []), value]
      }))
      setTempFields(prev => ({ ...prev, [fieldName]: '' }))
    }
  }

  const removeArrayItem = (arrayName: keyof AutomationWorkflow, index: number) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: (prev[arrayName] as string[]).filter((_, i) => i !== index)
    }))
  }

  // Image upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validation = validateImageFile(file)
    if (!validation.isValid) {
      setError(validation.error || 'Invalid image file')
      return
    }

    setUploadingImage(true)
    setError('')

    try {
      // Compress image before upload
      const compressedFile = await compressImage(file, 1920, 0.85)
      const imageUrl = await uploadFile(compressedFile, 'image')
      
      setFormData(prev => ({ ...prev, image_url: imageUrl }))
    } catch (error) {
      setError('Failed to upload image')
      console.error('Image upload error:', error)
    } finally {
      setUploadingImage(false)
    }
  }

  // Video upload handler
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validation = validateVideoFile(file)
    if (!validation.isValid) {
      setError(validation.error || 'Invalid video file')
      return
    }

    setUploadingVideo(true)
    setError('')

    try {
      // Compress video before upload
      const compressedFile = await compressVideo(file)
      const videoUrl = await uploadFile(compressedFile, 'video')
      
      setFormData(prev => ({ ...prev, agent_video_url: videoUrl }))
    } catch (error) {
      setError('Failed to upload video')
      console.error('Video upload error:', error)
    } finally {
      setUploadingVideo(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const response = await fetch('/api/automation-workflows', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/hasnaat/automation-workflows')
        }, 2000)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to update automation workflow')
      }
    } catch (err) {
      setError('Error updating automation workflow')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading workflow...</p>
        </motion.div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-green-400 mb-2">Workflow Updated Successfully!</h1>
          <p className="text-gray-400">Redirecting to workflows list...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Sleek Header with Neon Purple Accent */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="relative bg-black border border-purple-500/30 rounded-2xl p-8 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent rounded-2xl"></div>
            <div className="relative flex items-center gap-6">
              <Link
                href="/hasnaat/automation-workflows"
                className="bg-black/80 hover:bg-purple-900/20 text-white p-3 rounded-xl transition-all duration-300 border border-purple-500/30 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/20"
              >
                ← Back
              </Link>
              <div className="flex-1">
                <h1 className={`text-4xl font-bold text-white mb-3 ${audiowide.className}`}>
                  <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    ✏️ Edit Automation Workflow
                  </span>
                </h1>
                <p className="text-gray-400 text-lg">
                  Update automation workflow: <span className="text-purple-300">{formData.title}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Breadcrumb */}
          <nav className="text-sm text-gray-400 mt-4 px-2">
            <Link href="/hasnaat" className="hover:text-purple-400 transition-colors">Admin Dashboard</Link>
            <span className="mx-3 text-purple-500/50">→</span>
            <Link href="/hasnaat/automation-workflows" className="hover:text-purple-400 transition-colors">Automation Workflows</Link>
            <span className="mx-3 text-purple-500/50">→</span>
            <span className="text-white font-medium">Edit Workflow</span>
          </nav>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black border border-red-500/50 text-red-300 p-6 rounded-2xl mb-8 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-red-500/20 rounded-full flex items-center justify-center">
                <span className="text-red-400 text-sm">⚠</span>
              </div>
              {error}
            </div>
          </motion.div>
        )}

        {/* Compact Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Basic Information */}
          <div className="bg-black border border-purple-500/30 rounded-2xl p-8 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5"></div>
            <div className="relative">
              <h2 className={`text-2xl font-bold text-white mb-8 flex items-center gap-3 ${audiowide.className}`}>
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">📋</span>
                </div>
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Basic Information
                </span>
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-purple-300 mb-3">
                    Workflow Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title || ''}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-black border border-purple-500/30 rounded-xl p-4 text-white focus:outline-none focus:border-purple-400 focus:shadow-lg focus:shadow-purple-500/20 transition-all duration-300 placeholder-gray-500"
                    placeholder="AI-Powered Lead Qualification System"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-purple-300 mb-3">
                    Workflow Type *
                  </label>
                  <select
                    name="workflow_type"
                    value={formData.workflow_type || 'n8n'}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-black border border-purple-500/30 rounded-xl p-4 text-white focus:outline-none focus:border-purple-400 focus:shadow-lg focus:shadow-purple-500/20 transition-all duration-300"
                  >
                    <option value="n8n">n8n Workflow</option>
                    <option value="make">Make.com Scenario</option>
                    <option value="zapier">Zapier Automation</option>
                    <option value="custom_ai">Custom AI Solution</option>
                    <option value="ai_agent">AI Agent</option>
                    <option value="business_automation">Business Automation</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 space-y-2">
                <label className="block text-sm font-semibold text-purple-300 mb-3">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full bg-black border border-purple-500/30 rounded-xl p-4 text-white focus:outline-none focus:border-purple-400 focus:shadow-lg focus:shadow-purple-500/20 transition-all duration-300 placeholder-gray-500 resize-none"
                  placeholder="Detailed description of the automation workflow and its capabilities..."
                />
              </div>
            </div>
          </div>

          {/* Workflow Configuration */}
          <div className="bg-black border border-purple-500/30 rounded-2xl p-8 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5"></div>
            <div className="relative">
              <h2 className={`text-2xl font-bold text-white mb-8 flex items-center gap-3 ${audiowide.className}`}>
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">⚙️</span>
                </div>
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Workflow Configuration
                </span>
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-purple-300 mb-3">
                    Complexity Level
                  </label>
                  <select
                    name="complexity_level"
                    value={formData.complexity_level || 'intermediate'}
                    onChange={handleInputChange}
                    className="w-full bg-black border border-purple-500/30 rounded-xl p-4 text-white focus:outline-none focus:border-purple-400 focus:shadow-lg focus:shadow-purple-500/20 transition-all duration-300"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-purple-300 mb-3">
                    Difficulty Rating (1-5)
                  </label>
                  <input
                    type="number"
                    name="difficulty_rating"
                    value={formData.difficulty_rating || 3}
                    onChange={handleInputChange}
                    min="1"
                    max="5"
                    className="w-full bg-black border border-purple-500/30 rounded-xl p-4 text-white focus:outline-none focus:border-purple-400 focus:shadow-lg focus:shadow-purple-500/20 transition-all duration-300"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-purple-300 mb-3">
                    Estimated Setup Time
                  </label>
                  <input
                    type="text"
                    name="estimated_setup_time"
                    value={formData.estimated_setup_time || ''}
                    onChange={handleInputChange}
                    className="w-full bg-black border border-purple-500/30 rounded-xl p-4 text-white focus:outline-none focus:border-purple-400 focus:shadow-lg focus:shadow-purple-500/20 transition-all duration-300 placeholder-gray-500"
                    placeholder="2-3 hours"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Media Upload Section */}
          <div className="bg-gray-900/30 border border-gray-700 rounded-lg p-6">
            <h2 className={`text-xl font-bold text-white mb-6 ${audiowide.className}`}>📷 Media Upload</h2>
            
            {/* Image Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Workflow Image *
              </label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                {formData.image_url ? (
                  <div className="space-y-4">
                    <img 
                      src={formData.image_url} 
                      alt="Workflow preview" 
                      className="max-w-xs max-h-40 mx-auto rounded-lg object-cover"
                    />
                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Change Image
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-gray-400">
                      <svg className="w-12 h-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-lg mb-2">Upload Workflow Image</p>
                      <p className="text-sm text-gray-500">Supports JPEG, PNG, WebP (max 10MB)</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      {uploadingImage ? 'Uploading...' : 'Choose Image'}
                    </button>
                  </div>
                )}
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Video Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Agent Demo Video (10-15 seconds)
              </label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                {formData.agent_video_url ? (
                  <div className="space-y-4">
                    <video 
                      src={formData.agent_video_url} 
                      className="max-w-xs max-h-40 mx-auto rounded-lg"
                      controls
                      style={{ aspectRatio: '16/9' }}
                    />
                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => videoInputRef.current?.click()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Change Video
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, agent_video_url: '' }))}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-gray-400">
                      <svg className="w-12 h-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <p className="text-lg mb-2">Upload Agent Demo Video</p>
                      <p className="text-sm text-gray-500">Supports MP4, WebM, MOV (max 50MB, 10-15 seconds)</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => videoInputRef.current?.click()}
                      disabled={uploadingVideo}
                      className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      {uploadingVideo ? 'Uploading...' : 'Choose Video'}
                    </button>
                  </div>
                )}
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/mov"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Upload a short demo video showing the AI agent in action. This will be displayed in the modal for better user engagement.
              </p>
            </div>
          </div>

          {/* Showcase Settings */}
          <div className="bg-gray-900/30 border border-gray-700 rounded-lg p-6">
            <h2 className={`text-xl font-bold text-white mb-6 ${audiowide.className}`}>🎆 Showcase Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status || 'active'}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="active">Active</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="deprecated">Deprecated</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Showcase Order
                </label>
                <input
                  type="number"
                  name="showcase_order"
                  value={formData.showcase_order || 0}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Highlight Color
                </label>
                <input
                  type="color"
                  name="highlight_color"
                  value={formData.highlight_color || '#8B5CF6'}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 h-12 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Badge Text
                </label>
                <input
                  type="text"
                  name="badge_text"
                  value={formData.badge_text || ''}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                  placeholder="Most Popular, Enterprise Ready, etc."
                />
              </div>
              
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured || false}
                    onChange={handleInputChange}
                    className="w-4 h-4 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:border-purple-500"
                  />
                  Featured Workflow
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={saving}
              className={`flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
                saving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {saving ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Updating Workflow...
                </div>
              ) : (
                '✏️ Update Automation Workflow'
              )}
            </button>
            
            <Link
              href="/hasnaat/automation-workflows"
              className="bg-gray-600 hover:bg-gray-700 text-white py-4 px-6 rounded-lg font-semibold transition-colors text-center"
            >
              Cancel
            </Link>
          </div>
        </motion.form>
      </div>
    </div>
  )
}