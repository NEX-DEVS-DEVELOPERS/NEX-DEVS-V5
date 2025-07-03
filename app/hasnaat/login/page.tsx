'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import SecurityNotFound from '@/app/components/SecurityNotFound'

function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isBlocked, setIsBlocked] = useState(false)
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [checkingAccess, setCheckingAccess] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get redirect URL from query params
  const redirectUrl = searchParams.get('redirect') || '/hasnaat/projects'

  // Check security status and authentication
  useEffect(() => {
    const checkSecurityAndAuth = async () => {
      try {
        // Check security status first
        const securityResponse = await fetch('/api/security/check')
        const securityData = await securityResponse.json()

        if (securityData.isBlocked) {
          setIsBlocked(true)
          setCheckingAccess(false)
          return
        }

        setFailedAttempts(securityData.failedAttempts || 0)

        // Check if user is already authenticated
        const adminAuth = sessionStorage.getItem('adminAuth')
        const adminPassword = sessionStorage.getItem('adminPassword')
        const databasePassword = sessionStorage.getItem('databasePassword')

        if (adminAuth === 'true' && adminPassword && databasePassword) {
          // User is already authenticated, redirect to intended page
          router.push(redirectUrl)
          return
        }

        setCheckingAccess(false)
      } catch (error) {
        // Security check failed - no client-side logging for security
        setCheckingAccess(false)
      }
    }

    checkSecurityAndAuth()
  }, [router, redirectUrl])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const result = await res.json()

      if (res.ok) {
        // Login successful - no client-side logging for security

        // Reset security state on successful login
        await fetch('/api/security/reset', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ adminPassword: password }),
        })

        // Store authentication state and passwords from server response
        sessionStorage.setItem('adminAuth', 'true')
        sessionStorage.setItem('adminPassword', password) // Store admin password for API calls
        sessionStorage.setItem('databasePassword', result.databasePassword) // ✅ Get from server env

        // Redirect to intended page
        router.push(redirectUrl)
      } else {
        // Login failed - no client-side logging for security

        // Record failed attempt with comprehensive security monitoring
        const securityResponse = await fetch('/api/security/block', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            reason: 'failed_login',
            details: {
              username,
              timestamp: new Date().toISOString(),
              attemptedFrom: 'hasnaat_login_page'
            }
          }),
        })

        const securityData = await securityResponse.json()
        setFailedAttempts(securityData.failedAttempts || 0)

        // Check if access is now blocked
        if (securityData.isBlocked) {
          setIsBlocked(true)
          return
        }

        setError('Invalid credentials')

        // All debug info removed for security - no browser console logging
      }
    } catch (error) {
      // Network error - no client-side logging for security
      setError('Network error. Please try again.')
    }

    setIsLoading(false)
  }

  // Show loading screen while checking access
  if (checkingAccess) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4 pt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Checking access...</p>
        </div>
      </div>
    )
  }

  // Show 404 page if access is blocked
  if (isBlocked) {
    return <SecurityNotFound reason="blocked_access" pathname="/hasnaat/login" />
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4 pt-16">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold bg-gradient-to-r from-white via-purple-400 to-blue-500 bg-clip-text text-transparent">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Enter your password to access the admin panel
          </p>
        </div>
        
        <div className="mt-8 bg-gray-900/50 p-6 rounded-lg border border-purple-500/20 shadow-lg">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-purple-500/30 rounded-md shadow-sm placeholder-gray-500 bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-purple-500/30 rounded-md shadow-sm placeholder-gray-500 bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-sm font-medium">
                {error}
              </div>
            )}

            {failedAttempts > 0 && !isBlocked && (
              <div className="text-yellow-400 text-sm font-medium">
                Warning: {failedAttempts}/2 failed attempts. Access will be blocked after 2 failed attempts.
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>
        </div>
        
        <div className="text-center mt-4">
          <Link href="/" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function AdminLogin() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4 pt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
} 