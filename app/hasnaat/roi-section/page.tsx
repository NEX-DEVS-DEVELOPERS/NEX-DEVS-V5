'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast, Toaster } from 'react-hot-toast'
import Link from 'next/link'

interface ROICard {
  id: number
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

export default function ROISectionDashboard() {
  const router = useRouter()
  const [roiSection, setROISection] = useState<ROISection | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')

  // Check authentication and get admin password
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
        setROISection(data.data[0])
      } else {
        // Create default ROI section if none exists
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

  const handleSaveSection = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!roiSection) return

    setIsSaving(true)
    try {
      const formData = new FormData(e.currentTarget)
      
      const sectionData = {
        id: roiSection.id,
        main_heading: formData.get('main_heading') as string,
        sub_heading: formData.get('sub_heading') as string,
        video_url: formData.get('video_url') as string,
        image_one: formData.get('image_one') as string,
        image_two: formData.get('image_two') as string,
        image_three: formData.get('image_three') as string,
        background_pattern: formData.get('background_pattern') as string,
        theme_color: formData.get('theme_color') as string,
        display_order: parseInt(formData.get('display_order') as string) || 0,
        is_published: roiSection.is_published
      }

      const response = await fetch('/api/admin/roi-section', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminPassword}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sectionData)
      })

      const data = await response.json()
      
      if (data.success) {
        setROISection(prev => prev ? {...prev, ...data.data} : null)
        toast.success('ROI section updated successfully')
      } else {
        toast.error(data.message || 'Failed to update section')
      }
    } catch (error) {
      console.error('Error updating ROI section:', error)
      toast.error('Failed to update ROI section')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteCard = async (cardId: number) => {
    if (!confirm('Are you sure you want to delete this ROI card? This action cannot be undone.')) return

    try {
      const response = await fetch(`/api/admin/roi-cards/${cardId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminPassword}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      
      if (data.success) {
        fetchROISection(adminPassword)
        toast.success('ROI card deleted successfully')
      } else {
        toast.error(data.message || 'Failed to delete card')
      }
    } catch (error) {
      console.error('Error deleting ROI card:', error)
      toast.error('Failed to delete ROI card')
    }
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
              ROI Section Management
            </h1>
            <p className="text-gray-400 text-sm">Manage ROI cards and section settings</p>
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
                    {roiSection.is_published ? 'Unpublish' : 'Publish'}
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

      <div className="max-w-7xl mx-auto px-6 space-y-6">
        {/* Section Settings */}
        <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Section Settings
            </h2>

            {roiSection && (
            <form onSubmit={handleSaveSection} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Main Heading */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Main Heading* <span className="text-purple-400">(Primary title shown to users)</span>
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
                    Sub Heading <span className="text-gray-500">(Supporting text below main heading)</span>
                  </label>
                  <textarea
                    name="sub_heading"
                    defaultValue={roiSection.sub_heading || ''}
                    rows={2}
                    className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all resize-none"
                    placeholder="Enter sub heading"
                  />
                </div>

                {/* Video URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Video URL <span className="text-gray-500">(Optional promotional video)</span>
                  </label>
                  <input
                    type="url"
                    name="video_url"
                    defaultValue={roiSection.video_url || ''}
                    className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all"
                    placeholder="https://example.com/video.mp4"
                  />
                </div>

                {/* Display Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Display Order <span className="text-gray-500">(Lower numbers appear first)</span>
                  </label>
                  <input
                    type="number"
                    name="display_order"
                    defaultValue={roiSection.display_order || 0}
                    min="0"
                    className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all"
                  />
                </div>

                {/* Image URLs */}
                  <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Image One URL <span className="text-gray-500">(First showcase image)</span>
                  </label>
                    <input
                      type="url"
                      name="image_one"
                      defaultValue={roiSection.image_one || ''}
                    className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all"
                      placeholder="https://example.com/image1.jpg"
                    />
                  </div>

                  <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Image Two URL <span className="text-gray-500">(Second showcase image)</span>
                  </label>
                    <input
                      type="url"
                      name="image_two"
                      defaultValue={roiSection.image_two || ''}
                    className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all"
                      placeholder="https://example.com/image2.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Image Three URL <span className="text-gray-500">(Third showcase image)</span>
                  </label>
                  <input
                    type="url"
                    name="image_three"
                    defaultValue={roiSection.image_three || ''}
                    className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all"
                    placeholder="https://example.com/image3.jpg"
                  />
                </div>

                {/* Theme Settings */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Background Pattern
                  </label>
                  <select
                    name="background_pattern"
                    defaultValue={roiSection.background_pattern || 'gradient'}
                    className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all"
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
                    className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all"
                  >
                    <option value="purple">Purple</option>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="pink">Pink</option>
                    <option value="orange">Orange</option>
                  </select>
                </div>
                </div>

                <button
                  type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    Save Settings
                  </>
                )}
                </button>
              </form>
            )}
          </div>

        {/* ROI Cards Section */}
        {roiSection && (
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                ROI Cards ({roiSection.cards?.length || 0})
              </h2>
              <Link
                href="/hasnaat/roi-section/add"
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Card
              </Link>
        </div>

            {/* Cards List */}
            {roiSection.cards && roiSection.cards.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Title</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Value</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Category</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Trend</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
              {roiSection.cards.map((card) => (
                      <tr key={card.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            {card.icon_url && (
                              <img src={card.icon_url} alt="" className="w-8 h-8 object-contain" />
                            )}
                            <div>
                              <p className="text-white font-medium">{card.title}</p>
                              <p className="text-gray-400 text-xs line-clamp-1">{card.description}</p>
                    </div>
                      </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-purple-400 font-semibold">{card.value}</span>
                        </td>
                        <td className="py-4 px-4">
                          {card.category && (
                            <span className="inline-block px-2 py-1 bg-gray-800 border border-gray-700 rounded text-gray-300 text-xs capitalize">
                              {card.category}
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          {card.trend && (
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                              card.trend === 'up' ? 'bg-green-500/10 text-green-400' :
                              card.trend === 'down' ? 'bg-red-500/10 text-red-400' :
                              'bg-blue-500/10 text-blue-400'
                            }`}>
                              {card.trend === 'up' && '↑'}
                              {card.trend === 'down' && '↓'}
                              {card.trend === 'stable' && '→'}
                              {card.trend_percentage && `${card.trend_percentage}%`}
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/hasnaat/roi-section/edit/${card.id}`}
                              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded border border-white/20 text-sm transition-colors flex items-center gap-1"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </Link>
                    <button
                      onClick={() => handleDeleteCard(card.id)}
                              className="px-3 py-1.5 bg-red-600/10 hover:bg-red-600/20 text-red-400 rounded border border-red-500/30 text-sm transition-colors flex items-center gap-1"
                    >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                      Delete
                    </button>
                  </div>
                        </td>
                      </tr>
              ))}
                  </tbody>
                </table>
            </div>
            ) : (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="text-lg font-medium text-white mb-1">No ROI Cards</h3>
                <p className="text-gray-400 text-sm mb-4">Get started by adding your first ROI card</p>
                <Link
                  href="/hasnaat/roi-section/add"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add First Card
                </Link>
          </div>
        )}
          </div>
        )}
      </div>
    </div>
  )
}
