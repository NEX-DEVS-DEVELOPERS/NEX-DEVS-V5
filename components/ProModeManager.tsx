'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import {
  validateDuration,
  validateDate,
  validateMaintenanceMessage,
  validateProModeConfig,
  sanitizeProModeConfig,
  formatValidationError,
  isProductionSafe,
  type ValidationResult
} from '@/utils/proModeValidation'
import { proModeNotifications } from '@/components/ProModeNotifications'

interface ProModeStatus {
  isUnderMaintenance: boolean
  maintenanceMessage: string
  maintenanceEndDate: string
  showCountdown: boolean
  timeRemaining: {
    days: number
    hours: number
    minutes: number
    seconds: number
  }
  daysRemaining: number
  hoursRemaining: number
  minutesRemaining: number
  secondsRemaining: number
  isExpired: boolean
}

interface ProModeManagerProps {
  onStatusChange?: (status: ProModeStatus) => void
  onPendingChange?: () => void
}

export default function ProModeManager({ onStatusChange, onPendingChange }: ProModeManagerProps) {
  const [status, setStatus] = useState<ProModeStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [durationDays, setDurationDays] = useState<number>(30)
  const [customDate, setCustomDate] = useState<string>('')
  const [maintenanceMessage, setMaintenanceMessage] = useState<string>('')
  const [activeAction, setActiveAction] = useState<string | null>(null)
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null)
  const [isOnline, setIsOnline] = useState(true)

  // Fetch current Pro Mode status
  const fetchStatus = async () => {
    try {
      const password = localStorage.getItem('adminPassword') || 'nex-devs.org889123'
      const response = await fetch('/api/admin/pro-mode', {
        headers: {
          'Authorization': `Bearer ${password}`
        }
      })

      if (response.ok) {
        const result = await response.json()
        setStatus(result.data)
        setMaintenanceMessage(result.data.maintenanceMessage)
        setLastUpdateTime(new Date())
        setIsOnline(true)
        onStatusChange?.(result.data)
      } else {
        if (response.status === 401) {
          proModeNotifications.error('Authentication Failed', 'Please check your admin credentials')
        } else if (response.status === 429) {
          proModeNotifications.warning('Rate Limited', 'Too many requests. Status updates paused temporarily.')
        } else {
          proModeNotifications.error('Fetch Failed', 'Failed to fetch Pro Mode status')
        }
        setIsOnline(false)
      }
    } catch (error) {
      console.error('Error fetching Pro Mode status:', error)
      setIsOnline(false)

      if (error instanceof TypeError && error.message.includes('fetch')) {
        proModeNotifications.error('Connection Error', 'Unable to connect to server')
      } else {
        proModeNotifications.error('Unexpected Error', 'Error fetching status')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Update Pro Mode configuration
  const updateProMode = async (action: string, data?: any) => {
    setIsUpdating(true)
    setActiveAction(action)

    // Show loading notification
    const loadingToast = proModeNotifications.loading('Pro Mode Update', 'Processing your request...')

    try {
      const password = localStorage.getItem('adminPassword') || 'nex-devs.org889123'
      const response = await fetch('/api/admin/pro-mode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${password}`
        },
        body: JSON.stringify({ action, data })
      })

      // Dismiss loading toast
      proModeNotifications.dismiss(loadingToast)

      if (response.ok) {
        const result = await response.json()

        // Show specific success notifications based on action
        switch (action) {
          case 'toggle':
            if (result.data.action === 'enabled') {
              proModeNotifications.proModeEnabled()
            } else {
              proModeNotifications.proModeDisabled()
            }
            break
          case 'set-duration':
            proModeNotifications.durationUpdated(data.days)
            break
          case 'set-custom-date':
            proModeNotifications.dateUpdated(data.customDate)
            break
          case 'update-message':
            proModeNotifications.messageUpdated()
            break
          default:
            proModeNotifications.success('Success', result.message)
        }

        // Notify parent component about pending changes
        onPendingChange?.()

        // Refresh status to get updated data
        await fetchStatus()

        await fetchStatus() // Refresh status
      } else {
        const error = await response.json()

        // Handle specific error types
        if (response.status === 429) {
          proModeNotifications.error('Rate Limited', 'Too many requests. Please wait before trying again.')
        } else if (response.status === 401) {
          proModeNotifications.error('Unauthorized', 'Invalid credentials. Please check your admin password.')
        } else {
          proModeNotifications.error('Update Failed', error.error || 'Failed to update Pro Mode')
        }
      }
    } catch (error) {
      console.error('Error updating Pro Mode:', error)
      proModeNotifications.dismiss(loadingToast)

      if (error instanceof TypeError && error.message.includes('fetch')) {
        proModeNotifications.error('Connection Error', 'Unable to connect to server. Please check your internet connection.')
      } else {
        proModeNotifications.error('Unexpected Error', 'An unexpected error occurred. Please try again.')
      }
    } finally {
      setIsUpdating(false)
      setActiveAction(null)
    }
  }

  // Toggle Pro Mode (now just marks as pending)
  const toggleProMode = () => {
    // Just notify parent about pending changes instead of immediate API call
    onPendingChange?.()
    toast.success('Pro Mode toggle marked for sync. Click "Apply All Changes" to update the live website.')
  }

  // Set duration in days (now just marks as pending)
  const setDuration = () => {
    const validation = validateDuration(durationDays)
    if (!validation.isValid) {
      proModeNotifications.error('Invalid Duration', formatValidationError(validation))
      return
    }

    if (validation.warnings) {
      validation.warnings.forEach(warning => proModeNotifications.validationWarning(warning))
    }

    const safetyCheck = isProductionSafe({ durationDays })
    if (safetyCheck.warnings) {
      safetyCheck.warnings.forEach(warning => proModeNotifications.productionWarning(warning))
    }

    // Just notify parent about pending changes instead of immediate API call
    onPendingChange?.()
    toast.success(`Duration set to ${durationDays} days. Click "Apply All Changes" to update the live website.`)
  }

  // Set custom date (now just marks as pending)
  const setCustomEndDate = () => {
    if (!customDate) {
      proModeNotifications.error('Invalid Input', 'Please select a date')
      return
    }

    const validation = validateDate(customDate)
    if (!validation.isValid) {
      proModeNotifications.error('Invalid Date', formatValidationError(validation))
      return
    }

    if (validation.warnings) {
      validation.warnings.forEach(warning => proModeNotifications.validationWarning(warning))
    }

    const safetyCheck = isProductionSafe({ maintenanceEndDate: customDate })
    if (safetyCheck.warnings) {
      safetyCheck.warnings.forEach(warning => proModeNotifications.productionWarning(warning))
    }

    // Just notify parent about pending changes instead of immediate API call
    onPendingChange?.()
    const formattedDate = new Date(customDate).toLocaleDateString()
    toast.success(`Custom date set to ${formattedDate}. Click "Apply All Changes" to update the live website.`)
  }

  // Update maintenance message (now just marks as pending)
  const updateMessage = () => {
    const validation = validateMaintenanceMessage(maintenanceMessage)
    if (!validation.isValid) {
      proModeNotifications.error('Invalid Message', formatValidationError(validation))
      return
    }

    if (validation.warnings) {
      validation.warnings.forEach(warning => proModeNotifications.validationWarning(warning))
    }

    // Just notify parent about pending changes instead of immediate API call
    onPendingChange?.()
    toast.success('Maintenance message updated. Click "Apply All Changes" to update the live website.')
  }

  // Toggle countdown display (now just marks as pending)
  const toggleCountdown = () => {
    // Just notify parent about pending changes instead of immediate API call
    onPendingChange?.()
    toast.success('Countdown display toggled. Click "Apply All Changes" to update the live website.')
  }

  // Format date for input
  const formatDateForInput = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toISOString().slice(0, 16)
  }

  // Get minimum date (tomorrow)
  const getMinDate = (): string => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().slice(0, 16)
  }

  useEffect(() => {
    fetchStatus()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (status) {
      setCustomDate(formatDateForInput(status.maintenanceEndDate))
    }
  }, [status])

  if (isLoading) {
    return (
      <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/30">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded mb-4"></div>
          <div className="h-4 bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  if (!status) {
    return (
      <div className="bg-red-900/20 rounded-xl p-6 border border-red-500/30">
        <h3 className="text-lg font-semibold text-red-400 mb-2">Error Loading Pro Mode Status</h3>
        <p className="text-red-300 mb-4">Failed to load Pro Mode configuration.</p>
        <button
          onClick={fetchStatus}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Workflow Notice */}
      <div className="bg-purple-900/20 rounded-xl p-4 border border-purple-500/30">
        <div className="flex items-center space-x-3">
          <span className="text-purple-400 text-xl">💡</span>
          <div>
            <h4 className="text-purple-400 font-medium">Pro Mode Workflow</h4>
            <p className="text-gray-300 text-sm">
              Make your changes below, then click the <strong>"Apply All Changes"</strong> button at the top to sync all settings to the live website.
            </p>
          </div>
        </div>
      </div>

      {/* Current Status Display */}
      <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <h3 className="text-xl font-semibold text-white">Pro Mode Status</h3>
            {/* Real-time indicator */}
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
              <span className={`text-xs ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
                {isOnline ? 'Live' : 'Offline'}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              status.isUnderMaintenance
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-green-500/20 text-green-400 border border-green-500/30'
            }`}>
              {status.isUnderMaintenance ? 'Disabled' : 'Enabled'}
            </div>
          </div>
        </div>

        {/* Last update time */}
        {lastUpdateTime && (
          <div className="text-xs text-gray-400 mb-4">
            Last updated: {lastUpdateTime.toLocaleTimeString()}
            <span className="ml-2">
              ({Math.round((Date.now() - lastUpdateTime.getTime()) / 1000)}s ago)
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-800/30 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-400 mb-2">Time Remaining</h4>
            <div className="text-2xl font-bold text-white">
              {status.isExpired ? (
                <span className="text-green-400">Available Now</span>
              ) : (
                <span className="text-purple-400">
                  {status.daysRemaining}d {status.hoursRemaining}h {status.minutesRemaining}m
                </span>
              )}
            </div>
          </div>
          
          <div className="bg-gray-800/30 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-400 mb-2">Expiration Date</h4>
            <div className="text-lg font-semibold text-white">
              {new Date(status.maintenanceEndDate).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })}
            </div>
          </div>
        </div>

        <div className="bg-gray-800/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Maintenance Message</h4>
          <p className="text-white">{status.maintenanceMessage}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/30">
        <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={toggleProMode}
            disabled={isUpdating && activeAction === 'toggle'}
            className={`p-4 rounded-lg border transition-all duration-200 ${
              status.isUnderMaintenance
                ? 'bg-green-600/20 border-green-500/30 hover:bg-green-600/30 text-green-400'
                : 'bg-red-600/20 border-red-500/30 hover:bg-red-600/30 text-red-400'
            } ${isUpdating && activeAction === 'toggle' ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">
                {status.isUnderMaintenance ? '✅' : '❌'}
              </div>
              <div className="font-semibold">
                {isUpdating && activeAction === 'toggle' ? 'Updating...' : 
                 status.isUnderMaintenance ? 'Enable Pro Mode' : 'Disable Pro Mode'}
              </div>
            </div>
          </button>

          <button
            onClick={toggleCountdown}
            disabled={isUpdating && activeAction === 'toggle-countdown'}
            className={`p-4 rounded-lg border transition-all duration-200 ${
              status.showCountdown
                ? 'bg-blue-600/20 border-blue-500/30 hover:bg-blue-600/30 text-blue-400'
                : 'bg-gray-600/20 border-gray-500/30 hover:bg-gray-600/30 text-gray-400'
            } ${isUpdating && activeAction === 'toggle-countdown' ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">⏰</div>
              <div className="font-semibold">
                {isUpdating && activeAction === 'toggle-countdown' ? 'Updating...' : 
                 status.showCountdown ? 'Hide Countdown' : 'Show Countdown'}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Advanced Configuration */}
      <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/30">
        <h3 className="text-xl font-semibold text-white mb-6">Advanced Configuration</h3>

        <div className="space-y-6">
          {/* Duration Setting */}
          <div className="bg-gray-800/30 rounded-lg p-4">
            <h4 className="text-lg font-medium text-white mb-3">Set Duration (Days)</h4>
            <div className="flex items-center space-x-3">
              <input
                type="number"
                min="1"
                max="365"
                value={durationDays}
                onChange={(e) => setDurationDays(parseInt(e.target.value) || 1)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white w-24 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="30"
              />
              <span className="text-gray-400">days</span>
              <button
                onClick={setDuration}
                disabled={isUpdating && activeAction === 'set-duration'}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
              >
                {isUpdating && activeAction === 'set-duration' ? 'Setting...' : 'Set Duration'}
              </button>
            </div>
            <p className="text-sm text-gray-400 mt-2">Set Pro Mode to be disabled for a specific number of days</p>
          </div>

          {/* Custom Date Setting */}
          <div className="bg-gray-800/30 rounded-lg p-4">
            <h4 className="text-lg font-medium text-white mb-3">Set Custom Expiration Date</h4>
            <div className="flex items-center space-x-3">
              <input
                type="datetime-local"
                value={customDate}
                min={getMinDate()}
                onChange={(e) => setCustomDate(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={setCustomEndDate}
                disabled={isUpdating && activeAction === 'set-custom-date'}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
              >
                {isUpdating && activeAction === 'set-custom-date' ? 'Setting...' : 'Set Date'}
              </button>
            </div>
            <p className="text-sm text-gray-400 mt-2">Set a specific date and time when Pro Mode will become available</p>
          </div>

          {/* Maintenance Message */}
          <div className="bg-gray-800/30 rounded-lg p-4">
            <h4 className="text-lg font-medium text-white mb-3">Maintenance Message</h4>
            <div className="space-y-3">
              <textarea
                value={maintenanceMessage}
                onChange={(e) => setMaintenanceMessage(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                rows={3}
                placeholder="Enter maintenance message..."
              />
              <button
                onClick={updateMessage}
                disabled={isUpdating && activeAction === 'update-message'}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
              >
                {isUpdating && activeAction === 'update-message' ? 'Updating...' : 'Update Message'}
              </button>
            </div>
            <p className="text-sm text-gray-400 mt-2">Message displayed to users when Pro Mode is disabled</p>
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-center">
        <button
          onClick={fetchStatus}
          disabled={isLoading}
          className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
        >
          <span>🔄</span>
          <span>{isLoading ? 'Refreshing...' : 'Refresh Status'}</span>
        </button>
      </div>
    </div>
  )
}
