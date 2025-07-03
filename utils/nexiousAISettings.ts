// nexiousAISettings.ts
// SINGLE SOURCE OF TRUTH for all AI model settings and configurations
// This file centralizes all AI-related configuration to prevent duplication

// Types for AI model settings
export interface AIModelSettings {
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  presencePenalty: number;
  frequencyPenalty: number;
  timeout: number;
  thinkingTime: number;
  apiEndpoint: string;
  // Extended settings for Standard Mode
  useCustomModel?: boolean;
  customModel?: string;
  messageLimit?: number;
  cooldownHours?: number;
  disableAutoScroll?: boolean;
  enableTypingIndicator?: boolean;
  enableSoundNotifications?: boolean;
  enableMessageHistory?: boolean;
  responseDelay?: number;
  systemPrompt?: string;
  // Extended settings for Pro Mode
  enableCodeHighlighting?: boolean;
  enableCopyCode?: boolean;
  enableAdvancedFormatting?: boolean;
  enableLivePreview?: boolean;
  enableFileExport?: boolean;
  enableMultiLanguage?: boolean;
  enableDebugMode?: boolean;
  contextWindow?: number;
  enableDarkTheme?: boolean;
  enableAnimations?: boolean;
  enableKeyboardShortcuts?: boolean;
  enableFullscreen?: boolean;
}

export interface AISettings {
  standard: AIModelSettings;
  pro: AIModelSettings;
}

// Pro Mode maintenance configuration
export interface ProModeMaintenanceConfig {
  isUnderMaintenance: boolean;
  maintenanceMessage: string;
  maintenanceEndDate: Date;
  showCountdown: boolean;
}

// Standard Mode request limit configuration
export interface StandardModeConfig {
  requestLimit: number;
  cooldownHours: number;
  resetInterval: number; // in milliseconds
}

// API Key management configuration
export interface APIKeyConfig {
  primary: string;
  backup: string;
  fallbackModels: string[];
}

// Advanced Fallback Model Configuration
export interface FallbackModelConfig {
  model: string;
  priority: number;
  timeout: number;
  maxRetries: number;
  temperature: number;
  maxTokens: number;
  isEnabled: boolean;
  description: string;
}

// Fallback System Configuration
export interface FallbackSystemConfig {
  enabled: boolean;
  primaryTimeout: number;
  fallbackModels: FallbackModelConfig[];
  notificationEnabled: boolean;
  notificationMessage: string;
  maxFallbackAttempts: number;
  fallbackDelay: number;
}

// =============================================================================
// CENTRALIZED AI CONFIGURATION - SINGLE SOURCE OF TRUTH
// =============================================================================

// API Key Configuration - Primary and Backup
const API_KEY_CONFIG: APIKeyConfig = {
  primary: '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',
  backup: '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',
  fallbackModels: [
    'anthropic/claude-3-haiku',
    'meta-llama/llama-3.1-8b-instruct',
    'mistralai/mistral-small',
    'anthropic/claude-3.5-haiku'
  ]
};

// Pro Mode Maintenance Configuration
const PRO_MODE_MAINTENANCE: ProModeMaintenanceConfig = {
  isUnderMaintenance: true,
  maintenanceMessage: "Nexious Pro Mode is currently under maintenance. We are optimizing the code generation features.",
  maintenanceEndDate: new Date('2025-08-01T00:00:00.000Z'),
  showCountdown: true
};

// Standard Mode Request Limit Configuration
const STANDARD_MODE_CONFIG: StandardModeConfig = {
  requestLimit: 5,
  cooldownHours: 1,
  resetInterval: 86400000
};

// Advanced Fallback System Configuration
const FALLBACK_SYSTEM_CONFIG: FallbackSystemConfig = {
  enabled: true,
  primaryTimeout: 6500,
  fallbackModels: [
    {
      model: 'qwen/qwen3-235b-a22b:free',
      priority: 1,
      timeout: 8000,
      maxRetries: 2,
      temperature: 0.8,
      maxTokens: 30000,
      isEnabled: true,
      description: 'qwen3-235b-a22b:free -fast'
    },
    {
      model: 'meta-llama/llama-3.1-8b-instruct',
      priority: 2,
      timeout: 7000,
      maxRetries: 2,
      temperature: 0.6,
      maxTokens: 1800,
      isEnabled: true,
      description: 'Llama 3.1 8B - High-quality backup model'
    },
    {
      model: 'qwen/qwen3-32b:free',
      priority: 2,
      timeout: 8000,
      maxRetries: 2,
      temperature: 0.8,
      maxTokens: 2100,
      isEnabled: true,
      description: 'qwen3-32b:free fast'
    },
    {
      model: 'mistralai/mistral-small',
      priority: 3,
      timeout: 6000,
      maxRetries: 1,
      temperature: 0.5,
      maxTokens: 3000,
      isEnabled: true,
      description: 'Mistral Small - Efficient fallback option'
    }
  ],
  notificationEnabled: true,
  notificationMessage: 'Switched to premium backup AI model for enhanced performance',
  maxFallbackAttempts: 3,
  fallbackDelay: 500
};

// Default settings for Standard Mode (using DeepSeek model) - OPTIMIZED FOR FAST, COMPLETE RESPONSES
const standardModeSettings: AIModelSettings = {
  model: 'deepseek/deepseek-r1-0528:free',
  temperature: 0.8,
  maxTokens: 30000,
  topP: 0.8,
  presencePenalty: 0.2,
  frequencyPenalty: 0.3,
  timeout: 8000,
  thinkingTime: 100,
  apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
  // Extended settings
  useCustomModel: true,
  customModel: '',
  messageLimit: 5,
  cooldownHours: 1,
  disableAutoScroll: true,
  enableTypingIndicator: true,
  enableSoundNotifications: true,
  enableMessageHistory: false,
  responseDelay: 100,
  systemPrompt: ``
};

// Settings for Pro Mode (using a more advanced model through OpenRouter)
// NOTE: Pro Mode is currently under maintenance
const proModeSettings: AIModelSettings = {
  model: 'deepseek/deepseek-r1-0528:free',
  temperature: 0.6,
  maxTokens: 6000,
  topP: 0.8,
  presencePenalty: 0,
  frequencyPenalty: 0.1,
  timeout: 15000,
  thinkingTime: 800,
  apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
  // Extended Pro Mode settings
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
  enableDarkTheme: true,
  enableAnimations: true,
  enableKeyboardShortcuts: true,
  enableFullscreen: false,
  systemPrompt: ``
};

// =============================================================================
// API KEY MANAGEMENT FUNCTIONS
// =============================================================================

// Get API key with fallback support
export const getAPIKey = async (mode: 'standard' | 'pro'): Promise<string | null> => {
  try {
    if (typeof window === 'undefined') return null;

    // Single storage key for both modes
    const storageKey = 'nexious-openrouter-api-key';

    // Try to get the API key from localStorage
    let apiKey = localStorage.getItem(storageKey);

    // If no API key is found in localStorage, use the primary one
    if (!apiKey) {
      return API_KEY_CONFIG.primary;
    }

    return apiKey;
  } catch (error) {
    console.error('Error retrieving API key:', error);
    // Return primary API key as fallback
    return API_KEY_CONFIG.primary;
  }
};

// Get backup API key
export const getBackupAPIKey = (): string => {
  return API_KEY_CONFIG.backup;
};

// Get fallback models
export const getFallbackModels = (): string[] => {
  return API_KEY_CONFIG.fallbackModels;
};

// Set API key (same key used for both modes)
export const setAPIKey = async (apiKey: string): Promise<boolean> => {
  try {
    if (typeof window === 'undefined') return false;

    // Use a single storage key for both modes
    const storageKey = 'nexious-openrouter-api-key';

    localStorage.setItem(storageKey, apiKey);
    return true;
  } catch (error) {
    console.error('Error saving API key:', error);
    return false;
  }
};

// =============================================================================
// PRO MODE MAINTENANCE FUNCTIONS
// =============================================================================

// Check if Pro Mode is under maintenance
export const isProModeUnderMaintenance = (): boolean => {
  return PRO_MODE_MAINTENANCE.isUnderMaintenance;
};

// Get Pro Mode maintenance message
export const getProModeMaintenanceMessage = (): string => {
  return PRO_MODE_MAINTENANCE.maintenanceMessage;
};

// Get Pro Mode maintenance end date
export const getProModeMaintenanceEndDate = (): Date => {
  return PRO_MODE_MAINTENANCE.maintenanceEndDate;
};

// Check if countdown should be shown
export const shouldShowProModeCountdown = (): boolean => {
  return PRO_MODE_MAINTENANCE.showCountdown;
};

// Calculate time remaining until Pro Mode is available
export const getProModeTimeRemaining = (): { days: number; hours: number; minutes: number; seconds: number } => {
  const now = new Date();
  const endDate = PRO_MODE_MAINTENANCE.maintenanceEndDate;
  const timeDiff = endDate.getTime() - now.getTime();

  if (timeDiff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
};

// =============================================================================
// FALLBACK SYSTEM MANAGEMENT FUNCTIONS
// =============================================================================

// Get fallback system configuration
export const getFallbackSystemConfig = (): FallbackSystemConfig => {
  return FALLBACK_SYSTEM_CONFIG;
};

// Check if fallback system is enabled
export const isFallbackSystemEnabled = (): boolean => {
  return FALLBACK_SYSTEM_CONFIG.enabled;
};

// Get fallback models sorted by priority
export const getFallbackModelsByPriority = (): FallbackModelConfig[] => {
  return FALLBACK_SYSTEM_CONFIG.fallbackModels
    .filter(model => model.isEnabled)
    .sort((a, b) => a.priority - b.priority);
};

// Get primary model timeout
export const getPrimaryModelTimeout = (): number => {
  return FALLBACK_SYSTEM_CONFIG.primaryTimeout;
};

// Get fallback notification settings
export const getFallbackNotificationSettings = (): { enabled: boolean; message: string } => {
  return {
    enabled: FALLBACK_SYSTEM_CONFIG.notificationEnabled,
    message: FALLBACK_SYSTEM_CONFIG.notificationMessage
  };
};

// Update fallback system configuration (for admin use)
export const updateFallbackSystemConfig = (config: Partial<FallbackSystemConfig>): void => {
  Object.assign(FALLBACK_SYSTEM_CONFIG, config);
};

// Add or update a fallback model
export const updateFallbackModel = (modelConfig: FallbackModelConfig): void => {
  const existingIndex = FALLBACK_SYSTEM_CONFIG.fallbackModels.findIndex(
    model => model.model === modelConfig.model
  );

  if (existingIndex >= 0) {
    FALLBACK_SYSTEM_CONFIG.fallbackModels[existingIndex] = modelConfig;
  } else {
    FALLBACK_SYSTEM_CONFIG.fallbackModels.push(modelConfig);
  }

  // Re-sort by priority
  FALLBACK_SYSTEM_CONFIG.fallbackModels.sort((a, b) => a.priority - b.priority);
};

// Remove a fallback model
export const removeFallbackModel = (modelId: string): void => {
  FALLBACK_SYSTEM_CONFIG.fallbackModels = FALLBACK_SYSTEM_CONFIG.fallbackModels.filter(
    model => model.model !== modelId
  );
};

// Fallback System Logging Interface
export interface FallbackLogEntry {
  timestamp: number;
  primaryModel: string;
  fallbackModel: string;
  fallbackPriority: number;
  responseTime: number;
  success: boolean;
  error?: string;
  userMode: 'standard' | 'pro';
}

// Fallback system logging
const FALLBACK_LOG_KEY = 'nexious-fallback-logs';
const MAX_LOG_ENTRIES = 100;

// Log fallback usage
export const logFallbackUsage = (entry: FallbackLogEntry): void => {
  if (typeof window === 'undefined') return;

  try {
    const existingLogs = JSON.parse(localStorage.getItem(FALLBACK_LOG_KEY) || '[]');
    const newLogs = [entry, ...existingLogs].slice(0, MAX_LOG_ENTRIES);
    localStorage.setItem(FALLBACK_LOG_KEY, JSON.stringify(newLogs));

    console.log(`🔄 NEXIOUS FALLBACK LOG: ${entry.success ? 'SUCCESS' : 'FAILED'} - ${entry.fallbackModel} (Priority ${entry.fallbackPriority}) - ${entry.responseTime}ms`);
  } catch (error) {
    console.error('Error logging fallback usage:', error);
  }
};

// Get fallback usage logs
export const getFallbackLogs = (): FallbackLogEntry[] => {
  if (typeof window === 'undefined') return [];

  try {
    return JSON.parse(localStorage.getItem(FALLBACK_LOG_KEY) || '[]');
  } catch (error) {
    console.error('Error retrieving fallback logs:', error);
    return [];
  }
};

// Get fallback statistics
export const getFallbackStats = (): {
  totalFallbacks: number;
  successRate: number;
  averageResponseTime: number;
  mostUsedModel: string;
  recentActivity: FallbackLogEntry[];
} => {
  const logs = getFallbackLogs();

  if (logs.length === 0) {
    return {
      totalFallbacks: 0,
      successRate: 0,
      averageResponseTime: 0,
      mostUsedModel: 'None',
      recentActivity: []
    };
  }

  const successfulLogs = logs.filter(log => log.success);
  const modelUsage = logs.reduce((acc, log) => {
    acc[log.fallbackModel] = (acc[log.fallbackModel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostUsedModel = Object.entries(modelUsage).reduce((a, b) =>
    modelUsage[a[0]] > modelUsage[b[0]] ? a : b
  )[0];

  return {
    totalFallbacks: logs.length,
    successRate: (successfulLogs.length / logs.length) * 100,
    averageResponseTime: logs.reduce((sum, log) => sum + log.responseTime, 0) / logs.length,
    mostUsedModel,
    recentActivity: logs.slice(0, 10)
  };
};

// Clear fallback logs
export const clearFallbackLogs = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(FALLBACK_LOG_KEY);
  console.log('🔄 NEXIOUS FALLBACK: Logs cleared');
};

// Extract model first name from full model identifier
export const extractModelFirstName = (fullModelId: string): string => {
  // Handle common model patterns
  const modelMappings: Record<string, string> = {
    'claude': 'Claude',
    'gpt': 'GPT',
    'llama': 'Llama',
    'qwen': 'Qwen',
    'mistral': 'Mistral',
    'gemini': 'Gemini',
    'palm': 'PaLM',
    'cohere': 'Cohere',
    'anthropic': 'Claude',
    'openai': 'GPT',
    'meta': 'Llama',
    'google': 'Gemini',
    'mistralai': 'Mistral'
  };

  // Convert to lowercase for matching
  const lowerModelId = fullModelId.toLowerCase();

  // Check for direct matches first
  for (const [key, value] of Object.entries(modelMappings)) {
    if (lowerModelId.includes(key)) {
      return value;
    }
  }

  // Fallback: extract first part after slash or use first word
  const parts = fullModelId.split('/');
  const modelPart = parts.length > 1 ? parts[1] : parts[0];

  // Extract first word and capitalize
  const firstWord = modelPart.split('-')[0].split('_')[0];
  return firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase();
};

// Test a fallback model
export const testFallbackModel = async (modelConfig: FallbackModelConfig): Promise<{ success: boolean; error?: string; responseTime?: number }> => {
  const startTime = Date.now();

  try {
    const apiKey = await getAPIKey('standard');
    if (!apiKey) {
      return { success: false, error: 'No API key available' };
    }

    const testRequest = {
      model: modelConfig.model,
      messages: [
        {
          role: 'system',
          content: 'You are a test assistant. Respond with exactly: "Test successful"'
        },
        {
          role: 'user',
          content: 'Test message'
        }
      ],
      temperature: modelConfig.temperature,
      max_tokens: 50
    };

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : '',
        'X-Title': 'NEX-DEVS Portfolio'
      },
      body: JSON.stringify(testRequest),
      signal: AbortSignal.timeout(modelConfig.timeout)
    });

    const responseTime = Date.now() - startTime;

    if (response.ok) {
      return { success: true, responseTime };
    } else {
      const errorData = await response.json();
      return { success: false, error: errorData.error?.message || `HTTP ${response.status}`, responseTime };
    }
  } catch (error) {
    const responseTime = Date.now() - startTime;
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime
    };
  }
};

// =============================================================================
// STANDARD MODE REQUEST LIMIT FUNCTIONS
// =============================================================================

// Get Standard Mode configuration
export const getStandardModeConfig = (): StandardModeConfig => {
  return STANDARD_MODE_CONFIG;
};

// Check current request count for Standard Mode
export const getStandardModeRequestCount = (): number => {
  if (typeof window === 'undefined') return 0;

  const today = new Date().toDateString();
  const storageKey = `nexious-standard-requests-${today}`;
  const count = localStorage.getItem(storageKey);

  return count ? parseInt(count, 10) : 0;
};

// Increment Standard Mode request count
export const incrementStandardModeRequestCount = (): number => {
  if (typeof window === 'undefined') return 0;

  const today = new Date().toDateString();
  const storageKey = `nexious-standard-requests-${today}`;
  const currentCount = getStandardModeRequestCount();
  const newCount = currentCount + 1;

  localStorage.setItem(storageKey, newCount.toString());
  return newCount;
};

// Check if Standard Mode is on cooldown
export const isStandardModeOnCooldown = (): boolean => {
  if (typeof window === 'undefined') return false;

  const cooldownKey = 'nexious-standard-cooldown';
  const cooldownEnd = localStorage.getItem(cooldownKey);

  if (!cooldownEnd) return false;

  const now = new Date().getTime();
  const cooldownEndTime = parseInt(cooldownEnd, 10);

  return now < cooldownEndTime;
};

// Set Standard Mode cooldown
export const setStandardModeCooldown = (): void => {
  if (typeof window === 'undefined') return;

  const cooldownKey = 'nexious-standard-cooldown';
  const cooldownDuration = STANDARD_MODE_CONFIG.cooldownHours * 60 * 60 * 1000; // Convert hours to milliseconds
  const cooldownEnd = new Date().getTime() + cooldownDuration;

  localStorage.setItem(cooldownKey, cooldownEnd.toString());
};

// Get remaining cooldown time
export const getStandardModeCooldownRemaining = (): { hours: number; minutes: number; seconds: number } => {
  if (typeof window === 'undefined') return { hours: 0, minutes: 0, seconds: 0 };

  const cooldownKey = 'nexious-standard-cooldown';
  const cooldownEnd = localStorage.getItem(cooldownKey);

  if (!cooldownEnd) return { hours: 0, minutes: 0, seconds: 0 };

  const now = new Date().getTime();
  const cooldownEndTime = parseInt(cooldownEnd, 10);
  const timeDiff = cooldownEndTime - now;

  if (timeDiff <= 0) {
    localStorage.removeItem(cooldownKey);
    return { hours: 0, minutes: 0, seconds: 0 };
  }

  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

  return { hours, minutes, seconds };
};

// =============================================================================
// MODEL SETTINGS FUNCTIONS
// =============================================================================

// Function to get the current model settings
export const getModelSettings = (isProMode: boolean): AIModelSettings => {
  return isProMode ? proModeSettings : standardModeSettings;
};

// Settings for both modes
export const aiSettings: AISettings = {
  standard: standardModeSettings,
  pro: proModeSettings
};

// Function to update model settings (useful for settings panel in UI)
export const updateModelSettings = (
  mode: 'standard' | 'pro',
  settings: Partial<AIModelSettings>
): void => {
  const currentSettings = mode === 'standard' ? standardModeSettings : proModeSettings;

  // Update only the provided settings
  Object.assign(currentSettings, settings);
};

// =============================================================================
// API REQUEST PREPARATION FUNCTIONS
// =============================================================================

// Function to prepare the API request based on mode
export const prepareAPIRequest = async (
  mode: 'standard' | 'pro',
  messages: any[],
  systemPrompt: string,
  userMessage: string,
  messageId?: string,
  customParams?: {
    temperature?: number;
    topP?: number;
    maxTokens?: number;
    presencePenalty?: number;
    frequencyPenalty?: number;
  }
): Promise<{
  url: string;
  headers: Record<string, string>;
  body: any;
  timeout: number;
}> => {
  console.log(`🔧 NEXIOUS API: Preparing ${mode.toUpperCase()} mode request`);
  console.log(`📝 NEXIOUS API: User message: "${userMessage}"`);
  console.log(`📋 NEXIOUS API: System prompt length: ${systemPrompt.length} characters`);
  console.log(`💬 NEXIOUS API: Message history count: ${messages.length}`);

  // Check if Pro Mode is under maintenance
  if (mode === 'pro' && isProModeUnderMaintenance()) {
    console.error(`❌ NEXIOUS API: Pro Mode is under maintenance`);
    throw new Error('Pro Mode is currently under maintenance');
  }

  // Check Standard Mode request limits
  if (mode === 'standard') {
    if (isStandardModeOnCooldown()) {
      console.error(`❌ NEXIOUS API: Standard Mode is on cooldown`);
      throw new Error('Standard Mode is on cooldown due to request limit');
    }

    const currentCount = getStandardModeRequestCount();
    console.log(`📊 NEXIOUS API: Standard Mode request count: ${currentCount}/${STANDARD_MODE_CONFIG.requestLimit}`);

    if (currentCount >= STANDARD_MODE_CONFIG.requestLimit) {
      setStandardModeCooldown();
      console.error(`❌ NEXIOUS API: Standard Mode request limit reached`);
      throw new Error('Standard Mode request limit reached');
    }
  }

  const settings = mode === 'standard' ? standardModeSettings : proModeSettings;
  console.log(`⚙️ NEXIOUS API: Using model: ${settings.model}`);
  console.log(`🌡️ NEXIOUS API: Temperature: ${settings.temperature}, Max tokens: ${settings.maxTokens}`);

  const apiKey = await getAPIKey(mode);

  if (!apiKey) {
    console.error(`❌ NEXIOUS API: No API key available for ${mode} mode`);
    throw new Error(`No API key available for ${mode} mode`);
  }

  console.log(`🔑 NEXIOUS API: API key retrieved (${apiKey.substring(0, 10)}...)`);
  console.log(`🌐 NEXIOUS API: Endpoint: ${settings.apiEndpoint}`);

  // Prepare the context window (increased for standard mode for better context)
  const contextWindow = mode === 'standard' ? 4 : 6;
  console.log(`🪟 NEXIOUS API: Context window size: ${contextWindow} messages`);

  const filteredMessages = messages
    .filter(m => m.role !== 'system' && m.id !== messageId)
    .slice(-contextWindow)
    .map(m => ({ role: m.role, content: m.content }));

  console.log(`📚 NEXIOUS API: Filtered message history: ${filteredMessages.length} messages`);

  const requestBody = {
    model: settings.model,
    messages: [
      { role: 'system', content: systemPrompt },
      ...filteredMessages,
      { role: 'user', content: userMessage }
    ],
    temperature: customParams?.temperature ?? settings.temperature,
    max_tokens: customParams?.maxTokens ?? settings.maxTokens,
    top_p: customParams?.topP ?? settings.topP,
    presence_penalty: customParams?.presencePenalty ?? settings.presencePenalty,
    frequency_penalty: customParams?.frequencyPenalty ?? settings.frequencyPenalty,
    stream: true
  };

  console.log(`📦 NEXIOUS API: Request body prepared with ${requestBody.messages.length} total messages`);
  console.log(`🎛️ NEXIOUS API: Parameters - temp: ${requestBody.temperature}, max_tokens: ${requestBody.max_tokens}, top_p: ${requestBody.top_p}`);

  // Same headers for both modes since we're using OpenRouter for both
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
    'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : '',
    'X-Title': 'NEX-DEVS Portfolio'
  };

  console.log(`📋 NEXIOUS API: Headers prepared with ${Object.keys(headers).length} fields`);
  console.log(`🌍 NEXIOUS API: Referer: ${headers['HTTP-Referer']}`);

  // Increment request count for Standard Mode after successful preparation
  if (mode === 'standard') {
    incrementStandardModeRequestCount();
    console.log(`📈 NEXIOUS API: Standard Mode request count incremented`);
  }

  const finalRequest = {
    url: settings.apiEndpoint,
    headers,
    body: requestBody,
    timeout: settings.timeout
  };

  console.log(`✅ NEXIOUS API: Request fully prepared for ${mode.toUpperCase()} mode`);
  console.log(`⏱️ NEXIOUS API: Timeout set to ${settings.timeout}ms`);
  console.log(`🚀 NEXIOUS API: Ready to send request to ${settings.apiEndpoint}`);

  return finalRequest;
};

// Function to prepare backup API request
export const prepareBackupAPIRequest = async (
  userMessage: string,
  fallbackModel?: string
): Promise<{
  url: string;
  headers: Record<string, string>;
  body: any;
  timeout: number;
}> => {
  const backupApiKey = getBackupAPIKey();
  const model = fallbackModel || getFallbackModels()[0];

  const requestBody = {
    model,
    messages: [
      {
        role: 'system',
        content: 'You are Nexious, a professional AI assistant representing NEX-DEVS, a premier web development company. Provide complete, accurate, and business-appropriate responses. Maintain professional language, ensure comprehensive coverage of topics, and deliver actionable information that reflects our commitment to excellence in web development services.'
      },
      { role: 'user', content: userMessage }
    ],
    temperature: 0.5,
    max_tokens: 800
  };

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${backupApiKey}`,
    'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : '',
    'X-Title': 'NEX-DEVS Portfolio'
  };

  return {
    url: 'https://openrouter.ai/api/v1/chat/completions',
    headers,
    body: requestBody,
    timeout: 8000 // Optimized timeout for backup requests
  };
};

// Function to prepare advanced fallback API request
export const prepareFallbackAPIRequest = async (
  mode: 'standard' | 'pro',
  messages: any[],
  systemPrompt: string,
  userMessage: string,
  fallbackModel: FallbackModelConfig,
  messageId?: string
): Promise<{
  url: string;
  headers: Record<string, string>;
  body: any;
  timeout: number;
  modelConfig: FallbackModelConfig;
}> => {
  console.log(`🔄 NEXIOUS FALLBACK: Preparing fallback request with ${fallbackModel.model}`);
  console.log(`📊 NEXIOUS FALLBACK: Priority: ${fallbackModel.priority}, Timeout: ${fallbackModel.timeout}ms`);

  const apiKey = await getAPIKey(mode);
  if (!apiKey) {
    throw new Error(`No API key available for ${mode} mode`);
  }

  // Prepare context window (same as primary request)
  const contextWindow = mode === 'standard' ? 4 : 6;
  const filteredMessages = messages
    .filter(m => m.role !== 'system' && m.id !== messageId)
    .slice(-contextWindow)
    .map(m => ({ role: m.role, content: m.content }));

  const requestBody = {
    model: fallbackModel.model,
    messages: [
      { role: 'system', content: systemPrompt },
      ...filteredMessages,
      { role: 'user', content: userMessage }
    ],
    temperature: fallbackModel.temperature,
    max_tokens: fallbackModel.maxTokens,
    top_p: 0.8,
    presence_penalty: 0,
    frequency_penalty: 0.1,
    stream: true
  };

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
    'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : '',
    'X-Title': 'NEX-DEVS Portfolio'
  };

  console.log(`✅ NEXIOUS FALLBACK: Request prepared for ${fallbackModel.model}`);

  return {
    url: 'https://openrouter.ai/api/v1/chat/completions',
    headers,
    body: requestBody,
    timeout: fallbackModel.timeout,
    modelConfig: fallbackModel
  };
};

// =============================================================================
// ADMIN MANAGEMENT FUNCTIONS
// =============================================================================

// Update API key configuration (for admin use)
export const updateAPIKeyConfig = (config: Partial<APIKeyConfig>): void => {
  Object.assign(API_KEY_CONFIG, config);
};

// Update Pro Mode maintenance configuration (for admin use)
export const updateProModeMaintenanceConfig = (config: Partial<ProModeMaintenanceConfig>): void => {
  Object.assign(PRO_MODE_MAINTENANCE, config);
};

// Update Standard Mode configuration (for admin use)
export const updateStandardModeConfig = (config: Partial<StandardModeConfig>): void => {
  Object.assign(STANDARD_MODE_CONFIG, config);
};

// Update model settings for specific mode (for admin use)
export const updateModeSettings = (mode: 'standard' | 'pro', settings: Partial<AIModelSettings>): void => {
  const targetSettings = mode === 'standard' ? standardModeSettings : proModeSettings;
  Object.assign(targetSettings, settings);
};

// Get current configuration for admin interface
export const getAdminConfiguration = () => {
  return {
    apiKeys: API_KEY_CONFIG,
    proModeMaintenance: PRO_MODE_MAINTENANCE,
    standardModeConfig: STANDARD_MODE_CONFIG,
    standardModeSettings: standardModeSettings,
    proModeSettings: proModeSettings,
    fallbackSystemConfig: FALLBACK_SYSTEM_CONFIG
  };
};

// Validate API key format
export const validateAPIKey = (apiKey: string): boolean => {
  return apiKey.startsWith('sk-or-v1-') && apiKey.length > 20;
};

// Test API key functionality
export const testAPIKey = async (apiKey: string): Promise<{ valid: boolean; error?: string }> => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      return { valid: true };
    } else {
      return { valid: false, error: `API returned status ${response.status}` };
    }
  } catch (error) {
    return { valid: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Get API usage statistics
export const getAPIUsageStats = async (apiKey: string): Promise<any> => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/auth/key', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`Failed to fetch usage stats: ${response.status}`);
    }
  } catch (error) {
    console.error('Error fetching API usage stats:', error);
    return null;
  }
};

// =============================================================================
// EXPORTS - SINGLE SOURCE OF TRUTH
// =============================================================================

export default aiSettings;

// Export all configuration objects for external access if needed
export {
  API_KEY_CONFIG,
  PRO_MODE_MAINTENANCE,
  STANDARD_MODE_CONFIG,
  standardModeSettings,
  proModeSettings
};