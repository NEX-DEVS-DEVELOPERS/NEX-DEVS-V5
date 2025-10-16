'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AutomationWorkflow } from '@/app/api/automation-workflows/route'
import { audiowide, vt323 } from '@/frontend/utils/fonts'
import { compressImage, compressVideo, validateImageFile, validateVideoFile, uploadFile } from '@/frontend/utils/compression'

export default function NewAutomationWorkflowPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  
  // Form state
  const [formData, setFormData] = useState<Partial<AutomationWorkflow>>({
    title: '',
    description: '',
    workflow_type: 'n8n',
    automation_tools: [],
    workflow_diagram_url: '',
    demo_video_url: '',
    live_demo_url: '',
    github_workflow_url: '',
    complexity_level: 'intermediate',
    estimated_setup_time: '',
    business_impact: '',
    use_cases: [],
    workflow_steps: [],
    input_requirements: '',
    output_results: '',
    integrations_used: [],
    ai_components: [],
    automation_triggers: [],
    cost_efficiency: '',
    featured: false,
    status: 'active',
    industry_tags: [],
    difficulty_rating: 3,
    success_rate_percentage: 95,
    monthly_executions: 0,
    workflow_json: '',
    n8n_workflow_id: '',
    make_scenario_id: '',
    zapier_zap_id: '',
    agent_personality: '',
    agent_capabilities: [],
    agent_model: '',
    agent_response_time: '',
    agent_accuracy_rate: 90,
    average_execution_time: '',
    error_rate_percentage: 2.0,
    uptime_percentage: 99.5,
    setup_instructions: '',
    troubleshooting_guide: '',
    prerequisites: '',
    showcase_order: 0,
    badge_text: '',
    highlight_color: '#8B5CF6',
    image_url: '',
    agent_video_url: '' // Add the new video field
  })

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
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/automation-workflows', {
        method: 'POST',
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
        setError(errorData.error || 'Failed to create automation workflow')
      }
    } catch (err) {
      setError('Error creating automation workflow')
    } finally {
      setLoading(false)
    }
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
          <h1 className="text-2xl font-bold text-green-400 mb-2">Workflow Created Successfully!</h1>
          <p className="text-gray-400">Redirecting to workflows list...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/hasnaat/automation-workflows"
              className="bg-gray-700/50 hover:bg-gray-700 text-white p-2 rounded-lg transition-colors"
            >
              ← Back
            </Link>
            <div>
              <h1 className={`text-3xl font-bold text-white mb-2 ${audiowide.className}`}>
                🚀 Create New Automation Workflow
              </h1>
              <p className="text-gray-400">
                Add a new AI automation workflow, n8n integration, or business process automation
              </p>
            </div>
          </div>

          {/* Navigation Breadcrumb */}
          <nav className="text-sm text-gray-400">
            <Link href="/hasnaat" className="hover:text-purple-400">Admin Dashboard</Link>
            <span className="mx-2">→</span>
            <Link href="/hasnaat/automation-workflows" className="hover:text-purple-400">Automation Workflows</Link>
            <span className="mx-2">→</span>
            <span className="text-white">New Workflow</span>
          </nav>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-900/30 border border-red-500/50 text-red-300 p-4 rounded-lg mb-6"
          >
            {error}
          </motion.div>
        )}

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {/* Basic Information */}
          <div className="bg-gray-900/30 border border-gray-700 rounded-lg p-6">
            <h2 className={`text-xl font-bold text-white mb-6 ${audiowide.className}`}>📋 Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Workflow Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                  placeholder="AI-Powered Lead Qualification System"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Workflow Type *
                </label>
                <select
                  name="workflow_type"
                  value={formData.workflow_type}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
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

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                placeholder="Detailed description of the automation workflow and its capabilities..."
              />
            </div>
          </div>

          {/* Workflow Configuration */}
          <div className="bg-gray-900/30 border border-gray-700 rounded-lg p-6">
            <h2 className={`text-xl font-bold text-white mb-6 ${audiowide.className}`}>⚙️ Workflow Configuration</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Complexity Level
                </label>
                <select
                  name="complexity_level"
                  value={formData.complexity_level}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Difficulty Rating (1-5)
                </label>
                <input
                  type="number"
                  name="difficulty_rating"
                  value={formData.difficulty_rating}
                  onChange={handleInputChange}
                  min="1"
                  max="5"
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Estimated Setup Time
                </label>
                <input
                  type="text"
                  name="estimated_setup_time"
                  value={formData.estimated_setup_time}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                  placeholder="2-3 hours"
                />
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

          {/* Dynamic Array Fields */}
          <div className="bg-gray-900/30 border border-gray-700 rounded-lg p-6">
            <h2 className={`text-xl font-bold text-white mb-6 ${audiowide.className}`}>🔧 Tools & Components</h2>
            
            {/* Automation Tools */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Automation Tools
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tempFields.automation_tool}
                  onChange={(e) => setTempFields(prev => ({ ...prev, automation_tool: e.target.value }))}
                  className="flex-1 bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                  placeholder="e.g., n8n, OpenAI GPT-4, Webhooks"
                />
                <button
                  type="button"
                  onClick={() => addArrayItem('automation_tool', 'automation_tools')}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.automation_tools?.map((tool, index) => (
                  <span
                    key={index}
                    className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {tool}
                    <button
                      type="button"
                      onClick={() => removeArrayItem('automation_tools', index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Use Cases */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Use Cases
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tempFields.use_case}
                  onChange={(e) => setTempFields(prev => ({ ...prev, use_case: e.target.value }))}
                  className="flex-1 bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                  placeholder="e.g., Lead Scoring, CRM Automation"
                />
                <button
                  type="button"
                  onClick={() => addArrayItem('use_case', 'use_cases')}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.use_cases?.map((useCase, index) => (
                  <span
                    key={index}
                    className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {useCase}
                    <button
                      type="button"
                      onClick={() => removeArrayItem('use_cases', index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Performance & Metrics */}
          <div className="bg-gray-900/30 border border-gray-700 rounded-lg p-6">
            <h2 className={`text-xl font-bold text-white mb-6 ${audiowide.className}`}>📊 Performance & Metrics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Success Rate (%)
                </label>
                <input
                  type="number"
                  name="success_rate_percentage"
                  value={formData.success_rate_percentage}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Monthly Executions
                </label>
                <input
                  type="number"
                  name="monthly_executions"
                  value={formData.monthly_executions}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Error Rate (%)
                </label>
                <input
                  type="number"
                  name="error_rate_percentage"
                  value={formData.error_rate_percentage}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Business Impact
                </label>
                <textarea
                  name="business_impact"
                  value={formData.business_impact}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                  placeholder="Reduces manual work by 85%, increases efficiency by 40%..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cost Efficiency
                </label>
                <textarea
                  name="cost_efficiency"
                  value={formData.cost_efficiency}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                  placeholder="Saves $5000/month in operational costs..."
                />
              </div>
            </div>
          </div>

          {/* Showcase Settings */}
          <div className="bg-gray-900/30 border border-gray-700 rounded-lg p-6">
            <h2 className={`text-xl font-bold text-white mb-6 ${audiowide.className}`}>🎯 Showcase Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
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
                  value={formData.showcase_order}
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
                  value={formData.highlight_color}
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
                  value={formData.badge_text}
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
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="w-4 h-4 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:border-purple-500"
                  />
                  Featured Workflow
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creating Workflow...
                </div>
              ) : (
                '🚀 Create Automation Workflow'
              )}
            </button>
            
            <Link
              href="/hasnaat/automation-workflows"
              className="bg-gray-600 hover:bg-gray-700 text-white py-4 px-6 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </Link>
          </div>
        </motion.form>
      </div>
    </div>
  )
}
