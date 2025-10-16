'use client'

import React, { use } from 'react';
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import AdminAuthCheck from '@/frontend/components/AdminAuthCheck'
import { toast, Toaster } from 'react-hot-toast'
import RefreshButton from './RefreshButton'

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
  imageUrl?: string
  secondImage?: string
  showBothImagesInPriority?: boolean
  isCodeScreenshot?: boolean
  codeLanguage?: string
  codeTitle?: string
  category: string
  technologies: string[]
  link: string
  projectLink?: string
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
  githubLink?: string
  githubClientLink?: string
  githubServerLink?: string
  isNewlyAdded?: number
  useDirectCodeInput?: boolean
  codeContent?: string
}

export default function EditProjectPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [password, setPassword] = useState('alihasnaat919')
  const [passwordError, setPasswordError] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const secondFileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSecondImageUploading, setIsSecondImageUploading] = useState(false)
  const [isNewlyAdded, setIsNewlyAdded] = useState(false)

  // Get the project ID from the URL params
  const projectId = params.id

  // Set the password automatically when component loads
  useEffect(() => {
    // Set the password for this component
    setPassword('alihasnaat919')
    
    // Also store it in session storage for other operations
    sessionStorage.setItem('adminPassword', 'nex-devs919')
  }, [])

  // Fetch project data on component mount
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        // Generate cache-busting parameters
        const timestamp = Date.now();
        const randomValue = Math.floor(Math.random() * 1000000);
        
        const response = await fetch(`/api/projects/${projectId}?t=${timestamp}&r=${randomValue}`, {
          method: 'GET',
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'X-Force-Refresh': 'true'
          }
        });

        if (!response.ok) {
          throw new Error(`Error fetching project: ${response.status}`);
        }

        const projectData = await response.json();
        
        // Check if it's a newly added project by title or status
        const isNewlyAdded = 
          projectData.title.startsWith('NEWLY ADDED:') || 
          (projectData.status && ['In Development', 'Beta Testing', 'Recently Launched'].includes(projectData.status));
        
        setProject(projectData);
        setIsNewlyAdded(isNewlyAdded);
      } catch (error) {
        console.error('Error fetching project:', error);
        toast.error('Error fetching project');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchProjectData()
  }, [projectId, router])

  // Handle text input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!project) return
    
    const { name, value } = e.target
    
    if (name === 'password') {
      setPassword(value)
      setPasswordError(false)
      return
    }
    
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
    if (!e.target.files || e.target.files.length === 0 || !project) {
      // Use placeholder if no file is selected
      const imagePath = '/projects/placeholder.jpg';
      setProject(prev => prev ? { ...prev, image: imagePath } : null);
      toast.success('Using placeholder image');
      return;
    }
    
    const file = e.target.files[0];
    setIsUploading(true);
    
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      // Get admin password from session storage
      const adminPassword = sessionStorage.getItem('adminPassword') || 'nex-devs.org889123';
      
      // Store password for session if not already set
      if (!sessionStorage.getItem('adminPassword')) {
        sessionStorage.setItem('adminPassword', adminPassword);
      }
      
      formData.append('password', adminPassword);
      
      // Include timestamp for cache busting
      const timestamp = Date.now();
      
      // Make the request to upload the image
      const response = await fetch(`/api/upload?t=${timestamp}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'X-Timestamp': timestamp.toString()
        },
        cache: 'no-store'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `HTTP error ${response.status}` }));
        throw new Error(errorData.error || 'Failed to upload image');
      }
      
      const data = await response.json();
      
      // Update the project state with the new image path
      setProject(prev => prev ? { ...prev, image: data.imagePath } : null);
      
      toast.success(data.isPlaceholder ? 'Using placeholder image' : 'Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload image');
      
      // Use placeholder image in case of error
      const placeholderImage = '/projects/placeholder.jpg';
      setProject(prev => prev ? { ...prev, image: placeholderImage } : null);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle second image upload
  const handleSecondImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !project) {
      // Use placeholder if no file is selected
      const imagePath = '/projects/placeholder.jpg';
      setProject(prev => prev ? { ...prev, secondImage: imagePath } : null);
      toast.success('Using placeholder image for second image');
      return;
    }
    
    const file = e.target.files[0];
    setIsSecondImageUploading(true);
    
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      // Get admin password from session storage
      const adminPassword = sessionStorage.getItem('adminPassword') || 'nex-devs.org889123';
      
      // Store password for session if not already set
      if (!sessionStorage.getItem('adminPassword')) {
        sessionStorage.setItem('adminPassword', adminPassword);
      }
      
      formData.append('password', adminPassword);
      
      // Include timestamp for cache busting
      const timestamp = Date.now();
      
      // Make the request to upload the image
      const response = await fetch(`/api/upload?t=${timestamp}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'X-Timestamp': timestamp.toString()
        },
        cache: 'no-store'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `HTTP error ${response.status}` }));
        throw new Error(errorData.error || 'Failed to upload second image');
      }
      
      const data = await response.json();
      
      // Update the project state with the new second image path
      setProject(prev => prev ? { ...prev, secondImage: data.imagePath } : null);
      
      toast.success(data.isPlaceholder ? 'Using placeholder image' : 'Second image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading second image:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload second image');
      
      // Use placeholder image in case of error
      const placeholderImage = '/projects/placeholder.jpg';
      setProject(prev => prev ? { ...prev, secondImage: placeholderImage } : null);
    } finally {
      setIsSecondImageUploading(false);
    }
  };

  // Handle submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Submit button clicked');
    
    // Check if project is null
    if (!project) {
      toast.error('No project data available');
      return;
    }
    
    // Get the database password from session storage
    const dbPassword = sessionStorage.getItem('databasePassword') || 'alihasnaat919';
    
    // Check if project is marked as completed but progress is not 100
    if (project.status === 'Completed' && project.progress && project.progress < 100) {
      setProject(prev => prev ? { ...prev, progress: 100 } : null);
    }
    
    // Validate input
    if (!project.title || !project.description) {
      toast.error('Please fill out all required fields');
      return;
    }
    
    // Always use the correct admin password from env or fallback
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'nex-devs919';
    sessionStorage.setItem('adminPassword', adminPassword);
    
    // Show loading toast
    const loadingToast = toast.loading('Updating project...');
    
    // Prepare project data with fields formatted for Neon PostgreSQL
    const projectData = {
      title: project.title,
      description: project.description,
      // Important: Use image_url field for database compatibility
      image_url: project.image || project.imageUrl || '',
      secondImage: project.secondImage || '',
      showBothImagesInPriority: Boolean(project.showBothImagesInPriority),
      category: project.category || '',
      technologies: Array.isArray(project.technologies) 
        ? project.technologies 
        : (typeof project.technologies === 'string' 
            ? (project.technologies as string).split(',').map((t: string) => t.trim()) 
            : []),
      projectLink: project.projectLink || project.link || '',
      link: project.projectLink || project.link || '', // Add this for backward compatibility
      featured: Boolean(project.featured),
      status: project.status || 'In Progress',
      updatedDays: project.updatedDays || 0,
      progress: project.progress || 0,
      features: project.features || [],
      exclusiveFeatures: project.exclusiveFeatures || [],
      imagePriority: typeof project.imagePriority === 'number' ? project.imagePriority : 5,
      visualEffects: project.visualEffects || {},
      // Code screenshot fields
      isCodeScreenshot: Boolean(project.isCodeScreenshot),
      codeLanguage: project.codeLanguage || '',
      codeTitle: project.codeTitle || '',
      codeContent: project.codeContent || '',
      useDirectCodeInput: Boolean(project.useDirectCodeInput),
      // Add last_updated timestamp
      lastUpdated: new Date().toISOString()
    };
    
    console.log('Prepared project data:', {
      id: project.id,
      title: projectData.title,
      image_url: projectData.image_url,
      secondImage: projectData.secondImage,
      technologies: Array.isArray(projectData.technologies) ? projectData.technologies.length + ' items' : typeof projectData.technologies,
      featured: projectData.featured,
      status: projectData.status
    });

    try {
      // Try the direct API update first
      const apiUrl = `/api/projects/${project.id}`;
      console.log('Sending PUT request to:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...projectData,
          password: dbPassword // Use the entered password
        }),
      });
      
      const result = await response.json();
      console.log('API response status:', response.status);
      console.log('API response:', result);
      
      if (!response.ok) {
        throw new Error(result.error || result.details || 'Failed to update project');
      }
      
      toast.dismiss(loadingToast);
      toast.success('Project updated successfully!');
      
      // Refresh the project data from the server
      const fetchProjectData = async () => {
        try {
          // Add cache busting parameters
          const timestamp = Date.now();
          const randomValue = Math.floor(Math.random() * 1000000);
          
          const response = await fetch(`/api/projects/${projectId}?t=${timestamp}&r=${randomValue}`, {
            method: 'GET',
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0',
              'X-Force-Refresh': 'true'
            }
          });
          if (response.ok) {
            const projectData = await response.json();
            setProject(projectData);
          }
        } catch (error) {
          console.error('Error refreshing project data:', error);
        }
      };
      
      fetchProjectData();
      
    } catch (error: any) {
      console.error('Error updating project:', error);
      toast.dismiss(loadingToast);
      toast.error(`Failed to update project: ${error.message || 'Unknown error'}`);
    }
  };

  // Handle effect change for visual effects
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
            
            <div className="flex items-center gap-2">
              {project && (
                <RefreshButton projectId={project.id} />
              )}
              <button
                type="button"
                onClick={() => {
                  // Set both passwords in session storage
                  sessionStorage.setItem('adminPassword', 'nex-devs.org889123');
                  sessionStorage.setItem('databasePassword', 'alihasnaat919');
                  // Show success toast
                  toast.success('Database access granted successfully!');
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Get Database Access
              </button>
              <Link
                href="/hasnaat/projects"
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Back to Projects
              </Link>
            </div>
          </div>

          {/* Password Protection Banner - Simplified to just show the security message */}
          <div className="bg-gray-800/70 border border-purple-500/30 rounded-lg p-4 mb-6 flex items-center">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-purple-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-purple-200 font-medium">SECURED BY SECURE WALL / NEX-DEVS</span>
            </div>
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
                            disabled={isSecondImageUploading}
                            className="px-4 py-2 rounded-md bg-blue-600/40 border border-blue-600/40 text-white hover:bg-blue-600/60 transition-colors flex items-center justify-center gap-2"
                          >
                            {isSecondImageUploading ? (
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

                    </div>
                  </div>
                </div>
              </div>

              {/* Code Screenshot Options */}
              <div className="mt-6 border-t border-gray-800 pt-6">
                <h3 className="text-lg font-medium text-purple-300 mb-4">Code Screenshot Options</h3>
                
                <div className="mb-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isCodeScreenshot"
                      name="isCodeScreenshot"
                      checked={project?.isCodeScreenshot || false}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 rounded border-gray-600 text-purple-600 focus:ring-purple-500/20 bg-black/50"
                    />
                    <label htmlFor="isCodeScreenshot" className="ml-2 block text-sm font-medium text-gray-300">
                      This is a code screenshot
                    </label>
                  </div>
                  <p className="mt-1 text-xs text-gray-400">Enable this option if your image is a code screenshot that should be displayed in an IDE-like frame</p>
                </div>
                
                {project?.isCodeScreenshot && (
                  <div className="space-y-4 bg-black/40 p-4 rounded-lg border border-purple-500/10">
                    <div>
                      <label htmlFor="codeTitle" className="block text-sm font-medium text-gray-300">File Name/Title</label>
                      <input
                        type="text"
                        id="codeTitle"
                        name="codeTitle"
                        value={project?.codeTitle || ''}
                        onChange={handleChange}
                        placeholder="e.g. main.jsx"
                        className="mt-1 block w-full rounded-md bg-black/50 border-gray-600 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500/20"
                      />
                      <p className="mt-1 text-xs text-gray-400">This will appear in the code editor tab</p>
                    </div>
                    
                    <div>
                      <label htmlFor="codeLanguage" className="block text-sm font-medium text-gray-300">Programming Language</label>
                      <select
                        id="codeLanguage"
                        name="codeLanguage"
                        value={project?.codeLanguage || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md bg-black/50 border-gray-600 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500/20"
                      >
                        <option value="">Select language</option>
                        <option value="javascript">JavaScript</option>
                        <option value="typescript">TypeScript</option>
                        <option value="jsx">JSX/React</option>
                        <option value="tsx">TSX</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="csharp">C#</option>
                        <option value="cpp">C++</option>
                        <option value="php">PHP</option>
                        <option value="go">Go</option>
                        <option value="rust">Rust</option>
                        <option value="ruby">Ruby</option>
                        <option value="swift">Swift</option>
                        <option value="kotlin">Kotlin</option>
                        <option value="sql">SQL</option>
                        <option value="html">HTML</option>
                        <option value="css">CSS</option>
                        <option value="scss">SCSS</option>
                        <option value="json">JSON</option>
                        <option value="yaml">YAML</option>
                        <option value="markdown">Markdown</option>
                        <option value="shell">Shell/Bash</option>
                      </select>
                      <p className="mt-1 text-xs text-gray-400">Used for syntax highlighting</p>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="useDirectCodeInput"
                        name="useDirectCodeInput"
                        checked={project?.useDirectCodeInput || false}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 rounded border-gray-600 text-purple-600 focus:ring-purple-500/20 bg-black/50"
                      />
                      <label htmlFor="useDirectCodeInput" className="ml-2 block text-sm font-medium text-gray-300">
                        Paste code directly instead of upload
                      </label>
                    </div>
                    
                    {project?.useDirectCodeInput && (
                      <div>
                        <label htmlFor="codeContent" className="block text-sm font-medium text-gray-300">Code Content</label>
                        <textarea
                          id="codeContent"
                          name="codeContent"
                          value={project?.codeContent || ''}
                          onChange={handleChange}
                          placeholder="Paste your code here..."
                          rows={10}
                          className="mt-1 block w-full rounded-md bg-black/50 border-gray-600 text-white font-mono text-sm shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500/20"
                        />
                      </div>
                    )}
                    
                    <div className="p-4 bg-gray-900/60 rounded-lg">
                      <h4 className="text-sm font-medium text-purple-300 mb-2">Preview</h4>
                      <div className="bg-gradient-to-br from-gray-900 via-black to-[#121212] overflow-hidden rounded-xl border border-gray-800">
                        {/* Decorative elements */}
                        <div className="h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-600 opacity-80"></div>
                        
                        {/* Code editor header */}
                        <div className="bg-black/80 backdrop-blur-sm py-2 px-4 flex items-center justify-between border-b border-gray-800">
                          <div className="flex gap-1.5">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          </div>
                          <div className="text-xs text-gray-500 font-mono">{project?.codeTitle || 'code-snippet.tsx'}</div>
                          <div className="w-4"></div> {/* Spacer for balance */}
                        </div>
                        
                        {project?.useDirectCodeInput ? (
                          <div className="p-4 text-xs text-left font-mono text-gray-300 max-h-[300px] overflow-auto whitespace-pre-wrap">
                            {project?.codeContent ? project.codeContent : 
                              <p className="text-center text-gray-500">Paste your code to see a preview</p>
                            }
                          </div>
                        ) : (
                          <div className="p-4 text-xs text-center text-gray-500">
                            <p>Your code screenshot will be displayed in this IDE-like frame</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 shadow-lg shadow-purple-600/20"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Update Project</span>
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