'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast, Toaster } from 'react-hot-toast'
import AdminAuthCheck from '@/app/components/AdminAuthCheck'

export default function NewReviewPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    author: '',
    role: '',
    company: '',
    country: '',
    rating: 5,
    text: '',
    planTitle: '',
    projectType: '',
    isVerified: true,
    successMetrics: [
      { label: '', value: '' },
      { label: '', value: '' }
    ]
  })

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle metric input changes
  const handleMetricChange = (index: number, field: 'label' | 'value', value: string) => {
    setFormData(prev => {
      const updatedMetrics = [...prev.successMetrics]
      updatedMetrics[index] = {
        ...updatedMetrics[index],
        [field]: value
      }
      
      return {
        ...prev,
        successMetrics: updatedMetrics
      }
    })
  }

  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }))
  }

  // Add another metric field
  const addMetric = () => {
    setFormData(prev => ({
      ...prev,
      successMetrics: [...prev.successMetrics, { label: '', value: '' }]
    }))
  }

  // Remove a metric field
  const removeMetric = (index: number) => {
    setFormData(prev => {
      const updatedMetrics = [...prev.successMetrics]
      updatedMetrics.splice(index, 1)
      
      return {
        ...prev,
        successMetrics: updatedMetrics
      }
    })
  }

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // Filter out empty metrics
    const filteredMetrics = formData.successMetrics.filter(
      metric => metric.label.trim() !== '' && metric.value.trim() !== ''
    )
    
    // Validate form
    if (!formData.author || !formData.text || !formData.planTitle) {
      toast.error('Please fill in all required fields')
      return
    }
    
    // Submit form
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          successMetrics: filteredMetrics
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        toast.success('Review added successfully')
        setTimeout(() => {
          router.push('/hasnaat/reviews')
        }, 1500)
      } else {
        toast.error(data.message || 'Failed to add review')
      }
    } catch (error) {
      console.error('Error adding review:', error)
      toast.error('An error occurred while adding the review')
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
                Add New Review
              </h1>
              <p className="text-gray-400 mt-2">Create a new client testimonial</p>
            </div>
            
            <Link
              href="/admin/reviews"
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span>Back to Reviews</span>
            </Link>
          </div>
          
          <div className="bg-gray-900/50 rounded-xl border border-purple-500/20 p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Author Information */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="author" className="block text-sm font-medium text-gray-300 mb-1">
                      Author Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="author"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      className="w-full bg-gray-800/70 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-1">
                      Role/Position
                    </label>
                    <input
                      type="text"
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full bg-gray-800/70 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full bg-gray-800/70 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full bg-gray-800/70 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                {/* Review Details */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="planTitle" className="block text-sm font-medium text-gray-300 mb-1">
                      Plan/Service Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="planTitle"
                      name="planTitle"
                      value={formData.planTitle}
                      onChange={handleChange}
                      className="w-full bg-gray-800/70 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select a plan</option>
                      <option value="WordPress Basic">WordPress Basic</option>
                      <option value="WordPress Professional">WordPress Professional</option>
                      <option value="WordPress Enterprise">WordPress Enterprise</option>
                      <option value="Full-Stack Basic">Full-Stack Basic</option>
                      <option value="Full-Stack Professional">Full-Stack Professional</option>
                      <option value="Full-Stack Enterprise">Full-Stack Enterprise</option>
                      <option value="AI Agents/WebApps">AI Agents/WebApps</option>
                      <option value="SEO/Content Writing">SEO/Content Writing</option>
                      <option value="UI/UX Design">UI/UX Design</option>
                      <option value="Mobile App Development">Mobile App Development</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="projectType" className="block text-sm font-medium text-gray-300 mb-1">
                      Project Type/Specific Service
                    </label>
                    <input
                      type="text"
                      id="projectType"
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleChange}
                      className="w-full bg-gray-800/70 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="rating" className="block text-sm font-medium text-gray-300 mb-1">
                      Rating
                    </label>
                    <div className="flex items-center space-x-4">
                      <select
                        id="rating"
                        name="rating"
                        value={formData.rating}
                        onChange={handleChange}
                        className="bg-gray-800/70 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                      </select>
                      <div className="flex text-yellow-500">
                        {'★'.repeat(Number(formData.rating))}
                        {'☆'.repeat(5 - Number(formData.rating))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isVerified"
                      name="isVerified"
                      checked={formData.isVerified}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <label htmlFor="isVerified" className="ml-2 block text-sm text-gray-300">
                      Mark as Verified
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Review Text */}
              <div className="mt-6">
                <label htmlFor="text" className="block text-sm font-medium text-gray-300 mb-1">
                  Review Text <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="text"
                  name="text"
                  value={formData.text}
                  onChange={handleChange}
                  rows={5}
                  className="w-full bg-gray-800/70 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                ></textarea>
              </div>
              
              {/* Success Metrics */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Success Metrics (optional)
                  </label>
                  <button
                    type="button"
                    onClick={addMetric}
                    className="text-xs bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 px-2 py-1 rounded-md transition-colors flex items-center space-x-1"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <span>Add Metric</span>
                  </button>
                </div>
                
                <div className="space-y-3">
                  {formData.successMetrics.map((metric, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={metric.label}
                        onChange={(e) => handleMetricChange(index, 'label', e.target.value)}
                        placeholder="Metric Label (e.g. 'Conversion Rate')"
                        className="flex-1 bg-gray-800/70 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      />
                      <input
                        type="text"
                        value={metric.value}
                        onChange={(e) => handleMetricChange(index, 'value', e.target.value)}
                        placeholder="Value (e.g. '+30%')"
                        className="w-32 bg-gray-800/70 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeMetric(index)}
                        className="text-red-400 hover:text-red-300 p-1"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-lg flex items-center space-x-2 transition-colors ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
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
                      <span>Save Review</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminAuthCheck>
  )
} 