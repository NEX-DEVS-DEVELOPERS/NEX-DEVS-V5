'use client'

import React, { Component, ReactNode } from 'react'
import { toast } from 'react-hot-toast'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

export default class ProModeErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details
    console.error('Pro Mode Error Boundary caught an error:', error, errorInfo)
    
    // Update state with error info
    this.setState({
      error,
      errorInfo
    })

    // Show user-friendly error message
    toast.error('Pro Mode management encountered an error. Please refresh the page.')

    // In production, you might want to send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to error reporting service
      // errorReportingService.captureException(error, { extra: errorInfo })
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <div className="bg-red-900/20 rounded-xl p-6 border border-red-500/30">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-red-400 mb-4">
              Pro Mode Management Error
            </h2>
            <p className="text-red-300 mb-6">
              Something went wrong while loading the Pro Mode management interface.
              This error has been logged for investigation.
            </p>
            
            <div className="space-y-4">
              <button
                onClick={this.handleRetry}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors mr-4"
              >
                Try Again
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Refresh Page
              </button>
            </div>

            {/* Error details for development */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-red-400 font-medium mb-2">
                  Error Details (Development Only)
                </summary>
                <div className="bg-gray-800 rounded-lg p-4 text-sm">
                  <div className="text-red-400 font-medium mb-2">Error:</div>
                  <pre className="text-red-300 whitespace-pre-wrap mb-4">
                    {this.state.error.toString()}
                  </pre>
                  
                  {this.state.errorInfo && (
                    <>
                      <div className="text-red-400 font-medium mb-2">Component Stack:</div>
                      <pre className="text-red-300 whitespace-pre-wrap text-xs">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
