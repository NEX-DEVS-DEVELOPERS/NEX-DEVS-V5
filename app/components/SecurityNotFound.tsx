'use client'

import Link from 'next/link'
import { useEffect } from 'react'

interface SecurityNotFoundProps {
  reason?: 'legacy_path' | 'blocked_access' | 'not_found'
  pathname?: string
}

export default function SecurityNotFound({ reason = 'not_found', pathname }: SecurityNotFoundProps) {
  useEffect(() => {
    // Log the security event without revealing details
    if (reason === 'legacy_path') {
      console.log('404: Page not found')
    } else if (reason === 'blocked_access') {
      console.log('404: Page not found')
    }
  }, [reason])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Error Display */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-4">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-white mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-400 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Navigation Options */}
        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Go to Homepage
          </Link>
          
          <Link
            href="/projects"
            className="block w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            View Projects
          </Link>
          
          <Link
            href="/contact"
            className="block w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Contact Us
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-sm text-gray-500">
          <p>If you believe this is an error, please contact support.</p>
        </div>

        {/* Subtle Animation */}
        <div className="mt-8 flex justify-center space-x-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  )
}

