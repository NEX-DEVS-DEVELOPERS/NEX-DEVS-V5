'use client'

import { useState, useEffect } from 'react'

export default function AddTestProject() {
  const [loading, setLoading] = useState(true)
  const [testResult, setTestResult] = useState<any>(null)
  const [message, setMessage] = useState('')
  
  useEffect(() => {
    async function testAPI() {
      try {
        const response = await fetch('/api/test')
        const data = await response.json()
        setTestResult(data)
        setLoading(false)
      } catch (error) {
        setMessage('Error testing API: ' + (error as Error).message)
        setLoading(false)
      }
    }
    
    testAPI()
  }, [])
  
  async function addTestProject() {
    try {
      setLoading(true)
      setMessage('Adding test project...')
      
      const testProject = {
        title: 'Test Project ' + new Date().toISOString(),
        description: 'This is a test project created to verify the database connection',
        image_url: '/placeholder-image.jpg',
        category: 'Test',
        technologies: ['React', 'Next.js', 'TypeScript'],
        project_link: 'https://example.com',
        featured: false
      }
      
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testProject)
      })
      
      if (!response.ok) {
        throw new Error('Failed to add test project: ' + response.status)
      }
      
      const result = await response.json()
      setMessage('Successfully added test project with ID: ' + result.id)
      
      // Refresh test data
      const testResponse = await fetch('/api/test')
      const testData = await testResponse.json()
      setTestResult(testData)
      
      setLoading(false)
    } catch (error) {
      setMessage('Error adding test project: ' + (error as Error).message)
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen pt-32 px-6 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-white">Database Test Page</h1>
        
        {loading ? (
          <div className="flex space-x-2 my-8">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        ) : (
          <>
            <div className="bg-gray-900 p-6 rounded-lg mb-6">
              <h2 className="text-xl font-semibold mb-2 text-white">Connection Status</h2>
              <pre className="bg-gray-800 p-4 rounded text-green-400 overflow-auto">
                {JSON.stringify(testResult?.connection, null, 2)}
              </pre>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-lg mb-6">
              <h2 className="text-xl font-semibold mb-2 text-white">Projects ({testResult?.projectsCount || 0})</h2>
              {testResult?.error ? (
                <div className="text-red-500">{testResult.error}</div>
              ) : (
                <pre className="bg-gray-800 p-4 rounded text-green-400 overflow-auto">
                  {JSON.stringify(testResult?.projects, null, 2)}
                </pre>
              )}
            </div>
            
            <div className="mb-8">
              <button 
                onClick={addTestProject}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg"
              >
                Add Test Project
              </button>
              
              {message && (
                <div className="mt-4 p-4 bg-gray-800 rounded-lg text-white">
                  {message}
                </div>
              )}
            </div>
            
            <div className="mt-8">
              <a href="/projects" className="text-purple-400 underline">
                Go to Projects Page
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  )
} 