'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import AdminAuthCheck from '@/app/components/AdminAuthCheck'
import { toast, Toaster } from 'react-hot-toast'

interface FormState {
  title: string;
  description: string;
  image: string;
  category: string;
  technologies: string[];
  link: string;
  featured: boolean;
}

interface NewlyAddedProject extends FormState {
  developmentProgress: number;
  estimatedCompletion: string;
  exclusiveFeatures: string[];
  visualEffects: {
    morphTransition: boolean;
    rippleEffect: boolean;
    floatingElements: boolean;
    shimmering: boolean;
    animation: string;
    showBadge: boolean;
    spotlight: boolean;
    shadows: string;
    border: string;
    glassmorphism: boolean;
    particles: boolean;
    hover: string;
    backdrop: string;
    animationTiming: string;
    animationIntensity: string;
  };
  imagePriority: number;
  secondImage: string;
  showBothImagesInPriority: boolean;
  status: string;
  updatedDays: number;
  progress: number;
}

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

// Add presets for visual effects
const visualEffectsPresets = {
  premium: {
    morphTransition: true,
    rippleEffect: true,
    floatingElements: true,
    shimmering: true,
    animation: 'fade',
    showBadge: true,
    spotlight: true,
    shadows: 'gradient',
    border: 'gradient',
    glassmorphism: true,
    particles: false,
    hover: 'scale',
    backdrop: 'frosted',
    animationTiming: 'slow',
    animationIntensity: 'medium'
  },
  clean: {
    morphTransition: false,
    rippleEffect: false,
    floatingElements: false,
    shimmering: false,
    animation: 'none',
    showBadge: false,
    spotlight: false,
    shadows: 'soft',
    border: 'solid',
    glassmorphism: false,
    particles: false,
    hover: 'lift',
    backdrop: 'none',
    animationTiming: 'normal',
    animationIntensity: 'subtle'
  },
  playful: {
    morphTransition: true,
    rippleEffect: true,
    floatingElements: true,
    shimmering: true,
    animation: 'bounce',
    showBadge: true,
    spotlight: true,
    shadows: 'neon',
    border: 'animated',
    glassmorphism: false,
    particles: true,
    hover: 'shake',
    backdrop: 'pattern',
    animationTiming: 'fast',
    animationIntensity: 'strong'
  },
  motion: {
    morphTransition: true,
    rippleEffect: true,
    floatingElements: true,
    shimmering: false,
    animation: 'float',
    showBadge: false,
    spotlight: true,
    shadows: 'ambient',
    border: 'pulse',
    glassmorphism: true,
    particles: true,
    hover: 'ripple',
    backdrop: 'dim',
    animationTiming: 'slow',
    animationIntensity: 'medium'
  }
}

export default function NewProjectPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formType, setFormType] = useState<'regularProject' | 'newlyAddedProject'>('regularProject')
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSecondImageUploading, setIsSecondImageUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const secondFileInputRef = useRef<HTMLInputElement>(null)
  
  // Regular project form state
  const [project, setProject] = useState<FormState>({
    title: '',
    description: '',
    image: '/projects/placeholder.jpg',
    category: 'Web Development',
    technologies: [''],
    link: '',
    featured: false,
  })

  // Newly Added project form state
  const [newlyAddedProject, setNewlyAddedProject] = useState<NewlyAddedProject>({
    title: 'NEWLY ADDED: ',
    description: '',
    image: '/projects/placeholder.jpg',
    secondImage: '/projects/placeholder.jpg',
    showBothImagesInPriority: false,
    category: 'Web Development',
    technologies: [''],
    link: '',
    featured: true,
    developmentProgress: 0,
    estimatedCompletion: '',
    exclusiveFeatures: [''],
    visualEffects: {
      morphTransition: false,
      rippleEffect: false,
      floatingElements: false,
      shimmering: false,
      animation: 'none',
      showBadge: true,
      spotlight: false,
      shadows: 'none',
      border: 'none',
      glassmorphism: false,
      particles: false,
      hover: 'none',
      backdrop: 'none',
      animationTiming: 'normal',
      animationIntensity: 'normal'
    },
    imagePriority: 1,
    status: 'In Development',
    updatedDays: 1,
    progress: 50
  })

  // Handle change for regular project form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProject({
      ...project,
      [name]: value
    })

    // For title field, also update the newly added project title
    if (name === 'title') {
      setNewlyAddedProject(prev => ({
        ...prev,
        title: `NEWLY ADDED: ${value}`
      }))
    }
  }

  // Handle change for newly added project form
  const handleNewlyAddedChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewlyAddedProject({
      ...newlyAddedProject,
      [name]: value
    })

    // For title field, also update the base project state
    if (name === 'title') {
      setProject(prev => ({
        ...prev,
        title: value.replace(/^NEWLY ADDED:\s*/, '') // Remove prefix if it exists
      }))
    }
  }

  // Handle checkbox change
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setProject({
      ...project,
      [name]: checked
    })
  }

  // Handle newly added checkbox change
  const handleNewlyAddedCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    
    // Special handling for visual effects toggles
    if (name.startsWith('visualEffects.')) {
      const effectName = name.split('.')[1]
      handleEffectChange(effectName as keyof NewlyAddedProject['visualEffects'], checked)
      return
    }
    
    setNewlyAddedProject({
      ...newlyAddedProject,
      [name]: checked
    })
  }

  // Handle technology input changes for regular project
  const handleTechChange = (index: number, value: string) => {
    const updatedTechs = [...project.technologies]
    updatedTechs[index] = value
    setProject({
      ...project,
      technologies: updatedTechs
    })
  }

  // Handle technology input changes for newly added project
  const handleNewlyAddedTechChange = (index: number, value: string) => {
    const updatedTechs = [...newlyAddedProject.technologies]
    updatedTechs[index] = value
    setNewlyAddedProject({
      ...newlyAddedProject,
      technologies: updatedTechs
    })
  }

  // Add new technology field to regular project
  const addTechField = () => {
    setProject({
      ...project,
      technologies: [...project.technologies, '']
    })
  }

  // Add new technology field to newly added project
  const addNewlyAddedTechField = () => {
    setNewlyAddedProject({
      ...newlyAddedProject,
      technologies: [...newlyAddedProject.technologies, '']
    })
  }

  // Remove technology field from regular project
  const removeTechField = (index: number) => {
    if (project.technologies.length > 1) {
      const updatedTechs = [...project.technologies]
      updatedTechs.splice(index, 1)
      setProject({
        ...project,
        technologies: updatedTechs
      })
    }
  }

  // Remove technology field from newly added project
  const removeNewlyAddedTechField = (index: number) => {
    if (newlyAddedProject.technologies.length > 1) {
      const updatedTechs = [...newlyAddedProject.technologies]
      updatedTechs.splice(index, 1)
      setNewlyAddedProject({
        ...newlyAddedProject,
        technologies: updatedTechs
      })
    }
  }

  // Handle feature input changes
  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...newlyAddedProject.exclusiveFeatures]
    updatedFeatures[index] = value
    setNewlyAddedProject({
      ...newlyAddedProject,
      exclusiveFeatures: updatedFeatures
    })
  }

  // Add new feature field
  const addFeatureField = () => {
    setNewlyAddedProject({
      ...newlyAddedProject,
      exclusiveFeatures: [...newlyAddedProject.exclusiveFeatures, '']
    })
  }

  // Remove feature field
  const removeFeatureField = (index: number) => {
    if (newlyAddedProject.exclusiveFeatures.length > 1) {
      const updatedFeatures = [...newlyAddedProject.exclusiveFeatures]
      updatedFeatures.splice(index, 1)
      setNewlyAddedProject({
        ...newlyAddedProject,
        exclusiveFeatures: updatedFeatures
      })
    }
  }

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      // Use placeholder if no file is selected
      const imagePath = '/projects/placeholder.jpg';
      
      if (formType === 'regularProject') {
        setProject(prev => ({ ...prev, image: imagePath }));
      } else {
        setNewlyAddedProject(prev => ({ ...prev, image: imagePath }));
      }
      
      return;
    }
    
    const file = e.target.files[0]
    setIsUploading(true)
    
    try {
      // Get admin password for authorization
      const password = sessionStorage.getItem('adminPassword') || prompt('Enter admin password to upload image:')
      
      if (!password) {
        toast.error('Password required to upload image')
        setIsUploading(false)
        return
      }
      
      // Store password for session
      sessionStorage.setItem('adminPassword', password)
      
      const formData = new FormData()
      formData.append('file', file)
      formData.append('password', password)
      
      // Include timestamp for cache busting
      const timestamp = Date.now()
      
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
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `HTTP error ${response.status}` }))
        throw new Error(errorData.error || `Failed to upload image: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Update the project state with the new image path
      if (formType === 'regularProject') {
        setProject(prev => ({ ...prev, image: data.imagePath }))
      } else {
        setNewlyAddedProject(prev => ({ ...prev, image: data.imagePath }))
      }
      
      // Keep track of the uploaded image for preview
      setUploadedImage(data.imagePath)
      
      toast.success(data.isPlaceholder ? 'Using placeholder image' : 'Image uploaded successfully!')
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to upload image')
      
      // Use placeholder image in case of error
      const placeholderImage = '/projects/placeholder.jpg';
      if (formType === 'regularProject') {
        setProject(prev => ({ ...prev, image: placeholderImage }));
      } else {
        setNewlyAddedProject(prev => ({ ...prev, image: placeholderImage }));
      }
    } finally {
      setIsUploading(false)
    }
  }

  // Handle second image upload for newly added projects
  const handleSecondImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return
    }
    
    const file = e.target.files[0]
    setIsSecondImageUploading(true)
    
    try {
      // Get admin password for authorization
      const password = sessionStorage.getItem('adminPassword') || prompt('Enter admin password to upload image:')
      
      if (!password) {
        toast.error('Password required to upload image')
        setIsSecondImageUploading(false)
        return
      }
      
      // Store password for session
      sessionStorage.setItem('adminPassword', password)
      
      const formData = new FormData()
      formData.append('file', file)
      formData.append('password', password)
      
      // Include timestamp for cache busting
      const timestamp = Date.now()
      
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
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `HTTP error ${response.status}` }))
        throw new Error(errorData.error || `Failed to upload image: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Update the project state with the new second image path
      setNewlyAddedProject(prev => ({ 
        ...prev, 
        secondImage: data.imagePath 
      }))
      
      toast.success('Second image uploaded successfully!')
    } catch (error) {
      console.error('Error uploading second image:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to upload second image')
    } finally {
      setIsSecondImageUploading(false)
    }
  }

  // Add new function to handle visual effects presets
  const applyPreset = (preset: 'premium' | 'clean' | 'playful' | 'motion') => {
    setNewlyAddedProject(prev => ({
      ...prev,
      visualEffects: visualEffectsPresets[preset]
    }))
  }

  // Add new function to handle visual effect changes
  const handleEffectChange = (effect: keyof NewlyAddedProject['visualEffects'], value: boolean | string) => {
    setNewlyAddedProject(prev => ({
      ...prev,
      visualEffects: {
        ...prev.visualEffects,
        [effect]: value
      }
    }))
  }

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Get admin password
      const password = sessionStorage.getItem('adminPassword') || prompt('Enter admin password to add new project:')
      
      if (!password) {
        toast.error('Password required to add project')
        setIsSubmitting(false)
        return
      }

      // Store password for session
      sessionStorage.setItem('adminPassword', password)

      // Check if required fields are present
      if (formType === 'regularProject') {
        if (!project.title || !project.description || !project.category || !project.link) {
          toast.error('Please fill in all required fields')
          setIsSubmitting(false)
          return
        }
      } else {
        if (!project.title || !newlyAddedProject.description || !newlyAddedProject.category || !newlyAddedProject.link) {
          toast.error('Please fill in all required fields')
          setIsSubmitting(false)
          return
        }
      }

      // Generate a cache-busting timestamp
      const timestamp = Date.now();
      
      // Format form data for SQLite compatibility
      let finalProjectData;
      
      if (formType === 'regularProject') {
        // For regular projects
        finalProjectData = {
          ...project,
          // Ensure all arrays are properly filtered to remove empty entries
          technologies: project.technologies.filter(t => t.trim() !== ''),
          // Ensure boolean flags are properly formatted
          featured: Boolean(project.featured),
          // Make sure the link field is properly set
          link: project.link.trim(),
          // Ensure we have an image path
          image: project.image || '/projects/placeholder.jpg',
          // Include proper timestamp for SQLite
          lastUpdated: new Date().toISOString()
        };
      } else {
        // For newly added projects
        finalProjectData = {
          // Base project fields
          title: `NEWLY ADDED: ${project.title}`.trim(), // Prefix title
          description: newlyAddedProject.description.trim(),
          category: newlyAddedProject.category.trim(),
          // Make sure the link field is properly set
          link: newlyAddedProject.link.trim(),
          // Other fields with proper formatting
          technologies: newlyAddedProject.technologies.filter(t => t.trim() !== ''),
          features: newlyAddedProject.exclusiveFeatures.filter(f => f.trim() !== ''), // Map to features field
          exclusiveFeatures: newlyAddedProject.exclusiveFeatures.filter(f => f.trim() !== ''),
          // Ensure proper number formatting
          progress: typeof newlyAddedProject.progress === 'string' ? 
            parseInt(newlyAddedProject.progress) : 
            newlyAddedProject.progress,
          developmentProgress: typeof newlyAddedProject.developmentProgress === 'string' ? 
            parseInt(newlyAddedProject.developmentProgress) : 
            newlyAddedProject.developmentProgress,
          // Set other required fields
          updatedDays: 1, // Start with 1 day ago
          status: newlyAddedProject.status || 'In Development',
          estimatedCompletion: newlyAddedProject.estimatedCompletion,
          // Format booleans
          featured: true, // Always featured
          showBothImagesInPriority: Boolean(newlyAddedProject.showBothImagesInPriority),
          // Ensure proper formatting of image paths
          image: newlyAddedProject.image || '/projects/placeholder.jpg',
          secondImage: newlyAddedProject.secondImage || null,
          // Set visual effects with proper JSON format for SQLite
          visualEffects: {
            ...newlyAddedProject.visualEffects,
            morphTransition: Boolean(newlyAddedProject.visualEffects.morphTransition),
            rippleEffect: Boolean(newlyAddedProject.visualEffects.rippleEffect),
            floatingElements: Boolean(newlyAddedProject.visualEffects.floatingElements),
            shimmering: Boolean(newlyAddedProject.visualEffects.shimmering),
            showBadge: Boolean(newlyAddedProject.visualEffects.showBadge),
            spotlight: Boolean(newlyAddedProject.visualEffects.spotlight),
            glassmorphism: Boolean(newlyAddedProject.visualEffects.glassmorphism),
            particles: Boolean(newlyAddedProject.visualEffects.particles),
            animation: newlyAddedProject.visualEffects.animation || 'none',
            shadows: newlyAddedProject.visualEffects.shadows || 'none',
            border: newlyAddedProject.visualEffects.border || 'none',
            hover: newlyAddedProject.visualEffects.hover || 'none',
            backdrop: newlyAddedProject.visualEffects.backdrop || 'none',
            animationTiming: newlyAddedProject.visualEffects.animationTiming || 'normal',
            animationIntensity: newlyAddedProject.visualEffects.animationIntensity || 'normal'
          },
          // Set image priority with proper number
          imagePriority: typeof newlyAddedProject.imagePriority === 'string' ? 
            parseInt(newlyAddedProject.imagePriority) : 
            newlyAddedProject.imagePriority || 1,
          // Include proper timestamp for SQLite
          lastUpdated: new Date().toISOString()
        };
      }

      console.log('Submitting project data:', finalProjectData);

      // Send the request to create the project
      const response = await fetch(`/api/projects?t=${timestamp}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'X-Timestamp': timestamp.toString()
        },
        body: JSON.stringify({
          project: finalProjectData,
          password
        }),
        cache: 'no-store'
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `HTTP error ${response.status}` }));
        throw new Error(errorData.error || `Failed to add project: ${response.status}`);
      }
      
      const newProject = await response.json().catch(() => null);
      console.log('Project created successfully:', newProject);
      toast.success('Project added successfully');
      
      // Force cache revalidation for main pages
      try {
        const revalidatePaths = [
          `/api/revalidate?path=/&secret=${password}`,
          `/api/revalidate?path=/projects&secret=${password}`
        ];
        
        if (newProject && newProject.id) {
          revalidatePaths.push(`/api/revalidate?path=/projects/${newProject.id}&secret=${password}`);
        }
        
        await Promise.all(revalidatePaths.map(path => 
          fetch(path, {
            method: 'GET',
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            }
          }).catch(err => console.error(`Error revalidating ${path}:`, err))
        ));
      } catch (error) {
        console.error('Error during revalidation:', error);
        // Continue despite revalidation errors
      }

      // Add a small delay to ensure revalidation completes
      setTimeout(() => {
        router.push('/admin/projects');
      }, 800);
    } catch (error) {
      console.error('Error adding project:', error);
      toast.error(error instanceof Error ? error.message : 'Error adding project');
    } finally {
      setIsSubmitting(false);
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
                Add New Project
              </h1>
              <p className="text-gray-400 mt-1">Create a new project in your portfolio</p>
            </div>
            
            <Link 
              href="/admin/projects" 
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Projects
            </Link>
          </div>

          {/* Form Type Selector */}
          <div className="mb-6">
            <div className="flex space-x-4 border-b border-gray-700">
              <button
                type="button"
                onClick={() => setFormType('regularProject')}
                className={`py-2 px-4 border-b-2 ${
                  formType === 'regularProject' 
                    ? 'border-purple-500 text-purple-400' 
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                Regular Project
              </button>
              <button
                type="button"
                onClick={() => setFormType('newlyAddedProject')}
                className={`py-2 px-4 border-b-2 ${
                  formType === 'newlyAddedProject' 
                    ? 'border-purple-500 text-purple-400' 
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                Newly Added Project
              </button>
            </div>
          </div>

          {/* Regular Project Form */}
          {formType === 'regularProject' && (
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

                {/* Project Image Upload - Regular Project Form */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Project Image*</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-2">
                      <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden aspect-square relative">
                        {project.image ? (
                          <Image 
                            src={project.image} 
                            alt="Project preview"
                            fill
                            className="object-cover"
                            unoptimized={project.image.startsWith('data:')}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-gray-400">No image selected</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">Recommended: 4:3 aspect ratio, minimum 1200x900px</p>
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
                          <p className="text-xs text-gray-400">Recommended: 4:3 aspect ratio, minimum 1200x900px</p>
                          <input
                            type="text"
                            id="image"
                            name="image"
                            value={project.image}
                            onChange={handleChange}
                            className="px-3 py-2 rounded-md bg-black/50 border border-gray-600 text-white text-sm focus:border-purple-500 focus:ring focus:ring-purple-500/20"
                            placeholder="/projects/your-image.jpg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

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
                        Creating Regular Project...
                      </>
                    ) : (
                      'Add Regular Project'
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Newly Added Project Form with Enhanced Options */}
          {formType === 'newlyAddedProject' && (
            <form onSubmit={handleSubmit} className="bg-gray-900/50 rounded-xl p-6 border border-purple-500/20">
              <div className="space-y-6">
                {/* Project Title */}
                <div>
                  <label htmlFor="newTitle" className="block text-sm font-medium text-gray-300">Title*</label>
                  <input
                    type="text"
                    id="newTitle"
                    name="title"
                    required
                    value={newlyAddedProject.title}
                    onChange={handleNewlyAddedChange}
                    className="mt-1 block w-full rounded-md bg-black/50 border-gray-600 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500/20"
                  />
                  <p className="text-xs text-gray-500 mt-1">Project title will automatically include "NEWLY ADDED:" prefix</p>
                </div>

                {/* Project Description */}
                <div>
                  <label htmlFor="newDescription" className="block text-sm font-medium text-gray-300">Description*</label>
                  <textarea
                    id="newDescription"
                    name="description"
                    required
                    value={newlyAddedProject.description}
                    onChange={handleNewlyAddedChange}
                    rows={4}
                    className="mt-1 block w-full rounded-md bg-black/50 border-gray-600 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500/20"
                  />
                </div>

                {/* Project Image */}
                <div>
                  <label htmlFor="newImage" className="block text-sm font-medium text-gray-300">Project Image*</label>
                  <div className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative overflow-hidden rounded-lg border border-purple-500/30 bg-black/50 aspect-[4/3]">
                      <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden aspect-square relative">
                        {newlyAddedProject.image ? (
                          <Image 
                            src={newlyAddedProject.image} 
                            alt="Project preview"
                            fill
                            className="object-cover"
                            unoptimized={newlyAddedProject.image.startsWith('data:')}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-gray-400">No image selected</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">Recommended: 4:3 aspect ratio, minimum 1200x900px</p>
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
                          <p className="text-xs text-gray-400">Recommended: 4:3 aspect ratio, minimum 1200x900px</p>
                          <input
                            type="text"
                            id="image"
                            name="image"
                            value={newlyAddedProject.image}
                            onChange={handleNewlyAddedChange}
                            className="px-3 py-2 rounded-md bg-black/50 border border-gray-600 text-white text-sm focus:border-purple-500 focus:ring focus:ring-purple-500/20"
                            placeholder="/projects/your-image.jpg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Second Project Image */}
                <div>
                  <label htmlFor="secondImage" className="block text-sm font-medium text-gray-300">Second Project Image (Optional)</label>
                  <p className="text-xs text-gray-500 mt-1 mb-2">This image will only be visible in the expanded view when users click a button</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative overflow-hidden rounded-lg border border-purple-500/30 bg-black/50 aspect-[4/3]">
                      {newlyAddedProject.secondImage && newlyAddedProject.secondImage !== '/projects/placeholder.jpg' ? (
                        <Image 
                          src={newlyAddedProject.secondImage} 
                          alt="Second image preview" 
                          fill 
                          className="object-cover" 
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          quality={100}
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-gray-400">
                          <svg className="w-16 h-16 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col space-y-4">
                      <div className="flex-1 flex flex-col justify-center">
                        <input 
                          type="file" 
                          id="secondImageUpload"
                          accept="image/*"
                          className="hidden"
                          ref={secondFileInputRef}
                          onChange={handleSecondImageUpload}
                        />
                        <div className="flex flex-col space-y-3">
                          <button
                            type="button"
                            onClick={() => secondFileInputRef.current?.click()}
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
                          <p className="text-xs text-gray-400">Recommended: 4:3 aspect ratio, minimum 1200x900px</p>
                          <input
                            type="text"
                            id="secondImage"
                            name="secondImage"
                            value={newlyAddedProject.secondImage}
                            onChange={handleNewlyAddedChange}
                            className="px-3 py-2 rounded-md bg-black/50 border border-gray-600 text-white text-sm focus:border-purple-500 focus:ring focus:ring-purple-500/20"
                            placeholder="/projects/your-second-image.jpg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Image Display Priority - Replace with numeric selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Image Priority Position</label>
                  <div className="grid grid-cols-1 gap-3 bg-black/30 p-3 rounded-lg border border-gray-700">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Priority Level: {newlyAddedProject.imagePriority}</span>
                        <div className="flex space-x-3 items-center">
                          {[1, 2, 3, 4, 5].map((priority) => (
                            <button
                              key={priority}
                              type="button"
                              onClick={() => setNewlyAddedProject({
                                ...newlyAddedProject,
                                imagePriority: priority
                              })}
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                newlyAddedProject.imagePriority === priority
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
                            newlyAddedProject.imagePriority === 1 ? 'bg-green-500' :
                            newlyAddedProject.imagePriority === 2 ? 'bg-blue-500' :
                            newlyAddedProject.imagePriority === 3 ? 'bg-purple-500' :
                            newlyAddedProject.imagePriority === 4 ? 'bg-yellow-500' : 'bg-gray-500'
                          }`}></div>
                          <span className="text-sm text-gray-300">
                            {newlyAddedProject.imagePriority === 1 && 'Top Featured (Full Banner)'}
                            {newlyAddedProject.imagePriority === 2 && 'Second Position (Priority Grid)'}
                            {newlyAddedProject.imagePriority === 3 && 'Third Position (Priority Grid)'}
                            {newlyAddedProject.imagePriority === 4 && 'Standard Visibility'}
                            {newlyAddedProject.imagePriority === 5 && 'Lower Visibility'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Show both images in top priority */}
                      <div className="flex items-center mt-2 border-t border-gray-700 pt-2">
                        <input
                          type="checkbox"
                          id="showBothImagesInPriority"
                          checked={newlyAddedProject.showBothImagesInPriority}
                          onChange={(e) => setNewlyAddedProject({
                            ...newlyAddedProject,
                            showBothImagesInPriority: e.target.checked
                          })}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 bg-gray-700 border-gray-600 rounded"
                        />
                        <label htmlFor="showBothImagesInPriority" className="ml-2 text-sm text-gray-300 flex items-center">
                          <span>Show both images in top priority</span>
                          <span className="ml-2 px-2 py-0.5 bg-purple-600/30 text-purple-300 text-xs rounded-full border border-purple-500/30">New</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Higher priority images are displayed more prominently. Priority 1 gets a full banner display.
                    {newlyAddedProject.showBothImagesInPriority && 
                     " When 'Show both images' is enabled, both images will be displayed in the priority section."}
                  </p>
                </div>

                {/* Visual Effects Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Visual Effects</label>
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-2">Quick presets:</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => applyPreset('premium')}
                        className="px-2 py-1 bg-purple-900/30 text-purple-400 text-xs rounded border border-purple-500/20 hover:bg-purple-900/50 transition-colors"
                      >
                        Premium Look
                      </button>
                      <button
                        type="button"
                        onClick={() => applyPreset('clean')}
                        className="px-2 py-1 bg-blue-900/30 text-blue-400 text-xs rounded border border-blue-500/20 hover:bg-blue-900/50 transition-colors"
                      >
                        Clean & Simple
                      </button>
                      <button
                        type="button"
                        onClick={() => applyPreset('playful')}
                        className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded border border-green-500/20 hover:bg-green-900/50 transition-colors"
                      >
                        Playful
                      </button>
                      <button
                        type="button"
                        onClick={() => applyPreset('motion')}
                        className="px-2 py-1 bg-yellow-900/30 text-yellow-400 text-xs rounded border border-yellow-500/20 hover:bg-yellow-900/50 transition-colors"
                      >
                        Subtle Motion
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-black/30 p-4 rounded-lg border border-gray-700">
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-purple-400 border-b border-gray-700 pb-1">Basic Effects</h4>
                      
                      {/* Morph Transition */}
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="effectMorphTransition"
                          checked={newlyAddedProject.visualEffects.morphTransition}
                          onChange={(e) => handleEffectChange('morphTransition', e.target.checked)}
                          className="rounded bg-black/50 text-purple-500 focus:ring-purple-500/30 focus:ring-offset-0"
                        />
                        <label htmlFor="effectMorphTransition" className="text-sm text-gray-300">
                          Morph Transition Effect
                        </label>
                      </div>
                      
                      {/* Ripple Effect */}
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="effectRipple"
                          checked={newlyAddedProject.visualEffects.rippleEffect}
                          onChange={(e) => handleEffectChange('rippleEffect', e.target.checked)}
                          className="rounded bg-black/50 text-purple-500 focus:ring-purple-500/30 focus:ring-offset-0"
                        />
                        <label htmlFor="effectRipple" className="text-sm text-gray-300">
                          Ripple Effect
                        </label>
                      </div>
                      
                      {/* Floating Elements */}
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="effectFloatingElements"
                          checked={newlyAddedProject.visualEffects.floatingElements}
                          onChange={(e) => handleEffectChange('floatingElements', e.target.checked)}
                          className="rounded bg-black/50 text-purple-500 focus:ring-purple-500/30 focus:ring-offset-0"
                        />
                        <label htmlFor="effectFloatingElements" className="text-sm text-gray-300">
                          Floating Elements
                        </label>
                      </div>
                      
                      {/* Shimmering Effect */}
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="effectShimmering"
                          checked={newlyAddedProject.visualEffects.shimmering}
                          onChange={(e) => handleEffectChange('shimmering', e.target.checked)}
                          className="rounded bg-black/50 text-purple-500 focus:ring-purple-500/30 focus:ring-offset-0"
                        />
                        <label htmlFor="effectShimmering" className="text-sm text-gray-300">
                          Shimmering Effect
                        </label>
                      </div>
                      
                      {/* Spotlight Effect */}
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="effectSpotlight"
                          checked={newlyAddedProject.visualEffects.spotlight}
                          onChange={(e) => handleEffectChange('spotlight', e.target.checked)}
                          className="rounded bg-black/50 text-purple-500 focus:ring-purple-500/30 focus:ring-offset-0"
                        />
                        <label htmlFor="effectSpotlight" className="text-sm text-gray-300">
                          Spotlight Effect
                        </label>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-purple-400 border-b border-gray-700 pb-1">Advanced Effects</h4>
                      
                      {/* Animation Type */}
                      <div className="space-y-1">
                        <label className="text-sm text-gray-300 block">Animation Type</label>
                        <select
                          className="w-full rounded bg-black/50 border-gray-600 text-gray-300 text-sm focus:ring-purple-500/30 focus:border-purple-500"
                          value={newlyAddedProject.visualEffects.animation}
                          onChange={(e) => handleEffectChange('animation', e.target.value)}
                        >
                          <option value="none">None</option>
                          <option value="pulse">Pulse</option>
                          <option value="bounce">Bounce</option>
                          <option value="fade">Fade</option>
                          <option value="reveal">Reveal</option>
                          <option value="float">Float</option>
                          <option value="flip">Flip</option>
                          <option value="slide-right">Slide Right</option>
                          <option value="glitch">Glitch</option>
                          <option value="swing">Swing</option>
                          <option value="spiral">Spiral</option>
                          <option value="elastic">Elastic</option>
                          <option value="jello">Jello</option>
                          <option value="vibrate">Vibrate</option>
                          <option value="pop">Pop</option>
                          <option value="shimmer">Shimmer</option>
                          <option value="morph">Morph</option>
                          <option value="wave">Wave</option>
                          <option value="float-smooth">Float Smooth</option>
                        </select>
                      </div>
                      
                      {/* Shadow Style */}
                      <div className="space-y-1">
                        <label className="text-sm text-gray-300 block">Shadow Style</label>
                        <select
                          className="w-full rounded bg-black/50 border-gray-600 text-gray-300 text-sm focus:ring-purple-500/30 focus:border-purple-500"
                          value={newlyAddedProject.visualEffects.shadows}
                          onChange={(e) => handleEffectChange('shadows', e.target.value)}
                        >
                          <option value="none">None</option>
                          <option value="soft">Soft</option>
                          <option value="hard">Hard</option>
                          <option value="neon">Neon</option>
                          <option value="gradient">Gradient</option>
                          <option value="3d">3D</option>
                          <option value="layered">Layered</option>
                          <option value="ambient">Ambient</option>
                          <option value="highlight">Highlight</option>
                        </select>
                      </div>
                      
                      {/* Border Style */}
                      <div className="space-y-1">
                        <label className="text-sm text-gray-300 block">Border Style</label>
                        <select
                          className="w-full rounded bg-black/50 border-gray-600 text-gray-300 text-sm focus:ring-purple-500/30 focus:border-purple-500"
                          value={newlyAddedProject.visualEffects.border}
                          onChange={(e) => handleEffectChange('border', e.target.value)}
                        >
                          <option value="none">None</option>
                          <option value="solid">Solid</option>
                          <option value="dashed">Dashed</option>
                          <option value="gradient">Gradient Background</option>
                          <option value="glow">Glow</option>
                          <option value="animated">Animated</option>
                          <option value="glowing">Glowing</option>
                          <option value="pulsating">Pulsating</option>
                          <option value="double">Double</option>
                          <option value="gradient-border">True Gradient</option>
                        </select>
                      </div>
                      
                      {/* Animation Timing */}
                      <div className="space-y-1">
                        <label className="text-sm text-gray-300 block">Animation Timing</label>
                        <select 
                          className="w-full rounded bg-black/50 border-gray-600 text-gray-300 text-sm focus:ring-purple-500/30 focus:border-purple-500"
                          value={newlyAddedProject.visualEffects.animationTiming}
                          onChange={(e) => handleEffectChange('animationTiming', e.target.value)}
                        >
                          <option value="normal">Normal Speed</option>
                          <option value="fast">Fast Animation</option>
                          <option value="slow">Slow Animation</option>
                          <option value="very-slow">Very Slow Animation</option>
                        </select>
                      </div>
                      
                      {/* Animation Intensity */}
                      <div className="space-y-1">
                        <label className="text-sm text-gray-300 block">Animation Intensity</label>
                        <select 
                          className="w-full rounded bg-black/50 border-gray-600 text-gray-300 text-sm focus:ring-purple-500/30 focus:border-purple-500"
                          value={newlyAddedProject.visualEffects.animationIntensity}
                          onChange={(e) => handleEffectChange('animationIntensity', e.target.value)}
                        >
                          <option value="normal">Normal Intensity</option>
                          <option value="subtle">Subtle Effects</option>
                          <option value="medium">Medium Effects</option>
                          <option value="strong">Strong Effects</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Effects Preview */}
                  <div className="mt-4 rounded-lg border border-gray-700 p-4 bg-black/20">
                    <h4 className="text-sm font-medium text-purple-400 mb-2">Preview</h4>
                    <div className="relative w-full h-40 md:h-52 overflow-hidden rounded-lg perspective-1000">
                      {/* Spotlight Effect Background */}
                      {newlyAddedProject.visualEffects.spotlight && (
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                          <div className="absolute -right-16 -top-16 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl opacity-70 animate-spotlight"></div>
                          <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-blue-500/30 rounded-full blur-3xl opacity-70 animate-spotlight" style={{ animationDelay: '4s' }}></div>
                        </div>
                      )}
                      
                      {/* Floating Elements Effect */}
                      {newlyAddedProject.visualEffects.floatingElements && (
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                          <div className="absolute top-1/4 left-1/4 w-6 h-6 bg-purple-500/30 rounded-full blur-xl animate-float" style={{ animationDuration: '7s' }}></div>
                          <div className="absolute top-3/4 right-1/4 w-4 h-4 bg-blue-500/30 rounded-full blur-xl animate-float" style={{ animationDuration: '9s', animationDelay: '1s' }}></div>
                          <div className="absolute bottom-1/4 left-1/2 w-5 h-5 bg-cyan-500/30 rounded-full blur-xl animate-float" style={{ animationDuration: '8s', animationDelay: '2s' }}></div>
                        </div>
                      )}
                      
                      {/* Ripple Effect */}
                      {newlyAddedProject.visualEffects.rippleEffect && (
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border-2 border-purple-500/40 rounded-full animate-ripple"></div>
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border-2 border-purple-500/40 rounded-full animate-ripple" style={{ animationDelay: '1s' }}></div>
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border-2 border-purple-500/40 rounded-full animate-ripple" style={{ animationDelay: '2s' }}></div>
                        </div>
                      )}
                      
                      {/* Background Glow - Morph Transition */}
                      {newlyAddedProject.visualEffects.morphTransition && (
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-100 animate-pulse" 
                          style={{ 
                            animationDuration: newlyAddedProject.visualEffects.animationTiming === 'slow' ? '6s' : 
                                            newlyAddedProject.visualEffects.animationTiming === 'very-slow' ? '10s' : 
                                            newlyAddedProject.visualEffects.animationTiming === 'fast' ? '2s' : '4s' 
                          }}></div>
                      )}
                      
                      {/* Shimmering Effect */}
                      {newlyAddedProject.visualEffects.shimmering && (
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent animate-shimmer"></div>
                      )}
                      
                      <div 
                        className={`absolute inset-0 flex items-center justify-center transform will-change-transform ${
                          newlyAddedProject.visualEffects.animation === 'pulse' ? 'animate-pulse' : 
                          newlyAddedProject.visualEffects.animation === 'bounce' ? 'animate-bounce-slow' : 
                          newlyAddedProject.visualEffects.animation === 'fade' ? 'animate-fade' : 
                          newlyAddedProject.visualEffects.animation === 'float' ? 'animate-float-smooth' :
                          newlyAddedProject.visualEffects.animation === 'slide-right' ? 'animate-slide-right' :
                          newlyAddedProject.visualEffects.animation === 'reveal' ? 'animate-reveal' :
                          newlyAddedProject.visualEffects.animation === 'flip' ? 'hover:animate-flip' :
                          newlyAddedProject.visualEffects.animation === 'glitch' ? 'animate-glitch' :
                          newlyAddedProject.visualEffects.animation === 'swing' ? 'animate-swing' :
                          newlyAddedProject.visualEffects.animation === 'jello' ? 'animate-jello' :
                          newlyAddedProject.visualEffects.animation === 'vibrate' ? 'animate-vibrate' :
                          newlyAddedProject.visualEffects.animation === 'pop' ? 'animate-pop' :
                          newlyAddedProject.visualEffects.animation === 'morph' ? 'animate-morph' :
                          newlyAddedProject.visualEffects.animation === 'wave' ? 'animate-wave' : ''
                        } ${
                          // Animation intensity
                          newlyAddedProject.visualEffects.animationIntensity === 'subtle' ? 'scale-[1.02]' :
                          newlyAddedProject.visualEffects.animationIntensity === 'medium' ? 'scale-[1.05]' :
                          newlyAddedProject.visualEffects.animationIntensity === 'strong' ? 'scale-[1.08]' : ''
                        } ${
                          // Animation timing
                          newlyAddedProject.visualEffects.animationTiming === 'slow' ? 'duration-700' :
                          newlyAddedProject.visualEffects.animationTiming === 'very-slow' ? 'duration-1000' :
                          newlyAddedProject.visualEffects.animationTiming === 'fast' ? 'duration-300' : 'duration-500'
                        } ${
                          // Shadows
                          newlyAddedProject.visualEffects.shadows === 'soft' ? 'shadow-lg' :
                          newlyAddedProject.visualEffects.shadows === 'hard' ? 'shadow-xl' :
                          newlyAddedProject.visualEffects.shadows === 'neon' ? 'shadow-[0_0_20px_5px_rgba(147,51,234,0.4)]' :
                          newlyAddedProject.visualEffects.shadows === 'gradient' ? 'shadow-[0_0_30px_5px_rgba(147,51,234,0.4),0_0_30px_10px_rgba(59,130,246,0.3)]' :
                          newlyAddedProject.visualEffects.shadows === '3d' ? 'shadow-[0_10px_20px_rgba(0,0,0,0.3)]' :
                          newlyAddedProject.visualEffects.shadows === 'layered' ? 'shadow-[0_3px_5px_rgba(0,0,0,0.2),0_7px_15px_rgba(0,0,0,0.3)]' :
                          newlyAddedProject.visualEffects.shadows === 'ambient' ? 'shadow-[0_0_25px_5px_rgba(147,51,234,0.15)]' :
                          newlyAddedProject.visualEffects.shadows === 'highlight' ? 'shadow-[0_0_15px_2px_rgba(255,255,255,0.2)]' : ''
                        }`}
                      >
                        {/* Border Effect Wrapper */}
                        <div 
                          className={`relative bg-gradient-to-br from-gray-900 to-black z-10 rounded-lg p-4 flex items-center justify-center w-5/6 h-5/6 backdrop-blur-sm ${
                            newlyAddedProject.visualEffects.glassmorphism ? 'bg-opacity-70' : ''
                          } ${
                            newlyAddedProject.visualEffects.border === 'solid' ? 'border-2 border-purple-500' :
                            newlyAddedProject.visualEffects.border === 'dashed' ? 'border-2 border-dashed border-purple-500' :
                            newlyAddedProject.visualEffects.border === 'gradient' ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-[1px]' :
                            newlyAddedProject.visualEffects.border === 'glow' ? 'border-2 border-purple-500 shadow-[0_0_10px_1px_rgba(147,51,234,0.4)]' :
                            newlyAddedProject.visualEffects.border === 'animated' ? 'border-2 border-purple-500 animate-borderGlow' :
                            newlyAddedProject.visualEffects.border === 'pulse' ? 'border-2 border-purple-500 animate-pulse' :
                            newlyAddedProject.visualEffects.border === 'glowing' ? 'border-2 border-purple-500 shadow-[0_0_15px_3px_rgba(147,51,234,0.6)] animate-glow' :
                            newlyAddedProject.visualEffects.border === 'pulsating' ? 'border-2 border-purple-500 animate-pulse' :
                            newlyAddedProject.visualEffects.border === 'double' ? 'border-4 border-double border-purple-500' :
                            newlyAddedProject.visualEffects.border === 'gradient-border' ? 'border-4 border-transparent bg-clip-padding p-[1px]' : ''
                          }`}
                          style={{
                            backgroundImage: newlyAddedProject.visualEffects.border === 'gradient-border' ? 
                              'linear-gradient(black, black), linear-gradient(to right, #9333ea, #60a5fa)' : '',
                            backgroundOrigin: 'border-box',
                            backgroundClip: 'content-box, border-box'
                          }}
                        >
                          {/* Content for border gradient if needed */}
                          <div className={`w-full h-full flex items-center justify-center ${
                            newlyAddedProject.visualEffects.border === 'gradient' 
                              ? 'bg-gray-900 border border-transparent rounded-lg' 
                              : ''
                          } ${
                            newlyAddedProject.visualEffects.glassmorphism 
                              ? 'bg-gray-900/70 backdrop-blur-md backdrop-filter'
                              : ''
                          }`}>
                            <div className="text-center relative">
                              <p className="text-white font-medium text-lg">Effect Preview</p>
                              <p className="text-xs text-gray-400 mt-1">What your project will look like</p>
                            </div>
                            
                            {newlyAddedProject.visualEffects.showBadge && (
                              <span className="absolute -top-3 -right-3 bg-purple-500 text-white text-xs font-medium px-2 py-0.5 rounded-full shadow-lg">NEW</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
                      <p>These effects will automatically apply when visitors view your project</p>
                      <button 
                        type="button"
                        onClick={() => applyPreset('premium')}
                        className="px-2 py-1 bg-purple-900/30 text-purple-400 text-xs rounded border border-purple-500/20 hover:bg-purple-900/50 transition-colors"
                      >
                        Apply Preset
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-1">These effects will be applied when displaying this project in the "Newly Added" section</p>
                </div>

                {/* Exclusive Features */}
                <div>
                  <label className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-300">Exclusive Features</span>
                    <button
                      type="button"
                      onClick={() => setNewlyAddedProject({
                        ...newlyAddedProject,
                        exclusiveFeatures: [...newlyAddedProject.exclusiveFeatures, '']
                      })}
                      className="text-xs text-purple-400 hover:text-purple-300 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Exclusive Feature
                    </button>
                  </label>
                  
                  <div className="mt-2 space-y-2">
                    {newlyAddedProject.exclusiveFeatures.length > 0 ? (
                      newlyAddedProject.exclusiveFeatures.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={feature}
                            onChange={(e) => {
                              const updated = [...newlyAddedProject.exclusiveFeatures];
                              updated[index] = e.target.value;
                              setNewlyAddedProject({
                                ...newlyAddedProject,
                                exclusiveFeatures: updated
                              });
                            }}
                            className="flex-1 rounded-md bg-black/50 border-gray-600 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500/20"
                            placeholder="Enter exclusive feature"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...newlyAddedProject.exclusiveFeatures];
                              updated.splice(index, 1);
                              setNewlyAddedProject({
                                ...newlyAddedProject,
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
                          onClick={() => setNewlyAddedProject({
                            ...newlyAddedProject,
                            exclusiveFeatures: ['']
                          })}
                          className="mt-1 text-xs text-purple-400 hover:text-purple-300"
                        >
                          Add one now
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Feature Templates - NEW */}
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-2">Quick add common exclusive features:</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const features = [...(newlyAddedProject.exclusiveFeatures || [])];
                          if (!features.includes('Early access to premium content')) {
                            features.push('Early access to premium content');
                          }
                          setNewlyAddedProject({
                            ...newlyAddedProject,
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
                          const features = [...(newlyAddedProject.exclusiveFeatures || [])];
                          if (!features.includes('Behind-the-scenes development insights')) {
                            features.push('Behind-the-scenes development insights');
                          }
                          setNewlyAddedProject({
                            ...newlyAddedProject,
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
                          const features = [...(newlyAddedProject.exclusiveFeatures || [])];
                          if (!features.includes('Experimental features not available in public release')) {
                            features.push('Experimental features not available in public release');
                          }
                          setNewlyAddedProject({
                            ...newlyAddedProject,
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
                          const features = [...(newlyAddedProject.exclusiveFeatures || [])];
                          if (!features.includes('Special promotions for early adopters')) {
                            features.push('Special promotions for early adopters');
                          }
                          setNewlyAddedProject({
                            ...newlyAddedProject,
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
                          const features = [...(newlyAddedProject.exclusiveFeatures || [])];
                          if (!features.includes('Limited edition design elements')) {
                            features.push('Limited edition design elements');
                          }
                          setNewlyAddedProject({
                            ...newlyAddedProject,
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
                    Add special features only available in this new project. These will be highlighted with a special badge.
                  </p>
                </div>

                {/* Project Status and Days */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-300">Status*</label>
                    <select
                      id="status"
                      name="status"
                      required
                      value={newlyAddedProject.status}
                      onChange={handleNewlyAddedChange}
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
                      value={newlyAddedProject.updatedDays}
                      onChange={handleNewlyAddedChange}
                      className="mt-1 block w-full rounded-md bg-black/50 border-gray-600 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500/20"
                    />
                  </div>
                </div>

                {/* Progress */}
                <div>
                  <label htmlFor="progress" className="block text-sm font-medium text-gray-300">
                    Progress* ({newlyAddedProject.progress}%)
                  </label>
                  <input
                    type="range"
                    id="progress"
                    name="progress"
                    min="0"
                    max="100"
                    step="1"
                    required
                    value={newlyAddedProject.progress}
                    onChange={handleNewlyAddedChange}
                    className="mt-1 block w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                </div>

                {/* Project Category */}
                <div>
                  <label htmlFor="newCategory" className="block text-sm font-medium text-gray-300">Category*</label>
                  <div className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="relative">
                      <select
                        id="newCategory"
                        name="category"
                        required
                        value={newlyAddedProject.category}
                        onChange={handleNewlyAddedChange}
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
                    
                    <div className="flex flex-wrap gap-2 items-center">
                      {['Web Development', 'AI/ML', 'Mobile App', 'E-Commerce'].map((quickCategory) => (
                        <button
                          key={quickCategory}
                          type="button"
                          onClick={() => setNewlyAddedProject({
                            ...newlyAddedProject,
                            category: quickCategory === 'E-Commerce' ? 'E-Commerce (Shopify/WooCommerce)' : 
                                     quickCategory === 'AI/ML' ? 'AI Agents Development' :
                                     quickCategory === 'Mobile App' ? 'Mobile App with AI Integration' :
                                     quickCategory === 'Web Development' ? 'Web Development with AI Integration' : quickCategory
                          })}
                          className="px-2 py-1 text-xs rounded-full border transition-colors"
                          style={{
                            backgroundColor: newlyAddedProject.category.includes(quickCategory) ? 'rgba(147, 51, 234, 0.3)' : 'rgba(45, 45, 60, 0.3)',
                            borderColor: newlyAddedProject.category.includes(quickCategory) ? 'rgba(147, 51, 234, 0.5)' : 'rgba(75, 75, 90, 0.3)',
                            color: newlyAddedProject.category.includes(quickCategory) ? 'rgb(167, 139, 250)' : 'rgb(156, 163, 175)'
                          }}
                        >
                          {quickCategory}
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Select a category that best represents your project</p>
                </div>

                {/* Project Technologies */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Technologies*</label>
                  <div className="space-y-2">
                    {newlyAddedProject.technologies.map((tech, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={tech}
                          onChange={(e) => handleNewlyAddedTechChange(index, e.target.value)}
                          placeholder={`Technology ${index + 1}`}
                          className="flex-1 rounded-md bg-black/50 border-gray-600 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500/20"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewlyAddedTechField(index)}
                          disabled={newlyAddedProject.technologies.length <= 1}
                          className="px-3 py-1 bg-red-900/30 text-red-400 rounded hover:bg-red-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addNewlyAddedTechField}
                    className="mt-2 px-3 py-1 bg-purple-500/20 text-purple-400 rounded hover:bg-purple-500/30"
                  >
                    Add Technology
                  </button>
                </div>

                {/* Project Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Features*</label>
                  <div className="space-y-2">
                    {newlyAddedProject.exclusiveFeatures.map((feature, index) => (
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
                          disabled={newlyAddedProject.exclusiveFeatures.length <= 1}
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

                {/* Project Link */}
                <div>
                  <label htmlFor="newLink" className="block text-sm font-medium text-gray-300">Project Link*</label>
                  <input
                    type="url"
                    id="newLink"
                    name="link"
                    required
                    value={newlyAddedProject.link}
                    onChange={handleNewlyAddedChange}
                    className="mt-1 block w-full rounded-md bg-black/50 border-gray-600 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500/20"
                  />
                </div>

                {/* Featured Checkbox */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="newFeatured"
                    name="featured"
                    checked={newlyAddedProject.featured}
                    onChange={handleNewlyAddedCheckboxChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 bg-gray-700 border-gray-600 rounded"
                  />
                  <label htmlFor="newFeatured" className="ml-2 text-sm text-gray-300">
                    Mark as Featured Project
                  </label>
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
                        Creating "Newly Added" Project...
                      </>
                    ) : (
                      'Add Newly Added Project'
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </AdminAuthCheck>
  )
} 