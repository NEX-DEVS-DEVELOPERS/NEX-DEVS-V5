'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

interface NotificationProps {
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  onClose?: () => void
}

interface ProModeNotification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: Date
  duration: number
  isVisible: boolean
}

export function useProModeNotifications() {
  const [notifications, setNotifications] = useState<ProModeNotification[]>([])

  const addNotification = (notification: Omit<ProModeNotification, 'id' | 'timestamp' | 'isVisible'>) => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newNotification: ProModeNotification = {
      ...notification,
      id,
      timestamp: new Date(),
      isVisible: true
    }

    setNotifications(prev => [...prev, newNotification])

    // Auto-remove notification after duration
    setTimeout(() => {
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, isVisible: false } : n)
      )
      
      // Remove from array after fade out animation
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id))
      }, 300)
    }, notification.duration)

    return id
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isVisible: false } : n)
    )
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 300)
  }

  const clearAllNotifications = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, isVisible: false }))
    )
    
    setTimeout(() => {
      setNotifications([])
    }, 300)
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications
  }
}

export function ProModeNotificationContainer() {
  const { notifications, removeNotification, clearAllNotifications } = useProModeNotifications()

  if (notifications.length === 0) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.length > 3 && (
        <button
          onClick={clearAllNotifications}
          className="w-full bg-gray-800 hover:bg-gray-700 text-white text-sm py-2 px-3 rounded-lg transition-colors border border-gray-600"
        >
          Clear All ({notifications.length})
        </button>
      )}
      
      {notifications.slice(-5).map((notification) => (
        <ProModeNotificationItem
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  )
}

function ProModeNotificationItem({ 
  notification, 
  onClose 
}: { 
  notification: ProModeNotification
  onClose: () => void 
}) {
  const getNotificationStyles = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-900/90 border-green-500/50 text-green-100'
      case 'error':
        return 'bg-red-900/90 border-red-500/50 text-red-100'
      case 'warning':
        return 'bg-yellow-900/90 border-yellow-500/50 text-yellow-100'
      case 'info':
        return 'bg-blue-900/90 border-blue-500/50 text-blue-100'
      default:
        return 'bg-gray-900/90 border-gray-500/50 text-gray-100'
    }
  }

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      case 'warning':
        return '⚠️'
      case 'info':
        return 'ℹ️'
      default:
        return '📢'
    }
  }

  return (
    <div
      className={`
        ${getNotificationStyles()}
        ${notification.isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}
        transform transition-all duration-300 ease-in-out
        border rounded-lg p-4 shadow-lg backdrop-blur-sm
        max-w-sm w-full
      `}
    >
      <div className="flex items-start space-x-3">
        <div className="text-xl flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm mb-1">
            {notification.title}
          </div>
          <div className="text-sm opacity-90 break-words">
            {notification.message}
          </div>
          <div className="text-xs opacity-70 mt-2">
            {notification.timestamp.toLocaleTimeString()}
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="flex-shrink-0 text-white/70 hover:text-white transition-colors p-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

// Enhanced notification functions for Pro Mode operations
export const proModeNotifications = {
  success: (title: string, message: string, duration = 5000) => {
    toast.success(`${title}: ${message}`, { duration })
  },

  error: (title: string, message: string, duration = 8000) => {
    toast.error(`${title}: ${message}`, { duration })
  },

  warning: (title: string, message: string, duration = 6000) => {
    toast(`${title}: ${message}`, { 
      icon: '⚠️',
      duration,
      style: {
        background: '#92400e',
        color: '#fef3c7',
        border: '1px solid #d97706'
      }
    })
  },

  info: (title: string, message: string, duration = 4000) => {
    toast(`${title}: ${message}`, { 
      icon: 'ℹ️',
      duration,
      style: {
        background: '#1e40af',
        color: '#dbeafe',
        border: '1px solid #3b82f6'
      }
    })
  },

  loading: (title: string, message: string) => {
    return toast.loading(`${title}: ${message}`, {
      style: {
        background: '#374151',
        color: '#f3f4f6',
        border: '1px solid #6b7280'
      }
    })
  },

  dismiss: (toastId: string) => {
    toast.dismiss(toastId)
  },

  // Specialized Pro Mode notifications
  proModeEnabled: () => {
    toast.success('Pro Mode Enabled', {
      icon: '⭐',
      duration: 5000,
      style: {
        background: '#065f46',
        color: '#d1fae5',
        border: '1px solid #10b981'
      }
    })
  },

  proModeDisabled: () => {
    toast.error('Pro Mode Disabled', {
      icon: '🚫',
      duration: 5000,
      style: {
        background: '#7f1d1d',
        color: '#fecaca',
        border: '1px solid #ef4444'
      }
    })
  },

  durationUpdated: (days: number) => {
    toast.success(`Duration Updated: ${days} days`, {
      icon: '📅',
      duration: 4000
    })
  },

  dateUpdated: (date: string) => {
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
    toast.success(`Expiration Date Updated: ${formattedDate}`, {
      icon: '🗓️',
      duration: 6000
    })
  },

  messageUpdated: () => {
    toast.success('Maintenance Message Updated', {
      icon: '💬',
      duration: 4000
    })
  },

  validationWarning: (message: string) => {
    toast(message, {
      icon: '⚠️',
      duration: 6000,
      style: {
        background: '#92400e',
        color: '#fef3c7',
        border: '1px solid #d97706'
      }
    })
  },

  productionWarning: (message: string) => {
    toast(message, {
      icon: '🔔',
      duration: 8000,
      style: {
        background: '#7c2d12',
        color: '#fed7aa',
        border: '1px solid #ea580c'
      }
    })
  }
}
