'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import AdminAuthCheck from '@/app/components/AdminAuthCheck'
import { toast, Toaster } from 'react-hot-toast'
import DebugPanelWrapper from '@/app/components/DebugPanelWrapper'

// Project type definition
type Project = {
  id: number
  title: string
  description: string
  image?: string  // For older entries
  image_url?: string // For MySQL entries
  category?: string
  technologies?: string[] | string
  link?: string // For older entries
  project_link?: string // For MySQL entries
  featured?: boolean
  status?: string
  created_at?: string
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
      // Get the admin password from session storage
      const password = sessionStorage.getItem('adminPassword') || 'nex-devs919'
      
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
          'X-Random-Value': randomValue.toString(),
          'Authorization': `Bearer ${password}`
        }
      })
      const data = await response.json()
      
      // Ensure data is an array before setting to state
      if (Array.isArray(data)) {
        setProjects(data)
        
        // Store the password if not already in session storage
        if (!sessionStorage.getItem('adminPassword')) {
          sessionStorage.setItem('adminPassword', password)
        }
      } else {
        console.error('API returned non-array data:', data)
        setProjects([])
        toast.error('Invalid data format received from server')
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
      toast.error('Failed to load projects')
      setProjects([]) // Set to empty array on error
    } finally {
      setIsLoading(false)
    }
  }

  // Function to delete a project
  const handleDeleteProject = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return
    }

    // Get the admin password from session storage
    let password = sessionStorage.getItem('adminPassword') || 'nex-devs919';
    
    // Store password in session for future operations
    sessionStorage.setItem('adminPassword', password);
    
    // Also ensure database password is set
    if (!sessionStorage.getItem('databasePassword')) {
      sessionStorage.setItem('databasePassword', 'alihasnaat919');
    }

    try {
      toast.loading('Deleting project...')
      
      // Add a timestamp to prevent caching
      const timestamp = new Date().getTime()
      
      // Try the direct endpoint first
      let response = await fetch(`/api/projects/${id}?password=${encodeURIComponent(password)}&t=${timestamp}`, {
        method: 'DELETE',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'X-Force-Refresh': 'true',
          'Authorization': `Bearer ${password}`
        }
      })
      
      // If that fails, try the fallback endpoint
      if (!response.ok) {
        console.log('First deletion attempt failed, trying alternative endpoint...')
        response = await fetch(`/api/projects?id=${id}&password=${encodeURIComponent(password)}&t=${timestamp}`, {
          method: 'DELETE',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'X-Force-Refresh': 'true',
            'Authorization': `Bearer ${password}`
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
        
        // Refresh the live site data by revalidating the cache
        await fetch(`/api/revalidate?path=/projects&secret=${password}&t=${timestamp}`)
        await fetch(`/api/revalidate?path=/&secret=${password}&t=${timestamp}`)
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
                <h3 className="font-semibold text-amber-300">MySQL Database Connected</h3>
                <p className="mt-1">
                  This admin dashboard is connected to the MySQL database on Railway. 
                  Any changes you make (adding, editing, or deleting projects) will be
                  saved to your database and will persist across deployments.
                </p>
                <p className="mt-2">
                  Your database connection: {process.env.MYSQL_HOST || 'metro.proxy.rlwy.net'}
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-purple-400 to-blue-500 bg-clip-text text-transparent">
                Projects Management
              </h1>
              <p className="text-gray-400 mt-2">Manage and organize your portfolio projects</p>
            </div>
            
            <div className="flex flex-wrap gap-2 md:gap-3">
              <Link
                href="/hasnaat"
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
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span>Admin Home</span>
              </Link>

              <Link
                href="/hasnaat/projects/new"
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

              <Link
                href="/hasnaat/projects"
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors"
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
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <span>All Projects</span>
              </Link>

              <Link
                href="/hasnaat/reviews"
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors"
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
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                <span>Reviews</span>
              </Link>

              <Link
                href="/hasnaat/team-members"
                className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors"
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span>Team Members</span>
              </Link>

              <Link
                href="/hasnaat/database/test"
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
                    d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 11l3 3l3-3"
                  />
                </svg>
                <span>Database Test</span>
              </Link>

              <Link
                href="/hasnaat/command-room"
                className="bg-purple-700 hover:bg-purple-800 text-white py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors"
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
                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                  />
                </svg>
                <span>Command Room</span>
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
                <span>Refresh</span>
              </button>
              
              <button
                onClick={() => {
                  // Set both passwords in session storage
                  sessionStorage.setItem('adminPassword', 'nex-devs.org889123');
                  sessionStorage.setItem('databasePassword', 'alihasnaat919');
                  // Show success toast
                  toast.success('Database access granted successfully!');
                }}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors"
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
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span>Get Database Access</span>
              </button>
              
              <button
                onClick={() => {
                  const currentDebugMode = sessionStorage.getItem('debugMode') === 'true';
                  const newDebugMode = !currentDebugMode;
                  sessionStorage.setItem('debugMode', newDebugMode.toString());
                  
                  // Make sure admin authentication is set
                  if (newDebugMode && !sessionStorage.getItem('adminAuth')) {
                    sessionStorage.setItem('adminAuth', 'true');
                  }
                  
                  // Make sure admin password is set
                  if (newDebugMode && !sessionStorage.getItem('adminPassword')) {
                    sessionStorage.setItem('adminPassword', 'nex-devs919');
                  }
                  
                  toast.success(`Debug mode ${newDebugMode ? 'enabled' : 'disabled'}`);
                  
                  // Use a custom event that will work even in same tab
                  window.dispatchEvent(new Event('storage'));
                  window.dispatchEvent(new CustomEvent('storageChanged', {
                    detail: { key: 'debugMode', value: newDebugMode.toString() }
                  }));
                  
                  // Use smooth transition instead of reload for debug mode
                  if (newDebugMode) {
                    // Add a small delay to ensure the toast is visible before transition
                    setTimeout(() => {
                      if (typeof window !== 'undefined' && window.barba) {
                        window.barba.go(window.location.href);
                      } else {
                        // Fallback: trigger a custom event for debug mode change
                        window.dispatchEvent(new CustomEvent('debugModeChanged', { detail: { enabled: newDebugMode } }));
                      }
                    }, 500);
                  }
                }}
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
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
                <span>Debug</span>
              </button>
              
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

          {/* Debug Information */}
          <DebugPanelWrapper projects={projects} />

          <div className="mb-6">
            <h2 className="text-xl text-white font-semibold flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              All Projects
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              View and manage all your portfolio projects. You can edit, delete, or add new projects.
            </p>
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
            <div className="bg-gray-900/50 rounded-xl border border-purple-500/20 overflow-hidden shadow-lg">
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
                    {Array.isArray(projects) && projects.map((project) => (
                      <tr key={project.id} className="hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {project.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-12 w-12 relative rounded overflow-hidden">
                            <Image 
                              src={project.image_url || project.image || '/placeholder-image.jpg'} 
                              alt={project.title} 
                              fill 
                              className="object-cover"
                              sizes="48px"
                              unoptimized={Boolean(
                                (project.image_url && project.image_url.startsWith('data:')) || 
                                (project.image && project.image.startsWith('data:'))
                              )}
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
                                : project.status === 'Completed'
                                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            }`}>
                              {project.status}
                            </span>
                          ) : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <Link
                              href={`/hasnaat/projects/edit/${project.id}`}
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