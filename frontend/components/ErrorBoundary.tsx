'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { audiowide, vt323 } from '@/frontend/utils/fonts'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // In production, you might want to log this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: logErrorToService(error, errorInfo)
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="max-w-md w-full bg-red-900/20 backdrop-blur-sm border border-red-500/20 rounded-xl p-8 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className={`text-xl font-bold text-red-300 mb-4 ${audiowide.className}`}>
              Something went wrong
            </h2>
            <p className={`text-gray-300 mb-6 text-sm ${vt323.className}`}>
              We encountered an unexpected error. This has been logged and we'll look into it.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-red-400 text-sm mb-2">
                  Error Details (Development Only)
                </summary>
                <pre className="text-xs text-gray-400 bg-black/50 p-3 rounded overflow-auto max-h-32">
                  {this.state.error.message}
                  {'\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Higher-order component for easier usage
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode,
  onError?: (error: Error, errorInfo: ErrorInfo) => void
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback} onError={onError}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

// Specialized error boundaries for different contexts
export function ClientComponentErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Client component error:', error, errorInfo)
        // In production, log to error tracking service
      }}
      fallback={
        <div className="p-4 bg-yellow-900/20 border border-yellow-500/20 rounded-lg">
          <p className={`text-yellow-300 text-sm ${vt323.className}`}>
            ⚠️ Interactive features temporarily unavailable. The page content is still accessible.
          </p>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}

export function AnimationErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Animation error:', error, errorInfo)
      }}
      fallback={
        <div className="opacity-100">
          {/* Render children without animations as fallback */}
          {children}
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}

export function FormErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Form error:', error, errorInfo)
      }}
      fallback={
        <div className="p-6 bg-red-900/20 border border-red-500/20 rounded-lg text-center">
          <h3 className={`text-lg font-semibold text-red-300 mb-2 ${audiowide.className}`}>
            Form Error
          </h3>
          <p className={`text-gray-300 text-sm ${vt323.className}`}>
            There was an issue with the form. Please refresh the page and try again.
          </p>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}

export default ErrorBoundary
