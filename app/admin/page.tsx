'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const auth = sessionStorage.getItem('adminAuth')
    if (auth !== 'true') {
      router.push('/admin/login')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-white via-purple-400 to-blue-500 bg-clip-text text-transparent mb-8 text-center">
          Admin Dashboard
        </h1>
        
        <div className="space-y-4">
          <Link 
            href="/admin/projects"
            className="flex items-center justify-between p-4 rounded-lg border border-purple-500/30 bg-gray-900/50 hover:bg-gray-800 transition-colors w-full"
          >
            <div>
              <h2 className="text-xl font-semibold text-white">Projects</h2>
              <p className="text-sm text-gray-400">Manage your portfolio projects</p>
            </div>
            <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          
          <Link 
            href="/"
            className="flex items-center justify-between p-4 rounded-lg border border-gray-800 bg-gray-900/50 hover:bg-gray-800 transition-colors w-full"
          >
            <div>
              <h2 className="text-xl font-semibold text-white">Back to Site</h2>
              <p className="text-sm text-gray-400">Return to your website</p>
            </div>
            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
        </div>
        
        <div className="mt-12 text-center">
          <button 
            onClick={() => {
              sessionStorage.removeItem('adminAuth')
              router.push('/admin/login')
            }}
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
} 