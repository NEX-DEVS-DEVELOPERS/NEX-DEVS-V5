import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

// Admin password for authentication
const ADMIN_PASSWORD = 'nex-devs919';

// Path to settings storage file
const SETTINGS_FILE_PATH = path.join(process.cwd(), 'data', 'chatbot-settings.json');

// Path to request logs file
const LOGS_FILE_PATH = path.join(process.cwd(), 'data', 'chatbot-logs.json');

// Default settings
const DEFAULT_SETTINGS = {
  apiKey: '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',
  enabled: true,
  lastUpdated: new Date().toISOString()
};

// Get current settings
function getSettings() {
  try {
    if (!fs.existsSync(SETTINGS_FILE_PATH)) {
      return DEFAULT_SETTINGS;
    }
    
    const settingsData = fs.readFileSync(SETTINGS_FILE_PATH, 'utf8');
    return JSON.parse(settingsData);
  } catch (error) {
    console.error('Error reading settings:', error);
    return DEFAULT_SETTINGS;
  }
}

// Get logs from file
function getLogs() {
  try {
    if (!fs.existsSync(LOGS_FILE_PATH)) {
      return [];
    }
    
    const logsData = fs.readFileSync(LOGS_FILE_PATH, 'utf8');
    return JSON.parse(logsData);
  } catch (error) {
    console.error('Error reading logs:', error);
    return [];
  }
}

// Fetch OpenRouter stats
async function fetchOpenRouterStats(apiKey: string) {
  try {
    // Fetch usage data from OpenRouter
    const response = await fetch('https://openrouter.ai/api/v1/auth/key', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error(`OpenRouter API error: ${response.status}`);
      return {
        error: `OpenRouter API Error: ${response.status}`,
        status: response.status
      };
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching OpenRouter stats:', error);
    return {
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Handle GET requests to retrieve chatbot stats
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get current settings
    const settings = getSettings();
    
    // Get logs
    const logs = getLogs();
    
    // Calculate metrics from logs
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    
    // Filter logs to get today's requests
    const todayLogs = logs.filter((log: any) => log.timestamp >= todayStart);
    
    // Calculate average response time
    const responseTimes = todayLogs.map((log: any) => log.responseTime).filter(Boolean);
    const averageResponseTime = responseTimes.length > 0 
      ? Math.round(responseTimes.reduce((sum: number, time: number) => sum + time, 0) / responseTimes.length)
      : 0;
    
    // Calculate success rate
    const successfulRequests = todayLogs.filter((log: any) => log.status === 'success').length;
    const successRate = todayLogs.length > 0 ? (successfulRequests / todayLogs.length) * 100 : 0;
    
    // Get usage data from OpenRouter
    const openRouterStats = await fetchOpenRouterStats(settings.apiKey);
    
    // Format the response
    const formattedStats = {
      enabled: settings.enabled,
      lastUpdated: settings.lastUpdated,
      usage: {
        current_usage: openRouterStats.rate_limit_amount,
        max_budget: openRouterStats.rate_limit_threshold,
        requests_today: todayLogs.length,
        total_requests: logs.length,
        average_response_time: averageResponseTime,
        success_rate: Math.round(successRate),
        context_limit: openRouterStats.context_limit || 8192,
        max_token_response: openRouterStats.max_token_response || 1024
      },
      requests: logs.slice(-20).reverse().map((log: any) => ({
        timestamp: log.timestamp,
        request: log.request,
        response: log.response,
        responseTime: log.responseTime,
        status: log.status
      }))
    };
    
    return NextResponse.json(formattedStats);
  } catch (error) {
    console.error('Error in GET stats:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 