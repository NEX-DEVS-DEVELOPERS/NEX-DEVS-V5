'use client'

import { useState, useEffect } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import AdminAuthCheck from '@/app/components/AdminAuthCheck'
import Link from 'next/link'

export default function TestDatabasePage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dbStatus, setDbStatus] = useState<any>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const fetchDatabaseStatus = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Add timestamp to prevent caching
        const timestamp = new Date().getTime()
        const response = await fetch(`/api/test-neon?t=${timestamp}`, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          },
          cache: 'no-store'
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`)
        }
        
        const data = await response.json()
        setDbStatus(data)
      } catch (error) {
        console.error('Error fetching database status:', error)
        setError(error instanceof Error ? error.message : String(error))
      } finally {
        setLoading(false)
      }
    }
    
    fetchDatabaseStatus()
  }, [refreshKey])

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
    toast.success('Refreshing database status...')
  }

  const testCreateProject = async () => {
    try {
      toast.loading('Testing project creation...')
      
      // Get the database password from session storage or use the default
      const dbPassword = sessionStorage.getItem('databasePassword') || 'alihasnaat919'
      
      // Create a test project
      const testProject = {
        title: `Test Project ${new Date().toISOString()}`,
        description: 'This is a test project created from the admin panel',
        image: '/projects/placeholder.jpg',
        category: 'Test',
        technologies: ['Test'],
        project_link: 'https://example.com',
        featured: false,
        showBothImagesInPriority: true,
        password: dbPassword
      }
      
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Password': dbPassword
        },
        body: JSON.stringify(testProject)
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        toast.dismiss()
        toast.success(`Test project created with ID: ${data.id}`)
        // Refresh the database status
        handleRefresh()
      } else {
        throw new Error(data.error || 'Failed to create test project')
      }
    } catch (error) {
      toast.dismiss()
      toast.error(error instanceof Error ? error.message : String(error))
    }
  }

  return (
    <AdminAuthCheck>
      <div className="min-h-screen bg-[#0a0a0a] pt-32 p-6">
        <Toaster position="top-right" />
        
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-400 to-blue-500 bg-clip-text text-transparent">
                Database Test
              </h1>
              <p className="text-gray-400 mt-1">Test the Neon PostgreSQL database connection and schema</p>
              
              <div className="mt-3">
                <Link 
                  href="/admin/database" 
                  className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Database Management
                </Link>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Refreshing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh Status
                  </>
                )}
              </button>
              
              <button
                onClick={testCreateProject}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                disabled={loading}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Test Create Project
              </button>
            </div>
          </div>
          
          {error ? (
            <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 mb-6">
              <h3 className="text-red-400 font-medium mb-2">Error</h3>
              <p className="text-red-300">{error}</p>
            </div>
          ) : loading ? (
            <div className="bg-gray-900/50 rounded-xl border border-purple-500/20 p-6 flex justify-center items-center h-64">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Connection Status */}
              <div className="bg-gray-900/50 rounded-xl border border-purple-500/20 p-6">
                <h2 className="text-xl font-medium text-white mb-4">Connection Status</h2>
                <div className="flex items-center mb-4">
                  <div className={`w-3 h-3 rounded-full mr-2 ${dbStatus?.connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={`font-medium ${dbStatus?.connectionStatus === 'connected' ? 'text-green-400' : 'text-red-400'}`}>
                    {dbStatus?.connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-300 mb-2">Connection Details</h3>
                    <div className="bg-black/30 p-3 rounded-lg">
                      <pre className="text-xs text-gray-400 overflow-auto max-h-40">
                        {JSON.stringify(dbStatus?.connectionDetails, null, 2)}
                      </pre>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-300 mb-2">Database Stats</h3>
                    <div className="bg-black/30 p-3 rounded-lg">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-xs text-gray-500">Project Count:</p>
                          <p className="text-sm text-white">{dbStatus?.projectCount}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Database Initialized:</p>
                          <p className="text-sm text-white">{dbStatus?.databaseInitialized ? 'Yes' : 'No'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Schema Information */}
              <div className="bg-gray-900/50 rounded-xl border border-purple-500/20 p-6">
                <h2 className="text-xl font-medium text-white mb-4">Database Schema</h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-xs text-gray-400 uppercase bg-gray-800/50">
                      <tr>
                        <th className="px-4 py-2">Column Name</th>
                        <th className="px-4 py-2">Data Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dbStatus?.schemaInfo?.map((column: any, index: number) => (
                        <tr key={index} className={`border-b border-gray-800 ${index % 2 === 0 ? 'bg-black/20' : 'bg-black/10'}`}>
                          <td className="px-4 py-2 font-medium">
                            {column.column_name}
                            {column.column_name === 'show_both_images_in_priority' && (
                              <span className="ml-2 px-1.5 py-0.5 text-xs bg-purple-900/50 text-purple-300 rounded-full">
                                Key Field
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-2">{column.data_type}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Featured Projects */}
              <div className="bg-gray-900/50 rounded-xl border border-purple-500/20 p-6">
                <h2 className="text-xl font-medium text-white mb-4">Featured Projects</h2>
                
                {dbStatus?.featuredProjects?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dbStatus.featuredProjects.map((project: any) => (
                      <div key={project.id} className="bg-black/30 rounded-lg p-4">
                        <h3 className="font-medium text-white mb-2">{project.title}</h3>
                        <div className="text-xs text-gray-400 space-y-1">
                          <p>ID: {project.id}</p>
                          <p>Image: {project.image}</p>
                          <p>showBothImagesInPriority: {String(project.showBothImagesInPriority)}</p>
                          <p>show_both_images_in_priority: {String(project.show_both_images_in_priority)}</p>
                          <p>isCodeScreenshot: {String(project.isCodeScreenshot)}</p>
                          <p>is_code_screenshot: {String(project.is_code_screenshot)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No featured projects found.</p>
                )}
              </div>
              
              {/* Raw Debug Status */}
              <div className="bg-gray-900/50 rounded-xl border border-purple-500/20 p-6">
                <h2 className="text-xl font-medium text-white mb-4">Raw Debug Status</h2>
                <div className="bg-black/30 p-3 rounded-lg">
                  <pre className="text-xs text-gray-400 overflow-auto max-h-96">
                    {JSON.stringify(dbStatus, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminAuthCheck>
  )
} 