'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast, Toaster } from 'react-hot-toast'
import Link from 'next/link'

interface ROISection {
  id: number
  main_heading: string
}

export default function AddROICard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [roiSection, setROISection] = useState<ROISection | null>(null)

  useEffect(() => {
    const auth = sessionStorage.getItem('adminAuth')
    const password = sessionStorage.getItem('adminPassword')
    
    if (auth !== 'true' || !password) {
      router.push('/hasnaat/login?redirect=/hasnaat/roi-section/add')
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
        router.push('/hasnaat/login?redirect=/hasnaat/roi-section/add')
        return
      }

      const data = await response.json()
      
      if (data.success && data.data && data.data.length > 0) {
        setROISection(data.data[0])
      }
    } catch (error) {
      console.error('Error fetching ROI section:', error)
      toast.error('Failed to load ROI section')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!roiSection) return

    setSubmitting(true)
    try {
      const formData = new FormData(e.currentTarget)
      
      const cardData = {
        roi_section_id: roiSection.id,
        title: formData.get('title') as string,
        value: formData.get('value') as string,
        description: formData.get('description') as string,
        icon_url: formData.get('icon_url') as string || null,
        metric_type: formData.get('metric_type') as string,
        trend: formData.get('trend') as string,
        trend_percentage: formData.get('trend_percentage') ? parseFloat(formData.get('trend_percentage') as string) : null,
        previous_value: formData.get('previous_value') as string || null,
        time_period: formData.get('time_period') as string || null,
        category: formData.get('category') as string || null,
        display_order: parseInt(formData.get('display_order') as string) || 0,
        is_featured: formData.get('is_featured') === 'true',
        background_color: formData.get('background_color') as string || null,
        animation_type: formData.get('animation_type') as string
      }

      const response = await fetch('/api/admin/roi-cards', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminPassword}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cardData)
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success('ROI card added successfully!')
        router.push('/hasnaat/roi-section')
      } else {
        toast.error(data.message || 'Failed to add card')
      }
    } catch (error) {
      console.error('Error adding ROI card:', error)
      toast.error('Failed to add ROI card')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
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

      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <Link href="/hasnaat/roi-section" className="flex items-center text-purple-400 hover:text-purple-300 mb-4 transition-colors text-sm">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to ROI Management
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Add New ROI Card</h1>
          <p className="text-gray-400 text-sm">Create a new ROI achievement card</p>
        </div>

        {/* Form */}
        <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Title*</label>
                <input
                  type="text"
                  name="title"
                  className="w-full px-4 py-2.5 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  placeholder="e.g., Increased Conversion Rate"
                  required
                />
              </div>

              {/* Value */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Value*</label>
                <input
                  type="text"
                  name="value"
                  className="w-full px-4 py-2.5 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  placeholder="e.g., +45% or $2.4M"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select
                  name="category"
                  className="w-full px-4 py-2.5 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                >
                  <option value="">Select category</option>
                  <option value="conversion">Conversion</option>
                  <option value="revenue">Revenue</option>
                  <option value="efficiency">Efficiency</option>
                  <option value="engagement">Engagement</option>
                </select>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Description*</label>
                <textarea
                  name="description"
                  rows={3}
                  className="w-full px-4 py-2.5 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
                  placeholder="Describe the ROI achievement..."
                  required
                />
              </div>

              {/* Icon URL */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Icon URL</label>
                <input
                  type="url"
                  name="icon_url"
                  className="w-full px-4 py-2.5 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  placeholder="https://api.iconify.design/..."
                />
              </div>

              {/* Metric Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Metric Type</label>
                <select
                  name="metric_type"
                  defaultValue="percentage"
                  className="w-full px-4 py-2.5 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                >
                  <option value="percentage">Percentage</option>
                  <option value="currency">Currency</option>
                  <option value="number">Number</option>
                  <option value="time">Time</option>
                </select>
              </div>

              {/* Trend */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Trend</label>
                <select
                  name="trend"
                  defaultValue="up"
                  className="w-full px-4 py-2.5 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                >
                  <option value="up">Up (Positive)</option>
                  <option value="down">Down (Negative)</option>
                  <option value="stable">Stable</option>
                </select>
              </div>

              {/* Trend Percentage */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Trend Percentage</label>
                <input
                  type="number"
                  name="trend_percentage"
                  step="0.01"
                  className="w-full px-4 py-2.5 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  placeholder="e.g., 45.50"
                />
              </div>

              {/* Time Period */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Time Period</label>
                <input
                  type="text"
                  name="time_period"
                  className="w-full px-4 py-2.5 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  placeholder="e.g., Last 6 months"
                />
              </div>

              {/* Previous Value */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Previous Value</label>
                <input
                  type="text"
                  name="previous_value"
                  className="w-full px-4 py-2.5 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  placeholder="e.g., 2.5%"
                />
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Display Order</label>
                <input
                  type="number"
                  name="display_order"
                  min="0"
                  defaultValue="0"
                  className="w-full px-4 py-2.5 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                />
              </div>

              {/* Featured */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Featured Card</label>
                <select
                  name="is_featured"
                  defaultValue="false"
                  className="w-full px-4 py-2.5 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>

              {/* Background Color */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Background Color</label>
                <input
                  type="text"
                  name="background_color"
                  className="w-full px-4 py-2.5 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  placeholder="e.g., #7c3aed"
                />
              </div>

              {/* Animation Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Animation</label>
                <select
                  name="animation_type"
                  defaultValue="fade"
                  className="w-full px-4 py-2.5 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                >
                  <option value="fade">Fade</option>
                  <option value="slide">Slide</option>
                  <option value="scale">Scale</option>
                  <option value="none">None</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-800">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add ROI Card
                  </>
                )}
              </button>
              <Link
                href="/hasnaat/roi-section"
                className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors border border-white/20"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}



