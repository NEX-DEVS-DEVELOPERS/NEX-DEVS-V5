'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import AdminAuthCheck from '@/app/components/AdminAuthCheck'
import { toast, Toaster } from 'react-hot-toast'

// Project type definition
type Project = {
  id: number
  title: string
  description: string
  image: string
  category: string
  technologies: string[]
  link: string
  featured: boolean
  status?: string
  updatedDays?: number
  progress?: number
  features?: string[]
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isReadOnly, setIsReadOnly] = useState(false)

  // Add a check for read-only mode
  useEffect(() => {
    // Check if we're running on Vercel in production
    const checkReadOnlyMode = async () => {
      try {
        const response = await fetch('/api/config?check=readOnly', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setIsReadOnly(data.readOnlyMode || false);
        }
      } catch (error) {
        console.error('Error checking read-only mode:', error);
      }
    };
    
    checkReadOnlyMode();
  }, []);

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects()
  }, [])

  // Function to fetch projects
  const fetchProjects = async () => {
    setIsLoading(true)
    try {
      // Enhanced cache busting with multiple random values
      const timestamp = new Date().getTime();
      const randomValue = Math.floor(Math.random() * 10000000);
      const cache = `nocache=${timestamp}-${randomValue}`;
      const response = await fetch(`/api/projects?t=${timestamp}&r=${randomValue}&${cache}`, {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
          'X-Force-Refresh': 'true',
          'X-Random-Value': randomValue.toString()
        }
      })
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error('Error fetching projects:', error)
      toast.error('Failed to load projects')
    } finally {
      setIsLoading(false)
    }
  }

  // Function to delete a project
  const handleDeleteProject = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return
    }

    const password = sessionStorage.getItem('adminPassword') || prompt('Enter admin password to confirm deletion:')
    
    if (!password) {
      toast.error('Password required for deletion')
      return
    }

    // Store password in session for future operations
    sessionStorage.setItem('adminPassword', password)

    try {
      toast.loading('Deleting project...')
      
      // Try the direct endpoint first
      let response = await fetch(`/api/projects/${id}?password=${encodeURIComponent(password)}`, {
        method: 'DELETE',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      })
      
      // If that fails, try the fallback endpoint
      if (!response.ok) {
        console.log('First deletion attempt failed, trying alternative endpoint...')
        response = await fetch(`/api/projects?id=${id}&password=${encodeURIComponent(password)}`, {
          method: 'DELETE',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        })
      }

      toast.dismiss()
      
      const responseData = await response.json()
      
      if (response.ok) {
        // Check if we're in read-only mode
        if (responseData.readOnly) {
          toast.success(`${responseData.message || 'Project deleted in read-only mode'}. Changes won't persist on serverless deployments.`)
        } else {
          toast.success('Project deleted successfully')
        }
        
        // Update the local UI by removing the deleted project
        setProjects(projects.filter(p => p.id !== id))
      } else {
        console.error('Error response:', responseData)
        toast.error(responseData.error || 'Failed to delete project')
      }
    } catch (error) {
      toast.dismiss()
      console.error('Error deleting project:', error)
      toast.error('Error connecting to the server. Please try again.')
    }
  }

  return (
    <AdminAuthCheck>
      <div className="min-h-screen bg-[#0a0a0a] pt-32 p-6">
        <Toaster position="top-right" />
        
        {isReadOnly && (
          <div className="mb-6 bg-amber-900/30 border border-amber-500/30 text-amber-200 rounded-lg p-4 shadow-lg">
            <div className="flex items-start">
              <svg className="w-5 h-5 mr-2 mt-0.5 text-amber-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-semibold text-amber-300">Read-Only Mode Active</h3>
                <p className="mt-1">
                  This admin dashboard is running in read-only mode because it's deployed on Vercel. 
                  Any changes you make (adding, editing, or deleting projects) will appear to work 
                  but won't be permanently saved due to Vercel's serverless architecture.
                </p>
                <p className="mt-2">
                  For persistent changes, please run the site locally or deploy to a platform 
                  that supports persistent file storage for SQLite databases.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-purple-400 to-blue-500 bg-clip-text text-transparent">
                Projects Admin
              </h1>
              <p className="text-gray-400 mt-2">Manage your projects portfolio</p>
            </div>
            
            <div className="flex gap-4">
              <Link
                href="/admin/projects/new"
                className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors"
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span>Add New Project</span>
              </Link>

              <button
                onClick={fetchProjects}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors"
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
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>Refresh Data</span>
              </button>
              
              <Link
                href="/admin/database"
                className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors"
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
                    d="M4 7v10c0 2 1.5 3 3.5 3h9c2 0 3.5-1 3.5-3V7c0-2-1.5-3-3.5-3h-9C5.5 4 4 5 4 7z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 11h6"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 15h6"
                  />
                </svg>
                <span>Database Admin</span>
              </Link>

              <Link
                href="/"
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors"
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
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <span>View Site</span>
              </Link>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-900/50 rounded-xl border border-purple-500/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-800">
                  <thead className="bg-gray-900/70">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Image
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Title
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Category
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Featured
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-900/30 divide-y divide-gray-800">
                    {projects.map((project) => (
                      <tr key={project.id} className="hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {project.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-12 w-12 relative rounded overflow-hidden">
                            <Image 
                              src={project.image} 
                              alt={project.title} 
                              fill 
                              className="object-cover"
                              sizes="48px"
                              unoptimized={project.image.startsWith('data:')}
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {project.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {project.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {project.featured ? (
                            <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                              Featured
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs rounded-full bg-gray-500/20 text-gray-400 border border-gray-500/30">
                              Not Featured
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {project.status ? (
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              project.status === 'In Development' 
                                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                                : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            }`}>
                              {project.status}
                            </span>
                          ) : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <Link
                              href={`/admin/projects/edit/${project.id}`}
                              className="text-purple-400 hover:text-purple-300 transition-colors"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDeleteProject(project.id)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminAuthCheck>
  )
} 