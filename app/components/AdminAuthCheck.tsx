'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminAuthCheck({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // First check sessionStorage for quick client-side validation
        const auth = sessionStorage.getItem('adminAuth')
        const adminPassword = sessionStorage.getItem('adminPassword')
        const databasePassword = sessionStorage.getItem('databasePassword')

        if (auth === 'true' && adminPassword && databasePassword) {
          // Also verify with server-side cookie
          const response = await fetch('/api/test-auth', {
            method: 'GET',
            credentials: 'include'
          })

          if (response.ok) {
            // Authentication verified - no console logging for security
            setIsAuthenticated(true)
          } else {
            // Server-side authentication failed - no console logging for security
            sessionStorage.clear()
            router.push('/hasnaat/login')
          }
        } else {
          // Client-side authentication data missing - no console logging for security
          sessionStorage.clear()
          router.push('/hasnaat/login')
        }
      } catch (error) {
        // Authentication check failed - no console logging for security
        sessionStorage.clear()
        router.push('/hasnaat/login')
      }

      setIsLoading(false)
    }

    checkAuthentication()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    )
  }

  return isAuthenticated ? <>{children}</> : null
} 
