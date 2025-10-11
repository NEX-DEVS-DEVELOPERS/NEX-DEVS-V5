'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast, Toaster } from 'react-hot-toast'
import Image from 'next/image'

// Quotation data interface
interface QuotationData {
  clientName: string
  clientEmail: string
  clientPhone: string
  clientCompany: string
  projectTitle: string
  projectDescription: string
  serviceCategories: string[]
  timeline: string
  deliverables: string[]
  items: QuotationItem[]
  subtotal: number
  taxRate: number
  taxAmount: number
  total: number
  validUntil: string
  notes: string
  includePortfolioImages: boolean
  selectedImages: string[]
  imageLinks: string[]
}

interface QuotationItem {
  id: string
  description: string
  quantity: number
  rate: number
  total: number
}

export default function AdminPage() {
  const router = useRouter()
  const [currentView, setCurrentView] = useState<'dashboard' | 'quotation'>('dashboard')
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [quotationData, setQuotationData] = useState<QuotationData>({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientCompany: '',
    projectTitle: '',
    projectDescription: '',
    serviceCategories: [],
    timeline: '',
    deliverables: [],
    items: [{ id: '1', description: '', quantity: 1, rate: 0, total: 0 }],
    subtotal: 0,
    taxRate: 18,
    taxAmount: 0,
    total: 0,
    validUntil: '',
    notes: '',
    includePortfolioImages: false,
    selectedImages: [],
    imageLinks: ['', '', '', '']
  })
  const [availableImages, setAvailableImages] = useState<string[]>([])
  const quotationRef = useRef<HTMLDivElement>(null)

  // URL validation function
  const isValidUrl = (string: string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  useEffect(() => {
    // Check if user is authenticated
    const auth = sessionStorage.getItem('adminAuth')
    if (auth !== 'true') {
      router.push('/hasnaat/login')
    }

    // Set default valid until date (30 days from now)
    const validUntilDate = new Date()
    validUntilDate.setDate(validUntilDate.getDate() + 30)
    setQuotationData(prev => ({
      ...prev,
      validUntil: validUntilDate.toISOString().split('T')[0]
    }))

    // Load available project images
    loadAvailableImages()
  }, [router])

  const loadAvailableImages = async () => {
    try {
      // This would typically fetch from your projects API
      // For now, we'll use some sample images
      const sampleImages = [
        '/projects/project1.jpg',
        '/projects/project2.jpg',
        '/projects/project3.jpg',
        '/projects/project4.jpg'
      ]
      setAvailableImages(sampleImages)
    } catch (error) {
      console.error('Error loading images:', error)
    }
  }

  const serviceOptions = [
    'Web Development',
    'Mobile App Development',
    'UI/UX Design',
    'E-commerce Solutions',
    'AI Integration',
    'Database Design',
    'API Development',
    'DevOps & Deployment',
    'Maintenance & Support',
    'SEO Optimization',
    'Performance Optimization',
    'Security Implementation'
  ]

  const handleInputChange = (field: keyof QuotationData, value: any) => {
    setQuotationData(prev => {
      const updated = { ...prev, [field]: value }

      // Recalculate totals when items change
      if (field === 'items' || field === 'taxRate') {
        const subtotal = updated.items.reduce((sum, item) => sum + item.total, 0)
        const taxAmount = (subtotal * updated.taxRate) / 100
        const total = subtotal + taxAmount

        updated.subtotal = subtotal
        updated.taxAmount = taxAmount
        updated.total = total
      }

      return updated
    })
  }

  const addQuotationItem = () => {
    const newItem: QuotationItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      total: 0
    }
    handleInputChange('items', [...quotationData.items, newItem])
  }

  const updateQuotationItem = (id: string, field: keyof QuotationItem, value: any) => {
    const updatedItems = quotationData.items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value }
        if (field === 'quantity' || field === 'rate') {
          updatedItem.total = updatedItem.quantity * updatedItem.rate
        }
        return updatedItem
      }
      return item
    })
    handleInputChange('items', updatedItems)
  }

  const removeQuotationItem = (id: string) => {
    if (quotationData.items.length > 1) {
      const updatedItems = quotationData.items.filter(item => item.id !== id)
      handleInputChange('items', updatedItems)
    }
  }

  const handleServiceCategoryChange = (category: string, checked: boolean) => {
    const updatedCategories = checked
      ? [...quotationData.serviceCategories, category]
      : quotationData.serviceCategories.filter(c => c !== category)
    handleInputChange('serviceCategories', updatedCategories)
  }

  const handleDeliverableChange = (index: number, value: string) => {
    const updatedDeliverables = [...quotationData.deliverables]
    updatedDeliverables[index] = value
    handleInputChange('deliverables', updatedDeliverables)
  }

  const addDeliverable = () => {
    handleInputChange('deliverables', [...quotationData.deliverables, ''])
  }

  const removeDeliverable = (index: number) => {
    if (quotationData.deliverables.length > 1) {
      const updatedDeliverables = quotationData.deliverables.filter((_, i) => i !== index)
      handleInputChange('deliverables', updatedDeliverables)
    }
  }

  const downloadQuotationPDF = async () => {
    try {
      if (!quotationRef.current) {
        toast.error('Quotation preview not available')
        return
      }

      // Show loading toast
      const loadingToast = toast.loading('Generating PDF...')

      // Dynamic imports to avoid SSR issues
      const html2canvas = (await import('html2canvas')).default
      const jsPDFModule = await import('jspdf')
      const jsPDF = jsPDFModule.jsPDF

      // Get the quotation element
      const element = quotationRef.current

      // Configure html2canvas options for better quality
      const canvas = await html2canvas(element, {
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#000000', // Black background to match the theme
        width: element.scrollWidth,
        height: element.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      })

      // Calculate PDF dimensions
      const imgWidth = 210 // A4 width in mm
      const pageHeight = 295 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4')
      let position = 0

      // Add the image to PDF
      const imgData = canvas.toDataURL('image/png')
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      // Add new pages if content is longer than one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      // Generate filename
      const fileName = `NEX-DEVS-Quotation-${quotationData.clientName || 'Client'}-${Date.now().toString().slice(-6)}.pdf`

      // Save the PDF
      pdf.save(fileName)

      // Dismiss loading toast and show success
      toast.dismiss(loadingToast)
      toast.success('PDF downloaded successfully!')
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast.error('Error generating PDF. Please try again.')
    }
  }

  if (currentView === 'dashboard') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4">
        <Toaster position="top-right" />
        <div className="max-w-md w-full">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-white via-purple-400 to-blue-500 bg-clip-text text-transparent mb-8 text-center">
            Admin Dashboard
          </h1>

          <div className="space-y-4">
            <button
              onClick={() => setCurrentView('quotation')}
              className="flex items-center justify-between p-4 rounded-lg neon-border-purple-base bg-gray-900/50 hover:bg-gray-800 transition-colors w-full"
            >
              <div>
                <h2 className="text-xl font-semibold text-white">Quotation Management</h2>
                <p className="text-sm text-gray-400">Create and manage client quotations</p>
              </div>
              <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>

            <Link
              href="/hasnaat/projects"
              className="flex items-center justify-between p-4 rounded-lg border border-purple-500/30 bg-gray-900/50 hover:bg-gray-800 transition-colors w-full"
            >
              <div>
                <h2 className="text-xl font-semibold text-white">Projects</h2>
                <p className="text-sm text-gray-400">Manage your portfolio projects</p>
              </div>
              <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <Link
              href="/hasnaat/team-members"
              className="flex items-center justify-between p-4 rounded-lg border border-purple-500/30 bg-gray-900/50 hover:bg-gray-800 transition-colors w-full"
            >
              <div>
                <h2 className="text-xl font-semibold text-white">Team Members</h2>
                <p className="text-sm text-gray-400">Manage your team members with database storage</p>
              </div>
              <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <Link
              href="/hasnaat/automation-workflows"
              className="flex items-center justify-between p-4 rounded-lg border border-green-500/30 bg-gray-900/50 hover:bg-gray-800 transition-colors w-full"
            >
              <div>
                <h2 className="text-xl font-semibold text-white">🤖 AI Automation & Workflows</h2>
                <p className="text-sm text-gray-400">Manage n8n, Make.com, Zapier automations and AI agents</p>
              </div>
              <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <Link
              href="/hasnaat/reviews"
              className="flex items-center justify-between p-4 rounded-lg border border-purple-500/30 bg-gray-900/50 hover:bg-gray-800 transition-colors w-full"
            >
              <div>
                <h2 className="text-xl font-semibold text-white">Client Reviews</h2>
                <p className="text-sm text-gray-400">Manage client testimonials and reviews</p>
              </div>
              <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <Link
              href="/hasnaat/command-room"
              className="flex items-center justify-between p-4 rounded-lg border border-purple-500/30 bg-gray-900/50 hover:bg-gray-800 transition-colors w-full"
            >
              <div>
                <h2 className="text-xl font-semibold text-white">Command Room</h2>
                <p className="text-sm text-gray-400">Access Nexious command room features</p>
              </div>
              <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <Link
              href="/hasnaat/database/test"
              className="flex items-center justify-between p-4 rounded-lg border border-purple-500/30 bg-gray-900/50 hover:bg-gray-800 transition-colors w-full"
            >
              <div>
                <h2 className="text-xl font-semibold text-white">Database Test</h2>
                <p className="text-sm text-gray-400">Test and monitor database connections</p>
              </div>
              <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <Link
              href="/hasnaat/database-migration"
              className="flex items-center justify-between p-4 rounded-lg border border-purple-500/30 bg-gray-900/50 hover:bg-gray-800 transition-colors w-full"
            >
              <div>
                <h2 className="text-xl font-semibold text-white">Database Migration</h2>
                <p className="text-sm text-gray-400">Migrate data between database systems</p>
              </div>
              <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <Link
              href="/hasnaat/roi-section"
              className="flex items-center justify-between p-4 rounded-lg border border-blue-500/30 bg-gray-900/50 hover:bg-gray-800 transition-colors w-full"
            >
              <div>
                <h2 className="text-xl font-semibold text-white">ROI Section</h2>
                <p className="text-sm text-gray-400">Manage ROI metrics and performance data</p>
              </div>
              <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <Link
              href="/"
              className="flex items-center justify-between p-4 rounded-lg border border-gray-800 bg-gray-900/50 hover:bg-gray-800 transition-colors w-full"
            >
              <div>
                <h2 className="text-xl font-semibold text-white">Back to Site</h2>
                <p className="text-sm text-gray-400">Return to your website</p>
              </div>
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => {
                sessionStorage.removeItem('adminAuth')
                router.push('/hasnaat/login')
              }}
              className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Quotation Management View
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-8 pb-16">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => setCurrentView('dashboard')}
              className="flex items-center text-purple-400 hover:text-purple-300 mb-4 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-400 to-blue-500 bg-clip-text text-transparent">
              Quotation Management
            </h1>
            <p className="text-gray-400 mt-2">Create professional quotations for client projects</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                isPreviewMode
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              {isPreviewMode ? 'Edit Mode' : 'Preview Mode'}
            </button>

            {isPreviewMode && (
              <button
                onClick={downloadQuotationPDF}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6">
        {!isPreviewMode ? (
          /* Edit Mode - Form Interface */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Client Information Section */}
            <div className="bg-gray-900/50 rounded-xl p-6 border neon-border-blue-base">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <svg className="w-6 h-6 mr-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Client Information
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Client Name*</label>
                    <input
                      type="text"
                      value={quotationData.clientName}
                      onChange={(e) => handleInputChange('clientName', e.target.value)}
                      className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      placeholder="Enter client name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
                    <input
                      type="text"
                      value={quotationData.clientCompany}
                      onChange={(e) => handleInputChange('clientCompany', e.target.value)}
                      className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      placeholder="Company name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email*</label>
                    <input
                      type="email"
                      value={quotationData.clientEmail}
                      onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                      className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      placeholder="client@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={quotationData.clientPhone}
                      onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                      className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Project Details Section */}
            <div className="bg-gray-900/50 rounded-xl p-6 border neon-border-green-base">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <svg className="w-6 h-6 mr-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Project Details
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Project Title*</label>
                  <input
                    type="text"
                    value={quotationData.projectTitle}
                    onChange={(e) => handleInputChange('projectTitle', e.target.value)}
                    className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                    placeholder="Enter project title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Project Description*</label>
                  <textarea
                    value={quotationData.projectDescription}
                    onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors resize-none"
                    placeholder="Describe the project requirements and scope"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Timeline</label>
                  <input
                    type="text"
                    value={quotationData.timeline}
                    onChange={(e) => handleInputChange('timeline', e.target.value)}
                    className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                    placeholder="e.g., 4-6 weeks"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Valid Until</label>
                  <input
                    type="date"
                    value={quotationData.validUntil}
                    onChange={(e) => handleInputChange('validUntil', e.target.value)}
                    className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Service Categories Section */}
            <div className="bg-gray-900/50 rounded-xl p-6 border neon-border-pink-base">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <svg className="w-6 h-6 mr-3 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Service Categories
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {serviceOptions.map((service) => (
                  <label key={service} className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={quotationData.serviceCategories.includes(service)}
                      onChange={(e) => handleServiceCategoryChange(service, e.target.checked)}
                      className="w-4 h-4 text-pink-500 bg-black/50 border-gray-600 rounded focus:ring-pink-500 focus:ring-2"
                    />
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{service}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Deliverables Section */}
            <div className="bg-gray-900/50 rounded-xl p-6 border neon-border-cyan-base">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <svg className="w-6 h-6 mr-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Deliverables
              </h2>

              <div className="space-y-3">
                {quotationData.deliverables.map((deliverable, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      type="text"
                      value={deliverable}
                      onChange={(e) => handleDeliverableChange(index, e.target.value)}
                      className="flex-1 px-4 py-2 bg-black/50 border border-gray-600 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                      placeholder="Enter deliverable"
                    />
                    {quotationData.deliverables.length > 1 && (
                      <button
                        onClick={() => removeDeliverable(index)}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}

                <button
                  onClick={addDeliverable}
                  className="w-full py-2 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-cyan-500 hover:text-cyan-400 transition-colors"
                >
                  + Add Deliverable
                </button>
              </div>
            </div>

            {/* Pricing Section - Full Width */}
            <div className="lg:col-span-2 bg-gray-900/50 rounded-xl p-6 border neon-border-orange-base">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <svg className="w-6 h-6 mr-3 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                Pricing Breakdown
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Description</th>
                      <th className="text-center py-3 px-4 text-gray-300 font-medium w-24">Qty</th>
                      <th className="text-right py-3 px-4 text-gray-300 font-medium w-32">Rate ($)</th>
                      <th className="text-right py-3 px-4 text-gray-300 font-medium w-32">Total ($)</th>
                      <th className="w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotationData.items.map((item, index) => (
                      <tr key={item.id} className="border-b border-gray-800">
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => updateQuotationItem(item.id, 'description', e.target.value)}
                            className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-500 rounded px-2 py-1"
                            placeholder="Service description"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuotationItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                            className="w-full bg-transparent text-white text-center focus:outline-none focus:ring-1 focus:ring-orange-500 rounded px-2 py-1"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.rate}
                            onChange={(e) => updateQuotationItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                            className="w-full bg-transparent text-white text-right focus:outline-none focus:ring-1 focus:ring-orange-500 rounded px-2 py-1"
                          />
                        </td>
                        <td className="py-3 px-4 text-right text-white font-medium">
                          ${item.total.toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          {quotationData.items.length > 1 && (
                            <button
                              onClick={() => removeQuotationItem(item.id)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={addQuotationItem}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Item
                  </button>

                  <div className="text-right space-y-2">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-300">Tax Rate (%):</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={quotationData.taxRate}
                        onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value) || 0)}
                        className="w-20 bg-black/50 border border-gray-600 rounded px-2 py-1 text-white text-center focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                      />
                    </div>
                    <div className="text-lg">
                      <div className="flex justify-between gap-8 text-gray-300">
                        <span>Subtotal:</span>
                        <span>${quotationData.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between gap-8 text-gray-300">
                        <span>Tax ({quotationData.taxRate}%):</span>
                        <span>${quotationData.taxAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between gap-8 text-xl font-bold text-white border-t border-gray-700 pt-2 mt-2">
                        <span>Total:</span>
                        <span>${quotationData.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Portfolio Images Section */}
            <div className="lg:col-span-2 bg-gray-900/50 rounded-xl p-6 border neon-border-violet-base">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <svg className="w-6 h-6 mr-3 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Portfolio Showcase
              </h2>

              <div className="space-y-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={quotationData.includePortfolioImages}
                    onChange={(e) => handleInputChange('includePortfolioImages', e.target.checked)}
                    className="w-4 h-4 text-violet-500 bg-black/50 border-gray-600 rounded focus:ring-violet-500 focus:ring-2"
                  />
                  <span className="text-white font-medium">Include recent project images in quotation</span>
                </label>

                {quotationData.includePortfolioImages && (
                  <div className="mb-4">
                    <button
                      onClick={() => {
                        // Create a file input element
                        const input = document.createElement('input')
                        input.type = 'file'
                        input.accept = 'image/*'
                        input.multiple = true
                        input.onchange = async (e) => {
                          const files = (e.target as HTMLInputElement).files
                          if (files && files.length > 0) {
                            toast.loading('Uploading images...')
                            try {
                              const uploadPromises = Array.from(files).map(async (file) => {
                                const formData = new FormData()
                                formData.append('file', file)
                                formData.append('password', sessionStorage.getItem('adminPassword') || 'nex-devs919')

                                const response = await fetch('/api/upload', {
                                  method: 'POST',
                                  body: formData
                                })

                                if (!response.ok) {
                                  throw new Error('Failed to upload image')
                                }

                                const data = await response.json()
                                return data.imagePath
                              })

                              const uploadedPaths = await Promise.all(uploadPromises)
                              setAvailableImages(prev => [...prev, ...uploadedPaths])
                              toast.dismiss()
                              toast.success(`Successfully uploaded ${uploadedPaths.length} image(s)`)
                            } catch (error) {
                              toast.dismiss()
                              toast.error('Failed to upload images')
                              console.error('Upload error:', error)
                            }
                          }
                        }
                        input.click()
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span>Add Images from File Manager</span>
                    </button>
                  </div>
                )}

                {quotationData.includePortfolioImages && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      Project Image Links
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {quotationData.imageLinks.map((link, index) => (
                        <div key={index} className="space-y-2">
                          <label className="block text-sm font-medium text-gray-300">
                            Project Image {index + 1}
                          </label>
                          <input
                            type="url"
                            value={link}
                            onChange={(e) => {
                              const newImageLinks = [...quotationData.imageLinks]
                              newImageLinks[index] = e.target.value
                              handleInputChange('imageLinks', newImageLinks)
                            }}
                            placeholder={`https://example.com/project-${index + 1}.jpg`}
                            className="w-full px-4 py-2 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                          />
                          {link && !isValidUrl(link) && (
                            <p className="text-red-400 text-xs">Please enter a valid URL</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {quotationData.includePortfolioImages && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {availableImages.map((image, index) => (
                      <div key={index} className="relative group cursor-pointer">
                        <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
                          <div className="w-full h-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
                            <svg className="w-8 h-8 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-violet-500/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm font-medium">Project {index + 1}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Additional Notes */}
            <div className="lg:col-span-2 bg-gray-900/50 rounded-xl p-6 border neon-border-yellow-base">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <svg className="w-6 h-6 mr-3 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Additional Notes
              </h2>

              <textarea
                value={quotationData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors resize-none"
                placeholder="Add any additional terms, conditions, or notes for the client..."
              />
            </div>
          </div>
        ) : (
          /* Preview Mode - Modern Dark Theme Quotation Display */
          <div ref={quotationRef} className="max-w-4xl mx-auto bg-black text-white rounded-xl overflow-hidden shadow-2xl relative">
            {/* Neural Network Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-10 left-10 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <div className="absolute top-20 right-20 w-1 h-1 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
              <div className="absolute bottom-10 right-10 w-1 h-1 bg-purple-300 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
              <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-blue-300 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
              <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-violet-300 rounded-full animate-pulse" style={{animationDelay: '2.5s'}}></div>
            </div>

            {/* Company Header */}
            <div className="relative bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 p-8 border-b border-purple-600/30">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-transparent to-purple-600/10"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent tracking-wide">
                    NEX-DEVS
                  </h1>
                  <p className="text-purple-200 text-lg font-medium tracking-wider">INNOVATION IN DEVELOPMENT</p>
                  <p className="text-purple-300 mt-2 flex items-center">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></span>
                    950+ Projects Completed
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-purple-200 mb-3 font-medium">Professional Web Development Agency</p>
                  <button
                    onClick={() => window.open('http://nex-devs-officials.vercel.app/', '_blank')}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 border border-purple-400/50 rounded-lg transition-all duration-300 text-white font-medium shadow-lg hover:shadow-purple-500/25"
                  >
                    Visit Website
                  </button>
                </div>
              </div>
            </div>

            {/* Quotation Content */}
            <div className="relative p-8">
              {/* Header Info */}
              <div className="flex justify-between items-start mb-8 p-6 bg-gray-900/50 rounded-lg border border-purple-500/20">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                    QUOTATION
                  </h2>
                  <p className="text-purple-300">Quote #: NEX-{Date.now().toString().slice(-6)}</p>
                  <p className="text-purple-300">Date: {new Date().toLocaleDateString()}</p>
                  {quotationData.validUntil && (
                    <p className="text-purple-300">Valid Until: {new Date(quotationData.validUntil).toLocaleDateString()}</p>
                  )}
                </div>

                <div className="text-right">
                  <h3 className="text-xl font-semibold text-purple-400 mb-2">Bill To:</h3>
                  <p className="text-white font-medium">{quotationData.clientName || 'Client Name'}</p>
                  {quotationData.clientCompany && <p className="text-gray-300">{quotationData.clientCompany}</p>}
                  <p className="text-gray-300">{quotationData.clientEmail || 'client@example.com'}</p>
                  {quotationData.clientPhone && <p className="text-gray-300">{quotationData.clientPhone}</p>}
                </div>
              </div>

              {/* Project Information */}
              <div className="mb-8 p-6 bg-gray-900/30 rounded-lg border border-purple-500/20 backdrop-blur-sm">
                <h3 className="text-xl font-semibold text-purple-400 mb-4 flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 animate-pulse"></div>
                  Project Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-purple-300 mb-2">Project Title:</h4>
                    <p className="text-white">{quotationData.projectTitle || 'Project Title'}</p>
                  </div>
                  {quotationData.timeline && (
                    <div>
                      <h4 className="font-medium text-purple-300 mb-2">Timeline:</h4>
                      <p className="text-white">{quotationData.timeline}</p>
                    </div>
                  )}
                </div>

                {quotationData.projectDescription && (
                  <div className="mt-4">
                    <h4 className="font-medium text-purple-300 mb-2">Description:</h4>
                    <p className="text-gray-300 leading-relaxed">{quotationData.projectDescription}</p>
                  </div>
                )}

                {quotationData.serviceCategories.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-purple-300 mb-2">Services:</h4>
                    <div className="flex flex-wrap gap-2">
                      {quotationData.serviceCategories.map((service, index) => (
                        <span key={index} className="px-3 py-1 bg-purple-600/20 text-purple-300 border border-purple-500/30 rounded-full text-sm hover:bg-purple-600/30 transition-colors">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {quotationData.deliverables.filter(d => d.trim()).length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-purple-300 mb-2">Deliverables:</h4>
                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                      {quotationData.deliverables.filter(d => d.trim()).map((deliverable, index) => (
                        <li key={index}>{deliverable}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Pricing Table */}
              {quotationData.items.some(item => item.description.trim() || item.quantity > 0 || item.rate > 0) && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-purple-400 mb-4 flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 animate-pulse"></div>
                    Pricing Breakdown
                  </h3>
                  <div className="overflow-x-auto bg-gray-900/30 rounded-lg border border-purple-500/20 backdrop-blur-sm">
                    <table className="w-full">
                      <thead className="bg-purple-900/20">
                        <tr>
                          <th className="text-left py-3 px-4 font-semibold text-purple-300 border-b border-purple-500/30">Description</th>
                          <th className="text-center py-3 px-4 font-semibold text-purple-300 border-b border-purple-500/30">Qty</th>
                          <th className="text-right py-3 px-4 font-semibold text-purple-300 border-b border-purple-500/30">Rate ($)</th>
                          <th className="text-right py-3 px-4 font-semibold text-purple-300 border-b border-purple-500/30">Total ($)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quotationData.items.filter(item => item.description.trim() || item.quantity > 0 || item.rate > 0).map((item, index) => (
                          <tr key={item.id} className="border-b border-purple-500/10 hover:bg-purple-900/10 transition-colors">
                            <td className="py-3 px-4 text-white">{item.description || 'Service Item'}</td>
                            <td className="py-3 px-4 text-center text-gray-300">{item.quantity}</td>
                            <td className="py-3 px-4 text-right text-gray-300">${item.rate.toFixed(2)}</td>
                            <td className="py-3 px-4 text-right text-white font-medium">${item.total.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="mt-4 p-4 text-right space-y-2">
                      <div className="flex justify-end gap-8 text-gray-300">
                        <span className="font-medium">Subtotal:</span>
                        <span>${quotationData.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-end gap-8 text-gray-300">
                        <span className="font-medium">Tax ({quotationData.taxRate}%):</span>
                        <span>${quotationData.taxAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-end gap-8 text-xl font-bold text-white border-t border-purple-500/30 pt-2">
                        <span>Total:</span>
                        <span className="text-purple-400">${quotationData.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Portfolio Images */}
              {quotationData.includePortfolioImages && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-purple-400 mb-4 flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 animate-pulse"></div>
                    Recent Project Showcase
                  </h3>
                  {(() => {
                    const validImageLinks = quotationData.imageLinks.filter(link => link && isValidUrl(link))
                    const totalValidImages = availableImages.length + validImageLinks.length

                    if (totalValidImages === 0) {
                      return (
                        <div className="text-center py-8 text-gray-400">
                          <svg className="w-12 h-12 mx-auto mb-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p>No project images added yet</p>
                        </div>
                      )
                    }

                    return (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Display uploaded images - only if they exist */}
                        {availableImages.slice(0, 4).map((image, index) => (
                          <div key={`uploaded-${index}`} className="aspect-square bg-gray-900/30 rounded-lg overflow-hidden border border-purple-500/20 backdrop-blur-sm hover:border-purple-400/40 transition-all duration-300 group">
                            <div className="w-full h-full bg-gradient-to-br from-purple-900/20 to-blue-900/20 flex items-center justify-center group-hover:from-purple-800/30 group-hover:to-blue-800/30 transition-all duration-300">
                              <div className="text-center">
                                <svg className="w-8 h-8 text-purple-400 mx-auto mb-2 group-hover:text-purple-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-xs text-purple-300 font-medium group-hover:text-white transition-colors">Project {index + 1}</p>
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Display linked images - only valid ones */}
                        {validImageLinks.map((link, index) => (
                          <div key={`linked-${index}`} className="aspect-square bg-gray-900/30 rounded-lg overflow-hidden border border-purple-500/20 backdrop-blur-sm hover:border-purple-400/40 transition-all duration-300 group">
                            <img
                              src={link}
                              alt={`Project ${availableImages.length + index + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                // Remove the failed image container entirely
                                const target = e.target as HTMLImageElement
                                const container = target.closest('.aspect-square')
                                if (container) {
                                  container.remove()
                                }
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    )
                  })()}
                </div>
              )}

              {/* Team Information */}
              <div className="mb-8 p-6 bg-gray-900/30 rounded-lg border border-purple-500/20 backdrop-blur-sm">
                <h3 className="text-xl font-semibold text-purple-400 mb-4 flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 animate-pulse"></div>
                  Our Expert Team
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center group">
                    <div className="w-16 h-16 bg-purple-600/20 border border-purple-500/30 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-600/30 transition-all duration-300">
                      <svg className="w-8 h-8 text-purple-400 group-hover:text-purple-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-white group-hover:text-purple-300 transition-colors">Hassam Baloch</h4>
                    <p className="text-sm text-gray-300">AI Automation Specialist</p>
                    <p className="text-xs text-gray-400 mt-1">N8N/Make.com Expert</p>
                  </div>

                  <div className="text-center group">
                    <div className="w-16 h-16 bg-blue-600/20 border border-blue-500/30 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-600/30 transition-all duration-300">
                      <svg className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-white group-hover:text-blue-300 transition-colors">Anns Bashir</h4>
                    <p className="text-sm text-gray-300">AI Automation Specialist</p>
                    <p className="text-xs text-gray-400 mt-1">N8N/Make.com Expert</p>
                  </div>

                  <div className="text-center group">
                    <div className="w-16 h-16 bg-green-600/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-green-600/30 transition-all duration-300">
                      <svg className="w-8 h-8 text-green-400 group-hover:text-green-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-white group-hover:text-green-300 transition-colors">Faizan Khan</h4>
                    <p className="text-sm text-gray-300">Development Specialist</p>
                    <p className="text-xs text-gray-400 mt-1">Full-Stack Developer</p>
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              {quotationData.notes && (
                <div className="mb-8 p-6 bg-yellow-600/10 rounded-lg border border-yellow-500/30 backdrop-blur-sm">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-2 flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3 animate-pulse"></div>
                    Additional Notes
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{quotationData.notes}</p>
                </div>
              )}

              {/* Terms and Signature */}
              <div className="border-t border-purple-500/30 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-6 bg-gray-900/30 rounded-lg border border-purple-500/20 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold text-purple-400 mb-3 flex items-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 animate-pulse"></div>
                      Terms & Conditions
                    </h3>
                    <ul className="text-sm text-gray-300 space-y-2">
                      <li className="flex items-center">
                        <div className="w-1 h-1 bg-purple-400 rounded-full mr-3"></div>
                        50% payment required to start the project
                      </li>
                      <li className="flex items-center">
                        <div className="w-1 h-1 bg-purple-400 rounded-full mr-3"></div>
                        Remaining 50% due upon project completion
                      </li>
                      <li className="flex items-center">
                        <div className="w-1 h-1 bg-purple-400 rounded-full mr-3"></div>
                        2 rounds of revisions included
                      </li>
                      <li className="flex items-center">
                        <div className="w-1 h-1 bg-purple-400 rounded-full mr-3"></div>
                        Additional revisions charged separately
                      </li>
                      <li className="flex items-center">
                        <div className="w-1 h-1 bg-purple-400 rounded-full mr-3"></div>
                        Project timeline may vary based on client feedback
                      </li>
                    </ul>
                  </div>

                  <div className="p-6 bg-gray-900/30 rounded-lg border border-purple-500/20 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold text-purple-400 mb-3 flex items-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 animate-pulse"></div>
                      Professional Signature
                    </h3>
                    <div className="border border-purple-500/30 rounded-lg p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-sm">
                      <p className="font-semibold text-white">NEX-DEVS Development Team</p>
                      <p className="text-sm text-purple-300">Professional Web Development Agency</p>
                      <p className="text-sm text-gray-300 mt-2">Contact: info@nex-devs.org</p>
                      <p className="text-xs text-gray-400 mt-1 flex items-center">
                        <span className="w-1 h-1 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                        Trusted by 950+ clients worldwide
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}