'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import AdminAuthCheck from '@/app/components/AdminAuthCheck'
import { toast, Toaster } from 'react-hot-toast'

const categories = [
  'Web Development', 
  'UI/UX Design', 
  'Mobile App', 
  'AI/ML', 
  'Web Development with AI Integration',
  'Mobile App Development',
  'Mobile App with AI Integration',
  'WordPress Development',
  'E-Commerce (Shopify/WooCommerce)',
  'AI Agents Development',
  'Web Applications',
  'Other'
]

// Project type definition
type Project = {
  id: number
  title: string
  description: string
  image: string
  secondImage?: string
  showBothImagesInPriority?: boolean
  category: string
  technologies: string[]
  link: string
  featured: boolean
  status?: string
  updatedDays?: number
  progress?: number
  features?: string[]
  exclusiveFeatures?: string[]
  imagePriority?: number | boolean
  visualEffects?: {
    morphTransition?: boolean
    rippleEffect?: boolean
    floatingElements?: boolean
    shimmering?: boolean
    spotlight?: boolean
    glassmorphism?: boolean
    particles?: boolean
    animation?: string
    shadows?: string
    border?: string
    animationTiming?: string
    animationIntensity?: string
  }
}

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Determine if this is a "Newly Added" project
  const [isNewlyAdded, setIsNewlyAdded] = useState(false)

  // Fetch project data on component mount
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects`)
        const projects = await response.json()
        
        const project = projects.find((p: Project) => p.id === parseInt(params.id))
        
        if (project) {
          setProject({
            ...project,
            // Ensure these fields exist with defaults if missing
            secondImage: project.secondImage || '/projects/placeholder.jpg',
            showBothImagesInPriority: project.showBothImagesInPriority || false,
            imagePriority: project.imagePriority || 5,
            visualEffects: project.visualEffects || {
              morphTransition: false,
              rippleEffect: false,
              floatingElements: false,
              shimmering: false,
              animation: 'none',
              shadows: 'none',
              border: 'default',
              glassmorphism: false,
              particles: false,
              animationTiming: 'normal',
              animationIntensity: 'normal'
            }
          })
          setIsNewlyAdded(project.title.startsWith('NEWLY ADDED:') || !!project.features || !!project.exclusiveFeatures)
        } else {
          toast.error('Project not found')
          router.push('/admin/projects')
        }
      } catch (error) {
        console.error('Error fetching project:', error)
        toast.error('Failed to load project')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchProject()
  }, [params.id, router])

  // Handle text input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!project) return
    
    const { name, value } = e.target
    setProject({
      ...project,
      [name]: value
    })
  }

  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!project) return
    
    const { name, checked } = e.target
    setProject({
      ...project,
      [name]: checked
    })
  }

  // Handle technology input changes
  const handleTechChange = (index: number, value: string) => {
    if (!project) return
    
    const updatedTechs = [...project.technologies]
    updatedTechs[index] = value
    setProject({
      ...project,
      technologies: updatedTechs
    })
  }

  // Add new technology field
  const addTechField = () => {
    if (!project) return
    
    setProject({
      ...project,
      technologies: [...project.technologies, '']
    })
  }

  // Remove technology field
  const removeTechField = (index: number) => {
    if (!project || project.technologies.length <= 1) return
    
    const updatedTechs = [...project.technologies]
    updatedTechs.splice(index, 1)
    setProject({
      ...project,
      technologies: updatedTechs
    })
  }

  // Handle feature input changes (for newly added projects)
  const handleFeatureChange = (index: number, value: string) => {
    if (!project || !project.features) return
    
    const updatedFeatures = [...project.features]
    updatedFeatures[index] = value
    setProject({
      ...project,
      features: updatedFeatures
    })
  }

  // Add new feature field (for newly added projects)
  const addFeatureField = () => {
    if (!project || !project.features) return
    
    setProject({
      ...project,
      features: [...project.features, '']
    })
  }

  // Remove feature field (for newly added projects)
  const removeFeatureField = (index: number) => {
    if (!project || !project.features || project.features.length <= 1) return
    
    const updatedFeatures = [...project.features]
    updatedFeatures.splice(index, 1)
    setProject({
      ...project,
      features: updatedFeatures
    })
  }

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !project) return;
    
    const file = e.target.files[0];
    setIsUploading(true);
    
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      // Get admin password from session storage or prompt
      let adminPassword = sessionStorage.getItem('adminPassword');
      if (!adminPassword) {
        adminPassword = prompt('Enter admin password to upload image:');
        if (adminPassword) {
          sessionStorage.setItem('adminPassword', adminPassword);
        } else {
          setIsUploading(false);
          return;
        }
      }
      
      // Make the request to upload the image
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'AdminAuth': adminPassword
        },
        body: formData
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to upload image');
      }
      
      const data = await response.json();
      
      // Update the project state with the new image path
      setProject(prev => prev ? { ...prev, image: data.imagePath } : null);
      
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle second image upload
  const handleSecondImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !project) return;
    
    const file = e.target.files[0];
    setIsUploading(true);
    
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      // Get admin password from session storage or prompt
      let adminPassword = sessionStorage.getItem('adminPassword');
      if (!adminPassword) {
        adminPassword = prompt('Enter admin password to upload image:');
        if (adminPassword) {
          sessionStorage.setItem('adminPassword', adminPassword);
        } else {
          setIsUploading(false);
          return;
        }
      }
      
      // Make the request to upload the image
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'AdminAuth': adminPassword
        },
        body: formData
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to upload second image');
      }
      
      const data = await response.json();
      
      // Update the project state with the new second image path
      setProject(prev => prev ? { ...prev, secondImage: data.imagePath } : null);
      
      toast.success('Second image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading second image:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload second image');
    } finally {
      setIsUploading(false);
    }
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!project) return
    
    setIsSubmitting(true)

    try {
      // Get admin password
      const password = sessionStorage.getItem('adminPassword') || prompt('Enter admin password to update project:')
      
      if (!password) {
        toast.error('Password required to update project')
        setIsSubmitting(false)
        return
      }

      // Store password for session
      sessionStorage.setItem('adminPassword', password)

      // Format project data before submission
      const projectToSubmit = {
        ...project,
        technologies: project.technologies.filter(t => t.trim() !== ''),
        // Ensure second image and showBothImagesInPriority flag are properly formatted
        secondImage: project.secondImage || '/projects/placeholder.jpg',
        showBothImagesInPriority: Boolean(project.showBothImagesInPriority),
        // Ensure the visualEffects and imagePriority are properly formatted
        visualEffects: project.visualEffects ? {
          ...project.visualEffects,
          morphTransition: Boolean(project.visualEffects.morphTransition),
          rippleEffect: Boolean(project.visualEffects.rippleEffect),
          floatingElements: Boolean(project.visualEffects.floatingElements),
          shimmering: Boolean(project.visualEffects.shimmering),
          animation: project.visualEffects.animation || 'none',
          shadows: project.visualEffects.shadows || 'none',
          border: project.visualEffects.border || 'default',
          glassmorphism: Boolean(project.visualEffects.glassmorphism),
          particles: Boolean(project.visualEffects.particles),
          animationTiming: project.visualEffects.animationTiming || 'normal',
          animationIntensity: project.visualEffects.animationIntensity || 'normal'
        } : {},
        // Ensure imagePriority is a number between 1-5
        imagePriority: typeof project.imagePriority === 'number'
          ? Math.min(Math.max(1, project.imagePriority), 5)
          : 5,
        // Add a timestamp to force detection of changes
        _updated: Date.now()
      }
      
      if (isNewlyAdded && project.exclusiveFeatures) {
        projectToSubmit.exclusiveFeatures = project.exclusiveFeatures.filter(f => f.trim() !== '')
      }

      // Generate a cache-busting timestamp
      const timestamp = Date.now();
      const response = await fetch(`/api/projects?t=${timestamp}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'X-Timestamp': timestamp.toString()
        },
        body: JSON.stringify({
          project: projectToSubmit,
          password
        }),
        cache: 'no-store'
      })

      if (response.ok) {
        toast.success('Project updated successfully')
        
        // Force cache revalidation for main pages
        try {
          await fetch(`/api/revalidate?path=/&secret=${password}`);
          await fetch(`/api/revalidate?path=/projects&secret=${password}`);
        } catch (error) {
          console.error('Error revalidating paths:', error);
        }
        
        // Add a small delay to ensure revalidation completes
        setTimeout(() => {
          router.push('/admin/projects')
        }, 500);
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update project')
      }
    } catch (error) {
      console.error('Error updating project:', error)
      toast.error('Error updating project')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle effect change
  const handleEffectChange = (effect: keyof NonNullable<Project['visualEffects']>, value: boolean | string) => {
    if (!project) return
    
    setProject((prev: Project | null) => {
      if (!prev) return null
      return {
        ...prev,
        visualEffects: {
          ...prev.visualEffects,
          [effect]: value
        }
      }
    })
  }

  // Apply preset
  const applyPreset = (preset: 'premium' | 'clean' | 'playful' | 'motion') => {
    if (!project) return
    
    const presetEffects = {
      premium: {
        glow: true,
        animation: 'fade',
        shadows: 'gradient',
        border: 'gradient',
        hover: 'scale',
        backdrop: 'frosted'
      },
      clean: {
        glow: false,
        animation: 'none',
        shadows: 'soft',
        border: 'solid',
        hover: 'lift',
        backdrop: 'none'
      },
      playful: {
        glow: true,
        animation: 'bounce',
        shadows: 'neon',
        border: 'animated',
        hover: 'shake',
        backdrop: 'pattern'
      },
      motion: {
        glow: false,
        animation: 'float',
        shadows: 'ambient',
        border: 'pulse',
        hover: 'ripple',
        backdrop: 'dim'
      }
    }
    
    setProject((prev: Project | null) => {
      if (!prev) return null
      return {
        ...prev,
        visualEffects: {
          ...prev.visualEffects,
          ...presetEffects[preset]
        }
      }
    })
  }

  if (isLoading) {
    return (
      <AdminAuthCheck>
        <div className="min-h-screen bg-[#0a0a0a] pt-32 flex flex-col items-center justify-center">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </AdminAuthCheck>
    )
  }

  if (!project) {
    return (
      <AdminAuthCheck>
        <div className="min-h-screen bg-[#0a0a0a] pt-32 p-6 flex flex-col items-center justify-center">
          <div className="text-white text-xl">Project not found</div>
          <Link 
            href="/admin/projects" 
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to Projects
          </Link>
        </div>
      </AdminAuthCheck>
    )
  }

  return (
    <AdminAuthCheck>
      <div className="min-h-screen bg-[#0a0a0a] pt-32 p-6">
        <Toaster position="top-right" />
        
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-400 to-blue-500 bg-clip-text text-transparent">
                Edit Project
              </h1>
              <p className="text-gray-400 mt-1">Update your project details</p>
            </div>
            
            <Link 
              href="/admin/projects" 
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Projects
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="bg-gray-900/50 rounded-xl p-6 border border-purple-500/20">
            <div className="space-y-6">
              {/* Project Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300">Title*</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={project.title}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md bg-black/50 border-gray-600 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500/20"
                />
                {isNewlyAdded && (
                  <p className="mt-1 text-xs text-gray-400">Prefix with "NEWLY ADDED: " for highlighting</p>
                )}
              </div>

              {/* Project Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description*</label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  required
                  value={project.description}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md bg-black/50 border-gray-600 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500/20"
                />
              </div>

              {/* Project Image */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Project Image*</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-2">
                    <div className="relative overflow-hidden rounded-lg border border-purple-500/30 bg-black/50 aspect-[4/3]">
                      {project.image && project.image !== '/projects/placeholder.jpg' ? (
                        <Image 
                          src={project.image} 
                          alt="Project preview" 
                          fill 
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          quality={100}
                          priority
                          unoptimized={project.image.startsWith('data:')}
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-gray-400">
                          <svg className="w-16 h-16 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">Recommended: Square image (1:1 ratio)</p>
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
                        <p className="text-xs text-gray-400">Or enter image URL:</p>
                        <input
                          type="text"
                          id="image"
                          name="image"
                          value={project?.image || ''}
                          onChange={handleChange}
                          className="px-3 py-2 rounded-md bg-black/50 border border-gray-600 text-white text-sm focus:border-purple-500 focus:ring focus:ring-purple-500/20"
                          placeholder="/projects/your-image.jpg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Second Project Image - Only for Newly Added Projects */}
              {isNewlyAdded && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Second Project Image (Optional)</label>
                  <p className="text-xs text-gray-500 mb-2">This image will only be visible in the expanded view when users click a button</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-2">
                      <div className="relative overflow-hidden rounded-lg border border-purple-500/30 bg-black/50 aspect-[4/3]">
                        {project.secondImage && project.secondImage !== '/projects/placeholder.jpg' ? (
                          <Image 
                            src={project.secondImage} 
                            alt="Second image preview" 
                            fill 
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            quality={100}
                            priority
                            unoptimized={project.secondImage.startsWith('data:')}
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full text-gray-400">
                            <svg className="w-16 h-16 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">Recommended: Square image (1:1 ratio)</p>
                    </div>
                    <div className="flex flex-col space-y-4">
                      <div className="flex-1 flex flex-col justify-center">
                        <input
                          type="file"
                          id="secondImageUpload"
                          accept="image/*"
                          onChange={handleSecondImageUpload}
                          className="hidden"
                        />
                        <div className="flex flex-col space-y-3">
                          <button
                            type="button"
                            onClick={() => document.getElementById('secondImageUpload')?.click()}
                            disabled={isUploading}
                            className="px-4 py-2 rounded-md bg-blue-600/40 border border-blue-600/40 text-white hover:bg-blue-600/60 transition-colors flex items-center justify-center gap-2"
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
                                Upload Second Image
                              </>
                            )}
                          </button>
                          <p className="text-xs text-gray-400">Or enter image URL:</p>
                          <input
                            type="text"
                            id="secondImage"
                            name="secondImage"
                            value={project?.secondImage || ''}
                            onChange={handleChange}
                            className="px-3 py-2 rounded-md bg-black/50 border border-gray-600 text-white text-sm focus:border-purple-500 focus:ring focus:ring-purple-500/20"
                            placeholder="/projects/your-second-image.jpg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Status, Days, and Progress (for Newly Added projects) */}
              {isNewlyAdded && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-300">Status*</label>
                      <select
                        id="status"
                        name="status"
                        required
                        value={project.status || 'In Development'}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md bg-black/50 border-gray-600 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500/20"
                      >
                        <option value="In Development">In Development</option>
                        <option value="Beta Testing">Beta Testing</option>
                        <option value="Recently Launched">Recently Launched</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="updatedDays" className="block text-sm font-medium text-gray-300">Updated Days Ago*</label>
                      <input
                        type="number"
                        id="updatedDays"
                        name="updatedDays"
                        min="1"
                        required
                        value={project.updatedDays || 1}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md bg-black/50 border-gray-600 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="progress" className="block text-sm font-medium text-gray-300">
                      Progress* ({project.progress || 0}%)
                    </label>
                    <input
                      type="range"
                      id="progress"
                      name="progress"
                      min="0"
                      max="100"
                      step="1"
                      required
                      value={project.progress || 0}
                      onChange={handleChange}
                      className="mt-1 block w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>
                </>
              )}

              {/* Project Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-300">Category*</label>
                <div className="relative mt-1">
                  <select
                    id="category"
                    name="category"
                    required
                    value={project.category}
                    onChange={handleChange}
                    className="block w-full rounded-md bg-black/50 border-gray-600 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500/20 appearance-none pr-10"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                {isNewlyAdded && (
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {['Web Development', 'AI/ML', 'Mobile App', 'E-Commerce'].map((quickCategory) => (
                      <button
                        key={quickCategory}
                        type="button"
                        onClick={() => setProject({
                          ...project,
                          category: quickCategory === 'E-Commerce' ? 'E-Commerce (Shopify/WooCommerce)' : 
                                  quickCategory === 'AI/ML' ? 'AI Agents Development' :
                                  quickCategory === 'Mobile App' ? 'Mobile App with AI Integration' :
                                  quickCategory === 'Web Development' ? 'Web Development with AI Integration' : quickCategory
                        })}
                        className="px-2 py-1 text-xs rounded-full border transition-colors"
                        style={{
                          backgroundColor: project.category.includes(quickCategory) ? 'rgba(147, 51, 234, 0.3)' : 'rgba(45, 45, 60, 0.3)',
                          borderColor: project.category.includes(quickCategory) ? 'rgba(147, 51, 234, 0.5)' : 'rgba(75, 75, 90, 0.3)',
                          color: project.category.includes(quickCategory) ? 'rgb(167, 139, 250)' : 'rgb(156, 163, 175)'
                        }}
                      >
                        {quickCategory}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Project Technologies */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Technologies*</label>
                <div className="space-y-2">
                  {project.technologies.map((tech, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={tech}
                        onChange={(e) => handleTechChange(index, e.target.value)}
                        placeholder={`Technology ${index + 1}`}
                        className="flex-1 rounded-md bg-black/50 border-gray-600 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500/20"
                      />
                      <button
                        type="button"
                        onClick={() => removeTechField(index)}
                        disabled={project.technologies.length <= 1}
                        className="px-3 py-1 bg-red-900/30 text-red-400 rounded hover:bg-red-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addTechField}
                  className="mt-2 px-3 py-1 bg-purple-500/20 text-purple-400 rounded hover:bg-purple-500/30"
                >
                  Add Technology
                </button>
              </div>

              {/* Project Features (for Newly Added projects) */}
              {isNewlyAdded && project.features && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Features*</label>
                  <div className="space-y-2">
                    {project.features.map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => handleFeatureChange(index, e.target.value)}
                          placeholder={`Feature ${index + 1}`}
                          className="flex-1 rounded-md bg-black/50 border-gray-600 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500/20"
                        />
                        <button
                          type="button"
                          onClick={() => removeFeatureField(index)}
                          disabled={project.features && project.features.length <= 1}
                          className="px-3 py-1 bg-red-900/30 text-red-400 rounded hover:bg-red-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addFeatureField}
                    className="mt-2 px-3 py-1 bg-purple-500/20 text-purple-400 rounded hover:bg-purple-500/30"
                  >
                    Add Feature
                  </button>
                </div>
              )}

              {/* Project Link */}
              <div>
                <label htmlFor="link" className="block text-sm font-medium text-gray-300">Project Link*</label>
                <input
                  type="url"
                  id="link"
                  name="link"
                  required
                  value={project.link}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md bg-black/50 border-gray-600 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500/20"
                />
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={project.featured}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 bg-gray-700 border-gray-600 rounded"
                />
                <label htmlFor="featured" className="ml-2 text-sm text-gray-300">
                  Mark as Featured Project
                </label>
              </div>

              {/* Image Priority Settings */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Image Priority Position</label>
                <div className="grid grid-cols-1 gap-3 bg-black/30 p-3 rounded-lg border border-gray-700">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Priority Level: {project.imagePriority || 5}</span>
                      <div className="flex space-x-3 items-center">
                        {[1, 2, 3, 4, 5].map((priority) => (
                          <button
                            key={priority}
                            type="button"
                            onClick={() => setProject({
                              ...project,
                              imagePriority: priority
                            })}
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              project.imagePriority === priority
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            } transition-colors`}
                          >
                            {priority}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full ${
                          project.imagePriority === 1 ? 'bg-green-500' :
                          project.imagePriority === 2 ? 'bg-blue-500' :
                          project.imagePriority === 3 ? 'bg-purple-500' :
                          project.imagePriority === 4 ? 'bg-yellow-500' : 'bg-gray-500'
                        }`}></div>
                        <span className="text-sm text-gray-300">
                          {project.imagePriority === 1 && 'Top Featured (Full Banner)'}
                          {project.imagePriority === 2 && 'Second Position (Priority Grid)'}
                          {project.imagePriority === 3 && 'Third Position (Priority Grid)'}
                          {project.imagePriority === 4 && 'Standard Visibility'}
                          {project.imagePriority === 5 && 'Lower Visibility'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Show both images in top priority - Only for newly added projects */}
                    {isNewlyAdded && (
                      <div className="flex items-center mt-3 border-t border-gray-700 pt-3">
                        <input
                          type="checkbox"
                          id="showBothImagesInPriority"
                          checked={project.showBothImagesInPriority || false}
                          onChange={(e) => setProject({
                            ...project,
                            showBothImagesInPriority: e.target.checked
                          })}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 bg-gray-700 border-gray-600 rounded"
                        />
                        <label htmlFor="showBothImagesInPriority" className="ml-2 text-sm text-gray-300 flex items-center">
                          <span>Show both images in top priority</span>
                          <span className="ml-2 px-2 py-0.5 bg-purple-600/30 text-purple-300 text-xs rounded-full border border-purple-500/30">New</span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Higher priority images are displayed more prominently. Priority 1 gets a full banner display.
                  {project.showBothImagesInPriority && isNewlyAdded && 
                   " When 'Show both images' is enabled, both images will be displayed in the priority section."}
                </p>
              </div>

              {/* Visual Effects Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white mb-4">Visual Effects</h3>
                
                {/* Quick presets */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-300">Quick presets:</label>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-800 text-white text-sm hover:from-purple-700 hover:to-purple-900 transition-all duration-300"
                      onClick={() => applyPreset('premium')}
                    >
                      Premium Look
                    </button>
                    <button 
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 text-white text-sm hover:from-blue-700 hover:to-blue-900 transition-all duration-300"
                      onClick={() => applyPreset('clean')}
                    >
                      Clean & Simple
                    </button>
                    <button 
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-green-800 text-white text-sm hover:from-green-700 hover:to-green-900 transition-all duration-300"
                      onClick={() => applyPreset('playful')}
                    >
                      Playful
                    </button>
                    <button 
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-600 to-yellow-800 text-white text-sm hover:from-yellow-700 hover:to-yellow-900 transition-all duration-300"
                      onClick={() => applyPreset('motion')}
                    >
                      Subtle Motion
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Effects */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-purple-300">Basic Effects</h4>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                          checked={project.visualEffects?.morphTransition || false}
                          onChange={(e) => handleEffectChange('morphTransition', e.target.checked)}
                          className="form-checkbox h-5 w-5 text-purple-500 rounded border-gray-600 bg-gray-700 focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-300">Morph Transition</span>
                    </label>
                  
                      <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                          checked={project.visualEffects?.rippleEffect || false}
                          onChange={(e) => handleEffectChange('rippleEffect', e.target.checked)}
                          className="form-checkbox h-5 w-5 text-purple-500 rounded border-gray-600 bg-gray-700 focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-300">Ripple Effect</span>
                      </label>

                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={project.visualEffects?.floatingElements || false}
                          onChange={(e) => handleEffectChange('floatingElements', e.target.checked)}
                          className="form-checkbox h-5 w-5 text-purple-500 rounded border-gray-600 bg-gray-700 focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-300">Floating Elements</span>
                      </label>

                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={project.visualEffects?.shimmering || false}
                          onChange={(e) => handleEffectChange('shimmering', e.target.checked)}
                          className="form-checkbox h-5 w-5 text-purple-500 rounded border-gray-600 bg-gray-700 focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-300">Shimmering Effect</span>
                      </label>

                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={project.visualEffects?.spotlight || false}
                          onChange={(e) => handleEffectChange('spotlight', e.target.checked)}
                          className="form-checkbox h-5 w-5 text-purple-500 rounded border-gray-600 bg-gray-700 focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-300">Spotlight Effect</span>
                      </label>

                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={project.visualEffects?.glassmorphism || false}
                          onChange={(e) => handleEffectChange('glassmorphism', e.target.checked)}
                          className="form-checkbox h-5 w-5 text-purple-500 rounded border-gray-600 bg-gray-700 focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-300">Glassmorphism Effect</span>
                      </label>

                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={project.visualEffects?.particles || false}
                          onChange={(e) => handleEffectChange('particles', e.target.checked)}
                          className="form-checkbox h-5 w-5 text-purple-500 rounded border-gray-600 bg-gray-700 focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-300">Particle Effects</span>
                    </label>
                    </div>
                  </div>

                  {/* Advanced Effects */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-purple-300">Advanced Effects</h4>
                  
                  {/* Animation Type */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">Animation Type</label>
                    <select
                      value={project.visualEffects?.animation || 'none'}
                      onChange={(e) => handleEffectChange('animation', e.target.value)}
                      className="w-full rounded-lg bg-gray-800 border-gray-700 text-gray-300 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="none">No Animation</option>
                      <option value="fade">Fade In/Out</option>
                      <option value="slide-right">Slide Right</option>
                      <option value="bounce">Bounce Effect</option>
                      <option value="pulse">Pulse Effect</option>
                      <option value="float">Floating Effect</option>
                      <option value="reveal">Reveal Animation</option>
                      <option value="glitch">Glitch Effect</option>
                      <option value="swing">Swing Animation</option>
                      <option value="spiral">Spiral In</option>
                      <option value="elastic">Elastic Bounce</option>
                      <option value="jello">Jello Effect</option>
                      <option value="vibrate">Vibration</option>
                      <option value="pop">Pop Animation</option>
                      <option value="shimmer">Shimmer Effect</option>
                      <option value="morph">Morph Animation</option>
                      <option value="wave">Wave Effect</option>
                      <option value="float-smooth">Smooth Float</option>
                    </select>
                  </div>

                    {/* Shadow Style */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">Shadow Style</label>
                      <select
                        value={project.visualEffects?.shadows || 'none'}
                        onChange={(e) => handleEffectChange('shadows', e.target.value)}
                        className="w-full rounded-lg bg-gray-800 border-gray-700 text-gray-300 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="none">No Shadow</option>
                        <option value="soft">Soft Shadow</option>
                        <option value="hard">Hard Shadow</option>
                        <option value="neon">Neon Shadow</option>
                        <option value="gradient">Gradient Shadow</option>
                        <option value="3d">3D Shadow</option>
                        <option value="layered">Layered Shadow</option>
                        <option value="ambient">Ambient Glow</option>
                        <option value="highlight">Highlight Shadow</option>
                      </select>
                    </div>

                    {/* Border Style */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">Border Style</label>
                      <select
                        value={project.visualEffects?.border || 'none'}
                        onChange={(e) => handleEffectChange('border', e.target.value)}
                        className="w-full rounded-lg bg-gray-800 border-gray-700 text-gray-300 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="none">No Border</option>
                        <option value="solid">Solid Border</option>
                        <option value="dashed">Dashed Border</option>
                        <option value="gradient">Gradient Background</option>
                        <option value="glow">Glow Border</option>
                        <option value="animated">Animated Border</option>
                        <option value="glowing">Glowing Border</option>
                        <option value="pulsating">Pulsating Border</option>
                        <option value="double">Double Border</option>
                        <option value="gradient-border">True Gradient Border</option>
                      </select>
                    </div>

                    {/* Animation Timing */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">Animation Timing</label>
                      <select
                        value={project.visualEffects?.animationTiming || 'normal'}
                        onChange={(e) => handleEffectChange('animationTiming', e.target.value)}
                        className="w-full rounded-lg bg-gray-800 border-gray-700 text-gray-300 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="normal">Normal Speed</option>
                        <option value="fast">Fast Animation</option>
                        <option value="slow">Slow Animation</option>
                        <option value="very-slow">Very Slow Animation</option>
                      </select>
                    </div>

                    {/* Animation Intensity */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">Animation Intensity</label>
                      <select
                        value={project.visualEffects?.animationIntensity || 'normal'}
                        onChange={(e) => handleEffectChange('animationIntensity', e.target.value)}
                        className="w-full rounded-lg bg-gray-800 border-gray-700 text-gray-300 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="normal">Normal Intensity</option>
                        <option value="subtle">Subtle Effects</option>
                        <option value="medium">Medium Effects</option>
                        <option value="strong">Strong Effects</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Preview Section */}
                <div className="mt-8">
                  <h4 className="text-lg font-medium text-purple-300 mb-4">Live Preview</h4>
                  <div 
                    className={`relative w-full max-w-md mx-auto h-48 rounded-xl overflow-hidden transition-all duration-500 group
                      ${project.visualEffects?.morphTransition ? 'morph-transition' : ''}
                      ${project.visualEffects?.rippleEffect ? 'ripple-effect' : ''}
                      ${project.visualEffects?.floatingElements ? 'floating-elements' : ''}
                      ${project.visualEffects?.shimmering ? 'shimmering-effect' : ''}
                      ${project.visualEffects?.spotlight ? 'spotlight-effect' : ''}
                      ${project.visualEffects?.glassmorphism ? 'glassmorphism-effect' : ''}
                      ${project.visualEffects?.particles ? 'particle-effects' : ''}
                      ${project.visualEffects?.animation === 'fade' ? 'animate-fade' : ''}
                      ${project.visualEffects?.animation === 'slide-right' ? 'animate-slide-right' : ''}
                      ${project.visualEffects?.animation === 'bounce' ? 'animate-bounce' : ''}
                      ${project.visualEffects?.animation === 'pulse' ? 'animate-pulse' : ''}
                      ${project.visualEffects?.animation === 'float' ? 'animate-float' : ''}
                      ${project.visualEffects?.animation === 'reveal' ? 'animate-reveal' : ''}
                      ${project.visualEffects?.animation === 'glitch' ? 'animate-glitch' : ''}
                      ${project.visualEffects?.animation === 'swing' ? 'animate-swing' : ''}
                      ${project.visualEffects?.animation === 'spiral' ? 'animate-spiral' : ''}
                      ${project.visualEffects?.animation === 'elastic' ? 'animate-elastic' : ''}
                      ${project.visualEffects?.animation === 'jello' ? 'animate-jello' : ''}
                      ${project.visualEffects?.animation === 'vibrate' ? 'animate-vibrate' : ''}
                      ${project.visualEffects?.animation === 'pop' ? 'animate-pop' : ''}
                      ${project.visualEffects?.animation === 'shimmer' ? 'animate-shimmer' : ''}
                      ${project.visualEffects?.animation === 'morph' ? 
                         project.visualEffects?.animationIntensity === 'subtle' ? 'animate-morph-subtle' : 
                         project.visualEffects?.animationIntensity === 'medium' ? 'animate-morph-medium' : 
                         project.visualEffects?.animationIntensity === 'strong' ? 'animate-morph-strong' : 
                         'animate-morph' : ''}
                      ${project.visualEffects?.animation === 'wave' ? 'animate-wave' : ''}
                      ${project.visualEffects?.animation === 'float-smooth' ? 'animate-float-smooth' : ''}
                      ${project.visualEffects?.shadows === 'soft' ? 'shadow-lg' : ''}
                      ${project.visualEffects?.shadows === 'hard' ? 'shadow-xl' : ''}
                      ${project.visualEffects?.shadows === 'neon' ? 'shadow-[0_0_20px_rgba(147,51,234,0.5)]' : ''}
                      ${project.visualEffects?.shadows === 'gradient' ? 'shadow-[0_0_30px_rgba(147,51,234,0.4),0_0_50px_rgba(59,130,246,0.3)]' : ''}
                      ${project.visualEffects?.shadows === 'layered' ? 'shadow-[0_10px_20px_rgba(0,0,0,0.2),0_20px_40px_rgba(147,51,234,0.3)]' : ''}
                      ${project.visualEffects?.shadows === 'ambient' ? 'shadow-[0_0_50px_rgba(147,51,234,0.2)]' : ''}
                      ${project.visualEffects?.shadows === 'highlight' ? 'shadow-highlight' : ''}
                      ${project.visualEffects?.border === 'solid' ? 'border-2 border-purple-500' : ''}
                      ${project.visualEffects?.border === 'dashed' ? 'border-2 border-dashed border-purple-500' : ''}
                      ${project.visualEffects?.border === 'gradient' ? 'gradient-border' : ''}
                      ${project.visualEffects?.border === 'glow' ? 'border-2 border-purple-500 shadow-[0_0_10px_rgba(147,51,234,0.5)]' : ''}
                      ${project.visualEffects?.border === 'animated' ? 'animated-border' : ''}
                      ${project.visualEffects?.border === 'glowing' ? 'glowing-border' : ''}
                      ${project.visualEffects?.border === 'pulsating' ? 'pulsating-border' : ''}
                      ${project.visualEffects?.border === 'double' ? 'border-4 border-double border-purple-500' : ''}
                      ${project.visualEffects?.border === 'gradient-border' ? 'gradient-border' : ''}
                      ${project.visualEffects?.animationTiming === 'fast' ? 'animation-duration-500' :
                        project.visualEffects?.animationTiming === 'slow' ? 'animation-duration-3000' :
                        project.visualEffects?.animationTiming === 'very-slow' ? 'animation-duration-5000' : ''}`}
                    style={{
                      willChange: 'transform, opacity, border-radius',
                      transformStyle: 'preserve-3d',
                      perspective: '1000px'
                    }}
                  >
                    {/* Background Effects */}
                    <div className={`absolute inset-0 transition-all duration-500
                      ${project.visualEffects?.shimmering ? 'shimmering-background' : ''}
                      ${project.visualEffects?.rippleEffect ? 'ripple-background' : ''}
                      ${project.visualEffects?.morphTransition ? 'morph-background' : ''}
                      ${project.visualEffects?.floatingElements ? 'floating-elements-background' : ''}
                      ${project.visualEffects?.glassmorphism ? 'glassmorphism-background' : ''}
                      ${project.visualEffects?.particles ? 'particle-background' : ''}
                      ${project.visualEffects?.animation === 'fade' ? 'fade-background' : ''}
                      ${project.visualEffects?.animation === 'slide-right' ? 'slide-right-background' : ''}
                      ${project.visualEffects?.animation === 'bounce' ? 'bounce-background' : ''}
                      ${project.visualEffects?.animation === 'pulse' ? 'pulse-background' : ''}
                      ${project.visualEffects?.animation === 'float' ? 'float-background' : ''}
                      ${project.visualEffects?.animation === 'reveal' ? 'reveal-background' : ''}
                      ${project.visualEffects?.animation === 'glitch' ? 'glitch-background' : ''}
                      ${project.visualEffects?.animation === 'swing' ? 'swing-background' : ''}
                      ${project.visualEffects?.animation === 'spiral' ? 'spiral-background' : ''}
                      ${project.visualEffects?.animation === 'elastic' ? 'elastic-background' : ''}
                      ${project.visualEffects?.animation === 'jello' ? 'jello-background' : ''}
                      ${project.visualEffects?.animation === 'vibrate' ? 'vibrate-background' : ''}
                      ${project.visualEffects?.animation === 'pop' ? 'pop-background' : ''}
                      ${project.visualEffects?.animation === 'shimmer' ? 'shimmer-background' : ''}
                      ${project.visualEffects?.animation === 'morph' ? 'morph-background' : ''}
                      ${project.visualEffects?.animation === 'wave' ? 'wave-background' : ''}
                      ${project.visualEffects?.animation === 'float-smooth' ? 'float-smooth-background' : ''}
                      ${!project.visualEffects?.animation || project.visualEffects.animation === 'none' ? 'bg-gradient-to-br from-purple-900/20 to-blue-900/20' : ''}`}
                      style={{ willChange: 'opacity, background-color' }}
                    />

                    {/* Spotlight Effect */}
                    {project.visualEffects?.spotlight && (
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute w-32 h-32 bg-gradient-to-r from-purple-500/30 to-transparent rounded-full blur-2xl animate-spotlight"></div>
                        <div className="absolute right-0 bottom-0 w-32 h-32 bg-gradient-to-l from-blue-500/30 to-transparent rounded-full blur-2xl animate-spotlight-alt"></div>
                      </div>
                    )}

                    {/* Glassmorphism Effect */}
                    {project.visualEffects?.glassmorphism && (
                      <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] border border-white/20"></div>
                    )}

                    {/* Particle Effects */}
                    {project.visualEffects?.particles && (
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="particle particle-1"></div>
                        <div className="particle particle-2"></div>
                        <div className="particle particle-3"></div>
                        <div className="particle particle-4"></div>
                      </div>
                    )}

                    {/* Project Content */}
                    <div className="relative z-10 h-full p-6 flex flex-col">
                      {project.status && (
                        <div className="flex items-center mb-2">
                          <span className={`px-3 py-1 text-xs rounded-full 
                            ${project.status === 'In Development' ? 'bg-purple-500/20 text-purple-300' :
                              project.status === 'Beta Testing' ? 'bg-blue-500/20 text-blue-300' :
                              'bg-green-500/20 text-green-300'}`}>
                            {project.status}
                          </span>
                          {project.updatedDays && (
                            <span className="ml-2 text-xs text-gray-400">
                              {project.updatedDays} {project.updatedDays === 1 ? 'day' : 'days'} ago
                            </span>
                          )}
                        </div>
                      )}

                      <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                      <p className="text-gray-300 text-sm mb-4">{project.description}</p>

                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-auto">
                          {project.technologies.map((tech, index) => (
                            <span key={index} className="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Exclusive Features */}
              <div>
                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-300">Exclusive Features</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (!project.exclusiveFeatures) {
                        setProject({
                          ...project,
                          exclusiveFeatures: ['']
                        });
                      } else {
                        setProject({
                          ...project,
                          exclusiveFeatures: [...project.exclusiveFeatures, '']
                        });
                      }
                    }}
                    className="text-xs text-purple-400 hover:text-purple-300 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Exclusive Feature
                  </button>
                </label>
                
                <div className="mt-2 space-y-2">
                  {project.exclusiveFeatures && project.exclusiveFeatures.length > 0 ? (
                    project.exclusiveFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => {
                            if (!project.exclusiveFeatures) return;
                            const updated = [...project.exclusiveFeatures];
                            updated[index] = e.target.value;
                            setProject({
                              ...project,
                              exclusiveFeatures: updated
                            });
                          }}
                          className="flex-1 rounded-md bg-black/50 border-gray-600 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500/20"
                          placeholder="Enter exclusive feature"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!project.exclusiveFeatures) return;
                            const updated = [...project.exclusiveFeatures];
                            updated.splice(index, 1);
                            setProject({
                              ...project,
                              exclusiveFeatures: updated
                            });
                          }}
                          className="text-gray-400 hover:text-red-400"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-3 bg-black/20 rounded-lg border border-dashed border-gray-700">
                      <p className="text-gray-500 text-sm">No exclusive features added</p>
                      <button
                        type="button"
                        onClick={() => setProject({
                          ...project,
                          exclusiveFeatures: ['']
                        })}
                        className="mt-1 text-xs text-purple-400 hover:text-purple-300"
                      >
                        Add one now
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Feature Templates */}
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-2">Quick add common exclusive features:</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const features = [...(project.exclusiveFeatures || [])];
                        if (!features.includes('Early access to premium content')) {
                          features.push('Early access to premium content');
                        }
                        setProject({
                          ...project,
                          exclusiveFeatures: features
                        });
                      }}
                      className="px-2 py-1 bg-purple-900/30 text-purple-400 text-xs rounded-full border border-purple-500/20 hover:bg-purple-900/50 transition-colors"
                    >
                      Early Access
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        const features = [...(project.exclusiveFeatures || [])];
                        if (!features.includes('Behind-the-scenes development insights')) {
                          features.push('Behind-the-scenes development insights');
                        }
                        setProject({
                          ...project,
                          exclusiveFeatures: features
                        });
                      }}
                      className="px-2 py-1 bg-blue-900/30 text-blue-400 text-xs rounded-full border border-blue-500/20 hover:bg-blue-900/50 transition-colors"
                    >
                      Dev Insights
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        const features = [...(project.exclusiveFeatures || [])];
                        if (!features.includes('Experimental features not available in public release')) {
                          features.push('Experimental features not available in public release');
                        }
                        setProject({
                          ...project,
                          exclusiveFeatures: features
                        });
                      }}
                      className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded-full border border-green-500/20 hover:bg-green-900/50 transition-colors"
                    >
                      Experimental Features
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        const features = [...(project.exclusiveFeatures || [])];
                        if (!features.includes('Special promotions for early adopters')) {
                          features.push('Special promotions for early adopters');
                        }
                        setProject({
                          ...project,
                          exclusiveFeatures: features
                        });
                      }}
                      className="px-2 py-1 bg-yellow-900/30 text-yellow-400 text-xs rounded-full border border-yellow-500/20 hover:bg-yellow-900/50 transition-colors"
                    >
                      Special Promotions
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        const features = [...(project.exclusiveFeatures || [])];
                        if (!features.includes('Limited edition design elements')) {
                          features.push('Limited edition design elements');
                        }
                        setProject({
                          ...project,
                          exclusiveFeatures: features
                        });
                      }}
                      className="px-2 py-1 bg-red-900/30 text-red-400 text-xs rounded-full border border-red-500/20 hover:bg-red-900/50 transition-colors"
                    >
                      Limited Edition
                    </button>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500 mt-3">
                  Add special features only available in this project. These will be highlighted with a special badge.
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating Project...
                    </>
                  ) : (
                    'Update Project'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        /* Neon Ring Effect */
        .neon-ring-effect {
          position: relative;
        }
        .neon-ring-effect::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: inherit;
          background: linear-gradient(45deg, #ff00ff, #00ffff);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .neon-ring-effect:hover::before {
          opacity: 1;
        }

        /* Magnetic Hover Effect */
        .magnetic-hover {
          transform: translate(var(--mx, 0), var(--my, 0));
          transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        /* Tilt Effect */
        .tilt-effect {
          transform-style: preserve-3d;
          perspective: 1000px;
        }
        .tilt-effect:hover {
          transform: perspective(1000px) rotateX(var(--rotateX, 0)) rotateY(var(--rotateY, 0));
        }

        /* Color Shift Effect */
        .color-shift-effect:hover {
          animation: color-shift 3s linear infinite;
        }

        /* Ripple Effect */
        .ripple-effect {
          position: relative;
          overflow: hidden;
        }
        .ripple-effect::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at var(--x, 50%) var(--y, 50%), rgba(255,255,255,0.3) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.5s;
        }
        .ripple-effect:hover::after {
          opacity: 1;
        }

        /* Shine Effect */
        .shine-effect {
          position: relative;
        }
        .shine-effect::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            to right,
            transparent 0%,
            rgba(255,255,255,0.3) 50%,
            transparent 100%
          );
          transform: skewX(-25deg);
          transition: left 0.5s;
        }
        .shine-effect:hover::before {
          left: 150%;
        }

        /* Rainbow Shadow */
        .rainbow-shadow {
          animation: rainbow-shadow 3s linear infinite;
        }
        @keyframes rainbow-shadow {
          0% { box-shadow: 0 0 20px rgba(255,0,0,0.5); }
          33% { box-shadow: 0 0 20px rgba(0,255,0,0.5); }
          66% { box-shadow: 0 0 20px rgba(0,0,255,0.5); }
          100% { box-shadow: 0 0 20px rgba(255,0,0,0.5); }
        }

        /* Gradient Border */
        .gradient-border {
          position: relative;
          border: double 2px transparent;
          background-image: linear-gradient(black, black), 
                           linear-gradient(45deg, #ff00ff, #00ffff);
          background-origin: border-box;
          background-clip: content-box, border-box;
        }

        /* Animated Border */
        .animated-border {
          position: relative;
        }
        .animated-border::before {
          content: '';
          position: absolute;
          inset: 0;
          border: 2px solid transparent;
          border-radius: inherit;
          background: linear-gradient(90deg, #ff00ff, #00ffff, #ff00ff) border-box;
          -webkit-mask: linear-gradient(#fff 0 0) padding-box, 
                       linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) padding-box, 
                linear-gradient(#fff 0 0);
          -webkit-mask-composite: destination-out;
          mask-composite: exclude;
          animation: border-rotate 3s linear infinite;
        }
        @keyframes border-rotate {
          to { transform: rotate(360deg); }
        }

        /* Neon Border */
        .neon-border {
          border: 2px solid #ff00ff;
          box-shadow: 0 0 10px #ff00ff,
                      inset 0 0 10px #ff00ff;
        }

        /* Rainbow Border */
        .rainbow-border {
          position: relative;
        }
        .rainbow-border::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: inherit;
          background: linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet);
          animation: rainbow-rotate 3s linear infinite;
        }
        @keyframes rainbow-rotate {
          to { filter: hue-rotate(360deg); }
        }

        /* Pulse Border */
        .pulse-border {
          position: relative;
        }
        .pulse-border::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: inherit;
          background: linear-gradient(45deg, #ff00ff, #00ffff);
          animation: pulse-border 2s ease-in-out infinite;
        }
        @keyframes pulse-border {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Particle Effects */
        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: white;
          border-radius: 50%;
          animation: particle-float 3s ease-in-out infinite;
        }
        .particle-1 { top: 20%; left: 20%; animation-delay: 0s; }
        .particle-2 { top: 60%; left: 80%; animation-delay: 0.5s; }
        .particle-3 { top: 80%; left: 40%; animation-delay: 1s; }
        .particle-4 { top: 40%; left: 60%; animation-delay: 1.5s; }
        @keyframes particle-float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(10px, -10px); }
        }

        /* Professional Minimalistic Animations */
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes scale {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        @keyframes blur-in {
          from { filter: blur(5px); opacity: 0; }
          to { filter: blur(0); opacity: 1; }
        }

        @keyframes gentle-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        @keyframes soft-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @keyframes reveal {
          from { clip-path: inset(0 100% 0 0); }
          to { clip-path: inset(0 0 0 0); }
        }

        @keyframes subtle-glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-1px, 1px); }
          40% { transform: translate(-1px, -1px); }
          60% { transform: translate(1px, 1px); }
          80% { transform: translate(1px, -1px); }
          100% { transform: translate(0); }
        }

        @keyframes gentle-swing {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(2deg); }
          75% { transform: rotate(-2deg); }
        }

        @keyframes subtle-vibrate {
          0%, 100% { transform: translate(0); }
          25% { transform: translate(-0.5px); }
          75% { transform: translate(0.5px); }
        }

        /* Animation Classes */
        .animate-fade {
          animation: fade-in 0.5s ease-out forwards;
        }

        .animate-slide-right {
          animation: slide-up 0.6s ease-out forwards;
        }

        .animate-bounce {
          animation: gentle-bounce 2s ease-in-out infinite;
        }

        .animate-pulse {
          animation: soft-pulse 2.5s ease-in-out infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-reveal {
          animation: reveal 0.8s ease-out forwards;
        }

        .animate-glitch {
          animation: subtle-glitch 0.3s ease-in-out;
        }

        .animate-swing {
          animation: gentle-swing 2s ease-in-out infinite;
        }

        .animate-spiral {
          animation: spiral-animation 3s linear infinite;
        }

        @keyframes spiral-animation {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </AdminAuthCheck>
  )
} 