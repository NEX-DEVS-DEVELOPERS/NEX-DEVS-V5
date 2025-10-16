'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminAuthCheck from '@/frontend/components/AdminAuthCheck'
import { toast, Toaster } from 'react-hot-toast'
import { type KnowledgeEntry } from '@/backend/lib/nexious-knowledge'
import ProModeManager from '@/frontend/components/ProModeManager'
import ProModeErrorBoundary from '@/frontend/components/ProModeErrorBoundary'

export default function CommandRoomPage() {
  const [apiKey, setApiKey] = useState('')
  const [newApiKey, setNewApiKey] = useState('')
  const [currentModel, setCurrentModel] = useState('')
  const [newModel, setNewModel] = useState('')
  const [customModel, setCustomModel] = useState('')
  const [isCustomModel, setIsCustomModel] = useState(false)
  const [isChatbotEnabled, setIsChatbotEnabled] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [usageStats, setUsageStats] = useState<any>({
    current_usage: 0,
    max_budget: 100,
    requests_today: 0,
    total_requests: 0,
    context_limit: 8192,
    max_token_response: 1024,
    response_times: [],
    model_usage: {},
    daily_stats: [],
    current_model: {
      id: 'deepseek/deepseek-chat-v3-0324:free',
      name: 'Deepseek Chat v3 (Free)',
      type: 'free'
    }
  })
  const [requestsData, setRequestsData] = useState<any[]>([])
  const [refreshInterval, setRefreshInterval] = useState(30) // seconds
  const [modelUpdateError, setModelUpdateError] = useState('')
  const [isIntervalChanged, setIsIntervalChanged] = useState(false)
  const [savedInterval, setSavedInterval] = useState(30) // Default interval

  // AI Configuration Management State
  const [activeTab, setActiveTab] = useState<'overview' | 'api-keys' | 'models' | 'knowledge' | 'fallback' | 'pro-mode'>('overview')
  const [aiConfig, setAiConfig] = useState<any>(null)
  const [primaryApiKey, setPrimaryApiKey] = useState('')
  const [backupApiKey, setBackupApiKey] = useState('')
  const [standardModelSettings, setStandardModelSettings] = useState<any>({
    model: '',
    temperature: 0.7,
    maxTokens: 2500,
    topP: 0.9,
    frequencyPenalty: 0,
    systemPrompt: '',
    useCustomModel: false,
    customModel: '',
    messageLimit: 15,
    cooldownHours: 2,
    disableAutoScroll: false,
    enableTypingIndicator: true,
    enableSoundNotifications: false,
    enableMessageHistory: true,
    responseDelay: 400
  })
  const [proModelSettings, setProModelSettings] = useState<any>({
    model: '',
    temperature: 0.5,
    maxTokens: 5000,
    topP: 0.8,
    frequencyPenalty: 0.1,
    presencePenalty: 0,
    systemPrompt: '',
    useCustomModel: false,
    customModel: '',
    enableCodeHighlighting: true,
    enableCopyCode: true,
    disableAutoScroll: true,
    enableAdvancedFormatting: true,
    enableLivePreview: false,
    enableFileExport: false,
    enableMultiLanguage: true,
    enableDebugMode: false,
    contextWindow: 8,
    thinkingTime: 1200,
    enableDarkTheme: true,
    enableAnimations: true,
    enableKeyboardShortcuts: true,
    enableFullscreen: false
  })
  const [knowledgeEntries, setKnowledgeEntries] = useState<KnowledgeEntry[]>([])
  const [knowledgeStats, setKnowledgeStats] = useState<any>({})
  const [newKnowledgeEntry, setNewKnowledgeEntry] = useState({
    category: '',
    title: '',
    content: '',
    tags: [] as string[],
    isActive: true
  })
  const [knowledgeSearchTerm, setKnowledgeSearchTerm] = useState('')
  const [knowledgeFilterCategory, setKnowledgeFilterCategory] = useState('')
  const [isAddingKnowledge, setIsAddingKnowledge] = useState(false)
  const [apiKeyTestResults, setApiKeyTestResults] = useState<{[key: string]: any}>({})
  const [isTestingApiKey, setIsTestingApiKey] = useState(false)

  // Advanced Fallback System State
  const [fallbackSystemConfig, setFallbackSystemConfig] = useState<any>({
    enabled: true,
    primaryTimeout: 9000,
    fallbackModels: [],
    notificationEnabled: true,
    notificationMessage: 'Switched to premium backup AI model for enhanced performance',
    maxFallbackAttempts: 3,
    fallbackDelay: 500
  })
  const [newFallbackModel, setNewFallbackModel] = useState({
    model: '',
    priority: 1,
    timeout: 8000,
    maxRetries: 2,
    temperature: 0.7,
    maxTokens: 2000,
    isEnabled: true,
    description: ''
  })
  const [isTestingFallbackModel, setIsTestingFallbackModel] = useState(false)
  const [fallbackTestResults, setFallbackTestResults] = useState<any>({})
  const [editingFallbackModel, setEditingFallbackModel] = useState<any>(null)
  const [fallbackStats, setFallbackStats] = useState<any>({
    totalFallbacks: 0,
    successRate: 0,
    averageResponseTime: 0,
    mostUsedModel: 'None',
    recentActivity: []
  })
  const [fallbackLogs, setFallbackLogs] = useState<any[]>([])
  const [isSyncingSettings, setIsSyncingSettings] = useState(false)
  const [lastRefreshSignalSent, setLastRefreshSignalSent] = useState<number | null>(null)
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null)
  const [pendingChanges, setPendingChanges] = useState({
    apiKeys: false,
    standardMode: false,
    proMode: false,
    knowledge: false,
    fallback: false
  })

  // Default OpenRouter API Key
  const DEFAULT_API_KEY = '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'

  // Update the available models with more advanced free options
  const availableModels = [
    // Free models section
    { id: 'free-header', name: '--- Free Models ---', isHeader: true },
    { id: 'deepseek/deepseek-r1-0528:free', name: 'DeepSeek R1 (May 2024) (Free)', isFree: true },
    { id: 'deepseek/deepseek-chat-v3-0324:free', name: 'Deepseek Chat v3 (Free)', isFree: true },
    { id: 'mistralai/mistral-7b-instruct-v0.2', name: 'Mistral 7B Instruct (Free)', isFree: true },
    { id: 'meta-llama/llama-3-8b-instruct', name: 'Meta Llama 3 8B (Free)', isFree: true },
    { id: 'google/gemini-1.0-pro', name: 'Google Gemini 1.0 Pro (Free)', isFree: true },
    { id: 'openchat/openchat-7b', name: 'OpenChat 7B (Free)', isFree: true },
    { id: 'google/gemini-flash-1.5', name: 'Gemini Flash 1.5 (Free)', isFree: true },
    { id: 'nousresearch/nous-hermes-2-mixtral-8x7b-dpo', name: 'Nous Hermes 2 (Free)', isFree: true },
    { id: 'gryphe/mythomist-7b', name: 'Mythomist 7B (Free)', isFree: true },

    // Premium models section
    { id: 'premium-header', name: '--- Premium Models ---', isHeader: true },
    { id: 'anthropic/claude-3-opus-20240229', name: 'Claude 3 Opus' },
    { id: 'anthropic/claude-3-sonnet-20240229', name: 'Claude 3 Sonnet' },
    { id: 'anthropic/claude-3-haiku-20240307', name: 'Claude 3 Haiku' },
    { id: 'meta-llama/llama-3-70b-instruct', name: 'Meta Llama 3 70B' },
    { id: 'google/gemini-1.5-pro-latest', name: 'Google Gemini 1.5 Pro' },
    { id: 'openai/gpt-4-turbo', name: 'GPT-4 Turbo' },
    { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo' }
  ]

  // Fetch current settings on component mount
  useEffect(() => {
    fetchChatbotSettings()
    fetchAIConfiguration()
    fetchKnowledgeBase()
    fetchFallbackSystemConfig()
    fetchFallbackStats()
  }, [])

  // Set up auto-refresh for chatbot stats
  useEffect(() => {
    const interval = setInterval(() => {
      fetchChatbotStats()
    }, refreshInterval * 1000)

    return () => clearInterval(interval)
  }, [refreshInterval])

  // Update useEffect to load saved interval from localStorage
  useEffect(() => {
    // Load saved interval from localStorage if available
    const savedIntervalStr = localStorage.getItem('nexious-command-refresh-interval')
    if (savedIntervalStr) {
      const interval = parseInt(savedIntervalStr)
      if (!isNaN(interval) && interval >= 10 && interval <= 120) {
        setRefreshInterval(interval)
        setSavedInterval(interval)
      }
    }
  }, [])

  const fetchChatbotSettings = async () => {
    setIsLoading(true)
    try {
      // Get the admin password from session storage
      const password = sessionStorage.getItem('adminPassword') || 'nex-devs.org889123'
      
      const response = await fetch(`/api/chatbot/settings?t=${Date.now()}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Authorization': `Bearer ${password}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        // Use default API key if none is set
        const currentApiKey = data.apiKey || DEFAULT_API_KEY
        // Mask the API key for display
        const maskedKey = currentApiKey ? 
          `${currentApiKey.substring(0, 8)}...${currentApiKey.substring(currentApiKey.length - 4)}` : 
          ''
        
        setApiKey(maskedKey)
        setIsChatbotEnabled(data.enabled)
        setCurrentModel(data.model || 'deepseek/deepseek-chat-v3-0324:free') // Set default if none
        
        // Also fetch stats after settings
        fetchChatbotStats()
      } else {
        console.error('Failed to fetch chatbot settings:', await response.text())
        toast.error('Failed to load chatbot settings')
      }
    } catch (error) {
      console.error('Error fetching chatbot settings:', error)
      toast.error('Error connecting to the server')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchChatbotStats = async () => {
    try {
      const password = sessionStorage.getItem('adminPassword') || 'nex-devs919'
      
      const response = await fetch(`/api/chatbot/stats?t=${Date.now()}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Authorization': `Bearer ${password}`,
          'X-OpenRouter-Key': DEFAULT_API_KEY
        }
      })

      if (response.ok) {
        const data = await response.json()
        // Update usage stats with current model information
        setUsageStats({
          ...data.usage,
          current_model: {
            id: currentModel,
            name: availableModels.find(m => m.id === currentModel)?.name || currentModel,
            type: availableModels.find(m => m.id === currentModel)?.isFree ? 'free' : 'premium'
          }
        })
        setRequestsData(data.requests || [])
      } else {
        console.error('Failed to fetch chatbot stats:', await response.text())
      }
    } catch (error) {
      console.error('Error fetching chatbot stats:', error)
    }
  }

  const updateApiKey = async () => {
    if (!newApiKey.trim()) {
      toast.error('Please enter a valid API key')
      return
    }

    try {
      toast.loading('Updating API key...')
      
      // Get the admin password from session storage
      const password = sessionStorage.getItem('adminPassword') || 'nex-devs919'
      
      const response = await fetch('/api/chatbot/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${password}`
        },
        body: JSON.stringify({
          apiKey: newApiKey
        })
      })

      toast.dismiss()
      
      if (response.ok) {
        const data = await response.json()
        // Mask the API key for display
        const maskedKey = data.apiKey ? 
          `${data.apiKey.substring(0, 8)}...${data.apiKey.substring(data.apiKey.length - 4)}` : 
          ''
        
        setApiKey(maskedKey)
        setNewApiKey('')
        toast.success('API key updated successfully')
      } else {
        console.error('Failed to update API key:', await response.text())
        toast.error('Failed to update API key')
      }
    } catch (error) {
      toast.dismiss()
      console.error('Error updating API key:', error)
      toast.error('Error connecting to the server')
    }
  }

  const toggleChatbot = async () => {
    try {
      toast.loading(`${isChatbotEnabled ? 'Disabling' : 'Enabling'} chatbot...`)
      
      // Get the admin password from session storage
      const password = sessionStorage.getItem('adminPassword') || 'nex-devs919'
      
      const response = await fetch('/api/chatbot/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${password}`
        },
        body: JSON.stringify({
          enabled: !isChatbotEnabled
        })
      })

      toast.dismiss()
      
      if (response.ok) {
        setIsChatbotEnabled(!isChatbotEnabled)
        
        // Add a fetch to the public endpoint to clear its cache
        try {
          await fetch('/api/chatbot/settings/public', {
            method: 'GET',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache'
            }
          })
          console.log('Refreshed public settings cache')
        } catch (error) {
          console.error('Failed to refresh public settings cache:', error)
        }
        
        toast.success(`Chatbot ${!isChatbotEnabled ? 'enabled' : 'disabled'} successfully`)
      } else {
        console.error('Failed to toggle chatbot:', await response.text())
        toast.error('Failed to update chatbot status')
      }
    } catch (error) {
      toast.dismiss()
      console.error('Error toggling chatbot:', error)
      toast.error('Error connecting to the server')
    }
  }

  const updateModel = async () => {
    // Clear previous errors
    setModelUpdateError('')
    
    // Determine which model to use (custom input or dropdown selection)
    const modelToUse = isCustomModel ? customModel.trim() : newModel.trim()
    
    if (!modelToUse) {
      setModelUpdateError('Please select a model or enter a custom model ID')
      toast.error('Please select a model or enter a custom model ID')
      return
    }

    try {
      toast.loading('Updating AI model...')
      
      // Get the admin password from session storage
      const password = sessionStorage.getItem('adminPassword') || 'nex-devs919'
      
      const response = await fetch('/api/chatbot/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${password}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        },
        body: JSON.stringify({
          model: modelToUse
        })
      })

      toast.dismiss()
      
      if (response.ok) {
        const data = await response.json()
        setCurrentModel(data.model)
        setNewModel('')
        setCustomModel('')
        toast.success('AI model updated successfully')
        
        // Immediately refresh chatbot settings to confirm the change
        await fetchChatbotSettings()
        
        // Reset cache to ensure new model is used immediately
        try {
          // Use a timestamp to force bypass cache
          const timestamp = new Date().getTime()
          await fetch(`/api/chatbot/settings/public?t=${timestamp}`, {
            method: 'GET',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache'
            }
          })
          console.log('Settings cache refreshed')
          
          // Also clear localStorage caches that might be used by the chatbot
          if (typeof window !== 'undefined') {
            localStorage.removeItem('nexious-chatbot-model')
            localStorage.removeItem('nexious-chatbot-settings')
            console.log('Local storage caches cleared')
          }
        } catch (error) {
          console.error('Failed to refresh settings cache:', error)
        }
      } else {
        const errorData = await response.json()
        console.error('Failed to update AI model:', errorData)
        setModelUpdateError(errorData.error || 'Failed to update AI model')
        toast.error(errorData.error || 'Failed to update AI model')
      }
    } catch (error) {
      toast.dismiss()
      console.error('Error updating AI model:', error)
      setModelUpdateError('Error connecting to the server')
      toast.error('Error connecting to the server')
    }
  }

  // Add function to save refresh interval
  const saveRefreshInterval = () => {
    try {
      // Save the current interval value
      setSavedInterval(refreshInterval)
      setIsIntervalChanged(false)
      toast.success(`Refresh interval saved: ${refreshInterval}s`)

      // You could also store this in localStorage for persistence
      localStorage.setItem('nexious-command-refresh-interval', refreshInterval.toString())
    } catch (error) {
      console.error('Error saving refresh interval:', error)
      toast.error('Failed to save refresh interval')
    }
  }

  // AI Configuration Management Functions
  const fetchAIConfiguration = async () => {
    try {
      const password = sessionStorage.getItem('adminPassword') || 'nex-devs.org889123'

      const response = await fetch('/api/admin/ai-config', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${password}`,
          'Cache-Control': 'no-cache'
        }
      })

      if (response.ok) {
        const result = await response.json()
        setAiConfig(result.data)
        setPrimaryApiKey(result.data.apiKeys.primary)
        setBackupApiKey(result.data.apiKeys.backup)
        setStandardModelSettings(result.data.standardModeSettings)
        setProModelSettings(result.data.proModeSettings)
      } else {
        console.error('Failed to fetch AI configuration:', await response.text())
        toast.error('Failed to load AI configuration')
      }
    } catch (error) {
      console.error('Error fetching AI configuration:', error)
      toast.error('Error connecting to the server')
    }
  }

  const updateAIConfiguration = async (type: string, data: any) => {
    try {
      const password = sessionStorage.getItem('adminPassword') || 'nex-devs.org889123'

      const response = await fetch('/api/admin/ai-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${password}`
        },
        body: JSON.stringify({ type, data })
      })

      if (response.ok) {
        toast.success('Configuration updated successfully')

        // Mark appropriate pending changes
        if (type === 'api-keys') {
          setPendingChanges(prev => ({ ...prev, apiKeys: true }))
        } else if (type === 'model-settings') {
          if (data.mode === 'standard') {
            setPendingChanges(prev => ({ ...prev, standardMode: true }))
          } else if (data.mode === 'pro') {
            setPendingChanges(prev => ({ ...prev, proMode: true }))
          }
        }

        fetchAIConfiguration() // Refresh the configuration
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update configuration')
      }
    } catch (error) {
      console.error('Error updating AI configuration:', error)
      toast.error('Error connecting to the server')
    }
  }

  const testAPIKey = async (apiKey: string, keyType: string) => {
    setIsTestingApiKey(true)
    try {
      const password = sessionStorage.getItem('adminPassword') || 'nex-devs.org889123'

      const response = await fetch('/api/admin/ai-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${password}`
        },
        body: JSON.stringify({ apiKey, action: 'test' })
      })

      if (response.ok) {
        const result = await response.json()
        setApiKeyTestResults(prev => ({
          ...prev,
          [keyType]: result.data
        }))

        if (result.data.valid) {
          toast.success(`${keyType} API key is valid`)
        } else {
          toast.error(`${keyType} API key is invalid: ${result.data.error}`)
        }
      } else {
        toast.error('Failed to test API key')
      }
    } catch (error) {
      console.error('Error testing API key:', error)
      toast.error('Error testing API key')
    } finally {
      setIsTestingApiKey(false)
    }
  }

  const fetchKnowledgeBase = async () => {
    try {
      const password = sessionStorage.getItem('adminPassword') || 'nex-devs.org889123'

      const [entriesResponse, statsResponse] = await Promise.all([
        fetch('/api/admin/knowledge-base', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${password}`,
            'Cache-Control': 'no-cache'
          }
        }),
        fetch('/api/admin/knowledge-base?action=stats', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${password}`,
            'Cache-Control': 'no-cache'
          }
        })
      ])

      if (entriesResponse.ok && statsResponse.ok) {
        const entriesResult = await entriesResponse.json()
        const statsResult = await statsResponse.json()

        setKnowledgeEntries(entriesResult.data)
        setKnowledgeStats(statsResult.data)
      } else {
        toast.error('Failed to load knowledge base')
      }
    } catch (error) {
      console.error('Error fetching knowledge base:', error)
      toast.error('Error connecting to the server')
    }
  }

  const addKnowledgeEntry = async (entryData?: any) => {
    try {
      if (!entryData) setIsAddingKnowledge(true)

      const password = sessionStorage.getItem('adminPassword') || 'nex-devs.org889123'

      // Use provided entry data or current form data
      const dataToSubmit = entryData || newKnowledgeEntry

      // Validate required fields
      if (!dataToSubmit.title || !dataToSubmit.content || !dataToSubmit.category) {
        toast.error('Please fill in all required fields (title, content, category)')
        return false
      }

      // Ensure tags is an array
      if (typeof dataToSubmit.tags === 'string') {
        dataToSubmit.tags = dataToSubmit.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0)
      }

      const response = await fetch('/api/admin/knowledge-base', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${password}`
        },
        body: JSON.stringify(dataToSubmit)
      })

      if (response.ok) {
        const result = await response.json()
        toast.success(`Knowledge entry "${dataToSubmit.title}" added successfully`)

        // Only clear form if we're adding from the form (not bulk import)
        if (!entryData) {
          setNewKnowledgeEntry({
            category: '',
            title: '',
            content: '',
            tags: [],
            isActive: true
          })
        }

        setPendingChanges(prev => ({ ...prev, knowledge: true }))
        fetchKnowledgeBase() // Refresh the knowledge base
        return true
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to add knowledge entry')
        console.error('API Error:', error)
        return false
      }
    } catch (error) {
      console.error('Error adding knowledge entry:', error)
      toast.error('Error connecting to the server')
      return false
    } finally {
      if (!entryData) setIsAddingKnowledge(false)
    }
  }

  // Delete knowledge entry function
  const deleteKnowledgeEntry = async (entryId: string, entryTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${entryTitle}"? This action cannot be undone.`)) {
      return
    }

    try {
      const password = sessionStorage.getItem('adminPassword') || 'nex-devs.org889123'

      const response = await fetch(`/api/admin/knowledge-base?id=${entryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${password}`
        }
      })

      if (response.ok) {
        toast.success(`Knowledge entry "${entryTitle}" deleted successfully`)
        setPendingChanges(prev => ({ ...prev, knowledge: true }))
        fetchKnowledgeBase() // Refresh the knowledge base
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to delete knowledge entry')
      }
    } catch (error) {
      console.error('Error deleting knowledge entry:', error)
      toast.error('Error connecting to the server')
    }
  }

  // Bulk import function with proper async handling
  const bulkImportEntries = async (entries: any[]) => {
    let successCount = 0
    let failCount = 0

    toast.loading(`Importing ${entries.length} entries...`)

    for (const entry of entries) {
      const success = await addKnowledgeEntry(entry)
      if (success) {
        successCount++
      } else {
        failCount++
      }
      // Small delay to prevent overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    toast.dismiss()

    if (failCount === 0) {
      toast.success(`Successfully imported all ${successCount} entries!`)
    } else {
      toast.error(`Imported ${successCount} entries, ${failCount} failed`)
    }
  }

  // Clear all knowledge entries function
  const clearAllKnowledgeEntries = async () => {
    if (!confirm('Are you sure you want to delete ALL knowledge entries? This action cannot be undone.')) {
      return
    }

    if (!confirm('This will permanently delete all knowledge entries. Type "DELETE ALL" to confirm.')) {
      return
    }

    try {
      let successCount = 0
      let failCount = 0

      toast.loading(`Deleting ${knowledgeEntries.length} entries...`)

      for (const entry of knowledgeEntries) {
        try {
          const password = sessionStorage.getItem('adminPassword') || 'nex-devs.org889123'

          const response = await fetch(`/api/admin/knowledge-base?id=${entry.id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${password}`
            }
          })

          if (response.ok) {
            successCount++
          } else {
            failCount++
          }
        } catch (error) {
          failCount++
        }

        // Small delay to prevent overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 50))
      }

      toast.dismiss()

      if (failCount === 0) {
        toast.success(`Successfully deleted all ${successCount} entries!`)
      } else {
        toast.error(`Deleted ${successCount} entries, ${failCount} failed`)
      }

      setPendingChanges(prev => ({ ...prev, knowledge: true }))
      fetchKnowledgeBase() // Refresh the knowledge base
    } catch (error) {
      toast.dismiss()
      console.error('Error clearing knowledge entries:', error)
      toast.error('Error connecting to the server')
    }
  }

  // Advanced Fallback System Management Functions
  const fetchFallbackSystemConfig = async () => {
    try {
      const password = sessionStorage.getItem('adminPassword') || 'nex-devs.org889123'

      const response = await fetch('/api/admin/fallback-config', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${password}`,
          'Cache-Control': 'no-cache'
        }
      })

      if (response.ok) {
        const result = await response.json()
        setFallbackSystemConfig(result.data)
      } else {
        console.error('Failed to fetch fallback configuration:', await response.text())
        toast.error('Failed to load fallback configuration')
      }
    } catch (error) {
      console.error('Error fetching fallback configuration:', error)
      toast.error('Error connecting to the server')
    }
  }

  const updateFallbackSystemConfig = async (configData: any) => {
    try {
      const password = sessionStorage.getItem('adminPassword') || 'nex-devs.org889123'

      const response = await fetch('/api/admin/fallback-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${password}`
        },
        body: JSON.stringify(configData)
      })

      if (response.ok) {
        toast.success('Fallback system configuration updated successfully')
        setPendingChanges(prev => ({ ...prev, fallback: true }))
        fetchFallbackSystemConfig() // Refresh the configuration
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update fallback configuration')
      }
    } catch (error) {
      console.error('Error updating fallback configuration:', error)
      toast.error('Error connecting to the server')
    }
  }

  const addFallbackModel = async () => {
    try {
      const password = sessionStorage.getItem('adminPassword') || 'nex-devs.org889123'

      const response = await fetch('/api/admin/fallback-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${password}`
        },
        body: JSON.stringify({ action: 'add-model', model: newFallbackModel })
      })

      if (response.ok) {
        toast.success('Fallback model added successfully')
        setNewFallbackModel({
          model: '',
          priority: 1,
          timeout: 8000,
          maxRetries: 2,
          temperature: 0.7,
          maxTokens: 2000,
          isEnabled: true,
          description: ''
        })
        setPendingChanges(prev => ({ ...prev, fallback: true }))
        fetchFallbackSystemConfig() // Refresh the configuration
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to add fallback model')
      }
    } catch (error) {
      console.error('Error adding fallback model:', error)
      toast.error('Error connecting to the server')
    }
  }

  const testFallbackModel = async (modelConfig: any) => {
    setIsTestingFallbackModel(true)
    try {
      const password = sessionStorage.getItem('adminPassword') || 'nex-devs.org889123'

      const response = await fetch('/api/admin/fallback-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${password}`
        },
        body: JSON.stringify({ action: 'test-model', model: modelConfig })
      })

      if (response.ok) {
        const result = await response.json()
        setFallbackTestResults(prev => ({
          ...prev,
          [modelConfig.model]: result.data
        }))

        if (result.data.success) {
          toast.success(`${modelConfig.model} test successful (${result.data.responseTime}ms)`)
        } else {
          toast.error(`${modelConfig.model} test failed: ${result.data.error}`)
        }
      } else {
        toast.error('Failed to test fallback model')
      }
    } catch (error) {
      console.error('Error testing fallback model:', error)
      toast.error('Error testing fallback model')
    } finally {
      setIsTestingFallbackModel(false)
    }
  }

  const removeFallbackModel = async (modelId: string) => {
    try {
      const password = sessionStorage.getItem('adminPassword') || 'nex-devs.org889123'

      const response = await fetch('/api/admin/fallback-config', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${password}`
        },
        body: JSON.stringify({ modelId })
      })

      if (response.ok) {
        toast.success('Fallback model removed successfully')
        setPendingChanges(prev => ({ ...prev, fallback: true }))
        fetchFallbackSystemConfig() // Refresh the configuration
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to remove fallback model')
      }
    } catch (error) {
      console.error('Error removing fallback model:', error)
      toast.error('Error connecting to the server')
    }
  }

  const fetchFallbackStats = async () => {
    try {
      const password = sessionStorage.getItem('adminPassword') || 'nex-devs.org889123'

      const response = await fetch('/api/admin/fallback-stats', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${password}`,
          'Cache-Control': 'no-cache'
        }
      })

      if (response.ok) {
        const result = await response.json()
        setFallbackStats(result.data.stats)
        setFallbackLogs(result.data.logs)
      } else {
        console.error('Failed to fetch fallback statistics:', await response.text())
      }
    } catch (error) {
      console.error('Error fetching fallback statistics:', error)
    }
  }

  const clearFallbackLogs = async () => {
    try {
      const password = sessionStorage.getItem('adminPassword') || 'nex-devs.org889123'

      const response = await fetch('/api/admin/fallback-stats', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${password}`
        }
      })

      if (response.ok) {
        toast.success('Fallback logs cleared successfully')
        fetchFallbackStats() // Refresh the statistics
      } else {
        toast.error('Failed to clear fallback logs')
      }
    } catch (error) {
      console.error('Error clearing fallback logs:', error)
      toast.error('Error clearing fallback logs')
    }
  }

  // Function to sync all settings to configuration files
  const syncAllSettings = async () => {
    setIsSyncingSettings(true)
    try {
      const password = sessionStorage.getItem('adminPassword') || 'nex-devs.org889123'

      // Fetch current Pro Mode status
      let currentProModeStatus = null
      try {
        const proModeResponse = await fetch('/api/admin/pro-mode', {
          headers: {
            'Authorization': `Bearer ${password}`
          }
        })
        if (proModeResponse.ok) {
          const proModeResult = await proModeResponse.json()
          currentProModeStatus = proModeResult.data
        }
      } catch (error) {
        console.warn('Could not fetch Pro Mode status for sync:', error)
      }

      // Prepare all settings data with extended configurations
      const settingsData = {
        apiKeys: {
          primary: primaryApiKey,
          backup: backupApiKey
        },
        standardModeSettings: {
          ...standardModelSettings,
          // Ensure all boolean values are properly set
          enableTypingIndicator: standardModelSettings.enableTypingIndicator !== undefined ? standardModelSettings.enableTypingIndicator : true,
          enableMessageHistory: standardModelSettings.enableMessageHistory !== undefined ? standardModelSettings.enableMessageHistory : true,
          disableAutoScroll: standardModelSettings.disableAutoScroll || false,
          enableSoundNotifications: standardModelSettings.enableSoundNotifications || false,
          useCustomModel: standardModelSettings.useCustomModel || false,
          customModel: standardModelSettings.customModel || '',
          messageLimit: standardModelSettings.messageLimit || 15,
          cooldownHours: standardModelSettings.cooldownHours || 2,
          responseDelay: standardModelSettings.responseDelay || 400,
          systemPrompt: standardModelSettings.systemPrompt || ''
        },
        proModeSettings: {
          ...proModelSettings,
          // Ensure all boolean values are properly set
          useCustomModel: proModelSettings.useCustomModel || false,
          customModel: proModelSettings.customModel || '',
          enableCodeHighlighting: proModelSettings.enableCodeHighlighting !== undefined ? proModelSettings.enableCodeHighlighting : true,
          enableCopyCode: proModelSettings.enableCopyCode !== undefined ? proModelSettings.enableCopyCode : true,
          disableAutoScroll: proModelSettings.disableAutoScroll !== undefined ? proModelSettings.disableAutoScroll : true,
          enableAdvancedFormatting: proModelSettings.enableAdvancedFormatting !== undefined ? proModelSettings.enableAdvancedFormatting : true,
          enableLivePreview: proModelSettings.enableLivePreview || false,
          enableFileExport: proModelSettings.enableFileExport || false,
          enableMultiLanguage: proModelSettings.enableMultiLanguage !== undefined ? proModelSettings.enableMultiLanguage : true,
          enableDebugMode: proModelSettings.enableDebugMode || false,
          contextWindow: proModelSettings.contextWindow || 8,
          thinkingTime: proModelSettings.thinkingTime || 1200,
          enableDarkTheme: proModelSettings.enableDarkTheme !== undefined ? proModelSettings.enableDarkTheme : true,
          enableAnimations: proModelSettings.enableAnimations !== undefined ? proModelSettings.enableAnimations : true,
          enableKeyboardShortcuts: proModelSettings.enableKeyboardShortcuts !== undefined ? proModelSettings.enableKeyboardShortcuts : true,
          enableFullscreen: proModelSettings.enableFullscreen || false,
          systemPrompt: proModelSettings.systemPrompt || ''
        },
        proModeMaintenance: currentProModeStatus ? {
          isUnderMaintenance: currentProModeStatus.isUnderMaintenance,
          maintenanceMessage: currentProModeStatus.maintenanceMessage,
          maintenanceEndDate: currentProModeStatus.maintenanceEndDate,
          showCountdown: currentProModeStatus.showCountdown
        } : {
          isUnderMaintenance: true,
          maintenanceMessage: "Nexious Pro Mode is currently under maintenance. We are optimizing the code generation features.",
          maintenanceEndDate: new Date('2025-07-25T00:00:00Z').toISOString(),
          showCountdown: true
        },
        standardModeConfig: {
          requestLimit: standardModelSettings.messageLimit || 15,
          cooldownHours: standardModelSettings.cooldownHours || 2,
          resetInterval: 24 * 60 * 60 * 1000
        },
        knowledgeEntries: knowledgeEntries,
        fallbackSystemConfig: fallbackSystemConfig
      }

      console.log('Syncing extended settings:', settingsData) // Debug log

      const response = await fetch('/api/admin/sync-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${password}`
        },
        body: JSON.stringify(settingsData)
      })

      if (response.ok) {
        const result = await response.json()

        // Force chatbot refresh with new settings
        try {
          const refreshResponse = await fetch('/api/chatbot/force-refresh', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${password}`
            },
            body: JSON.stringify({
              apiKeys: {
                primary: primaryApiKey,
                backup: backupApiKey
              },
              standardModeSettings,
              proModeSettings,
              proModeMaintenance: currentProModeStatus,
              forceReload: true
            })
          })

          if (refreshResponse.ok) {
            setLastRefreshSignalSent(Date.now())
            console.log('Chatbot refresh signal sent successfully')
          } else {
            console.warn('Failed to send chatbot refresh signal')
          }
        } catch (error) {
          console.error('Error sending chatbot refresh signal:', error)
        }

        // Show detailed success message
        const settingsCount = {
          standardMode: Object.keys(standardModelSettings).length,
          proMode: Object.keys(proModelSettings).length,
          knowledge: knowledgeEntries.length
        }

        toast.success(
          `✅ All settings synchronized and applied to live website!\n\n` +
          `📁 Files updated:\n` +
          `• nexiousAISettings.ts\n` +
          `• nexious-knowledge.ts\n` +
          `• NexiousChatbot.tsx (forced refresh)\n\n` +
          `🔧 Settings synced:\n` +
          `• API Keys: ${primaryApiKey ? 'Updated' : 'Not set'}\n` +
          `• Standard Mode: ${settingsCount.standardMode} settings\n` +
          `• Pro Mode: ${settingsCount.proMode} settings\n` +
          `• Knowledge Base: ${settingsCount.knowledge} entries\n\n` +
          `🚀 Cache cleared: ${result.cacheCleared ? 'Yes' : 'No'}\n` +
          `⏰ Changes are now live on the website!`,
          { duration: 8000 }
        )

        setLastSyncTime(result.timestamp)
        setPendingChanges({
          apiKeys: false,
          standardMode: false,
          proMode: false,
          knowledge: false,
          fallback: false
        })
      } else {
        const error = await response.json()
        toast.error(`❌ Failed to sync settings: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error syncing settings:', error)
      toast.error('Error connecting to the server')
    } finally {
      setIsSyncingSettings(false)
    }
  }

  return (
    <AdminAuthCheck>
      <div className="min-h-screen bg-[#0a0a0a] pt-32 p-6">
        <Toaster position="top-right" />
        
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-purple-400 to-blue-500 bg-clip-text text-transparent">
                Nexious Command Room
              </h1>
              <p className="text-gray-400 mt-2">Centralized AI configuration and knowledge base management</p>

              {/* Sync Status Indicator */}
              <div className="mt-4 flex items-center space-x-4 text-sm">
                {lastSyncTime && (
                  <div className="flex items-center space-x-2 text-green-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Last sync: {new Date(lastSyncTime).toLocaleString()}</span>
                  </div>
                )}

                {(pendingChanges.apiKeys || pendingChanges.standardMode || pendingChanges.proMode || pendingChanges.knowledge || pendingChanges.fallback) && (
                  <div className="flex items-center space-x-2 text-yellow-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span>
                      Pending changes: {Object.entries(pendingChanges).filter(([_, value]) => value).map(([key]) => key).join(', ')}
                    </span>
                  </div>
                )}

                {!lastSyncTime && !Object.values(pendingChanges).some(Boolean) && (
                  <div className="flex items-center space-x-2 text-gray-500">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>No changes to sync</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-4">
              <Link
                href="/hasnaat"
                className="bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span>Admin Home</span>
              </Link>

              <button
                onClick={fetchChatbotSettings}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>Refresh Data</span>
              </button>

              {/* Main Apply All Changes Button */}
              <button
                onClick={syncAllSettings}
                disabled={isSyncingSettings || (!pendingChanges.apiKeys && !pendingChanges.standardMode && !pendingChanges.proMode && !pendingChanges.knowledge && !pendingChanges.fallback)}
                className={`${
                  (pendingChanges.apiKeys || pendingChanges.standardMode || pendingChanges.proMode || pendingChanges.knowledge || pendingChanges.fallback)
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 animate-pulse'
                    : 'bg-gray-600'
                } disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 px-6 rounded-lg flex items-center space-x-2 transition-all font-medium`}
              >
                {isSyncingSettings ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Syncing...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <span>Apply All Changes</span>
                    {(pendingChanges.apiKeys || pendingChanges.standardMode || pendingChanges.proMode || pendingChanges.knowledge || pendingChanges.fallback) && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {Object.values(pendingChanges).filter(Boolean).length}
                      </span>
                    )}
                  </>
                )}
              </button>

              <button
                onClick={toggleChatbot}
                className={`${isChatbotEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={isChatbotEnabled
                      ? "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                      : "M5 13l4 4L19 7"}
                  />
                </svg>
                <span>{isChatbotEnabled ? 'Disable Chatbot' : 'Enable Chatbot'}</span>
              </button>

              {/* Force Chatbot Refresh Button */}
              <button
                onClick={async () => {
                  try {
                    toast.loading('Forcing chatbot refresh...')
                    const password = sessionStorage.getItem('adminPassword') || 'nex-devs919'

                    const response = await fetch('/api/chatbot/force-refresh', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${password}`
                      },
                      body: JSON.stringify({
                        apiKeys: {
                          primary: primaryApiKey,
                          backup: backupApiKey
                        },
                        standardModeSettings,
                        proModeSettings,
                        forceReload: true
                      })
                    })

                    if (response.ok) {
                      setLastRefreshSignalSent(Date.now())
                      toast.success('Chatbot refresh signal sent! The chatbot will reload automatically.')
                    } else {
                      toast.error('Failed to send refresh signal')
                    }
                  } catch (error) {
                    console.error('Error forcing chatbot refresh:', error)
                    toast.error('Error forcing chatbot refresh')
                  }
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>Force Chatbot Refresh</span>
              </button>
            </div>

            {/* Refresh Signal Status */}
            {lastRefreshSignalSent && (
              <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-green-300 font-medium">Chatbot Refresh Signal Sent</span>
                </div>
                <p className="text-green-200 text-sm mt-1">
                  Last sent: {new Date(lastRefreshSignalSent).toLocaleTimeString()}
                </p>
                <p className="text-green-200 text-sm">
                  The chatbot will automatically reload with new settings when opened.
                </p>
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-700">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: 'overview', name: 'Overview', icon: '📊' },
                  { id: 'api-keys', name: 'API Keys', icon: '🔑' },
                  { id: 'models', name: 'AI Models', icon: '🤖' },
                  { id: 'pro-mode', name: 'Pro Mode', icon: '⭐' },
                  { id: 'fallback', name: 'Fallback Models', icon: '🔄' },
                  { id: 'knowledge', name: 'Knowledge Base', icon: '📚' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`${
                      activeTab === tab.id
                        ? 'border-purple-500 text-purple-400'
                        : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                    } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          ) : (
            <div>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Sync Status Panel */}
                  <div className="bg-gray-900/50 rounded-xl border border-purple-500/20 p-6">
                    <h2 className="text-xl font-semibold text-white mb-6">Configuration Sync Status</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium text-white mb-4">Files to be Updated</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/30">
                            <div className="flex items-center space-x-3">
                              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <div>
                                <p className="text-white font-medium">nexiousAISettings.ts</p>
                                <p className="text-gray-400 text-sm">AI model configurations & API keys</p>
                              </div>
                            </div>
                            <div className={`w-3 h-3 rounded-full ${(pendingChanges.apiKeys || pendingChanges.standardMode || pendingChanges.proMode) ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
                          </div>

                          <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/30">
                            <div className="flex items-center space-x-3">
                              <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                              <div>
                                <p className="text-white font-medium">nexious-knowledge.ts</p>
                                <p className="text-gray-400 text-sm">Knowledge base entries</p>
                              </div>
                            </div>
                            <div className={`w-3 h-3 rounded-full ${pendingChanges.knowledge ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-white mb-4">Pending Changes</h3>
                        <div className="space-y-2">
                          {pendingChanges.apiKeys && (
                            <div className="flex items-center space-x-2 text-yellow-400 text-sm">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-3a1 1 0 011-1h2.586l6.243-6.243C11.978 9.5 12.5 9 13 9a6 6 0 016-2z" />
                              </svg>
                              <span>API Keys updated</span>
                            </div>
                          )}
                          {pendingChanges.standardMode && (
                            <div className="flex items-center space-x-2 text-yellow-400 text-sm">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span>Standard Mode settings updated</span>
                            </div>
                          )}
                          {pendingChanges.proMode && (
                            <div className="flex items-center space-x-2 text-yellow-400 text-sm">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <span>Pro Mode settings updated</span>
                            </div>
                          )}
                          {pendingChanges.knowledge && (
                            <div className="flex items-center space-x-2 text-yellow-400 text-sm">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                              <span>Knowledge base entries updated</span>
                            </div>
                          )}
                          {!Object.values(pendingChanges).some(Boolean) && (
                            <div className="flex items-center space-x-2 text-green-400 text-sm">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span>All changes synchronized</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Status */}
              <div className="bg-gray-900/50 rounded-xl border border-purple-500/20 p-6">
                <h2 className="text-xl font-semibold text-white mb-4">System Status</h2>

                {/* Status indicator */}
                <div className="mb-5 bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Chatbot Status:</span>
                    <div className="flex items-center">
                      <div className={`w-2.5 h-2.5 rounded-full mr-2 ${isChatbotEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className={`${isChatbotEnabled ? 'text-green-400' : 'text-red-400'}`}>
                        {isChatbotEnabled ? 'Active' : 'Maintenance Mode'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Current Model:</span>
                    <span className="text-sm font-mono text-blue-400">
                      {availableModels.find(m => m.id === currentModel)?.name || currentModel || 'Default Model'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">API Connection:</span>
                    <span className={`text-sm ${apiKey ? 'text-green-400' : 'text-red-400'}`}>
                      {apiKey ? 'Connected' : 'Not Connected'}
                    </span>
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-white mb-3">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setActiveTab('api-keys')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors text-sm flex items-center justify-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-3a1 1 0 011-1h2.586l6.243-6.243C11.978 9.5 12.5 9 13 9a6 6 0 016-2z" />
                      </svg>
                      <span>API Keys</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('models')}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-colors text-sm flex items-center justify-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>AI Models</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('knowledge-base')}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-medium transition-colors text-sm flex items-center justify-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span>Knowledge Base</span>
                    </button>
                    <button
                      onClick={toggleChatbot}
                      className={`${isChatbotEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white px-4 py-3 rounded-lg font-medium transition-colors text-sm flex items-center justify-center space-x-2`}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isChatbotEnabled ? "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" : "M5 13l4 4L19 7"} />
                      </svg>
                      <span>{isChatbotEnabled ? 'Disable Chatbot' : 'Enable Chatbot'}</span>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Usage Stats */}
              <div className="bg-gray-900/50 rounded-xl border border-purple-500/20 p-6 lg:col-span-2">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center justify-between">
                  <span>OpenRouter Performance Metrics</span>
                  <div className="text-sm text-gray-400">
                    Last updated: {new Date().toLocaleTimeString()}
                  </div>
                </h2>
                
                {/* Add Current Model Status section before the grid */}
                <div className="mb-6 bg-gray-800/50 rounded-lg p-4 border border-purple-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-1">Active Model</h3>
                      <div className="text-xl font-bold text-white">
                        {availableModels.find(m => m.id === currentModel)?.name || currentModel || 'Default Model'}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Model ID: <span className="font-mono text-purple-400">{currentModel || 'Not set'}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${isChatbotEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className={`text-sm ${isChatbotEnabled ? 'text-green-400' : 'text-red-400'}`}>
                          {isChatbotEnabled ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        API Key: <span className="font-mono text-blue-400">{apiKey}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
                    <div className="bg-gray-900/50 rounded p-2">
                      <div className="text-gray-400">Response Time</div>
                      <div className="text-lg font-semibold text-white mt-1">
                        {(usageStats.response_times?.[0] || 0).toFixed(2)}s
                      </div>
                    </div>
                    <div className="bg-gray-900/50 rounded p-2">
                      <div className="text-gray-400">Success Rate</div>
                      <div className="text-lg font-semibold text-green-400 mt-1">
                        {((usageStats.total_requests - (usageStats.failed_requests || 0)) / Math.max(usageStats.total_requests, 1) * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="bg-gray-900/50 rounded p-2">
                      <div className="text-gray-400">Avg Tokens</div>
                      <div className="text-lg font-semibold text-blue-400 mt-1">
                        {Math.round(usageStats.avg_tokens || 512)}
                      </div>
                    </div>
                  </div>
                </div>
                
                {usageStats ? (
                  <div className="space-y-6">
                    {/* Usage and Budget Section */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                      <h3 className="text-sm font-medium text-gray-400 mb-2">Current Usage</h3>
                        <div className="text-2xl font-bold text-white mb-2">${usageStats.current_usage?.toFixed(2) || '0.00'}</div>
                        <div className="relative pt-1">
                          <div className="flex mb-2 items-center justify-between">
                            <div>
                              <span className="text-xs font-semibold inline-block text-purple-400">
                                {Math.min(100, ((usageStats.current_usage / usageStats.max_budget) * 100)).toFixed(1)}%
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-semibold inline-block text-gray-400">
                                Budget: ${usageStats.max_budget?.toFixed(2)}
                              </span>
                            </div>
                          </div>
                          <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-700">
                            <div
                              style={{ width: `${Math.min(100, (usageStats.current_usage / usageStats.max_budget) * 100)}%` }}
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                        <h3 className="text-sm font-medium text-gray-400 mb-2">Request Analytics</h3>
                        <div className="text-2xl font-bold text-white mb-1">{usageStats.requests_today || 0}</div>
                        <div className="text-sm text-gray-400">Requests Today</div>
                        <div className="mt-2 text-xs text-gray-500">
                          <div className="flex justify-between items-center">
                            <span>Total Requests:</span>
                            <span className="text-purple-400">{usageStats.total_requests || 0}</span>
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <span>Success Rate:</span>
                            <span className="text-green-400">98.5%</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                        <h3 className="text-sm font-medium text-gray-400 mb-2">Token Metrics</h3>
                        <div className="text-2xl font-bold text-white mb-1">{usageStats.context_limit || 8192}</div>
                        <div className="text-sm text-gray-400">Max Context Length</div>
                        <div className="mt-2 text-xs text-gray-500">
                          <div className="flex justify-between items-center">
                            <span>Max Response:</span>
                            <span className="text-blue-400">{usageStats.max_token_response || 1024} tokens</span>
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <span>Avg Response:</span>
                            <span className="text-blue-400">512 tokens</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                        <h3 className="text-sm font-medium text-gray-400 mb-4">Response Time Distribution</h3>
                        <div className="space-y-2">
                          {['< 1s', '1-2s', '2-3s', '3-5s', '> 5s'].map((range, i) => (
                            <div key={range} className="flex items-center">
                              <span className="text-xs text-gray-400 w-12">{range}</span>
                              <div className="flex-1 mx-2">
                                <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-700">
                                  <div
                                    style={{ width: `${[45, 30, 15, 7, 3][i]}%` }}
                                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
                        ></div>
                                </div>
                              </div>
                              <span className="text-xs text-gray-400 w-12 text-right">{[45, 30, 15, 7, 3][i]}%</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                        <h3 className="text-sm font-medium text-gray-400 mb-4">Model Usage Distribution</h3>
                        <div className="space-y-2">
                          {['Claude 3 Opus', 'GPT-4 Turbo', 'Gemini Pro', 'Claude 3 Sonnet', 'Others'].map((model, i) => (
                            <div key={model} className="flex items-center">
                              <span className="text-xs text-gray-400 w-24 truncate">{model}</span>
                              <div className="flex-1 mx-2">
                                <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-700">
                                  <div
                                    style={{ width: `${[40, 25, 20, 10, 5][i]}%` }}
                                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                                      ['bg-purple-500', 'bg-blue-500', 'bg-green-500', 'bg-indigo-500', 'bg-gray-500'][i]
                                    }`}
                                  ></div>
                                </div>
                              </div>
                              <span className="text-xs text-gray-400 w-12 text-right">{[40, 25, 20, 10, 5][i]}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Daily Usage Trend */}
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                      <h3 className="text-sm font-medium text-gray-400 mb-4">Daily Usage Trend</h3>
                      <div className="h-48 flex items-end justify-between space-x-2">
                        {[...Array(7)].map((_, i) => {
                          const height = [60, 45, 75, 50, 85, 40, 65][i];
                          return (
                            <div key={i} className="flex-1 flex flex-col items-center">
                              <div
                                style={{ height: `${height}%` }}
                                className="w-full bg-purple-500/50 hover:bg-purple-500 transition-colors rounded-t"
                              ></div>
                              <span className="text-xs text-gray-500 mt-2">
                                {new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* Real-time Monitoring */}
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                      <h3 className="text-sm font-medium text-gray-400 mb-4">Real-time Request Log</h3>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                              <span className="text-gray-300">{['Claude 3 Opus', 'GPT-4 Turbo', 'Gemini Pro', 'Claude 3 Sonnet', 'Claude 3 Opus'][i]}</span>
                            </div>
                            <span className="text-gray-400">{(Math.random() * 2 + 0.5).toFixed(2)}s</span>
                            <span className="text-gray-500">{new Date(Date.now() - i * 60000).toLocaleTimeString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500 text-center py-8">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>No usage data available</p>
                    <p className="text-sm mt-2">Connect your OpenRouter API key to see performance metrics</p>
                  </div>
                )}
              </div>
                </div>

                {/* Important Notice */}
                <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 rounded-xl border border-yellow-500/20 p-6">
                  <div className="flex items-start space-x-3">
                    <svg className="w-6 h-6 text-yellow-400 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div>
                      <h3 className="text-lg font-semibold text-yellow-400 mb-2">Important Notice</h3>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        The "Apply All Changes" button will permanently update the configuration files
                        (<code className="bg-gray-800 px-2 py-1 rounded text-purple-400">utils/nexiousAISettings.ts</code> and
                        <code className="bg-gray-800 px-2 py-1 rounded text-purple-400">lib/nexious-knowledge.ts</code>).
                        These changes will be reflected immediately in the live chatbot and all AI interactions.
                        Make sure to test your settings before applying them to production.
                      </p>
                    </div>
                  </div>
                </div>
                </div>
              )}

              {/* API Keys Tab */}
              {activeTab === 'api-keys' && (
                <div className="space-y-6">
                  <div className="bg-gray-900/50 rounded-xl border border-purple-500/20 p-6">
                    <h2 className="text-xl font-semibold text-white mb-6">API Key Management</h2>

                    {/* Primary API Key */}
                    <div className="mb-6">
                      <label className="block text-gray-400 mb-2">Primary OpenRouter API Key</label>
                      <div className="flex space-x-2">
                        <input
                          type="password"
                          value={primaryApiKey}
                          onChange={(e) => setPrimaryApiKey(e.target.value)}
                          placeholder="sk-or-v1-..."
                          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button
                          onClick={() => testAPIKey(primaryApiKey, 'primary')}
                          disabled={!primaryApiKey.trim() || isTestingApiKey}
                          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800/50 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          Test
                        </button>
                        <button
                          onClick={() => updateAIConfiguration('api-keys', { primary: primaryApiKey })}
                          disabled={!primaryApiKey.trim()}
                          className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800/50 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          Update
                        </button>
                      </div>
                      {apiKeyTestResults.primary && (
                        <div className={`mt-2 p-2 rounded text-sm ${apiKeyTestResults.primary.valid ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'}`}>
                          {apiKeyTestResults.primary.valid ? '✓ API key is valid' : `✗ ${apiKeyTestResults.primary.error}`}
                        </div>
                      )}
                    </div>

                    {/* Backup API Key */}
                    <div className="mb-6">
                      <label className="block text-gray-400 mb-2">Backup OpenRouter API Key</label>
                      <div className="flex space-x-2">
                        <input
                          type="password"
                          value={backupApiKey}
                          onChange={(e) => setBackupApiKey(e.target.value)}
                          placeholder="sk-or-v1-..."
                          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button
                          onClick={() => testAPIKey(backupApiKey, 'backup')}
                          disabled={!backupApiKey.trim() || isTestingApiKey}
                          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800/50 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          Test
                        </button>
                        <button
                          onClick={() => updateAIConfiguration('api-keys', { backup: backupApiKey })}
                          disabled={!backupApiKey.trim()}
                          className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800/50 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          Update
                        </button>
                      </div>
                      {apiKeyTestResults.backup && (
                        <div className={`mt-2 p-2 rounded text-sm ${apiKeyTestResults.backup.valid ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'}`}>
                          {apiKeyTestResults.backup.valid ? '✓ API key is valid' : `✗ ${apiKeyTestResults.backup.error}`}
                        </div>
                      )}
                    </div>

                    {/* API Usage Statistics */}
                    {aiConfig && (
                      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                        <h3 className="text-lg font-semibold text-white mb-4">Current Configuration</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Primary Key:</span>
                            <span className="ml-2 font-mono text-purple-400">
                              {aiConfig.apiKeys.primary.substring(0, 12)}...{aiConfig.apiKeys.primary.slice(-4)}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Backup Key:</span>
                            <span className="ml-2 font-mono text-purple-400">
                              {aiConfig.apiKeys.backup.substring(0, 12)}...{aiConfig.apiKeys.backup.slice(-4)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* AI Models Tab */}
              {activeTab === 'models' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Standard Mode Settings */}
                    <div className="bg-gray-900/50 rounded-xl border border-purple-500/20 p-6">
                      <h2 className="text-xl font-semibold text-white mb-6">Standard Mode Configuration</h2>

                      {standardModelSettings && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-gray-400 mb-2">Model Selection</label>
                            <div className="space-y-3">
                              {/* Model Type Toggle */}
                              <div className="flex items-center space-x-3 mb-4">
                                <button
                                  onClick={() => setStandardModelSettings(prev => ({ ...prev, useCustomModel: false }))}
                                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    !standardModelSettings.useCustomModel
                                      ? 'bg-purple-600 text-white'
                                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                  }`}
                                >
                                  Preset Models
                                </button>
                                <button
                                  onClick={() => setStandardModelSettings(prev => ({ ...prev, useCustomModel: true }))}
                                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    standardModelSettings.useCustomModel
                                      ? 'bg-purple-600 text-white'
                                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                  }`}
                                >
                                  Custom Model
                                </button>
                              </div>

                              {/* Preset Model Selection */}
                              {!standardModelSettings.useCustomModel ? (
                                <select
                                  value={standardModelSettings.model || ''}
                                  onChange={(e) => setStandardModelSettings(prev => ({ ...prev, model: e.target.value }))}
                                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                  <option value="">Select Model</option>
                                  <optgroup label="Free Models (Recommended for Standard)">
                                    <option value="deepseek/deepseek-r1-0528:free">DeepSeek R1 (Free)</option>
                                    <option value="deepseek/deepseek-chat-v3-0324:free">Deepseek Chat v3 (Free)</option>
                                    <option value="google/gemini-flash-1.5">Gemini Flash 1.5 (Free)</option>
                                    <option value="meta-llama/llama-3-8b-instruct">Meta Llama 3 8B (Free)</option>
                                    <option value="mistralai/mistral-7b-instruct-v0.2">Mistral 7B Instruct (Free)</option>
                                    <option value="openchat/openchat-7b">OpenChat 7B (Free)</option>
                                  </optgroup>
                                  <optgroup label="Premium Models">
                                    <option value="anthropic/claude-3-opus-20240229">Claude 3 Opus</option>
                                    <option value="anthropic/claude-3-sonnet-20240229">Claude 3 Sonnet</option>
                                    <option value="openai/gpt-4-turbo">GPT-4 Turbo</option>
                                    <option value="google/gemini-1.5-pro-latest">Gemini 1.5 Pro</option>
                                  </optgroup>
                                </select>
                              ) : (
                                /* Custom Model Input */
                                <div className="space-y-3">
                                  <input
                                    type="text"
                                    value={standardModelSettings.customModel || ''}
                                    onChange={(e) => setStandardModelSettings(prev => ({
                                      ...prev,
                                      customModel: e.target.value,
                                      model: e.target.value
                                    }))}
                                    placeholder="Enter custom model ID (e.g., anthropic/claude-3-opus-20240229)"
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                  />

                                  {/* Model Examples */}
                                  <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
                                    <p className="text-xs font-medium text-blue-400 mb-2">Example Model IDs:</p>
                                    <div className="grid grid-cols-1 gap-1 text-xs text-gray-400">
                                      <button
                                        onClick={() => setStandardModelSettings(prev => ({
                                          ...prev,
                                          customModel: 'anthropic/claude-3-haiku-20240307',
                                          model: 'anthropic/claude-3-haiku-20240307'
                                        }))}
                                        className="text-left hover:text-purple-400 transition-colors"
                                      >
                                        • anthropic/claude-3-haiku-20240307
                                      </button>
                                      <button
                                        onClick={() => setStandardModelSettings(prev => ({
                                          ...prev,
                                          customModel: 'openai/gpt-3.5-turbo',
                                          model: 'openai/gpt-3.5-turbo'
                                        }))}
                                        className="text-left hover:text-purple-400 transition-colors"
                                      >
                                        • openai/gpt-3.5-turbo
                                      </button>
                                      <button
                                        onClick={() => setStandardModelSettings(prev => ({
                                          ...prev,
                                          customModel: 'google/gemini-pro',
                                          model: 'google/gemini-pro'
                                        }))}
                                        className="text-left hover:text-purple-400 transition-colors"
                                      >
                                        • google/gemini-pro
                                      </button>
                                      <button
                                        onClick={() => setStandardModelSettings(prev => ({
                                          ...prev,
                                          customModel: 'mistralai/mixtral-8x7b-instruct',
                                          model: 'mistralai/mixtral-8x7b-instruct'
                                        }))}
                                        className="text-left hover:text-purple-400 transition-colors"
                                      >
                                        • mistralai/mixtral-8x7b-instruct
                                      </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                      Click any example to use it, or visit{' '}
                                      <a
                                        href="https://openrouter.ai/docs#models"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-purple-400 hover:text-purple-300 underline"
                                      >
                                        OpenRouter Models
                                      </a>{' '}
                                      for the complete list.
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-gray-400 mb-2">Temperature</label>
                              <div className="space-y-2">
                                <input
                                  type="range"
                                  min="0"
                                  max="2"
                                  step="0.1"
                                  value={standardModelSettings.temperature || 0.7}
                                  onChange={(e) => setStandardModelSettings(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between text-xs text-gray-500">
                                  <span>Conservative (0)</span>
                                  <span className="text-purple-400 font-medium">{standardModelSettings.temperature || 0.7}</span>
                                  <span>Creative (2)</span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <label className="block text-gray-400 mb-2">Max Tokens</label>
                              <div className="space-y-2">
                                <input
                                  type="range"
                                  min="100"
                                  max="4000"
                                  step="100"
                                  value={standardModelSettings.maxTokens || 2500}
                                  onChange={(e) => setStandardModelSettings(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between text-xs text-gray-500">
                                  <span>Short (100)</span>
                                  <span className="text-purple-400 font-medium">{standardModelSettings.maxTokens || 2500}</span>
                                  <span>Long (4000)</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-gray-400 mb-2">Top P</label>
                              <div className="space-y-2">
                                <input
                                  type="range"
                                  min="0.1"
                                  max="1"
                                  step="0.1"
                                  value={standardModelSettings.topP || 0.9}
                                  onChange={(e) => setStandardModelSettings(prev => ({ ...prev, topP: parseFloat(e.target.value) }))}
                                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="text-center text-xs text-purple-400 font-medium">
                                  {standardModelSettings.topP || 0.9}
                                </div>
                              </div>
                            </div>

                            <div>
                              <label className="block text-gray-400 mb-2">Frequency Penalty</label>
                              <div className="space-y-2">
                                <input
                                  type="range"
                                  min="0"
                                  max="2"
                                  step="0.1"
                                  value={standardModelSettings.frequencyPenalty || 0}
                                  onChange={(e) => setStandardModelSettings(prev => ({ ...prev, frequencyPenalty: parseFloat(e.target.value) }))}
                                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="text-center text-xs text-purple-400 font-medium">
                                  {standardModelSettings.frequencyPenalty || 0}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-gray-400 mb-2">System Prompt</label>
                            <textarea
                              value={standardModelSettings.systemPrompt || ''}
                              onChange={(e) => setStandardModelSettings(prev => ({ ...prev, systemPrompt: e.target.value }))}
                              placeholder="Custom system prompt for Standard Mode..."
                              rows={3}
                              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          {/* Standard Mode Specific Settings */}
                          <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
                            <h4 className="text-sm font-medium text-gray-300 mb-4">Standard Mode Settings</h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Message Limit Settings */}
                              <div>
                                <label className="block text-gray-400 mb-2">Daily Message Limit</label>
                                <div className="space-y-2">
                                  <input
                                    type="range"
                                    min="5"
                                    max="50"
                                    step="1"
                                    value={standardModelSettings.messageLimit || 15}
                                    onChange={(e) => {
                                      setStandardModelSettings(prev => ({ ...prev, messageLimit: parseInt(e.target.value) }))
                                      setPendingChanges(prev => ({ ...prev, standardMode: true }))
                                    }}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                  />
                                  <div className="flex justify-between text-xs text-gray-500">
                                    <span>5 messages</span>
                                    <span className="text-purple-400 font-medium">{standardModelSettings.messageLimit || 15} messages</span>
                                    <span>50 messages</span>
                                  </div>
                                </div>
                              </div>

                              {/* Cooldown Period */}
                              <div>
                                <label className="block text-gray-400 mb-2">Cooldown Period (hours)</label>
                                <div className="space-y-2">
                                  <input
                                    type="range"
                                    min="1"
                                    max="24"
                                    step="1"
                                    value={standardModelSettings.cooldownHours || 2}
                                    onChange={(e) => {
                                      setStandardModelSettings(prev => ({ ...prev, cooldownHours: parseInt(e.target.value) }))
                                      setPendingChanges(prev => ({ ...prev, standardMode: true }))
                                    }}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                  />
                                  <div className="flex justify-between text-xs text-gray-500">
                                    <span>1 hour</span>
                                    <span className="text-purple-400 font-medium">{standardModelSettings.cooldownHours || 2} hours</span>
                                    <span>24 hours</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Feature Toggles */}
                            <div className="mt-4">
                              <h5 className="text-sm font-medium text-gray-300 mb-3">Feature Settings</h5>
                              <div className="grid grid-cols-2 gap-3 text-xs text-gray-400">
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={standardModelSettings.disableAutoScroll || false}
                                    onChange={(e) => {
                                      setStandardModelSettings(prev => ({ ...prev, disableAutoScroll: e.target.checked }))
                                      setPendingChanges(prev => ({ ...prev, standardMode: true }))
                                    }}
                                    className="rounded"
                                  />
                                  <span>Disable Auto-scroll</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={standardModelSettings.enableTypingIndicator !== undefined ? standardModelSettings.enableTypingIndicator : true}
                                    onChange={(e) => {
                                      setStandardModelSettings(prev => ({ ...prev, enableTypingIndicator: e.target.checked }))
                                      setPendingChanges(prev => ({ ...prev, standardMode: true }))
                                    }}
                                    className="rounded"
                                  />
                                  <span>Typing Indicator</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={standardModelSettings.enableSoundNotifications || false}
                                    onChange={(e) => setStandardModelSettings(prev => ({ ...prev, enableSoundNotifications: e.target.checked }))}
                                    className="rounded"
                                  />
                                  <span>Sound Notifications</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={standardModelSettings.enableMessageHistory !== undefined ? standardModelSettings.enableMessageHistory : true}
                                    onChange={(e) => {
                                      setStandardModelSettings(prev => ({ ...prev, enableMessageHistory: e.target.checked }))
                                      setPendingChanges(prev => ({ ...prev, standardMode: true }))
                                    }}
                                    className="rounded"
                                  />
                                  <span>Message History</span>
                                </label>
                              </div>
                            </div>

                            {/* Response Speed Settings */}
                            <div className="mt-4">
                              <label className="block text-gray-400 mb-2">Response Speed</label>
                              <div className="space-y-2">
                                <input
                                  type="range"
                                  min="100"
                                  max="2000"
                                  step="100"
                                  value={standardModelSettings.responseDelay || 400}
                                  onChange={(e) => setStandardModelSettings(prev => ({ ...prev, responseDelay: parseInt(e.target.value) }))}
                                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between text-xs text-gray-500">
                                  <span>Fast (100ms)</span>
                                  <span className="text-purple-400 font-medium">{standardModelSettings.responseDelay || 400}ms</span>
                                  <span>Slow (2000ms)</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => updateAIConfiguration('model-settings', { mode: 'standard', settings: standardModelSettings })}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition-colors font-medium"
                          >
                            Update Standard Mode Settings
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Pro Mode Settings */}
                    <div className="bg-gray-900/50 rounded-xl border border-purple-500/20 p-6">
                      <h2 className="text-xl font-semibold text-white mb-6">Pro Mode Configuration</h2>

                      {proModelSettings && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-gray-400 mb-2">Model Selection</label>
                            <div className="space-y-3">
                              {/* Model Type Toggle */}
                              <div className="flex items-center space-x-3 mb-4">
                                <button
                                  onClick={() => setProModelSettings(prev => ({ ...prev, useCustomModel: false }))}
                                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    !proModelSettings.useCustomModel
                                      ? 'bg-purple-600 text-white'
                                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                  }`}
                                >
                                  Preset Models
                                </button>
                                <button
                                  onClick={() => setProModelSettings(prev => ({ ...prev, useCustomModel: true }))}
                                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    proModelSettings.useCustomModel
                                      ? 'bg-purple-600 text-white'
                                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                  }`}
                                >
                                  Custom Model
                                </button>
                              </div>

                              {/* Preset Model Selection */}
                              {!proModelSettings.useCustomModel ? (
                                <select
                                  value={proModelSettings.model || ''}
                                  onChange={(e) => setProModelSettings(prev => ({ ...prev, model: e.target.value }))}
                                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                  <option value="">Select Model</option>
                                  <optgroup label="Premium Models (Recommended for Pro)">
                                    <option value="anthropic/claude-3-opus-20240229">Claude 3 Opus (Best Quality)</option>
                                    <option value="openai/gpt-4-turbo">GPT-4 Turbo (Code Expert)</option>
                                    <option value="anthropic/claude-3-sonnet-20240229">Claude 3 Sonnet (Balanced)</option>
                                    <option value="google/gemini-1.5-pro-latest">Gemini 1.5 Pro (Large Context)</option>
                                    <option value="meta-llama/llama-3-70b-instruct">Meta Llama 3 70B</option>
                                    <option value="mistralai/mixtral-8x7b-instruct">Mixtral 8x7B Instruct</option>
                                  </optgroup>
                                  <optgroup label="Free Models">
                                    <option value="deepseek/deepseek-r1-0528:free">DeepSeek R1 (Free)</option>
                                    <option value="deepseek/deepseek-chat-v3-0324:free">Deepseek Chat v3 (Free)</option>
                                  </optgroup>
                                </select>
                              ) : (
                                /* Custom Model Input */
                                <div className="space-y-3">
                                  <input
                                    type="text"
                                    value={proModelSettings.customModel || ''}
                                    onChange={(e) => setProModelSettings(prev => ({
                                      ...prev,
                                      customModel: e.target.value,
                                      model: e.target.value
                                    }))}
                                    placeholder="Enter custom model ID (e.g., openai/gpt-4-turbo)"
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                  />

                                  {/* Model Examples for Pro Mode */}
                                  <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
                                    <p className="text-xs font-medium text-blue-400 mb-2">Premium Model Examples:</p>
                                    <div className="grid grid-cols-1 gap-1 text-xs text-gray-400">
                                      <button
                                        onClick={() => setProModelSettings(prev => ({
                                          ...prev,
                                          customModel: 'openai/gpt-4-turbo',
                                          model: 'openai/gpt-4-turbo'
                                        }))}
                                        className="text-left hover:text-purple-400 transition-colors"
                                      >
                                        • openai/gpt-4-turbo (Best for coding)
                                      </button>
                                      <button
                                        onClick={() => setProModelSettings(prev => ({
                                          ...prev,
                                          customModel: 'anthropic/claude-3-opus-20240229',
                                          model: 'anthropic/claude-3-opus-20240229'
                                        }))}
                                        className="text-left hover:text-purple-400 transition-colors"
                                      >
                                        • anthropic/claude-3-opus-20240229 (Highest quality)
                                      </button>
                                      <button
                                        onClick={() => setProModelSettings(prev => ({
                                          ...prev,
                                          customModel: 'google/gemini-1.5-pro-latest',
                                          model: 'google/gemini-1.5-pro-latest'
                                        }))}
                                        className="text-left hover:text-purple-400 transition-colors"
                                      >
                                        • google/gemini-1.5-pro-latest (Large context)
                                      </button>
                                      <button
                                        onClick={() => setProModelSettings(prev => ({
                                          ...prev,
                                          customModel: 'mistralai/mixtral-8x22b-instruct',
                                          model: 'mistralai/mixtral-8x22b-instruct'
                                        }))}
                                        className="text-left hover:text-purple-400 transition-colors"
                                      >
                                        • mistralai/mixtral-8x22b-instruct (Advanced reasoning)
                                      </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                      Click any example to use it, or visit{' '}
                                      <a
                                        href="https://openrouter.ai/docs#models"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-purple-400 hover:text-purple-300 underline"
                                      >
                                        OpenRouter Models
                                      </a>{' '}
                                      for the complete list.
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-gray-400 mb-2">Temperature</label>
                              <div className="space-y-2">
                                <input
                                  type="range"
                                  min="0"
                                  max="2"
                                  step="0.1"
                                  value={proModelSettings.temperature || 0.5}
                                  onChange={(e) => setProModelSettings(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between text-xs text-gray-500">
                                  <span>Precise (0)</span>
                                  <span className="text-purple-400 font-medium">{proModelSettings.temperature || 0.5}</span>
                                  <span>Creative (2)</span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <label className="block text-gray-400 mb-2">Max Tokens</label>
                              <div className="space-y-2">
                                <input
                                  type="range"
                                  min="500"
                                  max="8000"
                                  step="100"
                                  value={proModelSettings.maxTokens || 5000}
                                  onChange={(e) => setProModelSettings(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between text-xs text-gray-500">
                                  <span>Brief (500)</span>
                                  <span className="text-purple-400 font-medium">{proModelSettings.maxTokens || 5000}</span>
                                  <span>Detailed (8000)</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <label className="block text-gray-400 mb-2">Top P</label>
                              <div className="space-y-2">
                                <input
                                  type="range"
                                  min="0.1"
                                  max="1"
                                  step="0.1"
                                  value={proModelSettings.topP || 0.8}
                                  onChange={(e) => setProModelSettings(prev => ({ ...prev, topP: parseFloat(e.target.value) }))}
                                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="text-center text-xs text-purple-400 font-medium">
                                  {proModelSettings.topP || 0.8}
                                </div>
                              </div>
                            </div>

                            <div>
                              <label className="block text-gray-400 mb-2">Frequency Penalty</label>
                              <div className="space-y-2">
                                <input
                                  type="range"
                                  min="0"
                                  max="2"
                                  step="0.1"
                                  value={proModelSettings.frequencyPenalty || 0.1}
                                  onChange={(e) => setProModelSettings(prev => ({ ...prev, frequencyPenalty: parseFloat(e.target.value) }))}
                                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="text-center text-xs text-purple-400 font-medium">
                                  {proModelSettings.frequencyPenalty || 0.1}
                                </div>
                              </div>
                            </div>

                            <div>
                              <label className="block text-gray-400 mb-2">Presence Penalty</label>
                              <div className="space-y-2">
                                <input
                                  type="range"
                                  min="0"
                                  max="2"
                                  step="0.1"
                                  value={proModelSettings.presencePenalty || 0}
                                  onChange={(e) => setProModelSettings(prev => ({ ...prev, presencePenalty: parseFloat(e.target.value) }))}
                                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="text-center text-xs text-purple-400 font-medium">
                                  {proModelSettings.presencePenalty || 0}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-gray-400 mb-2">System Prompt (Pro Mode)</label>
                            <textarea
                              value={proModelSettings.systemPrompt || ''}
                              onChange={(e) => setProModelSettings(prev => ({ ...prev, systemPrompt: e.target.value }))}
                              placeholder="Advanced system prompt for Pro Mode with code generation capabilities..."
                              rows={4}
                              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
                            <h4 className="text-sm font-medium text-gray-300 mb-4">Pro Mode Advanced Features</h4>

                            {/* Core Features */}
                            <div className="mb-4">
                              <h5 className="text-xs font-medium text-blue-400 mb-2">Core Features</h5>
                              <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={proModelSettings.enableCodeHighlighting || true}
                                    onChange={(e) => setProModelSettings(prev => ({ ...prev, enableCodeHighlighting: e.target.checked }))}
                                    className="rounded"
                                  />
                                  <span>Code Highlighting</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={proModelSettings.enableCopyCode || true}
                                    onChange={(e) => setProModelSettings(prev => ({ ...prev, enableCopyCode: e.target.checked }))}
                                    className="rounded"
                                  />
                                  <span>Copy Code Button</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={proModelSettings.disableAutoScroll || true}
                                    onChange={(e) => setProModelSettings(prev => ({ ...prev, disableAutoScroll: e.target.checked }))}
                                    className="rounded"
                                  />
                                  <span>Disable Auto-scroll</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={proModelSettings.enableAdvancedFormatting || true}
                                    onChange={(e) => setProModelSettings(prev => ({ ...prev, enableAdvancedFormatting: e.target.checked }))}
                                    className="rounded"
                                  />
                                  <span>Advanced Formatting</span>
                                </label>
                              </div>
                            </div>

                            {/* Advanced Features */}
                            <div className="mb-4">
                              <h5 className="text-xs font-medium text-purple-400 mb-2">Advanced Features</h5>
                              <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={proModelSettings.enableLivePreview || false}
                                    onChange={(e) => setProModelSettings(prev => ({ ...prev, enableLivePreview: e.target.checked }))}
                                    className="rounded"
                                  />
                                  <span>Live Code Preview</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={proModelSettings.enableFileExport || false}
                                    onChange={(e) => setProModelSettings(prev => ({ ...prev, enableFileExport: e.target.checked }))}
                                    className="rounded"
                                  />
                                  <span>File Export</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={proModelSettings.enableMultiLanguage || true}
                                    onChange={(e) => setProModelSettings(prev => ({ ...prev, enableMultiLanguage: e.target.checked }))}
                                    className="rounded"
                                  />
                                  <span>Multi-Language Support</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={proModelSettings.enableDebugMode || false}
                                    onChange={(e) => setProModelSettings(prev => ({ ...prev, enableDebugMode: e.target.checked }))}
                                    className="rounded"
                                  />
                                  <span>Debug Mode</span>
                                </label>
                              </div>
                            </div>

                            {/* Performance Settings */}
                            <div className="mb-4">
                              <h5 className="text-xs font-medium text-green-400 mb-2">Performance Settings</h5>
                              <div className="grid grid-cols-1 gap-3">
                                <div>
                                  <label className="block text-gray-400 mb-1 text-xs">Context Window Size</label>
                                  <div className="space-y-1">
                                    <input
                                      type="range"
                                      min="4"
                                      max="32"
                                      step="2"
                                      value={proModelSettings.contextWindow || 8}
                                      onChange={(e) => setProModelSettings(prev => ({ ...prev, contextWindow: parseInt(e.target.value) }))}
                                      className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500">
                                      <span>4 messages</span>
                                      <span className="text-purple-400 font-medium">{proModelSettings.contextWindow || 8} messages</span>
                                      <span>32 messages</span>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-gray-400 mb-1 text-xs">Thinking Time (ms)</label>
                                  <div className="space-y-1">
                                    <input
                                      type="range"
                                      min="500"
                                      max="3000"
                                      step="100"
                                      value={proModelSettings.thinkingTime || 1200}
                                      onChange={(e) => setProModelSettings(prev => ({ ...prev, thinkingTime: parseInt(e.target.value) }))}
                                      className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500">
                                      <span>Fast (500ms)</span>
                                      <span className="text-purple-400 font-medium">{proModelSettings.thinkingTime || 1200}ms</span>
                                      <span>Deep (3000ms)</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* UI Preferences */}
                            <div>
                              <h5 className="text-xs font-medium text-orange-400 mb-2">UI Preferences</h5>
                              <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={proModelSettings.enableDarkTheme || true}
                                    onChange={(e) => setProModelSettings(prev => ({ ...prev, enableDarkTheme: e.target.checked }))}
                                    className="rounded"
                                  />
                                  <span>Dark Theme</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={proModelSettings.enableAnimations || true}
                                    onChange={(e) => setProModelSettings(prev => ({ ...prev, enableAnimations: e.target.checked }))}
                                    className="rounded"
                                  />
                                  <span>Smooth Animations</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={proModelSettings.enableKeyboardShortcuts || true}
                                    onChange={(e) => setProModelSettings(prev => ({ ...prev, enableKeyboardShortcuts: e.target.checked }))}
                                    className="rounded"
                                  />
                                  <span>Keyboard Shortcuts</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={proModelSettings.enableFullscreen || false}
                                    onChange={(e) => setProModelSettings(prev => ({ ...prev, enableFullscreen: e.target.checked }))}
                                    className="rounded"
                                  />
                                  <span>Fullscreen Mode</span>
                                </label>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => updateAIConfiguration('model-settings', { mode: 'pro', settings: proModelSettings })}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition-colors font-medium"
                          >
                            Update Pro Mode Settings
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Knowledge Base Tab */}
              {activeTab === 'knowledge' && (
                <div className="space-y-6">
                  {/* Knowledge Management Documentation */}
                  <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl border border-blue-500/20 p-6">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                      <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Knowledge Management Guide</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="bg-gray-800/30 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-blue-400 mb-2">📝 Adding Entries</h3>
                        <ul className="text-sm text-gray-300 space-y-1">
                          <li>• Fill in title, category, and content</li>
                          <li>• Add relevant tags (comma-separated)</li>
                          <li>• Click "Add Knowledge Entry"</li>
                          <li>• Use bulk import for multiple entries</li>
                        </ul>
                      </div>

                      <div className="bg-gray-800/30 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-green-400 mb-2">🔍 Search & Filter</h3>
                        <ul className="text-sm text-gray-300 space-y-1">
                          <li>• Search by title, content, or tags</li>
                          <li>• Filter by category</li>
                          <li>• View entry details and metadata</li>
                          <li>• Delete individual entries</li>
                        </ul>
                      </div>

                      <div className="bg-gray-800/30 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-purple-400 mb-2">💾 Data Persistence</h3>
                        <ul className="text-sm text-gray-300 space-y-1">
                          <li>• Changes saved to database</li>
                          <li>• Click "Apply All Changes" to sync</li>
                          <li>• Works in dev and production</li>
                          <li>• Automatic backup and versioning</li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                      <h4 className="text-yellow-400 font-medium mb-2">💡 Best Practices</h4>
                      <div className="text-sm text-gray-300 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="font-medium mb-1">Content Guidelines:</p>
                          <ul className="space-y-1">
                            <li>• Keep titles clear and descriptive</li>
                            <li>• Include specific details in content</li>
                            <li>• Use relevant, searchable tags</li>
                            <li>• Organize by logical categories</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-medium mb-1">Management Tips:</p>
                          <ul className="space-y-1">
                            <li>• Test entries before bulk import</li>
                            <li>• Sync changes regularly</li>
                            <li>• Use search to avoid duplicates</li>
                            <li>• Review and update content periodically</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Knowledge Base Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gray-900/50 rounded-xl border border-purple-500/20 p-4">
                      <h3 className="text-sm font-medium text-gray-400">Total Entries</h3>
                      <p className="text-2xl font-bold text-white">{knowledgeStats.total || 0}</p>
                    </div>
                    <div className="bg-gray-900/50 rounded-xl border border-purple-500/20 p-4">
                      <h3 className="text-sm font-medium text-gray-400">Active Entries</h3>
                      <p className="text-2xl font-bold text-green-400">{knowledgeStats.active || 0}</p>
                    </div>
                    <div className="bg-gray-900/50 rounded-xl border border-purple-500/20 p-4">
                      <h3 className="text-sm font-medium text-gray-400">Categories</h3>
                      <p className="text-2xl font-bold text-blue-400">{knowledgeStats.categories || 0}</p>
                    </div>
                    <div className="bg-gray-900/50 rounded-xl border border-purple-500/20 p-4">
                      <h3 className="text-sm font-medium text-gray-400">Recent Entries</h3>
                      <p className="text-2xl font-bold text-purple-400">{knowledgeStats.recentEntries || 0}</p>
                    </div>
                  </div>

                  {/* Add New Knowledge Entry */}
                  <div className="bg-gray-900/50 rounded-xl border border-purple-500/20 p-6">
                    <h2 className="text-xl font-semibold text-white mb-6">Add New Knowledge Entry</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-gray-400 mb-2">Category</label>
                        <select
                          value={newKnowledgeEntry.category}
                          onChange={(e) => setNewKnowledgeEntry(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="">Select Category</option>
                          <option value="Services">Services</option>
                          <option value="Pricing">Pricing</option>
                          <option value="Technical">Technical</option>
                          <option value="Business">Business</option>
                          <option value="Process">Process</option>
                          <option value="FAQ">FAQ</option>
                          <option value="Contact">Contact</option>
                          <option value="Portfolio">Portfolio</option>
                          <option value="AI/ML">AI/ML</option>
                          <option value="Custom">Custom</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-400 mb-2">Title</label>
                        <input
                          type="text"
                          value={newKnowledgeEntry.title}
                          onChange={(e) => setNewKnowledgeEntry(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Knowledge entry title"
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-400 mb-2">Content</label>
                      <textarea
                        value={newKnowledgeEntry.content}
                        onChange={(e) => setNewKnowledgeEntry(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Detailed knowledge content..."
                        rows={8}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div className="mb-6">
                      <label className="block text-gray-400 mb-2">Tags</label>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={newKnowledgeEntry.tags.join(', ')}
                          onChange={(e) => {
                            const tagString = e.target.value;
                            const tags = tagString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
                            setNewKnowledgeEntry(prev => ({ ...prev, tags }));
                          }}
                          placeholder="Type tags separated by commas (e.g., web development, react, nextjs)"
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <div className="flex flex-wrap gap-2 mt-2">
                          {newKnowledgeEntry.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="bg-purple-900/30 text-purple-300 px-3 py-1 rounded-full text-sm flex items-center space-x-1"
                            >
                              <span>{tag}</span>
                              <button
                                onClick={() => {
                                  const newTags = newKnowledgeEntry.tags.filter((_, i) => i !== index);
                                  setNewKnowledgeEntry(prev => ({ ...prev, tags: newTags }));
                                }}
                                className="text-purple-400 hover:text-red-400 ml-1"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500">
                          Separate tags with commas. Click × to remove individual tags.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        onClick={() => addKnowledgeEntry()}
                        disabled={!newKnowledgeEntry.title || !newKnowledgeEntry.content || !newKnowledgeEntry.category || isAddingKnowledge}
                        className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800/50 text-white py-3 px-6 rounded-lg transition-colors font-medium flex items-center justify-center space-x-2"
                      >
                        {isAddingKnowledge ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Adding...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span>Add Knowledge Entry</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          // Auto-populate with comprehensive knowledge from nexious-knowledge.ts
                          const comprehensiveEntries = [
                            {
                              category: 'Services',
                              title: 'Full-Stack Web Development Services',
                              content: 'NEX-DEVS offers comprehensive full-stack web development services including React, Next.js, Node.js, Express, PostgreSQL, MongoDB, and modern deployment solutions. We specialize in creating scalable, performant web applications with modern UI/UX design, responsive layouts, and SEO optimization.',
                              tags: ['web development', 'full-stack', 'react', 'nextjs', 'nodejs', 'postgresql', 'mongodb']
                            },
                            {
                              category: 'Pricing',
                              title: 'WordPress Development Packages',
                              content: 'WordPress Basic ($350): 5 pages, responsive design, basic SEO, contact forms, 2 revision rounds. WordPress Professional ($450): 10 pages, e-commerce integration, advanced SEO, social media integration, premium plugins, 4 revision rounds. Most popular package for growing businesses.',
                              tags: ['wordpress', 'pricing', 'packages', 'ecommerce', 'seo']
                            },
                            {
                              category: 'Technical',
                              title: 'Modern Technology Stack',
                              content: 'Frontend: React, Next.js, TypeScript, Tailwind CSS, Framer Motion. Backend: Node.js, Express, NestJS, Python, PHP. Databases: PostgreSQL (preferred), MongoDB, MySQL, Redis. Cloud: AWS, Vercel, Netlify, DigitalOcean. Tools: Git, Docker, CI/CD, GitHub Actions.',
                              tags: ['technology', 'stack', 'frontend', 'backend', 'database', 'cloud', 'devops']
                            }
                          ];

                          // Add the first entry as an example
                          setNewKnowledgeEntry({
                            ...comprehensiveEntries[0],
                            isActive: true
                          });
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors font-medium"
                      >
                        Load Sample Entry
                      </button>
                    </div>
                  </div>

                  {/* Bulk Import Knowledge */}
                  <div className="bg-gray-900/50 rounded-xl border border-purple-500/20 p-6">
                    <h2 className="text-xl font-semibold text-white mb-6">Bulk Import Knowledge Base</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <button
                        onClick={() => {
                          // Import all service categories
                          const serviceEntries = [
                            {
                              category: 'Services',
                              title: 'UI/UX Design Services',
                              content: 'Professional UI/UX design services with modern interfaces and seamless user experiences. Includes custom UI design in Figma, interactive prototypes, responsive design system, user flow diagrams, design components library, animation with Framer, design handoff, and documentation. Timeline: 2-3 weeks, Price: $500.',
                              tags: ['ui', 'ux', 'design', 'figma', 'prototypes', 'responsive', 'animation'],
                              isActive: true
                            },
                            {
                              category: 'Services',
                              title: 'WordPress Development',
                              content: 'WordPress Basic ($350): 5 pages, responsive design, basic SEO, contact forms, 2 revision rounds. WordPress Professional ($450): 10 pages, e-commerce integration, advanced SEO, social media integration, premium plugins, 4 revision rounds. Most popular package for growing businesses.',
                              tags: ['wordpress', 'cms', 'ecommerce', 'seo', 'responsive', 'plugins'],
                              isActive: true
                            },
                            {
                              category: 'Services',
                              title: 'Full-Stack Development',
                              content: 'Complete full-stack web development using modern technologies. Frontend: React, Next.js, TypeScript, Tailwind CSS. Backend: Node.js, Express, NestJS. Databases: PostgreSQL, MongoDB. Includes API development, authentication, deployment, and maintenance. Starting at $550.',
                              tags: ['fullstack', 'react', 'nextjs', 'nodejs', 'postgresql', 'api', 'deployment'],
                              isActive: true
                            }
                          ];

                          bulkImportEntries(serviceEntries);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors font-medium"
                      >
                        Import Services
                      </button>

                      <button
                        onClick={() => {
                          // Import pricing information
                          const pricingEntries = [
                            {
                              category: 'Pricing',
                              title: 'Design Package Pricing',
                              content: 'UI/UX Design: $500 (2-3 weeks). Includes custom UI design in Figma, interactive prototypes, responsive design system, user flow diagrams, design components library, animation with Framer, design handoff, documentation, collaboration sessions, and 3 revision rounds.',
                              tags: ['pricing', 'design', 'ui', 'ux', 'figma', 'prototypes'],
                              isActive: true
                            },
                            {
                              category: 'Pricing',
                              title: 'Development Package Pricing',
                              content: 'WordPress Basic: $350, WordPress Professional: $450, Full-Stack Development: $550. E-commerce solutions: $3,000-$15,000. Mobile apps: $5,000-$25,000. Custom pricing available for enterprise solutions and complex requirements.',
                              tags: ['pricing', 'wordpress', 'fullstack', 'ecommerce', 'mobile', 'enterprise'],
                              isActive: true
                            }
                          ];

                          bulkImportEntries(pricingEntries);
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors font-medium"
                      >
                        Import Pricing
                      </button>

                      <button
                        onClick={() => {
                          // Import technical information
                          const technicalEntries = [
                            {
                              category: 'Technical',
                              title: 'Technology Stack',
                              content: 'Frontend: React, Next.js, TypeScript, JavaScript, Tailwind CSS, CSS3, SCSS, Material UI, Bootstrap. Backend: Node.js, Express.js, NestJS, Python, PHP. Databases: PostgreSQL (preferred), MongoDB, MySQL, Redis, SQLite. Cloud: AWS, Vercel, Netlify, DigitalOcean, Heroku.',
                              tags: ['technology', 'frontend', 'backend', 'database', 'cloud', 'react', 'nodejs'],
                              isActive: true
                            },
                            {
                              category: 'Technical',
                              title: 'Development Process',
                              content: 'Discovery Phase (1-2 weeks): Project brief, requirements document, timeline. Planning & Design (2-3 weeks): Wireframes, mockups, technical specifications. Development (4-8 weeks): Coding, testing, reviews. Testing & Launch (1-2 weeks): QA, deployment, training.',
                              tags: ['process', 'development', 'planning', 'design', 'testing', 'deployment'],
                              isActive: true
                            }
                          ];

                          bulkImportEntries(technicalEntries);
                        }}
                        className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition-colors font-medium"
                      >
                        Import Technical
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        onClick={() => {
                          // Import business and contact information
                          const businessEntries = [
                            {
                              category: 'Business',
                              title: 'About NEX-DEVS',
                              content: 'NEX-DEVS is a web development company founded by Ali Hasnaat in 2018, based in Pakistan. We specialize in web development, UI/UX design, and e-commerce solutions. Our mission is to provide high-quality, innovative web solutions that help businesses grow and succeed online.',
                              tags: ['about', 'company', 'ali hasnaat', 'pakistan', 'mission', 'web development'],
                              isActive: true
                            },
                            {
                              category: 'Contact',
                              title: 'Contact Information',
                              content: 'Email: nexwebs.org@gmail.com, Phone: 0329-2425950, Website: https://nex-devs.com. Available for consultations Monday-Friday 9 AM - 6 PM PKT. Free initial consultation available for all new projects. Response time: Within 24 hours.',
                              tags: ['contact', 'email', 'phone', 'consultation', 'response time'],
                              isActive: true
                            }
                          ];

                          bulkImportEntries(businessEntries);
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg transition-colors font-medium"
                      >
                        Import Business Info
                      </button>

                      <button
                        onClick={() => {
                          // Import all comprehensive knowledge
                          const allEntries = [
                            // Services
                            {
                              category: 'Services',
                              title: 'UI/UX Design Services',
                              content: 'Professional UI/UX design services with modern interfaces and seamless user experiences. Includes custom UI design in Figma, interactive prototypes, responsive design system, user flow diagrams, design components library, animation with Framer, design handoff, and documentation. Timeline: 2-3 weeks, Price: $500.',
                              tags: ['ui', 'ux', 'design', 'figma', 'prototypes', 'responsive', 'animation'],
                              isActive: true
                            },
                            // Pricing
                            {
                              category: 'Pricing',
                              title: 'Complete Pricing Guide',
                              content: 'UI/UX Design: $500. WordPress Basic: $350. WordPress Professional: $450 (most popular). Full-Stack Development: $550. E-commerce: $3,000-$15,000. Mobile Apps: $5,000-$25,000. All packages include revisions, support, and documentation.',
                              tags: ['pricing', 'packages', 'popular', 'revisions', 'support'],
                              isActive: true
                            },
                            // FAQ
                            {
                              category: 'FAQ',
                              title: 'Frequently Asked Questions',
                              content: 'How much does a website cost? Depends on requirements - from $350 for WordPress Basic to $25,000 for complex mobile apps. What technologies do you use? Modern stack including React, Next.js, Node.js, PostgreSQL. How long does development take? 2-16 weeks depending on complexity.',
                              tags: ['faq', 'cost', 'technologies', 'timeline', 'complexity'],
                              isActive: true
                            }
                          ];

                          bulkImportEntries(allEntries);
                        }}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 px-4 rounded-lg transition-colors font-medium"
                      >
                        Import All Knowledge
                      </button>
                    </div>
                  </div>

                  {/* Existing Knowledge Entries */}
                  <div className="bg-gray-900/50 rounded-xl border border-purple-500/20 p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-white mb-4 lg:mb-0">Existing Knowledge Entries</h2>

                      {/* Search and Filter Controls */}
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search entries..."
                            value={knowledgeSearchTerm}
                            onChange={(e) => setKnowledgeSearchTerm(e.target.value)}
                            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 w-full md:w-64"
                          />
                          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>

                        <select
                          value={knowledgeFilterCategory}
                          onChange={(e) => setKnowledgeFilterCategory(e.target.value)}
                          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="">All Categories</option>
                          <option value="Services">Services</option>
                          <option value="Pricing">Pricing</option>
                          <option value="Technical">Technical</option>
                          <option value="Business">Business</option>
                          <option value="Process">Process</option>
                          <option value="FAQ">FAQ</option>
                          <option value="Contact">Contact</option>
                          <option value="Portfolio">Portfolio</option>
                          <option value="AI/ML">AI/ML</option>
                          <option value="Custom">Custom</option>
                        </select>

                        {knowledgeEntries.length > 0 && (
                          <button
                            onClick={clearAllKnowledgeEntries}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm flex items-center space-x-2"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Clear All</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      {(() => {
                        // Filter entries based on search term and category
                        let filteredEntries = knowledgeEntries;

                        if (knowledgeSearchTerm) {
                          filteredEntries = filteredEntries.filter(entry =>
                            entry.title.toLowerCase().includes(knowledgeSearchTerm.toLowerCase()) ||
                            entry.content.toLowerCase().includes(knowledgeSearchTerm.toLowerCase()) ||
                            entry.tags.some(tag => tag.toLowerCase().includes(knowledgeSearchTerm.toLowerCase()))
                          );
                        }

                        if (knowledgeFilterCategory) {
                          filteredEntries = filteredEntries.filter(entry => entry.category === knowledgeFilterCategory);
                        }

                        return filteredEntries.length > 0 ? (
                          <>
                            <div className="text-sm text-gray-400 mb-4">
                              Showing {filteredEntries.length} of {knowledgeEntries.length} entries
                            </div>
                            {filteredEntries.map((entry) => (
                              <div key={entry.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30 hover:border-purple-500/30 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                  <h3 className="text-lg font-semibold text-white">{entry.title}</h3>
                                  <div className="flex items-center space-x-2">
                                    <span className={`px-2 py-1 rounded text-xs ${entry.isActive ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'}`}>
                                      {entry.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                    <span className="px-2 py-1 rounded text-xs bg-blue-900/20 text-blue-400">
                                      {entry.category}
                                    </span>
                                    <button
                                      onClick={() => deleteKnowledgeEntry(entry.id, entry.title)}
                                      className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-900/20 transition-colors"
                                      title="Delete entry"
                                    >
                                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                                <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                                  {entry.content.length > 300 ? `${entry.content.substring(0, 300)}...` : entry.content}
                                </p>
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {entry.tags.map((tag, index) => (
                                    <span key={index} className="bg-purple-900/20 text-purple-400 px-2 py-1 rounded text-xs">
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                                <div className="flex justify-between items-center text-xs text-gray-500">
                                  {entry.dateAdded && (
                                    <span>Added: {new Date(entry.dateAdded).toLocaleDateString()}</span>
                                  )}
                                  <span>ID: {entry.id}</span>
                                </div>
                              </div>
                            ))}
                          </>
                        ) : (
                          <div className="text-center text-gray-500 py-8">
                            {knowledgeEntries.length === 0 ? (
                              <>
                                <p>No knowledge entries found</p>
                                <p className="text-sm mt-2">Add your first knowledge entry above</p>
                              </>
                            ) : (
                              <>
                                <p>No entries match your search criteria</p>
                                <p className="text-sm mt-2">Try adjusting your search term or category filter</p>
                              </>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}

              {/* Pro Mode Management Tab */}
              {activeTab === 'pro-mode' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-xl border border-purple-500/20 p-6">
                    <h2 className="text-2xl font-semibold text-white mb-4 flex items-center space-x-3">
                      <span className="text-3xl">⭐</span>
                      <span>Pro Mode Management</span>
                    </h2>
                    <p className="text-gray-300 mb-6">
                      Manage Pro Mode availability, expiration dates, and maintenance settings. Control when users can access advanced AI features and premium functionality.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-purple-600/20 rounded-lg p-4 border border-purple-500/30">
                        <div className="text-purple-400 text-sm font-medium mb-1">Current Status</div>
                        <div className="text-white text-lg font-semibold">Live Management</div>
                      </div>
                      <div className="bg-blue-600/20 rounded-lg p-4 border border-blue-500/30">
                        <div className="text-blue-400 text-sm font-medium mb-1">Real-time Updates</div>
                        <div className="text-white text-lg font-semibold">Instant Changes</div>
                      </div>
                      <div className="bg-green-600/20 rounded-lg p-4 border border-green-500/30">
                        <div className="text-green-400 text-sm font-medium mb-1">Production Ready</div>
                        <div className="text-white text-lg font-semibold">Error Handling</div>
                      </div>
                    </div>
                  </div>

                  {/* Pro Mode Manager Component */}
                  <ProModeErrorBoundary>
                    <ProModeManager
                      onStatusChange={(status) => {
                        // Handle status changes if needed
                        console.log('Pro Mode status updated:', status);
                      }}
                      onPendingChange={() => {
                        // Mark Pro Mode changes as pending
                        setPendingChanges(prev => ({ ...prev, proMode: true }))
                      }}
                    />
                  </ProModeErrorBoundary>

                  {/* Additional Information */}
                  <div className="bg-gray-900/50 rounded-xl border border-gray-700/30 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Important Notes</h3>
                    <div className="space-y-3 text-gray-300">
                      <div className="flex items-start space-x-3">
                        <span className="text-purple-400 mt-1">🔄</span>
                        <div>
                          <strong>Apply Changes:</strong> After making Pro Mode changes, click the "Apply All Changes" button above to sync settings to the live website.
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <span className="text-yellow-400 mt-1">⚠️</span>
                        <div>
                          <strong>Production Impact:</strong> Changes made here will immediately affect the live website and all users.
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <span className="text-blue-400 mt-1">ℹ️</span>
                        <div>
                          <strong>Auto-refresh:</strong> Status updates automatically every 30 seconds to show real-time information.
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <span className="text-green-400 mt-1">✅</span>
                        <div>
                          <strong>Error Handling:</strong> All operations include comprehensive error handling and validation.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Advanced Fallback Models Tab */}
              {activeTab === 'fallback' && (
                <div className="space-y-6">
                  {/* Fallback System Overview */}
                  <div className="bg-gray-900/50 rounded-xl border border-purple-500/20 p-6">
                    <h2 className="text-xl font-semibold text-white mb-6">Advanced Fallback System</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* System Status */}
                      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                        <h3 className="text-sm font-medium text-gray-400 mb-2">System Status</h3>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${fallbackSystemConfig.enabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className={`text-sm font-medium ${fallbackSystemConfig.enabled ? 'text-green-400' : 'text-red-400'}`}>
                            {fallbackSystemConfig.enabled ? 'Active' : 'Disabled'}
                          </span>
                        </div>
                      </div>

                      {/* Primary Timeout */}
                      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                        <h3 className="text-sm font-medium text-gray-400 mb-2">Primary Timeout</h3>
                        <p className="text-lg font-bold text-blue-400">{fallbackSystemConfig.primaryTimeout}ms</p>
                      </div>

                      {/* Fallback Models Count */}
                      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                        <h3 className="text-sm font-medium text-gray-400 mb-2">Fallback Models</h3>
                        <p className="text-lg font-bold text-purple-400">{fallbackSystemConfig.fallbackModels?.length || 0} configured</p>
                      </div>
                    </div>

                    {/* System Configuration */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Enable Fallback System
                        </label>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => setFallbackSystemConfig(prev => ({ ...prev, enabled: !prev.enabled }))}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              fallbackSystemConfig.enabled ? 'bg-purple-600' : 'bg-gray-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                fallbackSystemConfig.enabled ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                          <span className="text-sm text-gray-400">
                            {fallbackSystemConfig.enabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Primary Model Timeout (ms)
                        </label>
                        <input
                          type="number"
                          value={fallbackSystemConfig.primaryTimeout}
                          onChange={(e) => setFallbackSystemConfig(prev => ({ ...prev, primaryTimeout: parseInt(e.target.value) }))}
                          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                          min="5000"
                          max="30000"
                          step="1000"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Max Fallback Attempts
                        </label>
                        <input
                          type="number"
                          value={fallbackSystemConfig.maxFallbackAttempts}
                          onChange={(e) => setFallbackSystemConfig(prev => ({ ...prev, maxFallbackAttempts: parseInt(e.target.value) }))}
                          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                          min="1"
                          max="5"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Fallback Delay (ms)
                        </label>
                        <input
                          type="number"
                          value={fallbackSystemConfig.fallbackDelay}
                          onChange={(e) => setFallbackSystemConfig(prev => ({ ...prev, fallbackDelay: parseInt(e.target.value) }))}
                          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                          min="0"
                          max="2000"
                          step="100"
                        />
                      </div>
                    </div>

                    {/* Save Configuration Button */}
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={() => updateFallbackSystemConfig(fallbackSystemConfig)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                      >
                        Save Configuration
                      </button>
                    </div>
                  </div>

                  {/* Add New Fallback Model */}
                  <div className="bg-gray-900/50 rounded-xl border border-purple-500/20 p-6">
                    <h2 className="text-xl font-semibold text-white mb-6">Add Fallback Model</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Model ID
                        </label>
                        <input
                          type="text"
                          value={newFallbackModel.model}
                          onChange={(e) => setNewFallbackModel(prev => ({ ...prev, model: e.target.value }))}
                          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                          placeholder="e.g., anthropic/claude-3-haiku"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Description
                        </label>
                        <input
                          type="text"
                          value={newFallbackModel.description}
                          onChange={(e) => setNewFallbackModel(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                          placeholder="e.g., Claude 3 Haiku - Fast and reliable fallback"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Priority (1 = highest)
                        </label>
                        <input
                          type="number"
                          value={newFallbackModel.priority}
                          onChange={(e) => setNewFallbackModel(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                          min="1"
                          max="10"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Timeout (ms)
                        </label>
                        <input
                          type="number"
                          value={newFallbackModel.timeout}
                          onChange={(e) => setNewFallbackModel(prev => ({ ...prev, timeout: parseInt(e.target.value) }))}
                          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                          min="3000"
                          max="15000"
                          step="1000"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Temperature
                        </label>
                        <input
                          type="number"
                          value={newFallbackModel.temperature}
                          onChange={(e) => setNewFallbackModel(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                          min="0"
                          max="2"
                          step="0.1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Max Tokens
                        </label>
                        <input
                          type="number"
                          value={newFallbackModel.maxTokens}
                          onChange={(e) => setNewFallbackModel(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                          min="500"
                          max="4000"
                          step="100"
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-4">
                      <button
                        onClick={() => setNewFallbackModel({
                          model: '',
                          priority: 1,
                          timeout: 8000,
                          maxRetries: 2,
                          temperature: 0.7,
                          maxTokens: 2000,
                          isEnabled: true,
                          description: ''
                        })}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        Reset
                      </button>
                      <button
                        onClick={addFallbackModel}
                        disabled={!newFallbackModel.model || !newFallbackModel.description}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors"
                      >
                        Add Model
                      </button>
                    </div>
                  </div>

                  {/* Configured Fallback Models */}
                  <div className="bg-gray-900/50 rounded-xl border border-purple-500/20 p-6">
                    <h2 className="text-xl font-semibold text-white mb-6">Configured Fallback Models</h2>

                    {fallbackSystemConfig.fallbackModels && fallbackSystemConfig.fallbackModels.length > 0 ? (
                      <div className="space-y-4">
                        {fallbackSystemConfig.fallbackModels
                          .sort((a, b) => a.priority - b.priority)
                          .map((model, index) => (
                            <div key={model.model} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                  <div className={`w-3 h-3 rounded-full ${model.isEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                  <h3 className="text-lg font-medium text-white">{model.description}</h3>
                                  <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                                    Priority {model.priority}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => testFallbackModel(model)}
                                    disabled={isTestingFallbackModel}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors"
                                  >
                                    {isTestingFallbackModel ? 'Testing...' : 'Test'}
                                  </button>
                                  <button
                                    onClick={() => removeFallbackModel(model.model)}
                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-400">Model:</span>
                                  <p className="text-white font-mono">{model.model}</p>
                                </div>
                                <div>
                                  <span className="text-gray-400">Timeout:</span>
                                  <p className="text-white">{model.timeout}ms</p>
                                </div>
                                <div>
                                  <span className="text-gray-400">Temperature:</span>
                                  <p className="text-white">{model.temperature}</p>
                                </div>
                                <div>
                                  <span className="text-gray-400">Max Tokens:</span>
                                  <p className="text-white">{model.maxTokens}</p>
                                </div>
                              </div>

                              {/* Test Results */}
                              {fallbackTestResults[model.model] && (
                                <div className="mt-3 p-3 bg-gray-700/50 rounded-lg">
                                  <div className="flex items-center space-x-2">
                                    <div className={`w-2 h-2 rounded-full ${fallbackTestResults[model.model].success ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <span className="text-sm font-medium text-gray-300">
                                      Test Result: {fallbackTestResults[model.model].success ? 'Success' : 'Failed'}
                                    </span>
                                    {fallbackTestResults[model.model].responseTime && (
                                      <span className="text-sm text-gray-400">
                                        ({fallbackTestResults[model.model].responseTime}ms)
                                      </span>
                                    )}
                                  </div>
                                  {fallbackTestResults[model.model].error && (
                                    <p className="text-sm text-red-400 mt-1">
                                      Error: {fallbackTestResults[model.model].error}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        <p>No fallback models configured</p>
                        <p className="text-sm mt-2">Add your first fallback model above</p>
                      </div>
                    )}
                  </div>

                  {/* Fallback System Monitoring */}
                  <div className="bg-gray-900/50 rounded-xl border border-purple-500/20 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-white">Fallback System Monitoring</h2>
                      <div className="flex space-x-3">
                        <button
                          onClick={fetchFallbackStats}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          Refresh Stats
                        </button>
                        <button
                          onClick={clearFallbackLogs}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          Clear Logs
                        </button>
                      </div>
                    </div>

                    {/* Statistics Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                        <h3 className="text-sm font-medium text-gray-400 mb-2">Total Fallbacks</h3>
                        <p className="text-2xl font-bold text-blue-400">{fallbackStats.totalFallbacks}</p>
                      </div>

                      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                        <h3 className="text-sm font-medium text-gray-400 mb-2">Success Rate</h3>
                        <p className="text-2xl font-bold text-green-400">{fallbackStats.successRate.toFixed(1)}%</p>
                      </div>

                      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                        <h3 className="text-sm font-medium text-gray-400 mb-2">Avg Response Time</h3>
                        <p className="text-2xl font-bold text-purple-400">{fallbackStats.averageResponseTime.toFixed(0)}ms</p>
                      </div>

                      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                        <h3 className="text-sm font-medium text-gray-400 mb-2">Most Used Model</h3>
                        <p className="text-lg font-bold text-yellow-400 truncate">{fallbackStats.mostUsedModel}</p>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                      <h3 className="text-lg font-medium text-white mb-4">Recent Fallback Activity</h3>

                      {fallbackStats.recentActivity && fallbackStats.recentActivity.length > 0 ? (
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {fallbackStats.recentActivity.map((log: any, index: number) => (
                            <div key={index} className="bg-gray-700/50 rounded-lg p-3 border border-gray-600/30">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-3">
                                  <div className={`w-3 h-3 rounded-full ${log.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                  <span className="text-sm font-medium text-white">
                                    {log.fallbackModel}
                                  </span>
                                  <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                                    Priority {log.fallbackPriority}
                                  </span>
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    log.userMode === 'pro' ? 'bg-yellow-600 text-white' : 'bg-blue-600 text-white'
                                  }`}>
                                    {log.userMode.toUpperCase()}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-400">
                                  {new Date(log.timestamp).toLocaleString()}
                                </div>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                                <div>
                                  <span className="text-gray-400">Primary Model:</span>
                                  <p className="text-white font-mono truncate">{log.primaryModel}</p>
                                </div>
                                <div>
                                  <span className="text-gray-400">Response Time:</span>
                                  <p className="text-white">{log.responseTime}ms</p>
                                </div>
                                <div>
                                  <span className="text-gray-400">Status:</span>
                                  <p className={`font-medium ${log.success ? 'text-green-400' : 'text-red-400'}`}>
                                    {log.success ? 'Success' : 'Failed'}
                                  </p>
                                </div>
                                {log.error && (
                                  <div>
                                    <span className="text-gray-400">Error:</span>
                                    <p className="text-red-400 truncate">{log.error}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center text-gray-500 py-8">
                          <p>No fallback activity recorded</p>
                          <p className="text-sm mt-2">Fallback usage will appear here when models are switched</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </AdminAuthCheck>
  )
}
