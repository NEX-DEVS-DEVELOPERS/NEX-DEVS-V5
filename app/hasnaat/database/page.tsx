'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminAuthCheck from '@/app/components/AdminAuthCheck'
import { toast, Toaster } from 'react-hot-toast'

export default function DatabaseAdminPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [dbStatus, setDbStatus] = useState<any>(null)
  const [exportedData, setExportedData] = useState<any>(null)
  const [fileContent, setFileContent] = useState<string>('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    // Try to get password from session storage
    const savedPassword = window.sessionStorage.getItem('adminPassword')
    if (savedPassword) {
      setPassword(savedPassword)
    } else {
      // Set default admin password if not found in session storage
      const defaultPassword = 'nex-devs.org889123';
      setPassword(defaultPassword);
      window.sessionStorage.setItem('adminPassword', defaultPassword);
    }
  }, [])

  useEffect(() => {
    const fetchDatabaseStatus = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Add cache-busting parameters
        const timestamp = Date.now()
        const randomValue = Math.floor(Math.random() * 1000000)
        
        const response = await fetch(`/api/test-neon?t=${timestamp}&r=${randomValue}`, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        })
        
        if (!response.ok) {
          throw new Error(`Error fetching database status: ${response.status}`)
        }
        
        const data = await response.json()
        setDbStatus(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        console.error('Error fetching database status:', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchDatabaseStatus()
  }, [refreshKey])

  // Get database status
  const checkDatabaseStatus = async () => {
    if (!password) {
      toast.error('Admin password required')
      return
    }

    setIsLoading(true)
    try {
      // Adding timestamp to prevent caching
      const timestamp = Date.now()
      const response = await fetch(`/api/projects?action=status&t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${password}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
      }

      const data = await response.json()
      setDbStatus(data)
      toast.success('Database status retrieved')
    } catch (error) {
      console.error('Error checking database status:', error)
      toast.error('Failed to check database status')
    } finally {
      setIsLoading(false)
    }
  }

  // Export the database
  const exportDatabase = async () => {
    if (!password) {
      toast.error('Admin password required')
      return
    }

    setIsLoading(true)
    try {
      // Adding timestamp to prevent caching
      const timestamp = Date.now()
      const response = await fetch(`/api/export-db?password=${password}&t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
      }

      const data = await response.json()
      setExportedData(data)
      
      // Create a download link for the data
      const jsonString = JSON.stringify(data.data, null, 2)
      const blob = new Blob([jsonString], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.download = `portfolio-db-backup-${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(a)
      a.click()
      
      // Cleanup
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast.success(`Exported ${data.count} projects successfully`)
    } catch (error) {
      console.error('Error exporting database:', error)
      toast.error('Failed to export database')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle file selection for import
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setFileContent(event.target?.result as string)
    }
    reader.readAsText(file)
  }

  // Import the database
  const importDatabase = async (clearExisting: boolean = false) => {
    if (!password) {
      toast.error('Admin password required')
      return
    }

    if (!fileContent) {
      toast.error('No file selected for import')
      return
    }

    setIsLoading(true)
    try {
      let projectsData
      try {
        projectsData = JSON.parse(fileContent)
      } catch (error) {
        throw new Error('Invalid JSON format in the import file')
      }

      // If the data has a 'data' property, it's probably from our export format
      const projects = Array.isArray(projectsData) ? projectsData : 
                      (projectsData.data && Array.isArray(projectsData.data)) ? projectsData.data : null

      if (!projects) {
        throw new Error('Could not find valid projects array in the import file')
      }

      // Adding timestamp to prevent caching
      const timestamp = Date.now()
      const response = await fetch(`/api/import-db?clear=${clearExisting}&t=${timestamp}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        },
        body: JSON.stringify({
          password,
          projects
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error: ${response.status}`)
      }

      const data = await response.json()
      toast.success(data.message)
      
      // Clear the file input
      setFileContent('')
      const fileInput = document.getElementById('fileInput') as HTMLInputElement
      if (fileInput) fileInput.value = ''
      
      // Refresh project data
      await fetch(`/api/revalidate?path=/projects&secret=${password}&t=${timestamp}`)
      await fetch(`/api/revalidate?path=/&secret=${password}&t=${timestamp}`)
      
    } catch (error) {
      console.error('Error importing database:', error)
      toast.error(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
    toast.success('Refreshing database status...')
  }

  const handleTestConnection = async () => {
    try {
      toast.loading('Testing database connection...')
      
      const response = await fetch('/api/test-neon', {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
      
      if (!response.ok) {
        throw new Error(`Error testing connection: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.status === 'connected') {
        toast.dismiss()
        toast.success('Database connection successful!')
        setRefreshKey(prev => prev + 1)
      } else {
        toast.dismiss()
        toast.error(`Connection failed: ${data.message || 'Unknown error'}`)
      }
    } catch (err) {
      toast.dismiss()
      toast.error(err instanceof Error ? err.message : 'Unknown error')
      console.error('Error testing connection:', err)
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
                Database Management
              </h1>
              <p className="text-gray-400 mt-1">Manage your portfolio database</p>
              
              <div className="mt-3">
                <Link 
                  href="/admin/database/test" 
                  className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Go to Database Test Page
                </Link>
              </div>
            </div>
            
            <Link 
              href="/admin/projects" 
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Projects
            </Link>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-6 border border-purple-500/20 mb-8">
            <h2 className="text-xl text-white font-semibold mb-4">Authentication</h2>
            
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">Admin Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  window.sessionStorage.setItem('adminPassword', e.target.value)
                }}
                className="w-full px-3 py-2 bg-black/50 border border-gray-700 rounded-md text-white"
                placeholder="Enter admin password"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-900/50 rounded-xl p-6 border border-purple-500/20">
              <h2 className="text-xl text-white font-semibold mb-4">Database Status</h2>
              
              <button
                onClick={checkDatabaseStatus}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md mb-4 disabled:opacity-50"
              >
                {isLoading ? 'Loading...' : 'Check Database Status'}
              </button>
              
              {dbStatus && (
                <div className="bg-black/30 rounded-md p-4 border border-gray-700">
                  <h3 className="text-purple-400 font-medium mb-2">Status Information</h3>
                  <div className="space-y-2 text-sm text-gray-300">
                    <p><span className="text-gray-400">Path:</span> {dbStatus.path}</p>
                    <p><span className="text-gray-400">Projects:</span> {dbStatus.count}</p>
                    <p><span className="text-gray-400">File Size:</span> {dbStatus.size} bytes</p>
                    <p><span className="text-gray-400">Last Modified:</span> {dbStatus.lastModified}</p>
                    <p><span className="text-gray-400">Environment:</span> {dbStatus.environment}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-gray-900/50 rounded-xl p-6 border border-purple-500/20">
              <h2 className="text-xl text-white font-semibold mb-4">Export Database</h2>
              
              <button
                onClick={exportDatabase}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md mb-4 disabled:opacity-50"
              >
                {isLoading ? 'Exporting...' : 'Export Database as JSON'}
              </button>
              
              {exportedData && (
                <div className="bg-black/30 rounded-md p-4 border border-gray-700">
                  <h3 className="text-purple-400 font-medium mb-2">Export Summary</h3>
                  <div className="space-y-2 text-sm text-gray-300">
                    <p><span className="text-gray-400">Projects Exported:</span> {exportedData.count}</p>
                    <p><span className="text-gray-400">Backup File:</span> {exportedData.backupFile}</p>
                    <p><span className="text-gray-400">Size:</span> {JSON.stringify(exportedData.data).length} bytes</p>
                    <p><span className="text-gray-400">Time:</span> {new Date().toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-6 border border-purple-500/20">
            <h2 className="text-xl text-white font-semibold mb-4">Import Database</h2>
            
            <div className="mb-6">
              <label htmlFor="fileInput" className="block text-sm font-medium text-gray-300 mb-2">JSON Backup File</label>
              <input
                type="file"
                id="fileInput"
                accept=".json"
                onChange={handleFileChange}
                className="w-full px-3 py-2 bg-black/50 border border-gray-700 rounded-md text-white"
              />
              <p className="text-xs text-gray-500 mt-1">Select a JSON file containing project data to import</p>
            </div>
            
            {fileContent && (
              <div className="bg-black/30 rounded-md p-4 border border-gray-700 mb-4">
                <h3 className="text-purple-400 font-medium mb-2">File Information</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <p><span className="text-gray-400">Size:</span> {fileContent.length} bytes</p>
                  <p><span className="text-gray-400">Projects:</span> {
                    (() => {
                      try {
                        const data = JSON.parse(fileContent);
                        const projects = Array.isArray(data) ? data : 
                                      (data.data && Array.isArray(data.data)) ? data.data : [];
                        return projects.length;
                      } catch (e) {
                        return 'Error parsing JSON';
                      }
                    })()
                  }</p>
                </div>
              </div>
            )}
            
            <div className="flex space-x-4">
              <button
                onClick={() => importDatabase(false)}
                disabled={isLoading || !fileContent}
                className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md disabled:opacity-50"
              >
                {isLoading ? 'Importing...' : 'Import (Add Only)'}
              </button>
              
              <button
                onClick={() => importDatabase(true)}
                disabled={isLoading || !fileContent}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md disabled:opacity-50"
              >
                {isLoading ? 'Importing...' : 'Import (Replace All)'}
              </button>
            </div>
            
            <p className="text-xs text-red-400 mt-2">
              Warning: "Replace All" will delete all existing projects before importing. This action cannot be undone!
            </p>
          </div>
          
          <div className="bg-gray-900/50 rounded-xl p-6 border border-purple-500/20 mt-8">
            <h2 className="text-xl text-white font-semibold mb-4">Tips for Netlify Deployment</h2>
            
            <div className="space-y-3 text-sm text-gray-300">
              <p><span className="text-purple-400 font-semibold">1.</span> Export your database locally before deploying to Netlify.</p>
              <p><span className="text-purple-400 font-semibold">2.</span> After deploying to Netlify, use the Import feature to restore your projects.</p>
              <p><span className="text-purple-400 font-semibold">3.</span> Netlify uses an ephemeral filesystem, so data changes may not persist between deploys.</p>
              <p><span className="text-purple-400 font-semibold">4.</span> Regularly export your database to back up your data.</p>
              <p><span className="text-purple-400 font-semibold">5.</span> The database path on Netlify is typically different from your local environment.</p>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-6 border border-purple-500/20 mt-8">
            <h2 className="text-xl text-white font-semibold mb-4">Neon Database Status</h2>
            
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={loading}
              >
                Refresh Status
              </button>
              <button
                onClick={handleTestConnection}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                disabled={loading}
              >
                Test Connection
              </button>
            </div>
            
            {loading && (
              <div className="bg-gray-800/70 border border-purple-500/30 rounded-lg p-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                <span className="ml-3 text-purple-300">Loading database status...</span>
              </div>
            )}
            
            {error && !loading && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
                <h2 className="text-red-400 text-lg font-semibold mb-2">Error</h2>
                <p className="text-red-300">{error}</p>
              </div>
            )}
            
            {dbStatus && !loading && !error && (
              <div className="space-y-6">
                {/* Connection Status */}
                <div className="bg-gray-800/70 border border-purple-500/30 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Connection Status</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-900/50 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm">Status</p>
                      <p className={`text-lg font-medium ${dbStatus.status === 'connected' ? 'text-green-400' : 'text-red-400'}`}>
                        {dbStatus.status === 'connected' ? 'Connected' : 'Disconnected'}
                      </p>
                    </div>
                    <div className="bg-gray-900/50 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm">Last Updated</p>
                      <p className="text-white">{new Date(dbStatus.timestamp).toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-900/50 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm">Project Count</p>
                      <p className="text-white">{dbStatus.projectCount}</p>
                    </div>
                    <div className="bg-gray-900/50 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm">Environment</p>
                      <p className="text-white">{dbStatus.debugStatus?.environment || 'Unknown'}</p>
                    </div>
                  </div>
                </div>
                
                {/* Featured Projects */}
                {dbStatus.featuredProjects && dbStatus.featuredProjects.length > 0 && (
                  <div className="bg-gray-800/70 border border-purple-500/30 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Sample Projects</h2>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-gray-900/50 rounded-lg">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 text-left text-gray-400">ID</th>
                            <th className="px-4 py-2 text-left text-gray-400">Title</th>
                            <th className="px-4 py-2 text-left text-gray-400">Category</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dbStatus.featuredProjects.map((project: any) => (
                            <tr key={project.id} className="border-t border-gray-800">
                              <td className="px-4 py-2 text-white">{project.id}</td>
                              <td className="px-4 py-2 text-white">{project.title}</td>
                              <td className="px-4 py-2 text-white">{project.category}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                
                {/* Debug Info */}
                {dbStatus.debugStatus && (
                  <div className="bg-gray-800/70 border border-purple-500/30 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Debug Information</h2>
                    
                    <div className="mb-4">
                      <h3 className="text-lg text-purple-300 mb-2">Connection Stats</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-900/50 p-4 rounded-lg">
                          <p className="text-gray-400 text-sm">Connection Attempts</p>
                          <p className="text-white">{dbStatus.debugStatus.database?.connectionAttempts || 0}</p>
                        </div>
                        <div className="bg-gray-900/50 p-4 rounded-lg">
                          <p className="text-gray-400 text-sm">Successful Connections</p>
                          <p className="text-white">{dbStatus.debugStatus.database?.successfulConnections || 0}</p>
                        </div>
                        <div className="bg-gray-900/50 p-4 rounded-lg">
                          <p className="text-gray-400 text-sm">Failed Connections</p>
                          <p className="text-white">{dbStatus.debugStatus.database?.failedConnections || 0}</p>
                        </div>
                      </div>
                    </div>
                    
                    {dbStatus.debugStatus.database?.operationLog && (
                      <div>
                        <h3 className="text-lg text-purple-300 mb-2">Recent Operations</h3>
                        <div className="overflow-x-auto">
                          <table className="min-w-full bg-gray-900/50 rounded-lg">
                            <thead>
                              <tr>
                                <th className="px-4 py-2 text-left text-gray-400">Timestamp</th>
                                <th className="px-4 py-2 text-left text-gray-400">Operation</th>
                                <th className="px-4 py-2 text-left text-gray-400">Status</th>
                                <th className="px-4 py-2 text-left text-gray-400">Details</th>
                              </tr>
                            </thead>
                            <tbody>
                              {dbStatus.debugStatus.database.operationLog.map((log: any, index: number) => (
                                <tr key={index} className="border-t border-gray-800">
                                  <td className="px-4 py-2 text-white">{new Date(log.timestamp).toLocaleTimeString()}</td>
                                  <td className="px-4 py-2 text-white">{log.operation}</td>
                                  <td className={`px-4 py-2 ${log.status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                    {log.status}
                                  </td>
                                  <td className="px-4 py-2 text-white">
                                    {log.details ? (
                                      <pre className="text-xs overflow-x-auto">
                                        {JSON.stringify(log.details, null, 2)}
                                      </pre>
                                    ) : (
                                      <span className="text-gray-400">No details</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Raw Response */}
                <div className="bg-gray-800/70 border border-purple-500/30 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-white">Raw Response</h2>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(dbStatus, null, 2))
                        toast.success('Copied to clipboard!')
                      }}
                      className="px-3 py-1 bg-gray-700 text-white text-sm rounded hover:bg-gray-600 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                  <pre className="bg-gray-900/50 p-4 rounded-lg text-gray-300 text-sm overflow-x-auto max-h-96">
                    {JSON.stringify(dbStatus, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminAuthCheck>
  )
} 