'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast, Toaster } from 'react-hot-toast'
import Link from 'next/link'

interface ROICard {
  id?: number
  title: string
  value: string
  description: string
  icon_url?: string
  metric_type?: string
  trend?: string
  trend_percentage?: number
  previous_value?: string
  time_period?: string
  category?: string
  display_order?: number
  is_featured?: boolean
  background_color?: string
  border_style?: string
  animation_type?: string
}

interface ROISection {
  id: number
  main_heading: string
  sub_heading?: string
  video_url?: string
  image_one?: string
  image_two?: string
  image_three?: string
  background_pattern?: string
  theme_color?: string
  is_published: boolean
  display_order?: number
  cards: ROICard[]
}

interface FileUpload {
  file: File | null
  preview: string
  uploading: boolean
}

export default function ROISectionDashboard() {
  const router = useRouter()
  const [roiSection, setROISection] = useState<ROISection | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  
  // File uploads state
  const [videoFile, setVideoFile] = useState<FileUpload>({ file: null, preview: '', uploading: false })
  const [imageOneFile, setImageOneFile] = useState<FileUpload>({ file: null, preview: '', uploading: false })
  const [imageTwoFile, setImageTwoFile] = useState<FileUpload>({ file: null, preview: '', uploading: false })
  const [imageThreeFile, setImageThreeFile] = useState<FileUpload>({ file: null, preview: '', uploading: false })
  
  // ROI Cards state - all 5 cards in one form
  const [cards, setCards] = useState<ROICard[]>([
    { title: '', value: '', description: '', category: 'conversion', trend: 'up', trend_percentage: 0, time_period: '', display_order: 1 },
    { title: '', value: '', description: '', category: 'revenue', trend: 'up', trend_percentage: 0, time_period: '', display_order: 2 },
    { title: '', value: '', description: '', category: 'efficiency', trend: 'up', trend_percentage: 0, time_period: '', display_order: 3 },
    { title: '', value: '', description: '', category: 'engagement', trend: 'up', trend_percentage: 0, time_period: '', display_order: 4 },
    { title: '', value: '', description: '', category: 'efficiency', trend: 'down', trend_percentage: 0, time_period: '', display_order: 5 },
  ])

  useEffect(() => {
    const auth = sessionStorage.getItem('adminAuth')
    const password = sessionStorage.getItem('adminPassword')
    
    if (auth !== 'true' || !password) {
      router.push('/hasnaat/login?redirect=/hasnaat/roi-section')
      return
    }
    
    setAdminPassword(password)
    fetchROISection(password)
  }, [router])

  const fetchROISection = async (password: string) => {
    try {
      const response = await fetch('/api/admin/roi-section', {
        headers: {
          'Authorization': `Bearer ${password}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.status === 401) {
        router.push('/hasnaat/login?redirect=/hasnaat/roi-section')
        return
      }

      const data = await response.json()
      
      if (data.success && data.data && data.data.length > 0) {
        const section = data.data[0]
        setROISection(section)
        
        // Load existing cards or use defaults
        if (section.cards && section.cards.length > 0) {
          const loadedCards = [...section.cards]
          // Fill up to 5 cards
          while (loadedCards.length < 5) {
            loadedCards.push({
              title: '',
              value: '',
              description: '',
              category: 'conversion',
              trend: 'up',
              trend_percentage: 0,
              time_period: '',
              display_order: loadedCards.length + 1
            })
          }
          setCards(loadedCards.slice(0, 5))
        }
      } else {
        // Create default section
        const defaultSection: any = {
          main_heading: 'Maximize Your ROI with AI-Powered Solutions',
          sub_heading: 'See how our cutting-edge AI technologies deliver measurable results for your business',
          video_url: '',
          image_one: '',
          image_two: '',
          image_three: '',
          background_pattern: 'gradient',
          theme_color: 'purple',
          is_published: false,
          display_order: 0
        }
        
        const createResponse = await fetch('/api/admin/roi-section', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${password}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(defaultSection)
        })

        const createData = await createResponse.json()
        if (createData.success) {
          setROISection({...createData.data, cards: []})
          toast.success('Default ROI section created')
        }
      }
    } catch (error) {
      console.error('Error fetching ROI section:', error)
      toast.error('Failed to load ROI section')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (file: File, type: 'video' | 'image_one' | 'image_two' | 'image_three') => {
    const setterMap = {
      video: setVideoFile,
      image_one: setImageOneFile,
      image_two: setImageTwoFile,
      image_three: setImageThreeFile
    }
    
    const setter = setterMap[type]
    setter({ file, preview: URL.createObjectURL(file), uploading: true })

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('password', adminPassword)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      
      if (data.url) {
        setter(prev => ({ ...prev, uploading: false }))
        toast.success(`${type.replace('_', ' ')} uploaded successfully!`)
        return data.url
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      setter(prev => ({ ...prev, uploading: false, file: null, preview: '' }))
      toast.error(`Failed to upload ${type.replace('_', ' ')}`)
      return null
    }
  }

  const handlePublishToggle = async () => {
    if (!roiSection) return

    setIsPublishing(true)
    try {
      const response = await fetch('/api/admin/roi-section', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminPassword}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: roiSection.id,
          is_published: !roiSection.is_published
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setROISection(prev => prev ? { ...prev, is_published: !prev.is_published } : null)
        toast.success(data.message || `ROI section ${!roiSection.is_published ? 'published' : 'unpublished'} successfully`)
      } else {
        toast.error(data.message || 'Failed to update publish status')
      }
    } catch (error) {
      console.error('Error toggling publish status:', error)
      toast.error('Failed to update publish status')
    } finally {
      setIsPublishing(false)
    }
  }

  const handleSaveAll = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!roiSection) return

    setIsSaving(true)
    try {
      const formData = new FormData(e.currentTarget)
      
      // Handle file uploads first
      let videoUrl = formData.get('video_url') as string
      let imageOneUrl = formData.get('image_one') as string
      let imageTwoUrl = formData.get('image_two') as string
      let imageThreeUrl = formData.get('image_three') as string

      if (videoFile.file) {
        const uploadedUrl = await handleFileUpload(videoFile.file, 'video')
        if (uploadedUrl) videoUrl = uploadedUrl
      }
      
      if (imageOneFile.file) {
        const uploadedUrl = await handleFileUpload(imageOneFile.file, 'image_one')
        if (uploadedUrl) imageOneUrl = uploadedUrl
      }
      
      if (imageTwoFile.file) {
        const uploadedUrl = await handleFileUpload(imageTwoFile.file, 'image_two')
        if (uploadedUrl) imageTwoUrl = uploadedUrl
      }
      
      if (imageThreeFile.file) {
        const uploadedUrl = await handleFileUpload(imageThreeFile.file, 'image_three')
        if (uploadedUrl) imageThreeUrl = uploadedUrl
      }

      // Update section
      const sectionData = {
        id: roiSection.id,
        main_heading: formData.get('main_heading') as string,
        sub_heading: formData.get('sub_heading') as string,
        video_url: videoUrl,
        image_one: imageOneUrl,
        image_two: imageTwoUrl,
        image_three: imageThreeUrl,
        background_pattern: formData.get('background_pattern') as string,
        theme_color: formData.get('theme_color') as string,
        display_order: parseInt(formData.get('display_order') as string) || 0,
        is_published: roiSection.is_published
      }

      const sectionResponse = await fetch('/api/admin/roi-section', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminPassword}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sectionData)
      })

      const sectionResult = await sectionResponse.json()
      
      if (!sectionResult.success) {
        throw new Error('Failed to update section')
      }

      // Save or update all 5 cards
      const cardPromises = cards.filter(card => card.title && card.value).map(async (card, index) => {
        const cardData = {
          ...card,
          roi_section_id: roiSection.id,
          display_order: index + 1
        }

        if (card.id) {
          // Update existing card
          return fetch(`/api/admin/roi-cards/${card.id}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${adminPassword}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(cardData)
          })
        } else {
          // Create new card
          return fetch('/api/admin/roi-cards', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${adminPassword}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(cardData)
          })
        }
      })

      await Promise.all(cardPromises)

      toast.success('ROI section and all cards saved successfully!')
      fetchROISection(adminPassword)
    } catch (error) {
      console.error('Error saving ROI section:', error)
      toast.error('Failed to save ROI section')
    } finally {
      setIsSaving(false)
    }
  }

  const updateCard = (index: number, field: keyof ROICard, value: any) => {
    setCards(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-t-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Loading ROI section...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-6 pb-16">
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#1a1a1a',
          color: '#fff',
          border: '1px solid #7c3aed'
        }
      }} />
      
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div>
            <Link href="/hasnaat" className="flex items-center text-purple-400 hover:text-purple-300 mb-3 transition-colors text-sm">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              🎯 All-in-One ROI Manager
            </h1>
            <p className="text-gray-400 text-sm">Configure section + all 5 ROI cards in one place</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchROISection(adminPassword)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center gap-2 border border-white/20"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            
            {roiSection && (
              <button
                onClick={handlePublishToggle}
                disabled={isPublishing}
                className={`px-5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  roiSection.is_published
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isPublishing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    {roiSection.is_published ? '🔴 Unpublish' : '🟢 Publish'}
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Status Badge */}
        {roiSection && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-900/50 rounded-lg border border-gray-800">
            <div className={`w-2 h-2 rounded-full ${roiSection.is_published ? 'bg-green-500' : 'bg-gray-500'} animate-pulse`}></div>
            <span className="text-xs text-gray-400">
              {roiSection.is_published ? 'Published & Live' : 'Draft'}
            </span>
          </div>
        )}
      </div>

      {roiSection && (
        <form onSubmit={handleSaveAll} className="max-w-7xl mx-auto px-6 space-y-6">
          {/* Section Settings */}
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Section Settings
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Main Heading */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Main Heading* <span className="text-purple-400">(Primary title)</span>
                  </label>
                  <input
                    type="text"
                    name="main_heading"
                    defaultValue={roiSection.main_heading}
                    className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all"
                    placeholder="Enter main heading"
                    required
                  />
                </div>

                {/* Sub Heading */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Sub Heading <span className="text-gray-500">(Supporting text)</span>
                  </label>
                  <textarea
                    name="sub_heading"
                    defaultValue={roiSection.sub_heading || ''}
                    rows={2}
                    className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all resize-none"
                    placeholder="Enter sub heading"
                  />
                </div>

                {/* Video Upload */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    📹 Video <span className="text-gray-500">(Upload or use URL)</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            setVideoFile({
                              file: e.target.files[0],
                              preview: URL.createObjectURL(e.target.files[0]),
                              uploading: false
                            })
                          }
                        }}
                        className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                      />
                      {videoFile.preview && (
                        <div className="mt-2">
                          <video src={videoFile.preview} className="w-full h-32 object-cover rounded border border-gray-700" controls />
                        </div>
                      )}
                    </div>
                    <input
                      type="url"
                      name="video_url"
                      defaultValue={roiSection.video_url || ''}
                      className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all"
                      placeholder="Or paste video URL"
                    />
                  </div>
                </div>

                {/* Image Uploads */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    🖼️ Image One <span className="text-gray-500">(Upload or URL)</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setImageOneFile({
                          file: e.target.files[0],
                          preview: URL.createObjectURL(e.target.files[0]),
                          uploading: false
                        })
                      }
                    }}
                    className="w-full px-4 py-2 bg-black/50 border border-gray-600 rounded-lg text-white text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                  />
                  {imageOneFile.preview && (
                    <img src={imageOneFile.preview} className="mt-2 w-full h-24 object-cover rounded border border-gray-700" alt="Preview" />
                  )}
                  <input
                    type="url"
                    name="image_one"
                    defaultValue={roiSection.image_one || ''}
                    className="mt-2 w-full px-4 py-2 bg-black/50 border border-gray-600 rounded-lg text-white text-sm focus:border-purple-500"
                    placeholder="Or paste URL"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    🖼️ Image Two <span className="text-gray-500">(Upload or URL)</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setImageTwoFile({
                          file: e.target.files[0],
                          preview: URL.createObjectURL(e.target.files[0]),
                          uploading: false
                        })
                      }
                    }}
                    className="w-full px-4 py-2 bg-black/50 border border-gray-600 rounded-lg text-white text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                  />
                  {imageTwoFile.preview && (
                    <img src={imageTwoFile.preview} className="mt-2 w-full h-24 object-cover rounded border border-gray-700" alt="Preview" />
                  )}
                  <input
                    type="url"
                    name="image_two"
                    defaultValue={roiSection.image_two || ''}
                    className="mt-2 w-full px-4 py-2 bg-black/50 border border-gray-600 rounded-lg text-white text-sm focus:border-purple-500"
                    placeholder="Or paste URL"
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    🖼️ Image Three <span className="text-gray-500">(Optional third image)</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            setImageThreeFile({
                              file: e.target.files[0],
                              preview: URL.createObjectURL(e.target.files[0]),
                              uploading: false
                            })
                          }
                        }}
                        className="w-full px-4 py-2 bg-black/50 border border-gray-600 rounded-lg text-white text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                      />
                      {imageThreeFile.preview && (
                        <img src={imageThreeFile.preview} className="mt-2 w-full h-24 object-cover rounded border border-gray-700" alt="Preview" />
                      )}
                    </div>
                    <input
                      type="url"
                      name="image_three"
                      defaultValue={roiSection.image_three || ''}
                      className="w-full px-4 py-2 bg-black/50 border border-gray-600 rounded-lg text-white text-sm focus:border-purple-500"
                      placeholder="Or paste URL"
                    />
                  </div>
                </div>

                {/* Theme Settings */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Background Pattern
                  </label>
                  <select
                    name="background_pattern"
                    defaultValue={roiSection.background_pattern || 'gradient'}
                    className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white focus:border-purple-500"
                  >
                    <option value="gradient">Gradient</option>
                    <option value="dots">Dots</option>
                    <option value="grid">Grid</option>
                    <option value="none">None</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Theme Color
                  </label>
                  <select
                    name="theme_color"
                    defaultValue={roiSection.theme_color || 'purple'}
                    className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white focus:border-purple-500"
                  >
                    <option value="purple">Purple</option>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="pink">Pink</option>
                    <option value="orange">Orange</option>
                  </select>
                </div>

                <input type="hidden" name="display_order" value={roiSection.display_order || 0} />
              </div>
            </div>
          </div>

          {/* All 5 ROI Cards in One Form */}
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              All 5 ROI Cards - Fill Below
            </h2>

            <div className="space-y-8">
              {cards.map((card, index) => (
                <div key={index} className="bg-black/30 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white text-sm font-bold">
                      {index + 1}
                    </span>
                    ROI Card {index + 1}
                    {card.title && <span className="text-sm text-gray-400">- {card.title}</span>}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Title* <span className="text-gray-500 text-xs">(e.g., "Revenue Growth")</span>
                      </label>
                      <input
                        type="text"
                        value={card.title}
                        onChange={(e) => updateCard(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 bg-black/50 border border-gray-600 rounded text-white text-sm focus:border-purple-500"
                        placeholder="Enter ROI card title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Value* <span className="text-gray-500 text-xs">(e.g., "+$2.4M")</span>
                      </label>
                      <input
                        type="text"
                        value={card.value}
                        onChange={(e) => updateCard(index, 'value', e.target.value)}
                        className="w-full px-3 py-2 bg-black/50 border border-gray-600 rounded text-white text-sm focus:border-purple-500"
                        placeholder="Value"
                      />
                    </div>

                    <div className="lg:col-span-3">
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Description* <span className="text-gray-500 text-xs">(Explain this metric)</span>
                      </label>
                      <textarea
                        value={card.description}
                        onChange={(e) => updateCard(index, 'description', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 bg-black/50 border border-gray-600 rounded text-white text-sm focus:border-purple-500 resize-none"
                        placeholder="Describe this ROI metric..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                      <select
                        value={card.category}
                        onChange={(e) => updateCard(index, 'category', e.target.value)}
                        className="w-full px-3 py-2 bg-black/50 border border-gray-600 rounded text-white text-sm focus:border-purple-500"
                      >
                        <option value="conversion">Conversion</option>
                        <option value="revenue">Revenue</option>
                        <option value="efficiency">Efficiency</option>
                        <option value="engagement">Engagement</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Trend</label>
                      <select
                        value={card.trend}
                        onChange={(e) => updateCard(index, 'trend', e.target.value)}
                        className="w-full px-3 py-2 bg-black/50 border border-gray-600 rounded text-white text-sm focus:border-purple-500"
                      >
                        <option value="up">↑ Up (Positive)</option>
                        <option value="down">↓ Down (Negative)</option>
                        <option value="stable">→ Stable</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Trend % <span className="text-gray-500 text-xs">(e.g., 180 for 180%)</span>
                      </label>
                      <input
                        type="number"
                        value={card.trend_percentage}
                        onChange={(e) => updateCard(index, 'trend_percentage', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-black/50 border border-gray-600 rounded text-white text-sm focus:border-purple-500"
                        placeholder="0"
                        step="0.01"
                      />
                    </div>

                    <div className="lg:col-span-3">
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Time Period <span className="text-gray-500 text-xs">(e.g., "Past Year", "Last Quarter")</span>
                      </label>
                      <input
                        type="text"
                        value={card.time_period}
                        onChange={(e) => updateCard(index, 'time_period', e.target.value)}
                        className="w-full px-3 py-2 bg-black/50 border border-gray-600 rounded text-white text-sm focus:border-purple-500"
                        placeholder="Enter time period"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push('/hasnaat')}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Saving Everything...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  💾 Save Section + All 5 Cards
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
