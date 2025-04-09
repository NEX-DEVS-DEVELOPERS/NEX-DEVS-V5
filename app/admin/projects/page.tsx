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
  const [hasInitializedStorage, setHasInitializedStorage] = useState(false)
  const [isSeeding, setIsSeeding] = useState(false)

  // Fetch projects on component mount
  useEffect(() => {
    const initializeStorage = async () => {
      // Try to initialize JSON storage if needed (for first deployment)
      try {
        const response = await fetch('/api/projects/init-storage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'AdminAuth': sessionStorage.getItem('adminPassword') || ''
          }
        });
        
        if (response.ok) {
          setHasInitializedStorage(true);
          console.log('Storage initialized successfully');
        } else {
          console.log('Storage initialization not needed or unauthorized');
        }
      } catch (error) {
        console.error('Error initializing storage:', error);
      }
      
      // Fetch projects
      fetchProjects();
    };
    
    initializeStorage();
  }, []);

  // Function to seed database with sample projects
  const seedDatabase = async () => {
    if (!confirm('This will add sample projects to your database. Continue?')) {
      return;
    }

    setIsSeeding(true);
    
    try {
      const password = sessionStorage.getItem('adminPassword') || prompt('Enter admin password:');
      
      if (!password) {
        toast.error('Password required');
        setIsSeeding(false);
        return;
      }
      
      // Store password for future operations
      sessionStorage.setItem('adminPassword', password);
      
      const response = await fetch('/api/projects/seed-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'AdminAuth': password
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to seed database');
      }
      
      const result = await response.json();
      toast.success(`${result.message}`);
      
      // Refresh projects list
      fetchProjects();
      
      // Revalidate all project pages
      try {
        await fetch(`/api/revalidate?path=/projects&secret=${password}`);
        await fetch(`/api/revalidate?path=/&secret=${password}`);
      } catch (revalidateError) {
        console.error('Error revalidating pages:', revalidateError);
      }
      
    } catch (error) {
      console.error('Error seeding database:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to seed database');
    } finally {
      setIsSeeding(false);
    }
  };

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
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }
      
      // Safe JSON parsing with fallback to empty array
      let data = [];
      try {
        data = await response.json();
        
        // Verify data is a valid array
        if (!Array.isArray(data)) {
          console.error('Received invalid data format, expected array:', typeof data);
          data = [];
        }
      } catch (jsonError) {
        console.error('JSON parsing error:', jsonError);
        toast.error('Error parsing data from server');
        data = [];
      }
      
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects. Please try refreshing.');
      // Set empty array to avoid undefined errors
      setProjects([]);
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
      const response = await fetch(`/api/projects?id=${id}&password=${password}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Project deleted successfully')
        fetchProjects()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to delete project')
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      toast.error('Error deleting project')
    }
  }

  return (
    <AdminAuthCheck>
      <div className="min-h-screen bg-[#0a0a0a] pt-32 p-6">
        <Toaster position="top-right" />
        
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-purple-400 to-blue-500 bg-clip-text text-transparent">
                Projects Admin
              </h1>
              <p className="text-gray-400 mt-2">Manage your projects portfolio</p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/admin/projects/new" 
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Project
              </Link>
              
              <button 
                onClick={fetchProjects}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                disabled={isLoading}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {isLoading ? 'Refreshing...' : 'Refresh Data'}
              </button>
              
              <button
                onClick={seedDatabase}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                disabled={isSeeding}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                {isSeeding ? 'Adding Sample Data...' : 'Add Sample Projects'}
              </button>
              
              <Link 
                href="/" 
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                View Site
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