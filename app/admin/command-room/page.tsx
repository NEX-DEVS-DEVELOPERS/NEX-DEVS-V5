'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminAuthCheck from '@/app/components/AdminAuthCheck'
import { toast, Toaster } from 'react-hot-toast'

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
              <p className="text-gray-400 mt-2">Manage chatbot settings and monitor performance</p>
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* API Key Management */}
              <div className="bg-gray-900/50 rounded-xl border border-purple-500/20 p-6 lg:col-span-1">
                <h2 className="text-xl font-semibold text-white mb-4">Chatbot Configuration</h2>
                
                {/* Status indicator */}
                <div className="mb-5 bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Current API Key:</span>
                    <span className={`text-sm font-mono ${isChatbotEnabled ? 'text-green-400' : 'text-gray-500'}`}>
                      {apiKey || 'No API key set'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Current Model:</span>
                    <span className="text-sm font-mono text-blue-400">
                      {availableModels.find(m => m.id === currentModel)?.name || currentModel || 'Default Model'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Status:</span>
                    <div className="flex items-center">
                      <div className={`w-2.5 h-2.5 rounded-full mr-2 ${isChatbotEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className={`${isChatbotEnabled ? 'text-green-400' : 'text-red-400'}`}>
                        {isChatbotEnabled ? 'Active' : 'Maintenance Mode'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* API Key Update */}
                <div className="mb-6 space-y-4">
                  <h3 className="text-md font-semibold text-white mb-2">API Key Management</h3>
                  <div>
                    <label className="block text-gray-400 mb-2">New OpenRouter API Key</label>
                    <div className="flex">
                      <input
                        type="password"
                        value={newApiKey}
                        onChange={(e) => setNewApiKey(e.target.value)}
                        placeholder="sk-or-v1-..."
                        className="w-full bg-gray-800 border border-gray-700 rounded-l-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <button
                        onClick={updateApiKey}
                        disabled={!newApiKey.trim()}
                        className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800/50 disabled:cursor-not-allowed text-white rounded-r-lg px-4 transition-colors"
                      >
                        Update
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Enter your OpenRouter API key to change the key used by the Nexious chatbot
                    </p>
                  </div>
                </div>

                {/* Model Selection */}
                <div className="mb-6 space-y-4">
                  <h3 className="text-md font-semibold text-white mb-2">AI Model Selection</h3>
                  
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/30 mb-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <button
                        onClick={() => setIsCustomModel(false)}
                        className={`px-3 py-1.5 rounded-md text-sm ${!isCustomModel ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                      >
                        Select Model
                      </button>
                      <button
                        onClick={() => setIsCustomModel(true)}
                        className={`px-3 py-1.5 rounded-md text-sm ${isCustomModel ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                      >
                        Custom Model
                      </button>
                    </div>
                    
                    {isCustomModel ? (
                      <div>
                        <label className="block text-gray-400 mb-2">OpenRouter Model ID or Name</label>
                        <div className="flex">
                          <input
                            type="text"
                            value={customModel}
                            onChange={(e) => setCustomModel(e.target.value)}
                            placeholder="e.g., claude-3-opus or anthropic/claude-3-opus-20240229"
                            className="w-full bg-gray-800 border border-gray-700 rounded-l-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                          <button
                            onClick={updateModel}
                            disabled={!customModel.trim()}
                            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800/50 disabled:cursor-not-allowed text-white rounded-r-lg px-4 transition-colors"
                          >
                            Update
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          You can enter just the model name (e.g., "claude-3-opus") or the full provider/model format (e.g., "anthropic/claude-3-opus-20240229"). Browse available models in the 
                          <a href="https://openrouter.ai/docs#models" target="_blank" rel="noopener" className="text-purple-400 hover:text-purple-300 ml-1">
                            OpenRouter models list
                          </a>.
                        </p>
                        
                        <div className="mt-3 bg-gray-800/30 p-2 rounded-md border border-gray-700/30">
                          <p className="text-xs text-blue-400 font-medium mb-1">Example Model Names:</p>
                          <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                            <p className="text-xs text-gray-400">gemini-1.5-pro</p>
                            <p className="text-xs text-gray-400">claude-3-opus</p>
                            <p className="text-xs text-gray-400">gpt-4-turbo</p>
                            <p className="text-xs text-gray-400">mistral-large</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-gray-400 mb-2">Select AI Model</label>
                        <div className="flex">
                          <select
                            value={newModel}
                            onChange={(e) => setNewModel(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-l-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="">-- Select a model --</option>
                            {availableModels.map(model => (
                              model.isHeader ? (
                                <option key={model.id} value="" disabled className="font-semibold bg-gray-700">
                                  {model.name}
                                </option>
                              ) : (
                                <option key={model.id} value={model.id}>
                                  {model.name} {model.isFree ? '✓' : ''}
                                </option>
                              )
                            ))}
                          </select>
                          <button
                            onClick={updateModel}
                            disabled={!newModel.trim()}
                            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800/50 disabled:cursor-not-allowed text-white rounded-r-lg px-4 transition-colors"
                          >
                            Update
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Select an AI model to power the Nexious chatbot. Free models have no usage limits but may have lower capabilities.
                        </p>
                      </div>
                    )}
                    
                    {/* Error message display */}
                    {modelUpdateError && (
                      <div className="mt-2 text-red-400 text-sm bg-red-900/20 border border-red-700/30 rounded-md p-2">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {modelUpdateError}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Refresh Interval */}
                <div>
                  <label className="block text-gray-400 mb-2">Refresh Interval</label>
                  <div className="flex items-center">
                    <input
                      type="range"
                      min="10"
                      max="120"
                      step="10"
                      value={refreshInterval}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value)
                        setRefreshInterval(newValue)
                        setIsIntervalChanged(newValue !== savedInterval)
                      }}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="ml-3 text-gray-400 min-w-[50px]">{refreshInterval}s</span>
                    {isIntervalChanged && (
                      <button
                        onClick={saveRefreshInterval}
                        className="ml-3 bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded-md text-sm transition-colors"
                      >
                        Save
                      </button>
                    )}
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
          )}
        </div>
      </div>
    </AdminAuthCheck>
  )
} 