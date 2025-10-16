'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-hot-toast'
import { enhancedSecurityMonitor } from '@/backend/utils/enhancedSecurityMonitor'
import { sessionManager } from '@/backend/utils/sessionManager'

// Enhanced types for comprehensive system info
type EnhancedSystemInfo = {
  nodeVersion?: string;
  platform?: string;
  nextVersion?: string;
  nodeEnv?: string;
  responseTime?: number;
  performanceMetrics?: {
    memory: {
      used: number;
      total: number;
      percentage: number;
      freeMemory: number;
    };
    cpu: {
      cores: number;
      model: string;
      speed: string | number;
      loadAverage: number[];
    };
    uptime: {
      raw: number;
      formatted: string;
    };
    process: {
      pid: number;
      ppid: number;
      title: string;
      arch: string;
    };
  };
  // Original database structure for backward compatibility
  database?: {
    type: string;
    host: string;
    database: string;
    port: string | number;
    isConnected: boolean;
    connectionType: string;
    ssl: boolean;
    localUrl: string | null;
    productionUrl: string | null;
    connectivity: string;
    connectionError?: string;
    user?: string;
    status?: {
      status: string;
      lastChecked?: string;
      connectionStatus?: {
        serverVersion?: string;
        connectedThreads?: string;
        tableCount?: number;
        responseTime?: number;
      };
    };
    projects?: {
      total: number;
      featured: number;
      newlyAdded: number;
      error: string | null;
    };
  };
  // New databases structure for supporting multiple databases
  databases?: {
    mysql?: {
      available: boolean;
      connected: boolean;
      lastConnectionTime: string | null;
      error: string | null;
      projects: {
        total: number;
        featured: number;
        newlyAdded: number;
      };
    };
    neon?: {
      available: boolean;
      connected: boolean;
      lastConnectionTime: string | null;
      error: string | null;
      projects: {
        total: number;
        featured: number;
        newlyAdded: number;
      };
      debug?: any;
    };
    primary: string;
  };
  websiteUrls?: {
    current: string;
    local: string;
    production: string | null;
    preview: string | null;
    environment: string;
    isVercel: boolean;
    branch: string;
  };
  apiResponseTime?: string;
  serverTime?: string;
  processUptime?: number;
  error?: string;
  systemStats?: {
    osType: string;
    osPlatform: string;
    osRelease: string;
    osHostname: string;
    osTotalMemory: string;
    osFreeMemory: string;
    osUptime: string;
    osUserInfo: {
      username: string;
      homedir: string;
      shell: string;
    };
    osNetworkInterfaces: string[];
  };
  timestamp?: string;
  server?: {
    environment: string;
    nodeVersion: string;
    platform: string;
    arch: string;
    cpuCount: number;
    memoryTotal: string;
    memoryFree: string;
    uptime: string;
  };
  authenticated?: boolean;
  client?: {
    ip: string;
    userAgent: string;
    location: any;
    security: any;
  };
  performance?: {
    apiResponseTime: number;
    serverUptime: number;
    processUptime: number;
    memoryUsage: any;
    cpu: any;
  };
  system?: {
    platform: string;
    arch: string;
    hostname: string;
    networkInterfaces: string[];
    nodeVersion: string;
    environment: string;
  };
  session?: {
    startTime: string;
    duration: number;
    requestCount: number;
  };
}

type Project = {
  id: number;
  title: string;
  featured?: boolean;
  status?: string;
  [key: string]: any;
}

export default function DebugPanel({
  projects,
  autoExpand = false
}: {
  projects: Project[];
  autoExpand?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(autoExpand)
  const [systemInfo, setSystemInfo] = useState<EnhancedSystemInfo | null>(null)
  const [securityData, setSecurityData] = useState<any>(null)
  const [sessionData, setSessionData] = useState<any>(null)
  const [isRealTimeConnected, setIsRealTimeConnected] = useState(false)
  const [eventSource, setEventSource] = useState<EventSource | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [updateInterval, setUpdateInterval] = useState<number>(30000) // 30 seconds to reduce load
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [autoReconnect, setAutoReconnect] = useState<boolean>(true) // Auto-reconnect enabled by default
  const [useEnhancedAPI, setUseEnhancedAPI] = useState<boolean>(true) // Use enhanced API by default
  const [isTabActive, setIsTabActive] = useState<boolean>(true) // Track if browser tab is active

  const fetchSystemInfo = useCallback(async () => {
    try {
      const timestamp = new Date().getTime();
      const startTime = performance.now();

      // Get admin password from session storage
      const adminPassword = sessionStorage.getItem('adminPassword') || 'nex-devs.org889123';

      // Reduced logging frequency
      if (Math.random() < 0.1) {
        console.log('Fetching enhanced system info...');
      }

      // Choose API endpoint based on setting
      const apiEndpoint = useEnhancedAPI ? '/api/debug-enhanced' : '/api/debug';

      // Add a retry mechanism for network issues
      let retries = 0;
      const maxRetries = 3;

      while (retries <= maxRetries) {
        try {
          const response = await fetch(`${apiEndpoint}?t=${timestamp}&password=${encodeURIComponent(adminPassword)}`, {
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0',
              'Authorization': `Bearer ${adminPassword}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            const responseTime = performance.now() - startTime;

            // Reduced logging frequency
            if (Math.random() < 0.1) {
              console.log('Enhanced debug data received:', data);
            }
            setSystemInfo(data);
            setLastUpdated(new Date());

            // Track API response time (removed performance monitor dependency)

            // Notify if database is disconnected
            if (data.database?.connectivity === 'disconnected') {
              toast.error('Database connection failed: ' + (data.database.error || 'Unknown error'));
            }

            // Exit retry loop on success
            break;
          } else if (response.status === 401) {
            console.error('Authentication failed when accessing debug API');
            toast.error('Authentication failed. Please re-login to the admin area.');

            // Try to reauthenticate by redirecting to login if we're within the admin area
            if (window.location.pathname.includes('/admin/')) {
              sessionStorage.removeItem('adminAuth');
              window.location.href = '/admin/login';
            }

            throw new Error('Authentication failed');
          } else {
            console.error('Debug API response not OK:', response.status, response.statusText);
            throw new Error(`Failed to fetch system info: ${response.status} ${response.statusText}`);
          }
        } catch (fetchError) {
          retries++;

          if (retries <= maxRetries) {
            // Exponential backoff for retries
            const delay = Math.pow(2, retries) * 1000;
            console.log(`Retry ${retries}/${maxRetries} after ${delay}ms`);
            await new Promise(resolve => setTimeout(resolve, delay));
          } else {
            // Rethrow the error after max retries
            throw fetchError;
          }
        }
      }
    } catch (error) {
      console.error('Error fetching system info:', error);
      toast.error('Failed to update system information');
    } finally {
      setIsLoading(false);
    }
  }, [useEnhancedAPI]);

  // Initialize real-time security monitoring with SSE
  useEffect(() => {
    if (typeof window !== 'undefined' && isExpanded && useEnhancedAPI) {
      const adminPassword = sessionStorage.getItem('adminPassword') || 'nex-devs.org889123';

      // Create Server-Sent Events connection
      const sse = new EventSource(`/api/security-stream?password=${encodeURIComponent(adminPassword)}`);

      sse.onopen = () => {
        setIsRealTimeConnected(true);
        console.log('Real-time security monitoring connected');
      };

      sse.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          switch (data.type) {
            case 'initial':
            case 'full_update':
              setSecurityData({
                stats: data.stats,
                events: data.events,
                alerts: data.alerts
              });
              setSessionData({
                sessions: data.sessions,
                stats: data.sessionStats
              });
              break;

            case 'security_update':
              setSecurityData(data);
              break;

            case 'session_update':
              setSessionData(data);
              break;

            case 'heartbeat':
              // Keep connection alive
              break;
          }
        } catch (error) {
          console.error('Error parsing SSE data:', error);
        }
      };

      sse.onerror = (error) => {
        console.error('SSE connection error:', error);
        setIsRealTimeConnected(false);

        // Attempt to reconnect after 5 seconds
        setTimeout(() => {
          if (sse.readyState === EventSource.CLOSED) {
            // Connection will be recreated on next effect run
          }
        }, 5000);
      };

      setEventSource(sse);

      return () => {
        sse.close();
        setEventSource(null);
        setIsRealTimeConnected(false);
      };
    } else if (!useEnhancedAPI) {
      // Fallback to local monitoring for basic mode
      const unsubscribeSecurity = enhancedSecurityMonitor.onUpdate(setSecurityData);
      const unsubscribeSession = sessionManager.onUpdate(setSessionData);

      return () => {
        unsubscribeSecurity();
        unsubscribeSession();
      };
    }
  }, [isExpanded, useEnhancedAPI]);

  // Initial fetch and setup interval for system info with smart polling
  useEffect(() => {
    if (isExpanded && isTabActive) {
      fetchSystemInfo();
      const interval = setInterval(() => {
        // Only fetch if tab is active and panel is expanded
        if (isTabActive && isExpanded) {
          fetchSystemInfo();
        }
      }, updateInterval);
      return () => clearInterval(interval);
    }
  }, [isExpanded, updateInterval, fetchSystemInfo, isTabActive]);

  // Tab visibility detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabActive(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Auto-reconnect effect
  useEffect(() => {
    if (autoReconnect && systemInfo?.database?.connectivity === 'disconnected') {
      console.log('Auto-reconnect is enabled and database is disconnected, retrying in 3 seconds...');
      const reconnectTimer = setTimeout(() => {
        fetchSystemInfo();
      }, 3000);
      
      return () => clearTimeout(reconnectTimer);
    }
  }, [autoReconnect, systemInfo?.database?.connectivity, fetchSystemInfo]);

  const copyDebugInfo = () => {
    try {
      const debugText = JSON.stringify({
        systemInfo,
        securityData,
        sessionData,
        projectStats: {
          totalProjects: projects.length,
          featuredProjects: projects.filter(p => p.featured).length,
          inDevelopmentProjects: projects.filter(p => p.status === 'In Development').length,
        },
        settings: {
          updateInterval,
          autoReconnect,
          useEnhancedAPI
        },
        lastUpdated: lastUpdated.toISOString(),
      }, null, 2);

      navigator.clipboard.writeText(debugText);
      toast.success('Enhanced security debug information copied to clipboard');
    } catch (error) {
      console.error('Failed to copy debug info:', error);
      toast.error('Failed to copy debug information');
    }
  };

  // Security action handler
  const handleSecurityAction = async (action: string, target?: string, alertId?: string) => {
    try {
      const adminPassword = sessionStorage.getItem('adminPassword') || 'nex-devs.org889123';

      const response = await fetch('/api/security-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminPassword}`
        },
        body: JSON.stringify({ action, target, alertId })
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(result.message);

        // Refresh data after action
        fetchSystemInfo();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Security action failed');
      }
    } catch (error) {
      console.error('Security action error:', error);
      toast.error('Failed to execute security action');
    }
  };

  const formatBytes = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024);
    if (gb >= 1) return `${gb.toFixed(2)} GB`;
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <div className="w-full mb-6 bg-gray-900/70 rounded-xl border border-purple-500/20 overflow-hidden">
      <button 
        className="w-full px-4 py-3 flex items-center justify-between text-left bg-black/30 hover:bg-black/40 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <svg className="w-5 h-5 text-purple-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
          <span className="font-medium text-purple-300">
            Enhanced Security Monitor
          </span>
          {isExpanded && (
            <div className="ml-2 flex items-center space-x-2">
              <span className="text-xs text-gray-400">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
              <span className="flex items-center text-xs">
                <span className={`w-1.5 h-1.5 rounded-full mr-1 ${
                  isRealTimeConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                }`}></span>
                <span className={isRealTimeConnected ? 'text-green-400' : 'text-red-400'}>
                  {isRealTimeConnected ? 'Live Security' : 'Security Monitor'}
                </span>
              </span>
              {securityData?.stats && (
                <span className="text-xs text-orange-400">
                  {securityData.stats.totalSecurityEvents} Events
                </span>
              )}
              {sessionData?.stats && (
                <span className="text-xs text-green-400">
                  {sessionData.stats.activeSessions} Sessions
                </span>
              )}
            </div>
          )}
        </div>
        <svg className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isExpanded && (
        <div className="px-4 py-4 text-sm">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          ) : systemInfo ? (
            <div className="space-y-6">
              {/* Enhanced Session Information */}
              {systemInfo?.session && (
                <div>
                  <h3 className="text-white font-medium mb-3 flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></span>
                    Session Information
                  </h3>
                  <div className="space-y-3">
                    {/* Current Session */}
                    {sessionData?.sessions && sessionData.sessions.length > 0 && (
                      <div className="bg-gray-900/40 p-3 rounded-md border border-blue-500/20">
                        <h4 className="text-sm text-blue-400 font-medium mb-2">Current Session</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                          <div className="bg-black/20 p-2 rounded-md">
                            <span className="text-gray-400">Session ID: </span>
                            <span className="text-gray-300 font-mono text-[10px]">{sessionData.sessions[0].id}</span>
                          </div>
                          <div className="bg-black/20 p-2 rounded-md">
                            <span className="text-gray-400">Duration: </span>
                            <span className="text-gray-300">
                              {Math.floor(sessionData.sessions[0].duration / 3600)}h {Math.floor((sessionData.sessions[0].duration % 3600) / 60)}m {sessionData.sessions[0].duration % 60}s
                            </span>
                          </div>
                          <div className="bg-black/20 p-2 rounded-md">
                            <span className="text-gray-400">Security Score: </span>
                            <span className={`font-medium ${
                              sessionData.sessions[0].securityScore >= 80 ? 'text-green-400' :
                              sessionData.sessions[0].securityScore >= 60 ? 'text-yellow-400' : 'text-red-400'
                            }`}>
                              {sessionData.sessions[0].securityScore}/100
                            </span>
                          </div>
                          <div className="bg-black/20 p-2 rounded-md">
                            <span className="text-gray-400">Risk Level: </span>
                            <span className={`font-medium capitalize ${
                              sessionData.sessions[0].riskLevel === 'low' ? 'text-green-400' :
                              sessionData.sessions[0].riskLevel === 'medium' ? 'text-yellow-400' :
                              sessionData.sessions[0].riskLevel === 'high' ? 'text-orange-400' : 'text-red-400'
                            }`}>
                              {sessionData.sessions[0].riskLevel}
                            </span>
                          </div>
                          <div className="bg-black/20 p-2 rounded-md">
                            <span className="text-gray-400">Device Type: </span>
                            <span className="text-gray-300 capitalize">{sessionData.sessions[0].deviceInfo?.type || 'Unknown'}</span>
                          </div>
                          <div className="bg-black/20 p-2 rounded-md">
                            <span className="text-gray-400">Activity Count: </span>
                            <span className="text-gray-300">{sessionData.sessions[0].activityCount}</span>
                          </div>
                          <div className="bg-black/20 p-2 rounded-md col-span-2">
                            <span className="text-gray-400">Last Activity: </span>
                            <span className="text-gray-300">{new Date(sessionData.sessions[0].lastActivity).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Session Statistics */}
                    {sessionData?.stats && (
                      <div className="bg-gray-900/40 p-3 rounded-md border border-cyan-500/20">
                        <h4 className="text-sm text-cyan-400 font-medium mb-2">Session Statistics</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                          <div className="bg-black/20 p-2 rounded-md">
                            <span className="text-gray-400">Active Sessions: </span>
                            <span className="text-cyan-300 font-medium">{sessionData.stats.activeSessions}</span>
                          </div>
                          <div className="bg-black/20 p-2 rounded-md">
                            <span className="text-gray-400">Concurrent Users: </span>
                            <span className="text-cyan-300 font-medium">{sessionData.stats.concurrentUsers}</span>
                          </div>
                          <div className="bg-black/20 p-2 rounded-md">
                            <span className="text-gray-400">Total Sessions: </span>
                            <span className="text-cyan-300 font-medium">{sessionData.stats.totalSessions}</span>
                          </div>
                          <div className="bg-black/20 p-2 rounded-md">
                            <span className="text-gray-400">Avg Duration: </span>
                            <span className="text-cyan-300 font-medium">
                              {Math.floor(sessionData.stats.averageSessionDuration / 60)}m
                            </span>
                          </div>
                        </div>

                        {/* Device Distribution */}
                        {sessionData.stats.deviceTypeDistribution && (
                          <div className="mt-3 pt-3 border-t border-gray-700">
                            <h5 className="text-xs text-cyan-300 font-medium mb-2">Device Distribution</h5>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                              {Object.entries(sessionData.stats.deviceTypeDistribution).map(([type, count]) => (
                                <div key={type} className="bg-black/20 p-2 rounded-md">
                                  <span className="text-gray-400 capitalize">{type}: </span>
                                  <span className="text-cyan-300">{String(count)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Active Sessions List */}
                    {sessionData?.sessions && sessionData.sessions.length > 0 && (
                      <div className="bg-gray-900/40 p-3 rounded-md border border-green-500/20">
                        <h4 className="text-sm text-green-400 font-medium mb-2">Active Sessions ({sessionData.sessions.length})</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {sessionData.sessions.slice(0, 5).map((session: any, index: number) => (
                            <div key={index} className="bg-black/20 p-2 rounded-md text-xs">
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="text-gray-300">{session.ip}</span>
                                  <span className="text-gray-500 ml-2">({session.deviceInfo?.type || 'unknown'})</span>
                                  {session.location && (
                                    <span className="text-gray-500 ml-2">{session.location.city}, {session.location.country}</span>
                                  )}
                                </div>
                                <div className="text-right">
                                  <div className={`text-xs font-medium ${
                                    session.riskLevel === 'low' ? 'text-green-400' :
                                    session.riskLevel === 'medium' ? 'text-yellow-400' :
                                    session.riskLevel === 'high' ? 'text-orange-400' : 'text-red-400'
                                  }`}>
                                    {session.securityScore}/100
                                  </div>
                                  <div className="text-gray-500 text-[10px]">
                                    {Math.floor(session.duration / 60)}m
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}



              {/* Website URLs */}
              <div>
                <h3 className="text-white font-medium mb-3">Website URLs</h3>
                <div className="grid grid-cols-1 gap-2 text-xs">
                  <div className="bg-black/20 p-2 rounded-md">
                    <span className="text-gray-400">Current URL: </span>
                    <span className="text-gray-300">{systemInfo?.websiteUrls?.current || window.location.href}</span>
                  </div>
                  <div className="bg-black/20 p-2 rounded-md">
                    <span className="text-gray-400">Local Development: </span>
                    <span className="text-gray-300">{systemInfo?.websiteUrls?.local}</span>
                  </div>
                  {systemInfo?.websiteUrls?.production && (
                    <div className="bg-black/20 p-2 rounded-md">
                      <span className="text-gray-400">Production URL: </span>
                      <span className="text-green-400">{systemInfo.websiteUrls.production}</span>
                    </div>
                  )}
                  {systemInfo?.websiteUrls?.preview && (
                    <div className="bg-black/20 p-2 rounded-md">
                      <span className="text-gray-400">Preview URL: </span>
                      <span className="text-blue-400">{systemInfo.websiteUrls.preview}</span>
                    </div>
                  )}
                  <div className="bg-black/20 p-2 rounded-md">
                    <span className="text-gray-400">Environment: </span>
                    <span className={`font-medium ${
                      systemInfo?.websiteUrls?.environment === 'production' 
                        ? 'text-green-400' 
                        : systemInfo?.websiteUrls?.environment === 'preview'
                          ? 'text-blue-400'
                          : 'text-yellow-400'
                    }`}>
                      {systemInfo?.websiteUrls?.environment || 'development'}
                    </span>
                    {systemInfo?.websiteUrls?.isVercel && (
                      <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-purple-500/20 text-purple-300 rounded">
                        Vercel
                      </span>
                    )}
                  </div>
                  {systemInfo?.websiteUrls?.branch && systemInfo?.websiteUrls?.branch !== 'N/A' && (
                    <div className="bg-black/20 p-2 rounded-md">
                      <span className="text-gray-400">Git Branch: </span>
                      <span className="text-purple-300">{systemInfo.websiteUrls.branch}</span>
                    </div>
                  )}
                </div>
              </div>



              {/* Database Information */}
              <div>
                <h3 className="text-white font-medium mb-3">Database Information</h3>
                
                {/* Multiple Databases (New Structure) */}
                {systemInfo?.databases && (
                  <div className="space-y-4">
                    {/* Current Primary Database */}
                    <div className="bg-black/20 p-2 rounded-md text-xs">
                      <span className="text-gray-400">Primary Database: </span>
                      <span className={`font-medium ${
                        systemInfo.databases.primary === 'neon' 
                          ? 'text-green-400' 
                          : systemInfo.databases.primary === 'mysql'
                            ? 'text-blue-400'
                            : 'text-red-400'
                      }`}>
                        {systemInfo.databases.primary === 'neon' 
                          ? 'Neon PostgreSQL' 
                          : systemInfo.databases.primary === 'mysql'
                            ? 'MySQL'
                            : 'None'}
                      </span>
                    </div>
                    
                    {/* Neon PostgreSQL Section */}
                    {systemInfo.databases.neon && (
                      <div className="bg-gray-900/40 p-3 rounded-md border border-green-500/20 mb-3">
                        <h4 className="text-sm text-green-400 font-medium mb-2">Neon PostgreSQL</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                          <div className="bg-black/20 p-2 rounded-md">
                            <span className="text-gray-400">Status: </span>
                            <span className={`font-medium ${
                              systemInfo.databases.neon.connected ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {systemInfo.databases.neon.connected ? 'Connected' : 'Disconnected'}
                            </span>
                          </div>
                          
                          {systemInfo.databases.neon.lastConnectionTime && (
                            <div className="bg-black/20 p-2 rounded-md">
                              <span className="text-gray-400">Last Connection: </span>
                              <span className="text-gray-300">{new Date(systemInfo.databases.neon.lastConnectionTime).toLocaleTimeString()}</span>
                            </div>
                          )}
                          
                          {systemInfo.databases.neon.error && (
                            <div className="bg-red-900/30 p-2 rounded-md col-span-2 border border-red-500/20">
                              <span className="text-red-300">{systemInfo.databases.neon.error}</span>
                            </div>
                          )}
                          
                          {/* Project Stats */}
                          <div className="bg-black/20 p-2 rounded-md col-span-2">
                            <span className="text-gray-400">Projects: </span>
                            <span className="text-gray-300">
                              Total: <span className="text-green-400">{systemInfo.databases.neon.projects.total}</span>
                              {systemInfo.databases.neon.projects.featured > 0 && (
                                <span className="ml-2">Featured: <span className="text-green-400">{systemInfo.databases.neon.projects.featured}</span></span>
                              )}
                              {systemInfo.databases.neon.projects.newlyAdded > 0 && (
                                <span className="ml-2">New: <span className="text-green-400">{systemInfo.databases.neon.projects.newlyAdded}</span></span>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* MySQL Section */}
                    {systemInfo.databases.mysql && (
                      <div className="bg-gray-900/40 p-3 rounded-md border border-blue-500/20">
                        <h4 className="text-sm text-blue-400 font-medium mb-2">MySQL (Legacy)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                          <div className="bg-black/20 p-2 rounded-md">
                            <span className="text-gray-400">Status: </span>
                            <span className={`font-medium ${
                              systemInfo.databases.mysql.connected ? 'text-blue-400' : 'text-red-400'
                            }`}>
                              {systemInfo.databases.mysql.connected ? 'Connected' : 'Disconnected'}
                            </span>
                          </div>
                          
                          {systemInfo.databases.mysql.lastConnectionTime && (
                            <div className="bg-black/20 p-2 rounded-md">
                              <span className="text-gray-400">Last Connection: </span>
                              <span className="text-gray-300">{new Date(systemInfo.databases.mysql.lastConnectionTime).toLocaleTimeString()}</span>
                            </div>
                          )}
                          
                          {systemInfo.databases.mysql.error && (
                            <div className="bg-red-900/30 p-2 rounded-md col-span-2 border border-red-500/20">
                              <span className="text-red-300">{systemInfo.databases.mysql.error}</span>
                            </div>
                          )}
                          
                          {/* Project Stats */}
                          <div className="bg-black/20 p-2 rounded-md col-span-2">
                            <span className="text-gray-400">Projects: </span>
                            <span className="text-gray-300">
                              Total: <span className="text-blue-400">{systemInfo.databases.mysql.projects.total}</span>
                              {systemInfo.databases.mysql.projects.featured > 0 && (
                                <span className="ml-2">Featured: <span className="text-blue-400">{systemInfo.databases.mysql.projects.featured}</span></span>
                              )}
                              {systemInfo.databases.mysql.projects.newlyAdded > 0 && (
                                <span className="ml-2">New: <span className="text-blue-400">{systemInfo.databases.mysql.projects.newlyAdded}</span></span>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Original Database Info (Fallback for Backward Compatibility) */}
                {!systemInfo?.databases && systemInfo?.database && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    <div className="bg-black/20 p-2 rounded-md">
                      <span className="text-gray-400">Type: </span>
                      <span className={`font-medium ${systemInfo.database.isConnected ? 'text-green-400' : 'text-yellow-400'}`}>
                        {systemInfo.database.type || 'MySQL'}
                      </span>
                    </div>
                    <div className="bg-black/20 p-2 rounded-md">
                      <span className="text-gray-400">Connection: </span>
                      <span className={`font-medium ${
                        systemInfo.database.connectivity === 'connected' 
                        ? 'text-green-400' 
                        : 'text-red-400'
                      }`}>
                        {systemInfo.database.connectivity === 'connected' ? 'Connected' : 'Disconnected'}
                        <button
                          onClick={() => fetchSystemInfo()}
                          className="ml-2 text-xs text-purple-400 hover:text-purple-300"
                          title="Retry connection"
                        >
                          (retry)
                        </button>
                      </span>
                    </div>
                    
                    {systemInfo.database.connectionError && (
                      <div className="bg-red-900/30 p-2 rounded-md col-span-2 border border-red-500/20">
                        <span className="text-gray-400">Connection Error: </span>
                        <span className="text-red-300">{systemInfo.database.connectionError}</span>
                      </div>
                    )}
                    
                    <div className="bg-black/20 p-2 rounded-md col-span-1">
                      <span className="text-gray-400">Host: </span>
                      <span className="text-gray-300">{systemInfo?.database?.host || 'railway.app'}</span>
                    </div>
                    <div className="bg-black/20 p-2 rounded-md col-span-1">
                      <span className="text-gray-400">Port: </span>
                      <span className="text-gray-300">{systemInfo?.database?.port || '28228'}</span>
                    </div>
                    <div className="bg-black/20 p-2 rounded-md">
                      <span className="text-gray-400">Database: </span>
                      <span className="text-gray-300">{systemInfo?.database?.database || 'railway'}</span>
                    </div>
                    <div className="bg-black/20 p-2 rounded-md">
                      <span className="text-gray-400">User: </span>
                      <span className="text-gray-300">{systemInfo?.database?.user || 'root'}</span>
                    </div>
                  </div>
                )}


              </div>

              {/* Enhanced Server Performance Metrics */}
              {systemInfo?.performance && (
                <div>
                  <h3 className="text-white font-medium mb-3">Server Performance</h3>
                  <div className="space-y-3">
                    <div className="bg-gray-900/40 p-3 rounded-md border border-indigo-500/20">
                      <h4 className="text-sm text-indigo-400 font-medium mb-2">System Resources</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                        {systemInfo.performance.memoryUsage && (
                          <>
                            <div className="bg-black/20 p-2 rounded-md">
                              <span className="text-gray-400">System Memory: </span>
                              <div className="mt-1">
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                  <div
                                    className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${systemInfo.performance.memoryUsage.system?.percentage || 0}%` }}
                                  />
                                </div>
                                <div className="mt-1 text-gray-300">
                                  {systemInfo.performance.memoryUsage.system?.used || 0}MB / {systemInfo.performance.memoryUsage.system?.total || 0}MB
                                </div>
                              </div>
                            </div>
                            <div className="bg-black/20 p-2 rounded-md">
                              <span className="text-gray-400">Process Memory: </span>
                              <div className="mt-1 text-gray-300">
                                RSS: {Math.round((systemInfo.performance.memoryUsage.process?.rss || 0) / (1024 * 1024))}MB<br/>
                                Heap: {Math.round((systemInfo.performance.memoryUsage.process?.heapUsed || 0) / (1024 * 1024))}MB
                              </div>
                            </div>
                          </>
                        )}

                        {systemInfo.performance.cpu && (
                          <>
                            <div className="bg-black/20 p-2 rounded-md">
                              <span className="text-gray-400">CPU Cores: </span>
                              <span className="text-gray-300">{systemInfo.performance.cpu.count}</span>
                            </div>
                            <div className="bg-black/20 p-2 rounded-md">
                              <span className="text-gray-400">Load Average: </span>
                              <span className="text-gray-300">
                                {systemInfo.performance.cpu.loadAverage?.map((load: number) => load.toFixed(2)).join(', ') || 'N/A'}
                              </span>
                            </div>
                          </>
                        )}

                        <div className="bg-black/20 p-2 rounded-md">
                          <span className="text-gray-400">API Response: </span>
                          <span className={`font-medium ${
                            systemInfo.performance.apiResponseTime < 100 ? 'text-green-400' :
                            systemInfo.performance.apiResponseTime < 500 ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {systemInfo.performance.apiResponseTime}ms
                          </span>
                        </div>

                        <div className="bg-black/20 p-2 rounded-md">
                          <span className="text-gray-400">Server Uptime: </span>
                          <span className="text-gray-300">
                            {Math.floor(systemInfo.performance.serverUptime / 3600)}h {Math.floor((systemInfo.performance.serverUptime % 3600) / 60)}m
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Session Information */}
              {systemInfo?.session && (
                <div>
                  <h3 className="text-white font-medium mb-3">Session Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    <div className="bg-black/20 p-2 rounded-md">
                      <span className="text-gray-400">Session Start: </span>
                      <span className="text-gray-300">{new Date(systemInfo.session.startTime).toLocaleString()}</span>
                    </div>
                    <div className="bg-black/20 p-2 rounded-md">
                      <span className="text-gray-400">Duration: </span>
                      <span className="text-gray-300">
                        {Math.floor(systemInfo.session.duration / 3600)}h {Math.floor((systemInfo.session.duration % 3600) / 60)}m
                      </span>
                    </div>
                    <div className="bg-black/20 p-2 rounded-md">
                      <span className="text-gray-400">Requests: </span>
                      <span className="text-gray-300">{systemInfo.session.requestCount}</span>
                    </div>
                    <div className="bg-black/20 p-2 rounded-md">
                      <span className="text-gray-400">Response Time: </span>
                      <span className={`font-medium ${
                        (systemInfo.responseTime || 0) < 100 ? 'text-green-400' :
                        (systemInfo.responseTime || 0) < 500 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {systemInfo.responseTime || 0}ms
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Security Statistics */}
              {systemInfo?.security && (
                <div>
                  <h3 className="text-white font-medium mb-3 flex items-center">
                    <span className="w-2 h-2 bg-red-400 rounded-full mr-2 animate-pulse"></span>
                    Real-time Security Monitor
                  </h3>
                  <div className="space-y-3">
                    {/* Live Security Statistics */}
                    <div className="bg-gray-900/40 p-3 rounded-md border border-red-500/20">
                      <h4 className="text-sm text-red-400 font-medium mb-2">Live Security Statistics</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                        <div className="bg-black/20 p-2 rounded-md">
                          <span className="text-gray-400">Failed Password Attempts: </span>
                          <span className="text-red-300 font-medium">{systemInfo.security.stats.failedPasswordAttempts}</span>
                        </div>
                        <div className="bg-black/20 p-2 rounded-md">
                          <span className="text-gray-400">Login Frequency: </span>
                          <span className="text-yellow-300 font-medium">
                            {systemInfo.security.stats.loginAttemptFrequency.perMinute}/min
                          </span>
                        </div>
                        <div className="bg-black/20 p-2 rounded-md">
                          <span className="text-gray-400">Brute Force Status: </span>
                          <span className={`font-medium ${
                            systemInfo.security.stats.bruteForceDetected ? 'text-red-400' : 'text-green-400'
                          }`}>
                            {systemInfo.security.stats.bruteForceDetected ? 'DETECTED' : 'Clear'}
                          </span>
                        </div>
                        <div className="bg-black/20 p-2 rounded-md">
                          <span className="text-gray-400">Suspicious IPs: </span>
                          <span className={`font-medium ${
                            systemInfo.security.stats.suspiciousIPs === 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {systemInfo.security.stats.suspiciousIPs}
                          </span>
                        </div>
                        <div className="bg-black/20 p-2 rounded-md">
                          <span className="text-gray-400">Password Violations: </span>
                          <span className="text-orange-300 font-medium">{systemInfo.security.stats.passwordViolations}</span>
                        </div>
                        <div className="bg-black/20 p-2 rounded-md">
                          <span className="text-gray-400">Account Lockouts: </span>
                          <span className={`font-medium ${
                            systemInfo.security.stats.accountLockouts.count === 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {systemInfo.security.stats.accountLockouts.count}
                            {systemInfo.security.stats.accountLockouts.remainingTime > 0 && (
                              <span className="text-gray-400 ml-1">({systemInfo.security.stats.accountLockouts.remainingTime}s)</span>
                            )}
                          </span>
                        </div>
                        <div className="bg-black/20 p-2 rounded-md">
                          <span className="text-gray-400">Blocked Devices: </span>
                          <span className="text-red-300 font-medium">{systemInfo.security.stats.blockedDevices}</span>
                        </div>
                        <div className="bg-black/20 p-2 rounded-md">
                          <span className="text-gray-400">Total Events: </span>
                          <span className="text-gray-300 font-medium">{systemInfo.security.stats.totalSecurityEvents}</span>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Security Events with Device Tracking */}
                    {systemInfo.security.recentEvents && systemInfo.security.recentEvents.length > 0 && (
                      <div className="bg-gray-900/40 p-3 rounded-md border border-orange-500/20">
                        <h4 className="text-sm text-orange-400 font-medium mb-2">Recent Security Events with Device Tracking</h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {systemInfo.security.recentEvents.slice(0, 8).map((event: any, index: number) => (
                            <div key={index} className="bg-black/20 p-3 rounded-md text-xs border border-gray-700/50">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2">
                                    <span className={`font-medium ${
                                      event.severity === 'critical' ? 'text-red-400' :
                                      event.severity === 'high' ? 'text-orange-400' :
                                      event.severity === 'medium' ? 'text-yellow-400' : 'text-green-400'
                                    }`}>
                                      {event.type.replace('_', ' ').toUpperCase()}
                                    </span>
                                    {event.blocked && (
                                      <span className="px-1 py-0.5 bg-red-500/20 text-red-300 rounded text-[10px]">
                                        BLOCKED
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-gray-400 mt-1">
                                    IP: {event.ip} | Device: {event.deviceFingerprint?.deviceType || 'Unknown'}
                                    ({event.deviceFingerprint?.browserName || 'Unknown'})
                                  </div>
                                  {event.location && (
                                    <div className="text-gray-500 mt-1">
                                      📍 {event.location.city}, {event.location.country}
                                    </div>
                                  )}
                                  {event.details?.reason && (
                                    <div className="text-gray-300 mt-1">{event.details.reason}</div>
                                  )}
                                </div>
                                <div className="text-right">
                                  <div className="text-gray-500 text-[10px] mb-2">
                                    {new Date(event.timestamp).toLocaleTimeString()}
                                  </div>
                                  <div className="space-x-1">
                                    {!systemInfo.security.blockedIPs?.includes(event.ip) && (
                                      <button
                                        onClick={() => handleSecurityAction('block_ip', event.ip)}
                                        className="px-2 py-1 bg-red-600/20 text-red-300 rounded text-[10px] hover:bg-red-600/30 transition-colors"
                                      >
                                        Block IP
                                      </button>
                                    )}
                                    {!systemInfo.security.blockedDevices?.includes(event.deviceFingerprint?.id) && (
                                      <button
                                        onClick={() => handleSecurityAction('block_device', event.deviceFingerprint?.id)}
                                        className="px-2 py-1 bg-orange-600/20 text-orange-300 rounded text-[10px] hover:bg-orange-600/30 transition-colors"
                                      >
                                        Block Device
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Real-time Security Alerts */}
                    {systemInfo.security.alerts && systemInfo.security.alerts.length > 0 && (
                      <div className="bg-gray-900/40 p-3 rounded-md border border-red-500/20">
                        <h4 className="text-sm text-red-400 font-medium mb-2">Live Security Alerts</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {systemInfo.security.alerts.map((alert: any, index: number) => (
                            <div key={index} className={`p-3 rounded-md text-xs border ${
                              alert.acknowledged ? 'bg-gray-800/40 border-gray-600/20' : 'bg-red-900/20 border-red-500/20'
                            }`}>
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2">
                                    <span className={`font-medium ${
                                      alert.acknowledged ? 'text-gray-400' :
                                      alert.severity === 'critical' ? 'text-red-400' :
                                      alert.severity === 'high' ? 'text-orange-400' :
                                      alert.severity === 'medium' ? 'text-yellow-400' : 'text-green-400'
                                    }`}>
                                      {alert.title}
                                    </span>
                                    {!alert.acknowledged && (
                                      <span className="px-1 py-0.5 bg-red-500/20 text-red-300 rounded text-[10px] animate-pulse">
                                        LIVE
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-gray-300 mt-1">{alert.message}</div>
                                  {alert.autoResponse && (
                                    <div className="text-green-300 mt-1 text-[10px]">
                                      Auto-response: {alert.autoResponse}
                                    </div>
                                  )}
                                </div>
                                <div className="text-right">
                                  <div className="text-gray-500 text-[10px] mb-2">
                                    {new Date(alert.timestamp).toLocaleTimeString()}
                                  </div>
                                  {!alert.acknowledged && (
                                    <button
                                      onClick={() => handleSecurityAction('acknowledge_alert', undefined, alert.id)}
                                      className="px-2 py-1 bg-green-600/20 text-green-300 rounded text-[10px] hover:bg-green-600/30 transition-colors"
                                    >
                                      Acknowledge
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Blocked IPs and Devices */}
                    {(systemInfo.security.blockedIPs?.length > 0 || systemInfo.security.blockedDevices?.length > 0) && (
                      <div className="bg-gray-900/40 p-3 rounded-md border border-purple-500/20">
                        <h4 className="text-sm text-purple-400 font-medium mb-2">Blocked Access</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {systemInfo.security.blockedIPs?.length > 0 && (
                            <div>
                              <h5 className="text-xs text-purple-300 font-medium mb-2">Blocked IPs ({systemInfo.security.blockedIPs.length})</h5>
                              <div className="space-y-1 max-h-24 overflow-y-auto">
                                {systemInfo.security.blockedIPs.slice(0, 5).map((ip: string, index: number) => (
                                  <div key={index} className="flex justify-between items-center bg-black/20 p-2 rounded text-[10px]">
                                    <span className="text-gray-300 font-mono">{ip}</span>
                                    <button
                                      onClick={() => handleSecurityAction('unblock_ip', ip)}
                                      className="px-1 py-0.5 bg-green-600/20 text-green-300 rounded hover:bg-green-600/30 transition-colors"
                                    >
                                      Unblock
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {systemInfo.security.blockedDevices?.length > 0 && (
                            <div>
                              <h5 className="text-xs text-purple-300 font-medium mb-2">Blocked Devices ({systemInfo.security.blockedDevices.length})</h5>
                              <div className="space-y-1 max-h-24 overflow-y-auto">
                                {systemInfo.security.blockedDevices.slice(0, 5).map((deviceId: string, index: number) => (
                                  <div key={index} className="flex justify-between items-center bg-black/20 p-2 rounded text-[10px]">
                                    <span className="text-gray-300 font-mono">{deviceId.substring(0, 12)}...</span>
                                    <button
                                      onClick={() => handleSecurityAction('unblock_device', deviceId)}
                                      className="px-1 py-0.5 bg-green-600/20 text-green-300 rounded hover:bg-green-600/30 transition-colors"
                                    >
                                      Unblock
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Performance Metrics */}
              <div>
                <h3 className="text-white font-medium mb-3">Performance Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  {/* Memory Usage */}
                  <div className="bg-black/20 p-2 rounded-md">
                    <span className="text-gray-400">Memory Usage: </span>
                    <div className="mt-1">
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${systemInfo?.performanceMetrics?.memory?.percentage || 0}%` }}
                        />
                      </div>
                      <div className="mt-1 text-gray-300">
                        {systemInfo?.performanceMetrics?.memory?.used || 0}MB / {systemInfo?.performanceMetrics?.memory?.total || 0}MB
                        <span className="text-purple-400 ml-1">
                          ({systemInfo?.performanceMetrics?.memory?.percentage || 0}%)
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* CPU Info */}
                  <div className="bg-black/20 p-2 rounded-md">
                    <span className="text-gray-400">CPU Info: </span>
                    <div className="mt-1 space-y-1">
                      <div className="text-gray-300">
                        Cores: {systemInfo?.performanceMetrics?.cpu?.cores || 'N/A'}
                      </div>
                      <div className="text-gray-300">
                        Load Avg: {systemInfo?.performanceMetrics?.cpu?.loadAverage?.map(load => load.toFixed(2)).join(', ') || 'N/A'}
                      </div>
                    </div>
                  </div>
                  {/* Uptime */}
                  <div className="bg-black/20 p-2 rounded-md">
                    <span className="text-gray-400">Uptime: </span>
                    <span className="text-gray-300">{systemInfo?.performanceMetrics?.uptime?.formatted || 'N/A'}</span>
                  </div>
                  <div className="bg-black/20 p-2 rounded-md">
                    <span className="text-gray-400">API Response: </span>
                    <span className="text-gray-300">{systemInfo?.apiResponseTime || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Project Statistics */}
              <div>
                <h3 className="text-white font-medium mb-3">Project Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <div className="bg-black/20 p-2 rounded-md">
                    <span className="text-gray-400">Total Projects: </span>
                    <span className="text-purple-300 font-medium">{projects.length}</span>
                  </div>
                  <div className="bg-black/20 p-2 rounded-md">
                    <span className="text-gray-400">Featured Projects: </span>
                    <span className="text-purple-300 font-medium">{projects.filter(p => p.featured).length}</span>
                  </div>
                  <div className="bg-black/20 p-2 rounded-md">
                    <span className="text-gray-400">In Development: </span>
                    <span className="text-purple-300 font-medium">{projects.filter(p => p.status === 'In Development').length}</span>
                  </div>
                  <div className="bg-black/20 p-2 rounded-md">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Update Interval: </span>
                      <select 
                        value={updateInterval}
                        onChange={(e) => setUpdateInterval(Number(e.target.value))}
                        className="bg-transparent text-purple-300 border-none outline-none"
                      >
                        <option value={10000}>10s</option>
                        <option value={30000}>30s</option>
                        <option value={60000}>1m</option>
                        <option value={300000}>5m</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="bg-black/20 p-2 rounded-md col-span-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Auto-reconnect Database: </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={autoReconnect}
                          onChange={() => setAutoReconnect(!autoReconnect)}
                        />
                        <div className={`w-9 h-5 ${autoReconnect ? 'bg-purple-600/50' : 'bg-gray-700'} rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all`}></div>
                        <span className="ml-2 text-xs font-medium text-gray-300">
                          {autoReconnect ? 'Enabled' : 'Disabled'}
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="bg-black/20 p-2 rounded-md col-span-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Enhanced API: </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={useEnhancedAPI}
                          onChange={() => setUseEnhancedAPI(!useEnhancedAPI)}
                        />
                        <div className={`w-9 h-5 ${useEnhancedAPI ? 'bg-green-600/50' : 'bg-gray-700'} rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all`}></div>
                        <span className="ml-2 text-xs font-medium text-gray-300">
                          {useEnhancedAPI ? 'Enabled' : 'Disabled'}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <button
                  onClick={copyDebugInfo}
                  className="px-3 py-1.5 bg-purple-600/30 text-purple-300 text-xs rounded hover:bg-purple-600/40 transition-colors"
                >
                  Copy Debug Info
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-400">
              <p>No system information available. Try refreshing or checking your connection.</p>
              <button 
                onClick={fetchSystemInfo}
                className="mt-2 px-3 py-1.5 bg-purple-600/30 text-purple-300 text-xs rounded hover:bg-purple-600/40 transition-colors"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 
