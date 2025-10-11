'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminAuthCheck from '@/app/components/AdminAuthCheck'
import { toast, Toaster } from 'react-hot-toast'

// Types for ROI section and cards
type ROICard = {
  id: number
  roi_section_id: number
  title: string
  value: string
  description: string
  icon_url?: string
  created_at: string
  updated_at: string
}

type ROISection = {
  id: number
  main_heading: string
  sub_heading?: string
  video_url?: string
  image_one?: string
  image_two?: string
  is_published: boolean
  created_at: string
  updated_at: string
  cards: ROICard[]
}

export default function AdminROISectionPage() {
  const [roiSection, setROISection] = useState<ROISection | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    main_heading: '',
    sub_heading: '',
    video_url: '',
    image_one: '',
    image_two: '',
    is_published: false
  })
  const [cards, setCards] = useState<ROICard[]>([])
  const [isCardEditing, setIsCardEditing] = useState<number | null>(null)
  const [cardFormData, setCardFormData] = useState({
    title: '',
    value: '',
    description: '',
    icon_url: ''
  })

  // Fetch ROI section data
  const fetchROISection = async () => {
    setIsLoading(true)
    try {
      const password = sessionStorage.getItem('adminPassword') || 'nex-devs.org889123'
      
      const response = await fetch('/api/admin/roi-section', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${password}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.data && data.data.length > 0) {
          const section = data.data[0]
          setROISection(section)
          setCards(section.cards || [])
          setFormData({
            main_heading: section.main_heading || '',
            sub_heading: section.sub_heading || '',
            video_url: section.video_url || '',
            image_one: section.image_one || '',
            image_two: section.image_two || '',
            is_published: section.is_published || false
          })
        }
      } else {
        console.error('Failed to fetch ROI section')
        toast.error('Failed to load ROI section')
      }
    } catch (error) {
      console.error('Error fetching ROI section:', error)
      toast.error('Error loading ROI section')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchROISection()
  }, [])

  // Handle form submission for ROI section
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const password = sessionStorage.getItem('adminPassword') || 'nex-devs.org889123'
    
    try {
      toast.loading('Saving ROI section...')
      
      const response = await fetch('/api/admin/roi-section', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${password}`
        },
        body: JSON.stringify(formData)
      })
      
      toast.dismiss()
      
      if (response.ok) {
        const data = await response.json()
        toast.success('ROI section saved successfully!')
        setROISection(data.data)
        setIsEditing(false)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to save ROI section')
      }
    } catch (error) {
      toast.dismiss()
      console.error('Error saving ROI section:', error)
      toast.error('Error saving ROI section')
    }
  }

  // Handle publish toggle
  const handlePublishToggle = async () => {
    const password = sessionStorage.getItem('adminPassword') || 'nex-devs.org889123'
    
    try {
      toast.loading('Updating publish status...')
      
      const response = await fetch('/api/admin/roi-section', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${password}`
        },
        body: JSON.stringify({
          id: roiSection?.id || 1,
          is_published: !formData.is_published
        })
      })
      
      toast.dismiss()
      
      if (response.ok) {
        const data = await response.json()
        toast.success(data.message)
        setFormData(prev => ({ ...prev, is_published: !prev.is_published }))
        if (roiSection) {
          setROISection(prev => prev ? { ...prev, is_published: !prev.is_published } : null)
        }
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update publish status')
      }
    } catch (error) {
      toast.dismiss()
      console.error('Error updating publish status:', error)
      toast.error('Error updating publish status')
    }
  }

  // Handle card creation
  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!roiSection) {
      toast.error('Please create ROI section first')
      return
    }
    
    const password = sessionStorage.getItem('adminPassword') || 'nex-devs.org889123'
    
    try {
      toast.loading('Creating ROI card...')
      
      const response = await fetch('/api/admin/roi-cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${password}`
        },
        body: JSON.stringify({
          roi_section_id: roiSection.id,
          ...cardFormData
        })
      })
      
      toast.dismiss()
      
      if (response.ok) {
        const data = await response.json()
        toast.success('ROI card created successfully!')
        setCards(prev => [...prev, data.data])
        setCardFormData({ title: '', value: '', description: '', icon_url: '' })
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to create ROI card')
      }
    } catch (error) {
      toast.dismiss()
      console.error('Error creating ROI card:', error)
      toast.error('Error creating ROI card')
    }
  }

  // Handle card update
  const handleUpdateCard = async (cardId: number) => {
    const password = sessionStorage.getItem('adminPassword') || 'nex-devs.org889123'
    
    try {
      toast.loading('Updating ROI card...')
      
      const response = await fetch('/api/admin/roi-cards', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${password}`
        },
        body: JSON.stringify({
          id: cardId,
          ...cardFormData
        })
      })
      
      toast.dismiss()
      
      if (response.ok) {
        const data = await response.json()
        toast.success('ROI card updated successfully!')
        setCards(prev => prev.map(card => card.id === cardId ? data.data : card))
        setIsCardEditing(null)
        setCardFormData({ title: '', value: '', description: '', icon_url: '' })
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update ROI card')
      }
    } catch (error) {
      toast.dismiss()
      console.error('Error updating ROI card:', error)
      toast.error('Error updating ROI card')
    }
  }

  // Handle card deletion
  const handleDeleteCard = async (cardId: number) => {
    if (!confirm('Are you sure you want to delete this ROI card?')) {
      return
    }
    
    const password = sessionStorage.getItem('adminPassword') || 'nex-devs.org889123'
    
    try {
      toast.loading('Deleting ROI card...')
      
      const response = await fetch(`/api/admin/roi-cards?id=${cardId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${password}`
        }
      })
      
      toast.dismiss()
      
      if (response.ok) {
        toast.success('ROI card deleted successfully!')
        setCards(prev => prev.filter(card => card.id !== cardId))
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to delete ROI card')
      }
    } catch (error) {
      toast.dismiss()
      console.error('Error deleting ROI card:', error)
      toast.error('Error deleting ROI card')
    }
  }

  // Start editing a card
  const startCardEdit = (card: ROICard) => {
    setIsCardEditing(card.id)
    setCardFormData({
      title: card.title,
      value: card.value,
      description: card.description,
      icon_url: card.icon_url || ''
    })
  }

  return (
    <AdminAuthCheck>
      <div className="min-h-screen bg-[#0a0a0a] pt-32 p-6">
        <Toaster position="top-right" />
        
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-purple-400 to-blue-500 bg-clip-text text-transparent">
                ROI Section Management
              </h1>
              <p className="text-gray-400 mt-2">Manage your ROI section content and cards</p>
            </div>
            
            <div className="flex flex-wrap gap-2 md:gap-3">
              <Link
                href="/hasnaat"
                className="bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Admin Home</span>
              </Link>
              
              {roiSection && (
                <button
                  onClick={handlePublishToggle}
                  className={`py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors ${
                    formData.is_published 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{formData.is_published ? 'Unpublish' : 'Publish'}</span>
                </button>
              )}
              
              <button
                onClick={fetchROISection}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* ROI Section Form */}
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">ROI Section Settings</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="bg-purple-600 hover:bg-purple-700 text-white py-1 px-3 rounded text-sm transition-colors"
                  >
                    {isEditing ? 'Cancel' : 'Edit'}
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Main Heading *
                    </label>
                    <input
                      type="text"
                      value={formData.main_heading}
                      onChange={(e) => setFormData(prev => ({ ...prev, main_heading: e.target.value }))}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                      placeholder="Enter main heading"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Sub Heading
                    </label>
                    <input
                      type="text"
                      value={formData.sub_heading}
                      onChange={(e) => setFormData(prev => ({ ...prev, sub_heading: e.target.value }))}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                      placeholder="Enter sub heading"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Video URL
                    </label>
                    <input
                      type="url"
                      value={formData.video_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                      placeholder="https://example.com/video.mp4"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Image One URL
                    </label>
                    <input
                      type="url"
                      value={formData.image_one}
                      onChange={(e) => setFormData(prev => ({ ...prev, image_one: e.target.value }))}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                      placeholder="https://example.com/image1.jpg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Image Two URL
                    </label>
                    <input
                      type="url"
                      value={formData.image_two}
                      onChange={(e) => setFormData(prev => ({ ...prev, image_two: e.target.value }))}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                      placeholder="https://example.com/image2.jpg"
                    />
                  </div>
                  
                  {isEditing && (
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </form>
                
                {roiSection && (
                  <div className="mt-6 p-4 bg-gray-800 rounded-md">
                    <h3 className="text-sm font-medium text-gray-300 mb-2">Status Information</h3>
                    <div className="space-y-1 text-sm text-gray-400">
                      <p>Created: {new Date(roiSection.created_at).toLocaleDateString()}</p>
                      <p>Updated: {new Date(roiSection.updated_at).toLocaleDateString()}</p>
                      <p>Status: 
                        <span className={`ml-1 px-2 py-1 rounded text-xs ${
                          formData.is_published 
                            ? 'bg-green-600 text-green-100' 
                            : 'bg-red-600 text-red-100'
                        }`}>
                          {formData.is_published ? 'Published' : 'Draft'}
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* ROI Cards Management */}
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                <h2 className="text-xl font-semibold text-white mb-6">ROI Cards</h2>
                
                {/* Add New Card Form */}
                <form onSubmit={handleCreateCard} className="space-y-4 mb-6 p-4 bg-gray-800 rounded-md">
                  <h3 className="text-lg font-medium text-white">Add New Card</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={cardFormData.title}
                      onChange={(e) => setCardFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., Revenue Growth"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Value *
                    </label>
                    <input
                      type="text"
                      value={cardFormData.value}
                      onChange={(e) => setCardFormData(prev => ({ ...prev, value: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., 300%"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={cardFormData.description}
                      onChange={(e) => setCardFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter description"
                      rows={3}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Icon URL
                    </label>
                    <input
                      type="url"
                      value={cardFormData.icon_url}
                      onChange={(e) => setCardFormData(prev => ({ ...prev, icon_url: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="https://example.com/icon.svg"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors"
                  >
                    Add Card
                  </button>
                </form>
                
                {/* Existing Cards List */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Existing Cards ({cards.length})</h3>
                  
                  {cards.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No ROI cards created yet</p>
                  ) : (
                    cards.map((card) => (
                      <div key={card.id} className="p-4 bg-gray-800 rounded-md border border-gray-700">
                        {isCardEditing === card.id ? (
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={cardFormData.title}
                              onChange={(e) => setCardFormData(prev => ({ ...prev, title: e.target.value }))}
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                              placeholder="Title"
                            />
                            <input
                              type="text"
                              value={cardFormData.value}
                              onChange={(e) => setCardFormData(prev => ({ ...prev, value: e.target.value }))}
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                              placeholder="Value"
                            />
                            <textarea
                              value={cardFormData.description}
                              onChange={(e) => setCardFormData(prev => ({ ...prev, description: e.target.value }))}
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                              placeholder="Description"
                              rows={2}
                            />
                            <input
                              type="url"
                              value={cardFormData.icon_url}
                              onChange={(e) => setCardFormData(prev => ({ ...prev, icon_url: e.target.value }))}
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                              placeholder="Icon URL"
                            />
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleUpdateCard(card.id)}
                                className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded text-sm transition-colors"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setIsCardEditing(null)}
                                className="bg-gray-600 hover:bg-gray-700 text-white py-1 px-3 rounded text-sm transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-lg font-medium text-white">{card.title}</h4>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => startCardEdit(card)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm transition-colors"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteCard(card.id)}
                                  className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm transition-colors"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                            <p className="text-2xl font-bold text-purple-400 mb-2">{card.value}</p>
                            <p className="text-gray-300 mb-2">{card.description}</p>
                            {card.icon_url && (
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-400">Icon:</span>
                                <img src={card.icon_url} alt={card.title} className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminAuthCheck>
  )
}