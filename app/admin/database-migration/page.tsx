'use client'

import { useState, useEffect } from 'react'
import { getDatabaseStatus } from '@/app/actions'
import Link from 'next/link'

export default function DatabaseMigrationPage() {
  const [password, setPassword] = useState('')
  const [shouldClear, setShouldClear] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [mysqlStatus, setMysqlStatus] = useState<any>(null)
  const [neonStatus, setNeonStatus] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Get initial database status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/debug', {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setMysqlStatus(data);
        }
      } catch (err) {
        console.error('Error fetching MySQL status:', err);
      }
      
      try {
        const neonStatusResponse = await getDatabaseStatus();
        if (neonStatusResponse.success) {
          setNeonStatus(neonStatusResponse.data);
        }
      } catch (err) {
        console.error('Error fetching Neon status:', err);
      }
    };
    
    fetchStatus();
    
    // Refresh status every 30 seconds
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);
  
  // Handle migration
  const handleMigrate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await fetch('/api/migrate-to-neon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          password,
          shouldClear 
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || 'Migration failed');
      } else {
        setResult(data);
        
        // Refresh database status after migration
        try {
          const neonStatusResponse = await getDatabaseStatus();
          if (neonStatusResponse.success) {
            setNeonStatus(neonStatusResponse.data);
          }
        } catch (err) {
          console.error('Error fetching updated Neon status:', err);
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during migration');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">Database Migration: MySQL to Neon PostgreSQL</h1>
        
        <div className="mt-3 md:mt-0">
          <Link 
            href="/admin/database/test" 
            className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Go to Database Test Page
          </Link>
        </div>
      </div>
      
      {/* Database Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* MySQL Status */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-200">Source: MySQL Status</h2>
          {mysqlStatus ? (
            <div className="space-y-3">
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-400">Connection Status:</span>
                <span className={mysqlStatus.database?.connectivity === 'connected' ? 'text-green-500' : 'text-red-500'}>
                  {mysqlStatus.database?.connectivity || 'Unknown'}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-400">Total Projects:</span>
                <span className="text-gray-200">{mysqlStatus.database?.projects?.total || 'Unknown'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-400">Featured Projects:</span>
                <span className="text-gray-200">{mysqlStatus.database?.projects?.featured || 'Unknown'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Environment:</span>
                <span className="text-gray-200">{mysqlStatus.environment || 'Unknown'}</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="spinner"></div>
              <div className="text-gray-400 mt-2">Loading MySQL status...</div>
            </div>
          )}
        </div>
        
        {/* Neon Status */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-200">Target: Neon PostgreSQL Status</h2>
          {neonStatus ? (
            <div className="space-y-3">
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-400">Connection Status:</span>
                <span className={neonStatus.database?.connectivity === 'connected' ? 'text-green-500' : 'text-red-500'}>
                  {neonStatus.database?.connectivity || 'Unknown'}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-400">Total Projects:</span>
                <span className="text-gray-200">{neonStatus.database?.projects?.total || 'Unknown'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-400">Featured Projects:</span>
                <span className="text-gray-200">{neonStatus.database?.projects?.featured || 'Unknown'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Environment:</span>
                <span className="text-gray-200">{neonStatus.environment || 'Unknown'}</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="spinner"></div>
              <div className="text-gray-400 mt-2">Loading Neon status...</div>
            </div>
          )}
        </div>
      </div>
      
      {/* Migration Form */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-200">Migrate Data</h2>
        <form onSubmit={handleMigrate} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="password" className="block text-gray-300">Admin Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              required
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="shouldClear"
              checked={shouldClear}
              onChange={(e) => setShouldClear(e.target.checked)}
              className="rounded bg-gray-700 border-gray-600 text-purple-600 focus:ring-purple-600"
            />
            <label htmlFor="shouldClear" className="text-gray-300">
              Clear existing data in Neon before migration (WARNING: This will delete all existing data)
            </label>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Migrating...' : 'Start Migration'}
          </button>
        </form>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-2 text-red-300">Error</h2>
          <p className="text-white">{error}</p>
        </div>
      )}
      
      {/* Migration Result */}
      {result && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-200">Migration Result</h2>
          
          <div className="space-y-4">
            <div className="border border-gray-700 rounded-lg p-4 bg-gray-900/50">
              <div className="flex justify-between border-b border-gray-700 pb-2 mb-2">
                <span className="text-gray-300">Status:</span>
                <span className="text-green-500">Success</span>
              </div>
              
              <div className="flex justify-between border-b border-gray-700 pb-2 mb-2">
                <span className="text-gray-300">Total Projects:</span>
                <span className="text-white">{result.results.total}</span>
              </div>
              
              <div className="flex justify-between border-b border-gray-700 pb-2 mb-2">
                <span className="text-gray-300">Successfully Migrated:</span>
                <span className="text-green-500">{result.results.success}</span>
              </div>
              
              <div className="flex justify-between border-b border-gray-700 pb-2 mb-2">
                <span className="text-gray-300">Failed:</span>
                <span className={result.results.failed > 0 ? "text-red-500" : "text-green-500"}>
                  {result.results.failed}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-300">Timestamp:</span>
                <span className="text-white">{new Date(result.timestamp).toLocaleString()}</span>
              </div>
            </div>
            
            {/* Neon Database Summary After Migration */}
            {result.neonSummary && (
              <div className="border border-gray-700 rounded-lg p-4 bg-gray-900/50">
                <h3 className="text-lg font-semibold mb-2 text-purple-300">Neon Database Summary</h3>
                
                <div className="flex justify-between border-b border-gray-700 pb-2 mb-2">
                  <span className="text-gray-300">Total Projects:</span>
                  <span className="text-white">{result.neonSummary.totalProjects}</span>
                </div>
                
                <div className="flex justify-between border-b border-gray-700 pb-2 mb-2">
                  <span className="text-gray-300">Featured Projects:</span>
                  <span className="text-white">{result.neonSummary.featuredProjects}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-300">Categories:</span>
                  <span className="text-white">
                    {result.neonSummary.categories ? result.neonSummary.categories.join(', ') : 'None'}
                  </span>
                </div>
              </div>
            )}
            
            {/* Failed Migrations */}
            {result.results.failed > 0 && (
              <div className="border border-gray-700 rounded-lg p-4 bg-gray-900/50">
                <h3 className="text-lg font-semibold mb-2 text-red-300">Failed Migrations</h3>
                
                <div className="space-y-2 max-h-60 overflow-auto">
                  {result.results.errors.map((error: any, index: number) => (
                    <div key={index} className="border-b border-gray-700 pb-2">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Project:</span>
                        <span className="text-white">{error.title} (ID: {error.id})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Error:</span>
                        <span className="text-red-400">{error.error}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* CSS for spinner */}
      <style jsx>{`
        .spinner {
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          border-top: 3px solid #a855f7;
          width: 24px;
          height: 24px;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
} 